import type { QuestionCode } from "@razzia/common/types/game"
import Combobox from "@razzia/web/components/Combobox"
import {
  CODE_LANGUAGES,
  HighlightedCode,
} from "@razzia/web/components/QuestionCode"
import { useQuizzEditor } from "@razzia/web/features/quizz/contexts/quizz-editor-context"
import clsx from "clsx"
import { Code } from "lucide-react"
import { useTranslation } from "react-i18next"

const QuestionEditorCode = () => {
  const { currentQuestion, currentIndex, updateQuestion } = useQuizzEditor()
  const { t } = useTranslation()
  const { language = "", source = "" } = currentQuestion.code ?? {}

  const handleChange = (code: QuestionCode) => {
    updateQuestion(currentIndex, {
      code: code.language || code.source ? code : undefined,
    })
  }

  return (
    <div
      className={clsx(
        "bg-background z-10 mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-xl px-4 py-3 shadow-sm transition-opacity",
        !source && "opacity-60 focus-within:opacity-100 hover:opacity-100",
      )}
    >
      <div className="flex items-center gap-3">
        <Code className="text-primary size-5 shrink-0" />
        <Combobox
          value={language}
          onValueChange={(next) => handleChange({ language: next, source })}
          options={CODE_LANGUAGES}
          aria-label={t("quizz:question.codeLanguage")}
          placeholder={t("quizz:question.codeLanguage")}
          variant="sm"
          className="w-48"
        />
      </div>
      <div className="grid rounded-md bg-black/80 p-4 font-mono text-sm text-white">
        <pre
          aria-hidden
          className="col-start-1 row-start-1 break-words whitespace-pre-wrap"
        >
          <HighlightedCode code={{ language, source }} />
          {"\n"}
        </pre>
        <textarea
          value={source}
          onChange={(e) => handleChange({ language, source: e.target.value })}
          aria-label={t("quizz:question.code")}
          placeholder={t("quizz:question.codePlaceholder")}
          spellCheck={false}
          className="col-start-1 row-start-1 resize-none overflow-hidden break-words whitespace-pre-wrap text-transparent caret-white outline-none placeholder:text-white/50"
        />
      </div>
    </div>
  )
}

export default QuestionEditorCode
