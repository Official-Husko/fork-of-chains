
const fs = require("fs")

// Parses the source to extract all the traits keys

exports.getTraitKeys = function() {
    const rootdir = __dirname + "/../project/twee/trait"

    const regex = /setup\.Trait\(\s*["']([^"']+)["']/g

    const traitkeys = {}

    const files = fs.readdirSync(rootdir)
    for (const filename of files) {
        const content = fs.readFileSync(rootdir + "/" + filename, "utf8")
        if (content) {
            let match
            while ((match = regex.exec(content)))
                traitkeys[match[1]] = true
        }
    }

    return traitkeys
}
