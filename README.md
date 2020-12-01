# Cura WASM Definitions
[![npm](https://img.shields.io/npm/v/cura-wasm-definitions)](https://npmjs.com/package/cura-wasm-definitions)
[![tests](https://img.shields.io/github/workflow/status/Cloud-CNC/cura-wasm-definitions/Tests?label=tests)](https://github.com/Cloud-CNC/cura-wasm-definitions/actions)
[![last commit](https://img.shields.io/github/last-commit/Cloud-CNC/cura-wasm-definitions)](https://github.com/Cloud-CNC/cura-wasm-definitions/commits/master)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCloud-CNC%2Fcura-wasm-definitions.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FCloud-CNC%2Fcura-wasm-definitions?ref=badge_shield)

3D printer definitions for [Cura WASM](https://github.com/cloud-cnc/cura-wasm)

## Install
```console
npm i cura-wasm-definitions
```

## Usage
```Javascript
import {CuraWASM} from 'cura-wasm';
import {resolveDefinition} from 'cura-wasm-definitions';

const main = async () =>
{
  //Create a new slicer
  const slicer = new CuraWASM({
    /*
     * The 3D printer definition to slice for (See the src/definitions directory
     * or https://github.com/Ultimaker/Cura/tree/master/resources/definitions
     * for a list of built-in definitions)
     */
    definition: resolveDefinition('ultimaker2'),
  });

  //Load your STL as an ArrayBuffer
  const res = await fetch('/demo/benchy.stl');
  const stl = await res.arrayBuffer();

  //Progress logger (Ranges from 0 to 100)
  slicer.on('progress', percent =>
  {
    console.log(`Progress: ${percent}%`);
  });

  //Slice (This can take multiple minutes to resolve!)
  const gcode = await slicer.slice(stl, 'stl');

  //Do something with the GCODE (ArrayBuffer)

  //Dispose (Reccomended but not necessary to call/intended for SPAs)
  slicer.dispose();
}
main();
```

## How it works
When you call the [default-exported function](./src/index.ts) (`ResolveDefinition` in the above example), the function examines what printer definitions the requested printer definition depends on (eg: `ultimaker2` depends on `ultimaker` which depends on `fdmprinter` which depends on `fdmextruder`). The function then recurs upon those parent printer definitions. There's also some logic for not resolving `fdmextruder` and `fdmprinter` definitions because these are bundled in Cura WASM itself (Because most printer definitions depend on them). Once it has walked the dependency hierarchy, the function squashes them together using [Lodash's merge function](https://lodash.com/docs#merge). The function also performs a similar process on extruder definitions. Finally, the function combines both the extruder and printer definitions and returns one combined definition.

## What's the license?
Cura WASM Definitions relies on Cura (The upstream for 3D printer definitions) which which uses LGPL3+ hence the LGPL3+ license requirement. With that said, the LGPL3+ license only applies to `tests/index.ts` and all files in the `src/definitions` directory (Excluding `src/definitions/index.ts`). All other files use the MIT license.

## License Obligations

### Upstream Modifications
None - all definitions are used verbatim.

### Source
The source is located at [github.com/ultimaker/cura](https://github.com/ultimaker/cura).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCloud-CNC%2Fcura-wasm-definitions.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FCloud-CNC%2Fcura-wasm-definitions?ref=badge_large)