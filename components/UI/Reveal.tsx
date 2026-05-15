"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
}

export const Reveal = ({ children, width = "100%", delay = 0.25 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ 
        position: "relative", 
        width, 
        overflow: "hidden" 
      }}
    >
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.98)",
          filter: isVisible ? "blur(0px)" : "blur(10px)",
          transition: `all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
