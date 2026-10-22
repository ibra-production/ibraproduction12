import { SiteSettings, StatItem, ServiceItem, PackageItem, PortfolioItem, VideoItem, TestimonialItem, OfferItem, AdminUser, IbraEvent, TeamMemberItem } from '../types';

export const initialSiteSettings: SiteSettings = {
  agencyName: "IBRA PRODUCTION",
  taglineAr: "نحوّل أجمل لحظاتكم إلى ذكريات لا تُنسى.",
  taglineFr: "Nous transformons vos plus beaux moments en souvenirs inoubliables.",
  taglineEn: "We turn your most beautiful moments into unforgettable memories.",
  phone: "0696967093",
  whatsapp: "+213696967093",
  email: "ibraphotography727@gmail.com",
  addressAr: "الماء الأبيض، ولاية تبسة، الجزائر",
  addressFr: "El Ma Labiod, Wilaya de Tébessa, Algérie",
  addressEn: "El Ma Labiod, Tébessa Province, Algeria",
  facebookUrl: "https://www.facebook.com/share/1HpLYTDQYR/?mibextid=wwXIfr",
  instagramUrl: "https://www.instagram.com/ibrahim_journalist?igsi=N2M4d2NvYmY1Z2Fp&utm_source=qr",
  youtubeUrl: "https://youtube.com/@ibraproduction",
  tiktokUrl: "https://tiktok.com/@ibraproduction",
  googleMapsUrl: "https://maps.google.com/?q=El+Ma+Labiod+Tebessa+Algeria",
  primaryColor: "#d4af37", // Gold
  secondaryColor: "#171717",
  currency: "DZD",
  seoTitle: "IBRA PRODUCTION | Wedding Photography & Media Production",
  seoDescription: "IBRA PRODUCTION - Professional Wedding Photography, Videography & Media Production Agency in Algeria. نحوّل أجمل لحظاتكم إلى ذكريات لا تُنسى.",
  seoKeywords: "Ibra Production, Wedding Photography Algeria, Wedding Photographer Algeria, Wedding Videography Algeria, Photographe mariage Algérie, تصوير أعراس, تصوير حفلات, إبرا برودكشن",
  maintenanceMode: false,
  heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-walking-in-a-forest-41121-large.mp4",
  enableHeroVideo: true,
  heroVideoPoster: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=90"
};

export const initialStats: StatItem[] = [
  { id: '1', value: '+4', labelAr: 'سنوات خبرة', labelFr: 'Années d’expérience', labelEn: 'Years of Experience' },
  { id: '2', value: '+500', labelAr: 'مشروع ناجح', labelFr: 'Projets réussis', labelEn: 'Successful Projects' },
  { id: '3', value: '+1000', labelAr: 'عميل سعيد', labelFr: 'Clients satisfaits', labelEn: 'Happy Clients' },
  { id: '4', value: '+1000', labelAr: 'لحظة موثقة', labelFr: 'Moments immortalisés', labelEn: 'Moments Captured' },
];

export const initialServices: ServiceItem[] = [
  {
    id: 's1',
    titleAr: 'تصوير الأعراس الفاخر',
    titleFr: 'Photographie de Mariage de Luxe',
    titleEn: 'Luxury Wedding Photography',
    descAr: 'توثيق cinematic لكل تفاصيل ليلة العمر بأعلى جودة بصرية وإضاءة احترافية.',
    descFr: 'Documentation cinématographique de chaque détail de votre grand jour avec une qualité visuelle supérieure.',
    descEn: 'Cinematic documentation of every detail of your special day with superior visual quality.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    price: 'تبدأ من 45,000 دج',
    duration: 'يوم كامل (حتى 12 ساعة)',
    features: ['مصورين محترفين اثنان', 'تعديل احترافي للصور', 'ألبومات فاخرة', 'فيديو قصير مقطعي'],
    visible: true,
    order: 1
  },
  {
    id: 's2',
    titleAr: 'تصوير الفيديو السينمائي',
    titleFr: 'Vidéographie Cinématographique',
    titleEn: 'Cinematic Videography',
    descAr: 'أفلام أعراس سينمائية بأسلوب هوليوودي مع مؤثرات بصرية وصوتية مذهلة.',
    descFr: 'Films de mariage cinématographiques de style hollywoodien avec des effets visuels et sonores époustouflants.',
    descEn: 'Hollywood-style cinematic wedding films with stunning visual and sound effects.',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    price: 'تبدأ من 60,000 دج',
    duration: 'تغطية كاملة مع مونتاج 4K',
    features: ['كاميرات 4K متطورة', 'طائرة درون (Drone)', 'تصحيح ألوان سينمائي', 'تسجيل صوت نقي'],
    visible: true,
    order: 2
  },
  {
    id: 's3',
    titleAr: 'مونتاج وإنتاج الفيديو',
    titleFr: 'Montage & Production Vidéo',
    titleEn: 'Video Editing & Production',
    descAr: 'خدمات مونتاج متقدمة، تصحيح ألوان، ومؤثرات بصرية تبرز جمال اللحظات.',
    descFr: 'Services de montage avancés, étalonnage des couleurs et effets visuels.',
    descEn: 'Advanced editing services, color grading, and visual effects.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    price: 'تبدأ من 30,000 دج',
    duration: 'حسب المشروع',
    features: ['مونسينج جرافيك', 'تعديل الألوان الاحترافي', 'موسيقى تصويرية مرخصة', 'تسليم سريع'],
    visible: true,
    order: 3
  },
  {
    id: 's4',
    titleAr: 'صناعة المحتوى الرقمي',
    titleFr: 'Création de Contenu Digital',
    titleEn: 'Digital Content Creation',
    descAr: 'تصميم فيديوهات ريلز و TikTok بجودة عالية تليق بعلامتك التجارية أو مناسباتك.',
    descFr: 'Conception de vidéos Reels et TikTok de haute qualité pour votre marque ou vos événements.',
    descEn: 'High-quality Reels and TikTok videos tailored for your brand or events.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
    price: 'تبدأ من 25,000 دج',
    duration: 'باقات شهرية أو حسب الطلب',
    features: ['فيديوهات عمودية 9:16', 'كتابة نصوص تفاعلية', 'إيقاع بصري جذاب', 'تحسين لوسائل التواصل'],
    visible: true,
    order: 4
  },
  {
    id: 's5',
    titleAr: 'تصوير البورتريه والأزياء',
    titleFr: 'Photographie de Portrait & Mode',
    titleEn: 'Portrait & Fashion Photography',
    descAr: 'جلسات تصوير شخصية وفوتوسيشن احترافي بإضاءة استوديو متقدمة.',
    descFr: 'Séances photo personnelles et professionnelles avec éclairage de studio avancé.',
    descEn: 'Personal and professional photo sessions with advanced studio lighting.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    price: 'تبدأ من 20,000 دج',
    duration: 'ساعتان إلى 3 ساعات',
    features: ['استوديو متنقل أو ثابت', 'توجيه احترافي للوضعيات', 'ريتاتش فاخر للصور', 'تسليم رقمي سريع'],
    visible: true,
    order: 5
  },
  {
    id: 's6',
    titleAr: 'تصوير المنتجات والفعاليات',
    titleFr: 'Photographie de Produits & Événements',
    titleEn: 'Product & Event Photography',
    descAr: 'تغطية شاملة للمؤتمرات، الحفلات، وتصوير تجاري احترافي للمنتجات.',
    descFr: 'Couverture complète des conférences, fêtes et photographie commerciale.',
    descEn: 'Comprehensive coverage of conferences, parties, and commercial product photography.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    price: 'حسب حجم الفعالية',
    duration: 'تغطية مرنة',
    features: ['فريق عمل متعدد الكاميرات', 'تغطية فورية للنشر', 'تقارير مصورة', 'جودة تجارية عالية'],
    visible: true,
    order: 6
  }
];

export const initialPackages: PackageItem[] = [
  {
    id: 'p1',
    nameAr: 'الباقة الأساسية',
    nameFr: 'Pack Essentiel',
    nameEn: 'Essential Package',
    price: 55000,
    durationAr: 'تغطية لمدة 6 ساعات',
    durationFr: 'Couverture de 6 heures',
    durationEn: '6 Hours Coverage',
    featuresAr: ['مصور رئيسي واحد', 'ألبوم صور كلاسيكي', '50 صورة معدلة باحترافية', 'فيديو ملخص لمدة 3 دقائق'],
    featuresFr: ['Un photographe principal', 'Album photo classique', '50 photos retouchées', 'Vidéo résumé de 3 minutes'],
    featuresEn: ['One lead photographer', 'Classic photo album', '50 professionally edited photos', '3-minute highlight video'],
    isPopular: false,
    visible: true,
    order: 1
  },
  {
    id: 'p2',
    nameAr: 'الباقة الذهبية',
    nameFr: 'Pack Or',
    nameEn: 'Gold Package',
    price: 95000,
    oldPrice: 110000,
    discount: '15% خصم',
    durationAr: 'تغطية لمدة 10 ساعات',
    durationFr: 'Couverture de 10 heures',
    durationEn: '10 Hours Coverage',
    featuresAr: ['مصورين احترافيين اثنان', 'تصوير فيديو 4K مع درون', 'ألبوم فاخر كبير الحجم', 'فيديو سينمائي 7 دقائق', 'جميع الصور الأصلية'],
    featuresFr: ['Deux photographes professionnels', 'Vidéo 4K avec Drone', 'Grand album de luxe', 'Film cinématographique de 7 min', 'Toutes les photos brutes'],
    featuresEn: ['Two professional photographers', '4K video with Drone', 'Large luxury album', '7-minute cinematic film', 'All raw photos'],
    isPopular: true,
    visible: true,
    order: 2
  },
  {
    id: 'p3',
    nameAr: 'الباقة البلاتينية',
    nameFr: 'Pack Platine',
    nameEn: 'Platinum Package',
    price: 140000,
    durationAr: 'تغطية يوم كامل (بلا حدود)',
    durationFr: 'Couverture journée complète',
    durationEn: 'Full Day Unlimited Coverage',
    featuresAr: ['فريق متكامل (3 مصورين وفنان فيديو)', 'كاميرات سينمائية متطورة ودرون', 'ألبومين فاخرين للعائلتين', 'فيلم وثائقي + ريلز جاهزة للنشر', 'جلسة تصوير تحضيرية (Pre-Wedding)'],
    featuresFr: ['Équipe complète (3 photographes & vidéaste)', 'Caméras cinéma & Drone', 'Deux albums de luxe', 'Film documentaire + Reels', 'Séance Pre-Wedding incluse'],
    featuresEn: ['Complete team (3 photographers & videographer)', 'Cinema cameras & Drone', 'Two luxury albums', 'Documentary film + Reels', 'Pre-wedding session included'],
    isPopular: false,
    visible: true,
    order: 3
  },
  {
    id: 'p4',
    nameAr: 'باقة VIP الملكية',
    nameFr: 'Pack VIP Royal',
    nameEn: 'VIP Royal Package',
    price: 220000,
    durationAr: 'تغطية شاملة لمدة يومين',
    durationFr: 'Couverture complète 2 jours',
    durationEn: '2-Day Comprehensive Coverage',
    featuresAr: ['طاقم تصوير كامل VIP (5 أشخاص)', 'بث مباشر عالي الدقة (Live Streaming)', 'أفلام سينمائية متعددة النسخ', 'ألبومات جلد طبيعي فاخرة مرصعة', 'جلسات تصوير خارجية إضافية مجانية'],
    featuresFr: ['Équipe VIP complète (5 personnes)', 'Diffusion en direct HD', 'Films cinématographiques multiples', 'Albums en cuir véritable', 'Séances photo extérieures offertes'],
    featuresEn: ['Full VIP crew (5 members)', 'HD Live Streaming', 'Multiple cinematic films', 'Genuine leather albums', 'Complimentary outdoor shoots'],
    isPopular: false,
    visible: true,
    order: 4
  }
];

export const initialPortfolio: PortfolioItem[] = [
  {
    id: 'port1',
    titleAr: 'موكب زفاف سينمائي بالألعاب النارية',
    titleFr: 'Cortège de Mariage aux Fumigènes',
    titleEn: 'Wedding Procession with Smoke Flares',
    category: 'weddings',
    coupleNames: 'مراسيم الزفاف',
    date: 'أغسطس 2026',
    location: 'الماء الأبيض، ولاية تبسة، الجزائر',
    image: '/img1.jpg',
    descriptionAr: 'توثيق احترافي لحظات زفاف مميزة مع الألعاب النارية والدخان الملون.',
    descriptionFr: 'Documentation professionnelle de moments de mariage uniques.',
    descriptionEn: 'Professional documentation of special wedding moments with flares.',
    visible: true,
    order: 1
  },
  {
    id: 'port2',
    titleAr: 'موكب السيارات الفاخرة',
    titleFr: 'Cortège de Voitures de Luxe',
    titleEn: 'Luxury Car Convoy',
    category: 'weddings',
    coupleNames: 'زفة العرسان',
    date: 'أغسطس 2026',
    location: 'الجزائر',
    image: '/img2.jpg',
    descriptionAr: 'تصوير احترافي لموكب سيارات الزفاف وواجهة السيارات المزينة.',
    descriptionFr: 'Photographie professionnelle du cortège de mariage.',
    descriptionEn: 'Professional photography of the wedding car convoy.',
    visible: true,
    order: 2
  },
  {
    id: 'port3',
    titleAr: 'بورتريه العريس الفاخر',
    titleFr: 'Portrait Luxueux du Marié',
    titleEn: 'Luxury Groom Portrait',
    category: 'portraits',
    coupleNames: 'العريس',
    date: 'أغسطس 2026',
    location: 'إبرا برودكشن',
    image: '/img3.jpg',
    descriptionAr: 'لقطة سينمائية مقربة للعريس بإضاءة وتصوير فني راقٍ.',
    descriptionFr: 'Portrait cinématographique rapproché du marié.',
    descriptionEn: 'Cinematic close-up portrait of the groom.',
    visible: true,
    order: 3
  }
];

export const initialVideos: VideoItem[] = [
  {
    id: 'v1',
    titleAr: 'فيلم زفاف الأسطوري - إبراهيم وفاطمة',
    titleFr: 'Film de Mariage Légendaire - Ibrahim & Fatima',
    titleEn: 'Legendary Wedding Film - Ibrahim & Fatima',
    category: 'Wedding Films',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '07:45',
    visible: true,
    order: 1
  },
  {
    id: 'v2',
    titleAr: 'ملخص ريلز أعراس صيف 2026',
    titleFr: 'Résumé Reels Mariages Été 2026',
    titleEn: 'Summer 2026 Wedding Reels Highlights',
    category: 'Reels',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '01:30',
    visible: true,
    order: 2
  },
  {
    id: 'v3',
    titleAr: 'إنتاج إعلامي لفعالية كبرى',
    titleFr: 'Production Média pour Grand Événement',
    titleEn: 'Media Production for Major Event',
    category: 'Production',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '04:20',
    visible: true,
    order: 3
  }
];

export const initialTestimonials: TestimonialItem[] = [
  {
    id: 't1',
    clientName: 'حاتم مكاحلية',
    rating: 5,
    commentAr: 'خدمة ربي يبارك موفق يارب',
    commentFr: 'Service béni, bonne chance !',
    commentEn: 'Blessed service, good luck!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    date: '2026-06-15',
    approved: true
  },
  {
    id: 't2',
    clientName: 'عرس المريج',
    rating: 5,
    commentAr: 'خدمتك تووب برهوم بون كوراج',
    commentFr: 'Service top, Barhoum bon courage !',
    commentEn: 'Top service, Barhoum bon courage!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    date: '2026-05-20',
    approved: true
  },
  {
    id: 't3',
    clientName: 'Nour Mk',
    rating: 5,
    commentAr: 'bon courage mon frr',
    commentFr: 'bon courage mon frr',
    commentEn: 'bon courage mon frr',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    date: '2026-04-10',
    approved: true
  }
];

export const initialOffers: OfferItem[] = [
  {
    id: 'off1',
    titleAr: 'عرض الصيف الملكي للأعراس',
    titleFr: 'Offre Royale d’Été pour Mariages',
    titleEn: 'Royal Summer Wedding Offer',
    descAr: 'احجز الباقة الذهبية واحصل على جلسة Pre-Wedding مجانية مع طائرة درون هدية.',
    descFr: 'Réservez le Pack Or et bénéficiez d’une séance Pre-Wedding gratuite avec Drone offert.',
    descEn: 'Book the Gold Package and get a free Pre-Wedding session with a complimentary drone shoot.',
    oldPrice: '110,000 دج',
    newPrice: '95,000 دج',
    discountPercentage: '15% خصم',
    startDate: '2026-06-01',
    endDate: '2026-09-30',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    active: true
  }
];

export const initialUsers: AdminUser[] = [
  {
    id: 'u1',
    email: 'admin@ibraprod.online',
    name: 'Ibrahim (Owner)',
    role: 'Owner',
    active: true
  }
];

export const initialTeamMembers: TeamMemberItem[] = [
  {
    id: 'tm1',
    name: 'إبراهيم بن سالم',
    phone: '0696967093',
    role: 'Photographer',
    gender: 'male',
    active: true,
    assignedEventIds: ['IBRA-2026-1048']
  },
  {
    id: 'tm2',
    name: 'كريم رحماني (مشغل در درون)',
    phone: '0551234567',
    role: 'Videographer',
    gender: 'male',
    active: true,
    assignedEventIds: ['IBRA-2026-1048']
  },
  {
    id: 'tm3',
    name: 'دي جي سمير (DJ Samir)',
    phone: '0772345678',
    role: 'DJ',
    gender: 'male',
    active: true,
    assignedEventIds: ['IBRA-2026-1048']
  },
  {
    id: 'tm4',
    name: 'يوسف بلقاسم (مونتير)',
    phone: '0663456789',
    role: 'Editor',
    gender: 'male',
    active: true,
    assignedEventIds: ['IBRA-2026-1048']
  }
];

export const initialEvents: IbraEvent[] = [
  {
    eventId: 'IBRA-2026-1048',
    barcode: '87261048001',
    clientId: 'c_1048',
    groomName: 'محمد',
    brideName: 'سارة',
    phone: '0770123456',
    email: 'mohamed.sara@example.com',
    wilaya: 'تبسة',
    location: 'قاعة ريم للأفراح - تبسة',
    eventDate: '2026-12-15',
    eventTime: '17:00',
    status: 'CONFIRMED',
    packageId: 'p2',
    packageName: 'الباقة الذهبية (Gold Package)',
    totalPrice: 120000,
    totalPaid: 60000,
    notes: 'طلب خاص: تصوير جوي بالدرون أثناء موكب السيارات + تجهيز ريلز سريع ليلة العرس.',
    smartUsbId: 'USB-IBRA-2026-1048',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-20',
    services: [
      { serviceId: 's1', serviceTitle: 'تصوير الأعراس الفاخر (Wedding Photography)', status: 'CONFIRMED' },
      { serviceId: 's2', serviceTitle: 'تصوير الفيديو السينمائي 4K (Cinematic Video)', status: 'CONFIRMED' },
      { serviceId: 's_drone', serviceTitle: 'تغطية جوية احترافية (Drone 4K)', status: 'CONFIRMED' },
      { serviceId: 's_dj', serviceTitle: 'هندسة صوت و دي جي احترافي (DJ Samir)', status: 'CONFIRMED' },
      { serviceId: 's_decor', serviceTitle: 'إضاءة وديكور سينمائي (Cinematic Lighting)', status: 'CONFIRMED' }
    ],
    timeline: [
      {
        id: 'tl_1',
        eventId: 'IBRA-2026-1048',
        time: '08:00',
        title: 'وصول فريق التصوير وتجهيز المعدات',
        description: 'وصول الطاقم لكاميرات 4K والمعدات المحمولة وفحص الإضاءة.',
        order: 1,
        status: 'done'
      },
      {
        id: 'tl_2',
        eventId: 'IBRA-2026-1048',
        time: '09:00',
        title: 'تجهيز وتوثيق العروس',
        description: 'توثيق التفاصيل (الفستان، الخاتم، المكياج وباقة الورد).',
        order: 2,
        status: 'done'
      },
      {
        id: 'tl_3',
        eventId: 'IBRA-2026-1048',
        time: '12:30',
        title: 'جلسة تصوير العروسين (Outdoor Session)',
        description: 'جلسة خارجية سينمائية في الحديقة الملكية وإطلالات ساحرة.',
        order: 3,
        status: 'done'
      },
      {
        id: 'tl_4',
        eventId: 'IBRA-2026-1048',
        time: '15:00',
        title: 'وصول العريس وموكب السيارات الفاخرة',
        description: 'تصوير موكب السيارات واستخدام طائرة الدرون.',
        order: 4,
        status: 'current'
      },
      {
        id: 'tl_5',
        eventId: 'IBRA-2026-1048',
        time: '17:00',
        title: 'استقبال الضيوف في القاعة',
        description: 'بدء استقبال المدعوين في قاعة ريم وتوثيق الحضور.',
        order: 5,
        status: 'upcoming'
      },
      {
        id: 'tl_6',
        eventId: 'IBRA-2026-1048',
        time: '19:00',
        title: 'بداية الحفل والزفة السينمائية',
        description: 'دخول العرسان مع إضاءة خاصة وأصوات مؤثرة ودي جي.',
        order: 6,
        status: 'upcoming'
      },
      {
        id: 'tl_7',
        eventId: 'IBRA-2026-1048',
        time: '21:30',
        title: 'تقطيع الكعكة والصور العائلية التذكارية',
        description: 'التقاط الصور الرسمية مع العائلة والأصدقاء.',
        order: 7,
        status: 'upcoming'
      }
    ],
    gallery: [
      {
        id: 'gal_1',
        eventId: 'IBRA-2026-1048',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        caption: 'نظرة أولى سينمائية للعروسين',
        uploadedAt: '2026-10-15 13:45',
        isFavorite: true,
        downloadsCount: 12
      },
      {
        id: 'gal_2',
        eventId: 'IBRA-2026-1048',
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        caption: 'تفاصيل الخاتم وفستان الزفاف الملكي',
        uploadedAt: '2026-10-15 14:10',
        isFavorite: true,
        downloadsCount: 8
      },
      {
        id: 'gal_3',
        eventId: 'IBRA-2026-1048',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        caption: 'لحظة وصول موكب العريس الفخم',
        uploadedAt: '2026-10-15 15:30',
        isFavorite: false,
        downloadsCount: 5
      },
      {
        id: 'gal_4',
        eventId: 'IBRA-2026-1048',
        url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
        caption: 'لقطة مقربة رومانسية مع إضاءة الغروب الذهبية',
        uploadedAt: '2026-10-15 16:40',
        isFavorite: true,
        downloadsCount: 15
      }
    ],
    guestUploads: [
      {
        id: 'gu_1',
        eventId: 'IBRA-2026-1048',
        guestName: 'أحمد شقيق العريس',
        fileUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
        fileType: 'image',
        fileSize: '3.4 MB',
        notes: 'ألف مبروك لأخي الحبيب محمد وسارة، بارك الله لكما!',
        createdAt: '2026-10-15 17:35'
      },
      {
        id: 'gu_2',
        eventId: 'IBRA-2026-1048',
        guestName: 'منال قريبة العروس',
        fileUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
        fileType: 'image',
        fileSize: '2.8 MB',
        notes: 'أجمل عروس في الكون ماشاء الله تبارك الرحمن',
        createdAt: '2026-10-15 18:15'
      }
    ],
    payments: [
      {
        id: 'pay_1',
        eventId: 'IBRA-2026-1048',
        amount: 60000,
        date: '2026-10-02',
        method: 'CASH',
        note: 'عربون تأكيد الحجز المبدئي واستلام الإيصال الرسمي',
        receiptNumber: 'REC-1048-01',
        createdAt: '2026-10-02'
      }
    ],
    documents: [
      {
        id: 'doc_1',
        eventId: 'IBRA-2026-1048',
        title: 'عقد اتفاق وتوثيق حفل زفاف رسمي',
        type: 'contract',
        date: '2026-10-02',
        status: 'signed'
      },
      {
        id: 'doc_2',
        eventId: 'IBRA-2026-1048',
        title: 'فاتورة أولية (Proforma Invoice #INV-1048)',
        type: 'invoice',
        date: '2026-10-02',
        status: 'official'
      },
      {
        id: 'doc_3',
        eventId: 'IBRA-2026-1048',
        title: 'إيصال استلام دفعة عربون 60,000 دج',
        type: 'receipt',
        date: '2026-10-02',
        status: 'signed'
      }
    ],
    assignedTeam: ['tm1', 'tm2', 'tm3', 'tm4']
  },
  {
    eventId: 'IBRA-2026-1049',
    barcode: '87261049002',
    bookingId: 'b1',
    clientId: 'c_1049',
    groomName: 'أمين بلحاج',
    brideName: 'سارة بن عمارة',
    phone: '0661234567',
    email: 'amine.belhadj@example.com',
    wilaya: 'الجزائر العاصمة',
    location: 'فندق الأوراسي (El Aurassi) - الجزائر',
    eventDate: '2026-08-28',
    eventTime: '16:00',
    status: 'CONFIRMED',
    packageId: 'p3',
    packageName: 'الباقة الملكية (Royal VIP Package)',
    totalPrice: 150000,
    totalPaid: 90000,
    notes: 'تغطية VIP شاملة مع طائرتي درون، كرين، وألبوم صور إيطالي فاخر.',
    smartUsbId: 'USB-IBRA-2026-1049',
    createdAt: '2026-09-10',
    updatedAt: '2026-10-18',
    services: [
      { serviceId: 's1', serviceTitle: 'تصوير الأعراس الفاخر VIP', status: 'CONFIRMED' },
      { serviceId: 's2', serviceTitle: 'تصوير فيديو سينمائي 4K متعدد الكاميرات', status: 'CONFIRMED' },
      { serviceId: 's_drone', serviceTitle: 'تغطية جوية Drone 4K', status: 'CONFIRMED' }
    ],
    timeline: [
      {
        id: 'tl_49_1',
        eventId: 'IBRA-2026-1049',
        time: '14:00',
        title: 'تجهيز معدات التصوير في قاعة الحفل',
        description: 'فحص الإضاءة السينمائية والكرين والكاميرات المحمولة.',
        order: 1,
        status: 'done'
      },
      {
        id: 'tl_49_2',
        eventId: 'IBRA-2026-1049',
        time: '16:00',
        title: 'استقبال العروسين وموكب السيارات الفاخرة',
        description: 'تصوير الموكب ودخول العرسان مع الألعاب النارية.',
        order: 2,
        status: 'current'
      }
    ],
    gallery: [
      {
        id: 'med_49_1',
        eventId: 'IBRA-2026-1049',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        caption: 'لقطة سينمائية من فندق الأوراسي',
        uploadedAt: '2026-10-19 14:20',
        isFavorite: true,
        downloadsCount: 15
      }
    ],
    payments: [
      {
        id: 'pay_49_1',
        eventId: 'IBRA-2026-1049',
        amount: 50000,
        date: '2026-09-10',
        method: 'CASH',
        note: 'عربون تأكيد الحجز المبدئي',
        receiptNumber: 'REC-1049-01',
        createdAt: '2026-09-10'
      },
      {
        id: 'pay_49_2',
        eventId: 'IBRA-2026-1049',
        amount: 40000,
        date: '2026-10-05',
        method: 'BANK',
        note: 'الدفعة الثانية لحساب الوكالة عبر بريدي موب',
        receiptNumber: 'REC-1049-02',
        createdAt: '2026-10-05'
      }
    ],
    documents: [
      {
        id: 'doc_49_1',
        eventId: 'IBRA-2026-1049',
        title: 'عقد التوثيق الفاخر الرسمي #AGR-1049',
        type: 'contract',
        date: '2026-09-10',
        status: 'signed'
      }
    ],
    assignedTeam: ['tm1', 'tm2']
  }
];
