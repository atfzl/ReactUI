import { TagCursor } from '#/common/models/file';
import { Replacement } from '#/utils/Replacement';
import { findNodeByTag } from '#/utils/tsNode';
import { createSourceFileFromText } from '#/utils/tsSourceFile';
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as ts from 'typescript';

export default (cursor: TagCursor) => (fileContent: string) => {
  return of(createSourceFileFromText(cursor.fileName, fileContent)).pipe(
    map(findNodeByTag<ts.JsxOpeningLikeElement>(cursor)),
    filter(x => !!x),
    map(x => {
      const elementNode = x!;
      const replacements = [Replacement.deleteNode(elementNode)];

      if (
        !ts.isJsxElement(elementNode.parent) &&
        !ts.isJsxFragment(elementNode.parent)
      ) {
        replacements.push(Replacement.insert(elementNode.getStart(), 'null'));
      }

      return replacements;
    }),
  );
};
