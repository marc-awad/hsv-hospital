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
 <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); padding: 48px 32px; text-align: center;">
            <div style="background-color: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 50%; width: 64px; height: 64px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <svg style="width: 32px; height: 32px; color: white;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                </svg>
            </div>
            <h1 style="color: #ffffff; margin: 0 0 8px; font-size: 24px; font-weight: 700;">Appointment Confirmed</h1>
            <p style="color: rgba(219, 234, 254, 0.9); margin: 0; font-size: 16px;">HSV Hospital</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
            
            <!-- Success Message -->
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-flex; align-items: center; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; vertical-align: middle;">
                    <div style="color: #059669; font-size: 20px; margin-right: 12px; font-weight: bold;">✓</div>
                    <span style="color: #065f46; font-weight: 600;">Your appointment is confirmed!</span>
                </div>
            </div>

            <!-- Greeting -->
            <div style="margin-bottom: 24px;">
                <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 8px;">Hello <strong>${firstName} ${lastName}</strong>,</h2>
                <p style="color: #6b7280; margin: 0; line-height: 1.6;">Thank you for choosing HSV Hospital. Here are your appointment details:</p>
            </div>

            <!-- Appointment Details -->
            <div style="background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; margin-bottom: 32px;">
                <div style="background-color: #2563eb; padding: 16px; text-align: center;">
                    <h3 style="color: #ffffff; margin: 0; font-weight: 600;">Appointment Details</h3>
                </div>
                
                <div>
                    <div style="display: flex; align-items: center; padding: 16px; border-bottom: 1px solid #e5e7eb;">
                        <div style="background-color: #e0e7ff; border-radius: 8px; padding: 12px; margin-right: 16px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 18px;">🏥</span>
                        </div>
                        <div>
                            <div style="font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Specialty</div>
                            <div style="color: #111827; font-weight: 500; font-size: 16px;">${specialty}</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; padding: 16px; border-bottom: 1px solid #e5e7eb;">
                        <div style="background-color: #fef3c7; border-radius: 8px; padding: 12px; margin-right: 16px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 18px;">👨‍⚕️</span>
                        </div>
                        <div>
                            <div style="font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Doctor</div>
                            <div style="color: #111827; font-weight: 500; font-size: 16px;">${doctor}</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; padding: 16px; border-bottom: 1px solid #e5e7eb;">
                        <div style="background-color: #dbeafe; border-radius: 8px; padding: 12px; margin-right: 16px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 18px;">📅</span>
                        </div>
                        <div>
                            <div style="font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Date</div>
                            <div style="color: #111827; font-weight: 500; font-size: 16px;">${formattedDate}</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; padding: 16px;">
                        <div style="background-color: #fecaca; border-radius: 8px; padding: 12px; margin-right: 16px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 18px;">⏰</span>
                        </div>
                        <div>
                            <div style="font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Time</div>
                            <div style="color: #111827; font-weight: 500; font-size: 16px;">${time}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Important Notice -->
            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 32px; border-radius: 0 8px 8px 0;">
                <div style="display: flex; align-items: flex-start;">
                    <span style="font-size: 18px; margin-right: 12px; margin-top: 2px;">💡</span>
                    <div>
                        <h4 style="color: #92400e; margin: 0 0 4px; font-weight: 600; font-size: 16px;">Important</h4>
                        <p style="color: #78350f; margin: 0; font-size: 14px; line-height: 1.5;">Please arrive 15 minutes early with your ID and insurance card.</p>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="margin-bottom: 16px;">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: #ffffff; text-decoration: none; font-weight: 600; padding: 16px 32px; border-radius: 25px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4); transition: all 0.3s ease;">
                        Visit HSV Website
                    </a>
                </div>
                <div>
                    <a href="#" style="display: inline-block; background-color: transparent; color: #2563eb; text-decoration: none; font-weight: 500; padding: 12px 24px; border: 2px solid #2563eb; border-radius: 20px; margin: 0 8px; transition: all 0.3s ease;">
                        Track Appointments
                    </a>
                    <a href="#" style="display: inline-block; background-color: transparent; color: #059669; text-decoration: none; font-weight: 500; padding: 12px 24px; border: 2px solid #059669; border-radius: 20px; margin: 0 8px; transition: all 0.3s ease;">
                        Book New Appointment
                    </a>
                </div>
            </div>

            <!-- Website Info -->
            <div style="text-align: center; background-color: #f9fafb; border-radius: 8px; padding: 24px;">
                <p style="color: #6b7280; margin: 0 0 8px; font-size: 16px;">Need to manage your appointments?</p>
                <p style="font-size: 14px; color: #6b7280; margin: 0;">
                    Visit our website to track your appointments or book new ones.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #1f2937; padding: 32px; text-align: center;">
            <h3 style="color: #ffffff; margin: 0 0 8px; font-weight: 600; font-size: 18px;">HSV Hospital</h3>
            <p style="color: #9ca3af; margin: 0 0 16px; font-size: 14px; line-height: 1.6;">
                Visit our website to track your appointments or book new ones.
            </p>
            
            <hr style="border: none; border-top: 1px solid #374151; margin: 16px 0;">
            
            <p style="color: #6b7280; margin: 0; font-size: 12px; line-height: 1.5;">
                This is an automated email, please do not reply.<br>
                <a href="#" style="color: #9ca3af; text-decoration: underline;">Click here to unsubscribe</a>
            </p>
        </div>
    </div>
`,
    })
    return res.status(200).json({ message: "Email sent successfully" })
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    return res.status(500).json({ error: "Failed to send email" })
  }
}
