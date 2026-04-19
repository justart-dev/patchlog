import { buildCanonicalUrl, SITE_NAME, SITE_URL, stripHtml } from "@/lib/site";

export function WebSiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "패치로그 - 마블 라이벌즈 한글 패치노트",
    alternateName: [SITE_NAME, "Patchlog"],
    url: SITE_URL,
    description: "마블 라이벌즈 최신 패치노트를 한국어로 정리해 제공하는 Patchlog",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${buildCanonicalUrl("/patch")}?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
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
  url,
}: {
  title: string;
  content: string;
  publishedAt: string;
  url: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: stripHtml(content).substring(0, 160),
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: "게임 패치노트",
    keywords: ["마블 라이벌즈", "패치노트", "게임 업데이트", "히어로 밸런스"],
    about: {
      "@type": "VideoGame",
      name: "Marvel Rivals",
      alternateName: "마블 라이벌즈",
      genre: "액션 게임",
      publisher: {
        "@type": "Organization",
        name: "NetEase Games",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function PatchCollectionStructuredData({
  patches,
}: {
  patches: Array<{
    id: string;
    title: string;
    published_at: string;
    translated_ko?: string | null;
    content?: string | null;
  }>;
}) {
  const topPatches = patches.slice(0, 10);
  const itemListElements = topPatches.map((patch, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: buildCanonicalUrl(`/patch/${patch.id}`),
    name: patch.title,
    description: stripHtml(patch.translated_ko || patch.content).substring(0, 160),
    datePublished: patch.published_at,
  }));

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "마블 라이벌즈 패치노트 목록",
      description:
        "Marvel Rivals 최신 패치노트와 밸런스 변경 히스토리를 한국어로 정리한 목록 페이지",
      url: buildCanonicalUrl("/patch"),
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: itemListElements,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "홈",
          item: buildCanonicalUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "패치노트",
          item: buildCanonicalUrl("/patch"),
        },
      ],
    },
  ];

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
    name: "Marvel Rivals",
    alternateName: "마블 라이벌즈",
    description: "마블 히어로들이 등장하는 팀 기반 슈퍼히어로 슈터 게임",
    genre: ["액션", "슈터", "멀티플레이어"],
    gamePlatform: ["PC", "Steam"],
    publisher: {
      "@type": "Organization",
      name: "NetEase Games",
    },
    operatingSystem: "Windows",
    applicationCategory: "Game",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
