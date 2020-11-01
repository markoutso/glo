import { SymbolScope } from '@glossa-glo/symbol';
import absoluteValue from './functions/absoluteValue';
import cosine from './functions/cosine';
import exponential from './functions/exponential';
import naturalLogarithm from './functions/naturalLogarithm';
import sine from './functions/sine';
import squareRoot from './functions/squareRoot';
import tangent from './functions/tangent';
import trunctuateReal from './functions/trunctuateReal';

export default function injectLibraryToScope(scope: SymbolScope) {
  cosine.inject(scope);
  exponential.inject(scope);
  naturalLogarithm.inject(scope);
  sine.inject(scope);
  tangent.inject(scope);
  trunctuateReal.inject(scope);
  squareRoot.inject(scope);
  absoluteValue.inject(scope);
}
