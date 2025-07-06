// @ts-nocheck


/**
 * @param {string} id
 * @param {string} color
 * @returns {(msg: string, ...args: any[]) => any[]} msg
 */
export function createLogger(id, color) {
  return function logmsg(msg, ...args) {
    return [`%c[${id}]%c ${msg}`, `color: ${color}`, '', ...args]
  }
}
