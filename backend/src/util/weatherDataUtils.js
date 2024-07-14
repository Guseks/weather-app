import axios from "axios";

import dotenv from "dotenv"
dotenv.config()

const ICON_URL = process.env.BASE_ICON_URL;
const API_KEY = process.env.API_KEY;

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function createWeatherData(weatherInfo) {

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

export function getWeatherDataDays(weatherData){
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

export function createDataObject(weatherDataDays){
  const currentDay = new Date();
  
  const temperaturesDays = weatherDataDays.map((measurement) => measurement.map((element) => element.temp))
  const maxTempDays = temperaturesDays.map((day) => Math.max(...day));
  const minTempDays = temperaturesDays.map((day) => Math.min(...day));
  
  let weatherToday = false;
  let dailyWeatherData = [];

  weatherDataDays.forEach((day, index) => {
    const filteredDays = day.filter((element) => {
      if(parseInt(element.date.split("-")[2]) !== currentDay.getDate()){
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


    const dailyData = {
      date: `${days[getIndexOfday(todaysDate, weatherDate, currentDay)]} ${filteredDays[0].date.split("-")[2]} ${months[weatherMonth]}`,
      maxTemp: maxTempDays[index].toString(),
      minTemp: minTempDays[index].toString(),
      icon: filteredDays[0].icon,
      weatherDescription: filteredDays[0].weather.description,
      windSpeed: filteredDays[0].windSpeed.toString(),
    }

    dailyWeatherData.push(dailyData);
    
  });

  return dailyWeatherData;
  
 
  
}

export async function getWeatherData(latitude, longitude){
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
  const weatherInfo = response.data.list;
  return weatherInfo;
}



export function getIndexOfday(todaysDate, weatherDate, currentDay){
  const daysDifference = weatherDate - todaysDate;
  const currentDayOfWeek = currentDay.getDay() - 1;
  //console.log(currentDay.getDay());

  // Calculate the index of the day of the week for the weather forecast
  let indexOfDay = currentDayOfWeek + daysDifference;

  // Adjust the index if it exceeds 6 (Saturday)
  if (indexOfDay > 6) {
    indexOfDay -= 7;
  }

  // Adjust the index if it's less than 0, happens on change of month
  if(indexOfDay < 0){
    if(indexOfDay === -1){
      indexOfDay = 6;
    }
    else if(daysDifference < 7){
      indexOfDay = daysDifference + todaysDate;
    }
    
    //console.log(`indexOfDay: ${indexOfDay}, daysDifference: ${daysDifference}, currentDay: ${currentDayOfWeek}`);
  }
  console.log(`indexOfDay: ${indexOfDay}, daysDifference: ${daysDifference}`)
  return indexOfDay;
}

export async function getCoordinates(city){
  const responseCoords = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
  const latitude = responseCoords.data[0].lat;
  const longitude = responseCoords.data[0].lon;

  return {latitude, longitude};
  
}