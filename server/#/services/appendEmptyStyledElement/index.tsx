import { findElementAtCursor$ } from '#/utils/tsNode';
import { getDeclarationIdentifiersAtSourceFile } from '#/utils/tsNode/getDeclarationIdentifiers';
import incrementIdentifierNameFrom from '#/utils/tsNode/incrementIdentifierNameFrom';
import { pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import pasteElement from '../pasteElement';

const appendEmptyStyledElement = (tagName: string) =>
  pipe(
    findElementAtCursor$,
    switchMap(cursorNode =>
      getDeclarationIdentifiersAtSourceFile(cursorNode.getSourceFile()).pipe(
        switchMap(declarationIdentifiers => {
          const incrementIdentifierName = incrementIdentifierNameFrom(
            declarationIdentifiers.map(x => x.getText()),
          );

          const generatedTagName = incrementIdentifierName(tagName);

          return pasteElement({
            jsx: `<${generatedTagName}></${generatedTagName}>`,
            insertions: {
              imports: ["import styled from 'styled-components'"],
              declarations: [
                `const ${generatedTagName} = styled.div\`
                 height: 200px;
                 width: 200px;
                 background-color: lightgrey;
                 border: 1px solid black;
             \`;
              `,
              ],
            },
            targetCursorNode: cursorNode,
          });
        }),
      ),
    ),
  );

export default appendEmptyStyledElement;
