// functions and constants
export * from './functionsAny'

// error classes
export { IndexError } from '../error/IndexError'
export { DimensionError } from '../error/DimensionError'
export { ArgumentsError } from '../error/ArgumentsError'

// dependency groups
export * from './dependenciesAny.generated'

// core
export { core, create, factory } from './mainInstance'

// backward compatibility stuff for v5
export * from './deprecatedAny'