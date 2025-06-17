import Link from "next/link";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 pb-1">
          Patchlog
        </h1>
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          스팀 게임의 업데이트 내역을 한글로 만나보세요.
        </p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="p-6 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            왜 한국에 서비스하는 게임인데 정작 패치노트는 영어뿐일까요?
          </h2>
          <p className="text-gray-600">
            많은 스팀 게임이 한국어를 지원하지만, 중요한 업데이트 내역은 여전히
            <span className="font-medium text-blue-600"> 영어로만 제공</span>
            되는게 현실입니다. 이로 인해 많은 한국어 사용자들이 게임의 최신
            소식과 변경사항을 놓치기 일쑤죠.
          </p>
        </div>

        <div className="p-6 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            게이머 친화적 번역
          </h2>
          <p className="text-gray-600">
            단순한 단어 대체가 아닌, 게임의 세계관과 캐릭터성을 살리는
            <span className="font-medium text-blue-600"> 문맥 기반 번역</span>을
            제공합니다. 패치 내용의 핵심을 놓치지 않으면서 이해하기 쉽게
            전달합니다.
          </p>
        </div>

        <div className="p-6 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            더 많은 게임, 더 나은 서비스
          </h2>
          <p className="text-gray-600">
            Marvel Rivals를 시작으로
            <span className="font-medium text-blue-600">
              {" "}
              다양한 스팀 게임의 패치노트
            </span>
            를 한글로 제공할 예정입니다.
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            href="/patch"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="최신 패치 보기"
          >
            <span className="font-medium">최신 패치 보기</span>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
