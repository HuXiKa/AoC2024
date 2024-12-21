import * as _ from "lodash";
import { inspect, readFile } from "../utils"
import PriorityQueue from "priority-queue-typescript";

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {
    const [items, designs] = data.map(s => s.match(/[a-z]+/g)).map(i => i!)
    console.log(items, designs)

    const res = designs.map((design, di) => {
        console.log(`${di}/${designs.length}`)
        return canBeSolved(design, items)
    })
    //console.log(res)
    console.log(_.countBy(res, _.identity)['true'])
}

export function part2(data: string[]) {

    const [items, designs] = data.map(s => s.match(/[a-z]+/g)).map(i => i!)
    const cache = new Map<string, number>();

    //console.log(items, designs)

    function cachedCount(design: string): number { return cache.get(design) ?? cache.set(design, count(design)).get(design)! }

    function count(design: string) {
        return !design ? 1 : _.sum(items.filter(towel => design.startsWith(towel)).map(towel => cachedCount(design.substring(towel.length))))
    }    
    
    //console.log(designs.filter(cachedCount).length);
    console.log(designs.map(cachedCount).reduce((a, b) => a + b, 0));
    console.log(cache.size)
}
function canBeSolved(design: string, items: string[]): any {
    const queue = new PriorityQueue<{ design: string, index: number, components: string[] }>(undefined,
        (a: { index: number }, b: { index: number }) => b.index - a.index
    )
    queue.add({ design, index: 0, components: [] })

    while (queue.size() > 0 && queue.peek()!.index != design.length) {
        //console.log(design, queue.size())
        const d = queue.poll()!
        items.filter(i => d.design.substring(d.index).includes(i)).forEach(item => {
            if (d.design.substring(d.index).startsWith(item)) {
                //console.log('match', d, item, queue.size())
                queue.add({ design, index: d.index + item.length, components: [...d.components, item] })
            }
        })
    }
    return queue.size() != 0
}

