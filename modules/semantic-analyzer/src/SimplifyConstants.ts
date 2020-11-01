// // WIP
// import * as AST from '@glossa-glo/ast';
// import GLOError from '@glossa-glo/error';
// import * as Types from '@glossa-glo/data-types';
// import { BaseSymbolScope } from '@glossa-glo/symbol';

// export default class SimplifyConstants extends AST.ASTVisitor<Types.GLODataType | null> {
//   constructor(
//     protected readonly ast: AST.AST,
//     private readonly baseScope: BaseSymbolScope,
//   ) {
//     super();
//   }

//   public visitVariable(node: AST.VariableAST) {
//     return null;
//   }

//   public visitProgram(node: AST.ProgramAST) {
//     node.declarations.forEach(this.visit.bind(this));
//     node.statementList.forEach(this.visit.bind(this));
//     return null;
//   }

//   public visitVariableDeclaration(node: AST.VariableDeclarationAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }

//   public visitProcedureDeclaration(node: AST.ProcedureDeclarationAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }

//   public visitFunctionDeclaration(node: AST.FunctionDeclarationAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }

//   public visitFunctionCall(node: AST.FunctionCallAST) {
//     const args = node.args.map(arg => this.visit(arg));
//     const func = this.baseScope.resolveValue<Types.GLOFunction>(node.name)!;

//     for (const arg of args) {
//       if (arg === null) {
//         return null;
//       }
//     }

//     func.call(args as Types.GLODataType[], node.args);

//     const returnValue = this.baseScope.resolveValue<Types.GLOFunction>(
//       node.name,
//     )!.returnValue;

//     if (!returnValue) {
//       return null;
//     }

//     return returnValue;
//   }

//   public visitProcedureCall(node: AST.ProcedureCallAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }

//   public visitIntegerConstant(node: AST.IntegerConstantAST) {
//     return node.value;
//   }

//   public visitRealConstant(node: AST.RealConstantAST) {
//     return node.value;
//   }

//   public visitStringConstant(node: AST.StringConstantAST) {
//     return node.value;
//   }

//   public visitTrue(node: AST.TrueConstantAST) {
//     return new Types.GLOBoolean(true);
//   }

//   public visitFalse(node: AST.FalseConstantAST) {
//     return new Types.GLOBoolean(false);
//   }

//   public visitUnaryPlus(node: AST.UnaryPlusAST) {
//     const target = this.visit(node.target);
//     return target ? target.unaryPlus() : null;
//   }

//   public visitUnaryMinus(node: AST.UnaryMinusAST) {
//     const target = this.visit(node.target);
//     return target ? target.unaryMinus() : null;
//   }

//   public visitAnd(node: AST.AndAST) {
//     const left = this.visit(node.left);
//     const right = this.visit(node.right);
//     return right && left
//       ? new Types.GLOBoolean(
//           left.equals(Types.GLOBoolean.true) &&
//             right.equals(Types.GLOBoolean.true),
//         )
//       : null;
//   }
//   public visitOr(node: AST.OrAST) {
//     const left = this.visit(node.left);
//     const right = this.visit(node.right);
//     return right && left
//       ? new Types.GLOBoolean(
//           left.equals(Types.GLOBoolean.true) ||
//             right.equals(Types.GLOBoolean.true),
//         )
//       : null;
//   }
//   public visitNot(node: AST.NotAST) {
//     const target = this.visit(node.target);
//     return target
//       ? target.equals(Types.GLOBoolean.true)
//         ? Types.GLOBoolean.false
//         : Types.GLOBoolean.true
//       : null;
//   }

//   public visitPlus(node: AST.PlusAST) {
//     const left = this.visit(node.left);
//     const right = this.visit(node.right);

//     return left && right ? left.add(right) : null;
//   }

//   public visitMinus(node: AST.MinusAST) {
//     const left = this.visit(node.left);
//     const right = this.visit(node.right);

//     return left && right ? left.subtract(right) : null;
//   }

//   public visitIntegerDivision(node: AST.IntegerDivisionAST) {
//     const right = this.visit(node.right);

//     if (right.equals(new Types.GLOInteger(0))) {
//       throw new GLOError(node, 'Δεν μπορώ να διαιρέσω με το μηδέν');
//     }

//     return this.visit(node.left).integerDivide(right);
//   }

//   public visitRealDivision(node: AST.RealDivisionAST) {
//     const right = this.visit(node.right);

//     if (
//       right.equals(new Types.GLOInteger(0)) ||
//       right.equals(new Types.GLOReal(0))
//     ) {
//       throw new GLOError(node, 'Δεν μπορώ να διαιρέσω με το μηδέν');
//     }

//     return this.visit(node.left).divide(right);
//   }

//   public visitMultiplication(node: AST.MultiplicationAST) {
//     return this.visit(node.left).multiply(this.visit(node.right));
//   }

//   public visitExponentiation(node: AST.MultiplicationAST) {
//     return this.visit(node.left).exponent(this.visit(node.right));
//   }

//   public visitMod(node: AST.ModAST) {
//     const right = this.visit(node.right);

//     if (
//       right.equals(new Types.GLOInteger(0)) ||
//       right.equals(new Types.GLOReal(0))
//     ) {
//       throw new GLOError(node, 'Δεν μπορώ να κάνω mod με το μηδέν');
//     }

//     return this.visit(node.left).mod(right);
//   }

//   public visitEquals(node: AST.EqualsAST) {
//     return new Types.GLOBoolean(
//       this.visit(node.left).equals(this.visit(node.right)),
//     );
//   }
//   public visitNotEquals(node: AST.NotEqualsAST) {
//     return new Types.GLOBoolean(
//       this.visit(node.left).notEquals(this.visit(node.right)),
//     );
//   }
//   public visitGreaterThan(node: AST.GreaterThanAST) {
//     return new Types.GLOBoolean(
//       this.visit(node.left).greaterThan(this.visit(node.right)),
//     );
//   }
//   public visitLessThan(node: AST.LessThanAST) {
//     return new Types.GLOBoolean(
//       this.visit(node.left).lessThan(this.visit(node.right)),
//     );
//   }
//   public visitGreaterEquals(node: AST.GreaterEqualsAST) {
//     return new Types.GLOBoolean(
//       this.visit(node.left).greaterEqualsThan(this.visit(node.right)),
//     );
//   }
//   public visitLessEquals(node: AST.LessEqualsAST) {
//     return new Types.GLOBoolean(
//       this.visit(node.left).lessEqualsThan(this.visit(node.right)),
//     );
//   }

//   public visitAssignment(node: AST.AssignmentAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitEmpty(node: AST.EmptyAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitInteger(node: AST.IntegerAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitReal(node: AST.RealAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitType(node: AST.TypeAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitBoolean(node: AST.BooleanAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitIf(node: AST.IfAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitString(node: AST.StringAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitFor(node: AST.ForAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitWhile(node: AST.WhileAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitRepeat(node: AST.RepeatAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitSubrange(node: AST.SubrangeAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }
//   public visitArray(node: AST.ArrayAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }

//   public visitArrayAccess(node: AST.ArrayAccessAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }

//   public visitRead(node: AST.ReadAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }

//   public visitWrite(node: AST.WriteAST) {
//     node.children.forEach(this.visit.bind(this));
//     return null;
//   }

// public run() {
//   return this.visit(this.ast);
// }
// }
