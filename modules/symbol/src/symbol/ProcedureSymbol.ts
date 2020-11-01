import GLOSymbol from './GLOSymbol';
import VariableSymbol from './VariableSymbol';

export default class ProcedureSymbol extends GLOSymbol {
  public readonly args: VariableSymbol[];

  constructor(name: string, args: VariableSymbol[]) {
    super(name);
    this.args = args;
  }

  public print() {
    return 'Διαδικασία';
  }
}
