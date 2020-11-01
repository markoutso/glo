import { GLOInteger } from '@glossa-glo/data-types';
import AST from './AST';

export default class SubrangeAST extends AST {
  constructor(
    public readonly left: GLOInteger,
    public readonly right: GLOInteger,
  ) {
    super();
  }
}
