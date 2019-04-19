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
  }

  public delete(start: number, end: number) {
    this.replacements.push(Replacement.delete(start, end));
  }

  public deleteNode(node: ts.Node) {
    this.replacements.push(
      Replacement.delete(
        node.getStart() - this.sourceNode.getStart(),
        node.getEnd() - this.sourceNode.getStart(),
      ),
    );
  }

  public replaceNodeWithText(node: ts.Node, text: string) {
    this.replacements = this.replacements.concat([
      Replacement.delete(
        node.getStart() - this.sourceNode.getStart(),
        node.getEnd() - this.sourceNode.getStart(),
      ),
      Replacement.insert(node.getStart() - this.sourceNode.getStart(), text),
    ]);
  }

  public applyReplacements() {
    return Replacement.applyReplacements(
      this.sourceNode.getText(),
      this.replacements,
    );
  }
}
