export const INDENT_SIZE = 4

export interface EditorLine {
  id: string
  level: number
  text: string
}

export function createLine(level = 1, text = ''): EditorLine {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    level: Math.max(0, level),
    text,
  }
}

export function isComment(text: string): boolean {
  return text.trimStart().startsWith('//')
}

export function normalizeLine(line: EditorLine): EditorLine {
  const normalized: EditorLine = {
    id: line.id,
    level: Math.max(0, Number.isFinite(line.level) ? line.level : 0),
    text: typeof line.text === 'string' ? line.text : '',
  }

  if (normalized.level === 0 && !isComment(normalized.text)) {
    normalized.text = normalized.text.toUpperCase()
  }

  return normalized
}

export function normalizeLines(lines: EditorLine[]): EditorLine[] {
  if (lines.length === 0) {
    return [createLine(1)]
  }

  return lines.map(normalizeLine)
}

export function computeLogicalLabels(lines: EditorLine[]): string[] {
  const counters: number[] = []
  const labels: string[] = []

  for (const line of lines) {
    if (line.level <= 0 || isComment(line.text)) {
      labels.push('')
      continue
    }

    while (counters.length > line.level) {
      counters.pop()
    }

    while (counters.length < line.level) {
      counters.push(0)
    }

    counters[line.level - 1] += 1
    labels.push(`${counters.join('.')}.`)
  }

  return labels
}

export function updateLineText(lines: EditorLine[], index: number, text: string): EditorLine[] {
  return lines.map((line, currentIndex) => {
    if (currentIndex !== index) {
      return line
    }

    return normalizeLine({
      ...line,
      text,
    })
  })
}

export function changeLineLevel(lines: EditorLine[], index: number, delta: number): EditorLine[] {
  return lines.map((line, currentIndex) => {
    if (currentIndex !== index) {
      return line
    }

    return normalizeLine({
      ...line,
      level: line.level + delta,
    })
  })
}

export function insertLineBelow(lines: EditorLine[], index: number, level: number): EditorLine[] {
  const next = [...lines]
  next.splice(index + 1, 0, createLine(level))
  return next
}

export function moveLine(lines: EditorLine[], index: number, direction: -1 | 1): {
  lines: EditorLine[]
  nextIndex: number
} {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= lines.length) {
    return { lines, nextIndex: index }
  }

  const nextLines = [...lines]
  ;[nextLines[index], nextLines[targetIndex]] = [nextLines[targetIndex], nextLines[index]]

  return {
    lines: nextLines,
    nextIndex: targetIndex,
  }
}

export function parseTextToLines(content: string): EditorLine[] {
  const parsed = content
    .replace(/\r/g, '')
    .split('\n')
    .map((rawLine) => {
      const leadingSpaces = rawLine.match(/^ */)?.[0].length ?? 0
      return createLine(Math.floor(leadingSpaces / INDENT_SIZE), rawLine.slice(leadingSpaces))
    })

  return normalizeLines(parsed)
}

export function serializeLinesToText(lines: EditorLine[]): string {
  return lines.map((line) => `${' '.repeat(line.level * INDENT_SIZE)}${line.text}`).join('\n')
}
