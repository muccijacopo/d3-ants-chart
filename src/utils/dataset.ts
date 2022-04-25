import { Ant, AntDataset } from "../AntsChart/DatasetModel";
const numberOfAnts = 10;
const randomBetween = (min: number, max: number) => Number((Math.random() * (max - min + 1) + min).toFixed(2))

export function generateDataset (): AntDataset {
   const dataset = Array(numberOfAnts).fill(0).map(_ => ({
    legsLength: randomBetween(10, 20),
    middleLegsLength: randomBetween(8, 18),
    frontLegsLength: randomBetween(10, 20),
    antennaeLength: randomBetween(10, 15),
    bodySize: randomBetween(10, 12),
    headSize: randomBetween(6, 10),
    backSize: randomBetween(10, 12)
   }) as Ant);
   return dataset;
}

const KEY_TO_PROPERTY_MAP: { [key: string]: keyof Ant } = {
   "ant-antenna-1": "antennaeLength",
   "ant-antenna-2": "antennaeLength",
   "ant-body": "bodySize",
   "ant-leg-1": "legsLength",
   "ant-leg-2": "legsLength",
   "ant-back": "backSize",
   "ant-head": "headSize",
   "ant-middle-leg-1": "middleLegsLength",
   "ant-middle-leg-2": "middleLegsLength",
   "ant-front-leg-1": "frontLegsLength",
   "ant-front-leg-2": "frontLegsLength"
}

export const getPropertyByKey = (key: string) => KEY_TO_PROPERTY_MAP[key];