/* Lexer to split simple languages into tokens. 
 * Contiguous letters are a single token. Contiguous
 * digits are a single number. All other characters are 
 * single tokens. Whitespace is removed.
 */
let lexer = (program) => {
	var tokens = [];
    var res;
    var regex = /^\d+|\w+|[^\d\w\s]|\s+/g;
    while((res = regex.exec(program)) !== null) {
        if (!/\s+/.test(res[0])) {
            tokens.push(res[0])
        }
    }   
	return tokens
}

module.exports = { lexer }

//console.log(lexer("(3 + 3) * 9"))
//console.log(lexer("(\\x.x y) tok"))
