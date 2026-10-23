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
  heroVideoPoster: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=90",
  heroSlides: [
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
  ]
};

export const initialStats: StatItem[] = [
  { id: '1', value: '+4', labelAr: 'سنوات خبرة', labelFr: 'Années d’expérience', labelEn: 'Years of Experience' },
  { id: '2', value: '+500', labelAr: 'مشروع ناجح', labelFr: 'Projets réussis', labelEn: 'Successful Projects' },
  { id: '3', value: '+1000', labelAr: 'عميل سعيد', labelFr: 'Clients satisfaits', labelEn: 'Happy Clients' },
  { id: '4', value: '+1000', labelAr: 'لحظة موثقة', labelFr: 'Moments immortalisés', labelEn: 'Moments Captured' },
];

export const initialServices: ServiceItem[] = [
  {
    id: 's_1790061661017',
    titleAr: 'تصوير عرس كامل (3 أيام)',
    titleFr: 'Mariage Complet (3 Jours)',
    titleEn: 'Full Wedding Coverage (3 Days)',
    descAr: 'تغطية شاملة لكل أيام العرس والتقاليد (3 أيام كاملة) بأعلى دقة وإضاءة سينمائية احترافية.',
    descFr: 'Couverture complète de tous les jours du mariage (3 jours) avec une qualité visuelle cinématographique.',
    descEn: 'Comprehensive coverage of all wedding days (3 full days) with cinema-grade visuals.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA0cYKpswd_sb-ckj7jGBl2zZv36giqAMVT-yaGr_Tdzr44koKEZYhGxK4&s=10',
    price: '35,000 دج',
    duration: '3 أيام كاملة',
    features: ['تغطية متكاملة 3 أيام', 'فريق تصوير محترف', 'ألبوم رقمي كامل', 'تسليم سريع بجودة أصلية'],
    visible: true,
    order: 1
  },
  {
    id: 's_1790061707775',
    titleAr: 'تصوير عرس (يومان)',
    titleFr: 'Mariage (2 Jours)',
    titleEn: 'Wedding Coverage (2 Days)',
    descAr: 'تغطية يومين من مراسيم العرس والزفة والاحتفال بجودة فائقة.',
    descFr: 'Couverture sur 2 jours des cérémonies de mariage et cortège.',
    descEn: 'Two-day coverage of wedding ceremonies and celebration.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfZGvOkj5jWRx08XNL-565dQmYF3IXtJMpaCcAEcyzanvcdJDNnRnZOT9P&s=10',
    price: '28,000 دج',
    duration: 'يومان كاملان',
    features: ['تغطية الحناء والقاعة', 'مصورين فوتوغرافيين', 'معالجة فنية للألوان', 'فلاش ديسك للصور'],
    visible: true,
    order: 2
  },
  {
    id: 's_1790061747750',
    titleAr: 'تصوير عرس 2 (يوم كامل)',
    titleFr: 'Mariage Journée Complète',
    titleEn: 'Single Full-Day Wedding',
    descAr: 'يوم كامل + 2 مصورين فوتوغرافيين لتغطية شاملة لكل لحظات الحفل.',
    descFr: 'Journée complète avec 2 photographes pour capturer chaque instant.',
    descEn: 'Full single day coverage with 2 professional photographers.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgtAG_UBtSzYtmzLl0bNV0KWZMz53TE762ePKmfZRpic1qKKKpBIEK8JpS&s=10',
    price: '22,000 دج',
    duration: 'يوم كامل (حتى نهاية الحفل)',
    features: ['2 فوتوغراف احترافيين', 'تغطية موكب السيارات', 'جلسة تصوير العروسين', 'كل الصور المعدلة عالية الدقة'],
    visible: true,
    order: 3
  },
  {
    id: 's_1790061878029',
    titleAr: 'جلسة تصوير Collection',
    titleFr: 'Shooting Collection',
    titleEn: 'Collection Photoshoot',
    descAr: 'جلسة تصوير كاملة لمدة 4 ساعات أو حسب الطلب في أماكن خارجية مميزة أو الاستوديو.',
    descFr: 'Séance photo complète de 4 heures ou sur mesure en extérieur ou studio.',
    descEn: 'Full 4-hour or custom outdoor/studio photoshoot session.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThh-AI-d49_-ae-XruG-YO0ripK2P18Eo7_wVqO1jsgw&s=10',
    price: '9,000 دج',
    duration: '4 ساعات أو حسب الطلب',
    features: ['جلسة فوتوسيشن خارجية', 'توجيه محترف للوضعيات', 'ريتاتش تجميلي راقٍ', 'تسليم جميع الصور'],
    visible: true,
    order: 4
  },
  {
    id: 's_1790061801309',
    titleAr: 'جلسة تصوير سريعة',
    titleFr: 'Shooting Photo Express',
    titleEn: 'Express Photoshoot',
    descAr: 'جلسة تصوير كاملة لمدة ساعتين للعروسين أو البورتريه الشخصي.',
    descFr: 'Séance photo complète de 2 heures pour mariés ou portraits personnels.',
    descEn: 'Full 2-hour photo session for couples or personal portraits.',
    image: 'https://i.postimg.cc/C14hDbxk/IMG-2693.avif',
    price: '7,500 دج',
    duration: 'ساعتان',
    features: ['جلسة تصوير ساعتين', 'أفضل اللقطات الرومانسية', 'تعديل احترافي', 'تسليم فوري عبر الرابط'],
    visible: true,
    order: 5
  },
  {
    id: 's_1790061623708',
    titleAr: 'مونتاج + جينيريك احترافي',
    titleFr: 'Montage & Générique',
    titleEn: 'Editing & Cinematic Title',
    descAr: 'مونتاج احترافي للأعراس والمناسبات مع جينيريك وتصحيح ألوان وإيقاع موسيقي مميز.',
    descFr: 'Montage professionnel pour mariages et événements avec générique et étalonnage.',
    descEn: 'Professional video editing for weddings and events with titles and color grading.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7FY03tdU8g4X_g5gn1Uss274PWbQIJ9IDSbA1cbeFGCu-Cp-uymPK3aQG&s=10',
    price: '6,500 دج',
    duration: 'حسب مدة الفيديو والمشروع',
    features: ['مونتاج سينمائي احترافي', 'تصحيح ألوان مخصص', 'جينيريك مخصص بأسماء العرسان', 'موسيقى منسجمة'],
    visible: true,
    order: 6
  }
];

export const initialPackages: PackageItem[] = [
  {
    id: 'p_1789659253896',
    nameAr: 'باك الزوالي',
    nameFr: 'Pack Zawali',
    nameEn: 'Zawali Essential Pack',
    price: 25000,
    durationAr: 'تغطية الحفل كاملة',
    durationFr: 'Couverture de la fête',
    durationEn: 'Full Ceremony Coverage',
    descriptionAr: '2 فوتوغراف \nمونتاج \nجينيرك',
    featuresAr: ['2 فوتوغراف محترفين', 'مونتاج فيديو متكامل', 'جينيريك بأسماء العرسان', 'تسليم جميع الصور الأصلية'],
    featuresFr: ['2 photographes professionnels', 'Montage vidéo complet', 'Générique personnalisé', 'Toutes les photos'],
    featuresEn: ['2 professional photographers', 'Full video editing', 'Custom title credits', 'All raw photos'],
    isPopular: false,
    visible: true,
    order: 1
  },
  {
    id: 'p_1789661009517',
    nameAr: 'الباك العادي',
    nameFr: 'Pack Normal',
    nameEn: 'Standard Wedding Pack',
    price: 30000,
    durationAr: 'تغطية شاملة للحفل والاستقبال',
    durationFr: 'Couverture complète',
    durationEn: 'Complete Coverage',
    descriptionAr: '2 فوتوغراف \nمونتاج + جينيريك \n1 ممنوع التصوير',
    featuresAr: ['2 فوتوغراف', 'مونتاج فيديو احترافي + جينيريك', '1 مصور خاص (ممنوع التصوير / خصوصية)', 'فلاش ديسك USB مهدى للعرسان'],
    featuresFr: ['2 photographes', 'Montage + Générique', '1 photographe spécial femmes', 'Clé USB offerte'],
    featuresEn: ['2 photographers', 'Editing + Title intro', '1 private/ladies photographer', 'Complimentary USB drive'],
    isPopular: true,
    visible: true,
    order: 2
  },
  {
    id: 'p_1790062134758',
    nameAr: 'الباقة البرونزية (Pack Spécial)',
    nameFr: 'Pack Spécial Bronze',
    nameEn: 'Special Bronze Package',
    price: 46000,
    durationAr: 'تغطية يومين أو تغطية موسعة',
    durationFr: 'Couverture 2 jours ou étendue',
    durationEn: '2-Day or Extended Coverage',
    descriptionAr: '2 فوتوغراف\n2 ممنوع التصوير \nالبوم صور مطبوع \nفلاش ديسك',
    featuresAr: ['2 فوتوغراف محترفين', '2 مصورين خاصين (ممنوع التصوير / خصوصية تامة)', 'ألبوم صور فاخر مطبوع بالجلد الطبيعي', 'فلاش ديسك USB ذكي بصندوق فاخر', 'فيديو ريلز وتيك توك ملخص'],
    featuresFr: ['2 photographes', '2 photographes réservés (femmes)', 'Album photo cuir imprimé', 'Clé USB de luxe', 'Reels résumé'],
    featuresEn: ['2 photographers', '2 private photographers', 'Printed leather album', 'Smart USB in custom case', 'Highlight video reels'],
    isPopular: false,
    visible: true,
    order: 3
  },
  {
    id: 'p_1790062012782',
    nameAr: 'الباك الخاص (Pack VIP)',
    nameFr: 'Pack VIP Prestige',
    nameEn: 'VIP Prestige Package',
    price: 58000,
    durationAr: 'تغطية شاملة ملكية (3 أيام أو يومين)',
    durationFr: 'Couverture Royale complète',
    durationEn: 'Full Royal Wedding Coverage',
    descriptionAr: '3 فوتوغراف \n2 ممنوع التصوير \nفلاش ديسك \nألبوم ملكي كبير',
    featuresAr: ['طاقم متكامل (3 فوتوغراف ومصوري فيديو)', '2 مصورين خاصين (ممنوع التصوير / خصوصية تامة)', 'ألبوم ملكي فاخر كبير الحجم للعائلتين', 'فلاش ديسك USB فاخر بنقش ليزر', 'مونتاج سينمائي 4K كامل + درون'],
    featuresFr: ['3 photographes & cadreurs', '2 photographes réservés (femmes)', 'Grand album royal de luxe', 'Clé USB gravée', 'Film 4K complet + Drone'],
    featuresEn: ['Full crew (3 photographers & video)', '2 private photographers', 'Large royal album', 'Engraved luxury USB', 'Full 4K film + Drone'],
    isPopular: false,
    visible: true,
    order: 4
  }
];

export const initialPortfolio: PortfolioItem[] = [
  {
    id: 'port_1789660519015',
    titleAr: 'موكب زفاف العرسان (الكورتاج)',
    titleFr: 'Cortège de Mariage',
    titleEn: 'Wedding Car Convoy & Cortège',
    category: 'weddings',
    coupleNames: 'زفة العرسان',
    date: 'أغسطس 2026',
    location: 'الجزائر • تبسة',
    image: 'https://pdftourl.net/images/1789660507751-1fb28924-4614-4cc3-88fe-ca8a3abd6c8c.jpg',
    images: [
      'https://pdftourl.net/images/1789660507751-1fb28924-4614-4cc3-88fe-ca8a3abd6c8c.jpg',
      '/img2.jpg'
    ],
    descriptionAr: 'توثيق سينمائي فاخر لموكب سيارات الزفاف ووصول العرسان.',
    descriptionFr: 'Documentation cinématographique du cortège de mariage.',
    descriptionEn: 'Cinematic coverage of the wedding convoy and arrival.',
    visible: true,
    order: 1
  },
  {
    id: 'port_1789660605251',
    titleAr: 'أحلى عريسين في ليلة العمر',
    titleFr: 'Les Plus Beaux Mariés',
    titleEn: 'The Gorgeous Couple',
    category: 'weddings',
    coupleNames: 'العرسان',
    date: 'أغسطس 2026',
    location: 'الماء الأبيض، ولاية تبسة',
    image: 'https://pdftourl.net/images/1789660594889-ddee7105-3c48-4808-816e-91ca636526fd.jpg',
    images: [
      'https://pdftourl.net/images/1789660594889-ddee7105-3c48-4808-816e-91ca636526fd.jpg',
      '/img1.jpg'
    ],
    descriptionAr: 'لقطات رومانسية راقية للعروسين مع إضاءة ساحرة وتفاصيل دقيقة.',
    descriptionFr: 'Moments romantiques du couple avec un éclairage raffiné.',
    descriptionEn: 'Refined romantic shots of the couple with gorgeous lighting.',
    visible: true,
    order: 2
  },
  {
    id: 'port_1789660481589',
    titleAr: 'أحلى لحظة • فرحة لا تُنسى',
    titleFr: 'Le Plus Beau Moment',
    titleEn: 'Unforgettable Happy Moment',
    category: 'weddings',
    coupleNames: 'ليلة العمر',
    date: 'أغسطس 2026',
    location: 'تبسة، الجزائر',
    image: 'https://pdftourl.net/images/1789660462163-d0d2941a-f261-42a7-b9e7-45217fbc3855.jpg',
    images: [
      'https://pdftourl.net/images/1789660462163-d0d2941a-f261-42a7-b9e7-45217fbc3855.jpg',
      '/img3.jpg'
    ],
    descriptionAr: 'توثيق الابتسامات وفرحة الأهل والأحباب في أبهى حلة.',
    descriptionFr: 'Joie des familles immortalisée dans toute sa splendeur.',
    descriptionEn: 'Immortalizing pure joy and smiles with family and loved ones.',
    visible: true,
    order: 3
  },
  {
    id: 'port_1789660390933',
    titleAr: 'جلسة تصوير خاصة (Shooting)',
    titleFr: 'Séance Photo Shooting',
    titleEn: 'Exclusive Photoshoot Session',
    category: 'portraits',
    coupleNames: 'فوتوسيشن خاص',
    date: 'سبتمبر 2026',
    location: 'إبرا برودكشن',
    image: 'https://pdftourl.net/images/1789660360461-39119d87-3e1e-448b-9f91-cffa5a703da0.png',
    images: [
      'https://pdftourl.net/images/1789660360461-39119d87-3e1e-448b-9f91-cffa5a703da0.png'
    ],
    descriptionAr: 'جلسة تصوير فوتوغرافية احترافية مع وضعيات سينمائية وتعديل فني.',
    descriptionFr: 'Séance photo professionnelle avec poses cinématographiques.',
    descriptionEn: 'Professional photoshoot session with artistic color grading.',
    visible: true,
    order: 4
  },
  {
    id: 'port_1790058296871',
    titleAr: 'توثيق حفل تخرج وتكريم (Soutenance)',
    titleFr: 'Cérémonie de Diplôme (Soutenance)',
    titleEn: 'Graduation & Honor Ceremony',
    category: 'events',
    coupleNames: 'حفل تخرج',
    date: 'سبتمبر 2026',
    location: 'الجامعة • تبسة',
    image: 'https://yellow-bar-9020ibra-id-card-upload.bahibarhouma15.workers.dev/?key=portfolio%2F1790058255627_4a095cf0-4ab2-4137-9d0c-da1160030720_IMG_9011.JPG',
    images: [
      'https://yellow-bar-9020ibra-id-card-upload.bahibarhouma15.workers.dev/?key=portfolio%2F1790058255627_4a095cf0-4ab2-4137-9d0c-da1160030720_IMG_9011.JPG'
    ],
    descriptionAr: 'تغطية رسمية متكاملة لمراسيم مناقشة التخرج وحفلات التكريم.',
    descriptionFr: 'Couverture complète de cérémonies de diplômes et hommages.',
    descriptionEn: 'Complete official coverage of graduation defenses and celebrations.',
    visible: true,
    order: 5
  },
  {
    id: 'port_orig_1',
    titleAr: 'موكب زفاف سينمائي بالألعاب النارية',
    titleFr: 'Cortège de Mariage aux Fumigènes',
    titleEn: 'Wedding Procession with Smoke Flares',
    category: 'weddings',
    coupleNames: 'مراسيم الزفاف والبارود',
    date: 'أغسطس 2026',
    location: 'الماء الأبيض، ولاية تبسة، الجزائر',
    image: '/img1.jpg',
    images: ['/img1.jpg'],
    descriptionAr: 'توثيق احترافي لحظات زفاف مميزة مع الألعاب النارية والدخان الملون والأفراح التقليدية.',
    descriptionFr: 'Documentation professionnelle de moments de mariage uniques avec fumigènes.',
    descriptionEn: 'Professional documentation of special wedding moments with flares.',
    visible: true,
    order: 6
  },
  {
    id: 'port_orig_2',
    titleAr: 'موكب السيارات الفاخرة (الكورتاج)',
    titleFr: 'Cortège de Voitures de Luxe',
    titleEn: 'Luxury Car Convoy',
    category: 'weddings',
    coupleNames: 'زفة العرسان الملكية',
    date: 'أغسطس 2026',
    location: 'الجزائر',
    image: '/img2.jpg',
    images: ['/img2.jpg'],
    descriptionAr: 'تصوير احترافي لموكب سيارات الزفاف وواجهة السيارات المزينة وزفة الشارع.',
    descriptionFr: 'Photographie professionnelle du cortège de mariage.',
    descriptionEn: 'Professional photography of the wedding car convoy.',
    visible: true,
    order: 7
  },
  {
    id: 'port_orig_3',
    titleAr: 'بورتريه العريس الفاخر (VIP)',
    titleFr: 'Portrait Luxueux du Marié',
    titleEn: 'Luxury Groom Portrait',
    category: 'portraits',
    coupleNames: 'العريس الملكي',
    date: 'أغسطس 2026',
    location: 'إبرا برودكشن',
    image: '/img3.jpg',
    images: ['/img3.jpg'],
    descriptionAr: 'لقطة سينمائية مقربة للعريس بإضاءة وتصوير فني راقٍ تعكس الهيبة والأناقة.',
    descriptionFr: 'Portrait cinématographique rapproché du marié.',
    descriptionEn: 'Cinematic close-up portrait of the groom.',
    visible: true,
    order: 8
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
