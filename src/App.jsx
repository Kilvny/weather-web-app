import React, { useEffect, useState } from "react";
import cities from "cities.json";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import City from "./components/City";
import { createBrowserRouter, Link, Navigate, RouterProvider } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import DayCard from "./components/DayCard";



// react routes
const router = createBrowserRouter([
    {
        path: '/',
        element: <AppMain />
    },
    {
        path: '/home',
        element: <AppMain />
    },
    {
        path: '/weather',
        element: <AppMain />
    },
    {
        path: '*', // error handeling to redirect user to home when path doesn't exist
        element: <Navigate to={'/'} />
    }
])

function AppMain() {
  const [data, setData] = useState();
  const [imgSrc, setImgSrc] = useState();
  const [forecast, setForecast] = useState();
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState([]);
  const [acity, setCity] = useState({
    country: "AD",
    name: "Sant Julià de Lòria",
    lat: "42.46372",
    lng: "1.49129",
  });

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  function onSearch(city) {
    setCity(city);
    setInput(city.name);
    setLat(city.lat);
    setLon(city.lng);
  }

  useEffect(() => {
    let searched = cities.filter((city) => {
      return (
        input &&
        (city.name.search(input) !== -1 ||
          city.name.search(toTitleCase(input)) !== -1)
      );
    });

    console.log(searched);
    setSelected(searched);
  }, [input]);

  useEffect(() => {
    async function getISSLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          console.log(position.coords.latitude, position.coords.longitude);
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const dataGeo = await { latitude, longitude };
          // await setQuery(dataGeo)
          // await console.log(`query is ${query}`)
          // sending the info to the server using POST request method
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataGeo),
          };

          const mydata = await fetch("http://localhost:8080/api", options); //send the data
          const json = await mydata.json(); // fetch the response back
          console.log(json); // console.log the response that was sent from the server
          setLat(json.lat);
          setLon(json.lon);
        });
      } else {
        console.log("geo location not available");
      }
    }

    input === "" && getISSLocation();
    async function fetchData() {
      // I need to send the query for user's lat and long with the request to get the current location of the user weather data
      console.log(`lat is ${lat} and lon is ${lon}`);
      const res = await fetch(
        `http://localhost:8080/api/weather/${lat},${lon}`
      );
      const data = await res.json().then((data) => {
        setData(data);
        setImgSrc(data.current.condition.icon);
      });
    }
    fetchData();
    async function getForecast() {
        const res = await fetch(`http://localhost:8080/api/weather/forecast/${lat},${lon}`)
        const data = await res.json()
            .then((data) => { setForecast(data) })
            .then(()=>{console.log(forecast)})
    }
    getForecast()
    // clean up function to reset the search feild after the user select the desired city
    return (()=>{
        setInput('');
    })
  }, [lat, lon]);

  return (
    <body
      className={`bg-[url('space.jpg')] text-amber-100 max-w-full min-h-fit min-w-fit`}
    >
      {/* {console.log()} */}
      <div className="flex flex-col justify-center items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="border border-none bg-inherit text-white max-sm w-1/2 text-center rounded-md mt-4 focus:outline-gray-700 focus:border-gray-700/50 outline-0 "
          placeholder="Search with city name"
        ></input>
        <div
          className={`bg-white text-black flex flex-col border-gray-700 border-soild border-2 empty:border-none min-w-fit opacity-90 rounded divide-y divide-cyan-700`}
        >
          {cities
            .filter((city) => {
              const searchTerm = input.toLowerCase();
              const cityName = city.name.toLowerCase();

              return (
                searchTerm &&
                cityName.startsWith(searchTerm) &&
                cityName !== acity.name.toLowerCase()
              );
            })
            .slice(0, 10)
            .map((city, i) => (
              <div
                className="cursor-pointer text-start my-0.5 mx-1 font-sans opacity-75"
                key={i}
                onClick={() => onSearch(city)}
              >
                {city.name}, {city.country}
              </div>
            ))}
          {/* {selected !== [] && selected.map((item) => (
                        <div className="cursor-pointer text-start my-0.5" key={item.lat} onClick={()=>onSearch(item)}>{item.name}</div>
                    ))} */}
        </div>
        <div className="my-20 items-center justify-center flex-col m-auto text-center inline-block align-middle">
          <p className="text-blue-500 font-medium max-w-full text-center text-6xl my-1 max-md:text-3xl">
            Temprature is :{" "}
            {!data ? (
              <ClipLoader
                color="#363cd6"
                cssOverride={{}}
                loading
                size={100}
                speedMultiplier={1}
              />
            ) : (
              data.current.temp_c
            )}{" "}
            &deg; {!data ? "" : `at ${data.location.name}.`}
          </p>
          <p className="text-center text-gray-500 text-3xl my-10">
            {!data ? "" : data.current.condition.text}
          </p>
          <img src={imgSrc} className="inline"></img>
        </div>

        {/* week forecast */}
        <DayCard data={forecast} imgSrc={imgSrc} />

        {/* social Icons */}
        <div className="mt-4 inset-x-0 top-0 flex items-center">
          {/* github */}
          <Link to={"https://github.com/kilvny"} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-brand-github"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#00abfb"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
            </svg>
          </Link>
          {/* linkedin */}
          <Link to={"https://www.linkedin.com/in/kilvny/"} target={"_blank"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-brand-linkedin"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#00abfb"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <line x1="8" y1="11" x2="8" y2="16" />
              <line x1="8" y1="8" x2="8" y2="8.01" />
              <line x1="12" y1="16" x2="12" y2="11" />
              <path d="M16 16v-3a2 2 0 0 0 -4 0" />
            </svg>
          </Link>
          {/* Instagram */}
          <Link to={"https://www.instagram.com/kilanyishere/"} target={"_blank"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-brand-instagram"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#00abfb"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <rect x="4" y="4" width="16" height="16" rx="4" />
              <circle cx="12" cy="12" r="3" />
              <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" />
            </svg>
          </Link>
        </div>
      </div>
    </body>
  );
}



function App() {
    return (
      <RouterProvider
        router={router}
        fallbackElement={
          <ClipLoader
            color="#363cd6"
            cssOverride={{}}
            loading
            size={100}
            speedMultiplier={1}
          />
        }
      />
    );
}

export default App;