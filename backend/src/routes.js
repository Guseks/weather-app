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

https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

*/
const API_KEY = process.env.API_KEY;

router.get('/test', async (req, res, next) => {
  try {
      const responseCoords = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=${API_KEY}`);
      const latitude = responseCoords.data[0].lat;
      const longitude = responseCoords.data[0].lon;
      
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
      const weatherInfo = response.data.list;
      
      const currentDay = new Date();
      console.log(currentDay.getDay());

      const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

     res.status(200).json({
      weatherData: weatherInfo.map((element) => ({
        date: `${currentDay.getDate()} ${months[currentDay.getMonth()]}`,
        day: days[currentDay.getDay() - 1],
        temp: element.main.temp,
        feelsLike: element.main.feels_like,
        windSpeed: element.wind.speed,
        weather: element.weather
      }))
     })
      
  }
  catch (error){
    next(error);
  }
  
  
  
});


export default router;