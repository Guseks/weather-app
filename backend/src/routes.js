import express from 'express';

const router = express.Router();

/* 
TODO: Create route for getting weather data from OpenWeatherMap API

STEPS:
TODO: Extract data from frontend request
TODO: Convert city name to geo coordinates using Geocoder API (Look up how)
TODO: Make request to API, analyze returned data to find suitable format to return.
TODO: Handle returned data in frontend to display weather data

*/


router.get('/test', async (req, res, next) => {
  try {
      console.log("App responding!");
      res.status(200).send("App is responding!");
  }
  catch (error){
    next(error);
  }
  
  
  
});


export default router;