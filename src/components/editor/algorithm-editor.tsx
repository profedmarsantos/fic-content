import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Download,
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
  moveToEnd: boolean
}

const INITIAL_LINES: EditorLine[] = normalizeLines([createLine(1, '')])

export function AlgorithmEditor() {
  const [lines, setLines] = useState<EditorLine[]>(INITIAL_LINES)
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
    if (pendingFocus.moveToEnd) {
      const end = element.value.length
      element.setSelectionRange(end, end)
    }

    setPendingFocus(null)
  }, [pendingFocus, lines])

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  function focusLine(index: number, moveToEnd = true) {
    const target = lines[index]
    if (!target) {
      return
    }

    setActiveIndex(index)
    setPendingFocus({ id: target.id, moveToEnd })
  }

  function updateLines(nextLines: EditorLine[]) {
    setLines(normalizeLines(nextLines))
  }

  function indentCurrentLine(delta: 1 | -1) {
    updateLines(changeLineLevel(lines, activeIndex, delta))
    focusLine(activeIndex)
  }

  function moveCurrentLine(direction: -1 | 1) {
    const result = moveLine(lines, activeIndex, direction)
    if (result.nextIndex === activeIndex) {
      return
    }

    updateLines(result.lines)
    focusLine(result.nextIndex)
  }

  function handleTextChange(index: number, text: string) {
    updateLines(updateLineText(lines, index, text))
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.shiftKey && event.key === 'ArrowUp') {
      event.preventDefault()
      moveCurrentLine(-1)
      return
    }

    if (event.shiftKey && event.key === 'ArrowDown') {
      event.preventDefault()
      moveCurrentLine(1)
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
    const currentLine = lines[index]
    if (!currentLine) {
      return
    }

    if (currentLine.text.trim() === '') {
      updateLines(changeLineLevel(lines, index, -1))
      focusLine(index)
      return
    }

    const next = insertLineBelow(lines, index, currentLine.level)
    updateLines(next)
    focusLine(index + 1)
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
        setPendingFocus({ id: parsedLines[0].id, moveToEnd: false })
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

  return (
    <Card className="flex h-full min-h-0 overflow-hidden border-slate-300 shadow-xl dark:border-slate-700">
      <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-300 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Editor de Algoritmos</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Recuo em blocos de 4 espacos e numeracao logica atualizada automaticamente.
          </p>
        </div>

        <div className="mt-4 grid gap-2">
          <Button onClick={openFilePicker} variant="secondary" size="sm" type="button" className="justify-start">
            <FolderOpen className="mr-2 h-4 w-4" />
            Abrir Arquivo
          </Button>
          <Button onClick={saveFile} size="sm" type="button" className="justify-start">
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
          <Button onClick={toggleTheme} variant="outline" size="sm" type="button" className="justify-start">
            {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
            {theme === 'light' ? 'Ativar Dark Mode' : 'Ativar Light Mode'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain"
            className="hidden"
            onChange={handleFileSelection}
          />
        </div>

        <div className="mt-6 rounded-md border border-slate-300 bg-white p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <p className="mb-2 flex items-center font-semibold text-slate-800 dark:text-slate-100">
            <MoveVertical className="mr-1 h-3.5 w-3.5" />
            Atalhos
          </p>
          <p>Shift + →: aumentar recuo</p>
          <p>Shift + ←: diminuir recuo</p>
          <p>Shift + ↑: mover linha para cima</p>
          <p>Shift + ↓: mover linha para baixo</p>
        </div>
      </aside>

      <section className="min-h-0 min-w-0 flex-1">
        <ScrollArea className="h-full bg-slate-50 dark:bg-slate-950">
          <div className="font-mono">
            {lines.map((line, index) => {
              const comment = isComment(line.text)
              const logical = logicalLabels[index]

              return (
                <div
                  key={line.id}
                  role="listitem"
                  className={cn(
                    'grid min-h-10 grid-cols-[58px_minmax(0,1fr)] items-center border-b border-slate-200 text-sm dark:border-slate-800',
                    index === activeIndex
                      ? 'bg-blue-50 dark:bg-slate-800/80'
                      : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900',
                  )}
                >
                  <span className="border-r border-slate-200 px-2 text-right font-mono text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    {index + 1}
                  </span>

                  <div
                    className="flex items-center pr-2"
                    style={{ paddingLeft: `calc(0.6rem + ${line.level * INDENT_SIZE}ch)` }}
                  >
                    <span
                      className={cn(
                        'mr-1 font-mono text-[0.95rem] text-slate-700 dark:text-slate-300',
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
                        'h-10 border-0 bg-transparent px-0 font-mono text-[0.95rem] text-slate-900 shadow-none ring-0 focus-visible:ring-0 dark:text-slate-100',
                        line.level === 0 && !comment && 'font-semibold uppercase',
                        comment && 'italic text-slate-500 dark:text-slate-400',
                      )}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </section>
    </Card>
  )
}
