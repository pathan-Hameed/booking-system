// src/components/PageTransition.jsx
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function PageTransition({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}