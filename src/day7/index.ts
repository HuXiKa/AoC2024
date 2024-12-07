import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const n = data.map(l => l.split(": "))
    const r = n.map(l => {
        const r = Number(l[0])
        const nums = l[1].split(" ")
        return {
            r, op: nums.reduce((acc, curr, i) => {
                if (i == 0) return [[curr]]
                const r = acc.flatMap(a => { return [['(', ...a, '+', curr, ')'], ['(', ...a, '*', curr, ')']] })
                return r
            }, [] as string[][])
        }
    })
    //console.log(r)
    const c = r.map(l => { return { r: l.r, v: l.op.map(l => eval(l.join(''))) } })
    //console.log(c)
    const v = c.filter(i => i.v.includes(i.r))
    console.log(_.sum(v.map(r => r.r)))
}

export async function part2(data: string[]) {   
    const n = data.map(l => l.split(": "))
    const r = n.map((l, li) => {
        const r = Number(l[0])
        const nums = l[1].split(" ")
        console.log('line', li)
        return {
            r, op: nums.reduce((acc, curr, i) => {
                if (i == 0) return [[curr]]
                const r = acc.flatMap(a => { return [['(', ...a, '+', curr, ')'], ['(', ...a, '*', curr, ')'], ['Number(String(', ...[...a, ').concat(' ,curr], '))']] })
                return r
            }, [] as string[][])
        }
    })
    console.log(r)
    const c = r.map((l, li) => {
        console.log('calculate', li)
        return {
            r: l.r, v: l.op.map(l => {
                try {
                    return eval(l.join(''))
                } catch (e) {
                    return -1
                }
            })
        }
    })
    //console.log(c)
    const v = c.filter(i => i.v.includes(i.r))
    console.log(v)
    console.log(_.sum(v.map(r => r.r)))
}

