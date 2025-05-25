// pages/api/send-verification-code.js
import SibApiV3Sdk from "sib-api-v3-sdk"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  if (!process.env.SENDINBLUE_API_KEY) {
    return res.status(500).json({ error: "API key not configured" })
  }

  const { to, appointment } = req.body
  if (!to || !appointment) {
    return res.status(400).json({ error: "Missing data" })
  }

  const { firstName, lastName, appointmentStart, doctorName, specialtyId } =
    appointment

  // Generate a 6-digit code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString()

  const formatSpecialty = (s) =>
    s === "generalmedicine"
      ? "General Medicine"
      : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

  const formatDate = (timestamp) => {
    const d = new Date(timestamp.seconds * 1000)
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Europe/Paris",
    })
  }

  const formatTime = (timestamp) => {
    const d = new Date(timestamp.seconds * 1000)
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Europe/Paris",
    })
  }

  try {
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      process.env.SENDINBLUE_API_KEY
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; background: #f9f9f9; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .content { padding: 30px; }
          .card { border: 1px solid #ddd; border-radius: 6px; padding: 20px; margin: 20px 0; background: #f8f8f8; }
          .code-box { background: #ff4444; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; color: #856404; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>🚨 Appointment Cancellation Request</h2>
            <p>Hello ${firstName} ${lastName},</p>
            <p>You have requested to cancel your medical appointment:</p>
            
            <div class="card">
              <strong>Appointment Details:</strong><br>
              <strong>Specialty:</strong> ${formatSpecialty(specialtyId)}<br>
              <strong>Doctor:</strong> Dr. ${doctorName}<br>
              <strong>Date:</strong> ${formatDate(appointmentStart)}<br>
              <strong>Time:</strong> ${formatTime(appointmentStart)}
            </div>
            
            <div class="code-box">
              <p style="margin-top: 0;">Your verification code:</p>
              <div class="code">${verificationCode}</div>
            </div>

            <div class="warning">
              <strong>⚠️ Important:</strong><br>
              • This code expires in 10 minutes<br>
              • Only use this code if you truly want to cancel your appointment<br>
              • Cancellation is final and cannot be undone
            </div>

            <p>If you did not request this cancellation, please ignore this message.</p>
          </div>

          <div class="footer">
            <strong>HSV Hospital</strong><br>
            Your health, our priority
          </div>
        </div>
      </body>
      </html>
    `

    const emailData = {
      sender: { name: "HSV Hospital", email: "mail.hsv.hospital@gmail.com" },
      to: [{ email: to, name: `${firstName} ${lastName}` }],
      subject: `🔐 Verification Code for Cancellation - ${verificationCode}`,
      htmlContent,
    }

    const response = await apiInstance.sendTransacEmail(emailData)

    return res.status(200).json({
      message: "Verification code sent successfully",
      messageId: response.messageId,
      verificationCode, // In production, don't return the code
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    })
  } catch (error) {
    console.error("Email sending error:", error)
    return res.status(500).json({
      error: "Failed to send verification code",
      details: error.response?.body || error.message,
    })
  }
}
