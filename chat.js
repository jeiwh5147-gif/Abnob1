export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "استخدم POST لإرسال الرسالة." });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "الخادم لا يحتوي على GROQ_API_KEY في إعدادات البيئة." });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return res.status(400).json({ error: "لم تصل رسائل المحادثة بشكل صحيح." });
    }
    const messages = body.messages
      .filter(m => m && ["system", "user", "assistant"].includes(m.role) && typeof m.content === "string")
      .map(m => ({ role: m.role, content: m.content }));
    if (!messages.some(m => m.role === "user")) return res.status(400).json({ error: "اكتب رسالة أولًا." });
    if (!messages.some(m => m.role === "system")) {
      messages.unshift({ role: "system", content: "أنت CodeMind AI، مساعد برمجة يتحدث بالعربية المصرية. اشرح ببساطة وبخطوات واضحة." });
    }

    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 1200
      })
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const detail = data?.error?.message || data?.message || `Groq رجّع خطأ HTTP ${upstream.status}`;
      return res.status(502).json({ error: detail });
    }
    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(502).json({ error: "Groq لم يرجع نصًا في الرد." });
    }
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: typeof e?.message === "string" ? e.message : "خطأ غير معروف في الخادم." });
  }
}
