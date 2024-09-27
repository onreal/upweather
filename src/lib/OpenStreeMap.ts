// @ts-ignore
import { PUBLIC_OSM_URL } from '$env/static/public';
export class OpenStreeMap {
    async getReverseGeocodingData(latitude: number, longitude: number) {
        const url = `${PUBLIC_OSM_URL}?format=json&lat=${latitude}&lon=${longitude}`;
        const response = await fetch(url);
        return await response.json();
    }
}
