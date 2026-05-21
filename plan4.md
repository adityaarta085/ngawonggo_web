1. **Setup Supabase Database Tables via MCP**:
   - Execute a SQL migration using `supabase_apply_migration` to create `ai_images`, `ai_image_interactions`, and `ai_image_comments` tables to support the new features.
   - Verify table creation using `supabase_list_tables`.
2. **Refactor Kreativitas Routing & CreateForm**:
   - Convert `src/views/KreativitasPage/index.js` into a Router handling nested routes (`/`, `/create/:id`, `/publik`, `/publik/:id`, `/histori`).
   - Move the existing Text-to-Image UI into `CreateForm.js`. Update it to enforce login, fetch VIP status, display a privacy toggle (disabled for Free users), and handle uploading the generated image to `c.termai.cc` (like `CommunityFeed`) before saving to the `ai_images` table.
3. **Verify Routing & CreateForm**:
   - Use `cat` to verify the logic inside `index.js` and `CreateForm.js`.
4. **Implement Gallery, History, and Result Views**:
   - Create `PublicGallery.js` to fetch and display public images (`is_private = false`).
   - Create `History.js` to enforce VIP access and display the user's generated images.
   - Create `ResultView.js` to display the specific image right after creation.
5. **Implement Public Detail View (Comments & Likes)**:
   - Create `PublicDetail.js` to display the image, prompt, and handle comments and upvote/downvote interactions.
6. **Verify Gallery & Detail Components**:
   - Use `cat` or `ls` to verify the newly created components.
7. **Run tests**:
   - Run tests using `CI=true npm test`.
8. **Pre-commit**:
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
