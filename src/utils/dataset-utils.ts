import { Ant, AntDataset } from "../AntsChart/DatasetModel";

const MIN = 1;
const MAX = window.innerWidth;
const N = 30;

const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

export function generateDataset (): AntDataset {
   const dataset = Array(N).fill(0).map(_ => ({
    legsLength: randomBetween(MIN, MAX),
    antennaeLength: randomBetween(MIN, MAX),
    bodySize: randomBetween(MIN, MAX),
   }) as Ant);
   return dataset;
}