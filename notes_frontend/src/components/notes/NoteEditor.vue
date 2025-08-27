<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import type { Note } from '@/views/NotesView.vue'

const props = defineProps<{
  note: Note | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  save: [note: Note]
  delete: [note: Note]
}>()

const form = reactive<Note>({ title: '', content: '' })

watch(
  () => props.note,
  (n) => {
    if (!n) {
      form.id = undefined
      form.title = ''
      form.content = ''
      return
    }
    form.id = n.id
    form.title = n.title
    form.content = n.content
  },
  { immediate: true }
)

const canSave = computed(() => !!props.note && (form.title.trim() !== '' || form.content.trim() !== ''))

function onSubmit(e: Event) {
  e.preventDefault()
  if (!props.note) return
  emit('save', { ...form })
}
function onDelete() {
  if (!props.note) return
  emit('delete', { ...form })
}
</script>

<template>
  <form class="editor" @submit="onSubmit" :aria-disabled="disabled">
    <div class="toolbar">
      <div class="left">
        <span class="chip">Detail</span>
      </div>
      <div class="right">
        <button type="button" class="btn ghost" :disabled="!note" @click="onDelete">Delete</button>
        <button type="submit" class="btn" :disabled="!canSave">Save</button>
      </div>
    </div>
    <div class="fields">
      <input
        class="input title"
        placeholder="Note title"
        v-model="form.title"
        :disabled="disabled"
      />
      <textarea
        class="textarea"
        placeholder="Write your note..."
        v-model="form.content"
        :disabled="disabled"
      />
    </div>
  </form>
</template>

<style scoped>
.editor {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 420px;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(0deg, var(--surface), var(--bg-soft));
}
.toolbar .right {
  display: flex;
  gap: 8px;
}
.fields {
  padding: 12px;
  display: grid;
  gap: 12px;
}
.title {
  font-size: 18px;
  font-weight: 600;
}
</style>
