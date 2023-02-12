type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>

type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>

export class ClientError extends Error {
  public status: number
  constructor(status: IntRange<400, 500>, message: string) {
    super(message)
    this.status = status
  }
}

export class ServerError extends Error {
  public status: number
  constructor(status: IntRange<500, 600>, message: string) {
    super(message)
    this.status = status
  }
}

export function isClientErrorStatus(status: number): status is IntRange<400, 500> {
  return status >= 400 && status <= 499
}

export function isServerErrorStatus(status: number): status is IntRange<500, 600> {
  return status >= 500 && status <= 599
}