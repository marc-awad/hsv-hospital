// api/email.js
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "")

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, use POST" })
  }

  const { to, appointment } = req.body

  if (!to || !appointment) {
    return res.status(400).json({ error: "Missing to or appointment in body" })
  }

  const { firstName, lastName, specialty, doctor, date, time } = appointment

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: `Your appointment confirmation for ${formattedDate} at ${time} - HSV Hospital`,
      html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1F2937; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px; background-color: #F9FAFB;">
    <h2 style="color: #2563EB; text-align: center; margin-bottom: 20px;">Your Appointment is Confirmed!</h2>
    <p>Hello <strong>${firstName} ${lastName}</strong>,</p>
    <p>Thank you for choosing <strong>HSV Hospital</strong>. Here are the details of your appointment:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tbody>
        <tr style="background-color: #E0E7FF;">
          <td style="padding: 10px; font-weight: 600;">Specialty</td>
          <td style="padding: 10px;">${specialty}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: 600; background-color: #E0E7FF;">Doctor</td>
          <td style="padding: 10px;">${doctor}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: 600;">Date</td>
          <td style="padding: 10px;">${formattedDate}</td>
        </tr>
        <tr style="background-color: #E0E7FF;">
          <td style="padding: 10px; font-weight: 600;">Time</td>
          <td style="padding: 10px;">${time}</td>
        </tr>
      </tbody>
    </table>
    <p>If you have any questions or need to reschedule, please feel free to contact us.</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="https://hsvhospital.example.com" target="_blank" style="display: inline-block; background-color: #2563EB; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">Visit our website</a>
    </p>
    <hr style="border: none; border-top: 1px solid #D1D5DB; margin: 20px 0;" />
    <p style="font-size: 0.85em; color: #6B7280; text-align: center;">
      This is an automated email, please do not reply.
    </p>
  </div>
`,
    })
    return res.status(200).json({ message: "Email sent successfully" })
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    return res.status(500).json({ error: "Failed to send email" })
  }
}
