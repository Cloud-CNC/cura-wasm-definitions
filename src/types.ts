/**
 * @fileoverview Typescript Types
 */

//Imports
import definitions from './definitions/index';

/**
 * Definitions IDs
 */
export type DefinitionID = keyof typeof definitions;

/**
 * 3D Printer Definition
 */
export interface Definition
{
  name: string;
  metadata: any;
  inherits?: DefinitionID;
}