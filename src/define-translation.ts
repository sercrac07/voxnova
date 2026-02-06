type GetOptions<S extends string> =
  S extends `${string}{${infer Param}}${infer Rest}`
    ? Param extends `${infer Name}:${infer Type}`
      ? ParseOption<Name, Type> & GetOptions<Rest>
      : GetOptions<Rest>
    : unknown;

type ParseOption<N extends string, T extends string> = T extends "plural"
  ? Record<"plural", Record<N, PluralOptions>>
  : never;

export type PluralOptions = Partial<
  Record<Exclude<Intl.LDMLPluralRule, "other">, string>
> & {
  other: string;
  type?: Intl.PluralRuleType;
  formatter?: Intl.NumberFormatOptions;
};

export function dt<S extends string>(
  string: S,
  options: GetOptions<S>,
): [S, GetOptions<S>] {
  return [string, options];
}
