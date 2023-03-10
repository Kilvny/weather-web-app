import React, { useEffect, useState } from "react";
import cities from "cities.json";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import City from "./components/City";
import {
  createBrowserRouter,
  Link,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import DayCard from "./components/DayCard";
import SocialIcons from "./components/SocialIcons";

// react routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppMain />,
  },
  {
    path: "/home",
    element: <AppMain />,
  },
  {
    path: "/weather",
    element: <AppMain />,
  },
  {
    path: "*", // error handeling to redirect user to home when path doesn't exist
    element: <Navigate to={"/"} />,
  },
]);

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
      const res = await fetch(
        `http://localhost:8080/api/weather/forecast/${lat},${lon}`
      );
      const data = await res
        .json()
        .then((data) => {
          setForecast(data);
        })
        .then(() => {
          console.log(forecast);
        });
    }
    getForecast();
    // clean up function to reset the search feild after the user select the desired city
    return () => {
      setInput("");
    };
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
        <SocialIcons />

        
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
