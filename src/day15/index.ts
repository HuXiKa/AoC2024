import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {
    const [mapString, moves] = data
    console.log(mapString)
    const map = mapString.split('\r\n');
    // const walls = map.map(l => Array.from(l.matchAll(/#/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    // const boxes = map.map(l => Array.from(l.matchAll(/O/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    const robot = map.map(l => Array.from(l.matchAll(/@/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))[0]
    // console.log(walls, boxes, robot)

    const height = map.length - 1
    const width = map[0].length - 1
    const directions = [{ c: '<', d: [0, -1] }, { c: '^', d: [-1, 0] }, { c: '>', d: [0, 1] }, { c: 'v', d: [1, 0] }]

    moves.split('\r\n').join('').split('').forEach(m => {
        const d = directions.find(e => e.c == m)?.d
        if (isInBounds(robot.r, d![0], height) && isInBounds(robot.c, d![1], width)) {
            const np = { r: inBounds(robot.r, d![0], height), c: inBounds(robot.c, d![1], width) }
            const nc = map[np.r].charAt(np.c)
            if (nc == '#') {
                // console.log('hit a wall', m, d, robot)
            } else if (nc == 'O') {
                // console.log('hit box', m, d, robot)
                let endCord = [np.r, np.c]
                let endChar = map[endCord[0]].charAt(endCord[1])
                while (endChar == 'O' && isInBounds(endCord[0], 0, height) && isInBounds(endCord[1], 0, width)) {
                    endCord = [endCord[0] + d![0], endCord[1] + d![1]]
                    endChar = map[endCord[0]].charAt(endCord[1])
                }

                if (endChar != '#') {
                    map[endCord[0]] = setCharAt(map[endCord[0]], endCord[1], 'O')
                    map[robot.r] = setCharAt(map[robot.r], robot.c, '.')
                    robot.r = np.r
                    robot.c = np.c
                    map[robot.r] = setCharAt(map[robot.r], robot.c, '@')
                }
            } else {
                // console.log('empty space', m, d, robot)
                map[robot.r] = setCharAt(map[robot.r], robot.c, '.')
                robot.r = np.r
                robot.c = np.c
                map[robot.r] = setCharAt(map[robot.r], robot.c, '@')
            }
            //console.log(map.join('\r\n'))
        }
    })
    console.log(map.join('\r\n'))

    const boxes = map.map(l => Array.from(l.matchAll(/O/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    console.log(_.sum(boxes.map(b => b.r * 100 + b.c)))
}

export function part2(data: string[]) {
    const [mapString, moves] = data
    const smallMap = mapString.split('\r\n');
    const map = smallMap.map(l => {
        return l.split('').map(c => {
            if (c == '#') {
                return '##'
            } else if (c == 'O') {
                return '[]'
            } else if (c == '.') {
                return '..'
            } else {
                return '@.'
            }
        }).join('')
    }) as string[]
    //const map = ['##############', '##......##..##', '##..........##', '##....[][]@.##', '##....[]....##', '##..........##', '##############']    
    //const map = ['##############', '##......##..##', '##..........##', '##...[][]...##', '##....[]....##', '##.....@....##', '##############']
    //const map = ['##############', '##......##..##', '##...[][]...##', '##...@[]....##', '##..........##', '##..........##', '##############']
    console.log(map.join('\r\n'))
    // const walls = map.map(l => Array.from(l.matchAll(/#/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    // const boxes = map.map(l => Array.from(l.matchAll(/O/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    const robot = map.map(l => Array.from(l.matchAll(/@/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))[0]
    // console.log(walls, boxes, robot)

    const height = map.length - 1
    const width = map[0].length - 1
    const directions = [{ c: '<', d: [0, -1] }, { c: '^', d: [-1, 0] }, { c: '>', d: [0, 1] }, { c: 'v', d: [1, 0] }]
    const neightbours = [[-1, 0], [0, -1], [0, 1], [1, 0]]

    function isPair(np: { r: number; c: number; }, n: { r: number; c: number; d: number[]; }) {
        return (n.d[1] == 1 && map[np.r][np.c] == '[' && map[n.r][n.c] == ']') || (n.d[1] == -1 && map[np.r][np.c] == ']' && map[n.r][n.c] == '[')
    }

    function pyramid(np: { r: number; c: number; }, n: { r: number; c: number; d: number[]; }, d: number[] | undefined) {
        return n.d[0] != 0 && n.d[0] == d![0] && map[np.r][np.c] != map[n.r][n.c]
    }

    function tower(np: { r: number; c: number; }, n: { r: number; c: number; d: number[]; }, d: number[] | undefined) {
        return n.d[0] != 0 && n.d[0] == d![0] && map[np.r][np.c] == map[n.r][n.c]
    }

    const l = moves.split('\r\n').join('').split('').length

    moves.split('\r\n').join('').split('').forEach((m, mi) => {
        console.log(`${mi} / ${l}`)
        const d = directions.find(e => e.c == m)?.d
        if (isInBounds(robot.r, d![0], height) && isInBounds(robot.c, d![1], width)) {
            const np = { r: inBounds(robot.r, d![0], height), c: inBounds(robot.c, d![1], width) }
            const nc = map[np.r].charAt(np.c)
            if (nc == '#') {
                //console.log('hit a wall', m, d, robot)
            } else if (nc == '[' || nc == ']') {
                //console.log('hit box', m, d, robot)
                let fillMap: boolean[][] = Array.from(new Array((height + 1)), () => new Array((width + 1)).fill(false))
                const fill = [[np.r, np.c]]
                fillMap[np.r][np.c] = true

                while (fill.length > 0) {
                    let [i, j] = fill.shift()!
                    const fillChar = map[i][j]
                    neightbours.filter(n => isInBounds(i, n[0], height) && isInBounds(j, n[1], width)).map(n => { return { r: inBounds(i, n[0], height), c: inBounds(j, n[1], width), d: n } }).filter(np => (map[np.r][np.c] == '[' || map[np.r][np.c] == ']')).forEach(n => {
                        const db = d![0] == 0 ? (map[n.r][n.c] != fillChar && n.d[0] == 0) : (isPair({r: i, c: j}, n) || pyramid({r: i, c: j}, n, d) || tower({r: i, c: j}, n, d))
                        if (!fillMap[n.r][n.c] && db) {
                            fillMap[n.r][n.c] = true
                            fill.push([n.r, n.c])
                        }
                    })
                }

                const boxes = fillMap.flatMap((row, ri) => row.map((column, ci) => { return { r: ri, c: ci, v: column } })).filter(r => r.v == true)
                //console.log(boxes)
                let move = boxes.map(b => { return { ...b, r: b.r + d![0], c: b.c + d![1] } }).map(b => map[b.r][b.c]).every(c => c != '#')
                if (move) {
                    boxes.map(b => {
                        const ch = map[b.r][b.c]
                        map[b.r] = setCharAt(map[b.r], b.c, '.')
                        return { ...b, r: b.r + d![0], c: b.c + d![1], ch: ch }
                    }).forEach(b => {
                        map[b.r] = setCharAt(map[b.r], b.c, b.ch)
                    })
                    map[robot.r] = setCharAt(map[robot.r], robot.c, '.')
                    robot.r = np.r
                    robot.c = np.c
                    map[robot.r] = setCharAt(map[robot.r], robot.c, '@')
                }
            } else {
                //console.log('empty space', m, d, robot)
                map[robot.r] = setCharAt(map[robot.r], robot.c, '.')
                robot.r = np.r
                robot.c = np.c
                map[robot.r] = setCharAt(map[robot.r], robot.c, '@')
            }
            //console.log(map.join('\r\n'))
        }
    })
    console.log(map.join('\r\n'))

    const boxes = map.map(l => Array.from(l.matchAll(/\[/g))).flatMap((row, ri) => row.map(m => { return { r: ri, c: m['index']! } }))
    console.log(_.sum(boxes.map(b => b.r * 100 + b.c)))
}

function inBounds(r: number, curr: number, height: number): number {
    return Math.min(Math.max(r + curr, 0), height);
}


function isInBounds(r: number, curr: number, height: number): boolean {
    return (r + curr >= 0 && r + curr <= height)
}

function setCharAt(str: string, index: number, chr: string) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}
