# KokoLearn picture library

Static, kid-safe artwork for image questions. Nothing is used by the site unless
its manifest entry has `"approved": true` (Mark approves batches).

## Folder layout

    public/images/library/<subject>/<topic>.jpg

- `<subject>`: lowercase subject slug - `maths`, `english`, `science`, `geography`,
  `history`, `art`, `computing`, `ai`
- `<topic>`: kebab-case topic slug, e.g. `dinosaurs.jpg`, `space-rockets.jpg`
- Format: JPEG, quality ~80, max 1200px wide, target under 200KB each
- Keep art child-friendly: no scary imagery, no text baked into the image,
  no real people, no brands

## Manifest (`manifest.json`)

    {
      "version": 1,
      "basePath": "/images/library",
      "updatedAt": "YYYY-MM-DD",
      "entries": [
        {
          "key": "science/dinosaurs",
          "subject": "Science",
          "keyStages": ["KS1", "KS2"],
          "topics": ["Dinosaurs", "Animals"],
          "file": "science/dinosaurs.jpg",
          "alt": "Friendly cartoon dinosaurs in a grassy valley",
          "approved": false,
          "credit": "KokoLearn"
        }
      ]
    }

Field notes:
- `key`: unique id (`<subject>/<topic>`)
- `subject`: must match the lesson subject exactly (Maths, English, Science,
  Geography, History, Art, Computing, AI)
- `topics`: keywords matched against the child's chosen interests (case-insensitive)
- `file`: path relative to `basePath`
- `alt`: required, plain-English description (also read aloud with the question)
- `approved`: `false` until reviewed; only approved entries are used
- `keyStages`: which stages may see it

## Housekeeping
- If the library grows large (say 300+ images / 100MB+), move serving to
  Cloudflare R2 and keep only the manifest in the repo - flagging as the next
  step rather than bloating the repo.
