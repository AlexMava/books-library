export type BookId = string | number;

export type Book =     {
    "id": BookId;
    "title": string;
    "category": string;
    "author": string;
    "ISBN": number;
    "created": string;
    "modified": string;
    "status": string;
}