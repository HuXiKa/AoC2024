import * as _ from "lodash";
import { readFile } from "../utils"
import wordsToNumbers from 'words-to-numbers';

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const lines = data[0].match(/mul\(\d+,\d+\)/g)
    const n = lines?.map(l => l.match(/\d+/g)!.map(BigInt))
    console.log(_.sum(n?.map(m => m[0] * m[1])))
}

export function part2(data: string[]) {
    const lines = data[0].match(/^(.*?)don't\(\)|(do\(\))(.*?)don't\(\)|do\(\).*$/g)    
    const vl = lines!.flatMap(l => l.match(/mul\(\d+,\d+\)/g)!)
    const n = vl?.map(l => l.match(/\d+/g)!.map(BigInt))
    console.log(_.sum(n?.map(m => m[0] * m[1])))
}