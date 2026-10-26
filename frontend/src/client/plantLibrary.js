import { formatNumber } from '../lib/format.js'

export function initPlantLibrary(root) {
  const form = root.querySelector('[data-plant-filter]')
  const count = root.querySelector('[data-plant-count]')
  const empty = root.querySelector('[data-plant-empty]')
  const items = [...root.querySelectorAll('[data-plant]')]
  const groups = [...root.querySelectorAll('[data-plant-group]')].map((section) => ({
    section,
    count: section.querySelector('[data-group-count]'),
    items: [...section.querySelectorAll('[data-plant]')],
  }))

  function apply() {
    const query = form.elements.q.value.trim().toLowerCase()
    const group = form.elements.group.value
    const setting = form.elements.setting.value
    const care = form.elements.care.value

    for (const item of items) {
      const { search, group: itemGroup, settings, care: itemCare } = item.dataset
      item.hidden = !(
        (!query || search.includes(query)) &&
        (!group || itemGroup === group) &&
        (!setting || settings.split(' ').includes(setting)) &&
        (!care || itemCare === care)
      )
    }

    let shown = 0
    for (const { section, count: groupCount, items: groupItems } of groups) {
      const visible = groupItems.filter((item) => !item.hidden).length
      section.hidden = visible === 0
      groupCount.textContent = formatNumber(visible)
      shown += visible
    }

    const total = items.length
    count.textContent =
      shown === total
        ? `Showing all ${formatNumber(total)} plants`
        : `Showing ${formatNumber(shown)} of ${formatNumber(total)} plants`
    empty.hidden = shown > 0
  }

  let pending
  form.addEventListener('input', () => {
    clearTimeout(pending)
    pending = setTimeout(apply, 150)
  })
  form.addEventListener('submit', (event) => event.preventDefault())
  // Reset fires before the fields are cleared; filter on the next tick.
  form.addEventListener('reset', () => setTimeout(apply))
  root.querySelector('[data-plant-clear]').addEventListener('click', () => form.reset())

  // Links like /plants#monstera open that plant's drop-down.
  function openFromHash() {
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
    if (target?.tagName !== 'DETAILS') return
    target.open = true
    target.querySelector('summary').focus({ preventScroll: true })
    target.scrollIntoView({ block: 'start' })
  }
  window.addEventListener('hashchange', openFromHash)
  openFromHash()
}
