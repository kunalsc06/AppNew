import { ThermometerSun, Droplet, Wind, Eye } from 'lucide-react';
import type { WeatherData } from '../types/weather';

interface CurrentWeatherProps {
  data: WeatherData;
  convertTemp: (tempC: number) => number;
  unit: 'C' | 'F';
}

const CurrentWeather = ({ data, convertTemp, unit }: CurrentWeatherProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <h1 className="text-7xl font-light tracking-tighter">
            {convertTemp(data.main.temp)}°{unit}
          </h1>
          <p className="text-2xl capitalize mt-3">{data.weather[0].description}</p>
          <p className="text-xl mt-2 opacity-80">
            {data.name}, {data.sys.country}
          </p>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
          alt={data.weather[0].description}
          className="w-36 h-36 drop-shadow-2xl -mt-4"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
        <div className="flex items-center gap-4">
          <ThermometerSun className="text-orange-400" size={32} />
          <div>
            <p className="text-sm opacity-70">Feels Like</p>
            <p className="text-3xl font-medium">{convertTemp(data.main.feels_like)}°{unit}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Droplet className="text-blue-400" size={32} />
          <div>
            <p className="text-sm opacity-70">Humidity</p>
            <p className="text-3xl font-medium">{data.main.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Wind className="text-cyan-400" size={32} />
          <div>
            <p className="text-sm opacity-70">Wind Speed</p>
            <p className="text-3xl font-medium">{data.wind.speed} m/s</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Eye className="text-emerald-400" size={32} />
          <div>
            <p className="text-sm opacity-70">Visibility</p>
            <p className="text-3xl font-medium">{(data.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;