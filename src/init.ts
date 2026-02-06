import type { dt, PluralOptions } from "./define-translation";
import type { I18nMessage, LanguageMessages } from "./types";

type DotPath<L extends LanguageMessages> = {
  [K in keyof L]: L[K] extends I18nMessage
    ? `${K & string}`
    : L[K] extends LanguageMessages
      ? `${K & string}.${DotPath<L[K]>}`
      : never;
}[keyof L];

type PathsWithoutParams<L extends LanguageMessages> = {
  [K in DotPath<L>]: Param<K, L> extends object ? never : K;
}[DotPath<L>];
type PathsWithParams<L extends LanguageMessages> = {
  [K in DotPath<L>]: Param<K, L> extends object ? K : never;
}[DotPath<L>];

type Param<P extends string, L extends LanguageMessages> = GetParams<
  AccessProperty<P, L>
>;

type GetParams<T extends I18nMessage> =
  T[1] extends Record<infer Type, Record<infer Name, unknown>>
    ? GetParamType<Name & string, Type & string> & GetVariableParams<T[0]>
    : GetVariableParams<T[0]>;

type GetVariableParams<S extends string> =
  S extends `${string}{${infer Param}}${infer Rest}`
    ? Param extends `${string}:${string}`
      ? GetVariableParams<Rest>
      : Record<Param, string> & GetVariableParams<Rest>
    : unknown;

type GetParamType<N extends string, T extends string> = T extends "plural"
  ? Record<N, number>
  : never;

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

type TranslationDefinition<T extends I18nMessage> = T extends string
  ? [T, unknown]
  : T;

type InitI18nConfig<
  T extends Record<string, LanguageMessages>,
  L extends keyof T,
> = {
  locale: keyof T | (string & {});
  translations: T;
  fallback: L | L[];
};

export function initI18n<
  T extends Record<string, LanguageMessages>,
  L extends keyof T,
>(config: InitI18nConfig<T, L>) {
  const fallbackLocales = Array.isArray(config.fallback)
    ? config.fallback
    : [config.fallback];

  const orderedLocales = new Set([
    ...getOrderedLocaleAndParentLocales(
      (config.locale as string).toLowerCase(),
    ),
    ...fallbackLocales.flatMap((locale) =>
      getOrderedLocaleAndParentLocales((locale as string).toLowerCase()),
    ),
  ]);

  function t(key: PathsWithoutParams<T[L]>): string;
  function t<P extends PathsWithParams<T[L]>>(
    key: P,
    args: Param<P, T[L]>,
  ): string;
  function t<P extends DotPath<T[L]>>(key: P, args?: Param<P, T[L]>): string {
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

    return key;
  }

  return t;
}

function getOrderedLocaleAndParentLocales(locale: string): string[] {
  const locales: string[] = [];
  let parentLocale = locale;

  while (parentLocale !== "") {
    locales.push(parentLocale);
    parentLocale = parentLocale.replace(/-?[^-]+$/, "");
  }

  return locales;
}

function getTranslation(
  object: LanguageMessages,
  key: string,
  args: Record<string, string | number>,
  locale: string,
): string | undefined {
  const property = getProperty(object, key);
  if (!property) return undefined;

  return performSubstitution(property[0], property[1], args, locale);
}

function getProperty(
  object: LanguageMessages,
  key: string,
): ReturnType<typeof dt> | undefined {
  const keys = key.split(".");
  let obj = object;

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (!k) continue;

    const newObject = obj[k];
    if (!newObject) return undefined;

    if (typeof newObject === "string" || Array.isArray(newObject)) {
      if (i !== keys.length - 1) return undefined;

      return Array.isArray(newObject) ? newObject : [newObject, null];
    }

    obj = newObject;
  }

  return undefined;
}

function performSubstitution(
  string: string,
  paramOptions: ReturnType<typeof dt>[1],
  args: Record<string, string | number>,
  locale: string,
): string {
  return Object.entries(args).reduce((result, [argName, argValue]) => {
    const match = result.match(`{${argName}(?::([^}]+))?}`);
    const [replaceKey, argType] = match ? match : [`{${argName}}`, undefined];

    switch (argType) {
      case "plural": {
        if (typeof argValue !== "number") {
          throw new Error("Invalid argument type");
        }

        const pluralOptions = (
          paramOptions as
            | Record<"plural", Record<string, PluralOptions>>
            | undefined
        )?.plural?.[argName];
        if (!pluralOptions) {
          throw new Error("Plural options must be defined");
        }

        const pluralRules = new Intl.PluralRules(locale, {
          type: pluralOptions.type,
        });

        const replacement =
          pluralOptions[pluralRules.select(argValue)] ?? pluralOptions.other;

        const numberFormatter = new Intl.NumberFormat(
          locale,
          pluralOptions.formatter,
        );

        return result.replace(
          replaceKey,
          replacement.replaceAll("{?}", numberFormatter.format(argValue)),
        );
      }
      default: {
        return result.replace(replaceKey, String(argValue));
      }
    }
  }, string);
}
