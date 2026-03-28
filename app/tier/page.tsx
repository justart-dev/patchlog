import Image from "next/image";
import { tierCharts } from "./tierCharts";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));

const seasonTips = {
  summary:
    "이번 시즌은 그루트, 제프, 헐크처럼 안정적으로 값이 나오는 픽이 특히 좋습니다. 손에 익으면 스파이더맨과 데드풀 같은 상위 티어 캐리 픽도 높은 보상을 기대할 수 있습니다.",
  practiceHeroes: [
    {
      name: "그루트",
      description:
        "안정적으로 팀 기여를 만들기 좋아 시즌 적응용으로 가장 무난한 연습 픽입니다.",
    },
    {
      name: "제프",
      description:
        "운영 난도가 과하게 높지 않으면서 존재감이 커서 연습 효율이 좋습니다.",
    },
    {
      name: "헐크",
      description:
        "전면 압박과 이니시 감각을 익히기 좋고, 티어 대비 체감 성능도 좋은 편입니다.",
    },
  ],
  sleeperHeroes: [
    {
      name: "그루트",
      description:
        "안정성 대비 성능이 좋아 가장 무난하게 꺼내기 좋은 꿀픽에 가깝습니다.",
    },
    {
      name: "베놈",
      description:
        "진입 타이밍만 익히면 한타 개시와 압박에서 값이 잘 나오는 편입니다.",
    },
    {
      name: "데드풀",
      description:
        "상위 티어에 맞는 캐리력이 확실해서 손에 익으면 보상이 큰 픽입니다.",
    },
  ],
};

export default function TierPage() {
  const latestChart = tierCharts[0];

  return (
    <div className="relative overflow-x-clip bg-slate-50 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.16),transparent_45%),radial-gradient(circle_at_92%_12%,rgba(248,61,84,0.12),transparent_35%)] dark:bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.28),transparent_45%),radial-gradient(circle_at_92%_12%,rgba(248,61,84,0.2),transparent_35%)]" />

      <div className="relative mx-auto w-full max-w-[1320px] space-y-8 px-6 sm:px-10 lg:px-20 xl:px-28 2xl:px-36 md:space-y-10">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 px-6 py-10 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-8 md:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Season Tier
          </p>
          <h1 className="mt-5 text-xl font-black leading-tight text-slate-900 dark:text-white sm:text-3xl md:text-5xl">
            마블 라이벌즈 시즌 티어표
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base md:text-lg">
            시즌마다 달라지는 핵심 픽과 메타 흐름을 한 장의 티어표로 빠르게
            확인할 수 있습니다.
          </p>
        </section>

        {latestChart ? (
          <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-6">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Latest Chart
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  {latestChart.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {latestChart.description}
                </p>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <p>{latestChart.seasonLabel}</p>
                <p>{formatDate(latestChart.updatedAt)} 업데이트</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={latestChart.imageSrc}
                  alt={latestChart.imageAlt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  priority
                />
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Season Tip
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                이번 시즌 팁
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                {seasonTips.summary}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Practice Picks
                      </p>
                      <h4 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                        이번 시즌에 연습할 만한 캐릭터
                      </h4>
                    </div>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                      추천
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {seasonTips.practiceHeroes.map((hero) => (
                      <div
                        key={hero.name}
                        className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/60"
                      >
                        <p className="text-base font-black text-slate-900 dark:text-white">
                          {hero.name}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {hero.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Sleeper Picks
                      </p>
                      <h4 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                        이번 시즌 꿀캐릭터
                      </h4>
                    </div>
                    <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-950">
                      주목
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {seasonTips.sleeperHeroes.map((hero) => (
                      <div
                        key={hero.name}
                        className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/60"
                      >
                        <p className="text-base font-black text-slate-900 dark:text-white">
                          {hero.name}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {hero.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white/85 p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/75 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              No Charts Yet
            </p>
            <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              첫 시즌 티어표를 기다리고 있습니다
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              다음부터는 이미지를 <code>public/images/tier/</code>에 넣고{" "}
              <code>app/tier/tierCharts.ts</code>에 항목만 추가하면 페이지에
              자동으로 노출됩니다.
            </p>
          </section>
        )}

      </div>
    </div>
  );
}
