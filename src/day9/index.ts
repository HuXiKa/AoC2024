import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export async function part1(data: string[]) {
    console.log(data)
    const disc = _.range(1, data[0].length + 1).flatMap(i => {
        const l = Number(data[0][i - 1])
        const free = !(i % 2)
        if (free) {
            return [...'.'.repeat(l)]
        } else {
            const n = Math.ceil(i / 2) - 1
            return [..._.range(0, l).map(i => String(n))]
        }
    })
    console.log(disc)
    let go = true
    while (go) {
        const fd = disc.indexOf('.')
        const lc = Number(_.findLastIndex(disc, i => i != '.'))
        //console.log(disc, fd, lc)
        if (fd > lc) {
            go = false
        } else {
            swap(disc, fd, lc)
        }
    }

    console.log(disc)
    console.log(_.sum(disc.map((c, ci) => c == '.' ? 0 : Number(c) * ci)))
}

export function part2(data: string[]) {
    //console.log(data)
    const disc = _.range(1, data[0].length + 1).flatMap(i => {
        const l = Number(data[0][i - 1])
        const free = !(i % 2)
        if (free) {
            return [...'.'.repeat(l)]
        } else {
            const n = Math.ceil(i / 2) - 1
            return [..._.range(0, l).map(i => String(n))]
        }
    })
    const rl = data[0].split('').map((c, ci) => {
        const free = (ci % 2)
        if (free) {
            return [Number(c), '.']
        } else {
            const n = Math.ceil(ci / 2)
            return [Number(c), '' + n]
        }
    })
    console.log(disc)
    let i = 0
    let rle = rl.map(r => {
        const ind = i
        i += (r[0] as number)
        return [ind, ...r]
    }).filter(r => (r[1] as number) != 0)
    let [free, chars] = _.partition(rle, r => r[2] == '.')
    let ci = Number(chars[chars.length - 1][2])
    //prettyprint(rle)
    while (ci > 0) {
        // console.log(rle)
        // console.log(free)
        // console.log(chars)
        const ch = chars.map(c => Number(c[2]) == ci).lastIndexOf(true)
        const nf = free.find(f => (f[1] as number)! >= (chars[ch][1] as number) && (f[0] as number) < (chars[ch][0] as number))!
        //console.log('nf', nf, 'ci', ci, 'ch', ch)
        if (nf) {
            rle = swapRLE2(rle, nf, chars[ch])
            const r = _.partition(rle, r => r[2] == '.')
            free = r[0]
            chars = r[1]
            //prettyprint(rle)
        }
        ci--
        //await new Promise(resolve => setTimeout(resolve, 1000));
    }

    //prettyprint(rle)
    console.log(rle)
    console.log(free)

    const d = rleDecode(rle)
    console.log(d)
    console.log(_.sum(d))
}

function swap(disc: string[], fd: number, lc: number, l = 1) {
    for (let i = 0; i < l; i++) {
        const t = disc[fd + i]
        disc[fd + i] = disc[lc + i]
        disc[lc + i] = t
    }
}

function swapRLE2(rle: (string | number)[][], nf: (string | number)[], ch: (string | number)[]): (string | number)[][] {
    //console.log('swapping', rle, nf, ch)
    const start = rle.indexOf(nf)!
    const movedToFree = [nf[0], ch[1], ch[2]]
    const remainingFree = nf[1] as number - (ch[1] as number) > 0 ? [(nf[0] as number) + (ch[1] as number), nf[1] as number - (ch[1] as number), '.'] : []
    const movedIndex = rle.indexOf(ch)!
    const movedNowFree = [ch[0], ch[1], '.']
    return mergeFree2([...rle.slice(0, start), movedToFree, remainingFree, ...rle.slice(start + 1, movedIndex), movedNowFree, ...rle.slice(movedIndex + 1)].filter(i => i.length > 0))
}

function mergeFree2(rle: (string | number)[][]): (string | number)[][] {
    // console.log('merging\t', rle)
    for (let i = 1; i < rle.length; i++) {
        if (rle[i - 1][2] == '.' && rle[i][2] == '.') {
            rle[i][0] = rle[i - 1][0] as number
            (rle[i][1] as number) += rle[i - 1][1] as number
            rle[i - 1] = []
        }
    }
    // console.log('merged \t', rle)
    return rle.filter(i => i.length > 0)

}

function rleDecode(rle: (string | number)[][]) {
    return rle.flatMap(r => _.times(r[1] as number, f => Number(r[2]))).map((n, ni) => n * ni).filter(i => i > 0)
}

function prettyprint(rle: (string | number)[][]) {
    const f = rle.flatMap(r => _.times(r[1] as number, f => r[2]))
    f.forEach(n => {
        process.stdout.write(`\x1b[3${n == '.' ? 7 : (Number(n) % 6)}m${n}\x1b[0m`)
    })

    process.stdout.write(`\n`)
}

