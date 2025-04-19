import { defineStore } from 'pinia';
import { supabase } from '../db/supabase';
import { useAuthStore } from './authStore';

export const usePrayerStore = defineStore('prayer', {
    state: () => ({
        prayers: [],
        loading: false,
        error: null,
        hasFetched: false
    }),

    getters: {
        // Get filtered prayers by category_id with optional resolved filter
        prayersByCategory: (state) => (categoryId, showResolved) => {
            const prayers = state.prayers.filter(prayer => prayer.category_id === categoryId);
            if (showResolved) {
                return [...prayers].sort((a, b) => {
                    if (a.resolved === b.resolved) return 0;
                    return a.resolved ? 1 : -1;
                });
            }
            return prayers.filter(prayer => !prayer.resolved);
        },

        // Get count of resolved prayers by category_id
        resolvedCountByCategory: (state) => (categoryId) => {
            return state.prayers.filter(prayer =>
                prayer.category_id === categoryId && prayer.resolved
            ).length;
        }
    },

    actions: {
        async fetchPrayers() {
            if (this.hasFetched) return;
            this.loading = true;
            this.error = null;

            try {
                const authStore = useAuthStore();
                if (!authStore.isAuthenticated) throw new Error('User not authenticated');

                const { data, error } = await supabase
                    .from('prayers')
                    .select('*')
                    .eq('user_id', authStore.user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                this.prayers = data || [];

                this.hasFetched = true;

                return { success: true, data };

            } catch (error) {
                this.error = error.message || 'Failed to fetch prayers';
                console.error('Fetch prayers error:', error);
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        async addPrayer(prayerData, showLoading = true) {
            try {
                if (showLoading) this.loading = true;
                this.error = null;

                const authStore = useAuthStore();
                if (!authStore.isAuthenticated) throw new Error('User not authenticated');

                // Validate required fields based on schema
                const requiredFields = ['category_id', 'person_name'];
                const missingFields = requiredFields.filter(field => !prayerData[field]);
                if (missingFields.length > 0) {
                    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
                }

                const { data, error } = await supabase
                    .from('prayers')
                    .insert([{
                        ...prayerData,
                        user_id: authStore.user.id,
                        resolved: false,
                        created_at: new Date().toISOString()
                    }])
                    .select();

                if (error) throw error;

                if (data?.[0]) {
                    this.prayers = [data[0], ...this.prayers];
                }

                return { success: true, data: data?.[0] };
            } catch (error) {
                this.error = error.message || 'Failed to add prayer';
                console.error('Add prayer error:', error);
                return { success: false, error: this.error };
            } finally {
                if (showLoading) this.loading = false;
            }
        },

        async updatePrayer(id, updates, showLoading = true) {
            try {
                if (showLoading) this.loading = true;
                this.error = null;

                const authStore = useAuthStore();
                if (!authStore.isAuthenticated) throw new Error('User not authenticated');

                const { data, error } = await supabase
                    .from('prayers')
                    .update(updates)
                    .eq('id', id)
                    .select()
                    .single();

                if (error || !data) throw error || new Error('Prayer not found');

                // Update store
                const index = this.prayers.findIndex(p => p.id === id);
                if (index !== -1) this.prayers[index] = data;

                return { success: true, data };
            } catch (error) {
                this.error = error.message || 'Failed to update prayer';
                console.error('Update prayer error:', error);
                return { success: false, error: this.error };
            } finally {
                if (showLoading) this.loading = false;
            }
        },

        async resolvePrayer(id, resolved = true) {
            // Update UI optimistically
            const prayer = this.prayers.find(p => p.id === id);
            if (!prayer) {
                return { success: false, error: 'Prayer not found' };
            }

            prayer.resolved = resolved;

            return this.updatePrayer(id, { resolved }, false);
        },

        async deletePrayer(id) {
            try {
                this.error = null;

                const authStore = useAuthStore();
                if (!authStore.isAuthenticated) throw new Error('User not authenticated');

                // Optimistically update UI
                this.prayers = this.prayers.filter(prayer => prayer.id !== id);

                // Delete prayer
                const { error } = await supabase
                    .from('prayers')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                return { success: true };
            } catch (error) {
                this.error = error.message || 'Failed to delete prayer';
                console.error('Delete prayer error:', error);
                await this.fetchPrayers(); // Revert on error
                return { success: false, error: this.error };
            }
        },

        resetError() {
            this.error = null;
        },
        
        /**
         * Resets the store to its initial state.
         * Called when user logs out to clear previous user's data.
         */
        resetStore() {
            this.prayers = [];
            this.loading = false;
            this.error = null;
            this.hasFetched = false;
        }
    }
});
