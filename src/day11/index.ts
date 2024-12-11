import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export async function part1(data: string[]) {
    const nums = data[0].split(' ').map(n => { return { n, c: 1 } })
    const res = _.range(0, 25).reduce((acc, curr) => {
        return merge(acc.flatMap(n => {
            if (n.n == '0') return [{ n: '1', c: n.c }]
            else if (!(n.n.length % 2)) {
                const m = n.n.length / 2
                return [{ n: n.n.substring(0, m), c: n.c }, { n: Number(n.n.substring(m)).toString(), c: n.c }]
            } else {
                return [{ n: String(Number(n.n) * 2024), c: n.c }]
            }
        }))
    }, nums)
    console.log(res)
    console.log(_.sum(res.map(c => c.c)))
}

export function part2(data: string[]) {
    const nums = data[0].split(' ').map(n => { return { n, c: 1 } })
    const res = _.range(0, 75).reduce((acc, curr) => {
        return merge(acc.flatMap(n => {
            if (n.n == '0') return [{ n: '1', c: n.c }]
            else if (!(n.n.length % 2)) {
                const m = n.n.length / 2
                return [{ n: n.n.substring(0, m), c: n.c }, { n: Number(n.n.substring(m)).toString(), c: n.c }]
            } else {
                return [{ n: String(Number(n.n) * 2024), c: n.c }]
            }
        }))
    }, nums)
    console.log(res)
    console.log(_.sum(res.map(c => c.c)))
}

function merge(nums: { n: string; c: number; }[]): { n: string; c: number; }[] {
    const map = _.groupBy(nums, 'n')
    return Object.keys(map).flatMap(k => {
        const n = map[k]
        return { n: k, c: _.sum(n.map(n => n.c)) }
    })
}
