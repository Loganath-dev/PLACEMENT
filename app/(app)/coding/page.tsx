"use client"

import { javascript } from "@codemirror/lang-javascript"
import CodeMirror from "@uiw/react-codemirror"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/app/icon"
import { PageHeader } from "@/components/app/page-header"
import { CompanyAvatar } from "@/components/app/ui-bits"
import { CompanyPicker } from "@/components/app/company-picker"
import { LockedFeatureCard } from "@/components/app/upgrade-prompt"
import { FREE_CODING_PROBLEM_LIMIT, visibleForPlan } from "@/lib/access"
import { COMPANY_BY_ID, getCompany } from "@/lib/data/companies"
import { codingProblemsForCompany } from "@/lib/data/coding-problems"
import { useStore } from "@/lib/store"
import type {
  CodingProblem,
  CompanyId,
} from "@/lib/types"

export default function CodingPage() {
  const { state } = useStore()
  const searchParams = useSearchParams()
  const queryCompany = companyFromParam(searchParams.get("company"))
  const [selectedCompany, setSelectedCompany] =
    React.useState<CompanyId | null>(null)
  const [openId, setOpenId] = React.useState<string | null>(null)
  const company = selectedCompany ?? queryCompany ?? state.primary ?? "general"

  const companyInfo = getCompany(company)
  const problems = React.useMemo(
    () => codingProblemsForCompany(company),
    [company]
  )

  const visibleProblems = visibleForPlan(problems, state.premium, FREE_CODING_PROBLEM_LIMIT)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Problem solving"
        title="Coding Practice"
        description="Original problems with constraints and step-by-step logic."
      />

      <CompanyPicker
        value={company}
        onChange={(id) => {
          setSelectedCompany(id)
          setOpenId(null)
        }}
      />

      <Card>
        <CardContent className="flex items-center gap-3 py-4">
          <CompanyAvatar id={company} size={40} />
          <div className="flex-1">
            <p className="font-heading font-semibold">
              {companyInfo.name} coding ladder
            </p>
            <p className="text-sm text-muted-foreground">
              Practise the problem types most useful for this track.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {visibleProblems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            open={openId === problem.id}
            companyId={company}
            onToggle={() =>
              setOpenId((id) => (id === problem.id ? null : problem.id))
            }
          />
        ))}
      </div>
      {!state.premium && problems.length > visibleProblems.length ? (
        <LockedFeatureCard
          title="More coding practice is available"
          description="Try the starter problems first. Full access adds the remaining company-wise problems."
          cta="See full access"
        />
      ) : null}
    </div>
  )
}

function companyFromParam(value: string | null): CompanyId | null {
  if (!value || !(value in COMPANY_BY_ID)) return null
  return value as CompanyId
}

function ProblemCard({
  problem,
  open,
  companyId,
  onToggle,
}: {
  problem: CodingProblem
  open: boolean
  companyId: CompanyId
  onToggle: () => void
}) {
  const { resolvedTheme } = useTheme()
  const [logicRevealed, setLogicRevealed] = React.useState(false)
  const [answerRevealed, setAnswerRevealed] = React.useState(false)

  // Reset local state when closing the card (optional, but good for resetting state)
  React.useEffect(() => {
    if (!open) {
      setLogicRevealed(false)
      setAnswerRevealed(false)
    }
  }, [open])

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
            {problem.level}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground capitalize">
            {problem.difficulty}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Icon name="Clock" className="size-3.5" />{" "}
            {problem.estimatedMinutes} min
          </span>
          {problem.topics.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full bg-muted/80 px-2 py-0.5 text-muted-foreground"
            >
              #{t}
            </span>
          ))}
          {problem.companyId && problem.companyId !== companyId ? (
            <span className="rounded-full bg-warning/10 px-2 py-0.5 font-medium text-warning-foreground">
              {getCompany(problem.companyId).short} pattern
            </span>
          ) : null}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="font-heading text-base">
              {problem.title}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {problem.prompt}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted/50"
          >
            {open ? "Hide" : "Open"}
          </button>
        </div>
      </CardHeader>
      {open ? (
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <InfoBlock title="Input format" text={problem.inputFormat} />
            <InfoBlock title="Output format" text={problem.outputFormat} />
          </div>
          <div>
            <p className="text-sm font-medium">Constraints</p>
            <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
              {problem.constraints.map((constraint) => (
                <li key={constraint}>- {constraint}</li>
              ))}
            </ul>
          </div>
          
          {!logicRevealed ? (
            <div className="flex justify-center py-4">
              <Button onClick={() => setLogicRevealed(true)}>
                <Icon name="Lightbulb" className="mr-2 size-4" />
                Show Logic
              </Button>
            </div>
          ) : (
            <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <Icon name="Lightbulb" className="size-5" />
                <span>Problem Logic</span>
              </div>
              <p className="leading-relaxed text-muted-foreground">{problem.editorial}</p>
              
              {!answerRevealed ? (
                <div className="mt-4 pt-4 border-t border-primary/10">
                  <Button variant="outline" onClick={() => setAnswerRevealed(true)}>
                    <Icon name="Code2" className="mr-2 size-4" />
                    Show Answer
                  </Button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-primary/10 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Icon name="CheckCircle2" className="size-5 text-[color:var(--success)]" />
                    <span>Verified Solution</span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-border bg-background">
                    <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
                      <p className="text-sm font-medium">JavaScript</p>
                    </div>
                    <div className="[&_.cm-editor]:outline-none [&_.cm-scroller]:font-mono [&_.cm-scroller]:text-sm">
                      <CodeMirror
                        value={problem.solutionCode}
                        editable={false}
                        theme={resolvedTheme === "dark" ? "dark" : "light"}
                        extensions={[javascript()]}
                        basicSetup={{ lineNumbers: true, foldGutter: false, dropCursor: false, allowMultipleSelections: false, indentOnInput: false }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      ) : null}
    </Card>
  )
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
