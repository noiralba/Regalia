
const personImages = import.meta.glob(
  '../assets/images/people/*',
  {
    eager: true,
    import: 'default',
  },
) as Record<string, string>

export function getPersonImage(image: string): string {
  const fileName = image.split('/').pop()

  const imagePath = `../assets/images/people/${fileName}`

  return personImages[imagePath] ?? ''
}
