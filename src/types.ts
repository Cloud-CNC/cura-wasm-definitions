/**
 * @fileoverview Typescript Types
 */

//Imports
import {extruders, printers} from './definitions/index';

/**
 * Extruder IDs
 */
export type ExtruderID = keyof typeof extruders | 'fdmextruder';

/**
 * Printer IDs
 */
export type PrinterID = keyof typeof printers;

/**
 * Extruder Definition
 */
export interface Extruder
{
  name: string;
  inherits?: ExtruderID;
  metadata: any;
}

/**
 * 3D Printer Definition
 */
export interface Printer
{
  name: string;
  inherits?: PrinterID;
  metadata: {
    'machine_extruder_trains'?: {
      [key: string]: ExtruderID
    }
  };
}

/**
 * Combined Extruder + 3D Printer Definition
 */
export interface CombinedDefinition
{
  extruders: Extruder[];
  printer: Printer
}