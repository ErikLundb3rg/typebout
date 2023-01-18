export class BaseError extends Error {
  public status: number
  public message: string

  constructor(status: number, message?: string, stack?: string) {
    super()
    this.status = status ?? 500

    // So that `instanceof` will work with custom errors
    // https://www.dannyguo.com/blog/how-to-fix-instanceof-not-working-for-custom-errors-in-typescript
    Object.setPrototypeOf(this, BaseError.prototype)

    if (process.env.MODE === 'dev') {
      this.message = stack
        ? String(message) + '\nStack: ' + String(stack)
        : String(message)
      return
    }

    if (this.status >= 500) {
      this.message = 'Internal Server Error'
      return
    }

    this.message = String(message)
  }
}
