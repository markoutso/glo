import { Lexer } from '@glossa-glo/lexer';
import { Parser } from '@glossa-glo/parser';
import { Interpreter } from '@glossa-glo/interpreter';
import { SymbolBuilder, TypeChecker } from '@glossa-glo/semantic-analyzer';
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
  const tree = new Parser(lexer).run();
  const baseScope = new BaseSymbolScope('root');
  injectLibraryToScope(baseScope);
  new SymbolBuilder(tree, baseScope).run();
  new TypeChecker(tree, baseScope).run();
  const interpreter = new Interpreter(tree, baseScope, options);
  await interpreter.run();
}
