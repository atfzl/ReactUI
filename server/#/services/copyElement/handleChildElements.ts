import { isInterinsicTag } from '#/common/utils';
import { ReplacementBuilder } from '#/utils/ReplacementBuilder';
import { getTagName, traverseNodeReferences } from '#/utils/tsNode';
import { EMPTY } from 'rxjs';
import * as ts from 'typescript';

const handleChildElements = (
  rb: ReplacementBuilder,
  sourceFileDeclarationIdentifiers: ts.BindingName[],
  incrementIdentifierName: (s: string) => string,
) => (elementNode: ts.JsxChild) => {
  if (ts.isJsxElement(elementNode) || ts.isJsxSelfClosingElement(elementNode)) {
    const tags = getTagName(elementNode);
    const openingTag = tags[0];

    if (!isInterinsicTag(openingTag.getText())) {
      tags.forEach(tag => {
        rb.replaceNodeWithText(tag, incrementIdentifierName(tag.getText()));
      });

      // handle props

      return traverseNodeReferences(
        openingTag,
        sourceFileDeclarationIdentifiers,
      );
    }
  }

  return EMPTY;
};

export default handleChildElements;
