import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageTransition({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
  }, []);
  return <div ref={ref}>{children}</div>;
}