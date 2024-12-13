import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {
    const input = data.map(d => d.split("\r\n").map(l => Array.from(l.matchAll(/\d+/g))).flatMap(row => row.map(m => Number(m[0]))))
    const res = input.map(line => {
        const [x1, y1, x2, y2, tx, ty] = line
        const inter = intersect(0,tx/x2, tx/x1,0, 0,ty/y2, ty/y1,0)
        return { line, inter, tx, ty, vx: inter ? inter.x * x1 + inter.y * x2 : -1, vy: inter ? inter.x * y1 + inter.y * y2 : -1 }
    })
    console.log(res.filter(r => r.tx == r.vx && r.ty == r.vy))
    console.log(_.sum(res.filter(r => r.tx == r.vx && r.ty == r.vy).map((r: any) => r.inter.x * 3 + r.inter.y)))
}

export function part2(data: string[]) {
    const input = data.map(d => d.split("\r\n").map(l => Array.from(l.matchAll(/\d+/g))).flatMap(row => row.map(m => Number(m[0]))))
    const res = input.map(line => {
        const [x1, y1, x2, y2, tx, ty] = line
        const btx = tx + 10000000000000
        const bty = ty + 10000000000000
        const inter = intersect(0,btx/x2, btx/x1,0, 0,bty/y2, bty/y1,0)
        return { line, inter, tx: btx, ty: bty, vx: inter ? inter.x * x1 + inter.y * x2 : -1, vy: inter ? inter.x * y1 + inter.y * y2 : -1 }
    })
    console.log(res.filter(r => r.tx == r.vx && r.ty == r.vy))
    console.log(_.sum(res.filter(r => r.tx == r.vx && r.ty == r.vy).map((r: any) => r.inter.x * 3 + r.inter.y)))
}

// https://paulbourke.net/geometry/pointlineplane/javascript.txt

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return { x: Number(x.toFixed(0)), y: Number(y.toFixed(0)) }
}