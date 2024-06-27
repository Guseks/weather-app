import express from 'express';
import axios from 'axios';
import dotenv from "dotenv"
dotenv.config();

const router = express.Router();

/* 
TODO: Create route for getting weather data from OpenWeatherMap API

STEPS:
TODO: Extract data from frontend request
TODO: Convert city name to geo coordinates using Geocoder API (Look up how)
TODO: Make request to API, analyze returned data to find suitable format to return.
TODO: Handle returned data in frontend to display weather data

TODO: Put utility functions for handling data in separate file

https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

*/
const API_KEY = process.env.API_KEY;
const ICON_URL = process.env.BASE_ICON_URL;

function getMaxTemp(temperatures) {
  let currentMax = temperatures[0];
  for (let i = 1; i < temperatures.length; i++) {
    if (temperatures[i] > currentMax) {
      currentMax = temperatures[i];
    }
  }
  return currentMax;
}
function getMinTemp(temperatures) {
  let currentMin = temperatures[0];
  for (let i = 1; i < temperatures.length; i++) {
    if (temperatures[i] < currentMin) {
      currentMin = temperatures[i];
    }
  }
  return currentMin;
}

function createWeatherData(weatherInfo) {
  const currentDay = new Date();

  return weatherInfo.map((element) => 
    
    ({
      date: element.dt_txt.split(" ")[0],
      time: element.dt_txt.split(" ")[1],
      temp: element.main.temp,
      feelsLike: element.main.feels_like,
      windSpeed: element.wind.speed,
      weather: element.weather[0],
      icon: `${ICON_URL}${element.weather[0].icon}@2x.png`
    }))
  
}

function getWeatherDataDays(weatherData){
  const weatherDataDays = [[]];
  let tempArray = [];
  let currentDate = "";
  for (let i = 0; i < weatherData.length; i++){
    if(currentDate === "" || currentDate === weatherData[i].date){
      currentDate = weatherData[i].date;
      tempArray.push(weatherData[i]);
    }
    else if(tempArray.length !== 0){
      weatherDataDays.push(tempArray);
      tempArray = [weatherData[i]];
      currentDate = weatherData[i].date;
    }
    
  }
  weatherDataDays.shift();
  return weatherDataDays;

  
}

function createDataObject(weatherDataDays){
  const currentDay = new Date();
  
  const temperaturesDays = weatherDataDays.map((measurement) => measurement.map((element) => element.temp))
  const maxTempDays = temperaturesDays.map((day) => Math.max(...day));
  const minTempDays = temperaturesDays.map((day) => Math.min(...day));
  
  let weatherToday = false;
  let dailyWeatherData = [];
  
  weatherDataDays.forEach((day, index) => {
    const filteredDays = day.filter((element) => {
      if(element.date.split("-")[2] !== currentDay.getDate().toString()){
        return element.time === "15:00:00";
      }
      else if(!weatherToday){
        weatherToday = true;
        return element;
      }
    
    });
    
    const todaysDate = currentDay.getDate();
    const weatherDate = parseInt(filteredDays[0].date.split("-")[2]);
    const weatherMonth = parseInt(filteredDays[0].date.split("-")[1]) - 1;

    function getIndexOfday(todaysDate, weatherDate, currentDay){
      const daysDifference = weatherDate - todaysDate;
      const currentDayOfWeek = currentDay.getDay();

      // Calculate the index of the day of the week for the weather forecast
      let indexOfDay = currentDayOfWeek + daysDifference;

      // Adjust the index if it exceeds 6 (Saturday)
      if (indexOfDay > 6) {
        indexOfDay -= 7;
      }
      
      // Adjust the index if it's less than 0, happens on change of month
      if(indexOfDay < 0){
        
        indexOfDay = daysDifference + todaysDate;
        //console.log(`indexOfDay: ${indexOfDay}, daysDifference: ${daysDifference}, currentDay: ${currentDayOfWeek}`);
      }

      return indexOfDay;
    }

    //const indexOfDay = weatherDate - todaysDate + currentDay.getDay() > 6 ? weatherDate - todaysDate ;

    const dailyData = {
      date: `${days[getIndexOfday(todaysDate, weatherDate, currentDay)]} ${filteredDays[0].date.split("-")[2]} ${months[weatherMonth]}`,
      maxTemp: maxTempDays[index],
      minTemp: minTempDays[index],
      icon: filteredDays[0].icon,
      weather: filteredDays[0].weather,
      windSpeed: filteredDays[0].windSpeed,
    }

    dailyWeatherData.push(dailyData);
    
  });

  return dailyWeatherData;
  
 
  
}



const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

router.get('/test', async (req, res, next) => {
  try {
    const city = "London"; //Replace with city name from request body.
    const responseCoords = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    const latitude = responseCoords.data[0].lat;
    const longitude = responseCoords.data[0].lon;
    
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
    const weatherInfo = response.data.list;

    const weatherData = createWeatherData(weatherInfo);
    const weatherDataDays = getWeatherDataDays(weatherData);
   
    res.status(200).json({
      data: createDataObject(weatherDataDays)
    })
      
  }
  catch (error){
    next(error);
  }
  
  
  
});


export default router;