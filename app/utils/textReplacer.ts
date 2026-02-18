function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 제목 번역 매핑
const titleReplacements: Record<string, string> = {
  "Marvel Rivals": "마블 라이벌즈",
  "Patch Notes": "패치 노트",
  "Balance Post": "밸런스 패치",
  Season: "시즌",
};

export function replaceEnglishTitles(title: string): string {
  let result = title;

  Object.entries(titleReplacements).forEach(([english, korean]) => {
    const pattern = new RegExp(escapeRegex(english), "gi");
    result = result.replace(pattern, korean);
  });

  return result;
}

export function wrapSkillsWithUnderline(
  html: string,
  skillMap: Record<string, string>
) {
  const skillNames = Object.values(skillMap);
  if (skillNames.length === 0) return html;

  let result = html;

  const withUltimateVariant = (skillName: string): string[] => {
    const variants = [skillName];
    if (skillName.endsWith("(Q)")) {
      variants.push(skillName.replace(/\(Q\)$/, "(궁극기)"));
    } else if (skillName.endsWith("(궁극기)")) {
      variants.push(skillName.replace(/\(궁극기\)$/, "(Q)"));
    }
    return variants;
  };

  // 각 스킬명을 직접 찾아서 <u> 태그로 감싸기
  skillNames.forEach((skillName) => {
    const variants = withUltimateVariant(skillName);

    variants.forEach((variant) => {
      // 이미 <u> 태그로 감싸져 있으면 건너뛰기
      if (result.includes(`<u>${skillName}</u>`)) return;

      // 전체 스킬명으로 먼저 찾기
      const fullSkillPattern = new RegExp(escapeRegex(variant), "g");
      result = result.replace(fullSkillPattern, `<u>${skillName}</u>`);
    });
  });

  return result;
}

export function convertYouTubePreviewTags(html: string): string {
  // [previewyoutube="VIDEO_ID;full"][/previewyoutube] 패턴을 YouTube 임베드로 변환
  const youtubePattern = /\[previewyoutube="([^;]+);[^"]*"\]\[\/previewyoutube\]/g;
  
  return html.replace(youtubePattern, (match, videoId) => {
    return `
      <div class="youtube-embed-container" style="position: relative; padding-bottom: 56.25%; height: 0; margin: 20px 0;">
        <iframe 
          src="https://www.youtube.com/embed/${videoId}" 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          title="YouTube video player">
        </iframe>
      </div>
    `.trim();
  });
}
