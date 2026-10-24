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
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);

  return null;
};
