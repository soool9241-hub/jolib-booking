import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const SOLAPI_API_KEY = Deno.env.get("SOLAPI_API_KEY") ?? "";
const SOLAPI_API_SECRET = Deno.env.get("SOLAPI_API_SECRET") ?? "";
const SOLAPI_SENDER = Deno.env.get("SOLAPI_SENDER") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function generateSignature(date: string, salt: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(date + salt));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateSalt(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { booking } = await req.json();
    if (!booking || !booking.phone) {
      return new Response(JSON.stringify({ error: "No booking data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payLabel = booking.payment === "transfer" ? "계좌이체" : "카드결제";
    const priceStr = (booking.total_price ?? 0).toLocaleString() + "원";
    const bankInfo = booking.payment === "transfer"
      ? "\n\n💰 입금 계좌\n카카오뱅크 3333-06-4749542 임솔\n예약자명으로 입금해주세요!"
      : "\n\n💳 현장에서 카드결제 해주세요!";

    const message =
      `[조립공간] 예약 안내\n\n` +
      `📅 ${booking.date} ${booking.time}\n` +
      `👤 ${booking.name}님 (${booking.count}명)\n` +
      `💵 ${payLabel} ${priceStr}` +
      bankInfo +
      `\n\n완주 정월대보름 축제에서 만나요! 🧩`;

    // Solapi HMAC-SHA256 인증
    const date = new Date().toISOString();
    const salt = generateSalt();
    const signature = await generateSignature(date, salt, SOLAPI_API_SECRET);

    const authHeader = `HMAC-SHA256 apiKey=${SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;

    const smsRes = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        message: {
          to: booking.phone.replace(/-/g, ""),
          from: SOLAPI_SENDER,
          text: message,
        },
      }),
    });

    const smsData = await smsRes.json();

    return new Response(JSON.stringify({ success: true, data: smsData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
