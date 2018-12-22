
const { terminal, alternation, sequencing } = require('./parser_combinator.js')
const { lexer } = require('./lexer.js')


// node constructors
const App = ([ , expr1, expr2, ]) => ({ type: 'app', expr1, expr2 })
const Abs = ([ , , bindVar, , expr, ]) => ({ type: 'abs', bindVar, expr })
const Var = (name) => ({ type: 'var', name })


/* 
 * const  ::= [a-z]+ 
 * expr ::= const
 * expr ::= (\const.expr)
 * expr ::= (expr expr)
 */
const lparen = () => terminal(/\(/)
const rparen = () => terminal(/\)/)
const slash = () => terminal(/\\/)
const period = () => terminal(/\./)
const variable = () => terminal(/[a-z]+/, Var)
const app = () => sequencing([lparen, expr, expr, rparen], App)
const abs = () => sequencing([lparen, slash, variable, period, expr, rparen], Abs)
const expr = () => alternation([variable, app, abs])


// example parse
const tokens = lexer("(\\x.(x y)) p")
console.log(JSON.stringify(expr()(tokens), null, 2))