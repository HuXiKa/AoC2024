import * as _ from "lodash";
import { readFile } from "../utils"
import wordsToNumbers from 'words-to-numbers';

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const lines = data.map(l => l.match(/\d+/g)!.map(Number))
    const d = lines.map(line => line.reduce((acc, curr, i) => { return [...acc, curr - line[i - 1]] }, [] as number[]).splice(1))
    const r = d.map(r => {
        const max = _.max(r.map(n => Math.abs(n))) || Number.MAX_SAFE_INTEGER
        const signs = _.uniq(r.map(n => Math.sign(n)))
        if (max > 3) return false
        else if (signs.length > 1) return false
        else return true

    })
    console.log(r.filter(_.identity).length)
}

export function part2(data: string[]) {
    const lines = data.map(l => l.match(/\d+/g)!.map(Number))
    console.log(lines[0], lines[0].length)
    const s = lines.map(l => [l, ..._.range(0, l.length).map(i => {
        const c = Array.from(l)
        return _.filter(c, (v, j, a) => i != j)
    })]).map(lines => lines.map(line => line.reduce((acc, curr, i) => { return [...acc, curr - line[i - 1]] }, [] as number[]).splice(1)))
    console.log(s)
    const r = s.map(a => {
        const b = a.map(
            r => {
                const max = _.max(r.map(n => Math.abs(n))) || Number.MAX_SAFE_INTEGER
                const signs = _.uniq(r.map(n => Math.sign(n)))
                if (max > 3) return false
                else if (signs.length > 1) return false
                else return true
            })
        return _.find(b, _.identity) || false
    })
    console.log(r)
    console.log(r.filter(_.identity).length)
}