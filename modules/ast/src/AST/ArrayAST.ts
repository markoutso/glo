import TypeAST from './TypeAST';
import { createGLOArray, GLODataType } from '@glossa-glo/data-types';
import AST from './AST';

export default class ArrayAST extends TypeAST {
  get dataType() {
    if (!this.componentType.dataType) {
      throw new Error(
        'Program error: Could not calculate ArrayAST data type: component type has no data type',
      );
    }

    return createGLOArray(
      this.componentType.dataType,
      this.dimensionLength.length,
    );
  }

  constructor(
    public readonly dimensionLength: AST[],
    public readonly componentType: TypeAST,
  ) {
    super();
    this.addChild(componentType);
  }
}
