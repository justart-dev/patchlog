"use client";

import { useState, useEffect } from "react";

interface ParsedSkill {
  englishName: string;
  koreanName: string;
  type: string;
  key?: string;
}

export default function AdminPage() {
  const [skillData, setSkillData] = useState("");
  const [parsedSkills, setParsedSkills] = useState<ParsedSkill[]>([]);
  const [activeTab, setActiveTab] = useState<"input" | "result">("input");

  // 실시간 변환
  useEffect(() => {
    if (skillData.trim()) {
      parseSkillData(skillData);
    } else {
      setParsedSkills([]);
    }
  }, [skillData]);

  const parseSkillData = (data: string) => {
    const lines = data.split("\n").filter((line) => line.trim());
    const parsed: ParsedSkill[] = [];
    
    // 현재 섹션 추적
    let currentSection = "";

    lines.forEach((line) => {
      // 섹션 헤더 체크
      if (line.includes("협공 스킬") || line.includes("비활성화된 협공")) {
        currentSection = "협공 스킬";
        return;
      } else if (line.includes("일반 공격")) {
        currentSection = "일반 공격";
        return;
      } else if (line.includes("스킬") && !line.includes("협공")) {
        currentSection = "스킬";
        return;
      } else if (line.includes("능력 정보")) {
        currentSection = "";
        return;
      }

      // 패턴: 한글명(영어명) 또는 키 - 한글명(영어명)
      const match = line.match(/(?:([^-]+)\s*-\s*)?(.+?)\((.+?)\)/);

      if (match) {
        const [, keyPart, koreanName, englishName] = match;

        let type = "기타";
        let key = "";

        // 협공 스킬 섹션 체크 (우선순위 높음)
        const isTeamUpSection = currentSection === "협공 스킬" || 
                               line.includes("협공") || 
                               /3\.\d+\.\s*협공/.test(line) ||
                               line.includes("비활성화된 협공");

        if (keyPart) {
          const keyMatch = keyPart.trim();
          if (isTeamUpSection || keyMatch.includes("C") || keyMatch.includes("Z") || keyMatch.includes("X")) {
            type = "협공 스킬";
            if (keyMatch.includes("C")) key = "C";
            else if (keyMatch.includes("Z")) key = "Z";
            else if (keyMatch.includes("X")) key = "X";
            else if (keyMatch.includes("패시브")) key = "패시브";
          } else if (keyMatch.includes("패시브")) {
            type = "패시브";
          } else if (
            keyMatch.includes("좌클릭") ||
            keyMatch.includes("우클릭")
          ) {
            type = "일반 공격";
            key = keyMatch.includes("좌클릭") ? "좌클릭" : "우클릭";
          } else if (
            keyMatch.includes("Shift") ||
            keyMatch.includes("E") ||
            keyMatch.includes("Q") ||
            keyMatch.includes("F")
          ) {
            type = "스킬";
            if (keyMatch.includes("Shift")) key = "Shift";
            else if (keyMatch.includes("E")) key = "E";
            else if (keyMatch.includes("Q")) key = "Q";
            else if (keyMatch.includes("F")) key = "F";
          }
        } else if (isTeamUpSection) {
          type = "협공 스킬";
        } else if (line.includes("패시브")) {
          type = "패시브";
        }

        parsed.push({
          englishName: englishName.trim(),
          koreanName: koreanName.trim(),
          type,
          key,
        });
      }
    });

    setParsedSkills(parsed);
  };

  const formatSkillOutput = (skill: ParsedSkill) => {
    let keyInfo = "";

    if (skill.type === "패시브") {
      keyInfo = "패시브";
    } else if (skill.key) {
      keyInfo = skill.key;
    }

    return `${skill.englishName} → ${skill.koreanName}${
      keyInfo ? `(${keyInfo})` : ""
    }`;
  };

  const getSkillsByCategory = () => {
    const categories = ["패시브", "일반 공격", "스킬", "협공 스킬", "기타"];
    return categories
      .map((category) => ({
        category,
        skills: parsedSkills.filter((skill) => skill.type === category),
      }))
      .filter((group) => group.skills.length > 0);
  };

  const exportAsJSON = () => {
    const skillMap = Object.fromEntries(
      parsedSkills.map((skill) => [
        skill.englishName,
        `${skill.koreanName}(${
          skill.key || (skill.type === "패시브" ? "패시브" : skill.type)
        })`,
      ])
    );
    const formattedOutput = Object.entries(skillMap)
      .map(([key, value]) => `"${key}": "${value}",`)
      .join("\n");
    navigator.clipboard.writeText(formattedOutput);
    alert("JSON 형태로 클립보드에 복사되었습니다!");
  };

  const exportAsPromptData = () => {
    const promptData = parsedSkills
      .map((skill) => formatSkillOutput(skill))
      .join("\n");
    navigator.clipboard.writeText(promptData);
    alert("프롬프트용 데이터가 클립보드에 복사되었습니다!");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          마블 라이벌즈 스킬명 변환 도구
        </h1>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab("input")}
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
              activeTab === "input"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            데이터 입력
          </button>
          <button
            onClick={() => setActiveTab("result")}
            className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
              activeTab === "result"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            변환 결과 ({parsedSkills.length})
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          {activeTab === "input" && (
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    나무위키 스킬 데이터 입력
                  </label>
                  <a
                    href="https://namu.wiki/w/%EB%A7%88%EB%B8%94%20%EB%9D%BC%EC%9D%B4%EB%B2%8C%EC%A6%88/%EC%98%81%EC%9B%85"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    나무위키 영웅 정보 →
                  </a>
                </div>
                <textarea
                  value={skillData}
                  onChange={(e) => setSkillData(e.target.value)}
                  placeholder={`예시:
3. 능력 정보
3.1. 패시브 - 최전선 걷기(Wild Crawl)
3.2. 패시브 - 에이스 파일럿(Flying Ace)
3.3. 일반 공격
3.3.1. 좌클릭 - 화력 폭격(Bombard Mode)
3.3.2. 우클릭 - 치유의 라이트 볼(Repair Mode)
3.4. 스킬
3.4.1. 좌 Shift - 로켓 대시(Jetpack Dash)
3.4.2. E - 부활 비콘(B.R.B.)
3.4.3. Q - 코스믹 에너지 증폭 체인(C.Y.A.)
3.5. 협공 스킬
3.5.1. C - 오래된 사이(Old Friends)
3.5.2. E - 웹 서버(Web Server)
3.6. 비활성화된 협공 스킬
3.6.1. Z - 무기상(Ammo Invention)`}
                  className="w-full h-96 p-4 border border-gray-300 rounded-md resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                입력하는 대로 실시간으로 변환됩니다.
              </div>
            </div>
          )}

          {activeTab === "result" && (
            <div className="p-6">
              {parsedSkills.length > 0 ? (
                <>
                  {/* 내보내기 버튼들 */}
                  <div className="flex space-x-4 mb-6">
                    <button
                      onClick={exportAsJSON}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Json용 복사
                    </button>
                    <button
                      onClick={exportAsPromptData}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                    >
                      프롬프트용 복사
                    </button>
                  </div>

                  {/* 카테고리별 테이블 */}
                  {getSkillsByCategory().map(({ category, skills }) => (
                    <div key={category} className="mb-8">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
                        {category}
                      </h3>
                      <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[250px]">
                                영어명
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[250px]">
                                한글명
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700 min-w-[150px]">
                                키
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700 w-[650px]">
                                변환 결과
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {skills.map((skill, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-200 hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 font-mono text-blue-600 truncate">
                                  {skill.englishName}
                                </td>
                                <td className="px-4 py-3 truncate">
                                  {skill.koreanName}
                                </td>
                                <td className="px-4 py-3 font-mono text-gray-600 truncate">
                                  {skill.key ||
                                    (skill.type === "패시브" ? "패시브" : "-")}
                                </td>
                                <td className="px-4 py-3 font-mono text-sm truncate w-[650px]">
                                  {formatSkillOutput(skill)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-gray-500 text-center py-12">
                  <div className="text-lg">아직 변환된 데이터가 없습니다</div>
                  <div className="text-sm mt-2">
                    데이터 입력 탭에서 스킬 정보를 입력해주세요
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
