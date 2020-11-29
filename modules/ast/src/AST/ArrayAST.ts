import TypeAST from './TypeAST';
import { createGLOArray, GLODataType } from '@glossa-glo/data-types';
import AST from './AST';

export default class ArrayAST extends TypeAST {
  public dimensionLengthNumbers: number[] = []; // Filled by SimplifyConstants

  get dataType() {
    if (!this.componentType.dataType) {
      throw new Error(
        'Program error: Could not calculate ArrayAST data type: component type has no data type',
      );
    }

    if (this.dimensionLengthNumbers.length !== this.dimensionLength.length) {
      throw new Error(
        'Program error: Could not calculate ArrayAST data type: dimension length numbers not filled',
      );
    }

    return createGLOArray(
      this.componentType.dataType,
      this.dimensionLengthNumbers,
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
