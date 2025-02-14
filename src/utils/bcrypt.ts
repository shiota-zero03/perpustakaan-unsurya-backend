import bcrypt from 'bcrypt';

const hashedContent = async ( content: string ) => {
    const hashed = await bcrypt.hash(content, 10);
    return hashed;
}

const hashedVerification = async ( content: string, hashed: string ) => {
    const hashedCheck = await bcrypt.compare(content, hashed);
    return hashedCheck;
}

export { hashedContent, hashedVerification }