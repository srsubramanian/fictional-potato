export interface SearchResult {
  url: string
  title: string
  pageTitle?: string
}

export function search(
  query: string,
  options?: { limit?: number },
): SearchResult[]
