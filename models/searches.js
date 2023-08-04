const fs = require('fs');
const axios = require('axios');

class Searches {

  history = [];
  path = './db/db.json';

  constructor() {
    // Read DB
    this.readDB();
  }

  get mapBoxParams() {
    return {
      'access_token': process.env.MAPBOX_KEY,
      'limit': 5,
      'proximity': 'ip'
    }
  };

  get openWeatherParams() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: 'metric'
    }
  }

  get capitalizedHistory() {
    return this.history.map(place => {
      let words = place.split(' ');
      words = words.map(w => w[0].toUpperCase() + place.substring(1));
      return words.join(' ');
    });
  }

  async city(city = '') {

    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
        params: this.mapBoxParams
      });
      const { data: { features } } = await instance.get();
      return features.map(({ id, place_name, center }) => ({
        id,
        name: place_name,
        lng: center[0],
        lat: center[1],
      }));

    } catch (error) {
      console.log(error);
      return [];
    }

  }

  async cityWeather(lat, lon) {

    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
        params: this.openWeatherParams
      });
      const { data: { weather, main } } = await instance.get();
      const weatherDescription = weather[0].description;
      const { temp, temp_min, temp_max } = main;
      return {
        weatherDescription,
        min: temp_min,
        max: temp_max,
        temp
      };
    } catch (error) {
      console.log(error);
      return null;
    }

  }

  addHistory(place = '') {
    // Prevent duplicates
    if (this.history.includes(place.toLocaleLowerCase())) {
      return;
    }
    this.history = this.history.splice(0, 5);

    this.history.unshift(place.toLowerCase());

    // Save in DB
    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history
    };
    fs.writeFileSync(this.path, JSON.stringify(payload));
  }

  readDB = () => {
    if (!fs.readFileSync(this.path)) return;
    const info = fs.readFileSync(this.path, { encoding: 'utf-8' });
    const data = JSON.parse(info);
    this.history = data.history;
  }

}

module.exports = Searches;