import { describe, expect, test } from 'vitest'
import { hydrateRoute } from '.'
import { RouteParameters } from './types'

const route = '/one/:animal/Two/:animal/:id/:animal/:id2/:animal/?:id=1&:animal=1#hash'
const routeParams: RouteParameters<typeof route> = { animal: 'fish', id: 'red', id2: 'blue' }

describe('hydrateRoute', () => {
  describe('and route params are empty', () => {
    test('returns the same pathname', () => {
      const routeSansParams = '/test/route'
      const actual = hydrateRoute(routeSansParams, {})

      expect(actual).toEqual(routeSansParams)
    })
  })

  describe('and null is allowed', () => {
    const allowNull = true

    test('returns the correctly hydrated route', () => {
      const params = { ...routeParams, id: null }
      const actual = hydrateRoute(route, params, { allowNull })

      expect(typeof actual === 'string').toBe(true)
      expect(actual).toEqual('/one/fish/Two/fish/null/fish/blue/fish/?:id=1&:animal=1#hash')
    })
  })

  describe('and null is NOT allowed', () => {
    const allowNull = false

    test('returns the correctly hydrated route', () => {
      const params = { ...routeParams, id: null }
      const actual = hydrateRoute(route, params, { allowNull })

      expect(typeof actual === 'string').toBe(true)
      expect(actual).toEqual('/one/fish/Two/fish/:id/fish/blue/fish/?:id=1&:animal=1#hash')
    })
  })

  describe('and there are undefined route params', () => {
    const params = { ...routeParams, id: undefined }

    test('returns the correctly hydrated route', () => {
      // @ts-expect-error - intentionally passing invalid input
      const actual = hydrateRoute(route, params)

      expect(typeof actual === 'string').toBe(true)
      expect(actual).toEqual('/one/fish/Two/fish/:id/fish/blue/fish/?:id=1&:animal=1#hash')
    })
  })
})

describe('invariantValidateParams', () => {
  describe('when NOT provided route', () => {
    test('should throw', () => {
      // @ts-expect-error - intentionally passing invalid input
      expect(() => hydrateRoute().toThrow())
    })
  })
  describe('when provided an empty string route', () => {
    test('should throw', () => {
      expect(() => hydrateRoute('', routeParams)).toThrow()
    })
  })

  describe('when NOT provided route params', () => {
    test('should throw', () => {
      // @ts-expect-error - intentionally passing invalid input
      expect(() => hydrateRoute(route, undefined)).toThrow()
    })
  })

  describe('when provided route params that is not an object', () => {
    test('should throw', () => {
      // @ts-expect-error - intentionally passing invalid input
      expect(() => hydrateRoute(route, true)).toThrow()
    })
  })
})
