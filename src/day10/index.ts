import * as _ from "lodash";
import { inspect, readFile } from "../utils"
import Graph = require("node-dijkstra")

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

const neigbours = [[0, 1], [1, 0], [-1, 0], [0, -1]]

export async function part1(data: string[]) {
    console.log(data)
    const starts = data.map(l => Array.from(l.matchAll(/0/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    const ends = data.map(l => Array.from(l.matchAll(/9/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    console.log(starts, ends)

    const route = new Graph()

    data.forEach((row, ri) => {
        Array.from(row).forEach((c, ci) => {
            const dest = neigbours.reduce((acc, curr) => {
                const x = ri + curr[0]
                const y = ci + curr[1]
                if (x >= 0 && x < data.length && notSteep(c, data[x][ci])) acc[`${data[x][ci]}[${x}][${ci}]`] = 1
                if (y >= 0 && y < row.length && notSteep(c, data[ri][y])) acc[`${data[ri][y]}[${ri}][${y}]`] = 1
                return acc
            }, {} as any)
            //console.log(`adding dest ${JSON.stringify(dest)}`)
            //if (c == '9') console.log(`E[${ri}][${ci}]`)
            //if (c == '0') console.log(`S[${ri}][${ci}]`)
            route.addNode(`${c}[${ri}][${ci}]`, dest)
        })
    })

    const path = starts.flatMap(s => ends.map(e => route.path(`0[${s.r}][${s.c}]`, `9[${e.r}][${e.c}]`) as string[]))
    console.log(path.filter(p => p != null).length)
}

export function part2(data: string[]) {
    console.log(data)
    const starts = data.map(l => Array.from(l.matchAll(/0/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    const ends = data.map(l => Array.from(l.matchAll(/9/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    console.log('starts', starts, 'ends', ends)

    const route = new Graph()

    interface rcchi { r: number, c: number, ch: string }

    const nodes = new Set<rcchi & { d: rcchi[] }>()

    data.forEach((row, ri) => {
        Array.from(row).forEach((c, ci) => {
            const dest = neigbours.reduce((acc, curr) => {
                const x = ri + curr[0]
                const y = ci + curr[1]
                if ((x >= 0 && x < data.length) && (y >= 0 && y < row.length) && notSteep(c, data[x][y])) return [...acc, { r: x, c: y, ch: data[x][y] }]
                return acc
            }, [] as rcchi[])
            nodes.add({ r: ri, c: ci, ch: c, d: dest })
        })
    })

    const nodesArray = Array.from(nodes)
    inspect(nodesArray)

    function dfs(c: { r: number; c: number; }, e: { r: number; c: number; }, path: Omit<rcchi, 'ch'>[]): Omit<rcchi, 'ch'>[][] {
        if (_.isEqualWith(c, e, (a, b) => a.r == b.r && a.c == b.c)) {
            return [path]
        }
        const n = _.filter(nodesArray, i => c.r == i.r && c.c == i.c)[0]
        const d = n.d

        return d.flatMap(d => dfs(d, e, [...path, d]))

    }

    const r = starts.flatMap((s, si) => {
        console.log(`start ${si}/${starts.length}`)
        return ends.flatMap((e, ei) => {
            // console.log(` end ${ei}/${ends.length}`)
            return dfs(s, e, [s])
        })
    })

    inspect(r)
    console.log(r.length)
}

function notSteep(a: string, b: string) {
    return (Number(b) - Number(a)) == 1
}

function prettyPrint(p: string[], data: string[]) {
    const points = p.map(l => Array.from(l.matchAll(/\[\d+\]/g))).map(c => c.map(c => Number(Array.from((c[0] as string).matchAll(/\d+/g))[0][0]))).map(r => { return { r: r[0], c: r[1] } })
    console.log(p, points)
    _.range(0, data.length).map(r => {
        _.range(0, data[0].length).map(c => {
            if (points.find(i => i.r == r && i.c == c))
                process.stdout.write(`\x1b[32m${data[r].charAt(c)}\x1b[0m`)
            else
                process.stdout.write(data[r].charAt(c))
        })
        process.stdout.write('\n')
    })

}
