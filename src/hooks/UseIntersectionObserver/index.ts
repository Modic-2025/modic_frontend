import { RefObject, useEffect, useRef, useState } from "react";

const useIntersectionObserver = <T extends Element = Element>(
  options: IntersectionObserverInit | undefined
) => {
  const [isInView, setIsInView] = useState(false);
  const targetRef = useRef<T>(null);

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
