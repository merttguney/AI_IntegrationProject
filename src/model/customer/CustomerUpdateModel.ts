export interface CustomerUpdate {
    name: string
    surname: string
    birth_date: string
    address_line1: string
    address_line2: string
    addressID?:string
    town: string
    postal_code: string
    username: string
    email?: string
    userID?:string
}