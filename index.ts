
/* ——————— Copyright (c) 2021-2022 toastythetoaster. All rights reserved. ———————
 *
 * DiscordExperiments Plugin
 *
 * —————————————————————————————————————————————————————————————————————————————— */

import { UPlugin } from '@classes';
import { UserStore, getByProps, APIModule, getByDisplayName, getModule } from '@webpack';
import { instead, after, patches, unpatchAll } from '@patcher';

const strings = {
  success: 'Patched successfully! Enjoy!',
  error: 'This plugin requires the Discord Experiments Patcher theme to work! Install the theme, enable it, and reload Discord.',
  prefix: '[DiscordExperiments]',
}

const currentUserId = UserStore.getCurrentUser().id;

class DiscordExperiments extends UPlugin {
  constructor() {
    super();
    if (!!patches.find(p => p.before[0]?.caller === 'DiscordExperimentsPatcher')) 
      console.warn(`${strings.prefix} ${strings.success}`);
    else throw new Error(`${strings.prefix} ${strings.error}`);
  }

  start(): void {
    this._setDeveloper(true);
    this._patch();
  }
  
  stop(): void {
    this._setDeveloper(false);
    unpatchAll('DiscordExperiments');
  }

  _setDeveloper(a: boolean): void {
    Object.defineProperty(getByProps('isDeveloper'), 'isDeveloper', { get: () => (a ? 1 : 0), set: a => a, configurable: !0 });
  }

  _patch(): void {
    instead('DiscordExperiments', APIModule, 'get', (_, args, original) => {
      const [options] = args;
      const { url, query } = options;
      if (url?.includes('/entitlements') && query?.with_sku) {
        return new Promise((resolve, reject) => {
          reject({code: 50035, errors: {}, message: 'Invalid Form Body'});
        });
      }
      return original(args[0]);
    });
    getModule(m => m?.default?.displayName === 'UserProfileBadgeList', {ret: 'exports', all: true}).forEach(m => {
      after('DiscordExperiments', m, 'default', (_, args, ret) => {
        const { user } = args.find(a => a?.user);
        if (user.id === currentUserId) {
          const staffBadgePos = ret.props.children.findIndex(c => c?.key === '0');
          if (staffBadgePos !== -1) ret.props.children.splice(staffBadgePos, 1);
        }
      })
    });
  }
}

module.exports = DiscordExperiments;
