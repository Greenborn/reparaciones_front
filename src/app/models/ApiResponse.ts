export interface ApiSerializedResponse<T> {
    "items": T[],
    "_links": {
        "self": {
            "href": string
        },
        "first": {
            "href": string
        },
        "last": {
            "href": string
        }
    },
    "_meta": {
        "totalCount": number,
        "pageCount": number,
        "currentPage": number,
        "perPage": number
    }
}

