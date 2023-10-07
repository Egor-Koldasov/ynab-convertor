export const waitFor = <FnReturn>(
  fn: () => FnReturn,
  interval = 100
): Promise<NonNullable<FnReturn>> => {
  return new Promise((resolve) => {
    const initInterval = () => {
      const fnReturn = fn()
      if (fnReturn) resolve(fnReturn)
      return !!fnReturn
    }
    const intervalId = setInterval(() => {
      if (initInterval()) clearInterval(intervalId)
    }, interval)
  })
}
