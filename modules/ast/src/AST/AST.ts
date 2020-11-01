import { DebugInfoProvider } from '@glossa-glo/error';
import { GLODataType } from '@glossa-glo/data-types';

export default abstract class AST extends DebugInfoProvider {
  constructor(..._: any[]) {
    super();
  }

  public promote?: Map<typeof GLODataType, () => AST>;

  protected readonly _children: AST[] = [];
  public parent: AST | null = null;

  get children() {
    return this._children;
  }

  public addChild(...children: AST[]) {
    children.forEach(child => {
      child.parent = this;
      this._children.push(child);
    });
  }
}
