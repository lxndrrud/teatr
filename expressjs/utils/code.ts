const randomInt = () => {
    return Math.floor(Math.random() * 9);
}

export const generateCode = () => {
    return `${randomInt()}${randomInt()}${randomInt()}${randomInt()}${randomInt()}${randomInt()}`
}