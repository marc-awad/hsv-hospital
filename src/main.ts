import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import "./style.css"

// Firestore testing
// import { app as firebaseApp, analytics } from "../src/firebase/firebase"
// import { getFirestore, collection, getDocs } from "firebase/firestore"


// console.log("Firebase app:", firebaseApp)
// console.log("Analytics:", analytics)

// const db = getFirestore(firebaseApp)

// getDocs(collection(db, "test-collection"))
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(doc.id, " => ", doc.data())
//     })
//   })
//   .catch((error) => {
//     console.error("Firestore error:", error)
//   })

const app = createApp(App)

app.use(router)

app.mount("#app")