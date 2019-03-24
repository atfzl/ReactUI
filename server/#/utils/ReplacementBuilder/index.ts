import { Replacement } from '#/utils/Replacement';
import * as ts from 'typescript';

export class ReplacementBuilder {
  private replacements: Replacement[];
  private sourceNode: ts.Node;

  constructor(sourceNode: ts.Node, replacements: Replacement[] = []) {
    this.replacements = replacements;
    this.sourceNode = sourceNode;
  }

  public insert(pos: number, text: string) {
    this.replacements.push(Replacement.insert(pos, text));
  }

  public delete(start: number, end: number) {
    this.replacements.push(Replacement.delete(start, end));
  }

  public deleteNode(node: ts.Node) {
    this.replacements.push(Replacement.delete(node.getStart(), node.getEnd()));
  }

  public replaceNodeWithText(node: ts.Node, text: string) {
    const sourceNodeStart = this.sourceNode.getStart();

    this.replacements = this.replacements.concat([
      Replacement.delete(
        node.getStart() - sourceNodeStart,
        node.getEnd() - sourceNodeStart,
      ),
      Replacement.insert(node.getStart() - sourceNodeStart, text),
    ]);
  }

  public applyReplacements() {
    return Replacement.applyReplacements(
      this.sourceNode.getText(),
      this.replacements,
    );
  }
}
