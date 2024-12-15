import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const input = data.map(l => Array.from(l.matchAll(/[\-]*\d+/g))).map(row => row.map(m => Number(m[0])))
    const height = 103, width = 101, iterations = 100
    //console.log(input)
    const r = input.map(robot => {
        const [c, r, vc, vr] = robot

        const fh = (height + (r + iterations * vr % height)) % height
        const fw = (width + (c + iterations * vc % width)) % width
        const hd = (height - 1) / 2
        const wd = (width - 1) / 2

        const hi = fh < hd ? 0 : (fh > hd ? 2 : -1)
        const wi = fw < wd ? 0 : (fw > wd ? 1 : -1)

        return [fh, fw, (hi == -1 || wi == -1) ? 0 : hi + wi + 1]
    })
    //console.log(r)
    const dist = _.countBy(r.filter(r => r[2] != 0), r => r[2])
    console.log(Object.values(dist).reduce((acc, curr) => acc * curr, 1))
}

export function part2(data: string[]) {
    const input = data.map(l => Array.from(l.matchAll(/[\-]*\d+/g))).map(row => row.map(m => Number(m[0])))
    const height = 103, width = 101, iterations = height * width
    //console.log(input)
    const r = _.range(0, iterations).map(i => {
        const r = input.map(robot => {
            const [c, r, vc, vr] = robot

            const fh = (height + (r + i * vr % height)) % height
            const fw = (width + (c + i * vc % width)) % width
            const hd = (height - 1) / 2
            const wd = (width - 1) / 2

            const hi = fh < hd ? 0 : (fh > hd ? 2 : -1)
            const wi = fw < wd ? 0 : (fw > wd ? 1 : -1)

            return [fh, fw, (hi == -1 || wi == -1) ? 0 : hi + wi + 1]
        })
        return {i, r, s: Object.values(_.countBy(r.filter(r => r[2] != 0), r => r[2])).reduce((acc, curr) => acc * curr, 1)}
    })
    //inspect(r)
    const min = _.minBy(r, 's')!

    _.range(0, height).map(r => {
        _.range(0, width).map(c => {
            if (min.r.find(i => i[0] == r && i[1] == c))
                process.stdout.write(`\x1b[32m#\x1b[0m`)
            else
                process.stdout.write('.')
        })
        process.stdout.write('\n')
    })

    console.log(min)

}