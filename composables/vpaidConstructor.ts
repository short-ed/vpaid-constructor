export interface VpaidElement {
  type: string
  id: string
  classList: string[]
  attributes: {
    [key: string]: string
  }
  children: VpaidElement[]
}

export interface VpaidCarouselSlide {
  elements: VpaidElement[]
}

export interface VpaidCarousel {
  slides: VpaidCarouselSlide[]
}

export const useVpaidConstructor = () => {
  const elements = useState<VpaidElement[]>('vpaidElements', () => [])

  const addElement = (element: VpaidElement, parent?: VpaidElement['id'] | VpaidElement) => {
    if (parent) {
      const isElement = typeof parent === 'object'
      if (isElement) {
        parent.children.push(element)
      } else {
        const findeParentElement = (elements: VpaidElement[], parrentId: string) => {
          // Use map for recursion find parent element
          return elements.map((element) => {
            if (element.id === parrentId) {
              element.children.push(element)
            } else {
              findeParentElement(element.children, parrentId)
            }
            return element
          })
        }
        return findeParentElement(elements.value, parent)
      }
    }
  }

  const vpaidElementsToHtml = (elements: VpaidElement[]) => {
    const createElement = (element: VpaidElement) => {
      const el = document.createElement(element.type)
      el.id = element.id
      el.classList.add(...element.classList)
      for (const [key, value] of Object.entries(element.attributes)) {
        el.setAttribute(key, value)
      }
      for (const child of element.children) {
        el.appendChild(createElement(child))
      }
      return el
    }
    const fragment = document.createDocumentFragment()
    for (const element of elements) {
      fragment.appendChild(createElement(element))
    }
    return fragment
  }

  type MaybeElement = MaybeRefOrGetter<HTMLElement>
  const renderToHTMLElement = (element: MaybeElement) => {
    if (!element) return
    const containerEl = toValue(element)
    containerEl.appendChild(vpaidElementsToHtml(elements.value))
  }

  return {
    elements,
    addElement,
    renderToHTMLElement
  }
}
