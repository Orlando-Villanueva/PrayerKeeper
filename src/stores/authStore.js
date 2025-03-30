import { defineStore } from 'pinia';
import { supabase } from '../db/supabase';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null,
        session: null,
        initialized: false,
        resetEmailSent: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        errorMessage: (state) => state.error,
        isEmailVerified: (state) => state.user?.email_confirmed_at || state.user?.confirmed_at,
        hasResetEmailSent: (state) => state.resetEmailSent
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

        async resetPassword(email) {
            try {
                this.loading = true;
                this.error = null;
                this.resetEmailSent = false;

                // Determine appropriate redirect URL based on environment
                const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
                const baseUrl = isDev ? window.location.origin : (import.meta.env.VITE_APP_URL || window.location.origin);
                const redirectUrl = `${baseUrl}/reset-password`;

                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: redirectUrl,
                });

                if (error) throw error;

                this.resetEmailSent = true;
                return { success: true };
            } catch (error) {
                this.error = error.message || 'Failed to send reset password email';
                console.error('Reset password error:', error);
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        async setSession(accessToken, refreshToken = '') {
            try {
                this.loading = true;
                this.error = null;

                const { data, error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });

                if (error) throw error;

                if (data.session) {
                    this.session = data.session;
                    this.user = data.session.user;
                }

                return { success: true, data };
            } catch (error) {
                this.error = error.message || 'Failed to set session';
                console.error('Set session error:', error);
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        async updatePassword(newPassword) {
            try {
                this.loading = true;
                this.error = null;

                const { data, error } = await supabase.auth.updateUser({
                    password: newPassword
                });

                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                this.error = error.message || 'Failed to update password';
                console.error('Update password error:', error);
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        resetError() {
            this.error = null;
            this.resetEmailSent = false;
        }
    }
});
