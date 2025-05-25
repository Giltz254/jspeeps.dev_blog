import { db } from "./db"

export const getUserByEmail = async (email: string) => {
    try {
        const existingUser = await db.user.findUnique({
        where: {
            email
        }
    })
    return existingUser;
    } catch (error) {
        return null;
    }
}
export const getUserById = async (userId: string) => {
    try {
        const existingUser = await db.user.findUnique({
        where: {
            id: userId
        }
    })
    return existingUser;
    } catch (error) {
        return null;
    }
}