'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [patchCount, setPatchCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeProblem, setActiveProblem] = useState(0);
  const [activeHowStep, setActiveHowStep] = useState(0);
  const [isHowInteractiveReady, setIsHowInteractiveReady] = useState(false);
  const howTrackRefs = useRef<(HTMLDivElement | null)[]>([]);

  const problemCards = [
    {
      label: "Problem 01",
      title: "영어 패치노트",
      summary: "변경점을 빠르게 읽기 어려워 업데이트 의미를 놓치기 쉽습니다.",
      color: "amber",
      painPoint: "읽는 데 시간이 오래 걸리고 핵심 변화가 눈에 잘 안 들어옵니다.",
      solution: [
        "핵심 변경점 위주로 한국어 요약",
        "숫자/효과/조건 중심으로 구조화",
        "업데이트 맥락이 보이는 문장 흐름",
      ],
    },
    {
      label: "Problem 02",
      title: "일반 번역기",
      summary: "직역 위주라 게임 용어와 밸런스 맥락이 깨지는 경우가 많습니다.",
      color: "rose",
      painPoint: "기계적인 번역은 실제 플레이에 필요한 정보를 놓치게 만듭니다.",
      solution: [
        "게임 용어 사전 기반 번역",
        "버프/너프 맥락 유지",
        "커뮤니티에서 읽기 쉬운 톤 적용",
      ],
    },
  ] as const;
  const howItWorksSteps = [
    {
      id: 1,
      title: "Steam API 모니터링",
      description: "Steam API를 통해 최신 패치 후보를 가져옵니다.",
      trackTitle: "신규 공지 확인",
      trackDescription: `매일 정해진 시간에 Steam API를 통해 각 AppID 기준으로 Steam 뉴스 API를 호출합니다.

응답 목록에서 공지 타입과 게시 정보를 확인해 패치노트 성격의 항목만 1차 후보로 분류합니다.`,
      highlight: false,
      tags: [] as string[],
    },
    {
      id: 2,
      title: "새 패치노트 감지",
      description: "이미 저장된 글은 제외하고, 새로 올라온 패치노트만 가져옵니다.",
      trackTitle: "원문 수집 및 정리",
      trackDescription: `패치노트 원문을 최대한 보존하며, 필요한 데이터를 DB에 저장합니다.

      번역 전 준비 단계 입니다. 같은 글은 다시 저장하지 않고, 새 글만 번역 대기 상태로로 만듭니다.

      `,
      highlight: false,
      tags: [] as string[],
    },
    {
      id: 3,
      title: "GPT-5-mini 번역",
      description: "번역 할 데이터만 골라 커스텀 프롬프트로 번역하고, 게임 용어 규칙을 반영합니다.",
      trackTitle: "맥락 기반 번역 처리",
      trackDescription: `최근 7일 데이터 중 번역 대기 상태에 있던 패치 항목만 번역 대상으로 잡습니다.

      내부의 커스텀된 프롬프트를 기반으로 일반 번역이 아닌 한국 사용자의 입맛에 맞게 현지화 하였습니다. 번역 이후, 화면에 바로 랜더링 할 수 있게 후처리 이후에 DB에 저장합니다.

      오래된 GPT-4o 모델에 비해 가격은 낮고, 더 안정적인 GPT-5-mini로 모델을 변경하여 서비스의 지속성을 강화했습니다.
`,
      highlight: true,
      tags: ["✓ 한국시간", "✓ 게임 용어 매핑", "✓ 커뮤니티 톤"],
      examples: [
        {
          label: "UTC → KST 자동 변환",
          source: "This update will be deployed on June 19, 2025, at 9:00:00 AM (UTC)",
          result: "이번 업데이트는 6월 19일 오전 6시에 배포됩니다",
        },
        {
          label: "자연스러운 한국어 표현",
          source: "Fixed an issue where players could get stuck in the spawn area after respawning",
          result: "부활 후 스폰 지역에서 움직일 수 없는 버그를 수정했습니다",
        },
      ] as { label: string; source: string; result: string }[],
    },
    {
      id: 4,
      title: "렌더링 커스터마이징",
      description: "번역 결과를 화면에서 읽기 쉬운 형태로 가공해 핵심 변화가 먼저 보이게 합니다.",
      trackTitle: "가독성 후처리",
      trackDescription: `문단 구조를 정리하고 핵심 수치/효과 키워드를 강조하는 렌더링 규칙을 적용합니다.`,
      highlight: false,
      tags: [] as string[],
      examples: [
        {
          label: "새로운 효과 강조",
          source: "새로운 효과: 적을 처치하면 이동 속도가 증가합니다",
          result: "[새로운 효과] 배지로 시각 강조하여 핵심 포인트를 먼저 노출",
        },
        {
          label: "수치 변화 강조",
          source: "체력이 100에서 150으로 증가했습니다",
          result: "변경 수치(150)를 강조 색상으로 표시해 버프/너프를 즉시 인지",
        },
        {
          label: "스킬명/커맨드 가독성",
          source: "Repair Mode, Share the Stage, Wild Wall",
          result: "치유의 라이트 볼(우클릭), 아이돌의 매력(E), 야생 장벽(C) 형태로 통일",
        },
      ] as { label: string; source: string; result: string }[],
    },
    {
      id: 5,
      title: "웹사이트 자동 배포",
      description: "처리 완료된 콘텐츠를 사이트에 반영하고, 사용자가 바로 최신 내역을 확인할 수 있게 합니다.",
      trackTitle: "자동 반영 및 공개",
      trackDescription: `번역/후처리 완료 데이터는 DB에 반영된 직후 목록과 상세 페이지에서 조회됩니다.

      동시에 배치 실행 로그에 성공/실패/처리 건수를 남겨 운영 중 문제를 빠르게 추적할 수 있게 합니다.
      `,
      highlight: false,
      tags: [] as string[],
    },
  ] as const;

  // Animated counter for patch count
  useEffect(() => {
    setIsVisible(true);
    const target = 60;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setPatchCount(target);
        clearInterval(timer);
      } else {
        setPatchCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsHowInteractiveReady(true);
  }, []);

  useEffect(() => {
    if (!isHowInteractiveReady) return;
    let rafId = 0;

    const updateActiveStep = () => {
      rafId = 0;
      const nodes = howTrackRefs.current.filter(Boolean) as HTMLDivElement[];
      if (nodes.length === 0) return;

      const targetY = window.innerHeight * 0.45;
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      nodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - targetY);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      setActiveHowStep(bestIndex);
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActiveStep);
    };

    updateActiveStep();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [isHowInteractiveReady]);

  const activeCard = problemCards[activeProblem] ?? problemCards[0];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="pt-12 pb-32 px-4 relative">
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-[2.75rem] md:text-8xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            게임 <span className="text-hero-blue-500">패치노트</span>를<br />
            한글로 자동 번역
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            최신 AI 기술로 스팀 게임 패치노트를 한글 번역하는 플랫폼
          </p>
          <Link
            href="/patch"
            className="inline-flex items-center gap-3 px-10 py-5 bg-hero-blue-500 hover:bg-hero-blue-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span>패치노트 보러가기</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          {/* Stats badges */}
          <div className="mt-16 grid w-full max-w-4xl mx-auto grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 px-6 py-7 text-center shadow-sm">
              <div className="h-14 mb-2 flex items-center justify-center text-5xl font-black text-hero-blue-500 leading-none">
                <span className="inline-block min-w-[4ch] text-center tabular-nums">{patchCount}+</span>
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">번역된 패치노트</div>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 px-6 py-7 text-center shadow-sm">
              <div className="h-14 mb-2 flex items-center justify-center text-5xl font-black text-gray-900 dark:text-white leading-none">GPT-5</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">최신 AI 모델</div>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 px-6 py-7 text-center shadow-sm">
              <div className="h-14 mb-2 flex items-center justify-center text-3xl sm:text-4xl font-black text-emerald-500 leading-none whitespace-nowrap">Daily Tracking</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">스팀 업데이트 자동 수집</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. PROBLEM STATEMENT ==================== */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold mb-5">
              Problem & Solution
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              왜 Patchlog를 만들었나요?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 h-full flex flex-col">
              <div className="grid grid-cols-1 gap-4 flex-1">
              {problemCards.map((problem, index) => {
                const isActive = activeProblem === index;
                return (
                  <button
                    key={problem.title}
                    type="button"
                    onClick={() => setActiveProblem(index)}
                    onMouseEnter={() => setActiveProblem(index)}
                    className={`group relative w-full min-h-[190px] text-left rounded-3xl border p-6 md:p-7 transition-all duration-300 flex flex-col overflow-hidden ${
                      isActive
                        ? "border-gray-900 dark:border-gray-200 shadow-lg -translate-y-1 bg-white dark:bg-gray-800/80"
                        : "border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:-translate-y-0.5 hover:shadow-md"
                    }`}
                    aria-pressed={isActive}
                  >
                    {index === 0 ? (
                      <div className="absolute -right-5 -bottom-5 w-[216px] h-[216px] opacity-100 pointer-events-none transition-transform duration-300 group-hover:scale-[1.2]">
                        <Image src="/images/spiderman.webp" alt="" fill className="object-contain" aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="absolute -right-5 -bottom-5 w-[216px] h-[216px] opacity-100 pointer-events-none transition-transform duration-300 group-hover:scale-[1.2]">
                        <Image src="/images/ironman.webp" alt="" fill className="object-contain" aria-hidden="true" />
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold border-gray-300/90 dark:border-gray-600/80 text-gray-700 dark:text-gray-300 mb-4 self-start">
                      {problem.label}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{problem.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{problem.summary}</p>
                  </button>
                );
              })}
              </div>

              <div className="flex items-center justify-center gap-2 px-1 mt-4">
                {problemCards.map((problem, index) => (
                  <button
                    key={`${problem.title}-dot`}
                    type="button"
                    onClick={() => setActiveProblem(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeProblem === index
                        ? "w-10 bg-hero-blue-500"
                        : "w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                    aria-label={`${problem.title} 선택`}
                  />
                ))}
              </div>
            </div>

            {/* Solution */}
            <div className="lg:col-span-5 h-full rounded-3xl border border-hero-blue-300/70 dark:border-hero-blue-500/50 bg-gradient-to-br from-hero-blue-50 via-cyan-50/50 to-white dark:from-hero-blue-950/40 dark:via-cyan-950/20 dark:to-gray-900 p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-hero-blue-300/90 dark:border-hero-blue-500/60 text-xs font-semibold text-hero-blue-700 dark:text-hero-blue-300 mb-5">
                Solution
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                이렇게 해결했어요
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                <span className="font-semibold text-gray-900 dark:text-white">{activeCard.title}</span>에서 생기는 문제를
                줄이기 위해, 패치노트를 자동으로 수집하고 맥락 중심으로 번역합니다.
              </p>
              <div className="h-px bg-gray-200/80 dark:bg-gray-700/80 mb-6" />

              <div className="rounded-2xl bg-white/80 dark:bg-gray-900/60 py-5 mb-5">
                <div className="inline-flex items-center px-2.5 py-1 rounded-full border border-hero-blue-300/80 dark:border-hero-blue-600/70 text-xs font-semibold text-hero-blue-700 dark:text-hero-blue-300 mb-3">
                  현재 선택된 문제
                </div>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{activeCard.painPoint}</p>
              </div>

              <div className="space-y-3">
                {activeCard.solution.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm md:text-base text-gray-700 dark:text-gray-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-hero-blue-500"></span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 3. HOW IT WORKS ==================== */}
      <section className="pt-24 pb-32 px-4" suppressHydrationWarning>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold mb-6">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              어떻게 작동하나요?
            </h2>
          </div>

          <div className="md:hidden space-y-4">
            {howItWorksSteps.map((step) => (
              <div
                key={`mobile-${step.id}`}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold tabular-nums bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                    {String(step.id).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                    {step.trackTitle}
                  </p>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line leading-6">
                  {step.trackDescription}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden md:grid md:grid-cols-12 gap-8 lg:gap-10 md:items-start">
            <div className="md:col-span-5 md:self-start md:sticky md:top-56 md:h-[430px]">
              <div className="relative h-[220px] sm:h-[260px] md:h-full">
                {howItWorksSteps.map((step, index) => {
                  const currentHowStep = isHowInteractiveReady ? activeHowStep : 0;
                  const isActive = index === currentHowStep;

                  return (
                    <article
                      key={step.id}
                      className={`absolute inset-0 rounded-3xl border-2 p-7 sm:p-8 transition-all duration-500 ease-out border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 ${
                        isActive
                          ? "opacity-100 blur-0 translate-y-0 scale-100 shadow-md"
                          : "opacity-0 blur-sm translate-y-2 scale-[0.985] pointer-events-none"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-5">
                        <span className="text-6xl sm:text-7xl font-black text-gray-200 dark:text-gray-700 tabular-nums leading-none">
                          {String(step.id).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4">
                        {step.title}
                      </h3>
                      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line mb-5">
                        {step.description}
                      </p>
                      {step.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {step.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {/* Stepper 전환 시 재사용 예정
                      <div className="absolute left-7 right-7 bottom-6">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                          <span>진행 단계</span>
                          <span>{currentHowStep + 1} / {howItWorksSteps.length}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div
                            className="h-full bg-hero-blue-500 transition-all duration-500"
                            style={{ width: `${((currentHowStep + 1) / howItWorksSteps.length) * 100}%` }}
                          />
                        </div>
                      </div>
                      */}
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-7 relative md:min-h-[380vh]">
              {howItWorksSteps.map((step, index) => {
                const currentHowStep = isHowInteractiveReady ? activeHowStep : 0;
                const isActive = index === currentHowStep;

                return (
                  <div
                    key={`${step.id}-track`}
                    ref={(node) => {
                      howTrackRefs.current[index] = node;
                    }}
                    data-step-index={index}
                    className={`h-[48vh] sm:h-[54vh] md:h-[72vh] flex items-center ${
                      index === 3 ? "mt-28 md:mt-44" : ""
                    }`}
                  >
                    <div
                      className={`w-full rounded-2xl border px-5 py-4 transition-all duration-300 ${
                        isActive
                          ? "border-gray-900 dark:border-gray-200 bg-white dark:bg-gray-800/95 shadow-md"
                          : "border-gray-200 dark:border-gray-700 bg-white/75 dark:bg-gray-800/60 opacity-50 blur-[1px]"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tabular-nums ${
                          isActive
                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        }`}>
                          {String(step.id).padStart(2, "0")}
                        </span>
                        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-tight">{step.trackTitle}</p>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 whitespace-pre-line leading-7">
                        {step.trackDescription}
                      </p>
                      {"examples" in step && step.examples.length > 0 ? (
                        step.id === 4 ? (
                          <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/40 p-3 sm:p-4">
                            <p className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase mb-3">
                              Rendering Rules
                            </p>
                            <div className="space-y-3">
                              {step.examples.map((example) => (
                                <div key={example.label} className="grid grid-cols-[10px_1fr] gap-2.5 items-start">
                                  <span className="mt-1.5 w-2.5 h-2.5 rounded-sm bg-gray-900 dark:bg-gray-200" />
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{example.label}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                      <span className="font-medium">입력:</span> {example.source}
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-0.5">
                                      <span className="font-medium">출력:</span> {example.result}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 space-y-3">
                            {step.examples.map((example) => (
                              <div
                                key={example.label}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40 p-3"
                              >
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                  {example.label}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                  <span className="font-medium text-gray-600 dark:text-gray-300">원문:</span> {example.source}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-1">
                                  <span className="font-medium">결과:</span> {example.result}
                                </p>
                              </div>
                            ))}
                          </div>
                        )
                      ) : null}
                      {step.id === 4 ? (
                        <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                          사용자는 긴 원문을 전부 읽지 않아도 버프·너프와 체감 변화 포인트를 빠르게 스캔할 수 있습니다.
                        </p>
                      ) : null}
                      {step.id === 5 ? (
                        <div className="mt-4 rounded-lg border border-hero-blue-300/80 dark:border-hero-blue-500/70 bg-hero-blue-50/80 dark:bg-hero-blue-950/30 px-3 py-2.5">
                          <p className="text-xs sm:text-sm font-semibold text-hero-blue-700 dark:text-hero-blue-300 leading-relaxed">
                            커스텀 프롬프트와 렌더링 규칙에 대한 피드백은 댓글로 남겨주시면 적극 반영하겠습니다.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. FINAL CTA ==================== */}
      <section className="py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-[2rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 sm:px-8 md:px-10 py-9 sm:py-11 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch">
              <div className="md:col-span-7">
                <p className="inline-flex items-center px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Daily Patchlog
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-10">
                  패치노트 확인, 여기서 끝
                </h2>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl space-y-3">
                  <p>
                    변경사항을 한국어로 읽기 쉽게 정리해 제공합니다.
                  </p>
                  <p className="md:whitespace-nowrap">
                    번역보다 중요한 건 맥락! 단순 직역이 아닌 게임 흐름에 맞춘 설명으로 이해를 돕습니다.
                  </p>
                </div>
                <Link
                  href="/patch"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-semibold text-sm sm:text-base transition-colors duration-200"
                >
                  <span>최신 패치노트 보기</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              <aside className="md:col-span-5 rounded-2xl overflow-hidden min-h-[280px] md:min-h-[350px]">
                <div className="relative w-full h-full min-h-[280px] md:min-h-[350px]">
                  <Image
                    src="/images/jeff.webp"
                    alt="오늘 확인할 내용 캐릭터 이미지"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
