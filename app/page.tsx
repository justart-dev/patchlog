import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* First Screen - Hero & CTA */}
      <div className="min-h-screen flex flex-col">
        <div className="max-w-4xl mx-auto px-4 flex-1 flex flex-col justify-center">
          {/* Hero Section */}
          <div className="text-center mb-6 -mt-40">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-1">
              Patchlog
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium">
              게임 패치노트를 <span className="text-blue-600">한글로</span>,{" "}
              <span className="text-purple-600">간편하게</span>
            </p>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-72">
            <Link
              href="/patch"
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-xl font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
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
              <span className="font-semibold text-blue-600">
                {" "}
                영어로만 제공
              </span>
              되는게 현실입니다. 이로 인해 많은 한국어 사용자들이 게임의 최신
              소식과 변경사항을 놓치기 일쑤죠.
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center my-20">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-200"></div>
              <div className="px-6">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-200"></div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent mb-6 tracking-tight leading-tight">
              그래서 만들었습니다
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Steam API와 최신 AI 기술을 활용해 패치노트를 자동으로 수집하고
              번역하여
              <br />
              <span className="font-semibold text-blue-600">
                매일 한글 패치노트
              </span>
              를 제공하는 플랫폼입니다.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm font-medium text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>자동 수집</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                <span>AI 번역</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                <span>매일 업데이트</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="my-60">
          <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent mb-16 pb-4 tracking-tight leading-tight">
            서비스 특징
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-3">
                매일
              </div>
              <div className="text-base text-slate-600">자동 업데이트</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-3">
                AI
              </div>
              <div className="text-base text-slate-600">자동 번역</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-3">
                무료
              </div>
              <div className="text-base text-slate-600">서비스 이용</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-40">
          <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent mb-16 pb-4 tracking-tight leading-tight">
            주요 기능
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 hover:border-blue-200 transition-colors duration-300 shadow-sm hover:shadow-lg h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
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
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  자동화된 수집
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  매일 정해진 시간에 Steam API에서{" "}
                  <span className="font-semibold text-blue-600">자동으로</span>{" "}
                  최신 패치노트를 수집하여 놓치는 업데이트가 없습니다.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 hover:border-emerald-200 transition-colors duration-300 shadow-sm hover:shadow-lg h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
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
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  스마트 번역
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  게임의 맥락을 이해하는
                  <span className="font-semibold text-emerald-600">
                    AI 번역
                  </span>
                  으로 정확하고 자연스러운 한글 패치노트를 제공합니다.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 hover:border-purple-200 transition-colors duration-300 shadow-sm hover:shadow-lg h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
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
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  지속적 확장
                </h3>
                <p className="text-slate-600 text-base leading-relaxed">
                  Marvel Rivals를 시작으로{" "}
                  <span className="font-semibold text-purple-600">
                    더 많은 게임
                  </span>
                  의 패치노트를 한글로 제공할 예정입니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="my-60">
          <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent mb-16 pb-4 tracking-tight leading-tight">
            어떻게 작동하나요?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-blue-600"
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
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-purple-600"
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
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-emerald-600"
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
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-orange-600"
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
          <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent mb-16 pb-4 tracking-tight leading-tight">
            지원 게임
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Active Game */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
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
