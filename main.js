module.exports = (() => {
  const obsidian = require("obsidian");
  const { Plugin } = obsidian;

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
        editorCheckCallback: (checking, editor, view) => {
          if (checking) {
            return this.hasMultilineSelection(editor);
          }
          this.sort(editor, "asc");
        },
      });

      this.addCommand({
        id: "sort-lines-desc",
        name: "Sort Lines Descending",
        editorCheckCallback: (checking, editor, view) => {
          if (checking) {
            return this.hasMultilineSelection(editor);
          }
          this.sort(editor, "desc");
        },
      });
    }

    /**
     * Check if multiple lines are selected in the editor.
     *
     * @param {obsidian.Editor} editor
     * @returns {boolean}
     */
    hasMultilineSelection(editor) {
      const startLine = editor.getCursor("from").line;
      const endLine = editor.getCursor("to").line;
      return endLine > startLine;
    }

    /**
     * Sort the selected lines in the editor.
     *
     * @param {obsidian.Editor} editor
     * @param {"asc" | "desc"} direction
     */
    sort(editor, direction) {
      const startLine = editor.getCursor("from").line;
      const endLine = editor.getCursor("to").line;
      console.assert(endLine > startLine, "Expected multiline selection");

      const lines = editor.getValue().split("\n");
      const selectedLines = lines.slice(startLine, endLine + 1);
      console.assert(selectedLines.length > 1, "Expected multiple lines");

      selectedLines.sort((a, b) => {
        const result = compare(a.trim(), b.trim());
        return direction === "desc" ? -result : result;
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
