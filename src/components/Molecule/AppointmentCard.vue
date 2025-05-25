<template>
  <div
    class="border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
  >
    <!-- Patient, Specialty, Doctor -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6 text-left"
    >
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Patient</p>
        <p class="font-medium">{{ patientName }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Specialty</p>
        <p class="font-medium">{{ specialtyDisplay }}</p>
      </div>
      <div class="sm:col-span-2 lg:col-span-1">
        <p class="text-xs text-gray-500 tracking-wide mb-2">Doctor</p>
        <p class="font-medium">{{ doctorDisplay }}</p>
      </div>
    </div>

    <!-- Date, Time, Status -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6 text-left"
    >
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Date</p>
        <p class="font-medium">{{ dateDisplay }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-500 tracking-wide mb-2">Time</p>
        <p class="font-medium">{{ timeDisplay }}</p>
      </div>
      <div class="sm:col-span-2 lg:col-span-1">
        <p class="text-xs text-gray-500 tracking-wide mb-2">Status</p>
        <StatusBadge :status="appointment.status || 'pending'" />
      </div>
    </div>

    <!-- Buttons -->
    <div
      v-if="showButtons && appointment.status !== 'cancelled'"
      class="flex flex-col sm:flex-row justify-start space-y-2 sm:space-y-0 sm:space-x-3 mt-4"
    >
      <Button
        variant="danger"
        @click="handleCancelRequest"
        :disabled="cancelLoading"
      >
        {{ cancelLoading ? "Cancelling..." : "Cancel Appointment" }}
      </Button>
    </div>
  </div>
</template>

<script>
import Button from "../Atoms/Button.vue"
import StatusBadge from "../Atoms/StatusBadge.vue"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import Swal from "sweetalert2"

export default {
  name: "AppointmentCard",
  components: { Button, StatusBadge },

  props: {
    appointment: { type: Object, required: true },
    showButtons: { type: Boolean, default: true },
    patientEmail: { type: String, required: true },
  },

  emits: ["cancel"],

  data: () => ({
    doctorInfo: null,
    loadingDoctor: false,
    cancelLoading: false,
    verificationData: {
      code: "",
      expiresAt: 0,
    },
  }),

  async mounted() {
    await this.fetchDoctorInfo()
  },

  watch: { "appointment.doctorId": "fetchDoctorInfo" },

  computed: {
    patientName() {
      return `${this.appointment.firstName || "Unknown"} ${
        this.appointment.lastName || "Patient"
      }`
    },

    specialtyDisplay() {
      const specialty =
        this.appointment.specialtyName ||
        this.appointment.specialty ||
        this.appointment.specialtyId
      if (!specialty) return "Unknown Specialty"
      if (specialty === "generalmedicine") return "General Medicine"
      if (specialty.includes(" ")) return specialty
      return (
        specialty.charAt(0).toUpperCase() + specialty.slice(1).toLowerCase()
      )
    },

    doctorDisplay() {
      const name = this.appointment.doctorName?.trim()

      if (name) {
        return name.toLowerCase().startsWith("dr") ? name : `Dr. ${name}`
      }

      return this.appointment.doctorId
        ? `Dr. (ID: ${this.appointment.doctorId})`
        : "Doctor not assigned"
    },

    appointmentDate() {
      const { appointmentStart, date } = this.appointment
      if (appointmentStart) {
        if (typeof appointmentStart === "string")
          return new Date(appointmentStart)
        if (appointmentStart instanceof Date) return appointmentStart
        if (appointmentStart.toDate) return appointmentStart.toDate()
        if (appointmentStart.seconds)
          return new Date(appointmentStart.seconds * 1000)
      }
      return date ? new Date(date) : new Date()
    },

    dateDisplay() {
      try {
        return this.appointmentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      } catch {
        return "Date not specified"
      }
    },

    timeDisplay() {
      try {
        const startDate = this.appointmentDate
        const endDate = this.appointment.appointmentEnd
          ? this.parseDateTime(this.appointment.appointmentEnd)
          : null

        const formatTime = (date) =>
          date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })

        if (endDate) return `${formatTime(startDate)} - ${formatTime(endDate)}`
        return formatTime(startDate)
      } catch {
        return this.appointment.time || "Time not specified"
      }
    },
  },

  methods: {
    async fetchDoctorInfo() {
      if (
        !this.appointment.doctorId ||
        this.doctorInfo?.id === this.appointment.doctorId
      )
        return

      this.loadingDoctor = true
      try {
        const snap = await getDoc(doc(db, "doctors", this.appointment.doctorId))
        this.doctorInfo = snap.exists() ? { id: snap.id, ...snap.data() } : null
      } catch (error) {
        // console.error("Error fetching doctor:", error)
        this.doctorInfo = null
      } finally {
        this.loadingDoctor = false
      }
    },

    async handleCancelRequest() {
      if (this.cancelLoading) return

      const isDev = import.meta.env.MODE === "development"

      // Mode développement : annulation directe
      if (isDev) {
        // console.log("🔧 MODE DÉVELOPPEMENT ACTIVÉ - Annulation directe")
        // console.log("📅 Rendez-vous à annuler:", {
        //   patient: `${this.appointment.firstName} ${this.appointment.lastName}`,
        //   doctor: this.appointment.doctorName,
        //   date: this.dateDisplay,
        //   time: this.timeDisplay,
        // })

        this.cancelLoading = true

        // Simuler un délai réaliste
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Émettre directement l'événement de suppression
        this.$emit("cancel", this.appointment)
        this.cancelLoading = false
        return
      }

      // Mode production : processus de vérification
      this.cancelLoading = true

      try {
        // console.log("📧 Envoi du code de vérification à:", this.patientEmail)

        const response = await fetch("/api/sendVerificationCode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: this.patientEmail,
            appointment: this.appointment,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // console.log("✅ Code de vérification envoyé avec succès")

          this.verificationData = {
            code: data.verificationCode,
            expiresAt: data.expiresAt,
          }

          await this.showVerificationModal()
        } else {
          throw new Error(data.error || "Error sending verification code")
        }
      } catch (error) {
        // console.error(
        //   "❌ Erreur lors de l'envoi du code de vérification:",
        //   error
        // )

        Swal.fire({
          title: "Erreur !",
          html: `
            <div style="text-align: left;">
              <p>Impossible d'envoyer le code de vérification.</p>
              <details style="margin-top: 15px; font-size: 12px; color: #666;">
                <summary style="cursor: pointer;">Détails techniques</summary>
                <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; margin-top: 5px;">
                  <strong>Erreur :</strong> ${error.message}<br>
                  <strong>Email :</strong> ${this.patientEmail}
                </div>
              </details>
            </div>
          `,
          icon: "error",
          confirmButtonColor: "#ef4444",
        })
      } finally {
        this.cancelLoading = false
      }
    },

    async showVerificationModal() {
      const timeRemaining = Math.max(
        0,
        Math.floor((this.verificationData.expiresAt - Date.now()) / 1000)
      )

      if (timeRemaining <= 0) {
        Swal.fire({
          title: "Code Expired!",
          text: "The verification code has expired. Please try again.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        })
        return
      }

      const { value: code } = await Swal.fire({
        title: "Verification Required",
        html: `
          <div style="text-align: left; margin: 20px 0;">
            <p style="margin-bottom: 20px;">A verification code has been sent to your email. Please enter it to confirm the cancellation of your appointment.</p>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Appointment to cancel:</h4>
              <div style="font-size: 14px; color: #666;">
                <p style="margin: 5px 0;"><strong>Patient:</strong> ${this.appointment.firstName} ${this.appointment.lastName}</p>
                <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${this.appointment.doctorName}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${this.dateDisplay}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${this.timeDisplay}</p>
              </div>
            </div>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0; font-size: 14px;">
              <strong>⚠️ Warning:</strong> This action cannot be undone!
            </div>
          </div>
        `,
        input: "text",
        inputLabel: "Enter your 6-digit verification code",
        inputPlaceholder: "000000",
        inputAttributes: {
          maxlength: 6,
          style:
            "text-align: center; font-size: 24px; font-family: monospace; letter-spacing: 4px;",
        },
        showCancelButton: true,
        confirmButtonText: "Confirm Cancellation",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        allowOutsideClick: false,
        allowEscapeKey: false,
        preConfirm: (code) => {
          if (!code || code.length !== 6) {
            Swal.showValidationMessage("Please enter a 6-digit code")
            return false
          }

          if (!/^\d{6}$/.test(code)) {
            Swal.showValidationMessage("Code must contain only numbers")
            return false
          }

          const currentTime = Date.now()
          if (currentTime > this.verificationData.expiresAt) {
            Swal.showValidationMessage("Verification code has expired")
            return false
          }

          return code
        },
        didOpen: () => {
          const input = Swal.getInput()
          input.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "")
          })

          this.startCountdownTimer()
        },
      })

      if (code) {
        await this.verifyCode(code)
      }
    },

    startCountdownTimer() {
      const updateTimer = () => {
        const remaining = Math.max(
          0,
          Math.floor((this.verificationData.expiresAt - Date.now()) / 1000)
        )
        const minutes = Math.floor(remaining / 60)
        const seconds = remaining % 60

        const timerElement = document.getElementById("countdown-timer")
        if (timerElement) {
          if (remaining > 0) {
            timerElement.textContent = `Code expires in ${minutes}:${seconds
              .toString()
              .padStart(2, "0")}`
            timerElement.style.color = remaining < 60 ? "#ef4444" : "#6b7280"
          } else {
            timerElement.textContent = "Code expired"
            timerElement.style.color = "#ef4444"
            Swal.showValidationMessage("Verification code has expired")
          }
        }

        if (remaining > 0) {
          setTimeout(updateTimer, 1000)
        }
      }

      const container = Swal.getHtmlContainer()
      if (container && !document.getElementById("countdown-timer")) {
        const timerDiv = document.createElement("div")
        timerDiv.id = "countdown-timer"
        timerDiv.style.cssText =
          "text-align: center; margin-top: 15px; font-size: 14px; color: #6b7280;"
        container.appendChild(timerDiv)
        updateTimer()
      }
    },

    async verifyCode(inputCode) {
      if (inputCode === this.verificationData.code) {
        this.$emit("cancel", {
          ...this.appointment,
          _verified: true,
        })
      } else {
        Swal.fire({
          title: "Invalid Code!",
          text: "The verification code is incorrect. Please check your email and try again.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        })
      }
    },

    parseDateTime(value) {
      if (!value) return null
      if (typeof value === "string") return new Date(value)
      if (value instanceof Date) return value
      if (value.toDate) return value.toDate()
      if (value.seconds) return new Date(value.seconds * 1000)
      return null
    },
  },
}
</script>
