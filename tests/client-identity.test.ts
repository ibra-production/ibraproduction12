import assert from "node:assert/strict";
import { test } from "node:test";
import { webcrypto } from "node:crypto";
import { normalizePhone, phonesMatch, stableClientCode } from "../src/utils/clientIdentity";

Object.defineProperty(globalThis, "crypto", { value: webcrypto });

test("phone normalization matches formatting variants without matching blank phones", () => {
  assert.equal(normalizePhone("+213 (555) 12-34-56"), "213555123456");
  assert.equal(normalizePhone("0555 12 34 56"), "213555123456");
  assert.equal(phonesMatch("+213 (555) 12-34-56", "213555123456"), true);
  assert.equal(phonesMatch("0555 12 34 56", "+213555123456"), true);
  assert.equal(phonesMatch("", ""), false);
});

test("stable website client codes match Android's normalized-phone identity", async () => {
  assert.equal(
    await stableClientCode("+213 (555) 12-34-56"),
    await stableClientCode("213555123456")
  );
  await assert.rejects(stableClientCode("no digits"));
});
