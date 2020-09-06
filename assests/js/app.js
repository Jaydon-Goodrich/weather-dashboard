var searchEl = document.querySelector("#userSearch");
var cityText = document.querySelector("#citySearch");
var cityData = document.querySelector("#cityData");
var listGroupEl = document.querySelector("#list-group");

var historyArr = [];

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

var searchSubmit = function (event) {
    event.preventDefault();
    cityData.className = "city-content";
    var city = cityText.value.trim();
    if (city) {
        getWeather(city);
        var citySearch = document.createElement("a");
        citySearch.classList = "list-group-item list-group-item-action";
        citySearch.textContent = city;
        citySearch.setAttribute("data-city", city);
        listGroupEl.appendChild(citySearch);

        cityText.value = "";
    }
    else {
        alert("Please enter a city");
    }
}

var buttonClickHandler = function(event){
    var city = event.target.getAttribute("data-city");
    if(city){
        getWeather(city);
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
    weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`);

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

    //get humidity and display
    var humid = temp.main.humidity;
    var humData = document.createElement("div");
    humData.textContent = `Humidity: ${humid}%`;
    cityData.appendChild(humData);

    //get wind speed and display
    var windSpeed = temp.wind.speed;
    var windData = document.createElement("div");
    windData.textContent = `Wind Speed: ${windSpeed} MPH`;
    cityData.appendChild(windData);
    
    getUVIndex(temp);
}

var getUVIndex = function (tempObj) {
    var long = tempObj.coord.lon;
    var lati = tempObj.coord.lat;

    var apiUrl = `http://api.openweathermap.org/data/2.5/uvi?appid=909b0d1a948f8a2c47ff9eb0867caa37&lat=${lati}&lon=${long}`;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function(data) {
                var uvValue = data.value;
                if (uvValue <=3) {
                    var uvData = document.createElement("div");
                    var uvNum = document.createElement("span")
                    uvNum.className = "good";
                    uvData.textContent = `UV Index: `;
                    uvNum.textContent = uvValue;
                    uvData.appendChild(uvNum);
                    cityData.appendChild(uvData);
                }
                else if (uvValue > 3 && uvValue <=7 ){
                    var uvData = document.createElement("div");
                    var uvNum = document.createElement("span")
                    uvNum.className = "moderate";
                    uvData.textContent = `UV Index: `;
                    uvNum.textContent = uvValue;
                    uvData.appendChild(uvNum);
                    cityData.appendChild(uvData);
                }
                else{
                    var uvData = document.createElement("div");
                    var uvNum = document.createElement("span")
                    uvNum.className = "bad";
                    uvData.textContent = `UV Index: `;
                    uvNum.textContent = uvValue;
                    uvData.appendChild(uvNum);
                    cityData.appendChild(uvData);
                }
            });
        }
        else {
            alert("Error!" + response.statusText);
        }
    });
}

listGroupEl.addEventListener("click", buttonClickHandler);
searchEl.addEventListener("submit", searchSubmit);