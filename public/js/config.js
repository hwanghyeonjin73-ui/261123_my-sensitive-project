// 화면에서 쓰는 상수와 문구를 한 곳에 모아 둡니다.
// MAX_TEXT_LENGTH는 서버 lib/validate.js와 반드시 같은 값이어야 합니다.
export const MAX_TEXT_LENGTH = 3000;

// 서버 응답을 기다리는 최대 시간(밀리초). 서버 AI 대기(20초)보다 길게 잡습니다.
export const REQUEST_TIMEOUT_MS = 30000;

export const API_ENDPOINT = '/api/classify';

export const UI_TEXT = {
  submit: '분류하기',
  submitting: '분류 중…',
};

// 입력창 아래에 표시하는 입력 검증 문구 (docs/05-error-handling.md와 동일)
export const INPUT_ERRORS = {
  EMPTY_INPUT: '분류할 메일 내용을 입력해 주세요.',
  TOO_LONG: '메일 내용은 3,000자 이하로 입력해 주세요.',
};

// 서버 응답을 받지 못했을 때 브라우저에서 만드는 오류 (docs/05-error-handling.md와 동일)
export const CLIENT_ERRORS = {
  NETWORK_ERROR: { message: '인터넷 연결을 확인한 뒤 다시 시도해 주세요.', retryable: true },
  NETWORK_TIMEOUT: { message: '응답 시간이 초과됐어요. 다시 시도해 주세요.', retryable: true },
  UNKNOWN_ERROR: { message: '알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요.', retryable: true },
};

export const PRIORITY_CLASS = {
  urgent: 'is-urgent',
  today: 'is-today',
  later: 'is-later',
};

// 기대 결과: 서버 장애 → urgent, 자료 검토 → today, 사내 소식 → later
export const EXAMPLES = [
  {
    label: '서버 장애',
    text: '제목: [긴급] 결제 서버 장애 발생\n현재 모든 고객 결제가 실패하고 있습니다. 담당자분은 지금 바로 장애 대응 채널에 접속해 주세요.',
  },
  {
    label: '자료 검토',
    text: '제목: 고객사 미팅 자료 검토 요청\n내일 오전 10시 미팅 자료 초안을 공유드립니다. 오늘 퇴근 전까지 의견 주시면 반영하겠습니다.',
  },
  {
    label: '사내 소식',
    text: '제목: [뉴스레터] 11월 사내 소식\n신규 입사자 소개와 다음 달 송년회 일정을 안내드립니다. 자세한 내용은 사내 게시판을 확인해 주세요.',
  },
];
