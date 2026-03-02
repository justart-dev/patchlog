# PatchLog

게임 패치 노트를 자동으로 수집·번역하여 한국어로 제공하는 플랫폼입니다.
현재 **Marvel Rivals**를 지원하며, Steam API로 패치 정보를 수집하고 OpenAI로 번역합니다.

## 주요 기능

- **패치 노트 자동 수집** — Steam API에서 최신 패치 데이터를 가져와 DB에 저장
- **한국어 자동 번역** — OpenAI GPT로 번역하며, 게임 스킬 용어 사전을 활용한 정확한 번역
- **스킬 맵 동기화** — 나무위키에서 영문 스킬명 → 한국어 매핑 테이블을 자동 갱신
- **댓글 커뮤니티** — 로그인 사용자가 패치 노트에 댓글 및 답글 작성 가능
- **배치 모니터링** — 매일 자동 실행되는 배치의 성공/실패를 GitHub Issues로 알림

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 15, React 18, TypeScript, Tailwind CSS |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Clerk |
| Translation | OpenAI GPT API |
| Web Scraping | Playwright |
| Deployment | Vercel |

## 아키텍처

```
Steam API
    │
    ▼
/api/marvel-patch-update     ← 패치 데이터 수집 및 저장
    │
    ▼
/api/marvel-patch-translate  ← OpenAI 번역 (스킬 맵 활용)
    │
    ▼
Supabase DB (steam_patch_logs)
    │
    ▼
Next.js Frontend             ← 패치 목록 / 상세 / 댓글
```

**배치 자동화 흐름:**
```
매일 08:50 UTC  →  Vercel Cron: 스킬 맵 동기화
매일 09:00 UTC  →  Vercel Cron: 패치 수집 + 번역 (marvel-batch)
매일 09:00 UTC  →  GitHub Actions: 백업 배치 트리거
매일 10:00 UTC  →  GitHub Actions: 배치 성공 여부 모니터링
```

## 환경 변수

`.env.local` 파일을 생성하고 아래 값을 설정하세요.

```env
# App
API_BASE_URL=https://your-domain.vercel.app

# Clerk (인증)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Supabase (DB)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (번역)
OPENAI_API_KEY=sk-...

# Steam (패치 수집)
STEAM_API_KEY=...

# Cron 보안
CRON_SECRET=your-random-secret
```

## 로컬 개발

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (http://localhost:4000)
pnpm dev

# 프로덕션 빌드
pnpm build
pnpm start
```

## API 엔드포인트

| 엔드포인트 | 메서드 | 설명 | 인증 |
|-----------|--------|------|------|
| `/api/marvel-patch-logs` | GET | 최근 패치 목록 조회 | 없음 |
| `/api/marvel-patch-logs/[id]` | GET | 패치 상세 조회 | 없음 |
| `/api/marvel-patch-update` | POST | Steam에서 패치 수집 | CRON_SECRET |
| `/api/marvel-patch-translate` | POST | 미번역 패치 번역 | CRON_SECRET |
| `/api/marvel-skillmap-sync` | POST | 스킬 맵 동기화 | 없음 |
| `/api/marvel-batch` | GET/POST | 배치 파이프라인 실행 | CRON_SECRET |
| `/api/batch-status` | GET | 배치 실행 상태 조회 | 없음 |
| `/api/comments` | GET/POST | 댓글 조회/작성 | POST는 Clerk |
| `/api/comments/[id]` | PATCH/DELETE | 댓글 수정/삭제 | Clerk |

## 데이터베이스 테이블

| 테이블 | 설명 |
|--------|------|
| `steam_patch_logs` | 패치 노트 원문 및 번역 |
| `marvel_skill_map` | 영문 → 한국어 스킬 용어 사전 |
| `comments` | 사용자 댓글 (대댓글 지원) |
| `users` | Clerk 연동 사용자 정보 |
| `batch_execution_logs` | 배치 실행 이력 및 상태 |

## 배포

Vercel에 배포하면 `vercel.json`에 설정된 Cron Job이 자동으로 활성화됩니다.
GitHub Actions 워크플로우(`backup-cron.yml`, `batch-monitor.yml`)를 위해 저장소 Secrets에 `CRON_SECRET`을 추가하세요.
