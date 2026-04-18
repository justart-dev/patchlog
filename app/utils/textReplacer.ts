import { heroMap } from "./heroMap";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const titlePhraseReplacements: Array<[string, string]> = [
  ["Instructions for Enabling", ""],
  ["Performance Optimization", "성능 최적화"],
  ["Combat Mechanics", "전투 메커니즘"],
  ["Combat Mechanic", "전투 메커니즘"],
  ["Patch Notes", "패치노트"],
  ["Patch Note", "패치노트"],
  ["Balance Update", "밸런스 업데이트"],
  ["Balance Changes", "밸런스 변경사항"],
  ["Balance Post", "밸런스 패치"],
  ["Hotfix Update", "핫픽스 업데이트"],
  ["Hotfix", "핫픽스"],
  ["Extra Balance", "추가 밸런스"],
  ["Performance", "성능"],
  ["Optimization", "최적화"],
  ["Update", "업데이트"],
  ["Version", "버전"],
  ["Season", "시즌"],
  ["Enabling", "활성화"],
  ["Enable", "활성화"],
  ["Mechanics", "메커니즘"],
  ["Mechanic", "메커니즘"],
  ["Combat", "전투"],
  ["Notes", "노트"],
  ["Balance", "밸런스"],
  ["Extra", "추가"],
  ["Guide", "가이드"],
  ["In-Game", "인게임"],
  ["In Game", "인게임"],
];

const titleAliases: Record<string, string> = {
  "Marvel Rivals": "마블 라이벌즈",
  Cap: "캡틴 아메리카",
};

function normalizeTitleWhitespace(title: string) {
  return title
    .replace(/[’`]/g, "'")
    .replace(/\s*[:|/]\s*/g, " ")
    .replace(/\s*&\s*/g, " 및 ")
    .replace(/\s*-\s*/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function replaceTitleWords(input: string, replacements: Array<[string, string]>) {
  let result = input;

  replacements.forEach(([english, korean]) => {
    const pattern = new RegExp(`\\b${escapeRegex(english)}\\b`, "gi");
    result = result.replace(pattern, korean);
  });

  return result;
}

export function replaceEnglishTitles(title: string): string {
  if (!title) return title;

  let result = normalizeTitleWhitespace(title);
  const needsGuideSuffix = /^Instructions for Enabling\b/i.test(result);

  Object.entries(titleAliases).forEach(([english, korean]) => {
    const pattern = new RegExp(`\\b${escapeRegex(english)}\\b`, "gi");
    result = result.replace(pattern, korean);
  });

  Object.entries(heroMap).forEach(([english, korean]) => {
    const pattern = new RegExp(`\\b${escapeRegex(english)}\\b`, "gi");
    result = result.replace(pattern, korean);
  });

  result = replaceTitleWords(result, titlePhraseReplacements);
  result = result.replace(/([가-힣A-Za-z0-9])'s\b/g, "$1의");
  result = result.replace(/\bAnd\b/gi, "및");
  result = result.replace(/^Regarding\b\s*/i, "");
  result = result.replace(/^On\b\s*/i, "");
  result = result.replace(/^How to\b\s*/i, "");

  result = result
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .replace(/\b및\s+및\b/g, "및")
    .replace(/\b업데이트\s+패치노트\b/g, "업데이트 패치노트")
    .replace(/\b밸런스\s+패치노트\b/g, "밸런스 패치노트")
    .trim();

  if (needsGuideSuffix && !result.endsWith("안내") && !result.endsWith("가이드")) {
    result = `${result} 안내`.trim();
  }

  result = result
    .replace(/\s{2,}/g, " ")
    .replace(/\s+안내$/, " 안내")
    .trim();

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

  const splitSkillAndCommand = (value: string) => {
    const match = value.match(/^(.*?)(\((?:좌클릭|우클릭|패시브|궁극기|Shift|E|Q|C|F|X|Ctrl|Space)\))$/);
    if (!match) {
      return { label: value, command: "" };
    }
    return { label: match[1], command: match[2] };
  };

  // 각 스킬명을 직접 찾아서 <u> 태그로 감싸기
  skillNames.forEach((skillName) => {
    const variants = withUltimateVariant(skillName);

    variants.forEach((variant) => {
      const { label, command } = splitSkillAndCommand(skillName);
      const { label: variantLabel } = splitSkillAndCommand(variant);

      // 이미 밑줄 처리된 경우 건너뛰기
      if (result.includes(`<u>${label}</u>${command}`) || result.includes(`<u>${skillName}</u>`)) return;

      const replacement = command ? `<u>${label}</u>${command}` : `<u>${label}</u>`;
      const fullSkillPattern = new RegExp(escapeRegex(variant), "g");
      result = result.replace(fullSkillPattern, replacement);

      if (command && variantLabel !== variant) {
        const splitPattern = new RegExp(`${escapeRegex(variantLabel)}${escapeRegex(command)}`, "g");
        result = result.replace(splitPattern, replacement);
      }
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
