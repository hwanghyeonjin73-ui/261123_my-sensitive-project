import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BASE_INSTRUCTIONS,
  formatTodayKST,
  buildInstructions,
  PRIORITY_SCHEMA,
} from '../lib/prompt.js';

test('P-01 한국 시간 낮 기준 날짜 포맷', () => {
  const formatted = formatTodayKST(new Date('2026-11-23T03:00:00Z'));
  assert.equal(formatted, '2026년 11월 23일 월요일');
});

test('P-02 한국 시간 익일 자정 넘은 시점 날짜 포맷', () => {
  const formatted = formatTodayKST(new Date('2026-11-23T15:30:00Z'));
  assert.equal(formatted, '2026년 11월 24일 화요일');
});

test('P-03 buildInstructions 지시문 구성', () => {
  const instructions = buildInstructions(new Date('2026-11-23T03:00:00Z'));
  assert.ok(instructions.startsWith(BASE_INSTRUCTIONS));
  assert.ok(instructions.includes('오늘은 2026년 11월 23일 월요일입니다 (한국 시간).'));
});

test('P-04 PRIORITY_SCHEMA 스키마 무결성', () => {
  assert.deepEqual(PRIORITY_SCHEMA.required, ['priority', 'confidence', 'reason']);
  assert.equal(PRIORITY_SCHEMA.additionalProperties, false);
  assert.deepEqual(PRIORITY_SCHEMA.properties.priority.enum, ['urgent', 'today', 'later']);
});
