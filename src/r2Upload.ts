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
 * Direct browser upload to Firebase Storage.
 * The old function name is retained so all existing upload buttons keep working.
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

  // Force-refresh the Firebase ID token before Storage evaluates request.auth.
  await user.getIdToken(true);

  const key = `${category}/${Date.now()}_${crypto.randomUUID()}_${safeFileName(file.name)}`;
  const storageRef = ref(storage, key);

  try {
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedBy: user.uid,
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
    console.error('Direct Firebase Storage upload error:', error);

    const code = String(error?.code || '');
    if (code.includes('storage/unauthorized')) {
      throw new Error(
        'Firebase Storage رفض الرفع. تأكد أن Storage Rules المنشورة تسمح للمستخدم admin@ibraprod.online بالكتابة.'
      );
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
