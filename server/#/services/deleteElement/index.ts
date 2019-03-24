import { TagCursor } from '#/common/models/file';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import { findNodeByTag } from '#/utils/tsNode';
import { createSourceFileFromText } from '#/utils/tsSourceFile';
import { EMPTY, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as ts from 'typescript';

const deleteElement = (cursor: TagCursor) => (fileContent: string) => {
  return of(createSourceFileFromText(cursor.fileName, fileContent)).pipe(
    map(sourceFileNode => {
      const elementNode = findNodeByTag<ts.JsxOpeningLikeElement>(cursor)(
        sourceFileNode,
      );

      if (!elementNode) {
        return EMPTY;
      }

      const replacementBuilder = new ReplacementBuilder(sourceFileNode);
      replacementBuilder.deleteNode(elementNode);

      if (
        !ts.isJsxElement(elementNode.parent) &&
        !ts.isJsxFragment(elementNode.parent)
      ) {
        replacementBuilder.insert(elementNode.getStart(), 'null');
      }

      return replacementBuilder.applyReplacements();
    }),
  );
};

export default deleteElement;
