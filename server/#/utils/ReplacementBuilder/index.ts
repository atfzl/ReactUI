import { Replacement } from '#/utils/Replacement';
import * as ts from 'typescript';

export class ReplacementBuilder {
  private replacements: Replacement[];
  private sourceNode: ts.Node;

  constructor(sourceNode: ts.Node, replacements: Replacement[] = []) {
    this.sourceNode = sourceNode;
    this.replacements = replacements;
  }

  public insert(pos: number, text: string) {
    this.replacements.push(Replacement.insert(pos, text));

    return this;
  }

  public delete(start: number, end: number) {
    this.replacements.push(Replacement.delete(start, end));

    return this;
  }

  public deleteNode(node: ts.Node) {
    this.replacements.push(
      Replacement.delete(
        node.getStart() - this.sourceNode.getStart(),
        node.getEnd() - this.sourceNode.getStart(),
      ),
    );

    return this;
  }

  public replaceNodeWithText(node: ts.Node, text: string) {
    this.replacements = this.replacements.concat([
      Replacement.delete(
        node.getStart() - this.sourceNode.getStart(),
        node.getEnd() - this.sourceNode.getStart(),
      ),
      Replacement.insert(node.getStart() - this.sourceNode.getStart(), text),
    ]);

    return this;
  }

  public replaceNodeUsingMapper(node: ts.Node, mapper: (s: string) => string) {
    return this.replaceNodeWithText(node, mapper(node.getText()));
  }

  public applyReplacements() {
    return Replacement.applyReplacements(
      this.sourceNode.getText(),
      this.replacements,
    );
  }
}
