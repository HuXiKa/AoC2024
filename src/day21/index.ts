import * as _ from "lodash"
import { bfs, bfsAll, dfs, directions, inspect, neigbours, prettyPrintPathOnMap, rc, rcs, readFile } from "../utils"

export function parseInput() {
  return readFile(`${__dirname}\\input.dat`, '\r\n')
}

export function part1(data: string[]) {
  const numpad = ['789', '456', '123', 'X0A']

  const numpadPaths = _.range(0, numpad.length).flatMap(r => {
    return _.range(0, numpad[0].length).flatMap(c => {
      if (numpad[r][c] != 'X') {
        return _.range(0, numpad.length).flatMap(r2 => {
          return _.range(0, numpad[0].length).flatMap(c2 => {
            if (numpad[r2][c2] != 'X' && (r != r2 || c != c2)) {
              return { from: numpad[r][c], to: numpad[r2][c2], route: bfsAll(numpad, { row: r, column: c }, { row: r2, column: c2 }, (a: string, b: string) => a != 'X' && b != 'X', prio).map(p => p.map(i => i.direction).slice(1).sort((a, b) => a.length - b.length)) }
            }
          })
        })
      }
    })
  }).filter(i => i != undefined)

  const keyboard = ['X^A', '<v>']

  const keyboardPaths = _.range(0, keyboard.length).flatMap(r => {
    return _.range(0, keyboard[0].length).flatMap(c => {
      if (keyboard[r][c] != 'X') {
        return _.range(0, keyboard.length).flatMap(r2 => {
          return _.range(0, keyboard[0].length).flatMap(c2 => {
            if (keyboard[r2][c2] != 'X' && (r != r2 || c != c2)) {
              return { from: keyboard[r][c], to: keyboard[r2][c2], route: bfsAll(keyboard, { row: r, column: c }, { row: r2, column: c2 }, (a: string, b: string) => a != 'X' && b != 'X', prio).map(p => p.map(i => i.direction).slice(1).sort((a, b) => a.length - b.length)) }
            }
          })
        })
      }
    })
  }).filter(i => i != undefined)

  const memo: { [key: string]: number } = {}

  const res = data.reduce((sum, line) => {
    const num = Array.from(line.matchAll(/\d+/g)).map(Number)[0]
    return sum + num * cost([...numpadPaths, ...keyboardPaths] as any, line, 2, memo)
  }, 0)

  console.log(res)

}

function cost(paths: { from: string; to: string; route: string[][]; }[], code: string, robot: number, memo: { [key: string]: number }): number {
  const key = `${code},${robot}`
  if (memo[key] !== undefined) return memo[key]

  let current = 'A'
  let length = 0
  for (let i = 0; i < code.length; i++) {
    //console.log('code', code, 'robot', robot, 'current', current, 'length', length, 'code[i]', code[i])
    const moves = (paths.find(p => p!.from == current && p!.to == code[i])?.route || [[]]).flatMap(m => [...m, "A"].join(''))
    if (robot === 0) length += moves[0].length
    else {
      const min = _.min(moves.map(move => cost(paths, move, robot - 1, memo)))!
      length += min
    }
    current = code[i]
  }

  memo[key] = length
  return length
}

export function part2(data: string[]) {
  const numpad = ['789', '456', '123', 'X0A']

  const numpadPaths = _.range(0, numpad.length).flatMap(r => {
    return _.range(0, numpad[0].length).flatMap(c => {
      if (numpad[r][c] != 'X') {
        return _.range(0, numpad.length).flatMap(r2 => {
          return _.range(0, numpad[0].length).flatMap(c2 => {
            if (numpad[r2][c2] != 'X' && (r != r2 || c != c2)) {
              return { from: numpad[r][c], to: numpad[r2][c2], route: bfsAll(numpad, { row: r, column: c }, { row: r2, column: c2 }, (a: string, b: string) => a != 'X' && b != 'X', prio).map(p => p.map(i => i.direction).slice(1).sort((a, b) => a.length - b.length)) }
            }
          })
        })
      }
    })
  }).filter(i => i != undefined)

  const keyboard = ['X^A', '<v>']

  const keyboardPaths = _.range(0, keyboard.length).flatMap(r => {
    return _.range(0, keyboard[0].length).flatMap(c => {
      if (keyboard[r][c] != 'X') {
        return _.range(0, keyboard.length).flatMap(r2 => {
          return _.range(0, keyboard[0].length).flatMap(c2 => {
            if (keyboard[r2][c2] != 'X' && (r != r2 || c != c2)) {
              return { from: keyboard[r][c], to: keyboard[r2][c2], route: bfsAll(keyboard, { row: r, column: c }, { row: r2, column: c2 }, (a: string, b: string) => a != 'X' && b != 'X', prio).map(p => p.map(i => i.direction).slice(1).sort((a, b) => a.length - b.length)) }
            }
          })
        })
      }
    })
  }).filter(i => i != undefined)

  const memo: { [key: string]: number } = {}

  const res = data.reduce((sum, line) => {
    const num = Array.from(line.matchAll(/\d+/g)).map(Number)[0]
    return sum + num * cost([...numpadPaths, ...keyboardPaths] as any, line, 25, memo)
  }, 0)

  console.log(res)
}

function prio(a: rcs, b: rcs): number {
  const l = a.cost - b.cost
  if (l == 0)
    return b.direction.charCodeAt(0) - a.direction.charCodeAt(0)
  else
    return l
}