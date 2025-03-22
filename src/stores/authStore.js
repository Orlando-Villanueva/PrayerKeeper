import { defineStore } from 'pinia';
import { supabase } from '../db/supabase';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null,
        session: null,
        initialized: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        errorMessage: (state) => state.error,
        isEmailVerified: (state) => state.user?.email_confirmed_at || state.user?.confirmed_at
    },

    actions: {
        async initialize() {
            try {
                this.loading = true;

                // Check if user is already logged in
                const { data } = await supabase.auth.getSession();
                if (data && data.session) {
                    this.session = data.session;
                    this.user = data.session.user;
                }

                // Setup auth state change listener
                supabase.auth.onAuthStateChange((event, session) => {
                    this.session = session;
                    this.user = session?.user || null;
                });

                this.initialized = true;
                return this.user;
            } catch (error) {
                this.error = error.message || 'Failed to initialize auth';
                console.error('Auth initialization error:', error);
            } finally {
                this.loading = false;
            }
        },

        async signUp(email, password) {
            try {
                this.loading = true;
                this.error = null;

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                if (data.user && data.session) {
                    this.user = data.user;
                    this.session = data.session;
                }

                return { success: true, data };
            } catch (error) {
                this.error = error.message || 'Failed to sign up';
                console.error('Sign up error:', error);
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        async signIn(email, password) {
            try {
                this.loading = true;
                this.error = null;

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                this.user = data.user;
                this.session = data.session;

                return { success: true, data };
            } catch (error) {
                this.error = error.message || 'Failed to sign in';
                console.error('Sign in error:', error);
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        async signOut() {
            try {
                this.loading = true;
                this.error = null;

                const { error } = await supabase.auth.signOut();

                if (error) throw error;

                this.user = null;
                this.session = null;

                return { success: true };
            } catch (error) {
                this.error = error.message || 'Failed to sign out';
                console.error('Sign out error:', error);
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        async getCurrentUser() {
            if (this.user) return this.user;

            try {
                this.loading = true;
                const { data } = await supabase.auth.getUser();
                if (data?.user) {
                    this.user = data.user;
                }
                return this.user;
            } catch (error) {
                console.error('Error getting current user:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        resetError() {
            this.error = null;
        }
    }
});
