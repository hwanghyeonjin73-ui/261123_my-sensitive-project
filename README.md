# 메일 우선순위 분류기 (Mail Priority Classifier)

메일 제목과 본문을 붙여 넣으면 AI가 처리 우선순위를 **즉시 / 오늘 / 나중**으로 분류하고, 신뢰도(%)와 판단 이유를 알려주는 웹 서비스입니다.

---

## 1. 준비물

- Node.js 24 이상 (LTS 권장)
- npm
- OpenAI API 키 (`sk-...`)

---

## 2. 로컬 실행 방법

1. 환경변수 설정:
   `.env.example` 파일을 복사하여 `.env` 파일을 생성하고 발급받은 OpenAI API 키를 입력합니다.
   ```dotenv
   OPENAI_API_KEY=sk-...
   ```
2. 패키지 설치:
   ```bash
   npm install
   ```
3. 로컬 개발 서버 실행:
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000`에 접속합니다.

---

## 3. 테스트 방법

Node.js 내장 테스트 러너를 통해 외부 호출 없이 검증합니다:
```bash
npm test
```

---

## 4. 배포 방법

Vercel을 통해 간단히 배포할 수 있습니다. 자세한 내용은 [docs/06-deployment.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/my_sentiment_project/docs/06-deployment.md)를 참고하세요.

---

## 5. 문서 안내

- [AGENTS.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/my_sentiment_project/AGENTS.md): 에이전트 작업 규칙
- [PRD.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/my_sentiment_project/PRD.md): 제품 요구사항
- [docs/01-project-setup.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/my_sentiment_project/docs/01-project-setup.md): 프로젝트 설정 지침
- [docs/02-ui-design.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/my_sentiment_project/docs/02-ui-design.md): UI 디자인 지침
- [docs/03-frontend.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/my_sentiment_project/docs/03-frontend.md): 프론트엔드 기능 지침
- [docs/04-backend-api.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/my_sentiment_project/docs/04-backend-api.md): 백엔드 및 AI 연동 지침
- [docs/05-error-handling.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/my_sentiment_project/docs/05-error-handling.md): 오류 처리 기준표
- [docs/06-deployment.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/my_sentiment_project/docs/06-deployment.md): 배포 지침
- [docs/07-testing.md](file:///c:/Users/hwang/OneDrive/바탕%20화면/ai%20수업/3주차/my_sentiment_project/docs/07-testing.md): 검증 및 테스트 기준
