# AI Agent Development Guide for Voxnova

This file contains development guidelines for AI agents working on the Voxnova TypeScript internationalization library. Follow these standards to maintain code quality and consistency.

## Project Overview

Voxnova is a modern TypeScript i18n library that provides type-safe internationalization with pluralization support. The library uses advanced TypeScript features for compile-time type checking and runtime translation resolution.

## Build, Test, and Quality Commands

### Primary Commands

- `npm run build` - Build the library using tsdown
- `npm run test` - Run all tests once using Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint source and test files using Biome
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Check code formatting using Biome
- `npm run format:fix` - Auto-format code using Biome
- `npm run typecheck` - Run TypeScript compiler checks without emitting files
- `npm run check` - Run complete quality pipeline (test + lint + format + typecheck)
- `npm run prepublishOnly` - Build and run all quality checks before publishing

### Running Single Tests

Use Vitest's test name filtering: `npm test -- -t "test name pattern"`
Example: `npm test -- -t "should return messages with no params"`

## Code Style Guidelines

### TypeScript Configuration

The project uses strict TypeScript settings in `tsconfig.json`:
- Strict mode enabled with additional safety checks
- `exactOptionalPropertyTypes: true` - Precise optional type handling
- `noUncheckedIndexedAccess: true` - Safe array/object access
- `noUnusedLocals` and `noUnusedParameters: true` - No unused code

### Import Organization

- Use `import type` for type-only imports
- Group imports: external libraries first, then internal modules
- Biome automatically organizes imports on save (`organizeImports: "on"`)

### Formatting (Biome Configuration)

- 2-space indentation
- Double quotes for strings
- Semicolons always required
- Trailing commas in multi-line structures
- Arrow functions always use parentheses
- Line width: 80 characters
- LF line endings

### Naming Conventions

- Functions: camelCase (`initI18n`, `getTranslation`)
- Types: PascalCase (`LanguageMessages`, `I18nMessage`)
- Variables: camelCase (`orderedLocales`, `paramOptions`)
- Constants: UPPER_SNAKE_CASE for module-level constants
- File names: kebab-case for implementation files, camelCase allowed for type files

### Type System Usage

- Leverage TypeScript's advanced type features (conditional types, mapped types, template literals)
- Use `as const` for translation objects to enable type inference
- Prefer type guards and type predicates for runtime type checking
- Use utility types (`Partial`, `Exclude`, `Record`) appropriately
- Define function overloads for different parameter patterns

### Error Handling

- Use descriptive error messages with context
- Throw `Error` objects with meaningful messages
- Validate function parameters and throw early for invalid inputs
- Use try-catch blocks only when necessary
- Return `undefined` for "not found" cases in lookup functions

### Function and Module Design

- Keep functions small and focused on single responsibilities
- Use pure functions when possible
- Leverage function overloads for different parameter combinations
- Export types separately from implementations
- Use generic types for reusable components
- Implement proper separation of concerns between types, core logic, and initialization

### Testing Patterns (Vitest)

- Use `describe`, `it`, and `expect` from Vitest
- Group related tests in `describe` blocks
- Write descriptive test names that describe the expected behavior
- Test both success and failure scenarios
- Use parameterized tests for multiple similar cases
- Test type-level functionality through runtime examples
- Keep test files in the `test/` directory with `.test.ts` extension

### Documentation and Comments

- Add JSDoc comments for complex type definitions
- Comment business logic that isn't immediately obvious
- Explain the purpose of complex type transformations
- Use comments to clarify why certain approaches were taken

## Project Structure

```
src/
├── index.ts                - Main exports
├── init.ts                 - Core i18n initialization
├── define-translation.ts   - Translation definition utilities
└── types.ts                - Core type definitions

test/
├── index.test.ts   - Main test suite
├── en.ts           - English translation examples
└── es.ts           - Spanish translation examples
```

## Development Workflow

1. Before making changes: run `npm run check` to ensure clean state
2. Make your changes following the style guidelines
3. Run `npm run test` to verify functionality
4. Run `npm run lint:fix` and `npm run format:fix` to clean up code
5. Run `npm run typecheck` to verify type safety
6. Run `npm run check` for final verification
7. Commit only after all checks pass

## Library-Specific Patterns

### Translation Definitions

- Use the `dt()` function for translation definitions with parameters
- Define plural options using `PluralOptions` type
- Use `as const satisfies LanguageMessages` for type-safe translation objects

### Type Safety

- Leverage dot-notation path types for translation keys
- Use conditional types to extract parameter types from translation strings
- Implement proper fallback locale handling with type safety
- Ensure pluralization rules are type-checked at compile time

### Performance Considerations

- Cache locale resolution results
- Use efficient object property access patterns
- Minimize runtime type checking where compile-time guarantees exist
- Implement lazy evaluation for complex type calculations
