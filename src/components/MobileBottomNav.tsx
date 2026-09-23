import React from 'react';
import { Calendar, Home, Images, MessageCircle, UserRound } from 'lucide-react';

export const MobileBottomNav: React.FC<{onOpenBooking:()=>void}> = ({onOpenBooking}) => {
  const go = (id:string) => document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  return (
    <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-[70] px-2 pb-[calc(6px+env(safe-area-inset-bottom))] pt-2 bg-neutral-950/92 backdrop-blur-2xl border-t border-neutral-800/80">
      <div className="grid grid-cols-5 gap-1 max-w-lg mx-auto">
        <button onClick={()=>go('home')} className="min-h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] text-neutral-300"><Home className="w-5 h-5"/>الرئيسية</button>
        <button onClick={()=>go('services')} className="min-h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] text-neutral-300"><Images className="w-5 h-5"/>الخدمات</button>
        <button onClick={onOpenBooking} className="min-h-[56px] -mt-4 rounded-2xl bg-amber-500 text-neutral-950 flex flex-col items-center justify-center gap-1 font-bold shadow-xl shadow-amber-500/20"><Calendar className="w-6 h-6"/>احجز</button>
        <button onClick={()=>go('client-experience')} className="min-h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] text-neutral-300"><UserRound className="w-5 h-5"/>العميل</button>
        <button onClick={()=>window.open('https://wa.me/213696967093','_blank','noopener,noreferrer')} className="min-h-[52px] rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] text-neutral-300"><MessageCircle className="w-5 h-5"/>واتساب</button>
      </div>
    </nav>
  );
};
