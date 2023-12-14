import { describe, expect, test } from 'vitest'
import { url, URL as _URL } from '.'

describe('url', () => {
  describe('when given invalid base url', () => {
    test('should throw', () => {
      // @ts-expect-error - intentionally passing invalid input
      expect(() => url({ baseUrl: 123 })).toThrow()
    })
  })

  describe('when given valid inputs', () => {
    const baseUrl = new URL('https://placehold.er/?:id=1#hash')
    const allowSearchParamNulls = true
    const pathname = '/one/:animal/Two/:animal/:color1/:animal/:color2/:animal' as const
    const routeParams = { animal: 'fish', color1: 'red', color2: 'blue' }
    const searchParams = { alpha: 'beta', gamma: ['delta', null, 'sigma', 'phi'] }

    const expected = {
      pathname: '/one/fish/Two/fish/red/fish/blue/fish',
      search: '%3Aid=1&alpha=beta&gamma=delta%2Cnull%2Csigma%2Cphi',
      hash: '#hash',
    } as const

    test('returns the proper URL instance', () => {
      const actual = url({ baseUrl, pathname, routeParams, searchParams }, { allowSearchParamNulls })

      expect(actual).toBeInstanceOf(URL)

      expect({
        origin: actual.origin,
        pathname: actual.pathname,
        search: actual.searchParams.toString(),
        hash: actual.hash,
      }).toEqual({
        origin: baseUrl.origin,
        pathname: expected.pathname,
        search: expected.search,
        hash: expected.hash,
      })
    })

    describe('and given a string for baseUrl', () => {
      test('returns the proper URL instance', () => {
        const actual = url({ baseUrl: baseUrl.href, pathname, routeParams, searchParams }, { allowSearchParamNulls })

        expect(actual).toBeInstanceOf(URL)

        expect({
          origin: actual.origin,
          pathname: actual.pathname,
          search: actual.searchParams.toString(),
          hash: actual.hash,
        }).toEqual({
          origin: baseUrl.origin,
          pathname: expected.pathname,
          search: expected.search,
          hash: expected.hash,
        })
      })
    })
  })
})

describe('URL', () => {
  describe('toString', () => {
    const pathname = '/one/:animal/Two/:animal/:color1/:animal/:color2/:animal' as const
    const routeParams = { animal: 'fish', color1: 'red', color2: 'blue' }
    const searchParams = { alpha: 'beta', gamma: ['delta', null, 'sigma', 'phi'], id: 1 }
    const options = { allowSearchParamNulls: true }

    describe('when given only the base', () => {
      test('returns the expected href', () => {
        const actual = new _URL('https://placehold.er/?id=999#hash', undefined, {
          options,
          pathname,
          routeParams,
          searchParams,
        }).toString()

        expect(actual).toBe(
          'https://placehold.er/one/fish/Two/fish/red/fish/blue/fish?id=1&alpha=beta&gamma=delta%2Cnull%2Csigma%2Cphi#hash'
        )
      })
    })

    describe('when given a base and url', () => {
      test('returns the expected href', () => {
        const actual = new _URL(`${pathname}?id=999#hash`, 'https://placehold.er/', {
          options,
          pathname: undefined,
          routeParams,
          searchParams,
        })

        expect({
          origin: actual.origin,
          pathname: actual.pathname,
          search: Object.fromEntries(actual.searchParams),
          hash: actual.hash,
        }).toMatchObject({
          origin: 'https://placehold.er',
          pathname: '/one/fish/Two/fish/red/fish/blue/fish',
          search: Object.fromEntries(new URLSearchParams('id=1&alpha=beta&gamma=delta%2Cnull%2Csigma%2Cphi')),
          hash: '#hash',
        })
      })
    })

    describe('when modifying the url after initialization', () => {
      test('returns the expected href', () => {
        const actual = new _URL(`${pathname}?id=999#hash`, 'https://placehold.er/', {
          options,
          // pathname,
          routeParams,
          searchParams,
        })

        actual.hash = 'hash-too'
        actual.host = 'google.com'
        actual.password = 'password'
        actual.pathname = '/'
        actual.port = '8080'
        actual.protocol = 'ftp'
        actual.username = 'username'
        actual.searchParams.set('id', 'changed')
        actual.searchParams.delete('gamma')

        expect({
          hash: actual.hash,
          host: actual.host,
          password: actual.password,
          pathname: actual.pathname,
          port: actual.port,
          protocol: actual.protocol,
          search: Object.fromEntries(actual.searchParams),
          username: actual.username,
        }).toEqual({
          hash: '#hash-too',
          host: 'google.com:8080',
          password: 'password',
          pathname: '/',
          port: '8080',
          protocol: 'ftp:',
          search: Object.fromEntries(new URLSearchParams('id=changed&alpha=beta')),
          username: 'username',
        })

        expect(actual.toString()).toEqual(actual.href)
      })
    })
  })
})
