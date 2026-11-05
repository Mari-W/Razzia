import type { QuestionCode as QuestionCodeType } from "@razzia/common/types/game"
import type { LanguageFn } from "highlight.js"
import { useEffect, useState } from "react"

const LANGUAGE_PATH = "/node_modules/highlight.js/lib/languages/"

const languages = import.meta.glob<{ default: LanguageFn }>(
  "/node_modules/highlight.js/lib/languages/*.js",
)

export const CODE_LANGUAGES = Object.keys(languages).map((path) =>
  path.slice(LANGUAGE_PATH.length, -".js".length),
)

const highlight = async ({ language, source }: QuestionCodeType) => {
  const [{ default: hljs }, { default: grammar }] = await Promise.all([
    import("highlight.js/lib/core"),
    languages[`${LANGUAGE_PATH}${language}.js`](),
    import("highlight.js/styles/github-dark.css"),
  ])

  hljs.registerLanguage(language, grammar)

  return hljs.highlight(source, { language }).value
}

interface Props {
  code: QuestionCodeType
}

const QuestionCode = ({ code }: Props) => {
  const [highlighted, setHighlighted] = useState<{
    code: QuestionCodeType
    html: string
  }>()

  useEffect(() => {
    if (!CODE_LANGUAGES.includes(code.language)) {
      return
    }

    let active = true

    highlight(code).then((html) => {
      if (active) {
        setHighlighted({ code, html })
      }
    })

    return () => {
      active = false
    }
  }, [code])

  return (
    <pre className="max-h-[40svh] min-h-0 w-full max-w-3xl touch-auto overflow-auto rounded-md bg-black/80 p-4 text-left text-sm text-white sm:max-h-100 sm:text-base">
      {highlighted?.code === code ? (
        <code dangerouslySetInnerHTML={{ __html: highlighted.html }} />
      ) : (
        <code>{code.source}</code>
      )}
    </pre>
  )
}

export default QuestionCode
