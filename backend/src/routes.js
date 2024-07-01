import express from 'express';

import { createWeatherData, getWeatherDataDays, createDataObject, getCoordinates, getWeatherData } from './util/weatherDataUtils.js';
;

const router = express.Router();


router.get('/weather', async (req, res, next) => {
  try {
    const city = req.query.city;
    
    if(!city){
      throw new Error("City name is required");
    }
    const {latitude, longitude} = await getCoordinates(city);
    const weatherInfo = await getWeatherData(latitude, longitude);
    const weatherData = createWeatherData(weatherInfo);
    const weatherDataDays = getWeatherDataDays(weatherData);
   
    res.status(200).json({
      weather: createDataObject(weatherDataDays)
    })
   
  }
  catch (error){
    next(error);
  }
  
});

export default router;