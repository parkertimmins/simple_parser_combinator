/* A very simple parser combinator library. If has expontential complexity
 * and does a great deal unnecessary copying. 
 */

/* Parser that matches a single token. Succeeds if token matches the 
 * regex `pattern`. If succeeds consumes one token. If succeed returns 
 * `node` constructed from token or returns token is `node` is undefined. 
 * Returns null on failure
 */
let terminal = (pattern, node=x => x) => tokens => 
	tokens.length && tokens[0].match(pattern) ? node(tokens.shift()) : null

/* Builds a parser that requires each of `parsers` in sequence. If
 * successfully matchs all parsers constructs a `node` from the matched
 * tokens. Or just returns the matched tokens if no `node` is defined. If 
 * succeeds consumes as many tokens and the matched parsers.
 * Returns null on failure 
 */
let sequencing = (parsers, node=x => x) => tokens => {
	let results = [] 
	for (let parser of parsers) {
		let result = consumeIfNotNull(parser, tokens)
		if (!result) return null
		results.push(result)
	}    
	return node(results)
}

/* Builds a parser that matches one of the `parsers`. If successfully 
 * matches a parser returns the result of the parser. If succeeds
 * consumes as many tokens as the matched parser. Returns null on failure
 */
let alternation = parsers => tokens => {
	for (let parser of parsers) {
		let result = consumeIfNotNull(parser, tokens)
		if (result) return result
	}    
	return null
}

/* Takes `alwaysConsumeParser` a parser that will consume `tokens`
 * whether or not it matches. Calls the consuming parser with
 * a copy of `tokens`. If the parser succeeds, replaced `tokens` with the
 * partially consumed copy. If fails, leave `tokens` unchanged.
 */
let consumeIfNotNull = (alwaysConsumeParser, tokens) => {
	let copy = [...tokens]
	let result = alwaysConsumeParser()(copy)
	if (result) tokens.splice(0, tokens.length - copy.length)
	return result
}

module.exports = {
	terminal, alternation, sequencing
}
