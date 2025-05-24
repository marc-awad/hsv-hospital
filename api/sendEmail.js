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

  const {
    firstName,
    lastName,
    specialtyId,
    doctorName,
    appointmentStart,
    appointmentEnd,
    status,
  } = appointment

  if (
    !firstName ||
    !lastName ||
    !specialtyId ||
    !doctorName ||
    !appointmentStart ||
    !appointmentEnd
  ) {
    return res.status(400).json({ error: "Incomplete appointment details" })
  }

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
    })
  }

  const formatTime = (timestamp) => {
    const d = new Date(timestamp.seconds * 1000)
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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
          .info { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
          .info-item { margin-bottom: 10px; }
          .label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
          .value { font-weight: bold; color: #111; }
          .badge { background: #10b981; color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; }
          .instructions { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>Hello ${firstName} ${lastName},</h2>
            <p>Your medical appointment is confirmed:</p>
            
            <div class="card">
              <div class="info">
                <div class="info-item">
                  <div class="label">Patient</div>
                  <div class="value">${firstName} ${lastName}</div>
                </div>
                <div class="info-item">
                  <div class="label">Specialty</div>
                  <div class="value">${formatSpecialty(specialtyId)}</div>
                </div>
                <div class="info-item">
                  <div class="label">Doctor</div>
                  <div class="value">Dr. ${doctorName}</div>
                </div>
                <div class="info-item">
                  <div class="label">Date</div>
                  <div class="value">${formatDate(appointmentStart)}</div>
                </div>
                <div class="info-item">
                  <div class="label">Time</div>
                  <div class="value">${formatTime(appointmentStart)}</div>
                </div>
                <div class="info-item">
                  <div class="label">Status</div>
                  <div class="value"><span class="badge">${status}</span></div>
                </div>
              </div>
            </div>

            <div class="instructions">
              <strong>Important:</strong><br>
              • Arrive 15 minutes early<br>
              • Bring ID and insurance card<br>
              • Bring prescriptions if needed
            </div>

            <p>Contact us if you need to modify this appointment.</p>
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
      subject: `Appointment confirmed - ${formatDate(
        appointmentStart
      )} at ${formatTime(appointmentStart)}`,
      htmlContent,
    }

    const response = await apiInstance.sendTransacEmail(emailData)

    return res.status(200).json({
      message: "Email sent successfully",
      messageId: response.messageId,
    })
  } catch (error) {
    return res.status(500).json({
      error: "Failed to send email",
      details: error.response?.body || error.message,
    })
  }
}
