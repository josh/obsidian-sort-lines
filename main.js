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
        id: "sort-lines-asc",
        name: "Sort Lines Ascending",
        callback: () => this.sort("asc"),
      });

      this.addCommand({
        id: "sort-lines-desc",
        name: "Sort Lines Descending",
        callback: () => this.sort("desc"),
      });
    }

    /**
     * @param {"asc" | "desc"} direction
     */
    sort(direction) {
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!view) return;
      const { editor } = view;

      const startLine = editor.getCursor("from").line;
      const endLine = editor.getCursor("to").line;
      if (startLine == endLine) return;

      const lines = editor.getValue().split("\n");
      const selectedLines = lines.slice(startLine, endLine + 1);
      console.assert(selectedLines.length > 1, "Expected more than 1 line");
      selectedLines.sort((a, b) => {
        const result = compare(a.trim(), b.trim());
        return direction == "desc" ? -result : result;
      });

      editor.replaceRange(
        selectedLines.join("\n"),
        { line: startLine, ch: 0 },
        { line: endLine, ch: editor.getLine(endLine).length },
      );
    }
  }

  return SortLinesPlugin;
})();
