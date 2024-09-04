"use strict";

module.exports = (() => {
  const { Plugin, MarkdownView } = require("obsidian");

  const { compare } = new Intl.Collator(navigator.language, {
    usage: "sort",
    sensitivity: "base",
    numeric: true,
    ignorePunctuation: true,
  });

  class SortLinesPlugin extends Plugin {
    onload() {
      this.addCommand({
        id: "sort-lines",
        name: "Sort lines",
        callback: this.sort.bind(this),
      });
    }

    sort() {
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!view) return;
      const { editor } = view;

      const startLine = editor.getCursor("from").line;
      const endLine = editor.getCursor("to").line;
      if (startLine == endLine) return;

      const lines = editor.getValue().split("\n");
      let selectedLines = lines.slice(startLine, endLine + 1);
      console.assert(selectedLines.length > 1, "Expected more than 1 line");
      selectedLines.sort((a, b) => compare(a.trim(), b.trim()));

      editor.replaceRange(
        selectedLines.join("\n"),
        { line: startLine, ch: 0 },
        { line: endLine, ch: editor.getLine(endLine).length },
      );
    }
  }

  return SortLinesPlugin;
})();
