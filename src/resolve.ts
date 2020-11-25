/**
 * @fileoverview Recursive 3D Printer Definition Resolver
 */

//Imports
import {clone, merge} from 'lodash';
import definitions from './definitions/index';
import type {Definition, DefinitionID} from './types';

//Primary definitions are bundled with "cura-wasm" itself
const primaryIDs = ['fdmextruder', 'fdmprinter'];

/**
 * Recursive 3D Printer Definition Resolver
 * @param id The ID of the definition
 */
const resolve = (id: DefinitionID): Definition => 
{
  //Don't resolve primary definitions (Which are bundled with Cura WASM)
  if (primaryIDs.includes(id)) 
  {
    return {} as Definition;
  }
  else 
  {
    //@ts-ignore Get the definition
    const definition: Definition = clone(definitions[id]);

    //Resolve parent definitions
    if (definition != null && definition.inherits != null) 
    {
      const parent = resolve(definition.inherits);

      //Delete secondary inherited definitions (Because we're resolving them)
      if (!primaryIDs.includes(definition.inherits))
      {
        delete definition.inherits;
      }

      return merge(parent, definition);
    }
    else 
    {
      return definition;
    }
  }
};

//Export
export default resolve;