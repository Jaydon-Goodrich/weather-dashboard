var searchEl = document.querySelector("#userSearch");
var cityText = document.querySelector("#citySearch");
var cityData = document.querySelector("#cityData");
var listGroupEl = document.querySelector("#list-group");
var forecastTitle = document.querySelector("#forecast-title");
var cardContainerEl = document.querySelector("#card-container");
var clearButton = document.querySelector("#clear-button");

//Empty Array to store search results in LocalStorage
var cityArr = JSON.parse(localStorage.getItem("cities"));
if(!cityArr){
    cityArr = [];
    clearButton.style.display = "none";
}
else{
    clearButton.style.display = "block";
}

//get the current date
var currentDate = new Date;
var month = currentDate.getMonth();
var day = currentDate.getDate();
var year = currentDate.getFullYear();
var date = `(${month}/${day}/${year})`

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

var getForecast = function(temp){
    var long = temp.coord.lon;
    var lati = temp.coord.lat;

    var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=${lati}&lon=${long}&exclude=current,minutely,hourly&appid=909b0d1a948f8a2c47ff9eb0867caa37`;
    fetch(forecastURL).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayForecast(data);
            })
        }
        else{
            alert("Error!");
        }
    })
}
var displayForecast = function(data){
    cardContainerEl.innerHTML = "";
    forecastTitle.innerHTML =  "";
    var title = document.createElement("h2");
    title.textContent = "5-Day Forecast:";
    forecastTitle.appendChild(title);
    for(var i = 1; i < 6; i++){
        //date handle
        var newday = day + i;
        var newdate = `${month}/${newday}/${year}`;
        //create a card to put everything in
        var card = document.createElement("div");
        // add classes
        card.classList = "card text-white bg-primary";
        //create a card body to put everything in
        var cardBody = document.createElement("div");
        var cardBodyDate = document.createElement("h5");
        cardBodyDate.textContent = newdate;
        cardBody.className = "card-body";
        cardBody.appendChild(cardBodyDate);
        // add the icon to the card
        var cardBodyIcon = data.daily[i].weather[0].icon;
        var forecastIcon = document.createElement("img");
        forecastIcon.setAttribute("src", `http://openweathermap.org/img/wn/${cardBodyIcon}@2x.png`);
        cardBody.appendChild(forecastIcon);
        // add temp to card
        var cardTemp = document.createElement("div");
        cardTemp.className = "info-content";
        cardTemp.textContent = `Temp: ${data.daily[i].temp.day} °F`;
        cardBody.appendChild(cardTemp);
        //add humidity to card
        var cardHum = document.createElement("div");
        cardHum.textContent = `Humidity: ${data.daily[i].humidity}%`;
        cardBody.appendChild(cardHum);
        //append card body to card
        card.appendChild(cardBody);
        cardContainerEl.appendChild(card);
    }
}

var searchSubmit = function (event) {
    event.preventDefault();
    cityData.className = "city-content";
    var city = cityText.value.trim();
    if (city) {
        cityArr.push(city);
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
    setItems();
}


var getItems = function(){
    
    for(var i = 0; i < cityArr.length; i++){
        var citySearch = document.createElement("a");
        citySearch.classList = "list-group-item list-group-item-action";
        citySearch.textContent = cityArr[i];
        citySearch.setAttribute("data-city", cityArr[i]);
        listGroupEl.appendChild(citySearch);
    }
}

var setItems = function(){
    localStorage.setItem("cities", JSON.stringify(cityArr));
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
    tempData.className = "info-content";
    tempData.textContent = `Temperature: ${temperature}°F`;
    cityData.appendChild(tempData);

    //get humidity and display
    var humid = temp.main.humidity;
    var humData = document.createElement("div");
    humData.className = "info-content";
    humData.textContent = `Humidity: ${humid}%`;
    cityData.appendChild(humData);

    //get wind speed and display
    var windSpeed = temp.wind.speed;
    var windData = document.createElement("div");
    windData.className = "info-content";
    windData.textContent = `Wind Speed: ${windSpeed} MPH`;
    cityData.appendChild(windData);
    
    getUVIndex(temp);
    getForecast(temp);
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


clearButton.addEventListener("click", function(){
    cityArr = [];
    setItems();
    listGroupEl.innerHTML = "";
})
listGroupEl.addEventListener("click", buttonClickHandler);
searchEl.addEventListener("submit", searchSubmit);
getItems();