var searchHistoryEl = document.getElementById("searchHistory");
var userFormEl = document.getElementById("user-form");
var currentWeatherContainerEl = document.getElementById("currentWeatherContainer");
var weatherForecastEl = document.getElementById("weatherForecast");
var cityInputEl = document.getElementById("searchCity");
var forecastContainerEl = document.getElementById("forecastContainer");
var fivedayEl = document.getElementById("fivedaytext");
var clearSearchEl = document.getElementById("clearSearch");
var apiKey = "2c80a37e26056a8357db3a094aec350e";
var activeCity = "";
var searchedCities = [];


//search submit listener
var citySubmitHandler = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim().toLowerCase();


    if (city) {
        getCurrentReport(city);
        cityInputEl.value = ""; //clears out city name
        activeCity = "";

        //creates search history button
        var cityButton = city
        var cityButtonEl = document.createElement("button");
        cityButtonEl.innerHTML = cityButton;
        cityButtonEl.addEventListener("click", function() {
            getCurrentReport(city)});
        cityButtonEl.setAttribute("id", "city-" + city);
        $(cityButtonEl).addClass("btn");
        searchHistoryEl.appendChild(cityButtonEl);

        //stores search input to localstorage
        saveSearchHistory(city)
        //string. charAt(0). toUpperCase()
    } else {
        alert("Please check city spelling")
    }
};


//gets initial call for city
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

//gets coordinates from first api call
var getCoordinates = function (data) {
    var lat = data.coord.lat
    var lon = data.coord.lon
    getWeatherReport(lat, lon)
}

//uses lat and lon to get the api "onecall" with more data
var getWeatherReport = function (lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&exclude=minutely,hourly" + "&appid=" + apiKey;

    fetch(apiUrl).then(function (response) {
        //request was successful
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayWeatherReport(data);
                displayForecastReport(data);
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};


//creates current weather box
var displayWeatherReport = function (data) {
    $("#currentWeatherContainer").empty();
    var currentCity = activeCity; // global variable that clears in submithandler
    var todayDate = moment.unix(data.current.dt).format('l');
    var currentTemp = data.current.temp;
    var currentHumidity = data.current.humidity;
    var currentWindSpeed = data.current.wind_speed;
    var currentUvIndex = data.current.uvi;
    $(currentWeatherContainerEl).addClass("current-weather")

    //so I can append a class and then append it to the p element
    var uvIndexEl = document.createElement("span")
    uvIndexEl.innerHTML = currentUvIndex;
    //checking uv value
    if (currentUvIndex < 4) {
        $(uvIndexEl).addClass("mild-uvi");
    } else if (currentUvIndex >= 4 && currentUvIndex < 7) {
        $(uvIndexEl).addClass("moderate-uvi");
    } else if (currentUvIndex >= 7) {
        $(uvIndexEl).addClass("severe-uvi");
    };

    //formating icon
    var currentWeatherIcon = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    var WeatherIconImg = document.createElement("img")
    WeatherIconImg.setAttribute("src", currentWeatherIcon);

    //console.log("displaying weather", currentTemp, currentHumidity, currentWindSpeed, currentUvIndex, currentWeatherIcon);

    //name and date
    var currentCityEl = document.createElement("h2");
    //add class
    currentCityEl.innerHTML = currentCity + " " + todayDate;
    currentWeatherContainerEl.appendChild(currentCityEl);
    currentWeatherContainerEl.appendChild(WeatherIconImg);

    //temp
    var currentTempEl = document.createElement("p");
    //add class
    currentTempEl.innerHTML = "Temperature: " + currentTemp + "°F";
    currentWeatherContainerEl.appendChild(currentTempEl);

    //humidity
    var currentHumidityEl = document.createElement("p");
    //add class
    currentHumidityEl.innerHTML = "Humidty: " + currentHumidity + "%";
    currentWeatherContainerEl.appendChild(currentHumidityEl);

    //wind speed
    var currentWindSpeedEl = document.createElement("p");
    //add class
    currentWindSpeedEl.innerHTML = "Wind Speed: " + currentWindSpeed;
    currentWeatherContainerEl.appendChild(currentWindSpeedEl);

    //uv index
    var currentUvIndexEl = document.createElement("p");
    //add class
    currentUvIndexEl.innerHTML = "UV Index: ";
    currentUvIndexEl.appendChild(uvIndexEl);
    currentWeatherContainerEl.appendChild(currentUvIndexEl);
};

var displayForecastReport = function (data) {
    $("#forecastContainer").empty();
    fivedayEl.innerHTML = "5-Day Forecast:"

    console.log("forecast", data);

    //need to iterate through array and append them
    for (var i = 1; i < 6; i++) {
        var forecastCardEl = document.createElement("div");
        $(forecastCardEl).addClass("forecast-card");

        //date
        var date = moment.unix(data.daily[i].dt).format('l');
        var dateEl = document.createElement("h2");
        dateEl.innerHTML = date;
        //add dateEl class
        forecastCardEl.appendChild(dateEl);

        //icon
        var forecastWeatherIcon = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
        console.log("this is the icon", forecastWeatherIcon);
        var WeatherIconImgEl = document.createElement("img");
        //add class
        WeatherIconImgEl.setAttribute("src", forecastWeatherIcon);
        forecastCardEl.appendChild(WeatherIconImgEl);

        //temp
        var forecastTemp = data.daily[i].temp.day;
        var forecastTempEl = document.createElement("p");
        forecastTempEl.innerHTML = "Temperature: " + forecastTemp + "°F";
        //add class
        forecastCardEl.appendChild(forecastTempEl);

        var forecastHumidity = data.daily[i].humidity;
        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.innerHTML = "Humidity: " + forecastHumidity + "%";
        //add class
        forecastCardEl.appendChild(forecastHumidityEl);

        forecastContainerEl.appendChild(forecastCardEl);
        console.log(i);
    };
};


function cityButtonCreation(city) {
    var cityButton = city
        var cityButtonEl = document.createElement("button");
        cityButtonEl.innerHTML = cityButton;
        cityButtonEl.addEventListener("click", function() {
            getCurrentReport(city)});
        cityButtonEl.setAttribute("id", "city-" + city);
        $(cityButtonEl).addClass("btn");
        searchHistoryEl.appendChild(cityButtonEl);

}

//store api call function and city name id / this is what we would append it to
function saveSearchHistory(city) {
    var city = city;
    searchedCities.push(city)
    localStorage.setItem("searched", JSON.stringify(searchedCities));
};

//pulls the local storage to the searched cities Element
var loadSearchedCity = function () {
    searchedCities = JSON.parse(localStorage.getItem("searched"));

    if (!searchedCities) {
        searchedCities = [];
    } else {
        for (var i = 0; i < searchedCities.length; i++) {
            var city = searchedCities[i]
            console.log("Saved: ", city)
            cityButtonCreation(city)
        };
    };
}

var clearLocalStorage = function () {
    localStorage.removeItem("searched");
    console.log("click")
    document.location.reload()
};

//.addEventListener("submit", getCurrentReport)
userFormEl.addEventListener("submit", citySubmitHandler)
loadSearchedCity();