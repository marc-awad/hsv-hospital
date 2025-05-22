import Swal from "sweetalert2"
import { updateAppointment } from "./appointmentService"

export const showSuccessAlert = (message: string) => {
  return Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    confirmButtonColor: "#3b82f6", // Tailwind blue-500
  })
}

export const showErrorAlert = (message: string) => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#ef4444", // Tailwind red-500
  })
}

export const showConfirmDialog = (title: string, text: string) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#7C3AED", // Tailwind green-500
    cancelButtonColor: "#B91C1C", // Tailwind gray-500
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  })
}

export const showMissingFieldAlert = (fieldName: string): void => {
  Swal.fire({
    icon: "info",
    title: "Missing Field",
    text: `${fieldName}.`,
    confirmButtonColor: "#3b82f6", // Tailwind blue-500
  })
}
export const showModifyAppointmentModalSimple = async (
  appointment: any
): Promise<void> => {
  try {
    const { value: formValues } = await Swal.fire({
      title: "<div>Modify Appointment</div>",
      html: `
        <div style="text-align: left; margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="margin: 5px 0; color: #1e293b;"><strong style="color: #3b82f6;">Patient:</strong> ${appointment.firstName} ${appointment.lastName}</p>
            <p style="margin: 5px 0; color: #1e293b;"><strong style="color: #3b82f6;">Doctor:</strong> ${appointment.doctor}</p>
            <p style="margin: 5px 0; color: #1e293b;"><strong style="color: #3b82f6;">Specialty:</strong> ${appointment.specialty}</p>
            <p style="margin: 5px 0; color: #1e293b;"><strong style="color: #3b82f6;">Current Date:</strong> ${appointment.date}</p>
            <p style="margin: 5px 0; color: #1e293b;"><strong style="color: #3b82f6;">Current Time:</strong> ${appointment.time}</p>
        </div>
        <div style="margin-bottom: 15px;">
            <label for="swal-input1" style="display: block; margin-bottom: 5px; font-weight: bold; color: #3b82f6;">New Date:</label>
            <input id="swal-input1" type="date" class="swal2-input" value="${appointment.date}" style="width: 100%; margin: 0; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; color: #374151;">
        </div>
        <div style="margin-bottom: 15px;">
            <label for="swal-input2" style="display: block; margin-bottom: 5px; font-weight: bold; color: #3b82f6;">New Time:</label>
            <input id="swal-input2" type="time" class="swal2-input" value="${appointment.time}" style="width: 100%; margin: 0; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; color: #374151;">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update Appointment",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#7C3AED", // Tailwind green-500
      cancelButtonColor: "#B91C1C", // Tailwind gray-500
      preConfirm: () => {
        const newDate = (
          document.getElementById("swal-input1") as HTMLInputElement
        )?.value
        const newTime = (
          document.getElementById("swal-input2") as HTMLInputElement
        )?.value

        // Validation des champs requis
        if (!newDate || !newTime) {
          Swal.showValidationMessage("Please fill in both date and time fields")
          return false
        }

        // Vérifier que la nouvelle date n'est pas dans le passé
        const selectedDateTime = new Date(`${newDate}T${newTime}`)
        const now = new Date()

        if (selectedDateTime < now) {
          Swal.showValidationMessage("Cannot schedule appointment in the past")
          return false
        }

        // Si la date/heure n'a pas changé
        if (newDate === appointment.date && newTime === appointment.time) {
          Swal.showValidationMessage("Please select a different date or time")
          return false
        }

        return {
          date: newDate,
          time: newTime,
        }
      },
    })

    if (formValues) {
      // Afficher un loader pendant la mise à jour
      Swal.fire({
        title: "Updating appointment...",
        html: "Please wait while we update your appointment.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      try {
        // Mettre à jour l'appointment
        await updateAppointment(appointment.id!, {
          date: formValues.date,
          time: formValues.time,
        })

        // Succès
        await showSuccessAlert(
          `Appointment has been successfully updated to ${formValues.date} at ${formValues.time}`
        )
      } catch (error: any) {
        console.error("Error updating appointment:", error)

        await showErrorAlert(
          error?.message || "Failed to update appointment. Please try again."
        )
      }
    }
  } catch (error: any) {
    console.error("Error in showModifyAppointmentModalSimple:", error)

    await showErrorAlert("An unexpected error occurred. Please try again.")
  }
}
