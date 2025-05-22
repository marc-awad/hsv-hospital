import admin from "firebase-admin"
import { readFileSync } from "fs"

const serviceAccount = JSON.parse(
  readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const specialties = [
  { name: "Cardiology", description: "Heart related specialty" },
  { name: "Dermatology", description: "Skin related specialty" },
  { name: "Neurology", description: "Nervous system specialty" },
  { name: "Orthopedics", description: "Bones and muscles specialty" },
  { name: "Pediatrics", description: "Child health specialty" },
  { name: "Gynecology", description: "Female reproductive system specialty" },
  { name: "Ophthalmology", description: "Eye related specialty" },
  { name: "Psychiatry", description: "Mental health specialty" },
  { name: "Urology", description: "Urinary tract specialty" },
  { name: "General Medicine", description: "General health care specialty" },
]

// Liste docteurs par spécialité avec prénom/nom séparés
const doctorsBySpecialty = {
  cardiology: [
    { firstName: "Alice", lastName: "Heart" },
    { firstName: "Bob", lastName: "Pulse" },
  ],
  dermatology: [
    { firstName: "Clara", lastName: "Skin" },
    { firstName: "Dan", lastName: "Derm" },
    { firstName: "Eve", lastName: "Epidermis" },
  ],
  neurology: [
    { firstName: "Frank", lastName: "Brain" },
    { firstName: "Grace", lastName: "Nerve" },
  ],
  orthopedics: [
    { firstName: "Henry", lastName: "Bones" },
    { firstName: "Irene", lastName: "Joint" },
  ],
  pediatrics: [
    { firstName: "Jack", lastName: "Kids" },
    { firstName: "Karen", lastName: "Child" },
  ],
  gynecology: [
    { firstName: "Laura", lastName: "Femme" },
    { firstName: "Mike", lastName: "Repro" },
  ],
  ophthalmology: [
    { firstName: "Nora", lastName: "Eye" },
    { firstName: "Owen", lastName: "Vision" },
  ],
  psychiatry: [
    { firstName: "Paul", lastName: "Mind" },
    { firstName: "Quinn", lastName: "Brain" },
  ],
  urology: [
    { firstName: "Rachel", lastName: "Flow" },
    { firstName: "Steve", lastName: "Kidney" },
  ],
  generalmedicine: [
    { firstName: "Tina", lastName: "General" },
    { firstName: "Uma", lastName: "Care" },
  ],
}

// Exemple simple de créneaux disponibles (dispo pour tous)
const exampleSlots = [
  { day: "Monday", start: "09:00", end: "12:00" },
  { day: "Wednesday", start: "13:00", end: "16:00" },
  { day: "Friday", start: "09:00", end: "12:00" },
]

async function seed() {
  const batch = db.batch()

  // Insérer les spécialités
  specialties.forEach((spec) => {
    const docId = spec.name.toLowerCase().replace(/\s+/g, "")
    const docRef = db.collection("specialties").doc(docId)
    batch.set(docRef, spec)
  })

  // Insérer les docteurs avec créneaux
  Object.entries(doctorsBySpecialty).forEach(([specKey, doctors]) => {
    doctors.forEach((doctor, index) => {
      const docId = `${specKey}_doctor_${index + 1}`
      const docRef = db.collection("doctors").doc(docId)
      batch.set(docRef, {
        ...doctor,
        specialty: specKey,
        availableSlots: exampleSlots,
      })
    })
  })

  await batch.commit()
  console.log("Specialties and doctors seeded successfully.")
}

seed().catch(console.error)
