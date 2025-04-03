import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import Dashboard from '../components/Dashboard.vue';
import Auth from '../components/auth/Auth.vue';
import UpdatePassword from '../components/auth/UpdatePassword.vue';
import AuthCallback from '../components/auth/AuthCallback.vue';
import TermsOfService from '../components/legal/TermsOfService.vue';
import PrivacyPolicy from '../components/legal/PrivacyPolicy.vue';

const routes = [
    {
        path: '/',
        component: Auth,
        meta: { guestOnly: true },
        beforeEnter: (to, from, next) => {
            const authStore = useAuthStore();
            if (authStore.isAuthenticated) {
                next('/dashboard');
            } else {
                next();
            }
        }
    },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/reset-password',
        component: UpdatePassword,
        meta: { guestOnly: true }
    },
    {
        path: '/auth/callback',
        name: 'auth-callback',
        component: AuthCallback,
    },
    {
        path: '/terms',
        component: TermsOfService,
    },
    {
        path: '/privacy',
        component: PrivacyPolicy,
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

    // Special handling for reset-password route
    if (to.path === '/reset-password') {
        // Allow access to reset-password route regardless of auth status
        return next();
    }

    // Check if the route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Redirect to login if not authenticated
        next('/');
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