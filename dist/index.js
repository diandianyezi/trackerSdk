(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tracker = factory());
})(this, (function () { 'use strict';

  /**
   * @requestUrl 接口地址
   * @historyTracker history上报
   * @hashTracker hash上报
   * @domTracker 携带Tracker-key 点击事件上报
   * @historyTracker sdkVersion sdk版本
   * @historyTracker extra 透传字段
   * @jsError js 和 promise 报错异常上报
   */
  //版本
  var TrackerConfig;
  (function (TrackerConfig) {
      TrackerConfig["version"] = "1.0.0";
  })(TrackerConfig || (TrackerConfig = {}));

  var createHistoryEvent = function (type) {
      var origin = history[type];
      return function () {
          //如果出现 ths隐式具有类型any的报错，有俩解决方式，
          // 1. 在tsconfig.json里的noImplicitThis设置为false。
          // 2. 给this定义一个类型
          var res = origin.apply(this, arguments);
          var e = new Event(type);
          window.dispatchEvent(e); // 通过window.addEventListener 可以监听到这个事件
          return res;
      };
  };

  // export const a = 1;
  var MouseEventList = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup',
      'mouseenter', 'mouseout', 'mouseover'];
  var Tracker = /** @class */ (function () {
      function Tracker(options) {
          this.data = Object.assign(this.initDef(), options);
          this.installTracker();
      }
      Tracker.prototype.initDef = function () {
          window.history['pushState'] = createHistoryEvent('pushState');
          window.history['replaceState'] = createHistoryEvent('replaceState');
          return {
              sdkVersion: TrackerConfig.version,
              historyTracker: false,
              hashTracker: false,
              domTracker: false,
              jsError: false
          };
      };
      Tracker.prototype.sendTracker = function (data) {
          this.reportTracker(data);
      };
      Tracker.prototype.targetKeyReport = function () {
          var _this = this;
          MouseEventList.forEach(function (ev) {
              window.addEventListener(ev, function (e) {
                  var target = e.target;
                  var targetKey = target.getAttribute('target-key');
                  if (targetKey) {
                      _this.reportTracker({
                          event: ev,
                          targetKey: targetKey
                      });
                  }
              });
          });
      };
      Tracker.prototype.captureEvents = function (mouseEventList, targetKey, data) {
          var _this = this;
          mouseEventList.forEach(function (event) {
              window.addEventListener(event, function () {
                  console.info('监听到了');
                  _this.reportTracker({
                      event: event,
                      targetKey: targetKey,
                      data: data
                  });
              });
          });
      };
      Tracker.prototype.setUserId = function (uuid) {
          this.data.uuid = uuid;
      };
      Tracker.prototype.setExtra = function (extra) {
          this.data.extra = extra;
      };
      Tracker.prototype.installTracker = function () {
          if (this.data.historyTracker) {
              this.captureEvents(['pushState', 'replaceState', 'popState'], 'history-pv');
          }
          if (this.data.hashTracker) {
              this.captureEvents(['hashChange'], 'hash-pv');
          }
          if (this.data.domTracker) {
              this.targetKeyReport();
          }
          if (this.data.jsError) {
              this.jsError();
          }
      };
      Tracker.prototype.errorEvent = function () {
          var _this = this;
          window.addEventListener('error', function (event) {
              _this.reportTracker({
                  event: 'error',
                  targetKey: 'message',
                  message: event.message
              });
          });
      };
      Tracker.prototype.promiseReject = function () {
          var _this = this;
          window.addEventListener('unhandledrejection', function (event) {
              event.promise.catch(function (error) {
                  _this.reportTracker({
                      event: 'promise',
                      targetKey: 'message',
                      message: error
                  });
              });
          });
      };
      Tracker.prototype.jsError = function () {
          this.errorEvent();
          this.promiseReject();
      };
      Tracker.prototype.reportTracker = function (data) {
          // 不能传json格式，这里我们直接传blob格式
          var params = Object.assign(this.data, data, {
              time: +new Date()
          });
          var headers = {
              type: 'application/x-www-form-urlencoded'
          };
          var blob = new Blob([JSON.stringify(params)], headers);
          navigator.sendBeacon(this.data.requestUrl, blob);
      };
      return Tracker;
  }());

  return Tracker;

}));
