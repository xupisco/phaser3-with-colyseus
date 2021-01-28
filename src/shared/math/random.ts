export const randomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    
    // >= min
    // < max
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default randomInt;
