import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { useAuthStore } from './stores/authStore'

// Create the app instance
const app = createApp(App)

// Set up Pinia
const pinia = createPinia()
app.use(pinia)

// Use the router from router/index.js
app.use(router)

// Initialize the auth store before mounting
const authStore = useAuthStore()

// Initialize auth and then mount the app
authStore.initialize().finally(() => {
    app.mount('#app')
})
