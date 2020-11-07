
export interface QueryResult {
    score: number
    location: Dimensions
}

export interface Dimensions {
    x: number,
    y: number,
    width: number,
    height: number
}