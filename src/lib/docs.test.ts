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
    expect(items[0].sourcePath).toContain('/src/docs/')
    expect(items[1].sourcePath).toContain('/src/docs/')
  })

  it('creates a short label that represents module purpose', () => {
    const label = toShortDocLabel('Lista de Exercícios_ Módulo 4 (Estruturas Condicionais).md')
    expect(label).toBe('Módulo 4: Estruturas Condicionais')
  })
})
