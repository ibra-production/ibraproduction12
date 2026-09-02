import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShieldCheck, Camera, Users, Clock, HeartHandshake, Award } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const { language } = useApp();

  const reasons = language === 'fr' ? [
    {
      icon: <Award className="w-8 h-8 text-amber-400" />,
      title: "Qualité Professionnelle",
      desc: "Standards cinématographiques élevés pour chaque projet."
    },
    {
      icon: <Camera className="w-8 h-8 text-amber-400" />,
      title: "Équipement de Pointe",
      desc: "Caméras 4K, drones et éclairage studio de dernière génération."
    },
    {
      icon: <Users className="w-8 h-8 text-amber-400" />,
      title: "Équipe Spécialisée",
      desc: "Photographes et réalisateurs experts en mariages et grands événements."
    },
    {
      icon: <Clock className="w-8 h-8 text-amber-400" />,
      title: "Livraison Organisée",
      desc: "Respect strict des délais et traitement soigné des fichiers."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      title: "Attention aux Détails",
      desc: "Chaque instant magique est capturé avec art et émotion."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-amber-400" />,
      title: "Expérience Client Unique",
      desc: "Accompagnement personnalisé et service VIP du début à la fin."
    }
  ] : language === 'en' ? [
    {
      icon: <Award className="w-8 h-8 text-amber-400" />,
      title: "Professional Quality",
      desc: "High cinematic standards for every project."
    },
    {
      icon: <Camera className="w-8 h-8 text-amber-400" />,
      title: "Cutting-edge Equipment",
      desc: "Latest generation 4K cameras, drones, and studio lighting."
    },
    {
      icon: <Users className="w-8 h-8 text-amber-400" />,
      title: "Specialized Team",
      desc: "Expert photographers and directors specializing in luxury weddings."
    },
    {
      icon: <Clock className="w-8 h-8 text-amber-400" />,
      title: "Organized Delivery",
      desc: "Strict adherence to deadlines and meticulous file processing."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      title: "Attention to Detail",
      desc: "Every magical moment is captured with artistry and emotion."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-amber-400" />,
      title: "Unique Client Experience",
      desc: "Personalized support and VIP service from start to finish."
    }
  ] : [
    {
      icon: <Award className="w-8 h-8 text-amber-400" />,
      title: "جودة احترافية",
      desc: "معايير سينمائية عالية ومذهلة في كل مشروع وثائقي أو فني."
    },
    {
      icon: <Camera className="w-8 h-8 text-amber-400" />,
      title: "معدات متطورة",
      desc: "أحدث كاميرات 4K، طائرات درون، وأنظمة إضاءة سينمائية متقدمة."
    },
    {
      icon: <Users className="w-8 h-8 text-amber-400" />,
      title: "فريق متخصص",
      desc: "نخبة من المصورين والمخرجين المحترفين في تصوير الأعراس والفعاليات."
    },
    {
      icon: <Clock className="w-8 h-8 text-amber-400" />,
      title: "تسليم منظم",
      desc: "التزام صارم بالمواعيد المحددة وتسليم الألبومات والمونتاج في الوقت."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      title: "اهتمام بالتفاصيل",
      desc: "نوثق كل نظرة وابتسامة عفوية لتظل ذكرياتكم حية للأبد."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-amber-400" />,
      title: "تجربة عميل مميزة",
      desc: "مرافقة ودعم دائم واهتمام خاص بكل تفاصيل يومكم المميز."
    }
  ];

  return (
    <section className="py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
              {language === 'ar' ? 'لماذا تختارنا' : language === 'fr' ? 'Pourquoi Nous Choisir' : 'Why Choose Us'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white mb-6">
            {language === 'ar' ? 'التميز الذي نرتقي إليه في كل عمل' : language === 'fr' ? 'L’Excellence dans Chaque Détail' : 'Excellence in Every Detail'}
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            {language === 'ar'
              ? 'نضع بين أيديكم خبرة سنين لضمان توثيق استثنائي لا يُبلى مع الزمن.'
              : language === 'fr'
              ? 'Nous mettons notre expérience à votre service pour un reportage d’exception.'
              : 'We put years of experience at your service for exceptional documentation.'}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-8 rounded-3xl border border-neutral-800 hover:border-amber-500/40 transition-all duration-500 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold font-cinzel text-white mb-3 group-hover:text-amber-400 transition-colors">
                {item.title}
              </h3>

              <p className="text-neutral-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
