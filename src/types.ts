import type { dt } from "./define-translation";

export type LanguageMessages<
  R extends LanguageMessages | undefined = undefined,
> = R extends object
  ? LanguageStructure<R>
  : {
      [x: string]: I18nMessage | LanguageMessages;
    };

export type I18nMessage = string | ReturnType<typeof dt>;

type LanguageStructure<R extends LanguageMessages> = {
  [K in keyof R]: R[K] extends string
    ? string
    : R[K] extends ReturnType<typeof dt>
      ? [string, R[K][1]]
      : R[K] extends LanguageMessages
        ? LanguageStructure<R[K]>
        : never;
};
