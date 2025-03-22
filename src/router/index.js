import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import Dashboard from '../components/Dashboard.vue';
import Login from '../components/Login.vue';
import Signup from '../components/Signup.vue';

const routes = [
    {
        path: '/',
        redirect: to => {
            const authStore = useAuthStore();
            return authStore.isAuthenticated ? '/dashboard' : '/login';
        }
    },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        component: Login,
        meta: { guestOnly: true }
    },
    {
        path: '/signup',
        component: Signup,
        meta: { guestOnly: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    // Get the auth store instance
    const authStore = useAuthStore();

    // Wait for auth initialization to complete if it hasn't already
    if (!authStore.initialized) {
        await authStore.initialize();
    }

    // Check if the route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Redirect to login if not authenticated
        next('/login');
    }
    // Check if the route is for guests only (like login/signup) and user is already authenticated
    else if (to.meta.guestOnly && authStore.isAuthenticated) {
        // Redirect to dashboard if already authenticated
        next('/dashboard');
    }
    else {
        next();
    }
});

export default router;