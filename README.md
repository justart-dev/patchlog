# PatchLog

게임 패치 노트를 자동으로 수집·번역하여 한국어로 제공하는 플랫폼입니다.
현재 **Marvel Rivals**를 지원하며, Steam API로 패치 정보를 수집하고 OpenAI로 번역합니다.

## 주요 기능

- **패치 노트 자동 수집** — Steam API에서 최신 패치 데이터를 가져와 DB에 저장
- **한국어 자동 번역** — OpenAI GPT로 번역하며, 게임 스킬 용어 사전을 활용한 정확한 번역
- **스킬 맵 관리** — 기본 운영은 요청 기반 수동 반영이며, 필요 시 특정 캐릭터/문서를 기준으로 영문 스킬명 → 한국어 매핑 테이블을 갱신
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
매일 09:00 UTC  →  Vercel Cron: 패치 수집 + 번역 (marvel-batch)
매일 09:00 UTC  →  GitHub Actions: 백업 배치 트리거
매일 10:00 UTC  →  GitHub Actions: 배치 성공 여부 모니터링
```

**Marvel Rivals 스킬맵 운영 정책:**
- 기본 운영은 **요청 기반 수동 반영**입니다.
- 동건님이 특정 캐릭터/문서 업데이트를 요청하면 그때 소스를 수집해 `marvel_skill_map`에 반영합니다.
- 상시 나무위키 자동 sync/cron은 현재 기본 운영 경로로 사용하지 않습니다.
- 추후 필요성이 명확해지면 배치 자동화는 다시 설계합니다.

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
| `/api/marvel-skillmap-sync` | POST | 요청 기반 수동 스킬 맵 반영 | 없음 |
| `/api/marvel-batch` | GET/POST | 배치 파이프라인 실행 | CRON_SECRET |
| `/api/batch-status` | GET | 배치 실행 상태 조회 | 없음 |
| `/api/comments` | GET/POST | 댓글 조회/작성 | POST는 Clerk |
| `/api/comments/[id]` | PATCH/DELETE | 댓글 수정/삭제 | Clerk |

## 스킬맵 수동 반영 절차

기본 운영은 **요청 시 수동 반영**입니다. 특정 캐릭터 또는 문서 업데이트가 필요할 때 아래 흐름으로 진행합니다.

1. 업데이트 대상 캐릭터 또는 문서를 지정합니다.
2. 해당 소스에서 스킬명/키 정보를 수집합니다.
3. 필요하면 텍스트를 정리한 뒤 `/api/marvel-skillmap-sync`에 전달합니다.
4. 반영 후 `marvel_skill_map` 테이블에서 source / updated_at / key_label을 확인합니다.

### 수동 반영 진입점
- API 엔드포인트: `POST /api/marvel-skillmap-sync`
- 입력 방식:
  - `rawText`: 수집한 텍스트를 직접 전달
  - `sourceUrl`: 특정 문서 URL을 전달
  - `sourceLabel`: 어떤 요청으로 반영했는지 구분용 라벨

### 권장 sourceLabel 예시
- `manual-blade-update`
- `manual-daredevil-from-namu`
- `manual-new-hero-2026-04-17`

### 확인 포인트
- 동일한 영문 스킬명이 중복될 경우 dedupe 후 반영됩니다.
- 최종 반영 여부는 `marvel_skill_map`의 `english_name`, `korean_name`, `key_label`, `source`, `updated_at` 기준으로 확인합니다.
- 운영 기본값은 자동배치가 아니라 요청 기반 수동 반영입니다.

## 동건님 요청 포맷

아래처럼 간단하게 요청하면 바로 반영 작업에 들어갑니다.

### 가장 기본적인 요청
- `블레이드 스킬 업데이트 해줘`
- `데어데블 스킬맵 반영해줘`
- `신규 캐릭 스킬 추가해줘`

### 문서 기준으로 지정하는 요청
- `나무위키 기준으로 블레이드 스킬 업데이트 해줘`
- `이 문서 기준으로 퍼니셔 스킬맵 반영해줘`
- `이 URL 기준으로 신규 영웅 스킬 넣어줘`

### 여러 캐릭터 한 번에 요청
- `블레이드, 데어데블, 퍼니셔 스킬 업데이트 해줘`
- `이번 패치 관련 캐릭터들 스킬맵 한 번에 반영해줘`

### 요청 시 있으면 좋은 정보
- 캐릭터 이름
- 기준 문서 또는 URL
- 신규 추가인지, 기존 수정인지
- 급한 캐릭터 우선순위

기본적으로는 **캐릭터 이름만 말해도 진행 가능**하고, 문서/URL까지 주면 더 정확하게 반영합니다.

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
