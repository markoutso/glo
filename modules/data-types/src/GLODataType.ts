interface GLODataType {
  add(right: GLODataType): GLODataType;
  subtract(right: GLODataType): GLODataType;
  multiply(right: GLODataType): GLODataType;
  divide(right: GLODataType): GLODataType;
  integerDivide(right: GLODataType): GLODataType;
  exponent(right: GLODataType): GLODataType;
  mod(right: GLODataType): GLODataType;
  equals(right: GLODataType): boolean;
  notEquals(right: GLODataType): boolean;
  lessThan(right: GLODataType): boolean;
  greaterThan(right: GLODataType): boolean;
  lessEqualsThan(right: GLODataType): boolean;
  greaterEqualsThan(right: GLODataType): boolean;
  unaryPlus(): GLODataType;
  unaryMinus(): GLODataType;
}

abstract class GLODataType {
  constructor(..._: any[]) {}

  public static defaultValue?: GLODataType;

  public static multitype?: typeof GLODataType[];

  public static isArrayType = false;
  public isArray = false;

  public promote?: Map<typeof GLODataType, () => GLODataType>;

  public abstract print(): string;

  public static promotable?: typeof GLODataType[];
}

export default GLODataType;
