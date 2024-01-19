import React, { useState, useEffect, createContext, useCallback } from "react";
import axios from "axios";

// import house images
import House1 from "../assets/img/houses/house1.png";
// import House2 from "..house3lg.png";
// import House3 from "..house3lg.png/assets/img/houses/house3.png";
// import House4 from "..house3lg.png/assets/img/houses/house4.png";
// import House5 from "..house3lg.png/assets/img/houses/house5.png";
// import House6 from "..house3lg.png/assets/img/houses/house6.png";
// import House7 from "..house3lg.png/assets/img/houses/house7.png";
// import House8 from "..house3lg.png/assets/img/houses/house8.png";
// import House9 from "..house3lg.png/assets/img/houses/house9.png";
// import House10 from "..house3lg.png/assets/img/houses/house10.png";
// import House11 from "..house3lg.png/assets/img/houses/house11.png";
// import House12 from "..house3lg.png/assets/img/houses/house12.png";
// import house large images
import House1Lg from "../assets/img/houses/house1lg.png";
// import House2Lg from "../assets/img/houses/house2lg.png";
// import House3Lg from "../assets/img/houses/house3lg.png";
// import House4Lg from "../assets/img/houses/house4lg.png";
// import House5Lg from "../assets/img/houses/house5lg.png";
// import House6Lg from "../assets/img/houses/house6lg.png";
// import House7Lg from "../assets/img/houses/house7lg.png";
// import House8Lg from "../assets/img/houses/house8lg.png";
// import House9Lg from "../assets/img/houses/house9lg.png";
// import House10Lg from "../assets/img/houses/house10lg.png";
// import House11Lg from "../assets/img/houses/house11lg.png";
// import House12Lg from "../assets/img/houses/house12lg.png";

// import data
import { housesData } from "../data";

//API url
const housesApi = "http://localhost:3000/houses";

// create context
export const HouseContext = createContext();

const HouseContextProvider = ({ children }) => {
  const [houses, setHouses] = useState(housesData);
  const [country, setCountry] = useState("Location (any)");
  const [countries, setCountries] = useState([]);
  const [property, setProperty] = useState("Property type (any)");
  const [properties, setProperties] = useState([]);
  const [price, setPrice] = useState("Price range (any)");
  const [loading, setLoading] = useState(false);

  //fetch countries from housesApi
  useEffect(() => {
    const getHouses = async () => {
      try {
        const res = await axios.get(housesApi);
        const apiHouses = res.data;
        //transform the response
        apiHouses.map((house) => {
          house.image = House1;
          house.image_lg = House1Lg;
          return house;
        });
        console.log(apiHouses);
        setHouses(apiHouses);
      } catch (e) {
        console.log(e.message);
      }
    };
    getHouses();
  }, []);
  // return all countries
  useEffect(() => {
    const allCountries = houses.map((house) => {
      return house.country;
    });
    // console.log(allCountries);

    // remove duplicates
    const uniqueCountries = ["Location (any)", ...new Set(allCountries)];

    // set countries state
    setCountries(uniqueCountries);
  }, []);

  // return all properties
  useEffect(() => {
    const allProperties = houses.map((house) => {
      return house.type;
    });

    // remove duplicates
    const uniqueProperties = ["Property (any)", ...new Set(allProperties)];

    // set properties state
    setProperties(uniqueProperties);
  }, []);

  const handleClick = () => {
    // set loading
    setLoading(true);
    // console.log(country, property, price);

    // create a function that checks if the string includes '(any)'
    const isDefault = (str) => {
      return str.split(" ").includes("(any)");
    };

    // get first value of price and parse it to number
    const minPrice = parseInt(price.split(" ")[0]);
    // get second value of price which is the maximum price and parse it number
    const maxPrice = parseInt(price.split(" ")[2]);

    const newHouses = housesData.filter((house) => {
      const housePrice = parseInt(house.price);

      // if all values are selected
      if (
        house.country === country &&
        house.type === property &&
        housePrice >= minPrice &&
        housePrice <= maxPrice
      ) {
        return house;
      }

      // if all values are default
      if (isDefault(country) && isDefault(property) && isDefault(price)) {
        return house;
      }

      // if country is not default
      if (!isDefault(country) && isDefault(property) && isDefault(price)) {
        return house.country === country;
      }

      // if property is not default
      if (!isDefault(property) && isDefault(country) && isDefault(price)) {
        return house.type === property;
      }

      // if price is not default
      if (!isDefault(price) && isDefault(country) && isDefault(property)) {
        if (housePrice >= minPrice && housePrice <= maxPrice) {
          return house;
        }
      }

      // if country and property is not default
      if (!isDefault(country) && !isDefault(property) && isDefault(price)) {
        return house.country === country && house.type === property;
      }

      // if country and price is not default
      if (!isDefault(country) && isDefault(property) && !isDefault(price)) {
        if (housePrice >= minPrice && housePrice <= maxPrice) {
          return house.country === country;
        }
      }

      // if property and price is not default
      if (isDefault(country) && !isDefault(property) && !isDefault(price)) {
        if (housePrice >= minPrice && housePrice <= maxPrice) {
          return house.type === property;
        }
      }
    });

    setTimeout(() => {
      return (
        newHouses.length < 1 ? setHouses([]) : setHouses(newHouses),
        setLoading(false)
      );
    }, 1000);
  };

  return (
    <HouseContext.Provider
      value={{
        country,
        setCountry,
        countries,
        property,
        setProperty,
        properties,
        price,
        setPrice,
        houses,
        loading,
        handleClick,
      }}
    >
      {children}
    </HouseContext.Provider>
  );
};

export default HouseContextProvider;
