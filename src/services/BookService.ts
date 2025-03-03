export default class BookService {
    request = async (url: string, method: string = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            return await response.json();
        } catch(e) {
            console.log('error', e)
            throw e;
        }
    }
}