// user inputs city in form - make variable
// fetch current/future weather for that city put into local storage
// for weather need city name, the date, an icon representation of weather conditions,
//  the temperature, the humidity, the wind speed, and the UV index (color coded favorable(green) moderate(yellow) severe(red))
// 


var cityInput = document.getElementById("cityInput");
var cityForm = document.getElementById("cityForm");
var submitButton = document.getElementById("submitButton");
var searchHistory = document.getElementById("history")
var currentWeather = document.getElementById("currentWeather")
var fiveDayForecast = document.getElementById("fiveDay")


// key for openweatherapi 
var APIkey = "0d79bd3ff7e85c4b19f6f08702035eed";

// do i want to do 'city' or 'cities'? 
var city; //var cities = []



//submit button
submitButton.on("submit", function () {

})