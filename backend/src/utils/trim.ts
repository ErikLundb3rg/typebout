// Ehhhh, sorry!
export const trimStringRecord = <T extends Record<string, string>>(
  input: T
) => {
  const trimmedObj = {} as T
  for (let k in input) {
    trimmedObj[k as keyof T] = input[k].trim() as T[keyof T]
  }
  return trimmedObj
}
