import { Lexer } from '@glossa-glo/lexer';
import { Parser } from '@glossa-glo/parser';
import { Interpreter } from '@glossa-glo/interpreter';
import {
  SymbolBuilder,
  TypeChecker,
  SimplifyConstants,
} from '@glossa-glo/semantic-analyzer';
import { BaseSymbolScope } from '@glossa-glo/symbol';
import injectLibraryToScope from '@glossa-glo/library';

export default async function interpret(
  sourceCode: string,
  options: {
    read: (linePosition: number) => Promise<string[]>;
    write: (...data: string[]) => Promise<void>;
  },
): Promise<void> {
  const lexer = new Lexer(sourceCode);
  const parser = new Parser(lexer);
  const tree = parser.run();
  const baseScope = new BaseSymbolScope('root');
  injectLibraryToScope(baseScope);
  new SimplifyConstants(tree, baseScope).run();
  new SymbolBuilder(tree, baseScope, parser.isPseudocode).run();
  new TypeChecker(tree, baseScope, parser.isPseudocode).run();
  const interpreter = new Interpreter(tree, baseScope, options);
  await interpreter.run();
}
