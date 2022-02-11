# Migration `3.x.x` to `4.x.x`

## Support `esnext` module

It now supports `esnext` modules. But the default value is still the `umd` module. In order to use the esnext `module`, you must use it as follows.

```javascript
import { Relationship } from 'node-relation/dist/esm/index.js'
```

## Support for mutable status instances

Since an instance is basically an immutable object, it creates a new instance when calling a method. However, there may be parts that require performance. In that case, use `raw`.

```javascript
import { Relationship } from 'node-relation/dist/esm/raw/index.js'
// or
import { Relationship } from 'node-relation/dist/umd/raw'
```

## Methods

Added new methods.

### `where`

### `hasAll`

Some method names have been changed.

### `setReferTo` => `to`

### `setReferBoth` => `both`

### `setReferAll` => `all`

### `getRelation` => `from`

### `dropNode` => `drop`

### `hasNode` => `has`

Some methods have been deleted. Use `without` methods instead.

### `getNodes`

### `getNodeset`

### `getAmbientNodes`

### `getAmbientNodeset`

```javascript
const A = state.getNodes('a')
// to
const A = state.without('a')
```
