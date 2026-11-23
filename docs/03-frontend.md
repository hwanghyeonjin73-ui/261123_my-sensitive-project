# 03. 프론트엔드 기능 구현 지침

> 메일 우선순위 분류 화면(HTML)의 뼈대와, 버튼을 눌렀을 때 일어나는 일(JavaScript)을 정의합니다.
> 디자인 값은 `docs/02-ui-design.md`, 서버 응답 형식은 `docs/04-backend-api.md`, 오류 문구는 `docs/05-error-handling.md`를 따릅니다.

---

## 1. 파일 역할

| 파일 | 역할 | 다른 파일 import |
|---|---|---|
| `public/js/config.js` | 상수(최대 글자 수, 시간 제한), 화면 문구, 예시 문장, 클라이언트 오류 문구 | 없음 |
| `public/js/api.js` | `/api/classify` 호출, 응답을 일정한 형태로 변환 | `config.js` |
| `public/js/app.js` | DOM 요소 연결, 상태 관리, 화면 그리기, 이벤트 처리 | `config.js`, `api.js` |

---

## 2. HTML 뼈대 (`public/index.html`)

아래 구조와 **id를 그대로** 사용합니다. class는 `docs/02`의 이름을 따릅니다. 이 목록에 없는 id는 만들지 않습니다.

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="메일을 붙여 넣으면 AI가 즉시·오늘·나중으로 처리 우선순위를 알려주는 메일 우선순위 분류기">
  <meta name="theme-color" content="#121212">
  <title>메일 우선순위 분류기</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="/css/fonts.css">
  <link rel="stylesheet" href="/css/style.css">
  <script type="module" src="/js/app.js"></script>
</head>
<body>
  <main class="page">
    <header class="site-header">
      <span class="logo-dot" aria-hidden="true"></span>
      <span class="logo-text">메일 우선순위 분류기</span>
    </header>

    <section class="intro">
      <h1 id="page-title">이 메일, 언제 처리해야 할까요?</h1>
      <p class="page-desc">메일 제목과 본문을 붙여 넣으면 AI가 즉시·오늘·나중 중 처리 우선순위를 알려줘요.</p>
    </section>

    <form id="classify-form" class="card input-card" novalidate>
      <label for="text-input" class="section-label">메일 내용</label>
      <p id="input-hint" class="input-hint">개인정보나 회사 기밀은 가린 뒤 붙여 넣어 주세요.</p>
      <textarea id="text-input" name="text" rows="8"
        placeholder="메일 제목과 본문을 붙여 넣어 주세요"
        aria-describedby="input-hint input-error char-count"></textarea>

      <div class="input-meta">
        <p id="input-error" class="input-error" aria-live="polite"></p>
        <p id="char-count" class="char-count">0 / 3000</p>
      </div>

      <div id="example-list" class="example-row">
        <span class="section-label">예시</span>
        <!-- 예시 버튼 3개는 app.js가 config.js의 EXAMPLES로 생성 -->
      </div>

      <div class="action-row">
        <button type="button" id="clear-button" class="btn btn-outline">지우기</button>
        <button type="submit" id="classify-button" class="btn btn-primary">분류하기</button>
      </div>
    </form>

    <section id="result-section" class="result-section" aria-live="polite" aria-busy="false">
      <div id="result-empty" class="card result-empty">
        <p>메일 내용을 붙여 넣고 분류하기를 눌러 주세요.</p>
      </div>

      <div id="result-loading" class="card result-loading" hidden>
        <span class="spinner" aria-hidden="true"></span>
        <p>분류 중이에요…</p>
      </div>

      <article id="result-card" class="card result-card" hidden>
        <div class="result-block">
          <p class="section-label">우선순위</p>
          <div class="result-label-row">
            <span class="result-dot" aria-hidden="true"></span>
            <p id="result-label" class="result-label"></p>
          </div>
        </div>

        <div class="result-block">
          <div class="confidence-head">
            <p class="section-label">신뢰도</p>
            <p id="confidence-value" class="confidence-value"></p>
          </div>
          <div id="confidence-bar" class="confidence-bar"
            role="progressbar" aria-label="신뢰도" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div id="confidence-fill" class="confidence-fill"></div>
          </div>
        </div>

        <div class="result-block">
          <p class="section-label">판단 이유</p>
          <p id="result-reason" class="result-reason"></p>
        </div>

        <p class="result-note">AI가 추정한 결과로, 정확하지 않을 수 있어요. 중요한 메일은 직접 확인해 주세요.</p>
      </article>

      <div id="error-box" class="error-box" role="alert" hidden>
        <p class="error-title">분류하지 못했어요</p>
        <p id="error-message" class="error-message"></p>
        <button type="button" id="retry-button" class="btn btn-chip" hidden>다시 시도</button>
      </div>
    </section>
  </main>
</body>
</html>
```

### 2.1 id 목록 (총 21개 — 추가·삭제 금지)
`page-title`, `classify-form`, `input-hint`, `text-input`, `input-error`, `char-count`, `example-list`, `clear-button`, `classify-button`, `result-section`, `result-empty`, `result-loading`, `result-card`, `result-label`, `confidence-value`, `confidence-bar`, `confidence-fill`, `result-reason`, `error-box`, `error-message`, `retry-button`

### 2.2 `[hidden]` 처리
CSS에서 `display`를 지정한 요소도 `hidden`이 확실히 동작하도록 `style.css`에 다음을 넣습니다.
```css
[hidden] { display: none !important; }
```

---

## 3. `public/js/config.js` (그대로 사용)

```js
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
```

---

## 4. `public/js/api.js` (참고 구현)

`classifyMail(text)`는 **절대 예외를 던지지 않고** 항상 아래 두 형태 중 하나를 돌려줍니다. 그래서 `app.js`는 `try/catch` 없이 결과만 보면 됩니다.

- 성공: `{ ok: true, data: { priority, label, confidence, reason } }`
- 실패: `{ ok: false, error: { code, message, retryable } }`

```js
import { API_ENDPOINT, REQUEST_TIMEOUT_MS, CLIENT_ERRORS } from './config.js';

function clientError(code) {
  return { ok: false, error: { code, ...CLIENT_ERRORS[code] } };
}

// 서버에 우선순위 분류를 요청합니다. 어떤 경우에도 예외를 던지지 않습니다.
export async function classifyMail(text) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
  } catch (error) {
    return clientError(error.name === 'AbortError' ? 'NETWORK_TIMEOUT' : 'NETWORK_ERROR');
  } finally {
    clearTimeout(timer);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    return clientError('UNKNOWN_ERROR');
  }

  if (payload?.ok === true && payload.data) return payload;
  if (payload?.ok === false && payload.error?.code && payload.error?.message) {
    return { ok: false, error: { retryable: false, ...payload.error } };
  }
  return clientError('UNKNOWN_ERROR');
}
```

---

## 5. `public/js/app.js` — 상태와 동작

### 5.1 상태(State) 4가지

화면은 항상 아래 4가지 상태 중 **하나**입니다. 화면을 바꿀 때는 반드시 `setState()` 하나만 통해서 바꿉니다.

| 상태 | 보이는 블록 | 분류하기 버튼 | 지우기·예시 버튼 | 입력창 | `aria-busy` |
|---|---|---|---|---|---|
| `idle` | `#result-empty` | 활성, "분류하기" | 활성 | 편집 가능 | `false` |
| `loading` | `#result-loading` | **비활성**, "분류 중…" | **비활성** | **읽기 전용**(`readOnly`) | `true` |
| `success` | `#result-card` | 활성, "분류하기" | 활성 | 편집 가능 | `false` |
| `error` | `#error-box` | 활성, "분류하기" | 활성 | 편집 가능 | `false` |

```js
// 상태 예시 (내부 구조는 자유, 단 setState 하나로 화면을 갱신)
// setState({ status: 'idle' })
// setState({ status: 'loading' })
// setState({ status: 'success', data })
// setState({ status: 'error', error })
```

### 5.2 글자 수 세기 규칙

```js
// 이모지처럼 두 칸을 차지하는 글자도 1자로 셉니다. 서버와 같은 방식입니다.
const countChars = (value) => Array.from(value.trim()).length;
```
- 글자 수는 **앞뒤 공백을 제거한 뒤** 셉니다.
- textarea에 `maxlength` 속성은 **쓰지 않습니다** (세는 방식이 달라 서버와 어긋남).

### 5.3 이벤트별 동작

| ID | 이벤트 | 동작 |
|---|---|---|
| E-01 | 페이지 로드 | ① `EXAMPLES`로 예시 버튼 3개 생성 (`button.btn.btn-chip`, `type="button"`, 글자=`label`, `textContent` 사용) ② `setState({status:'idle'})` ③ 글자 수 `0 / 3000` |
| E-02 | 입력창 `input` | ① `#char-count`를 `{n} / 3000`으로 갱신 ② n > 3000이면 `#char-count`에 `.is-over`, 입력창에 `.is-invalid`, `#input-error`에 TOO_LONG 문구 ③ n ≤ 3000이면 `.is-over`·`.is-invalid` 제거, `#input-error` 비움 ④ **결과 영역은 건드리지 않음** |
| E-03 | 폼 `submit` (분류하기 클릭) | `event.preventDefault()` 후 `submitClassification()` 실행 |
| E-04 | 입력창 `keydown` | `(event.ctrlKey \|\| event.metaKey) && event.key === 'Enter'`이면 `event.preventDefault()` 후 `submitClassification()`. 그냥 `Enter`는 줄바꿈 |
| E-05 | 예시 버튼 클릭 | ① 입력창 값 = 예시 `text` ② E-02 동작 실행(글자 수·오류 갱신) ③ 입력창에 포커스 ④ **자동 분류하지 않음**, 결과 영역 유지 |
| E-06 | 지우기 클릭 | ① 입력창 비움 ② `#input-error` 비움, `.is-over`·`.is-invalid` 제거, 글자 수 `0 / 3000` ③ `setState({status:'idle'})` ④ 입력창에 포커스 |
| E-07 | 다시 시도 클릭 | `submitClassification()` 실행 (현재 입력창 값 사용) |

### 5.4 `submitClassification()` 순서

```
1. 현재 상태가 loading이면 → 아무것도 하지 않고 종료 (중복 요청 방지)
2. text = 입력창 값.trim()
3. text가 빈 문자열이면 → #input-error = EMPTY_INPUT 문구, 입력창 .is-invalid, 입력창 포커스, 종료 (서버 요청 안 함)
4. countChars(text) > 3000이면 → #input-error = TOO_LONG 문구, 입력창 포커스, 종료 (서버 요청 안 함)
5. #input-error 비움, .is-invalid 제거
6. setState({ status: 'loading' })
7. result = await classifyMail(text)
8. result.ok가 true면 → setState({ status: 'success', data: result.data })
   아니면 → setState({ status: 'error', error: result.error })
```

### 5.5 결과 그리기 (`success`)

1. `#result-card`에서 `.is-urgent` / `.is-today` / `.is-later`를 모두 제거한 뒤 `PRIORITY_CLASS[data.priority]` 추가
2. `#result-label.textContent = data.label` (서버가 보낸 "즉시/오늘/나중" 그대로)
3. `#confidence-value.textContent = `${data.confidence}%``
4. `#confidence-bar`의 `aria-valuenow = data.confidence`
5. 막대 애니메이션: `#confidence-fill.style.width = '0%'` → `requestAnimationFrame` 두 번 중첩 후 `style.width = `${data.confidence}%``
6. `#result-reason.textContent = data.reason`
7. `data.priority`가 세 값 중 하나가 아니면 그리지 말고 `setState({status:'error', error: { code: 'UNKNOWN_ERROR', ...CLIENT_ERRORS.UNKNOWN_ERROR }})`

### 5.6 오류 그리기 (`error`)

1. `#error-message.textContent = error.message`
2. `#retry-button.hidden = !error.retryable`
3. 포커스는 이동하지 않습니다 (`role="alert"`가 스크린리더에 자동으로 읽어 줌)

### 5.7 금지 사항
- `innerHTML` 등으로 문자열 HTML을 넣지 않습니다. 요소 생성은 `document.createElement`, 글자는 `textContent`.
- `alert()`, `confirm()`, `console.log` 남기기 금지 (개발 중 사용한 `console.log`는 완료 전 삭제).
- `localStorage`, 쿠키 사용 금지 (기록 저장은 범위 밖).

---

## 6. 완료 기준

- [ ] §2.1의 id 21개가 모두 존재하고, 그 외 id가 없다
- [ ] `config.js`가 §3과 동일하다
- [ ] 화면 상태 전환이 §5.1 표와 일치한다 (`docs/07` T-01 ~ T-12)
- [ ] 빈 입력·1000자 초과 시 Network 탭에 `/api/classify` 요청이 생기지 않는다
- [ ] 로딩 중 분류하기를 여러 번 눌러도 요청은 1번만 전송된다
- [ ] `public/js/` 안에 `innerHTML` 문자열 검색 결과 0건
- [ ] 브라우저 콘솔에 오류·경고 0건

---

## 변경 이력
- 2026-11-23: 최초 작성
