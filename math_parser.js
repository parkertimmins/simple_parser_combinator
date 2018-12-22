const { terminal, alternation, sequencing } = require('./parser_combinator.js') 
const { lexer } = require('./lexer.js')

// node constructors
const Group = ([ , expr, ]) => ({ type: 'group', expr })
const Sum = ([atom1, , atom2]) => ({ type: 'sum', atom1, atom2 })
const Product = ([atom1, , atom2]) => ({ type: 'multiply', atom1, atom2 })
const Number_ = ([number]) => ({ type: 'number', value: number })

// parser 
let lparen = () => terminal(/\(/)
let rparen = () => terminal(/\)/)
let add = () => terminal(/\+/)
let multiply = () => terminal(/\*/)
let number = () => terminal(/[0-9]+/, Number_)
let groupedExpr = () => sequencing([lparen, expression, rparen], Group)
let atom = () => alternation([number, groupedExpr])
let sum = () => sequencing([atom, add, atom], Sum)
let product = () => sequencing([atom, multiply, atom], Product)
let expression = () => alternation([sum, product, number])



// example parsing
let tokens = lexer('(4 + 3) * 2')
console.log(JSON.stringify(expression()(tokens), null, 2))
