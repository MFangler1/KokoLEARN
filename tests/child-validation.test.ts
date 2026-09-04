import test from "node:test";
import assert from "node:assert/strict";
import { getKeyStage, getObjectivesForAge } from "../lib/curriculum/data";
import { parseChildAge, parseChildName, parseInterests, parseSubject } from "../lib/validation/child";

test("accepts only whole-number child ages from 5 through 14", () => {
  assert.equal(parseChildAge(5), 5);
  assert.equal(parseChildAge("14"), 14);
  assert.equal(parseChildAge(4), null);
  assert.equal(parseChildAge(15), null);
  assert.equal(parseChildAge(8.5), null);
});

test("normalises names and rejects oversized or empty values", () => {
  assert.equal(parseChildName("  Alex   Smith "), "Alex Smith");
  assert.equal(parseChildName(" "), null);
  assert.equal(parseChildName("x".repeat(51)), null);
});

test("allows only supported subjects and predefined interests", () => {
  assert.equal(parseSubject("Maths"), "Maths");
  assert.equal(parseSubject("Astrology"), null);
  assert.deepEqual(parseInterests(["Space", "Reading", "Space"]), ["Space", "Reading"]);
  assert.equal(parseInterests(["My school is Example Academy"]), null);
});

test("maps ages to the correct non-overlapping key stage", () => {
  assert.equal(getKeyStage(5), "KS1");
  assert.equal(getKeyStage(8), "KS2");
  assert.equal(getKeyStage(14), "KS3");
  assert.throws(() => getKeyStage(15), RangeError);
  assert.ok(getObjectivesForAge(7).every((objective) => objective.keyStage === "KS1"));
  assert.ok(getObjectivesForAge(14).some((objective) => objective.keyStage === "KS3"));
});
