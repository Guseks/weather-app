import { useRef, useState } from "react";
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
  date: string;
  maxTemp: string;
  minTemp: string;
  weatherDescription: string;
  icon: string;
  windSpeed: string;
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [city, setCity] = useState("");
  const [showWeather, setShowWeather] = useState(false);

  const cityInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    const inputValue = cityInputRef.current?.value;
    if (!inputValue) return;
    getNewWeather(inputValue);
    try {
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setShowWeather(false);
    }
  }

  async function getNewWeather(inputValue: string) {
    const response = await axios.get("http://localhost:3000/weather", {
      params: { city: inputValue },
    });
    console.log(response.data.weather);
    setWeatherData(
      response.data.weather.map((item: WeatherData) => ({
        ...item,
        minTemp: parseInt(item.minTemp),
        maxTemp: parseInt(item.maxTemp),
        windSpeed: parseInt(item.windSpeed),
      }))
    );
    setCity(inputValue);
    setShowWeather(true);
    if (cityInputRef.current) cityInputRef.current.value = "";
  }
  return (
    <div className="flex flex-col items-center">
      <p className="font-bold text-5xl">Weather App</p>

      <div className="w-6/12 border-2 border-solid flex flex-col gap-2 bg-white bg-opacity-40 border-stone-800 rounded-lg p-5 ">
        <span className="font-bold text-black flex border-black border-b-2 border-solid border-t-0 border-r-0 border-l-0 px-5 text-xl py-3 gap-5">
          Current city:
          <span>{`${city}`}</span>
        </span>
        {showWeather && (
          <div className=" rounded-lg px-4">
            {weatherData.map((item) => (
              <div
                key={item.date}
                className="flex items-center text-black font-bold"
              >
                <span className="w-40">{item.date}</span>
                <span className="w-32">
                  {item.minTemp} / {item.maxTemp}°C
                </span>
                <img
                  className="w-16 px-5 "
                  src={`${item.icon}`}
                  alt={item.icon}
                />
                <span className="w-36 ">{item.weatherDescription}</span>
                <span className="w-28">{item.windSpeed} m/s</span>
              </div>
            ))}
          </div>
        )}
        <form
          className="flex gap-x-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            className="p-2 border-black bg-black bg-opacity-10 text-white border-solid rounded-lg font-bold placeholder-gray-100"
            type="text"
            ref={cityInputRef}
            placeholder="Enter city name"
          />
          <button
            className="p-3 rounded-lg bg-black bg-opacity-10 text-gray-100 font-bold border-solid hover:bg-opacity-20 hover:cursor-pointer"
            type="submit"
          >
            Change city
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
