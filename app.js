require('dotenv').config();
const { readInput, inquirerMenu, pause, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/searches");


const main = async () => {

  let opt = '';
  const searches = new Searches();

  do {

    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        // Message
        const search = await readInput('City: ');
        // Search places
        const places = await searches.city(search);
        // Select place
        const myId = await listPlaces(places);
        if (myId === '0') continue;
        // Save in DB
        const { name, lng, lat } = places.find(p => p.id === myId);
        searches.addHistory(name);
        const { weatherDescription, min, max, temp } = await searches.cityWeather(lat, lng);
        console.clear();
        console.log(`\nCity's information\n`.green);
        console.log('City: ', name.green);
        console.log('Lat: ', lat);
        console.log('Lng: ', lng);
        console.log('Description: ', weatherDescription.green);
        console.log('Temp: ', temp);
        console.log('Mintemp: ', min);
        console.log('Maxtemp: ', max);
        break;
      case 2:
        searches.history.forEach((place, i) => {
          const index = `${i + 1}.`.green;
          console.log(`${index} ${place}`);
        });
        break;
    }

    if (opt != 0) await pause();

  } while (opt != 0);


}

main();
