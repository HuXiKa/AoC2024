import * as _ from "lodash";
import { inspect, readFile } from "../utils"
import { PriorityQueue } from 'priority-queue-typescript';
import { Queue } from "elegant-queue";

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

const neigbours = [[0, 1], [-1, 0], [1, 0], [0, -1]]

export function part1(data: string[]) {

    interface rc { row: number, column: number }
    interface rcs { row: number, column: number, path: rcs[], cost: number, edges: rc[], direction: string, visited: boolean[] }

    const start = data.map(l => Array.from(l.matchAll(/S/g))).flatMap((row, ri) => row.map(m => { return { row: ri, column: m['index']! } }))[0]
    const end = data.map(l => Array.from(l.matchAll(/E/g))).flatMap((row, ri) => row.map(m => { return { row: ri, column: m['index']! } }))[0]
    console.log('starts', start, 'ends', end)

    const directions = [{ c: '<', d: [0, -1] }, { c: '^', d: [-1, 0] }, { c: '>', d: [0, 1] }, { c: 'v', d: [1, 0] }]

    const nodes = new Set<rc & { edges: rc[] }>()

    data.forEach((row, ri) => {
        Array.from(row).forEach((c, ci) => {
            const dest = neigbours.reduce((acc, curr) => {
                const x = ri + curr[0]
                const y = ci + curr[1]
                if ((x >= 0 && x < data.length) && (y >= 0 && y < row.length) && notSteep(c, data[x][y])) return [...acc, { row: x, column: y }]
                return acc
            }, [] as rc[])
            nodes.add({ row: ri, column: ci, edges: dest })
        })
    })

    const nodesArray = Array.from(nodes).map(n => { return { ...n, visited: [false, false, false, false] } })

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
            console.log('end found', n.cost)
            const dir = directions.find(e => e.d[0] == end.row - n.row && e.d[1] == end.column - n.column)!
            const c = directions.findIndex(e => e.c == n.direction)
            const fc = n.cost + 1 + 1000 * Math.abs(c - directions.indexOf(dir));
            cheapestPath = fc < cheapestPath ? fc : cheapestPath
            paths.push([...n.path, n])
        } else {
            n.edges.map(edge => _.find(nodesArray, i => edge.row == i.row && edge.column == i.column)!).forEach(edge => {
                const dir = directions.find(d => d.d[0] == edge.row - n.row && d.d[1] == edge.column - n.column)!
                const c = directions.findIndex(d => d.c == n.direction)
                if (!edge.visited[c]) {
                    //console.log(`d - ${JSON.stringify(d)}`)
                    edge.visited[c] = true
                    queue.add({ ...edge, path: [...n.path, n], cost: n.cost + 1 + 1000 * distance(c, directions.indexOf(dir)), direction: dir.c })
                }
            })
        }
    }

    function distance(a: number, b: number) {
        return Math.min((4 + (a - b)) % 4, (4 + (b - a)) % 4)
    }

    prettyPrint(paths[0])
    console.log(paths.length)
    console.log(_.last(paths[0])?.cost)

    function prettyPrint(path: rcs[]): void {
        //inspect(value)
        _.range(0, data.length).map(r => {
            _.range(0, data[0].length).map(c => {
                if (path.find(i => i.row == r && i.column == c))
                    process.stdout.write(`\x1b[32mX\x1b[0m`)
                else
                    process.stdout.write(data[r].charAt(c))
            })
            process.stdout.write('\n')
        })
        process.stdout.write('\n')
    }
}

export function part2(data: string[]) {
    interface rc { row: number, column: number }
    interface rcs { row: number, column: number, path: rcs[], cost: number, edges: rc[], direction: number, visited: boolean[], prev?: rcs }

    const start = data.map(l => Array.from(l.matchAll(/S/g))).flatMap((row, ri) => row.map(m => { return { row: ri, column: m['index']! } }))[0]
    const end = data.map(l => Array.from(l.matchAll(/E/g))).flatMap((row, ri) => row.map(m => { return { row: ri, column: m['index']! } }))[0]
    console.log('starts', start, 'ends', end)

    const directions = [{ c: '<', d: [0, -1] }, { c: '^', d: [-1, 0] }, { c: '>', d: [0, 1] }, { c: 'v', d: [1, 0] }]

    const nodes = new Set<rc & { edges: rc[] }>()

    data.forEach((row, ri) => {
        Array.from(row).forEach((c, ci) => {
            const dest = neigbours.reduce((acc, curr) => {
                const x = ri + curr[0]
                const y = ci + curr[1]
                if ((x >= 0 && x < data.length) && (y >= 0 && y < row.length) && notSteep(c, data[x][y])) return [...acc, { row: x, column: y }]
                return acc
            }, [] as rc[])
            nodes.add({ row: ri, column: ci, edges: dest })
        })
    })

    const nodesArray = Array.from(nodes).map(n => { return { ...n, visited: [false, false, false, false] } })

    const queue = new PriorityQueue<rcs>(undefined,
        (a: rcs, b: rcs) => a.cost - b.cost
    )

    const paths = []
    let cheapestPath = Number.MAX_SAFE_INTEGER

    const ri = _.filter(nodesArray, i => start.row == i.row && start.column == i.column)[0]!
    const root = { ...ri, path: [], cost: 0, direction: 2, visited: [true, true, true, true], prev: undefined }

    const shortestPaths = new Map<string, { p: rc[], c: number }>()    

    queue.add(root)
    while (queue.size() > 0 && queue.peek()!.cost <= cheapestPath) {
        const n = queue.poll()!        
        const key = `${n.prev?.row},${n.prev?.column}-${n.prev?.direction}`
        const shortestPathTo = shortestPaths.get(key)
        if(n.prev != undefined) {
            _.find(nodesArray, i => n.prev!.row == i.row && n.prev!.column == i.column)!.visited[n.direction] = true            
        }
        if (!shortestPathTo) {            
            //console.log(`set ${JSON.stringify(key)}`)
            shortestPaths.set(key, { p: n.path.map(n => { return { row: n.row, column: n.column } }), c: n.cost })
        }
         //console.log(`[${n.row},${n.column}] | ${n.cost} - ${queue.size()} - ${n.direction}`)
        if (_.isEqualWith(n, end, (a, b) => a.row == b.row && a.column == b.column)) {            
            cheapestPath = n.cost
            paths.push({ path: [...n.path, n], cost: n.cost })
             console.log('end', n.cost)
        } else {
            n.edges.map(edge => _.find(nodesArray, i => edge.row == i.row && edge.column == i.column)!).forEach(edge => {
                const dir = directions.findIndex(d => d.d[0] == edge.row - n.row && d.d[1] == edge.column - n.column)!                                
                if (!edge.visited[n.direction] /*&& !n.path.find(e => e.row == edge.row && e.column == edge.column)*/) {
                    //console.log(`d - ${JSON.stringify(edge)}`)                                                            
                    const add = { ...edge, path: [...n.path, n], cost: n.cost + 1 + 1000 * distance(n.direction, dir), direction: dir, prev: n }
                    //console.log(`adding ${add.row},${add.column}`)
                    queue.add(add)
                }
            })
        }
    }
    // inspect(shortestPaths)

    function distance(a: number, b: number) {
        return Math.min((4 + (a - b)) % 4, (4 + (b - a)) % 4)
    }

    function prettyPrint(path: rc[]): void {
        //inspect(value)
        _.range(0, data.length).map(r => {
            _.range(0, data[0].length).map(c => {
                if (path.find(i => i.row == r && i.column == c))
                    process.stdout.write(`\x1b[32mX\x1b[0m`)
                else
                    process.stdout.write(data[r].charAt(c))
            })
            process.stdout.write('\n')
        })
        process.stdout.write('\n')
    }

    const min = _.minBy(paths, 'cost')?.cost
    const minPath = _.uniq(paths.filter(p => p.cost == min).map(path => path.path.map(p => { return { row: p.row, column: p.column } })))
    //console.log(minPath)
    //prettyPrint(minPath[0])
    //console.log(minPath[0].length)
    const res = minPath.flatMap(path => {
        const pq = new Set<string>()
        path.forEach(p => pq.add(`${p.row},${p.column}`))
        const points = new Set<string>()
        while (pq.size > 0) {
            const point = Array.from(pq)[0]
            pq.delete(point)
            if(pq.size % 100 == 0)
                console.log(`${JSON.stringify(point)} - ${pq.size}`)                                
            const pathsToPoint = [0, 1, 2, 3].flatMap(d => shortestPaths.get(`${point}-${d}`))
            const min = _.minBy(pathsToPoint, 'c')?.c
            if(point == `${end.row},${end.column}`) points.add(point)
            if (min != undefined) {
                pathsToPoint.filter(p => p?.c == min).forEach(p => {
                    if (!points.has(point)) {
                        points.add(point)
                        p?.p.forEach(p => pq.add(`${p.row},${p.column}`))
                    }
                })
            }
        }
        return points
    })
    const fs = _.uniq(res.flatMap(p => Array.from(p)))
    prettyPrint(fs.map(p => { return { row: Number(p.split(",")[0]), column: Number(p.split(",")[1]) } }))    
    console.log(fs.length)   
}

function notSteep(a: string, b: string) {
    return a != '#' && b != '#'
}

