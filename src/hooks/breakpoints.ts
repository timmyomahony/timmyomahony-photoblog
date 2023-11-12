import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/../tailwind.config";

import { useEffect, useState } from "react";

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<string | undefined>(undefined);
  const config = resolveConfig(tailwindConfig);

  // Get the breakpoints directly from the Tailwind config
  const breakpoints = Object.entries(config.theme.screens)
    .map(([key, value]) => [key, parseInt(value.toString())])
    .reverse();

  useEffect(() => {
    const onResize = () => {
      const currWidth: number = window.innerWidth;
      const currBreakpoint = breakpoints.find(
        ([breakpoint, breakpointWidth]) => currWidth > breakpointWidth
      );

      if (currBreakpoint && (!breakpoint || currBreakpoint !== breakpoint)) {
        setBreakpoint(currBreakpoint[0]);
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return breakpoint;
};

export default useBreakpoint;
