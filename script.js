const buttonElt = document.getElementsByTagName('button')
const searchBar = document.querySelector(".search-bar")
const notification = document.querySelector(".notification")

if ('geolocation' in navigator){
    notification.style.display = "none";
    navigator.geolocation.getCurrentPosition(fetchCurrPosition, showError);
}
else{
    alert("Browser Does not support geolocation");   
}

function fetchCurrPosition(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    weather.fetchWeatherUsingCoords(lat, long);
}

function showError(error){
    notification.innerHTML = `<p> ${error.message} </p>`;
}


let weather = {
    "apikey": "d20e29746fc39fa95f271640527b8db4",

    fetchWeatherUsingCity: function(city){
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" 
        + city  
        + "&units=metric&appid="  
        + this.apikey
        )
        .then((response) => {
            if (!response.ok){
                alert("No weather found.");
                throw new Error("No weather found");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data, false))
    },

    fetchWeatherUsingCoords: function(lat, long) {
        fetch("https://api.openweathermap.org/data/2.5/weather?lat="
        + lat
        + "&lon="
        + long
        + "&appid="
        + this.apikey
        )
        .then((response) => {
            if (!response.ok){
                alert("No weather found.");
                throw new Error("No weather found");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data, true))
    },

    displayWeather: function(data, ifCoord){
        const { name } = data;
        const { icon, description } = data.weather[0];
        var { temp, humidity } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerHTML = "Weather in " + name;
        document.querySelector(".icon").src = 
        "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerHTML = this.capitalize(description);
        if (ifCoord)
            temp = Math.floor(temp - 273);
        else
            temp = Math.floor(temp);
        document.querySelector(".temp").innerHTML = temp + "°C";
        document.querySelector(".humidity").innerHTML = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerHTML = "Wind speed: " + speed + " km/h"
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = 
            "url('https://source.unsplash.com/1920x1080/?" + description + "')";
    },

    search: function(){
        var element = document.querySelector(".search-bar").value;
        this.fetchWeatherUsingCity(element);
    },

    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};


for (let index = 0; index < buttonElt.length; index++) {
    buttonElt[index].addEventListener('click', function() {
        weather.search();
    });
}

searchBar.addEventListener('keyup', function(event) {
    if (event.key === "Enter"){
        weather.search();
    }
});

