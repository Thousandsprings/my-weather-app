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

//show local time
function showLocalTime(response) {
  // console.log(response.data); //local date and time
  // console.log(response.data.formatted.slice(11, 16)); //local time
  let currentTime = document.getElementById("current-time");
  let localTimeStamp = response.data.formatted;
  currentTime.innerHTML = `${localTimeStamp.slice(
    8,
    10
  )}/${localTimeStamp.slice(5, 7)}/${localTimeStamp.slice(0, 4)}`;

  let localTime = document.getElementById("local-time");
  localTime.innerHTML = `${localTimeStamp.slice(11, 16)}(local time)`;
}

//convert Temperature
//convert to celsius
function convertCelsius(event) {
  event.preventDefault();
  let showTemp = document.getElementById("current-temperature");
  celsiusTemperature = Math.round(celsiusTemperature);
  showTemp.innerHTML = celsiusTemperature;

  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
}
//convert to fahrenheit
function convertFahrenheit(event) {
  event.preventDefault();
  let showTemp = document.getElementById("current-temperature");
  celsiusTemperature = Math.round(celsiusTemperature);
  showTemp.innerHTML = Math.round(celsiusTemperature * 1.8 + 32);

  fahrenheit.classList.add("active");
  celsius.classList.remove("active");
}
let celsius = document.getElementById("celsius");
let fahrenheit = document.getElementById("fahrenheit");

celsius.addEventListener("click", convertCelsius);
fahrenheit.addEventListener("click", convertFahrenheit);

let celsiusTemperature = null;

function showWeather(response) {
  console.log(response);
  let cityName = response.data.name;
  let weatherDescription = response.data.weather[0].description;
  let windSpeed = response.data.wind.speed;
  let humidity = response.data.main.humidity;
  let icon = response.data.weather[0].icon;

  celsiusTemperature = Math.round(response.data.main.temp);

  console.log(cityName); //city name
  console.log(celsiusTemperature); //celsiusTemperature
  console.log(weatherDescription); //weather
  console.log(windSpeed); //windspeed

  //change city name
  const showCity = document.getElementById("current-city");
  showCity.innerHTML = cityName;

  //Local Time
  let localTimeApiKey = "KTPS14XG8OUY";
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  let localTimeApiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${localTimeApiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`;
  axios.get(localTimeApiUrl).then(showLocalTime);

  //show Temperature
  let showTemp = document.getElementById("current-temperature");
  showTemp.innerHTML = celsiusTemperature;

  //show Wind speed
  let showWindSpeed = document.getElementById("wind-speed");
  showWindSpeed.innerHTML = `Wind speed: ${windSpeed}m/s`;

  //show Humidity
  let showHumidity = document.getElementById("humidity");
  showHumidity.innerHTML = `Humidity: ${humidity}%`;
  //change icon
  // console.log(icon);
  const iconHtml = document.getElementById("weather-now");
  iconHtml.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${icon}@2x.png`
  );
  let currentWeatherHtml = document.getElementById("current-weather");
  currentWeatherHtml.innerHTML = weatherDescription;

  //forecast
  let apiKey = "ac021ab78099db15d109c8b194975aa6";
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

//show forecast
function showForecast(response) {
  console.log(response); //weekly forecast
  //change icons
  let forecastElements = document.getElementById("forecast");
  forecastElements.innerHTML = null;

  let forecast = null;

  //Temperature
  let maxTemp = null;
  let minTemp = null;

  //Local time
  let localTimeApiKey = "KTPS14XG8OUY";
  let latitude = response.data.lat;
  // console.log(latitude);
  let longitude = response.data.lon;
  let localTimeApiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${localTimeApiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`;
  axios.get(localTimeApiUrl).then(showWeekdaysForecast).then(displayForecast);

  //show the day of a week in local time
  function showWeekdaysForecast(weekDays) {
    // console.log(weekDays); //local data
    let wDay = new Date(weekDays.data.formatted);
    // console.log(wDay);
    wDayNum = wDay.getDay();
    // console.log(wDayNum); //weekday number
    return wDayNum;
  }

  function displayForecast() {
    let weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let weekDay = document.getElementById("weekDay");
    weekDay.innerHTML = null;

    for (let index = 1; index < 7; index++) {
      forecast = response.data.daily[index];
      maxTemp = Math.round(response.data.daily[index].temp.max);
      minTemp = Math.round(response.data.daily[index].temp.min);

      forecastElements.innerHTML += `<div class="circle col-md-1">
    <div class=col-md-1" id="weekDay">${weekdays[wDayNum + index]}</div >
    <img id="imgForecast" src="https://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }@2x.png"/>
    <h3>${maxTemp}℃/${minTemp}℃</h3>
    </div>`;
    }
  }
}

function search() {
  //   console.log(searchCity.value);
  let city = searchCity.value;
  let apiKey = "ac021ab78099db15d109c8b194975aa6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&&units=metric`;
  axios.get(apiUrl).then(showWeather);
}
searchBtn.addEventListener("click", search);

//show the info in the current location
function showCurrentLocation(location) {
  //   console.log(location);    location info
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;
  let apiKey = "ac021ab78099db15d109c8b194975aa6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&&units=metric`;
  axios.get(apiUrl).then(writeCurrentLocationInfo);

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
    let localTime = document.getElementById("local-time");
    localTime.innerHTML = ``;

    //show location Temperature
    celsiusTemperature = Math.round(locationInfo.data.main.temp);
    let showTemp = document.getElementById("current-temperature");
    showTemp.innerHTML = celsiusTemperature;

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

    //forecast
    let apiKey = "ac021ab78099db15d109c8b194975aa6";
    let lat = locationInfo.data.coord.lat;
    let lon = locationInfo.data.coord.lon;
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(showForecast);

    //show forecast
    function showForecast(response) {
      console.log(response); //weekly forecast
      //change icons
      let forecastElements = document.getElementById("forecast");
      forecastElements.innerHTML = null;

      let forecast = null;

      //Temperature
      let maxTemp = null;
      let minTemp = null;

      let wDay = new Date(response.data.current.dt * 1000);
      console.log(wDay);
      let wDayNum = wDay.getDay();
      let weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      let weekDay = document.getElementById("weekDay");
      weekDay.innerHTML = null;

      for (let index = 1; index < 7; index++) {
        forecast = response.data.daily[index];
        maxTemp = Math.round(response.data.daily[index].temp.max);
        minTemp = Math.round(response.data.daily[index].temp.min);

        forecastElements.innerHTML += `<div class="circle col-md-1">
    <div class=col-md-1" id="weekDay">${weekdays[wDayNum + index]}</div >
    <img id="imgForecast" src="https://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }@2x.png"/>
    <h3>${maxTemp}℃/${minTemp}℃</h3>
    </div>`;
      }
    }
  }
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

let currentLocationBtn = document.getElementById("current-location");
currentLocationBtn.addEventListener("click", getCurrentLocation);
