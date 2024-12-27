import * as _ from "lodash"
import { readFile, MapUtils, inspect } from "../utils"

export function parseInput() {
  return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {
  const keys: number[][] = []
  const locks: number[][] = []

  // seperate each key and lock, then identify
  data.forEach(lines => {
    const grid = lines.split('\r\n')
    const heights: number[] = []
    const isKey = grid[0].split('').every(char => char === '.')

    for (let x = 0; x < grid[0].length; x++) {
      for (let y = 0; y < grid.length; y++) {
        // calculate height based on whether or not it is a key
        if (isKey && grid[y][x] === '#') {
          heights.push(grid.length - y - 1)
          break
        }

        if (!isKey && grid[y][x] === '.') {
          heights.push(y - 1)
          break
        }
      }
    }

    // place in right array
    if (isKey) keys.push(heights)
    else locks.push(heights)
  })

  // go through all pairs of locks and keys and check for nonoverlap
  let count = 0
  for (let i = 0; i < locks.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      let valid = true
      for (let k = 0; k < locks[i].length; k++) {
        if (locks[i][k] + keys[j][k] >= 6) valid = false
      }
      if (valid) count++
    }
  }
  console.log(count)
}

export function part2(data: string[]) {

}

