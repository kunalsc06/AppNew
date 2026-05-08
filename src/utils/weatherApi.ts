// src/utils/weatherApi.ts
export interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: Array<{ description: string; icon: string; main: string }>;
  wind: { speed: number };
  visibility: number;
}

export interface ForecastDay {
  dt: number;
  main: { temp: number };
  weather: Array<{ description: string; icon: string }>;
}

// Weather code to description + icon mapping
const getWeatherInfo = (code: number) => {
  const map: any = {
    0: { desc: "Clear sky", icon: "01d" },
    1: { desc: "Mainly clear", icon: "02d" },
    2: { desc: "Partly cloudy", icon: "03d" },
    3: { desc: "Overcast", icon: "04d" },
    45: { desc: "Fog", icon: "50d" },
    51: { desc: "Light drizzle", icon: "09d" },
    61: { desc: "Light rain", icon: "10d" },
    71: { desc: "Snow", icon: "13d" },
    80: { desc: "Rain showers", icon: "09d" },
  };
  return map[code] || { desc: "Clouds", icon: "03d" };
};

export const fetchCurrentWeather = async (city: string): Promise<WeatherData> => {
  // Step 1: Get coordinates
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );
  const geoData = await geoRes.json();

  if (!geoData.results?.[0]) throw new Error("City not found");

  const { latitude, longitude, name, country_code } = geoData.results[0];

  // Step 2: Get current weather
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,visibility` +
    `&timezone=auto`
  );

  const data = await weatherRes.json();
  const info = getWeatherInfo(data.current.weather_code);

  return {
    name: name || city,
    sys: { country: country_code || "IN" },
    main: {
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
    },
    weather: [{ description: info.desc, icon: info.icon, main: info.desc }],
    wind: { speed: data.current.wind_speed_10m },
    visibility: data.current.visibility || 10000,
  };
};

export const fetchForecast = async (city: string): Promise<ForecastDay[]> => {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );
  const geoData = await geoRes.json();
  const { latitude, longitude } = geoData.results[0];

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
  );

  const data = await res.json();

  return data.daily.time.map((date: string, i: number) => {
    const info = getWeatherInfo(data.daily.weather_code[i]);
    return {
      dt: new Date(date).getTime() / 1000,
      main: { 
        temp: (data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2 
      },
      weather: [{ description: info.desc, icon: info.icon }]
    };
  }).slice(0, 5);
};