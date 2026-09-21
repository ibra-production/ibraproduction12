import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoItem } from '../types';
import { Sparkles, Play, X, Clock, Film } from 'lucide-react';

export const VideosSection: React.FC = () => {
  const { language, videos } = useApp();
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const activeVideos = videos.filter(v => v.visible !== false);

  return (
    <section id="videos" className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
              {language === 'ar' ? 'الأفلام السينمائية' : language === 'fr' ? 'Films Cinématographiques' : 'Cinematic Films'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-white mb-6">
            {language === 'ar' ? 'شاهدوا روعة الأداء السينمائي' : language === 'fr' ? 'Découvrez la Magie du Cinéma' : 'Experience Cinematic Excellence'}
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg">
            {language === 'ar'
              ? 'أفلام أعراس ومقاطع ريلز مصورة بأعلى معايير هوليوود.'
              : language === 'fr'
              ? 'Films de mariage et reels filmés selon les plus hauts standards.'
              : 'Wedding films and reels filmed with the highest cinematic standards.'}
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeVideos.map((video) => {
            const title = language === 'fr' ? video.titleFr : language === 'en' ? video.titleEn : video.titleAr;
            return (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 cursor-pointer shadow-xl transition-all duration-500"
              >
                <img
                  src={video.thumbnail}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/90 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-neutral-950 ml-1" />
                  </div>
                </div>

                {/* Meta details */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-neutral-900/80 backdrop-blur-md rounded-full text-amber-400 text-xs font-semibold border border-neutral-800">
                      {video.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-neutral-300 bg-neutral-900/80 px-2.5 py-1 rounded-full backdrop-blur-md">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {video.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-cinzel text-white group-hover:text-amber-400 transition-colors">
                    {title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-neutral-950/95 backdrop-blur-xl animate-fade-in">
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 right-6 p-3 text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-full z-10 hover:bg-amber-500 hover:text-neutral-950 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative aspect-video w-full bg-black">
              {/\.(mp4|webm|mov)(\?|$)/i.test(activeVideo.videoUrl) ? (
                <video src={activeVideo.videoUrl} poster={activeVideo.thumbnail} controls playsInline className="w-full h-full object-contain" />
              ) : (
                <iframe
                  src={activeVideo.videoUrl.includes('youtube.com/watch?v=') ? activeVideo.videoUrl.replace('watch?v=', 'embed/') : activeVideo.videoUrl}
                  title={activeVideo.titleAr}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold font-cinzel text-white mb-2">
                {language === 'fr' ? activeVideo.titleFr : language === 'en' ? activeVideo.titleEn : activeVideo.titleAr}
              </h3>
              <p className="text-sm text-neutral-400">
                {language === 'ar' ? 'فيديو سينمائي إنتاج خاص بـ IBRA PRODUCTION' : 'Cinematic video production by IBRA PRODUCTION'}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
