(() => {
  const INDENT_SIZE = 4;

  const state = {
    lines: [{ level: 1, text: "" }],
    activeIndex: 0
  };

  const editor = document.getElementById("editor");
  const template = document.getElementById("line-template");
  const fileInput = document.getElementById("file-input");

  const openFileBtn = document.getElementById("open-file-btn");
  const saveFileBtn = document.getElementById("save-file-btn");
  const indentBtn = document.getElementById("indent-btn");
  const outdentBtn = document.getElementById("outdent-btn");

  function normalizeLine(line) {
    const normalized = {
      level: Math.max(0, Number.isFinite(line.level) ? line.level : 0),
      text: typeof line.text === "string" ? line.text : ""
    };

    if (normalized.level === 0 && !isComment(normalized.text)) {
      normalized.text = normalized.text.toUpperCase();
    }

    return normalized;
  }

  function isComment(text) {
    return text.trimStart().startsWith("//");
  }

  function computeLogicalLabels(lines) {
    const labels = [];
    const counters = [];

    for (const line of lines) {
      const comment = isComment(line.text);

      if (line.level <= 0 || comment) {
        labels.push("");
        continue;
      }

      while (counters.length > line.level) {
        counters.pop();
      }

      while (counters.length < line.level) {
        counters.push(0);
      }

      counters[line.level - 1] += 1;
      labels.push(`${counters.join(".")}.`);
    }

    return labels;
  }

  function setActiveIndex(index) {
    state.activeIndex = Math.max(0, Math.min(index, state.lines.length - 1));
  }

  function updateLineText(index, rawValue) {
    const line = state.lines[index];
    if (!line) {
      return;
    }

    line.text = rawValue;

    if (line.level === 0 && !isComment(line.text)) {
      line.text = line.text.toUpperCase();
    }
  }

  function updateLineLevel(index, nextLevel) {
    const line = state.lines[index];
    if (!line) {
      return;
    }

    line.level = Math.max(0, nextLevel);

    if (line.level === 0 && !isComment(line.text)) {
      line.text = line.text.toUpperCase();
    }
  }

  function insertLineBelow(index, level) {
    const safeLevel = Math.max(0, level);
    state.lines.splice(index + 1, 0, normalizeLine({ level: safeLevel, text: "" }));
    setActiveIndex(index + 1);
  }

  function buildLineRow(line, index, logicalLabel) {
    const row = template.content.firstElementChild.cloneNode(true);
    const gutter = row.querySelector(".gutter");
    const logical = row.querySelector(".logical");
    const input = row.querySelector(".line-input");

    const comment = isComment(line.text);

    row.dataset.index = String(index);
    row.classList.toggle("active", index === state.activeIndex);
    row.classList.toggle("comment", comment);
    row.classList.add(`level-${line.level}`);

    gutter.textContent = String(index + 1);
    logical.textContent = logicalLabel;

    input.value = line.text;
    input.style.paddingLeft = `${0.6 + line.level * 1.6}rem`;

    input.addEventListener("focus", () => {
      setActiveIndex(index);
      render();
    });

    input.addEventListener("input", (event) => {
      updateLineText(index, event.target.value);
      render({ preserveFocus: true, caretToEnd: false });
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        if (event.shiftKey) {
          outdentCurrent();
        } else {
          indentCurrent();
        }
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handleEnter(index);
      }
    });

    return row;
  }

  function focusActiveInput(caretToEnd) {
    const activeRow = editor.querySelector(`.line[data-index="${state.activeIndex}"]`);
    if (!activeRow) {
      return;
    }

    const activeInput = activeRow.querySelector(".line-input");
    if (!activeInput) {
      return;
    }

    activeInput.focus();

    if (caretToEnd) {
      const end = activeInput.value.length;
      activeInput.setSelectionRange(end, end);
    }
  }

  function render(options = {}) {
    const { preserveFocus = false, caretToEnd = true } = options;
    const fragment = document.createDocumentFragment();
    const labels = computeLogicalLabels(state.lines);

    state.lines = state.lines.map(normalizeLine);

    for (let index = 0; index < state.lines.length; index += 1) {
      const row = buildLineRow(state.lines[index], index, labels[index]);
      fragment.appendChild(row);
    }

    editor.replaceChildren(fragment);

    if (preserveFocus) {
      focusActiveInput(caretToEnd);
    }
  }

  function indentCurrent() {
    updateLineLevel(state.activeIndex, state.lines[state.activeIndex].level + 1);
    render({ preserveFocus: true });
  }

  function outdentCurrent() {
    updateLineLevel(state.activeIndex, state.lines[state.activeIndex].level - 1);
    render({ preserveFocus: true });
  }

  function handleEnter(index) {
    const line = state.lines[index];
    if (!line) {
      return;
    }

    if (line.text.trim() === "") {
      const nextLevel = Math.max(0, line.level - 1);
      updateLineLevel(index, nextLevel);
      render({ preserveFocus: true });
      return;
    }

    insertLineBelow(index, line.level);
    render({ preserveFocus: true });
  }

  function exportAsText() {
    const content = state.lines
      .map((line) => " ".repeat(line.level * INDENT_SIZE) + line.text)
      .join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "algoritmo-hierarquico.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }

  // Converte texto puro com espacos iniciais em linhas hierarquicas do editor.
  function importFromText(content) {
    const rows = content.replace(/\r/g, "").split("\n");
    const parsed = rows.map((rawLine) => {
      const leadingSpacesMatch = rawLine.match(/^ */);
      const leadingSpaces = leadingSpacesMatch ? leadingSpacesMatch[0].length : 0;
      const level = Math.floor(leadingSpaces / INDENT_SIZE);
      const text = rawLine.slice(leadingSpaces);
      return normalizeLine({ level, text });
    });

    state.lines = parsed.length > 0 ? parsed : [{ level: 1, text: "" }];
    state.activeIndex = 0;
    render({ preserveFocus: true });
  }

  function handleFileSelection(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      importFromText(text);
      fileInput.value = "";
    };
    reader.readAsText(file, "utf-8");
  }

  openFileBtn.addEventListener("click", () => fileInput.click());
  saveFileBtn.addEventListener("click", exportAsText);
  indentBtn.addEventListener("click", indentCurrent);
  outdentBtn.addEventListener("click", outdentCurrent);
  fileInput.addEventListener("change", handleFileSelection);

  render();
  focusActiveInput(true);
})();
