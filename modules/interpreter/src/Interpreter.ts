import * as Types from '@glossa-glo/data-types';
import * as AST from '@glossa-glo/ast';
import {
  SymbolScope,
  BaseSymbolScope,
  LocalSymbolScope,
  SymbolScopeType,
  VariableSymbol,
  GLOSymbol,
} from '@glossa-glo/symbol';
import { IntegerConstantAST, VariableAST } from '@glossa-glo/ast';
import GLOError, { assertEquality, assert } from '@glossa-glo/error';
import { toUpperCaseNormalizedGreek } from '@glossa-glo/case-insensitive-map';
import cloneDeep from 'clone-deep';

export class Interpreter extends AST.ASTVisitor<Promise<Types.GLODataType>> {
  public scope: SymbolScope;

  constructor(
    protected readonly ast: AST.AST,
    baseScope: BaseSymbolScope,
    private readonly helpers: {
      read: (lineNumber: number) => Promise<string[]>;
      write: (...data: string[]) => Promise<void>;
    },
  ) {
    super();
    this.scope = baseScope;
  }

  private async withNewScope<T>(
    name: string,
    fn: (scope: LocalSymbolScope) => Promise<T>,
  ) {
    const scope = this.scope.children.get(name);

    if (!scope)
      throw new Error(
        `Program error: Scope with name ${name} does not exist on scope ${this.scope.name}`,
      );

    this.scope = scope;
    const result = await fn(scope);
    this.scope = this.scope.getParent()!;
    return result;
  }

  public async visitAssignment(node: AST.AssignmentAST) {
    const left = node.left;
    const newValue = await this.visit(node.right);

    if (left instanceof AST.VariableAST) {
      if (
        this.scope.type === SymbolScopeType.Function && // Is in function
        this.scope.nameEquals(left.name) // Variable name matches function name
      ) {
        this.scope.changeFunctionReturnType(left.name, newValue);
      } else this.scope.changeValue(left.name, newValue);
    } else if (left instanceof AST.ArrayAccessAST) {
      const dimensionLength = this.scope.resolve(
        left.array.name,
        VariableSymbol,
      )!.dimensionLength!;

      const accessorValues = await Promise.all(
        left.accessors.map(node => this.visit(node)),
      );

      for (let i = 0; i < accessorValues.length; i++) {
        const accessorValue = accessorValues[i];

        assert(
          left.accessors[i],
          accessorValue.greaterEqualsThan(new Types.GLOInteger(1)),
          `Ο δείκτης του πίνακα '${left.array.name}' πρέπει να είναι μεγαλύτερος ή ίσος του 1'`,
        );

        assert(
          left.accessors[i],
          accessorValue.lessEqualsThan(await this.visit(dimensionLength[i])),
          `Ο δείκτης του πίνακα '${
            left.array.name
          }' έχει τιμή ${accessorValue.print()}, εκτός ορίων του πίνακα`,
        );
      }

      this.scope.changeArrayValue(left.array.name, accessorValues, newValue);
    }

    return new Types.GLOVoid();
  }

  public async visitPlus(node: AST.PlusAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return left.add(right);
  }

  public async visitMinus(node: AST.MinusAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return left.subtract(right);
  }

  public async visitIntegerDivision(node: AST.IntegerDivisionAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    if (right.equals(new Types.GLOInteger(0))) {
      throw new GLOError(node, 'Δεν μπορώ να διαιρέσω με το μηδέν');
    }

    return left.integerDivide(right);
  }

  public async visitRealDivision(node: AST.RealDivisionAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    if (
      right.equals(new Types.GLOInteger(0)) ||
      right.equals(new Types.GLOReal(0))
    ) {
      throw new GLOError(node, 'Δεν μπορώ να διαιρέσω με το μηδέν');
    }

    return left.divide(right);
  }

  public async visitMultiplication(node: AST.MultiplicationAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return left.multiply(right);
  }

  public async visitExponentiation(node: AST.MultiplicationAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return left.exponent(right);
  }

  public async visitMod(node: AST.ModAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    if (
      right.equals(new Types.GLOInteger(0)) ||
      right.equals(new Types.GLOReal(0))
    ) {
      throw new GLOError(node, 'Δεν μπορώ να κάνω mod με το μηδέν');
    }

    return left.mod(right);
  }

  public async visitEquals(node: AST.EqualsAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return new Types.GLOBoolean(left.equals(right));
  }
  public async visitNotEquals(node: AST.NotEqualsAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return new Types.GLOBoolean(left.notEquals(right));
  }
  public async visitGreaterThan(node: AST.GreaterThanAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return new Types.GLOBoolean(left.greaterThan(right));
  }
  public async visitLessThan(node: AST.LessThanAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return new Types.GLOBoolean(left.lessThan(right));
  }
  public async visitGreaterEquals(node: AST.GreaterEqualsAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return new Types.GLOBoolean(left.greaterEqualsThan(right));
  }
  public async visitLessEquals(node: AST.LessEqualsAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return new Types.GLOBoolean(left.lessEqualsThan(right));
  }

  public async visitIntegerConstant(node: AST.IntegerConstantAST) {
    return node.value;
  }

  public async visitRealConstant(node: AST.RealConstantAST) {
    return node.value;
  }

  public async visitStringConstant(node: AST.StringConstantAST) {
    return node.value;
  }

  public async visitTrue(node: AST.TrueConstantAST) {
    return new Types.GLOBoolean(true);
  }

  public async visitFalse(node: AST.FalseConstantAST) {
    return new Types.GLOBoolean(false);
  }

  public async visitUnaryPlus(node: AST.UnaryPlusAST) {
    const target = await this.visit(node.target);

    return target.unaryPlus();
  }

  public async visitUnaryMinus(node: AST.UnaryMinusAST) {
    const target = await this.visit(node.target);

    return target.unaryMinus();
  }

  public async visitVariable(
    node: AST.VariableAST,
    initializationCheck = true,
  ) {
    const variableValue = this.scope.resolveValue(node.name);

    if (!variableValue && initializationCheck) {
      throw new GLOError(
        node,
        `Η μεταβλητή '${node.name}' χρησιμοποιήθηκε χωρίς πρώτα να έχει αρχικοποιηθεί`,
      );
    }

    return variableValue || new Types.GLOVoid();
  }

  public async visitEmpty(node: AST.EmptyAST) {
    return new Types.GLOVoid();
  }

  public async visitProgram(node: AST.ProgramAST) {
    return await this.withNewScope(node.name, async () => {
      for (let i = 0; i < node.children.length; i++) {
        await this.visit(node.children[i]);
      }

      return new Types.GLOVoid();
    });
  }

  public async visitConstantDeclaration(node: AST.ConstantDeclarationAST) {
    return new Types.GLOVoid();
  }

  public async visitVariableDeclaration(node: AST.VariableDeclarationAST) {
    return new Types.GLOVoid();
  }

  public async visitReal(node: AST.RealAST) {
    return new Types.GLOVoid();
  }

  public async visitInteger(node: AST.IntegerAST) {
    return new Types.GLOVoid();
  }

  public async visitBoolean(node: AST.BooleanAST) {
    return new Types.GLOVoid();
  }

  public async visitString(node: AST.StringAST) {
    return new Types.GLOVoid();
  }

  public async visitProcedureDeclaration(node: AST.ProcedureDeclarationAST) {
    const procedure = new Types.GLOProcedure(async (args, rewrite) => {
      await this.withNewScope(node.name.name, async scope => {
        const symbol = this.scope.resolve(node.name.name)!; // Guaranteed by TypeChecker
        if (!this.scope.has(symbol)) {
          // Allow recursion
          scope.insert(symbol);
          scope.changeValue(node.name.name, procedure);
          new LocalSymbolScope(
            node.name.name,
            SymbolScopeType.Procedure,
            this.scope,
          );
        }

        // Register parameter values
        node.args
          // Filter uninitialized variables
          .filter((arg, i) => !(args[i] instanceof Types.GLOVoid))
          // Filter unitialized array indices
          .map(arg => arg.name)
          .forEach((argName, i) => {
            scope.changeValue(argName, cloneDeep(args[i]));
          });

        for (let i = 0; i < node.constantDeclarations.length; i++) {
          await this.visit(node.constantDeclarations[i]);
        }
        for (let i = 0; i < node.variableDeclarations.length; i++) {
          await this.visit(node.variableDeclarations[i]);
        }
        for (let i = 0; i < node.statementList.length; i++) {
          await this.visit(node.statementList[i]);
        }

        // Rewrite parameter values in parent scope
        node.args.forEach((arg, i) => {
          const currentRewrite = rewrite[i];

          if (currentRewrite) {
            if (currentRewrite.accessors) {
              scope
                .getParent()!
                .changeArrayValue(
                  currentRewrite.name,
                  currentRewrite.accessors,
                  scope.resolveValue(arg.name)!,
                );
            } else {
              scope
                .getParent()!
                .changeValue(
                  currentRewrite.name,
                  scope.resolveValue(arg.name)!,
                );
            }
          }
        });
      });
    });

    this.scope.changeValue(node.name.name, procedure);
    return new Types.GLOVoid();
  }

  public async visitIf(node: AST.IfAST) {
    const condition = await this.visit(node.condition);
    if (condition.equals(Types.GLOBoolean.true)) {
      for (let i = 0; i < node.statementList.length; i++) {
        await this.visit(node.statementList[i]);
      }
    } else {
      if (node.next) {
        if (Array.isArray(node.next)) {
          for (let i = 0; i < node.next.length; i++) {
            await this.visit(node.next[i]);
          }
        } else {
          await this.visit(node.next);
        }
      }
    }
    return new Types.GLOVoid();
  }

  public async visitAnd(node: AST.AndAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return new Types.GLOBoolean(
      left.equals(Types.GLOBoolean.true) && right.equals(Types.GLOBoolean.true),
    );
  }
  public async visitOr(node: AST.OrAST) {
    const left = await this.visit(node.left);
    const right = await this.visit(node.right);

    return new Types.GLOBoolean(
      left.equals(Types.GLOBoolean.true) || right.equals(Types.GLOBoolean.true),
    );
  }
  public async visitNot(node: AST.NotAST) {
    const target = await this.visit(node.target);

    return target.equals(Types.GLOBoolean.true)
      ? Types.GLOBoolean.false
      : Types.GLOBoolean.true;
  }

  public async visitFunctionCall(node: AST.FunctionCallAST) {
    const args = await Promise.all(node.args.map(arg => this.visit(arg)));
    const func = this.scope.resolveValue<Types.GLOFunction>(node.name)!;

    await func.call(args, node.args);

    const returnValue = this.scope.resolveValue<Types.GLOFunction>(node.name)!
      .returnValue;

    if (!returnValue) {
      throw new GLOError(
        node,
        `Η συνάρτηση '${node.name}' δεν επιστρέφει κάποια τιμή`,
      );
    }

    return returnValue;
  }

  public async visitProcedureCall(node: AST.ProcedureCallAST) {
    const args = await Promise.all(
      node.args.map(arg => {
        if (arg instanceof AST.VariableAST) {
          return this.visitVariable(arg, false);
        } else if (arg instanceof AST.ArrayAccessAST) {
          return this.visitArrayAccess(arg, false);
        } else {
          return this.visit(arg);
        }
      }),
    );
    const procedure = this.scope.resolveValue<Types.GLOProcedure>(node.name)!;

    await procedure.call(
      args,
      await Promise.all(
        node.args.map(async arg => {
          if (arg instanceof AST.VariableAST) {
            return !(this.scope.resolve(arg.name) as VariableSymbol).isConstant
              ? {
                  name: arg.name,
                  accessors: null,
                }
              : false;
          } else if (arg instanceof AST.ArrayAccessAST) {
            return {
              name: arg.array.name,
              accessors: await Promise.all(
                arg.accessors.map(arg => this.visit(arg)),
              ),
            };
          } else return false;
        }),
      ),
    );

    return new Types.GLOVoid();
  }

  public async visitFor(node: AST.ForAST) {
    await this.visitAssignment(
      new AST.AssignmentAST(node.counter, node.startValue),
    );

    if ((await this.visit(node.step)).equals(new Types.GLOInteger(0))) {
      throw new GLOError(node.step, 'Απαγορεύεται επανάληψη με βήμα 0');
    } else {
      while (
        (await this.visit(node.step)).greaterThan(new Types.GLOInteger(0))
          ? (await this.visit(node.counter)).lessEqualsThan(
              await this.visit(node.endValue),
            )
          : (await this.visit(node.counter)).greaterEqualsThan(
              await this.visit(node.endValue),
            )
      ) {
        for (let i = 0; i < node.statementList.length; i++) {
          await this.visit(node.statementList[i]);
        }

        await this.visit(
          new AST.AssignmentAST(
            node.counter,
            new AST.PlusAST(
              node.counter,
              new IntegerConstantAST(
                (await this.visit(
                  node.step,
                )) as Types.GLOInteger /* Guaranteed by TypeChecker */,
              ),
            ),
          ),
        );
      }
    }

    return new Types.GLOVoid();
  }

  public async visitWhile(node: AST.WhileAST) {
    while ((await this.visit(node.condition)).equals(Types.GLOBoolean.true)) {
      for (let i = 0; i < node.statementList.length; i++) {
        await this.visit(node.statementList[i]);
      }
    }
    return new Types.GLOVoid();
  }

  public async visitRepeat(node: AST.RepeatAST) {
    do {
      for (let i = 0; i < node.statementList.length; i++) {
        await this.visit(node.statementList[i]);
      }
    } while ((await this.visit(node.condition)).equals(Types.GLOBoolean.false));
    return new Types.GLOVoid();
  }

  public async visitSubrange(node: AST.SubrangeAST) {
    return new Types.GLOSubrange(node.left, node.right);
  }

  public async visitArray(node: AST.ArrayAST) {
    return new Types.GLOVoid();
  }

  public async visitArrayAccess(
    node: AST.ArrayAccessAST,
    initializationCheck = true,
  ) {
    const array = this.scope.resolveValue(node.array.name);

    if (!array) {
      throw new GLOError(
        node,
        `Program error: Array accessed without being initialized`,
      );
    }

    if (!Types.isGLOArray(array)) {
      throw new GLOError(
        node,
        `Program error: Expected array access variable to be array`,
      );
    }

    const dimensionLength = this.scope.resolve(node.array.name, VariableSymbol)!
      .dimensionLength!;

    assertEquality(
      node,
      node.accessors.length,
      dimensionLength.length,
      `Ο πίνακας είναι ${dimensionLength.length}-διάστατος αλλά ${
        node.accessors.length === 1 ? 'δόθηκε' : 'δόθηκαν'
      } ${node.accessors.length} ${
        node.accessors.length === 1 ? 'δείκτης' : 'δείκτες'
      }`,
    );

    const accessorValues = await Promise.all(
      node.accessors.map(node => this.visit(node)),
    );

    for (let i = 0; i < accessorValues.length; i++) {
      const accessorValue = accessorValues[i];

      assert(
        node.accessors[i],
        accessorValue.greaterEqualsThan(new Types.GLOInteger(1)),
        `Ο δείκτης του πίνακα '${node.array.name}' πρέπει να είναι μεγαλύτερος ή ίσος του 1'`,
      );

      assert(
        node.accessors[i],
        accessorValue.lessEqualsThan(await this.visit(dimensionLength[i])),
        `Ο δείκτης του πίνακα '${
          node.array.name
        }' έχει τιμή ${accessorValue.print()}, εκτός ορίων του πίνακα`,
      );
    }

    const value = array.getValue(accessorValues);

    if (!value && initializationCheck) {
      throw new GLOError(
        node,
        `Προσπάθησα να χρησιμοποιήσω το στοιχείο του πίνακα '${node.array.name}' χωρίς πρώτα αυτό να έχει αρχικοποιηθεί`,
      );
    }

    return value!;
  }

  public async visitFunctionDeclaration(node: AST.FunctionDeclarationAST) {
    const func = new Types.GLOFunction(async args => {
      await this.withNewScope(node.name.name, async scope => {
        const symbol = this.scope.resolve(node.name.name)!; // Guaranteed by TypeChecker
        if (!this.scope.has(symbol)) {
          // Allow recursion
          scope.insert(symbol);
          scope.changeValue(node.name.name, func);
          new LocalSymbolScope(
            node.name.name,
            SymbolScopeType.Function,
            this.scope,
          );
        }

        node.args
          .map(arg => arg.name)
          .forEach((argName, i) => {
            scope.changeValue(argName, args[i]);
          });

        for (let i = 0; i < node.constantDeclarations.length; i++) {
          await this.visit(node.constantDeclarations[i]);
        }
        for (let i = 0; i < node.variableDeclarations.length; i++) {
          await this.visit(node.variableDeclarations[i]);
        }
        for (let i = 0; i < node.statementList.length; i++) {
          await this.visit(node.statementList[i]);
        }
      });
    });

    this.scope.changeValue(node.name.name, func);

    return new Types.GLOVoid();
  }

  public async visitWrite(node: AST.WriteAST) {
    const args = await Promise.all(
      node.args.map(arg => this.visit(arg)),
    ).then(args => args.map(arg => arg.print()));

    await this.helpers.write(...args);

    return new Types.GLOVoid();
  }

  public async visitRead(node: AST.ReadAST) {
    const readings = await this.helpers.read(node.start.linePosition);

    const noInfoError = {
      start: {
        linePosition: -1,
        characterPosition: -1,
      },
      end: {
        linePosition: -1,
        characterPosition: -1,
      },
    };

    if (node.args.length !== readings.length) {
      throw new GLOError(
        noInfoError,
        `Περίμενα να διαβάσω ${node.args.length} ${
          node.args.length === 1 ? 'μεταβλητή' : 'μεταβλητές'
        } αλλά μου ${readings.length === 1 ? 'δόθηκε' : 'δόθηκαν'} ${
          readings.length
        } ${readings.length === 1 ? 'μεταβλητή' : 'μεταβλητές'}`,
      );
    }

    const argNames = node.args.map(arg =>
      arg instanceof VariableAST ? arg.name : arg.array.name,
    );
    const variableTypes = node.args.map((arg, i) =>
      arg instanceof VariableAST
        ? (this.scope.resolve(argNames[i]) as VariableSymbol).type
        : (((this.scope.resolve(argNames[i]) as VariableSymbol).type as any)
            .componentType as typeof Types.GLODataType),
    );

    const values = readings.map((str, i) => {
      const expectedType = variableTypes[i];
      const name = argNames[i];

      if (expectedType === Types.GLOBoolean) {
        if (toUpperCaseNormalizedGreek(str) === 'ΑΛΗΘΗΣ') {
          return new Types.GLOBoolean(true);
        } else if (toUpperCaseNormalizedGreek(str) === 'ΨΕΥΔΗΣ') {
          return new Types.GLOBoolean(false);
        } else {
          throw new GLOError(
            noInfoError,
            `Περίμενα να διαβάσω λογική τιμή(ΑΛΗΘΗΣ ή ΨΕΥΔΗΣ) στη μεταβλητή ${name} αλλά έλαβα μη έγκυρη λογική τιμή '${str}'`,
          );
        }
      } else if (expectedType === Types.GLOReal) {
        if (/^[+-]?\d+(\.\d+)*$/.test(str)) {
          return new Types.GLOReal(parseFloat(str));
        } else {
          throw new GLOError(
            noInfoError,
            `Περίμενα να διαβάσω πραγματική τιμή στη μεταβλητή ${name} αλλά έλαβα μη έγκυρη πραγματική τιμή '${str}'`,
          );
        }
      } else if (expectedType === Types.GLOInteger) {
        if (/^[+-]?\d+$/.test(str)) {
          return new Types.GLOInteger(parseInt(str));
        } else {
          throw new GLOError(
            noInfoError,
            `Περίμενα να διαβάσω ακέραια τιμή στη μεταβλητή ${name} αλλά έλαβα μη έγκυρη ακέραια τιμή '${str}'`,
          );
        }
      } else if (expectedType === Types.GLOString) {
        return new Types.GLOString(str);
      } else {
        throw new Error(
          `Invalid expected read type ${expectedType.constructor.name}`,
        );
      }
    });

    for (let i = 0; i < node.args.length; i++) {
      const arg = node.args[i];
      const value = values[i];

      // const valueType = value.constructor as typeof Types.GLODataType;

      // const name = argNames[i];
      // const variableType = variableTypes[i];

      // Types.assertTypeEquality({
      //   node: arg,
      //   left: variableType,
      //   right: valueType,
      //   allowPromoteLeft: false,
      //   message: `Προσπάθησα να διαβάσω την τιμή '${value.print()}' τύπου RIGHT_TYPE στην μεταβλητή '${name}' μη συμβατού τύπου LEFT_TYPE`,
      // });

      if (arg instanceof AST.VariableAST) {
        this.scope.changeValue(arg.name, value);
      } else {
        this.scope.changeArrayValue(
          arg.array.name,
          await Promise.all(arg.accessors.map(arg => this.visit(arg))),
          value,
        );
      }
    }

    return new Types.GLOVoid();
  }

  public async run() {
    await this.visit(this.ast);
    return;
  }
}
