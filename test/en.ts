import { dt, type LanguageMessages } from "../src";

export default {
  simple: "Simple message",
  complex: {
    message: "Complex message",
  },
  variable: "Hello, {name}!",
  plural: dt("You have {messages:plural}", {
    plural: {
      messages: { one: "1 message", other: "{?} messages" },
    },
  }),
} as const satisfies LanguageMessages;
