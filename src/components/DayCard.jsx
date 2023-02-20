import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
/**
 *
 * @todo
 *@api: http://api.weatherapi.com/v1/forecast.json?key=7559eb05629c4c2aa3c02057222412&q=London&days=7&aqi=no&alerts=yes
 *@one - to add the api to the backend and load the week forecast for 7 days ahead...
 * @Two add social Icons - footer..
 * @Three Deploy
 * @returns
 */

const DayCard = ({ data, imgSrc }) => {
  const [weekdays, setWeekdays] = useState([
    "Mon",
    "Tue",
    "Wen",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);
  useEffect(() => {
    return () => {};
  }, [data]);

  return (
    <div className="overflow-x-auto flex hover:overflow-x-auto">
      {data
        ? data.forecast?.forecastday?.map((day, i) => (
            <div
              key={i}
              className="inline-block min-w-fit rounded-md border-2 border-sky-500 border-solid shadow-lg shadow-cyan-600/50 m-4 max-w-fit p-1 bg-gradient-to-r from-sky-900 to-rose-900"
            >
              <div className="my-1 items-center justify-center flex flex-col m-auto text-center align-middle">
                <p className="font-medium max-w-full text-center text-xs my-1 max-md:text-xs">
                  <p className="my-1 mb-2 text-sm italic capitalize text-gray-100">
                    {!day ? (
                      <ClipLoader
                        color="#363cd6"
                        cssOverride={{}}
                        loading
                        size={10}
                        speedMultiplier={1}
                      />
                    ) : (
                      weekdays[i] + " " + day.date.slice(5)
                    )}
                    {/* {console.log(day)} */}
                  </p>
                  <span className="mx-2 text-sm text-gray-200/80">
                    Min:{" "}
                    {!day ? (
                      <ClipLoader
                        color="#363cd6"
                        cssOverride={{}}
                        loading
                        size={10}
                        speedMultiplier={1}
                      />
                    ) : (
                      day.day.mintemp_c
                    )}{" "}
                    &deg;{" "}
                  </span>
                  <span className="mx-2 text-sm">
                    {!day ? (
                      <ClipLoader
                        color="#363cd6"
                        cssOverride={{}}
                        loading
                        size={10}
                        speedMultiplier={1}
                      />
                    ) : (
                      "Max: " + day.day.maxtemp_c
                    )}
                    &deg;
                  </span>
                </p>
                <p className="text-center text-rose-300 text-sm my-1">
                  {!day ? (
                    <ClipLoader
                      color="#363cd6"
                      cssOverride={{}}
                      loading
                      size={10}
                      speedMultiplier={1}
                    />
                  ) : (
                    day.day.condition.text
                  )}
                </p>
                <img src={day?.day.condition.icon} className="inline"></img>
                <ul className="text-left m-2 p-2">
                  <li>Sunrise: {day?.astro.sunrise}</li>
                  <li>Sunset: {day?.astro.sunset}</li>
                  <li>Chance of Rain: {day?.day.daily_chance_of_rain} %</li>
                  <li>Wind Speed: {day?.day.maxwind_kph} KPH</li>
                </ul>
              </div>
            </div>
          ))
        : "Loading forecast"}
    </div>
  );
};

export default DayCard;
