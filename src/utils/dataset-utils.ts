import { Ant, AntDataset } from "../AntsChart/DatasetModel";
const numberOfAnts = 10;
const randomBetween = (min: number, max: number) => Number((Math.random() * (max - min + 1) + min).toFixed(2))

export function generateDataset (): AntDataset {
   const dataset = Array(numberOfAnts).fill(0).map(_ => ({
    legsLength: randomBetween(10, 20),
    frontLegs: randomBetween(10, 20),
    antennaeLength: randomBetween(10, 15),
    bodySize: randomBetween(10, 12),
    headSize: randomBetween(6, 10),
    backSize: randomBetween(10, 12)
   }) as Ant);
   return dataset;
}