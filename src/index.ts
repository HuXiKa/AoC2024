function main() {
    const args = process.argv.slice(2)
    if (args.length >= 2 && args[0] == '--day') {
        runDay(args[1], args[2])
    } else {
        console.log("invalid args")
    }    
}

async function runDay(day: string, part: string | undefined) {
    const p = part ?? "12"
    console.log(`running day ${day} part ${p}`)
    const s = await import(`./day${day}/index.js`)
    const parsedInput = s.parseInput()
    if (p.includes("1")) {
        console.log(" part1: ")
        console.time('part1');
        s.part1(parsedInput)
        console.timeEnd('part1');
    }
    if (p.includes("2")) {
        console.log(" part2: ")
        console.time('part2');
        s.part2(parsedInput)
        console.timeEnd('part2');
    }
    const used = process.memoryUsage().heapUsed / 1024 / 1024;    
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}

main()