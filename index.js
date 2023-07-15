//const appid = 'a8b9da681ae75c37075ca0a1b40e94ea';
const appid = '58b6f7c78582bffab3936dac99c31b25';

const city = document.querySelector(".location .city");
const selectCity = document.querySelector("#select-location");
const time = document.querySelector(".current-time");
const iconDesc = document.querySelector(".icon-desc");
const temperature = document.querySelector(".temperature");
const mainWeather = document.querySelector(".main-desc");
const descWeather = document.querySelector(".sub-desc");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility");

function renderCurrentData(data) {
  selectCity.innerText = data.name + " - " + data.sys.country;
  let dt = new Date().toString().split(' ');
  time.innerText = dt[4].substring(0, 5);
  iconDesc.innerHTML = `<img
    class="city-icon"  
    src=${`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} 
    alt=${data.weather[0].description} 
  />`
  temperature.innerText = Math.round(data.main.temp - 273.15);
  mainWeather.innerText = data.weather[0].main;
  descWeather.innerText = data.weather[0].description;
  humidity.innerText = data.main.humidity + " %";
  wind.innerText = Math.round(data.wind.speed * 3.6) + " km/h";
  visibility.innerText = Math.round(data.visibility / 1000) + " km";
}

navigator.geolocation.getCurrentPosition(showCurrentWeather);
async function showCurrentWeather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  let URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}`;
  try {
    let data = await fetch(URL).then(res => res.json());
    if (data.cod == 200) {
      city.innerText = data.name;
      renderCurrentData(data);
    } 
  } catch (error) {
    console.log(error);
  };
}

const forecastWeather = document.querySelector(".weather-forecast");
function renderForecastData(data) {
  let forecast = [];
  let length = data.list.length;
  for (let i = 1; i < length; i++) {
    let time = new Date(data.list[i].dt * 1000);
    forecast.push({
      date: time.toString().split(' ')[0] + " " + time.toLocaleDateString(),
      desc: data.list[i].weather[0].main,
      icon: data.list[i].weather[0].icon,
      description: data.list[i].weather[0].description,
      tempmax: Math.round(data.list[i].temp.max - 273.15),
      tempmin: Math.round(data.list[i].temp.min - 273.15)
    });
  }

  function doForecast() {
    let length = forecast.length;
    let newTag = "";
    for (let i = 0; i < length; i++) {
      newTag += `<div class='block-forecast'>
      <p class='dt-forecast'>${forecast[i].date}</p>
      <div class="desc-forecast">
        <div class="main-forecast">
          <p>${forecast[i].desc}</p>
          <img class="icon-forecast"
            src=${`https://openweathermap.org/img/wn/${forecast[i].icon}@2x.png`} 
            alt=${forecast[i].description} 
          />
        </div>
        <div class="temp-forecast">
          <p>${forecast[i].tempmax}<sup>&deg</sup></p>
          <p>${forecast[i].tempmin}<sup>&deg</sup></p>
        </div>
      </div>

    </div>`;
    }
    forecastWeather.innerHTML = newTag;
  }
  doForecast();
}

navigator.geolocation.getCurrentPosition(showForecastWeather);
async function showForecastWeather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  let URL = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=8&&appid=${appid}`;
  try {
    let data = await fetch(URL).then(res => res.json());
    if (data.cod == 200) {
      renderForecastData(data);
    }
  } catch (error) {
    console.log(error);
  };
}
//
const hourlyForecast = document.querySelector(".hourly-forecast");
function renderHourlyForecast(data) {
  let forecast = [];
  let length = data.list.length;
  for (let i = 1; i < length; i++) {
    let dt = new Date(data.list[i].dt * 1000).toString().split(' ');
    forecast.push({
      date: dt[4].substring(0, 5),
      desc: data.list[i].weather[0].main,
      icon: data.list[i].weather[0].icon,
      temp: Math.round(data.list[i].main.temp - 273.15)
    });
  }

  function doForecast() {
    let length = forecast.length;
    let newTag = "";
    for (let i = 0; i < length; i++) {
      newTag += `<div class='block-hourly'>
                  <div class="block-weather">
                  <img class="icon-hourly"
                    src=${`https://openweathermap.org/img/wn/${forecast[i].icon}@2x.png`} 
                    alt=${forecast[i].description} 
                  />
                  <p>${forecast[i].temp}<sup>&deg</sup></p>
                  <p class="desc-hourly">${forecast[i].desc}</p>
                  </div>
                  <div class="block-time">
                    <p>${forecast[i].date}</p>
                  </div>
                </div>`;

    }
    hourlyForecast.innerHTML = newTag;
  }
  doForecast();
}

navigator.geolocation.getCurrentPosition(showHourlyForecast);
async function showHourlyForecast(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  let URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=10&&appid=${appid}`;
  try {
    let data = await fetch(URL).then(res => res.json());
    if (data.cod == 200) {
      renderHourlyForecast(data);
    }
  } catch (error) {
    console.log(error);
  };
}
//
const inputBox = document.querySelector(".inputField input");
const addLocation = document.querySelector(".inputField button");
const locationList = document.querySelector(".location-list");

inputBox.onkeyup = () => {
  let userEnteredValue = inputBox.value;
  if (userEnteredValue.trim() != 0) {
    addLocation.classList.add("active");
  } else {
    addLocation.classList.remove("active");
  }
}

showLocations();

async function fetchWeather() {
  let userEnteredValue = inputBox.value;
  let URL = `https://api.openweathermap.org/data/2.5/weather?q=${userEnteredValue}&appid=${appid}`
  try {
    let data = await fetch(URL).then(res => res.json());
    if (data.cod == 200) {
      renderCurrentData(data);
      let getLocalStorageData = localStorage.getItem("Locations");
      if (getLocalStorageData == null) {
        listArray = [];
      } else {
        listArray = JSON.parse(getLocalStorageData);
      }
      listArray.push(userEnteredValue);
      localStorage.setItem("Locations", JSON.stringify(listArray));
      showLocations();
      addLocation.classList.remove("active");
    } else {
      alert(data.message);
      inputBox.value = "";
    }
  } catch (error) {
    console.log(error);
  };
}

async function fetchForecast() {
  let userEnteredValue = inputBox.value;
  let URL = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${userEnteredValue}&cnt=8&&appid=${appid}`;
  try {
    let data = await fetch(URL).then(res => res.json());
    if (data.cod == 200) {
      renderForecastData(data)
    }
  } catch (error) {
    console.log(error);
  };
  let URL2 = `https://api.openweathermap.org/data/2.5/forecast?q=${userEnteredValue}&cnt=10&&appid=${appid}`;
  try {
    let data2 = await fetch(URL2).then(res => res.json());
    if (data2.cod == 200) {
      renderHourlyForecast(data2);
    }
  } catch (error) {
    console.log(error);
  };
}

addLocation.onclick = async () => {
  fetchWeather();
  fetchForecast();
}

inputBox.addEventListener('keypress', (e) => {
  if (e.code == 'Enter') {
    fetchWeather();
    fetchForecast();
  }
})

function showLocations() {
  let getLocalStorageData = localStorage.getItem("Locations");
  if (getLocalStorageData == null) {
    listArray = [];
  } else {
    listArray = JSON.parse(getLocalStorageData);
  }
  let newLiTag = "";
  listArray.forEach((element, index) => {
    newLiTag += `<li onclick="getWeather(${index})">${element}
                  <span class="icon" onclick="deleteLoaction(${index})">
                    <i class="fa-solid fa-trash"></i>
                  </span>
                </li>`;
  });
  locationList.innerHTML = newLiTag;
  inputBox.value = "";
}

async function getWeather(index) {
  let getLocalStorageData = localStorage.getItem("Locations");
  listArray = JSON.parse(getLocalStorageData);
  let location = listArray[index];
  let URL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&cnt=10&&appid=${appid}`;
  try {
    let data = await fetch(URL).then(res => res.json());
    if (data.cod == 200) {
      renderHourlyForecast(data);
    }
  } catch (error) {
    console.log(error);
  };
  let URL1 = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${appid}`
  try {
    let data1 = await fetch(URL1).then(res => res.json());
    if (data1.cod == 200) {
      renderCurrentData(data1);
    }
  } catch (error) {
    console.log(error);
  };
  let URL2 = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${location}&cnt=8&&appid=${appid}`;
  try {
    let data2 = await fetch(URL2).then(res => res.json());
    if (data2.cod == 200) {
      renderForecastData(data2)
    }
  } catch (error) {
    console.log(error);
  };

}

function deleteLoaction(index) {
  event.stopPropagation();
  let getLocalStorageData = localStorage.getItem("Locations");
  listArray = JSON.parse(getLocalStorageData);
  listArray.splice(index, 1);
  localStorage.setItem("Locations", JSON.stringify(listArray));
  showLocations();
  navigator.geolocation.getCurrentPosition(showCurrentWeather);
  navigator.geolocation.getCurrentPosition(showForecastWeather);
  navigator.geolocation.getCurrentPosition(showHourlyForecast);
}

function currentWeather() {
  navigator.geolocation.getCurrentPosition(showCurrentWeather);
  navigator.geolocation.getCurrentPosition(showForecastWeather);
  navigator.geolocation.getCurrentPosition(showHourlyForecast);
}

// Beforeinstallprompt
let installPrompt = null;
const installButton = document.querySelector(".install-btn");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.removeAttribute("hidden");
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    return;
  }
  const result = await installPrompt.prompt();
  console.log(`Install prompt was: ${result.outcome}`);
  installPrompt = null;
  installButton.setAttribute("hidden", "");
});