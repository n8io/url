# `@n8io/url`

🌐 A tiny library that is meant to be a drop in replacement for the native `URL` class with some extra functionality to hydrate route and search parameters.

![Issues](https://img.shields.io/github/issues/n8io/url)
![License](https://img.shields.io/github/license/n8io/url)

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
- [`hydrateRoute(route, params, options?)`](#hydrateroute) - Given a route (e.g. `/dogs/:breed`), hydrate the route with a **type safe** route params object (e.g. `{ breed: 'pug' }`)
- [`hydrateSearchParams(route, params, options?)`](hydreatesearchparams) - Given a route, hydrate the route's search parameters via a plain old javascript object (e.g. `{ utm_source: 'facebook' }`) while respecting existing values.

### `URL`

> Why is this even needed? Doesn't the native `URL` give us all the tools we need?

The [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) and [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) apis are great and they provide us with all of the tools needed to manipulate urls. However the constructor for a new URL is quite rigid (`new URL(url: string, base?: string)`). 

This library's `URL` function provides a more ergonomic api for generating a URL from route and search parameters.

#### Example

##### Given the following...

```ts
const githubApiUrl = 'https://api.github.com/'

const routes = {
  USER_REPOSITORIES: '/users/:username/repos',
  // ...
}

const routeParams = { username: 'n8io' }

const searchParams = {
  page: 1,
  per_page: 25,
  sort: 'name',
  direction: 'asc',
}
```

##### Via native `URL` api...

```ts
const route = routes.REPOSITORY.replace(':username', routeParams.username)
const url = new URL(route, githubApiUrl)

url.searchParams.set('page', search.page.toString())
url.searchParams.set('pageSize', search.pageSize.toString())
url.searchParams.set('sort', 'name')
url.searchParams.set('sortBy', 'asc')
```

It may not be immediately clear, but this approach's developer experience is "Just OK"™️ for the following reasons:

- 🤢 Find/replacing keys with values is error prone:
  -  Relies on magic string keys, typos will happen
  -  Low readability
- 👎 Need to stringify values for search params

##### Via `url`...

```ts
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

console.log(url.href) // https://api.github.com/users/n8io/repos?page=1&pageSize=25&sort=name&sortBy=asc
```

Look at those ergonomics 🔥!

## Contributing

We welcome contributions from the community. If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and write tests if applicable.
4. Commit your changes and push them to your fork.
5. Open a pull request to the main repository.

## License

MIT License

Copyright (c) 2023 Nate Clark

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
