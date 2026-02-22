import type { MDXComponents } from 'mdx/types'
import { Prose } from '@/components/Prose'
import { CodeBlock } from '@/components/CodeBlock'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: (props) => <CodeBlock {...props} />,
    wrapper({ children }) {
      return (
        <article>
          <Prose>{children}</Prose>
        </article>
      )
    },
  }
}
