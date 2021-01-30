//show current date
let now = new Date();
let weekdayNum = now.getDay();
let week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let weekday = week[weekdayNum];
let date = now.getDate();
let monthNum = now.getMonth();
let monthes = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
//header
let month = monthes[monthNum];
let year = now.getFullYear();
let dateHtml = document.getElementById("date-in-html");
dateHtml.innerHTML = `${weekday}, ${date}. ${month}, ${year}(Current location)`;

//search
let searchCity = document.getElementById("city-name");
let searchBtn = document.getElementById("search-button");

function showWeather(response) {
  console.log(response);
  let cityName = response.data.name;
  let temperature = Math.round(response.data.main.temp);
  let weatherDescription = response.data.weather[0].description;
  let windSpeed = response.data.wind.speed;
  let icon = response.data.weather[0].icon;

  console.log(cityName); //city name
  console.log(temperature); //temperature
  console.log(weatherDescription); //weather
  console.log(windSpeed); //windspeed

  //change city name
  const showCity = document.getElementById("current-city");
  showCity.innerHTML = cityName;

  //show local time
  function showLocalTime(response) {
    console.log(response.data.formatted); //local date and time
    // console.log(response.data.formatted.slice(11, 16)); //local time
    const localTime = document.getElementById("current-time");
    let localTimeStamp = response.data.formatted;
    localTime.innerHTML = localTimeStamp.slice(11, 16);
    let currentLocationDate = document.getElementById("current-location-date");
    currentLocationDate.innerHTML = `${localTimeStamp.slice(
      8,
      10
    )}/${localTimeStamp.slice(5, 7)}/${localTimeStamp.slice(0, 4)}(Local Time)`;
  }
  let localTimeApiKey = "KTPS14XG8OUY";
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;

  let localTimeApiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${localTimeApiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`;
  axios.get(localTimeApiUrl).then(showLocalTime);

  //show temperature
  const showTemp = document.getElementById("current-temperature");
  showTemp.innerHTML = temperature;

  //convert temperature
  let celsius = document.getElementById("celsius");
  let fahrenheit = document.getElementById("fahrenheit");

  function convertCelsius() {
    showTemp.innerHTML = temperature;
  }
  function convertFahrenheit() {
    showTemp.innerHTML = Math.round(temperature * 1.8 + 32);
  }
  celsius.addEventListener("click", convertCelsius);
  fahrenheit.addEventListener("click", convertFahrenheit);
  //change icon
  console.log(icon);
  const iconHtml = document.getElementById("weather-now");
  iconHtml.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${icon}@2x.png`
  );
  let currentWeatherHtml = document.getElementById("current-weather");
  currentWeatherHtml.innerHTML = weatherDescription;

  function search() {
    //   console.log(searchCity.value);
    let city = searchCity.value;
    let apiKey = "ac021ab78099db15d109c8b194975aa6";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&&units=metric`;
    axios.get(apiUrl).then(showWeather);
  }
}

searchBtn.addEventListener("click", search);

//show the info in the current location
function showCurrentLocation(location) {
  //   console.log(location);    location info
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;
  let apiKey = "ac021ab78099db15d109c8b194975aa6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&&units=metric`;

  function writeCurrentLocationInfo(locationInfo) {
    console.log(locationInfo);
    //location
    let currentCity = document.getElementById("current-city");
    currentCity.innerHTML = locationInfo.data.name;
    //location time
    let currentTime = document.getElementById("current-time");
    let hour = new Date().getHours();
    let min = new Date().getMinutes();
    if (hour < 10) {
      hour = `0${hour}`;
    }
    if (min < 10) {
      min = `0${min}`;
    }
    currentTime.innerHTML = `${hour}:${min}`;
    //show location temperature
    let temperature = Math.round(locationInfo.data.main.temp);
    const showTemp = document.getElementById("current-temperature");
    showTemp.innerHTML = temperature;

    //convert temperature
    let celsius = document.getElementById("celsius");
    let fahrenheit = document.getElementById("fahrenheit");

    function convertCelsius() {
      showTemp.innerHTML = temperature;
    }
    function convertFahrenheit() {
      showTemp.innerHTML = Math.round(temperature * 1.8 + 32);
    }
    celsius.addEventListener("click", convertCelsius);
    fahrenheit.addEventListener("click", convertFahrenheit);

    //change icon
    let icon = locationInfo.data.weather[0].icon;
    let weatherDescription = locationInfo.data.weather[0].description;
    const iconHtml = document.getElementById("weather-now");
    iconHtml.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${icon}@2x.png`
    );
    let currentWeatherHtml = document.getElementById("current-weather");
    currentWeatherHtml.innerHTML = weatherDescription;
  }

  axios.get(apiUrl).then(writeCurrentLocationInfo);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

let currentLocationBtn = document.getElementById("current-location");
currentLocationBtn.addEventListener("click", getCurrentLocation);