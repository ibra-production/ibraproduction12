import assert from "node:assert/strict";
import test from "node:test";
import { isAdminPath } from "../src/routing";

test("direct and nested admin paths resolve to the admin app", () => {
  assert.equal(isAdminPath(new URL("https://ibraprod.online/admin")), true);
  assert.equal(isAdminPath(new URL("https://ibraprod.online/admin/")), true);
  assert.equal(isAdminPath(new URL("https://ibraprod.online/admin/bookings")), true);
});

test("legacy admin query entry remains supported", () => {
  assert.equal(isAdminPath(new URL("https://ibraprod.online/?admin=1")), true);
  assert.equal(isAdminPath(new URL("https://ibraprod.online/?admin=0")), false);
});

test("public paths that only resemble admin stay on the website", () => {
  assert.equal(isAdminPath(new URL("https://ibraprod.online/")), false);
  assert.equal(isAdminPath(new URL("https://ibraprod.online/administrator")), false);
  assert.equal(isAdminPath(new URL("https://ibraprod.online/admin-tools")), false);
});
