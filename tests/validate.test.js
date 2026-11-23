import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateInput } from '../lib/validate.js';
import { AppError } from '../lib/errors.js';

test('V-01 양끝 공백 제거 후 반환', () => {
  const result = validateInput({ text: '  제목: 회의 안내  ' });
  assert.equal(result, '제목: 회의 안내');
});

test('V-02 빈 문자열은 EMPTY_INPUT', () => {
  assert.throws(
    () => validateInput({ text: '' }),
    (err) => err instanceof AppError && err.code === 'EMPTY_INPUT',
  );
});

test('V-03 공백/줄바꿈만 있는 입력은 EMPTY_INPUT', () => {
  assert.throws(
    () => validateInput({ text: '  \n\t ' }),
    (err) => err instanceof AppError && err.code === 'EMPTY_INPUT',
  );
});

test('V-04 3000자 통과', () => {
  const text = '가'.repeat(3000);
  const result = validateInput({ text });
  assert.equal(result, text);
});

test('V-05 3001자는 TOO_LONG', () => {
  assert.throws(
    () => validateInput({ text: '가'.repeat(3001) }),
    (err) => err instanceof AppError && err.code === 'TOO_LONG',
  );
});

test('V-06 이모지 3000개 통과', () => {
  const text = '😀'.repeat(3000);
  const result = validateInput({ text });
  assert.equal(result, text);
});

test('V-07 잘못된 본문 형식은 INVALID_REQUEST', () => {
  const invalids = [null, [], {}, { text: 123 }, '문자열'];
  for (const input of invalids) {
    assert.throws(
      () => validateInput(input),
      (err) => err instanceof AppError && err.code === 'INVALID_REQUEST',
    );
  }
});
