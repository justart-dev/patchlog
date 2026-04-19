const MARVEL_RIVALS_YOUTUBE_FEED =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCWzmOSSiSPbVnVu3ZAyDx2w";

export type LatestVideo = {
  title: string;
  videoId: string;
  videoUrl: string;
  publishedAt: string;
  embedUrl: string;
  thumbnailUrl: string;
  source: string;
};

function decodeXmlEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractTag(block: string, tagName: string) {
  const escapedTagName = tagName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const match = block.match(
    new RegExp(`<${escapedTagName}>([\\s\\S]*?)</${escapedTagName}>`)
  );
  return match ? decodeXmlEntities(match[1]) : null;
}

function extractLink(block: string) {
  const match = block.match(/<link[^>]*href="([^"]+)"[^>]*\/>/);
  return match ? decodeXmlEntities(match[1]) : null;
}

function isLikelyLiveVideo(title: string, description: string) {
  const normalizedTitle = title.toLowerCase();
  const normalizedDescription = description.toLowerCase();

  return [
    /\blive\b/,
    /tune in live/,
    /livestream/,
    /stream starting/,
    /stream starts/,
    /watch now live/,
    /\[[^\]]+ vs [^\]]+\]/,
    /preseason .* day \d+/
  ].some(
    (pattern) =>
      pattern.test(normalizedTitle) || pattern.test(normalizedDescription)
  );
}

function isLikelyShortPromo(title: string) {
  const normalizedTitle = title.toLowerCase();

  return [
    /#marvelrivals/,
    /costume reveal/,
    /\| #marvelrivals/,
    /\| #marvelrivals$/,
    /\| #marvelrivals/i
  ].some((pattern) => pattern.test(normalizedTitle));
}

function getVideoPriority(title: string) {
  const normalizedTitle = title.toLowerCase();

  if (/character reveal trailer/.test(normalizedTitle)) return 0;
  if (/official trailer/.test(normalizedTitle)) return 1;
  if (/map reveal/.test(normalizedTitle)) return 2;
  if (/dev vision/.test(normalizedTitle)) return 3;
  return 4;
}

export async function getLatestMarvelVideo(): Promise<LatestVideo | null> {
  const response = await fetch(MARVEL_RIVALS_YOUTUBE_FEED, {
    next: { revalidate: 1800 },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    }
  } as RequestInit & { next: { revalidate: number } });

  if (!response.ok) {
    throw new Error(`유튜브 피드를 불러오지 못했습니다. (${response.status})`);
  }

  const xml = await response.text();
  const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];

  const candidateEntries = entries
    .map((entryBlock) => {
      const title = extractTag(entryBlock, "title") ?? "";
      const description = extractTag(entryBlock, "media:description") ?? "";
      const publishedAt = extractTag(entryBlock, "published") ?? "";

      return {
        entryBlock,
        title,
        description,
        publishedAt
      };
    })
    .filter(
      ({ title, description }) =>
        !isLikelyLiveVideo(title, description) && !isLikelyShortPromo(title)
    )
    .sort((a, b) => {
      const priorityDiff = getVideoPriority(a.title) - getVideoPriority(b.title);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  const selectedEntry = candidateEntries[0]?.entryBlock;

  if (!selectedEntry) {
    return null;
  }

  const videoId = extractTag(selectedEntry, "yt:videoId");
  const title = extractTag(selectedEntry, "title");
  const publishedAt = extractTag(selectedEntry, "published");
  const videoUrl = extractLink(selectedEntry);

  if (!videoId || !title || !publishedAt || !videoUrl) {
    throw new Error("최신 영상 정보 파싱에 실패했습니다.");
  }

  return {
    title,
    videoId,
    videoUrl,
    publishedAt,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    source: "Marvel Rivals YouTube"
  };
}