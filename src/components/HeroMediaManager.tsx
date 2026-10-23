import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeroSlideItem } from '../types';
import { uploadImageToIbraR2 } from '../r2Upload';
import {
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Eye,
  Sliders,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

const PRESET_VIDEOS = [
  {
    title: 'موكب وزفاف الغابة السينمائي (HD)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-a-forest-41121-large.mp4',
    poster: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=90'
  },
  {
    title: 'جلسة عرسان رومانسية مع إضاءة الغروب (4K)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-41122-large.mp4',
    poster: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2000&q=90'
  },
  {
    title: 'رقصة الزفاف الأولى والمؤثرات الضوئية',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-dancing-at-their-wedding-41123-large.mp4',
    poster: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2000&q=90'
  }
];

const DEFAULT_SLIDES: HeroSlideItem[] = [
  {
    id: 'hs1',
    image: 'https://i.postimg.cc/fbZqcV5R/Re-Lens-IMG-20260625133005.jpg',
    labelAr: 'تصوير احترافي',
    labelFr: 'Photographie professionnelle',
    labelEn: 'Professional photography',
  },
  {
    id: 'hs2',
    image: 'https://i.postimg.cc/rybhhnQV/IMG-2114.avif',
    labelAr: 'تغطية المناسبات',
    labelFr: 'Couverture événementielle',
    labelEn: 'Event coverage',
  },
  {
    id: 'hs3',
    image: 'https://i.postimg.cc/jSTBX3Sx/IMG-8875.avif',
    labelAr: 'أجمل التفاصيل',
    labelFr: 'Les plus beaux détails',
    labelEn: 'Beautiful details',
  },
  {
    id: 'hs4',
    image: 'https://i.postimg.cc/2SCXvq0V/IMG-8838.avif',
    labelAr: 'إنتاج بصري',
    labelFr: 'Production visuelle',
    labelEn: 'Visual production',
  },
  {
    id: 'hs5',
    image: 'https://i.postimg.cc/RFtT29P5/IMG-8836.avif',
    labelAr: 'Ibra Production',
    labelFr: 'Ibra Production',
    labelEn: 'Ibra Production',
  },
];

export const HeroMediaManager: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { settings, updateSettings, uploadVideoFile } = useApp();

  const [videoUrl, setVideoUrl] = useState(settings.heroVideoUrl || '');
  const [videoPoster, setVideoPoster] = useState(settings.heroVideoPoster || '');
  const [enableVideo, setEnableVideo] = useState(settings.enableHeroVideo !== false);

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New slide form
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [newSlideLabel, setNewSlideLabel] = useState('');

  const currentSlides: HeroSlideItem[] = (Array.isArray(settings.heroSlides) && settings.heroSlides.length > 0)
    ? settings.heroSlides
    : DEFAULT_SLIDES;

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // 1. Toggle Video Enabled
  const handleToggleVideo = (enabled: boolean) => {
    setEnableVideo(enabled);
    updateSettings({
      ...settings,
      enableHeroVideo: enabled
    });
    showStatus(enabled ? 'تم تفعيل فيديو الخلفية بنجاح' : 'تم تعطيل الفيديو واستخدام سلايدر الصور');
  };

  // 2. Save Video URL
  const handleSaveVideoUrl = () => {
    updateSettings({
      ...settings,
      heroVideoUrl: videoUrl.trim(),
      heroVideoPoster: videoPoster.trim(),
      enableHeroVideo: Boolean(videoUrl.trim())
    });
    showStatus('تم حفظ رابط الفيديو بنجاح');
  };

  // 3. Remove Video completely
  const handleRemoveVideo = () => {
    if (!confirm('هل أنت متأكد من حذف فيديو الخلفية؟ سيتم الانتقال تلقائياً لسلايدر الصور.')) return;
    setVideoUrl('');
    setEnableVideo(false);
    updateSettings({
      ...settings,
      heroVideoUrl: '',
      enableHeroVideo: false
    });
    showStatus('تمت إزالة الفيديو والتحويل إلى سلايدر الصور');
  };

  // 4. Upload Video file
  const handleVideoFileUpload = async (file: File) => {
    if (!file) return;
    try {
      setIsUploadingVideo(true);
      const uploadedUrl = await uploadVideoFile(file);
      setVideoUrl(uploadedUrl);
      setEnableVideo(true);
      updateSettings({
        ...settings,
        heroVideoUrl: uploadedUrl,
        enableHeroVideo: true
      });
      showStatus('تم رفع الفيديو وتعيينه كخلفية رئيسية بنجاح!');
    } catch (err: any) {
      alert('خطأ أثناء رفع الفيديو: ' + (err?.message || 'خطأ غير معروف'));
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // 5. Select preset video
  const handleSelectPreset = (preset: typeof PRESET_VIDEOS[0]) => {
    setVideoUrl(preset.url);
    setVideoPoster(preset.poster);
    setEnableVideo(true);
    updateSettings({
      ...settings,
      heroVideoUrl: preset.url,
      heroVideoPoster: preset.poster,
      enableHeroVideo: true
    });
    showStatus(`تم تعيين "${preset.title}" بنجاح`);
  };

  // 6. Delete a Slide
  const handleDeleteSlide = (slideId: string) => {
    const updated = currentSlides.filter(s => s.id !== slideId);
    updateSettings({
      ...settings,
      heroSlides: updated
    });
    showStatus('تم حذف الصورة من الخلفية');
  };

  // 7. Add slide via URL
  const handleAddSlideViaUrl = () => {
    if (!newSlideUrl.trim()) return;
    const newSlide: HeroSlideItem = {
      id: 'hs_' + Date.now(),
      image: newSlideUrl.trim(),
      labelAr: newSlideLabel.trim() || 'Ibra Production',
      labelFr: 'Ibra Production',
      labelEn: 'Ibra Production'
    };
    const updated = [...currentSlides, newSlide];
    updateSettings({
      ...settings,
      heroSlides: updated
    });
    setNewSlideUrl('');
    setNewSlideLabel('');
    showStatus('تمت إضافة الصورة إلى سلايدر الخلفية');
  };

  // 8. Upload image file for slide
  const handleSlideImageUpload = async (file: File) => {
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const res = await uploadImageToIbraR2(file, 'hero_slides');
      const newSlide: HeroSlideItem = {
        id: 'hs_' + Date.now(),
        image: res.url,
        labelAr: newSlideLabel.trim() || file.name.replace(/\.[^/.]+$/, ''),
        labelFr: 'Ibra Production',
        labelEn: 'Ibra Production'
      };
      const updated = [...currentSlides, newSlide];
      updateSettings({
        ...settings,
        heroSlides: updated
      });
      setNewSlideLabel('');
      showStatus('تم رفع الصورة بنجاح وإضافتها لسلايدر الخلفية');
    } catch (err: any) {
      alert('خطأ أثناء رفع الصورة: ' + (err?.message || 'خطأ غير معروف'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 9. Reset to default slides
  const handleResetSlides = () => {
    if (!confirm('استرجاع الصور الافتراضية الأصلية لخلفية الموقع؟')) return;
    updateSettings({
      ...settings,
      heroSlides: DEFAULT_SLIDES
    });
    showStatus('تمت استعادة صور الخلفية الأصلية');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Film className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
              التحكم في فيديو وصور خلفية الواجهة (Hero Media)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1.5">
            أنت المتحكم الكامل: أضف أو احذف فيديو الأعراس، تحكم في تشغيله، وأضف أو احذف صور السلايدر الخلفي.
          </p>
        </div>

        {statusMessage && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            {statusMessage}
          </div>
        )}
      </div>

      {/* SECTION 1: VIDEO CONTROLS */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">فيديو الخلفية السينمائي (Cinematic Hero Video)</h3>
              <p className="text-xs text-neutral-400">يعمل تلقائياً في الخلفية مع وضع كتم الصوت وأزرار تحكم للزائر</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableVideo}
                onChange={(e) => handleToggleVideo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              <span className="ms-3 text-xs font-semibold text-neutral-300">
                {enableVideo ? 'الفيديو مفعّل' : 'الفيديو معطّل'}
              </span>
            </label>
          </div>
        </div>

        {/* Current Video Preview & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              رابط الفيديو المباشر (MP4 / WebM / CDN):
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://.../video.mp4"
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSaveVideoUrl}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors whitespace-nowrap"
              >
                تحديث الرابط
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                صورة البوستر الاحتياطية (تظهر قبل تحميل الفيديو):
              </label>
              <input
                type="url"
                value={videoPoster}
                onChange={(e) => setVideoPoster(e.target.value)}
                placeholder="https://.../poster.jpg"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Video Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer border border-neutral-700 transition-all">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>{isUploadingVideo ? 'جارٍ رفع الفيديو...' : 'رفع فيديو جديد من الجهاز (MP4/WebM)'}</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  disabled={isUploadingVideo}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleVideoFileUpload(f);
                    e.currentTarget.value = '';
                  }}
                  className="hidden"
                />
              </label>

              {videoUrl && (
                <button
                  onClick={handleRemoveVideo}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>إزالة الفيديو</span>
                </button>
              )}
            </div>
          </div>

          {/* Video Preview Box */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-xs text-neutral-400 font-semibold">
              <span>معاينة الفيديو الحالية:</span>
              <span className={videoUrl ? 'text-emerald-400' : 'text-neutral-500'}>
                {videoUrl ? '● فيديو نشط' : '○ لا يوجد فيديو محدد'}
              </span>
            </div>

            {videoUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800">
                <video
                  src={videoUrl}
                  poster={videoPoster || '/img1.jpg'}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video rounded-xl border border-dashed border-neutral-800 flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                <Film className="w-10 h-10 mb-2 text-neutral-600" />
                <p className="text-xs">لا يوجد فيديو خلفية حالياً.</p>
                <p className="text-[11px] text-neutral-600 mt-1">يتم عرض سلايدر الصور في الخلفية تلقائياً.</p>
              </div>
            )}

            {/* Presets */}
            <div className="mt-4 pt-4 border-t border-neutral-800/80">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                فيديوهات سينمائية جاهزة ومضمونة للأعراس (اختر بنقرة واحدة):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_VIDEOS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset)}
                    className="p-2 text-start rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-[11px] text-neutral-300 transition-all flex items-center gap-2 group"
                  >
                    <Play className="w-3 h-3 text-amber-400 group-hover:scale-110 shrink-0" />
                    <span className="truncate">{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SLIDESHOW PHOTOS CONTROLS */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">صور وسلايدر الخلفية (Hero Background Photos)</h3>
              <p className="text-xs text-neutral-400">
                الصور التي تظهر في الخلفية عند تعطيل الفيديو أو في السلايدر المتنقل ({currentSlides.length} صور حالية)
              </p>
            </div>
          </div>

          <button
            onClick={handleResetSlides}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold border border-neutral-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>استعادة الصور الأصلية</span>
          </button>
        </div>

        {/* Current Slides Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentSlides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 aspect-[4/3] shadow-lg flex flex-col justify-end"
            >
              <img
                src={slide.image}
                alt={slide.labelAr || 'Hero background'}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteSlide(slide.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-500 shadow-md transition-all opacity-0 group-hover:opacity-100"
                title="حذف هذه الصورة من الخلفية"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="relative p-2.5 z-10 text-[11px] font-bold text-white truncate">
                <span className="text-amber-400 font-mono text-[10px] ml-1">#{idx + 1}</span>
                {slide.labelAr || 'صورة الخلفية'}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Slide Form */}
        <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة صورة جديدة لسلايدر الخلفية
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <input
                type="url"
                value={newSlideUrl}
                onChange={(e) => setNewSlideUrl(e.target.value)}
                placeholder="أدخل رابط صورة مباشر (https://.../photo.jpg)"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={newSlideLabel}
                onChange={(e) => setNewSlideLabel(e.target.value)}
                placeholder="تسمية الصورة (مثال: ليلة العمر)"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddSlideViaUrl}
              disabled={!newSlideUrl.trim()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-xl transition-all"
            >
              إضافة الصورة بالرابط
            </button>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold cursor-pointer border border-neutral-700 transition-all">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>{isUploadingImage ? 'جارٍ رفع الصورة...' : 'أو رفع صورة من الجهاز'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isUploadingImage}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleSlideImageUpload(f);
                  e.currentTarget.value = '';
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
