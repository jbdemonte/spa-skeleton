/**
 * configuration for main.js
 */
exports.main = {
    tasks: [
        // templates
        {src: ["sources/statics/soyutils.js"]},
        {soy: ["sources/templates/*.soy"]},
        // sources
        {src: [
            "sources/business/*",
            "sources/main.js"
            ]
        }
    ],
    copyright: "sources/copyright/main.js",
    closure: true
};

/**
 * configuration for jq.js
 * packages which includes jquery and all its plugins
 */
exports.jq = {
    tasks: [
        {src: [
            "sources/jQuery/jQuery/*.js",
            "sources/jQuery/vendor/*.js"
        ]}
    ],
    copyright: "sources/copyright/jq.js"
};