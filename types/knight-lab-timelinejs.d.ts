declare module '@knight-lab/timelinejs' {
  export interface TimelineConfig {
    [key: string]: any;
  }

  export class Timeline {
    constructor(containerId: string, data: any, options?: any);
    goTo(slideIndex: number): void;
    goToId(id: string): void;
    goToNext(): void;
    goToPrev(): void;
    goToStart(): void;
    goToEnd(): void;
    getData(slideIndex: number): any;
    getDataById(id: string): any;
    on(eventName: string, callback: (data: any) => void): void;
    remove(eventIndex: number): void;
    removeId(id: string): void;
    add(data: any): void;
  }
}
