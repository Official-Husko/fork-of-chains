//
// Performs several operations on "imagemeta.js" files used in image packs and in room images:
//
// Check unit image packs:
//
//   checkImageMetas.js --check <dir?>:
//     Sanity check for the image directory structure and metadata,
//     defined in the 'imagemeta.js' files
//
//   checkImageMetas.js --merge <dir?>:
//     Merge all subdirectory "imagemeta.js" to a single "imagepack.js" in the root directory
//
//   checkImageMetas.js --merge --check:
//     Do both of the above
//
//
// Check room image packs:
//
//   checkImageMetas.js --check --room <dir?>:
//     Sanity check for the room directory structure and metadata,
//     defined in the 'imagemeta.js' files
//
//   checkImageMetas.js --merge <dir?>:
//     Merge all subdirectory "imagemeta.js" to a single "imagepack.js" in the root directory
//
//
// Check content images:
//
//   checkImageMetas.js --check --content <dir?>:
//     Sanity check for the room directory structure and metadata,
//     defined in the 'imagemeta.js' files
//
//
// Other optional arguments:
//
//    --flatten: flatten the images into a single directory, removing the subfolders hierarchy
// 

// @ts-check

//
// Config values
//

const SCRIPTNAME = "checkImageMetas.js"

// (used below)
const TRAIT_KEYS = require("./traitsParser.js").getTraitKeys()

// For each depth, an object with the valid names as keys, or undefined to allow any name
const VALID_SUBDIR_NAMES_BY_DEPTH = [
    { "gender_male": 1, "gender_female": 1 }, // depth 0 (subdirs of root)
    TRAIT_KEYS // last entry also applied for higher depth subfolders
]

// Allowed fields in UNITIMAGE_CREDITS (field key -> allowed typeof values)
const CREDITS_SCHEMA = {
    title: ["string"],
    artist: ["string"],
    url: ["string"],
    license: ["string"],
    extra: ["string", "undefined"],
}

/**
 * @typedef {{
 *  title?: string,
 *  artist?: string,
 *  url?: string,
 *  license?: string,
 *  extra?: string | undefined,
 *  directional?: boolean, // rooms only
 *  norotate?: boolean, // rooms only
 *  nowalls?: boolean, // rooms only
 * }} ImageMetadata
 */

/**
 * @typedef {{
 *  path: string,
 *  info?: ImageMetadata,
 * }} ImageEntry
 */

/**
 * @typedef {{
 *  images?: ImageEntry[],
 *  is_back_allowed?: boolean,
 *  further?: Record<string, DirEntry>,
 * }} DirEntry
 */

//
// Code
//

const C = { // console ANSI escape codes, for colorizing
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGray: "\x1b[90m",
}

const path = require("path")
const fs = require("fs")

const $ = globalThis

const argv = process.argv.slice(2)
const colorize = argv.includes("--color") ? true : ((argv.includes("--no-color")) ? false : (process.stdout.isTTY ?? true))
if (!colorize) {
    Object.keys(C).forEach(k => C[k] = '')
}
let checking = argv.includes("--check")
const merging = argv.includes("--merge")
const strict = argv.includes("--strict")
const flattening = argv.includes("--flatten")
const room = argv.includes("--room")
const content = argv.includes("--content")
let defaultpath
if (room) {
    defaultpath = '../dist/img/room/imagepack.js'
} else if (content) {
    defaultpath = '../dist/img/content'
} else {
    defaultpath = '../dist/imagepacks/default'
}
const inputpath = argv.find(x => !x.startsWith("-")) || path.resolve(__dirname, defaultpath)
if (!inputpath) {
    console.error(`${C.FgRed}No input path specified${C.Reset}`)
    process.exit(1)
}
const input_is_imagepackjs = inputpath.endsWith('imagepack.js')
const rootdir = input_is_imagepackjs ? path.dirname(inputpath) : inputpath

if (input_is_imagepackjs && merging) {
    console.error(`${C.FgRed}Cannot use --merge when the input is an imagepack.js file${C.Reset}`)
    process.exit(1)
}

if (room) {
    CREDITS_SCHEMA['directional'] = ['boolean', 'undefined']
    CREDITS_SCHEMA['norotate'] = ['boolean', 'undefined']
    CREDITS_SCHEMA['nowalls'] = ['boolean', 'undefined']
    CREDITS_SCHEMA['url'] = ["string", 'undefined']
}

let IMAGE_MAX_FILESIZE
if (room) {
    IMAGE_MAX_FILESIZE = 120000 // (max allowed image filesize, in bytes)
} else {
    IMAGE_MAX_FILESIZE = 250000 // (max allowed image filesize, in bytes)
}


if (!checking && !merging) {
    console.error(`${C.FgYellow}${SCRIPTNAME}: No operations specified, assuming: --check${C.Reset}`)
    checking = true
}

let numerrors = 0

function error(/** @type {string} */ header, /** @type {string} */ errmsg) {
    if (!checking)
        return

    numerrors += 1

    console.error(`${C.FgGray}${header}:${C.Reset} ${errmsg}`)
}

function getPathForRequire(/** @type {string} */ targetpath) {
    const relpath = path.relative(__dirname, targetpath)
    return relpath.startsWith(".") ? relpath : "./" + relpath
}

/**
 * @param {{}} obj
 * @param {{}} schema
 * @param {string} header
 */
function validateSchema(obj, schema, header) {
    let valid = true
    for (const k of Object.keys(schema)) {
        const type = typeof obj[k]
        if (!schema[k].includes(type)) {
            error(header, `invalid field ${C.FgMagenta}${C.Bright}"${k}"${C.Reset} (expected ${schema[k].map(t => `${C.FgBlue}${t}${C.Reset}`).join(" or ")}, found ${C.FgBlue}${type}${C.Reset})`)
            valid = false
        }
        else if (type === "string" && !obj[k].trim()) {
            error(header, 'is an empty string')
            valid = false
        }
    }
    for (const k of Object.keys(obj)) {
        if (!schema[k]) {
            error(header, 'unknown field "' + k + '"')
            valid = false
        }
    }
    return valid
}

let packdata = null // holds the combined data

const packfilename = path.join(rootdir, "imagepack.js")

function loadImagePackData(/** @type {string} */ filepath) {
    const header = filepath

    // single-file format (single file at pack root)
    $.IMAGEPACK = undefined
    $.ROOMIMAGEPACK = undefined

    try { // attempt to load file as module
        require(getPathForRequire(filepath))
    } catch (err) {
        if (err.code !== "MODULE_NOT_FOUND")
            error(header, 'Error loading imagepack.js: ' + err)
        return false
    }

    const result = $.IMAGEPACK || $.ROOMIMAGEPACK

    if (!result) {
        error(header, "imagepack.js doesn't declare IMAGEPACK as a global")
        return false
    }

    packdata = result
    return true
}

function saveUnitImagePackData() {
    let output = "IMAGEPACK = " + JSON.stringify(packdata, undefined, 2).replace(/"([\w_$]+)":/g, "$1:")
    fs.writeFileSync(packfilename, output, "utf-8")
}

function saveRoomImagePackData() {
    let output = "ROOMIMAGEPACK = " + JSON.stringify(packdata, undefined, 2).replace(/"([\w_$]+)":/g, "$1:")
    fs.writeFileSync(packfilename, output, "utf-8")
}

/**
 * @param {string} dir
 * @param {number} depth
 * @param {DirEntry} dirdata
 * @param {string | null} curdirroom
 * @param {string} extraheader
 */
function processDirectory(dir, depth, dirdata, curdirroom, extraheader) {
    const filepath = dir + "/imagemeta.js"
    if (content) {
        dir = dir + "/all"
    }

    const reldir = depth === 0 ? '' : path.relative(rootdir, dir).replace(/\\/g, '/')
    let header
    if (room) {
        header = './' + curdirroom + '/' + reldir
    } else {
        header = "./" + reldir
    }
    if (extraheader) {
        header = `${extraheader}${header}`
    }

    /** @type {Record<string, boolean>} */
    const imageids = {}
    /** @type {Record<string, boolean>} */
    const subdirs = {}

    // Get the names of the files in the directory
    for (const filename of fs.readdirSync(dir)) {
        const parsed = path.parse(filename)
        if (!parsed.ext)
            subdirs[filename] = true
        else if (room || content || /^\.jpg$/i.test(parsed.ext))
            imageids[filename] = true
    }

    // Check image filesizes in current dir
    for (const imageid of Object.keys(imageids)) {
        const filepath = dir + "/" + imageid
        const stats = fs.statSync(filepath)
        if (stats) {
            if (strict && stats.size > IMAGE_MAX_FILESIZE) {
                error(header, `image "${imageid} exceeds the max size (size: ` + Math.round(stats.size / 1000) + ' kB)')
            }

            if (flattening) {
                const relpath = path.relative(rootdir, dir)
                const new_filepath = rootdir + '/' + (relpath + "/" + imageid).replace(/[\\//]/g, '__')
                fs.renameSync(filepath, new_filepath)
            }
        }
    }

    let dir_has_imagemeta = false

    if (input_is_imagepackjs) {
        // do nothing, "dirdata" already contains the data
    } else {
        // multi-file format (one file per dir)
        $.UNITIMAGE_LOAD_FURTHER = undefined
        $.UNITIMAGE_CREDITS = undefined
        $.ROOMIMAGE_CREDITS = undefined
        $.IMAGE_CREDITS = undefined
        $.UNITIMAGE_NOBACK = undefined

        try {
            // attempt to load file imagemeta.js as module
            require(getPathForRequire(filepath))

            dir_has_imagemeta = true

            //if (packdata && !merging) // single-file format, imagemetas.js on subdirectories are forbidden
            //error(header, 'imagemeta.js should not exist (merge it into the one on the root dir)')

        } catch (err) {
            if (err.code === "MODULE_NOT_FOUND") {
                //if (!packdata) // multi-file format, imagemetas.js are required
                error(header, 'imagemeta.js does not exist')
            } else {
                error(header, 'Error loading imagemeta.js: ' + err)
            }
            return
        }

        if (dir_has_imagemeta) { // load multi-file format fields
            // Check UNITIMAGE_NOBACK
            if ($.UNITIMAGE_NOBACK !== undefined && typeof $.UNITIMAGE_NOBACK !== "boolean") {
                error(header, "UNITIMAGE_NOBACK should be a boolean (found: " + (typeof $.UNITIMAGE_NOBACK) + ")")
            } else {
                if (!room && !content && !('is_back_allowed' in dirdata))
                    dirdata.is_back_allowed = !$.UNITIMAGE_NOBACK
            }

            let credit_obj
            let credit_obj_name
            if (room) {
                credit_obj = $.ROOMIMAGE_CREDITS
                credit_obj_name = 'ROOMIMAGE_CREDITS'
            } else if (content) {
                credit_obj = $.IMAGE_CREDITS
                credit_obj_name = 'IMAGE_CREDITS'
            } else {
                credit_obj = $.UNITIMAGE_CREDITS
                credit_obj_name = 'UNITIMAGE_CREDITS'
            }
            // Check UNITIMAGE_CREDITS
            if (credit_obj !== undefined) {
                if (typeof credit_obj !== "object") {
                    error(header, `${credit_obj_name} should be an object (found: ${typeof credit_obj})`)
                } else {
                    if (!dirdata.images)
                        dirdata.images = []

                    for (const [id, meta] of Object.entries(credit_obj)) {
                        let header = reldir + " (image " + id + ")"

                        validateSchema(meta, CREDITS_SCHEMA, header)

                        if (meta.url && !meta.url.startsWith('http')) {
                            error(header, 'url is not a proper url')
                        }

                        if (strict && !room && !content && isNaN(parseInt(id))) {
                            error(header, "image id is not a number")
                        } else {
                            let imgpath = (reldir ? reldir + '/' : '') + id
                            if (!room && !content) {
                                imgpath += '.jpg'
                            }

                            let obj = dirdata.images.find(x => x.path === imgpath)
                            if (obj) {
                                obj.info = meta
                            } else {
                                obj = { path: imgpath, info: meta }
                                dirdata.images.push(obj)
                            }
                        }
                    }
                }
            }
        }
    }

    // Check is_back_allowed
    if (dirdata.is_back_allowed !== undefined && typeof dirdata.is_back_allowed !== "boolean") {
        error(header, `'is_back_allowed' should be a boolean (found: ${typeof dirdata.is_back_allowed})`)
    }

    // Check image files
    if (dirdata.images !== undefined) {
        if (!Array.isArray(dirdata.images)) {
            error(header, `'images' should be an array (found: ${typeof dirdata.images})`)
        } else {
            for (let i = 0; i < dirdata.images.length; ++i) {
                let header = reldir + ` images[${i}]`
                const imageinfo = dirdata.images[i]
                if (typeof imageinfo !== "object") {
                    error(header, `should be an object (found: ${typeof imageinfo})`)
                } else {
                    if (typeof imageinfo.path !== "string") {
                        error(header, `'path' field should be a string`)
                    } else {
                        const parsed = path.parse(imageinfo.path)

                        const num = parseInt(parsed.name)
                        const imgdir = parsed.dir === '/' ? '' : parsed.dir
                        if (imgdir !== reldir)
                            error(header, `invalid directory (expected: "${reldir}" , found: "${imgdir}")`)
                        else if (strict && !room && !content && parsed.ext !== ".jpg")
                            error(header, `invalid file extension (expected: ".jpg" , found: "${parsed.ext}")`)
                        else if (strict && !room && !content && isNaN(num))
                            error(header, `image name is not a number (found: "${parsed.name}")`)
                        else {
                            header = reldir + ` (image ${parsed.name})`
                            if (extraheader) {
                                header = extraheader + header
                            }
                            const image_ids = []
                            if (room) {
                                if (imageinfo.info?.directional) {
                                    for (const direction of ['n', 's', 'e', 'w']) {
                                        const parsed = path.parse(imageinfo.path)
                                        const new_path = parsed.name + '-' + direction + parsed.ext
                                        image_ids.push(new_path)
                                    }
                                } else {
                                    image_ids.push(imageinfo.path)
                                }
                            } else if (content) {
                                image_ids.push(imageinfo.path)
                            } else {
                                image_ids.push(parsed.base)
                            }
                            for (const image_id of image_ids) {
                                if (imageids[image_id]) {
                                    delete imageids[image_id] // mark as processed
                                } else {
                                    error(header, `image '${image_id}' does not exist`)
                                }
                            }
                        }
                    }

                    //if (imageinfo.depth !== depth + 1)
                    //    error(header, `'images[${i}]': invalid 'depth' (found: ${imageinfo.depth}, expected: ${depth + 1})`)

                    if (typeof imageinfo.info !== "object") {
                        error(header, `'info' field should be an object (found: ${typeof imageinfo.info})`)
                    } else {
                        validateSchema(imageinfo.info, CREDITS_SCHEMA, header)
                    }
                }

                if (flattening) {
                    imageinfo.path = imageinfo.path.replace(/[\/\\]/g, '__')
                }
            }
        }
    }

    // Check for images not listed in UNITIMAGE_CREDITS
    const unlistedimgs = Object.keys(imageids).filter(id => id != 'imagemeta.js')
    if (unlistedimgs.length > 0) {
        error(header, `${unlistedimgs.length} image${unlistedimgs.length === 1 ? '' : 's'} not listed: ` +
            `[ ${unlistedimgs.map(x => `${C.FgCyan}${x}${C.Reset}`).join(", ")} ]`)
    }

    // Check valid subdir names
    if (!room && !content) {
        const validsubdirnames = VALID_SUBDIR_NAMES_BY_DEPTH[Math.min(depth, VALID_SUBDIR_NAMES_BY_DEPTH.length - 1)]
        if (validsubdirnames) {
            for (const subdirname of Object.keys(subdirs)) {
                if (!validsubdirnames[subdirname])
                    error(header, 'subdirectory "' + subdirname + '" has an invalid name')
            }
        }
    }

    /** @type {string[]} */
    let listedsubdirs = []

    if (dirdata.further !== undefined) {
        if (typeof dirdata.further !== "object") {
            error(header, `'further' should be an object (found: ${typeof dirdata.further})`)
            dirdata.further = {}
        } else {
            listedsubdirs = Object.keys(dirdata.further)
        }
    } else {
        dirdata.further = {}
    }

    // Check children
    if (!input_is_imagepackjs && dir_has_imagemeta) { // multi-file format
        if ($.UNITIMAGE_LOAD_FURTHER !== undefined) {
            if (!Array.isArray($.UNITIMAGE_LOAD_FURTHER) || !$.UNITIMAGE_LOAD_FURTHER.every(x => typeof x === "string")) {
                error(header, "UNITIMAGE_LOAD_FURTHER is not a valid array of strings")
            } else {
                for (const subdirname of $.UNITIMAGE_LOAD_FURTHER) {
                    if (!listedsubdirs.includes(subdirname))
                        listedsubdirs.push(subdirname)
                }
            }
        }
    }

    // Check that listed directories actually exist
    listedsubdirs = listedsubdirs.filter(subdirname => {
        if (!subdirs[subdirname]) {
            error(header, 'subdirectory "' + subdirname + '" does not exist')
            return false
        }

        delete subdirs[subdirname] // mark as processed
        return true
    })

    // Check for subdirs not listed in UNITIMAGE_LOAD_FURTHER
    const unlistedsubdirs = Object.keys(subdirs)
    if (unlistedsubdirs.length > 0) {
        error(header, `${unlistedsubdirs.length} subdirector${unlistedsubdirs.length === 1 ? 'y' : 'ies'} not listed: ` +
            "[ " + unlistedsubdirs.join(", ") + " ]")
    }

    // Process subdirs
    for (const subdir of listedsubdirs) {
        const subdirdata = dirdata.further[subdir] || {}
        processDirectory(dir + "/" + subdir, depth + 1, subdirdata, curdirroom, extraheader)
        if (merging)
            dirdata.further[subdir] = subdirdata
    }

    // Clean up object
    if (dirdata.images && !dirdata.images.length)
        delete dirdata.images

    if (dirdata.further && !Object.keys(dirdata.further).length)
        delete dirdata.further
}


if (input_is_imagepackjs) {
    loadImagePackData(packfilename)
}

if (!packdata)
    packdata = {}

if (content) {
    processDirectory(rootdir, 0, packdata, null, '')
} else if (room) {
    // process each subdirectory instead
    for (const filename of fs.readdirSync(rootdir)) {
        const parsed = path.parse(filename)
        if (!parsed.ext) {
            const dir_packdata = (packdata[parsed.name] ??= {})
            processDirectory(rootdir + '/' + filename, 0, dir_packdata, filename, `within ${filename}: `)
        }
    }
} else {
    processDirectory(rootdir, 0, packdata, null, '')
}

if (merging) { // Finish the merging
    console.log(`${SCRIPTNAME}: Generated ${packfilename}`)
    if (room) {
        saveRoomImagePackData()
    } else {
        saveUnitImagePackData()
    }
}

if (checking) {
    const color = numerrors ? C.FgRed : C.FgGreen
    console.log(`${color}${SCRIPTNAME}: Finished checking ${C.Bright}${inputpath}${C.Reset}${color} with ${numerrors} error${numerrors === 1 ? '' : 's'}${C.Reset}`)
    process.exit(numerrors ? 1 : 0)
} else {
    console.log(`${SCRIPTNAME}: Finished`)
}

