const KEY = "studybench:bookmarks"

export interface Bookmark {
  id: string
  type: "lesson" | "interview" | "pyq"
  title: string
  href: string
  company?: string
  savedAt: number
}

function load(): Bookmark[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Bookmark[]
  } catch {
    return []
  }
}

function save(items: Bookmark[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(items))
}

export function addBookmark(bm: Omit<Bookmark, "savedAt">): void {
  const items = load().filter((b) => b.id !== bm.id)
  save([{ ...bm, savedAt: Date.now() }, ...items])
}

export function removeBookmark(id: string): void {
  save(load().filter((b) => b.id !== id))
}

export function isBookmarked(id: string): boolean {
  return load().some((b) => b.id === id)
}

export function allBookmarks(): Bookmark[] {
  return load().sort((a, b) => b.savedAt - a.savedAt)
}

export function useBookmark(id: string) {
  if (typeof window === "undefined") return { bookmarked: false, toggle: () => {} }
  const bookmarked = isBookmarked(id)
  function toggle(bm: Omit<Bookmark, "savedAt" | "id">) {
    if (bookmarked) removeBookmark(id)
    else addBookmark({ id, ...bm })
  }
  return { bookmarked, toggle }
}
