# PatchLog - Game Patch Tracking Platform

게임 패치 노트를 자동으로 수집하고 번역하여 한국어로 제공하는 플랫폼입니다. Steam API를 통해 게임 패치 정보를 수집하고, OpenAI를 활용해 번역하며, 사용자들이 댓글을 통해 소통할 수 있는 커뮤니티 기능을 제공합니다.

## 🏗️ 아키텍처 개요

```
Steam API → 데이터 수집 → OpenAI 번역 → Supabase DB → Next.js Frontend
                                          ↓
                                    Clerk 인증 + 댓글 시스템
```

### 핵심 구성 요소

- **Frontend**: Next.js 14 App Router + TypeScript + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Translation**: OpenAI GPT API
- **Data Source**: Steam Web API
- **Security**: Row Level Security (RLS) + API Key 분리

## 🔧 환경 변수 설정

### 필수 환경 변수

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key          # 읽기 전용 (RLS 적용)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # 관리자 권한 (쓰기/수정/삭제)

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# OpenAI Translation
OPENAI_API_KEY=your_openai_api_key
```

### 환경 변수별 역할

#### **SUPABASE_ANON_KEY** 🔓
- **용도**: 읽기 전용 작업 (패치 로그 조회, 댓글 조회)
- **보안**: RLS 정책을 준수하여 안전한 공개 접근
- **사용 파일**: 
  - `app/api/marvel-patch-logs/route.ts`
  - `app/api/marvel-patch-logs/[id]/route.ts`
  - `app/api/comments/route.ts` (GET 요청)

#### **SUPABASE_SERVICE_ROLE_KEY** 🔒
- **용도**: 관리자 작업 (데이터 삽입/수정/삭제, 사용자 관리)
- **보안**: RLS 정책을 우회하므로 서버 사이드에서만 사용
- **사용 파일**:
  - `app/api/comments/route.ts` (POST 요청)
  - `app/api/comments/[id]/route.ts` (PUT/DELETE 요청)
  - `app/api/marvel-patch-update/route.ts`
  - `app/api/marvel-patch-translate/route.ts`

#### **OPENAI_API_KEY** 🤖
- **용도**: 영어 패치 노트를 한국어로 번역
- **사용**: GPT 모델을 통한 자연어 번역 처리

## 📊 데이터 수집 및 처리 프로세스

### 1. Steam 데이터 수집
```typescript
// app/api/marvel-patch-update/route.ts
Steam Web API → 원본 패치 노트 수집 → Supabase 저장
```

**처리 과정:**
1. Steam API에서 게임별 뉴스 데이터 수집
2. 패치 노트만 필터링 (feed_type === 1)
3. 이미지 URL 변환 및 데이터 정규화
4. Supabase `steam_patch_logs` 테이블에 저장

### 2. 번역 처리
```typescript
// app/api/marvel-patch-translate/route.ts
원본 패치 노트 → OpenAI GPT → 한국어 번역 → DB 업데이트
```

**처리 과정:**
1. 당일 수집된 미번역 패치 노트 조회
2. OpenAI GPT API를 통한 한국어 번역
3. 번역 결과를 `translated_ko` 필드에 저장
4. Rate limit 방지를 위한 처리 간격 조절

### 3. 사용자 데이터 제공
```typescript
// 읽기: ANON_KEY (RLS 적용)
// 쓰기: SERVICE_ROLE_KEY + 인증 확인
```

## 🔐 보안 아키텍처

### Row Level Security (RLS) 정책

#### `steam_patch_logs` 테이블
```sql
-- 모든 사용자 읽기 허용
CREATE POLICY "Anyone can view patch logs" ON steam_patch_logs
  FOR SELECT USING (true);
```

#### `comments` 테이블
```sql
-- 읽기: 모든 사용자
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (is_deleted = false);

-- 쓰기: 인증된 사용자만
CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 수정/삭제: 댓글 작성자만
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.uid()::text
  ));
```

### API 권한 분리

| 작업 | 사용 키 | RLS 적용 | 인증 필요 |
|------|---------|----------|-----------|
| 패치 로그 조회 | ANON_KEY | ✅ | ❌ |
| 댓글 조회 | ANON_KEY | ✅ | ❌ |
| 댓글 작성 | SERVICE_ROLE_KEY | ❌ | ✅ |
| 댓글 수정/삭제 | SERVICE_ROLE_KEY | ❌ | ✅ |
| 데이터 수집/번역 | SERVICE_ROLE_KEY | ❌ | ❌ |

## 🚀 설치 및 실행

### 1. 프로젝트 설정
```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 필요한 키들 입력
```

### 2. Supabase 설정
```sql
-- 테이블 생성 및 RLS 정책 설정
-- (위의 보안 아키텍처 섹션 참조)
```

### 3. 개발 서버 실행
```bash
pnpm dev
```

### 4. 데이터 수집 및 번역 (수동 실행)
```bash
# 패치 데이터 수집
curl -X POST "http://localhost:3000/api/marvel-patch-update"

# 번역 처리
curl -X POST "http://localhost:3000/api/marvel-patch-translate"
```

## 📁 프로젝트 구조

```
app/
├── api/                           # API 엔드포인트
│   ├── marvel-patch-update/       # Steam 데이터 수집
│   ├── marvel-patch-translate/    # OpenAI 번역 처리
│   ├── marvel-patch-logs/         # 패치 로그 조회 API
│   ├── comments/                  # 댓글 시스템 API
│   ├── batch-logs/               # 배치 실행 로그
│   └── cron/                     # 자동화 작업
├── patch/[id]/                   # 패치 상세 페이지
├── components/                   # React 컴포넌트
└── utils/                       # 유틸리티 함수
lib/
└── batch-logger.ts              # 배치 실행 로깅
```

## 🎯 주요 기능

### 📰 패치 노트 관리
- Steam API를 통한 자동 데이터 수집
- OpenAI GPT를 활용한 한국어 번역
- 실시간 패치 노트 업데이트

### 💬 커뮤니티 기능
- Clerk 기반 사용자 인증
- 패치 노트별 댓글 시스템
- 대댓글 지원

### 🔒 보안 기능
- RLS 정책을 통한 데이터 접근 제어
- API 키 분리로 권한별 접근 관리
- XSS 방지 및 입력 검증

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **AI/ML**: OpenAI GPT API
- **External API**: Steam Web API
- **Deployment**: Vercel

## 📈 모니터링 및 로깅

- 배치 실행 로그를 통한 데이터 수집 상태 추적
- API 호출 및 에러 로그 기록
- 번역 성공/실패 통계 관리

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License.