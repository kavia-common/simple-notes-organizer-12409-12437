/**
 * Simple Notes API client with minimal error handling.
 * Reads VITE_NOTES_API_URL from environment. Default: /api
 */

export interface Note {
  id?: string
  title: string
  content: string
  createdAt?: string
  updatedAt?: string
}

const BASE_URL: string =
  (import.meta as unknown as { env?: Record<string, string | undefined> })?.env?.VITE_NOTES_API_URL ||
  '/api'

/**
// PUBLIC_INTERFACE
 */
export function useNotesApi() {
  /**
   * PUBLIC_INTERFACE
   * listNotes
   * Returns array of notes from the backend.
   */
  async function listNotes(): Promise<Note[]> {
    const res = await fetch(`${BASE_URL}/notes`, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`Failed to list notes (${res.status})`)
    const data = (await res.json()) as unknown
    if (Array.isArray(data)) return data as Note[]
    const items = (data as { items?: Note[] } | null)?.items
    return Array.isArray(items) ? items : []
  }

  /**
   * PUBLIC_INTERFACE
   * createNote
   * Creates a new note and returns created object.
   */
  async function createNote(payload: Note): Promise<Note> {
    const res = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Failed to create note (${res.status})`)
    return (await res.json()) as Note
  }

  /**
   * PUBLIC_INTERFACE
   * updateNote
   * Updates a note by id. Returns updated object.
   */
  async function updateNote(id: string, payload: Note): Promise<Note> {
    const res = await fetch(`${BASE_URL}/notes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Failed to update note (${res.status})`)
    return (await res.json()) as Note
  }

  /**
   * PUBLIC_INTERFACE
   * deleteNote
   * Deletes a note by id.
   */
  async function deleteNote(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/notes/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`Failed to delete note (${res.status})`)
  }

  return { listNotes, createNote, updateNote, deleteNote }
}
