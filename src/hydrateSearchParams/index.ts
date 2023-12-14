import { InvalidParameterTypeError, RequiredParameterMissingError } from '../customErrors'

type EmptyValue = null | undefined
type SupportedPrimitive = bigint | boolean | number | string
type SearchParameterValue = EmptyValue | SupportedPrimitive
type SearchParameter = SearchParameterValue | SearchParameterValue[]
type SearchParameters = Record<string, SearchParameter>

type Options = {
  allowNull?: boolean
}

const defaultOptions: Required<Options> = {
  allowNull: false,
}

type Params = {
  params: SearchParameters
  route?: string
}

const defaultParams: Required<Omit<Params, 'params'>> = {
  route: '/',
}

const PLACEHOLDER_URL = 'http://placehold.er'

const invariantValidateParams = ({ params, route }: Params) => {
  if (typeof route !== 'string') {
    throw new RequiredParameterMissingError('route')
  }

  if (Object.getPrototypeOf(params) !== Object.prototype) {
    throw new InvalidParameterTypeError('params', 'object')
  }
}

const makeApplyUrlSearchParams =
  ({ allowNull }: Options) =>
  (url: URL) =>
  ([key, value]: [string, SearchParameter]) => {
    switch (true) {
      case value === undefined:
        return
      case value === null:
        if (allowNull) {
          return url.searchParams.set(key, JSON.stringify(value))
        }

        return
      case Array.isArray(value): {
        const typedValue = (value as SearchParameterValue[])
          .filter((value) => {
            if (value === undefined) {
              return false
            }

            if (value === null) {
              return allowNull
            }

            return true
          })
          .map((value) => {
            if (value === null) {
              return JSON.stringify(value)
            }

            return (value as SupportedPrimitive).toString()
          })

        if (typedValue.length === 0) {
          return
        }

        return url.searchParams.set(key, typedValue.toString())
      }
      default:
        return url.searchParams.set(key, (value as SupportedPrimitive).toString())
    }
  }

const hydrateSearchParams = (params: Params, options: Options = {}) => {
  const { params: actualParams = {}, route } = { ...defaultParams, ...params }

  invariantValidateParams({ params: actualParams, route })

  const actualOptions = { ...defaultOptions, ...options }
  const url = route ? new URL(route, PLACEHOLDER_URL) : new URL(PLACEHOLDER_URL)
  const applyUrlSearchParamsToUrl = makeApplyUrlSearchParams(actualOptions)(url)

  for (const [key, value] of Object.entries(actualParams)) {
    applyUrlSearchParamsToUrl([key, value])
  }

  return url.href.replace(url.origin, '')
}

export type { SearchParameters }
export { hydrateSearchParams }
