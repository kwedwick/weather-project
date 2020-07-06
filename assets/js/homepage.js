var searchHistoryEl = document.getElementById("searchHistory")
var userFormEl = document.getElementById("user-form")
var currentWeatherContainerEl = document.getElementById("currentWeatherContainer")
var weatherForecastEl = document.getElementById("weatherForecast")
var cityInputEl = document.getElementById("searchCity")
var forecastContainerEl = document.getElementById("forecastContainer")
var apiKey = 
var activeCity = "";


var citySubmitHandler = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim().toLowerCase();

    if (city) {
        getCurrentReport(city);
        //need to append search to search history
        cityInputEl.value = ""; //clears out city name
        activeCity = "";
    } else {
        alert("Please check city spelling")
    }
};



var getCurrentReport = function (city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(apiUrl).then(function (response) {
        //request was successful
        if (response.ok) {
            response.json().then(function (data) {
                activeCity = data.name;
                getCoordinates(data);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};

var getCoordinates = function (data) {
    var lat = data.coord.lat
    var lon = data.coord.lon
    getWeatherReport(lat, lon)
}

var getWeatherReport = function (lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&exclude=minutely,hourly" + "&appid=" + apiKey;

    fetch(apiUrl).then(function (response) {
        //request was successful
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayWeatherReport(data);
                //displayForecastReport(data);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};

var displayWeatherReport = function (data) {
    $("#currentWeatherContainer").empty();
    var currentCity = activeCity;
    var todayDate = moment.unix(data.current.dt).format('l');
    var currentTemp = data.current.temp;
    var currentHumidity = data.current.humidity;
    var currentWindSpeed = data.current.wind_speed;
    var currentUvIndex = data.current.uvi;
    var currentWeatherIcon = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    var WeatherIconImg = document.createElement("img")
    WeatherIconImg.setAttribute("src", currentWeatherIcon);
    console.log("displaying weather", currentTemp, currentHumidity, currentWindSpeed, currentUvIndex, currentWeatherIcon);

    var currentCityEl = document.createElement("h2");
    currentCityEl.innerHTML = currentCity + " " + todayDate;
    currentWeatherContainerEl.appendChild(currentCityEl);
    currentWeatherContainerEl.appendChild(WeatherIconImg);

    var currentTempEl = document.createElement("p");
    currentTempEl.innerHTML = "Temperature: " + currentTemp + "°F";
    currentWeatherContainerEl.appendChild(currentTempEl);

    var currentHumidityEl = document.createElement("p");
    currentHumidityEl.innerHTML = "Humidty: " + currentHumidity + "%";
    currentWeatherContainerEl.appendChild(currentHumidityEl);

    var currentWindSpeedEl = document.createElement("p");
    currentWindSpeedEl.innerHTML = "Wind Speed: " + currentWindSpeed;
    currentWeatherContainerEl.appendChild(currentWindSpeedEl);

    var currentUvIndexEl = document.createElement("p");
    currentUvIndexEl.innerHTML = "UV Index: " + currentUvIndex;
    currentWeatherContainerEl.appendChild(currentUvIndexEl);
};

var displayForecast = function (data) {
    console.log("forecast", data);





};

// var storeSearchedCity = function () {
    //store api call function and city name id / this is what we would append it to
// }

// var loadSearchedCity = function () {

// }

userFormEl.addEventListener("submit", citySubmitHandler)