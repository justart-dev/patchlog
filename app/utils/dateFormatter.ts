const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function formatDateKST(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    ...options,
  }).format(new Date(value));
}

export function getKSTDayOfWeek(value: string | number | Date) {
  const date = new Date(value);
  return new Date(date.getTime() + KST_OFFSET_MS).getUTCDay();
}
