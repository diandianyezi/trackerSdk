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
    Tracker.prototype.captureEvents = function (mouseEventList, targetKey, data) {
        mouseEventList.forEach(function (event) {
            window.addEventListener(event, function () {
                console.info('监听到了');
            });
        });
    };
    Tracker.prototype.installTracker = function () {
        if (this.data.historyTracker) {
            this.captureEvents(['pushState', 'replaceState', 'popState'], 'history-pv');
        }
    };
    return Tracker;
}());

export { Tracker as default };
