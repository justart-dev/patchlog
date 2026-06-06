import { heroMap } from "./heroMap";
import { systemGlossary } from "./systemGlossary";
import { restoreProtectedTermPlaceholders } from "./translationProtection";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceMappedTerm(content: string, englishName: string, koreanName: string) {
  const escaped = escapeRegex(englishName);
  const startsWithWord = /^[A-Za-z0-9]/.test(englishName);
  const endsWithWord = /[A-Za-z0-9]$/.test(englishName);
  const pattern = new RegExp(
    `${startsWithWord ? "(^|[^A-Za-z0-9])" : ""}(${escaped})${endsWithWord ? "(?=$|[^A-Za-z0-9])" : ""}`,
    "g"
  );

  return content.replace(pattern, (...args) => {
    const prefix = startsWithWord ? args[1] : "";
    return `${prefix}${koreanName}`;
  });
}

interface PostProcessOptions {
  translatedContent: string;
  skillMap: Record<string, string>;
  protectedTerms: string[];
}

export function postProcessTranslation(options: PostProcessOptions): string {
  let { translatedContent, skillMap, protectedTerms } = options;

  // 1) skillMap 기반 치환 (긴 이름 우선)
  const sortedSkillEntries = Object.entries(skillMap).sort(
    ([a], [b]) => b.length - a.length
  );
  sortedSkillEntries.forEach(([englishName, koreanName]) => {
    const englishPattern = new RegExp(escapeRegex(englishName), "g");
    translatedContent = translatedContent.replace(englishPattern, koreanName);

    const koreanMatch = koreanName.match(/^(.+?)\((.+)\)$/);
    if (koreanMatch) {
      const [, nameOnly] = koreanMatch;
      const nameOnlyPattern = new RegExp(
        `${escapeRegex(nameOnly)}(?!\([^)]*\))`,
        "g"
      );
      translatedContent = translatedContent.replace(nameOnlyPattern, koreanName);
    }
  });

  // 2) 중복 키 표기 정리
  translatedContent = translatedContent.replace(
    /(\((?:좌클릭|우클릭|패시브|궁극기|Shift|E|Q|C|F|X|Ctrl|Space)\))(?:\1)+/g,
    "$1"
  );

  // 3) heroMap 기반 영웅명 치환
  const sortedHeroEntries = Object.entries(heroMap).sort(
    ([a], [b]) => b.length - a.length
  );
  sortedHeroEntries.forEach(([englishName, koreanName]) => {
    const possessivePattern = new RegExp(
      `\\b${escapeRegex(englishName)}['']s\\b`,
      "g"
    );
    translatedContent = translatedContent.replace(
      possessivePattern,
      `${koreanName}의`
    );

    const heroPattern = new RegExp(`\\b${escapeRegex(englishName)}\\b`, "g");
    translatedContent = translatedContent.replace(heroPattern, koreanName);
  });

  // 4) systemGlossary 기반 용어 치환
  Object.entries(systemGlossary)
    .sort(([a], [b]) => b.length - a.length)
    .forEach(([englishName, koreanName]) => {
      translatedContent = replaceMappedTerm(
        translatedContent,
        englishName,
        koreanName
      );
    });

  // 5) LLM 잔여 표현 정규화
  translatedContent = translatedContent
    .replace(/체인-CC\s*보호/g, "연속 CC 보호")
    .replace(/체인 CC\s*보호/g, "연속 CC 보호")
    .replace(/체인-CC\s*\(군중 제어\)\s*보호/g, "연속 CC 보호")
    .replace(/체인 CC\s*\(군중 제어\)\s*보호/g, "연속 CC 보호")
    .replace(/체인-CC/g, "연속 CC")
    .replace(/체인 CC/g, "연속 CC");

  // 6) 강인함 조사 보정
  const correctedTenacityParticles: Record<string, string> = {
    를: "을",
    는: "은",
    가: "이",
    와: "과",
    로: "으로",
    랑: "이랑",
  };
  translatedContent = translatedContent.replace(
    /(강인함(?:<\/[^>]+>)*)(를|는|가|와|로|랑)/g,
    (_, termWithTags, particle) => `${termWithTags}${correctedTenacityParticles[particle] ?? particle}`
  );

  // 7) 보호용 플레이스홀더 복원 (매핑 없는 스킬 영어 복원)
  translatedContent = restoreProtectedTermPlaceholders(
    translatedContent,
    protectedTerms
  );

  return translatedContent;
}
