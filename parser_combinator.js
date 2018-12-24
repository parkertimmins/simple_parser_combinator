/* A very simple parser combinator library. If has expontential complexity
 * and does a great deal unnecessary copying. 
 */

/* Parser that matches absense of any tokens
 */
let EMPTY = tokens => [tokens.length === 0 ? '_EMPTY_' : null, tokens]

/* Parser that matches a single token. Succeeds if token matches the 
 * regex `pattern`. If succeeds consumes one token. If succeed returns 
 * `node` constructed from token or returns token is `node` is undefined. 
 * Returns null on failure
 */
let terminal = (pattern, node_constructor=x=>x) => tokens => 
    tokens.length && tokens[0].match(pattern) ? 
        [node_constructor(tokens[0]), tokens.slice(1)] : [null, tokens]

/* Builds a parser that requires each of `parsers` in sequence. If
 * successfully matchs all parsers constructs a `node` from the matched
 * tokens. Or just returns the matched tokens if no `node` is defined. If 
 * succeeds consumes as many tokens and the matched parsers.
 * Returns null on failure 
 */
let sequencing = (parsers, node_constructor=x=>x) => tokens => {
    let results = [] 
    let parse_result, remaining_tokens = tokens
    for (let parser of parsers) {
        [parse_result, remaining_tokens] = parser()(remaining_tokens)
        if (!parse_result) return [null, tokens]
        results.push(parse_result)
        if (parse_result === '_EMPTY_') break // special case for empty parser
    }    
    return [node_constructor(results), remaining_tokens]
}

/* Builds a parser that matches one of the `parsers`. If successfully 
 * matches a parser returns the result of the parser. If succeeds
 * consumes as many tokens as the matched parser. Returns null on failure
 */
let alternation = parsers => tokens => {
    for (let parser of parsers) {
        let [parse_result, remaining_tokens] = parser()(tokens)
        if (parse_result) return [parse_result, remaining_tokens]
    }    
    return [null, tokens]
}

module.exports = {
    EMPTY, terminal, alternation, sequencing
}
