const form = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const weatherData = document.getElementById('weather-data');
const searchHistory = document.getElementById('search-history');

const apiKey = "5b8b6375a78cc74beb5d30d67cfc40ab";
const baseApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';



// Event listener for search history item click
searchHistory.addEventListener('click', function(event) {
  if (event.target.classList.contains('search-item')) {
    const city = event.target.getAttribute('data-city');
    getWeather(city);
  }
});

// Function to get weather data for a city
function getWeather(city) {
  const apiUrl = `${baseApiUrl}?q=${city}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayWeatherData(data);
      // addToSearchHistory(city);
    })
    .catch(error => {
      console.log(error);
      weatherData.innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
    });
}


// Function to display weather data
function displayWeatherData(data) {
  weatherData.innerHTML = '';

  // Current weather
  const currentWeather = data.list[0];
  const currentDate = new Date(currentWeather.dt * 1000);
  const currentIcon = currentWeather.weather[0].icon;
  const currentTemp = Math.round(currentWeather.main.temp - 273.15);
  const currentHumidity = currentWeather.main.humidity;
  const currentWindSpeed = currentWeather.wind.speed;

  const currentWeatherHtml = `
    <h2>Current Weather</h2>
    <p>City: ${data.city.name}</p>
    <p>Date: ${currentDate.toLocaleDateString()}</p>
    <img src="https://openweathermap.org/img/wn/${currentIcon}.png" alt="Weather Icon">
    <p>Temperature: ${currentTemp}°C</p>
    <p>Humidity: ${currentHumidity}%</p>
    <p>Wind Speed: ${currentWindSpeed} m/s</p>
  `;
  weatherData.innerHTML += currentWeatherHtml;

  // 5-day forecast
  const forecastList = data.list.slice(1, 6); // Extract the next 5 days from the forecast data

  const forecastWeatherHtml = `
    <h2>5-Day Forecast</h2>
    <div class="forecast-container">
      ${forecastList.map((forecast) => {
        const forecastDate = new Date(forecast.dt * 1000);
        const forecastIcon = forecast.weather[0].icon;
        const forecastTemp = Math.round(forecast.main.temp - 273.15);
        return `
          <div class="forecast-item">
            <p>Date: ${forecastDate.toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${forecastIcon}.png" alt="Weather Icon">
            <p>Temperature: ${forecastTemp}°C</p>
          </div>
        `;
      }).join('')}
    </div>
  `;
  weatherData.innerHTML += forecastWeatherHtml;
}




function addToSearchHistory(city) {
  const searchItem = document.createElement("li");
  searchItem.classList.add("search-item");
  searchItem.textContent = city;
  searchItem.setAttribute("data-city", city);
  searchHistory.appendChild(searchItem);
}



// Event listener for form submission
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    cityInput.value = '';
    addToSearchHistory(city);
  }
});