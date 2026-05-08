import { useState } from 'react';
import type { WeatherData, ForecastDay } from './types/weather';
import { fetchCurrentWeather, fetchForecast } from './utils/weatherApi';

import SearchBar from './assets/searchBar';
import CurrentWeather from './assets/CurrentWeather';
import ForecastCard from './assets/ForecastCard';
import WeatherBackground from './assets/weatherBackground';

function App() {
  const [city, setCity] = useState<string>('Bangalore');
  const [current, setCurrent] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const convertTemp = (tempC: number): number => {
    return unit === 'F' 
      ? Math.round((tempC * 9) / 5 + 32) 
      : Math.round(tempC);
  };

  const fetchWeather = async (searchCity: string) => {
    setLoading(true);
    setError('');
    setCurrent(null);
    setForecast([]);

    try {
      const [currentData, forecastData] = await Promise.all([
        fetchCurrentWeather(searchCity),
        fetchForecast(searchCity)
      ]);

      setCurrent(currentData);
      setForecast(forecastData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather. Please try another city.");
    } finally {
      setLoading(false);
    }
  };

  
  const getLocation = () => {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      setLoading(true);
      setError('');
      try {
        // TODO: Your partner can enhance this later with reverse geocoding
        console.log("Location detected:", position.coords.latitude, position.coords.longitude);
        setError("Geolocation feature coming soon ✨");
      } catch (err) {
        setError("Failed to get weather for your location");
      } finally {
        setLoading(false);
      }
    },
    (err) => {
      setError("Unable to retrieve your location. Please search manually.");
    }
  );
};

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <WeatherBackground condition={current?.weather?.[0]?.main} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-7xl font-bold tracking-tighter mb-3 bg-gradient-to-r from-white via-sky-100 to-white bg-clip-text text-transparent">
            Weatherly
          </h1>
          <p className="text-slate-400 text-xl">Real-time Weather Dashboard • BMSIT</p>
        </header>

        <div className="flex justify-center mb-10">
          <div className="bg-white/10 backdrop-blur-3xl border border-white/30 rounded-3xl p-1.5 flex shadow-2xl">
            <button onClick={() => setUnit('C')} className={`px-10 py-3 rounded-2xl font-semibold transition-all ${unit === 'C' ? 'bg-white text-slate-900 shadow-lg' : 'hover:bg-white/20'}`}>°C</button>
            <button onClick={() => setUnit('F')} className={`px-10 py-3 rounded-2xl font-semibold transition-all ${unit === 'F' ? 'bg-white text-slate-900 shadow-lg' : 'hover:bg-white/20'}`}>°F</button>
          </div>
        </div>

        <SearchBar 
          city={city} 
          setCity={setCity} 
          onSearch={fetchWeather} 
          loading={loading}
          onGeolocation={getLocation}
        />

        {error && (
          <div className="mt-8 text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 max-w-md mx-auto">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-20 flex flex-col items-center">
            <div className="w-14 h-14 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="mt-6 text-slate-400 text-lg">Fetching latest weather...</p>
          </div>
        )}

        {current && !loading && <CurrentWeather data={current} convertTemp={convertTemp} unit={unit} />}

        {forecast.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-semibold mb-8 text-center">5-Day Forecast</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {forecast.map((day, i) => (
                <ForecastCard key={i} day={day} convertTemp={convertTemp} unit={unit} />
              ))}
            </div>
          </div>
        )}

        {!current && !loading && !error && (
          <div className="text-center py-32">
            <p className="text-2xl text-slate-400">Search for a city to get started ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;