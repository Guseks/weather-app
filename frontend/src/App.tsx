import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

/*
  TODO: Make request to backend, Display data to find suitable approach.
  Start with a fixed request implemented in backend. 
  TODO:  Make request to backend using useEffect, display data.
  Required Data:
  - Date and day info
  - Temperature
  - weather type
  - weather icon
  - weather description

  TODO: Create suitable user interface to display weather information. 
  - Use tailwind for CSS. Initialize when starting to build user interface.
  TODO: Create form for user to input desired city to show weather for. Include update button?
*/

interface WeatherData {
  id: number;
  date: string;
  maxTemp: string;
  minTemp: string;
  weather: object;
  icon: string;
  windSpeed: string;
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [city, setCity] = useState("");

  useEffect(() => {
    async function getWeather() {
      //const city = "London";
      const response = await axios.get("http://localhost:3000/weather");
      console.log(response.data.data);
      setWeatherData(
        response.data.data.map((item: WeatherData) => ({
          ...item,
          minTemp: parseInt(item.minTemp),
          maxTemp: parseInt(item.maxTemp),
          windSpeed: parseInt(item.windSpeed),
        }))
      );
    }
    getWeather();
  }, []);
  return (
    <div className="flex flex-col items-center">
      <p className="font-bold text-5xl">Weather App</p>
      <div className="w-5/12 border flex flex-col gap-2 bg-white bg-opacity-40 border-red-600 rounded-lg p-5 ">
        <span className="font-bold text-black flex border-black px-5 text-lg py-3">
          {`Current city: ${city}`}
        </span>
        <div className="border-2 border-solid border-gray-800 rounded-lg">
          {weatherData.map((item) => (
            <div
              key={item.id}
              className="flex items-center text-black font-bold"
            >
              <span className="w-32">{item.date}</span>
              <span className="w-32">
                {item.minTemp} / {item.maxTemp}°C
              </span>
              <img
                className="w-16 px-10"
                src={`${item.icon}`}
                alt={item.icon}
              />
              <span className="w-24">{item.windSpeed} m/s</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
