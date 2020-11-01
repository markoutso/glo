import GLOSymbol from './GLOSymbol';

export default class ProgramSymbol extends GLOSymbol {
  constructor(name: string) {
    super(name);
  }

  public print() {
    return 'Πρόγραμμα';
  }
}
