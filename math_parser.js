const { terminal, choice, sequence } = require('./parser_combinator.js') 
const { lexer } = require('./lexer.js')

// node constructors
const Group = ([ , expr, ]) => ({ type: 'group', expr })
const Sum = ([atom1, , atom2]) => ({ type: 'sum', atom1, atom2 })
const Product = ([atom1, , atom2]) => ({ type: 'product', atom1, atom2 })
const Number_ = ([number]) => ({ type: 'number', value: number })

// parser 
const lparen    =()=> terminal(/\(/)
const rparen    =()=> terminal(/\)/)
const add       =()=> terminal(/\+/)
const multiply  =()=> terminal(/\*/)
const number    =()=> terminal(/[0-9]+/, Number_)
const groupExpr =()=> sequence([lparen, expr, rparen], Group)
const atom      =()=> choice([number, groupExpr])
const sum       =()=> sequence([atom, add, atom], Sum)
const product   =()=> sequence([atom, multiply, atom], Product)
const expr      =()=> choice([sum, product, number])


// example parsing
const tokens = lexer('(4 + 3) * 2')
console.log(JSON.stringify(expr()(tokens), null, 2))

