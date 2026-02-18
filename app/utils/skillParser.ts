export interface ParsedSkill {
  englishName: string;
  koreanName: string;
  type: string;
  key?: string;
}

function extractKey(keyPart: string): string {
  const keyMatch = keyPart.trim();
  if (keyMatch.includes("좌클릭")) return "좌클릭";
  if (keyMatch.includes("우클릭")) return "우클릭";
  if (keyMatch.includes("Shift")) return "Shift";
  if (keyMatch.includes("E")) return "E";
  if (keyMatch.includes("Q")) return "Q";
  if (keyMatch.includes("F")) return "F";
  if (keyMatch.includes("C")) return "C";
  if (keyMatch.includes("Z")) return "Z";
  if (keyMatch.includes("X")) return "X";
  if (keyMatch.includes("패시브")) return "패시브";
  return "";
}

function resolveType(line: string, keyPart: string | undefined, currentSection: string): string {
  const isTeamUpSection =
    currentSection === "협공 스킬" ||
    line.includes("협공") ||
    /3\.\d+\.\s*협공/.test(line) ||
    line.includes("비활성화된 협공");

  if (!keyPart) {
    if (isTeamUpSection) return "협공 스킬";
    if (line.includes("패시브")) return "패시브";
    return "기타";
  }

  const keyMatch = keyPart.trim();

  // 좌/우클릭은 항상 일반 공격으로 강제 분류
  if (keyMatch.includes("좌클릭") || keyMatch.includes("우클릭")) {
    return "일반 공격";
  }

  if (isTeamUpSection || keyMatch.includes("C") || keyMatch.includes("Z") || keyMatch.includes("X")) {
    return "협공 스킬";
  }
  if (keyMatch.includes("패시브")) {
    return "패시브";
  }
  if (keyMatch.includes("Shift") || keyMatch.includes("E") || keyMatch.includes("Q") || keyMatch.includes("F")) {
    return "스킬";
  }

  return "기타";
}

export function parseSkillData(data: string): ParsedSkill[] {
  const lines = data
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const parsed: ParsedSkill[] = [];
  let currentSection = "";

  lines.forEach((line) => {
    if (line.includes("협공 스킬") || line.includes("비활성화된 협공")) {
      currentSection = "협공 스킬";
      return;
    }
    if (line.includes("일반 공격")) {
      currentSection = "일반 공격";
      return;
    }
    if (line.includes("스킬") && !line.includes("협공")) {
      currentSection = "스킬";
      return;
    }
    if (line.includes("능력 정보")) {
      currentSection = "";
      return;
    }

    const match = line.match(/(?:([^-]+)\s*-\s*)?(.+?)\((.+?)\)/);
    if (!match) return;

    const [, keyPart, koreanName, englishName] = match;
    const type = resolveType(line, keyPart, currentSection);
    const key = keyPart ? extractKey(keyPart) : "";

    parsed.push({
      englishName: englishName.trim(),
      koreanName: koreanName.trim(),
      type,
      key,
    });
  });

  return parsed;
}

export function formatSkillOutput(skill: ParsedSkill): string {
  const keyInfo = skill.type === "패시브" ? "패시브" : skill.key || "";
  return `${skill.englishName} → ${skill.koreanName}${keyInfo ? `(${keyInfo})` : ""}`;
}

export function toSkillMapRecord(skills: ParsedSkill[]): Record<string, string> {
  return Object.fromEntries(
    skills.map((skill) => [
      skill.englishName,
      `${skill.koreanName}(${skill.key || (skill.type === "패시브" ? "패시브" : skill.type)})`,
    ])
  );
}
