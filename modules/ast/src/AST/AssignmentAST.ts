import BinaryAST from './BinaryAST';
import VariableAST from './VariableAST';
import ArrayAccessAST from './ArrayAccessAST';
import AST from './AST';

export default class AssignmentAST extends BinaryAST {
  constructor(
    public readonly left: VariableAST | ArrayAccessAST,
    public readonly right: AST,
  ) {
    super(left, right);
  }
}
