var searchEl = document.querySelector("#userSearch");
var cityText = document.querySelector("#citySearch");
var cityData = document.querySelector("#cityData");


var getWeather = function (cityName) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=909b0d1a948f8a2c47ff9eb0867caa37`
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data);
                });
            }
            else {
                alert("Error!" + response.statusText);
            }
        });
}

var searchSubmit = function (event){
    event.preventDefault();
    var city = cityText.value.trim();
    if(city) {
        getWeather(city);
        cityText.value = "";
    }
    else{
        alert("Please enter a city");
    }
}

var displayWeather = function (temp) {
    //clear out cityData
    cityData.innerHTML = "";
    
    //get the current date
    var currentDate = new Date;
    var month = currentDate.getMonth();
    var day = currentDate.getDate();
    var year = currentDate.getFullYear();
    var date = `(${month}/${day}/${year})`
    //create a title element
    var CityTitle = document.createElement("span");
    var title = document.createElement("h2");
    //get the cityName
    var cityName = temp.name;
    var iconCode = temp.weather[0].icon;
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src",`http://openweathermap.org/img/wn/${iconCode}@2x.png`);

    //append date and name
    title.textContent = cityName + " " + date;
    CityTitle.appendChild(title);
    CityTitle.appendChild(weatherIcon);
    cityData.appendChild(CityTitle);

    //get the temperature and display it
    var temperature = temp.main.temp;
    var tempData = document.createElement("div");
    tempData.textContent = `Temperature: ${temperature}°F`;
    cityData.appendChild(tempData);
    
}

searchEl.addEventListener("submit", searchSubmit);