import { Ant, AntDataset } from "../AntsChart/DatasetModel";

const MIN = 1;
const MAX = window.innerWidth;
const N = 20;



const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

export function generateDataset (): AntDataset {
   const dataset = Array(N).fill(0).map(_ => ({
    legsLength: randomBetween(1, 8),
    antennaeLength: randomBetween(10, 20),
    bodySize: randomBetween(3, 10),
    headSize: randomBetween(2, 10)
   }) as Ant);
   return dataset;
}