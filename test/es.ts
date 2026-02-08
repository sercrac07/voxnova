import { dt, type LanguageMessages } from "../src";
import type translation from "./en";

export default {
  simple: "Mensaje simple",
  complex: {
    message: "Mensaje complejo",
  },
  variable: "¡Hola, {name}!",
  plural: dt("Tienes {messages:plural}", {
    plural: {
      messages: { one: "1 mensaje", other: "{?} mensajes" },
    },
  }),
  number: dt("El precio de esto es {price:number}", {
    number: { price: { style: "currency", currency: "EUR" } },
  }),
} as const satisfies LanguageMessages<typeof translation>;
