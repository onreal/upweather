import {
    weatherData,
    locationData,
    latitude,
    longitude,
    getLocationName,
    serverHandle
} from '../../../lib/serviceHandler.js';

// Function to handle the server request
export const handleServer = async (url: string) => {
    await serverHandle(url);
};

// Function to get the JSON data reactively
export const getJsonData = async () => {
    let currentWeather;
    let currentLocation;

    // Subscribe to the weather data store
    weatherData.subscribe(data => {
        currentWeather = data;
    });

    // Subscribe to the location data store
    locationData.subscribe(data => {
        currentLocation = data;
    });

    return {
        temperature: currentWeather?.current?.temperature2m,
        humidity: currentWeather?.current?.relativeHumidity2m,
        windSpeed: currentWeather?.current?.windSpeed10m,
        windDirection: currentWeather?.current?.windDirection10m,
        rainPercentage: currentWeather?.current?.rain,
        snowPercentage: currentWeather?.current?.snowfall,
        cloudPercentage: currentWeather?.current?.cloudCover,
        locationName: getLocationName(),
        latitude,
        longitude
    };
};
