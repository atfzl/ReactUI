import { Replacement } from '#/utils/Replacement';
import * as ts from 'typescript';

export class ReplacementBuilder {
  private replacements: Replacement[];
  private sourceFile: ts.SourceFile;

  constructor(sourceFile: ts.SourceFile, replacements: Replacement[] = []) {
    this.sourceFile = sourceFile;
    this.replacements = replacements;
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
    this.replacements = this.replacements.concat([
      Replacement.delete(node.getStart(), node.getEnd()),
      Replacement.insert(node.getStart(), text),
    ]);
  }

  public applyReplacements() {
    return Replacement.applyReplacements(
      this.sourceFile.getText(),
      this.replacements,
    );
  }
}
