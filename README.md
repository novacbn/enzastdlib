# `enzastdlib`

`enzastdlib` is a set of TypeScript modules that follow a common design API philosophy aiming at sane defaults and ease-of-use targeting the [Deno TypeScript runtime](https://deno.land).

## Modules

The following modules are considered public API ready for consumption:

- [`@enzastdlib/async`](./async) — Utilities for working with asynchronous and `Promise`-based code.
- [`@enzastdlib/collections`](./collections) — Utilities for working with collections like arrays and records.
- [`@enzastdlib/commands`](./commands) — Create command line tools with validation powered by [JSON Schema 2019-09](https://json-schema.org/specification-links.html#draft-2019-09-formerly-known-as-draft-8).
- [`@enzastdlib/decorators`](./decorators) — Create function decorators that access metadata with a streamlined API.
- [`@enzastdlib/environment`](./environment) — Parse and validate both environment variables and dotenv files powered by [JSON Schema 2019-09](https://json-schema.org/specification-links.html#draft-2019-09-formerly-known-as-draft-8).
- [`@enzastdlib/errors`](./errors) — General error objects that are used across `enzastdlib`.
- [`@enzastdlib/path`](./events) — Create typed events with a typed version of `EventTarget`.
- [`@enzastdlib/json5`](./json5) — Parse JSON5 documents and expressions.
- [`@enzastdlib/os`](./os) — Utilities for abstracting away operating system specifics.
- [`@enzastdlib/path`](./path) — Utilities for working with file system paths and URLs.
- [`@enzastdlib/realm`](./realm) — Create custom JavaScript and TypeScript execution environments.
- [`@enzastdlib/rpc`](./rpc) — Contains supplemental typing for creating fully typed and validated RPC clients and servers.
- [`@enzastdlib/rpc-http`](./rpc-http) — Create fully typed and validated RPC clients and servers using HTTP as the transport.
- [`@enzastdlib/rpc-messageport`](./rpc-messageport) — Create fully typed and validated RPC clients and servers using [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)-like API instances as the transport.
- [`@enzastdlib/rpc-protocol`](./rpc-protocol) — Create fully typed and validated RPC clients and servers powered by [JSON Schema 2019-09](https://json-schema.org/specification-links.html#draft-2019-09-formerly-known-as-draft-8).
- [`@enzastdlib/rpc-streams`](./rpc-streams) — Create fully typed and validated RPC clients and servers using a pair of [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) / [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) instances as the transport.
- [`@enzastdlib/schema`](./schema) — Create easy to use validators powered by [JSON Schema 2019-09](https://json-schema.org/specification-links.html#draft-2019-09-formerly-known-as-draft-8).
- [`@enzastdlib/strings`](./strings) — Utilities for working with strings.
- [`@enzastdlib/testing`](./testing) — Utilities for working with Deno's testing API.

## Importing

...

## Documentation

...

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
