import fs from 'fs';
// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';

// TODO: Define a City class with name and id properties
class City {
  constructor(public name: string, public id: string) {}
}

// TODO: Complete the HistoryService class
class HistoryService {
  // private __dirname = dirname(fileURLToPath(import.meta.url));
  // private filePath = path.join(this.__dirname, 'searchHistory.json');
  private filePath = 'db/db.json';

  // TODO: Define a read method that reads from the searchHistory.json file
private async read(): Promise<City[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(this.filePath, 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }
      try {
        const cities = JSON.parse(data);
        resolve(cities);
      } catch (error) {
        reject(new Error('Error parsing search history data.'));
      }
    });
  });
}

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8', (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    try {
      const cities = await this.read();
      return cities;
    } catch (error) {
      console.error('Error getting cities:', error);
      return [];
    }
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<void> {
    try {
      const cities = await this.getCities();
      const id = Date.now().toString();
      const newCity = new City(city, id);
      cities.push(newCity);
      await this.write(cities);
    } catch (error) {
      console.error('Error adding city:', error);
    }
    }
  
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
async removeCity(id: string): Promise<void> {
  try {
    const cities = await this.getCities();
    const filteredCities = cities.filter((city) => city.id !== id);
    await this.write(filteredCities);
  } catch (error) {
    console.error('Error removing city:', error);
  }
  }
}

export default new HistoryService();
