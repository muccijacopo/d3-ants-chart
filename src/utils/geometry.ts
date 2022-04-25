export const getFinalX = (x: number, d: number, degree: number) => x + d * Math.cos(degree);
export const getFinalY = (y: number, d: number, degree: number) => y + d * Math.sin(degree);