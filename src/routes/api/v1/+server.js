import {handleServer, getJsonData} from './weatherAndLocationData';
// @ts-ignore
export async function GET({ url }) {
    await handleServer(url.search);
    const response = await getJsonData();
    return new Response(JSON.stringify(response), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
