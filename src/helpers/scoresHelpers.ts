export const getResultFromScore = (score: string) => {
  const [away, home] = score
    .split(' ')[0]
    .split('-')
    .map((el) => Number(el))
  if (away > home) return 1
  if (away < home) return 2
  return 0
}
