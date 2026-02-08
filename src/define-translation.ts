/**
 * Internal utility type that extracts parameter options from translations strings.
 */
type GetOptions<S extends string> =
  S extends `${string}{${infer Param}}${infer Rest}`
    ? Param extends `${infer Name}:${infer Type}`
      ? ParseOption<Name, Type> & GetOptions<Rest>
      : GetOptions<Rest>
    : unknown;

/**
 * Parses individual parameter definitions and creates the appropriate type structure.
 */
type ParseOption<N extends string, T extends string> = T extends "plural"
  ? Record<"plural", Record<N, PluralOptions>>
  : T extends "number"
    ? Record<"number", Record<N, NumberOptions>>
    : T extends "date"
      ? Record<"date", Record<N, DateOptions>>
      : T extends "list"
        ? Record<"list", Record<N, ListOptions>>
        : never;

/**
 * Defines pluralization options for a parameter using Intl-compatible rules.
 *
 * This type provides comprehensive plurarization support following the Unicode CLDR (Common Locale Data Repository) plural rules used by the Intl API.
 *
 * The `{?}` placeholder represents the actual count value.
 */
export type PluralOptions = Partial<
  Record<Exclude<Intl.LDMLPluralRule, "other">, string>
> & {
  /**
   * Required fallback plural form used when no specific rule matches.
   */
  other: string;
  /**
   * Specifies the plural rule type: 'cardinal' for counting or 'ordinal' for ordering.
   */
  type?: Intl.PluralRuleType;
  /**
   * Number formatting options for the count value.
   */
  formatter?: Intl.NumberFormatOptions;
};
/**
 * Defines number formatting options.
 */
export type NumberOptions = Intl.NumberFormatOptions;
/**
 * Defines date formatting options.
 */
export type DateOptions = Intl.DateTimeFormatOptions;
/**
 * Defines list formatting options.
 */
export type ListOptions = Intl.ListFormatOptions;

/**
 * Defines a translation with parameterized placeholders for compile-time type safety.
 *
 * The `dt` function (short for "define translation") creates typed translation objects that enforce parameter validation at compile time while maintaining runtime compatibility with the Voxnova i18n system.
 *
 * Supported types:
 *
 * - Plurarization (`{name:plural}`)
 * - Numbers (`{name:number}`)
 * - Dates (`{name:date}`)
 * - Lists (`{name:list}`)
 */
export function dt<S extends string>(
  string: S,
  options: GetOptions<S>,
): [S, GetOptions<S>] {
  return [string, options];
}
