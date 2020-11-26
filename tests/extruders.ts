/* eslint-disable camelcase */
/**
 * @fileoverview Cura WASM Extruder Resolver Tests
 */

//Imports
import {expect} from 'chai';
import {resolveExtruder} from '../src/index';

describe('resolve extruders', () =>
{
  it('will not resolve primary extruders', () =>
  {
    const extruder = resolveExtruder('fdmextruder');

    expect(extruder).to.null;
  });

  it('will resolve single-dependency extruders', () =>
  {
    const extruder = resolveExtruder('ultimaker2_extruder_0');

    expect(extruder).to.eql({
      version: 2,
      name: 'Extruder 1',
      inherits: 'fdmextruder',
      metadata: {
        machine: 'ultimaker2',
        position: '0'
      },
      overrides: {
        extruder_nr: {
          default_value: 0
        },
        machine_nozzle_size: {
          default_value: 0.4
        },
        material_diameter: {
          default_value: 2.85
        }
      }
    });
  });
});