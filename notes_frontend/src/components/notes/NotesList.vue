<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '@/views/NotesView.vue'

const props = defineProps<{
  notes: Note[]
  selectedId?: string
}>()

const emit = defineEmits<{
  select: [note: Note]
  delete: [note: Note]
}>()

const sorted = computed(() =>
  [...props.notes].sort((a, b) => {
    const aD = a.updatedAt || a.createdAt || ''
    const bD = b.updatedAt || b.createdAt || ''
    return bD.localeCompare(aD)
  })
)

function snippet(text?: string) {
  if (!text) return ''
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length > 80 ? t.slice(0, 80) + '…' : t
}
</script>

<template>
  <ul class="list">
    <li
      v-for="n in sorted"
      :key="n.id"
      class="item"
      :class="{ active: n.id === selectedId }"
      @click="emit('select', n)"
    >
      <div class="item__main">
        <div class="item__title">{{ n.title || 'Untitled' }}</div>
        <div class="item__meta">
          <span class="chip">{{ new Date(n.updatedAt || n.createdAt || Date.now()).toLocaleString() }}</span>
          <span class="muted">{{ snippet(n.content) }}</span>
        </div>
      </div>
      <button
        class="icon-btn"
        title="Delete"
        aria-label="Delete note"
        @click.stop="emit('delete', n)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 7h12m-9 3v7m6-7v7M9 7l1-2h4l1 2m-9 0v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </li>
    <li v-if="!sorted.length" class="empty">No notes yet.</li>
  </ul>
</template>

<style scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: calc(100vh - 64px - 160px);
  overflow: auto;
}
.item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--border);
  cursor: pointer;
  transition: background .15s ease;
}
.item:first-child { border-top: 0; }
.item:hover { background: var(--bg-soft); }
.item.active {
  background: linear-gradient(0deg, rgba(25,118,210,0.06), transparent);
  outline: 1px solid rgba(25,118,210,0.18);
}
.item__title {
  font-weight: 600;
}
.item__meta {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 6px;
  flex-wrap: wrap;
}
.muted {
  color: var(--text-soft);
  font-size: 12px;
}

.icon-btn {
  align-self: start;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 32px; height: 32px;
  display: grid; place-items: center;
  color: var(--text-soft);
  cursor: pointer;
}
.icon-btn:hover {
  color: #ef4444;
  border-color: #ef4444;
}

.empty {
  padding: 20px;
  color: var(--text-soft);
}
</style>
