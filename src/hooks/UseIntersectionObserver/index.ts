import { useEffect, useRef, useState } from "react";

const useIntersectionObserver = (
  options: IntersectionObserverInit | undefined
) => {
  const [isInView, setIsInView] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsInView(entry.isIntersecting);
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [options]);

  return [targetRef, isInView];
};

export default useIntersectionObserver;
