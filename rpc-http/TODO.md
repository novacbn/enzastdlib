# TODO

- Add default timeout to prevent memory leak from unresolved requests.

- Separate out `HTTPClientOptions.http.endpoint` into `HTTPClientOptions.http.hostname` and `HTTPClientOptions.http.pathname`.

  - This allows us to default the RPC pathnames.

- Separate out different RPC call types into different pathnames.

  - This allows for network-level middleware to have more smarts about handling the RPC protocol without having to parse the message format.

- Once protocol is finalized look into using HTTP headers for message serialization rather than the main body.

  - This allows for network-level middleware to have more smarts about handling the RPC protocol without having to parse the message format.

  - We probably want to namespace all the custom headers as `X-ENZASTDLIB-RPC-${NAME}`.

  - The main payload (ex. `.result` and `.parameters` fields) SHOULD remain in the main body, so we can handle streams and the like.
