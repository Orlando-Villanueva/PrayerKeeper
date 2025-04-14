import { defineStore } from 'pinia';
import { supabase } from '../db/supabase';
import { useAuthStore } from './authStore';

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        loading: false,
        error: null,
        hasFetched: false
    }),

    getters: {
        // Get categories sorted by their order field
        sortedCategories: (state) => {
            return [...state.categories].sort((a, b) => a.order - b.order);
        },

        // Get only visible categories
        visibleCategories: (state) => {
            return state.categories.filter(cat => cat.is_visible);
        },

        // Get visible categories sorted by order
        sortedVisibleCategories() {
            return this.visibleCategories.sort((a, b) => a.order - b.order);
        }
    },

    actions: {
        /**
         * Fetches categories for the authenticated user from the database.
         * Categories are ordered by their 'order' field in ascending order.
         * Sets the fetched categories to the store's state.
         * @returns {Promise<Object>} Object with success status and data or error message.
         */
        async fetchCategories() {
            if (this.hasFetched) return;
            this.loading = true;
            this.error = null;

            try {
                const authStore = useAuthStore();
                if (!authStore.isAuthenticated) throw new Error('User not authenticated');

                const { data, error } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('user_id', authStore.user.id)
                    .order('order', { ascending: true });

                if (error) throw error;
                this.categories = data || [];

                this.hasFetched = true;
                return { success: true, data };
            } catch (error) {
                this.error = error.message || 'Failed to fetch categories';
                console.error('Fetch categories error:', error);
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        /**
         * Adds a new category for the authenticated user.
         * The new category is inserted with the highest order value plus one.
         * Sets the new category to the store's state.
         * @param {Object} category - The category object to add.
         * @param {string} category.name - The name of the new category.
         * @returns {Promise<Object>} Object with success status and data or error message.
         */
        async addCategory({ name }) {

            try {
                this.loading = true;
                this.error = null;

                const authStore = useAuthStore();
                if (!authStore.isAuthenticated) throw new Error('User not authenticated');

                // Get the highest order value
                const maxOrder = Math.max(0, ...this.categories.map(c => c.order));

                const { data, error } = await supabase
                    .from('categories')
                    .insert([{
                        name,
                        user_id: authStore.user.id,
                        order: maxOrder + 1,
                        is_visible: true,
                        created_at: new Date().toISOString()
                    }])
                    .select();

                if (error) throw error;

                if (data?.[0]) {
                    this.categories = [...this.categories, data[0]];
                }

                return { success: true, data: data?.[0] };
            } catch (error) {
                this.error = error.message || 'Failed to add category';
                console.error('Add category error:', error);
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        /**
         * Updates an existing category for the authenticated user.
         * The category is updated with the provided updates object.
         * Sets the updated category to the store's state.
         * @param {string} id - The ID of the category to update.
         * @param {Object} updates - The updates to apply to the category.
         * @returns {Promise<Object>} Object with success status and data or error message.
         */
        async updateCategory(id, updates) {
            try {
                this.loading = true;
                this.error = null;

                const authStore = useAuthStore();
                if (!authStore.isAuthenticated) throw new Error('User not authenticated');

                const { data, error } = await supabase
                    .from('categories')
                    .update({
                        ...updates,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select()
                    .single();

                if (error || !data) throw error || new Error('Category not found');

                // Update store
                const index = this.categories.findIndex(c => c.id === id);
                if (index !== -1) this.categories[index] = data;

                return { success: true, data };
            } catch (error) {
                this.error = error.message || 'Failed to update category';
                console.error('Update category error:', error);
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        /**
         * Deletes an existing category for the authenticated user.
         * The category is deleted from the database and the store's state.
         * @param {string} id - The ID of the category to delete.
         * @returns {Promise<Object>} Object with success status or error message.
         */
        async deleteCategory(id) {
            try {
                this.loading = true;
                this.error = null;

                const authStore = useAuthStore();
                if (!authStore.isAuthenticated) throw new Error('User not authenticated');

                // Optimistically update UI
                const deletedCategory = this.categories.find(c => c.id === id);
                this.categories = this.categories.filter(category => category.id !== id);

                const { error } = await supabase
                    .from('categories')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                // Note: The database trigger will handle reordering automatically
                return { success: true };
            } catch (error) {
                this.error = error.message || 'Failed to delete category';
                console.error('Delete category error:', error);
                await this.fetchCategories(); // Revert on error
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        /**
         * Reorders the categories for the authenticated user.
         * The categories are reordered based on the provided newOrder array.
         * Sets the reordered categories to the store's state.
         * @param {Array} newOrder - The new order of category IDs.
         * @returns {Promise<Object>} Object with success status or error message.
         */
        async reorderCategories(newOrder) {
            try {
                this.loading = true;
                this.error = null;

                const authStore = useAuthStore();
                if (!authStore.isAuthenticated) throw new Error('User not authenticated');

                // Create updates array with new order values
                const updates = newOrder.map((id, index) => ({
                    id,
                    order: index + 1,
                    updated_at: new Date().toISOString()
                }));

                // Update all categories in a single transaction
                const { error } = await supabase
                    .from('categories')
                    .upsert(updates);

                if (error) throw error;

                // Update local state to match new order
                const updatedCategories = [...this.categories];
                newOrder.forEach((id, index) => {
                    const category = updatedCategories.find(c => c.id === id);
                    if (category) category.order = index + 1;
                });
                this.categories = updatedCategories;

                return { success: true };
            } catch (error) {
                this.error = error.message || 'Failed to reorder categories';
                console.error('Reorder categories error:', error);
                await this.fetchCategories(); // Revert on error
                return { success: false, error: this.error };
            } finally {
                this.loading = false;
            }
        },

        /**
         * Toggles the visibility of an existing category for the authenticated user.
         * The category's visibility is toggled and the updated category is set to the store's state.
         * @param {string} id - The ID of the category to toggle visibility.
         * @returns {Promise<Object>} Object with success status and data or error message.
         */
        async toggleCategoryVisibility(id) {
            const category = this.categories.find(c => c.id === id);
            if (!category) return { success: false, error: 'Category not found' };

            return this.updateCategory(id, {
                is_visible: !category.is_visible
            });
        },

        resetError() {
            this.error = null;
        }
    }
});
