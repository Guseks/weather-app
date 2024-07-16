# Weather-app
This application is a weather app where the user can get the current weather at a desired location for up to the next 5 days. 
The app consists of a frontend and backend. The backend makes request to the openweathermap API to get the weather data. 
This weather data is then handled and processed by the backend. This data is then displayed by the frontend for the user to enjoy. 

## Setup and launch app
Instructions on how to setup application and then start it.

### Backend
 First navigate to backend folder in terminal then run the following command:

```bash
npm install
```
Inside the backend folder start the backend by running the following command:
```bash
node server.js
```
Backend is now launched and ready to receive requests.

### Frontend
Navigate to frontend folder in terminal then run the following command:
```bash
npm install
```
After this run the following command to start the frontend of the application:
```bash
npm run dev
```
After this open the address displayed in the terminal to access the application.

## Example of frontend interface
![Weather App Screenshot](/frontend/src/assets/example.png)

## Technologies and Libraries used
- NodeJS
- React
- Express (backend)
- Tailwind
- Axios
