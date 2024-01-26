import React, { useState, useEffect } from 'react';
import { cities } from 'indian-cities-json';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Button, CircularProgress } from '@mui/material';
import './weatherforecast.css'; // Import your CSS file

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clickedButtons, setClickedButtons] = useState([]);
  const [lastVisitedCity, setLastVisitedCity] = useState();
  const [isOpen,setIsOpen] = useState(false)

  const indianCities = cities.map(city => city.name);

  useEffect(() => {
    const storedCities = localStorage.getItem('selectedCities');
    const storedLast = localStorage.getItem('lastVisited');
  
     
  
    const initialCities = storedCities ? JSON.parse(storedCities) : [];
  
  
    
  
  
    setSelectedCities(initialCities);  
  
    if (storedLast) {
      setLastVisitedCity(JSON.parse(storedLast))
    }
  }, []);
  
  useEffect(()=>{
 if(lastVisitedCity){
  handleGetWeather(lastVisitedCity)
 }
  },[lastVisitedCity])
  

  const handleGetWeather = async (selectedCity) => {
    console.log('selectedCity', selectedCity);
    if (selectedCity) {
      try {
        setLoading(true);

        const response = await fetch('http://localhost:3001/weather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ city: selectedCity }),
        });

        console.log('response', response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data', data);
        setWeatherData(data);

        if (!selectedCities.includes(selectedCity)) {
          const updatedCities = [...selectedCities, selectedCity];
          localStorage.setItem('selectedCities', JSON.stringify(updatedCities));
          setSelectedCities(updatedCities);

        }
        localStorage.setItem('lastVisited', JSON.stringify(selectedCity));
        setClickedButtons([ selectedCity]);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="weather-app-container">
      <div className='choose-cities'>
        <div className="selected-cities">
          {selectedCities.map((city, index) => (
            <Button
              key={index}
              color='secondary'
              variant='outlined'
              onClick={() => handleGetWeather(city)}
              style={{color:"black", backgroundColor: clickedButtons.includes(city) ? '#3ebabf' : '#ece4e4' }}
            >
              {city}
            </Button>
          ))}
        </div>
        {
          selectedCities.length===0 && !isOpen && <Button color='primary' variant='outlined' onClick={()=>setIsOpen(true)} >Add More..</Button>
        }
        { (selectedCities.length>0 || isOpen ) && <Autocomplete
          id="cityAutocomplete"
          options={indianCities}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="City" />}
          onChange={(event, newValue) => handleGetWeather(newValue)}
        />}
      </div>
      {loading && <CircularProgress />}
      {error && <p>Error: {error}</p>}
      {weatherData && (
        <div>
        <h3>4 day forecast</h3>
        <div className="weather-details">
          {weatherData.forecast.forecastday.map((val, ind) => {
            const inputDate = new Date(val.date);
            const todayDate = new Date();
            const formattedDate = inputDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            return (
              <div key={ind} className="weather-card">
                <h2>{daysOfWeek[inputDate.getDay()]}</h2>
                {inputDate.getDate() === todayDate.getDate() && <p>Today</p>}
                <p>{formattedDate}</p>
                <h2>{val?.day?.avgtemp_c}° C</h2>
                <p>{val?.day?.condition?.text}</p>
               </div>
            );
          })}
        </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
