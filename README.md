# HSV Project – Appointment Booking Application 🏥

![HSV Hospital](https://placehold.co/600x150/e9f5ff/1f75cb?text=HSV+Hospital&font=montserrat)

## 🏥 Context

HSV Hospital, a modern healthcare facility opened in 2017, has been committed from the start to delivering high-quality medical care while ensuring patient safety. In order to remain at the forefront of technology and improve patient care, the hospital is undertaking a full update of its IT infrastructure.

As part of this effort, the HSV project aims to develop an application dedicated to managing **medical appointment bookings**.

## 🎯 Objective

Design a simple and user-friendly application that allows patients to:

- Easily book a medical appointment online
- Track the status of their appointment request

## 🧑‍⚕️ Key Features

### 1. **Appointment Booking Page**

Patients can:

- Enter their **first and last name**
- Select a **medical specialty**
- Choose a **consultation date**
- Receive a **confirmation** with:
  - The **doctor's name**
  - The **appointment time**

### 2. **Appointment Tracking Page**

Patients can view:

- The status of their request (pending, confirmed, etc.)
- Appointment details (date, time, doctor)

## 👨‍💻 Team

This project was completed **individually** by personal choice.  
Working solo allowed me to manage all aspects of the project: development, deployment, organization, and project management.

## 🛠️ Tech Stack

[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

- **Frontend Framework**: [Vue.js](https://vuejs.org/)
- **Language**: TypeScript
- **Database**: Firebase
- **Deployment**: [Vercel](https://vercel.com/)
- **Project Management**: Jira
- **UI/UX**: Radix Colors, Visily

## 🎨 Design Templates

All the mockup and wireframe templates for the project are available in the [src/mockup](./src/mockup) directory.  
Feel free to check them out to understand the app's UI and flow.

## 🧬 Atomic Design Structure

This project follows the **Atomic Design** methodology, a system for building consistent, reusable, and scalable UI components. The components are organized into the following categories:

### 🔹 Atoms

The most basic building blocks of the interface. These are simple UI elements that can’t be broken down further.  
Examples: `Input`, `Button`, `Icon`.

### 🔸 Molecules

Simple groups of atoms working together as a unit.  
Examples: `FeatureCard`

### 🧱 Organisms

More complex components made up of groups of molecules and/or atoms. These form distinct sections of a UI.  
Examples: `NavBar`, `Footer`, `FormSection`.

### 📄 Pages

Fully assembled views with actual content. These are the screens the user interacts with.  
Examples: `BookingPage.vue`, `HomePage.vue`, `TrackingPage`.

---

Using Atomic Design improves **reusability**, **clarity**, and **scalability** of your components and UI codebase.

## 📊 Database Structure (Firestore)

```plaintext
appointments (collection)
  └─ {appointmentId} (document)
      ├─ firstName: string
      ├─ lastName: string
      ├─ specialty: string
      ├─ date: string (format ISO "YYYY-MM-DD")
      ├─ doctor: string
      ├─ time: string (format "HH:mm")
      ├─ status: string ("pending", "confirmed", "cancelled", etc.)
      ├─ createdAt: timestamp
      ├─ updatedAt: timestamp

doctors (collection)
  └─ {doctorId} (document)
      ├─ firstName: string
      ├─ lastName: string
      ├─ specialty: string
      ├─ availableSlots: array of objects or subcollection

specialties (collection)
  └─ {specialtyId} (document)
      ├─ name: string (ex: "Cardiology")
      ├─ description: string

patients (optional collection)
  └─ {patientId} (document)
      ├─ firstName: string
      ├─ lastName: string
      ├─ email: string
      ├─ phone: string
```

- `appointments` : collection principale où chaque document représente une réservation de rendez-vous.
- Chaque rendez-vous contient une référence à la spécialité (`specialty`) et au médecin (`doctor`), par leur nom ou ID.
- Collection optionnelle `doctors` : permet de gérer les médecins, leurs spécialités et leurs créneaux horaires disponibles, utile pour valider les réservations.
- Collection optionnelle `patients` : si besoin de stocker une base patients distincte. Sinon, les informations patients sont directement dans chaque rendez-vous.

## 🔥 Firebase Setup

### Create a Firestore Collection

In the Firebase console, go to Firestore Database and create a collection, for example test-collection, or any other collection your project requires.

### Configure Environment Variables

Copy the .env.template file and rename the copy to .env at the root of your project.
Open .env and update the values with those from your Firebase project (found in your Firebase app settings).

```bash
cp .env.template .env
```

### Initializing the Database

To run the initialization script, you can import your `serviceAccountKey.json` from the Firebase console. This key is required to execute the script:  
[Seed Specialties and Doctors Script](src/firebase/seedSpecialtiesAndDoctors.js)

**Important:**  
Place the `serviceAccountKey.json` file inside the correct Firebase folder in the project:  
[Firebase Folder](src/firebase/)

### Restart the Development Server

Stop and start your dev server again (e.g. pnpm dev or npm run dev) so the environment variables are loaded.

## ⚙️ Installation & Setup

Follow these steps to install and run the project locally using GitHub and pnpm:

### 🚀 Clone the project repository

```bash
git clone https://github.com/marc-awad/hsv-hospital.git
```

### 📂 Go to the project directory

```bash
cd hsv-hospital
```

### 📦 Install dependencies

```bash
pnpm install
```

### 🏗 Start the development server

```bash
pnpm dev
```

You're now ready to build and explore the application locally!

## 📅 Project Timeline & Delivery

- Project Start: May 19, 2025
- Development Phase: May 19-30, 2025
- Project deadline: **May 30, 2025**

## 🔗 Live Application

The application is publicly accessible at:  
👉 [https://hsv-hospital.vercel.app/](https://hsv-hospital.vercel.app/)

---

<div align="center">
<small>HSV Hospital Appointment System © 2025</small>
</div>
