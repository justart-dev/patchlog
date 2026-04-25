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
  note?: string;
  examples?: {
    label: string;
    lines: {
      prefix?: string;
      highlight: string;
      suffix?: string;
      tone?: "increase" | "decrease";
      style?: "underline" | "plain";
    }[];
  }[];
};

const stats = [
  { label: "TOTAL SEGMENTS", value: "60+" },
  { label: "CORE ADAPTATION", value: "AI-POWERED" },
  { label: "AUTO REFRESH", value: "12H CYCLE" },
] as const;

const problems = [
  {
    id: "01",
    title: "영문 원문의 파악 한계",
    summary: "빠르게 변화하는 패치 정보를 원문으로만 이해하기엔 시간이 부족합니다.",
    pain: "중요한 밸런스 수치와 핵심 기믹 변화를 놓칠 위험이 큽니다.",
    solution: [
      "데이터 중심의 수치 요약",
      "가독성 극대화된 문장 구조",
    ],
  },
  {
    id: "02",
    title: "맥락 없는 단순 번역",
    summary: "일반 번역기는 게임 내 용어와 플레이어들만의 언어를 이해하지 못합니다.",
    pain: "글자로만 된 패치노트는 이제 그만. 실제 플레이에 직결되는 핵심 포인트만 골라냈습니다.",
    solution: ["게임 용어 사전(Glossary) 연동", "스킬 및 키 입력 최적화"],
  },
] as const;

const steps: Step[] = [
  {
    step: "01",
    title: "SIGNAL DETECTION",
    description: "Steam API를 통한 실시간 패치 데이터 감지",
    trackTitle: "Steam 공지 스캔",
    detail: "매일 지정된 간격으로 Steam 서버의 신규 패치 데이터를 크롤링하여 데이터베이스에 적재합니다.",
  },
  {
    step: "02",
    title: "CORE EXTRACTION",
    description: "불필요한 정보를 제외한 핵심 변경점 추출",
    trackTitle: "원문 파싱 및 필터링",
    detail: "이미 처리된 로그를 제외하고, 실제 밸런스에 영향을 주는 핵심 내용만을 정제하여 번역 파이프라인에 전달합니다.",
  },
  {
    step: "03",
    title: "ADAPTIVE TRANSLATION",
    description: "GPT-4o 기반의 맥락형 게임 번역",
    trackTitle: "맥락 기반 번역 처리",
    detail: "단순 직역이 아닌, '마블 라이벌즈' 전용 용어 사전과 매핑 규칙을 적용하여 플레이어 친화적인 언어로 변환합니다.",
    tags: ["한국시간 변환", "용어 매핑", "조사 보정"],
  },
  {
    step: "04",
    title: "VISUAL OPTIMIZATION",
    description: "수치 변화 가독성을 위한 레이아웃 보정",
    trackTitle: "데이터 시각화 정리",
    detail: "증가/감소 수치를 시각적으로 명확히 구분하고, 스킬 단축키 등 핵심 정보를 하이라이트 처리합니다.",
    examples: [
      {
        label: "수치 변화",
        lines: [
          {
            prefix: "• 22 → 24 ",
            highlight: "증가",
            tone: "increase",
          },
          {
            prefix: "• 10초 → 8초 ",
            highlight: "감소",
            tone: "decrease",
          },
        ],
      },
      {
        label: "키 커맨드",
        lines: [
          {
            highlight: "제프 등장!",
            style: "underline",
            suffix: " (Q)",
          },
        ],
      },
    ],
  },
  {
    step: "05",
    title: "LIVE DEPLOY",
    description: "최종 검수된 데이터를 실시간 웹 배포",
    trackTitle: "시스템 실시간 배포",
    detail: "모든 처리가 완료된 패치노트는 자동으로 아카이브에 등록되어 누구나 즉시 확인할 수 있는 상태가 됩니다.",
  },
];

export default function Page() {
  const [patchCount, setPatchCount] = useState(0);
  const [activeProblem, setActiveProblem] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const target = 60;
    const duration = 1000;
    let startTime = 0;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      setPatchCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  const currentProblem = problems[activeProblem] ?? problems[0];
  const currentStep = steps[activeStep] ?? steps[0];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 px-6 sm:px-10 lg:px-20">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-archive-zinc-200 dark:border-archive-zinc-800 bg-white dark:bg-archive-zinc-900 px-3.5 py-2 mb-8 animate-hero-enter shadow-ambient">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-green animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-archive-zinc-500 leading-none">Sync Status</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.95] mb-8 animate-hero-enter">
            영문 패치노트를<br />
            <span className="text-hero-red-500 italic">CORE </span>로 읽다
          </h1>
          
          <p className="max-w-xl mx-auto text-archive-zinc-600 dark:text-archive-zinc-400 text-base sm:text-lg mb-10 leading-relaxed animate-hero-enter [animation-delay:100ms]">
            수동적인 번역을 넘어 핵심 변경사항을 추출하고 아카이빙합니다.<br />
            영문 패치의 모든 변화를 가장 정교한 한국어로 확인하세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-hero-enter [animation-delay:200ms]">
            <Link
              href="/patch"
              className="w-full sm:w-auto px-8 py-4 bg-archive-zinc-950 dark:bg-white text-white dark:text-archive-zinc-950 font-black text-sm tracking-tight rounded-full hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-xl shadow-black/10 dark:shadow-white/5"
            >
              ARCHIVE ACCESS
            </Link>
            <a
              href="#process"
              className="w-full sm:w-auto px-8 py-4 border border-archive-zinc-900/10 dark:border-white/10 bg-white/50 dark:bg-archive-zinc-900/50 backdrop-blur-sm text-archive-zinc-900 dark:text-white font-black text-sm tracking-tight rounded-full hover:bg-white dark:hover:bg-archive-zinc-800 hover:border-archive-zinc-900/20 dark:hover:border-white/20 transition-all shadow-sm active:scale-95 hover:scale-[1.02]"
            >
              HOW IT WORKS
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="glass-card p-8 group hover:border-hero-red-500/50 transition-colors">
              <p className="text-[10px] font-black tracking-widest text-archive-zinc-500 mb-2">{stat.label}</p>
              <p className="text-4xl font-black tracking-tighter">
                {stat.label === "TOTAL SEGMENTS" ? `${patchCount}+` : stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="px-6 py-24 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] text-hero-red-500 mb-4 uppercase">Operational Objective</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter leading-[1.1] mb-8">
                읽는 시간은 줄이고,<br />변화의 핵심에만 집중하세요
              </h2>
              
              <div className="space-y-3">
                {problems.map((item, index) => {
                  const isActive = activeProblem === index;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveProblem(index)}
                      className={`group w-full p-6 text-left rounded-2xl border transition-all duration-300 relative ${
                        isActive 
                        ? "bg-white dark:bg-archive-zinc-900 border-archive-zinc-200 dark:border-archive-zinc-800 shadow-xl" 
                        : "border-transparent opacity-50 hover:opacity-100 hover:bg-archive-zinc-50 dark:hover:bg-white/5"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-hero-red-500 rounded-r-full" />
                      )}
                      <div className="flex gap-4 items-start">
                        <span className={`font-mono text-xs font-bold ${isActive ? "text-hero-red-500" : "text-archive-zinc-400"}`}>
                          0{index + 1}
                        </span>
                        <div>
                          <h4 className={`font-black text-lg mb-1 transition-colors ${isActive ? "text-archive-zinc-950 dark:text-white" : "text-archive-zinc-600 dark:text-archive-zinc-400"}`}>
                            {item.title}
                          </h4>
                          <p className="text-sm text-archive-zinc-500 dark:text-archive-zinc-400 leading-relaxed">{item.summary}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-hero-red-500/5 blur-3xl rounded-full" />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-md bg-hero-red-500/10 text-hero-red-500 text-[10px] font-black tracking-widest mb-6 uppercase">Tactical Solution</span>
                <p className="text-xl font-bold leading-relaxed mb-8">{currentProblem.pain}</p>
                <div className="h-px bg-archive-zinc-200 dark:bg-archive-zinc-800 mb-8" />
                <ul className="space-y-4">
                  {currentProblem.solution.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold">
                      <svg className="w-5 h-5 text-hero-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section id="process" className="px-6 py-24 relative">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black tracking-[0.3em] text-hero-blue-500 mb-4 uppercase">Technical Workflow</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">데이터 처리 아키텍처</h2>
          </div>

          <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
            <div className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.step}
                  onClick={() => setActiveStep(index)}
                  className={`w-full p-5 text-left rounded-xl transition-all flex items-center justify-between group ${
                    activeStep === index 
                    ? "bg-archive-zinc-950 text-white shadow-lg" 
                    : "hover:bg-archive-zinc-100 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-mono font-bold transition-none ${activeStep === index ? "text-hero-blue-400" : "text-archive-zinc-400"}`}>
                      PHASE 0{index + 1}
                    </span>
                    <span className="font-black text-sm tracking-tight">{step.title}</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${activeStep === index ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="glass-card p-10 min-h-[450px] flex flex-col justify-between relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-[120px] font-black leading-none pointer-events-none tracking-tighter select-none">0{activeStep + 1}</span>
              </div>
              
              <div className="relative z-10">
                <p className="text-[10px] font-black tracking-widest text-hero-blue-500 mb-2 uppercase">{currentStep.trackTitle}</p>
                <h3 className="text-3xl font-black mb-4">{currentStep.title}</h3>
                <p className="text-archive-zinc-600 dark:text-archive-zinc-400 leading-relaxed mb-6">{currentStep.description}</p>
                
                <div className="p-6 rounded-2xl bg-archive-zinc-100/50 dark:bg-archive-zinc-900/50 border border-archive-zinc-200 dark:border-archive-zinc-800 mb-8">
                  <p className="text-sm font-medium leading-relaxed text-archive-zinc-700 dark:text-archive-zinc-300">{currentStep.detail}</p>
                </div>

                {currentStep.examples && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {currentStep.examples.map((ex) => (
                      <div key={ex.label} className="p-4 rounded-xl border border-archive-zinc-200 dark:border-archive-zinc-800 bg-white/50 dark:bg-archive-zinc-900/50">
                        <p className="text-[10px] font-black text-archive-zinc-400 mb-2 uppercase">{ex.label}</p>
                        {ex.lines.map((line, index) => {
                          const toneStyle =
                            line.tone === "increase"
                              ? {
                                  background: "linear-gradient(180deg, transparent 38%, rgba(219, 234, 254, 0.78) 38%)",
                                  boxShadow: "inset 0 -0.07em 0 rgba(191, 219, 254, 0.42)",
                                  color: "#1d4ed8",
                                  fontWeight: 700,
                                }
                              : line.tone === "decrease"
                                ? {
                                    background: "linear-gradient(180deg, transparent 38%, rgba(254, 242, 242, 0.82) 38%)",
                                    boxShadow: "inset 0 -0.07em 0 rgba(254, 202, 202, 0.42)",
                                    color: "#b91c1c",
                                    fontWeight: 700,
                                  }
                                : undefined;

                          return (
                            <div key={index} className="text-sm font-bold">
                              {line.prefix}
                              <span 
                                className={line.style === "underline" ? "underline decoration-2 underline-offset-4" : ""}
                                style={toneStyle}
                              >
                                {line.highlight}
                              </span>
                              {line.suffix}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-2">
                {currentStep.tags?.map(tag => (
                  <span key={tag} className="text-[10px] font-black px-2 py-1 rounded bg-archive-zinc-900/5 dark:bg-white/5 text-archive-zinc-500">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Patchlog Section */}
      <section className="px-6 py-24">
        <div className="group max-w-[1000px] mx-auto p-12 sm:p-20 text-center relative overflow-hidden transition-all duration-500">
          <div className="relative z-10">
            <p className="text-[10px] font-black tracking-[0.4em] text-hero-red-500 mb-8 uppercase">Daily Patchlog</p>
            <h2 className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 leading-[0.95]">
              최신 패치노트를<br />
              한눈에 확인하세요
            </h2>
            <p className="max-w-lg mx-auto text-archive-zinc-600 dark:text-archive-zinc-400 text-sm mb-12 leading-relaxed">
              변경사항을 한국어로 읽기 쉽게 정리해 제공합니다.<br />
              단순 번역이 아니라, 게임 맥락에 맞게 핵심을 이해하기 쉽게 정리합니다.
            </p>
            
            <Link
              href="/patch"
              className="inline-flex items-center gap-3 px-10 py-5 bg-archive-zinc-950 dark:bg-white text-white dark:text-archive-zinc-950 font-black tracking-[0.2em] uppercase text-xs rounded-full hover:scale-105 transition-all shadow-xl"
            >
              <span>최신 패치노트 보기</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
