import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AlgorithmEditor } from '@/components/editor/algorithm-editor'

const { docsMenuItemsMock, openDocInNewTabMock } = vi.hoisted(() => ({
  docsMenuItemsMock: [
    {
      id: 'conteudo-md',
      label: 'Conteúdo',
      sourcePath: '/src/docs/Conteúdo.md',
      loadContent: vi.fn(async () => '# Conteúdo'),
    },
    {
      id: 'modulo-1',
      label: 'Introdução e Fluxogramas',
      sourcePath: '/src/docs/Lista de Exercícios_ Módulo 1 (Estrutura Sequencial).md',
      loadContent: vi.fn(async () => '# Modulo 1'),
    },
  ],
  openDocInNewTabMock: vi.fn(async (item: { sourcePath: string }) => {
    void item
    return true
  }),
}))

vi.mock('@/lib/docs', () => ({
  getDocMenuItems: () => docsMenuItemsMock,
  openDocInNewTab: openDocInNewTabMock,
}))

function createTwoLines() {
  const firstInput = screen.getAllByRole('textbox')[0] as HTMLInputElement

  fireEvent.focus(firstInput)
  fireEvent.change(firstInput, { target: { value: 'linha 1' } })
  fireEvent.keyDown(firstInput, { key: 'Enter' })

  const secondInput = screen.getAllByRole('textbox')[1] as HTMLInputElement
  fireEvent.change(secondInput, { target: { value: 'linha 2' } })

  return { firstInput, secondInput }
}

beforeEach(() => {
  openDocInNewTabMock.mockClear()
})

describe('AlgorithmEditor line move shortcuts', () => {
  it('keeps cursor on moved line when using Shift + ArrowUp', async () => {
    render(<AlgorithmEditor />)
    const { secondInput } = createTwoLines()

    secondInput.focus()
    secondInput.setSelectionRange(2, 2)
    fireEvent.keyDown(secondInput, { key: 'ArrowUp', shiftKey: true })

    await waitFor(() => {
      const movedInput = screen.getByDisplayValue('linha 2') as HTMLInputElement
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('linha 2')
      expect(document.activeElement).toBe(movedInput)
      expect(movedInput.selectionStart).toBe(2)
      expect(movedInput.selectionEnd).toBe(2)
    })
  })

  it('keeps cursor on moved line when using Shift + ArrowDown', async () => {
    render(<AlgorithmEditor />)
    const { firstInput } = createTwoLines()

    firstInput.focus()
    await waitFor(() => {
      expect(firstInput).toHaveFocus()
    })

    firstInput.setSelectionRange(3, 3)
    fireEvent.keyDown(firstInput, { key: 'ArrowDown', shiftKey: true })

    await waitFor(() => {
      const movedInput = screen.getAllByRole('textbox')[1] as HTMLInputElement
      expect(movedInput).toHaveValue('linha 1')
      expect(document.activeElement).toBe(movedInput)
      expect(movedInput.selectionStart).toBe(3)
      expect(movedInput.selectionEnd).toBe(3)
    })
  })
})

describe('AlgorithmEditor docs sidebar', () => {
  it('collapses and expands docs sidebar', () => {
    render(<AlgorithmEditor />)

    fireEvent.click(screen.getByLabelText('Recolher sidebar de documentos'))
    expect(screen.getByLabelText('Expandir sidebar de documentos')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Expandir sidebar de documentos'))
    expect(screen.getByLabelText('Recolher sidebar de documentos')).toBeInTheDocument()
  })

  it('renders menu items for markdown documents', () => {
    render(<AlgorithmEditor />)

    expect(screen.getByRole('button', { name: 'Abrir documento Conteúdo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abrir documento Introdução e Fluxogramas' })).toBeInTheDocument()
  })

  it('opens markdown in a new tab when clicking a docs item', async () => {
    render(<AlgorithmEditor />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir documento Conteúdo' }))

    await waitFor(() => {
      expect(openDocInNewTabMock).toHaveBeenCalledWith(docsMenuItemsMock[0])
    })
  })

  it('selects a markdown file sourced from /src/docs', async () => {
    render(<AlgorithmEditor />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir documento Introdução e Fluxogramas' }))

    await waitFor(() => {
      const selected = openDocInNewTabMock.mock.calls.at(-1)?.[0]
      expect(selected).toBeDefined()
      if (!selected) {
        return
      }

      expect(selected.sourcePath).toContain('/src/docs/')
      expect(selected.sourcePath).toContain('Módulo 1')
    })
  })
})
