import GLODataType from './GLODataType';

export default class GLOBoolean extends GLODataType {
  public static readonly true: GLOBoolean = new GLOBoolean(true);
  public static readonly false: GLOBoolean = new GLOBoolean(false);

  constructor(private readonly value: boolean) {
    super();
    if (value === true) {
      return GLOBoolean.true;
    } else {
      return GLOBoolean.false;
    }
  }

  public equals(right: GLOBoolean): boolean {
    return this.value == right.value;
  }

  public notEquals(right: GLOBoolean): boolean {
    return this.value != right.value;
  }

  public print(): string {
    return this.value ? 'ΑΛΗΘΗΣ' : 'ΨΕΥΔΗΣ';
  }
}
