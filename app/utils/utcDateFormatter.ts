const MONTHS: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const MONTH_PATTERN = Object.keys(MONTHS).join("|");
const DATE_PART_SOURCE =
  `(${MONTH_PATTERN})\\s+` +
  `(\\d{1,2})(?:st|nd|rd|th)?,\\s*` +
  `(\\d{4}),?\\s*(?:at\\s*)?`;
const TIME_PART_SOURCE = `(\\d{1,2})\\s*:\\s*(\\d{2})\\s*:\\s*(\\d{2})`;
const FULL_UTC_TIMESTAMP_SOURCE =
  `\\b${DATE_PART_SOURCE}${TIME_PART_SOURCE}\\s*\\(UTC\\)`;
const UTC_RANGE_WITH_SHARED_ZONE = new RegExp(
  `\\b${DATE_PART_SOURCE}${TIME_PART_SOURCE}\\s+to\\s+${DATE_PART_SOURCE}${TIME_PART_SOURCE}\\s*\\(UTC\\)`,
  "g"
);
const TIME_ONLY_UTC_TIMESTAMP_SOURCE =
  `\\b(\\d{1,2})\\s*:\\s*(\\d{2})\\s*:\\s*(\\d{2})\\s*\\(UTC\\)`;

const UTC_TIMESTAMP = new RegExp(
  `${FULL_UTC_TIMESTAMP_SOURCE}|${TIME_ONLY_UTC_TIMESTAMP_SOURCE}`,
  "g"
);

function formatKoreanKst(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    hour: "numeric",
    hour12: true,
  }).format(date);
}

function utcDateFromParts(
  monthName: string,
  day: string,
  year: string,
  hour: string,
  minute: string,
  second: string
) {
  return new Date(
    Date.UTC(
      Number(year),
      MONTHS[monthName],
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    )
  );
}

export function convertUtcDateTimesToKorean(content: string) {
  let activeUtcDate: { monthName: string; day: string; year: string } | null = null;

  const contentWithRangesConverted = content.replace(
    UTC_RANGE_WITH_SHARED_ZONE,
    (
      _match,
      startMonth,
      startDay,
      startYear,
      startHour,
      startMinute,
      startSecond,
      endMonth,
      endDay,
      endYear,
      endHour,
      endMinute,
      endSecond
    ) => {
      activeUtcDate = { monthName: endMonth, day: endDay, year: endYear };
      return `${formatKoreanKst(
        utcDateFromParts(
          startMonth,
          startDay,
          startYear,
          startHour,
          startMinute,
          startSecond
        )
      )} to ${formatKoreanKst(
        utcDateFromParts(endMonth, endDay, endYear, endHour, endMinute, endSecond)
      )}`;
    }
  );

  return contentWithRangesConverted.replace(
    UTC_TIMESTAMP,
    (
      match,
      monthName,
      day,
      year,
      fullHour,
      fullMinute,
      fullSecond,
      timeOnlyHour,
      timeOnlyMinute,
      timeOnlySecond
    ) => {
      if (monthName) {
        activeUtcDate = { monthName, day, year };
        return formatKoreanKst(
          utcDateFromParts(monthName, day, year, fullHour, fullMinute, fullSecond)
        );
      }

      if (!activeUtcDate) return match;

      return formatKoreanKst(
        utcDateFromParts(
          activeUtcDate.monthName,
          activeUtcDate.day,
          activeUtcDate.year,
          timeOnlyHour,
          timeOnlyMinute,
          timeOnlySecond
        )
      );
    }
  );
}
