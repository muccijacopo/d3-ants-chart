import { Ant, AntDataset } from "../AntsChart/DatasetModel";
const numberOfAnts = 10;
const randomBetween = (min: number, max: number) => Number((Math.random() * (max - min + 1) + min).toFixed(2))

export function generateDataset (): AntDataset {
   const dataset = Array(numberOfAnts+1).fill(0).map(_ => ({
    legsLength: randomBetween(10, 30),
    antennaeLength: randomBetween(10, 30),
    bodySize: randomBetween(10, 12),
    headSize: randomBetween(6, 10),
    backSize: randomBetween(10, 12)
   }) as Ant);
   return dataset;
}