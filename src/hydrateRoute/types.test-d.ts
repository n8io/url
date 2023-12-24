import { assertType, describe, test } from 'vitest'
import { RouteParameters } from './types'

describe('RouteParameters', () => {
  const route = '/users/:id/:action' as const

  describe('when given valid route params', () => {
    const routeParams = { action: 'action', id: 1 }

    test('should be the proper type', () => {
      assertType<RouteParameters<typeof route>>(routeParams)
    })
  })

  describe('when given invalid route params', () => {
    const routeParams = { action: 'action' }

    test('should be the proper type', () => {
      // @ts-expect-error - intentionally passing invalid input
      assertType<RouteParameters<typeof route>>(routeParams)
    })
  })
})
