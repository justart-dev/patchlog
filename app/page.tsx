import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* First Screen - Hero & CTA */}
      <div className="min-h-screen flex flex-col">
        <div className="max-w-4xl mx-auto px-4 flex-1 flex flex-col justify-center">
          {/* Hero Section */}
          <div className="text-center mb-6 mt-10">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-4 pb-4">
              Patchlog
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium">
              게임 패치노트를{" "}
              <span className="text-indigo-700 font-semibold">한글로</span>,{" "}
              <span className="text-indigo-700 font-semibold">간편하게</span>
            </p>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-40">
            <Link
              href="/patch"
              className="group inline-flex items-center space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-xl font-semibold text-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>패치노트 확인하기</span>
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <p className="text-sm text-slate-500 mt-6">
              현재 Marvel Rivals 패치노트를 제공하고 있습니다
            </p>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full">
                <svg
                  className="w-4 h-4 text-slate-600 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Screen - Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        {/* Problem & Solution Statement */}
        <div className="text-center mb-32">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              왜 한국에 서비스하는 게임인데 정작 패치노트는 영어뿐일까요?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-12">
              많은 스팀 게임이 한국어를 지원하지만, 중요한 업데이트 내역은
              여전히
              <span className="font-semibold text-slate-900">
                {" "}
                영어로만 제공
              </span>
              되는게 현실입니다. 이로 인해 많은 한국어 사용자들이 게임의 최신
              소식과 변경사항을 놓치기 일쑤죠.
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center my-20">
              <div className="flex-1 h-px bg-slate-300"></div>
              <div className="px-6">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              </div>
              <div className="flex-1 h-px bg-slate-300"></div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
              그래서 만들었습니다
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Steam API와 최신 AI 기술을 활용해 패치노트를 자동으로 수집하고
              번역하여
              <br />
              <span className="font-semibold text-indigo-700">
                매일 한글 패치노트
              </span>
              를 제공하는 플랫폼입니다.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm font-medium text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>자동 수집</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>AI 번역</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>매일 업데이트</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="my-60">
          <div className="text-center mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
              주요 특징
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Steam API와 AI 기술을 결합한 자동화된 패치노트 번역 서비스
            </p>
          </div>

          {/* Detailed Features Grid */}
          <div className="space-y-6">
            <div className="group bg-white border border-slate-200 rounded-2xl p-4 md:p-6 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 min-h-[120px] md:min-h-[140px]">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                  자동화된 수집
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  매일 정해진 시간에 Steam API에서{" "}
                  <span className="font-semibold text-emerald-600">자동으로</span>{" "}
                  최신 패치노트를 수집하여 놓치는 업데이트가 없습니다.
                </p>
              </div>
              <div className="flex items-center text-xs md:text-sm text-emerald-600 font-medium flex-shrink-0 self-start md:self-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                24시간 자동 모니터링
              </div>
            </div>

            <div className="group bg-white border border-slate-200 rounded-2xl p-4 md:p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 min-h-[120px] md:min-h-[140px]">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                  스마트 번역
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  게임의 맥락을 이해하는{" "}
                  <span className="font-semibold text-indigo-600">GPT-4o</span>로
                  정확하고 자연스러운 한글 패치노트를 제공합니다.
                </p>
              </div>
              <div className="flex items-center text-xs md:text-sm text-indigo-600 font-medium flex-shrink-0 self-start md:self-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                게임 전문 번역
              </div>
            </div>

            <div className="group bg-white border border-slate-200 rounded-2xl p-4 md:p-6 hover:shadow-lg hover:border-amber-200 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 min-h-[120px] md:min-h-[140px]">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                  지속적 확장
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  Marvel Rivals를 시작으로{" "}
                  <span className="font-semibold text-amber-600">
                    더 많은 게임
                  </span>
                  의 패치노트를 한글로 제공할 예정입니다.
                </p>
              </div>
              <div className="flex items-center text-xs md:text-sm text-amber-600 font-medium flex-shrink-0 self-start md:self-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                게임 라이브러리 확장
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="my-60">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-16 tracking-tight leading-tight">
            어떻게 작동하나요?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                1. 자동 수집
              </h3>
              <p className="text-base text-slate-600">
                매일 Steam API에서 최신 패치노트를 자동으로 수집
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                2. AI 번역
              </h3>
              <p className="text-base text-slate-600">
                뛰어난 언어 이해력의 GPT-4o 모델과 게임 전용 파인 튜닝을 통해
                자연스러운 한글 번역 제공
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                3. 자동 저장
              </h3>
              <p className="text-base text-slate-600">
                번역된 패치노트를 데이터베이스에 저장
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                4. 웹사이트 제공
              </h3>
              <p className="text-base text-slate-600">
                매일 정해진 시간에 모든 과정을 자동 실행하여 유저들에게 제공
              </p>
            </div>
          </div>
        </div>

        {/* Game Library Preview */}
        <div className="my-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-16 tracking-tight leading-tight">
            지원 게임
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Active Game */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">활성</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Marvel Rivals</h3>
              <p className="text-sm text-slate-600 mb-4">
                매일 업데이트되는 패치노트
              </p>
            </div>

            {/* Coming Soon Games */}
            <div className="bg-white/60 rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-yellow-600">
                  준비중
                </span>
              </div>
              <h3 className="font-bold text-slate-700 mb-2">?</h3>

              <span className="text-sm text-slate-400">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
