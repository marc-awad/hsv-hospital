import SibApiV3Sdk from "sib-api-v3-sdk"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed, use POST" })
  }

  // Check if API key exists
  if (!process.env.SENDINBLUE_API_KEY) {
    return res.status(500).json({ error: "API key not configured" })
  }

  const { to, appointment } = req.body
  if (!to || !appointment) {
    return res.status(400).json({ error: "Missing data" })
  }

  const { firstName, lastName, specialty, doctor, date, time } = appointment
  if (!firstName || !lastName || !specialty || !doctor || !date || !time) {
    return res.status(400).json({ error: "Incomplete appointment details" })
  }

  // Utility functions for formatting
  const formatSpecialty = (specialty) => {
    if (specialty === "generalmedicine") {
      return "General Medicine"
    }
    return specialty.charAt(0).toUpperCase() + specialty.slice(1).toLowerCase()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  try {
    // API configuration
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      process.env.SENDINBLUE_API_KEY

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    // Modern and professional HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .content {
            padding: 32px 24px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 24px;
            color: #111827;
          }
          .card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
            margin: 24px 0;
            background-color: #fafafa;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 24px;
            margin-bottom: 24px;
          }
          .info-item {
            text-align: left;
          }
          .info-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 6px;
            font-weight: 500;
          }
          .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
          }
          .status-badge {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .instructions {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 0 6px 6px 0;
          }
          .instructions h3 {
            margin: 0 0 8px 0;
            color: #1e40af;
            font-size: 16px;
            font-weight: 600;
          }
          .instructions p {
            margin: 0;
            color: #1e40af;
            font-size: 14px;
          }
          .footer {
            background-color: #f3f4f6;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer p {
            margin: 0;
            color: #6b7280;
            font-size: 14px;
          }
          .hospital-name {
            font-weight: 700;
            color: #3b82f6;
          }
          @media (max-width: 600px) {
            .info-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }
            .content {
              padding: 24px 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Content -->
          <div class="content">
            <div class="greeting">
              Hello ${firstName} ${lastName},
            </div>

            <p>We are pleased to confirm your medical appointment. Here are all the details:</p>

            <!-- Appointment Card -->
            <div class="card">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Patient</div>
                  <div class="info-value">${firstName} ${lastName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Specialty</div>
                  <div class="info-value">${formatSpecialty(specialty)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Doctor</div>
                  <div class="info-value">Dr. ${doctor}</div>
                </div>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Date</div>
                  <div class="info-value">${formatDate(date)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Time</div>
                  <div class="info-value">${formatTime(time)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Status</div>
                  <div class="info-value">
                    <span class="status-badge">Confirmed</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Instructions -->
            <div class="instructions">
              <h3>📋 Important Instructions</h3>
              <p>
                • Please arrive 15 minutes before your appointment<br>
                • Don't forget your ID and insurance card<br>
                • Bring your prescriptions and recent medical tests if necessary
              </p>
            </div>

            <p>
              If you need to modify or cancel this appointment, 
              please contact us as soon as possible.
            </p>

            <p style="margin-top: 32px;">
              Thank you for your trust and we wish you an excellent day.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>
              <span class="hospital-name">HSV Hospital</span><br>
              Your health, our priority
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    const emailData = {
      sender: {
        name: "HSV Hospital",
        email: "mail.hsv.hospital@gmail.com",
      },
      to: [
        {
          email: to,
          name: `${firstName} ${lastName}`,
        },
      ],
      subject: `✅ Appointment confirmed - ${formatDate(date)} at ${formatTime(
        time
      )}`,
      htmlContent: htmlContent,
    }

    console.log("📧 Sending confirmation email...")

    const response = await apiInstance.sendTransacEmail(emailData)

    console.log("✅ Email sent successfully!")
    return res.status(200).json({
      message: "Confirmation email sent successfully",
      messageId: response.messageId,
    })
  } catch (error) {
    console.error("❌ Error sending email:", {
      message: error.message,
      response: error.response?.body,
      status: error.response?.status,
    })

    return res.status(500).json({
      error: "Failed to send confirmation email",
      details: error.response?.body || error.message,
    })
  }
}
