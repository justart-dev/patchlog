function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function replaceSkillsInHTML(html: string, skillMap: Record<string, string>) {
  const skills = Object.keys(skillMap);
  if (skills.length === 0) return html;

  // 긴 이름 먼저 매칭되도록 정렬
  const sorted = skills.sort((a, b) => b.length - a.length).map(escapeRegex);

  // 단어 경계 \b 쓰되, HTML 태그 안쪽까지 깨지지 않게
  const regex = new RegExp(`\\b(?:${sorted.join("|")})\\b`, "g");

  return html.replace(regex, (match) => {
    return skillMap[match] ?? match;
  });
}