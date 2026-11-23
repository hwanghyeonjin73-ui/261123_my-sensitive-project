import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeResult } from '../lib/normalize.js';
import { AppError } from '../lib/errors.js';

test('N-01 urgent 정상 변환', () => {
  const result = normalizeResult({ priority: 'urgent', confidence: 90, reason: '장애예요' });
  assert.deepEqual(result, {
    priority: 'urgent',
    label: '즉시',
    confidence: 90,
    reason: '장애예요',
  });
});

test('N-02 today, later 라벨 변환', () => {
  const todayResult = normalizeResult({ priority: 'today', confidence: 75, reason: '오늘 검토' });
  assert.equal(todayResult.label, '오늘');

  const laterResult = normalizeResult({ priority: 'later', confidence: 60, reason: '뉴스레터' });
  assert.equal(laterResult.label, '나중');
});

test('N-03 confidence 반올림', () => {
  const result = normalizeResult({ priority: 'urgent', confidence: 87.6, reason: '급해요' });
  assert.equal(result.confidence, 88);
});

test('N-04 confidence 범위 밖/비정상값은 INVALID_AI_RESPONSE', () => {
  const invalidConfidences = [-1, 101, NaN, '80'];
  for (const confidence of invalidConfidences) {
    assert.throws(
      () => normalizeResult({ priority: 'urgent', confidence, reason: '이유' }),
      (err) => err instanceof AppError && err.code === 'INVALID_AI_RESPONSE',
    );
  }
});

test('N-05 알 수 없는 priority는 INVALID_AI_RESPONSE', () => {
  assert.throws(
    () => normalizeResult({ priority: 'high', confidence: 80, reason: '이유' }),
    (err) => err instanceof AppError && err.code === 'INVALID_AI_RESPONSE',
  );
});

test('N-06 reason 누락 또는 공백은 INVALID_AI_RESPONSE', () => {
  const invalidReasons = ['', '   ', null];
  for (const reason of invalidReasons) {
    assert.throws(
      () => normalizeResult({ priority: 'urgent', confidence: 80, reason }),
      (err) => err instanceof AppError && err.code === 'INVALID_AI_RESPONSE',
    );
  }
});

test('N-07 reason이 300자 초과 시 말줄임표 처리', () => {
  const reason = '가'.repeat(400);
  const result = normalizeResult({ priority: 'urgent', confidence: 80, reason });
  assert.equal(result.reason.length, 301);
  assert.equal(result.reason, `${'가'.repeat(300)}…`);
});

test('N-08 객체가 아닌 응답은 INVALID_AI_RESPONSE', () => {
  const invalidInputs = [null, '문자열'];
  for (const input of invalidInputs) {
    assert.throws(
      () => normalizeResult(input),
      (err) => err instanceof AppError && err.code === 'INVALID_AI_RESPONSE',
    );
  }
});
