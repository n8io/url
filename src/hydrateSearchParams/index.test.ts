import { describe, expect, test } from 'vitest'
import { hydrateSearchParams } from '.'

describe('hydrateSearchParams', () => {
  describe('when provided valid input', () => {
    describe('when ignoring nulls', () => {
      const allowNull = false

      test('returns the expected route with search params', () => {
        const route = '/foo'

        const searchParams = {
          array: ['a', undefined, 'b', null, 'c'],
          boolean: true,
          null: null,
          number: 1,
          string: 'STRING',
          undefined: undefined,
        }

        const actual = hydrateSearchParams({ route, params: searchParams }, { allowNull })

        expect(actual).toEqual('/foo?array=a%2Cb%2Cc&boolean=true&number=1&string=STRING')
      })
    })

    describe('when NOT ignoring nulls', () => {
      const allowNull = true

      test('returns the expected route with search params', () => {
        const route = '/foo'

        const params = {
          array: ['a', 'b', 'c'],
          boolean: true,
          null: null,
          number: 1,
          string: 'STRING',
          undefined: undefined,
        }

        const actual = hydrateSearchParams({ route, params }, { allowNull })

        expect(actual).toEqual('/foo?array=a%2Cb%2Cc&boolean=true&null=null&number=1&string=STRING')
      })
    })

    describe('when given given an empty string route', () => {
      const route = ''

      test('returns a route without search params', () => {
        const actual = hydrateSearchParams({ route, params: {} })

        expect(actual).toEqual('/')
      })
    })

    describe('when given a route without a leading "/"', () => {
      test('returns a route with a leading "/"', () => {
        const route = 'no-leading-slash'
        const params = {}
        const actual = hydrateSearchParams({ route, params })

        expect(actual).toEqual('/no-leading-slash')
      })
    })

    describe('when given a search param with a single property that is an array composed only of null-ish values', () => {
      const allowNull = false

      const params = {
        array: [null, undefined],
      }

      test('returns a route without search params', () => {
        const actual = hydrateSearchParams(
          {
            route: '/',
            params,
          },
          { allowNull }
        )

        expect(actual).toEqual('/')
      })
    })

    describe('when given a route with pre-existing search params and hash', () => {
      const route = '/?taco=yum#hash'

      const params = {
        hotDog: 'gross',
        taco: 'tasty',
      }

      test('returns a route without search params', () => {
        const actual = hydrateSearchParams({
          route,
          params,
        })

        expect(actual).toEqual('/?taco=tasty&hotDog=gross#hash')
      })
    })
  })

  describe('when NOT provided route', () => {
    const route = null

    test('should throw', () => {
      // @ts-expect-error - intentionally passing invalid input
      expect(() => hydrateSearchParams({ route })).toThrow()
    })
  })

  describe('when NOT provided search params', () => {
    const route = '/'

    test('should not throw', () => {
      // @ts-expect-error - intentionally passing invalid input
      expect(() => hydrateSearchParams({ route })).not.toThrow()
    })
  })

  describe('when search params is not an object', () => {
    const route = '/'

    test('should throw', () => {
      // @ts-expect-error - intentionally passing invalid input
      expect(() => hydrateSearchParams({ route, params: [] })).toThrow()
      // @ts-expect-error - intentionally passing invalid input
      expect(() => hydrateSearchParams({ route, params: true })).toThrow()
      // @ts-expect-error - intentionally passing invalid input
      expect(() => hydrateSearchParams({ route, params: 42 })).toThrow()
      // @ts-expect-error - intentionally passing invalid input
      expect(() => hydrateSearchParams({ route, params: '' })).toThrow()
    })
  })
})
