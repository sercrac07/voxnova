<div align="center">

  # Voxnova

  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?colorA=313244&colorB=74c7ec&style=for-the-badge)
  ![Bundle Size](https://img.shields.io/bundlephobia/minzip/voxnova?colorA=313244&colorB=94e2d5&style=for-the-badge)
  ![Tests](https://img.shields.io/badge/tests-passing-green?colorA=313244&colorB=a6e3a1&style=for-the-badge)
  ![License](https://img.shields.io/badge/License-MIT-green?colorA=313244&colorB=f9e2af&style=for-the-badge)

  A new voice for your applications - modern internationalization made simple.

</div>

## Why Voxnova?

`Voxnova` provides an ease solution for internationalization with advanced TypeScript features and Intl integration.

```ts
import { initI18n } from "voxnova";

import en from "./translations/en";
import es from "./translations/es";

const t = initI18n({
  locale: "en",
  translations: { en, es },
  fallback: "es",
});

console.log(t("greetings", { name: "John" })); // Hello, John!
```

## Features

- **Zero dependencies** - Lightweight and fast
- **Type-first** - Full TypeScript inference out of the box
- **Minimal API** - Simple and intuitive to use

## Installation

```bash
npm install voxnova
```

## Quick Start

Define your main translation language file:

```ts
// /translations/en.ts
import { type LanguageMessages, dt } from "voxnova";

export default {
  message: "This is a normal message",
  greetings: "Hello, {name}!",
  messages: dt("You have {messages:plural}", {
    plural: { messages: { one: "1 message", other: "{?} messages" } },
  }),
} as const satisfies LanguageMessages; // Needed for type-safety
```

Then you can define other languages with your main language as a reference:

```ts
// /translations/es.ts
import { type LanguageMessages, dt } from "voxnova";

import type en from "./en"

export default {
  message: "Esto es un mensaje normal",
  greetings: "¡Hola, {name}!",
  messages: dt("Tienes {messages:plural}", {
    plural: { messages: { one: "1 mensaje", other: "{?} mensajes" } }
  })
} as const satisfies LanguageMessages<typeof en>; // Needed for type-safety
```

Now you can initialize your i18n with all your languages:

```ts
// /i18n.ts
import { initI18n } from "voxnova";

import en from "./translations/en";
import es from "./translations/es";

const t = initI18n({
  locale: "en",
  translations: { en, es },
  fallback: "es",
});

console.log(t("messages", { messages: 1 })); // You have 1 message
console.log(t("messages", { messages: 10 })); // You have 10 messages
```

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on:

- Development setup and workflow
- Code style and testing requirements
- Pull request process

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

## Reporting Issues

- Use [GitHub Issues](https://github.com/sercrac07/voxnova/issues) for bug reports
- Provide minimal reproduction examples
- Include TypeScript version and environment details

## License

[MIT](LICENSE)

## Author

[Sergio Casado](https://github.com/sercrac07)
