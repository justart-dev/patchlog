import { heroMap } from "./heroMap";
import { systemGlossary } from "./systemGlossary";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const STORE_MARKETING_KEYWORDS = [
  "Chroma",
  "Costume",
  "Costumes",
  "Bundle",
  "Emoji",
  "Spray",
  "Nameplate",
  "Emote",
];

const STORE_CONTEXT_KEYWORDS = [
  ...STORE_MARKETING_KEYWORDS,
  "Accessory",
  "번들",
  "코스튬",
  "크로마",
  "감정표현",
  "액세서리",
  "네임플레이트",
  "스프레이",
  "이모지",
];

function looksLikeStoreMarketingLabel(term: string) {
  return STORE_MARKETING_KEYWORDS.some((keyword) => term.includes(keyword));
}

function isInStoreContext(content: string, term: string): boolean {
  const index = content.indexOf(term);
  if (index === -1) return false;
  const before = content.slice(Math.max(0, index - 60), index);
  const after = content.slice(index + term.length, index + term.length + 60);
  const context = before + " " + after;
  return STORE_CONTEXT_KEYWORDS.some((kw) => context.includes(kw));
}

export function extractUnmappedSkillLikeTerms(
  content: string,
  skillMap: Record<string, string>
): string[] {
  const knownSkills = new Set(Object.keys(skillMap));
  const knownHeroes = new Set(Object.keys(heroMap));
  const blockedTerms = new Set([
    "Marvel Rivals",
    "Chain-CC Protection",
    "Ultimate Ability",
    "Gun Form Ultimate Ability",
    "Community Announcements",
    "Patch Notes",
    "Balance Post",
    "Dev Vision",
  ]);

  const candidates = new Set<string>();
  const patterns = [
    /([A-Z][A-Za-z0-9'!@#$&.-]*(?:\s+(?:[A-Z][A-Za-z0-9'!@#$&.-]*|of|the|in|on|for|and|to|by|with|Your|Over|Into))+)(?=\s*\()/g,
    /([A-Z][A-Za-z0-9'!@#$&.-]*(?:\s+(?:[A-Z][A-Za-z0-9'!@#$&.-]*|of|the|in|on|for|and|to|by|with|Your|Over|Into))*\s*-\s*[A-Z][A-Za-z0-9'!@#$&.-]*(?:\s+(?:[A-Z][A-Za-z0-9'!@#$&.-]*|of|the|in|on|for|and|to|by|with|Your|Over|Into))*)/g,
  ];

  patterns.forEach((pattern) => {
    Array.from(content.matchAll(pattern)).forEach((match) => {
      const term = match[1]?.trim();
      if (!term) return;
      if (knownSkills.has(term) || knownHeroes.has(term)) return;
      if (blockedTerms.has(term)) return;
      if (looksLikeStoreMarketingLabel(term)) return;
      if (isInStoreContext(content, term)) return;
      if (term.length < 4) return;
      candidates.add(term);
    });
  });

  return Array.from(candidates).sort((a, b) => b.length - a.length);
}

export function applyProtectedTermPlaceholders(content: string, terms: string[]) {
  const placeholders: string[] = [];
  let protectedContent = content;

  terms.forEach((term) => {
    const placeholder = `__SKILL_TERM_PLACEHOLDER_${placeholders.length}__`;
    const pattern = new RegExp(escapeRegex(term), "g");
    if (!pattern.test(protectedContent)) return;
    placeholders.push(term);
    protectedContent = protectedContent.replace(pattern, placeholder);
  });

  return { protectedContent, placeholders };
}

export function restoreProtectedTermPlaceholders(content: string, placeholders: string[]) {
  return placeholders.reduce((acc, term, index) => {
    const placeholder = `__SKILL_TERM_PLACEHOLDER_${index}__`;
    return acc.replace(new RegExp(escapeRegex(placeholder), "g"), term);
  }, content);
}