import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const height = data.length - 1
    const width = data[0].length - 1

    const directions = [{ c: '<', d: [0, -1] }, { c: '^', d: [-1, 0] }, { c: '>', d: [0, 1] }, { c: 'v', d: [1, 0] }]
    let inBounds = true
    while (inBounds) {
        const current = data.map(l => Array.from(l.matchAll(/\^|\<|v|\>/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))[0]
        //console.log(current)
        //console.log(data.join('\r\n'))
        const c = data[current.r].charAt(current.c)
        const d = directions.find(e => e.c == c)?.d
        if (isInBounds(current.r, d![0], height) && isInBounds(current.c, d![1], width)) {
            const nc = data[current.r + d![0]].charAt(current.c + d![1])
            if (nc != '#') {
                data[current.r] = setCharAt(data[current.r], current.c, 'X')
                data[current.r + d![0]] = setCharAt(data[current.r + d![0]], current.c + d![1], c)
            } else {
                const i = _.findIndex(directions, e => e.c == c) + 1
                data[current.r] = setCharAt(data[current.r], current.c, directions[i == directions.length ? 0 : i].c)
            }
        }
        else {
            data[current.r] = setCharAt(data[current.r], current.c, 'X')
            inBounds = false
        }

    }
    console.log('final map')
    console.log(data.join('\r\n'))
    const visited = data.map(l => Array.from(l.matchAll(/X/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    console.log(visited.length)
}

function setCharAt(str: string, index: number, chr: string) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

function inBounds(r: number, curr: number, height: number): number {
    return Math.min(Math.max(r + curr, 0), height);
}


function isInBounds(r: number, curr: number, height: number): boolean {
    return (r + curr >= 0 && r + curr <= height)
}

export async function part2(data: string[]) {
    const height = data.length - 1
    const width = data[0].length - 1

    const directions = [{ c: '<', d: [0, -1], nc: '←' }, { c: '^', d: [-1, 0], nc: '↑' }, { c: '>', d: [0, 1], nc: '→' }, { c: 'v', d: [1, 0], nc: '↓' }]
    let inBounds = true

    const dataClone = Array.from(data)

    // we only need to check block placements on the path travelled, so lets check that first
    while (inBounds) {
        const current = data.map(l => Array.from(l.matchAll(/\^|\<|v|\>/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))[0]
        //console.log(current)
        //console.log(data.join('\r\n'))
        const c = data[current.r].charAt(current.c)
        const d = directions.find(e => e.c == c)?.d
        if (isInBounds(current.r, d![0], height) && isInBounds(current.c, d![1], width)) {
            const nc = data[current.r + d![0]].charAt(current.c + d![1])
            if (nc != '#') {
                data[current.r] = setCharAt(data[current.r], current.c, 'X')
                data[current.r + d![0]] = setCharAt(data[current.r + d![0]], current.c + d![1], c)
            } else {
                const i = _.findIndex(directions, e => e.c == c) + 1
                data[current.r] = setCharAt(data[current.r], current.c, directions[i == directions.length ? 0 : i].c)
            }
        }
        else {
            data[current.r] = setCharAt(data[current.r], current.c, 'X')
            inBounds = false
        }

    }

    console.log('final map')
    console.log(data.join('\r\n'))
    const visited = data.map(l => Array.from(l.matchAll(/X/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    console.log(visited.length)

    const res = visited.map((v, vi) => {
        const c = dataClone[v.r].charAt(v.c)
        const start = dataClone.map(l => Array.from(l.matchAll(/\^|\<|v|\>/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))[0]
        const sc = dataClone[start.r].charAt(start.c)
        if (c == sc) return false
        else {
            console.log(`checking ${vi} / ${visited.length}`)
            const mapCopy = Array.from(dataClone)
            mapCopy[v.r] = setCharAt(mapCopy[v.r], v.c, '#')
            let inBounds = true
            let loop = false
            let j = 0
            while (inBounds && !loop) {
                j++
                const current = mapCopy.map(l => Array.from(l.matchAll(/\^|\<|v|\>/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))[0]
                //console.log(current)
                const c = mapCopy[current.r].charAt(current.c)
                const d = directions.find(e => e.c == c)!
                const i = _.findIndex(directions, e => e.c == c)
                /*if ((j % 100) == 0) {
                    console.log(d, i, (i + 2) % directions.length, directions[(i + 2) % directions.length].c)
                    console.log(mapCopy.join('\r\n'))
                    console.log('----------------------------------------------------------------------------')
                }*/
                if (isInBounds(current.r, d!.d[0], height) && isInBounds(current.c, d!.d[1], width)) {
                    const nc = mapCopy[current.r + d!.d[0]].charAt(current.c + d!.d[1])
                    if (nc != '#') {
                        const otherDir = directions[(i + 2) % directions.length]
                        if (nc == d!.nc || (nc == otherDir.nc && hitsWall(mapCopy, current, d)) || smallLoop(mapCopy, current, d)) {
                            loop = true
                            console.log("LOOP FOUND")
                            console.log(current)
                            console.log(mapCopy.join('\r\n'))
                        }
                        mapCopy[current.r] = setCharAt(mapCopy[current.r], current.c, d!.nc)
                        mapCopy[current.r + d!.d[0]] = setCharAt(mapCopy[current.r + d!.d[0]], current.c + d!.d[1], d!.c)
                    } else {
                        //console.log(d, i)
                        mapCopy[current.r] = setCharAt(mapCopy[current.r], current.c, directions[i == (directions.length - 1) ? 0 : i + 1].c)
                    }
                }
                else {
                    mapCopy[current.r] = setCharAt(mapCopy[current.r], current.c, d!.nc)
                    inBounds = false
                }

            }
            return loop
        }
    })
    console.log(res.filter(_.identity).length)
}

function hitsWall(mapCopy: string[], current: { r: number; c: number; }, currentDirection: { c: string; d: number[]; nc: string; }): boolean {
    let cp = current
    while (isInBounds(cp.r, currentDirection.d[0], mapCopy.length) && isInBounds(cp.c, currentDirection.d[1], mapCopy[0].length)) {
        const np = { r: inBounds(cp.r, currentDirection.d[0], mapCopy.length), c: inBounds(cp.c, currentDirection.d[1], mapCopy[0].length) }
        const nc = mapCopy[np.r].charAt(np.c)
        if (nc == '#') {
            return true
        } else if (nc == '.') {
            return false
        }
        else {
            cp = np
        }
    }
    return false
}

function smallLoop(mapCopy: string[], current: { r: number; c: number; }, currentDirection: { c: string; d: number[]; nc: string; }): boolean {
    if (!(isInBounds(current.r, currentDirection.d[0] * 2, mapCopy.length - 1) && isInBounds(current.c, currentDirection.d[1] * 2, mapCopy[0].length - 1))) return false
    const np = { r: inBounds(current.r, currentDirection.d[0] * 2, mapCopy.length - 1), c: inBounds(current.c, currentDirection.d[1] * 2, mapCopy[0].length - 1) }
    const nc = mapCopy[np.r].charAt(np.c)

    const map = [
        [[-1, 0], [[-1, -2], [-1, 1], [1, 0]]],
        [[0, 1], [[1, 2], [1, -1], [-1, 0]]],
        [[1, 0], [[1, -2], [-1, -1], [0, 1]]],
        [[0, -1], [[-1, 2], [1, 1], [-1, 0]]]
    ]

    const t = map.find((i: any) => i[0][0] == currentDirection.d[0] && i[0][1] == currentDirection.d[1])![1] as number[][]
    const allBlocked = _.every(t, tp => {
        const np = { r: inBounds(current.r, tp[0], mapCopy.length), c: inBounds(current.c, tp[1], mapCopy[0].length) }
        return mapCopy[np.r].charAt(np.c) == '#'
    })


    if (nc == '#' && allBlocked)
        return true
    else return false
}

