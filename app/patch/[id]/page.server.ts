import { Metadata } from "next";

// 정적 생성을 위한 함수
export async function generateStaticParams() {
  // 여기에 모든 패치 ID 목록을 가져오는 로직을 추가하세요
  // 예: const patches = await fetchAllPatchIds();
  // return patches.map((patch) => ({ id: patch.id }));
  return []; // 임시로 빈 배열 반환
}

// 메타데이터 생성
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  // 기본 메타데이터
  const defaultMetadata = {
    title: '패치 노트',
    description: '마블 스나이퍼스 패치 노트',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `/patch/${params.id}`,
    },
  };

  // 프로덕션 환경이면 기본 메타데이터 반환
  if (process.env.NODE_ENV === 'production') {
    return defaultMetadata;
  }

  try {
    // 개발 환경에서만 API 호출
    const res = await fetch(`http://localhost:3000/api/marvel-patch-logs/${params.id}`, {
      next: { revalidate: 3600 } // 1시간마다 재검증
    });

    if (!res.ok) {
      return defaultMetadata;
    }

    const patch = await res.json();
    
    if (!patch) {
      return defaultMetadata;
    }

    return {
      title: `${patch.title || '패치 노트'} | 마블 스나이퍼스`,
      description: patch.content ? `${patch.content.substring(0, 160)}...` : '마블 스나이퍼스 패치 노트',
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      alternates: {
        canonical: `/patch/${params.id}`,
      },
    };
  } catch (error) {
    console.warn('Error fetching patch metadata:', error.message);
    return defaultMetadata;
  }
}
