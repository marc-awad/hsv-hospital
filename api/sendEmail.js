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

  try {
    // Configuration plus explicite
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      process.env.SENDINBLUE_API_KEY

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

    const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Email de test simple
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
      subject: `Confirmation RDV - ${formattedDate} à ${time}`,
      htmlContent: `
        <h1>Bonjour ${firstName} ${lastName}</h1>
        <p>Votre rendez-vous est confirmé :</p>
        <ul>
          <li><strong>Spécialité :</strong> ${specialty}</li>
          <li><strong>Médecin :</strong> ${doctor}</li>
          <li><strong>Date :</strong> ${formattedDate}</li>
          <li><strong>Heure :</strong> ${time}</li>
        </ul>
        <p>Merci de votre confiance.</p>
        <p>Hôpital HSV</p>
      `,
    }

    console.log("📧 Envoi avec sender:", emailData.sender)

    const response = await apiInstance.sendTransacEmail(emailData)

    console.log("✅ Email envoyé avec succès!")
    return res.status(200).json({
      message: "Email envoyé avec succès",
      messageId: response.messageId,
    })
  } catch (error) {
    console.error("❌ Erreur détaillée:", {
      message: error.message,
      response: error.response?.body,
      status: error.response?.status,
    })

    return res.status(500).json({
      error: "Échec de l'envoi de l'email",
      details: error.response?.body || error.message,
    })
  }
}
