import { GLODataType } from '.';

export default class GLOProcedure extends GLODataType {
  constructor(
    public readonly call: (
      args: GLODataType[],
      rewrite: ({ name: string; accessors: GLODataType[] | null } | false)[],
    ) => Promise<void>,
  ) {
    super();
  }

  public print(): string {
    throw new Error('Program error: Cannot print procedure');
  }
}
