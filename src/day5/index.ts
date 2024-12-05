import * as _ from "lodash";
import { inspect, readFile } from "../utils"

export function parseInput() {
    return readFile(`${__dirname}\\input.dat`, '\r\n\r\n')
}

export function part1(data: string[]) {
    const [rules, updates] = data
    const numRules = rules.split("\r\n").map(l => l.match(/\d+/g)!).map(r => { return { a: Number(r[0]), b: Number(r[1]) } })
    const a = _.groupBy(numRules, r => r.a)
    const b = _.groupBy(numRules, r => r.b)

    const splitUpdated = updates.split("\r\n")
    const r = splitUpdated.map(update => {
        const nums = update.split(",").map(Number)
        const nr = nums.map((n, ni) => {
            const [smaller, bigger] = [nums.slice(0, ni), nums.slice(ni + 1)]
            const st = _.every(smaller.map(sn => b[n]?.map(an => an.a).includes(sn)))
            const bt = _.every(bigger.map(sn => a[n]?.map(an => an.b).includes(sn)))
            //console.log('s', n, smaller, b[n], st, bigger, a[n], bt)
            return st && bt
        })
        return _.every(nr)
    })
    const ind = _.keys(_.pickBy(r, _.identity)).map(Number)
    const res = splitUpdated.filter((i, ii) => ind.includes(ii)).map(l => l.split(",").map(Number))
    console.log(_.sum(res.map(getMiddle)))
}

function getMiddle(arr: any[]) {
    return arr[Math.floor((arr.length - 1) / 2)];
}

export function part2(data: string[]) {
    const [rules, updates] = data
    const numRules = rules.split("\r\n").map(l => l.match(/\d+/g)!).map(r => { return { a: Number(r[0]), b: Number(r[1]) } })
    const a = _.groupBy(numRules, r => r.a)
    const b = _.groupBy(numRules, r => r.b)

    const splitUpdated = updates.split("\r\n")
    const r = splitUpdated.map(update => {
        const nums = update.split(",").map(Number)
        const nr = nums.map((n, ni) => {
            const [smaller, bigger] = [nums.slice(0, ni), nums.slice(ni + 1)]
            const st = _.every(smaller.map(sn => b[n]?.map(an => an.a).includes(sn)))
            const bt = _.every(bigger.map(sn => a[n]?.map(an => an.b).includes(sn)))
            //console.log('s', n, smaller, b[n], st, bigger, a[n], bt)
            return st && bt
        })
        return !_.every(nr)
    })

    const ind = _.keys(_.pickBy(r, _.identity)).map(Number)
    const bad = splitUpdated.filter((i, ii) => ind.includes(ii)).map(l => l.split(",").map(Number))
    bad.forEach(nums => {
        let fixed = false
        while (!fixed) {
            const nr = nums.flatMap((n, ni) => {
                const [smaller, bigger] = [nums.slice(0, ni), nums.slice(ni + 1)]
                const st = b[n]?.filter(an => bigger.includes(an.a))
                const bt = a[n]?.filter(an => smaller.includes(an.a))
                /*console.log('s', n);
                console.log('smaller', smaller);
                console.log('bigger', bigger);
                console.log('a[n]', a[n]);
                console.log('b[n]', b[n]);
                console.log('st', st);
                console.log('bt', bt);*/

                return [...st || [], ...bt || []]
            })
            const c = _.head(nr)
            if(!c) fixed = true
            else {
                const a = nums.indexOf(c.a)
                const b = nums.indexOf(c.b)
                const t = nums[a]
                nums[a] = nums[b]
                nums[b] = t
                //console.log('swap', nums)
            }
        }
    })

    inspect(bad)
    console.log(_.sum(bad.map(getMiddle)))
}