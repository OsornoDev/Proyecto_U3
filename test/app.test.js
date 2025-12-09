import test from "node:test";
import assert from "node:assert";
import app from "../src/app.js";

test("health endpoint", async () => {
  const server = app.listen(0);
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, "ok");
  } finally {
    server.close();
  }
});

test("validate endpoint success", async () => {
  const server = app.listen(0);
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}/validate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ transactionId: "tx-1", amount: 100, currency: "MXN" })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.ok, true);
    assert.strictEqual(json.transactionId, "tx-1");
  } finally {
    server.close();
  }
});

test("validate endpoint invalid payload", async () => {
  const server = app.listen(0);
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}/validate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({})
    });
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.ok, false);
    assert.strictEqual(json.error, "invalid_payload");
  } finally {
    server.close();
  }
});

test("validate endpoint invalid amount", async () => {
  const server = app.listen(0);
  const { port } = server.address();
  try {
    const res = await fetch(`http://127.0.0.1:${port}/validate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ transactionId: "tx-2", amount: 0, currency: "MXN" })
    });
    assert.strictEqual(res.status, 422);
    const json = await res.json();
    assert.strictEqual(json.ok, false);
    assert.strictEqual(json.error, "invalid_amount");
  } finally {
    server.close();
  }
});
