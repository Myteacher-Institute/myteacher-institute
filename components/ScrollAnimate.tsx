import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollAnimateProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const ScrollAnimate = ({ children, delay = 0, className = '' }: ScrollAnimateProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ triggerOnce: false });

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
