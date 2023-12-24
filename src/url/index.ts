import { hydrateRoute } from '../hydrateRoute'
import { RouteParameters } from '../hydrateRoute/types'
import { SearchParameters, hydrateSearchParams } from '../hydrateSearchParams'

type URLParameters = ConstructorParameters<typeof globalThis.URL>

type Options = {
  allowRouteParamNulls?: boolean
  allowSearchParamNulls?: boolean
}

const defaultOptions: Required<Options> = {
  allowRouteParamNulls: false,
  allowSearchParamNulls: false,
}

type Params<T extends string = string> = {
  baseUrl: URL | string
  pathname?: T
  routeParams?: RouteParameters<T>
  searchParams?: SearchParameters
}

const defaultParams: Required<Omit<Params, 'baseUrl'>> = {
  pathname: '/',
  routeParams: {},
  searchParams: {},
}

const urlToRoot = (url: URL) => {
  const usernamePassword = url.username && url.password ? `${url.username}:${url.password}@` : ''
  const root = `${url.protocol}//${usernamePassword}${url.host}`

  return root
}

const urlToPathnameSansOrigin = (url: URL) => {
  const root = urlToRoot(url)

  return url.href.replace(root, '')
}

const pathnameAndSearchToUrl = (pathnameSansOrigin: string, origin: string) => new URL(`${origin}${pathnameSansOrigin}`)

const invariantValidateParams = ({ baseUrl }: Params) => {
  try {
    return new URL(typeof baseUrl === 'string' ? baseUrl : baseUrl.href)
  } catch {
    throw new Error('BASE_URL_INVALID: baseUrl is required and should be a valid url')
  }
}

const url = <T extends string = string>(
  params: {
    baseUrl: URL | string
    pathname?: T
    routeParams?: RouteParameters<T>
    searchParams?: SearchParameters
  },
  options: Options = {}
): URL => {
  const { baseUrl, pathname = '/', routeParams = {}, searchParams = {} } = { ...defaultParams, ...params }
  const url = invariantValidateParams({ baseUrl })

  const { allowSearchParamNulls, allowRouteParamNulls } = {
    ...defaultOptions,
    ...options,
  }

  url.pathname = hydrateRoute(pathname, routeParams, {
    allowNull: allowRouteParamNulls,
  })

  const urlSansOrigin = urlToPathnameSansOrigin(url)

  const pathnameWithSearch = hydrateSearchParams(
    { params: searchParams, route: urlSansOrigin },
    { allowNull: allowSearchParamNulls }
  )

  const output = pathnameAndSearchToUrl(pathnameWithSearch, urlToRoot(url))

  return output
}

type URLConfig<T extends string = string> = {
  pathname?: T
  options?: Options
  routeParams?: RouteParameters<T>
  searchParams?: SearchParameters
}

class _URL<T extends string = string> extends globalThis.URL {
  #isInitialized = false
  #config: URLConfig<T> = {}

  constructor(input: URLParameters[0], base?: URLParameters[1], config?: URLConfig<T>) {
    super(input, base)

    const pathname = config?.pathname ?? (this.pathname as T | undefined)

    this.#config = { ...config, pathname }
    this.href = this.#stringify()
    this.#isInitialized = true
  }

  #stringify = (): string => {
    const params = this.#isInitialized
      ? {
          pathname: this.pathname,
        }
      : {
          pathname: this.#config.pathname,
          routeParams: this.#config.routeParams,
          searchParams: this.#config.searchParams,
        }

    const { href } = url(
      {
        ...params,
        baseUrl: new URL(this.href),
      },
      this.#config.options
    )

    return href
  }

  toString = this.#stringify
}

export type { URLConfig }
export { _URL as URL, url }
