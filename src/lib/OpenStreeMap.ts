export class OpenStreeMap {
    async getReverseGeocodingData(latitude: number, longitude: number) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const response = await fetch(url);
        return await response.json();
    }
}
