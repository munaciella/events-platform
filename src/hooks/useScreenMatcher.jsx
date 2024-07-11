import { useState, useEffect } from "react";

export const useScreenMatcher = (query) => {
  const [screenMatches, setScreenMatches] = useState(true);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== screenMatches) {
      setScreenMatches(media.matches);
    }
    const resizeListener = () => setScreenMatches(media.matches);
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, [screenMatches, query]);

  return { screenMatches };
};
