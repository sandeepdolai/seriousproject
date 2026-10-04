/**
 * Login-code email delivery.
 *
 * Real delivery uses Resend when RESEND_API_KEY is configured.
 * When the key is missing (current environment) we fall back to a dev code
 * that is returned to the caller so the frontend can surface it in the modal.
 */

export interface SendLoginCodeResult {
  sent: boolean;
  devCode?: string;
}

export async function sendLoginCode(
  email: string,
  code: string
): Promise<SendLoginCodeResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, devCode: code };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Pixelcut <onboarding@resend.dev>",
        to: [email],
        subject: "Your Pixelcut verification code",
        text: `Your verification code is ${code}. It expires in 10 minutes.`,
      }),
    });
    if (!res.ok) {
      throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] Failed to send login code, using dev fallback:", err);
    return { sent: false, devCode: code };
  }
}
