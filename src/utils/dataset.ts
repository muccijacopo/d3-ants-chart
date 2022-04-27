import { Feature, FeatureToVariabile } from "../AntsChart/AntsChart";
import { Ant, AntDataset } from "../AntsChart/DatasetModel";
const numberOfAnts = 10;
const randomBetween = (min: number, max: number) => Number((Math.random() * (max - min + 1) + min).toFixed(2))

export function generateDataset (): AntDataset {
   const dataset = Array(numberOfAnts).fill(0).map(_ => ({
    v1: randomBetween(5, 10),
    v2: randomBetween(5, 10),
    v3: randomBetween(5, 10),
    v4: randomBetween(5, 10),
    v5: randomBetween(5, 10),
    v6: randomBetween(5, 10),
    v7: randomBetween(5, 10)
   }) as Ant);
   return dataset;
}

const KEY_TO_PROPERTY_MAP: { [key: string]: keyof FeatureToVariabile } = {
   "ant-antenna-1": "antennaeLength",
   "ant-antenna-2": "antennaeLength",
   "ant-head": "headSize",
   "ant-body": "bodySize",
   "ant-back": "bodySize",
   "ant-back-leg-1": "legsLength",
   "ant-back-leg-2": "legsLength",
   "ant-middle-leg-1": "legsLength",
   "ant-middle-leg-2": "legsLength",
   "ant-front-leg-1": "legsLength",
   "ant-front-leg-2": "legsLength"
}

export const getPropertyByKey = (key: string) => KEY_TO_PROPERTY_MAP[key];

export function isDatasetValid (dataset: Object)  {
   if (!Array.isArray(dataset)) return false;
   else {
      return dataset.every(e => {
         for (let v of ["v1", "v2", "v3", "v4", "v5", "v6"]) {
            if (typeof(e?.[v]) != 'number') return false;
         }
         return true;
      })
   }
}