// 환경 변수 기반으로 기본 URL 반환
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // 브라우저 환경에서는 상대 경로 사용
    return '';
  }
  
  // 서버 사이드에서만 실행
  if (process.env.VERCEL_URL) {
    // Vercel 환경
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // 개발 환경
  return 'http://localhost:3000';
};

// API URL 생성 헬퍼
export const createApiUrl = (path: string) => {
  return `${getBaseUrl()}/api${path.startsWith('/') ? '' : '/'}${path}`;
};
