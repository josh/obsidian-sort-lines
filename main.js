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
        editorCallback: (editor, view) => this.sort("asc", editor),
      });

      this.addCommand({
        id: "sort-lines-desc",
        name: "Sort Lines Descending",
        editorCallback: (editor, view) => this.sort("desc", editor),
      });
    }

    /**
     * @param {"asc" | "desc"} direction
     * @param {obsidian.Editor} editor
     */
    sort(direction, editor) {
      const startLine = editor.getCursor("from").line;
      const endLine = editor.getCursor("to").line;
      if (startLine === endLine) return;

      const lines = editor.getValue().split("\n");
      const selectedLines = lines.slice(startLine, endLine + 1);
      console.assert(selectedLines.length > 1, "Expected more than 1 line");
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
