type ResultOk<T> = {
  ok: true
  data: T
}

type ResultError<E> = {
  ok: false
  error: E
}

export type Result<T, E> = ResultOk<T> | ResultError<E>

export function Ok<T>(data: T): Result<T, never> {
  return {
    ok: true,
    data,
  }
}

export function Err<E>(
  error: E
): Result<never, E> {
  return {
    ok: false,
    error,
  }
}
