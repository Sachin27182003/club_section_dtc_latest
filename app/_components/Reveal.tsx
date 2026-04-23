"use client"

import { useEffect, useRef, useState } from "react";

export const Reveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  // If we are restoring from cache, we can try to default to true, 
  // but let's stick to the failsafe timer for maximum safety.
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;

    // 1. Standard Scroll Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (currentRef) observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1, rootMargin: "50px" } 
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    // 2. THE ULTIMATE FAILSAFE
    // If the Next.js Back-button cache breaks the observer, we forcefully 
    // reveal the component after 500ms. This guarantees the page will NEVER 
    // be permanently blank.
    const failsafeTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      clearTimeout(failsafeTimer);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};