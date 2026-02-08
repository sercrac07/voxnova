import type {
  DateOptions,
  dt,
  NumberOptions,
  PluralOptions,
} from "./define-translation";
import type { I18nMessage, LanguageMessages } from "./types";

/**
 * Generates all posible dot-notation paths for accessing nested translation keys.
 */
type DotPath<L extends LanguageMessages> = {
  [K in keyof L]: L[K] extends I18nMessage
    ? `${K & string}`
    : L[K] extends LanguageMessages
      ? `${K & string}.${DotPath<L[K]>}`
      : never;
}[keyof L];

/**
 * Filters translation paths to those that don't require parameters.
 */
type PathsWithoutParams<L extends LanguageMessages> = {
  [K in DotPath<L>]: Param<K, L> extends object ? never : K;
}[DotPath<L>];
/**
 * Filters translation paths to those that require parameters.
 */
type PathsWithParams<L extends LanguageMessages> = {
  [K in DotPath<L>]: Param<K, L> extends object ? K : never;
}[DotPath<L>];

/**
 * Extracts the parameter type definition for a specific translation path.
 */
type Param<P extends string, L extends LanguageMessages> = GetParams<
  AccessProperty<P, L>
>;

/**
 * Extracts parameter types from a translation definition.
 */
type GetParams<T extends I18nMessage> =
  T[1] extends Record<infer Type, Record<infer Name, unknown>>
    ? GetParamType<Name & string, Type & string> & GetVariableParams<T[0]>
    : GetVariableParams<T[0]>;

/**
 * Extracts untyped variable parameters from translation strings.
 */
type GetVariableParams<S extends string> =
  S extends `${string}{${infer Param}}${infer Rest}`
    ? Param extends `${string}:${string}`
      ? GetVariableParams<Rest>
      : Record<Param, string> & GetVariableParams<Rest>
    : unknown;

/**
 * Maps parameter types to their corresponding TypeScript types.
 */
type GetParamType<N extends string, T extends string> = T extends
  | "plural"
  | "number"
  ? Record<N, number>
  : T extends "date"
    ? Record<N, Date>
    : never;

/**
 * Accesses a nested property in the translation object using dot notation.
 */
type AccessProperty<
  P extends string,
  L extends LanguageMessages,
> = P extends `${infer First}.${infer Rest}`
  ? First extends keyof L
    ? L[First] extends LanguageMessages
      ? AccessProperty<Rest, L[First]>
      : never
    : never
  : P extends keyof L
    ? L[P] extends I18nMessage
      ? TranslationDefinition<L[P]>
      : never
    : never;

/**
 * Normalizes translation definitions to a consistent tuple format.
 */
type TranslationDefinition<T extends I18nMessage> = T extends string
  ? [T, unknown]
  : T;

/**
 * Configuration interface for initializing the internationalization system.
 */
type InitI18nConfig<
  T extends Record<string, LanguageMessages>,
  L extends keyof T,
> = {
  /**
   * The primary locale to use for translations.
   */
  locale: keyof T | (string & {});
  /**
   * Object containing all translation definitions organized by locale. Each value must conform to the `LanguageMessages` type.
   */
  translations: T;
  /**
   * Fallback locale(s) to use when a translation is missing in the primary locale. Can be a single locale or an array of locales for fallback chain.
   */
  fallback: L | L[];
};

/**
 * Initializes the Voxnova internationalization system with type-safe translation functions.
 *
 * This function creates a translation function that provides compile-time type safety for translation keys and parameters, along with runtime locale resolution and fallback handling.
 */
export function initI18n<
  T extends Record<string, LanguageMessages>,
  L extends keyof T,
>(config: InitI18nConfig<T, L>) {
  // Convert fallback configuration to array for uniform processing
  const fallbackLocales = Array.isArray(config.fallback)
    ? config.fallback
    : [config.fallback];

  // Create ordered set of locales for resolution with parent locale fallback
  const orderedLocales = new Set([
    ...getOrderedLocaleAndParentLocales(
      (config.locale as string).toLowerCase(),
    ),
    ...fallbackLocales.flatMap((locale) =>
      getOrderedLocaleAndParentLocales((locale as string).toLowerCase()),
    ),
  ]);

  /**
   * This function resolves translations using the locale fallback chain and performs parameter substitution.
   */
  function t(key: PathsWithoutParams<T[L]>): string;
  function t<P extends PathsWithParams<T[L]>>(
    key: P,
    args: Param<P, T[L]>,
  ): string;
  function t<P extends DotPath<T[L]>>(key: P, args?: Param<P, T[L]>): string {
    // Try to resolve translation from each locale in the fallback chain
    for (const locale of orderedLocales) {
      const translationObject = config.translations[locale];
      if (!translationObject) continue;

      const translation = getTranslation(
        translationObject,
        key,
        args || {},
        locale,
      );
      if (!translation) continue;
      return translation;
    }

    // Fallback to the key if no translation found
    return key;
  }

  return t;
}

/**
 * Generates an ordered list of locales including parent locales for fallback resolution.
 */
function getOrderedLocaleAndParentLocales(locale: string): string[] {
  const locales: string[] = [];
  let parentLocale = locale;

  // Iteratively strip locale components to build hierarchy
  while (parentLocale !== "") {
    locales.push(parentLocale);
    parentLocale = parentLocale.replace(/-?[^-]+$/, "");
  }

  return locales;
}

/**
 * Retrieves a translation from the translation object and performs parameter substitution.
 */
function getTranslation(
  object: LanguageMessages,
  key: string,
  args: Record<string, string | number | Date>,
  locale: string,
): string | undefined {
  const property = getProperty(object, key);
  if (!property) return undefined;

  return performSubstitution(property[0], property[1], args, locale);
}

/**
 * Retrieves a translation property using dot-notation path traversal.
 */
function getProperty(
  object: LanguageMessages,
  key: string,
): ReturnType<typeof dt> | undefined {
  const keys = key.split(".");
  let obj = object;

  // Traverse the object path
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!k) continue;

    const newObject = obj[k];
    if (!newObject) return undefined;

    // Check if we've reached a translation message
    if (typeof newObject === "string" || Array.isArray(newObject)) {
      if (i !== keys.length - 1) return undefined; // Did not reach the last element

      return Array.isArray(newObject) ? newObject : [newObject, null];
    }

    obj = newObject;
  }

  return undefined;
}

/**
 * Processes translation strings by replacing parameter placeholders with provided values.
 */
function performSubstitution(
  string: string,
  paramOptions: ReturnType<typeof dt>[1],
  args: Record<string, string | number | Date>,
  locale: string,
): string {
  return Object.entries(args).reduce((result, [argName, argValue]) => {
    // Match parameter with optional type annotation
    const match = result.match(`{${argName}(?::([^}]+))?}`);
    const [replaceKey, argType] = match ? match : [`{${argName}}`, undefined];

    switch (argType) {
      case "plural": {
        // Validate parameter type
        if (typeof argValue !== "number") {
          throw new Error(
            `Invalid argument type for parameter '${argName}': expected number, received ${typeof argValue}`,
          );
        }

        // Extract plural configuration
        const pluralOptions = (
          paramOptions as
            | Record<"plural", Record<string, PluralOptions>>
            | undefined
        )?.plural?.[argName];
        if (!pluralOptions) {
          throw new Error(
            `Plural options must be defined for parameter '${argName}'. Make sure to include plural configuration in your dt() function call.`,
          );
        }

        // Determine plural form using Intl.PluralRules
        const pluralRules = new Intl.PluralRules(locale, {
          type: pluralOptions.type,
        });

        const pluralForm = pluralRules.select(argValue);
        const replacement = pluralOptions[pluralForm] ?? pluralOptions.other;

        // Apply number formatting if specified
        const numberFormatter = new Intl.NumberFormat(
          locale,
          pluralOptions.formatter,
        );
        const formattedValue = numberFormatter.format(argValue);

        return result.replaceAll(
          replaceKey,
          replacement.replaceAll("{?}", formattedValue),
        );
      }
      case "number": {
        // Validate parameter type
        if (typeof argValue !== "number") {
          throw new Error(
            `Invalid argument type for parameter '${argName}': expected number, received ${typeof argValue}`,
          );
        }

        // Extract number configuration
        const numberOptions = (
          paramOptions as
            | Record<"number", Record<string, NumberOptions>>
            | undefined
        )?.number?.[argName];

        // Apply number formatting
        const numberFormatter = new Intl.NumberFormat(locale, numberOptions);
        const formattedValue = numberFormatter.format(argValue);

        return result.replaceAll(replaceKey, formattedValue);
      }
      case "date": {
        // Validate parameter type
        if (!(argValue instanceof Date)) {
          throw new Error(
            `Invalid argument type for parameter '${argName}': expected date, received ${typeof argValue}`,
          );
        }

        // Extract date configuration
        const dateOptions = (
          paramOptions as
            | Record<"date", Record<string, DateOptions>>
            | undefined
        )?.date?.[argName];

        // Apply date formatting
        const dateFormatter = new Intl.DateTimeFormat(locale, dateOptions);
        const formattedValue = dateFormatter.format(argValue);

        return result.replaceAll(replaceKey, formattedValue);
      }
      default: {
        // Simple string substitution for untyped params
        return result.replaceAll(replaceKey, String(argValue));
      }
    }
  }, string);
}
