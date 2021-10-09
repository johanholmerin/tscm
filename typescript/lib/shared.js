/**
 * Map<fileName, [start, end, value]>
 * @type {Map<string, [[number, number, string]]>}
 */
const mappings = new Map();

/**
 * Map<fileName, string>
 * @type {Map<string, string>}
 */
const sourcemaps = new Map();

/**
 * Map<fileName, inputSource>
 * @type {Map<string, string>}
 */
const sources = new Map();

/**
 * @type {Map<string, ts.Diagnostic[]>}
 */
const diagnostics = new Map();

/**
 * Map of request/response sequence number to file name
 * @type {Map<number, strin>}
 */
const sequences = new Map();

module.exports = { mappings, sourcemaps, sources, diagnostics, sequences };
