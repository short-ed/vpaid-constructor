export enum SlideField {
  Title,
  Description,
  Image,
  Link,
  Button
}

export const useSlideSettings = () => {

  const visibleFields = useState<SlideField[]>('visibleFields', () => [
    SlideField.Title,
    SlideField.Image,
    SlideField.Button
  ])

  const hiddenFields = useState<SlideField[]>('hiddenFields', () => [
    SlideField.Description,
    SlideField.Link,
  ])

  const textOnButton = useState<string>('textOnButton', () => 'Кнопка')
  const textOnLink = useState<string>('textOnLink', () => 'Ссылка')

  return {
    visibleFields,
    hiddenFields,
    textOnButton,
    textOnLink
  }
}
