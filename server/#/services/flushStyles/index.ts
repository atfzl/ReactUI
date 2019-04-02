import { TagCursor } from '#/common/models/file';
import { StyleObject } from '#/common/models/Style';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import { findNode$, isAtCursor } from '#/utils/tsNode';
import { createSourceFile$ } from '#/utils/tsSourceFile';
import * as _ from 'lodash/fp';
import * as R from 'ramda';
import { map, pluck, switchMap } from 'rxjs/operators';
import * as ts from 'typescript';

const stringifyStyles = (styleObject: StyleObject) => {
  return R.pipe(
    R.keys,
    R.map(property => `${property}: ${styleObject[property]};`),
    R.join('\n'),
  )(styleObject);
};

const flushStyles$ = R.curry((cursor: TagCursor, styleObject: StyleObject) => {
  return createSourceFile$(cursor.fileName).pipe(
    pluck('file'),
    switchMap(
      findNode$<ts.TaggedTemplateExpression>(
        R.both(isAtCursor(cursor), ts.isTaggedTemplateExpression),
      ),
    ),
    map(cursorNode => {
      const replacementBuilder = new ReplacementBuilder(
        cursorNode.getSourceFile(),
      );

      const styleString = stringifyStyles(styleObject);

      if (ts.isNoSubstitutionTemplateLiteral(cursorNode.template)) {
        replacementBuilder.replaceNodeWithText(
          cursorNode.template,
          '`\n' + styleString + '\n`',
        );
      } else {
        const originalTemplateString = _.trimChars(
          '`',
          cursorNode.template.getText(),
        );

        replacementBuilder.replaceNodeWithText(
          cursorNode.template,
          '`' + originalTemplateString + styleString + '\n`',
        );
      }

      return replacementBuilder.applyReplacements();
    }),
  );
});

export default flushStyles$;
