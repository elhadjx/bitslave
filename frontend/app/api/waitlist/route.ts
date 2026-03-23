import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    console.log(`[Waitlist] New signup: ${email}`);

    // Send to Telegram if configured
    const botToken = "8750974870:AAH2ANTX2LsdB9thNr_SYjezq8oD83Bt7Ik";
    const chatId = "449743737";

    if (botToken && chatId) {
      try {
        const userAgent = req.headers.get("user-agent") || "Unknown Device";
        const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "Unknown Location";

        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const message = `🚀 New Waitlist Signup!\n\nEmail: ${email}\n🌍 Country: ${country}\n📱 Device: ${userAgent}`;

        const tgRes = await fetch(telegramUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        });

        if (!tgRes.ok) {
          console.error(`[Waitlist] Telegram API Error:`, await tgRes.text());
        } else {
          console.log(`[Waitlist] Notification sent to Telegram`);
        }
      } catch (tgError) {
        console.error(`[Waitlist] Failed to send to Telegram:`, tgError);
        // Do not fail the user's signup if Telegram notification fails
      }
    } else {
      console.log(`[Waitlist] Telegram not configured. Skipping notification.`);
    }

    return NextResponse.json({ success: true, message: "Added to waitlist" });
  } catch (error) {
    console.error(`[Waitlist] Error:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
