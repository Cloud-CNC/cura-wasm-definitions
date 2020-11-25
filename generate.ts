/**
 * @fileoverview Definitions Generator
 */

//Imports
import {existsSync, readdirSync, renameSync, rmSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';
import {join} from 'path';
import {zip} from 'lodash';

//If definitions already exist, remove it
if (existsSync('src/definitions'))
{
  rmSync('src/definitions', {
    recursive: true
  });

  console.log('❌ Removing existing definitions!');
}

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

console.log('⬇ Cloned 3D printer definitions!');

//Copy files
renameSync('upstream/resources/definitions', 'src/definitions');
renameSync('upstream/resources/extruders', 'src/extruders');

//Remove cloned repository
rmSync('upstream', {
  recursive: true
});

console.log('📂 Moved definitions!');

//Get list of definitions
const rawDefinitions = readdirSync('src/definitions');
const normalizedDefinitions = rawDefinitions.map(definition =>
{
  //If the name starts with a number, append an underscore
  if (definition.length > 0 && /\d/.test(definition.charAt(0)))
  {
    definition = '_' + definition;
  }

  //Replace hyphens with underscores
  definition = definition.replace('-', '_');

  //Strip out file extension
  const matches = /(.+)\.def\.json/.exec(definition);

  if (matches != null)
  {
    return matches[1];
  }
  else
  {
    throw new Error(`Unable to parse file: ${definition}`);
  }
});

//Combine filtered and normalized definitions
const definitions = zip(rawDefinitions, normalizedDefinitions);

//Generate imports
const definitionImports = definitions.map(definition => `import * as ${definition[1]} from './${definition[0]}';`).join('\r\n');

//Generate exports
const definitionExports = definitions.map(definition => `  ${definition[1]},`).join('\r\n');

//Create the file template
const template = `/* eslint-disable camelcase */
/**
 * @fileoverview 3D printer definitions
 * 
 * **Note: If a print definition starts with a number, it will now start with an underscore. Hyphens have also been replaced by underscores.**
 * 
 * The use of static ES6 module syntax allows for tree-shaking.
 * 
 * See https://github.com/Ultimaker/Cura/tree/master/resources/definitions
 * for more information
 */

//Imports
${definitionImports}

//Export
export default {
${definitionExports}
};
`;

//Write the file
writeFileSync(join(__dirname, 'src/definitions/index.ts'), template);

console.log(`📝 Generated index for ${rawDefinitions.length} definitions!`);