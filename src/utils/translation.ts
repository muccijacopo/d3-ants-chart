import { Feature } from "../AntsChart/AntsChart";

const TRANSLATION: { [key: string]: string } = {
    headSize: "Head size",
    bodySize: "Body size",
    antennaeLength: "Antennae length",
    legsLength: "Legs length"
}

export const translateProperty = (prop: string) => TRANSLATION[prop]; 