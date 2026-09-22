import { useEffect } from 'react';

export const MotionFX = () => {
  useEffect(() => {
    document.documentElement.classList.add('motion-ready');

    const sections = Array.from(document.querySelectorAll('main section'));
    sections.forEach((section) => section.classList.add('reveal-section'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    sections.forEach((section) => observer.observe(section));

    let raf = 0;
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);

  return null;
};
