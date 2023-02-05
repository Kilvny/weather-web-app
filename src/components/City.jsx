import React, { useEffect, useState } from "react";
import cities from "cities.json"


const City = ({ city }) => {
  const [data, setData] = useState();
  const [imgSrc, setImgSrc] = useState();
  // const [query, setQuery] = useState({ latitude:0,longitude:0 })
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState({});

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  useEffect(() => {
    let searched = cities.filter((city) => {
      return (
        city.name.search(input) !== -1 ||
        city.name.search(toTitleCase(input)) !== -1
      );
    });

    console.log(searched);
  }, [input]);

  useEffect(() => {
    async function getISSLocation() {
      const dataGeo = {
        latitude: city.lat,
        longitude: city.lng,
      };
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
    }

    getISSLocation();
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
  }, [lat, lon]);

  return (
    <body className="bg-black text-amber-100 max-w-full w-screen h-screen">
      <div className="flex flex-col justify-center items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="border border-none bg-black text-white max-sm w-1/2 text-center rounded-sm mt-4 focus:outline-gray-700 focus:border-gray-700 outline-0 "
          placeholder="Search with city name"
        ></input>
        <div className="my-40 items-center justify-center flex-col m-auto text-center inline-block align-middle">
          <p className="text-blue-500 font-medium max-w-full text-center text-6xl my-1 max-md:text-3xl">
            Temprature is : {!data ? "Loading..." : data.current.temp_c} &deg;{" "}
            {!data ? "" : `at ${data.location.name}.`}
          </p>
          <p className="text-center text-gray-500 text-3xl my-10">
            {!data ? "" : data.current.condition.text}
          </p>
          <img src={imgSrc} className="inline"></img>
        </div>
      </div>
    </body>
  );
};

export default City;
