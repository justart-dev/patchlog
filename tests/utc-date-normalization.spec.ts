import { expect, test } from "@playwright/test";

import { convertUtcDateTimesToKorean } from "../app/utils/utcDateFormatter";

test.describe("UTC date localization", () => {
  test("converts full Steam UTC timestamps to KST Korean date text", () => {
    const source = "April 30th, 2026, at 09 : 00 : 00 (UTC)";

    expect(convertUtcDateTimesToKorean(source)).toBe("4월 30일 오후 6시");
  });

  test("uses the nearest prior date for time-only UTC ranges", () => {
    const source = "Event Period: April 30th, 2026, at 09 : 00 : 00 (UTC) to 03 : 00 : 00 (UTC)";

    expect(convertUtcDateTimesToKorean(source)).toBe("Event Period: 4월 30일 오후 6시 to 4월 30일 오후 12시");
  });

  test("converts Steam date ranges that share one UTC marker at the end", () => {
    const source = "Event Period: April 30th, 2026, 09 : 00 : 00 to May 28th, 2026, 09 : 00 : 00 (UTC)";

    expect(convertUtcDateTimesToKorean(source)).toBe(
      "Event Period: 4월 30일 오후 6시 to 5월 28일 오후 6시"
    );
  });

  test("uses each nearest prior full date instead of the last full date globally", () => {
    const source = [
      "A: April 30th, 2026, at 09 : 00 : 00 (UTC) to 03 : 00 : 00 (UTC)",
      "B: May 1st, 2026, at 2 : 00 : 00 (UTC) to 09 : 00 : 00 (UTC)",
    ].join("\n");

    expect(convertUtcDateTimesToKorean(source)).toContain(
      "A: 4월 30일 오후 6시 to 4월 30일 오후 12시"
    );
    expect(convertUtcDateTimesToKorean(source)).toContain(
      "B: 5월 1일 오전 11시 to 5월 1일 오후 6시"
    );
  });

  test("handles date rollover from UTC to KST", () => {
    const source = "Available From: May 1st, 2026, at 2 : 00 : 00 (UTC)";

    expect(convertUtcDateTimesToKorean(source)).toBe("Available From: 5월 1일 오전 11시");
  });
});
