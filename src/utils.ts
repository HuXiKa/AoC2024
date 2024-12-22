import * as fs from 'fs';
import * as _ from 'lodash'
import PriorityQueue from 'priority-queue-typescript';
import { inspect as insp } from 'util'

export function readFile(file: string, delim: string = '\r\n') {
    return fs.readFileSync(file)
        .toString('utf8')
        .split(delim);
}

export function indexOfAll<T>(arr: Array<T>, f: (i: T) => boolean) {
    return arr.reduce((acc, el, i) => f(el) ? [...acc, i] : acc, [] as number[])
}

export function inspect(obj: any) {
    console.log(insp(obj, { showHidden: false, depth: null, colors: true }))
}

export const neigbours = [[0, 1], [-1, 0], [1, 0], [0, -1]]
export interface rc { row: number, column: number }
export interface rcs { row: number, column: number, path: rcs[], cost: number, edges: rc[], direction: string, visited: boolean[] }

function notWall(a: string, b: string) {
    return a != '#' && b != '#'
}

export function prettyPrintPathOnMap(map: string[], path: rc[]): void {
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


export function dfs(map: string[], start: rc, end: rc, notSteep: (a: string, b: string) => boolean = notWall): rc[][] {

    const nodes = new Set<rc & { edges: rc[] }>()

    map.forEach((row, ri) => {
        Array.from(row).forEach((c, ci) => {
            const dest = neigbours.reduce((acc, curr) => {
                const x = ri + curr[0]
                const y = ci + curr[1]
                if ((x >= 0 && x < map.length) && (y >= 0 && y < row.length) && notSteep(c, map[x][y])) return [...acc, { row: x, column: y, visited: false }]
                return acc
            }, [] as rc[])
            nodes.add({ row: ri, column: ci, edges: dest })
        })
    })
    const nodesArray = Array.from(nodes).map(n => { return { ...n, visited: false } })

    function dfsRec(c: rc, e: rc, path: rc[]): rc[][] {
        console.log(`${JSON.stringify(c)}, ${path.length}`)
        if (_.isEqualWith(c, e, (a, b) => a.row == b.row && a.column == b.column)) {
            console.log('end')
            return [path]
        }
        const n = _.filter(nodesArray, i => c.row == i.row && c.column == i.column)[0]
        const d = n.edges
        n.visited = true

        return d
        //.filter(e => !_.filter(nodesArray, i => e.row == i.row && e.column == i.column)[0].visited)
        .filter(e => !_.find(path, p => p.row == e.row && p.column == e.column))
        .flatMap(edge => dfsRec(edge, e, [...path, edge]))
    }

    return dfsRec(start, end, [])

}

export function bfs(map: string[], start: rc, end: rc, notSteep: (a: string, b: string) => boolean = notWall): rcs[][] {
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
        console.log(`[${n.row},${n.column}] | ${n.cost} - ${queue.size()}`)
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


