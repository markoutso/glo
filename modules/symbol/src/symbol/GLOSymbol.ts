import { DebugInfoProvider } from '@glossa-glo/error';

export default class GLOSymbol extends DebugInfoProvider {
  public readonly name: string;

  public print() {
    return 'Αναγνωριστικό';
  }

  constructor(name: string, ..._: any[]) {
    super();
    this.name = name;
  }
}
