# `@enzastdlib/os`

Utilities for abstracting away operating system specifics.

## Importing

```typescript
import * as mod from 'https://deno.land/x/enzastdlib/os/mod.ts';
```

## Documentation

Visit the documentation at [Deno's module registry](https://deno.land/x/enzastdlib/os/mod.ts?doc).

## Compatibility

The following functions are compatible with Deno only:

- `getUserCache`
- `getUserConfig`
- `getUserData`
- `getUserHome`
- `getUserState`

## Dependencies

This module imports the following external libraries:

- https://github.com/denoland/deno_std/tree/main/path

## Credits

- https://github.com/adrg/xdg — Had concise documentation for polyfilling the XDG Base Directory spec on non-XDG platforms.
