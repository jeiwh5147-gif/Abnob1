CodeMind AI — مشروع مُجهّز لإصلاح الاتصال وبناء APK

ماذا تم تغييره؟
- أضفنا خادم محادثة في api/chat.js يرسل الطلبات إلى Groq.
- المفتاح يبقى في متغير بيئة على الخادم، ولا يوضع في APK.
- التطبيق يوضح تفاصيل أخطاء HTTP بدل [object Object].
- صلحنا مكان ملف GitHub Actions إلى .github/workflows حتى يكتشفه GitHub.
- رابط الخادم في إعدادات التطبيق يجب أن يكون رابط Vercel الأساسي فقط، والتطبيق يضيف /api/chat تلقائيًا.

خطوات النشر (تحتاج تسجيل دخولك أنت):
1. فك ضغط الحزمة وارفع جميع محتوياتها إلى مستودع GitHub جديد.
2. افتح Vercel وسجّل الدخول باستخدام GitHub، ثم أنشئ مشروعًا من المستودع.
3. في Vercel > Settings > Environment Variables أضف:
   Name: GROQ_API_KEY
   Value: مفتاح Groq الخاص بك
4. انشر المشروع Deploy، ثم انسخ رابط الموقع، مثل https://your-project.vercel.app
5. في التطبيق > ⚙ أدخل رابط الموقع الأساسي فقط، بدون /api/chat، ثم احفظ.
6. لبناء APK: في GitHub > Actions > Build CodeMind AI APK > Run workflow.
7. بعد النجاح، افتح نتيجة التشغيل > Artifacts > CodeMind-AI-APK.zip ونزّل الملف، ثم فك الضغط وثبّت app-debug.apk.

إذا ظهر خطأ عن اسم النموذج، أضف متغير Vercel باسم GROQ_MODEL وقيمة اسم نموذج متاح في حساب Groq.
لا تشارك مفتاح API. لم يتم نشر الخادم تلقائيًا لأن ذلك يتطلب تسجيل الدخول إلى حساباتك.
