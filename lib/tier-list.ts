export type HeroRole = "vanguard" | "duelist" | "strategist";

export type TierHero = {
  slug: string;
  name: string;
  koName: string;
  role: HeroRole | null;
  winRate: number;
  pickRate: number;
};

export type Tier = {
  id: "S" | "A" | "B" | "C" | "D" | "F";
  label: string;
  color: string;
  heroes: TierHero[];
};

export const ROLE_LABELS: Record<HeroRole, string> = {
  vanguard: "뱅가드",
  duelist: "듀얼리스트",
  strategist: "스트래티지스트",
};

// MetaBot.GG 마블 라이벌즈 티어 리스트 (2026-11-13 기준 스냅샷)
// https://metabot.gg/ko_KR/marvelrivals/heroes/tier-list
export const TIER_SOURCE_URL =
  "https://metabot.gg/ko_KR/marvelrivals/heroes/tier-list";

export const TIER_UPDATED_AT = "2026-11-13";

// 히어로 아이콘은 rivals.gs CDN을 직접 참조한다 (로컬 저장 없음).
export const HERO_ICONS: Record<string, string> = {
  "adam-warlock": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10460010-avatar-ce7804.webp",
  "angela": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10560010-avatar-f14f29.webp",
  "black-cat": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10610010-avatar-a2620d.webp",
  "black-panther": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10260010-avatar-2b93ce.webp",
  "black-widow": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10330010-avatar-70ce31.webp",
  "blade": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10440010-avatar-0e4fea.webp",
  "captain-america": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10220010-avatar-28321d.webp",
  "cloak-dagger": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10250010-avatar-9e987c.webp",
  "cyclops": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10630010-avatar-35c5f0.webp",
  "daredevil": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10550010-avatar-6b88cf.webp",
  "deadpool": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10570010-avatar-7e0d62.webp",
  "devil-dinosaur": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10620010-avatar-ece253.webp",
  "doctor-strange": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10180010-avatar-495110.webp",
  "elsa-bloodstone": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10590010-avatar-e89a7e.webp",
  "emma-frost": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10530010-avatar-9024f9.webp",
  "gambit": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10580010-avatar-0f10d4.webp",
  "gorr-the-god-butcher": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10670010-avatar-84f4fe.webp",
  "groot": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10270010-avatar-1a3fa5.webp",
  "hawkeye": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10210010-avatar-ae06f5.webp",
  "hela": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10240010-avatar-3de1a5.webp",
  "hulk": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10110010-avatar-d15fec.webp",
  "human-torch": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10170010-avatar-0a233f.webp",
  "invisible-woman": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10500010-avatar-b7d7b5.webp",
  "iron-fist": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10520010-avatar-031877.webp",
  "iron-man": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10340010-avatar-02b0dc.webp",
  "jeff-the-land-shark": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10470010-avatar-c45739.webp",
  "jubilee": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10640010-avatar-298846.webp",
  "loki": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10160010-avatar-364ddb.webp",
  "luna-snow": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10310010-avatar-1e933f.webp",
  "magik": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10290010-avatar-1e3183.webp",
  "magneto": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10370010-avatar-681549.webp",
  "mantis": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10200010-avatar-7e5a63.webp",
  "mister-fantastic": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10400010-avatar-c2a0d6.webp",
  "moon-knight": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10300010-avatar-6f41e7.webp",
  "namor": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10450010-avatar-c3f69a.webp",
  "peni-parker": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10420010-avatar-479cf4.webp",
  "phoenix": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10540010-avatar-e715f0.webp",
  "psylocke": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10480010-avatar-80d51f.webp",
  "rocket-raccoon": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10230010-avatar-79c97a.webp",
  "rogue": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10650010-avatar-3cd018.webp",
  "scarlet-witch": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10380010-avatar-1ad446.webp",
  "spider-man": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10360010-avatar-033acc.webp",
  "squirrel-girl": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10320010-avatar-74b8ab.webp",
  "star-lord": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10430010-avatar-fd4711.webp",
  "storm": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10150010-avatar-815740.webp",
  "the-hood": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10660010-avatar-634164.webp",
  "the-punisher": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10140010-avatar-79c19a.webp",
  "the-thing": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10510010-avatar-415e5d.webp",
  "thor": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10390010-avatar-4637cb.webp",
  "ultron": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10280010-avatar-57ba61.webp",
  "venom": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10350010-avatar-5a5be9.webp",
  "white-fox": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10600010-avatar-0790e5.webp",
  "winter-soldier": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10410010-avatar-2ef625.webp",
  "wolverine": "https://cdn.source.gs/marvel-rivals/img/img-squarehead-10490010-avatar-008f0e.webp",
};

export const TIERS: Tier[] = [
  {
    id: "S",
    label: "메타 정의",
    color: "#f83d54",
    heroes: [
      { slug: "peni-parker", name: "Peni Parker", koName: "페니 파커", role: "vanguard", winRate: 58.6, pickRate: 1.1 },
      { slug: "daredevil", name: "Daredevil", koName: "데어데블", role: "duelist", winRate: 57.6, pickRate: 1.8 },
      { slug: "ultron", name: "Ultron", koName: "울트론", role: "strategist", winRate: 56.6, pickRate: 0.8 },
      { slug: "mantis", name: "Mantis", koName: "맨티스", role: "strategist", winRate: 56.4, pickRate: 1.2 },
      { slug: "rocket-raccoon", name: "Rocket Raccoon", koName: "로켓 라쿤", role: "strategist", winRate: 56.1, pickRate: 3.1 },
    ],
  },
  {
    id: "A",
    label: "강력한 픽",
    color: "#f5a623",
    heroes: [
      { slug: "gorr-the-god-butcher", name: "Gorr The God Butcher", koName: "고르", role: "duelist", winRate: 58.9, pickRate: 0.1 },
      { slug: "storm", name: "Storm", koName: "스톰", role: "duelist", winRate: 56.2, pickRate: 0.6 },
      { slug: "magik", name: "Magik", koName: "매직", role: "duelist", winRate: 55.2, pickRate: 1.4 },
      { slug: "black-cat", name: "Black Cat", koName: "블랙 캣", role: "duelist", winRate: 55.1, pickRate: 0.7 },
      { slug: "loki", name: "Loki", koName: "로키", role: "strategist", winRate: 54.4, pickRate: 1.6 },
    ],
  },
  {
    id: "B",
    label: "적합",
    color: "#38bdf8",
    heroes: [
      { slug: "captain-america", name: "Captain America", koName: "캡틴 아메리카", role: "vanguard", winRate: 54.5, pickRate: 1.1 },
      { slug: "mister-fantastic", name: "Mister Fantastic", koName: "미스터 판타스틱", role: "duelist", winRate: 54.4, pickRate: 0.5 },
      { slug: "groot", name: "Groot", koName: "그루트", role: "vanguard", winRate: 54.0, pickRate: 1.5 },
      { slug: "iron-man", name: "Iron Man", koName: "아이언맨", role: "duelist", winRate: 54.0, pickRate: 1.0 },
      { slug: "star-lord", name: "Star-Lord", koName: "스타로드", role: "duelist", winRate: 53.9, pickRate: 1.9 },
      { slug: "hulk", name: "Hulk", koName: "헐크", role: "vanguard", winRate: 53.8, pickRate: 1.7 },
      { slug: "elsa-bloodstone", name: "Elsa Bloodstone", koName: "엘사 블러드스톤", role: "duelist", winRate: 53.4, pickRate: 3.3 },
      { slug: "invisible-woman", name: "Invisible Woman", koName: "인비저블 우먼", role: "strategist", winRate: 53.0, pickRate: 6.7 },
    ],
  },
  {
    id: "C",
    label: "상황적",
    color: "#a3a3a3",
    heroes: [
      { slug: "squirrel-girl", name: "Squirrel Girl", koName: "스쿼럴 걸", role: "duelist", winRate: 53.5, pickRate: 1.3 },
      { slug: "iron-fist", name: "Iron Fist", koName: "아이언 피스트", role: "duelist", winRate: 53.3, pickRate: 0.9 },
      { slug: "angela", name: "Angela", koName: "안젤라", role: "vanguard", winRate: 53.3, pickRate: 1.0 },
      { slug: "psylocke", name: "Psylocke", koName: "사일록", role: "duelist", winRate: 53.2, pickRate: 1.3 },
      { slug: "adam-warlock", name: "Adam Warlock", koName: "아담 워록", role: "strategist", winRate: 53.2, pickRate: 1.0 },
      { slug: "jeff-the-land-shark", name: "Jeff The Land Shark", koName: "제프 더 랜드 샤크", role: "strategist", winRate: 52.8, pickRate: 3.4 },
      { slug: "rogue", name: "Rogue", koName: "로그", role: "vanguard", winRate: 52.7, pickRate: 1.4 },
      { slug: "thor", name: "Thor", koName: "토르", role: "vanguard", winRate: 52.7, pickRate: 1.7 },
      { slug: "white-fox", name: "White Fox", koName: "화이트 폭스", role: "strategist", winRate: 52.1, pickRate: 4.7 },
    ],
  },
  {
    id: "D",
    label: "평균 이하",
    color: "#71717a",
    heroes: [
      { slug: "the-hood", name: "The Hood", koName: "더 후드", role: "vanguard", winRate: 53.5, pickRate: 0.3 },
      { slug: "venom", name: "Venom", koName: "베놈", role: "vanguard", winRate: 52.4, pickRate: 1.8 },
      { slug: "human-torch", name: "Human Torch", koName: "휴먼 토치", role: "duelist", winRate: 52.4, pickRate: 0.5 },
      { slug: "moon-knight", name: "Moon Knight", koName: "문 나이트", role: "duelist", winRate: 52.2, pickRate: 2.5 },
      { slug: "gambit", name: "Gambit", koName: "갬빗", role: "strategist", winRate: 52.1, pickRate: 2.5 },
      { slug: "phoenix", name: "Phoenix", koName: "피닉스", role: "duelist", winRate: 52.1, pickRate: 2.6 },
      { slug: "devil-dinosaur", name: "Devil Dinosaur", koName: "데빌 다이노소어", role: "vanguard", winRate: 51.9, pickRate: 2.3 },
      { slug: "spider-man", name: "Spider-Man", koName: "스파이더맨", role: "duelist", winRate: 51.7, pickRate: 2.7 },
      { slug: "doctor-strange", name: "Doctor Strange", koName: "닥터 스트레인지", role: "vanguard", winRate: 51.7, pickRate: 3.7 },
      { slug: "deadpool", name: "Deadpool", koName: "데드풀", role: "duelist", winRate: 51.5, pickRate: 4.6 },
    ],
  },
  {
    id: "F",
    label: "약함",
    color: "#52525b",
    heroes: [
      { slug: "black-panther", name: "Black Panther", koName: "블랙팬서", role: "duelist", winRate: 51.4, pickRate: 1.0 },
      { slug: "hela", name: "Hela", koName: "헬라", role: "duelist", winRate: 51.1, pickRate: 1.7 },
      { slug: "magneto", name: "Magneto", koName: "매그니토", role: "vanguard", winRate: 50.8, pickRate: 3.7 },
      { slug: "jubilee", name: "Jubilee", koName: "주빌리", role: "strategist", winRate: 50.6, pickRate: 0.5 },
      { slug: "blade", name: "Blade", koName: "블레이드", role: "duelist", winRate: 50.4, pickRate: 0.8 },
      { slug: "scarlet-witch", name: "Scarlet Witch", koName: "스칼렛 위치", role: "duelist", winRate: 50.2, pickRate: 1.3 },
      { slug: "namor", name: "Namor", koName: "네이머", role: "duelist", winRate: 50.2, pickRate: 2.2 },
      { slug: "wolverine", name: "Wolverine", koName: "울버린", role: "duelist", winRate: 50.1, pickRate: 0.9 },
      { slug: "luna-snow", name: "Luna Snow", koName: "루나 스노우", role: "strategist", winRate: 50.0, pickRate: 3.9 },
      { slug: "cloak-dagger", name: "Cloak & Dagger", koName: "클록 & 대거", role: "strategist", winRate: 49.7, pickRate: 4.3 },
      { slug: "emma-frost", name: "Emma Frost", koName: "엠마 프로스트", role: "vanguard", winRate: 49.2, pickRate: 2.5 },
      { slug: "the-thing", name: "The Thing", koName: "더 씽", role: "vanguard", winRate: 49.1, pickRate: 1.3 },
      { slug: "the-punisher", name: "The Punisher", koName: "퍼니셔", role: "duelist", winRate: 48.6, pickRate: 2.1 },
      { slug: "hawkeye", name: "Hawkeye", koName: "호크아이", role: "duelist", winRate: 47.9, pickRate: 0.7 },
      { slug: "winter-soldier", name: "Winter Soldier", koName: "윈터 솔저", role: "duelist", winRate: 47.1, pickRate: 2.1 },
      { slug: "cyclops", name: "Cyclops", koName: "사이클롭스", role: "duelist", winRate: 46.8, pickRate: 0.2 },
      { slug: "black-widow", name: "Black Widow", koName: "블랙 위도우", role: "duelist", winRate: 40.1, pickRate: 0.6 },
    ],
  },
];

