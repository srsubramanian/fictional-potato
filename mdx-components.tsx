import type { MDXComponents } from 'mdx/types'
import { Prose } from '@/components/Prose'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    wrapper({ children }) {
      return (
        <article>
          <Prose>{children}</Prose>
        </article>
      )
    },
  }
}
