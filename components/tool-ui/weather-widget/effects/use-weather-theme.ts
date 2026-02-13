import { useState, useEffect, useRef } from "react";
import type { WeatherCondition } from "../schema";
import { getSceneBrightness, getWeatherTheme, type WeatherTheme } from "./parameter-mapper";

interface UseWeatherThemeOptions {
  timestamp?: string;
  condition: WeatherCondition;
  enabled?: boolean;
}

interface UseWeatherThemeResult {
  theme: WeatherTheme;
  brightness: number;
}

/**
 * Hook to determine the appropriate UI theme based on weather conditions and time.
 *
 * Uses predictive brightness calculation from timestamp and condition,
 * with hysteresis to prevent rapid theme toggling near thresholds.
 */
export function useWeatherTheme({
  timestamp,
  condition,
  enabled = true,
}: UseWeatherThemeOptions): UseWeatherThemeResult {
  const [theme, setTheme] = useState<WeatherTheme>("light");
  const themeRef = useRef<WeatherTheme>(theme);
  themeRef.current = theme;

  const brightness = enabled ? getSceneBrightness(timestamp, condition) : 1;

  useEffect(() => {
    if (!enabled) {
      if (themeRef.current !== "light") {
        setTheme("light");
      }
      return;
    }

    const newTheme = getWeatherTheme(brightness, themeRef.current);

    if (newTheme !== themeRef.current) {
      setTheme(newTheme);
    }
  }, [brightness, enabled]);

  return { theme, brightness };
}
