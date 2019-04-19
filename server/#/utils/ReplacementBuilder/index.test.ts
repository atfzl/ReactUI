import { findElementAtCursor$ } from '#/utils/tsNode';
import { map, switchMap } from 'rxjs/operators';
import { ReplacementBuilder } from '.';

const fileName = `${__dirname}/__fixtures__/source1.tsx`;

it('should replace div with text', done => {
  findElementAtCursor$({ fileName, lineNumber: 6, columnNumber: 7 })
    .pipe(
      map(cursorNode => {
        const rb = new ReplacementBuilder(cursorNode.getSourceFile());

        rb.replaceNodeWithText(cursorNode, 'replaced text');

        return rb.applyReplacements();
      }),
    )
    .subscribe(fileText => {
      expect(fileText).toMatchSnapshot();
      done();
    });
});

it('should delete node', done => {
  findElementAtCursor$({ fileName, lineNumber: 6, columnNumber: 7 })
    .pipe(
      map(cursorNode => {
        const rb = new ReplacementBuilder(cursorNode.getSourceFile());

        rb.deleteNode(cursorNode);

        return rb.applyReplacements();
      }),
    )
    .subscribe(fileText => {
      expect(fileText).toMatchSnapshot();
      done();
    });
});

it('delete should work with a jsxElement as sourceNode', done => {
  findElementAtCursor$({ fileName, lineNumber: 5, columnNumber: 5 })
    .pipe(
      switchMap(cursorNode => {
        return findElementAtCursor$(
          { fileName, lineNumber: 6, columnNumber: 7 },
          cursorNode,
        ).pipe(
          map(elementNode => {
            const rb = new ReplacementBuilder(cursorNode);

            rb.deleteNode(elementNode);

            return rb.applyReplacements();
          }),
        );
      }),
    )
    .subscribe(nodeText => {
      expect(nodeText).toMatchSnapshot();
      done();
    });
});

it('replaceNodeWithText should work with a jsxElement as sourceNode', done => {
  findElementAtCursor$({ fileName, lineNumber: 5, columnNumber: 5 })
    .pipe(
      switchMap(cursorNode => {
        return findElementAtCursor$(
          { fileName, lineNumber: 6, columnNumber: 7 },
          cursorNode,
        ).pipe(
          map(elementNode => {
            const rb = new ReplacementBuilder(cursorNode);

            rb.replaceNodeWithText(elementNode, 'rrrr');

            return rb.applyReplacements();
          }),
        );
      }),
    )
    .subscribe(nodeText => {
      expect(nodeText).toMatchSnapshot();
      done();
    });
});
