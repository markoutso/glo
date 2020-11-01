import ArrayAccessAST from './ArrayAccessAST';
import AST from './AST';
import VariableAST from './VariableAST';

export default class ReadAST extends AST {
  constructor(public readonly args: (VariableAST | ArrayAccessAST)[]) {
    super();
    this.addChild(...args);
  }
}
