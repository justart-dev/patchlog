export function WebSiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "패치로그 - 스팀 게임 한글 패치노트",
    "alternateName": ["패치로그", "Patchlog"],
    "url": "https://patchlog.co.kr",
    "description": "스팀(Steam) 게임의 최신 패치노트를 한글로 번역 제공하는 전문 사이트",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://patchlog.co.kr/patch?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "패치로그",
      "url": "https://patchlog.co.kr"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function ArticleStructuredData({ 
  title, 
  content, 
  publishedAt, 
  url 
}: { 
  title: string;
  content: string;
  publishedAt: string;
  url: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": content.replace(/<[^>]*>?/gm, '').substring(0, 160),
    "datePublished": publishedAt,
    "dateModified": publishedAt,
    "author": {
      "@type": "Organization",
      "name": "패치로그"
    },
    "publisher": {
      "@type": "Organization",
      "name": "패치로그",
      "url": "https://patchlog.co.kr"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": "게임 패치노트",
    "keywords": ["마블 라이벌즈", "패치노트", "게임 업데이트", "히어로 밸런스"],
    "about": {
      "@type": "VideoGame",
      "name": "Marvel Rivals",
      "alternateName": "마블 라이벌즈",
      "genre": "액션 게임",
      "publisher": {
        "@type": "Organization",
        "name": "NetEase Games"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function GameStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "Marvel Rivals",
    "alternateName": "마블 라이벌즈",
    "description": "마블 히어로들이 등장하는 팀 기반 슈퍼히어로 슈터 게임",
    "genre": ["액션", "슈터", "멀티플레이어"],
    "gamePlatform": ["PC", "Steam"],
    "publisher": {
      "@type": "Organization",
      "name": "NetEase Games"
    },
    "operatingSystem": "Windows",
    "applicationCategory": "Game",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}