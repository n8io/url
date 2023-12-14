class CustomError extends Error {
  cause?: Error
  code: string
  message: string

  constructor(message: string, code: string, cause?: Error) {
    super(message)

    this.cause = cause
    this.code = code
    this.message = message
  }
}

const errorCodes = {
  REQUIRED_PARAMETER_MISSING: 'REQUIRED_PARAMETER_MISSING',
  INVALID_PARAMETER_TYPE: 'INVALID_PARAMETER_TYPE',
} as const

class InvalidParameterTypeError extends CustomError {
  constructor(name: string, expectedType: string, code: string = errorCodes.INVALID_PARAMETER_TYPE, cause?: Error) {
    super(`Invalid parameter type for "${name}". Expected ${expectedType}.`, code, cause)
  }
}

class RequiredParameterMissingError extends CustomError {
  constructor(name: string, code: string = errorCodes.REQUIRED_PARAMETER_MISSING, cause?: Error) {
    super(`Required parameter "${name}" is missing.`, code, cause)
  }
}

export { InvalidParameterTypeError, RequiredParameterMissingError }
