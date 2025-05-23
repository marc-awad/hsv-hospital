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
   <div class="max-w-2xl mx-auto bg-white shadow-lg">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
            <div class="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-content-center">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-white mb-2">Appointment Confirmed</h1>
            <p class="text-blue-100">HSV Hospital</p>
        </div>

        <!-- Content -->
        <div class="px-8 py-8">
            
            <!-- Success Message -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <div class="text-green-600 text-xl mr-3">✓</div>
                    <span class="text-green-800 font-semibold">Your appointment is confirmed!</span>
                </div>
            </div>

            <!-- Greeting -->
            <div class="mb-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-2">Hello <strong>${firstName} ${lastName}</strong>,</h2>
                <p class="text-gray-600">Thank you for choosing HSV Hospital. Here are your appointment details:</p>
            </div>

            <!-- Appointment Details -->
            <div class="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden mb-8">
                <div class="bg-blue-600 px-6 py-4">
                    <h3 class="text-white font-semibold text-center">Appointment Details</h3>
                </div>
                
                <div class="divide-y divide-gray-200">
                    <div class="flex items-center px-6 py-4">
                        <div class="bg-purple-100 rounded-lg p-3 mr-4">
                            <span class="text-lg">🏥</span>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Specialty</div>
                            <div class="text-gray-900 font-medium">${specialty}</div>
                        </div>
                    </div>
                    
                    <div class="flex items-center px-6 py-4">
                        <div class="bg-yellow-100 rounded-lg p-3 mr-4">
                            <span class="text-lg">👨‍⚕️</span>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Doctor</div>
                            <div class="text-gray-900 font-medium">${doctor}</div>
                        </div>
                    </div>
                    
                    <div class="flex items-center px-6 py-4">
                        <div class="bg-blue-100 rounded-lg p-3 mr-4">
                            <span class="text-lg">📅</span>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Date</div>
                            <div class="text-gray-900 font-medium">${formattedDate}</div>
                        </div>
                    </div>
                    
                    <div class="flex items-center px-6 py-4">
                        <div class="bg-red-100 rounded-lg p-3 mr-4">
                            <span class="text-lg">⏰</span>
                        </div>
                        <div>
                            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">Time</div>
                            <div class="text-gray-900 font-medium">${time}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Important Notice -->
            <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
                <div class="flex items-start">
                    <span class="text-lg mr-3 mt-1">💡</span>
                    <div>
                        <h4 class="text-amber-800 font-semibold mb-1">Important</h4>
                        <p class="text-amber-700 text-sm">Please arrive 15 minutes early with your ID and insurance card.</p>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="text-center space-y-4 mb-8">
                <a href="#" class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    Visit Patient Portal
                </a>
                <div class="space-x-4">
                    <a href="#" class="inline-block border-2 border-blue-600 text-blue-600 font-medium px-6 py-2 rounded-full hover:bg-blue-50 transition-colors">
                        Contact Us
                    </a>
                    <a href="#" class="inline-block border-2 border-red-600 text-red-600 font-medium px-6 py-2 rounded-full hover:bg-red-50 transition-colors">
                        Reschedule
                    </a>
                </div>
            </div>

            <!-- Contact Info -->
            <div class="text-center bg-gray-50 rounded-lg p-6">
                <p class="text-gray-600 mb-2">Need help? We're here for you.</p>
                <p class="text-sm text-gray-500">
                    <strong>Phone:</strong> <a href="tel:+1234567890" class="text-blue-600 hover:underline">(123) 456-7890</a> | 
                    <strong>Email:</strong> <a href="mailto:contact@hsvhospital.com" class="text-blue-600 hover:underline">contact@hsvhospital.com</a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-800 px-8 py-6 text-center">
            <h3 class="text-white font-semibold mb-2">HSV Hospital</h3>
            <p class="text-gray-400 text-sm mb-4">
                123 Medical Center Drive, New York, NY 10001<br>
                Phone: (123) 456-7890 | Email: contact@hsvhospital.com
            </p>
            
            <hr class="border-gray-600 my-4">
            
            <p class="text-gray-500 text-xs">
                This is an automated email, please do not reply.<br>
                <a href="#" class="text-gray-400 hover:text-gray-300 underline">Click here to unsubscribe</a>
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
