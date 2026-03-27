"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Step = {
  step: string;
  title: string;
  description: string;
  trackTitle: string;
  detail: string;
  tags?: string[];
};

const stats = [
  { label: "번역된 패치노트", value: "60+" },
  { label: "모델 품질", value: "GPT-5" },
  { label: "업데이트 감시", value: "Daily" },
] as const;

const problems = [
  {
    id: "01",
    title: "영어라 못읽겠어요.",
    summary: "변경점을 빠르게 읽기 어려워 업데이트 의미를 놓치기 쉽습니다.",
    pain: "읽는 데 시간이 오래 걸리고 핵심 변화가 눈에 잘 안 들어옵니다.",
    solution: [
      "숫자/효과/조건 중심으로 구조화",
      "업데이트 맥락이 보이는 문장 흐름",
    ],
    image: "/images/spiderman.webp",
  },
  {
    id: "02",
    title: "일반 번역기는 무슨 말인지 모르겠어요.",
    summary: "직역 위주라 게임 용어와 밸런스 맥락이 깨지는 경우가 많습니다.",
    pain: "기계적인 번역은 실제 플레이에 필요한 정보를 놓치게 만듭니다.",
    solution: ["게임 용어 사전 기반 번역", "버프/너프 맥락 유지"],
    image: "/images/ironman.webp",
  },
] as const;

const steps: Step[] = [
  {
    step: "01",
    title: "Steam API 모니터링",
    description: "최신 공지를 자동으로 감시합니다.",
    trackTitle: "신규 공지 확인",
    detail: "매일 Steam에서 새로운 패치노트가 올라왔는지 확인하고 후보를 수집합니다.",
  },
  {
    step: "02",
    title: "새 패치노트 감지",
    description: "중복을 제거하고 신규 글만 선별합니다.",
    trackTitle: "원문 수집 및 정리",
    detail: "이미 저장된 글은 제외하고 새로 올라온 패치노트만 번역 파이프라인에 투입합니다.",
  },
  {
    step: "03",
    title: "GPT-5-mini 번역",
    description: "커스텀 프롬프트로 문맥 번역합니다.",
    trackTitle: "맥락 기반 번역 처리",
    detail: "게임 용어와 한국어 표현 규칙을 반영해 직역보다 이해 중심의 결과를 만듭니다.",
    tags: ["한국시간 변환", "용어 매핑", "커뮤니티 톤"],
  },
  {
    step: "04",
    title: "렌더링 커스터마이징",
    description: "핵심 수치와 효과를 강조 표시합니다.",
    trackTitle: "가독성 후처리",
    detail: "버프/너프, 신규 효과, 스킬명처럼 중요한 정보가 먼저 보이도록 UI를 후처리합니다.",
  },
  {
    step: "05",
    title: "웹사이트 자동 반영",
    description: "완료 즉시 사이트에 공개합니다.",
    trackTitle: "자동 반영 및 공개",
    detail: "처리된 결과를 바로 반영해 사용자가 항상 최신 패치노트를 확인할 수 있게 유지합니다.",
  },
];

export default function Page() {
  const [patchCount, setPatchCount] = useState(0);
  const [activeProblem, setActiveProblem] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const target = 60;
    const duration = 1400;
    let frameId = 0;
    let startTime = 0;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setPatchCount(Math.floor(progress * target));
      if (progress < 1) frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const currentProblem = problems[activeProblem] ?? problems[0];
  const currentStep = steps[activeStep] ?? steps[0];

  return (
    <main className="relative overflow-x-clip bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.2),transparent_45%),radial-gradient(circle_at_90%_15%,rgba(248,61,84,0.18),transparent_38%),radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.03),transparent_55%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.35),transparent_45%),radial-gradient(circle_at_90%_15%,rgba(248,61,84,0.32),transparent_38%),radial-gradient(circle_at_50%_50%,rgba(148,163,184,0.08),transparent_55%)]" />

      <section className="relative px-6 pb-20 pt-16 sm:px-10 sm:pb-24 sm:pt-20 lg:px-20 xl:px-28 2xl:px-36">
        <div className="mx-auto grid w-full max-w-[1320px] gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              영어 패치노트,
              <br />
              <span className="bg-gradient-to-r from-hero-blue-500 via-sky-500 to-cyan-400 bg-clip-text text-transparent">한국어로 바로 이해</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              자동 수집부터 맥락 번역, 가독성 렌더링까지 한 번에 처리해 핵심 변경점만 빠르게 확인할 수 있게 만듭니다.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/patch"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                최신 패치노트 보기
              </Link>
              <a
                href="#process"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                작동 방식 보기
              </a>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900/80">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-hero-blue-500/15 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-hero-red-500/15 blur-2xl" />
              <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">RECOMMENDED FOR</p>
              <h2 className="mt-2 text-2xl font-black leading-tight">이런 분께 추천해요</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-hero-blue-500" />
                  <span>영어 패치노트가 부담스러운 유저</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-hero-blue-500" />
                  <span>버프/너프 핵심만 빠르게 보고 싶은 유저</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-hero-blue-500" />
                  <span>업데이트 후 바로 플레이 판단이 필요한 유저</span>
                </li>
              </ul>
              <div className="relative mt-5 h-56 w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/jeff.webp"
                  alt="패치노트 요약을 상징하는 캐릭터 이미지"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-24 grid w-full max-w-[1320px] gap-3 sm:mt-28 sm:grid-cols-3">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="group relative rounded-2xl border border-slate-200 bg-white/90 px-5 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
            >
              <p className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
                {stat.label === "번역된 패치노트" ? `${patchCount}+` : stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-20 xl:px-28 2xl:px-36">
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Problem & Solution</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Patchlog가 무엇을 해결하나요?</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-6 space-y-5">
              {problems.map((item, index) => {
                const isActive = index === activeProblem;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setActiveProblem(index)}
                    onFocus={() => setActiveProblem(index)}
                    onClick={() => setActiveProblem(index)}
                    className={`group w-full min-h-[170px] rounded-2xl border px-5 py-6 text-left transition-all duration-300 ${
                      isActive
                        ? "border-hero-blue-500 bg-white text-slate-900 shadow-lg dark:bg-slate-900 dark:text-slate-100"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    <p className="text-xs font-black tracking-[0.18em] text-slate-400">PROBLEM {item.id}</p>
                    <p className="mt-3 text-base font-bold leading-relaxed">{item.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.summary}</p>
                  </button>
                );
              })}
            </div>

            <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-6">
              <p className="text-xs font-black tracking-[0.18em] text-slate-400">SOLUTION</p>
              <h3 className="mt-4 text-2xl font-black">이렇게 해결했어요!</h3>
              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-slate-600 dark:text-slate-300">패치노트를 자동으로 수집하고, 맥락 중심으로 번역해드려요.</p>
              <div className="mt-6 h-px bg-slate-200 dark:bg-slate-700" />
              <div className="mt-6 inline-flex rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-600 dark:text-slate-400">
                현재 선택된 문제
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{currentProblem.pain}</p>
              <ul className="mt-6 space-y-3">
                {currentProblem.solution.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <span className="h-2.5 w-2.5 rounded-full bg-hero-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="process" className="px-6 pb-16 pt-8 sm:px-10 sm:pb-24 lg:px-20 xl:px-28 2xl:px-36">
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">How It Works</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Patchlog가 어떻게 작동하나요?</h2>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {steps.map((item, index) => (
              <button
                key={item.step}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  activeStep === index
                    ? "border-hero-blue-500 bg-hero-blue-50 text-hero-blue-700 dark:bg-hero-blue-950/30 dark:text-hero-blue-200"
                    : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                {item.step} {item.title}
              </button>
            ))}
          </div>

          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-xl font-black">{currentStep.title}</h3>
            <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">{currentStep.description}</p>
              {currentStep.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {currentStep.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-300 px-2.5 py-1 text-xs font-medium dark:border-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm font-semibold">{currentStep.trackTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{currentStep.detail}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10 sm:pb-28 lg:px-20 xl:px-28 2xl:px-36">
        <div className="mx-auto grid w-full max-w-[1320px] gap-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50/40 px-4 py-10 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/70 sm:px-6 md:grid-cols-12 md:items-center lg:px-10">
          <div className="md:col-span-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Daily Patchlog</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 dark:text-slate-100 sm:text-4xl">패치노트 확인, 여기서 끝 !</h2>
            <div className="mt-4 max-w-2xl space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              <p>변경사항을 한국어로 읽기 쉽게 정리해 제공합니다.</p>
              <p>번역보다 중요한 건 맥락! 단순 직역이 아닌 게임 흐름에 맞춘 설명으로 이해를 돕습니다.</p>
            </div>
            <Link
              href="/patch"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-black hover:shadow-md dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <span>지금 확인하기</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <aside className="relative md:col-span-4">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl aspect-[16/9]">
              <Image
                src="/images/jeff.webp"
                alt="패치로그 상어 캐릭터 이미지"
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 90vw, 35vw"
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
