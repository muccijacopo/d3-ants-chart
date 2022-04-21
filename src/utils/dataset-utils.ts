import { Ant, AntDataset } from "../AntsChart/DatasetModel";
const numberOfAnts = 10;
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

export function generateDataset (): AntDataset {
   const dataset = Array(numberOfAnts).fill(0).map(_ => ({
    legsLength: randomBetween(1, 8),
    antennaeLength: randomBetween(10, 20),
    bodySize: randomBetween(6, 20),
    headSize: randomBetween(2, 8),
    backSize: randomBetween(6, 20)
   }) as Ant);
   return dataset;
}