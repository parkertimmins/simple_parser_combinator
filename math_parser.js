const { terminal, alternation, sequencing } = require('./parser_combinator.js') 
const { lexer } = require('./lexer.js')

// node constructors
const Group = ([ , expr, ]) => ({ type: 'group', expr })
const Sum = ([atom1, , atom2]) => ({ type: 'sum', atom1, atom2 })
const Product = ([atom1, , atom2]) => ({ type: 'multiply', atom1, atom2 })
const Number_ = ([number]) => ({ type: 'number', value: number })

// parser 
const lparen    =()=> terminal(/\(/)
const rparen    =()=> terminal(/\)/)
const add       =()=> terminal(/\+/)
const multiply  =()=> terminal(/\*/)
const number    =()=> terminal(/[0-9]+/, Number_)
const groupExpr =()=> sequencing([lparen, expr, rparen], Group)
const atom      =()=> alternation([number, groupExpr])
const sum       =()=> sequencing([atom, add, atom], Sum)
const product   =()=> sequencing([atom, multiply, atom], Product)
const expr      =()=> alternation([sum, product, number])


// example parsing
const tokens = lexer('(4 + 3) * 2')
console.log(JSON.stringify(expr()(tokens), null, 2))
