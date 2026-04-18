/**
 * HTML 문자열에 가독성을 위한 스타일을 추가하는 함수
 * @param html 변환할 HTML 문자열
 * @returns 스타일이 적용된 HTML 문자열
 */
export function addStylesToHtml(html: string): string {
  if (!html) return "";

  const toSafeImageTag = (rawUrl: string) => {
    const url = rawUrl.trim().replace(/&amp;/g, "&");
    if (!/^https?:\/\//i.test(url)) return rawUrl;
    return `<img src="${url}" alt="patch image" loading="lazy" />`;
  };

  // 이스케이프 문자 제거
  html = html
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\")
    // STEAM_CLAN_IMAGE 플레이스홀더 치환
    .replace(
      /\{STEAM_CLAN_IMAGE\}/g,
      "https://clan.cloudflare.steamstatic.com/images"
    );

  // nbsp/연속 공백 정리 (모바일에서 단어 간격이 과하게 벌어지는 현상 방지)
  html = html
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\u00A0/g, " ");
  html = html.replace(/>([^<]+)</g, (full, textContent) => {
    const normalized = textContent
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\s+\n/g, "\n");
    return `>${normalized}<`;
  });

  // BBCode 이미지 태그를 HTML 이미지 태그로 변환
  // 예: [img src="https://..."] / [img src='https://...'] / [img]https://...[/img]
  html = html
    .replace(/\[img\s+src=["']([^"']+)["']\s*\]/gi, (_, src) => toSafeImageTag(src))
    .replace(/\[img\]([\s\S]*?)\[\/img\]/gi, (_, src) => toSafeImageTag(src));

  // 한 문단에 붙은 번호 목록(예: "1. ... 2. ... 3. ...")을 줄바꿈 처리
  html = html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs, content) => {
    let formatted = content;
    const hasNumberedItems = /\d+\./.test(formatted);

    // 1) 번호 목록 줄바꿈 (예: "1. ... 2. ... 3. ...")
    if (hasNumberedItems) {
      // "4.<br />엘사..." 같은 케이스를 "4. 엘사..."로 정규화
      formatted = formatted.replace(/(\d+\.)\s*(<br\s*\/?>|\r?\n)\s*/gi, "$1 ");
      formatted = formatted.replace(/\s+(?=\d+\.\s)/g, "<br />");
    }

    // 2) 아이템 나열 줄바꿈 (예: "토르 - ... 스칼렛 위치 - ...")
    const hyphenItemCount = (formatted.match(/\s-\s/g) || []).length;
    if (!hasNumberedItems && hyphenItemCount >= 2) {
      const itemRegex =
        /([가-힣A-Za-z0-9][가-힣A-Za-z0-9 .:'"()&+/]*?\s-\s.*?)(?=\s+[가-힣A-Za-z0-9][가-힣A-Za-z0-9 .:'"()&+/]*?\s-\s|$)/g;
      const matches = [...formatted.matchAll(itemRegex)];

      if (matches.length >= 2) {
        const firstIndex = matches[0].index ?? 0;
        const prefix = formatted.slice(0, firstIndex).trim();
        const items = matches.map((m) => m[1].trim());

        // "5." 같은 번호 접두어는 첫 아이템 앞에 붙여서 줄 분리를 막음
        if (/^\d+\.$/.test(prefix) && items.length > 0) {
          items[0] = `${prefix} ${items[0]}`;
          formatted = items.join("<br />");
        } else {
          formatted = `${prefix ? `${prefix}<br />` : ""}${items.join("<br />")}`;
        }
      } else {
        formatted = formatted.replace(/:\s*/g, ":<br />");
      }
    }

    return `<p${attrs}>${formatted}</p>`;
  });

  // 공통 스타일링 함수
  const addStyle = (tag: string, style: string) => {
    const regex = new RegExp(`<${tag}(\\s+[^>]*)?>`, "gi");
    return html.replace(regex, (match, group) => {
      if (group && group.includes("style=")) {
        return match.replace(
          /style=(["'])([^"']*)\1/i,
          (_, quote, styleValue) => `style="${styleValue} ${style}"`
        );
      } else {
        const attributes = group ? group : "";
        return `<${tag}${attributes} style="${style}">`;
      }
    });
  };

  // 제목 스타일 (다크모드 대응)
  html = addStyle(
    "h1",
    "font-weight: 800; font-size: 2rem; line-height: 1.3; margin: 2.5rem 0 1.25rem; color: #111827; letter-spacing: -0.02em;"
  );
  html = addStyle(
    "h2",
    "font-weight: 800; font-size: 1.625rem; line-height: 1.35; margin: 2.25rem 0 1rem; color: #1f2937; letter-spacing: -0.015em;"
  );

  html = addStyle(
    "h3",
    "font-weight: 700; font-size: 1.25rem; line-height: 1.45; margin: 1.75rem 0 0.85rem; color: #374151; letter-spacing: -0.01em;"
  );

  // 문단 스타일 (더 나은 가독성)
  html = addStyle(
    "p",
    "margin: 0 0 1.25rem; font-size: 1.0625rem; line-height: 1.85; color: #4b5563; word-break: keep-all; letter-spacing: -0.003em; text-align: left; word-spacing: normal; white-space: normal;"
  );

  // 목록 스타일
  html = addStyle(
    "ul",
    "list-style-type: disc; padding-left: 1.75rem; margin: 1rem 0 1.5rem;"
  );
  html = addStyle(
    "ol",
    "list-style-type: decimal; padding-left: 1.75rem; margin: 1rem 0 1.5rem;"
  );
  html = addStyle(
    "li",
    "margin-bottom: 0.625rem; font-size: 1.0625rem; line-height: 1.8; color: #4b5563; padding-left: 0.25rem;"
  );

  // 링크 스타일 (더 현대적인 스타일)
  html = addStyle(
    "a",
    "color: #2563eb; text-decoration: none; font-weight: 500; border-bottom: 1px solid #93c5fd; transition: all 0.2s; padding-bottom: 1px;"
  );

  // 코드 블록 스타일
  html = addStyle(
    "code",
    "background-color: #f3f4f6; color: #1f2937; padding: 0.15rem 0.5rem; border-radius: 0.375rem; font-family: 'SF Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.9375rem; font-weight: 500;"
  );
  html = addStyle(
    "pre",
    "background-color: #f9fafb; color: #374151; border: 1px solid #e5e7eb; padding: 1.25rem 1.5rem; border-radius: 0.875rem; overflow-x: auto; margin: 1.5rem 0 2rem; font-size: 0.9375rem; line-height: 1.75; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);"
  );

  // 이미지 스타일 (더 세련된 그림자)
  html = addStyle(
    "img",
    "margin: 2rem 0; border-radius: 0.875rem; max-width: 100%; height: auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);"
  );

  // 인용구 스타일 (더 현대적인 디자인)
  html = addStyle(
    "blockquote",
    "border-left: 4px solid #3b82f6; background: linear-gradient(to right, #eff6ff, #f9fafb); padding: 1.25rem 1.5rem; margin: 1.5rem 0 2rem; color: #4b5563; font-style: normal; border-radius: 0 0.75rem 0.75rem 0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);"
  );

  // 구분선 및 표 스타일
  html = addStyle("hr", "border: 0; border-top: 2px solid #e5e7eb; margin: 2.5rem 0;");
  html = addStyle("table", "width: 100%; border-collapse: collapse; margin: 1.5rem 0 2rem; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden;");
  html = addStyle("th", "text-align: left; font-weight: 700; color: #1f2937; background-color: #f9fafb; border-bottom: 2px solid #e5e7eb; padding: 0.875rem 1rem; font-size: 0.9375rem;");
  html = addStyle("td", "border-bottom: 1px solid #f3f4f6; padding: 0.875rem 1rem; color: #4b5563; font-size: 1rem;");

  // 새로운 효과 형광펜 하이라이트 (더 세련된 스타일)
  html = html.replace(
    /새로운 효과[:：]\s*/gi,
    '<span style="display: inline-flex; align-items: center; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); color: #166534; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-weight: 600; font-size: 0.875rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);">새로운 효과</span>: '
  );

  // 수치 변경사항 가독성 개선: 화살표 수치 구간 전체는 bold, 증가/감소 단어만 색상 강조
  const valuePattern = "[0-9]+(?:\\.[0-9]+)?(?:m\\/s|\\/s|%|초|s|m|px|개|명|회|배)?";
  const formatChangeSegment = (oldValue: string, newValue: string) => {
    return `<strong style="font-weight: 800; color: #111827;">${oldValue} → ${newValue}</strong>`;
  };

  const formatDirectionWord = (word: string) => {
    const isPositive = word === "증가" || word === "상향";
    const color = isPositive ? "#1d4ed8" : "#b91c1c";
    const bgColor = isPositive
      ? "linear-gradient(180deg, transparent 38%, rgba(219, 234, 254, 0.78) 38%)"
      : "linear-gradient(180deg, transparent 38%, rgba(254, 242, 242, 0.82) 38%)";
    const boxShadow = isPositive
      ? "inset 0 -0.07em 0 rgba(191, 219, 254, 0.42)"
      : "inset 0 -0.07em 0 rgba(254, 202, 202, 0.42)";
    return `<span style="display: inline; margin-left: 0.06rem; padding: 0 0.14rem; border-radius: 0.12rem; background: ${bgColor}; box-shadow: ${boxShadow}; font-weight: 700; color: ${color}; line-height: 1.15;">${word}</span>`;
  };

  // 화살표 수치 구간은 문맥과 상관없이 우선 bold 처리
  html = html.replace(
    new RegExp(`(${valuePattern})\\s*[→➡]\\s*(${valuePattern})`, "g"),
    (_, oldValue, newValue) => formatChangeSegment(oldValue, newValue)
  );

  // 한국어 서술형 수치 변경도 함께 bold 처리
  html = html.replace(
    new RegExp(`(${valuePattern})\\s*에서\\s*(${valuePattern})\\s*로`, "g"),
    (_, oldValue, newValue) => `${oldValue}에서 ${formatChangeSegment(oldValue, newValue)}로`
  );
  html = html.replace(
    new RegExp(`(${valuePattern})\\s*에서\\s*(${valuePattern})\\s*으로`, "g"),
    (_, oldValue, newValue) => `${oldValue}에서 ${formatChangeSegment(oldValue, newValue)}으로`
  );
  html = html.replace(
    new RegExp(`(${valuePattern})\\s*를\\s*(${valuePattern})\\s*로`, "g"),
    (_, oldValue, newValue) => `${oldValue}를 ${formatChangeSegment(oldValue, newValue)}로`
  );

  // 증가/감소/상향/하향 어간 색상 처리 (활용형 포함)
  html = html.replace(
    /(증가|감소|상향|하향)(?=(?:시|했|합|되|됐|됩))/g,
    (_, direction) => formatDirectionWord(direction)
  );

  return html;
}
