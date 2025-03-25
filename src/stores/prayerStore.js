import { defineStore } from 'pinia';
import { supabase } from '../db/supabase';

export const usePrayerStore = defineStore('prayer', {
    state: () => ({
        prayers: [],
        loading: false,
        error: null
    }),

    getters: {
        // Get filtered prayers by category with optional resolved filter
        prayersByCategory: (state) => (category, showResolved) => {
            const prayers = state.prayers.filter(prayer => prayer.category === category);
            if (showResolved) {
                return [...prayers].sort((a, b) => {
                    if (a.resolved === b.resolved) return 0;
                    return a.resolved ? 1 : -1;
                });
            }
            return prayers.filter(prayer => !prayer.resolved);
        },

        // Get count of resolved prayers by category
        resolvedCountByCategory: (state) => (category) => {
            return state.prayers.filter(prayer =>
                prayer.category === category && prayer.resolved
            ).length;
        }
    },

    actions: {
        async fetchPrayers() {
            this.loading = true;
            this.error = null;

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('User not authenticated');

                const { data, error } = await supabase
                    .from('prayers')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                this.prayers = data || [];

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

                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('User not authenticated');

                const { data, error } = await supabase
                    .from('prayers')
                    .insert([{
                        ...prayerData,
                        user_id: user.id,
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

                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('User not authenticated');

                const { data, error } = await supabase
                    .from('prayers')
                    .update(updates)
                    .eq('id', id)
                    .eq('user_id', user.id)
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
            if (prayer) {
                prayer.resolved = resolved;
            }

            return this.updatePrayer(id, { resolved }, false);
        },

        async deletePrayer(id) {
            try {
                this.error = null;

                // Get current user ID
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('User not authenticated');

                // Optimistically update UI
                this.prayers = this.prayers.filter(prayer => prayer.id !== id);

                // Delete prayer
                const { error } = await supabase
                    .from('prayers')
                    .delete()
                    .eq('id', id)
                    .eq('user_id', user.id);

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
        }
    }
});
