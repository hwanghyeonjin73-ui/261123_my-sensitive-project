import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ERROR_DEFINITIONS } from '../lib/errors.js';

// 테스트 중 실제 OpenAI 호출이 일어나지 않도록 키를 지웁니다.
delete process.env.OPENAI_API_KEY;
const { default: handler } = await import('../api/classify.js');

const ENDPOINT = 'http://localhost/api/classify';
const post = (body, contentType = 'application/json') =>
  handler.fetch(
    new Request(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': contentType },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );

test('H-01 GET 요청은 405', async () => {
  const response = await handler.fetch(new Request(ENDPOINT, { method: 'GET' }));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST');
  const payload = await response.json();
  assert.equal(payload.error.code, 'METHOD_NOT_ALLOWED');
});

test('H-02 빈 본문은 400 EMPTY_INPUT', async () => {
  const response = await post({ text: '' });
  assert.equal(response.status, 400);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const payload = await response.json();
  assert.equal(payload.error.code, 'EMPTY_INPUT');
});

test('H-03 JSON 파싱 실패는 400 INVALID_REQUEST', async () => {
  const response = await post('not json');
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error.code, 'INVALID_REQUEST');
});

test('H-04 Content-Type이 json이 아니면 400 INVALID_REQUEST', async () => {
  const response = await post('{"text":"회의 안내"}', 'text/plain');
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error.code, 'INVALID_REQUEST');
});

test('H-05 API 키 없이 호출 시 500 SERVER_CONFIG', async () => {
  const response = await post({ text: '제목: 회의 안내' });
  assert.equal(response.status, 500);
  const payload = await response.json();
  assert.equal(payload.error.code, 'SERVER_CONFIG');
  assert.equal(payload.error.retryable, false);
});

test('H-06 ERROR_DEFINITIONS 무결성', () => {
  const keys = Object.keys(ERROR_DEFINITIONS);
  assert.equal(keys.length, 12);
  for (const key of keys) {
    const def = ERROR_DEFINITIONS[key];
    assert.equal(typeof def.status, 'number');
    assert.ok(def.message && def.message.trim().length > 0);
    assert.equal(typeof def.retryable, 'boolean');
  }
});

test('H-07 실패 응답 구조 일관성', async () => {
  const response = await post({ text: '' });
  const payload = await response.json();
  assert.equal(payload.ok, false);
  assert.ok(payload.error);
  assert.equal(typeof payload.error.code, 'string');
  assert.equal(typeof payload.error.message, 'string');
  assert.equal(typeof payload.error.retryable, 'boolean');
});
