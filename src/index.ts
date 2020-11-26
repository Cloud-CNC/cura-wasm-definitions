/* eslint-disable camelcase */
/**
 * @fileoverview Cura WASM Definitions
 */

//Imports
import {clone, merge} from 'lodash';
import {extruders, printers} from './definitions/index';
import type {Extruder, Printer, ExtruderID, PrinterID, CombinedDefinition} from './types';

//Primary definitions are bundled with "cura-wasm" itself
const primaryExtruders = ['fdmextruder'];
const primaryPrinters = ['fdmextruder', 'fdmprinter'];

/**
 * Recursively resolve an extruder (Squash all depended-on extruders together)
 * @param id The ID of the extruder
 */
export const resolveExtruder = (id: ExtruderID): Extruder =>
{
  //Don't resolve primary extruders (They're bundled with Cura WASM)
  if (primaryExtruders.includes(id))
  {
    return null;
  }
  else
  {
    //Get the extruder
    const extruder = <Extruder>clone(extruders[id]);

    //Resolve parent definitions
    if (extruder != null && extruder.inherits != null)
    {
      //Get parent extruder
      const parent = resolveExtruder(extruder.inherits);

      //Delete secondary inherited extruders (Because we're resolving them)
      if (!primaryExtruders.includes(extruder.inherits))
      {
        delete extruder.inherits;
      }

      //Merge parent and current extruder
      return merge(parent, extruder);
    }
    else
    {
      return extruder;
    }
  }
};

/**
 * Recursively resolve a definition (Squash all depended-on defintions together)
 * @param id The ID of the printer
 */
export const resolvePrinter = (id: PrinterID): Printer => 
{
  //Don't resolve primary definitions (They're are bundled with Cura WASM)
  if (primaryPrinters.includes(id)) 
  {
    return null;
  }
  else 
  {
    //Get the printer
    const printer = <Printer>clone(printers[id]);

    //Resolve parent definitions
    if (printer != null && printer.inherits != null) 
    {
      const parent = resolvePrinter(printer.inherits);

      //Delete secondary inherited definitions (Because we're resolving them)
      if (!primaryPrinters.includes(printer.inherits))
      {
        delete printer.inherits;
      }

      return merge(parent, printer);
    }
    else 
    {
      return printer;
    }
  }
};

/**
 * Resolve an extruder and a printer
 * @param id The ID of the printer
 */
export const resolveDefinition = (id: PrinterID): CombinedDefinition =>
{
  //Get and resolve the printer
  const printer = resolvePrinter(id);

  //Get and resolve the extruders
  let extruders = [];
  if (printer != null && printer.metadata.machine_extruder_trains != null)
  {
    extruders = Object.values(printer.metadata.machine_extruder_trains)
      .map(extruder => resolveExtruder(extruder));

    //Overwrite the extruder
    printer.metadata.machine_extruder_trains = {
      //@ts-ignore This is used by Cura WASM, so be careful when changing
      //eslint-disable-next-line quote-props
      '0': 'extruder'
    };
  }

  return {
    extruders,
    printer
  };
};