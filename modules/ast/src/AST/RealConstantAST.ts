import ConstantAST from './ConstantAST';
import * as Types from '@glossa-glo/data-types';

export default class RealConstantAST extends ConstantAST {
  public readonly value: Types.GLOReal;
  dataType = Types.GLOReal;
  constructor(value: Types.GLOReal) {
    super();
    this.value = value;
  }
}
