"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, FastForward } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineControlProps {
  startTime: number;
  endTime: number;
  currentTime: number;
  onTimeChange: (time: number) => void;
  step?: number;
  autoPlay?: boolean;
  speed?: number; // milliseconds per step
  className?: string;
  formatTime?: (time: number) => string;
}

export const TimelineControl = ({
  startTime,
  endTime,
  currentTime,
  onTimeChange,
  step = 1,
  autoPlay = false,
  speed = 1000,
  className,
  formatTime = (time) => time.toString(),
}: TimelineControlProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useState(speed);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        onTimeChange((prevTime) => {
          const nextTime = prevTime + step;
          if (nextTime > endTime) {
            setIsPlaying(false);
            return endTime;
          }
          return nextTime;
        });
      }, playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, step, endTime, onTimeChange]);

  const handlePlayPause = useCallback(() => {
    if (currentTime >= endTime) {
      // Reset to start if at end
      onTimeChange(startTime);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, currentTime, endTime, startTime, onTimeChange]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    onTimeChange(startTime);
  }, [startTime, onTimeChange]);

  const handleSpeedToggle = useCallback(() => {
    // Cycle through speeds: 1x -> 2x -> 4x -> 0.5x -> 1x
    const speeds = [1000, 500, 250, 2000];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  }, [playbackSpeed]);

  const speedLabel = playbackSpeed === 1000 ? "1x"
    : playbackSpeed === 500 ? "2x"
    : playbackSpeed === 250 ? "4x"
    : "0.5x";

  const progress = ((currentTime - startTime) / (endTime - startTime)) * 100;

  return (
    <div className={cn("flex flex-col gap-3 p-4 bg-background/95 backdrop-blur border rounded-lg", className)}>
      {/* Timeline Slider */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono text-muted-foreground min-w-[80px]">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[currentTime]}
          min={startTime}
          max={endTime}
          step={step}
          onValueChange={([value]) => onTimeChange(value)}
          className="flex-1"
        />
        <span className="text-sm font-mono text-muted-foreground min-w-[80px] text-right">
          {formatTime(endTime)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          title="Reset to start"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="icon"
          onClick={handlePlayPause}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSpeedToggle}
          title="Change playback speed"
          className="min-w-[60px]"
        >
          <FastForward className="h-3 w-3 mr-1" />
          {speedLabel}
        </Button>
      </div>
    </div>
  );
};
