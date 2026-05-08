interface WeatherBackgroundProps {
  condition?: string;
}

const WeatherBackground = ({ condition }: WeatherBackgroundProps) => {
  const getBackground = (): string => {
    if (!condition) return 'from-slate-900 to-blue-950';

    const c = condition.toLowerCase();
    if (c.includes('clear') || c.includes('sun')) return 'from-blue-500 to-indigo-600';
    if (c.includes('cloud')) return 'from-slate-700 to-gray-800';
    if (c.includes('rain') || c.includes('drizzle')) return 'from-blue-800 to-slate-900';
    if (c.includes('thunder') || c.includes('storm')) return 'from-slate-900 to-purple-950';
    if (c.includes('snow')) return 'from-slate-300 to-blue-200';

    return 'from-slate-900 to-blue-950';
  };

  return (
    <div 
      className={`absolute inset-0 bg-gradient-to-br ${getBackground()} transition-all duration-1000 -z-10`} 
    />
  );
};

export default WeatherBackground;