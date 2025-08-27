<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { RouterView } from 'vue-router'

const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)') ?? { matches: false }
const stored = localStorage.getItem('simple-notes-theme')
const isDark = ref(stored ? stored === 'dark' : false)

const themeLabel = computed(() => (isDark.value ? 'Dark' : 'Light'))

watchEffect(() => {
  const root = document.documentElement
  if (isDark.value) root.classList.add('dark')
  else root.classList.remove('dark')
  localStorage.setItem('simple-notes-theme', isDark.value ? 'dark' : 'light')
})

onMounted(() => {
  // init default: light; but if user prefers dark and no storage, set to dark
  if (!stored && prefersDark.matches) {
    isDark.value = true
  }
})

function toggleTheme() {
  isDark.value = !isDark.value
}

function onFabClick() {
  // Dispatch a custom event on window; typed safely in TS context
  const CE = CustomEvent as unknown as { new (type: string): CustomEvent }
  window.dispatchEvent(new CE('create-note'))
}
</script>

<template>
  <div class="app-shell">
    <!-- Top Navbar -->
    <header class="navbar elev-1">
      <div class="container navbar__inner">
        <div class="brand">
          <div class="brand__dot" />
          <h1 class="brand__title">Simple Notes</h1>
        </div>
        <div class="navbar__actions">
          <button class="btn ghost" @click="toggleTheme" aria-label="Toggle theme">
            <span class="theme-indicator" :class="{ on: isDark }"></span>
            <span>{{ themeLabel }} mode</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <!-- Floating Action Button -->
    <button
      id="fab"
      class="fab elev-2"
      title="Add note"
      aria-label="Add note"
      @click="onFabClick"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.navbar__inner {
  display: flex;
  align-items: center;
  height: 64px;
  justify-content: space-between;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.brand__dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  box-shadow: 0 0 0 4px rgba(25,118,210,0.18);
}
.brand__title {
  font-size: 18px;
  letter-spacing: .2px;
  font-weight: 600;
}

/* theme toggle indicator */
.theme-indicator {
  width: 14px; height: 14px; border-radius: 50%;
  background: #f59e0b;
  box-shadow: inset -3px -3px 6px rgba(0,0,0,0.12);
  margin-right: 4px;
  position: relative;
}
.theme-indicator.on {
  background: #111827;
  box-shadow: inset -4px -4px 10px rgba(255,255,255,0.03);
}

/* Main */
.main {
  flex: 1;
  padding: 20px 0 80px;
}

/* FAB */
.fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform .08s ease, filter .2s ease;
}
.fab:hover { filter: brightness(1.05); }
.fab:active { transform: translateY(1px); }
</style>
