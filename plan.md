1. **Understand the Goal**: The user wants to add an option to the Broadcast Email manager to send an email to a specifically typed email address (not just registered users) and they want a feature (maybe AI?) to help fill or beautify the email. Also, they want the test email functionality to send to `adityaarta085@gmail.com` specifically instead of the currently logged-in admin email.
2. **Current state of `BroadcastManager.js`**:
   - `recipientType` has 'all' and 'selected'. We need a third option: 'manual' (or 'custom').
   - When 'manual' is selected, show an input to enter a custom email address.
   - For "send test email", change the logic to send it to `adityaarta085@gmail.com`.
   - Add an AI button/feature next to the subject/content to "beautify" or generate the email content. Since there's an AI API in `api/chat.js` or via GROQ, we can make an API call to generate or improve the text.
3. **Changes to `BroadcastManager.js`**:
   - Add a new state `customEmail` (string).
   - Update `RadioGroup` for `recipientType` to include `<Radio value="custom">Email Spesifik (Manual)</Radio>`.
   - If `recipientType === 'custom'`, show an `<Input>` to let the admin type any email address.
   - Update `handleSendEmail`:
     - If `sendTest` is true, set `targets = ['adityaarta085@gmail.com']`.
     - Else if `recipientType === 'custom'`, set `targets = [customEmail]`.
     - Else if `recipientType === 'all'`...
   - To handle the "AI Beautify" request:
     - Add an "AI Assistant" button near the ReactQuill editor.
     - When clicked, it takes the current `subject` and `content` (plain text or html), sends a request to the AI endpoint (`/api/chat` probably, or we can use another AI tool if available), and replaces the content with the enhanced HTML version. Let's check `api/chat.js` to see how it works.
4. **Explore `api/chat.js`**: Check how we can call the AI to beautify the email.
