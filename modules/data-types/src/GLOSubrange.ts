import { GLODataType, GLOInteger } from '.';

export default class GLOSubrange extends GLODataType {
  constructor(
    public readonly left: GLOInteger,
    public readonly right: GLOInteger,
  ) {
    super();
  }

  public print(): string {
    throw new Error('Program error: Cannot print subrange');
  }

  public runtimeValidation(value: GLOInteger): boolean {
    return (
      this.left.lessEqualsThan(value) && this.right.greaterEqualsThan(value)
    );
  }
}
