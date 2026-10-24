import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowDown, ArrowUpRight, CalendarCheck, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Video, Sparkles, Star, Film } from 'lucide-react';

interface HeroProps { onOpenBooking: () => void; }

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { language, settings, stats } = useApp();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [useVideo, setUseVideo] = useState<boolean>(() => {
    return settings.enableHeroVideo !== false && Boolean(settings.heroVideoUrl && settings.heroVideoUrl.trim() !== '');
  });
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const ar = language === 'ar';
  const fr = language === 'fr';

  const defaultSlides = [
    {
      id: 'hs1',
      image: 'https://i.postimg.cc/fbZqcV5R/Re-Lens-IMG-20260625133005.jpg',
      label: ar ? 'تصوير احترافي' : fr ? 'Photographie professionnelle' : 'Professional photography',
    },
    {
      id: 'hs2',
      image: 'https://i.postimg.cc/rybhhnQV/IMG-2114.avif',
      label: ar ? 'تغطية المناسبات' : fr ? 'Couverture événementielle' : 'Event coverage',
    },
    {
      id: 'hs3',
      image: 'https://i.postimg.cc/jSTBX3Sx/IMG-8875.avif',
      label: ar ? 'أجمل التفاصيل' : fr ? 'Les plus beaux détails' : 'Beautiful details',
    },
    {
      id: 'hs4',
      image: 'https://i.postimg.cc/2SCXvq0V/IMG-8838.avif',
      label: ar ? 'إنتاج بصري' : fr ? 'Production visuelle' : 'Visual production',
    },
    {
      id: 'hs5',
      image: 'https://i.postimg.cc/RFtT29P5/IMG-8836.avif',
      label: 'Ibra Production',
    },
  ];

  const activeHeroVideo = React.useMemo(() => {
    if (Array.isArray(settings.heroMediaItems) && settings.heroMediaItems.length > 0) {
      return settings.heroMediaItems.find(m => m.type === 'video' && m.isActive !== false);
    }
    return null;
  }, [settings.heroMediaItems]);

  const activeVideoUrl = activeHeroVideo ? activeHeroVideo.url : (settings.heroVideoUrl || '');
  const activeVideoPoster = activeHeroVideo?.posterUrl || settings.heroVideoPoster;

  // Keep useVideo in sync whenever settings are updated in Firestore or Admin
  useEffect(() => {
    const mode = settings.activeHeroMediaType || 'auto';
    if (mode === 'video') {
      setUseVideo(Boolean(activeVideoUrl && activeVideoUrl.trim() !== ''));
    } else if (mode === 'slideshow' || mode === 'single_image') {
      setUseVideo(false);
    } else {
      const hasActiveVideo = Boolean(activeVideoUrl && activeVideoUrl.trim() !== '');
      setUseVideo(settings.enableHeroVideo !== false && hasActiveVideo);
    }
  }, [settings.activeHeroMediaType, settings.enableHeroVideo, activeVideoUrl]);

  // Derive slides from active heroMediaItems with fallback to heroSlides and defaultSlides
  const slides = React.useMemo(() => {
    if (Array.isArray(settings.heroMediaItems) && settings.heroMediaItems.length > 0) {
      const activeImages = settings.heroMediaItems.filter(m => m.type === 'image' && m.isActive !== false);
      if (activeImages.length > 0) {
        return activeImages.map(img => ({
          id: img.id,
          image: img.url.trim(),
          label: ar ? (img.titleAr || 'Ibra Production') : fr ? (img.titleFr || 'Ibra Production') : (img.titleEn || 'Ibra Production')
        }));
      }
    }
    if (Array.isArray(settings.heroSlides) && settings.heroSlides.length > 0) {
      return settings.heroSlides
        .filter(s => s && typeof s.image === 'string' && s.image.trim() !== '')
        .map(s => ({
          id: s.id,
          image: s.image.trim(),
          label: ar ? (s.labelAr || 'Ibra Production') : fr ? (s.labelFr || 'Ibra Production') : (s.labelEn || 'Ibra Production'),
        }));
    }
    return defaultSlides;
  }, [settings.heroMediaItems, settings.heroSlides, ar, fr]);

  const activeSlideList = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    if (index >= activeSlideList.length) {
      setIndex(0);
    }
  }, [activeSlideList.length, index]);

  useEffect(() => {
    if (isPaused || useVideo) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % activeSlideList.length), 6500);
    return () => window.clearInterval(timer);
  }, [activeSlideList.length, isPaused, useVideo]);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const next = () => setIndex(i => (i + 1) % activeSlideList.length);
  const prev = () => setIndex(i => (i - 1 + activeSlideList.length) % activeSlideList.length);

  const tagline = fr ? settings.taglineFr : language === 'en' ? settings.taglineEn : settings.taglineAr;

  return (
    <section id="home" className="ibra-hero" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="ibra-hero-media">
        {useVideo && activeVideoUrl && activeVideoUrl.trim() !== '' ? (
          <video
            ref={videoRef}
            src={activeVideoUrl.trim()}
            poster={activeVideoPoster || activeSlideList[0]?.image}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="ibra-hero-slide is-active w-full h-full object-cover"
          />
        ) : (
          activeSlideList.map((slide, i) => (
            (slide.image && slide.image.trim() !== '') ? (
              <img
                key={slide.image + i}
                src={slide.image.trim()}
                alt={slide.label}
                className={`ibra-hero-slide ${i === index ? 'is-active' : ''}`}
              />
            ) : null
          ))
        )}
        <div className="ibra-hero-shade" />
        <div className="ibra-hero-grid" />
        <div className="ibra-hero-vignette" />
      </div>

      <div className="ibra-hero-content">
        <div className="ibra-hero-copy">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="ibra-eyebrow mb-0"><Sparkles className="w-4 h-4" /> {ar ? 'وكالة تصوير وإنتاج متكاملة' : fr ? 'Agence photo & production' : 'Photography & production agency'}</div>
          </div>
          <div className="ibra-hero-kicker"><span className="ibra-hero-live-dot" />{ar ? 'IBRA PRODUCTION' : 'IBRA PRODUCTION'} <span>—</span> {ar ? 'من الماء الأبيض إلى كامل الجزائر' : fr ? 'De El Ma Labiod à toute l’Algérie' : 'From El Ma Labiod across Algeria'}</div>
          <h1>{settings.agencyName}</h1>
          <p className="ibra-hero-tagline">{tagline}</p>
          <p className="ibra-hero-description">
            {ar ? 'تصوير، فيديو، صناعة محتوى وتنظيم مناسبات — بتجربة رقمية مصممة من أول استفسار حتى تسليم العمل.' : fr ? 'Photo, vidéo, contenu et événementiel — une expérience pensée du premier contact à la livraison.' : 'Photography, video, content and events — a digital experience from first contact to final delivery.'}
          </p>

          <div className="ibra-hero-actions">
            <button onClick={onOpenBooking} className="ibra-btn ibra-btn-primary ibra-btn-large">
              <CalendarCheck className="w-5 h-5" /> {ar ? 'احجز موعدك' : fr ? 'Réserver ma date' : 'Book your date'}
            </button>
            <a href="#portfolio" className="ibra-btn ibra-btn-ghost ibra-btn-large">
              <Play className="w-5 h-5" /> {ar ? 'اكتشف أعمالنا' : fr ? 'Découvrir nos travaux' : 'Explore our work'} <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="ibra-trust-row">
            <span><Star className="w-4 h-4 fill-current" /> {ar ? 'خدمة احترافية' : fr ? 'Service premium' : 'Premium service'}</span>
            <span>{ar ? '69 ولاية' : fr ? '69 wilayas' : '69 wilayas'}</span>
            <span>{ar ? 'حجز إلكتروني' : fr ? 'Réservation en ligne' : 'Online booking'}</span>
          </div>
        </div>

        <div className="ibra-hero-side-panel">
          <div className="ibra-side-label">{ar ? 'استوديو متنقل' : fr ? 'Studio mobile' : 'Mobile studio'}</div>
          <div className="ibra-side-title">{ar ? 'نجيـوك وين تكون مناسبتك.' : fr ? 'Nous venons là où votre événement se trouve.' : 'We go where your event happens.'}</div>
          <div className="ibra-side-line" />
          <div className="ibra-side-meta"><span>01</span><span>{String(index + 1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</span></div>
          <div className="ibra-slider-controls">
            {settings.heroVideoUrl && (
              <div className="flex items-center gap-1.5 mr-auto">
                <button
                  type="button"
                  onClick={() => setUseVideo(!useVideo)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${useVideo ? 'bg-amber-500 text-neutral-950 shadow-md' : 'bg-neutral-800 text-neutral-300 hover:text-white'}`}
                  title={useVideo ? 'التبديل إلى سلايد الصور' : 'التبديل إلى فيديو الخلفية'}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">{useVideo ? 'فيديو' : 'صور'}</span>
                </button>

                {useVideo && (
                  <>
                    <button
                      type="button"
                      onClick={toggleVideoPlayback}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all"
                      title={isVideoPlaying ? 'إيقاف مؤقت' : 'تشغيل الفيديو'}
                    >
                      {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all"
                      title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  </>
                )}
              </div>
            )}
            <button onClick={prev} aria-label="Previous"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={next} aria-label="Next"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <div className="ibra-slide-dots">
            {slides.map((slide, i) => (
              <button key={slide.image} onClick={() => { setUseVideo(false); setIndex(i); }} className={!useVideo && i === index ? 'is-active' : ''} aria-label={`${i + 1}`}>
                <span />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ibra-hero-bottom">
        <div className="ibra-hero-progress"><span style={{ width: `${((index + 1) / slides.length) * 100}%` }} /></div>
        <div className="ibra-stat-strip">
          {stats.slice(0, 4).map((stat, i) => (
            <div key={stat.id || i}><strong>{stat.value}</strong><span>{fr ? stat.labelFr : language === 'en' ? stat.labelEn : stat.labelAr}</span></div>
          ))}
        </div>
        <a href="#about" className="ibra-scroll-cue"><span>{ar ? 'اكتشف' : fr ? 'Découvrir' : 'Discover'}</span><ArrowDown className="w-4 h-4" /></a>
      </div>
    </section>
  );
};
