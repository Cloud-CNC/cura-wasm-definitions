/**
 * @fileoverview Definitions Generator
 */

//Imports
import {execSync} from 'child_process';
import {existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync} from 'fs';
import {join} from 'path';

//If definitions already exist, remove it
if (existsSync('src/definitions')) 
{
  rmSync('src/definitions', {
    recursive: true
  });

  console.log('❌ Removing existing definitions!');
}

//Make definitions directory
mkdirSync('src/definitions');

//Clone
execSync('git clone --depth 1 --filter=blob:none --no-checkout https://github.com/Ultimaker/Cura.git upstream');

//Checkout
execSync('git sparse-checkout init --cone', {
  cwd: 'upstream'
});

execSync('git sparse-checkout add resources/definitions', {
  cwd: 'upstream'
});

execSync('git sparse-checkout add resources/extruders', {
  cwd: 'upstream'
});

execSync('git checkout', {
  cwd: 'upstream'
});

console.log('⬇ Cloned 3D definitions!');

//Get definitions
const rawExtruders = readdirSync('upstream/resources/extruders');
const rawPrinters = readdirSync('upstream/resources/definitions');

//Move/merge definitions
for (const definition of rawExtruders)
{
  //Move to "src/definitions"
  renameSync(join('upstream/resources/extruders', definition), join('src/definitions', definition.toLowerCase()));
}

for (const definition of rawPrinters)
{
  //Move to "src/definitions"
  renameSync(join('upstream/resources/definitions', definition), join('src/definitions', definition));
}

//Remove cloned repository
rmSync('upstream', {
  recursive: true
});

console.log('📂 Moved definitions!');

/**
 * Normalize a name
 * @param name The name to normalize
 */
const normalize = (name: string) => 
{
  //If the name starts with a number, append an underscore
  if (name.length > 0 && /\d/.test(name.charAt(0))) 
  {
    name = `_${name}`;
  }

  //Replace hyphens with underscores
  name = name.replace('-', '_');

  name = name.toLowerCase();

  //Remove file extensions
  const matches = /(.+)\.def\.json/.exec(name);

  if (matches != null) 
  {
    return matches[1];
  }
  else 
  {
    throw new Error(`Unable to normalize ${name}`);
  }
};

//Normalize definitions
const extruders = rawExtruders.map(extruder => ({
  normalized: normalize(extruder),
  raw: extruder.toLowerCase()
}));

const printers = rawPrinters.map(printer => ({
  normalized: normalize(printer),
  raw: printer.toLowerCase()
}));

//Generate import statements
const imports = printers
  .concat(extruders)
  .map(definition => `import * as ${definition.normalized} from './${definition.raw}';`)
  .join('\r\n');

//Generate export statements
const extruderExports = extruders
  .map(extruder => `  ${extruder.normalized},`)
  .join('\r\n');


const printerExports = printers
  .map(printer => `  ${printer.normalized},`)
  .join('\r\n');

//Create the file template
const template = `/* eslint-disable camelcase */
/**
 * @fileoverview Cura Definitions
 * 
 * See https://github.com/Ultimaker/Cura/tree/master/resources/definitions
 * for more information
 * 
 * **THIS FILE IS MIT LICENSED!**
 */

//Imports
${imports}

//Export extruder definitions
export const extruders = {
${extruderExports}
};

//Export printer definitions
export const printers = {
${printerExports}
};
`;

//Write the file
writeFileSync(join(__dirname, 'src/definitions/index.ts'), template);

console.log(`📝 Generated index for ${printers.length} printers and ${extruders.length} extruders!`);