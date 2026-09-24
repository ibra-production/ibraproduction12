import { auth } from './firebase';

export const IBRA_R2_WORKER_URL =
  'https://yellow-bar-9020ibra-id-card-upload.bahibarhouma15.workers.dev';

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function uploadImageToIbraR2(
  file: File,
  category = 'portfolio',
  maxSizeMb = 15,
): Promise<{ url: string; key: string; name: string }> {
  if (!file) throw new Error('لم يتم اختيار ملف.');
  if (!auth.currentUser) throw new Error('انتهت جلسة الإدارة. أعد تسجيل الدخول.');
  if (!IMAGE_TYPES.includes(file.type)) {
    throw new Error('الصورة يجب أن تكون JPG أو PNG أو WEBP.');
  }
  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`حجم الصورة يتجاوز ${maxSizeMb}MB.`);
  }

  const token = await auth.currentUser.getIdToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'portfolio');
  formData.append('category', category);

  const response = await fetch(IBRA_R2_WORKER_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success || !data?.key) {
    throw new Error(data?.message || data?.error || 'فشل رفع الصورة إلى التخزين.');
  }

  return {
    url: `${IBRA_R2_WORKER_URL}/?key=${encodeURIComponent(data.key)}`,
    key: String(data.key),
    name: file.name,
  };
}
