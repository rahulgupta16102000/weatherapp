const express = require('express');
// const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/weather', async (req, res) => {
  const { city } = req.body;
  console.log('city',city)
  const apiKey = 'f3731156056c4462ba5145358242301';
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?q=${encodeURIComponent(city)}&days=4&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/weatherr', async (req, res) => {
    const { city } = req.body;
    console.log('city',city)
    const apiKey = 'f3731156056c4462ba5145358242301';
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?q=${encodeURIComponent("Jaipur")}&days=4&key=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
