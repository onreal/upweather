export class OpenStreeMap {
    async getReverseGeocodingData(latitude: number, longitude: number) {
        const url = `${import.meta.env.VITE_OSM_URL}?format=json&lat=${latitude}&lon=${longitude}`;
        const response = await fetch(url);
        return await response.json();
    }
}
