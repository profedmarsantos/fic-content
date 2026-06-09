import { marked } from 'marked'

export interface DocMenuItem {
  id: string
  label: string
  sourcePath: string
  order: number
  loadContent: () => Promise<string>
}

type DocModuleMap = Record<string, () => Promise<string>>

interface DocLabelConfig {
  pattern: RegExp
  label: string
  order: number
}

const DOC_LABEL_CONFIGS: DocLabelConfig[] = [
  { pattern: /^Conteúdo$/i, label: 'Conteúdo', order: 0 },
  {
    pattern: /^Lista de Exercícios_\s*Módulo\s*1\s*\(Estrutura Sequencial\)$/i,
    label: 'Introdução e Fluxogramas',
    order: 1,
  },
  {
    pattern: /^Lista de Exercícios_\s*Módulo\s*2\s*\(Variáveis, Atribuição e Operações Aritméticas\)$/i,
    label: 'Dados e Operadores',
    order: 2,
  },
  {
    pattern: /^Lista de Exercícios_\s*Módulo\s*3\s*\(Estrutura Sequencial e Organização de Algoritmos\)$/i,
    label: 'Estruturas Condicionais',
    order: 3,
  },
  {
    pattern: /^Lista de Exercícios_\s*Módulo\s*4\s*\(Estruturas Condicionais\)$/i,
    label: 'Laços de Repetição',
    order: 4,
  },
  {
    pattern: /^Lista de Exercícios_\s*Módulo\s*5\s*\(Estruturas de Repetição\)$/i,
    label: 'Vetores (Arrays)',
    order: 5,
  },
  {
    pattern: /^Lista de Exercícios_\s*Módulo\s*6\s*\(Vetores, Modularização e Integração\)$/i,
    label: 'Funções e Modularização',
    order: 6,
  },
]

function normalizeFileStem(fileName: string): string {
  return fileName.replace(/\.md$/i, '')
}

function getDocLabelConfig(fileName: string): DocLabelConfig | undefined {
  const fileStem = normalizeFileStem(fileName)
  return DOC_LABEL_CONFIGS.find((config) => config.pattern.test(fileStem))
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeSpaces(value: string): string {
  return value.replace(/[_\s]+/g, ' ').trim()
}

export function toShortDocLabel(fileName: string): string {
  const baseName = normalizeFileStem(fileName)
  const configuredLabel = getDocLabelConfig(fileName)
  if (configuredLabel) {
    return configuredLabel.label
  }

  const moduleMatch = baseName.match(/^Lista de Exerc[ií]cios_\s*(M[oó]dulo\s*\d+)\s*\((.+)\)$/i)
  if (moduleMatch) {
    const moduleName = normalizeSpaces(moduleMatch[1])
    const topic = normalizeSpaces(moduleMatch[2])
    return `${moduleName}: ${topic}`
  }

  return normalizeSpaces(baseName)
}

export function buildDocMenuItemsFromModules(modules: DocModuleMap): DocMenuItem[] {
  return Object.entries(modules)
    .filter(([path]) => path.toLowerCase().endsWith('.md'))
    .map(([path, loadContent]) => {
      const fileName = path.split('/').pop() ?? path
      const id = slugify(fileName)
      const label = toShortDocLabel(fileName)
      const order = getDocLabelConfig(fileName)?.order ?? Number.MAX_SAFE_INTEGER

      return {
        id,
        label,
        sourcePath: `/src/docs/${fileName}`,
        order,
        loadContent,
      }
    })
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, 'pt-BR'))
}

const markdownModules = import.meta.glob('../docs/*.md', {
  query: '?raw',
  import: 'default',
}) as DocModuleMap

const docMenuItems = buildDocMenuItemsFromModules(markdownModules)

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function getDocMenuItems(): DocMenuItem[] {
  return docMenuItems
}

export async function openDocInNewTab(item: DocMenuItem, openFn: typeof window.open = window.open): Promise<boolean> {
  const markdown = await item.loadContent()
  const html = marked.parse(markdown, { async: false }) as string
  const nextWindow = openFn('', '_blank', 'noopener,noreferrer')

  if (!nextWindow) {
    return false
  }

  const safeTitle = escapeHtml(item.label)

  nextWindow.document.write(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <style>
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background: linear-gradient(180deg, #ece3cf 0%, #e5dcc8 100%);
        color: #2a2a2a;
        font-family: "Georgia", "Times New Roman", serif;
        line-height: 1.65;
        padding: 2rem 1rem;
      }

      .paper {
        margin: 0 auto;
        max-width: 880px;
        background: #fffdf8;
        border: 1px solid #d8ccb3;
        box-shadow: 0 12px 40px rgba(71, 52, 22, 0.16);
        border-radius: 10px;
        padding: 2.5rem clamp(1.2rem, 4vw, 3.25rem);
      }

      .paper h1,
      .paper h2,
      .paper h3,
      .paper h4,
      .paper h5,
      .paper h6 {
        color: #233a61;
        line-height: 1.25;
        margin-top: 1.5em;
      }

      .paper h1 {
        font-size: 2rem;
        border-bottom: 2px solid #d8ccb3;
        padding-bottom: 0.35rem;
      }

      .paper p,
      .paper ul,
      .paper ol,
      .paper blockquote,
      .paper pre,
      .paper table {
        margin: 1rem 0;
      }

      .paper code {
        background: #f4eee2;
        border-radius: 4px;
        padding: 0.1rem 0.35rem;
        font-family: "Consolas", "Courier New", monospace;
      }

      .paper pre {
        overflow: auto;
        background: #f4eee2;
        padding: 0.9rem;
        border-radius: 8px;
      }

      .paper a {
        color: #1f4f99;
      }
    </style>
  </head>
  <body>
    <article class="paper">${html}</article>
  </body>
</html>`)
  nextWindow.document.close()

  return true
}
