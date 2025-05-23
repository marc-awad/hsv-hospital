import SibApiV3Sdk from "sib-api-v3-sdk"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Méthode non autorisée, utilisez POST" })
  }

  // Vérifier que la clé API existe
  if (!process.env.SENDINBLUE_API_KEY) {
    return res.status(500).json({ error: "Clé API non configurée" })
  }

  const { to, appointment } = req.body
  if (!to || !appointment) {
    return res.status(400).json({ error: "Données manquantes" })
  }

  const { firstName, lastName, specialty, doctor, date, time } = appointment
  if (!firstName || !lastName || !specialty || !doctor || !date || !time) {
    return res.status(400).json({ error: "Détails du rendez-vous incomplets" })
  }

  // Fonctions utilitaires pour le formatage
  const formatSpecialty = (specialty) => {
    if (specialty === "generalmedicine") {
      return "Médecine Générale"
    }
    return specialty.charAt(0).toUpperCase() + specialty.slice(1).toLowerCase()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
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

    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  try {
    // Configuration de l'API
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      process.env.SENDINBLUE_API_KEY

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    // Template HTML moderne et professionnel
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de Rendez-vous</title>
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
              Bonjour ${firstName} ${lastName},
            </div>

            <p>Nous avons le plaisir de confirmer votre rendez-vous médical. Voici tous les détails :</p>

            <!-- Appointment Card -->
            <div class="card">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Patient</div>
                  <div class="info-value">${firstName} ${lastName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Spécialité</div>
                  <div class="info-value">${formatSpecialty(specialty)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Médecin</div>
                  <div class="info-value">Dr. ${doctor}</div>
                </div>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Date</div>
                  <div class="info-value">${formatDate(date)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Heure</div>
                  <div class="info-value">${formatTime(time)}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Statut</div>
                  <div class="info-value">
                    <span class="status-badge">Confirmé</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Instructions -->
            <div class="instructions">
              <h3>📋 Instructions importantes</h3>
              <p>
                • Présentez-vous 15 minutes avant votre rendez-vous<br>
                • N'oubliez pas votre carte d'identité et carte vitale<br>
                • Apportez vos ordonnances et examens récents si nécessaire
              </p>
            </div>

            <p>
              Si vous avez besoin de modifier ou d'annuler ce rendez-vous, 
              veuillez nous contacter au plus tôt.
            </p>

            <p style="margin-top: 32px;">
              Nous vous remercions de votre confiance et vous souhaitons une excellente journée.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>
              <span class="hospital-name">Hôpital HSV</span><br>
              Votre santé, notre priorité
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    const emailData = {
      sender: {
        name: "Hôpital HSV",
        email: "mail.hsv.hospital@gmail.com",
      },
      to: [
        {
          email: to,
          name: `${firstName} ${lastName}`,
        },
      ],
      subject: `✅ Rendez-vous confirmé - ${formatDate(date)} à ${formatTime(
        time
      )}`,
      htmlContent: htmlContent,
    }

    console.log("📧 Envoi de l'email de confirmation...")

    const response = await apiInstance.sendTransacEmail(emailData)

    console.log("✅ Email envoyé avec succès!")
    return res.status(200).json({
      message: "Email de confirmation envoyé avec succès",
      messageId: response.messageId,
    })
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", {
      message: error.message,
      response: error.response?.body,
      status: error.response?.status,
    })

    return res.status(500).json({
      error: "Échec de l'envoi de l'email de confirmation",
      details: error.response?.body || error.message,
    })
  }
}
