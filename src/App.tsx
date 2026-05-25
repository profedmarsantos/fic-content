import { AlgorithmEditor } from './components/editor/algorithm-editor'

function App() {
  return (
    <main className="h-screen overflow-hidden bg-slate-100 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
      <div className="mx-auto h-full w-full max-w-6xl">
        <AlgorithmEditor />
      </div>
    </main>
  )
}

export default App
