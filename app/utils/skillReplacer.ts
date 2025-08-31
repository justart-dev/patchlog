function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function wrapSkillsWithUnderline(
  html: string,
  skillMap: Record<string, string>
) {
  const skillNames = Object.values(skillMap);
  if (skillNames.length === 0) return html;

  let result = html;

  // 각 스킬명을 직접 찾아서 <u> 태그로 감싸기
  skillNames.forEach((skillName) => {
    // 이미 <u> 태그로 감싸져 있으면 건너뛰기
    if (result.includes(`<u>${skillName}</u>`)) return;

    // 전체 스킬명으로 먼저 찾기
    const fullSkillPattern = new RegExp(escapeRegex(skillName), "g");
    result = result.replace(fullSkillPattern, `<u>${skillName}</u>`);
  });

  return result;
}
