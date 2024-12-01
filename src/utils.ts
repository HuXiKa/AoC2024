import * as fs from 'fs';
import * as _ from 'lodash'
import { inspect as insp } from 'util'

export function readFile(file: string, delim: string = '\r\n') {
    return fs.readFileSync(file)
        .toString('utf8')
        .split(delim);
}

export function indexOfAll<T>(arr: Array<T>, f: (i: T) => boolean) {
    return arr.reduce((acc, el, i) => f(el) ? [...acc, i] : acc, [] as number[])
}

export function inspect(obj: any) {
    console.log(insp(obj, { showHidden: false, depth: null, colors: true }))
}
