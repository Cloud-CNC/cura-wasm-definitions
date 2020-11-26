/* eslint-disable camelcase */
/**
 * @fileoverview Cura WASM Tests
 */

//Imports
import {expect} from 'chai';
import {resolveDefinition} from '../src/index';

describe('resolve definitions', () =>
{
  it('will resolve primary definitions', () =>
  {
    const definition1 = resolveDefinition('fdmextruder');
    const definition2 = resolveDefinition('fdmprinter');

    expect(definition1).to.eql({
      extruders: [],
      printer: null
    });

    expect(definition2).to.eql({
      extruders: [],
      printer: null
    });
  });

  it('will resolve single-dependency definitions', () =>
  {
    const definition = resolveDefinition('ultimaker');

    expect(definition).to.eql({
      extruders: [],
      printer: {
        version: 2,
        name: 'Ultimaker',
        inherits: 'fdmprinter',
        metadata: {
          author: 'Ultimaker',
          manufacturer: 'Ultimaker B.V.',
          visible: false,
          exclude_materials: ['generic_hips', 'generic_petg', 'structur3d_dap100silicone']
        },
        overrides: {
          machine_max_feedrate_e: {
            default_value: 45
          },
          material_print_temperature: {
            minimum_value: '0'
          },
          material_bed_temperature: {
            minimum_value: '0',
            maximum_value_warning: '125'
          },
          material_bed_temperature_layer_0: {
            maximum_value_warning: '125'
          },
          material_standby_temperature: {
            minimum_value: '0'
          },
          extruder_prime_pos_y: {
            minimum_value: '0',
            maximum_value: 'machine_depth'
          },
          extruder_prime_pos_x: {
            minimum_value: '0',
            maximum_value: 'machine_width'
          },
          relative_extrusion: {
            value: false,
            enabled: false
          }
        }
      }
    });
  });

  it('will resolve multi-dependency definitions', () =>
  {
    const definition = resolveDefinition('ultimaker2');

    expect(definition).to.eql({
      extruders: [{
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
      }],
      printer: {
        version: 2,
        name: 'Ultimaker 2',
        inherits: 'fdmprinter',
        metadata: {
          author: 'Ultimaker',
          manufacturer: 'Ultimaker B.V.',
          visible: true,
          exclude_materials: ['generic_hips', 'generic_petg', 'structur3d_dap100silicone'],
          weight: 3,
          file_formats: 'text/x-gcode',
          platform: 'ultimaker2_platform.obj',
          platform_texture: 'Ultimaker2backplate.png',
          platform_offset: [9, 0, 0],
          has_materials: false,
          has_machine_quality: true,
          preferred_variant_name: '0.4 mm',
          machine_extruder_trains: {
            0: 'ultimaker2_extruder_0'
          },
          firmware_file: 'MarlinUltimaker2.hex'
        },
        overrides: {
          machine_max_feedrate_e: {
            default_value: 45
          },
          material_print_temperature: {
            minimum_value: '0'
          },
          material_bed_temperature: {
            minimum_value: '0',
            maximum_value_warning: '125'
          },
          material_bed_temperature_layer_0: {
            maximum_value_warning: '125'
          },
          material_standby_temperature: {
            minimum_value: '0'
          },
          extruder_prime_pos_y: {
            minimum_value: '0',
            maximum_value: 'machine_depth'
          },
          extruder_prime_pos_x: {
            minimum_value: '0',
            maximum_value: 'machine_width'
          },
          relative_extrusion: {
            value: false,
            enabled: false
          },
          machine_name: {
            default_value: 'Ultimaker 2'
          },
          machine_start_gcode: {
            value: '"G0 F3000 Y50 ;avoid prime blob"  if machine_gcode_flavor == "UltiGCode" else "G21 ;metric values\\nG90 ;absolute positioning\\nM82 ;set extruder to absolute mode\\nM107 ;start with the fan off\\nG28 Z0 ;move Z to bottom endstops\\nG28 X0 Y0 ;move X/Y to endstops\\nG1 X15 Y0 F4000 ;move X/Y to front of printer\\nG1 Z15.0 F9000 ;move the platform to 15mm\\nG92 E0 ;zero the extruded length\\nG1 F200 E10 ;extrude 10 mm of feed stock\\nG92 E0 ;zero the extruded length again\\nG1 Y50 F9000\\n;Put printing message on LCD screen\\nM117 Printing..."'
          },
          machine_end_gcode: {
            value: '";Version _2.6 of the firmware can abort the print too early if the file ends\\n;too soon. However if the file hasn\'t ended yet because there are comments at\\n;the end of the file, it won\'t abort yet. Therefore we have to put at least 512\\n;bytes at the end of the g-code so that the file is not yet finished by the\\n;time that the motion planner gets flushed. With firmware version _3.3 this\\n;should be fixed, so this comment wouldn\'t be necessary any more. Now we have\\n;to pad this text to make precisely 512 bytes."  if machine_gcode_flavor == "UltiGCode" else "M104 S0 ;extruder heater off\\nM140 S0 ;heated bed heater off (if you have it)\\nG91 ;relative positioning\\nG1 E-1 F300  ;retract the filament a bit before lifting the nozzle, to release some of the pressure\\nG1 Z+0.5 E-5 X-20 Y-20 F9000 ;move Z up a bit and retract filament even more\\nG28 X0 Y0 ;move X/Y to min endstops, so the head is out of the way\\nM84 ;steppers off\\nG90 ;absolute positioning\\n;Version _2.6 of the firmware can abort the print too early if the file ends\\n;too soon. However if the file hasn\'t ended yet because there are comments at\\n;the end of the file, it won\'t abort yet. Therefore we have to put at least 512\\n;bytes at the end of the g-code so that the file is not yet finished by the\\n;time that the motion planner gets flushed. With firmware version _3.3 this\\n;should be fixed, so this comment wouldn\'t be necessary any more. Now we have\\n;to pad this text to make precisely 512 bytes."'
          },
          machine_width: {
            default_value: 223
          },
          machine_depth: {
            default_value: 223
          },
          machine_height: {
            default_value: 205
          },
          machine_heated_bed: {
            default_value: true
          },
          machine_head_with_fans_polygon: {
            default_value: [
              [-42, 12],
              [-42, -32],
              [62, 12],
              [62, -32]
            ]
          },
          machine_center_is_zero: {
            default_value: false
          },
          gantry_height: {
            value: '48'
          },
          machine_use_extruder_offset_to_offset_coords: {
            default_value: true
          },
          machine_gcode_flavor: {
            default_value: 'UltiGCode'
          },
          machine_disallowed_areas: {
            default_value: [
              [
                [-115, 112.5],
                [-82, 112.5],
                [-84, 102.5],
                [-115, 102.5]
              ],
              [
                [115, 112.5],
                [115, 102.5],
                [110, 102.5],
                [108, 112.5]
              ],
              [
                [-115, -112.5],
                [-115, -104.5],
                [-84, -104.5],
                [-82, -112.5]
              ],
              [
                [115, -112.5],
                [108, -112.5],
                [110, -104.5],
                [115, -104.5]
              ]
            ]
          },
          machine_nozzle_tip_outer_diameter: {
            default_value: 1
          },
          machine_nozzle_head_distance: {
            default_value: 3
          },
          machine_max_feedrate_x: {
            default_value: 300
          },
          machine_max_feedrate_y: {
            default_value: 300
          },
          machine_max_feedrate_z: {
            default_value: 40
          },
          machine_acceleration: {
            default_value: 3000
          }
        }
      }
    });
  });
});