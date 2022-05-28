var APIkey = "0d79bd3ff7e85c4b19f6f08702035eed";

var city;

var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;

fetch(queryURL)