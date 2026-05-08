import type { ForecastDay } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  convertTemp: (tempC: number) => number;
  unit: 'C' | 'F';
}

const ForecastCard = ({ day, convertTemp, unit }: ForecastCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 text-white 
                    hover:scale-105 transition-all duration-300 text-center">
      <p className="text-lg font-medium">
        {new Date(day.dt * 1000).toLocaleDateString('en-IN', { weekday: 'short' })}
      </p>

      <div className="flex justify-center my-6">
        <img
          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`}
          alt=""
          className="w-20 h-20"
        />
      </div>

      <div>
        <p className="text-5xl font-light tracking-tight">
          {convertTemp(day.main.temp)}°{unit}
        </p>
        <p className="text-sm opacity-70 capitalize mt-2 line-clamp-2">
          {day.weather[0].description}
        </p>
      </div>
    </div>
  );
};

export default ForecastCard;