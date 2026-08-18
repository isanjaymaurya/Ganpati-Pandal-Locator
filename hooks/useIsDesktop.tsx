import { useState, useEffect } from "react";

function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkSize = () => setIsDesktop(window.innerWidth >= breakpoint);
    checkSize();

    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, [breakpoint]);

  if (!mounted) return false; // avoid hydration mismatch
  return isDesktop;

}

export default useIsDesktop;