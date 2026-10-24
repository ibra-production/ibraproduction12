import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SiteMediaItem, HeroSlideItem } from '../types';
import { uploadImageToIbraR2 } from '../r2Upload';
import {
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  Check,
  RotateCcw,
  Video,
  MonitorPlay,
  Sliders,
  X,
  FileVideo,
  FileImage,
  CheckCircle2,
  Sparkles,
  Eye,
  Layers,
  HardDrive
} from 'lucide-react';

const PRESET_LIBRARY: Omit<SiteMediaItem, 'id' | 'createdAt'>[] = [
  {
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-a-forest-41121-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=90',
    titleAr: 'موكب وزفاف الغابة السينمائي (HD)',
    titleFr: 'Vidéo Mariage Forêt HD',
    titleEn: 'Wedding Forest Cinematic Video HD',
    isActive: true
  },
  {
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-41122-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2000&q=90',
    titleAr: 'جلسة عرسان رومانسية مع إضاءة الغروب (4K)',
    titleFr: 'Romance Coucher de Soleil 4K',
    titleEn: 'Couple Romance Sunset 4K',
    isActive: false
  },
  {
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-dancing-at-their-wedding-41123-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=2000&q=90',
    titleAr: 'رقصة الزفاف الأولى والمؤثرات الضوئية (4K)',
    titleFr: 'Première Danse Féerique 4K',
    titleEn: 'First Wedding Dance 4K',
    isActive: false
  },
  {
    type: 'image',
    url: 'https://i.postimg.cc/fbZqcV5R/Re-Lens-IMG-20260625133005.jpg',
    titleAr: 'جلسة تصوير العرسان - بورتريه ملكي',
    titleFr: 'Portrait Royal Mariés',
    titleEn: 'Royal Couple Portrait',
    isActive: true
  },
  {
    type: 'image',
    url: 'https://i.postimg.cc/rybhhnQV/IMG-2114.avif',
    titleAr: 'تغطية مناسبات - قاعة الأعراس الفاخرة',
    titleFr: 'Salle des Fêtes Premium',
    titleEn: 'Luxury Wedding Hall Coverage',
    isActive: true
  },
  {
    type: 'image',
    url: 'https://i.postimg.cc/jSTBX3Sx/IMG-8875.avif',
    titleAr: 'أجمل تفاصيل العروس وخاتم الزفاف',
    titleFr: 'Détails Robe et Bague',
    titleEn: 'Bridal Details & Ring',
    isActive: true
  },
  {
    type: 'image',
    url: 'https://i.postimg.cc/2SCXvq0V/IMG-8838.avif',
    titleAr: 'إنتاج بصري سينمائي مميز',
    titleFr: 'Production Visuelle Ciné',
    titleEn: 'Cinematic Visual Production',
    isActive: true
  },
  {
    type: 'image',
    url: 'https://i.postimg.cc/RFtT29P5/IMG-8836.avif',
    titleAr: 'استوديو Ibra Production المتنقل',
    titleFr: 'Studio Mobile Ibra',
    titleEn: 'Ibra Production Mobile Studio',
    isActive: true
  }
];

export const SiteMediaManager: React.FC = () => {
  const { settings, updateSettings, uploadVideoFile } = useApp();

  // Computer file upload state (NO URL inputs)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<'image' | 'video'>('image');
  const [titleAr, setTitleAr] = useState('');
  const [isActiveNew, setIsActiveNew] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'active'>('all');
  const [previewItem, setPreviewItem] = useState<SiteMediaItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive existing media items
  const mediaItems: SiteMediaItem[] = React.useMemo(() => {
    if (Array.isArray(settings.heroMediaItems) && settings.heroMediaItems.length > 0) {
      return settings.heroMediaItems;
    }
    // Fallback migration from heroSlides and heroVideoUrl
    const list: SiteMediaItem[] = [];
    if (settings.heroVideoUrl && settings.heroVideoUrl.trim()) {
      list.push({
        id: 'sm_vid_initial',
        type: 'video',
        url: settings.heroVideoUrl.trim(),
        posterUrl: settings.heroVideoPoster || '',
        titleAr: 'فيديو الخلفية الرئيسي',
        isActive: settings.enableHeroVideo !== false,
        createdAt: new Date().toISOString()
      });
    }
    if (Array.isArray(settings.heroSlides) && settings.heroSlides.length > 0) {
      settings.heroSlides.forEach((slide, idx) => {
        list.push({
          id: slide.id || `sm_img_${idx}`,
          type: 'image',
          url: slide.image,
          titleAr: slide.labelAr || 'صورة استوديو احترافية',
          isActive: true,
          createdAt: new Date().toISOString()
        });
      });
    }
    return list.length > 0 ? list : (PRESET_LIBRARY.map((p, idx) => ({ ...p, id: `preset_${idx}`, createdAt: new Date().toISOString() })));
  }, [settings.heroMediaItems, settings.heroSlides, settings.heroVideoUrl, settings.enableHeroVideo]);

  const activeMode = settings.activeHeroMediaType || 'auto';

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Helper to sync updated mediaItems into settings + legacy fields
  const syncMediaItems = (updatedItems: SiteMediaItem[], additionalSettings: Partial<typeof settings> = {}) => {
    const activeImages = updatedItems.filter(m => m.type === 'image' && m.isActive !== false);
    const updatedSlides: HeroSlideItem[] = activeImages.map(img => ({
      id: img.id,
      image: img.url,
      labelAr: img.titleAr || 'Ibra Production',
      labelFr: img.titleFr || 'Ibra Production',
      labelEn: img.titleEn || 'Ibra Production'
    }));

    const activeVideo = updatedItems.find(m => m.type === 'video' && m.isActive !== false);

    updateSettings({
      ...settings,
      heroMediaItems: updatedItems,
      heroSlides: updatedSlides.length > 0 ? updatedSlides : settings.heroSlides,
      heroVideoUrl: activeVideo ? activeVideo.url : (updatedItems.find(m => m.type === 'video')?.url || ''),
      heroVideoPoster: activeVideo?.posterUrl || settings.heroVideoPoster,
      enableHeroVideo: Boolean(activeVideo),
      ...additionalSettings
    });
  };

  // 1. Toggle item active state
  const handleToggleActive = (id: string) => {
    const updated = mediaItems.map(item => {
      if (item.id === id) {
        return { ...item, isActive: !item.isActive };
      }
      return item;
    });
    syncMediaItems(updated);
    const target = updated.find(i => i.id === id);
    showStatus(target?.isActive ? `تم تفعيل "${target.titleAr || 'العنصر'}" في الهيرو` : `تم إيقاف "${target?.titleAr || 'العنصر'}"`);
  };

  // 2. Select file from PC
  const handleSelectFile = (file: File) => {
    if (!file) return;
    const isVid = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv)$/i.test(file.name);
    setSelectedFile(file);
    setDetectedType(isVid ? 'video' : 'image');
    if (!titleAr) {
      setTitleAr(file.name.replace(/\.[^/.]+$/, ''));
    }
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const handleClearSelection = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    setTitleAr('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 3. Upload real file to storage and save to Firestore
  const handleUploadAndSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedFile) {
      alert('يرجى اختيار ملف صورة أو فيديو من الحاسوب أولاً.');
      return;
    }

    try {
      setIsUploading(true);
      const isVideo = detectedType === 'video';
      setUploadStatusText(isVideo ? 'جارٍ رفع الفيديو الحقيقي إلى التخزين السحابي...' : 'جارٍ رفع الصورة إلى التخزين السحابي...');

      let uploadedUrl = '';
      if (isVideo) {
        uploadedUrl = await uploadVideoFile(selectedFile);
      } else {
        const res = await uploadImageToIbraR2(selectedFile, 'site_media');
        uploadedUrl = res.url;
      }

      const newItem: SiteMediaItem = {
        id: `sm_${Date.now()}`,
        type: isVideo ? 'video' : 'image',
        url: uploadedUrl,
        titleAr: titleAr.trim() || (isVideo ? 'فيديو سينمائي جديد' : 'صورة خلفية جديدة'),
        isActive: isActiveNew,
        createdAt: new Date().toISOString()
      };

      const updated = [newItem, ...mediaItems];
      syncMediaItems(updated);

      handleClearSelection();
      showStatus(`تم رفع وحفظ ${isVideo ? 'الفيديو' : 'الصورة'} الحقيقي بنجاح وتفعيله في الهيرو!`);
    } catch (err: any) {
      alert('خطأ أثناء رفع الملف من الحاسوب: ' + (err?.message || 'تعذر الرفع'));
    } finally {
      setIsUploading(false);
      setUploadStatusText(null);
    }
  };

  // 4. Delete item
  const handleDeleteItem = (id: string) => {
    const item = mediaItems.find(i => i.id === id);
    if (!confirm(`هل أنت متأكد من حذف "${item?.titleAr || 'هذا العنصر'}" من وسائط الموقع؟`)) return;
    const updated = mediaItems.filter(i => i.id !== id);
    syncMediaItems(updated);
    showStatus('تم حذف العنصر بنجاح.');
  };

  // 5. Set active Hero display mode
  const handleSetMode = (mode: 'video' | 'slideshow' | 'single_image' | 'auto') => {
    updateSettings({
      ...settings,
      activeHeroMediaType: mode,
      enableHeroVideo: mode === 'video' || mode === 'auto'
    });
    showStatus(`تم تغيير نمط عرض الهيرو إلى: ${
      mode === 'video' ? 'فيديو سينمائي' :
      mode === 'slideshow' ? 'سلايدر صور' :
      mode === 'single_image' ? 'صورة مفردة' : 'تلقائي ذكي'
    }`);
  };

  // 6. Reset to Presets
  const handleLoadPresets = () => {
    if (!confirm('هل تريد استرجاع وسائط الاستوديو الافتراضية الأصلية؟')) return;
    const presetsWithIds = PRESET_LIBRARY.map((p, idx) => ({
      ...p,
      id: `preset_${Date.now()}_${idx}`,
      createdAt: new Date().toISOString()
    }));
    syncMediaItems(presetsWithIds, { activeHeroMediaType: 'auto' });
    showStatus('تم استرجاع وسائط الاستوديو الافتراضية بنجاح!');
  };

  // Filtered list
  const filteredItems = mediaItems.filter(item => {
    if (filterType === 'image') return item.type === 'image';
    if (filterType === 'video') return item.type === 'video';
    if (filterType === 'active') return item.isActive;
    return true;
  });

  const activeVideosCount = mediaItems.filter(m => m.type === 'video' && m.isActive).length;
  const activeImagesCount = mediaItems.filter(m => m.type === 'image' && m.isActive).length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-br from-amber-500/15 via-neutral-900 to-neutral-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider mb-3">
              <Film className="w-3.5 h-3.5" />
              <span>Site Media • وسائط وخلفية الهيرو</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-cinzel">
              إدارة وسائط وخلفيات الموقع (Site Media)
            </h2>
            <p className="text-sm text-neutral-300 mt-2 max-w-2xl leading-relaxed">
              تحكم حقيقي كامل من الحاسوب: ارفع فيديوهات وصور مباشرة من جهازك، حدد النمط المفضل، وتحكم في تفعيل أو إيقاف أي عنصر بضغطة واحدة.
            </p>
            
            {/* Live Count Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-bold">
              <span className="px-3 py-1 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300">
                إجمالي الوسائط: <strong className="text-white">{mediaItems.length}</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                🟢 {activeImagesCount} صور نشطة في الهيرو
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                🎬 {activeVideosCount} فيديو نشط في الهيرو
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLoadPresets}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              استعادة الافتراضي
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="mt-4 p-3 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* HERO DISPLAY MODE SELECTOR */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
          <Sliders className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">نمط عرض وسائط الواجهة الرئيسية (Hero Mode)</h3>
            <p className="text-xs text-neutral-400">اختر كيف تريد عرض الخلفية للزوار عند فتح الموقع</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'auto',
              label: 'تلقائي ذكي (موصى به)',
              desc: 'عرض فيديو سينمائي إن وجد، أو الانتقال لسلايدر الصور عند عدم توفره',
              icon: Sparkles
            },
            {
              id: 'video',
              label: 'فيديو سينمائي فقط',
              desc: 'تشغيل الفيديو النشط في الخلفية بدقة عالية وبشكل متكرر',
              icon: Film
            },
            {
              id: 'slideshow',
              label: 'سلايدر صور سينمائية',
              desc: 'تدوير الصور النشطة بتأثير زووم هادئ وفخم',
              icon: Layers
            },
            {
              id: 'single_image',
              label: 'صورة مفردة ثابتة',
              desc: 'عرض أول صورة نشطة فقط كخلفية ملكية هادئة',
              icon: ImageIcon
            }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => handleSetMode(m.id as any)}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                activeMode === m.id
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <m.icon className={`w-5 h-5 ${activeMode === m.id ? 'text-amber-400' : 'text-neutral-500'}`} />
                {activeMode === m.id && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />}
              </div>
              <div>
                <div className={`font-bold text-sm ${activeMode === m.id ? 'text-white' : 'text-neutral-300'}`}>{m.label}</div>
                <div className="text-[11px] text-neutral-500 mt-1">{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* DEDICATED COMPUTER FILE UPLOAD ZONE (NO LINKS / NO URLS) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">رفع وسائط حقيقية من الحاسوب مباشرة</h3>
              <p className="text-xs text-neutral-400">اختر صورة (JPG / PNG / WEBP) أو فيديو (MP4 / WebM / MOV) من حاسوبك</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUploadAndSave} className="space-y-5">
          {/* File Picker Zone */}
          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) handleSelectFile(file);
              }}
              className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-neutral-950/60 hover:bg-neutral-950 transition-all rounded-3xl p-8 sm:p-12 text-center cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelectFile(file);
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-white font-bold text-base sm:text-lg mb-1">
                انقر هنا لاختيار ملف من حاسوبك أو اسحبه إلى هنا
              </h4>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                يدعم صور المعرض والخلفيات (JPG, PNG, WEBP) والفيديوهات السينمائية عالية الدقة (MP4, WebM, MOV)
              </p>
              <div className="flex items-center justify-center gap-3 mt-4 text-[11px] font-bold text-neutral-500">
                <span className="flex items-center gap-1"><FileImage className="w-3.5 h-3.5 text-amber-400" /> صور حتى 15MB</span>
                <span>•</span>
                <span className="flex items-center gap-1"><FileVideo className="w-3.5 h-3.5 text-amber-400" /> فيديوهات حتى 500MB</span>
              </div>
            </div>
          ) : (
            /* Selected File Preview Box */
            <div className="p-5 rounded-2xl bg-neutral-950 border border-amber-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-black border border-neutral-800 shrink-0 relative flex items-center justify-center">
                    {detectedType === 'image' && filePreview && (
                      <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    {detectedType === 'video' && filePreview && (
                      <video src={filePreview} muted className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        detectedType === 'video' ? 'bg-amber-500 text-neutral-950' : 'bg-blue-500 text-white'
                      }`}>
                        {detectedType === 'video' ? 'فيديو' : 'صورة'}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-[320px]">
                        {selectedFile.name}
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      الحجم: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearSelection}
                  disabled={isUploading}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>تغيير الملف</span>
                </button>
              </div>

              {/* Title input & Active toggle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-800/80">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                    عنوان أو وصف العنصر (يظهر في الهيرو):
                  </label>
                  <input
                    type="text"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: موكب زفاف الغابة الفاخر"
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActiveNew}
                      onChange={(e) => setIsActiveNew(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-neutral-200">
                      تفعيل في الهيرو فوراً بعد الرفع
                    </span>
                  </label>
                </div>
              </div>

              {/* Upload Action Button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Upload className="w-4 h-4 animate-spin" />
                      <span>{uploadStatusText || 'جارٍ الرفع والحفظ...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>رفع الملف وحفظ في وسائط الهيرو</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* MEDIA LIST WITH ACTIVE TOGGLES */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <h3 className="font-bold text-white text-lg">قائمة وسائط الهيرو الحالية والتفعيل (Active Toggles)</h3>
            <p className="text-xs text-neutral-400">قم بتشغيل أو إيقاف أي وسائط بضغطة زر؛ سيتم حفظ وتحديث الموقع تلقائياً.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1 bg-neutral-950 p-1 rounded-2xl border border-neutral-800 text-xs">
            {[
              { id: 'all', label: `الكل (${mediaItems.length})` },
              { id: 'video', label: `الفيديوهات (${mediaItems.filter(m => m.type === 'video').length})` },
              { id: 'image', label: `الصور (${mediaItems.filter(m => m.type === 'image').length})` },
              { id: 'active', label: `النشطة فقط (${mediaItems.filter(m => m.isActive).length})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterType === f.id
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-neutral-950 border border-neutral-800">
            <Film className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h4 className="font-bold text-white text-base">لا توجد وسائط في هذا التصنيف</h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              اختر ملفاً من الحاسوب بالأعلى لرفعه، أو اضغط زر استعادة الوسائط الافتراضية.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredItems.map((item, idx) => {
              const isVideo = item.type === 'video';
              return (
                <div
                  key={item.id || idx}
                  className={`group relative rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                    item.isActive
                      ? 'bg-neutral-950 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-neutral-950/50 border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Media Visual Preview */}
                  <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
                    {isVideo ? (
                      <video
                        src={item.url}
                        poster={item.posterUrl}
                        controls={false}
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onMouseEnter={(e) => { e.currentTarget.play().catch(() => {}); }}
                        onMouseLeave={(e) => { e.currentTarget.pause(); }}
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.titleAr || 'Hero Media'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                        isVideo ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900/90 text-white border border-neutral-700'
                      }`}>
                        {isVideo ? 'فيديو سينمائي' : 'صورة'}
                      </span>
                    </div>

                    {/* Preview Button */}
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/60 hover:bg-amber-500 hover:text-neutral-950 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xl backdrop-blur-sm"
                      title="معاينة كاملة"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Card Content & Toggles */}
                  <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-white text-sm truncate" title={item.titleAr}>
                          {item.titleAr || (isVideo ? 'فيديو الهيرو' : 'صورة الهيرو')}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {item.isActive ? 'مفعل في الهيرو' : 'معطل'}
                        </span>
                      </div>
                    </div>

                    {/* Controls Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 gap-2">
                      {/* Active/Inactive Toggle Button */}
                      <button
                        onClick={() => handleToggleActive(item.id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          item.isActive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${item.isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                        <span>{item.isActive ? 'إيقاف مؤقت' : 'تفعيل في الواجهة'}</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 rounded-xl bg-neutral-900 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-500/30 transition-all cursor-pointer"
                        title="حذف من الوسائط"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: FULL PREVIEW */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{previewItem.titleAr || 'معاينة الوسائط'}</span>
                <span className="text-xs text-neutral-500">({previewItem.type === 'video' ? 'فيديو' : 'صورة'})</span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-black flex items-center justify-center max-h-[70vh]">
              {previewItem.type === 'video' ? (
                <video
                  src={previewItem.url}
                  poster={previewItem.posterUrl}
                  controls
                  autoPlay
                  className="max-h-[65vh] w-auto rounded-xl"
                />
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.titleAr || 'Preview'}
                  className="max-h-[65vh] w-auto object-contain rounded-xl"
                />
              )}
            </div>

            <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-900/50">
              <span className={`text-xs font-bold ${previewItem.isActive ? 'text-emerald-400' : 'text-neutral-500'}`}>
                {previewItem.isActive ? '🟢 مفعل حالياً في الواجهة' : '⚪ غير مفعل حالياً'}
              </span>
              <button
                onClick={() => {
                  handleToggleActive(previewItem.id);
                  setPreviewItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs cursor-pointer"
              >
                {previewItem.isActive ? 'إيقاف هذا العنصر' : 'تفعيل هذا العنصر الآن'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
