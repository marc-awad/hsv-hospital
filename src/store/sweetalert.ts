import Swal from "sweetalert2"

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
    confirmButtonColor: "#10b981", // Tailwind green-500
    cancelButtonColor: "#6b7280", // Tailwind gray-500
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
