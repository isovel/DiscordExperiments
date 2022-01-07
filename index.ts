
/* ————————————————— Copyright (c) 2021-2022 toastythetoaster ——————————————————
 *
 * DiscordExperiments Plugin
 *
 * ————————————————————————————————————————————————————————————————————————————— */

import { UPlugin } from '@classes';
import { getByProps } from '@webpack';

class DiscordExperiments extends UPlugin {
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
