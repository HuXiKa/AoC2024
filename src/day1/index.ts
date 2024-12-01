import * as _ from "lodash";
import { readFile } from "../utils"
import wordsToNumbers from 'words-to-numbers';

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {    
    const lines = data.map(l => l.match(/\d+/g)!.map(Number))
    const [a, b] = [lines.map(x => x[0]), lines.map(x => x[1])]
    const r = _.zip(a.sort((a, b) => a - b), b.sort((a, b) => a - b))

    console.log(_.sum(r.map(([x,y]) => Math.abs(x! - y!))))
}

export function part2(data: string[]) {
    const lines = data.map(l => l.match(/\d+/g)!.map(Number))
    const [a, b] = [lines.map(x => x[0]), lines.map(x => x[1])]

    console.log(_.sum(a.map(n => n * (_.countBy(b)[n] || 0))))
}