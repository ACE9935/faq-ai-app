export interface User {
    id: number,
    firstName: string,
    lastName: string,
    profilePicture: string,
    phoneNumber: string,
    companyName: string,
    email: string,
    verified: boolean,
    subscribed: boolean,
    history: string[]
}