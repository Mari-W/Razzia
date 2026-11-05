import type { QuestionCode as QuestionCodeType } from "@razzia/common/types/game"
import type { HLJSApi, LanguageFn } from "highlight.js"
import { useEffect, useState } from "react"

const LANGUAGE_PATH = "/node_modules/highlight.js/lib/languages/"

const languages = import.meta.glob<{ default: LanguageFn }>([
  "/node_modules/highlight.js/lib/languages/*.js",
  "!**/*.js.js",
])

export const CODE_LANGUAGES = Object.keys(languages).map((path) =>
  path.slice(LANGUAGE_PATH.length, -".js".length),
)

let hljs: HLJSApi | undefined = undefined

const loadLanguage = async (language: string) => {
  const [core, grammar] = await Promise.all([
    import("highlight.js/lib/core"),
    languages[`${LANGUAGE_PATH}${language}.js`](),
    import("highlight.js/styles/github-dark.css"),
  ])

  hljs = core.default
  hljs.registerLanguage(language, grammar.default)
}

export const useHighlightedCode = ({ language, source }: QuestionCodeType) => {
  const [, setLoaded] = useState<string>()

  useEffect(() => {
    if (!CODE_LANGUAGES.includes(language) || hljs?.getLanguage(language)) {
      return
    }

    let active = true

    loadLanguage(language).then(() => {
      if (active) {
        setLoaded(language)
      }
    })

    return () => {
      active = false
    }
  }, [language])

  return hljs?.getLanguage(language)
    ? hljs.highlight(source, { language }).value
    : undefined
}

interface Props {
  code: QuestionCodeType
}

const QuestionCode = ({ code }: Props) => {
  const html = useHighlightedCode(code)

  return (
    <pre className="max-h-[40svh] min-h-0 w-full max-w-3xl touch-auto overflow-auto rounded-md bg-black/80 p-4 text-left text-sm text-white sm:max-h-100 sm:text-base">
      {html ? (
        <code dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <code>{code.source}</code>
      )}
    </pre>
  )
}

export default QuestionCode
