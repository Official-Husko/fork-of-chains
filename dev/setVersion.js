//
// Change the version number
// Usage:
//    npm run set-version               (interactive mode, asks for version)
//    npm run set-version 1.2.3.4       (set version directly)
//    npm run set-version bump          (1.1.1.1 -> 1.1.1.2)
//    npm run set-version bump-patch    (1.1.1.1 -> 1.1.2.0)
//    npm run set-version bump-minor    (1.1.1.1 -> 1.2.0.0)
//    npm run set-version bump-major    (1.1.1.1 -> 2.0.0.0)

// [config]
//  get the text to add for each commit to generated changelog templates
function getTemplateTextForCommit({ message, author, hash }) {
    if (message.startsWith("Merge branch"))
        return null // skip merge commits

    // Capitalize first letter
    let text = message.substr(0, 1).toUpperCase() + message.substr(1)
    
    // If not a core author, add thanks message
    if (!["darkofoc"].includes(author))
        text += ' (thanks to ' + author + ')'
    
    return text
}

const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

/** @param callback {(data: string) => string} */
function transformFile(filepath, callback) {
    let data = fs.readFileSync(filepath, "utf8")
    data = callback(data)
    fs.writeFileSync(filepath, data, "utf8")
}

// Get a list of commits up to and not including the commit where version was last changed
async function getCommitsSinceLastVersionChange() {
    // get hash for last commit that updated the version
    const { stdout, stderr } = await exec('git --no-pager log --pretty=format:%H --max-count=1 -- project/twee/meta/version.twee')

    if (stderr)
        console.error(stderr)

    const commithash = stdout ? stdout.trim() : null
    if (commithash) {
        const { stdout, stderr } = await exec(`git --no-pager log --pretty=format:"%H|%an|%s" ${commithash}..`)

        if (stderr)
            console.error(stderr)

        const lines = stdout ? stdout.trim() : null
        if (lines) {
            const items = lines.split('\n').map(line => {
                let fields = line.split('|')
                return { message: fields[2].trim(), author: fields[1].trim(), hash: fields[0].trim() }
            })
            items.reverse()
            return items
        }
    }
    return null
}


// Extract the current version from "project/twee/meta/version.twee"
function getCurrentVersionParts() {
    const match = fs.readFileSync(__dirname + "/../project/twee/meta/version.twee", "utf8")
        .match(/setup\.VERSION\s*=\s*"([^"]+)"/)

    if (!match)
        return null

    const parts = match[1].split('.').map(x => +x)
    if (parts.length > 4)
        parts.length = 4
    while (parts.length < 4)
        parts.push(0)

    return parts
}

// Main function
async function changeVersion(version) {
    const currentversionparts = getCurrentVersionParts()
    if (!currentversionparts)
        return console.error("setVersion.js: Couldn't extract current version from 'project/twee/meta/version.twee' (broken file?)")

    let versionparts
    if (version.startsWith("bump")) {
        versionparts = currentversionparts.slice()
        let idx = ["bump-major", "bump-minor", "bump-patch", "bump"].indexOf(version)
        if (idx == -1)
            return console.error('setVersion.js: Invalid argument "' + version + '"')
        versionparts[idx] += 1
        for (idx += 1; idx < 4; ++idx)
            versionparts[idx] = 0
    } else {
        if (!version || !/^\d+(\.\d+){0,3}$/.test(version))
            return console.error("setVersion.js: Invalid version value: '" + version + "' (format should be e.g. '1.2.3.4')")

        versionparts = version.split('.').map(x => +x)
    }

    while (versionparts.length < 4)
        versionparts.push(0)

    version = versionparts.join('.')
    const version_xyz = versionparts.slice(0, 3).join('.') // version with only 3 numbers (like 1.2.3)

    const commits = await getCommitsSinceLastVersionChange()
    
    // package.json
    transformFile(__dirname + "/../package.json", (data) => {
        return data.replace(/"version":\s*"[^"]+"/, '"version": "' + versionparts.slice(0, 3).join('.') + '"')
    })

    // project/twee/meta/version.twee
    transformFile(__dirname + "/../project/twee/meta/version.twee", (data) => {
        return data.replace(/setup\.VERSION\s*=\s*"([^"]+)"/, `setup.VERSION = "${version}"`)
    })

    // changelog.txt
    transformFile(__dirname + "/../changelog.txt", (data) => {
        let template = `\nv${version}: [TODO BEFORE COMMIT]\n\n`
        if (commits) {
            for (const commit of commits) {
                const text = getTemplateTextForCommit(commit)
                if (text)
                    template += '  - ' + text + '\n'
            }
        } else {
            template += ' - [unable to get commit list]\n'
        }

        let m = data.match(new RegExp(`^### v${version_xyz}\.[0xX].*\n`, 'm'))
        if (m) { // found subsection
            data = data.substr(0, m.index + m[0].length) + template + data.substr(m.index + m[0].length)
        } else { // create subsection
            m = data.match(/\[Changelog summary\]\(.*?\).*\n/)
            if (m) {
                data = data.substr(0, m.index + m[0].length) + `\n### v${version_xyz}.x\n` + template + data.substr(m.index + m[0].length)
            }
        }

        return data
    })

    console.log(`setVersion.js: Version changed from ${currentversionparts.join('.')} to ${version}, please edit 'changelog.txt'`)
}


if (process.argv.length > 2) { // received an arg
    changeVersion(process.argv[2])
} else { // interactive mode
    const readline = require('readline')

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('setVersion.js\n  Enter the new version string (like 1.2.3.4), or bump / bump-patch / bump-minor / bump-major\n  Value: ', (answer) => {
        rl.close()
        changeVersion(answer)
    })
}

