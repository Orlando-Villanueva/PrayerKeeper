# Custom Prayer Categories Implementation Plan

This document outlines the step-by-step implementation plan for adding user custom categories to PrayerKeeper. The plan is divided into database setup and frontend implementation sections.

## Purpose

Enable users to create and manage their own personal prayer categories, replacing the current fixed "believers" and "brethren" categories. Users will be able to:
- Add, edit, and delete custom categories
- Reorder categories
- Hide empty categories
- Select categories when creating prayers
- See prayers organized by category in a responsive grid layout

## 1. Database Setup in Supabase 

- [x] Create `categories` table with appropriate fields
  - Fields: id, user_id, name, order, created_at, updated_at, is_visible
  - Primary key, foreign key relationships, and default values

- [x] Set up Row Level Security (RLS) policies for categories
  - SELECT, INSERT, UPDATE, DELETE policies with proper conditions
  - Prevent deletion of categories with existing prayers

- [x] Update `prayers` table to add category_id field
  - Add foreign key relationship to categories table
  - Set up ON DELETE SET NULL behavior

- [x] Create Category Order Maintenance Trigger
  - Automatically reorder categories when one is deleted

- [x] Create Database Indexes
  - idx_prayers_category_id
  - idx_categories_user_id_order
  - idx_categories_user_id

- [x] Migrate existing prayers to the new system
  - Create categories based on existing "believers" and "brethren" values
  - Update existing prayers to set their category_id
  - Run additional migration for any prayers created during transition

## 2. Frontend Implementation

### 2.1 Create Category Store 

- [x] Create categoryStore.js with state and actions
  - State: categories, loading, error
  - Getters: sortedCategories
  - Actions:
    - fetchCategories
    - addCategory
    - updateCategory
    - deleteCategory
    - reorderCategories
    - toggleCategoryVisibility

**Implementation Notes:**
- Store follows Pinia pattern with state, getters, and actions
- Added user_id filtering in fetchCategories for proper data isolation
- Implemented optimistic UI updates for better UX
- Database trigger handles category reordering on deletion
- Added JSDoc documentation for better maintainability
- Additional getters added:
  - visibleCategories: Filters out hidden categories
  - sortedVisibleCategories: Combines sorting and visibility

### 2.2 Update Prayer Store 

- [x] Modify prayerStore.js to use category_id instead of category
  - Update prayersByCategory to filter by category_id
  - Update addPrayer and updatePrayer to handle category_id
  - Update resolvedCountByCategory to use category_id

**Implementation Notes:**
- Updated getters to use category_id:
  - prayersByCategory now filters by category_id instead of category
  - resolvedCountByCategory uses category_id for counting
- Enhanced addPrayer validation:
  - Validates required fields (category_id, person_name) based on schema
  - Proper error messages for missing fields
- Simplified updatePrayer:
  - Removed redundant category_id validation
  - Relies on database constraints for data integrity
  - Maintains optimistic UI updates
- Added user_id filter to fetchPrayers for proper data isolation
- Optimized resolvePrayer:
  - Simplified to only update resolved status
  - Maintains optimistic UI updates
  - No unnecessary category_id inclusion

### 2.3 Update Dashboard 

- [x] Modify Dashboard.vue to display dynamic categories
  - Replace hardcoded category sections with dynamic generation
  - Use v-for with sortedVisibleCategories from categoryStore
  - Implement responsive grid layout (2 columns for larger screens)
  - Maintain consistent purple styling for all category cards

**Implementation Notes:**
- Enhanced Dashboard.vue:
  - Replaced static category sections with dynamic v-for loop
  - Uses sortedVisibleCategories getter for proper ordering
  - Parallel loading of prayers and categories for better performance
- Updated PrayerList.vue:
  - Converted to use category_id instead of string categories
  - Generic, reusable component that works with any category
  - Enhanced empty state messaging
- State Management:
  - Proper initialization of both prayer and category stores
  - Optimistic UI updates for better user experience
  - Proper error handling and loading states

### 2.4 Update Prayer Modal

- [ ] Modify PrayerModal.vue to include category selection
  - Add dropdown for selecting from existing categories
  - Add option to create new category from modal
  - Update form submission to include category_id

### 2.5 New Category Management Page

- [ ] Create CategoryManagement.vue component
  - Add route in router.js: /manage-categories
  - Implement UI for adding categories
  - Implement UI for editing categories
  - Implement UI for deleting categories (with validation)
  - Add drag-and-drop reordering functionality
  - Add toggle for category visibility
  - Apply consistent purple styling (from-purple-300 to-purple-200)

### 2.6 User Onboarding Flow

- [ ] Create CategorySetup.vue component for onboarding
  - Add to onboarding flow for new users
  - Prompt users to create at least two categories
  - Provide category suggestions
  - Make the component visually appealing with the purple theme

## 3. Final Testing and Deployment

- [ ] Test all category management functionality
  - Creating, editing, deleting categories
  - Reordering categories
  - Hiding empty categories

- [ ] Test prayer creation with categories
  - Creating prayers with different categories
  - Editing prayers to change categories
  - Verifying prayers appear in correct category lists

- [ ] Test responsive layout
  - Verify grid layout works on different screen sizes
  - Ensure mobile layout is optimized and touch-friendly

- [ ] Deploy changes
  - Deploy database changes
  - Deploy frontend changes
  - Monitor for any issues

## Design Guidelines

Following the established design preferences:

1. **Category Cards:**
   - Use purple gradient backgrounds for headers (from-purple-300 to-purple-200)
   - Apply subtle borders with partial opacity (border-purple-300/70)
   - Ensure consistent styling across all prayer category cards
   - Maintain visual harmony with the app's overall purple theme

2. **Mobile Responsiveness:**
   - Ensure the grid layout adapts to single column on smaller screens
   - Optimize interfaces for touch interaction
   - Apply full-width form elements on mobile
   - Proper alignment of buttons in modal footers

This implementation plan aligns with the modern, clean aesthetic of the PrayerKeeper app while adding powerful new functionality for users to personalize their prayer experience.
