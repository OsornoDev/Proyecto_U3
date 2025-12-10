const express = require('express');
const pino = require('pino');
const pinoHttp = require('pino-http');
const client = require('prom-client');

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

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
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
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 2]
});
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);

app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const dur = Number(process.hrtime.bigint() - start) / 1e9;
    const route = req.route && req.route.path ? req.route.path : req.path;
    const labels = { method: req.method, route, status_code: String(res.statusCode) };
    httpRequestDuration.observe(labels, dur);
    httpRequestsTotal.inc(labels);
  });
  next();
});
