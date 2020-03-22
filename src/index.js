function eval() {
    // Do not use eval!!!
    return;
}

const brackets = /\([\d\.\+\-\*\/]*\)/;
const operators = ['*', '/', '+', '-'];

function expressionCalculator(expr) {
    let openBracketsCount = expr.split('(').length;
    let closeBracketsCount = expr.split(')').length;
    if (openBracketsCount !== closeBracketsCount) throw Error("ExpressionError: Brackets must be paired");

    expr = expr.split(' ').join('');
    expr = expr.split('-').join('+-');

    expr = calculateBrackets(expr);

    return Number(calculateExpr(expr));
}


function calculateBrackets(expr){
    if (!expr.includes('(')) return expr;

    let partExpr = getPartFromBrackets(expr);

    let result = calculateExpr(partExpr.replace('(', '').replace(')', ''));

    let newExpr = expr.replace(partExpr, result);
    newExpr = newExpr.replace('--', '+').replace('++', '+').replace('*+', '*').replace('/+', '/');
    
    return calculateBrackets(newExpr);
}

function getPartFromBrackets(expr) {
    return expr.match(brackets)[0];
}


function calculateExpr(expr) {
    if (!operators.some(o => expr.substring(1).indexOf(o) !== -1)) return expr;

    let operator = getOperator(expr);
    let partExpr = expr.match(`\\-?\\d{1,}\\.?\\d*\\${operator}\\-?\\d{1,}\\.?\\d*`)[0];

    let result = prepareForCalculate(partExpr, operator);

    let newExpr = expr.replace(partExpr, result);
    newExpr = newExpr.replace('--', '+').replace('++', '+').replace('*+', '*').replace('/+', '/');


    return calculateExpr(newExpr);
}

function  getOperator(expr) {
    let multiplyIndex = expr.indexOf(operators[0]);
    let decideIndex = expr.indexOf(operators[1]);

    if (multiplyIndex !== -1 || decideIndex !== -1) {
        multiplyIndex = multiplyIndex === -1 ? expr.length : multiplyIndex;
        decideIndex = decideIndex === -1 ? expr.length : decideIndex;

        return expr.charAt(Math.min(multiplyIndex, decideIndex));
    }
    
    let plusIndex = expr.indexOf(operators[2]);
    let minusIndex = expr.substring(1).indexOf(operators[3]);

    if (plusIndex !== -1 || minusIndex !== -1) {
        plusIndex = plusIndex === -1 ? expr.length : plusIndex;
        minusIndex = minusIndex === -1 ? expr.length : minusIndex + 1;

        return expr.charAt(Math.min(plusIndex, minusIndex));
    }
}


function prepareForCalculate(expr, operator) {
    return calculate(Number(expr.match(/^\-?\d{1,}\.?\d*/)[0]),
                     Number(expr.match(`\\${operator}\\-?\\d{1,}\\.?\\d*$`)[0].substring(1)), operator).toFixed(14).toString();
}

function calculate(a, b, operator) {
    switch (operator) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            if (Number.isFinite(a / b))
                return a / b;
            else
                throw Error("TypeError: Division by zero.");
    }
}


module.exports = {
    expressionCalculator
}