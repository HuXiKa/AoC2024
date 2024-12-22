import * as _ from "lodash";
import { bfs, dfs, inspect, neigbours, prettyPrintPathOnMap, rc, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
    const height = data.length - 1
    const width = data[0].length - 1

    const start = data.map(l => Array.from(l.matchAll(/S/g))).flatMap((row, ri) => row.map(m => { return { row: ri, column: m['index']! } }))[0]
    const end = data.map(l => Array.from(l.matchAll(/E/g))).flatMap((row, ri) => row.map(m => { return { row: ri, column: m['index']! } }))[0]
    const map = data

    const path = bfs(map, start, end)[0]
    //prettyPrintPathOnMap(map, path)    
    const res = path.flatMap(p => {
        const dist = p.path.length
        const walls = neigbours.filter(n => isInBounds(p.row, n[0], height) && isInBounds(p.column, n[1], width)).map(n => [p.row + n[0], p.column + n[1]]).filter(n => map[n[0]][n[1]] == '#')
        const validPoints = walls.map(w => neigbours.filter(n => isInBounds(w[0], n[0], height) && isInBounds(w[1], n[1], width)).map(n => [w[0] + n[0], w[1] + n[1]]).filter(n => map[n[0]][n[1]] == '.' || map[n[0]][n[1]] == 'E')).flat()
        const cheats = validPoints.filter(cp => (cp[0] != p.row || cp[1] != p.column) && path.find(o => cp[0] == o.row && cp[1] == o.column)).filter(i => i != undefined)
        const vp = path.filter(p => cheats.find(c => c[0] == p.row && c[1] == p.column))
        //const max = _.maxBy(vp, p => p!.path.length)
        //console.log(`for ${p.row},${p.column} found walls ${walls} - valid points ${validPoints} - cheats ${cheats} for a total of ${vp.length} cheats: ${JSON.stringify(vp.map(p => p!.path.length - dist - 2))}`)// - max ${max?.path.length}`)
        return vp.filter(cp => cp!.path.length + 2 > dist).filter(r => r.path.length - 2 - dist != 0).map(e => { return { ...e, win: e.path.length - 2 - dist } })
    })
    const limit = 1
    const m = _.countBy(res, 'win')
    console.log(_.countBy(res, 'win'))
    console.log(_.sum(Object.keys(m).filter(k => Number(k) >= limit).map(k => m[k])))

}


export function part2(data: string[]) {

    const start = data.map(l => Array.from(l.matchAll(/S/g))).flatMap((row, ri) => row.map(m => { return { row: ri, column: m['index']! } }))[0]
    const end = data.map(l => Array.from(l.matchAll(/E/g))).flatMap((row, ri) => row.map(m => { return { row: ri, column: m['index']! } }))[0]
    const map = data

    const path = bfs(map, start, end)[0]
    //prettyPrintPathOnMap(map, path)    

    const limit = 100

    const cheats = new Set<string>();

    for (let i = 0; i < path.length; i++) {
        const { row, column } = path[i];
    
        for (let j = i + 1; j < path.length; j++) {
          const { row: row2, column: column2 } = path[j];
    
          const cheatSteps = Math.abs(row - row2) + Math.abs(column - column2);
          if (cheatSteps > 20) continue;
    
          const stepsSaved = j - i;
    
          if (stepsSaved >= limit + cheatSteps) {
            cheats.add(`${stepsSaved}-${row},${column},${row2},${column2}`);
          }
        }
      }

      console.log(cheats.size)
}


function isInBounds(r: number, curr: number, height: number): boolean {
    return (r + curr >= 0 && r + curr <= height)
}