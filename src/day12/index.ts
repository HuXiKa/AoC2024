import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export async function part1(data: string[]) {
    const height = data.length - 1
    const width = data[0].length - 1
    interface rcchi { r: number, c: number, ch: string }
    const neightbours = [[-1, 0], [0, -1], [0, 1], [1, 0]]

    const plants = data.map(l => Array.from(l.matchAll(/[A-Z]/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']!, ch: data[ri][m['index']!] } }))
    //inspect(plants)

    const maps = plants.reduce((acc, p) => {
        const has = acc.map(a => a[p.r][p.c]).includes(true)
        if (acc.length > 0 && has) {
            return acc
        }

        let fillMap: boolean[][] = Array.from(new Array((height + 1)), () => new Array((width + 1)).fill(false))
        const fill = [[p.r, p.c]]
        fillMap[p.r][p.c] = true

        while (fill.length > 0) {
            let [i, j] = fill.shift()!
            neightbours.filter(n => isInBounds(i, n[0], height) && isInBounds(j, n[1], width)).map(n => { return { r: inBounds(i, n[0], height), c: inBounds(j, n[1], width) } }).filter(np => data[p.r][p.c] == data[np.r][np.c]).forEach(n => {
                if (!fillMap[n.r][n.c]) {
                    fillMap[n.r][n.c] = true
                    fill.push([n.r, n.c])
                }
            })
        }

        return [...acc, fillMap]
    }, [] as boolean[][][])

    //inspect(maps)

    const r = maps.map(m => {
        let a = 0
        let p = 0
        for (let i = 0; i < m.length; i++) {
            for (let j = 0; j < m[0].length; j++) {
                if (m[i][j]) {
                    a++
                    const c = neightbours.map(n => !isInBounds(i, n[0], height) || !isInBounds(j, n[1], width) || m[inBounds(i, n[0], height)][inBounds(j, n[1], width)] == false).filter(_.identity).length || 0
                    p += c
                }
            }
        }
        return { m, a, p }
    })
    //inspect(r)
    console.log(_.sum(r.map(r => r.a * r.p)))
}

export function part2(data: string[]) {
    const height = data.length - 1
    const width = data[0].length - 1
    interface rcchi { r: number, c: number, ch: string }
    const neightbours = [[-1, 0], [0, 1], [1, 0], [0, -1]]

    const plants = data.map(l => Array.from(l.matchAll(/[A-Z]/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']!, ch: data[ri][m['index']!] } }))
    //inspect(plants)

    const maps = plants.reduce((acc, p) => {
        const has = acc.map(a => a[p.r][p.c]).includes(true)
        if (acc.length > 0 && has) {
            return acc
        }

        let fillMap: boolean[][] = Array.from(new Array((height + 1)), () => new Array((width + 1)).fill(false))
        const fill = [[p.r, p.c]]
        fillMap[p.r][p.c] = true

        while (fill.length > 0) {
            let [i, j] = fill.shift()!
            neightbours.filter(n => isInBounds(i, n[0], height) && isInBounds(j, n[1], width)).map(n => { return { r: inBounds(i, n[0], height), c: inBounds(j, n[1], width) } }).filter(np => data[p.r][p.c] == data[np.r][np.c]).forEach(n => {
                if (!fillMap[n.r][n.c]) {
                    fillMap[n.r][n.c] = true
                    fill.push([n.r, n.c])
                }
            })
        }

        return [...acc, fillMap]
    }, [] as boolean[][][])

    //inspect(maps)

    const possibleCorners = [[-1, -1], [-1, 1], [1, 1], [1, -1]]
    const ncl = new Map([
        [
            '-1,0', [
                [-1, -1],
                [-1, 1]
            ]
        ],
        [
            '0,1', [
                [-1, 1],
                [1, 1]
            ]
        ],
        [
            '1,0', [
                [1, -1],
                [1, 1]
            ]
        ],
        [
            '0,-1', [
                [1, -1],
                [-1, -1]
            ]
        ]
    ])

    inspect(ncl)

    function corners(m: boolean[][], i: number, j: number) {
        const nr = neightbours.flatMap(n => {
            const b = isInBounds(i, n[0], height) && isInBounds(j, n[1], width)
            const np = [inBounds(i, n[0], height), inBounds(j, n[1], width)]
            const r = b ? m[np[0]][np[1]] : b
            return { n, r }
        })
        function innercross(i: number, k: number, n: number[], r: string[]): boolean {
            const b = m[inBounds(i, n[0], height)][inBounds(j, n[1], width)] == true
            //const [n1, n2] = n.map(n => r.split(',').map(Number))
            const o = [[0, n[1]], [n[0], 0]].map(c => m[i + c[0]][k + c[1]])
            return b && _.every(o, o => o == false)
        }
        const r = _.countBy(nr.filter(r => r.r == true).flatMap(r => ncl.get(r.n.join(','))!))
        const r2 = Object.entries(r).filter(([k, v]) => v % 2).map(([k, v]) => k)
        const d = _.differenceWith(possibleCorners, r2, (a, b) => a.join(',') == b).filter(n => !isInBounds(i, n[0], height) || !isInBounds(j, n[1], width) || innercross(i, j, n, r2) || m[inBounds(i, n[0], height)][inBounds(j, n[1], width)] == false)
        //console.log(i, j, 'nr', nr, 'r', r, 'r2', r2, 'd', d)
        return d.length
    }

    const r = maps.map(m => {
        let a = 0
        let p = 0
        let s = 0
        for (let i = 0; i < m.length; i++) {
            for (let j = 0; j < m[0].length; j++) {
                if (m[i][j]) {
                    a++
                    const c = neightbours.map(n => !isInBounds(i, n[0], height) || !isInBounds(j, n[1], width) || m[inBounds(i, n[0], height)][inBounds(j, n[1], width)] == false).filter(_.identity).length || 0
                    p += c
                    const n = corners(m, i, j)
                    s += n
                }
            }
        }
        return { m, a, p, s }
    })
    //inspect(r)
    console.log(_.sum(r.map(r => r.a * r.s)))
}

function inBounds(r: number, curr: number, height: number): number {
    return Math.min(Math.max(r + curr, 0), height);
}


function isInBounds(r: number, curr: number, height: number): boolean {
    return (r + curr >= 0 && r + curr <= height)
}