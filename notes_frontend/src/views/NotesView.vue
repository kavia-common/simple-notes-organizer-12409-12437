<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import NotesList from '@/components/notes/NotesList.vue'
import NoteEditor from '@/components/notes/NoteEditor.vue'
import { useNotesApi } from '@/services/notesApi'

export interface Note {
  id?: string
  title: string
  content: string
  updatedAt?: string
  createdAt?: string
}

const query = ref('')
const selected = ref<Note | null>(null)
const notes = ref<Note[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const { listNotes, createNote, updateNote, deleteNote } = useNotesApi()

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return notes.value
  return notes.value.filter(n =>
    (n.title || '').toLowerCase().includes(q) ||
    (n.content || '').toLowerCase().includes(q)
  )
})

async function refresh() {
  loading.value = true
  error.value = null
  try {
    notes.value = await listNotes()
    if (selected.value) {
      const exists = notes.value.find(n => n.id === selected.value?.id)
      if (!exists) selected.value = null
      else selected.value = exists
    }
  } catch (e) {
    const err = e as { message?: string }
    error.value = err?.message || 'Failed to load notes'
  } finally {
    loading.value = false
  }
}

function onSelect(note: Note) {
  selected.value = { ...note }
  // Scroll editor into view on mobile
  setTimeout(() => {
    document.getElementById('note-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 0)
}

async function onCreate() {
  const draft: Note = { title: 'Untitled', content: '' }
  const created = await createNote(draft)
  await refresh()
  onSelect(created)
}

async function onSave(edited: Note) {
  if (edited.id) {
    await updateNote(edited.id, edited)
  } else {
    await createNote(edited)
  }
  await refresh()
}

async function onDelete(note: Note) {
  if (!note.id) return
  await deleteNote(note.id)
  if (selected.value?.id === note.id) selected.value = null
  await refresh()
}

onMounted(() => {
  refresh()
  // listen to FAB create event from App.vue
  window.addEventListener('create-note', onCreate as EventListener)
})
</script>

<template>
  <div class="notes-grid">
    <!-- Sidebar list -->
    <aside class="panel elev-1">
      <div class="panel__header stack-12">
        <div class="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 21l-4.2-4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
          </svg>
          <input class="input" placeholder="Search notes..." v-model="query" />
        </div>
        <div class="muted" v-if="loading">Loading…</div>
        <div class="error" v-if="error">{{ error }}</div>
      </div>
      <NotesList
        :notes="filtered"
        :selectedId="selected?.id"
        @select="onSelect"
        @delete="onDelete"
      />
    </aside>

    <!-- Editor -->
    <section id="note-editor" class="panel elev-1">
      <NoteEditor
        :note="selected"
        :disabled="!selected"
        @save="onSave"
        @delete="onDelete"
      />
      <div v-if="!selected" class="empty">
        <p>Select a note from the list or use the + button to create one.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.notes-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
}
@media (max-width: 960px) {
  .notes-grid {
    grid-template-columns: 1fr;
  }
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  min-height: 200px;
}

.panel__header {
  padding: 12px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(0deg, var(--surface), var(--bg-soft));
}

.search {
  position: relative;
  display: flex;
  align-items: center;
}
.search svg {
  position: absolute;
  left: 12px;
  color: var(--text-soft);
}
.search .input {
  padding-left: 36px;
}

.muted {
  font-size: 12px;
  color: var(--text-soft);
}
.error {
  font-size: 13px;
  color: #ef4444;
}

/* Empty editor state */
.empty {
  padding: 32px;
  color: var(--text-soft);
  display: grid;
  place-items: center;
  min-height: 240px;
}
</style>
