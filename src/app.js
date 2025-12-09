const express = require('express');
const pino = require('pino');
const pinoHttp = require('pino-http');

const app = express();
app.use(express.json());

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
app.use(
  pinoHttp({
    logger,
    customLogLevel: function (res, err) {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    }
  })
);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/validate', async (req, res) => {
  try {
    const { amount, currency, accountId } = req.body || {};
    if (!amount || !currency || !accountId) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    await new Promise((r) => setTimeout(r, Math.random() * 80));

    const accepted = amount > 0 && ['MXN', 'USD'].includes(currency);
    const statusCode = accepted ? 200 : 422;
    res.status(statusCode).json({ accepted });
  } catch (err) {
    req.log.error({ err }, 'Unhandled error in /validate');
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = app;