import { BrainCircuit, Sparkles, ArrowRight } from 'lucide-react'

function AIAssistantCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 p-7">

      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
          <BrainCircuit size={26} />
        </div>

        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-300" />
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            AI Powered Learning
          </span>
        </div>

        <h3 className="max-w-sm text-2xl font-bold text-white">
          Meet Your Personal AI Study Assistant
        </h3>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
          Ask questions, summarize academic notes, generate practice
          questions and prepare smarter for your examinations.
        </p>

        <button className="mt-6 flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">
          Explore AI Assistant
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  )
}

export default AIAssistantCard