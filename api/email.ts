import { Resend } from "resend"
import type { VercelRequest, VercelResponse } from "@vercel/node"

const resend = new Resend(process.env.RESEND_API_KEY || "")

interface AppointmentDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  specialty: string
  doctor: string
  date: string
  time: string
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, use POST" })
  }

  const { to, appointment } = req.body as {
    to: string
    appointment: AppointmentDetails
  }

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
      subject: `Your appointment confirmation for ${formattedDate} at ${time}`,
      html: `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="color: #1E40AF;">Your appointment is confirmed</h2>
    <p>Hello ${firstName} ${lastName},</p>
    <p>We are confirming your appointment with the following details:</p>
    <ul>
      <li><strong>Specialty:</strong> ${specialty}</li>
      <li><strong>Doctor:</strong> ${doctor}</li>
      <li><strong>Date:</strong> ${formattedDate}</li>
      <li><strong>Time:</strong> ${time}</li>
    </ul>
    <p>Thank you for choosing us.</p>
    <hr />
    <p style="font-size: 0.9em; color: #666;">
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
