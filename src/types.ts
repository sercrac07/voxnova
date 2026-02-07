import type { dt } from "./define-translation";

/**
 * Represents the complete structure of translation messages for a language.
 *
 * This type supports both flat and nested translation objects, providing type safety for internationalization messages with optional parameter validation.
 *
 * @template R - Optional recursive type constraint for enhanced type inference
 *
 * Always use `as const satisfies LanguageMessages` for maximun type safety.
 */
export type LanguageMessages<
  R extends LanguageMessages | undefined = undefined,
> = R extends object
  ? LanguageStructure<R>
  : {
      [x: string]: I18nMessage | LanguageMessages;
    };

/**
 * Represents a single internationalization message.
 *
 * This type allows either plain strings for simple messages or structured translation objects created with the `dt()` function for messages with parameters.
 */
export type I18nMessage = string | ReturnType<typeof dt>;

/**
 * Internal utility type that transforms raw translation definitions into their runtime-compatible structure with enhanced type information.
 */
type LanguageStructure<R extends LanguageMessages> = {
  [K in keyof R]: R[K] extends string
    ? string
    : R[K] extends ReturnType<typeof dt>
      ? [string, R[K][1]]
      : R[K] extends LanguageMessages
        ? LanguageStructure<R[K]>
        : never;
};
