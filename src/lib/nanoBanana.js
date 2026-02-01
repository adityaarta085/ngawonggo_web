
import axios from 'axios';

// Note: These utilities would ideally run on a backend to avoid CORS and security issues.
// In a real production app, this would be an API call to your own server.

const TEMP_HEADERS = {
  "Content-Type": "application/json",
  "Application-Name": "web",
  "Application-Version": "4.0.0",
  "X-CORS-Header": "iaWg3pchvFx48fY",
};

export const nanoBananaService = {
  async createTempMail() {
    const name = `bagusapi_${Math.random().toString(36).slice(2, 8)}`;
    const res = await axios.post(
      "https://api.internal.temp-mail.io/api/v3/email/new",
      { name, domain: "illubd.com" },
      { headers: TEMP_HEADERS }
    );
    if (!res.data?.email) throw new Error("TEMP_MAIL_FAILED");
    return res.data.email;
  },

  async getCSRF() {
    const res = await axios.get("https://nanabanana.ai/api/auth/csrf");
    if (!res.data?.csrfToken) throw new Error("CSRF_NOT_FOUND");
    return res.data.csrfToken;
  },

  async sendOTP(email) {
    const res = await axios.post(
      "https://nanabanana.ai/api/auth/email-verification",
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
    if (res.data?.code !== 0) throw new Error("SEND_OTP_FAILED");
  },

  async waitOTP(email) {
    for (let i = 0; i < 15; i++) { // Reduced for UX
      const inbox = await axios.get(
        `https://api.internal.temp-mail.io/api/v3/email/${email}/messages`,
        { headers: TEMP_HEADERS }
      );

      const mail = Array.isArray(inbox.data)
        ? inbox.data.find(m => m.subject?.includes("Verification Code"))
        : null;

      if (mail?.body_text) {
        const code = mail.body_text.match(/\b\d{6}\b/);
        if (code) return code[0];
      }

      await new Promise(r => setTimeout(r, 4000));
    }
    throw new Error("OTP_TIMEOUT");
  },

  async submitOTP(email, code, csrfToken) {
    await axios.post(
      "https://nanabanana.ai/api/auth/callback/email-verification",
      new URLSearchParams({
        csrfToken,
        email,
        code,
        json: "true",
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const res = await axios.get("https://nanabanana.ai/api/auth/session");
    if (!res.data?.user) throw new Error("LOGIN_FAILED");
    return res.data;
  },

  async uploadImage(file) {
    const form = new FormData();
    form.append("file", file);

    const res = await axios.post(
      "https://nanabanana.ai/api/upload",
      form
    );

    if (!res.data?.url) throw new Error("UPLOAD_FAILED");
    return res.data.url;
  },

  async createTask(imageUrl) {
    const payload = {
      prompt: "Change to ghibli Studio style",
      image_urls: [imageUrl],
      output_format: "png",
      image_size: "auto",
      enable_pro: true,
      resolution: "4K",
      width: 1024,
      height: 1024,
      steps: 20,
      guidance_scale: 7.5,
      is_public: false,
    };

    const res = await axios.post(
      "https://nanabanana.ai/api/image-generation-nano-banana/create",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    if (!res.data?.task_id) throw new Error("CREATE_TASK_FAILED");
    return res.data.task_id;
  },

  async waitResult(taskId) {
    while (true) {
      const res = await axios.post(
        "https://nanabanana.ai/api/image-generation-nano-banana/status",
        { taskId },
        { headers: { "Content-Type": "application/json" } }
      );

      const gen = res.data?.generations?.[0];
      if (!gen) throw new Error("STATUS_INVALID");

      if (gen.status !== "waiting") {
        return gen.image_url;
      }

      await new Promise(r => setTimeout(r, 4000));
    }
  }
};
