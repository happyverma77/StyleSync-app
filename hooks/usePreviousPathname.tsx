// hooks/usePreviousPathname.ts
import { usePathname } from "expo-router";
import { useEffect, useRef } from "react";

export default function usePreviousPathname(): string | null {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    previousPathRef.current = pathname;
  }, [pathname]);

  return previousPathRef.current;
}
