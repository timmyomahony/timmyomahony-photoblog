import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/../tailwind.config";

import { useEffect, useState } from "react";

const useBreakpoint = (): string | undefined => {
  const [breakpoint, setBreakpoint] = useState<string | undefined | null>(undefined);
  const config = resolveConfig(tailwindConfig);

  useEffect(() => {
    const onResize = () => {
      const currWidth: number = window.innerWidth;

      if (config?.theme?.screens === undefined) {
        console.warn("Couldn't load tailwind breakpoints");
        return undefined;
      }

      // Get the breakpoints directly from the Tailwind config
      let currBreakpoint: any = Object.entries(config.theme.screens)
        .reverse()
        .find(
          // @ts-ignore
          ([a, width]) => currWidth > parseInt(width)
        );

      // < sm
      if (currBreakpoint === undefined && null !== breakpoint) {
        setBreakpoint(null);
      }

      if (
        currBreakpoint &&
        (!currBreakpoint || currBreakpoint !== breakpoint)
      ) {
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
