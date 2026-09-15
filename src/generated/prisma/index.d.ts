
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model SnapshotMeta
 * 
 */
export type SnapshotMeta = $Result.DefaultSelection<Prisma.$SnapshotMetaPayload>
/**
 * Model KpiDiario
 * 
 */
export type KpiDiario = $Result.DefaultSelection<Prisma.$KpiDiarioPayload>
/**
 * Model Usuario
 * 
 */
export type Usuario = $Result.DefaultSelection<Prisma.$UsuarioPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SnapshotMetas
 * const snapshotMetas = await prisma.snapshotMeta.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more SnapshotMetas
   * const snapshotMetas = await prisma.snapshotMeta.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.snapshotMeta`: Exposes CRUD operations for the **SnapshotMeta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SnapshotMetas
    * const snapshotMetas = await prisma.snapshotMeta.findMany()
    * ```
    */
  get snapshotMeta(): Prisma.SnapshotMetaDelegate<ExtArgs>;

  /**
   * `prisma.kpiDiario`: Exposes CRUD operations for the **KpiDiario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KpiDiarios
    * const kpiDiarios = await prisma.kpiDiario.findMany()
    * ```
    */
  get kpiDiario(): Prisma.KpiDiarioDelegate<ExtArgs>;

  /**
   * `prisma.usuario`: Exposes CRUD operations for the **Usuario** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuario.findMany()
    * ```
    */
  get usuario(): Prisma.UsuarioDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    SnapshotMeta: 'SnapshotMeta',
    KpiDiario: 'KpiDiario',
    Usuario: 'Usuario'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "snapshotMeta" | "kpiDiario" | "usuario"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SnapshotMeta: {
        payload: Prisma.$SnapshotMetaPayload<ExtArgs>
        fields: Prisma.SnapshotMetaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnapshotMetaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotMetaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnapshotMetaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotMetaPayload>
          }
          findFirst: {
            args: Prisma.SnapshotMetaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotMetaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnapshotMetaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotMetaPayload>
          }
          findMany: {
            args: Prisma.SnapshotMetaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotMetaPayload>[]
          }
          create: {
            args: Prisma.SnapshotMetaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotMetaPayload>
          }
          createMany: {
            args: Prisma.SnapshotMetaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnapshotMetaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotMetaPayload>[]
          }
          delete: {
            args: Prisma.SnapshotMetaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotMetaPayload>
          }
          update: {
            args: Prisma.SnapshotMetaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotMetaPayload>
          }
          deleteMany: {
            args: Prisma.SnapshotMetaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnapshotMetaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SnapshotMetaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotMetaPayload>
          }
          aggregate: {
            args: Prisma.SnapshotMetaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnapshotMeta>
          }
          groupBy: {
            args: Prisma.SnapshotMetaGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnapshotMetaGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnapshotMetaCountArgs<ExtArgs>
            result: $Utils.Optional<SnapshotMetaCountAggregateOutputType> | number
          }
        }
      }
      KpiDiario: {
        payload: Prisma.$KpiDiarioPayload<ExtArgs>
        fields: Prisma.KpiDiarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KpiDiarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KpiDiarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KpiDiarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KpiDiarioPayload>
          }
          findFirst: {
            args: Prisma.KpiDiarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KpiDiarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KpiDiarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KpiDiarioPayload>
          }
          findMany: {
            args: Prisma.KpiDiarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KpiDiarioPayload>[]
          }
          create: {
            args: Prisma.KpiDiarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KpiDiarioPayload>
          }
          createMany: {
            args: Prisma.KpiDiarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KpiDiarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KpiDiarioPayload>[]
          }
          delete: {
            args: Prisma.KpiDiarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KpiDiarioPayload>
          }
          update: {
            args: Prisma.KpiDiarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KpiDiarioPayload>
          }
          deleteMany: {
            args: Prisma.KpiDiarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KpiDiarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.KpiDiarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KpiDiarioPayload>
          }
          aggregate: {
            args: Prisma.KpiDiarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKpiDiario>
          }
          groupBy: {
            args: Prisma.KpiDiarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<KpiDiarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.KpiDiarioCountArgs<ExtArgs>
            result: $Utils.Optional<KpiDiarioCountAggregateOutputType> | number
          }
        }
      }
      Usuario: {
        payload: Prisma.$UsuarioPayload<ExtArgs>
        fields: Prisma.UsuarioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findFirst: {
            args: Prisma.UsuarioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          findMany: {
            args: Prisma.UsuarioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          create: {
            args: Prisma.UsuarioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          createMany: {
            args: Prisma.UsuarioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
          }
          delete: {
            args: Prisma.UsuarioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          update: {
            args: Prisma.UsuarioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          deleteMany: {
            args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UsuarioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsuarioPayload>
          }
          aggregate: {
            args: Prisma.UsuarioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuario>
          }
          groupBy: {
            args: Prisma.UsuarioGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuarioGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsuarioCountArgs<ExtArgs>
            result: $Utils.Optional<UsuarioCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model SnapshotMeta
   */

  export type AggregateSnapshotMeta = {
    _count: SnapshotMetaCountAggregateOutputType | null
    _avg: SnapshotMetaAvgAggregateOutputType | null
    _sum: SnapshotMetaSumAggregateOutputType | null
    _min: SnapshotMetaMinAggregateOutputType | null
    _max: SnapshotMetaMaxAggregateOutputType | null
  }

  export type SnapshotMetaAvgAggregateOutputType = {
    id: number | null
    duracaoMs: number | null
  }

  export type SnapshotMetaSumAggregateOutputType = {
    id: number | null
    duracaoMs: number | null
  }

  export type SnapshotMetaMinAggregateOutputType = {
    id: number | null
    criadoEm: Date | null
    tipoSnap: string | null
    status: string | null
    mensagem: string | null
    duracaoMs: number | null
  }

  export type SnapshotMetaMaxAggregateOutputType = {
    id: number | null
    criadoEm: Date | null
    tipoSnap: string | null
    status: string | null
    mensagem: string | null
    duracaoMs: number | null
  }

  export type SnapshotMetaCountAggregateOutputType = {
    id: number
    criadoEm: number
    tipoSnap: number
    status: number
    mensagem: number
    duracaoMs: number
    _all: number
  }


  export type SnapshotMetaAvgAggregateInputType = {
    id?: true
    duracaoMs?: true
  }

  export type SnapshotMetaSumAggregateInputType = {
    id?: true
    duracaoMs?: true
  }

  export type SnapshotMetaMinAggregateInputType = {
    id?: true
    criadoEm?: true
    tipoSnap?: true
    status?: true
    mensagem?: true
    duracaoMs?: true
  }

  export type SnapshotMetaMaxAggregateInputType = {
    id?: true
    criadoEm?: true
    tipoSnap?: true
    status?: true
    mensagem?: true
    duracaoMs?: true
  }

  export type SnapshotMetaCountAggregateInputType = {
    id?: true
    criadoEm?: true
    tipoSnap?: true
    status?: true
    mensagem?: true
    duracaoMs?: true
    _all?: true
  }

  export type SnapshotMetaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapshotMeta to aggregate.
     */
    where?: SnapshotMetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapshotMetas to fetch.
     */
    orderBy?: SnapshotMetaOrderByWithRelationInput | SnapshotMetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnapshotMetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapshotMetas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapshotMetas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SnapshotMetas
    **/
    _count?: true | SnapshotMetaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SnapshotMetaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SnapshotMetaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnapshotMetaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnapshotMetaMaxAggregateInputType
  }

  export type GetSnapshotMetaAggregateType<T extends SnapshotMetaAggregateArgs> = {
        [P in keyof T & keyof AggregateSnapshotMeta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnapshotMeta[P]>
      : GetScalarType<T[P], AggregateSnapshotMeta[P]>
  }




  export type SnapshotMetaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapshotMetaWhereInput
    orderBy?: SnapshotMetaOrderByWithAggregationInput | SnapshotMetaOrderByWithAggregationInput[]
    by: SnapshotMetaScalarFieldEnum[] | SnapshotMetaScalarFieldEnum
    having?: SnapshotMetaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnapshotMetaCountAggregateInputType | true
    _avg?: SnapshotMetaAvgAggregateInputType
    _sum?: SnapshotMetaSumAggregateInputType
    _min?: SnapshotMetaMinAggregateInputType
    _max?: SnapshotMetaMaxAggregateInputType
  }

  export type SnapshotMetaGroupByOutputType = {
    id: number
    criadoEm: Date
    tipoSnap: string
    status: string
    mensagem: string | null
    duracaoMs: number | null
    _count: SnapshotMetaCountAggregateOutputType | null
    _avg: SnapshotMetaAvgAggregateOutputType | null
    _sum: SnapshotMetaSumAggregateOutputType | null
    _min: SnapshotMetaMinAggregateOutputType | null
    _max: SnapshotMetaMaxAggregateOutputType | null
  }

  type GetSnapshotMetaGroupByPayload<T extends SnapshotMetaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnapshotMetaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnapshotMetaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnapshotMetaGroupByOutputType[P]>
            : GetScalarType<T[P], SnapshotMetaGroupByOutputType[P]>
        }
      >
    >


  export type SnapshotMetaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    criadoEm?: boolean
    tipoSnap?: boolean
    status?: boolean
    mensagem?: boolean
    duracaoMs?: boolean
  }, ExtArgs["result"]["snapshotMeta"]>

  export type SnapshotMetaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    criadoEm?: boolean
    tipoSnap?: boolean
    status?: boolean
    mensagem?: boolean
    duracaoMs?: boolean
  }, ExtArgs["result"]["snapshotMeta"]>

  export type SnapshotMetaSelectScalar = {
    id?: boolean
    criadoEm?: boolean
    tipoSnap?: boolean
    status?: boolean
    mensagem?: boolean
    duracaoMs?: boolean
  }


  export type $SnapshotMetaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SnapshotMeta"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      criadoEm: Date
      tipoSnap: string
      status: string
      mensagem: string | null
      duracaoMs: number | null
    }, ExtArgs["result"]["snapshotMeta"]>
    composites: {}
  }

  type SnapshotMetaGetPayload<S extends boolean | null | undefined | SnapshotMetaDefaultArgs> = $Result.GetResult<Prisma.$SnapshotMetaPayload, S>

  type SnapshotMetaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SnapshotMetaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SnapshotMetaCountAggregateInputType | true
    }

  export interface SnapshotMetaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SnapshotMeta'], meta: { name: 'SnapshotMeta' } }
    /**
     * Find zero or one SnapshotMeta that matches the filter.
     * @param {SnapshotMetaFindUniqueArgs} args - Arguments to find a SnapshotMeta
     * @example
     * // Get one SnapshotMeta
     * const snapshotMeta = await prisma.snapshotMeta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnapshotMetaFindUniqueArgs>(args: SelectSubset<T, SnapshotMetaFindUniqueArgs<ExtArgs>>): Prisma__SnapshotMetaClient<$Result.GetResult<Prisma.$SnapshotMetaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SnapshotMeta that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SnapshotMetaFindUniqueOrThrowArgs} args - Arguments to find a SnapshotMeta
     * @example
     * // Get one SnapshotMeta
     * const snapshotMeta = await prisma.snapshotMeta.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnapshotMetaFindUniqueOrThrowArgs>(args: SelectSubset<T, SnapshotMetaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnapshotMetaClient<$Result.GetResult<Prisma.$SnapshotMetaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SnapshotMeta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotMetaFindFirstArgs} args - Arguments to find a SnapshotMeta
     * @example
     * // Get one SnapshotMeta
     * const snapshotMeta = await prisma.snapshotMeta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnapshotMetaFindFirstArgs>(args?: SelectSubset<T, SnapshotMetaFindFirstArgs<ExtArgs>>): Prisma__SnapshotMetaClient<$Result.GetResult<Prisma.$SnapshotMetaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SnapshotMeta that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotMetaFindFirstOrThrowArgs} args - Arguments to find a SnapshotMeta
     * @example
     * // Get one SnapshotMeta
     * const snapshotMeta = await prisma.snapshotMeta.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnapshotMetaFindFirstOrThrowArgs>(args?: SelectSubset<T, SnapshotMetaFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnapshotMetaClient<$Result.GetResult<Prisma.$SnapshotMetaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SnapshotMetas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotMetaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SnapshotMetas
     * const snapshotMetas = await prisma.snapshotMeta.findMany()
     * 
     * // Get first 10 SnapshotMetas
     * const snapshotMetas = await prisma.snapshotMeta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const snapshotMetaWithIdOnly = await prisma.snapshotMeta.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SnapshotMetaFindManyArgs>(args?: SelectSubset<T, SnapshotMetaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotMetaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SnapshotMeta.
     * @param {SnapshotMetaCreateArgs} args - Arguments to create a SnapshotMeta.
     * @example
     * // Create one SnapshotMeta
     * const SnapshotMeta = await prisma.snapshotMeta.create({
     *   data: {
     *     // ... data to create a SnapshotMeta
     *   }
     * })
     * 
     */
    create<T extends SnapshotMetaCreateArgs>(args: SelectSubset<T, SnapshotMetaCreateArgs<ExtArgs>>): Prisma__SnapshotMetaClient<$Result.GetResult<Prisma.$SnapshotMetaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SnapshotMetas.
     * @param {SnapshotMetaCreateManyArgs} args - Arguments to create many SnapshotMetas.
     * @example
     * // Create many SnapshotMetas
     * const snapshotMeta = await prisma.snapshotMeta.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnapshotMetaCreateManyArgs>(args?: SelectSubset<T, SnapshotMetaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SnapshotMetas and returns the data saved in the database.
     * @param {SnapshotMetaCreateManyAndReturnArgs} args - Arguments to create many SnapshotMetas.
     * @example
     * // Create many SnapshotMetas
     * const snapshotMeta = await prisma.snapshotMeta.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SnapshotMetas and only return the `id`
     * const snapshotMetaWithIdOnly = await prisma.snapshotMeta.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnapshotMetaCreateManyAndReturnArgs>(args?: SelectSubset<T, SnapshotMetaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotMetaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SnapshotMeta.
     * @param {SnapshotMetaDeleteArgs} args - Arguments to delete one SnapshotMeta.
     * @example
     * // Delete one SnapshotMeta
     * const SnapshotMeta = await prisma.snapshotMeta.delete({
     *   where: {
     *     // ... filter to delete one SnapshotMeta
     *   }
     * })
     * 
     */
    delete<T extends SnapshotMetaDeleteArgs>(args: SelectSubset<T, SnapshotMetaDeleteArgs<ExtArgs>>): Prisma__SnapshotMetaClient<$Result.GetResult<Prisma.$SnapshotMetaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SnapshotMeta.
     * @param {SnapshotMetaUpdateArgs} args - Arguments to update one SnapshotMeta.
     * @example
     * // Update one SnapshotMeta
     * const snapshotMeta = await prisma.snapshotMeta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnapshotMetaUpdateArgs>(args: SelectSubset<T, SnapshotMetaUpdateArgs<ExtArgs>>): Prisma__SnapshotMetaClient<$Result.GetResult<Prisma.$SnapshotMetaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SnapshotMetas.
     * @param {SnapshotMetaDeleteManyArgs} args - Arguments to filter SnapshotMetas to delete.
     * @example
     * // Delete a few SnapshotMetas
     * const { count } = await prisma.snapshotMeta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnapshotMetaDeleteManyArgs>(args?: SelectSubset<T, SnapshotMetaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SnapshotMetas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotMetaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SnapshotMetas
     * const snapshotMeta = await prisma.snapshotMeta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnapshotMetaUpdateManyArgs>(args: SelectSubset<T, SnapshotMetaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SnapshotMeta.
     * @param {SnapshotMetaUpsertArgs} args - Arguments to update or create a SnapshotMeta.
     * @example
     * // Update or create a SnapshotMeta
     * const snapshotMeta = await prisma.snapshotMeta.upsert({
     *   create: {
     *     // ... data to create a SnapshotMeta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SnapshotMeta we want to update
     *   }
     * })
     */
    upsert<T extends SnapshotMetaUpsertArgs>(args: SelectSubset<T, SnapshotMetaUpsertArgs<ExtArgs>>): Prisma__SnapshotMetaClient<$Result.GetResult<Prisma.$SnapshotMetaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SnapshotMetas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotMetaCountArgs} args - Arguments to filter SnapshotMetas to count.
     * @example
     * // Count the number of SnapshotMetas
     * const count = await prisma.snapshotMeta.count({
     *   where: {
     *     // ... the filter for the SnapshotMetas we want to count
     *   }
     * })
    **/
    count<T extends SnapshotMetaCountArgs>(
      args?: Subset<T, SnapshotMetaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnapshotMetaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SnapshotMeta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotMetaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SnapshotMetaAggregateArgs>(args: Subset<T, SnapshotMetaAggregateArgs>): Prisma.PrismaPromise<GetSnapshotMetaAggregateType<T>>

    /**
     * Group by SnapshotMeta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotMetaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SnapshotMetaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnapshotMetaGroupByArgs['orderBy'] }
        : { orderBy?: SnapshotMetaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SnapshotMetaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnapshotMetaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SnapshotMeta model
   */
  readonly fields: SnapshotMetaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SnapshotMeta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnapshotMetaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SnapshotMeta model
   */ 
  interface SnapshotMetaFieldRefs {
    readonly id: FieldRef<"SnapshotMeta", 'Int'>
    readonly criadoEm: FieldRef<"SnapshotMeta", 'DateTime'>
    readonly tipoSnap: FieldRef<"SnapshotMeta", 'String'>
    readonly status: FieldRef<"SnapshotMeta", 'String'>
    readonly mensagem: FieldRef<"SnapshotMeta", 'String'>
    readonly duracaoMs: FieldRef<"SnapshotMeta", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * SnapshotMeta findUnique
   */
  export type SnapshotMetaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelect<ExtArgs> | null
    /**
     * Filter, which SnapshotMeta to fetch.
     */
    where: SnapshotMetaWhereUniqueInput
  }

  /**
   * SnapshotMeta findUniqueOrThrow
   */
  export type SnapshotMetaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelect<ExtArgs> | null
    /**
     * Filter, which SnapshotMeta to fetch.
     */
    where: SnapshotMetaWhereUniqueInput
  }

  /**
   * SnapshotMeta findFirst
   */
  export type SnapshotMetaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelect<ExtArgs> | null
    /**
     * Filter, which SnapshotMeta to fetch.
     */
    where?: SnapshotMetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapshotMetas to fetch.
     */
    orderBy?: SnapshotMetaOrderByWithRelationInput | SnapshotMetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapshotMetas.
     */
    cursor?: SnapshotMetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapshotMetas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapshotMetas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapshotMetas.
     */
    distinct?: SnapshotMetaScalarFieldEnum | SnapshotMetaScalarFieldEnum[]
  }

  /**
   * SnapshotMeta findFirstOrThrow
   */
  export type SnapshotMetaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelect<ExtArgs> | null
    /**
     * Filter, which SnapshotMeta to fetch.
     */
    where?: SnapshotMetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapshotMetas to fetch.
     */
    orderBy?: SnapshotMetaOrderByWithRelationInput | SnapshotMetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SnapshotMetas.
     */
    cursor?: SnapshotMetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapshotMetas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapshotMetas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SnapshotMetas.
     */
    distinct?: SnapshotMetaScalarFieldEnum | SnapshotMetaScalarFieldEnum[]
  }

  /**
   * SnapshotMeta findMany
   */
  export type SnapshotMetaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelect<ExtArgs> | null
    /**
     * Filter, which SnapshotMetas to fetch.
     */
    where?: SnapshotMetaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SnapshotMetas to fetch.
     */
    orderBy?: SnapshotMetaOrderByWithRelationInput | SnapshotMetaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SnapshotMetas.
     */
    cursor?: SnapshotMetaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SnapshotMetas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SnapshotMetas.
     */
    skip?: number
    distinct?: SnapshotMetaScalarFieldEnum | SnapshotMetaScalarFieldEnum[]
  }

  /**
   * SnapshotMeta create
   */
  export type SnapshotMetaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelect<ExtArgs> | null
    /**
     * The data needed to create a SnapshotMeta.
     */
    data?: XOR<SnapshotMetaCreateInput, SnapshotMetaUncheckedCreateInput>
  }

  /**
   * SnapshotMeta createMany
   */
  export type SnapshotMetaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SnapshotMetas.
     */
    data: SnapshotMetaCreateManyInput | SnapshotMetaCreateManyInput[]
  }

  /**
   * SnapshotMeta createManyAndReturn
   */
  export type SnapshotMetaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SnapshotMetas.
     */
    data: SnapshotMetaCreateManyInput | SnapshotMetaCreateManyInput[]
  }

  /**
   * SnapshotMeta update
   */
  export type SnapshotMetaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelect<ExtArgs> | null
    /**
     * The data needed to update a SnapshotMeta.
     */
    data: XOR<SnapshotMetaUpdateInput, SnapshotMetaUncheckedUpdateInput>
    /**
     * Choose, which SnapshotMeta to update.
     */
    where: SnapshotMetaWhereUniqueInput
  }

  /**
   * SnapshotMeta updateMany
   */
  export type SnapshotMetaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SnapshotMetas.
     */
    data: XOR<SnapshotMetaUpdateManyMutationInput, SnapshotMetaUncheckedUpdateManyInput>
    /**
     * Filter which SnapshotMetas to update
     */
    where?: SnapshotMetaWhereInput
  }

  /**
   * SnapshotMeta upsert
   */
  export type SnapshotMetaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelect<ExtArgs> | null
    /**
     * The filter to search for the SnapshotMeta to update in case it exists.
     */
    where: SnapshotMetaWhereUniqueInput
    /**
     * In case the SnapshotMeta found by the `where` argument doesn't exist, create a new SnapshotMeta with this data.
     */
    create: XOR<SnapshotMetaCreateInput, SnapshotMetaUncheckedCreateInput>
    /**
     * In case the SnapshotMeta was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnapshotMetaUpdateInput, SnapshotMetaUncheckedUpdateInput>
  }

  /**
   * SnapshotMeta delete
   */
  export type SnapshotMetaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelect<ExtArgs> | null
    /**
     * Filter which SnapshotMeta to delete.
     */
    where: SnapshotMetaWhereUniqueInput
  }

  /**
   * SnapshotMeta deleteMany
   */
  export type SnapshotMetaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SnapshotMetas to delete
     */
    where?: SnapshotMetaWhereInput
  }

  /**
   * SnapshotMeta without action
   */
  export type SnapshotMetaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SnapshotMeta
     */
    select?: SnapshotMetaSelect<ExtArgs> | null
  }


  /**
   * Model KpiDiario
   */

  export type AggregateKpiDiario = {
    _count: KpiDiarioCountAggregateOutputType | null
    _avg: KpiDiarioAvgAggregateOutputType | null
    _sum: KpiDiarioSumAggregateOutputType | null
    _min: KpiDiarioMinAggregateOutputType | null
    _max: KpiDiarioMaxAggregateOutputType | null
  }

  export type KpiDiarioAvgAggregateOutputType = {
    id: number | null
    snapshotId: number | null
    idImovel: number | null
    valor: number | null
    juros: number | null
    correcao: number | null
    multa: number | null
    encargo: number | null
    tarifaBoleto: number | null
  }

  export type KpiDiarioSumAggregateOutputType = {
    id: number | null
    snapshotId: number | null
    idImovel: number | null
    valor: number | null
    juros: number | null
    correcao: number | null
    multa: number | null
    encargo: number | null
    tarifaBoleto: number | null
  }

  export type KpiDiarioMinAggregateOutputType = {
    id: number | null
    snapshotId: number | null
    idImovel: number | null
    nomeImovel: string | null
    tipo: string | null
    mesRef: string | null
    valor: number | null
    juros: number | null
    correcao: number | null
    multa: number | null
    encargo: number | null
    tarifaBoleto: number | null
  }

  export type KpiDiarioMaxAggregateOutputType = {
    id: number | null
    snapshotId: number | null
    idImovel: number | null
    nomeImovel: string | null
    tipo: string | null
    mesRef: string | null
    valor: number | null
    juros: number | null
    correcao: number | null
    multa: number | null
    encargo: number | null
    tarifaBoleto: number | null
  }

  export type KpiDiarioCountAggregateOutputType = {
    id: number
    snapshotId: number
    idImovel: number
    nomeImovel: number
    tipo: number
    mesRef: number
    valor: number
    juros: number
    correcao: number
    multa: number
    encargo: number
    tarifaBoleto: number
    _all: number
  }


  export type KpiDiarioAvgAggregateInputType = {
    id?: true
    snapshotId?: true
    idImovel?: true
    valor?: true
    juros?: true
    correcao?: true
    multa?: true
    encargo?: true
    tarifaBoleto?: true
  }

  export type KpiDiarioSumAggregateInputType = {
    id?: true
    snapshotId?: true
    idImovel?: true
    valor?: true
    juros?: true
    correcao?: true
    multa?: true
    encargo?: true
    tarifaBoleto?: true
  }

  export type KpiDiarioMinAggregateInputType = {
    id?: true
    snapshotId?: true
    idImovel?: true
    nomeImovel?: true
    tipo?: true
    mesRef?: true
    valor?: true
    juros?: true
    correcao?: true
    multa?: true
    encargo?: true
    tarifaBoleto?: true
  }

  export type KpiDiarioMaxAggregateInputType = {
    id?: true
    snapshotId?: true
    idImovel?: true
    nomeImovel?: true
    tipo?: true
    mesRef?: true
    valor?: true
    juros?: true
    correcao?: true
    multa?: true
    encargo?: true
    tarifaBoleto?: true
  }

  export type KpiDiarioCountAggregateInputType = {
    id?: true
    snapshotId?: true
    idImovel?: true
    nomeImovel?: true
    tipo?: true
    mesRef?: true
    valor?: true
    juros?: true
    correcao?: true
    multa?: true
    encargo?: true
    tarifaBoleto?: true
    _all?: true
  }

  export type KpiDiarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KpiDiario to aggregate.
     */
    where?: KpiDiarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KpiDiarios to fetch.
     */
    orderBy?: KpiDiarioOrderByWithRelationInput | KpiDiarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KpiDiarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KpiDiarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KpiDiarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KpiDiarios
    **/
    _count?: true | KpiDiarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KpiDiarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KpiDiarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KpiDiarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KpiDiarioMaxAggregateInputType
  }

  export type GetKpiDiarioAggregateType<T extends KpiDiarioAggregateArgs> = {
        [P in keyof T & keyof AggregateKpiDiario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKpiDiario[P]>
      : GetScalarType<T[P], AggregateKpiDiario[P]>
  }




  export type KpiDiarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KpiDiarioWhereInput
    orderBy?: KpiDiarioOrderByWithAggregationInput | KpiDiarioOrderByWithAggregationInput[]
    by: KpiDiarioScalarFieldEnum[] | KpiDiarioScalarFieldEnum
    having?: KpiDiarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KpiDiarioCountAggregateInputType | true
    _avg?: KpiDiarioAvgAggregateInputType
    _sum?: KpiDiarioSumAggregateInputType
    _min?: KpiDiarioMinAggregateInputType
    _max?: KpiDiarioMaxAggregateInputType
  }

  export type KpiDiarioGroupByOutputType = {
    id: number
    snapshotId: number
    idImovel: number
    nomeImovel: string
    tipo: string
    mesRef: string
    valor: number
    juros: number
    correcao: number
    multa: number
    encargo: number
    tarifaBoleto: number
    _count: KpiDiarioCountAggregateOutputType | null
    _avg: KpiDiarioAvgAggregateOutputType | null
    _sum: KpiDiarioSumAggregateOutputType | null
    _min: KpiDiarioMinAggregateOutputType | null
    _max: KpiDiarioMaxAggregateOutputType | null
  }

  type GetKpiDiarioGroupByPayload<T extends KpiDiarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KpiDiarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KpiDiarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KpiDiarioGroupByOutputType[P]>
            : GetScalarType<T[P], KpiDiarioGroupByOutputType[P]>
        }
      >
    >


  export type KpiDiarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotId?: boolean
    idImovel?: boolean
    nomeImovel?: boolean
    tipo?: boolean
    mesRef?: boolean
    valor?: boolean
    juros?: boolean
    correcao?: boolean
    multa?: boolean
    encargo?: boolean
    tarifaBoleto?: boolean
  }, ExtArgs["result"]["kpiDiario"]>

  export type KpiDiarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotId?: boolean
    idImovel?: boolean
    nomeImovel?: boolean
    tipo?: boolean
    mesRef?: boolean
    valor?: boolean
    juros?: boolean
    correcao?: boolean
    multa?: boolean
    encargo?: boolean
    tarifaBoleto?: boolean
  }, ExtArgs["result"]["kpiDiario"]>

  export type KpiDiarioSelectScalar = {
    id?: boolean
    snapshotId?: boolean
    idImovel?: boolean
    nomeImovel?: boolean
    tipo?: boolean
    mesRef?: boolean
    valor?: boolean
    juros?: boolean
    correcao?: boolean
    multa?: boolean
    encargo?: boolean
    tarifaBoleto?: boolean
  }


  export type $KpiDiarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KpiDiario"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      snapshotId: number
      idImovel: number
      nomeImovel: string
      tipo: string
      mesRef: string
      valor: number
      juros: number
      correcao: number
      multa: number
      encargo: number
      tarifaBoleto: number
    }, ExtArgs["result"]["kpiDiario"]>
    composites: {}
  }

  type KpiDiarioGetPayload<S extends boolean | null | undefined | KpiDiarioDefaultArgs> = $Result.GetResult<Prisma.$KpiDiarioPayload, S>

  type KpiDiarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<KpiDiarioFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: KpiDiarioCountAggregateInputType | true
    }

  export interface KpiDiarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KpiDiario'], meta: { name: 'KpiDiario' } }
    /**
     * Find zero or one KpiDiario that matches the filter.
     * @param {KpiDiarioFindUniqueArgs} args - Arguments to find a KpiDiario
     * @example
     * // Get one KpiDiario
     * const kpiDiario = await prisma.kpiDiario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KpiDiarioFindUniqueArgs>(args: SelectSubset<T, KpiDiarioFindUniqueArgs<ExtArgs>>): Prisma__KpiDiarioClient<$Result.GetResult<Prisma.$KpiDiarioPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one KpiDiario that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {KpiDiarioFindUniqueOrThrowArgs} args - Arguments to find a KpiDiario
     * @example
     * // Get one KpiDiario
     * const kpiDiario = await prisma.kpiDiario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KpiDiarioFindUniqueOrThrowArgs>(args: SelectSubset<T, KpiDiarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KpiDiarioClient<$Result.GetResult<Prisma.$KpiDiarioPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first KpiDiario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KpiDiarioFindFirstArgs} args - Arguments to find a KpiDiario
     * @example
     * // Get one KpiDiario
     * const kpiDiario = await prisma.kpiDiario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KpiDiarioFindFirstArgs>(args?: SelectSubset<T, KpiDiarioFindFirstArgs<ExtArgs>>): Prisma__KpiDiarioClient<$Result.GetResult<Prisma.$KpiDiarioPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first KpiDiario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KpiDiarioFindFirstOrThrowArgs} args - Arguments to find a KpiDiario
     * @example
     * // Get one KpiDiario
     * const kpiDiario = await prisma.kpiDiario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KpiDiarioFindFirstOrThrowArgs>(args?: SelectSubset<T, KpiDiarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__KpiDiarioClient<$Result.GetResult<Prisma.$KpiDiarioPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more KpiDiarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KpiDiarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KpiDiarios
     * const kpiDiarios = await prisma.kpiDiario.findMany()
     * 
     * // Get first 10 KpiDiarios
     * const kpiDiarios = await prisma.kpiDiario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kpiDiarioWithIdOnly = await prisma.kpiDiario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KpiDiarioFindManyArgs>(args?: SelectSubset<T, KpiDiarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KpiDiarioPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a KpiDiario.
     * @param {KpiDiarioCreateArgs} args - Arguments to create a KpiDiario.
     * @example
     * // Create one KpiDiario
     * const KpiDiario = await prisma.kpiDiario.create({
     *   data: {
     *     // ... data to create a KpiDiario
     *   }
     * })
     * 
     */
    create<T extends KpiDiarioCreateArgs>(args: SelectSubset<T, KpiDiarioCreateArgs<ExtArgs>>): Prisma__KpiDiarioClient<$Result.GetResult<Prisma.$KpiDiarioPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many KpiDiarios.
     * @param {KpiDiarioCreateManyArgs} args - Arguments to create many KpiDiarios.
     * @example
     * // Create many KpiDiarios
     * const kpiDiario = await prisma.kpiDiario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KpiDiarioCreateManyArgs>(args?: SelectSubset<T, KpiDiarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KpiDiarios and returns the data saved in the database.
     * @param {KpiDiarioCreateManyAndReturnArgs} args - Arguments to create many KpiDiarios.
     * @example
     * // Create many KpiDiarios
     * const kpiDiario = await prisma.kpiDiario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KpiDiarios and only return the `id`
     * const kpiDiarioWithIdOnly = await prisma.kpiDiario.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KpiDiarioCreateManyAndReturnArgs>(args?: SelectSubset<T, KpiDiarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KpiDiarioPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a KpiDiario.
     * @param {KpiDiarioDeleteArgs} args - Arguments to delete one KpiDiario.
     * @example
     * // Delete one KpiDiario
     * const KpiDiario = await prisma.kpiDiario.delete({
     *   where: {
     *     // ... filter to delete one KpiDiario
     *   }
     * })
     * 
     */
    delete<T extends KpiDiarioDeleteArgs>(args: SelectSubset<T, KpiDiarioDeleteArgs<ExtArgs>>): Prisma__KpiDiarioClient<$Result.GetResult<Prisma.$KpiDiarioPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one KpiDiario.
     * @param {KpiDiarioUpdateArgs} args - Arguments to update one KpiDiario.
     * @example
     * // Update one KpiDiario
     * const kpiDiario = await prisma.kpiDiario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KpiDiarioUpdateArgs>(args: SelectSubset<T, KpiDiarioUpdateArgs<ExtArgs>>): Prisma__KpiDiarioClient<$Result.GetResult<Prisma.$KpiDiarioPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more KpiDiarios.
     * @param {KpiDiarioDeleteManyArgs} args - Arguments to filter KpiDiarios to delete.
     * @example
     * // Delete a few KpiDiarios
     * const { count } = await prisma.kpiDiario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KpiDiarioDeleteManyArgs>(args?: SelectSubset<T, KpiDiarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KpiDiarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KpiDiarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KpiDiarios
     * const kpiDiario = await prisma.kpiDiario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KpiDiarioUpdateManyArgs>(args: SelectSubset<T, KpiDiarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one KpiDiario.
     * @param {KpiDiarioUpsertArgs} args - Arguments to update or create a KpiDiario.
     * @example
     * // Update or create a KpiDiario
     * const kpiDiario = await prisma.kpiDiario.upsert({
     *   create: {
     *     // ... data to create a KpiDiario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KpiDiario we want to update
     *   }
     * })
     */
    upsert<T extends KpiDiarioUpsertArgs>(args: SelectSubset<T, KpiDiarioUpsertArgs<ExtArgs>>): Prisma__KpiDiarioClient<$Result.GetResult<Prisma.$KpiDiarioPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of KpiDiarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KpiDiarioCountArgs} args - Arguments to filter KpiDiarios to count.
     * @example
     * // Count the number of KpiDiarios
     * const count = await prisma.kpiDiario.count({
     *   where: {
     *     // ... the filter for the KpiDiarios we want to count
     *   }
     * })
    **/
    count<T extends KpiDiarioCountArgs>(
      args?: Subset<T, KpiDiarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KpiDiarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KpiDiario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KpiDiarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KpiDiarioAggregateArgs>(args: Subset<T, KpiDiarioAggregateArgs>): Prisma.PrismaPromise<GetKpiDiarioAggregateType<T>>

    /**
     * Group by KpiDiario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KpiDiarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KpiDiarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KpiDiarioGroupByArgs['orderBy'] }
        : { orderBy?: KpiDiarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KpiDiarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKpiDiarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KpiDiario model
   */
  readonly fields: KpiDiarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KpiDiario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KpiDiarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KpiDiario model
   */ 
  interface KpiDiarioFieldRefs {
    readonly id: FieldRef<"KpiDiario", 'Int'>
    readonly snapshotId: FieldRef<"KpiDiario", 'Int'>
    readonly idImovel: FieldRef<"KpiDiario", 'Int'>
    readonly nomeImovel: FieldRef<"KpiDiario", 'String'>
    readonly tipo: FieldRef<"KpiDiario", 'String'>
    readonly mesRef: FieldRef<"KpiDiario", 'String'>
    readonly valor: FieldRef<"KpiDiario", 'Float'>
    readonly juros: FieldRef<"KpiDiario", 'Float'>
    readonly correcao: FieldRef<"KpiDiario", 'Float'>
    readonly multa: FieldRef<"KpiDiario", 'Float'>
    readonly encargo: FieldRef<"KpiDiario", 'Float'>
    readonly tarifaBoleto: FieldRef<"KpiDiario", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * KpiDiario findUnique
   */
  export type KpiDiarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelect<ExtArgs> | null
    /**
     * Filter, which KpiDiario to fetch.
     */
    where: KpiDiarioWhereUniqueInput
  }

  /**
   * KpiDiario findUniqueOrThrow
   */
  export type KpiDiarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelect<ExtArgs> | null
    /**
     * Filter, which KpiDiario to fetch.
     */
    where: KpiDiarioWhereUniqueInput
  }

  /**
   * KpiDiario findFirst
   */
  export type KpiDiarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelect<ExtArgs> | null
    /**
     * Filter, which KpiDiario to fetch.
     */
    where?: KpiDiarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KpiDiarios to fetch.
     */
    orderBy?: KpiDiarioOrderByWithRelationInput | KpiDiarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KpiDiarios.
     */
    cursor?: KpiDiarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KpiDiarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KpiDiarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KpiDiarios.
     */
    distinct?: KpiDiarioScalarFieldEnum | KpiDiarioScalarFieldEnum[]
  }

  /**
   * KpiDiario findFirstOrThrow
   */
  export type KpiDiarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelect<ExtArgs> | null
    /**
     * Filter, which KpiDiario to fetch.
     */
    where?: KpiDiarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KpiDiarios to fetch.
     */
    orderBy?: KpiDiarioOrderByWithRelationInput | KpiDiarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KpiDiarios.
     */
    cursor?: KpiDiarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KpiDiarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KpiDiarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KpiDiarios.
     */
    distinct?: KpiDiarioScalarFieldEnum | KpiDiarioScalarFieldEnum[]
  }

  /**
   * KpiDiario findMany
   */
  export type KpiDiarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelect<ExtArgs> | null
    /**
     * Filter, which KpiDiarios to fetch.
     */
    where?: KpiDiarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KpiDiarios to fetch.
     */
    orderBy?: KpiDiarioOrderByWithRelationInput | KpiDiarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KpiDiarios.
     */
    cursor?: KpiDiarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KpiDiarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KpiDiarios.
     */
    skip?: number
    distinct?: KpiDiarioScalarFieldEnum | KpiDiarioScalarFieldEnum[]
  }

  /**
   * KpiDiario create
   */
  export type KpiDiarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelect<ExtArgs> | null
    /**
     * The data needed to create a KpiDiario.
     */
    data: XOR<KpiDiarioCreateInput, KpiDiarioUncheckedCreateInput>
  }

  /**
   * KpiDiario createMany
   */
  export type KpiDiarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KpiDiarios.
     */
    data: KpiDiarioCreateManyInput | KpiDiarioCreateManyInput[]
  }

  /**
   * KpiDiario createManyAndReturn
   */
  export type KpiDiarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many KpiDiarios.
     */
    data: KpiDiarioCreateManyInput | KpiDiarioCreateManyInput[]
  }

  /**
   * KpiDiario update
   */
  export type KpiDiarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelect<ExtArgs> | null
    /**
     * The data needed to update a KpiDiario.
     */
    data: XOR<KpiDiarioUpdateInput, KpiDiarioUncheckedUpdateInput>
    /**
     * Choose, which KpiDiario to update.
     */
    where: KpiDiarioWhereUniqueInput
  }

  /**
   * KpiDiario updateMany
   */
  export type KpiDiarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KpiDiarios.
     */
    data: XOR<KpiDiarioUpdateManyMutationInput, KpiDiarioUncheckedUpdateManyInput>
    /**
     * Filter which KpiDiarios to update
     */
    where?: KpiDiarioWhereInput
  }

  /**
   * KpiDiario upsert
   */
  export type KpiDiarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelect<ExtArgs> | null
    /**
     * The filter to search for the KpiDiario to update in case it exists.
     */
    where: KpiDiarioWhereUniqueInput
    /**
     * In case the KpiDiario found by the `where` argument doesn't exist, create a new KpiDiario with this data.
     */
    create: XOR<KpiDiarioCreateInput, KpiDiarioUncheckedCreateInput>
    /**
     * In case the KpiDiario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KpiDiarioUpdateInput, KpiDiarioUncheckedUpdateInput>
  }

  /**
   * KpiDiario delete
   */
  export type KpiDiarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelect<ExtArgs> | null
    /**
     * Filter which KpiDiario to delete.
     */
    where: KpiDiarioWhereUniqueInput
  }

  /**
   * KpiDiario deleteMany
   */
  export type KpiDiarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KpiDiarios to delete
     */
    where?: KpiDiarioWhereInput
  }

  /**
   * KpiDiario without action
   */
  export type KpiDiarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KpiDiario
     */
    select?: KpiDiarioSelect<ExtArgs> | null
  }


  /**
   * Model Usuario
   */

  export type AggregateUsuario = {
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  export type UsuarioAvgAggregateOutputType = {
    id: number | null
  }

  export type UsuarioSumAggregateOutputType = {
    id: number | null
  }

  export type UsuarioMinAggregateOutputType = {
    id: number | null
    email: string | null
    nome: string | null
    senhaHash: string | null
    perfil: string | null
    ativo: boolean | null
    acessos: string | null
    criadoEm: Date | null
    updatedAt: Date | null
  }

  export type UsuarioMaxAggregateOutputType = {
    id: number | null
    email: string | null
    nome: string | null
    senhaHash: string | null
    perfil: string | null
    ativo: boolean | null
    acessos: string | null
    criadoEm: Date | null
    updatedAt: Date | null
  }

  export type UsuarioCountAggregateOutputType = {
    id: number
    email: number
    nome: number
    senhaHash: number
    perfil: number
    ativo: number
    acessos: number
    criadoEm: number
    updatedAt: number
    _all: number
  }


  export type UsuarioAvgAggregateInputType = {
    id?: true
  }

  export type UsuarioSumAggregateInputType = {
    id?: true
  }

  export type UsuarioMinAggregateInputType = {
    id?: true
    email?: true
    nome?: true
    senhaHash?: true
    perfil?: true
    ativo?: true
    acessos?: true
    criadoEm?: true
    updatedAt?: true
  }

  export type UsuarioMaxAggregateInputType = {
    id?: true
    email?: true
    nome?: true
    senhaHash?: true
    perfil?: true
    ativo?: true
    acessos?: true
    criadoEm?: true
    updatedAt?: true
  }

  export type UsuarioCountAggregateInputType = {
    id?: true
    email?: true
    nome?: true
    senhaHash?: true
    perfil?: true
    ativo?: true
    acessos?: true
    criadoEm?: true
    updatedAt?: true
    _all?: true
  }

  export type UsuarioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuario to aggregate.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Usuarios
    **/
    _count?: true | UsuarioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuarioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuarioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuarioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuarioMaxAggregateInputType
  }

  export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuario[P]>
      : GetScalarType<T[P], AggregateUsuario[P]>
  }




  export type UsuarioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsuarioWhereInput
    orderBy?: UsuarioOrderByWithAggregationInput | UsuarioOrderByWithAggregationInput[]
    by: UsuarioScalarFieldEnum[] | UsuarioScalarFieldEnum
    having?: UsuarioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuarioCountAggregateInputType | true
    _avg?: UsuarioAvgAggregateInputType
    _sum?: UsuarioSumAggregateInputType
    _min?: UsuarioMinAggregateInputType
    _max?: UsuarioMaxAggregateInputType
  }

  export type UsuarioGroupByOutputType = {
    id: number
    email: string
    nome: string
    senhaHash: string
    perfil: string
    ativo: boolean
    acessos: string
    criadoEm: Date
    updatedAt: Date
    _count: UsuarioCountAggregateOutputType | null
    _avg: UsuarioAvgAggregateOutputType | null
    _sum: UsuarioSumAggregateOutputType | null
    _min: UsuarioMinAggregateOutputType | null
    _max: UsuarioMaxAggregateOutputType | null
  }

  type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuarioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
            : GetScalarType<T[P], UsuarioGroupByOutputType[P]>
        }
      >
    >


  export type UsuarioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    nome?: boolean
    senhaHash?: boolean
    perfil?: boolean
    ativo?: boolean
    acessos?: boolean
    criadoEm?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    nome?: boolean
    senhaHash?: boolean
    perfil?: boolean
    ativo?: boolean
    acessos?: boolean
    criadoEm?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["usuario"]>

  export type UsuarioSelectScalar = {
    id?: boolean
    email?: boolean
    nome?: boolean
    senhaHash?: boolean
    perfil?: boolean
    ativo?: boolean
    acessos?: boolean
    criadoEm?: boolean
    updatedAt?: boolean
  }


  export type $UsuarioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Usuario"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      nome: string
      senhaHash: string
      perfil: string
      ativo: boolean
      acessos: string
      criadoEm: Date
      updatedAt: Date
    }, ExtArgs["result"]["usuario"]>
    composites: {}
  }

  type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = $Result.GetResult<Prisma.$UsuarioPayload, S>

  type UsuarioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UsuarioCountAggregateInputType | true
    }

  export interface UsuarioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
    /**
     * Find zero or one Usuario that matches the filter.
     * @param {UsuarioFindUniqueArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsuarioFindUniqueArgs>(args: SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Usuario that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UsuarioFindUniqueOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Usuario that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsuarioFindFirstArgs>(args?: SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Usuario that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindFirstOrThrowArgs} args - Arguments to find a Usuario
     * @example
     * // Get one Usuario
     * const usuario = await prisma.usuario.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuario.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuario.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuarioWithIdOnly = await prisma.usuario.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsuarioFindManyArgs>(args?: SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Usuario.
     * @param {UsuarioCreateArgs} args - Arguments to create a Usuario.
     * @example
     * // Create one Usuario
     * const Usuario = await prisma.usuario.create({
     *   data: {
     *     // ... data to create a Usuario
     *   }
     * })
     * 
     */
    create<T extends UsuarioCreateArgs>(args: SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Usuarios.
     * @param {UsuarioCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsuarioCreateManyArgs>(args?: SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {UsuarioCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuario = await prisma.usuario.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `id`
     * const usuarioWithIdOnly = await prisma.usuario.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Usuario.
     * @param {UsuarioDeleteArgs} args - Arguments to delete one Usuario.
     * @example
     * // Delete one Usuario
     * const Usuario = await prisma.usuario.delete({
     *   where: {
     *     // ... filter to delete one Usuario
     *   }
     * })
     * 
     */
    delete<T extends UsuarioDeleteArgs>(args: SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Usuario.
     * @param {UsuarioUpdateArgs} args - Arguments to update one Usuario.
     * @example
     * // Update one Usuario
     * const usuario = await prisma.usuario.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsuarioUpdateArgs>(args: SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Usuarios.
     * @param {UsuarioDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuario.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsuarioDeleteManyArgs>(args?: SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuario = await prisma.usuario.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsuarioUpdateManyArgs>(args: SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Usuario.
     * @param {UsuarioUpsertArgs} args - Arguments to update or create a Usuario.
     * @example
     * // Update or create a Usuario
     * const usuario = await prisma.usuario.upsert({
     *   create: {
     *     // ... data to create a Usuario
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuario we want to update
     *   }
     * })
     */
    upsert<T extends UsuarioUpsertArgs>(args: SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma__UsuarioClient<$Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuario.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends UsuarioCountArgs>(
      args?: Subset<T, UsuarioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuarioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuarioAggregateArgs>(args: Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>

    /**
     * Group by Usuario.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuarioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsuarioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsuarioGroupByArgs['orderBy'] }
        : { orderBy?: UsuarioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Usuario model
   */
  readonly fields: UsuarioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Usuario.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Usuario model
   */ 
  interface UsuarioFieldRefs {
    readonly id: FieldRef<"Usuario", 'Int'>
    readonly email: FieldRef<"Usuario", 'String'>
    readonly nome: FieldRef<"Usuario", 'String'>
    readonly senhaHash: FieldRef<"Usuario", 'String'>
    readonly perfil: FieldRef<"Usuario", 'String'>
    readonly ativo: FieldRef<"Usuario", 'Boolean'>
    readonly acessos: FieldRef<"Usuario", 'String'>
    readonly criadoEm: FieldRef<"Usuario", 'DateTime'>
    readonly updatedAt: FieldRef<"Usuario", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Usuario findUnique
   */
  export type UsuarioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findUniqueOrThrow
   */
  export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario findFirst
   */
  export type UsuarioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findFirstOrThrow
   */
  export type UsuarioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Filter, which Usuario to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Usuarios.
     */
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario findMany
   */
  export type UsuarioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Filter, which Usuarios to fetch.
     */
    where?: UsuarioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Usuarios to fetch.
     */
    orderBy?: UsuarioOrderByWithRelationInput | UsuarioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Usuarios.
     */
    cursor?: UsuarioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Usuarios.
     */
    skip?: number
    distinct?: UsuarioScalarFieldEnum | UsuarioScalarFieldEnum[]
  }

  /**
   * Usuario create
   */
  export type UsuarioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * The data needed to create a Usuario.
     */
    data: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
  }

  /**
   * Usuario createMany
   */
  export type UsuarioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
  }

  /**
   * Usuario createManyAndReturn
   */
  export type UsuarioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Usuarios.
     */
    data: UsuarioCreateManyInput | UsuarioCreateManyInput[]
  }

  /**
   * Usuario update
   */
  export type UsuarioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * The data needed to update a Usuario.
     */
    data: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
    /**
     * Choose, which Usuario to update.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario updateMany
   */
  export type UsuarioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Usuarios.
     */
    data: XOR<UsuarioUpdateManyMutationInput, UsuarioUncheckedUpdateManyInput>
    /**
     * Filter which Usuarios to update
     */
    where?: UsuarioWhereInput
  }

  /**
   * Usuario upsert
   */
  export type UsuarioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * The filter to search for the Usuario to update in case it exists.
     */
    where: UsuarioWhereUniqueInput
    /**
     * In case the Usuario found by the `where` argument doesn't exist, create a new Usuario with this data.
     */
    create: XOR<UsuarioCreateInput, UsuarioUncheckedCreateInput>
    /**
     * In case the Usuario was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsuarioUpdateInput, UsuarioUncheckedUpdateInput>
  }

  /**
   * Usuario delete
   */
  export type UsuarioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
    /**
     * Filter which Usuario to delete.
     */
    where: UsuarioWhereUniqueInput
  }

  /**
   * Usuario deleteMany
   */
  export type UsuarioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Usuarios to delete
     */
    where?: UsuarioWhereInput
  }

  /**
   * Usuario without action
   */
  export type UsuarioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Usuario
     */
    select?: UsuarioSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SnapshotMetaScalarFieldEnum: {
    id: 'id',
    criadoEm: 'criadoEm',
    tipoSnap: 'tipoSnap',
    status: 'status',
    mensagem: 'mensagem',
    duracaoMs: 'duracaoMs'
  };

  export type SnapshotMetaScalarFieldEnum = (typeof SnapshotMetaScalarFieldEnum)[keyof typeof SnapshotMetaScalarFieldEnum]


  export const KpiDiarioScalarFieldEnum: {
    id: 'id',
    snapshotId: 'snapshotId',
    idImovel: 'idImovel',
    nomeImovel: 'nomeImovel',
    tipo: 'tipo',
    mesRef: 'mesRef',
    valor: 'valor',
    juros: 'juros',
    correcao: 'correcao',
    multa: 'multa',
    encargo: 'encargo',
    tarifaBoleto: 'tarifaBoleto'
  };

  export type KpiDiarioScalarFieldEnum = (typeof KpiDiarioScalarFieldEnum)[keyof typeof KpiDiarioScalarFieldEnum]


  export const UsuarioScalarFieldEnum: {
    id: 'id',
    email: 'email',
    nome: 'nome',
    senhaHash: 'senhaHash',
    perfil: 'perfil',
    ativo: 'ativo',
    acessos: 'acessos',
    criadoEm: 'criadoEm',
    updatedAt: 'updatedAt'
  };

  export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type SnapshotMetaWhereInput = {
    AND?: SnapshotMetaWhereInput | SnapshotMetaWhereInput[]
    OR?: SnapshotMetaWhereInput[]
    NOT?: SnapshotMetaWhereInput | SnapshotMetaWhereInput[]
    id?: IntFilter<"SnapshotMeta"> | number
    criadoEm?: DateTimeFilter<"SnapshotMeta"> | Date | string
    tipoSnap?: StringFilter<"SnapshotMeta"> | string
    status?: StringFilter<"SnapshotMeta"> | string
    mensagem?: StringNullableFilter<"SnapshotMeta"> | string | null
    duracaoMs?: IntNullableFilter<"SnapshotMeta"> | number | null
  }

  export type SnapshotMetaOrderByWithRelationInput = {
    id?: SortOrder
    criadoEm?: SortOrder
    tipoSnap?: SortOrder
    status?: SortOrder
    mensagem?: SortOrderInput | SortOrder
    duracaoMs?: SortOrderInput | SortOrder
  }

  export type SnapshotMetaWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SnapshotMetaWhereInput | SnapshotMetaWhereInput[]
    OR?: SnapshotMetaWhereInput[]
    NOT?: SnapshotMetaWhereInput | SnapshotMetaWhereInput[]
    criadoEm?: DateTimeFilter<"SnapshotMeta"> | Date | string
    tipoSnap?: StringFilter<"SnapshotMeta"> | string
    status?: StringFilter<"SnapshotMeta"> | string
    mensagem?: StringNullableFilter<"SnapshotMeta"> | string | null
    duracaoMs?: IntNullableFilter<"SnapshotMeta"> | number | null
  }, "id">

  export type SnapshotMetaOrderByWithAggregationInput = {
    id?: SortOrder
    criadoEm?: SortOrder
    tipoSnap?: SortOrder
    status?: SortOrder
    mensagem?: SortOrderInput | SortOrder
    duracaoMs?: SortOrderInput | SortOrder
    _count?: SnapshotMetaCountOrderByAggregateInput
    _avg?: SnapshotMetaAvgOrderByAggregateInput
    _max?: SnapshotMetaMaxOrderByAggregateInput
    _min?: SnapshotMetaMinOrderByAggregateInput
    _sum?: SnapshotMetaSumOrderByAggregateInput
  }

  export type SnapshotMetaScalarWhereWithAggregatesInput = {
    AND?: SnapshotMetaScalarWhereWithAggregatesInput | SnapshotMetaScalarWhereWithAggregatesInput[]
    OR?: SnapshotMetaScalarWhereWithAggregatesInput[]
    NOT?: SnapshotMetaScalarWhereWithAggregatesInput | SnapshotMetaScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SnapshotMeta"> | number
    criadoEm?: DateTimeWithAggregatesFilter<"SnapshotMeta"> | Date | string
    tipoSnap?: StringWithAggregatesFilter<"SnapshotMeta"> | string
    status?: StringWithAggregatesFilter<"SnapshotMeta"> | string
    mensagem?: StringNullableWithAggregatesFilter<"SnapshotMeta"> | string | null
    duracaoMs?: IntNullableWithAggregatesFilter<"SnapshotMeta"> | number | null
  }

  export type KpiDiarioWhereInput = {
    AND?: KpiDiarioWhereInput | KpiDiarioWhereInput[]
    OR?: KpiDiarioWhereInput[]
    NOT?: KpiDiarioWhereInput | KpiDiarioWhereInput[]
    id?: IntFilter<"KpiDiario"> | number
    snapshotId?: IntFilter<"KpiDiario"> | number
    idImovel?: IntFilter<"KpiDiario"> | number
    nomeImovel?: StringFilter<"KpiDiario"> | string
    tipo?: StringFilter<"KpiDiario"> | string
    mesRef?: StringFilter<"KpiDiario"> | string
    valor?: FloatFilter<"KpiDiario"> | number
    juros?: FloatFilter<"KpiDiario"> | number
    correcao?: FloatFilter<"KpiDiario"> | number
    multa?: FloatFilter<"KpiDiario"> | number
    encargo?: FloatFilter<"KpiDiario"> | number
    tarifaBoleto?: FloatFilter<"KpiDiario"> | number
  }

  export type KpiDiarioOrderByWithRelationInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    idImovel?: SortOrder
    nomeImovel?: SortOrder
    tipo?: SortOrder
    mesRef?: SortOrder
    valor?: SortOrder
    juros?: SortOrder
    correcao?: SortOrder
    multa?: SortOrder
    encargo?: SortOrder
    tarifaBoleto?: SortOrder
  }

  export type KpiDiarioWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: KpiDiarioWhereInput | KpiDiarioWhereInput[]
    OR?: KpiDiarioWhereInput[]
    NOT?: KpiDiarioWhereInput | KpiDiarioWhereInput[]
    snapshotId?: IntFilter<"KpiDiario"> | number
    idImovel?: IntFilter<"KpiDiario"> | number
    nomeImovel?: StringFilter<"KpiDiario"> | string
    tipo?: StringFilter<"KpiDiario"> | string
    mesRef?: StringFilter<"KpiDiario"> | string
    valor?: FloatFilter<"KpiDiario"> | number
    juros?: FloatFilter<"KpiDiario"> | number
    correcao?: FloatFilter<"KpiDiario"> | number
    multa?: FloatFilter<"KpiDiario"> | number
    encargo?: FloatFilter<"KpiDiario"> | number
    tarifaBoleto?: FloatFilter<"KpiDiario"> | number
  }, "id">

  export type KpiDiarioOrderByWithAggregationInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    idImovel?: SortOrder
    nomeImovel?: SortOrder
    tipo?: SortOrder
    mesRef?: SortOrder
    valor?: SortOrder
    juros?: SortOrder
    correcao?: SortOrder
    multa?: SortOrder
    encargo?: SortOrder
    tarifaBoleto?: SortOrder
    _count?: KpiDiarioCountOrderByAggregateInput
    _avg?: KpiDiarioAvgOrderByAggregateInput
    _max?: KpiDiarioMaxOrderByAggregateInput
    _min?: KpiDiarioMinOrderByAggregateInput
    _sum?: KpiDiarioSumOrderByAggregateInput
  }

  export type KpiDiarioScalarWhereWithAggregatesInput = {
    AND?: KpiDiarioScalarWhereWithAggregatesInput | KpiDiarioScalarWhereWithAggregatesInput[]
    OR?: KpiDiarioScalarWhereWithAggregatesInput[]
    NOT?: KpiDiarioScalarWhereWithAggregatesInput | KpiDiarioScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"KpiDiario"> | number
    snapshotId?: IntWithAggregatesFilter<"KpiDiario"> | number
    idImovel?: IntWithAggregatesFilter<"KpiDiario"> | number
    nomeImovel?: StringWithAggregatesFilter<"KpiDiario"> | string
    tipo?: StringWithAggregatesFilter<"KpiDiario"> | string
    mesRef?: StringWithAggregatesFilter<"KpiDiario"> | string
    valor?: FloatWithAggregatesFilter<"KpiDiario"> | number
    juros?: FloatWithAggregatesFilter<"KpiDiario"> | number
    correcao?: FloatWithAggregatesFilter<"KpiDiario"> | number
    multa?: FloatWithAggregatesFilter<"KpiDiario"> | number
    encargo?: FloatWithAggregatesFilter<"KpiDiario"> | number
    tarifaBoleto?: FloatWithAggregatesFilter<"KpiDiario"> | number
  }

  export type UsuarioWhereInput = {
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    id?: IntFilter<"Usuario"> | number
    email?: StringFilter<"Usuario"> | string
    nome?: StringFilter<"Usuario"> | string
    senhaHash?: StringFilter<"Usuario"> | string
    perfil?: StringFilter<"Usuario"> | string
    ativo?: BoolFilter<"Usuario"> | boolean
    acessos?: StringFilter<"Usuario"> | string
    criadoEm?: DateTimeFilter<"Usuario"> | Date | string
    updatedAt?: DateTimeFilter<"Usuario"> | Date | string
  }

  export type UsuarioOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    nome?: SortOrder
    senhaHash?: SortOrder
    perfil?: SortOrder
    ativo?: SortOrder
    acessos?: SortOrder
    criadoEm?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UsuarioWhereInput | UsuarioWhereInput[]
    OR?: UsuarioWhereInput[]
    NOT?: UsuarioWhereInput | UsuarioWhereInput[]
    nome?: StringFilter<"Usuario"> | string
    senhaHash?: StringFilter<"Usuario"> | string
    perfil?: StringFilter<"Usuario"> | string
    ativo?: BoolFilter<"Usuario"> | boolean
    acessos?: StringFilter<"Usuario"> | string
    criadoEm?: DateTimeFilter<"Usuario"> | Date | string
    updatedAt?: DateTimeFilter<"Usuario"> | Date | string
  }, "id" | "email">

  export type UsuarioOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    nome?: SortOrder
    senhaHash?: SortOrder
    perfil?: SortOrder
    ativo?: SortOrder
    acessos?: SortOrder
    criadoEm?: SortOrder
    updatedAt?: SortOrder
    _count?: UsuarioCountOrderByAggregateInput
    _avg?: UsuarioAvgOrderByAggregateInput
    _max?: UsuarioMaxOrderByAggregateInput
    _min?: UsuarioMinOrderByAggregateInput
    _sum?: UsuarioSumOrderByAggregateInput
  }

  export type UsuarioScalarWhereWithAggregatesInput = {
    AND?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    OR?: UsuarioScalarWhereWithAggregatesInput[]
    NOT?: UsuarioScalarWhereWithAggregatesInput | UsuarioScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Usuario"> | number
    email?: StringWithAggregatesFilter<"Usuario"> | string
    nome?: StringWithAggregatesFilter<"Usuario"> | string
    senhaHash?: StringWithAggregatesFilter<"Usuario"> | string
    perfil?: StringWithAggregatesFilter<"Usuario"> | string
    ativo?: BoolWithAggregatesFilter<"Usuario"> | boolean
    acessos?: StringWithAggregatesFilter<"Usuario"> | string
    criadoEm?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Usuario"> | Date | string
  }

  export type SnapshotMetaCreateInput = {
    criadoEm?: Date | string
    tipoSnap?: string
    status?: string
    mensagem?: string | null
    duracaoMs?: number | null
  }

  export type SnapshotMetaUncheckedCreateInput = {
    id?: number
    criadoEm?: Date | string
    tipoSnap?: string
    status?: string
    mensagem?: string | null
    duracaoMs?: number | null
  }

  export type SnapshotMetaUpdateInput = {
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoSnap?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    mensagem?: NullableStringFieldUpdateOperationsInput | string | null
    duracaoMs?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SnapshotMetaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoSnap?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    mensagem?: NullableStringFieldUpdateOperationsInput | string | null
    duracaoMs?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SnapshotMetaCreateManyInput = {
    id?: number
    criadoEm?: Date | string
    tipoSnap?: string
    status?: string
    mensagem?: string | null
    duracaoMs?: number | null
  }

  export type SnapshotMetaUpdateManyMutationInput = {
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoSnap?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    mensagem?: NullableStringFieldUpdateOperationsInput | string | null
    duracaoMs?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SnapshotMetaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    tipoSnap?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    mensagem?: NullableStringFieldUpdateOperationsInput | string | null
    duracaoMs?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type KpiDiarioCreateInput = {
    snapshotId: number
    idImovel: number
    nomeImovel: string
    tipo: string
    mesRef: string
    valor?: number
    juros?: number
    correcao?: number
    multa?: number
    encargo?: number
    tarifaBoleto?: number
  }

  export type KpiDiarioUncheckedCreateInput = {
    id?: number
    snapshotId: number
    idImovel: number
    nomeImovel: string
    tipo: string
    mesRef: string
    valor?: number
    juros?: number
    correcao?: number
    multa?: number
    encargo?: number
    tarifaBoleto?: number
  }

  export type KpiDiarioUpdateInput = {
    snapshotId?: IntFieldUpdateOperationsInput | number
    idImovel?: IntFieldUpdateOperationsInput | number
    nomeImovel?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    mesRef?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    juros?: FloatFieldUpdateOperationsInput | number
    correcao?: FloatFieldUpdateOperationsInput | number
    multa?: FloatFieldUpdateOperationsInput | number
    encargo?: FloatFieldUpdateOperationsInput | number
    tarifaBoleto?: FloatFieldUpdateOperationsInput | number
  }

  export type KpiDiarioUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    snapshotId?: IntFieldUpdateOperationsInput | number
    idImovel?: IntFieldUpdateOperationsInput | number
    nomeImovel?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    mesRef?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    juros?: FloatFieldUpdateOperationsInput | number
    correcao?: FloatFieldUpdateOperationsInput | number
    multa?: FloatFieldUpdateOperationsInput | number
    encargo?: FloatFieldUpdateOperationsInput | number
    tarifaBoleto?: FloatFieldUpdateOperationsInput | number
  }

  export type KpiDiarioCreateManyInput = {
    id?: number
    snapshotId: number
    idImovel: number
    nomeImovel: string
    tipo: string
    mesRef: string
    valor?: number
    juros?: number
    correcao?: number
    multa?: number
    encargo?: number
    tarifaBoleto?: number
  }

  export type KpiDiarioUpdateManyMutationInput = {
    snapshotId?: IntFieldUpdateOperationsInput | number
    idImovel?: IntFieldUpdateOperationsInput | number
    nomeImovel?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    mesRef?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    juros?: FloatFieldUpdateOperationsInput | number
    correcao?: FloatFieldUpdateOperationsInput | number
    multa?: FloatFieldUpdateOperationsInput | number
    encargo?: FloatFieldUpdateOperationsInput | number
    tarifaBoleto?: FloatFieldUpdateOperationsInput | number
  }

  export type KpiDiarioUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    snapshotId?: IntFieldUpdateOperationsInput | number
    idImovel?: IntFieldUpdateOperationsInput | number
    nomeImovel?: StringFieldUpdateOperationsInput | string
    tipo?: StringFieldUpdateOperationsInput | string
    mesRef?: StringFieldUpdateOperationsInput | string
    valor?: FloatFieldUpdateOperationsInput | number
    juros?: FloatFieldUpdateOperationsInput | number
    correcao?: FloatFieldUpdateOperationsInput | number
    multa?: FloatFieldUpdateOperationsInput | number
    encargo?: FloatFieldUpdateOperationsInput | number
    tarifaBoleto?: FloatFieldUpdateOperationsInput | number
  }

  export type UsuarioCreateInput = {
    email: string
    nome: string
    senhaHash: string
    perfil?: string
    ativo?: boolean
    acessos?: string
    criadoEm?: Date | string
    updatedAt?: Date | string
  }

  export type UsuarioUncheckedCreateInput = {
    id?: number
    email: string
    nome: string
    senhaHash: string
    perfil?: string
    ativo?: boolean
    acessos?: string
    criadoEm?: Date | string
    updatedAt?: Date | string
  }

  export type UsuarioUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    perfil?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    acessos?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    perfil?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    acessos?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioCreateManyInput = {
    id?: number
    email: string
    nome: string
    senhaHash: string
    perfil?: string
    ativo?: boolean
    acessos?: string
    criadoEm?: Date | string
    updatedAt?: Date | string
  }

  export type UsuarioUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    perfil?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    acessos?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsuarioUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    senhaHash?: StringFieldUpdateOperationsInput | string
    perfil?: StringFieldUpdateOperationsInput | string
    ativo?: BoolFieldUpdateOperationsInput | boolean
    acessos?: StringFieldUpdateOperationsInput | string
    criadoEm?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SnapshotMetaCountOrderByAggregateInput = {
    id?: SortOrder
    criadoEm?: SortOrder
    tipoSnap?: SortOrder
    status?: SortOrder
    mensagem?: SortOrder
    duracaoMs?: SortOrder
  }

  export type SnapshotMetaAvgOrderByAggregateInput = {
    id?: SortOrder
    duracaoMs?: SortOrder
  }

  export type SnapshotMetaMaxOrderByAggregateInput = {
    id?: SortOrder
    criadoEm?: SortOrder
    tipoSnap?: SortOrder
    status?: SortOrder
    mensagem?: SortOrder
    duracaoMs?: SortOrder
  }

  export type SnapshotMetaMinOrderByAggregateInput = {
    id?: SortOrder
    criadoEm?: SortOrder
    tipoSnap?: SortOrder
    status?: SortOrder
    mensagem?: SortOrder
    duracaoMs?: SortOrder
  }

  export type SnapshotMetaSumOrderByAggregateInput = {
    id?: SortOrder
    duracaoMs?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type KpiDiarioCountOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    idImovel?: SortOrder
    nomeImovel?: SortOrder
    tipo?: SortOrder
    mesRef?: SortOrder
    valor?: SortOrder
    juros?: SortOrder
    correcao?: SortOrder
    multa?: SortOrder
    encargo?: SortOrder
    tarifaBoleto?: SortOrder
  }

  export type KpiDiarioAvgOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    idImovel?: SortOrder
    valor?: SortOrder
    juros?: SortOrder
    correcao?: SortOrder
    multa?: SortOrder
    encargo?: SortOrder
    tarifaBoleto?: SortOrder
  }

  export type KpiDiarioMaxOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    idImovel?: SortOrder
    nomeImovel?: SortOrder
    tipo?: SortOrder
    mesRef?: SortOrder
    valor?: SortOrder
    juros?: SortOrder
    correcao?: SortOrder
    multa?: SortOrder
    encargo?: SortOrder
    tarifaBoleto?: SortOrder
  }

  export type KpiDiarioMinOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    idImovel?: SortOrder
    nomeImovel?: SortOrder
    tipo?: SortOrder
    mesRef?: SortOrder
    valor?: SortOrder
    juros?: SortOrder
    correcao?: SortOrder
    multa?: SortOrder
    encargo?: SortOrder
    tarifaBoleto?: SortOrder
  }

  export type KpiDiarioSumOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    idImovel?: SortOrder
    valor?: SortOrder
    juros?: SortOrder
    correcao?: SortOrder
    multa?: SortOrder
    encargo?: SortOrder
    tarifaBoleto?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UsuarioCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    nome?: SortOrder
    senhaHash?: SortOrder
    perfil?: SortOrder
    ativo?: SortOrder
    acessos?: SortOrder
    criadoEm?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsuarioAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UsuarioMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    nome?: SortOrder
    senhaHash?: SortOrder
    perfil?: SortOrder
    ativo?: SortOrder
    acessos?: SortOrder
    criadoEm?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsuarioMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    nome?: SortOrder
    senhaHash?: SortOrder
    perfil?: SortOrder
    ativo?: SortOrder
    acessos?: SortOrder
    criadoEm?: SortOrder
    updatedAt?: SortOrder
  }

  export type UsuarioSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use SnapshotMetaDefaultArgs instead
     */
    export type SnapshotMetaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SnapshotMetaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use KpiDiarioDefaultArgs instead
     */
    export type KpiDiarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = KpiDiarioDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UsuarioDefaultArgs instead
     */
    export type UsuarioArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UsuarioDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}