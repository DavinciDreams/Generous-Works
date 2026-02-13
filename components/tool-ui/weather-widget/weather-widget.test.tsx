import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherWidget } from './weather-widget';
import type { WeatherWidgetProps } from './schema';

// Mock the adapter and effects
vi.mock('./_adapter', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

vi.mock('./effects', () => ({
  EffectCompositor: ({ condition }: any) => (
    <div data-testid="effect-compositor" data-condition={condition}>
      Effects
    </div>
  ),
  getSceneBrightnessFromTimeOfDay: () => 0.8,
  getTimeOfDay: () => 14,
  getWeatherTheme: () => 'light',
}));

vi.mock('./weather-data-overlay', () => ({
  WeatherDataOverlay: ({ location, condition, temperature }: any) => (
    <div data-testid="weather-overlay">
      <div data-testid="location">{location}</div>
      <div data-testid="condition">{condition}</div>
      <div data-testid="temperature">{temperature}</div>
    </div>
  ),
}));

const mockWeatherData: WeatherWidgetProps = {
  id: 'weather-1',
  location: 'San Francisco, CA',
  current: {
    temp: 72,
    tempMin: 65,
    tempMax: 78,
    condition: 'clear',
    windSpeed: 10,
    windDirection: 270,
    humidity: 60,
    precipitation: 'none',
    visibility: 10,
  },
  forecast: [
    {
      day: 'Mon',
      tempMin: 65,
      tempMax: 75,
      condition: 'partly-cloudy',
    },
    {
      day: 'Tue',
      tempMin: 63,
      tempMax: 73,
      condition: 'cloudy',
    },
    {
      day: 'Wed',
      tempMin: 60,
      tempMax: 70,
      condition: 'rain',
    },
  ],
  unit: 'fahrenheit',
  updatedAt: new Date().toISOString(),
};

describe('WeatherWidget', () => {
  beforeEach(() => {
    // Mock matchMedia for reduced motion detection
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('Rendering', () => {
    it('renders weather widget', () => {
      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('renders location', () => {
      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('location')).toHaveTextContent('San Francisco, CA');
    });

    it('renders current condition', () => {
      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('condition')).toHaveTextContent('clear');
    });

    it('renders current temperature', () => {
      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('temperature')).toHaveTextContent('72');
    });

    it('sets data-slot attribute', () => {
      const { container } = render(<WeatherWidget {...mockWeatherData} />);
      const article = container.querySelector('[data-slot="weather-widget"]');
      expect(article).toBeInTheDocument();
    });

    it('sets data-tool-ui-id attribute', () => {
      const { container } = render(<WeatherWidget {...mockWeatherData} />);
      const article = container.querySelector('[data-tool-ui-id="weather-1"]');
      expect(article).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <WeatherWidget {...mockWeatherData} className="custom-weather" />
      );
      expect(container.firstChild).toHaveClass('custom-weather');
    });
  });

  describe('Weather Conditions', () => {
    it('renders clear weather', () => {
      render(<WeatherWidget {...mockWeatherData} current={{ ...mockWeatherData.current, condition: 'clear' }} />);
      expect(screen.getByTestId('condition')).toHaveTextContent('clear');
    });

    it('renders cloudy weather', () => {
      render(<WeatherWidget {...mockWeatherData} current={{ ...mockWeatherData.current, condition: 'cloudy' }} />);
      expect(screen.getByTestId('condition')).toHaveTextContent('cloudy');
    });

    it('renders rainy weather', () => {
      render(<WeatherWidget {...mockWeatherData} current={{ ...mockWeatherData.current, condition: 'rain' }} />);
      expect(screen.getByTestId('condition')).toHaveTextContent('rain');
    });

    it('renders snowy weather', () => {
      render(<WeatherWidget {...mockWeatherData} current={{ ...mockWeatherData.current, condition: 'snow' }} />);
      expect(screen.getByTestId('condition')).toHaveTextContent('snow');
    });

    it('renders thunderstorm weather', () => {
      render(<WeatherWidget {...mockWeatherData} current={{ ...mockWeatherData.current, condition: 'thunderstorm' }} />);
      expect(screen.getByTestId('condition')).toHaveTextContent('thunderstorm');
    });

    it('renders foggy weather', () => {
      render(<WeatherWidget {...mockWeatherData} current={{ ...mockWeatherData.current, condition: 'fog' }} />);
      expect(screen.getByTestId('condition')).toHaveTextContent('fog');
    });
  });

  describe('Temperature Units', () => {
    it('defaults to celsius when unit not specified', () => {
      const dataWithoutUnit = { ...mockWeatherData };
      delete dataWithoutUnit.unit;
      render(<WeatherWidget {...dataWithoutUnit} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('handles fahrenheit unit', () => {
      render(<WeatherWidget {...mockWeatherData} unit="fahrenheit" />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('handles celsius unit', () => {
      render(<WeatherWidget {...mockWeatherData} unit="celsius" />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });
  });

  describe('Effects', () => {
    it('renders effects compositor when effects enabled', () => {
      render(<WeatherWidget {...mockWeatherData} effects={{ enabled: true }} />);
      expect(screen.getByTestId('effect-compositor')).toBeInTheDocument();
    });

    it('does not render effects when disabled', () => {
      render(<WeatherWidget {...mockWeatherData} effects={{ enabled: false }} />);
      expect(screen.queryByTestId('effect-compositor')).not.toBeInTheDocument();
    });

    it('respects reduced motion preference', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(<WeatherWidget {...mockWeatherData} />);
      // Should not render effects when reduced motion is preferred
      expect(screen.queryByTestId('effect-compositor')).not.toBeInTheDocument();
    });

    it('respects manual reduced motion setting', () => {
      render(<WeatherWidget {...mockWeatherData} effects={{ reducedMotion: true }} />);
      expect(screen.queryByTestId('effect-compositor')).not.toBeInTheDocument();
    });

    it('passes condition to effect compositor', () => {
      render(<WeatherWidget {...mockWeatherData} effects={{ enabled: true }} />);
      const compositor = screen.getByTestId('effect-compositor');
      expect(compositor).toHaveAttribute('data-condition', 'clear');
    });

    it('applies custom effect props', () => {
      const customEffectProps = {
        glass: { blur: 10, brightness: 0.5 },
      };
      render(
        <WeatherWidget
          {...mockWeatherData}
          effects={{ enabled: true }}
          customEffectProps={customEffectProps}
        />
      );
      expect(screen.getByTestId('effect-compositor')).toBeInTheDocument();
    });
  });

  describe('Background Themes', () => {
    it('applies light theme for daytime clear weather', () => {
      const { container } = render(<WeatherWidget {...mockWeatherData} />);
      const card = container.querySelector('.bg-gradient-to-b');
      expect(card).toHaveClass('from-sky-50', 'via-sky-100/70', 'to-white');
    });

    it('handles dark weather conditions', () => {
      // Mock getWeatherTheme to return dark
      vi.doMock('./effects', () => ({
        EffectCompositor: ({ condition }: any) => (
          <div data-testid="effect-compositor">{condition}</div>
        ),
        getSceneBrightnessFromTimeOfDay: () => 0.2,
        getTimeOfDay: () => 2,
        getWeatherTheme: () => 'dark',
      }));

      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });
  });

  describe('Locale Support', () => {
    it('uses navigator language when locale not specified', () => {
      Object.defineProperty(window.navigator, 'language', {
        writable: true,
        value: 'en-US',
      });
      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('uses provided locale prop', () => {
      render(<WeatherWidget {...mockWeatherData} locale="fr-FR" />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });
  });

  describe('Updated Time', () => {
    it('formats relative time for recent update', () => {
      const recentTime = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
      render(<WeatherWidget {...mockWeatherData} updatedAt={recentTime} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('handles missing updatedAt', () => {
      const dataWithoutTime = { ...mockWeatherData };
      delete dataWithoutTime.updatedAt;
      render(<WeatherWidget {...dataWithoutTime} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });
  });

  describe('Forecast Data', () => {
    it('passes forecast data to overlay', () => {
      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('handles single day forecast', () => {
      const singleDayForecast = {
        ...mockWeatherData,
        forecast: [mockWeatherData.forecast[0]],
      };
      render(<WeatherWidget {...singleDayForecast} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('handles seven day forecast', () => {
      const sevenDayForecast = {
        ...mockWeatherData,
        forecast: [
          ...mockWeatherData.forecast,
          { day: 'Thu', tempMin: 62, tempMax: 72, condition: 'clear' as const },
          { day: 'Fri', tempMin: 64, tempMax: 74, condition: 'partly-cloudy' as const },
          { day: 'Sat', tempMin: 66, tempMax: 76, condition: 'cloudy' as const },
          { day: 'Sun', tempMin: 65, tempMax: 75, condition: 'rain' as const },
        ],
      };
      render(<WeatherWidget {...sevenDayForecast} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });
  });

  describe('Extended Weather Data', () => {
    it('handles wind speed and direction', () => {
      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('handles humidity', () => {
      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('handles visibility', () => {
      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('handles precipitation level', () => {
      render(<WeatherWidget {...mockWeatherData} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });

    it('works without optional extended data', () => {
      const minimalData = {
        ...mockWeatherData,
        current: {
          temp: 72,
          tempMin: 65,
          tempMax: 78,
          condition: 'clear' as const,
        },
      };
      render(<WeatherWidget {...minimalData} />);
      expect(screen.getByTestId('weather-overlay')).toBeInTheDocument();
    });
  });

  describe('Container Structure', () => {
    it('renders as article element', () => {
      const { container } = render(<WeatherWidget {...mockWeatherData} />);
      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('applies container query classes', () => {
      const { container } = render(<WeatherWidget {...mockWeatherData} />);
      const article = container.querySelector('[data-slot="weather-widget"]');
      expect(article).toHaveClass('@container/weather');
    });

    it('applies aspect ratio', () => {
      const { container } = render(<WeatherWidget {...mockWeatherData} />);
      const card = container.querySelector('.aspect-\\[4\\/3\\]');
      expect(card).toBeInTheDocument();
    });
  });
});
