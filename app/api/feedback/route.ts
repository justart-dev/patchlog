import { NextResponse } from "next/server";

const TYPES = ["버그", "제안", "기타"] as const;
const MAX_MESSAGE = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FEEDBACK_EMAIL = process.env.FEEDBACK_EMAIL || "hbd9425@gmail.com";
const FROM_EMAIL = process.env.FEEDBACK_FROM || "Patchlog <onboarding@resend.dev>";

const ACCENT: Record<string, string> = {
  버그: "#e51d3a",
  제안: "#2563eb",
  기타: "#52525b",
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function renderHtml(payload: {
  type: string;
  message: string;
  email: string | null;
  userAgent: string;
}) {
  const accent = ACCENT[payload.type] ?? ACCENT["기타"];
  const message = escapeHtml(payload.message);
  const metaRows = [
    ["답변받을 이메일", payload.email ?? "미입력"],
    ["브라우저", payload.userAgent],
  ]
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:4px 0;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#a1a1aa;width:140px;vertical-align:top">${escapeHtml(label)}</td>
          <td style="padding:4px 0;font-size:12px;color:#71717a;word-break:break-all">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="ko">
  <body style="margin:0;padding:24px 12px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;border-collapse:separate;overflow:hidden">
      <tr>
        <td style="padding:22px 24px;border-bottom:1px solid #e4e4e7">
          <p style="margin:0 0 10px;font-size:10px;font-weight:800;letter-spacing:0.28em;text-transform:uppercase;color:#a1a1aa">Patchlog</p>
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:10px">
                <h1 style="margin:0;font-size:19px;font-weight:800;letter-spacing:-0.02em;color:#18181b">새 피드백</h1>
              </td>
              <td>
                <span style="display:inline-block;padding:3px 8px;border-radius:3px;background:${accent}14;color:${accent};font-size:11px;font-weight:800;letter-spacing:0.06em">${escapeHtml(payload.type)}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:24px">
          <div style="border-left:3px solid ${accent};padding:2px 0 2px 16px;">
            <p style="margin:0;font-size:14px;line-height:1.75;color:#3f3f46;white-space:pre-wrap;word-break:break-word">${message}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 20px;border-top:1px solid #f4f4f5">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${metaRows}</table>
        </td>
      </tr>
    </table>
    <p style="max-width:560px;margin:12px auto 0;font-size:11px;color:#a1a1aa;text-align:center">패치로그 피드백 폼에서 발송됨</p>
  </body>
</html>`;
}

function renderText(payload: {
  type: string;
  message: string;
  email: string | null;
  userAgent: string;
}) {
  return [
    `[패치로그] ${payload.type} 피드백`,
    "",
    payload.message,
    "",
    `답변받을 이메일: ${payload.email ?? "미입력"}`,
    `브라우저: ${payload.userAgent}`,
  ].join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[feedback] RESEND_API_KEY is missing");
    return NextResponse.json(
      { error: "피드백 수신 설정이 완료되지 않았습니다." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const type = TYPES.includes(body.type) ? body.type : "기타";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? "-";

  if (message.length < 5) {
    return NextResponse.json({ error: "내용을 5자 이상 적어주세요." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "내용이 너무 깁니다." }, { status: 400 });
  }
  if (email && !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "이메일 형식을 확인해주세요." }, { status: 400 });
  }

  const payload = { type, message, email: email || null, userAgent };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [FEEDBACK_EMAIL],
        subject: `[패치로그] ${type} 피드백`,
        html: renderHtml(payload),
        text: renderText(payload),
        ...(email ? { reply_to: email } : {}),
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error("[feedback] resend failed:", response.status, await response.text());
      return NextResponse.json(
        { error: "전송에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[feedback] resend error:", error);
    return NextResponse.json(
      { error: "전송에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 502 }
    );
  }
}
