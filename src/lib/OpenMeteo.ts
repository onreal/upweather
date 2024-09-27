import {fetchWeatherApi} from "openmeteo";

export class OpenMeteo {
    async getWeatherData(latitude: number, longitude: number) {
        const params = {
            latitude,
            longitude,
            "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "rain", "showers", "snowfall", "weather_code", "cloud_cover", "pressure_msl", "surface_pressure", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
            "hourly": ["temperature_2m", "weather_code"],
            "daily": ["weather_code", "precipitation_sum"]
        };
        const url = "https://api.open-meteo.com/v1/forecast";

        // Await the API call
        const responses = await fetchWeatherApi(url, params);

        // Assuming responses[0] contains the relevant data (ensure this matches the actual API response format)
        const response = responses[0];

        // Range function (simplified)
        const range = (start: number, stop: number, step: number) =>
            Array.from({ length: Math.floor((stop - start) / step) }, (_, i) => start + i * step);

        // Create weather data object
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const current = response.current()!;
        const hourly = response.hourly()!;
        const daily = response.daily()!;

        return {
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature2m: current.variables(0)!.value(),
                relativeHumidity2m: current.variables(1)!.value(),
                apparentTemperature: current.variables(2)!.value(),
                isDay: current.variables(3)!.value(),
                precipitation: current.variables(4)!.value(),
                rain: current.variables(5)!.value(),
                showers: current.variables(6)!.value(),
                snowfall: current.variables(7)!.value(),
                weatherCode: current.variables(8)!.value(),
                cloudCover: current.variables(9)!.value(),
                pressureMsl: current.variables(10)!.value(),
                surfacePressure: current.variables(11)!.value(),
                windSpeed10m: current.variables(12)!.value(),
                windDirection10m: current.variables(13)!.value(),
                windGusts10m: current.variables(14)!.value(),
            },
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables(0)!.valuesArray()!,
                weatherCode: hourly.variables(1)!.valuesArray()!,
            },
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                weatherCode: daily.variables(0)!.valuesArray()!,
                precipitationSum: daily.variables(1)!.valuesArray()!,
            },
        };
    }
}
