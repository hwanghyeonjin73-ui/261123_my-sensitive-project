import { AppError } from './errors.js';

export const PRIORITY_LABELS = {
  urgent: '즉시',
  today: '오늘',
  later: '나중',
};

export const MAX_REASON_LENGTH = 300;

// AI 응답을 검사해 화면에 보낼 형태로 바꿉니다. 규칙에 어긋나면 INVALID_AI_RESPONSE.
export function normalizeResult(raw) {
  if (raw === null || typeof raw !== 'object') throw new AppError('INVALID_AI_RESPONSE');
  const { priority, confidence, reason } = raw;

  if (!Object.hasOwn(PRIORITY_LABELS, priority)) throw new AppError('INVALID_AI_RESPONSE');
  if (typeof confidence !== 'number' || !Number.isFinite(confidence)) throw new AppError('INVALID_AI_RESPONSE');
  if (confidence < 0 || confidence > 100) throw new AppError('INVALID_AI_RESPONSE');
  if (typeof reason !== 'string' || reason.trim() === '') throw new AppError('INVALID_AI_RESPONSE');

  const chars = Array.from(reason.trim());
  const safeReason = chars.length > MAX_REASON_LENGTH
    ? `${chars.slice(0, MAX_REASON_LENGTH).join('')}…`
    : chars.join('');

  return {
    priority,
    label: PRIORITY_LABELS[priority],
    confidence: Math.round(confidence),
    reason: safeReason,
  };
}
