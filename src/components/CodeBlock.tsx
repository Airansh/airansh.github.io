import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import { CopyButton } from './ui'
export function CodeBlock({
  code,
  language = 'typescript',
  title,
}: {
  code: string
  language?: string
  title: string
}) {
  return (
    <div className="code-block">
      <div>
        <span>{title}</span>
        <CopyButton value={code} label="Copy code" />
      </div>
      <pre>
        <code
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(
              code,
              Prism.languages[language] || Prism.languages.plain,
              language,
            ),
          }}
        />
      </pre>
    </div>
  )
}
