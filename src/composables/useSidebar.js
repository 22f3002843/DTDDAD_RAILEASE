import { ref } from 'vue'

const isSidebarCollapsed = ref(localStorage.getItem('railease_sidebar_collapsed') === 'true')

export function useSidebar() {
  function toggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
    localStorage.setItem('railease_sidebar_collapsed', isSidebarCollapsed.value ? 'true' : 'false')
  }

  function setSidebarCollapsed(val) {
    isSidebarCollapsed.value = val
    localStorage.setItem('railease_sidebar_collapsed', val ? 'true' : 'false')
  }

  return {
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed
  }
}
