import * as _ from "lodash";
import { inspect, readFile } from "../utils"
import PriorityQueue from "priority-queue-typescript";

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

class Computer {
    private intstructionPointer = 0
    private outString = ''

    constructor(private registers: Map<string, bigint>) { }

    run(program: number[], options?: { debug?: boolean, exitEarly?: boolean }): string {
        this.intstructionPointer = 0
        this.outString = ''
        while (this.intstructionPointer < program.length) {
            const instruction = program[this.intstructionPointer]
            const operand = program[this.intstructionPointer + 1]
            if (options?.debug)
                console.log(`IP: ${this.intstructionPointer} - instruction ${instruction} - operand ${operand} - registers A=${this.registers.get("A")} B=${this.registers.get("B")} C=${this.registers.get("C")}`)
            let jumped = false
            switch (instruction) {
                case 0:
                    this.adv(operand)
                    break;
                case 1:
                    this.bxl(operand)
                    break;
                case 2:
                    this.bst(operand)
                    break;
                case 3:
                    jumped = this.jnz(operand)
                    break;
                case 4:
                    this.bxc(operand)
                    break;
                case 5:
                    this.out(operand)
                    break;
                case 6:
                    this.bdv(operand)
                    break;
                case 7:
                    this.cdv(operand)
                    break;
            }
            if (!jumped) this.intstructionPointer += 2
        }
        return this.outString
    }

    private dv(operand: number, target: 'A' | 'B' | 'C') {
        const numerator = this.registers.get("A")!
        const denominator: bigint = this.comboOperand(operand)
        this.registers.set(target, BigInt(String((BigInt(numerator) / 2n ** denominator)).split(".")[0]))
    }

    private cdv(operand: number) {
        this.dv(operand, "C")
    }

    private bdv(operand: number) {
        this.dv(operand, "B")
    }

    private out(operand: number) {
        this.outString = this.outString + (this.outString.length == 0 ? '' : ',') + String(this.comboOperand(operand) % 8n).split('').join(',')
    }

    private bxc(_operand: number) {
        this.registers.set("B", this.registers.get("B")! ^ this.registers.get("C")!)
    }

    private jnz(operand: number): boolean {
        if (this.registers.get("A") == 0n) return false
        else {
            this.intstructionPointer = operand
            return true
        }
    }

    private bst(operand: number) {
        this.registers.set("B", this.comboOperand(operand) % 8n)
    }

    private bxl(operand: number) {
        this.registers.set("B", this.registers.get("B")! ^ BigInt(operand))
    }

    private adv(operand: number) {
        this.dv(operand, "A")
    }

    private comboOperand(operand: number): bigint {
        if (operand <= 3) {
            return BigInt(operand)
        } else if (operand == 4) {
            return BigInt(this.registers.get("A")!)
        } else if (operand == 5) {
            return BigInt(this.registers.get("B")!)
        } else if (operand == 6) {
            return BigInt(this.registers.get("C")!)
        } else {
            throw new Error("Method not implemented.");
        }
    }

}

export function part1(data: string[]) {
    const [A, B, C] = data[0].split('\r\n').map(l => l.match(/\d+/g)!.map(BigInt)[0])
    const program = data[1].split(' ')[1].split(',').map(Number)
    const computer = new Computer(new Map([["A", A], ["B", B], ["C", C]]))
    console.log(computer)
    console.log('output:', computer.run(program, { debug: true }))
    console.log(computer)

}

export function part2(data: string[]) {
    const [A, B, C] = data[0].split('\r\n').map(l => l.match(/\d+/g)!.map(BigInt)[0])
    const program = data[1].split(' ')[1]
    const programN = program.split(',').map(Number)

    const queue = new PriorityQueue<{ index: number, test: number, number: number[] }>(undefined,
        (a: { index: number, test: number }, b: { index: number, test: number }) => b.index - a.index // smallest index
    )
    queue.add({ index: 0, test: 3, number: _.range(0, 16).map(n => 0) })

    const starts = []
    while (queue.size() > 0) {
        const n = queue.poll()!
        const numbers = n.number
        numbers[n.index] = n.test
        const num = BigInt(parseInt(numbers.join(''), 8))

        const computer = new Computer(new Map([["A", num], ["B", B], ["C", C]]))

        const out = computer.run(programN, { exitEarly: true })

        const outN = out.split(',').map(Number)
        const ind = programN.length - 1 - n.index
        console.log(JSON.stringify(n), '-', numbers.join(''), '-', num, '-', outN.join(''), '-', programN.join(''), '-', ind, outN[ind], programN[ind])
        if (outN[ind] == programN[ind] && n.index < 15) {
            queue.add({ index: n.index + 1, test: 0, number: numbers })
        }
        if (n.test == 0 && n.index <= 15) {
            _.range(1, 8).map(i => queue.add({ ...n, test: i }))
        }

        if (n.index == 15 && outN[ind] == programN[ind])
            starts.push(num)
    }
    console.log(starts)
    console.log(_.min(starts))
}
