import express from 'express';

import { createWeatherData, getWeatherDataDays, createDataObject, getCoordinates, getWeatherData } from './util/weatherDataUtils.js';
;

const router = express.Router();

/* 
TODO: Create route for getting weather data from OpenWeatherMap API

STEPS:
TODO: Extract data from frontend request  - DONE!
TODO: Convert city name to geo coordinates using Geocoder API (Look up how) - DONE! 
TODO: Make request to API, analyze returned data to find suitable format to return.  - DONE!

TODO: Put utility functions for handling data in separate file - DONE!

API URL: https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

*/

router.get('/weather', async (req, res, next) => {
  try {
    //console.log(params);
    const city = "London";
    if(!city){
      throw new Error("City name is required");
    }
    const {latitude, longitude} = await getCoordinates(city);
    const weatherInfo = await getWeatherData(latitude, longitude);
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