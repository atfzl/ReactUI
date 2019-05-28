import GetRuntimeProps, {
  isReactElementIdentifier,
} from '#/common/api/GetRuntimeProps';
import { TagCursor } from '#/common/models/file';
import { isInterinsicTag } from '#/common/utils';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import {
  getAttributes,
  getTagName,
  traverseNodeReferences,
} from '#/utils/tsNode';
import * as electron from 'electron';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as ts from 'typescript';

const handleChildElements = (
  rb: ReplacementBuilder,
  sourceFileDeclarationIdentifiers: ts.BindingName[],
  incrementIdentifierName: (s: string) => string,
  cursor: TagCursor,
) => (elementNode: ts.JsxChild) => {
  // TODO: handle else
  if (ts.isJsxElement(elementNode) || ts.isJsxSelfClosingElement(elementNode)) {
    const tags = getTagName(elementNode);
    const openingTag = tags[0];

    if (!isInterinsicTag(openingTag.getText())) {
      tags.forEach(tag => {
        rb.replaceNodeWithText(tag, incrementIdentifierName(tag.getText()));
      });

      const win = electron.BrowserWindow.getFocusedWindow()!;

      return GetRuntimeProps.callRenderer(win, cursor).pipe(
        switchMap(props => {
          const newProps: string[] = [];

          Object.keys(props).forEach(prop => {
            const value = props[prop];

            if (prop === 'children') {
              return;
            }

            let newValue = '';
            switch (true) {
              case value === isReactElementIdentifier:
                newValue = '{null}';
                break;
              case typeof value === 'string':
                newValue = `"${value}"`;
                break;
              case typeof value === 'number':
                newValue = `{${value}}`;
                break;
              default:
                newValue = JSON.stringify(value);
            }

            newProps.push(`${prop}=${newValue}`);
          });

          if (newProps.length) {
            const newPropsText = newProps.join('\n');

            const attributes = getAttributes(elementNode);

            rb.replaceNodeWithText(attributes, newPropsText);
          }

          return traverseNodeReferences(
            openingTag,
            sourceFileDeclarationIdentifiers,
          );
        }),
      );
    }
  }

  return EMPTY;
};

export default handleChildElements;
