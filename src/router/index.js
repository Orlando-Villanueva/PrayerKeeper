import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import Dashboard from '../components/Dashboard.vue';
import Auth from '../components/auth/Auth.vue';
import UpdatePassword from '../components/auth/UpdatePassword.vue';
import AuthCallback from '../components/auth/AuthCallback.vue';
import TermsOfService from '../components/legal/TermsOfService.vue';
import PrivacyPolicy from '../components/legal/PrivacyPolicy.vue';
import NotFound from '../components/NotFound.vue';
import CategoryManagement from '../components/category/CategoryManagement.vue';

const routes = [
    {
        path: '/',
        name: 'auth',
        component: Auth,
        meta: { guestOnly: true },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/manage-categories',
        name: 'manage-categories',
        component: CategoryManagement,
        meta: { requiresAuth: true }
    },
    {
        path: '/reset-password',
        name: 'reset-password',
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
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    }
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

    // Check for reset-password route without recovery parameter
    if (to.name === 'reset-password' && !window.location.hash.includes('type=recovery') && !window.location.hash.includes('recovery')) {
        return next('/');
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