import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

import HomePage from "../components/Pages/HomePage.vue"
import BookingPage from "../components/Pages/BookingPage.vue"
import TrackingPage from "../components/Pages/TrackingPage.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/booking",
    name: "Booking",
    component: BookingPage,
  },
  {
    path: "/tracking",
    name: "Tracking",
    component: TrackingPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
