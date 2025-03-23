import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import Dashboard from '../components/Dashboard.vue';
import Auth from '../components/auth/Auth.vue';

const routes = [
    {
        path: '/',
        redirect: to => {
            const authStore = useAuthStore();
            return authStore.isAuthenticated ? '/dashboard' : '/auth';
        }
    },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/auth',
        component: Auth,
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
        next('/auth');
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