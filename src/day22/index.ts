import * as _ from "lodash"
import { bfs, bfsAll, dfs, directions, inspect, neigbours, prettyPrintPathOnMap, rc, rcs, readFile } from "../utils"

export function parseInput() {
  return readFile(`${__dirname}\\input.dat`, '\r\n')
}

const random = (seed: bigint) => {
  seed = ((seed * 64n) ^ seed) % 16777216n
  seed = ((seed / 32n) ^ seed) % 16777216n
  seed = ((seed * 2048n) ^ seed) % 16777216n

  return seed
}

export function part1(data: string[]) {
  const nums = data.map(num => {
    let seed = BigInt(num)
    _.range(0, 2000).forEach(i => seed = random(seed))
    return seed
  })
  console.log(nums)
  console.log(_.sum(nums))

}

export function part2(data: string[]) {
  const ranges: { [key: string]: number[] } = {}
  data.forEach(num => {
    let seed = BigInt(num)
    const visited = new Set<string>()
    const changes: number[] = []
    _.times(2000, () => {
      const nextSeed = random(seed)
      changes.push(Number((nextSeed % 10n)) - Number((seed % 10n)))
      seed = nextSeed

      if (changes.length == 4) {
        const key = changes.join(',')
        if (!visited.has(key)) {
          if (ranges[key] == undefined) ranges[key] = []
          ranges[key].push(Number(nextSeed % 10n))
          visited.add(key)
        }
        changes.shift()
      }
    })
  })

  //console.log(ranges['-2,1,-1,3'])
  const max = _.max(Object.values(ranges).map(range => range.reduce((sum, num) => sum + num, 0)))
  console.log(max)
  // Object.keys(ranges).forEach(k => {
  //   if (ranges[k].reduce((sum, num) => sum + num, 0) == max) {
  //     console.log(k)
  //   }
  // })
}