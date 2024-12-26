import * as _ from "lodash"
import { readFile, MapUtils, inspect } from "../utils"

export function parseInput() {
  return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {
  const [inputString, wireString] = data
  const inputs = parseInputs(inputString)
  const wires = parseWires(wireString)
  //console.log(inputs)
  //console.log(wires)
  const allWires = _.uniq(wires.flatMap(wire => [wire.input1, wire.input2, wire.output]))
  //console.log(allWires)
  const [hasValue, empty] = _.partition(allWires, w => inputs.find(i => i.wire == w))
  const values = new Map<string, number>()
  inputs.forEach(i => {
    values.set(i.wire, i.value)
  })
  while (empty.length > 0) {
    const n = empty.shift()!
    const op = wires.find(w => w.output == n)!
    if (values.has(op.input1) && values.has(op.input2)) {
      values.set(n, calculate(op, values))
    } else {
      empty.push(n)
    }
  }
  const res = MapUtils.filter(values, (key, value) => key.startsWith('z'))
  console.log(parseInt((Array.from(new Map([...res.entries()].sort().values())).map(i => i[1]).reverse().join('')), 2))
}

export function part2(data: string[]) {

}
function parseInputs(inputString: string) {
  return inputString.split('\r\n').map(line => {
    const [wire, value] = line.split(': ')
    return { wire, value: Number(value) }
  })
}

function parseWires(wireString: string) {
  return wireString.split('\r\n').map(line => {
    const [input1, op, input2, arrow, output] = line.split(' ')
    return { input1, input2, op, output }
  })
}

function calculate(op: { input1: string; input2: string; op: string; output: string }, values: Map<string, number>): number {
  const i1 = values.get(op.input1)!
  const i2 = values.get(op.input2)!
  switch (op.op) {
    case 'AND': return i1 && i2
    case 'OR': return i1 || i2
    case 'XOR': return i1 ^ i2
  }

  throw new Error("Invalid operator received")
}

