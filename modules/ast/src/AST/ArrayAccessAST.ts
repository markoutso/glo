import AST from './AST';
import VariableAST from './VariableAST';

export default class ArrayAccessAST extends AST {
  constructor(public array: VariableAST, public accessors: AST[]) {
    super();
    this.addChild(array, ...accessors);
  }
}
