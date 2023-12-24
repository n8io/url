import { S } from 'ts-toolbelt'

type AllowedPrimitives = bigint | boolean | null | number | string | symbol
type AllowedValues = AllowedPrimitives | AllowedPrimitives[]
type PathParts<P extends string> = Exclude<S.Split<P, '/'>[number], ''>

type RouteParametersMap<P extends string> = {
  [Key in PathParts<P> as Key extends `:${infer KeySansColon}` ? KeySansColon : never]: AllowedValues
}

type NonEmptyObject<T extends string> = keyof RouteParametersMap<T> extends [never]
  ? Record<PropertyKey, unknown>
  : RouteParametersMap<T>

type RouteParameters<T extends string = string> = NonEmptyObject<T>

export type { RouteParameters }
