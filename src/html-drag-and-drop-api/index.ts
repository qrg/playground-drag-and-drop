const CLASSNAME_DRAG_START = 'drag-start'
const CLASSNAME_DRAG_ENTER = 'drag-enter'

let draggingItem: HTMLElement

const onDragStart = (e: DragEvent) => {
  if (!e.dataTransfer) {
    return
  }
  console.log('dragstart', e, e.target)
  draggingItem = e.target as HTMLElement
  draggingItem.classList.add(CLASSNAME_DRAG_START)
  e.dataTransfer.setData('text/html', draggingItem.innerHTML)
}

const onDragEnd = (e: DragEvent) => {
  console.log('dragend', e, e.target)
  const target = e.target as HTMLElement
  target.classList.remove(CLASSNAME_DRAG_START)
}

const onDragOver = (e: DragEvent) => {
  if (!e.dataTransfer) return
  console.log('dragover', e)
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}

const onDragEnter = (e: DragEvent) => {
  if (!e.dataTransfer) {
    return
  }
  const target = e.target as HTMLElement
  console.log('dragenter', e, draggingItem)
  target.classList.add(CLASSNAME_DRAG_ENTER)
  draggingItem.innerHTML = target.innerHTML
}

const onDragLeave = (e: DragEvent) => {
  console.log('dragleave', e)
  const target = e.target as HTMLElement
  target.classList.remove(CLASSNAME_DRAG_ENTER)
}

const onDrop = (e: DragEvent) => {
  if (!e.dataTransfer) {
    return
  }
  const data = e.dataTransfer.getData('text/html')
  const target = e.target as HTMLElement
  console.log('drop', e, data)
  e.preventDefault()
  target.classList.remove(CLASSNAME_DRAG_START, CLASSNAME_DRAG_ENTER)

  draggingItem.innerHTML = target.innerHTML
  target.innerHTML = data
}

window.addEventListener('DOMContentLoaded', () => {
  const draggableItems: NodeListOf<HTMLElement> = document.querySelectorAll(
    '.draggable-item'
  )
  const dropzones: NodeListOf<HTMLElement> = document.querySelectorAll(
    '.dropzone'
  )
  draggableItems.forEach((el) => {
    el.addEventListener('dragstart', onDragStart)
    el.addEventListener('dragend', onDragEnd)
  })

  dropzones.forEach((el) => {
    el.addEventListener('dragover', onDragOver)
    el.addEventListener('dragenter', onDragEnter)
    el.addEventListener('dragleave', onDragLeave)
    el.addEventListener('drop', onDrop)
  })
})
