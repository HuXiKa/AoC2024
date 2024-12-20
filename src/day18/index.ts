import * as _ from "lodash";
import { inspect, readFile } from "../utils"
import { PriorityQueue } from 'priority-queue-typescript';

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

const neigbours = [[0, 1], [-1, 0], [1, 0], [0, -1]]

interface rc { row: number, column: number }
interface rcs { row: number, column: number, path: rcs[], cost: number, edges: rc[], direction: string, visited: boolean[] }

export function part1(data: string[]) {

    const height = 70, width = 70, bytes = 1024

    const start = { row: 0, column: 0 }
    const end = { row: height, column: width }
    console.log('starts', start, 'ends', end)

    const map = _.range(0, height + 1).map(r => _.range(0, width + 1).map(c => '.').join(''))
    _.take(data, bytes).forEach(w => {
        const [c, r] = w.split(",").map(Number)
        map[r] = setCharAt(map[r], c, '#')
    })

    console.log(map)

    const paths = bfs(map, start, end)

    prettyPrint(map, paths[0])
    console.log(paths.length)
    console.log(_.last(paths[0])?.cost)
}

export function part2(data: string[]) {

    const height = 70, width = 70, bytes = 1024

    const start = { row: 0, column: 0 }
    const end = { row: height, column: width }
    console.log('starts', start, 'ends', end)

    const map = _.range(0, height + 1).map(r => _.range(0, width + 1).map(c => '.').join(''))
    _.take(data, bytes).forEach(w => {
        const [c, r] = w.split(",").map(Number)
        map[r] = setCharAt(map[r], c, '#')
    })
   
    const paths = bfs(map, start, end)

    //let fsm = fs.map(p => { return { row: Number(p.split(",")[0]), column: Number(p.split(",")[1]) } })
    //console.log(fs)
    let fsm = paths[0].map(p => { return { row: p.row, column: p.column } })

    let pathExists = true
    let bi = bytes
    while (pathExists) {
        const [c, r] = data[bi].split(",").map(Number)
        console.log(`${bi}/${data.length}`)
        map[r] = setCharAt(map[r], c, '#')
        const contains = fsm.find(i => i.row == r && i.column == c);
        fsm = fsm.filter(i => !(i.row == r && i.column == c));
        pathExists = contains == undefined
        // try to find new path
        if (!pathExists) {
            //console.log(`apparently ${r},${c} is on path, is it? ${JSON.stringify(contains)}`)
            const paths = bfs(map, start, end)

            if (paths.length > 0) {
                //console.log(paths[0].map(p => { return { row: p.row, column: p.column } }))
                //prettyPrint(paths)
                fsm = paths[0].map(p => { return { row: p.row, column: p.column } })
                pathExists = true
                // }
            }
        }
        //prettyPrint(fsm)
        if (pathExists)
            bi++
    }
    console.log(data[bi])
    //prettyPrint(fsm)
}

function notSteep(a: string, b: string) {
    return a != '#' && b != '#'
}

function setCharAt(str: string, index: number, chr: string) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

function prettyPrint(map: string[], path: rc[]): void {
    //inspect(value)
    _.range(0, map.length).map(r => {
        _.range(0, map[0].length).map(c => {
            if (path.find(i => i.row == r && i.column == c))
                process.stdout.write(`\x1b[32mX\x1b[0m`)
            else
                process.stdout.write(map[r].charAt(c))
        })
        process.stdout.write('\n')
    })
    process.stdout.write('\n')
}

function dfs(map: string[], start: rc, end: rc, path: rc[]): rc[][] {

    const nodes = new Set<rc & { edges: rc[] }>()

    map.forEach((row, ri) => {
        Array.from(row).forEach((c, ci) => {
            const dest = neigbours.reduce((acc, curr) => {
                const x = ri + curr[0]
                const y = ci + curr[1]
                if ((x >= 0 && x < map.length) && (y >= 0 && y < row.length) && notSteep(c, map[x][y])) return [...acc, { row: x, column: y }]
                return acc
            }, [] as rc[])
            nodes.add({ row: ri, column: ci, edges: dest })
        })
    })
    const nodesArray = Array.from(nodes).map(n => { return { ...n, visited: [false, false, false, false] } })

    function dfsRec(c: rc, e: rc, path: rc[]): rc[][] {

        if (_.isEqualWith(c, e, (a, b) => a.r == b.r && a.c == b.c)) {
            return [path]
        }
        const n = _.filter(nodesArray, i => c.row == i.row && c.column == i.column)[0]
        const d = n.edges

        return d.flatMap(edge => dfsRec(edge, e, [...path, edge]))
    }

    return dfsRec(start, end, [])

}

function bfs(map: string[], start: rc, end: rc): rcs[][] {
    const directions = [{ c: '<', d: [0, -1] }, { c: '^', d: [-1, 0] }, { c: '>', d: [0, 1] }, { c: 'v', d: [1, 0] }]

    const nodes = new Set<rc & { edges: rc[] }>()

    map.forEach((row, ri) => {
        Array.from(row).forEach((c, ci) => {
            const dest = neigbours.reduce((acc, curr) => {
                const x = ri + curr[0]
                const y = ci + curr[1]
                if ((x >= 0 && x < map.length) && (y >= 0 && y < row.length) && notSteep(c, map[x][y])) return [...acc, { row: x, column: y }]
                return acc
            }, [] as rc[])
            nodes.add({ row: ri, column: ci, edges: dest })
        })
    })
    const nodesArray = Array.from(nodes).map(n => { return { ...n, visited: [false, false, false, false] } })

    //inspect(nodesArray)

    const queue = new PriorityQueue<rcs>(undefined,
        (a: rcs, b: rcs) => a.cost - b.cost
    )

    const paths = []

    let cheapestPath = Number.MAX_SAFE_INTEGER

    const ri = _.filter(nodesArray, i => start.row == i.row && start.column == i.column)[0]!
    const root = { ...ri, path: [], cost: 0, direction: '>', visited: [true, true, true, true] }

    queue.add(root)
    while (queue.size() > 0 && queue.peek()!.cost <= cheapestPath) {
        const n = queue.poll()!
        //console.log(`[${n.row},${n.column}] | ${n.cost} - ${queue.size()}`)
        if (_.isEqualWith(n, end, (a, b) => a.row == b.row && a.column == b.column)) {
            //console.log('end found', n.cost)
            //const dir = directions.find(e => e.d[0] == end.row - n.row && e.d[1] == end.column - n.column)!
            //const c = directions.findIndex(e => e.c == n.direction)
            const fc = n.cost + 1// + 1000 * Math.abs(c - directions.indexOf(dir));
            cheapestPath = fc < cheapestPath ? fc : cheapestPath
            paths.push([...n.path, n])
        } else {
            n.edges.map(edge => _.find(nodesArray, i => edge.row == i.row && edge.column == i.column)!).forEach(edge => {
                const dir = directions.find(d => d.d[0] == edge.row - n.row && d.d[1] == edge.column - n.column)!
                const c = directions.findIndex(d => d.c == n.direction)
                if (!edge.visited[c]) {
                    //console.log(`d - ${JSON.stringify(d)}`)
                    edge.visited[c] = true
                    queue.add({ ...edge, path: [...n.path, n], cost: n.cost + 1/* + 1000 * distance(c, directions.indexOf(dir))*/, direction: dir.c })
                }
            })
        }
    }
    return paths
}

