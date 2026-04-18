1.  **Database Configuration**:
    *   Created `donations` and `donation_transactions` tables via Supabase query.
    *   Saved QRIS API Token into `site_settings`.
    *   Created RPC function `increment_donation_amount` to securely update amounts.

2.  **API Integration (`api/qris.js`)**:
    *   Created an endpoint that correctly utilizes the QRISPY API for generation (`/generate`).
    *   Created an endpoint for polling QRIS status (`/status`).

3.  **UI Component: Navigation & Routing**:
    *   Modified `src/components/Navbar.js` to hide `/admin` from the list and replace it with `/donasi`.
    *   Need to add `DonasiPage` routing in `src/App.js`.

4.  **UI Component: DonasiPage (User Facing)**:
    *   Create a view `src/views/DonasiPage/index.js`.
    *   It should fetch active donations from Supabase.
    *   Provide a UI displaying campaigns (like Kitabisa).
    *   When clicking a campaign, open a donation form/modal to enter Name, Message, and Amount.
    *   Generate QRIS code via `/api/qris?action=generate` and show it in a modal.
    *   Continuously poll `/api/qris?action=status` while the modal is open to auto-close/confirm when "paid".

5.  **UI Component: AdminPanel (Admin Facing)**:
    *   Update `src/views/AdminPage/index.js` to add "Donasi" to `menuItems`.
    *   Create `src/views/AdminPage/components/DonasiManager.js`.
    *   Allow creating/editing/deleting donation campaigns.
    *   Show a table of all campaigns and another tab for `donation_transactions` to track who donated and the status.

6.  **Pre-commit checks**: Run `pre_commit_instructions` and test.
