// Sellora AI - Cloudflare Worker - API فقط
// Pages بيخدم الموقع - Worker بيخدم /api/* بس
// النماذج: Groq qwen/qwen3.8-27b + Google gemma-4-31b-it - ما اتغيرت

const INSTRUCTION_GROQ_QWEN = `
أنت كاتب إعلانات محترف.
باللهجة التي يطلبها المستخدم، بطريقة طبيعية مريحة.
كتابتك جذابة، وواضحة، ومقنعة.
هدفك هو مساعدة التاجر على تقديم ما يعلن عنه بطريقة طبيعية ومقنعة.
عندما يطلب منك المستخدم كتابة إعلان، فكّر بهدوء في جميع المعلومات التي يقدمها لك.
لا تتجاهل أي معلومة. استخدم كل معلومة في مكانها المناسب.
العنصر الأول هو البداية. ابدأ بجملة تستهدف القارئ. يمكن أن تبدأ بسؤال، أو بموقف يومي يعيشه القارئ. وإذا كان هناك اسم للمتجر / الخدمة / الموقع / التطبيق، اذكره في البداية.
العنصر الثاني هو الشيء المعلن عنه ونوعه. اذكر اسم المنتج / الخدمة / الموقع / التطبيق، ونوعه، بطريقة طبيعية. لا تقل دائما "منتج" - إذا كان خدمة قل "خدمة"، وإذا كان موقعا قل "موقع"، وإذا كان تطبيقا قل "تطبيق"، حسب ما يرسله المستخدم في خانة النوع.
العنصر الثالث هو الجمهور والمكان. وجّه كلامك للجمهور المستهدف. واذكر الدولة والمدينة إذا كانت متوفرة.
العنصر الرابع هو السعر والعرض. اذكر السعر إذا كان متوفرا. واذكر العرض إذا كان موجودا، مثل التوصيل المجاني أو الخصم أو الاشتراك المجاني. واذكر التوصيل / طريقة الاستلام إذا كانت متوفرة.
العنصر الخامس هو الشعور بالفرصة. وضّح أن الفرصة جيدة. وأن من الأفضل أن لا يؤجل، حتى لا تفوته. دون ضغط، وتخويف زائد.
العنصر السادس هو النبرة. التزم بالنبرة التي يطلبها التاجر.
العنصر السابع هو المنصة والطول. إذا كان لفيسبوك اجعله مناسبا للفيسبوك. وإذا كان لواتساب اجعله قصيرا وواضحا. وإذا كان لتيك توك اجعله قصيرا وحماسيا. والتزم بالطول المطلوب.
العنصر الثامن هو التواصل. في النهاية اذكر طريقة التواصل. إذا كان هناك رقم واتساب اذكره. وإذا كان هناك رابط للصفحة أو الموقع أو التطبيق اذكره. إذا لم يكن هناك رقم، اكتب: اطلب عبر الرسائل الخاصة - أو سجّل من الرابط - أو حمّل التطبيق - حسب نوع الشيء.
العنصر التاسع - ممنوع تماما: لا تكتب وصف الصورة داخل الإعلان. لا تكتب كلمة Image Description. لا تكتب وصف صورة. لا تكتب أي نص إنجليزي. أعد الإعلان النصي فقط. وصف الصورة سيتم طلبه في رسالة منفصلة.
ملاحظات: اكتب باللهجة المطلوبة فقط. استخدم كلمات عامية حقيقية من نفس اللهجة. اجعل الجمل قصيرة وواضحة. لا تستخدم كلمات عامة مثل جودة ممتازة، بل اذكر تفاصيل حقيقية. لا تكتب مقدمة عن نفسك، ادخل مباشرة في الإعلان. إذا كانت هناك خانة فارغة، تجاهلها بهدوء، ولا تخترع معلومات.
`;

const INSTRUCTION_GOOGLE_GEMMA = `
أنت كاتب إعلانات محترف متخصص في اللهجات العربية.
مهمتك: البيع، مش الكتابة بس. خلي القارئ يطلب الآن.
اكتب الإعلان النهائي فقط. لا تفكر بصوت عالي. لا تكتب شرح. لا تكتب Hook / Structure / Tone / Check. لا تكتب مقدمة مثل "إليك الإعلان". ابدأ بالإعلان طوالي.
القواعد:
- اكتب باللهجة المطلوبة فقط. ممنوع الفصحى إلا إذا طلبها المستخدم.
- ممنوع كلمات باردة: اكتشف، سارع، اغتنم الفرصة، نفاد المخزون، جودة ممتازة، منتج رائع.
- استخدم كلمات عامية حية من نفس اللهجة: جامد، تحفة، الحق بسرعة، هتندم لو فاتك، الكمية بتخلص، كلهم جابوه إلا انت، زهقت، يا زول، ألحق، رهيب، ما تفوتك.
- كل جملة في سطر. جمل قصيرة. 4 إيموجي بس في الإعلان كلو.
- استخدم كل معلومات المستخدم. لو خانة فارغة، تجاهلها، لا تخترع.
البنية - امشي عليها بالترتيب ده:
1. سؤال يمس مشكلة يومية حقيقية. مثال: زهقت من...؟
2. سطر واحد يوصف معاناتو.
3. اسم الشيء المعلن عنه فورا. لا تقل دائما "منتج". لو خدمة قل "خدمة". لو موقع قل "موقع". لو تطبيق قل "تطبيق". قدمه كحل، مش منتج عادي.
4. تفصيلة واحدة حقيقية من المميزات. لا تخترع ميزة.
5. السعر بوضوح، ثم العرض. اجعل العرض أكبر من السعر.
6. جملتين للضغط: الكمية محدودة - ألحق قبل ما تخلص.
7. أمر مباشر واحد: اطلب الآن / سجّل الآن / حمّل الآن. ثم واتساب إن وُجد.
8. في النهاية فقط: اسم المتجر، واتساب، رابط الصفحة، رابط الموقع / التطبيق.
ممنوع تماما:
- ممنوع وصف الصورة داخل الإعلان. ممنوع كلمة Image Description. ممنوع وصف صورة.
- ممنوع أي نص إنجليزي.
- ممنوع تكرار اسم المنتج أكثر من مرتين.
مثال على الشكل المطلوب - بنفس الروح دي، مش تنسخه:
زهقت من اللف في المحلات ومابتلاقيش اللي بتدور عليه؟
ولا الشحن اللي بياكل نص تمن الحاجة؟
ريح دماغك خالص مع "موقع سوقنا".
ده أكبر موقع تسوق في مصر.
عندك أكتر من 5000 منتج في مكان واحد.
ادخل سجل واطلب كل اللي نفسك فيه بضغطة واحدة.
والدفع عند الاستلام عشان تكون مطمن.
توصيل طيارة للقاهرة ولكل المحافظات.
التسجيل مجاني تماماً.
ومش بس كدة، ليك خصم 30% على أول طلب ليك.
ولو طلبت بحاجة فوق الـ 500 جنيه، الشحن هيكون مجاني لحد باب البيت.
الناس كلها بدأت تطلب وتوفر.
هتفضل تتفرج والخصم يطير منك؟
الكميات بتخلص والكل جاب اللي ناقصه إلا أنت.
سجل الآن.
موقع سوقنا
واتساب: 00201000000000
رابط الصفحة: https://facebook.com/souqna
رابط الموقع: https://souqna.com
`;

function b64Encode(str){ const bytes = new TextEncoder().encode(str); let bin=''; bytes.forEach(b=>bin+=String.fromCharCode(b)); return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function b64Decode(str){ str=str.replace(/-/g,'+').replace(/_/g,'/'); while(str.length%4) str+='='; const bin=atob(str); const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0)); return new TextDecoder().decode(bytes); }

async function hmacSign(secret, data){
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return b64Encode(String.fromCharCode(...new Uint8Array(sig)));
}
async function createToken(env, user){
  const header = b64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64Encode(JSON.stringify({ ...user, exp: Date.now() + 7*24*3600*1000 }));
  const sig = await hmacSign(env.JWT_SECRET || 'sellora-fallback-secret-change-me', header + '.' + body);
  return `${header}.${body}.${sig}`;
}
async function verifyToken(req, env){
  try{
    const auth = req.headers.get('Authorization') || '';
    const token = auth.replace('Bearer ', '');
    if(!token) return null;
    const parts = token.split('.');
    if(parts.length !== 3) return null;
    const expected = await hmacSign(env.JWT_SECRET || 'sellora-fallback-secret-change-me', parts[0] + '.' + parts[1]);
    if(expected !== parts[2]) return null;
    const payload = JSON.parse(b64Decode(parts[1]));
    if(payload.exp && payload.exp < Date.now()) return null;
    return payload;
  }catch{ return null; }
}

function getAllKeys(env){
  return [
    { type: 'groq', key: env.GROQ_KEY1 }, { type: 'groq', key: env.GROQ_KEY2 }, { type: 'groq', key: env.GROQ_KEY3 }, { type: 'groq', key: env.GROQ_KEY4 },
    { type: 'groq', key: env.GROQ_KEY5 }, { type: 'groq', key: env.GROQ_KEY6 }, { type: 'groq', key: env.GROQ_KEY7 }, { type: 'groq', key: env.GROQ_KEY8 },
    { type: 'google', key: env.GOOGLE_STUDIO_KEY1 }, { type: 'google', key: env.GOOGLE_STUDIO_KEY2 }, { type: 'google', key: env.GOOGLE_STUDIO_KEY3 }, { type: 'google', key: env.GOOGLE_STUDIO_KEY4 },
  ].filter(k => k.key);
}
async function pickKeyForRequest(env){
  const keys = getAllKeys(env);
  if(keys.length === 0) throw new Error('لا يوجد أي مفتاح');
  let counter = 0;
  try{ counter = parseInt(await env.TAJER_KV.get('unified_key_counter') || '0'); }catch(e){ counter = 0; }
  const index = counter % keys.length;
  try{ await env.TAJER_KV.put('unified_key_counter', String(counter + 1)); }catch(e){}
  return { selected: keys[index], startIndex: index, keys };
}
async function callGroqWithKey(env, key, userPrompt, maxTokens){
  const res = await fetch(`${env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'}/chat/completions`, {
    method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: env.GROQ_MODEL || 'qwen/qwen3.8-27b', messages: [{ role: 'system', content: INSTRUCTION_GROQ_QWEN }, { role: 'user', content: userPrompt }], temperature: 0.7, max_tokens: maxTokens })
  });
  if(!res.ok) throw new Error('Groq failed');
  const d = await res.json(); const text = d.choices?.[0]?.message?.content; if(!text) throw new Error('Groq empty'); return text;
}
async function callGoogleWithKey(env, key, userPrompt, maxTokens){
  const fullPrompt = `${INSTRUCTION_GOOGLE_GEMMA}\n\n---\n\n${userPrompt}\n\nاكتب الإعلان النهائي فقط - بدون تفكير - بدون شرح.`;
  const res = await fetch(`${env.GOOGLE_STUDIO_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta'}/models/${env.GOOGLE_STUDIO_MODEL || 'gemma-4-31b-it'}:generateContent?key=${key}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: INSTRUCTION_GOOGLE_GEMMA }] }, contents: [{ parts: [{ text: fullPrompt }] }], generationConfig: { temperature: 1.0, topP: 0.95, topK: 64, maxOutputTokens: maxTokens, thinkingConfig: { thinkingLevel: "MINIMAL" } } })
  });
  if(!res.ok) throw new Error('Google Studio failed');
  const d = await res.json(); const parts = d.candidates?.[0]?.content?.parts || []; const text = parts.filter(p => p.text && !p.thought).map(p => p.text).join('').trim(); if(!text) throw new Error('Google empty'); return text;
}
async function callWithRotation(env, picked, userPrompt, maxTokens){
  const { keys, startIndex } = picked;
  for(let i = 0; i < keys.length; i++){ const k = keys[(startIndex + i) % keys.length]; try{ if(k.type === 'groq') return await callGroqWithKey(env, k.key, userPrompt, maxTokens); else return await callGoogleWithKey(env, k.key, userPrompt, maxTokens); }catch(e){ continue; } }
  throw new Error('كل المفاتيح الـ 12 فشلت');
}
function validateRequiredServer(b){
  if(!b.product || !String(b.product).trim()) return 'الخانة 1 - اسم المنتج - إجبارية';
  if(!b.productFeatures || !String(b.productFeatures).trim()) return 'الخانة 2 - وصف / مميزات المنتج - إجبارية';
  if(!b.country || !String(b.country).trim()) return 'الخانة 3 - الدولة - إجبارية';
  if(!b.dialect || !String(b.dialect).trim()) return 'الخانة 4 - اللهجة - إجبارية';
  if(!b.category || !String(b.category).trim()) return 'الخانة 6 - التصنيف - إجبارية';
  if(!b.length || !String(b.length).trim()) return 'الخانة 12 - طول الإعلان - إجبارية';
  if(!b.shopName || !String(b.shopName).trim()) return 'الخانة 14 - اسم المتجر - إجبارية';
  return null;
}
function buildUserData(b){
  return `البيانات:\n1. اسم المنتج / الخدمة / الموقع / التطبيق: ${b.product}\n2. وصف / مميزات: ${b.productFeatures || 'غير محدد'}\n3. الدولة: ${b.country || 'غير محدد'}\n4. اللهجة المطلوبة: ${b.dialect || 'فصحى'}\n5. المدينة أو المكان: ${b.city || 'غير محدد'}\n6. نوع الشيء المعلن عنه: ${b.category || 'غير محدد'} - منتج / خدمة / موقع / تطبيق - التزم بهذا النوع ولا تغيره\n7. السعر: ${b.price || 'غير محدد'}\n8. التوصيل: ${b.delivery || 'غير محدد'}\n9. طريقة الاستلام: ${b.pickupMethod || 'غير محدد'}\n10. رقم واتساب: ${b.whatsapp || 'غير محدد'}\n11. لغة الإعلان: عربي\n12. طول الإعلان: ${b.length || 'تلقائي'}\n13. المنصة التي سينشر فيها الإعلان: ${b.platform || 'جميع المنصات'}\n14. اسم المتجر / الخدمة / الموقع / التطبيق: ${b.shopName || 'غير محدد'}\n15. العرض: ${b.offer || 'لا يوجد'}\n16. الجمهور المستهدف: ${b.audience || 'الجميع'}\n17. نبرة الإعلان: ${b.tone || 'حماسية'}\n18. رابط الصفحة: ${b.pageLink || 'غير محدد'}\n19. هل لديه صورة؟: ${b.hasImage || 'أرغب في وصف صورة'}\n20. رابط الخدمة / الموقع / التطبيق: ${b.serviceLink || 'غير محدد'}`;
}
function buildPrompt1(b){ return `${buildUserData(b)}\nالمطلوب: اكتب إعلانا واحدا فقط، باللغة: عربي، وباللهجة: ${b.dialect || 'فصحى'}، وبالنبرة: ${b.tone || 'حماسية'}، وبالطول: ${b.length || 'تلقائي'}، ومناسبا للمنصة: ${b.platform || 'جميع المنصات'}. أعد الإعلان فقط.`; }
function buildPrompt2(b){ return `${buildUserData(b)}\nالمطلوب: اكتب وصف صورة واحد فقط بالإنجليزية، فقرة واحدة، لصورة إعلانية احترافية للشيء أعلاه. إذا كان منتجا صف المنتج، وإذا كانت خدمة صف شخصا يستخدم الخدمة، وإذا كان موقعا أو تطبيقا صف شاشة هاتف تعرض الموقع / التطبيق. بدون أي نص داخل الصورة. أعد وصف الصورة فقط.`; }
async function generate(env, body){
  const picked = await pickKeyForRequest(env);
  let adText = await callWithRotation(env, picked, buildPrompt1(body), 1500);
  const cutWords = ['Image Description', 'وصف الصورة', 'Image Prompt', 'Description:'];
  for(const w of cutWords){ if(adText.includes(w)) adText = adText.split(w)[0].trim(); }
  let imagePrompt = '';
  try{ imagePrompt = await callWithRotation(env, picked, buildPrompt2(body), 500); }
  catch(e){ imagePrompt = `Professional advertising photo for ${body.product}, bright natural light, high quality, 4K, attractive background.`; }
  return { adText: adText.trim(), imagePrompt: imagePrompt.trim() };
}
async function saveUserToKV(env, user){
  if(!user || !user.email) return user;
  const key = `user:${user.email}`; let old = {};
  try{ old = JSON.parse(await env.TAJER_KV.get(key) || '{}'); }catch(e){ old = {}; }
  const data = { name: user.name || old.name || '', email: user.email, pic: user.pic || user.picture || old.pic || old.picture || '', picture: user.pic || user.picture || old.pic || old.picture || '', createdAt: old.createdAt || Date.now(), lastLogin: Date.now() };
  await env.TAJER_KV.put(key, JSON.stringify(data)); return data;
}
async function getUserFromKV(env, email){ if(!email) return null; try{ const raw = await env.TAJER_KV.get(`user:${email}`); if(!raw) return null; return JSON.parse(raw); }catch(e){ return null; } }
async function saveAdToD1(env, email, product, adText, imagePrompt, payload){
  const norm = (adText||'').trim().slice(0,120);
  await env.SELLORA_DB.prepare("DELETE FROM ads WHERE email = ? AND substr(adText,1,120) = ?").bind(email, norm).run();
  await env.SELLORA_DB.prepare("INSERT INTO ads (email, product, adText, imagePrompt, payload, date) VALUES (?,?,?,?,?,?)").bind(email, product||'إعلان', adText||'', imagePrompt||'', JSON.stringify(payload||{product:product||'إعلان'}), Date.now()).run();
  await env.SELLORA_DB.prepare("DELETE FROM ads WHERE email = ? AND id NOT IN (SELECT id FROM ads WHERE email = ? ORDER BY date DESC LIMIT 50)").bind(email, email).run();
}
async function getAdsFromD1(env, email){
  const { results } = await env.SELLORA_DB.prepare("SELECT product, adText, imagePrompt, payload, date FROM ads WHERE email = ? ORDER BY date DESC LIMIT 50").bind(email).all();
  return (results||[]).map(r=>{ let payload={}; try{ payload=JSON.parse(r.payload||'{}'); }catch(e){} return { product:r.product, adText:r.adText, text:r.adText, imagePrompt:r.imagePrompt||'', payload, date:r.date }; });
}
export default {
  async fetch(request, env, ctx){
    const url = new URL(request.url);
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };
    if(request.method === 'OPTIONS') return new Response(null, { headers: cors });
    const json = (obj, status=200) => Response.json(obj, { status, headers: cors });
    if(!url.pathname.startsWith('/api/')){ return new Response('Not Found - API only', { status: 404, headers: cors }); }
    if(url.pathname === '/api/config' && request.method === 'GET'){ return json({ googleClientId: env.GOOGLE_CLIENT_ID || '' }); }
    if(url.pathname === '/api/auth/google' && request.method === 'POST'){
      try{
        const { credential } = await request.json();
        const v = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        if(!v.ok) return json({ error: 'فشل التحقق من Google' }, 401);
        const payload = await v.json();
        if(!payload.email || (env.GOOGLE_CLIENT_ID && payload.aud !== env.GOOGLE_CLIENT_ID)) return json({ error: 'فشل التحقق من Google' }, 401);
        const userInput = { email: payload.email, name: payload.name, picture: payload.picture || '', pic: payload.picture || '' };
        const user = await saveUserToKV(env, userInput);
        const token = await createToken(env, user);
        return json({ token, user });
      }catch(e){ return json({ error: 'فشل التحقق من Google' }, 401); }
    }
    if(url.pathname === '/api/me' && request.method === 'GET'){ const u = await verifyToken(request, env); if(!u) return json({ error: 'يرجى تسجيل الدخول' }, 401); const user = await getUserFromKV(env, u.email) || u; return json({ user }); }
    if(url.pathname === '/api/me/update' && request.method === 'POST'){ const u = await verifyToken(request, env); if(!u) return json({ error: 'يرجى تسجيل الدخول' }, 401); const b = await request.json(); const old = await getUserFromKV(env, u.email) || u; const updated = { name: (b.name || '').trim() || old.name, email: u.email, pic: b.pic || b.picture || old.pic || old.picture || '', picture: b.pic || b.picture || old.pic || old.picture || '' }; const saved = await saveUserToKV(env, updated); return json({ user: saved }); }
    if(url.pathname === '/api/auto-login' && request.method === 'GET'){ return json({ user: null }); }
    if(url.pathname === '/api/quota'){ const user = await verifyToken(request, env); if(!user) return json({ error: 'يرجى تسجيل الدخول أولاً للمتابعة.' }, 401); const today = new Date().toISOString().slice(0,10); const key = `count:${user.email}:${today}`; const count = parseInt(await env.TAJER_KV.get(key) || '0'); return json({ count, remaining: 10 - count }); }
    if(url.pathname === '/api/ads' && request.method === 'GET'){ const user = await verifyToken(request, env); if(!user) return json({ ads: [] }); try{ const ads = await getAdsFromD1(env, user.email); return json({ ads }); }catch(e){ return json({ ads: [] }); } }
    if(url.pathname === '/api/ads' && request.method === 'POST'){ const user = await verifyToken(request, env); if(!user) return json({ error: 'يرجى تسجيل الدخول أولاً للمتابعة.' }, 401); const ad = await request.json(); try{ await saveAdToD1(env, user.email, ad.product, ad.adText||ad.text, ad.imagePrompt, ad.payload); return json({ ok: true }); }catch(e){ return json({ ok: false }, 500); } }
    if(url.pathname === '/api/ads/delete' && request.method === 'POST'){ const user = await verifyToken(request, env); if(!user) return json({ error: 'يرجى تسجيل الدخول' }, 401); const { date } = await request.json(); try{ await env.SELLORA_DB.prepare("DELETE FROM ads WHERE email = ? AND date = ?").bind(user.email, Number(date)).run(); return json({ ok: true }); }catch(e){ return json({ ok: false }, 500); } }
    if(url.pathname === '/api/feedback' && request.method === 'POST'){ try{ const b = await request.json(); const user = await verifyToken(request, env); const key = `feedback:${user?.email || 'anon'}:${Date.now()}`; await env.TAJER_KV.put(key, JSON.stringify({ ...b, email: user?.email || b.email || '', date: new Date().toISOString() })); return json({ ok: true }); }catch(e){ return json({ ok: false }, 500); } }
    if(url.pathname === '/api/generate-trial' && request.method === 'POST'){ const body = await request.json(); const err = validateRequiredServer(body); if(err) return json({ error: err }, 400); try{ const out = await generate(env, body); return json({ ...out, trial: true }); }catch(e){ return json({ error: 'حدثت مشكلة في توليد الإعلان - يرجى المحاولة مرة أخرى' }, 500); } }
    if(url.pathname === '/api/generate' && request.method === 'POST'){
      const user = await verifyToken(request, env); if(!user) return json({ error: 'يرجى تسجيل الدخول أولاً للمتابعة.' }, 401);
      const today = new Date().toISOString().slice(0,10); const key = `count:${user.email}:${today}`; let count = parseInt(await env.TAJER_KV.get(key) || '0'); if(count >= 10) return json({ error: 'لقد استهلكت حصتك اليومية. يمكنك المحاولة غداً.' }, 429);
      const body = await request.json(); const err = validateRequiredServer(body);
      if(err) return json({ error: err }, 400);
      try{
        const out = await generate(env, body);
        await env.TAJER_KV.put(key, String(count + 1), { expirationTtl: 86400 });
        try{ await saveAdToD1(env, user.email, body.product, out.adText, out.imagePrompt, body); }catch(e){}
        return json(out);
      }catch(e){ return json({ error: 'حدثت مشكلة في توليد الإعلان - يرجى المحاولة مرة أخرى' }, 500); }
    }
    return new Response('Not Found', { status: 404, headers: cors });
  }
};
