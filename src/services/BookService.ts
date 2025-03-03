export default class BookService {
    getResource = async (url: string) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllBooks = async (url: string) => {
        const books = await this.getResource(url);

        return books;
    }

}