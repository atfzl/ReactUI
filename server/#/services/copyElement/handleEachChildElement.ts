import GetRuntimeProps, {
  isReactElementIdentifier,
} from '#/common/api/GetRuntimeProps';
import { isInterinsicTag } from '#/common/utils';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import {
  getAttributes,
  getCursor,
  getTagName,
  traverseNodeReferences,
} from '#/utils/tsNode';
import * as electron from 'electron';
import * as _ from 'lodash';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as ts from 'typescript';

const getChildRuntimeValue = (value: any) => {
  let newValue = '';
  switch (true) {
    case value === isReactElementIdentifier:
      newValue = '{null}';
      break;
    case typeof value === 'string':
      newValue = `{"${value}"}`;
      break;
    case typeof value === 'number':
      newValue = `{${value}}`;
      break;
    default:
      newValue = `{${JSON.stringify(value)}}`;
      break;
  }
  return newValue;
};

const handleEachChildElement = (
  rb: ReplacementBuilder,
  sourceFileDeclarationIdentifiers: ts.BindingName[],
  incrementIdentifierName: (s: string) => string,
) => ({
  element: elementNode,
  index,
}: {
  element: ts.JsxChild;
  index: number;
}) => {
  if (ts.isJsxElement(elementNode) || ts.isJsxSelfClosingElement(elementNode)) {
    const tags = getTagName(elementNode);
    const openingTag = tags[0];

    const interinsicTag = isInterinsicTag(openingTag.getText());

    if (!interinsicTag) {
      tags.forEach(tag => {
        rb.replaceNodeWithText(tag, incrementIdentifierName(tag.getText()));
      });
    }

    return GetRuntimeProps.callRenderer(
      electron.BrowserWindow.getFocusedWindow()!,
      getCursor(elementNode),
    ).pipe(
      switchMap(props => {
        const newProps: string[] = [];

        Object.keys(props).forEach(prop => {
          const value = props[prop];

          if (prop === isReactElementIdentifier) {
            return;
          }

          if (prop === 'children') {
            return;
          }

          const newValue = getChildRuntimeValue(value);

          newProps.push(` ${prop}=${newValue}`);
        });

        if (newProps.length) {
          const newPropsText = newProps.join('\n');

          const attributes = getAttributes(elementNode);

          rb.replaceNodeWithText(attributes, newPropsText);
        }

        if (!interinsicTag) {
          return traverseNodeReferences(
            openingTag,
            sourceFileDeclarationIdentifiers,
          );
        }

        return EMPTY;
      }),
    );
  }

  const parent = elementNode.parent;

  if (ts.isJsxElement(parent) || ts.isJsxSelfClosingElement(parent)) {
    return GetRuntimeProps.callRenderer(
      electron.BrowserWindow.getFocusedWindow()!,
      getCursor(parent),
    ).pipe(
      switchMap(props => {
        if (!props.children) {
          return EMPTY;
        }

        if (_.isArray(props.children)) {
          if (props.children[index]) {
            rb.replaceNodeWithText(
              elementNode,
              getChildRuntimeValue(props.children[index]),
            );
          }
        } else {
          rb.replaceNodeWithText(
            elementNode,
            getChildRuntimeValue(props.children),
          );
        }

        return EMPTY;
      }),
    );
  }

  return EMPTY;
};

export default handleEachChildElement;
