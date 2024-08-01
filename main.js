let globalDataWeather;
const degreeNow = document.querySelector("#deg-now");
let iconDegreeNow = document.querySelector("#icon-tem-now");
const conditionText = document.querySelector("#condition-text");
const lowTempNow = document.querySelector("#low-temp-day");
const highTempNow = document.querySelector("#high-temp-day");
const humidity = document.querySelector("#humidity-percentigy");
const Visibility = document.querySelector("#Visibility");
const ChanOfRain = document.querySelector("#ChanOfRain-percentigy");
const Precipitation = document.querySelector("#Precipitation");
const wind_direction = document.querySelector("#wind-dir");
const wind_speed = document.querySelector("#wind-speed");
const needle = document.querySelector(".needle");
const containerOfWeekDays = document.querySelector("#scroll-container");
const searchInput = document.querySelector("#search_input");
const searchButton = document.querySelector("#search_button");
const headerLocation = document.querySelector("#head-location");
const navBar = document.querySelector("#wrapper");

function ShowData() {
  degreeNow.innerHTML = globalDataWeather.current.temp_c + `<sup>°</sup>`;
  iconDegreeNow.setAttribute(
    "src",
    `https:` + globalDataWeather.current.condition.icon
  );
  conditionText.innerHTML = globalDataWeather.current.condition.text;

  highTempNow.innerHTML =
    globalDataWeather.forecast.forecastday[0].day.maxtemp_c;

  lowTempNow.innerHTML =
    globalDataWeather.forecast.forecastday[0].day.mintemp_c;

  wind_speed.innerHTML = globalDataWeather.current.wind_mph;

  wind_direction.innerHTML = globalDataWeather.current.wind_dir;

  humidity.innerHTML = globalDataWeather.current.humidity + `%`;

  Precipitation.innerHTML =
    globalDataWeather.forecast.forecastday[0].day.totalprecip_mm + "mm";

  ChanOfRain.innerHTML =
    globalDataWeather.forecast.forecastday[0].day.daily_chance_of_rain + "%";

  let vis = globalDataWeather.forecast.forecastday[0].day.avgvis_km;

  let windDir = globalDataWeather.current.wind_dir;

  switch (true) {
    case vis > 10:
      Visibility.innerHTML = "Good";
      break;
    case vis >= 5 && vis <= 10:
      Visibility.innerHTML = "Moderate";
      break;
    case vis >= 1 && vis < 5:
      Visibility.innerHTML = "Poor";
      break;

    default:
      Visibility.innerHTML = "Very Poor";
      break;
  }
  const windDirections = {
    NNW: "WN-dir",
    NW: "WN-dir",
    WNW: "WN-dir",
    WSW: "SW-dir",
    SW: "SW-dir",
    SSW: "SW-dir",
    SSE: "SE-dir",
    SE: "SE-dir",
    ESE: "SE-dir",
    ENE: "NE-dir",
    NE: "NE-dir",
    NNE: "NE-dir",
    S: "S-dir",
    N: "N-dir",
    E: "E-dir",
    W: "W-dir",
  };

  needle.className = `needle ${windDirections[windDir] || "d-none"}`;
  var store = "";
  for (let i = 1; i < globalDataWeather.forecast.forecastday.length; i++) {
    let date = new Date(globalDataWeather.forecast.forecastday[i].date);
    let daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    daysOfWeek = daysOfWeek[date.getDay()].slice(0, 3);
    store += `  <div class="col-md-3 item">
                  <div class="cardContainer">
                    <div class="card">
                      <p class="day text-uppercase">${daysOfWeek}</p>
                      <p class="weather">${globalDataWeather.forecast.forecastday[i].day.condition.text}</p>
                      <svg
                        class="weather"
                        version="1.1"
                        id="Layer_1"
                        x="0px"
                        y="0px"
                        width="50px"
                        height="50px"
                        viewBox="0 0 100 100"
                        xml:space="preserve"
                      >
                        <image
                          id="image0"
                          width="100"
                          height="100"
                          x="0"
                          y="0"
                          href=https:${globalDataWeather.current.condition.icon}
                        ></image>
                      </svg>
                      <p class="temp">${globalDataWeather.forecast.forecastday[i].day.maxtemp_c}°</p>
                      <div class="minmaxContainer fs-5">
                        <div class="min">
                          <p class="minHeading">Min</p>
                          <p class="minTemp">${globalDataWeather.forecast.forecastday[i].day.mintemp_c}°</p>
                        </div>
                        <div class="max">
                          <p class="maxHeading">Max</p>
                          <p class="maxTemp">${globalDataWeather.forecast.forecastday[i].day.maxtemp_c}°</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> `;
  }
  containerOfWeekDays.innerHTML = store;
}
// Show the loading screen
function showLoading() {
  document.getElementById("loading-screen").style.display = "flex";
}

// Hide the loading screen
function hideLoading() {
  document.getElementById("loading-screen").style.display = "none";
}

// Modified function to get weather data
async function getWeatherData(town) {
  showLoading(); // Show loading screen
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=c43aa45df8344b9ca4b204407242507&q=${town}&days=7`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok" + response.statusText);
    }
    response = await response.json();
    globalDataWeather = response;
    ShowData();
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  } finally {
    hideLoading(); // Hide loading screen
  }
}

// Modified IIFE to include loading screen
(function () {
  function getLocation() {
    showLoading(); // Show loading screen
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      document.getElementById("location-country").innerHTML =
        "Geolocation is not supported by this browser.";
      hideLoading(); // Hide loading screen
    }
  }

  function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    getPlaceNames(latitude, longitude);
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        document.getElementById("location-country").innerHTML =
          "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        document.getElementById("location-country").innerHTML =
          "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        document.getElementById("location-country").innerHTML =
          "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        document.getElementById("location-country").innerHTML =
          "An unknown error occurred.";
        break;
    }
    hideLoading(); // Hide loading screen
  }

  function getPlaceNames(latitude, longitude) {
    var url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;

    fetch(url)
      .then(async (response) => await response.json())
      .then((data) => {
        var town =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.hamlet;
        var country = data.address.country;

        if (town && country) {
          getCapitalCity(country, town);
        } else {
          document.getElementById("location-country").innerHTML =
            "Unable to determine town or country.";
          hideLoading(); // Hide loading screen
        }
      })
      .catch((error) => {
        document.getElementById("location-country").innerHTML =
          "Unable to retrieve place names.";
        console.error("Error:", error);
        hideLoading(); // Hide loading screen
      });
  }

  async function getCapitalCity(country, town) {
    var url = `https://restcountries.com/v3.1/name/${country}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        var countryInfo = data[0];
        if (countryInfo && countryInfo.capital) {
          var capital = countryInfo.capital[0];
          document.getElementById("location-country").innerHTML = country;
          document.getElementById("location-town").innerHTML = town;
          getWeatherData(town);
        } else {
          document.getElementById("location-country").innerHTML =
            "Town: " + town + "<br>Unable to determine the capital city.";
          hideLoading(); // Hide loading screen
        }
      })
      .catch((error) => {
        document.getElementById("location-country").innerHTML =
          "Unable to retrieve capital city.";
        console.error("Error:", error);
        hideLoading(); // Hide loading screen
      });
  }

  // Invoke the function to get the location
  getLocation();
})();

//toggle
document.getElementById("menu-toggle").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("wrapper").classList.toggle("toggled");
});

function closeNav() {
  document.getElementById("wrapper").classList.remove("toggled");
}

const scrollContainer = document.getElementById("scroll-container");
const scrollRightButton = document.getElementById("scroll-right");

const scrollAmount = 200; // Adjust this value for the desired scroll amount

scrollRightButton.addEventListener("click", () => {
  scrollContainer.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });
});

// Touch scrolling functionality
let isDown = false;
let startX;
let scrollLeft;

scrollContainer.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
});

scrollContainer.addEventListener("mouseleave", () => {
  isDown = false;
});

scrollContainer.addEventListener("mouseup", () => {
  isDown = false;
});

scrollContainer.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 3; // Scroll-fast
  scrollContainer.scrollLeft = scrollLeft - walk;
});

scrollContainer.addEventListener("touchstart", (e) => {
  isDown = true;
  startX = e.touches[0].pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
});

scrollContainer.addEventListener("touchend", () => {
  isDown = false;
});

scrollContainer.addEventListener("touchmove", (e) => {
  if (!isDown) return;
  const x = e.touches[0].pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 3; // Scroll-fast
  scrollContainer.scrollLeft = scrollLeft - walk;
});
searchButton.addEventListener("click", function () {
  searchForSpecificPlace();
});
function searchForSpecificPlace(){
  var searchValue = searchInput.value.toLowerCase();
  searchInput.value='';
  closeNav();
  getWeatherData(searchValue);
  headerLocation.innerHTML = ` <h2 id="location-country" class="fs-1 fw-semibold text-uppercase">${searchValue}
            </h2>`;
}
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchForSpecificPlace();
  }
});
document.addEventListener("click", function (event) {
  if (!wrapper.contains(event.target) && wrapper.classList.contains("toggled")) {
    wrapper.classList.remove("toggled");
  }
});
