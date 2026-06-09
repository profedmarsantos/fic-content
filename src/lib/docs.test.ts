import { describe, expect, it, vi } from 'vitest'

import { buildDocMenuItemsFromModules, toShortDocLabel } from '@/lib/docs'

describe('docs helpers', () => {
  it('builds menu items from markdown files in src/docs', () => {
    const modules = {
      '../docs/Conteúdo.md': vi.fn(async () => '# Conteúdo'),
      '../docs/Lista de Exercícios_ Módulo 2 (Variáveis, Atribuição e Operações Aritméticas).md': vi.fn(
        async () => '# Modulo 2',
      ),
      '../docs/ignorado.txt': vi.fn(async () => 'ignorar'),
    }

    const items = buildDocMenuItemsFromModules(modules)

    expect(items).toHaveLength(2)
    expect(items[0].label).toBe('Conteúdo')
    expect(items[1].label).toBe('Dados e Operadores')
    expect(items[0].sourcePath).toContain('/src/docs/')
    expect(items[1].sourcePath).toContain('/src/docs/')
  })

  it('creates a short label that represents module purpose', () => {
    const label = toShortDocLabel('Lista de Exercícios_ Módulo 6 (Vetores, Modularização e Integração).md')
    expect(label).toBe('Funções e Modularização')
  })
})
