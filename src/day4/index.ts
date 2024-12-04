import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const height = data.length - 1
    const width = data[0].length - 1

    const neightbours = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    const starts = data.map(l => Array.from(l.matchAll(/X/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))

    console.log(starts)

    const res = starts.flatMap(s => {
        const w = neightbours.map(n => {
            return [{ np: s, c: 'X' }, ..._.range(1, 4).map(i => {
                if (isInBounds(s.r!, i * n[0], height) && isInBounds(s.c!, i * n[1], width)) {
                    const np = { r: inBounds(s.r!, i * n[0], height), c: inBounds(s.c!, i * n[1], width) }
                    return { np, c: data[np.r].charAt(np.c) }
                }
                else return undefined
            })]
        })
        //inspect(w)        
        return _.filter(w, w => w.map(x => x?.c).join('') == 'XMAS')
    })

    inspect(res)

    _.range(0, height + 1).map(r => {
        _.range(0, width + 1).map(c => {
            if (res.flat().find(i => i?.np.r == r && i?.np.c == c))
                process.stdout.write(`\x1b[31m${data[r].charAt(c)}\x1b[0m`)
            else
                process.stdout.write(data[r].charAt(c))
        })
        process.stdout.write('\n')
    })

    console.log(res.length)
}

function inBounds(r: number, curr: number, height: number): number {
    return Math.min(Math.max(r + curr, 0), height);
}


function isInBounds(r: number, curr: number, height: number): boolean {
    return (r + curr >= 0 && r + curr <= height)
}

export function part2(data: string[]) {
    const height = data.length - 1
    const width = data[0].length - 1

    const cross = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    const starts = data.map(l => Array.from(l.matchAll(/A/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))

    console.log(starts)
    const r = starts.map(s => {
        return [{ np: s, c: 'A' }, ...cross.map(c => {
            if (isInBounds(s.r!, c[0], height) && isInBounds(s.c!, c[1], width)) {
                const np = { r: inBounds(s.r!, c[0], height), c: inBounds(s.c!, c[1], width) }
                return { np, c: data[np.r].charAt(np.c) }
            }
            else return undefined
        })]
    })
    
    const f = r.filter(i => {
        const s = _.countBy(i, c => c?.c == 'S')['true']
        const m = _.countBy(i, c => c?.c == 'M')['true']
        return s == 2 && m == 2 && (i[1]!.c == i[2]!.c || i[1]!.c == i[3]!.c)
    })

    _.range(0, height + 1).map(r => {
        _.range(0, width + 1).map(c => {
            if (f.flat().find(i => i?.np.r == r && i?.np.c == c))
                process.stdout.write(`\x1b[31m${data[r].charAt(c)}\x1b[0m`)
            else
                process.stdout.write(data[r].charAt(c))
        })
        process.stdout.write('\n')
    })
    console.log(f.length)
}
