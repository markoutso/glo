import AST from './AST';

export default abstract class BinaryAST<
  L extends AST = AST,
  R extends AST = AST
> extends AST {
  private _left!: L;
  private _right!: R;

  public get left() {
    return this._left;
  }

  public set left(value: L) {
    const indexOfCurrent = this._children.indexOf(this._left);
    if (indexOfCurrent !== -1) {
      this._children.splice(indexOfCurrent, 1);
    }
    this.addChild(value);
    this._left = value;
  }

  public get right() {
    return this._right;
  }

  public set right(value: R) {
    const indexOfCurrent = this._children.indexOf(this._right);
    if (indexOfCurrent !== -1) {
      this._children.splice(indexOfCurrent, 1);
    }
    this.addChild(value);
    this._right = value;
  }

  constructor(left: L, right: R) {
    super();
    this.left = left;
    this.right = right;
  }
}
