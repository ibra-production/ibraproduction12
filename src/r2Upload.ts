import { auth, storage } from './firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

function safeFileName(name: string) {
  return String(name || 'image')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .slice(-120);
}

/**
 * Direct browser upload to Firebase Storage.
 * Kept under the old function name so existing admin/gallery code needs no changes.
 */
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
  if (!token) throw new Error('تعذر التحقق من جلسة الإدارة.');

  const key = `${category}/${Date.now()}_${crypto.randomUUID()}_${safeFileName(file.name)}`;
  const storageRef = ref(storage, key);

  try {
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedBy: auth.currentUser.uid,
        category,
      },
    });

    const url = await getDownloadURL(snapshot.ref);

    return {
      url,
      key,
      name: file.name,
    };
  } catch (error: any) {
    console.error('Direct image upload error:', error);
    const code = String(error?.code || '');
    if (code.includes('storage/unauthorized')) {
      throw new Error('ليس لديك صلاحية رفع الصور. تحقق من تسجيل دخول المسؤول وقواعد Storage.');
    }
    if (code.includes('storage/quota-exceeded')) {
      throw new Error('تم تجاوز حصة التخزين المتاحة.');
    }
    if (code.includes('storage/canceled')) {
      throw new Error('تم إلغاء رفع الصورة.');
    }
    throw new Error(error?.message || 'فشل رفع الصورة إلى التخزين.');
  }
}
