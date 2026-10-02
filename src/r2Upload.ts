import { auth } from './firebase';

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const IBRA_R2_WORKER_URL = 'https://yellow-bar-9020ibra-id-card-upload.bahibarhouma15.workers.dev';

function safeFileName(name: string) {
  return String(name || 'image')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .slice(-120);
}

async function waitForAuthenticatedUser(timeoutMs = 10000) {
  if (auth.currentUser) return auth.currentUser;

  return new Promise<NonNullable<typeof auth.currentUser>>((resolve, reject) => {
    let finished = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (finished) return;
      if (user) {
        finished = true;
        if (timer) clearTimeout(timer);
        unsubscribe();
        resolve(user);
      }
    });

    timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      unsubscribe();
      reject(new Error('جلسة الإدارة غير جاهزة. أعد فتح لوحة الإدارة ثم حاول مرة أخرى.'));
    }, timeoutMs);
  });
}

/**
 * All admin image uploads use the Cloudflare R2 Worker.
 * Firebase Storage is intentionally not used.
 */
export async function uploadImageToIbraR2(
  file: File,
  category = 'portfolio',
  maxSizeMb = 15,
): Promise<{ url: string; key: string; name: string }> {
  if (!file) throw new Error('لم يتم اختيار ملف.');

  const user = await waitForAuthenticatedUser();

  if (!IMAGE_TYPES.includes(file.type)) {
    throw new Error('الصورة يجب أن تكون JPG أو PNG أو WEBP.');
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`حجم الصورة يتجاوز ${maxSizeMb}MB.`);
  }

  const token = await user.getIdToken(true);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'portfolio');
  formData.append('category', String(category || 'portfolio'));
  formData.append('name', safeFileName(file.name));

  let response: Response;
  try {
    response = await fetch(IBRA_R2_WORKER_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
      cache: 'no-store',
    });
  } catch (error) {
    console.error('R2 Worker network error:', error);
    throw new Error('تعذر الاتصال بتخزين Ibra R2. تحقق من الإنترنت ثم أعد المحاولة.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.key) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('رفض رفع الملف. أعد تسجيل الدخول إلى لوحة الإدارة ثم حاول مرة أخرى.');
    }
    throw new Error(data?.error || data?.message || `فشل رفع الملف إلى R2 (HTTP ${response.status}).`);
  }

  const key = String(data.key);
  const url = String(data.url || `${IBRA_R2_WORKER_URL}/?key=${encodeURIComponent(key)}`);

  return {
    url,
    key,
    name: file.name,
  };
}
