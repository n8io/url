import { InvalidParameterTypeError, RequiredParameterMissingError } from '../customErrors'
import { RouteParameters } from './types'

type Nullish = null | undefined
type SupportedPrimitive = bigint | boolean | number | string
type RouteParamValue = Nullish | SupportedPrimitive
type RouteParams = Record<string, RouteParamValue>

type Options = {
  allowNull?: boolean
}

const defaultOptions: Required<Options> = {
  allowNull: false,
}

type Params<T extends string = string> = RouteParameters<T>

const ROUTE_PARAM_PREFIX = ':'
const PLACEHOLDER_URL = 'http://placehold.er'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const isPojo = (v: any) => Object.getPrototypeOf(v) === Object.prototype

const invariantValidateParams = ({ params, route }: Params) => {
  if (typeof route !== 'string' || route.length === 0) {
    throw new RequiredParameterMissingError('pathname')
  }

  if (!isPojo(params)) {
    throw new InvalidParameterTypeError('params', 'object')
  }
}

const hydrateRoute = <T extends string = string>(route: T, params: Params<T>, options: Options = {}) => {
  invariantValidateParams({ params, route })

  const { allowNull } = { ...defaultOptions, ...options }
  const { hash, pathname, search } = new URL(route, PLACEHOLDER_URL)

  const hydrated = Object.entries(params)
    .filter(([, value]) => {
      if (value === undefined) {
        return false
      }

      return (value === null && allowNull) || value
    })
    .sort(([a], [b]) => b.length - a.length) // Longest keys are processed first
    .reduce((acc, [key, value]) => {
      const actualValue = (value ?? 'null').toString()

      return acc.replaceAll(`${ROUTE_PARAM_PREFIX}${key}`, encodeURIComponent(actualValue))
    }, pathname)

  const url = new URL(hydrated, PLACEHOLDER_URL)

  url.hash = hash
  url.search = search

  return url.href.replace(url.origin, '')
}

export type { RouteParams }
export { hydrateRoute, invariantValidateParams }
