/**
 * @author Sakeiru
 */

/**
 * @typedef {Array<{name: string, value?: string, options?: Options}>} Options
 * @param {Options} options 
 */
const mapInteractionOptions = (options) => {
    /**
     * @type {Map<string, number|string|boolean}
     */
    let args = new Map();

    options.forEach((value) => {
        if (value.options) {
            args.set(value.name, mapInteractionOptions(value.options));
        } else {
            args.set(value.name, value.value);
        }
    });

    return args;
}

module.exports = {
    mapInteractionOptions: mapInteractionOptions
}