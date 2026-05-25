import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Download,
  FilePlus2,
  FolderOpen,
  IndentDecrease,
  IndentIncrease,
  Moon,
  MoveVertical,
  Sun,
} from 'lucide-react'

import {
  INDENT_SIZE,
  changeLineLevel,
  computeLogicalLabels,
  createLine,
  insertLineBelow,
  isComment,
  moveLine,
  normalizeLines,
  parseTextToLines,
  removeLine,
  serializeLinesToText,
  updateLineText,
  type EditorLine,
} from '@/lib/editor'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PendingFocus {
  id: string
  selectionStart?: number
  selectionEnd?: number
}

function createInitialLines(): EditorLine[] {
  return normalizeLines([createLine(1, '')])
}

export function AlgorithmEditor() {
  const [lines, setLines] = useState<EditorLine[]>(() => createInitialLines())
  const [activeIndex, setActiveIndex] = useState(0)
  const [pendingFocus, setPendingFocus] = useState<PendingFocus | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const logicalLabels = useMemo(() => computeLogicalLabels(lines), [lines])

  useLayoutEffect(() => {
    if (!pendingFocus) {
      return
    }

    const element = inputRefs.current.get(pendingFocus.id)
    if (!element) {
      return
    }

    element.focus()
    if (
      typeof pendingFocus.selectionStart === 'number' &&
      typeof pendingFocus.selectionEnd === 'number'
    ) {
      const max = element.value.length
      const start = Math.min(pendingFocus.selectionStart, max)
      const end = Math.min(pendingFocus.selectionEnd, max)
      element.setSelectionRange(start, end)
    }

    setPendingFocus(null)
  }, [pendingFocus, lines])

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  function focusLine(index: number, selectionStart?: number, selectionEnd?: number) {
    const target = lines[index]
    if (!target) {
      return
    }

    setActiveIndex(index)
    setPendingFocus({
      id: target.id,
      selectionStart,
      selectionEnd: typeof selectionEnd === 'number' ? selectionEnd : selectionStart,
    })
  }

  function focusLineById(id: string, index: number, selectionStart?: number, selectionEnd?: number) {
    setActiveIndex(index)
    setPendingFocus({
      id,
      selectionStart,
      selectionEnd: typeof selectionEnd === 'number' ? selectionEnd : selectionStart,
    })
  }

  function updateLines(nextLines: EditorLine[]) {
    setLines(normalizeLines(nextLines))
  }

  function indentCurrentLine(delta: 1 | -1) {
    updateLines(changeLineLevel(lines, activeIndex, delta))
    const activeInput = inputRefs.current.get(lines[activeIndex]?.id ?? '')
    const selectionStart = activeInput?.selectionStart ?? activeInput?.value.length ?? 0
    const selectionEnd = activeInput?.selectionEnd ?? selectionStart
    focusLine(activeIndex, selectionStart, selectionEnd)
  }

  function moveCurrentLine(direction: -1 | 1, selectionStart: number, selectionEnd: number) {
    const result = moveLine(lines, activeIndex, direction)
    if (result.nextIndex === activeIndex) {
      return
    }

    updateLines(result.lines)
    focusLine(result.nextIndex, selectionStart, selectionEnd)
  }

  function navigateLine(direction: -1 | 1, selectionStart: number, selectionEnd: number) {
    const nextIndex = activeIndex + direction
    if (nextIndex < 0 || nextIndex >= lines.length) {
      return
    }

    focusLine(nextIndex, selectionStart, selectionEnd)
  }

  function handleTextChange(index: number, text: string) {
    updateLines(updateLineText(lines, index, text))
  }

  function removeCurrentLine(index: number, mode: 'backspace' | 'delete') {
    const nextLines = normalizeLines(removeLine(lines, index))
    updateLines(nextLines)

    const nextIndex = Math.min(mode === 'backspace' ? Math.max(index - 1, 0) : index, nextLines.length - 1)
    const nextLine = nextLines[nextIndex]

    if (!nextLine) {
      return
    }

    const caretPosition = mode === 'backspace' ? nextLine.text.length : 0
    focusLineById(nextLine.id, nextIndex, caretPosition, caretPosition)
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    const selectionStart = event.currentTarget.selectionStart ?? event.currentTarget.value.length
    const selectionEnd = event.currentTarget.selectionEnd ?? selectionStart
    const currentLine = lines[index]

    if (!currentLine) {
      return
    }

    if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      selectionStart === selectionEnd &&
      currentLine.text === ''
    ) {
      event.preventDefault()
      removeCurrentLine(index, event.key === 'Backspace' ? 'backspace' : 'delete')
      return
    }

    if (event.shiftKey && event.key === 'ArrowUp') {
      event.preventDefault()
      moveCurrentLine(-1, selectionStart, selectionEnd)
      return
    }

    if (event.shiftKey && event.key === 'ArrowDown') {
      event.preventDefault()
      moveCurrentLine(1, selectionStart, selectionEnd)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      navigateLine(-1, selectionStart, selectionEnd)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      navigateLine(1, selectionStart, selectionEnd)
      return
    }

    if (event.shiftKey && event.key === 'ArrowRight') {
      event.preventDefault()
      indentCurrentLine(1)
      return
    }

    if (event.shiftKey && event.key === 'ArrowLeft') {
      event.preventDefault()
      indentCurrentLine(-1)
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      indentCurrentLine(event.shiftKey ? -1 : 1)
      return
    }

    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    if (currentLine.text.trim() === '') {
      updateLines(changeLineLevel(lines, index, -1))
      focusLine(index)
      return
    }

    const next = insertLineBelow(lines, index, currentLine.level)
    updateLines(next)
    const insertedLine = next[index + 1]
    if (insertedLine) {
      focusLineById(insertedLine.id, index + 1, 0, 0)
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      const parsedLines = parseTextToLines(text)
      setLines(parsedLines)
      setActiveIndex(0)
      if (parsedLines[0]) {
        setPendingFocus({ id: parsedLines[0].id, selectionStart: 0, selectionEnd: 0 })
      }
      event.target.value = ''
    }

    reader.readAsText(file, 'utf-8')
  }

  function saveFile() {
    const content = serializeLinesToText(lines)
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'algoritmo-hierarquico.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(link.href)
  }

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  function createNewAlgorithm() {
    const nextLines = createInitialLines()
    setLines(nextLines)
    setActiveIndex(0)

    if (nextLines[0]) {
      setPendingFocus({ id: nextLines[0].id, selectionStart: 0, selectionEnd: 0 })
    }
  }

  const primarySidebarButtonClass =
    'justify-start border border-[#345ca6] bg-[#3d6abf] text-white hover:bg-[#345ca6] dark:border-[#4b78cf] dark:bg-[#3d6abf] dark:text-white dark:hover:bg-[#4b78cf]'

  return (
    <div className="relative h-full">
      <aside className="hidden h-[calc(100vh-2rem)] w-72 flex-col rounded-xl border border-[#d6ccba] bg-[#fff9ef] p-4 shadow-lg md:fixed md:left-4 md:top-4 md:flex dark:border-[#3a3d41] dark:bg-[#252526]">
        <div className="space-y-3">
          <h2 className="sidebar-title text-center text-[#3d6abf] dark:text-[#3d6abf]">
            Editor de Algoritmo em Pseudocódigos
          </h2>
          <p className="sidebar-helper-text text-center text-slate-600 dark:text-[#d4d4d4]">
            Aqui você cria seus algoritmos em pseudocódigos numerados ou estruturados!
          </p>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Alternar entre modo claro e escuro"
          aria-pressed={theme === 'dark'}
          className="mx-auto mt-4 flex h-8 w-16 items-center rounded-full border border-slate-300 bg-slate-200 px-1 transition-colors dark:border-[#3a3d41] dark:bg-[#3c3c3c]"
        >
          <span
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition-transform dark:bg-[#0e639c] dark:text-white',
              theme === 'dark' ? 'translate-x-8' : 'translate-x-0',
            )}
          >
            {theme === 'light' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </span>
        </button>

        <div className="mt-4 grid gap-2">
          <Button onClick={createNewAlgorithm} size="sm" type="button" className={primarySidebarButtonClass}>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Criar Novo
          </Button>
          <Button onClick={openFilePicker} size="sm" type="button" className={primarySidebarButtonClass}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Abrir Arquivo
          </Button>
          <Button onClick={saveFile} size="sm" type="button" className={primarySidebarButtonClass}>
            <Download className="mr-2 h-4 w-4" />
            Salvar Arquivo
          </Button>
          <Button
            onClick={() => indentCurrentLine(-1)}
            variant="outline"
            size="sm"
            type="button"
            className="justify-start"
          >
            <IndentDecrease className="mr-2 h-4 w-4" />
            Diminuir Recuo
          </Button>
          <Button
            onClick={() => indentCurrentLine(1)}
            variant="outline"
            size="sm"
            type="button"
            className="justify-start"
          >
            <IndentIncrease className="mr-2 h-4 w-4" />
            Aumentar Recuo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={handleFileSelection}
          />
        </div>

        <div className="mt-6 rounded-md border border-[#d6ccba] bg-[#fffdf8] p-3 text-xs text-slate-600 dark:border-[#3a3d41] dark:bg-[#2d2d30] dark:text-[#c8c8c8]">
          <p className="mb-2 flex items-center font-semibold text-slate-800 dark:text-[#e6e6e6]">
            <MoveVertical className="mr-1 h-3.5 w-3.5" />
            Atalhos
          </p>
          <p>Shift + →: aumentar recuo</p>
          <p>Shift + ←: diminuir recuo</p>
          <p>Shift + ↑: mover linha para cima</p>
          <p>Shift + ↓: mover linha para baixo</p>
        </div>
      </aside>

      <section className="mx-auto flex h-full min-h-0 min-w-0 max-w-6xl items-center justify-center md:pl-72">
        <Card className="flex h-full min-h-0 w-full max-w-5xl flex-col overflow-hidden border-[#d9cebc] bg-[#f7ecd2] shadow-2xl dark:border-[#3a3d41] dark:bg-[#1e1e1e]">
          <div className="border-b border-[#d9cebc] bg-[#fbf3df] px-5 py-3 dark:border-[#3a3d41] dark:bg-[#252526]">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Editor de Algoritmo em Pseudocódigos</h1>
          </div>

          <section className="min-h-0 flex-1">
            <ScrollArea className="h-full bg-[#fff7e4] dark:bg-[#1e1e1e]">
              <div className="font-mono">
            {lines.map((line, index) => {
              const comment = isComment(line.text)
              const logical = logicalLabels[index]

              return (
                <div
                  key={line.id}
                  role="listitem"
                  className={cn(
                    'grid min-h-10 grid-cols-[58px_minmax(0,1fr)] items-center border-b border-[#dfd4bf] text-sm dark:border-[#33373b]',
                    index === activeIndex
                      ? 'bg-[#f4e6bc] dark:bg-[#2a2d2e]'
                      : 'bg-[#fffaf0] hover:bg-[#f8edd0] dark:bg-[#1e1e1e] dark:hover:bg-[#252526]',
                  )}
                >
                  <span className="border-r border-[#dfd4bf] px-2 text-right font-mono font-bold text-[#3d6abf] dark:border-[#33373b] dark:text-[#3d6abf]">
                    {index + 1}
                  </span>

                  <div
                    className="flex items-center pr-2"
                    style={{ paddingLeft: `calc(0.6rem + ${line.level * INDENT_SIZE}ch)` }}
                  >
                    <span
                      className={cn(
                        'mr-1 font-mono text-[0.95rem] text-slate-700 dark:text-[#d4d4d4]',
                        comment && 'opacity-0',
                      )}
                    >
                      {logical}
                    </span>
                    <Input
                      ref={(element) => {
                        if (element) {
                          inputRefs.current.set(line.id, element)
                        } else {
                          inputRefs.current.delete(line.id)
                        }
                      }}
                      value={line.text}
                      onFocus={() => setActiveIndex(index)}
                      onChange={(event) => handleTextChange(index, event.target.value)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      className={cn(
                        'h-10 border-0 bg-transparent px-0 font-mono text-[0.95rem] text-slate-900 shadow-none ring-0 focus-visible:ring-0 dark:text-[#dcdcdc]',
                        line.level === 0 && !comment && 'font-semibold uppercase',
                        comment && 'italic text-slate-500 dark:text-[#8aa6c1]',
                      )}
                    />
                  </div>
                </div>
              )
            })}
              </div>
            </ScrollArea>
          </section>

          <footer className="border-t border-[#d9cebc] bg-[#fbf3df] px-4 py-2 text-center text-[11px] text-slate-700 dark:border-[#3a3d41] dark:bg-[#252526] dark:text-[#b9c8d6]">
            Desenvolvido com VS Code & Copilot Pro © 2026 • Curso Lógica de Programação e Construção de
            Algoritmos • IFSP
          </footer>
        </Card>
      </section>
    </div>
  )
}
