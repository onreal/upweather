<style lang="scss" global>
  @import '../assets/styles';
</style>

{#if weatherData && locationData}
    <WeatherCanvas
    temperature="{temperature(weatherData.current.temperature2m)}"
    humidity="{weatherData.current.relativeHumidity2m}"
    windSpeed="{weatherData.current.windSpeed10m}"
    windDirection="{weatherData.current.windDirection10m}"
    rainPercentage="{weatherData.current.rain}"
    snowPercentage="{weatherData.current.snowfall}"
    cloudPercentage="{weatherData.current.cloudCover}"
    locationName="{getLocationName()}"
    latitude="{latitude}"
    longitude="{longitude}"
    showControls="{showControls}"
    />
{:else}
    <p>Loading weather data...</p>
{/if}

<script lang="ts" async>
    import {OpenMeteo} from '../lib/OpenMeteo'
    import WeatherCanvas from "./WeatherCanvas.svelte";
    import {onDestroy, onMount} from "svelte";
    import Fa from 'svelte-fa'
    import {
        faTemperatureThreeQuarters,
        faTemperatureQuarter,
        faTemperatureHalf,
        faTemperatureFull,
        faTemperatureEmpty,
        faTemperatureHigh,
        faTemperatureLow
    } from '@fortawesome/free-solid-svg-icons'
    import {OpenStreeMap} from "../lib/OpenStreeMap";

    let weatherData: any = null;
    let locationData: any = null;
    let latitude: string = '';
    let longitude: string = '';
    let backgroundUrl: string = '';
    let showControls: boolean = false;

    const getLatitude = (): number => {
        return Number(latitude === '' || !isValidLatitude(latitude) ? '37.983810' : latitude);
    }

    const getLongitude = (): number => {
        return Number(longitude === '' || !isValidLongitude(longitude) ? '23.727539' : longitude);
    }

    const getLocationName = (): string => {

        const defaultName = 'Venus';

        if (!(locationData.address ?? false)) {
            return defaultName;
        }

        const countryCode = locationData.address.country_code ?? '';
        const country = locationData.address.country ?? '';
        //const state = locationData.address.state ?? '';
        const stateDistrict = locationData.address.state_district ?? '';
        //const city = locationData.address.city ?? '';
        //const municipality = locationData.address.municipality ?? '';
        //const county = locationData.address.county ?? '';
        const suburb = locationData.address.suburb ?? '';
        const village = locationData.address.village ?? '';
        const neighbourhood = locationData.address.neighbourhood ?? '';
        const road = locationData.address.road ?? '';

        return road
            || neighbourhood
            || village
            || suburb
//            || county
//            || municipality
//            || city
            || stateDistrict
//            || state
            || country
            || countryCode
            || defaultName;
    }

    onMount(async () => {
        const params = new URLSearchParams(window.location.search);
        latitude = params.get('lat') || '';
        longitude = params.get('lon') || '';
        backgroundUrl = params.get('bg') || '';
        showControls = params.get('sc') === '1';

        weatherData = await new OpenMeteo().getWeatherData(getLatitude(), getLongitude());
        locationData = await new OpenStreeMap().getReverseGeocodingData(getLatitude(), getLongitude());
    });

    const isValidLatitude = (lat: any): boolean => {
        const latRegex = /^-?([1-8]?[1-9]|[1-9]0)?\.{1}\d{1,14}$/;
        return latRegex.test(lat) && lat >= -90 && lat <= 90;
    }

    const isValidLongitude = (lon: any): boolean => {
        const lonRegex = /^-?([1-9]?[0-9]|[1][0-7][0-9]|180)\.{1}\d{1,14}$/;
        return lonRegex.test(lon) && lon >= -180 && lon <= 180;
    }

    export const temperatureIcon = (temperature: number) => {
        if (temperature < 0) {
            return faTemperatureEmpty
        } else if (temperature < 6) {
            return faTemperatureLow
        } else if (temperature < 12) {
            return faTemperatureQuarter
        } else if (temperature < 20) {
            return faTemperatureHalf
        } else if (temperature < 28) {
            return faTemperatureThreeQuarters
        } else if (temperature < 35) {
            return faTemperatureFull
        } else if (temperature < 50) {
            return faTemperatureHigh
        }
    }

    export const temperature = (temperature: number) => {
        return Number(temperature).toFixed()
    }

    export const temperatureText = (current: object) => {
        return Number(temperature).toFixed()
    }

    export const classPeriod = () => {
        return weatherData.current.isDay ? "weather card-day" : "weather card-night";
    }

</script>
