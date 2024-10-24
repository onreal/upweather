<style lang="scss" global>
  @import '../assets/styles';
</style>

{#if $weatherData && $locationData}
    <WeatherCanvas
    temperature="{temperature($weatherData?.current?.temperature2m)}"
    humidity="{$weatherData?.current?.relativeHumidity2m}"
    windSpeed="{$weatherData?.current?.windSpeed10m}"
    windDirection="{$weatherData?.current?.windDirection10m}"
    rainPercentage="{$weatherData?.current?.rain}"
    snowPercentage="{$weatherData?.current?.snowfall}"
    cloudPercentage="{$weatherData?.current?.cloudCover}"
    locationName="{getLocationName()}"
    latitude="{latitude}"
    longitude="{longitude}"
    showControls="{showControls}"
    />
{:else}
    <p>Loading weather data...</p>
{/if}

<script lang="ts" async>
    import WeatherCanvas from "./WeatherCanvas.svelte";
    import {
        weatherData,
        locationData,
        latitude,
        longitude,
        getLocationName,
        showControls,
        temperature,
        handle
    } from '../lib/serviceHandler.js';
    import {onMount} from "svelte";
    onMount(handle);

</script>
