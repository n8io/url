# `@n8io/url`

🌐 A tiny library that is meant to be a drop in replacement for the native `URL` class with some extra functionality to hydrate route and search parameters.

[![check-code-coverage](https://img.shields.io/badge/code--coverage-100%25-brightgreen)](https://github.com/n8io/url/actions/workflows/publish.yml?query=branch%3Amain)
[![Issues](https://img.shields.io/github/issues/n8io/url)](https://github.com/n8io/url/issues)
[![License](https://img.shields.io/github/license/n8io/url)](https://github.com/n8io/url/blob/main/LICENSE)

## Basic Usage

```ts
import { URL } from '@n8io/url'

const url = new URL(
  '/',
  apiUrl, 
  {
    pathname: '/users/:username/repos',
    // Based on the pathname 👆...
    // the route params are type checked 👇 
    routeParams: { username: 'n8io' },
    searchParams,
  }
)
```

## Getting Started

```shell
pnpm install @n8io/url
```

## API

This library provides the following utility functions:

- [`URL`](#url) - A drop in replacement for the native `URL` interface, supercharged with route and search parameter hydration
- [`url(params, options?): URL`](#urlparams-options-url) - A utility to generate a hydrated `URL` from a base url, route, and search parameters
- [`hydrateRoute(route, params, options?): string`](#hydraterouteroute-params-options-string) - Given a route (e.g. `/dogs/:breed`), hydrate the route with a **type safe** route params object (e.g. `{ breed: 'pug' }`)
- [`hydrateSearchParams(route, params, options?): string`](#hydratesearchparamsroute-params-options-string) - Given a route, hydrate the route's search parameters via a plain old javascript object (e.g. `{ utm_source: 'facebook' }`) while respecting existing values.

### `URL`

> Why is this even needed? Doesn't the native `URL` give us all the tools we need?

The [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) and [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) apis are great and they provide us with all of the tools needed to manipulate urls. However the constructor for a new URL is quite rigid (`new URL(url: string, base?: string)`). 

This library's `URL` function provides a more ergonomic api for generating a URL from route and search parameters.

#### Example usage

```ts
const githubApiUrl = 'https://api.github.com/'

const routes = {
  USER_REPOSITORIES: '/users/:username/repos',
}

const routeParams = { username: 'n8io' }

const searchParams = {
  page: 1,
  per_page: 25,
  sort: 'name',
  direction: 'asc',
}

// The native `URL` api...

const route = routes.REPOSITORY.replace(':username', routeParams.username)
const url = new URL(route, githubApiUrl)

url.searchParams.set('page', search.page.toString())
url.searchParams.set('pageSize', search.pageSize.toString())
url.searchParams.set('sort', 'name')
url.searchParams.set('sortBy', 'asc')

// This library's `URL`...
import { URL } from '@n8io/url'

const url = new URL(
  '/', 
  githubApiUrl, 
  {
    pathname: '/users/:username/repos',
    // Based on the pathname 👆...
    // the route params are type checked 👇 
    routeParams,
    searchParams,
  }
)
```

### `url(params, options?): URL`

Given a base url, route, and search parameters it returns a fully hydrated `URL` instance.

It takes two parameters:

- `params`: An object that includes `baseUrl`, `pathname?`, `routeParams?`, and `searchParams?`.
- `options?`: An optional object that includes `allowRouteParamNulls` and `allowSearchParamNulls`

#### Example usage

```ts
import { url } from '@n8io/url'

const params = {
  baseUrl: 'https://api.github.com',
  pathname: '/users/:username/repos',
  routeParams: { username: 'n8io' },
  searchParams: { page: 1, per_page: 25, sort: 'name', direction: 'asc' },
}

const options = {
  allowRouteParamNulls: false,
  allowSearchParamNulls: false,
}

const hydratedUrl = url(params, options)
// https://api.github.com/users/n8io/repos?page=1&per_page=25&sort=name&direction=asc
```

### `hydrateRoute(route, params, options?): string`

Given a route and route params return a hydrated route string.

It takes three parameters:

- `route`: A string that represents the route (e.g. `/dogs/:breed`).
- `params`: A route params object (e.g. `{ breed: 'pug' }`).
- `options?`: An optional object that includes `allowNull`.

#### Example usage

```ts
import { hydrateRoute } from '@n8io/url'

const route = '/users/:username/repos'
const params = { username: 'n8io' }
const options = { allowNull: false }

const hydratedRoute = hydrateRoute(route, params, options)
// /users/n8io/repos
```

### `hydrateSearchParams(route, params, options?): string`

This function hydrates a route's search parameters via a plain old javascript object, all while respecting existing values.

It takes three parameters:

- `route`: A string that represents the route.
- `params`: A search params object (e.g. `{ utm_source: 'facebook' }`).
- `options?`: An optional object that includes `allowNull`.

#### Example usage

```ts
import { hydrateSearchParams } from '@n8io/url'

const route = '/users/n8io/repos'
const params = { page: 1, per_page: 25, sort: 'name', direction: 'asc' }
const options = { allowNull: false }

const hydratedSearchParams = hydrateSearchParams(route, params, options)
// /users/n8io/repos?page=1&per_page=25&sort=name&direction=asc
```

## Contributing

We welcome contributions from the community. If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and write tests if applicable.
4. Commit your changes and push them to your fork.
5. Open a pull request to the main repository.
