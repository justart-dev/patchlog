<div align="center">

# 패치로그 · Patchlog

**게임 패치노트를 자동으로 수집·번역해 한국어로 정리하는 아카이브**

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

현재 **Marvel Rivals**를 지원합니다. Steam 공지를 수집하고, 스킬 용어 사전을 적용해 번역한 뒤, 패치노트·티어표·통계로 보여줍니다.

</div>

---

## 주요 기능

| | 기능 | 설명 |
|---|---|---|
| 📥 | **패치 수집** | Steam 공지 API에서 최신 패치를 가져와 DB에 적재 |
| 🌐 | **자동 번역** | OpenAI로 번역하며, 영문 스킬명 → `한글명(커맨드)` 치환 |
| 📚 | **스킬 사전** | `marvel_skill_map`으로 스킬명과 키를 관리 (요청 기반 수동 반영) |
| 📊 | **티어 리스트** | 외부 통계를 12시간 주기로 수집·검증해 S~F 티어로 제공 |
| 💬 | **댓글** | Clerk 로그인 기반 댓글·대댓글 |
| 🔔 | **인덱싱** | 새 패치를 IndexNow로 네이버·Bing에 즉시 통보 |
| ✉️ | **피드백** | 자체 모달 폼 → 메일 발송 (Resend) |
| 📱 | **PWA** | 홈 화면 설치·오프라인 폴백 |

## 기술 스택

| 레이어 | 사용 기술 |
|---|---|
| **Framework** | Next.js 15 (App Router) · React 18 · TypeScript |
| **Styling** | Tailwind CSS · Pretendard |
| **Data** | Supabase (PostgreSQL + RLS) |
| **Auth** | Clerk |
| **Translation** | OpenAI API |
| **Collecting** | Steam Web API · Playwright |
| **Mail** | Resend |
| **Infra** | Vercel · Vercel Cron · GitHub Actions |

## 아키텍처

```text
                      ┌──────────────────────────┐
                      │   Vercel Cron 09 / 21시  │
                      └────────────┬─────────────┘
                                   │
                                   ▼
┌─────────────┐          ┌──────────────────┐
│  Steam API  │────────▶ │ /api/marvel-batch│
└─────────────┘   수집    └────────┬─────────┘
                                   │
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
          ┌────────────────────┐      ┌──────────────────┐
          │  OpenAI 번역        │      │  IndexNow 제출    │
          │  + 스킬맵 치환      │      │ (네이버 · Bing)   │
          └─────────┬──────────┘      └──────────────────┘
                    ▼
          ┌────────────────────┐
          │  Supabase Postgres │
          │  ├ steam_patch_logs │
          │  ├ marvel_skill_map │
          │  └ comments         │
          └─────────┬──────────┘
                    ▼
          ┌────────────────────────────────────┐
          │        Next.js App Router          │
          │  패치 목록 · 상세 · 티어표 · 통계   │
          └────────────────────────────────────┘
```

## 자동화 스케줄

| 시각 (UTC) | 실행 | 내용 |
|---|---|---|
| 매일 09:00 · 21:00 | Vercel Cron | 패치 수집 → 번역 → 인덱싱 |
| 매일 09:00 | GitHub Actions | 백업 배치 트리거 |
| 매일 10:00 | GitHub Actions | 배치 성공 여부 모니터링 (실패 시 Issue) |

## API

| 엔드포인트 | 메서드 | 설명 | 인증 |
|---|---|:---:|---|
| `/api/marvel-patch-logs` | GET | 최근 패치 목록 | — |
| `/api/marvel-patch-logs/[id]` | GET | 패치 상세 | — |
| `/api/marvel-patch-update` | POST | Steam에서 패치 수집 | `CRON_SECRET` |
| `/api/marvel-patch-translate` | POST | 미번역 패치 번역 | `CRON_SECRET` |
| `/api/marvel-batch` | GET/POST | 수집·번역 파이프라인 | `CRON_SECRET` |
| `/api/indexnow` | POST | 인덱싱 일괄 제출 | `CRON_SECRET` |
| `/api/marvel-skillmap-sync` | POST | 스킬맵 수동 반영 | — |
| `/api/feedback` | POST | 피드백 메일 발송 | — |
| `/api/views` | POST | 조회수 기록 | — |
| `/api/comments` | GET/POST | 댓글 조회·작성 | POST는 Clerk |
| `/api/comments/[id]` | PATCH/DELETE | 댓글 수정·삭제 | Clerk |
| `/api/batch-status` | GET | 배치 실행 상태 | — |

## 데이터베이스

| 테이블 | 설명 |
|---|---|
| `steam_patch_logs` | 패치 원문·번역문·발행일 |
| `marvel_skill_map` | 영문 → 한국어 스킬 용어 사전 (`key_label` 포함) |
| `comments` | 댓글 (대댓글 지원) |
| `users` | Clerk 연동 사용자 |
| `batch_execution_logs` | 배치 실행 이력·상태 |

## 시작하기

```bash
pnpm install     # 의존성 설치
pnpm dev         # http://localhost:4000
pnpm build       # 프로덕션 빌드
pnpm start       # 빌드 결과 실행
pnpm test:e2e    # Playwright E2E
```

## 스킬 사전 운영

번역 품질은 `marvel_skill_map`에 달려 있습니다. 기본은 **요청 기반 수동 반영**입니다.

1. 갱신할 캐릭터 또는 문서를 정합니다.
2. 해당 소스에서 스킬명·키 정보를 수집합니다.
3. `POST /api/marvel-skillmap-sync`로 반영합니다.
   - `rawText` — 수집한 텍스트 직접 전달
   - `sourceUrl` — 문서 URL 전달
   - `sourceLabel` — 반영 이력 구분용 라벨 (예: `manual-blade-update`)
4. `marvel_skill_map`의 `english_name` · `korean_name` · `key_label` · `source`로 확인합니다.

상시 크롤링 cron은 운영 경로로 사용하지 않습니다.

## 배포

Vercel에 연결하면 `vercel.json`의 Cron이 자동 활성화되고, 푸시할 때마다 배포됩니다.
GitHub Actions(`backup-cron.yml`, `batch-monitor.yml`)는 저장소 Secrets에 `CRON_SECRET`이 필요합니다.

<div align="center">
<sub>Patch notes, translated and archived.</sub>
</div>
