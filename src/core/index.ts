// export const a = 1;
// console.info("1");
import { DefaultOptions, TrackerConfig, Options } from '../type/index';
import { createHistoryEvent } from '../utils/pv';
export default class Tracker {
  public data: Options;

  constructor(options: Options) {
    this.data = Object.assign(this.initDef(), options);
    this.installTracker()
  }

  private initDef(): DefaultOptions {
    window.history['pushState'] = createHistoryEvent('pushState');
    window.history['replaceState'] = createHistoryEvent('replaceState');

    return <DefaultOptions> {
      sdkVersion: TrackerConfig.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false
    }
  }

  private captureEvents <T>(mouseEventList: string[], targetKey: string, data?: T) {
    mouseEventList.forEach(event => {
      window.addEventListener(event, () => {
        console.info('监听到了')
      })
    })
  }

  public setUserId <T extends DefaultOptions['uuid']>(uuid: T) {
    this.data.uuid = uuid
  }

  public setExtra <T extends DefaultOptions['extra']>(extra: T) {
    this.data.extra = extra
  }

  private installTracker() {
    if(this.data.historyTracker) {
      this.captureEvents(['pushState', 'replaceState', 'popState'], 'history-pv');
    }
    if(this.data.hashTracker) {
      this.captureEvents(['hashChange'], 'hash-pv');
    }
  }
}