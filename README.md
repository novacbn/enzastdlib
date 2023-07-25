# `enzastdlib`

`enzastdlib` is a set of TypeScript modules that follow a common design API philosophy aiming at sane defaults and ease-of-use targeting the [Deno TypeScript runtime](https://deno.land).

## Modules

The following modules are considered public API ready for consumption:

- [`@enzastdlib/async`](https://deno.land/x/enzastdlib/async/mod.ts?doc) — Utilities for working with asynchronous and `Promise`-based code.
- [`@enzastdlib/collections`](https://deno.land/x/enzastdlib/collections/mod.ts?doc) — Utilities for working with collections like arrays and records.
- [`@enzastdlib/commands`](https://deno.land/x/enzastdlib/commands/mod.ts?doc) — Create command line tools with validation powered by [JSON Schema 2019-09](https://json-schema.org/specification-links.html#draft-2019-09-formerly-known-as-draft-8).
- [`@enzastdlib/decorators`](https://deno.land/x/enzastdlib/decorators/mod.ts?doc) — Create function decorators that access metadata with a streamlined API.
- [`@enzastdlib/environment`](https://deno.land/x/enzastdlib/environment/mod.ts?doc) — Parse and validate both environment variables and dotenv files powered by [JSON Schema 2019-09](https://json-schema.org/specification-links.html#draft-2019-09-formerly-known-as-draft-8).
- [`@enzastdlib/errors`](https://deno.land/x/enzastdlib/errors/mod.ts?doc) — General error objects that are used across `enzastdlib`.
- [`@enzastdlib/path`](https://deno.land/x/enzastdlib/events/mod.ts?doc) — Create typed events with a typed version of `EventTarget`.
- [`@enzastdlib/json5`](https://deno.land/x/enzastdlib/json5/mod.ts?doc) — Parse JSON5 documents and expressions.
- [`@enzastdlib/os`](https://deno.land/x/enzastdlib/os/mod.ts?doc) — Utilities for abstracting away operating system specifics.
- [`@enzastdlib/path`](https://deno.land/x/enzastdlib/path/mod.ts?doc) — Utilities for working with file system paths and URLs.
- [`@enzastdlib/realm`](https://deno.land/x/enzastdlib/realm/mod.ts?doc) — Create custom JavaScript and TypeScript execution environments.
- [`@enzastdlib/rpc`](https://deno.land/x/enzastdlib/rpc/mod.ts?doc) — Contains supplemental typing for creating fully typed and validated RPC clients and servers.
- [`@enzastdlib/rpc-http`](https://deno.land/x/enzastdlib/rpc-http/mod.ts?doc) — Create fully typed and validated RPC clients and servers using HTTP as the transport.
- [`@enzastdlib/rpc-messageport`](https://deno.land/x/enzastdlib/rpc-messageport/mod.ts?doc) — Create fully typed and validated RPC clients and servers using [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)-like API instances as the transport.
- [`@enzastdlib/rpc-protocol`](https://deno.land/x/enzastdlib/rpc-protocol/mod.ts?doc) — Create fully typed and validated RPC clients and servers powered by [JSON Schema 2019-09](https://json-schema.org/specification-links.html#draft-2019-09-formerly-known-as-draft-8).
- [`@enzastdlib/rpc-streams`](https://deno.land/x/enzastdlib/rpc-streams/mod.ts?doc) — Create fully typed and validated RPC clients and servers using a pair of [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) / [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) instances as the transport.
- [`@enzastdlib/schema`](https://deno.land/x/enzastdlib/schema/mod.ts?doc) — Create easy to use validators powered by [JSON Schema 2019-09](https://json-schema.org/specification-links.html#draft-2019-09-formerly-known-as-draft-8).
- [`@enzastdlib/strings`](https://deno.land/x/enzastdlib/strings/mod.ts?doc) — Utilities for working with strings.
- [`@enzastdlib/testing`](https://deno.land/x/enzastdlib/testing/mod.ts?doc) — Utilities for working with Deno's testing API.

## Importing

```typescript
import * as mod from 'https://deno.land/x/enzastdlib/.../mod.ts';
```

## Documentation

Visit the documentation at [Deno's module registry](https://deno.land/x/enzastdlib?doc).

## Need Help?

> Please [search current issues](https://github.com/novacbn/enzastdlib/issues) to see if your problem has been tackled previously before filing a new issue.

File [a new issue](https://github.com/novacbn/enzastdlib/issues/new/choose).

## Want to Contribute?

Visit the [`CONTRIBUTING.md`](./CONTRIBUTING.md) for information on getting started.

## Dependencies

The following dependencies are utilized by this library:

- [`@CesiumLabs/json5`](https://github.com/CesiumLabs/json5)
- [`@cfworker/json-schema`](https://github.com/cfworker/cfworker)
- [`@deno`](https://github.com/denoland/deno_std)
- [`@deno/emit`](https://github.com/denoland/deno_emit)
- [`@jrylan/json-schema-typed`](https://github.com/jrylan/json-schema-typed)
- [`@ThomasAribart/json-schema-to-ts`](https://github.com/ThomasAribart/json-schema-to-ts)

## License

`enzastdlib` is licensed under the [MIT license](./LICENSE).
