import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // GET weather data from the city name
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    
    if (!weatherData) {
      return res.status(404).json({ error: 'City not found' });
    }

    // Save city to search history
    await HistoryService.addCity(cityName);

    // Respond with the weather data
    return res.json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (_, res) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    return res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to remove city from history' });
  }
});

export default router;
