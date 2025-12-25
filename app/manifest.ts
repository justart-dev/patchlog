import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '패치로그 - 스팀 게임 한글 패치노트',
    short_name: '패치로그',
    description: '스팀(Steam) 게임의 최신 패치노트를 한글로 번역해드립니다. 마블 라이벌즈 업데이트 정보를 놓치지 마세요.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/images/thumbnail.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/thumbnail.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
