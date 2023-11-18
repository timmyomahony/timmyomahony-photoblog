import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/../tailwind.config";

import { useEffect, useState } from "react";

const useBreakpoint = (): string | undefined => {
  const [breakpoint, setBreakpoint] = useState<string | undefined>(undefined);
  const config = resolveConfig(tailwindConfig);

  useEffect(() => {
    const onResize = () => {
      const currWidth: number = window.innerWidth;
      const currBreakpoint: string = breakpoints.find(
        // @ts-ignore
        ([breakpoint, breakpointWidth]) => currWidth > parseInt(breakpointWidth)
      );

      if (currBreakpoint && (!breakpoint || currBreakpoint !== breakpoint)) {
        setBreakpoint(currBreakpoint[0]);
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (config?.theme?.screens === undefined) {
    return undefined;
  }

  // Get the breakpoints directly from the Tailwind config
  const breakpoints: any = Object.entries(config.theme.screens)
    .map(([key, value]) => [key, parseInt(value.toString())])
    .reverse();

  return breakpoint;
};

export default useBreakpoint;
