
export const getSlidingAverage = (arr: number[], windowSize: number) => {
    return arr.map((_, index) => {
        const start = Math.max(0, index - windowSize);
        const end = index + 1;
        const subset = arr.slice(start, end);
        const sum = subset.reduce((a, b) => a + b);
        return sum / subset.length;
    });
}