#!/usr/bin/env python3
"""Generate 10 picture-based questions for each approved image in the KokoLearn library.

Writes lib/library/questions.json (server-side only - never served publicly).
Usage: python3 scripts/generate-library-questions.py
"""
import json, os, re, sys, time, unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib import request, error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "public/images/library/manifest.json")
OUT = os.path.join(ROOT, "lib/library/questions.json")
PER_IMAGE = 10
WORKERS = 5
MODEL = "deepseek-chat"

EMOJI = re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF\uFE0F\u2B00-\u2BFF]")


def load_key():
    key = os.environ.get("DEEPSEEK_API_KEY")
    if key:
        return key.strip()
    envfile = os.path.expanduser("~/.openclaw/.env")
    with open(envfile) as fh:
        for line in fh:
            line = line.strip()
            if line.startswith("DEEPSEEK_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("DEEPSEEK_API_KEY not found")


def build_prompt(entry):
    topics = ", ".join(entry.get("topics") or [])
    return f"""You are an expert UK primary school teacher writing picture questions for children aged 7-11 (KS2).

THE PICTURE: {entry['alt']}
SUBJECT: {entry['subject']}
TOPICS: {topics}

Write exactly {PER_IMAGE} DIFFERENT multiple-choice questions about this picture for subject {entry['subject']}.
Rules:
- Every question must be answerable by LOOKING AT THE PICTURE plus general KS2 knowledge. Reference what is in the picture.
- Each question needs exactly 4 options, only ONE correct.
- Options must be plausible and similar in length. No "all of the above" or "none of the above".
- Vary where the correct answer sits: roughly a quarter should be option A, a quarter B, a quarter C, a quarter D.
- Explanations: one short sentence, child-friendly.
- Difficulty mix: 4 "normal", 4 "medium", 2 "advanced".
- British English spelling, UK curriculum. Ages 7-11. Warm, encouraging tone.
- NEVER use em dashes. Use commas, brackets or "and" instead.
- No emoji, no icons.
- Questions must all be different from each other and must not simply repeat the same idea.

Return JSON only, exactly this shape:
{{"questions":[{{"question":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"...","difficulty":"normal"}}]}}"""


def call_api(key, prompt):
    body = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are an expert UK primary school teacher. Always respond with valid JSON only."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.9,
        "max_tokens": 4000,
        "response_format": {"type": "json_object"},
    }).encode()
    req = request.Request(
        "https://api.deepseek.com/v1/chat/completions",
        data=body,
        headers={"Content-Type": "application/json", "Authorization": "Bearer " + key},
        method="POST",
    )
    with request.urlopen(req, timeout=180) as resp:
        data = json.loads(resp.read().decode())
    return data["choices"][0]["message"]["content"]


def clean(text):
    text = unicodedata.normalize("NFKC", str(text))
    text = text.replace("\u2014", ", ").replace("\u2013", "-")
    text = EMOJI.sub("", text)
    return re.sub(r"\s+", " ", text).strip()


def validate(payload, key_norm):
    qs = payload.get("questions")
    if not isinstance(qs, list) or len(qs) != PER_IMAGE:
        return None, "expected %d questions" % PER_IMAGE
    out, seen = [], set()
    for q in qs:
        if not isinstance(q, dict):
            return None, "question not an object"
        question = clean(q.get("question", ""))
        options = q.get("options")
        explanation = clean(q.get("explanation", ""))
        difficulty = q.get("difficulty", "normal")
        idx = q.get("correctIndex")
        if not (8 <= len(question) <= 170):
            return None, "bad question length: %s" % question[:40]
        if not isinstance(options, list) or len(options) != 4:
            return None, "expected 4 options"
        options = [clean(o) for o in options]
        if any(not (1 <= len(o) <= 70) for o in options):
            return None, "bad option length"
        if len(set(options)) != 4:
            return None, "duplicate options"
        if not isinstance(idx, int) or idx < 0 or idx > 3:
            return None, "bad correctIndex"
        if not (5 <= len(explanation) <= 240):
            return None, "bad explanation length"
        if difficulty not in ("normal", "medium", "advanced"):
            difficulty = "normal"
        n = re.sub(r"[^a-z0-9 ]", " ", question.lower())
        n = re.sub(r"\s+", " ", n).strip()
        if n in seen or n in key_norm:
            return None, "duplicate question text"
        seen.add(n)
        out.append({
            "question": question,
            "options": options,
            "correctIndex": idx,
            "explanation": explanation,
            "difficulty": difficulty,
        })
    return out, None


def main():
    key = load_key()
    manifest = json.load(open(MANIFEST))
    entries = [e for e in manifest["entries"] if e.get("approved")]
    print("generating for %d images (%d each)" % (len(entries), PER_IMAGE), flush=True)

    existing = {}
    if os.path.exists(OUT):
        try:
            existing = json.load(open(OUT)).get("questions", {})
        except Exception:
            existing = {}
    # re-use any image that already has a full validated set
    todo = [e for e in entries if len(existing.get(e["key"], [])) != PER_IMAGE]
    print("already done: %d, to generate: %d" % (len(entries) - len(todo), len(todo)), flush=True)

    results = dict(existing)
    global_norm = set()
    for qs in results.values():
        for q in qs:
            global_norm.add(re.sub(r"[^a-z0-9 ]", " ", q["question"].lower()))
    lock_norm = set(global_norm)

    def work(entry):
        last = "unknown"
        for attempt in range(3):
            try:
                raw = call_api(key, build_prompt(entry))
                payload = json.loads(raw)
            except Exception as exc:
                last = "api: %s" % exc
                time.sleep(2 + attempt * 3)
                continue
            qs, err = validate(payload, lock_norm)
            if qs:
                return entry["key"], qs, None
            last = err
            time.sleep(1)
        return entry["key"], None, last

    done = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(work, e): e for e in todo}
        for fut in as_completed(futures):
            k, qs, err = fut.result()
            done += 1
            if qs:
                results[k] = qs
                for q in qs:
                    lock_norm.add(re.sub(r"[^a-z0-9 ]", " ", q["question"].lower()))
                print("[%d/%d] OK   %s" % (done, len(todo), k), flush=True)
            else:
                print("[%d/%d] FAIL %s (%s)" % (done, len(todo), k, err), flush=True)

    ordered = {e["key"]: results[e["key"]] for e in entries if e["key"] in results}
    total = sum(len(v) for v in ordered.values())
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as fh:
        json.dump({"version": 1, "perImage": PER_IMAGE, "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "questions": ordered}, fh, indent=1)
    print("WROTE %s : %d images, %d questions" % (OUT, len(ordered), total), flush=True)


if __name__ == "__main__":
    main()
