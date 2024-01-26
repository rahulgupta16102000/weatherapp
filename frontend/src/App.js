import React from 'react';
import WeatherForecast from './WeatherForecast';

const App = () => {
  

  return (
    <div className="App">
    <div>
      <h1 style={{    margin: '0',
    textAlign: 'center',
    backgroundColor: '#f2f2f2',
    padding: '1rem'}}>Weather Forecast</h1>
    </div>
         <WeatherForecast   />
     </div>
  );
};

export default App;