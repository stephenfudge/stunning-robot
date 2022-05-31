//variables for html sections
var cityInputEl = document.getElementById("cityInput");
var cityFormEl = document.getElementById("cityForm");
var searchEl = document.getElementById("submitButton");
var searchHistoryEl = document.getElementById("history")
var currentContainerEl = document.getElementById("currentWeather")
var forecastContainerEl = document.getElementById("fiveDayForecast")


// apikey
var APIkey = "0d79bd3ff7e85c4b19f6f08702035eed";


var cities = [];


// retrieves the previously searched cities for the cards to display
var loadCities = function () {
    var citiesLoaded = localStorage.getItem("cities")
    if (!citiesLoaded) {
        return false;
    }

    citiesLoaded = JSON.parse(citiesLoaded);

    for (var i = 0; i < citiesLoaded.length; i++) {
        displayCities(citiesLoaded[i])
        cities.push(citiesLoaded[i])
    }
}

// saves the searched cities info to local storage
var saveCities = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
}

// creates and displays the previously searched cities
var displayCities = function (city) {
    var cityCardEl = document.createElement("div");
    cityCardEl.setAttribute("class", "card");
    var cityCardNameEl = document.createElement("div");
    cityCardNameEl.setAttribute("class", "card-body searched-city");
    cityCardNameEl.textContent = city;

    cityCardEl.appendChild(cityCardNameEl)

    cityCardEl.addEventListener("click", function () {
        getCityInfo(city)
    });
    searchHistoryEl.appendChild(cityCardEl)
}



// displays today's weather info
var displayCurrentInfo = function (city, data) {

    //variables to hold today's info 
    var tempCurrent = Math.round(data.current.temp);
    var humidity = Math.round(data.current.humidity);
    var windSpeed = data.current.wind_speed;
    var uvIndex = data.current.uvi;
    var iconCurrent = data.current.weather[0].icon;

    //creating html for today's weather to display
    currentContainerEl.textContent = ""
    currentContainerEl.setAttribute("class", "col-10 current")
    var divCityHeader = document.createElement("div")
    var headerCityDate = document.createElement("h2");
    var currentdate = moment().format("L");
    var imageIcon = document.createElement("img");
    imageIcon.setAttribute('src', "")
    imageIcon.setAttribute('src', "https://openweathermap.org/img/wn/" + iconCurrent + "@2x.png")
    headerCityDate.textContent = city + "   (" + currentdate + ")";

    //adds created html to pages
    divCityHeader.appendChild(headerCityDate)
    divCityHeader.appendChild(imageIcon)
    currentContainerEl.appendChild(divCityHeader)

    //creating the rest of the elements to display today's weather
    var divCurrent = document.createElement("div")
    var tempEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var windSpeedEl = document.createElement("p");
    var uvIndexEl = document.createElement("p");
    var uvIndexColorEl = document.createElement("span")
    uvIndexColorEl.textContent = uvIndex

    //color for background of UVindex depending on severity
    if (uvIndex <= 4) {
        uvIndexColorEl.setAttribute("class", "favorable")
    } else if (uvIndex <= 8) {
        uvIndexColorEl.setAttribute("class", "moderate")
    } else {
        uvIndexColorEl.setAttribute("class", "severe")
    }

    //add current weather info to page
    tempEl.textContent = "Temperature: " + tempCurrent + "°C";
    humidityEl.textContent = "Humidity: " + humidity + "%";
    windSpeedEl.textContent = "Wind Speed: " + windSpeed + " m/s";
    uvIndexEl.textContent = "UV Index: ";
    uvIndexEl.appendChild(uvIndexColorEl)

    //adds created html elements to page
    divCurrent.appendChild(tempEl);
    divCurrent.appendChild(humidityEl);
    divCurrent.appendChild(windSpeedEl);
    divCurrent.appendChild(uvIndexEl);
    currentContainerEl.appendChild(divCurrent);
};



// displays the 5 day forecast
var displayForecastInfo = function (data) {
    console.log(data)
    forecastContainerEl.textContent = "";
    var forecastHeaderEl = document.getElementById("fiveDayHeader");
    forecastHeaderEl.textContent = "5-day Forecast:"

    //for loop for five day forecast
    for (var i = 1; i < 6; i++) {
        var tempForecast = Math.round(data.daily[i].temp.day);
        var humidityForecast = data.daily[i].humidity;
        var iconForecast = data.daily[i].weather[0].icon;

        //creates card and data elements for five day forecast
        var cardEl = document.createElement("div");
        cardEl.setAttribute("class", "card col-xl-2 col-md-5 col-sm-10 mx-3 my-2 cardBody");


        var cardBodyEl = document.createElement("div");
        cardBodyEl.setAttribute("class", "card-body");

        var cardDateEl = document.createElement("h6");
        cardDateEl.textContent = moment().add(i, 'days').format("L");

        var cardIconEl = document.createElement("img");
        cardIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + iconForecast + "@2x.png")

        var cardTempEl = document.createElement("p");
        cardTempEl.setAttribute("class", "card-text");
        cardTempEl.textContent = "Temperature:  " + tempForecast + "°C";

        var cardHumidEl = document.createElement("p")
        cardHumidEl.setAttribute("class", "card-text");
        cardHumidEl.textContent = "Humidity:  " + humidityForecast + "%";

        //adds card info to card, and card to page
        cardBodyEl.appendChild(cardDateEl)
        cardBodyEl.appendChild(cardIconEl)
        cardBodyEl.appendChild(cardTempEl)
        cardBodyEl.appendChild(cardHumidEl)
        cardEl.appendChild(cardBodyEl);
        forecastContainerEl.appendChild(cardEl);

        //reset form after info displays
        cityFormEl.reset()
    }
};


// gets the current conditions for the searched city
var getCityInfo = function (city) {
    event.preventDefault();

    //variable to use the city to get long and latitude from the API
    var cityInfoUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APIkey;

    //get info from the url above
    fetch(cityInfoUrl).then(function (response) {
        //if response is okay/no errors found, if errors then provide error message
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);

                //variables set for data needed from the info 
                var cityName = data.name;
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;

                //check if city exists in storage/array, updates if it isn't. 
                var prevSearch = cities.includes(cityName)
                if (!prevSearch) {
                    cities.push(cityName)
                    saveCities()
                    displayCities(cityName)
                }

                getWeatherData(cityName, latitude, longitude);

            });
        } else {
            alert("That city doesn't seem to exist!");
            cityFormEl.reset()
        }
    });
};


// gets the 5 day forecast
var getWeatherData = function (city, latitude, longitude) {
    ///5-day forecast API
    var forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=metric&exclude=minutely,hourly&appid=" + APIkey;

    fetch(forecastUrl).then(function (response) {
        response.json().then(function (data) {
            console.log(data);

            displayCurrentInfo(city, data);
            displayForecastInfo(data);
        });
    });
};

//load previously searched cities on page load
loadCities()

//form submit when user enters city
cityFormEl.addEventListener("submit", function () {
    cityInput = cityInputEl.value.trim();
    getCityInfo(cityInput);
})