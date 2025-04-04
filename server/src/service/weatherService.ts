import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  tempF: number;
  weather: string;
  icon: string;
  windSpeed: number;
  humidity: number;
  // date: number;
  // iconDescription: string;

  constructor(city: string, tempF: number, weather: string, icon: string, windSpeed: number, humidity: number) {
    this.city = city;
    this.tempF = tempF;
    this.weather = weather;
    this.icon = icon;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key properties
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = process.env.OPENWEATHER_API_KEY || ''; // Ensure API key is set in .env
  }

  // Fetch location data (geocoding) based on the city name
  private async fetchLocationData(query: string) {
    const url = this.buildGeocodeQuery(query);
    const response = await fetch(url);
    const locationData = await response.json();
    return locationData;
  }

  // Destructure the location data to extract latitude and longitude
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData.coord;
    return { lat, lon };
  }

  // Build the geocode query (used in fetchLocationData)
  private buildGeocodeQuery(cityName: string): string {
    return `${this.baseURL}weather?q=${cityName}&appid=${this.apiKey}`;
  }

  // Build the weather query (to fetch weather data based on coordinates)
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // Fetch and destructure the location data to get coordinates
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // Fetch the weather data using coordinates
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const weatherData = await response.json();
    return weatherData;
  }

  // Parse current weather data
  private parseCurrentWeather(response: any): Weather {
    const { name, main, weather, wind } = response;
    const currentWeather = new Weather(
      name,
      main.tempF,
      weather[0].description,
      weather[0].icon,
      wind.speed,
      main.humidity
    );
    return currentWeather;
  }

  // Build forecast array from weather data
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [];
    for (const item of weatherData) {
      const forecastWeather = new Weather(
        currentWeather.city,
        item.main.tempF,
        item.weather[0].description,
        item.weather[0].icon,
        item.wind.speed,
        item.main.humidity
      );
      forecastArray.push(forecastWeather);
    }
    return forecastArray;
  }

  // Get weather data for a city (current weather + forecast)
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      // Get city coordinates using geocode (fetch location data)
      const coordinates = await this.fetchAndDestructureLocationData(city);
      // Fetch weather data using the city coordinates
      const weatherData = await this.fetchWeatherData(coordinates);
      // Parse current weather
      const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
      // Build forecast array
      const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);

      return [currentWeather, ...forecastArray]; // Return current weather + forecast
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Failed to retrieve weather data");
    }
  }
}

export default new WeatherService();
