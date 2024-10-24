import {
    faTemperatureThreeQuarters,
    faTemperatureQuarter,
    faTemperatureHalf,
    faTemperatureFull,
    faTemperatureEmpty,
    faTemperatureHigh,
    faTemperatureLow
} from '@fortawesome/free-solid-svg-icons';
import {OpenMeteo} from "./OpenMeteo";
import {OpenStreeMap} from "./OpenStreeMap";
import { writable, get } from 'svelte/store';


export const weatherData = writable(null);
export const locationData = writable(null);
export let latitude: string = '';
export let longitude: string = '';
export let backgroundUrl: string = '';
export let showControls: boolean = false;
export const getWeatherData = (): any => {
    return get(weatherData);
};

export const getLocationData = (): any => {
    return get(locationData);
};

export const getLatitude = (): number => {
    return Number(latitude === '' || !isValidLatitude(latitude) ? '37.983810' : latitude);
};

export const getLongitude = (): number => {
    return Number(longitude === '' || !isValidLongitude(longitude) ? '23.727539' : longitude);
};

export const getLocationName = (): string => {
    const defaultName = 'Venus';

    if (!(getLocationData()?.address ?? false)) {
        return defaultName;
    }

    const countryCode = getLocationData().address.country_code ?? '';
    const country = getLocationData().address.country ?? '';
    const stateDistrict = getLocationData().address.state_district ?? '';
    const suburb = getLocationData().address.suburb ?? '';
    const village = getLocationData().address.village ?? '';
    const neighbourhood = getLocationData().address.neighbourhood ?? '';
    const road = getLocationData().address.road ?? '';

    return road || neighbourhood || village || suburb || stateDistrict || country || countryCode || defaultName;
};

export const isValidLatitude = (lat: any): boolean => {
    const latRegex = /^-?([1-8]?[1-9]|[1-9]0)?\.{1}\d{1,14}$/;
    return latRegex.test(lat) && lat >= -90 && lat <= 90;
};

export const isValidLongitude = (lon: any): boolean => {
    const lonRegex = /^-?([1-9]?[0-9]|[1][0-7][0-9]|180)\.{1}\d{1,14}$/;
    return lonRegex.test(lon) && lon >= -180 && lon <= 180;
};

export const temperatureIcon = (temperature: number) => {
    if (temperature < 0) {
        return faTemperatureEmpty;
    } else if (temperature < 6) {
        return faTemperatureLow;
    } else if (temperature < 12) {
        return faTemperatureQuarter;
    } else if (temperature < 20) {
        return faTemperatureHalf;
    } else if (temperature < 28) {
        return faTemperatureThreeQuarters;
    } else if (temperature < 35) {
        return faTemperatureFull;
    } else if (temperature < 50) {
        return faTemperatureHigh;
    }
};

export const temperature = (temperature: number) => {
    return Number(temperature).toFixed();
};

export const temperatureText = (current: object) => {
    return Number(temperature).toFixed();
};

export const classPeriod = () => {
    return getWeatherData()?.current?.isDay ? "weather card-day" : "weather card-night";
};

export const handle = async () => {
    const params = new URLSearchParams(window.location.search);
    await handleParams(params);
};

export const serverHandle = async (url: string) => {
    const params = new URLSearchParams(url);
    await handleParams(params);
};

export const handleParams = async (params: URLSearchParams) => {
    latitude = params.get('lat') || '';
    longitude = params.get('lon') || '';
    backgroundUrl = params.get('bg') || '';
    showControls = params.get('sc') === '1';
    const weatherResponse = await new OpenMeteo().getWeatherData(getLatitude(), getLongitude());
    const locationResponse = await new OpenStreeMap().getReverseGeocodingData(getLatitude(), getLongitude());

    // @ts-ignore
    weatherData.set(weatherResponse);
    locationData.set(locationResponse);
    console.log(getWeatherData());
};
