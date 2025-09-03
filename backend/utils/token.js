import jwt from 'jsonwebtoken'

const getToken = async (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expires in 1 hour
        })
        return token
    } catch (error) {
        console.error("Error generating token:", error);
        throw error;
    }
}

export default getToken;