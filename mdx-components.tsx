import type { MDXComponents } from 'mdx/types'
import { Prose } from '@/components/Prose'
import { CodeBlock } from '@/components/CodeBlock'
import { PrevNextLinks } from '@/components/PrevNextLinks'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: (props) => <CodeBlock {...props} />,
    wrapper({ children }) {
      return (
        <article>
          <Prose>{children}</Prose>
          <div className="mx-auto max-w-3xl">
            <PrevNextLinks />
          </div>
        </article>
      )
    },
  }
}
