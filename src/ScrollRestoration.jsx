import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = new Map();

export default function ScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    const savedPosition = scrollPositions.get(location.key);

    if (savedPosition !== undefined) {
      window.scrollTo(0, savedPosition);
    }
    return () => {
      scrollPositions.set(location.key, window.scrollY);
    };
  }, [location]);

  return null;
}