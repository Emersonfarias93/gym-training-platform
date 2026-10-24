import assert from "node:assert/strict";

const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3001";
const response = await fetch(`${base}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "demo@fitai.com", password: "fitai1234" })
});
assert.equal(response.status, 401, "Production accepted the public demo credentials");

const forgedSession = await fetch(`${base}/api/auth/session`, {
  headers: { Cookie: "fitai_access_token=fitai-mock-session-token" }
});
assert.equal((await forgedSession.json()).authenticated, false, "Production accepted the static demo token");

const checkout = await fetch(`${base}/api/payment/activate-mock`, { method: "POST" });
assert.equal(checkout.status, 404, "Mock premium activation is exposed in production");

const invalidLogin = await fetch(`${base}/api/auth/login`, {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: 42 })
});
assert.equal(invalidLogin.status, 400, "Malformed login payload was not validated");
console.log("Production security checks passed (demo login, forged session, mock checkout, input validation).");
