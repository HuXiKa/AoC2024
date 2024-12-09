import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const height = data.length - 1
    const width = data[0].length - 1
    const letters = data.map(l => Array.from(l.matchAll(/[a-zA-Z0-9]/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']!, ch: m[0] } }))
    const groups = _.groupBy(letters, 'ch')
    console.log(letters.length)
    //console.log(groups)
    const r = Object.keys(groups).map(k => {
        const g = groups[k]
        return g.map(v => {
            const o = g.filter(i => i != v)
            return {
                ...g, an: o.flatMap(p => {
                    const dist = [v.r - p.r, v.c - p.c]
                    return [{ r: v.r + dist[0], c: v.c + dist[1] }, { r: p.r - dist[0], c: p.c - dist[1] }]
                })
            }
        })
    })
    //inspect(r)

    const f = _.uniqBy(r.flatMap(g => {
        return g.flatMap(i => {
            return i.an.filter(p => isInBounds(p.r, height) && isInBounds(p.c, width))
        })
    }), i => `${i.r},${i.c}`)

    _.range(0, height + 1).map(r => {
        _.range(0, width + 1).map(c => {
            if (letters.find(i => i.r == r && i.c == c))
                process.stdout.write(`\x1b[32m${data[r].charAt(c)}\x1b[0m`)
            else if (f.flat().find(i => i.r == r && i.c == c))
                process.stdout.write(`\x1b[31m#\x1b[0m`)
            else
                process.stdout.write(data[r].charAt(c))
        })
        process.stdout.write('\n')
    })
    console.log(f.length)
}

export async function part2(data: string[]) {
    const height = data.length - 1
    const width = data[0].length - 1
    const letters = data.map(l => Array.from(l.matchAll(/[a-zA-Z0-9]/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']!, ch: m[0] } }))
    const groups = _.groupBy(letters, 'ch')
    console.log(letters.length)
    //console.log(groups)
    const r = Object.keys(groups).map(k => {
        const g = groups[k]
        return g.map(v => {
            const o = g.filter(i => i != v)
            return {
                ...g, an: o.flatMap(p => {
                    const dist = [v.r - p.r, v.c - p.c]
                    return [..._.range(1, height).map(i => { return { r: v.r + i * dist[0], c: v.c + i * dist[1] } }), ..._.range(1, height).map(i => { return { r: p.r - i * dist[0], c: p.c - i * dist[1] } })]
                })
            }
        })
    })
    //inspect(r)

    const f = _.uniqBy(r.flatMap(g => {
        return g.flatMap(i => {
            return i.an.filter(p => isInBounds(p.r, height) && isInBounds(p.c, width))
        })
    }).filter(i => !_.find(letters, l => l.r == i.r && l.c == i.c)), i => `${i.r},${i.c}`)

    _.range(0, height + 1).map(r => {
        _.range(0, width + 1).map(c => {
            if (letters.find(i => i.r == r && i.c == c))
                process.stdout.write(`\x1b[32m${data[r].charAt(c)}\x1b[0m`)
            else if (f.flat().find(i => i.r == r && i.c == c))
                process.stdout.write(`\x1b[31m#\x1b[0m`)
            else
                process.stdout.write(data[r].charAt(c))
        })
        process.stdout.write('\n')
    })
    console.log(f.length + letters.length)
    
}

function isInBounds(r: number, limit: number): boolean {
    return (r >= 0 && r <= limit)
}