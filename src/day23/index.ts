import * as _ from "lodash"
import { readFile, MapUtils, inspect } from "../utils"

export function parseInput() {
  return readFile(`${__dirname}\\input.dat`, '\r\n')
}

type Machine = {
  name: string,
  to: Set<string>,
}

function machines(input: string[], names: string[]): Machine[] {
  const machines = [] as Machine[]
  const pairs = input.map(i => i.split('-'))
  names.forEach(n => {
    const [from, to] = _.partition(pairs.filter(i => i.includes(n)), i => i[0] == n)
    from.forEach(p => {
      const m = machines.find(m => m.name == p[0])
      if (m) {
        m.to.add(p[1])
      } else {
        machines.push({ name: p[0], to: new Set([p[1]]) })
      }
    })
    to.forEach(p => {
      const m = machines.find(m => m.name == p[1])
      if (m) {
        m.to.add(p[0])
      } else {
        machines.push({ name: p[1], to: new Set([p[0]]) })
      }
    })
  })
  return machines
}

function parse(input: string[]): Machine[] {
  const names = _.uniq(input.flatMap(line => line.split('-')))
  console.log(names)
  return machines(input, names)
}

const shortestPath = (machines: Machine[]) => {
  const distMap = new Map(
    machines.map(v => [
      v.name,
      new Map(machines.map(v2 => [v2.name, Number.MAX_SAFE_INTEGER])),
    ])
  )
  //dist to self is 0
  machines.forEach(v => distMap.get(v.name)?.set(v.name, 0))

  // dist to 'to' targets, a.k.a known neighbours is one
  machines.forEach(v =>
    Array.from(v.to).map(t => distMap.get(v.name)!.set(t, 1))
  )

  //https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm
  machines.forEach(v =>
    machines.forEach(i =>
      machines.forEach(j =>
        distMap
          .get(i.name)!
          .set(
            j.name,
            Math.min(
              distMap.get(i.name)!.get(j.name)!,
              distMap.get(i.name)!.get(v.name)! + distMap.get(v.name)!.get(j.name)!
            )
          )
      )
    )
  )
  return distMap
}

export function part1(data: string[]) {
  const machines = parse(data)
  //const distMap = shortestPath(machines)
  //console.log(distMap)
  console.log(machines)

  const r = machines.filter(m => m.name.startsWith('t')).map(i => findLoop(i, machines, 3)).flat()
  const res = _.uniqBy(r.map(p => p.split(",").sort()), i => i.toString())
  //console.log(_.sortBy(res, i => i.toString()))
  console.log(res.length)

}

export function part2(data: string[]) {
  const machines = parse(data)
  //const distMap = shortestPath(machines)
  //console.log(distMap)
  //console.log(machines)

  //const distOne = MapUtils.mapValue(distMap, (key, value) => MapUtils.filter(value, (k, v) => v == 1))
  //console.log(distOne)

  const r = machines.map((machine, mi) => {
    console.log(`${mi + 1}/${machines.length}`)
    //const check = Array.from(m.to)
    const visited = [] as string[]
    const subnet = new Set<string>()
    subnet.add(machine.name)
    //while (check.length > 0) {
    machine.to.forEach(neighbour => {
      //const n = check.pop()!
      visited.push(neighbour)
      //console.log('check', machine, neighbour)
      const neighbourMachine = machines.find(m => m.name == neighbour)
      const intersection = neighbourMachine!.to.intersection(machine.to)
      //console.log('intersection', intersection, neighbourMachine?.to, machine.to)
      intersection.forEach(candidate => {
        const candidateMachine = machines.find(m => m.name == candidate)
        let check = true;
        [...intersection, ...subnet].forEach(test => {
          const testMachine = machines.find(m => m.name == test)
          //console.log(candidate, test, testMachine?.to, candidateMachine?.to)
          if (!(test == candidate || testMachine?.to.has(candidate) && candidateMachine?.to.has(test))) {
            check = false
          }
        })
        if (candidateMachine?.to.has(machine.name) && check)
          subnet.add(candidate)
      })

    })
    return { ...machine, subnet: subnet }
  })
  const max = _.maxBy(r, i => i.subnet.size)
  //console.log(max)
  console.log(Array.from(max!.subnet).sort().join(','))
}

function findLoop(orig: Machine, machines: Machine[], dist: number): string[] {
  function findLoop(current: Machine, machines: Machine[], dist: number, path: string[]): string[][][] {
    //console.log('findLoop', orig, current, dist, path)
    if ((dist == 0) && current.name == orig.name) return [[path]]
    if (dist == 0) return []
    else return Array.from(current.to).filter(i => i).flatMap(n => findLoop(machines.find(m => m.name == n)!, machines, dist - 1, [...path, n]))
  }
  return findLoop(orig, machines, dist, []).map(i => i.join(','))
}

