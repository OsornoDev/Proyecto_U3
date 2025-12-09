import express from "express";

const app = express();
app.use(express.json());

app.post("/validate", (req, res) => {
  const { transactionId, amount, currency } = req.body || {};
  if (!transactionId || typeof amount !== "number" || !currency) {
    return res.status(400).json({ ok: false, error: "invalid_payload" });
  }
  if (amount <= 0) {
    return res.status(422).json({ ok: false, error: "invalid_amount" });
  }
  return res.status(200).json({ ok: true, transactionId });
});

app.get("/health", (_, res) => {
  res.status(200).send("ok");
});

app.get("/ready", (_, res) => {
  res.status(200).send("ready");
});

export default app;
