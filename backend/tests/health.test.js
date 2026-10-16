const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

// Supertest drives the Express app in-process: no port binding, no MongoDB
describe('GET /api/v1/health', () => {
  it('responds 200 with a healthy status and a valid timestamp', async () => {
    const res = await request(app).get('/api/v1/health');

    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /application\/json/);
    assert.equal(res.body.status, 'healthy');
    assert.ok(res.body.timestamp, 'timestamp should be present');
    assert.ok(
      !Number.isNaN(Date.parse(res.body.timestamp)),
      `timestamp should be a valid date, got: ${res.body.timestamp}`
    );
  });
});
