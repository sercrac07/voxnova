# Contributing to Voxnova

Thank you for your interest in contributing to Voxnova! This guide will help you get started with development, understand the project structure, and submit high-quality contributions.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Feature Development](#feature-development)
- [Bug Reports & Issue Reporting](#bug-reports--issue-reporting)
- [Community Guidelines](#community-guidelines)

## Development Setup

### Prerequisites

- **Node.js** >= 16.0.0
- **npm** or **yarn** or **bun**
- **Git** for version control
- Familiarity with **TypeScript** and its advanced type system

### Quick Start

```bash
# Clone your fork
git clone https://github.com/your-username/voxnova.git
cd voxnova

# Install dependencies
npm install

# Run tests to verify setup
npm test

# Start development (watch mode)
npm run test:watch
```

### Development Commands

- `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run build` - Build the library
- `npm run check` - Run complete quality pipeline
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format:fix` - Auto-format code
- `npm run typecheck` - Run TypeScript compiler checks

## Project Structure

```
voxnova/
├── src/
│   ├── index.ts                # Main exports and public API
│   ├── init.ts                 # Core i18n initialization logic
│   ├── define-translation.ts   # Translation definition utilities
│   └── types.ts                # Core type definitions and interfaces
├── test/
│   ├── *.test.ts               # Test suites
│   ├── en.ts                   # English translation examples
│   └── es.ts                   # Spanish translation examples
├── dist/                       # Build output (generated)
├── package.json                # Project configuration
├── tsconfig.json               # TypeScript configuration
├── biome.json                  # Biome linting and formatting config
└── AGENTS.md                   # AI agent development guidelines
```

### Core Concepts

Voxnova uses advanced TypeScript features for type-safe internationalization:

- **Type-first design**: All translations are type-checked at compile time
- **Dot-notation path types**: Translation keys are validated using TypeScript's template literal types
- **Conditional types**: Extract parameter types from translation strings
- **Pluralization support**: Built-in Intl.PluralRules integration
- **Fallback locale handling**: Type-safe fallback mechanisms

## Coding Standards

### TypeScript Configuration

The project uses strict TypeScript settings:

- `strict: true` - All strict type-checking options enabled
- `exactOptionalPropertyTypes: true` - Precise optional type handling
- `noUncheckedIndexedAccess: true` - Safe array/object access
- `noUnusedLocals` and `noUnusedParameters: true` - No unused code

### Code Style (Biome)

- **Indentation**: 2 spaces
- **Quotes**: Double quotes
- **Semicolons**: Always required
- **Line width**: 80 characters
- **Trailing commas**: Required in multi-line structures
- **Import organization**: Automatic (`organizeImports: "on"`)

### Naming Conventions

```typescript
// Functions: camelCase
function initI18n() {}
function getTranslation() {}

// Types: PascalCase
type LanguageMessages {}
interface I18nMessage {}

// Variables: camelCase
const orderedLocales = []
const paramOptions = {}

// Constants: UPPER_SNAKE_CASE
const DEFAULT_LOCALE = 'en'
```

### Import Organization

```typescript
// External libraries first
import type { LanguageMessages } from "voxnova";

// Internal modules second
import { initI18n } from "./init";
import type { TranslationOptions } from "./types";
```

### Function Design Patterns

```typescript
// Use function overloads for different parameter patterns
function t(key: string): string;
function t<T extends Record<string, unknown>>(
  key: string,
  params: T
): string;
function t(key: string, params?: Record<string, unknown>): string {
  // Implementation
}

// Use generic types for reusable components
function createTranslator<T extends LanguageMessages>(
  messages: T
) {
  // Implementation
}
```

### Error Handling

```typescript
// Validate parameters early
function validateLocale(locale: string): void {
  if (!locale || typeof locale !== 'string') {
    throw new Error('Locale must be a non-empty string');
  }
}

// Use descriptive error messages
throw new Error(`Translation key "${key}" not found in locale "${locale}"`);

// Return undefined for "not found" cases
function findTranslation(key: string): string | undefined {
  return messages[key];
}
```

## Testing Guidelines

### Test Structure

Use Vitest with `describe`, `it`, and `expect`:

```typescript
import { describe, it, expect } from 'vitest';
import { initI18n } from '../src';

describe('initI18n', () => {
  it('should initialize with default locale', () => {
    const t = initI18n({
      locale: 'en',
      translations: { en: { hello: 'Hello' } }
    });
    
    expect(t('hello')).toBe('Hello');
  });
});
```

### Testing Patterns

- **Group related tests**: Use `describe` blocks for logical grouping
- **Descriptive test names**: Test names should describe expected behavior
- **Test both success and failure scenarios**: Cover edge cases
- **Parameterized tests**: Use for multiple similar cases
- **Type-level testing**: Verify type safety through runtime examples

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific tests by name pattern
npm test -- -t "should return messages with no params"

# Run tests with coverage
npm test -- --coverage
```

## Development Workflow

### Quality Assurance Pipeline

Always run the complete check pipeline before committing:

```bash
npm run check
```

This runs:

1. `npm run test` - All tests must pass
2. `npm run lint` - No linting errors
3. `npm run format` - Code properly formatted
4. `npm run typecheck` - TypeScript compilation successful

### Pre-commit Workflow

1. Make your changes following the coding standards
2. Run `npm run test` to verify functionality
3. Run `npm run lint:fix` and `npm run format:fix` to clean up code
4. Run `npm run typecheck` to verify type safety
5. Run `npm run check` for final verification
6. Commit only after all checks pass

### Branch Naming

- `feature/feature-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/code-improvement` - Refactoring

## Pull Request Process

### Before Submitting

1. **Update documentation**: If adding features, update README.md examples
2. **Add tests**: Ensure new functionality is covered by tests
3. **Run quality checks**: All checks in `npm run check` must pass
4. **Check for breaking changes**: Document any breaking changes in PR description

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] All tests pass
- [ ] Added new tests for new functionality
- [ ] No regressions in existing functionality

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated if needed
```

### Review Process

1. **Automated checks**: CI will run `npm run check`
2. **Code review**: At least one maintainer approval required
3. **Type safety review**: Special attention to TypeScript types
4. **Testing review**: Ensure adequate test coverage

## Feature Development

### Adding New Features

1. **Understand existing patterns**: Review similar code in the codebase
2. **Type-first approach**: Define types before implementation
3. **Backward compatibility**: Ensure changes don't break existing API
4. **Documentation**: Update examples and API docs
5. **Examples**: Add usage examples in tests or documentation

### Breaking Changes

Breaking changes require:

- Major version bump consideration
- Migration guide in documentation
- Deprecation warnings where appropriate
- Clear communication in PR description

### Performance Considerations

- **Type-level performance**: Minimize complex type computations
- **Runtime performance**: Cache locale resolution results
- **Bundle size**: Consider impact on library size
- **Lazy evaluation**: Implement for expensive operations

## Bug Reports & Issue Reporting

### Reporting Bugs

Use [GitHub Issues](https://github.com/sercrac07/voxnova/issues) with:

1. **Clear title**: Summarize the issue
2. **Environment**: Node.js version, TypeScript version, OS
3. **Minimal reproduction**: Small code example that reproduces the issue
4. **Expected vs actual**: What you expected vs what happened
5. **Additional context**: Any relevant information

### Bug Fix Process

1. **Reproduce the issue**: Create a failing test case
2. **Understand root cause**: Debug and identify the problem
3. **Implement fix**: Write minimal code to fix the issue
4. **Add tests**: Ensure fix doesn't break other functionality
5. **Verify**: Run `npm run check` before submitting

### Debugging i18n Issues

Common i18n debugging patterns:

- Check locale resolution order
- Verify translation key existence
- Validate parameter types
- Test pluralization rules

## Community Guidelines

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and ideas
- **Documentation**: Check existing docs first

### Code of Conduct

Be respectful and inclusive:

- Welcome contributors of all experience levels
- Provide constructive feedback
- Be patient with questions
- Focus on what is best for the community

### Communication

- **Clear and concise**: Keep messages focused and to the point
- **Helpful attitude**: Assist others when possible
- **Professional conduct**: Maintain professional communication
- **Acknowledge contributions**: Thank contributors for their work

## License

By contributing to Voxnova, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to Voxnova! Your contributions help make internationalization easier for TypeScript developers everywhere.
