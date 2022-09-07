
/* ——————— Copyright (c) 2021-2022 toastythetoaster. All rights reserved. ———————
 *
 * DiscordExperiments Plugin
 *
 * —————————————————————————————————————————————————————————————————————————————— */

import { UPlugin } from '@classes';
import { getByProps } from '@webpack';
import { patches } from '@patcher';

const strings = {
  success: 'Patched successfully! Enjoy!',
  error: 'This plugin requires the Discord Experiments Patcher theme to work! Install the theme, enable it, and reload Discord.',
  prefix: '[DiscordExperiments]',
}

class DiscordExperiments extends UPlugin {
  constructor() {
    super();
    if (!!patches.find(p => p.before[0]?.caller === 'DiscordExperimentsPatcher')) 
      console.warn(`${strings.prefix} ${strings.success}`);
    else throw new Error(`${strings.prefix} ${strings.error}`);
  }

  start(): void {
    this._setDeveloper(true);
  }
  
  stop(): void {
    this._setDeveloper(false);
  }

  _setDeveloper(a: boolean): void {
    Object.defineProperty(getByProps('isDeveloper'), 'isDeveloper', { get: () => (a ? 1 : 0), set: a => a, configurable: !0 });
  }
}

module.exports = DiscordExperiments;
