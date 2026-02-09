declare module "@knight-lab/timelinejs" {
  export interface TimelineConfig {
    height?: number | string;
    width?: number | string;
    language?: string;
    start_at_end?: boolean;
    start_at_slide?: number;
    timenav_position?: "top" | "bottom";
    hash_bookmark?: boolean;
    default_bg_color?: string;
    scale_factor?: number;
    initial_zoom?: number;
    zoom_sequence?: number[];
    marker_height_min?: number;
    marker_width_min?: number;
    marker_padding?: number;
    timenav_height?: number;
    timenav_height_percentage?: number;
    timenav_mobile_height_percentage?: number;
    timenav_height_min?: number;
    slide_padding_lr?: number;
    slide_default_fade?: string;
    duration?: number;
    ease?: string;
    dragging?: boolean;
    trackResize?: boolean;
  }

  export interface TimelineDataStructure {
    title?: any;
    events: any[];
    eras?: any[];
    scale?: "human" | "cosmological";
  }

  export class Timeline {
    constructor(
      container: HTMLElement | null,
      data: TimelineDataStructure,
      options?: TimelineConfig
    );
    goTo(slideIndex: number): void;
    goToId(id: string): void;
    goToStart(): void;
    goToEnd(): void;
    goToPrev(): void;
    goToNext(): void;
    updateDisplay(): void;
    on(eventName: string, callback: (...args: any[]) => void): void;
  }
}
