/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/components/component.ts":
/*!******************************************!*\
  !*** ./src/core/components/component.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var internal_1 = __webpack_require__(/*! ./internal */ "./src/core/components/internal.ts");
var lifecycle_1 = __webpack_require__(/*! ./../modules/lifecycle */ "./src/core/modules/lifecycle.ts");
var dom_1 = __webpack_require__(/*! ./../modules/dom */ "./src/core/modules/dom.ts");
var dom_2 = __webpack_require__(/*! ./../util/dom */ "./src/core/util/dom.ts");
var util_1 = __webpack_require__(/*! ./../util/util */ "./src/core/util/util.ts");
function on(ref, eventName) {
    return function (ctor, methodName) {
        if (!ctor.constructor.events) {
            ctor.constructor.events = [];
        }
        ctor.constructor.events.push({ ref: ref, eventName: eventName, methodName: methodName });
    };
}
exports.on = on;
var Component = /** @class */ (function () {
    function Component(props, parent) {
        this.parent = parent ? parent : null;
        this.props = props || {};
        this.$internal = new internal_1.Internal(this);
        this.$internal.init();
    }
    // >>> работа с компонентом
    // добавляет компонент внутрь элемента
    Component.prototype.appendChild = function (node) {
        var _this = this;
        lifecycle_1.lifecycle.start(function () {
            _this.$internal.onRender();
            dom_2.appendChild(node, _this.$internal.node);
        });
    };
    // добавляет компонент после элемента
    Component.prototype.insertAfter = function (node) {
        var _this = this;
        lifecycle_1.lifecycle.start(function () {
            _this.$internal.onRender();
            dom_2.insertAfter(node, _this.$internal.node);
        });
    };
    // добавляет компонент перед элементом
    Component.prototype.insertBefore = function (node) {
        var _this = this;
        lifecycle_1.lifecycle.start(function () {
            _this.$internal.onRender();
            dom_2.insertBefore(node, _this.$internal.node);
        });
    };
    // удаляет компонент
    Component.prototype.remove = function () {
        var _this = this;
        lifecycle_1.lifecycle.start(function (depth) {
            if (depth === 1) {
                var node = _this.$internal.node;
                _this.$internal.onDestroy();
                dom_2.removeChild(node);
                node = null;
            }
            else {
                _this.$internal.onDestroy();
            }
        });
    };
    // проверяет, был ли компонент прорендерен
    Component.prototype.isRendered = function () {
        return !!this.$internal.node;
    };
    // >>> работа с событиями
    // добавляет событие
    Component.prototype.on = function (eventName, fn) {
        this.$internal.emitter.on(eventName, fn);
    };
    // удаляет событие
    Component.prototype.off = function (eventName, fn) {
        this.$internal.emitter.off(eventName, fn);
    };
    // вызывает событие
    Component.prototype.emit = function (eventName, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
        var args = [arguments[0], this];
        var ln = arguments.length;
        for (var i = 1; i < ln; ++i) {
            args.push(arguments[i]);
        }
        return util_1.methodCall(this.$internal.emitter, "emit", args);
    };
    // >>> работа с виртуальным DOM
    // устанавливает свойства на DOM элемент
    Component.prototype.prop = function (ref, value, reset) {
        this.setAttr(ref, "prop", value, reset);
    };
    // устанавливает атрибуты на DOM элемент
    Component.prototype.attr = function (ref, value, reset) {
        this.setAttr(ref, "attr", value, reset);
    };
    // устанавливает классы на DOM элемент
    Component.prototype.cl = function (ref, value, reset) {
        this.setAttr(ref, "cl", value, reset);
    };
    // устанавливает стили на DOM элемент
    Component.prototype.css = function (ref, value, reset) {
        this.setAttr(ref, "css", value, reset);
    };
    // получает реальный DOM по его имени
    Component.prototype.ref = function (name) {
        if (this.$internal.refs.hasOwnProperty(name)) {
            return this.$internal.refs[name].node;
        }
        return null;
    };
    Component.prototype.setAttr = function (ref, key, value, reset) {
        var refs = this.$internal.refs;
        if (!refs.hasOwnProperty(ref)) {
            refs[ref] = { node: null, dom: { prop: {}, attr: {}, cl: {}, css: {} } };
        }
        var r = refs[ref];
        if (r.node) {
            dom_1.dom[key](r.node, r.dom[key], value, reset);
        }
        else {
            if (reset) {
                r.dom[key] = value; // need save reset
            }
            else {
                util_1.merge(r.dom[key], value);
            }
        }
    };
    return Component;
}());
exports.Component = Component;


/***/ }),

/***/ "./src/core/components/internal.ts":
/*!*****************************************!*\
  !*** ./src/core/components/internal.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var lifecycle_1 = __webpack_require__(/*! ./../modules/lifecycle */ "./src/core/modules/lifecycle.ts");
var dom_1 = __webpack_require__(/*! ./../modules/dom */ "./src/core/modules/dom.ts");
var emitter_event_1 = __webpack_require__(/*! ./../modules/event/emitter.event */ "./src/core/modules/event/emitter.event.ts");
var store_event_1 = __webpack_require__(/*! ./../modules/event/store.event */ "./src/core/modules/event/store.event.ts");
var util_1 = __webpack_require__(/*! ./../util/util */ "./src/core/util/util.ts");
var Internal = /** @class */ (function () {
    function Internal(component) {
        ++Internal.autoId;
        this.id = Internal.autoId;
        this.owner = component;
        this.node = null;
        this.refs = {};
    }
    Internal.prototype.init = function () {
        var ctor = this.owner.constructor;
        var template = ctor.template;
        this.emitter = new emitter_event_1.EmitterEvent();
        this.storeEvent = new store_event_1.StoreEvent();
        lifecycle_1.lifecycle.run(this, lifecycle_1.lifecycle.METHODS.BEFORE_INIT);
        var refRoot = template.root.ref;
        if (template.root.attr) {
            this.owner.attr(refRoot, template.root.attr);
        }
        if (template.root.cl) {
            this.owner.cl(refRoot, template.root.cl);
        }
        if (template.root.css) {
            this.owner.css(refRoot, template.root.css);
        }
        lifecycle_1.lifecycle.run(this, lifecycle_1.lifecycle.METHODS.AFTER_INIT);
    };
    // internal
    Internal.prototype.safeMethodCall = function (methodName, args) {
        if (args === void 0) { args = []; }
        if (this.owner[methodName]) {
            try {
                util_1.methodCall(this.owner, methodName, args);
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    Internal.prototype.onRender = function () {
        var ctor = this.owner.constructor;
        var template = ctor.template;
        var tagName = template.root.tagName;
        var el = document.createElement(tagName);
        el.innerHTML = template.html;
        this.node = el;
        this.initRefs(template);
        this.initEvents(ctor.events);
        lifecycle_1.lifecycle.run(this, lifecycle_1.lifecycle.METHODS.BEFORE_MOUNT);
        lifecycle_1.lifecycle.add(this, lifecycle_1.lifecycle.METHODS.AFTER_MOUNT);
    };
    Internal.prototype.onDestroy = function () {
        lifecycle_1.lifecycle.run(this, lifecycle_1.lifecycle.METHODS.BEFORE_UNMOUNT);
        this.refs = {};
        this.node = null;
        this.storeEvent.clean();
        lifecycle_1.lifecycle.add(this, lifecycle_1.lifecycle.METHODS.AFTER_UNMOUNT);
    };
    Internal.prototype.initRefs = function (template) {
        var _this = this;
        var el = this.node;
        var refs = el.querySelectorAll("[ref]");
        this.initRef(template.root.ref, el);
        Array.prototype.forEach.call(refs, function (node) {
            var ref = node.getAttribute("ref");
            node.removeAttribute("ref");
            _this.initRef(ref, node);
        });
    };
    Internal.prototype.initRef = function (name, node) {
        var currRef = { node: node, dom: dom_1.dom.init(node) };
        var nextRef = this.refs[name];
        if (nextRef) {
            dom_1.dom.attr(node, currRef.dom.attr, nextRef.dom.attr, false);
            dom_1.dom.cl(node, currRef.dom.cl, nextRef.dom.cl, false);
            dom_1.dom.css(node, currRef.dom.css, nextRef.dom.css, false);
        }
        this.storeEvent.add(name, currRef.node);
        this.refs[name] = currRef;
    };
    Internal.prototype.initEvents = function (events) {
        var _this = this;
        if (events) {
            events.forEach(function (eventInfo) {
                var event = _this.createEvent(eventInfo.methodName, eventInfo.ref);
                _this.storeEvent.on(eventInfo.ref, eventInfo.eventName, event);
            });
        }
    };
    Internal.prototype.createEvent = function (methodName, ref) {
        var _this = this;
        return function (event) {
            _this.safeMethodCall(methodName, [event, _this.owner.ref(ref)]);
        };
    };
    Internal.autoId = 100000;
    return Internal;
}());
exports.Internal = Internal;


/***/ }),

/***/ "./src/core/index.ts":
/*!***************************!*\
  !*** ./src/core/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = __webpack_require__(/*! ./components/component */ "./src/core/components/component.ts");
exports.Component = component_1.Component;
exports.on = component_1.on;
var template_1 = __webpack_require__(/*! ./modules/template */ "./src/core/modules/template.ts");
exports.template = template_1.template;
var dom_1 = __webpack_require__(/*! ./modules/dom */ "./src/core/modules/dom.ts");
exports.dom = dom_1.dom;
var emitter_event_1 = __webpack_require__(/*! ./modules/event/emitter.event */ "./src/core/modules/event/emitter.event.ts");
exports.EmitterEvent = emitter_event_1.EmitterEvent;
var store_event_1 = __webpack_require__(/*! ./modules/event/store.event */ "./src/core/modules/event/store.event.ts");
exports.StoreEvent = store_event_1.StoreEvent;
var util_1 = __webpack_require__(/*! ./util/util */ "./src/core/util/util.ts");
exports.methodCall = util_1.methodCall;
exports.merge = util_1.merge;
var event_1 = __webpack_require__(/*! ./util/event */ "./src/core/util/event.ts");
exports.event = event_1.event;


/***/ }),

/***/ "./src/core/modules/dom.ts":
/*!*********************************!*\
  !*** ./src/core/modules/dom.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ./../util/util */ "./src/core/util/util.ts");
// класс для работы с виртуальным DOM
var Dom = /** @class */ (function () {
    function Dom() {
    }
    // создает виртуальный DOM для Node
    Dom.prototype.init = function (node) {
        var attr = {};
        var cl = {};
        var css = {};
        var attribute;
        var prop;
        var value;
        var ln = node.attributes.length;
        for (var i = 0; i < ln; ++i) {
            attribute = node.attributes[i];
            prop = attribute.name;
            value = attribute.nodeValue;
            if (prop === "class") {
                this.processingClasses(cl, value.split(" "));
            }
            else {
                if (prop === "style") {
                    this.processingStyles(css, value.split(";"));
                }
                else {
                    attr[prop] = value;
                }
            }
        }
        return { prop: attr, attr: attr, cl: cl, css: css };
    };
    // обновляет разметку в соответствии с виртуальным DOM
    Dom.prototype.update = function (node, currDom, nextDom) {
        if (currDom === void 0) { currDom = {}; }
        this.attr(node, currDom.attr || {}, nextDom.attr || {}, true);
        this.cl(node, currDom.cl || {}, nextDom.cl || {}, true);
        this.css(node, currDom.css || {}, nextDom.css || {}, true);
        if (nextDom.children) {
            if (!currDom.children) {
                currDom.children = [];
            }
            this.updateChildren(node, currDom, nextDom);
        }
        else {
            if (currDom.text !== nextDom.text) {
                node.innerHTML = nextDom.text;
            }
        }
    };
    Dom.prototype.updateChildren = function (node, currDom, nextDom) {
        var _this = this;
        var nodeHash = {};
        var currDomHash = {};
        var nextDomHash = {};
        currDom.children.forEach(function (d, index) {
            nodeHash[d.id] = node.children[index];
            currDomHash[d.id] = d;
        });
        nextDom.children.forEach(function (d, index) {
            nextDomHash[d.id] = d;
        });
        currDom.children.forEach(function (d) {
            if (!nextDomHash.hasOwnProperty(d.id)) {
                var child = nodeHash[d.id];
                node.removeChild(child);
            }
        });
        nextDom.children.forEach(function (d, index) {
            var child;
            if (nodeHash.hasOwnProperty(d.id)) {
                child = nodeHash[d.id];
            }
            else {
                child = document.createElement(d.name);
            }
            _this.update(child, currDomHash[d.id], d);
            if (index < node.children.length) {
                var target = node.children[index];
                if (child !== target) {
                    node.insertBefore(child, target);
                }
            }
            else {
                node.appendChild(child);
            }
        });
    };
    // изменение свойств
    Dom.prototype.attr = function (element, original, changes, reset) {
        var value;
        var key;
        if (reset) {
            for (key in original) {
                if (!changes.hasOwnProperty(key)) {
                    element.removeAttribute(key);
                }
            }
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    value = changes[key];
                    if (original[key] !== value) {
                        element.setAttribute(key, value);
                    }
                }
            }
        }
        else {
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    value = changes[key];
                    if (original[key] !== value) {
                        original[key] = value;
                        element.setAttribute(key, value);
                    }
                }
            }
        }
    };
    Dom.prototype.prop = function (element, original, changes, reset) {
        var value;
        var key;
        if (reset) {
            for (key in original) {
                if (!changes.hasOwnProperty(key)) {
                    element[key] = null;
                }
            }
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    element[key] = changes[key];
                }
            }
        }
        else {
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    value = changes[key];
                    if (original[key] !== value) {
                        original[key] = value;
                        element[key] = value;
                    }
                }
            }
        }
    };
    Dom.prototype.cl = function (element, original, changes, reset) {
        var value = "";
        var klass;
        if (reset) {
            original = changes;
        }
        else {
            for (klass in changes) {
                if (changes.hasOwnProperty(klass)) {
                    if (original[klass] !== changes[klass]) {
                        original[klass] = changes[klass];
                    }
                }
            }
        }
        for (klass in original) {
            if (original[klass] === true) {
                if (value.length === 0) {
                    value = klass;
                }
                else {
                    value += " " + klass;
                }
            }
        }
        if (value.length === 0) {
            element.removeAttribute("class");
        }
        else {
            element.setAttribute("class", value);
        }
    };
    Dom.prototype.css = function (element, original, changes, reset) {
        var value;
        var key;
        if (reset) {
            for (key in original) {
                if (!changes.hasOwnProperty(key)) {
                    element.style[key] = null;
                }
            }
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    element.style[key] = changes[key];
                }
            }
        }
        else {
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    value = changes[key];
                    if (original[key] !== value) {
                        original[key] = value;
                        element.style[key] = value;
                    }
                }
            }
        }
    };
    Dom.prototype.processingClasses = function (target, classes) {
        var cl;
        var i;
        var ln = classes.length;
        for (i = 0; i < ln; ++i) {
            cl = classes[i].trim();
            if (cl.length > 0) {
                target[cl] = true;
            }
        }
    };
    Dom.prototype.processingStyles = function (target, styles) {
        var style;
        var value;
        var i;
        var ln = styles.length;
        for (i = 0; i < ln; ++i) {
            style = styles[i].split(":");
            if (style.length === 2) {
                value = style[1].trim();
                style = style[0].trim();
                if (style.length && value.length) {
                    target[util_1.camelize(style)] = value;
                }
            }
        }
    };
    return Dom;
}());
exports.dom = new Dom();


/***/ }),

/***/ "./src/core/modules/event/emitter.event.ts":
/*!*************************************************!*\
  !*** ./src/core/modules/event/emitter.event.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helper_event_1 = __webpack_require__(/*! ./helper.event */ "./src/core/modules/event/helper.event.ts");
var util_1 = __webpack_require__(/*! ./../../util/util */ "./src/core/util/util.ts");
var EmitterEvent = /** @class */ (function () {
    function EmitterEvent() {
        this.events = {};
    }
    EmitterEvent.prototype.on = function (eventName, fn) {
        return helper_event_1.HelperEvent.on(this.events, eventName, fn);
    };
    EmitterEvent.prototype.off = function (eventName, fn) {
        return helper_event_1.HelperEvent.off(this.events, eventName, fn);
    };
    EmitterEvent.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.events.hasOwnProperty(eventName)) {
            var list = this.events[eventName];
            var ln = list.length;
            for (var i = 0; i < ln; ++i) {
                if (util_1.methodCall(list, i, args) === false) {
                    return false;
                }
            }
        }
        return true;
    };
    return EmitterEvent;
}());
exports.EmitterEvent = EmitterEvent;


/***/ }),

/***/ "./src/core/modules/event/helper.event.ts":
/*!************************************************!*\
  !*** ./src/core/modules/event/helper.event.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ./../../util/util */ "./src/core/util/util.ts");
var eventKey = "__store__event__" + util_1.CODE;
var eventNum = 0;
var HelperEvent = /** @class */ (function () {
    function HelperEvent() {
    }
    HelperEvent.on = function (events, eventName, fn) {
        var eventList;
        if (events.hasOwnProperty(eventName)) {
            eventList = events[eventName];
        }
        else {
            eventList = HelperEvent.createEventList();
            events[eventName] = eventList;
        }
        if (!fn.hasOwnProperty(eventKey)) {
            fn[eventKey] = ++eventNum;
        }
        if (eventList.hash.hasOwnProperty(fn[eventKey])) {
            return false;
        }
        eventList.hash[fn[eventKey]] = true;
        eventList.push(fn);
        return true;
    };
    HelperEvent.off = function (events, eventName, fn) {
        if (events.hasOwnProperty(eventName) && fn.hasOwnProperty(eventKey)) {
            var eventList = events[eventName];
            var key = fn[eventKey];
            if (eventList.hash.hasOwnProperty(key)) {
                delete eventList.hash[key];
                var newEventList = HelperEvent.createEventList();
                var ln = eventList.length;
                for (var i = 0; i < ln; ++i) {
                    if (eventList[i][eventNum] !== key) {
                        newEventList.push(eventList[i]);
                    }
                }
                newEventList.hash = eventList.hash;
                events[eventName] = newEventList;
                return true;
            }
        }
        return false;
    };
    HelperEvent.createEventList = function () {
        var eventList = [];
        eventList.hash = {};
        return eventList;
    };
    return HelperEvent;
}());
exports.HelperEvent = HelperEvent;


/***/ }),

/***/ "./src/core/modules/event/store.event.ts":
/*!***********************************************!*\
  !*** ./src/core/modules/event/store.event.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helper_event_1 = __webpack_require__(/*! ./helper.event */ "./src/core/modules/event/helper.event.ts");
var event_1 = __webpack_require__(/*! ./../../util/event */ "./src/core/util/event.ts");
var StoreEvent = /** @class */ (function () {
    function StoreEvent() {
        this.clean();
    }
    StoreEvent.prototype.add = function (key, node) {
        this.nodes[key] = node;
    };
    StoreEvent.prototype.clean = function () {
        this.nodes = {};
        this.store = {};
    };
    StoreEvent.prototype.on = function (key, eventName, fn) {
        var _a;
        if (!this.store.hasOwnProperty(key)) {
            this.store[key] = {};
        }
        if (helper_event_1.HelperEvent.on(this.store[key], eventName, fn)) {
            if (this.nodes) {
                event_1.event.on(this.nodes[key], (_a = {}, _a[eventName] = fn, _a));
            }
            return true;
        }
        return false;
    };
    StoreEvent.prototype.off = function (key, eventName, fn) {
        var _a;
        if (this.store.hasOwnProperty(key)) {
            if (helper_event_1.HelperEvent.off(this.store[key], eventName, fn)) {
                if (this.nodes) {
                    event_1.event.off(this.nodes[key], (_a = {}, _a[eventName] = fn, _a));
                }
            }
            return true;
        }
        return false;
    };
    return StoreEvent;
}());
exports.StoreEvent = StoreEvent;


/***/ }),

/***/ "./src/core/modules/lifecycle.ts":
/*!***************************************!*\
  !*** ./src/core/modules/lifecycle.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Lifecycle = /** @class */ (function () {
    function Lifecycle() {
        this.METHODS = {
            BEFORE_INIT: "beforeInit",
            AFTER_INIT: "afterInit",
            BEFORE_MOUNT: "beforeMount",
            AFTER_MOUNT: "afterMount",
            BEFORE_UNMOUNT: "beforeUnmount",
            AFTER_UNMOUNT: "afterUnmount"
        };
        this.list = [];
        this.depth = 0;
    }
    Lifecycle.prototype.run = function (internal, method) {
        internal.safeMethodCall(method);
    };
    Lifecycle.prototype.add = function (internal, method) {
        if (internal.owner[method]) {
            this.list.push({ internal: internal, method: method });
        }
    };
    Lifecycle.prototype.start = function (callback) {
        ++this.depth;
        callback(this.depth);
        --this.depth;
        if (this.depth === 0 && this.list.length > 0) {
            this.list.forEach(function (cb) {
                cb.internal.safeMethodCall(cb.method);
            });
            this.list = [];
        }
    };
    return Lifecycle;
}());
exports.lifecycle = new Lifecycle();


/***/ }),

/***/ "./src/core/modules/template.ts":
/*!**************************************!*\
  !*** ./src/core/modules/template.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = __webpack_require__(/*! ./../util/util */ "./src/core/util/util.ts");
function template(config) {
    return function (ctor) {
        ctor.template = config;
        if (!config.root.ref) {
            config.root.ref = "root_" + util_1.CODE;
        }
        if (config.html) {
            var strings = config.html.split(/\n/g);
            config.html = strings.map(function (str) { return str.trim(); }).join("");
        }
    };
}
exports.template = template;


/***/ }),

/***/ "./src/core/util/dom.ts":
/*!******************************!*\
  !*** ./src/core/util/dom.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function appendChild(parent, node) {
    parent.appendChild(node);
}
exports.appendChild = appendChild;
function insertBefore(node, target) {
    node.parentNode.insertBefore(target, node);
}
exports.insertBefore = insertBefore;
function insertAfter(node, target) {
    if (node.nextSibling) {
        insertBefore(node.nextSibling, target);
    }
    else {
        appendChild(node.parentNode, target);
    }
}
exports.insertAfter = insertAfter;
function removeChild(node) {
    node.parentNode.removeChild(node);
}
exports.removeChild = removeChild;


/***/ }),

/***/ "./src/core/util/event.ts":
/*!********************************!*\
  !*** ./src/core/util/event.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.event = {
    on: function (el, listeners) {
        var events;
        for (var eventName in listeners) {
            if (listeners.hasOwnProperty(eventName)) {
                events = listeners[eventName];
                if (Array.isArray(events)) {
                    var ln = events.length;
                    for (var i = 0; i < ln; ++i) {
                        el.addEventListener(eventName, events[i], false);
                    }
                }
                else {
                    el.addEventListener(eventName, events, false);
                }
            }
        }
    },
    off: function (el, listeners) {
        var events;
        for (var eventName in listeners) {
            if (listeners.hasOwnProperty(eventName)) {
                events = listeners[eventName];
                if (Array.isArray(events)) {
                    var ln = events.length;
                    for (var i = 0; i < ln; ++i) {
                        el.removeEventListener(eventName, events[i], false);
                    }
                }
                else {
                    el.removeEventListener(eventName, events, false);
                }
            }
        }
    }
};


/***/ }),

/***/ "./src/core/util/util.ts":
/*!*******************************!*\
  !*** ./src/core/util/util.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// -------------------------------------------
function merge(to, a1) {
    var obj;
    var key;
    var ln = arguments.length;
    for (var i = 1; i < ln; ++i) {
        obj = arguments[i];
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                to[key] = obj[key];
            }
        }
    }
    return to;
}
exports.merge = merge;
// -------------------------------------------
var calls = {
    0: function (inst, method, args) {
        return inst[method]();
    },
    1: function (inst, method, args) {
        return inst[method](args[0]);
    },
    2: function (inst, method, args) {
        return inst[method](args[0], args[1]);
    },
    3: function (inst, method, args) {
        return inst[method](args[0], args[1], args[2]);
    },
    4: function (inst, method, args) {
        return inst[method](args[0], args[1], args[2], args[3]);
    },
    5: function (inst, method, args) {
        return inst[method](args[0], args[1], args[2], args[3], args[4]);
    },
    6: function (inst, method, args) {
        return inst[method](args[0], args[1], args[2], args[3], args[4], args[5]);
    },
    7: function (inst, method, args) {
        return inst[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    },
    8: function (inst, method, args) {
        return inst[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
    },
    9: function (inst, method, args) {
        return inst[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
    },
    10: function (inst, method, args) {
        return inst[method](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
    }
};
function methodCall(inst, method, args) {
    if (args.length < 11) {
        return calls[args.length](inst, method, args);
    }
    else {
        return inst[method].apply(inst, args);
    }
}
exports.methodCall = methodCall;
// -------------------------------------------
var num = Math.random() * 10000000000;
var random = Math.floor(num).toString(32);
exports.CODE = random.substr(random.length - 5);
// -------------------------------------------
var camelizeReg = /[\-]([\w])/;
function camelizeFn(token) {
    return token[1].toUpperCase();
}
function camelize(str) {
    return str.replace(camelizeReg, camelizeFn);
}
exports.camelize = camelize;
var uncamelizeReg = /([A-Z])/;
function uncamelizeFn(token) {
    return "-" + token.toLowerCase();
}
function uncamelize(str) {
    return str.replace(uncamelizeReg, uncamelizeFn);
}
exports.uncamelize = uncamelize;


/***/ }),

/***/ "./src/index.scss":
/*!************************!*\
  !*** ./src/index.scss ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var grid_1 = __webpack_require__(/*! ./widgets/grid/grid */ "./src/widgets/grid/grid.ts");
var tree_1 = __webpack_require__(/*! ./widgets/tree/tree */ "./src/widgets/tree/tree.ts");
var dragDropPlugin_1 = __webpack_require__(/*! ./widgets/grid/plugins/dragDrop/dragDropPlugin */ "./src/widgets/grid/plugins/dragDrop/dragDropPlugin.ts"); // не реализован !
var resizeColumnsPlugin_1 = __webpack_require__(/*! ./widgets/grid/plugins/resizeColumns/resizeColumnsPlugin */ "./src/widgets/grid/plugins/resizeColumns/resizeColumnsPlugin.ts");
var totalPlugin_1 = __webpack_require__(/*! ./widgets/grid/plugins/total/totalPlugin */ "./src/widgets/grid/plugins/total/totalPlugin.ts");
var ViewColumnsPlugin_1 = __webpack_require__(/*! ./widgets/grid/plugins/viewColumns/ViewColumnsPlugin */ "./src/widgets/grid/plugins/viewColumns/ViewColumnsPlugin.ts"); // не дописан !
var treeFilterPlugin_1 = __webpack_require__(/*! ./widgets/tree/plugins/treeFilter/treeFilterPlugin */ "./src/widgets/tree/plugins/treeFilter/treeFilterPlugin.ts");
var pinRowPlugin_1 = __webpack_require__(/*! ./widgets/tree/plugins/pinRow/pinRowPlugin */ "./src/widgets/tree/plugins/pinRow/pinRowPlugin.ts");
__webpack_require__(/*! ./index.scss */ "./src/index.scss");
grid_1.Grid.registerPlugin({ type: "dragDropGrid", plugin: dragDropPlugin_1.DragDropPlugin });
grid_1.Grid.registerPlugin({ type: "resizeColumns", plugin: resizeColumnsPlugin_1.ResizeColumnsPlugin });
grid_1.Grid.registerPlugin({ type: "total", plugin: totalPlugin_1.TotalPlugin });
grid_1.Grid.registerPlugin({ type: "viewColumns", plugin: ViewColumnsPlugin_1.ViewColumnsPlugin });
grid_1.Grid.registerPlugin({ type: "treeFilter", plugin: treeFilterPlugin_1.TreeFilterPlugin });
grid_1.Grid.registerPlugin({ type: "pinRow", plugin: pinRowPlugin_1.PinRowPlugin });
window.nw = {
    Grid: grid_1.Grid,
    Tree: tree_1.Tree
};


/***/ }),

/***/ "./src/widgets/grid/grid.ts":
/*!**********************************!*\
  !*** ./src/widgets/grid/grid.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var headgrid_1 = __webpack_require__(/*! ./headgrid/headgrid */ "./src/widgets/grid/headgrid/headgrid.ts");
var viewgrid_1 = __webpack_require__(/*! ./viewgrid/viewgrid */ "./src/widgets/grid/viewgrid/viewgrid.ts");
var util_1 = __webpack_require__(/*! ./../utils/util */ "./src/widgets/utils/util.ts");
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Grid_1 = Grid;
    Grid.registerPlugin = function (plugin) {
        this.plugins[plugin.type] = plugin;
    };
    // получает экземпляр класса заголовка
    Grid.prototype.getHead = function () {
        return this.head;
    };
    // получает экземпляр класса контента
    Grid.prototype.getView = function () {
        return this.view;
    };
    // показывает шапку таблицы
    Grid.prototype.showHead = function () {
        this.cl(Grid_1.REFS.GRID, { "head-hidden": false });
        this.props.hideHead = false;
    };
    // скрывает шапку таблицы
    Grid.prototype.hideHead = function () {
        this.cl(Grid_1.REFS.GRID, { "head-hidden": true });
        this.props.hideHead = true;
    };
    // ищет колонки
    Grid.prototype.findColumns = function (fn) {
        return this.head.findColumns(fn);
    };
    // ищет колонку
    Grid.prototype.findColumn = function (fn) {
        return this.head.findColumn(fn);
    };
    // получает список колонок
    Grid.prototype.getColumns = function () {
        return this.props.columns;
    };
    Grid.prototype.getPlugin = function (type) {
        var plugins = this.plugins.filter(function (plugin) { return plugin.type === type; });
        if (plugins.length > 0) {
            return plugins[0].plugin;
        }
        return null;
    };
    // загружает данные в таблицу
    Grid.prototype.loadData = function (data) {
        if (!Array.isArray(data)) {
            data = Object.prototype.toString.call(data) === "[object Object]" ? [data] : [];
        }
        this.view.loadData(data);
    };
    // получает все данные
    Grid.prototype.getData = function () {
        return this.view.getData();
    };
    // получает модель данных по id
    Grid.prototype.getRowById = function (id) {
        return this.view.getRowById(id);
    };
    // формирует шапку у таблицы
    Grid.prototype.reconfigure = function (columns) {
        this.head.reconfigure(columns);
    };
    // обновляет ширину у каждого столбца
    Grid.prototype.refreshColSize = function () {
        this.head.refreshColSize();
    };
    // возвращает список выбранных строк
    Grid.prototype.getSelected = function () {
        return this.view.getSelected();
    };
    // устанавливает выделенные строки
    Grid.prototype.doSelect = function (data) {
        this.view.doSelect(data);
    };
    // устанавливает скролл на указанную позицию
    Grid.prototype.scrollTo = function (scrollTop, scrollLeft) {
        this.view.scrollTo(scrollTop, scrollLeft);
    };
    // скроллит таблицу до указанной записи
    Grid.prototype.scrollBy = function (data, isTop) {
        if (isTop === void 0) { isTop = true; }
        this.view.scrollBy(data, isTop);
    };
    // устанавливает ширину в таблице
    Grid.prototype.setWidth = function (width) {
        this.props.width = width;
        this.css(Grid_1.REFS.GRID, { width: width === null ? null : width + "px" });
    };
    // устанавливает высоту в таблице
    Grid.prototype.setHeight = function (height) {
        this.props.height = height;
        this.css(Grid_1.REFS.GRID, { height: height === null ? null : height + "px" });
    };
    Grid.prototype.setCl = function (cl) {
        this.cl(Grid_1.REFS.GRID, cl);
    };
    // устанавливает чек в таблице
    Grid.prototype.setCheck = function (data, checked) {
        data.checked = checked; // TODO
        this.emit("checkchange", data, checked);
    };
    // обновляет таблицу
    Grid.prototype.refresh = function () {
        this.view.refresh();
    };
    // находит record по NODE узлу
    Grid.prototype.getRecordByEl = function (el) {
        return this.view.getRecordByEl(el);
    };
    // находит column по NODE узлу
    Grid.prototype.getHeaderByEl = function (el) {
        return this.head.getHeaderByEl(el);
    };
    // обновляет строку у таблицы по записи
    Grid.prototype.updateRowByData = function (data) {
        this.view.updateRowByData(data);
    };
    // обновляет строку у таблицы по id
    Grid.prototype.updateRowById = function (idRow) {
        this.view.updateRowById(idRow);
    };
    // ----------------------------------------------------
    // перед инициализацией. здесь мы устанавливаем значения по умолчанию
    // если их не передали в параметрах, при создании компонента
    Grid.prototype.beforeInit = function () {
        if (!this.props.getId) {
            this.props.getId = function (item) { return item.id; };
        }
        // добавляем события
        function cellMouseDown_Grid(grid, td, columnIndex, data, tr, rowIndex, event, column) {
            if (column.xtype === "checkcolumn") {
                var dataIndex = column.dataIndex || "checked";
                var model = this.props.getData(data);
                var checked = model[dataIndex];
                grid.setCheck(data, !checked);
            }
            else {
                grid.view.doSelect([data], event.ctrlKey);
            }
        }
        this.on("onCellMouseDown", cellMouseDown_Grid);
    };
    // после инициализации. создаем дочерние компоненты
    Grid.prototype.afterInit = function () {
        this.setWidth(util_1.isNumber(this.props.width) ? this.props.width : null);
        this.setHeight(util_1.isNumber(this.props.height) ? this.props.height : null);
        this.initHead();
        this.initView();
        if (this.props.hideHead) {
            this.hideHead();
        }
        // добавим шапку таблицы для синхронизации с контентом
        // т.к. шапка и контент это два разных тега <table>
        // им нужно задавать одинаковые ширины колонок,
        // для этого и нужна синхронизация
        this.view.addSyncTable(this.head);
        this.initPlugins();
        this.loadData(this.props.data);
    };
    // перед рендерингом. говорим какие дочерние компоненты должны рендериться
    Grid.prototype.beforeMount = function () {
        this.head.appendChild(this.ref(Grid_1.REFS.GRID));
        this.view.appendChild(this.ref(Grid_1.REFS.GRID));
        this.mountPlugins();
    };
    // после рендеринга. стартуем обновлять нашу таблицу
    Grid.prototype.afterMount = function () {
        this.head.reconfigure(this.props.columns);
        this.view.asyncUpdateSize();
    };
    Grid.prototype.beforeUnmount = function () {
        this.unmountPlugins();
        this.head.remove();
        this.view.remove();
        this.head = null;
        this.view = null;
    };
    Grid.prototype.initHead = function () {
        this.head = new headgrid_1.HeadGrid({
            columns: this.props.columns
        }, this);
    };
    Grid.prototype.initView = function () {
        this.view = new viewgrid_1.ViewGrid({
            data: this.props.data,
            getId: this.props.getId,
            columns: [],
            multiSelect: this.props.multiSelect,
            emptyRowText: this.props.emptyRowText,
            bufferEnable: this.props.bufferEnable,
            bufferHeight: this.props.bufferHeight,
            bufferStock: this.props.bufferStock,
            bufferScrollMin: this.props.bufferScrollMin
        }, this);
    };
    // --- плагины
    // инициализация плагинов
    Grid.prototype.initPlugins = function () {
        var _this = this;
        this.plugins = (this.props.plugins || []).map(function (pluginProps) {
            var plugin = null;
            if (Grid_1.plugins.hasOwnProperty(pluginProps.type)) {
                var Ctor = Grid_1.plugins[pluginProps.type].plugin;
                try {
                    plugin = new Ctor(pluginProps, _this);
                }
                catch (e) {
                    console.error(e);
                }
            }
            return { type: pluginProps.type, plugin: plugin };
        });
    };
    // рендеринг плагинов
    Grid.prototype.mountPlugins = function () {
        this.plugins.forEach(function (pluginItem) {
            var plugin = pluginItem.plugin;
            var MOUNT = "mount";
            if (plugin && plugin[MOUNT]) {
                core_1.methodCall(pluginItem.plugin, MOUNT, []);
            }
        });
    };
    // демонтирование плагинов
    Grid.prototype.unmountPlugins = function () {
        this.plugins.forEach(function (pluginItem) {
            var plugin = pluginItem.plugin;
            var UNMOUNT = "unmount";
            if (plugin && plugin[UNMOUNT]) {
                core_1.methodCall(pluginItem.plugin, UNMOUNT, []);
            }
        });
    };
    var Grid_1;
    Grid.plugins = {};
    /* tslint:disable:member-ordering */
    Grid.REFS = {
        GRID: "grid"
    };
    Grid = Grid_1 = __decorate([
        core_1.template({
            html: "",
            root: {
                tagName: "div",
                ref: "grid",
                cl: {
                    ngrid: true
                }
            }
        })
    ], Grid);
    return Grid;
}(core_1.Component));
exports.Grid = Grid;


/***/ }),

/***/ "./src/widgets/grid/headgrid/headgrid.html":
/*!*************************************************!*\
  !*** ./src/widgets/grid/headgrid/headgrid.html ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div ref=\"content\" class=\"wrap-content\">\n    <table ref=\"table\">\n        <colgroup ref=\"cols\"></colgroup>\n        <tbody ref=\"body\"></tbody>\n    </table>\n</div>";

/***/ }),

/***/ "./src/widgets/grid/headgrid/headgrid.ts":
/*!***********************************************!*\
  !*** ./src/widgets/grid/headgrid/headgrid.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var core_2 = __webpack_require__(/*! core */ "./src/core/index.ts");
var viewgrid_1 = __webpack_require__(/*! ./../viewgrid/viewgrid */ "./src/widgets/grid/viewgrid/viewgrid.ts");
var util_1 = __webpack_require__(/*! ./../../utils/util */ "./src/widgets/utils/util.ts");
var icons_1 = __webpack_require__(/*! ./../../icons */ "./src/widgets/icons.ts");
var HeadGrid = /** @class */ (function (_super) {
    __extends(HeadGrid, _super);
    function HeadGrid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HeadGrid_1 = HeadGrid;
    HeadGrid.registerColumn = function (column) {
        this.columns[column.xtype] = column;
    };
    HeadGrid.prototype.beforeInit = function () {
        this.useFlexColumns = false;
        this.colsDom = null;
        this.columnsDown = [];
        this.headerDom = {
            name: "tbody",
            children: []
        };
    };
    // ищет колонки
    HeadGrid.prototype.findColumns = function (fn) {
        var result = [];
        var columns = this.props.columns;
        this.eachColumn(columns, function (column) {
            if (fn(column)) {
                result.push(column);
            }
        });
        return result;
    };
    // ищет колонку
    HeadGrid.prototype.findColumn = function (fn) {
        return this.findColumns(fn)[0] || null;
    };
    // делает сортировку по колонке. пока не реализовано :(
    HeadGrid.prototype.sortByColumn = function (column, direction) {
        /*if (column.sortable) {
            // список колонок, которые можем сотрировать
            let columns = this.headerNodesDown.map((nodeTd) => {
                return nodeTd.tplData.column;
            });

            // сбрасываем сортировку у других колонок
            columns.forEach((c) => {
                if (c.id !== column.id) {
                    c.direction = null;
                }
            });

            // если указано явное направление сортировки, то выставляем ее
            // иначе делаем инверсию относительно этой же колонки
            if (direction) {
                column.direction = direction;
            } else {
                column.direction = column.direction === 'ASC' ? 'DESC' : 'ASC';
            }

            let grid = this.ownerCt;

            if (column.valueSort) {
                grid.getStore().sort({
                    fn (record1, record2) {
                        let v1 = column.valueSort.call(grid, record1, column);
                        let v2 = column.valueSort.call(grid, record2, column);

                        if (v1 === v2) {
                            return 0;
                        }

                        return v1 > v2 ? 1 : -1;
                    },
                    direction: column.direction
                });
            } else {
                if (column.dataIndex) {
                    grid.getStore().sort({
                        property: column.dataIndex,
                        direction: column.direction
                    });
                }
            }

            this.updateHeader();
            grid.fireEvent('sortchange', grid, column, column.direction);
        }*/
    };
    // изменяет шапку у таблицы
    HeadGrid.prototype.reconfigure = function (columns) {
        this.initColumns(columns || []);
        if (this.isRendered()) {
            this.updateHeader();
            this.refreshColSize();
        }
    };
    // обновляет ширину у каждого столбца
    HeadGrid.prototype.refreshColSize = function () {
        var _this = this;
        var grid = this.parent;
        var view = grid.getView();
        // - когда таблица не была прорендерена;
        // - когда талица скрыта "display: none";
        // - когда колонок в таблице нет;
        // обновлять ничего не будем
        if (!this.isRendered() || !view.getWidth() || this.columnsDown.length === 0) {
            return;
        }
        var _a = this.getColsDom(), useFlex = _a.useFlex, colsDom = _a.colsDom;
        var syncTableList = view.getSyncTableList();
        var updateList = [view].concat(syncTableList);
        var ref = viewgrid_1.ViewGrid.REFS.COLS;
        var defaultColsDom = {
            name: "colgroup",
            children: []
        };
        updateList.forEach(function (component) {
            var colgroup = core_2.methodCall(component, "ref", [ref]);
            var cols = colgroup.children.length > 0 ? _this.colsDom : defaultColsDom;
            if (colgroup) {
                core_2.dom.update(colgroup, cols, colsDom);
            }
        });
        this.useFlexColumns = useFlex;
        this.colsDom = colsDom;
        view.refresh();
    };
    // находит column по NODE узлу
    HeadGrid.prototype.getHeaderByEl = function (el) {
        var div = this.ref(HeadGrid_1.REFS.HEAD);
        var nodeTd = util_1.findParentNode(el, "td", div);
        if (nodeTd) {
            var index = parseInt(nodeTd.getAttribute("data-index"), 10);
            return this.columnsDown[index];
        }
        return null;
    };
    HeadGrid.prototype.getTdByEl = function (el) {
        return util_1.findParentNode(el, "td", this.ref(HeadGrid_1.REFS.HEAD));
    };
    HeadGrid.prototype.getColumnByTd = function (td, goDown) {
        if (td) {
            // находим id колонки по которой кликнули
            var columnId_1 = parseInt(td.getAttribute("data-num"), 10);
            // находим колонку по которой кликнули
            var column = this.findColumn(function (c) { return c.id === columnId_1; });
            if (column) {
                if (goDown) {
                    while (column.columns && column.columns.length > 0) {
                        column = column.columns[column.columns.length - 1];
                    }
                }
                return column;
            }
        }
        return null;
    };
    // возвращает нижний ряд с колонками
    HeadGrid.prototype.getColumnsDown = function () {
        return this.columnsDown;
    };
    HeadGrid.prototype.isUseFlex = function () {
        return this.useFlexColumns;
    };
    // --------------------------------------------------------
    // приватные методы для работы с заголовком таблицы
    // инициализация колонок
    HeadGrid.prototype.initColumns = function (columns) {
        var _this = this;
        this.columnsDown = [];
        this.eachColumn(columns, function (column) {
            // у каждой колонки должден быть тип,
            // по этому типу будет производиться рендеринг данных
            // если тип не задан, то устанавливаем по умолчанию
            if (!column.xtype) {
                column.xtype = "basecolumn";
            }
            if (!util_1.isNumber(column.id)) {
                column.id = ++HeadGrid_1.columnId;
            }
            if (!column.text) {
                column.text = "";
            }
            if (!column.tdCls) {
                column.tdCls = null;
            }
            if (!column.align) {
                column.align = null;
            }
            if (!column.dataIndex) {
                column.dataIndex = null;
            }
            if (!column.renderer) {
                column.renderer = null;
            }
            if (!column.columns) {
                column.columns = null;
            }
            if (!column.tooltip) {
                column.tooltip = null;
            }
            if (!column.accuracyClick) {
                column.accuracyClick = false;
            }
            if (column.columns) {
                column.resizable = false;
                column.sortable = false;
                column.minWidth = null;
                column.width = null;
                column.flex = null;
            }
            else {
                column.resizable = column.resizable !== false;
                column.sortable = column.sortable !== false;
                column.minWidth = column.minWidth ? column.minWidth : null;
                if (util_1.isNumber(column.flex)) {
                    column.width = null;
                }
                else {
                    column.flex = null;
                    if (!util_1.isNumber(column.width)) {
                        column.width = 100;
                    }
                }
                // соберем нижний ряд колонок (если это многоуровневая шапка)
                _this.columnsDown.push(column);
            }
        });
        this.props.columns = columns;
        this.parent.props.columns = columns;
    };
    // обновляет шапку таблицы
    HeadGrid.prototype.updateHeader = function () {
        var view = this.parent.getView();
        var headerDomDown = [];
        var headerDom = {
            name: "tbody",
            children: []
        };
        this.createHeaderDom(headerDom, headerDomDown, this.props.columns, 0);
        this.updateRowspan(headerDomDown, headerDom.children.length);
        core_2.dom.update(this.ref(HeadGrid_1.REFS.BODY), this.headerDom, headerDom);
        this.headerDom = headerDom;
        // обновим колонки во вьюхе
        view.props.columns = headerDomDown.map(function (d) { return d.column; });
    };
    // создает виртуальный DOM для колонок
    HeadGrid.prototype.createHeaderDom = function (headerDom, headerDomDown, columns, depth) {
        var _this = this;
        if (headerDom.children.length === depth) {
            headerDom.children.push({
                name: "tr",
                id: depth,
                children: []
            });
        }
        var domTr = headerDom.children[depth];
        var totalChildren = 0;
        columns.forEach(function (column) {
            var sortIcon = "";
            if (column.direction) {
                var direction = column.direction.toLowerCase();
                sortIcon = icons_1.createIcon(icons_1.ICONS.HEADER_ARROW, "sort " + direction);
            }
            var domTd = {
                name: "td",
                id: column.id,
                text: column.text + sortIcon,
                attr: {},
                cl: {},
                depth: depth,
                column: column
            };
            domTd.attr["data-num"] = column.id.toString();
            if (column.tooltip) {
                domTd.attr["data-qtip"] = column.tooltip;
            }
            if (column.cls) {
                domTd.cl[column.cls] = true;
            }
            domTr.children.push(domTd);
            var countChildren = 0;
            if (column.columns) {
                countChildren = _this.createHeaderDom(headerDom, headerDomDown, column.columns, depth + 1);
            }
            else {
                countChildren = 1;
                // конечный узел колонки
                headerDomDown.push(domTd);
            }
            if (countChildren > 1) {
                domTd.attr.colspan = countChildren.toString();
            }
            totalChildren += countChildren;
        });
        return totalChildren;
    };
    // обновляет атрибуты rowspan
    HeadGrid.prototype.updateRowspan = function (headerDomDown, maxDepth) {
        headerDomDown.forEach(function (domTd) {
            var rowspan = maxDepth - domTd.depth;
            if (rowspan > 1) {
                domTd.attr.rowspan = rowspan.toString();
            }
        });
    };
    // вычисляет ширину каждой колонки
    // возвращает информацию:
    // useFlex - используется хотябы в одной колонке flex
    // list - список ширин для каждой колонки
    HeadGrid.prototype.getColsDom = function () {
        // view
        var view = this.parent.getView();
        var container = core_2.methodCall(view, "ref", [viewgrid_1.ViewGrid.REFS.CONTAINER]);
        // ширина контента
        var contentWidth = container.getBoundingClientRect().width;
        // сгенерим упрощенную модель списка колонок.
        // минимальная ширина, ширина и флекс
        // value будем вычислять. это и будет ширина нашей колонки
        var cutColumns = this.columnsDown.map(function (column) {
            return {
                minWidth: column.minWidth,
                width: column.width,
                flex: column.flex,
                value: null
            };
        });
        var useFlex = this.updateCutColumns(cutColumns, contentWidth);
        var colsDom = cutColumns.map(function (cutColumn, index) {
            return {
                id: index,
                name: "col",
                attr: {
                    width: cutColumn.value
                }
            };
        });
        return {
            useFlex: useFlex,
            colsDom: {
                name: "colgroup",
                children: colsDom
            }
        };
    };
    // находит ширину для каждой колонки и возвращает
    // используется ли flex хотябы в одной колонке
    HeadGrid.prototype.updateCutColumns = function (columns, contentWidth) {
        var staticWidth = 0; // сумма всех колонок с фиксированной шириной
        var flexWidth; // ширина контента для флекса
        var flexSum = 0; // сумма всех колонок с флексом
        var column; // колонка
        var minWidth; // минимальная ширина колонки
        var percent; // процент на который будем растягивать колонку
        columns.forEach(function (c) {
            if (c.flex === null) {
                staticWidth += c.width;
            }
            else {
                flexSum += c.flex;
            }
        });
        // вычитаем всю доступную нам ширину и статическую
        // получаем ширину которая доступна нам для флекса
        flexWidth = contentWidth - staticWidth;
        // перебираем каждую колонку и находим value
        var ln = columns.length;
        for (var i = 0; i < ln; ++i) {
            column = columns[i];
            if (column.flex === null) {
                // если у колонки не задан flex, то это колонка является статической
                // просто запишем в value значение статики
                column.value = "" + column.width;
            }
            else {
                // колонка является флексовой. найдем ее минимально допустимое значение
                // оно может хранится и в width и в minWidth
                minWidth = column.width === null ? (column.minWidth === null ? null : column.minWidth) : column.width;
                // найдем у флекса процентное соотношение.
                // это значение флекса данной колонки и сумма всех флексов
                percent = column.flex / flexSum;
                // если минимальная ширина найдена И!
                // размер колонки меньше чем минимальное значение
                // то установим этой колонке минимальную ширину и
                // запустим перерасчет снова
                if (minWidth !== null && minWidth > percent * flexWidth) {
                    column.width = minWidth;
                    column.flex = null;
                    return this.updateCutColumns(columns, contentWidth);
                }
                else {
                    // если минимальной ширины нет или она есть, но
                    // ширина колонки больше чем ее минимум
                    // то все ок. запишем ее процентное соотношение
                    column.value = percent * 100 + "%";
                }
            }
        }
        return flexSum > 0;
    };
    // перебирает каждую колонку
    HeadGrid.prototype.eachColumn = function (columns, fn) {
        var _this = this;
        columns.forEach(function (column) {
            fn(column);
            if (column.columns) {
                _this.eachColumn(column.columns, fn);
            }
        });
    };
    HeadGrid.prototype.onHeaderClick = function (event) {
        // console.log(111);
        /*let td: HTMLTableDataCellElement = this.getTdByEl(event.target as HTMLElement);
        let column: IColumn<T, R> = this.getColumnByTd(td);

        if (column /*&& !this.findResizableColumn(td, event)* /) {
            this.sortByColumn(column);

            this.parent.emit("onHeaderClick", column, event);
        }*/
    };
    var HeadGrid_1;
    HeadGrid.columnId = 1000;
    HeadGrid.columns = {};
    /* tslint:disable:member-ordering */
    HeadGrid.REFS = {
        HEAD: "head",
        CONTENT: "content",
        TABLE: "table",
        COLS: "cols",
        BODY: "body"
    };
    __decorate([
        core_1.on(HeadGrid_1.REFS.HEAD, "click"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], HeadGrid.prototype, "onHeaderClick", null);
    HeadGrid = HeadGrid_1 = __decorate([
        core_1.template({
            html: __webpack_require__(/*! ./headgrid.html */ "./src/widgets/grid/headgrid/headgrid.html"),
            root: {
                tagName: "div",
                ref: "head",
                cl: {
                    "ngrid-head": true
                }
            }
        })
    ], HeadGrid);
    return HeadGrid;
}(core_1.Component));
exports.HeadGrid = HeadGrid;
// регистрируем типы колонок
HeadGrid.registerColumn({
    xtype: "basecolumn",
    renderer: function (data, meta) {
        var value = data[meta.column.dataIndex];
        if (meta.column.renderer) {
            return meta.column.renderer(value, meta, data);
        }
        return value;
    }
});
HeadGrid.registerColumn({
    xtype: "rownumberer",
    renderer: function (data, meta) {
        var value = (meta.row.index + 1).toString();
        if (meta.column.renderer) {
            return meta.column.renderer(value, meta, data);
        }
        return value;
    }
});
HeadGrid.registerColumn({
    xtype: "checkcolumn",
    renderer: function (data, meta) {
        var dataIndex = meta.column.dataIndex || "checked";
        var checked = data[dataIndex];
        var checkIcon = icons_1.createIcon(checked ? icons_1.ICONS.CHECKBOX_CHECKED : icons_1.ICONS.CHECKBOX);
        meta.cl.checkcolumn = true;
        meta.cl["row-center"] = true;
        if (meta.column.renderer) {
            return meta.column.renderer(checkIcon, meta, data);
        }
        return checkIcon;
    }
});


/***/ }),

/***/ "./src/widgets/grid/plugins/dragDrop/dragDropPlugin.ts":
/*!*************************************************************!*\
  !*** ./src/widgets/grid/plugins/dragDrop/dragDropPlugin.ts ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* !!! ПЕРЕПИСАТЬ !!! */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var icons_1 = __webpack_require__(/*! ./../../../icons */ "./src/widgets/icons.ts");
var util_1 = __webpack_require__(/*! ./../../../utils/util */ "./src/widgets/utils/util.ts");
var util_2 = __webpack_require__(/*! ./../../../utils/util */ "./src/widgets/utils/util.ts");
var container = null;
var DragDropPlugin = /** @class */ (function () {
    function DragDropPlugin(props, grid) {
        var _this = this;
        this.grid = grid;
        this.selected = null;
        this.windowEvents = {
            mouseup: function (e) {
                _this.onDoneDragDrop(e);
            },
            mousemove: function (e) {
                _this.updateCoordinate(e);
            }
        };
        var plugin = this;
        function cellMouseDown_Grid(gr, td, columnIndex, data, tr, rowIndex, e, column) {
            plugin.onStartDrag(e, tr);
        }
        function cellMouseMove_Grid(gr, td, columnIndex, data, tr, rowIndex, e, column) {
            if (plugin.selected !== null) {
                plugin.onUpdateDrag(e, tr, data);
            }
        }
        this.grid.on("onCellMouseDown", cellMouseDown_Grid);
        this.grid.on("onCellMouseMove", cellMouseMove_Grid);
    }
    DragDropPlugin.prototype.checkDrop = function (data, percent) {
        var _this = this;
        var idRow = this.grid.props.getId(data);
        return !this.selected.some(function (item) {
            return _this.grid.props.getId(item) === idRow;
        });
    };
    DragDropPlugin.prototype.updateActivityRow = function (idRow, show) {
        var view = this.grid.getView();
        var hash = util_2.reedProperty(view, "renderedHash");
        var list = util_2.reedProperty(view, "renderedList");
        var cls = "ngrid-drag-drop-active-row";
        if (hash.hasOwnProperty(idRow)) {
            var row = list[hash[idRow]];
            if (show) {
                row.node.classList.add(cls);
            }
            else {
                row.node.classList.remove(cls);
            }
        }
    };
    DragDropPlugin.prototype.update = function (data, percent) {
        var view = this.grid.getView();
        var allowDrop = this.checkDrop(data, percent);
        var idRow;
        var index;
        if (allowDrop) {
            if (percent < 0.5) {
                idRow = view.props.getId(data);
                index = util_2.reedProperty(view, "dataHash")[idRow];
                if (index === 0) {
                    data = null;
                    idRow = null;
                }
                else {
                    data = util_2.reedProperty(view, "dataList")[index - 1];
                    idRow = view.props.getId(data);
                }
            }
            if (this.activeIdRow !== idRow) {
                if (this.grid.emit("onChangeTargetDrop", data) === false) {
                    allowDrop = false;
                }
            }
        }
        else {
            this.activeIdRow = null;
        }
        if (this.activeIdRow !== idRow) {
            this.updateActivityRow(this.activeIdRow, false);
            this.updateActivityRow(idRow, true);
            this.updateTooltip(allowDrop);
            this.activeIdRow = idRow;
        }
    };
    DragDropPlugin.prototype.onStartDrag = function (e, tr) {
        if (container === null) {
            this.initTooltip();
        }
        else {
            this.showTooltip();
        }
        this.selected = this.grid.getSelected();
        core_1.event.on(window, this.windowEvents);
        this.grid.setCl({ "ngrid-drag-drop": true });
    };
    DragDropPlugin.prototype.onUpdateDrag = function (e, tr, data) {
        var bound = tr.getBoundingClientRect();
        var full = bound.bottom - bound.top;
        var value = e.clientY - bound.top;
        var percent = value / full;
        this.update(data, percent);
    };
    DragDropPlugin.prototype.onDoneDragDrop = function (e) {
        this.selected = null;
        core_1.event.off(window, this.windowEvents);
        this.grid.setCl({ "ngrid-drag-drop": false });
        this.hideTooltip();
    };
    // ---------------------------------------------
    DragDropPlugin.prototype.initTooltip = function () {
        container = document.createElement("div");
        document.body.appendChild(container);
        container.setAttribute("class", "ngrid-drag-drop-tooltip");
    };
    DragDropPlugin.prototype.showTooltip = function () {
        container.style.display = "block";
    };
    DragDropPlugin.prototype.hideTooltip = function () {
        container.style.display = "none";
    };
    DragDropPlugin.prototype.updateCoordinate = function (e) {
        var bound = container.getBoundingClientRect();
        var coord = { x: e.clientX, y: e.clientY };
        var size = { width: bound.width, height: bound.height };
        coord = util_1.correctionCoordinate(coord, size);
        container.style.top = coord.y + "px";
        container.style.left = coord.x + "px";
    };
    DragDropPlugin.prototype.updateTooltip = function (allowDrop) {
        if (this.allowDrop !== allowDrop) {
            this.allowDrop = allowDrop;
            var iconId = allowDrop ? icons_1.ICONS.DRAG_DROP_OK : icons_1.ICONS.DRAG_DROP_LOCK;
            var icon = icons_1.createIcon(iconId, "ngrid-drag-drop-icon");
            var count = this.selected.length;
            var texts = [
                "\u0412\u044B\u0431\u0440\u0430\u043D\u0430 " + count + " \u0437\u0430\u043F\u0438\u0441\u044C",
                "\u0412\u044B\u0431\u0440\u0430\u043D\u043E " + count + " \u0437\u0430\u043F\u0438\u0441\u0438",
                "\u0412\u044B\u0431\u0440\u0430\u043D\u043E " + count + " \u0437\u0430\u043F\u0438\u0441\u0435\u0439"
            ];
            container.innerHTML = icon + util_2.getDecl(texts, count);
        }
    };
    return DragDropPlugin;
}());
exports.DragDropPlugin = DragDropPlugin;


/***/ }),

/***/ "./src/widgets/grid/plugins/resizeColumns/resizeColumnsPlugin.ts":
/*!***********************************************************************!*\
  !*** ./src/widgets/grid/plugins/resizeColumns/resizeColumnsPlugin.ts ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var grid_1 = __webpack_require__(/*! ./../../grid */ "./src/widgets/grid/grid.ts");
var headgrid_1 = __webpack_require__(/*! ../../headgrid/headgrid */ "./src/widgets/grid/headgrid/headgrid.ts");
var viewgrid_1 = __webpack_require__(/*! ../../viewgrid/viewgrid */ "./src/widgets/grid/viewgrid/viewgrid.ts");
var ResizeColumnsPlugin = /** @class */ (function () {
    function ResizeColumnsPlugin(props, grid) {
        var _this = this;
        this.grid = grid;
        this.line = null;
        this.showLine = false;
        this.resizeCursor = false;
        this.resize = null;
        this.events = {
            mousedown: function (e) {
                _this.onMouseDown(e);
            },
            mousemove: function (e) {
                _this.onMouseMove(e);
            },
            mouseleave: function (e) {
                _this.onMouseLeave(e);
            }
        };
        this.windowEvents = {
            mousemove: function (e) {
                _this.onResizeColumn(e);
            },
            mouseup: function (e) {
                _this.onDoneResizeColumn(e);
            }
        };
    }
    ResizeColumnsPlugin.prototype.findResizableColumn = function (td, e) {
        var head = this.grid.getHead();
        // если td не найдено, то возьмем последнюю
        if (!td) {
            var body = core_1.methodCall(head, "ref", [headgrid_1.HeadGrid.REFS.BODY]);
            var tr = body.children[body.children.length - 1];
            td = tr.children[tr.children.length - 1];
        }
        var rect = td.getBoundingClientRect();
        var mouseX = e.clientX;
        var distance = 8;
        var column = null;
        if (rect.right - mouseX <= distance && mouseX - rect.right <= distance) {
            column = head.getColumnByTd(td);
        }
        else {
            if (mouseX - rect.left <= distance) {
                // я думаю при многоуровневой шапке, тут будет не правильно работать !!!
                td = td.previousSibling; // TODO
                column = head.getColumnByTd(td);
            }
        }
        if (column && column.resizable) {
            return column;
        }
        return null;
    };
    ResizeColumnsPlugin.prototype.updateResizeCursor = function (resizable) {
        var _a, _b;
        var cls = "ngrid-cursor-resize";
        if (resizable !== this.resizeCursor) {
            this.resizeCursor = resizable;
            core_1.dom.cl(document.body, (_a = {}, _a[cls] = !resizable, _a), (_b = {}, _b[cls] = resizable, _b), false);
        }
    };
    ResizeColumnsPlugin.prototype.onMouseDown = function (e) {
        var head = this.grid.getHead();
        var view = this.grid.getView();
        var el = e.target;
        var td = head.getTdByEl(el);
        var column = this.findResizableColumn(td, e);
        if (column) {
            var tableBody_1 = core_1.methodCall(head, "ref", [headgrid_1.HeadGrid.REFS.BODY]);
            var columns = head.getColumnsDown();
            var index = columns.indexOf(column);
            var nextColumn_1 = columns[index + 1] || null;
            var columnsFlex = columns.filter(function (c) { return c.flex !== null; });
            var info = columnsFlex.map(function (c) {
                var width;
                if (c.width === null) {
                    var selector = "td[data-num=\"" + c.id + "\"]";
                    var tableCell = tableBody_1.querySelector(selector);
                    var bound = tableCell.getBoundingClientRect();
                    width = bound.width;
                }
                else {
                    width = c.width;
                }
                return {
                    column: c,
                    width: width,
                    flex: c.flex
                };
            });
            var currColumnWidth = null;
            var nextColumnWidth = null;
            var maxDiffLastColumn = null;
            if (column.flex === null) {
                currColumnWidth = column.width;
            }
            else {
                var columnInfo = info.filter(function (inf) {
                    return inf.column === column;
                })[0];
                currColumnWidth = columnInfo.width;
            }
            if (!nextColumn_1 || !nextColumn_1.resizable) {
                nextColumn_1 = null;
                var viewWrap = core_1.methodCall(view, "ref", [viewgrid_1.ViewGrid.REFS.WRAP]);
                var wrapWidth = viewWrap.getBoundingClientRect().width;
                var iframeWidth = view.getIframeWidth();
                maxDiffLastColumn = iframeWidth - wrapWidth;
            }
            else {
                nextColumnWidth = nextColumn_1.flex === null ?
                    nextColumn_1.width : info.filter(function (c) { return c.column === nextColumn_1; })[0].width;
            }
            var headEl = core_1.methodCall(head, "ref", [headgrid_1.HeadGrid.REFS.HEAD]);
            var boundHead = headEl.getBoundingClientRect();
            var currTd = tableBody_1.querySelector("td[data-num=\"" + column.id + "\"]");
            var currBound = currTd.getBoundingClientRect();
            this.resize = {
                position: e.clientX,
                left: currBound.right - boundHead.left,
                info: info,
                currColumn: column,
                nextColumn: nextColumn_1,
                currColumnWidth: currColumnWidth,
                nextColumnWidth: nextColumnWidth,
                maxDiffLastColumn: maxDiffLastColumn
            };
            core_1.event.on(window, this.windowEvents);
        }
        this.updateResizeCursor(!!column);
    };
    ResizeColumnsPlugin.prototype.onMouseMove = function (e) {
        if (this.resize === null) {
            var head = this.grid.getHead();
            var td = head.getTdByEl(e.target);
            var column = this.findResizableColumn(td, e);
            this.updateResizeCursor(!!column);
        }
    };
    ResizeColumnsPlugin.prototype.onMouseLeave = function (e) {
        if (!this.resize) {
            this.updateResizeCursor(false);
        }
    };
    ResizeColumnsPlugin.prototype.onResizeColumn = function (e) {
        var diff = e.clientX - this.resize.position;
        // --------
        var column = this.resize.currColumn;
        var width = this.resize.currColumnWidth;
        var minWidth = column.minWidth === null ? 0 : column.minWidth;
        if (width + diff < minWidth) {
            diff = minWidth - width;
        }
        // --------
        if (!this.resize.nextColumn) {
            if (this.resize.maxDiffLastColumn > diff) {
                diff = this.resize.maxDiffLastColumn;
            }
        }
        // --------
        var left = this.resize.left;
        var position = left + diff;
        this.line.style.left = position + "px";
        this.showVerticalLine();
    };
    ResizeColumnsPlugin.prototype.onDoneResizeColumn = function (e) {
        var _this = this;
        this.applySizeColumn(e);
        core_1.event.off(window, this.windowEvents);
        this.hideVerticalLine();
        this.updateResizeCursor(false);
        // очищаем не сразу, чтобы не сработал клик для сортировки
        setTimeout(function () {
            _this.resize = null;
        }, 50);
    };
    ResizeColumnsPlugin.prototype.applySizeColumn = function (e) {
        // жизнь боль
        var currColumn = this.resize.currColumn;
        var nextColumn = this.resize.nextColumn;
        var currColumnWidth = this.resize.currColumnWidth;
        var nextColumnWidth = this.resize.nextColumnWidth;
        var diff = e.clientX - this.resize.position;
        var newCurrColumnWidth = currColumnWidth;
        var newNextColumnWidth = nextColumnWidth;
        var minWidth;
        var flexInfo = this.resize.info.reduce(function (result, info) {
            result.flex += info.flex;
            result.width += info.width;
            return result;
        }, { flex: 0, width: 0 });
        // --------
        minWidth = currColumn.minWidth === null ? 0 : currColumn.minWidth;
        if (currColumnWidth + diff < minWidth) {
            diff = -(currColumnWidth - minWidth);
        }
        // --------
        if (!this.resize.nextColumn) {
            if (this.resize.maxDiffLastColumn > diff) {
                diff = this.resize.maxDiffLastColumn;
            }
        }
        // --------
        if (nextColumn) {
            var diffCCol = void 0;
            minWidth = nextColumn.minWidth === null ? 0 : nextColumn.minWidth;
            if (nextColumnWidth - diff < minWidth) {
                diffCCol = nextColumnWidth - minWidth;
                diff -= diffCCol;
            }
            else {
                diffCCol = diff;
                diff = 0;
            }
            newCurrColumnWidth = currColumnWidth + diffCCol;
            newNextColumnWidth = nextColumnWidth - diffCCol;
            if (currColumn.flex !== null) {
                currColumn.flex = newCurrColumnWidth * flexInfo.flex / flexInfo.width;
            }
            if (currColumn.width !== null) {
                currColumn.width = newCurrColumnWidth;
            }
            if (nextColumn.flex !== null) {
                nextColumn.flex = newNextColumnWidth * flexInfo.flex / flexInfo.width;
            }
            if (nextColumn.width !== null) {
                nextColumn.width = newNextColumnWidth;
            }
        }
        if (diff !== 0) {
            newCurrColumnWidth += diff;
            if (currColumn.flex !== null) {
                currColumn.flex = newCurrColumnWidth * flexInfo.flex / flexInfo.width;
            }
            if (currColumn.width !== null) {
                currColumn.width = newCurrColumnWidth;
            }
            this.resize.info.forEach(function (info) {
                info.column.width = info.column.flex * flexInfo.width / flexInfo.flex;
            });
        }
        this.grid.refreshColSize();
    };
    // -----------------------------------------
    ResizeColumnsPlugin.prototype.createVerticalLine = function () {
        var div = core_1.methodCall(this.grid, "ref", [grid_1.Grid.REFS.GRID]);
        this.line = document.createElement("div");
        this.line.setAttribute("class", "ngrid-head-resize-line");
        div.appendChild(this.line);
    };
    ResizeColumnsPlugin.prototype.cleanVerticalLine = function () {
        this.line = null;
        this.showLine = false;
    };
    ResizeColumnsPlugin.prototype.showVerticalLine = function () {
        if (!this.showLine) {
            this.showLine = true;
            this.line.style.display = "block";
        }
    };
    ResizeColumnsPlugin.prototype.hideVerticalLine = function () {
        if (this.showLine) {
            this.showLine = false;
            this.line.style.display = "none";
        }
    };
    ResizeColumnsPlugin.prototype.mount = function () {
        var head = this.grid.getHead();
        var div = core_1.methodCall(head, "ref", [headgrid_1.HeadGrid.REFS.HEAD]);
        this.createVerticalLine();
        core_1.event.on(div, this.events);
    };
    ResizeColumnsPlugin.prototype.unmount = function () {
        this.cleanVerticalLine();
        core_1.event.off(div, this.events);
    };
    return ResizeColumnsPlugin;
}());
exports.ResizeColumnsPlugin = ResizeColumnsPlugin;


/***/ }),

/***/ "./src/widgets/grid/plugins/supportSticky.ts":
/*!***************************************************!*\
  !*** ./src/widgets/grid/plugins/supportSticky.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// проверка на возможность использования position: sticky
// если нет, то будем использовать самописный полифил
Object.defineProperty(exports, "__esModule", { value: true });
var el = document.createElement("div");
var options = ["", "-webkit-", "-ms-"];
var supportSticky = options.some(function (option) {
    el.style.position = option + "sticky";
    return !!el.style.position;
});
exports.supportSticky = supportSticky;
el = null;
options = null;


/***/ }),

/***/ "./src/widgets/grid/plugins/total/container.ts":
/*!*****************************************************!*\
  !*** ./src/widgets/grid/plugins/total/container.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var headgrid_1 = __webpack_require__(/*! ./../../headgrid/headgrid */ "./src/widgets/grid/headgrid/headgrid.ts");
var viewgrid_1 = __webpack_require__(/*! ./../../viewgrid/viewgrid */ "./src/widgets/grid/viewgrid/viewgrid.ts");
var util_1 = __webpack_require__(/*! ./../../../utils/util */ "./src/widgets/utils/util.ts");
var supportSticky_1 = __webpack_require__(/*! ./../../../grid/plugins/supportSticky */ "./src/widgets/grid/plugins/supportSticky.ts");
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Container_1 = Container;
    Container.prototype.updateTop = function (grid) {
        var view = grid.getView();
        var content = core_1.methodCall(view, "ref", [viewgrid_1.ViewGrid.REFS.CONTENT]);
        var boundContent = content.getBoundingClientRect();
        var wrapWidth = boundContent.width;
        if (view.props.bufferEnable) {
            var rowHeight = view.props.bufferHeight;
            var countRows = util_1.reedProperty(view, "dataList").length;
            var height = rowHeight * countRows;
            if (view.getHeight() < height) {
                wrapWidth -= util_1.getScrollbarSize();
            }
        }
        else {
            if (content.scrollHeight > content.clientHeight) {
                wrapWidth -= util_1.getScrollbarSize();
            }
        }
        this.css(Container_1.REFS.CONTENT, { width: wrapWidth + "px" });
    };
    Container.prototype.refresh = function (grid, onlyInsertOrRemove) {
        this.renderData(grid, onlyInsertOrRemove);
        var view = grid.getView();
        var rowHeight = view.props.bufferHeight;
        var iframeHeight = view.getIframeHeight();
        var top = iframeHeight - rowHeight;
        this.css(Container_1.REFS.WRAP, { top: top + "px" });
    };
    Container.prototype.renderData = function (grid, onlyInsertOrRemove) {
        if (onlyInsertOrRemove) {
            return;
        }
        var body = this.ref(Container_1.REFS.BODY);
        var view = grid.getView();
        var columns = view.props.columns;
        var xtypes = columns.reduce(function (result, column) {
            result[column.id] = column.xtype;
            column.xtype = "totalcolumn";
            return result;
        }, {});
        var item = {
            id: -10,
            list: view.getData()
        };
        core_1.methodCall(view, "renderData", [this, body, { start: 0 }, [item], false]);
        columns.forEach(function (column) {
            column.xtype = xtypes[column.id];
        });
    };
    Container.prototype.beforeInit = function () {
        this.renderedList = [];
        this.renderedHash = {};
    };
    var Container_1;
    Container.REFS = {
        CONTENT: "content",
        WRAP: "wrap",
        TABLE: "table",
        COLS: "cols",
        BODY: "body"
    };
    Container = Container_1 = __decorate([
        core_1.template({
            html: [
                "<div ref=\"wrap\" class=\"npinrow\">",
                "<table ref=\"table\">",
                "<colgroup ref=\"cols\"></colgroup>",
                "<tbody ref=\"body\"></tbody>",
                "</table>",
                "</div>"
            ].join(""),
            root: {
                tagName: "div",
                ref: "content",
                cl: {
                    ngridpinrow: true,
                    ngridtotal: true,
                    sticky: supportSticky_1.supportSticky,
                    fixed: !supportSticky_1.supportSticky
                }
            }
        })
    ], Container);
    return Container;
}(core_1.Component));
exports.Container = Container;
// --------------------------------------------------
headgrid_1.HeadGrid.registerColumn({
    xtype: "totalcolumn",
    renderer: function (info, meta) {
        if (meta.column.totalRenderer) {
            return meta.column.totalRenderer(info.list, meta);
        }
        return "";
    }
});


/***/ }),

/***/ "./src/widgets/grid/plugins/total/totalPlugin.ts":
/*!*******************************************************!*\
  !*** ./src/widgets/grid/plugins/total/totalPlugin.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var viewgrid_1 = __webpack_require__(/*! ../../viewgrid/viewgrid */ "./src/widgets/grid/viewgrid/viewgrid.ts");
var container_1 = __webpack_require__(/*! ./container */ "./src/widgets/grid/plugins/total/container.ts");
var TotalPlugin = /** @class */ (function () {
    function TotalPlugin(props, grid) {
        var _this = this;
        this.grid = grid;
        this.container = new container_1.Container();
        grid.on("onChangeFrameSize", function (gr) {
            // this.container.hide();
            _this.container.updateTop(gr);
        });
        grid.on("onRefresh", function (gr, onlyInsertOrRemove) {
            _this.container.refresh(gr, onlyInsertOrRemove);
        });
        // очень важно!!! для синхронизации с основной таблицей
        var view = this.grid.getView();
        view.addSyncTable(this.container);
    }
    TotalPlugin.prototype.mount = function () {
        var view = this.grid.getView();
        var padding = view.props.bufferHeight - 1;
        var content = core_1.methodCall(view, "ref", [viewgrid_1.ViewGrid.REFS.CONTENT]);
        var container = core_1.methodCall(view, "ref", [viewgrid_1.ViewGrid.REFS.CONTAINER]);
        this.container.appendChild(content);
        container.style.boxSizing = "content-box";
        container.style.paddingBottom = padding + "px";
    };
    TotalPlugin.prototype.unmount = function () {
        this.container.remove();
    };
    return TotalPlugin;
}());
exports.TotalPlugin = TotalPlugin;


/***/ }),

/***/ "./src/widgets/grid/plugins/viewColumns/ViewColumnsPlugin.ts":
/*!*******************************************************************!*\
  !*** ./src/widgets/grid/plugins/viewColumns/ViewColumnsPlugin.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var headgrid_1 = __webpack_require__(/*! ./../../headgrid/headgrid */ "./src/widgets/grid/headgrid/headgrid.ts");
var icons_1 = __webpack_require__(/*! ./../../../icons */ "./src/widgets/icons.ts");
var settingsGrid_1 = __webpack_require__(/*! ./settingsGrid */ "./src/widgets/grid/plugins/viewColumns/settingsGrid.ts");
var util_1 = __webpack_require__(/*! ./../../../utils/util */ "./src/widgets/utils/util.ts");
var util_2 = __webpack_require__(/*! ./../../../utils/util */ "./src/widgets/utils/util.ts");
// ----------------------------------------
var settingsGrid = new settingsGrid_1.SettingsGrid();
var container = document.createElement("div");
var activeMenu = null;
var ignoreHideMenu = false;
var needRender = true;
(function () {
    container.setAttribute("class", "ngrid-setting-columns");
    core_1.event.on(window, {
        mousedown: function () {
            if (ignoreHideMenu) {
                ignoreHideMenu = false;
                return;
            }
            ViewColumnsPlugin.hide();
        }
    });
    core_1.event.on(container, {
        mousedown: function () {
            ignoreHideMenu = true;
        }
    });
})();
var ViewColumnsPlugin = /** @class */ (function () {
    function ViewColumnsPlugin(props, grid) {
        var _this = this;
        this.props = props;
        this.grid = grid;
        if (!util_1.isNumber(props.positionAdditionnalColumn)) {
            props.positionAdditionnalColumn = 0;
        }
        if (!Array.isArray(props.settings)) {
            props.settings = [];
        }
        this.events = {
            click: function (e) {
                _this.showPopup(e);
            }
        };
        this.originalColumns = this.grid.getColumns();
        this.initSettings();
        this.update(this.props.settings);
    }
    ViewColumnsPlugin.hide = function () {
        if (activeMenu !== null) {
            activeMenu.hidePopup();
        }
    };
    ViewColumnsPlugin.prototype.showPopup = function (e) {
        if (needRender) {
            needRender = false;
            document.body.appendChild(container);
            settingsGrid.appendChild(container);
        }
        var height = settingsGrid.getView().props.bufferHeight;
        var dataGrid = this.originalColumns.filter(function (column) {
            return column.settings.allowSetting;
        }).map(function (column) {
            return {
                id: column.dataIndex,
                name: column.text,
                allowAdditional: column.settings.allowAdditional,
                allowDraggable: column.settings.allowDraggable,
                additional: column.settings.additional,
                hidden: column.settings.hidden
            };
        });
        settingsGrid.setHeight(dataGrid.length * height + 1);
        settingsGrid.loadData(dataGrid);
        container.style.display = "block";
        activeMenu = this;
        this.updatePosition(e);
    };
    ViewColumnsPlugin.prototype.hidePopup = function () {
        if (activeMenu === this) {
            container.style.display = "none";
            activeMenu = null;
            var data_1 = settingsGrid.getData();
            var settings = data_1.map(function (item) {
                return {
                    column: item.id,
                    additional: item.additional,
                    hidden: item.hidden
                };
            });
            this.update(settings);
        }
    };
    ViewColumnsPlugin.prototype.updatePosition = function (e) {
        var bound = this.view.getBoundingClientRect();
        var coord = { x: e.clientX, y: e.clientY };
        var size = { width: bound.width, height: bound.height };
        coord = util_2.correctionCoordinate(coord, size);
        container.style.left = coord.x + "px";
        container.style.top = coord.y + "px";
    };
    ViewColumnsPlugin.prototype.initSettings = function () {
        this.originalColumns.forEach(function (column) {
            if (!column.hasOwnProperty("settings")) {
                column.settings = {};
            }
            var settings = column.settings; // настройки колонки
            settings.access = settings.access !== false; // default: true
            settings.allowSetting = settings.allowSetting === true; // default: false
            settings.allowAdditional = settings.allowAdditional === true; // default: false
            settings.allowDraggable = settings.allowDraggable === true; // default: false
            settings.additional = settings.allowAdditional ? settings.additional === true : false; // default: false
            settings.hidden = settings.hidden === true; // default: false
        });
    };
    ViewColumnsPlugin.prototype.update = function (settings) {
        this.modityColumns = this.originalColumns.filter(function (column) {
            return column.settings.access;
        });
        this.updateSettings(settings);
        this.updateSort(settings);
        this.updateProps();
        this.updateColumnList();
        this.grid.reconfigure(this.grid.props.columns);
    };
    ViewColumnsPlugin.prototype.updateSettings = function (s) {
        var settingsHash = util_1.arrayToObject(s, function (setting) { return setting.column; });
        this.modityColumns.forEach(function (column) {
            var name = column.dataIndex;
            if (settingsHash.hasOwnProperty(name)) {
                var settings = column.settings; // настройки колонки
                var customSettings = settingsHash[name]; // кастомные настройки
                if (settings.allowAdditional && customSettings.hasOwnProperty("additional")) {
                    settings.additional = customSettings.additional;
                }
                if (customSettings.hasOwnProperty("hidden")) {
                    settings.hidden = customSettings.hidden;
                }
            }
        });
    };
    ViewColumnsPlugin.prototype.updateSort = function (settings) {
        settings.forEach(function (setting, index) {
            // 1
        });
    };
    ViewColumnsPlugin.prototype.updateProps = function () {
        this.props.settings = this.modityColumns.map(function (column) {
            return {
                column: column.dataIndex,
                additional: column.settings.additional,
                hidden: column.settings.hidden
            };
        });
    };
    ViewColumnsPlugin.prototype.updateColumnList = function () {
        this.additionalColumns = this.modityColumns.filter(function (column) {
            return column.settings.additional;
        });
        this.modityColumns = this.modityColumns.filter(function (column) {
            return !column.settings.hidden && !column.settings.additional;
        });
        if (this.additionalColumns.length > 0) {
            var additionalColumn = this.createAdditionalColumn();
            var positionFromEnd = this.modityColumns.length - this.props.positionAdditionnalColumn;
            if (positionFromEnd < 0) {
                positionFromEnd = 0;
            }
            this.modityColumns.splice(positionFromEnd, 0, additionalColumn);
        }
        this.grid.getHead().props.columns = this.modityColumns;
        this.grid.props.columns = this.modityColumns;
    };
    ViewColumnsPlugin.prototype.createAdditionalColumn = function () {
        return {
            text: icons_1.createIcon(icons_1.ICONS.ADDITIONAL),
            dataIndex: "pluginadditionalcolumn",
            cls: "icon-header",
            tdCls: {
                "icon-cell": true
            },
            tooltip: "Настройка колонок",
            sortable: false,
            resizable: false,
            width: 29,
            renderer: function (value, meta, item) {
                if (item.leaf) {
                    return icons_1.createIcon(icons_1.ICONS.ADDITIONAL); // , "setting-columns-icon"
                }
                return "";
            }
        };
    };
    ViewColumnsPlugin.prototype.mount = function () {
        this.initView();
        this.bindEvent();
    };
    ViewColumnsPlugin.prototype.unmount = function () {
        this.unbindEvent();
        this.cleanView();
    };
    ViewColumnsPlugin.prototype.initView = function () {
        var head = this.grid.getHead();
        var div = core_1.methodCall(head, "ref", [headgrid_1.HeadGrid.REFS.HEAD]);
        this.view = document.createElement("div");
        this.view.setAttribute("class", "setting-columns");
        this.view.innerHTML = icons_1.createIcon(icons_1.ICONS.SETTINGS, "setting-columns-icon");
        div.appendChild(this.view);
    };
    ViewColumnsPlugin.prototype.cleanView = function () {
        this.view = null;
    };
    ViewColumnsPlugin.prototype.bindEvent = function () {
        core_1.event.on(this.view, this.events);
    };
    ViewColumnsPlugin.prototype.unbindEvent = function () {
        core_1.event.off(this.view, this.events);
    };
    return ViewColumnsPlugin;
}());
exports.ViewColumnsPlugin = ViewColumnsPlugin;


/***/ }),

/***/ "./src/widgets/grid/plugins/viewColumns/settingsGrid.ts":
/*!**************************************************************!*\
  !*** ./src/widgets/grid/plugins/viewColumns/settingsGrid.ts ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var grid_1 = __webpack_require__(/*! ./../../grid */ "./src/widgets/grid/grid.ts");
var icons_1 = __webpack_require__(/*! ./../../../icons */ "./src/widgets/icons.ts");
var SettingsGrid = /** @class */ (function (_super) {
    __extends(SettingsGrid, _super);
    function SettingsGrid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SettingsGrid.prototype.beforeInit = function () {
        _super.prototype.beforeInit.call(this);
        this.props.bufferEnable = false;
        this.props.hideHead = true;
        this.props.plugins = [{
                type: "dragDropGrid"
            }];
        this.props.columns = [{
                width: 29,
                dataIndex: "checkbox",
                tdCls: {
                    "ngrid-setting-columns-checkbox": true
                },
                renderer: function (value, meta, data) {
                    var iconId;
                    if (data.additional) {
                        iconId = icons_1.ICONS.CHECKBOX_SQUARE;
                    }
                    else {
                        iconId = data.hidden ? icons_1.ICONS.CHECKBOX : icons_1.ICONS.CHECKBOX_CHECKED;
                    }
                    return icons_1.createIcon(iconId);
                }
            }, {
                flex: 1,
                dataIndex: "name",
                renderer: function (value, meta, data) {
                    return value;
                }
            }];
        // добавляем события
        function cellMouseDown_Grid(grid, td, columnIndex, data, tr, rowIndex, event, column) {
            if (column.dataIndex === "checkbox") {
                if (data.additional) {
                    data.additional = false;
                    data.hidden = true;
                }
                else {
                    if (data.hidden) {
                        data.hidden = false;
                        data.additional = false;
                    }
                    else {
                        if (data.allowAdditional) {
                            data.hidden = false;
                            data.additional = true;
                        }
                        else {
                            data.hidden = true;
                            data.additional = false;
                        }
                    }
                }
            }
            grid.refresh();
        }
        this.on("onCellMouseDown", cellMouseDown_Grid);
    };
    return SettingsGrid;
}(grid_1.Grid));
exports.SettingsGrid = SettingsGrid;


/***/ }),

/***/ "./src/widgets/grid/viewgrid/viewgrid.html":
/*!*************************************************!*\
  !*** ./src/widgets/grid/viewgrid/viewgrid.html ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div ref=\"content\" class=\"ngrid-content\">\n    <iframe ref=\"iframe\" src=\"\" class=\"ngrid-iframe\"></iframe>\n    <div ref=\"container\" class=\"container\">\n        <div ref=\"wrap\" class=\"wrap\">\n            <table ref=\"table\">\n                <colgroup ref=\"cols\"></colgroup>\n                <tbody ref=\"body\"></tbody>\n            </table>\n        </div>\n    </div>\n</div>";

/***/ }),

/***/ "./src/widgets/grid/viewgrid/viewgrid.ts":
/*!***********************************************!*\
  !*** ./src/widgets/grid/viewgrid/viewgrid.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var core_2 = __webpack_require__(/*! core */ "./src/core/index.ts");
var core_3 = __webpack_require__(/*! core */ "./src/core/index.ts");
var headgrid_1 = __webpack_require__(/*! ../headgrid/headgrid */ "./src/widgets/grid/headgrid/headgrid.ts");
var util_1 = __webpack_require__(/*! ./../../utils/util */ "./src/widgets/utils/util.ts");
var util_2 = __webpack_require__(/*! ./../../utils/util */ "./src/widgets/utils/util.ts");
var ViewGrid = /** @class */ (function (_super) {
    __extends(ViewGrid, _super);
    function ViewGrid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ViewGrid_1 = ViewGrid;
    // загружает данные в таблицу
    ViewGrid.prototype.loadData = function (data) {
        var _this = this;
        this.rawList = data || [];
        this.rawHash = {};
        data.forEach(function (item) {
            var idRow = _this.props.getId(item);
            _this.rawHash[idRow] = item;
        });
        this.refresh();
    };
    ViewGrid.prototype.getData = function () {
        return this.rawList;
    };
    // получает модель данных по id
    ViewGrid.prototype.getRowById = function (id) {
        if (this.rawHash.hasOwnProperty(id)) {
            return this.rawHash[id];
        }
        return null;
    };
    // получает ширину View
    ViewGrid.prototype.getWidth = function () {
        return this.width;
    };
    // получает высоту View
    ViewGrid.prototype.getHeight = function () {
        return this.height;
    };
    // получает ширину iframe
    ViewGrid.prototype.getIframeWidth = function () {
        return this.iframeHeight;
    };
    // получает высоту iframe
    ViewGrid.prototype.getIframeHeight = function () {
        return this.iframeHeight;
    };
    // возвращает список выбранных строк
    ViewGrid.prototype.getSelected = function () {
        return this.selectedList;
    };
    // устанавливает выделенные строки
    ViewGrid.prototype.doSelect = function (data, inversion) {
        var _this = this;
        if (inversion === void 0) { inversion = false; }
        // строки которые нужно выделить
        var toSelect = [];
        // строки с которых нужно снять выделение
        var toDeselect = [];
        // новый список с выделеными строками
        var selectedList = [];
        var selectedHash = {};
        // если передали не массив строк
        if (!Array.isArray(data)) {
            data = [data];
        }
        // инверсия выделения
        if (inversion) {
            // inversion - инверсия строк
            // если строка была выделена, то снимем выделение
            // если строка не выделена, то выделим ее
            data.forEach(function (item) {
                var idRow = _this.props.getId(item);
                if (_this.selectedHash.hasOwnProperty(idRow)) {
                    toDeselect.push(item);
                }
                else {
                    toSelect.push(item);
                }
            });
        }
        else {
            // сфоррмируем hash таблицу со строками, которые нужно выделить
            var dataHash_1 = util_1.arrayToObject(data, function (item) { return _this.props.getId(item); });
            // если в существующем списке нет строк которые есть в новом списке, то добавим их
            data.forEach(function (item) {
                var idRow = _this.props.getId(item);
                if (!_this.selectedHash.hasOwnProperty(idRow)) {
                    toSelect.push(item);
                }
            });
            // если в существующем списке есть строки которых нет в новом списке, то уберем их
            this.selectedList.forEach(function (item) {
                var idRow = _this.props.getId(item);
                if (!dataHash_1.hasOwnProperty(idRow)) {
                    toDeselect.push(item);
                }
            });
        }
        // если изменений нет, выходим
        if (toSelect.length === 0 && toDeselect.length === 0) {
            return;
        }
        // формирование массива selected
        var toDeselectHash = util_1.arrayToObject(toDeselect, function (item) { return _this.props.getId(item); });
        this.selectedList.forEach(function (item) {
            var idRow = _this.props.getId(item);
            if (!toDeselectHash.hasOwnProperty(idRow)) {
                selectedHash[idRow] = selectedList.length;
                selectedList.push(item);
            }
        });
        toSelect.forEach(function (item) {
            var idRow = _this.props.getId(item);
            selectedHash[idRow] = selectedList.length;
            selectedList.push(item);
        });
        // вызов событий
        var isManyDeselect = this.fireManyEvents(toDeselect, "onBeforeDeselect", true);
        var isManySelect = this.fireManyEvents(toSelect, "onBeforeSelect", true);
        if (isManyDeselect && isManySelect) {
            // сохраним новый список с выбранными строками
            this.selectedList = selectedList;
            this.selectedHash = selectedHash;
            this.fireManyEvents(toDeselect, "onDeselect", false);
            this.fireManyEvents(toSelect, "onSelect", false);
            this.parent.emit("onSelectionChange", selectedList);
            // обновим нашу таблицу
            this.refresh();
        }
    };
    // проверяет находится ли строка в области видимости
    ViewGrid.prototype.isVisibleRow = function (data) {
        return this.getVisibleInfo(data).inRange;
    };
    // устанавливает скролл на указанную позицию
    ViewGrid.prototype.scrollTo = function (scrollTop, scrollLeft) {
        var content = this.ref(ViewGrid_1.REFS.CONTENT);
        if (!util_1.isNumber(scrollTop)) {
            scrollTop = content.scrollTop;
        }
        if (!util_1.isNumber(scrollLeft)) {
            scrollLeft = content.scrollLeft;
        }
        content.scrollTo(scrollLeft, scrollTop);
    };
    // устанавливает скролл на указанную запись
    // если запись находится в зоне видимости
    // то метод ничего делать не будет
    // isTop - прикреплять снизу или сверху
    ViewGrid.prototype.scrollBy = function (data, isTop) {
        if (isTop === void 0) { isTop = true; }
        var info = this.getVisibleInfo(data);
        // находится в зоне видимости - выходим
        if (info.inRange || info.index === null) {
            return;
        }
        var rowHeight = this.props.bufferHeight;
        var scrollTop = info.index * rowHeight;
        if (isTop) {
            scrollTop -= info.shiftTop * rowHeight;
        }
        else {
            scrollTop -= this.height - rowHeight;
            scrollTop -= info.shiftBottom * rowHeight;
        }
        this.scrollTo(scrollTop);
    };
    // устанавливает чек в таблице
    ViewGrid.prototype.setCheck = function (data, checked) {
        var grid = this.parent;
        data.checked = checked; // TODO
        this.refresh();
        grid.emit("onCheckChange", data, checked);
    };
    // обновляет таблицу
    ViewGrid.prototype.refresh = function () {
        if (this.isRendered()) {
            this.onDelayRefresh();
        }
    };
    // находит модель данных по NODE узлу
    ViewGrid.prototype.getRecordByEl = function (el) {
        var nodeTr = util_1.findParentNode(el, "tr", this.ref(ViewGrid_1.REFS.DATA));
        if (nodeTr) {
            var idRow = nodeTr.getAttribute("data-row");
            if (this.dataHash.hasOwnProperty(idRow)) {
                var index = this.dataHash[idRow];
                return this.dataList[index];
            }
        }
        return null;
    };
    // обновляет строку у таблицы по записи
    ViewGrid.prototype.updateRowByData = function (data) {
        var idRow = this.props.getId(data);
        this.updateRowById(idRow);
    };
    // обновляет строку у таблицы по id
    ViewGrid.prototype.updateRowById = function (idRow) {
        if (this.renderedHash.hasOwnProperty(idRow)) {
            var index = this.renderedHash[idRow];
            var row = this.renderedList[index];
            this.renderRow(row);
        }
    };
    // можно переопределить внутри плагина. по умолчанию мы ничего не регулируем
    ViewGrid.prototype.regulateRange = function (range) {
        return {
            start: range.start,
            finish: range.finish
        };
    };
    // возвращает информацию по записи
    // находится ли она в зоне видимости или нет
    // на какой позиции (index)
    ViewGrid.prototype.getVisibleInfo = function (data) {
        var range = this.findVisibleRange();
        var idRow = this.props.getId(data);
        // для плагинов. этот метод может быть переопределен
        var info = this.regulateRange(range);
        // смещение сверху и снизу
        info.shiftTop = info.start - range.start;
        info.shiftBottom = range.finish - info.finish;
        // позиция записи и находится ли она в области видимости
        info.index = null;
        info.inRange = false;
        if (this.dataHash.hasOwnProperty(idRow)) {
            info.index = this.dataHash[idRow];
            if (info.start <= info.index && info.index < info.finish) {
                info.inRange = true;
            }
        }
        return info;
    };
    // отложенный вызов обновления размеров таблицы
    ViewGrid.prototype.asyncUpdateSize = function () {
        var _this = this;
        this.parent.emit("onChangeFrameSize");
        if (this.resizeTimer === null) {
            this.resizeTimer = window.setTimeout(function () {
                _this.resizeTimer = null;
                _this.updateSize();
            }, 100);
        }
    };
    // обновление размеров таблицы
    ViewGrid.prototype.updateSize = function () {
        var head = this.parent.getHead();
        var content = this.ref(ViewGrid_1.REFS.CONTENT);
        var boundContent = content.getBoundingClientRect();
        if (boundContent.width === 0 && boundContent.height === 0) {
            this.setDirty(true);
            return;
        }
        // если изменились размеры фрейма
        var changeSize = this.width !== boundContent.width || this.height !== boundContent.height;
        // если мы пытались вызвать рефреш, когда таблица была спрятана
        var shouldRefresh = this.dirty;
        // бага в ФФ. когда у таблицы стоит display: none,
        // а потом display: block, scrollTop слетает в 0
        var changeScrollTop = this.scrollTop !== content.scrollTop;
        if (changeSize || shouldRefresh || changeScrollTop) {
            this.width = boundContent.width;
            this.height = boundContent.height;
            var iframe = this.ref(ViewGrid_1.REFS.IFRAME);
            var boundIframe = iframe.getBoundingClientRect();
            this.iframeWidth = boundIframe.width;
            this.iframeHeight = boundIframe.height;
            // бага в ФФ. восстановим позицию слетевшего скрола
            if (changeScrollTop) {
                content.scrollTop = this.scrollTop;
            }
            this.parent.emit("onChangeViewSize", this.width, this.height);
            if (this.dirty) {
                this.setDirty(false);
            }
            head.refreshColSize();
        }
    };
    // добавляет для компонент синхронизации
    ViewGrid.prototype.addSyncTable = function (syncTable) {
        this.syncTableList.push(syncTable);
    };
    // получает список компонентов для синхронизации
    ViewGrid.prototype.getSyncTableList = function () {
        return this.syncTableList;
    };
    // обновляет таблицу с задержкой
    ViewGrid.prototype.onDelayRefresh = function () {
        var _this = this;
        if (this.refreshTimer === null) {
            this.refreshTimer = window.setTimeout(function () {
                _this.refreshTimer = null;
                // выполним обновление
                _this.executeRefresh();
            }, 1);
        }
    };
    // обновляет список для рендеринга и производит рендеринг
    ViewGrid.prototype.executeRefresh = function () {
        this.updateListRender();
        if (this.isRendered()) {
            this.viewRefresh(false);
        }
    };
    // обновляет контент таблицы
    // onlyInsertOrRemove - делать проверку только на добавление \ удаление
    //                      игнорировать проверку изменений
    ViewGrid.prototype.viewRefresh = function (onlyInsertOrRemove) {
        // если ширина и высота таблицы равна по нулям, то скорее всего она скрыта
        // ее нужно пометить как "грязную" и прекратить refresh
        if (!this.width && !this.height) {
            this.setDirty(true);
            return;
        }
        // обновим позицию скрола
        this.renderScrollTop = this.scrollTop;
        this.renderScrollLeft = this.scrollLeft;
        var body = this.ref(ViewGrid_1.REFS.BODY);
        var range = this.findDisplayRange();
        var dataList = this.getRenderList(range);
        this.updateHeightContainer();
        this.updatePositionContainer(range);
        this.updateEmptyRow(body, dataList.length);
        this.renderData(this, body, range, dataList, onlyInsertOrRemove);
        this.updateTableWidth();
        this.updateScrollBar();
        this.parent.emit("onRefresh", onlyInsertOrRemove);
    };
    // обновляет контент у таблицы
    // context - context
    // body - контейнер куда вставлять новые записи
    // range - диапазон "с" "по" записей которые нужно прорендерить
    // dataList - список record'ов которые нужно прорендерить
    // onlyInsertOrRemove - простое обновление, игнорировать update row
    ViewGrid.prototype.renderData = function (context, body, range, dataList, onlyInsertOrRemove) {
        var _this = this;
        var currRenderedList = context.renderedList;
        var currRenderedHash = context.renderedHash;
        var nextRenderedList;
        var nextRenderedHash = {};
        var index = 0;
        dataList = dataList.filter(function (item) {
            var idRow = _this.props.getId(item);
            // защита, чтобы небыло дублированных ключей из за этого падает таблица
            if (nextRenderedHash.hasOwnProperty(idRow)) {
                _this.printError(idRow, dataList);
                return false;
            }
            nextRenderedHash[idRow] = index++;
            return true;
        });
        // создадим новый контент
        nextRenderedList = dataList.map(function (item, i) {
            var idRow = _this.props.getId(item);
            var selected = _this.selectedHash.hasOwnProperty(idRow);
            var row;
            if (currRenderedHash.hasOwnProperty(idRow)) {
                row = currRenderedList[currRenderedHash[idRow]];
                row.idRow = idRow;
                row.data = item;
                row.selected = selected;
                row.index = range.start + i;
                if (onlyInsertOrRemove) {
                    return row;
                }
                _this.renderRow(row);
                return row;
            }
            row = {
                idRow: idRow,
                data: item,
                selected: selected,
                index: range.start + i,
                dataCells: { id: null, children: [] },
                node: document.createElement("tr")
            };
            _this.renderRow(row);
            return row;
        });
        // ------------------------------
        // найдем изменения и применим их
        // удалим все не нужные ноды
        currRenderedList.forEach(function (currRow) {
            if (!nextRenderedHash.hasOwnProperty(currRow.idRow)) {
                currRow.node.parentNode.removeChild(currRow.node);
                currRow.node = null;
            }
        });
        // добавим все необходимые ноды или
        // переместим их (допустим при сортировке)
        nextRenderedList.forEach(function (nextRow, i) {
            if (i < body.children.length) {
                var node = body.children[i];
                if (nextRow.node !== node) {
                    body.insertBefore(nextRow.node, node);
                }
            }
            else {
                body.appendChild(nextRow.node);
            }
        });
        // сохраним новое состояние для следующего использования
        context.renderedList = nextRenderedList;
        context.renderedHash = nextRenderedHash;
    };
    // обновляет список записей для рендера, он может поменятся
    // допустим применив сортировку или фильтры в сторе
    ViewGrid.prototype.updateListRender = function () {
        var _this = this;
        this.dataList = [];
        this.dataHash = {};
        this.rawList.forEach(function (item) {
            var idRow = _this.props.getId(item);
            _this.dataList.push(item);
            _this.dataHash[idRow] = item;
        });
    };
    // --------------------------------
    ViewGrid.prototype.beforeInit = function () {
        var _this = this;
        var props = this.props;
        if (typeof props.multiSelect !== "boolean") {
            props.multiSelect = false;
        }
        if (typeof props.emptyRowText !== "string") {
            props.emptyRowText = "Нет данных для отображения.";
        }
        if (typeof props.bufferEnable !== "boolean") {
            props.bufferEnable = true;
        }
        if (typeof props.bufferHeight !== "number") {
            props.bufferHeight = 29;
        }
        if (typeof props.bufferStock !== "number") {
            props.bufferStock = 10;
        }
        if (typeof props.bufferScrollMin !== "number") {
            props.bufferScrollMin = 250;
        }
        this.dataList = [];
        this.dataHash = {};
        this.renderedList = [];
        this.renderedHash = {};
        this.selectedList = [];
        this.selectedHash = {};
        this.resizeTimer = null;
        this.refreshTimer = null;
        this.dirty = false;
        this.syncTableList = [];
        this.showingEmptyRow = false;
        this.emptyRowColsLn = null;
        this.scrollTop = 0;
        this.scrollLeft = 0;
        this.renderScrollTop = 0;
        this.renderScrollLeft = 0;
        this.width = null;
        this.height = null;
        this.iframeWidth = null;
        this.iframeHeight = null;
        this.mouseX = null;
        this.mouseY = null;
        this.warnings = {};
        this.listenersFrame = {
            resize: function () {
                _this.asyncUpdateSize();
            }
        };
    };
    // вызывается перед рендерингом
    ViewGrid.prototype.beforeMount = function () {
        util_2.injectScrollbarInfo();
    };
    // вызывается после рендеринга
    ViewGrid.prototype.afterMount = function () {
        var iframe = this.ref(ViewGrid_1.REFS.IFRAME);
        if (iframe.contentWindow) {
            core_2.event.on(iframe.contentWindow, this.listenersFrame);
        }
        else {
            console.error("contentWindow not found!");
        }
    };
    // вызывается перед демонтированием
    ViewGrid.prototype.beforeUnmount = function () {
        var iframe = this.ref(ViewGrid_1.REFS.IFRAME);
        core_2.event.off(iframe.contentWindow, this.listenersFrame);
        if (this.resizeTimer !== null) {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = null;
        }
        if (this.refreshTimer !== null) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    };
    // устанавливает компонент в состояние "грязный", что говорит о том что его нужно прорефрешить
    ViewGrid.prototype.setDirty = function (dirty) {
        // исскуственно изменяем размеры чтобы сработало событие resize
        this.css(ViewGrid_1.REFS.IFRAME, {
            width: dirty ? "10%" : "",
            height: dirty ? "10%" : ""
        });
        this.dirty = dirty;
    };
    // --------------------------------
    // добавляет строку, если данных в таблице нет
    ViewGrid.prototype.updateEmptyRow = function (body, dataListLn) {
        var columnsLn = this.props.columns.length;
        var tr;
        if (this.showingEmptyRow) {
            // удаляем строчку, если данные появились
            if (dataListLn > 0) {
                this.showingEmptyRow = false;
                body.removeChild(body.children[0]);
            }
            else {
                core_3.dom.attr(body.children[0], {
                    colspan: this.emptyRowColsLn.toString()
                }, {
                    colspan: columnsLn.toString()
                }, false);
                this.emptyRowColsLn = columnsLn;
            }
        }
        else {
            // добавляем строчку, если данные отсутствуют
            if (dataListLn === 0) {
                this.showingEmptyRow = true;
                this.emptyRowColsLn = columnsLn;
                tr = document.createElement("tr");
                body.appendChild(tr);
                var emptyRow = {
                    id: null,
                    children: [{
                            id: 1,
                            name: "td",
                            attr: { colspan: columnsLn.toString() },
                            cl: { "row-empty": true },
                            text: this.props.emptyRowText
                        }]
                };
                core_3.dom.update(tr, {}, emptyRow);
            }
        }
    };
    // обновляет высоту общего контейнера
    // если включена функция отображения видимой части таблицы
    ViewGrid.prototype.updateHeightContainer = function () {
        var height = "";
        if (this.props.bufferEnable) {
            var rowHeight = this.props.bufferHeight;
            var countRows = this.dataList.length;
            height = rowHeight * countRows + "px";
        }
        this.css(ViewGrid_1.REFS.CONTAINER, { height: height });
    };
    // обновляет отступ внутреннего контейнера
    // если включена функция отображения видимой части таблицы
    ViewGrid.prototype.updatePositionContainer = function (range) {
        var position = "";
        if (this.props.bufferEnable) {
            var rowHeight = this.props.bufferHeight;
            var countRows = this.dataList.length;
            position = range.start * rowHeight + "px";
        }
        this.css(ViewGrid_1.REFS.WRAP, { top: position });
    };
    // обновляет показ\скрытие отступа в шапке таблице
    // если в контенте есть\нет скролла
    ViewGrid.prototype.updateScrollBar = function () {
        var wrapWidth = this.width;
        if (this.props.bufferEnable) {
            var rowHeight = this.props.bufferHeight;
            var countRows = this.dataList.length;
            var height = rowHeight * countRows;
            if (this.getHeight() < height) {
                wrapWidth -= util_2.getScrollbarSize();
            }
        }
        else {
            var content = this.ref(ViewGrid_1.REFS.CONTENT);
            if (content.scrollHeight > content.clientHeight) {
                wrapWidth -= util_2.getScrollbarSize();
            }
        }
        if (wrapWidth > 0) {
            var syncTableList = this.getSyncTableList();
            var refName_1 = ViewGrid_1.REFS.CONTENT;
            var width_1 = wrapWidth + "px";
            syncTableList.forEach(function (instance) {
                var ref = instance.$internal.refs[refName_1];
                if (ref) {
                    core_3.dom.css(ref.node, ref.dom.css, { width: width_1 }, false);
                }
            });
        }
    };
    // растягивает таблицу на 100% если хотябы в одной из колонок
    // задана настройка flex (растянуть на всю ширину)
    ViewGrid.prototype.updateTableWidth = function () {
        var syncTableList = this.getSyncTableList();
        var grid = this.parent;
        var head = grid.getHead();
        var width = head.isUseFlex() ? "100%" : "";
        var refName = ViewGrid_1.REFS.TABLE;
        this.css(refName, { width: width });
        syncTableList.forEach(function (instance) {
            var ref = instance.$internal.refs[refName];
            if (ref) {
                core_3.dom.css(ref.node, ref.dom.css, { width: width }, false);
            }
        });
    };
    // находит диапазон записей, которые нужно прорендерить
    ViewGrid.prototype.findDisplayRange = function () {
        if (!this.props.bufferEnable) {
            return {
                start: 0,
                finish: this.dataList.length
            };
        }
        var range = this.findVisibleRange();
        // делаем запас
        range.start -= this.props.bufferStock;
        range.finish += this.props.bufferStock;
        if (range.start < 0) {
            range.start = 0;
        }
        if (range.finish > this.dataList.length) {
            range.finish = this.dataList.length;
        }
        return range;
    };
    // находит видимый диапазон записей таблицы
    // если строка не помещается хотябы на 1px то
    // эту строку считаем как за пределами видимости
    ViewGrid.prototype.findVisibleRange = function () {
        var scrollTop = this.scrollTop;
        var rowHeight = this.props.bufferHeight;
        var countRows = this.dataList.length;
        var height = this.height;
        // huck
        var maxScroll = rowHeight * countRows - height;
        if (scrollTop > maxScroll) {
            scrollTop = maxScroll;
        }
        var start = Math.ceil(scrollTop / rowHeight);
        var finish = Math.floor((scrollTop + height) / rowHeight);
        if (finish > countRows) {
            finish = countRows;
        }
        return { start: start, finish: finish };
    };
    // получает список записей, которые нужно прорендерить
    ViewGrid.prototype.getRenderList = function (range) {
        var result = [];
        for (var i = range.start; i < range.finish; ++i) {
            result.push(this.dataList[i]);
        }
        return result;
    };
    // формирует контент для строки
    ViewGrid.prototype.getDataCells = function (row, columns, defaultMeta) {
        var _this = this;
        return columns.map(function (column, index) {
            var value;
            var meta = {
                view: _this.parent,
                row: row,
                column: column,
                data: row.data,
                attr: { "data-index": index.toString() },
                cl: { "ngrid-cell": true },
                css: {}
            };
            if (defaultMeta) {
                for (var key in defaultMeta) {
                    if (defaultMeta.hasOwnProperty(key)) {
                        meta[key] = defaultMeta[key];
                    }
                }
            }
            try {
                value = headgrid_1.HeadGrid.columns[column.xtype].renderer(row.data, meta);
                if (value === "" || value === undefined || value === null) {
                    value = "&nbsp;";
                }
            }
            catch (e) {
                value = "&nbsp;";
                console.error(e);
            }
            if (column.align) {
                meta.cl["row-" + column.align] = true;
            }
            if (column.tdCls) {
                core_2.merge(meta.cl, column.tdCls);
            }
            return {
                id: column.id,
                name: "td",
                attr: meta.attr,
                cl: meta.cl,
                css: meta.css,
                text: value
            };
        });
    };
    // рендерит строку
    ViewGrid.prototype.renderRow = function (row) {
        var columns = this.props.columns;
        var currCells = row.dataCells;
        var nextCells = {
            id: null,
            attr: { "data-row": row.idRow },
            cl: { "row-selected": row.selected },
            children: this.getDataCells(row, columns, null)
        };
        core_3.dom.update(row.node, currCells, nextCells);
        row.dataCells = nextCells;
    };
    // при изменении вертикального скролла
    ViewGrid.prototype.changeScrollTop = function () {
        // если буферизация выключена, выходим
        if (this.props.bufferEnable) {
            if (Math.abs(this.renderScrollTop - this.scrollTop) > this.props.bufferScrollMin) {
                this.viewRefresh(true);
            }
        }
    };
    // при изменении горизонтального скролла
    ViewGrid.prototype.changeScrollLeft = function () {
        var syncTableList = this.getSyncTableList();
        var content = this.ref(ViewGrid_1.REFS.CONTENT);
        var left = "-" + content.scrollLeft + "px";
        var refName = ViewGrid_1.REFS.TABLE;
        this.scrollLeft = content.scrollLeft;
        syncTableList.forEach(function (instance) {
            var ref = instance.$internal.refs[refName];
            if (ref) {
                core_3.dom.css(ref.node, ref.dom.css, { left: left }, false);
            }
        });
    };
    // --------------------------------------------------------
    // bind events
    ViewGrid.prototype.onScroll = function () {
        var content = this.ref(ViewGrid_1.REFS.CONTENT);
        if (this.scrollTop !== content.scrollTop) {
            this.scrollTop = content.scrollTop;
            this.changeScrollTop();
        }
        if (this.scrollLeft !== content.scrollLeft) {
            this.scrollLeft = content.scrollLeft;
            this.changeScrollLeft();
        }
        this.parent.emit("onScroll", content.scrollTop, content.scrollLeft);
    };
    ViewGrid.prototype.onMouseDown = function (e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.processEvent(e, "MouseDown", this.ref(ViewGrid_1.REFS.WRAP), false);
    };
    ViewGrid.prototype.onMouseUp = function (e) {
        this.processEvent(e, "MouseUp", this.ref(ViewGrid_1.REFS.WRAP), false);
    };
    ViewGrid.prototype.onMouseMove = function (e) {
        this.processEvent(e, "MouseMove", this.ref(ViewGrid_1.REFS.WRAP), false);
    };
    ViewGrid.prototype.onClick = function (e) {
        this.processEvent(e, "Click", this.ref(ViewGrid_1.REFS.WRAP), true);
    };
    ViewGrid.prototype.onDblClick = function (e) {
        this.processEvent(e, "Dblclick", this.ref(ViewGrid_1.REFS.WRAP), true);
    };
    // --------------------------------------------------------
    /* tslint:disable:max-line-length */
    ViewGrid.prototype.processEvent = function (e, eventName, rootNode, needCheckAccuracy) {
        var nodeTd = util_1.findParentNode(e.target, "td", rootNode);
        var nodeTr = util_1.findParentNode(nodeTd, "tr", rootNode);
        if (nodeTr && nodeTd) {
            var idRow = nodeTr.getAttribute("data-row");
            var index = nodeTd.getAttribute("data-index");
            if (this.renderedHash.hasOwnProperty(idRow)) {
                var grid_1 = this.parent;
                var column = this.props.columns[index];
                var row = this.renderedList[this.renderedHash[idRow]];
                if (needCheckAccuracy && column.accuracyClick) {
                    if (this.mouseX !== e.clientX || this.mouseY !== e.clientY) {
                        return;
                    }
                }
                if (grid_1.emit("onBeforeCell" + eventName, nodeTd, index, row.data, nodeTr, row.index, e, column) !== false) {
                    grid_1.emit("onCell" + eventName, nodeTd, index, row.data, nodeTr, row.index, e, column);
                    if (grid_1.emit("onBeforeItem" + eventName, row.data, nodeTr, row.index, e) !== false) {
                        grid_1.emit("onItem" + eventName, row.data, nodeTr, row.index, e);
                    }
                }
            }
        }
    };
    /* tslint:enable:max-line-length */
    // --------------------------------------------------------
    // выводит сообщение об ошибке, когда пытаются прорендерить 2+ записи с одинаковым id
    ViewGrid.prototype.printError = function (idRow, dataList) {
        var _this = this;
        // чтобы не хламить уведомления в консоли, будем выводить один раз
        if (!this.warnings.hasOwnProperty(idRow)) {
            this.warnings[idRow] = true;
            console.error("found row with the same key (" + idRow + ")! record will not be displayed!");
            dataList.forEach(function (item) {
                var itemIdRow = _this.props.getId(item);
                if (idRow === itemIdRow) {
                    console.error(item);
                }
            });
        }
    };
    ViewGrid.prototype.fireManyEvents = function (data, eventName, stopEvent) {
        var ln = data.length;
        var successFireEvent;
        var grid = this.parent;
        for (var i = 0; i < ln; ++i) {
            successFireEvent = grid.emit(eventName, grid, data[i]) !== false;
            if (stopEvent && !successFireEvent) {
                return false;
            }
        }
        return true;
    };
    var ViewGrid_1;
    ViewGrid.REFS = {
        DATA: "data",
        CONTENT: "content",
        IFRAME: "iframe",
        CONTAINER: "container",
        WRAP: "wrap",
        TABLE: "table",
        COLS: "cols",
        BODY: "body"
    };
    __decorate([
        core_2.on(ViewGrid_1.REFS.CONTENT, "scroll"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ViewGrid.prototype, "onScroll", null);
    __decorate([
        core_2.on(ViewGrid_1.REFS.WRAP, "mousedown"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], ViewGrid.prototype, "onMouseDown", null);
    __decorate([
        core_2.on(ViewGrid_1.REFS.WRAP, "mouseup"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], ViewGrid.prototype, "onMouseUp", null);
    __decorate([
        core_2.on(ViewGrid_1.REFS.WRAP, "mousemove"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], ViewGrid.prototype, "onMouseMove", null);
    __decorate([
        core_2.on(ViewGrid_1.REFS.WRAP, "click"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], ViewGrid.prototype, "onClick", null);
    __decorate([
        core_2.on(ViewGrid_1.REFS.WRAP, "dblclick"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], ViewGrid.prototype, "onDblClick", null);
    ViewGrid = ViewGrid_1 = __decorate([
        core_1.template({
            html: __webpack_require__(/*! ./viewgrid.html */ "./src/widgets/grid/viewgrid/viewgrid.html"),
            root: {
                tagName: "div",
                ref: "data",
                cl: {
                    "ngrid-data": true
                }
            }
        })
    ], ViewGrid);
    return ViewGrid;
}(core_1.Component));
exports.ViewGrid = ViewGrid;


/***/ }),

/***/ "./src/widgets/icons.ts":
/*!******************************!*\
  !*** ./src/widgets/icons.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ICONS = {
    HEADER_ARROW: "sort",
    CHECKBOX: "checkbox",
    CHECKBOX_CHECKED: "checkbox_checked",
    CHECKBOX_SQUARE: "checkbox_square",
    EXPANDED: "expanded",
    COLLAPSED: "collapsed",
    LEAF: "file",
    FOLDER_OPEN: "folder_open",
    FOLDER_CLOSE: "foler",
    SETTINGS: "settings",
    ADDITIONAL: "additional",
    DRAG_DROP_OK: "ok",
    DRAG_DROP_LOCK: "warn"
};
function createIcon(icon, classes, attrs) {
    var strAttr = classes ? " class=\"" + classes + "\"" : "";
    strAttr += attrs ? " " + attrs : "";
    return "<img src=\"./../../img/" + icon + ".png\"" + strAttr + " />";
}
exports.createIcon = createIcon;


/***/ }),

/***/ "./src/widgets/tree/headtree/headtree.ts":
/*!***********************************************!*\
  !*** ./src/widgets/tree/headtree/headtree.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var headgrid_1 = __webpack_require__(/*! ./../../grid/headgrid/headgrid */ "./src/widgets/grid/headgrid/headgrid.ts");
var icons_1 = __webpack_require__(/*! ./../../icons */ "./src/widgets/icons.ts");
var HeadTree = /** @class */ (function (_super) {
    __extends(HeadTree, _super);
    function HeadTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HeadTree;
}(headgrid_1.HeadGrid));
exports.HeadTree = HeadTree;
// регистрируем типы колонок
var base = headgrid_1.HeadGrid.columns.basecolumn;
headgrid_1.HeadGrid.registerColumn({
    xtype: "treecolumn",
    renderer: function (node, meta) {
        var tree = meta.view;
        var depth = tree.props.rootVisible ? node.depth : node.depth - 1;
        var paddingLeft = 6 + (depth * 10);
        var circleIcon;
        var checkIcon;
        var icon;
        var isLeaf = node.leaf;
        var expanded = node.expanded;
        if (isLeaf) {
            if (meta.column.showLine) {
                circleIcon = "<div class=\"line" + (node.nextNodeId ? "" : " line-angle") + "\"></div>";
            }
            else {
                circleIcon = "";
                paddingLeft += 12; // вместо иконки "плюс"\"минус"
            }
        }
        else {
            if (node.children.length === 0) {
                circleIcon = "";
                paddingLeft += 12; // вместо иконки "плюс"\"минус"
            }
            else {
                var circleIconId = expanded ? icons_1.ICONS.EXPANDED : icons_1.ICONS.COLLAPSED;
                circleIcon = icons_1.createIcon(circleIconId, "image", 'action="expand"');
            }
        }
        if (meta.column.checkbox === false) {
            checkIcon = "";
        }
        else {
            var checkIconId = void 0;
            if (tree.props.syncCheckbox && node.checkedUndetermined) {
                checkIconId = icons_1.ICONS.CHECKBOX_SQUARE;
            }
            else {
                checkIconId = node.checked ? icons_1.ICONS.CHECKBOX_CHECKED : icons_1.ICONS.CHECKBOX;
            }
            checkIcon = icons_1.createIcon(checkIconId, "image check", "action=\"check\"");
        }
        if (meta.column.hideIcon) {
            icon = "";
        }
        else {
            var iconId = node.icon;
            if (!iconId) {
                iconId = isLeaf ? icons_1.ICONS.LEAF : (expanded ? icons_1.ICONS.FOLDER_OPEN : icons_1.ICONS.FOLDER_CLOSE);
            }
            icon = icons_1.createIcon(iconId, "image icon");
        }
        meta.cl.treecolumn = true;
        meta.css.paddingLeft = paddingLeft + "px";
        var value = base.renderer(node, meta);
        return "" + circleIcon + checkIcon + icon + "<span class=\"text\">" + value + "</span>";
    }
});


/***/ }),

/***/ "./src/widgets/tree/plugins/pinRow/Row.ts":
/*!************************************************!*\
  !*** ./src/widgets/tree/plugins/pinRow/Row.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var Row = /** @class */ (function (_super) {
    __extends(Row, _super);
    function Row() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Row_1 = Row;
    Row.prototype.show = function () {
        this.hide(false);
    };
    Row.prototype.hide = function (hidden) {
        if (hidden === void 0) { hidden = true; }
        this.hidden = hidden;
        this.css(Row_1.REFS.WRAP, { display: hidden ? "none" : "block" });
    };
    Row.prototype.setPosition = function (top) {
        this.css(Row_1.REFS.WRAP, { top: top ? top + "px" : "" });
    };
    Row.prototype.isHidden = function () {
        return this.hidden;
    };
    Row.prototype.renderData = function (view, nextNode, onlyInsertOrRemove) {
        var currNode = this.renderedList.length > 0 ? this.renderedList[0].data : null;
        if (!onlyInsertOrRemove || currNode !== nextNode) {
            var nodeList = nextNode ? [nextNode] : [];
            var body = this.ref(Row_1.REFS.BODY);
            core_1.methodCall(view, "renderData", [this, body, { start: 0 }, nodeList, false]);
        }
    };
    Row.prototype.beforeInit = function () {
        this.renderedList = [];
        this.renderedHash = {};
    };
    var Row_1;
    Row.REFS = {
        WRAP: "wrap",
        TABLE: "table",
        COLS: "cols",
        BODY: "body"
    };
    Row = Row_1 = __decorate([
        core_1.template({
            html: [
                "<table ref=\"table\">",
                "<colgroup ref=\"cols\"></colgroup>",
                "<tbody ref=\"body\"></tbody>",
                "</table>"
            ].join(""),
            root: {
                tagName: "div",
                ref: "wrap",
                cl: {
                    npinrow: true
                }
            }
        })
    ], Row);
    return Row;
}(core_1.Component));
exports.Row = Row;


/***/ }),

/***/ "./src/widgets/tree/plugins/pinRow/container.ts":
/*!******************************************************!*\
  !*** ./src/widgets/tree/plugins/pinRow/container.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var util_1 = __webpack_require__(/*! ./../../../utils/util */ "./src/widgets/utils/util.ts");
var supportSticky_1 = __webpack_require__(/*! ./../../../grid/plugins/supportSticky */ "./src/widgets/grid/plugins/supportSticky.ts");
var Row_1 = __webpack_require__(/*! ./Row */ "./src/widgets/tree/plugins/pinRow/Row.ts");
var util_2 = __webpack_require__(/*! ./../../../utils/util */ "./src/widgets/utils/util.ts");
var PIN_ROW_MODE;
(function (PIN_ROW_MODE) {
    PIN_ROW_MODE[PIN_ROW_MODE["HIDDEN"] = 0] = "HIDDEN";
    PIN_ROW_MODE[PIN_ROW_MODE["ROOT"] = 1] = "ROOT";
    PIN_ROW_MODE[PIN_ROW_MODE["NODE"] = 2] = "NODE";
    PIN_ROW_MODE[PIN_ROW_MODE["GROUP"] = 3] = "GROUP"; // прикреплять группу узлов
})(PIN_ROW_MODE = exports.PIN_ROW_MODE || (exports.PIN_ROW_MODE = {}));
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Container_1 = Container;
    Container.prototype.setMode = function (mode) {
        this.mode = mode;
        var hidden = mode === PIN_ROW_MODE.HIDDEN;
        this.css(Container_1.REFS.CONTENT, { display: hidden ? "none" : "block" });
        if (this.isRendered() && !hidden) {
            this.refresh(false);
        }
    };
    Container.prototype.attachTree = function (tree) {
        var _this = this;
        this.tree = tree;
        // @override
        var view = tree.getView();
        var originalRegulateRange = util_2.reedProperty(view, "regulateRange");
        util_2.writeProperty(view, "regulateRange", function (range) {
            range = originalRegulateRange(range);
            var showPins = _this.rowList.reduce(function (result, row) {
                return result + (row.isHidden() ? 0 : 1);
            }, 0);
            range.start += showPins;
            return range;
        });
    };
    Container.prototype.refresh = function (onlyInsertOrRemove) {
        if (this.mode === PIN_ROW_MODE.HIDDEN) {
            return;
        }
        this.updateByMode(onlyInsertOrRemove);
    };
    Container.prototype.updateByMode = function (onlyInsertOrRemove) {
        switch (this.mode) {
            case PIN_ROW_MODE.ROOT:
                this.updatePinRoot(onlyInsertOrRemove);
                break;
            case PIN_ROW_MODE.NODE:
                this.updatePinNode(onlyInsertOrRemove);
                break;
            case PIN_ROW_MODE.GROUP:
                this.updatePinGroupNode(onlyInsertOrRemove);
                break;
        }
    };
    Container.prototype.updatePinRoot = function (onlyInsertOrRemove) {
        var view = this.tree.getView();
        var root = this.tree.getData()[0] || null;
        var row = this.rowList[0];
        if (!this.tree.props.rootVisible) {
            root = root.children[0];
        }
        row.setPosition(0);
        row.renderData(view, root, onlyInsertOrRemove);
        this.rowList.forEach(function (pinRow, index) {
            if (index > 0) {
                pinRow.hide();
            }
        });
    };
    Container.prototype.updatePinNode = function (onlyInsertOrRemove) {
        var view = this.tree.getView();
        var scrollTop = util_2.reedProperty(view, "scrollTop");
        var dataList = util_2.reedProperty(view, "dataList");
        var bufferHeight = view.props.bufferHeight;
        if (onlyInsertOrRemove && scrollTop === this.positionScrollTop) {
            return;
        }
        this.positionScrollTop = scrollTop;
        var row = this.rowList[0];
        var index = Math.floor(scrollTop / bufferHeight);
        var first = dataList[index] || null;
        var second = dataList[index + 1] || null;
        if (first && first.leaf) {
            first = this.tree.getRowById(first.parentNodeId);
        }
        var offset = (!second || second.leaf) ? 0 : (scrollTop - index * bufferHeight);
        row.setPosition(-offset);
        row.renderData(view, first, onlyInsertOrRemove);
        this.rowList.forEach(function (r, i) {
            if (i > 0) {
                r.hide();
            }
        });
    };
    Container.prototype.updatePinGroupNode = function (onlyInsertOrRemove) {
        var _this = this;
        var view = this.tree.getView();
        var scrollTop = util_2.reedProperty(view, "scrollTop");
        var dataList = util_2.reedProperty(view, "dataList");
        var renderedList = util_2.reedProperty(view, "renderedList");
        var bufferHeight = view.props.bufferHeight;
        if (renderedList.length === 0) {
            return;
        }
        if (onlyInsertOrRemove && scrollTop === this.positionScrollTop) {
            return;
        }
        this.positionScrollTop = scrollTop;
        // updating
        var index = Math.floor(scrollTop / bufferHeight);
        var offset = scrollTop - index * bufferHeight;
        var lastPinNode = view.getData()[0];
        var pinList = [];
        var currNode;
        var nextNode;
        // найдем записи которые нужно прикрепить
        while (index < dataList.length) {
            currNode = dataList[index];
            nextNode = dataList[++index];
            lastPinNode = this.findPinNode(currNode, lastPinNode);
            if (lastPinNode.leaf) {
                break;
            }
            if (nextNode && nextNode.depth <= lastPinNode.depth) {
                pinList.push({ node: lastPinNode, offset: offset });
                break;
            }
            pinList.push({ node: lastPinNode, offset: 0 });
        }
        // добавим недостающие строки
        if (pinList.length > this.rowList.length) {
            this.addPinRows(pinList.length - this.rowList.length);
        }
        // добьем pinList если кол-во строк больше чем pinList
        if (pinList.length < this.rowList.length) {
            this.addEmptyRows(pinList, this.rowList.length - pinList.length);
        }
        index = this.rowList.length - 1;
        pinList.forEach(function (pinItem, i) {
            var pinRow = _this.rowList[index - i];
            if (pinItem.node) {
                offset = i * bufferHeight - pinItem.offset;
                pinRow.setPosition(Math.ceil(offset));
                pinRow.renderData(view, pinItem.node, onlyInsertOrRemove);
                pinRow.show();
            }
            else {
                pinRow.hide();
            }
        });
    };
    Container.prototype.findPinNode = function (node, pinNode) {
        var parentNode;
        while (node) {
            if (node.parentNodeId !== null) {
                parentNode = this.tree.getRowById(node.parentNodeId);
            }
            if (parentNode === pinNode) {
                return node;
            }
            node = parentNode;
        }
        return null;
    };
    Container.prototype.addPinRows = function (count) {
        var head = this.tree.getHead();
        var view = this.tree.getView();
        var row;
        for (var i = 0; i < count; ++i) {
            row = new Row_1.Row();
            view.addSyncTable(row);
            row.appendChild(this.ref(Container_1.REFS.CONTENT));
            this.rowList.push(row);
        }
        head.refreshColSize();
    };
    Container.prototype.addEmptyRows = function (pinList, count) {
        for (var i = 0; i < count; ++i) {
            pinList.push({ node: null, offset: null });
        }
    };
    Container.prototype.mousedown = function (e) {
        this.processEvent(e, "MouseDown", this.ref(Row_1.Row.REFS.WRAP), false);
    };
    Container.prototype.click = function (e) {
        this.processEvent(e, "Click", this.ref(Row_1.Row.REFS.WRAP), false);
    };
    Container.prototype.mouseup = function (e) {
        this.processEvent(e, "MouseUp", this.ref(Row_1.Row.REFS.WRAP), true);
    };
    Container.prototype.dblclick = function (e) {
        this.processEvent(e, "Dblclick", this.ref(Row_1.Row.REFS.WRAP), true);
    };
    Container.prototype.processEvent = function (event, eventName, rootNode, needCheckAccuracy) {
        var table = util_1.findParentNode(event.target, "table", rootNode);
        if (!table) {
            return;
        }
        var index = Array.prototype.indexOf.call(this.ref(Container_1.REFS.CONTENT).children, table.parentNode);
        if (index === -1) {
            return;
        }
        var view = this.tree.getView();
        var row = this.rowList[index];
        // считываем состояния
        var viewRenderedList = util_2.reedProperty(view, "renderedList");
        var viewRenderedHash = util_2.reedProperty(view, "renderedHash");
        var rowRenderedList = util_2.reedProperty(row, "renderedList");
        var rowRenderedHash = util_2.reedProperty(row, "renderedHash");
        // временно подменим
        util_2.writeProperty(view, "renderedList", rowRenderedList);
        util_2.writeProperty(view, "renderedHash", rowRenderedHash);
        try {
            core_1.methodCall(view, "processEvent", [event, eventName, div, needCheckAccuracy]);
        }
        catch (e) {
            console.error(e);
        }
        // вернем обратно
        util_2.writeProperty(view, "renderedList", viewRenderedList);
        util_2.writeProperty(view, "renderedHash", viewRenderedHash);
    };
    Container.prototype.beforeInit = function () {
        if (typeof this.props.mode !== "number") {
            this.props.mode = PIN_ROW_MODE.HIDDEN;
        }
    };
    Container.prototype.afterInit = function () {
        this.setMode(this.props.mode);
    };
    Container.prototype.beforeMount = function () {
        var content = this.ref(Container_1.REFS.CONTENT);
        this.rowList = [this.createRow()];
        this.rowList.forEach(function (row) {
            row.appendChild(content);
        });
    };
    Container.prototype.beforeUnmount = function () {
        this.rowList.forEach(function (row) {
            row.remove();
        });
        this.rowList = null;
    };
    Container.prototype.createRow = function () {
        var row = new Row_1.Row();
        var view = this.tree.getView();
        // очень важно!!! для синхронизации с основной таблицей
        view.addSyncTable(row);
        return row;
    };
    var Container_1;
    Container.REFS = {
        CONTENT: "content"
    };
    __decorate([
        core_1.on(Container_1.REFS.CONTENT, "mousedown"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], Container.prototype, "mousedown", null);
    __decorate([
        core_1.on(Container_1.REFS.CONTENT, "mousedown"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], Container.prototype, "click", null);
    __decorate([
        core_1.on(Container_1.REFS.CONTENT, "mousedown"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], Container.prototype, "mouseup", null);
    __decorate([
        core_1.on(Container_1.REFS.CONTENT, "mousedown"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [MouseEvent]),
        __metadata("design:returntype", void 0)
    ], Container.prototype, "dblclick", null);
    Container = Container_1 = __decorate([
        core_1.template({
            html: "",
            root: {
                tagName: "div",
                ref: "content",
                cl: {
                    ngridpinrow: true,
                    sticky: supportSticky_1.supportSticky,
                    fixed: !supportSticky_1.supportSticky
                }
            }
        })
    ], Container);
    return Container;
}(core_1.Component));
exports.Container = Container;


/***/ }),

/***/ "./src/widgets/tree/plugins/pinRow/pinRowPlugin.ts":
/*!*********************************************************!*\
  !*** ./src/widgets/tree/plugins/pinRow/pinRowPlugin.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
var viewtree_1 = __webpack_require__(/*! ../../viewtree/viewtree */ "./src/widgets/tree/viewtree/viewtree.ts");
var container_1 = __webpack_require__(/*! ./container */ "./src/widgets/tree/plugins/pinRow/container.ts");
exports.PIN_ROW_MODE = container_1.PIN_ROW_MODE;
var PinRowPlugin = /** @class */ (function () {
    function PinRowPlugin(props, tree) {
        var _this = this;
        this.tree = tree;
        this.container = new container_1.Container({ mode: props.mode });
        this.container.attachTree(tree);
        this.tree.on("onRefresh", function (tr, onlyInsertOrRemove) {
            _this.container.refresh(onlyInsertOrRemove);
        });
        this.tree.on("onScroll", function (tr, onlyInsertOrRemove) {
            _this.container.refresh(onlyInsertOrRemove);
        });
    }
    PinRowPlugin.prototype.setMode = function (mode) {
        this.container.setMode(mode);
    };
    PinRowPlugin.prototype.mount = function () {
        var view = this.tree.getView();
        var content = core_1.methodCall(view, "ref", [viewtree_1.ViewTree.REFS.CONTENT]);
        this.container.appendChild(content);
    };
    PinRowPlugin.prototype.unmount = function () {
        this.container.remove();
    };
    return PinRowPlugin;
}());
exports.PinRowPlugin = PinRowPlugin;


/***/ }),

/***/ "./src/widgets/tree/plugins/treeFilter/treeFilterPlugin.ts":
/*!*****************************************************************!*\
  !*** ./src/widgets/tree/plugins/treeFilter/treeFilterPlugin.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var escapeRegexRe = /([-.*+?\^${}()|\[\]\/\\])/g;
var TreeFilterPlugin = /** @class */ (function () {
    function TreeFilterPlugin(props, tree) {
        this.tree = tree;
        var view = tree.getView();
        // @override
        var originalFilterNode = view.filterNode;
        view.filterNode = function (node) {
            return node.$plugin_filter !== false && originalFilterNode.call(this, node);
        };
    }
    TreeFilterPlugin.prototype.filter = function (searchText, fn) {
        var _this = this;
        var root = this.tree.getData()[0];
        searchText = searchText.trim().toLowerCase();
        if (searchText) {
            // применим фильтр
            var reg_1 = this.getRegex(searchText);
            var success_1 = [];
            this.tree.cascadeBefore(root, function (node) {
                // если фильтр еще не применялся, запомним его состояние
                // чтобы когда фильтр сбросили, можно было вернуть в прежнее состояние
                if (!_this.applyingFilter) {
                    node.$plugin_expanded = node.expanded;
                }
                // по умолчанию все ноды скроем
                node.expanded = false;
                // если родительский узел прошел фильтрацию то и все его
                // дочерние элементы автоматически проходят фильтрацию
                if (node.parentNode && node.parentNode.$plugin_filter) {
                    node.$plugin_filter = true;
                }
                else {
                    var text = fn ? fn(node) : node.text;
                    // проверяем, подходит ли узел фильтрацию
                    if (text.match(reg_1)) {
                        node.$plugin_filter = true;
                        success_1.push(node);
                    }
                    else {
                        node.$plugin_filter = false;
                    }
                }
            });
            // каждый успошно пройденный фильтрацию узел мы будем
            // поднимать до root и проставлять filter = true
            // также раскроем его expanded = true
            success_1.forEach(function (node) {
                node = tree.getRowById(node.parentNodeId);
                while (node) {
                    node.$plugin_filter = true;
                    node.expanded = true;
                    node = tree.getRowById(node.parentNodeId);
                }
            });
        }
        else {
            // очистим фильтр
            this.tree.cascadeBefore(root, function (node) {
                node.$plugin_filter = true;
                node.expanded = node.$plugin_expanded;
            });
        }
        this.applyingFilter = !!searchText;
        this.tree.refresh();
    };
    TreeFilterPlugin.prototype.getRegex = function (str) {
        str = str.replace(escapeRegexRe, "\\$1");
        return new RegExp(str, "i");
    };
    return TreeFilterPlugin;
}());
exports.TreeFilterPlugin = TreeFilterPlugin;


/***/ }),

/***/ "./src/widgets/tree/tree.ts":
/*!**********************************!*\
  !*** ./src/widgets/tree/tree.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var grid_1 = __webpack_require__(/*! ./../grid/grid */ "./src/widgets/grid/grid.ts");
var headtree_1 = __webpack_require__(/*! ./headtree/headtree */ "./src/widgets/tree/headtree/headtree.ts");
var viewtree_1 = __webpack_require__(/*! ./viewtree/viewtree */ "./src/widgets/tree/viewtree/viewtree.ts");
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // устанавливает check в узле
    Tree.prototype.setCheck = function (node, checked) {
        if (this.props.syncCheckbox) {
            this.cascadeBefore(node, function (child) {
                if (child.leaf) {
                    child.checked = checked;
                }
            });
            this.updateUndeterminedState();
        }
        else {
            node.checked = checked;
        }
        this.refresh();
        this.emit("checkchange", this, node, checked);
    };
    // раскрывает узел
    Tree.prototype.expand = function (node) {
        node.expanded = true;
        this.refresh();
    };
    // закрывает узел
    Tree.prototype.collapse = function (node) {
        node.expanded = false;
        this.refresh();
    };
    // сначала вызывается fn узла, а потом его потомков
    Tree.prototype.cascadeBefore = function (node, fn) {
        var _this = this;
        if (fn(node) === false) {
            return;
        }
        if (node.children) {
            node.children.forEach(function (child) {
                _this.cascadeBefore(child, fn);
            });
        }
    };
    // сначала вызывается fn потомков, а потом узла
    Tree.prototype.cascadeAfter = function (node, fn) {
        var _this = this;
        if (node.children) {
            node.children.forEach(function (child) {
                _this.cascadeAfter(child, fn);
            });
        }
        fn(node);
    };
    // обновляет все узлы на состояние "не определен"
    Tree.prototype.updateUndeterminedState = function () {
        var root = this.getData()[0];
        this.cascadeAfter(root, function (node) {
            if (node.leaf) {
                node.checkedUndetermined = false;
            }
            else {
                if (node.children.length > 0) {
                    // кол-во чекнутых дочерних элементов
                    var countChecked_1 = 0;
                    // был ли хотябы один дечерний элемент в состоянии "не определен"
                    var isUndetermined_1 = false;
                    node.children.forEach(function (child) {
                        if (child.checkedUndetermined) {
                            isUndetermined_1 = true;
                        }
                        else {
                            if (child.checked) {
                                ++countChecked_1;
                            }
                        }
                    });
                    if (countChecked_1 === node.children.length) {
                        node.checked = true;
                        node.checkedUndetermined = false;
                    }
                    else {
                        if (isUndetermined_1 || countChecked_1 > 0) {
                            node.checked = true;
                            node.checkedUndetermined = true;
                        }
                        else {
                            node.checked = false;
                            node.checkedUndetermined = false;
                        }
                    }
                }
                else {
                    node.checkedUndetermined = false;
                }
            }
        });
    };
    // --------------------------------------------------------
    // приватные методы
    // вызывается перед инициализацией
    Tree.prototype.beforeInit = function () {
        this.props.rootVisible = this.props.rootVisible !== false;
        this.props.syncCheckbox = !!this.props.syncCheckbox;
        // ------------------------------------------
        function cellMouseDown_Tree(tree, td, columnIndex, node, tr, rowIndex, event, column) {
            if (column && column.xtype === "treecolumn") {
                var action = tree.findAction(event.target, td);
                switch (action) {
                    case "expand":
                        if (node.expanded) {
                            tree.collapse(node);
                        }
                        else {
                            tree.expand(node);
                        }
                        return false;
                    case "check":
                        tree.setCheck(node, !node.checked);
                        return false;
                }
            }
        }
        function itemDblClick_Tree(tree, node) {
            if (!node.leaf) {
                node.expanded = !node.expanded;
            }
            tree.refresh();
        }
        this.on("onCellMouseDown", cellMouseDown_Tree);
        this.on("onItemdblClick", itemDblClick_Tree);
        _super.prototype.beforeInit.call(this);
    };
    // находит наименование экшина по тегу
    Tree.prototype.findAction = function (node, root) {
        while (node && node !== root) {
            var action = node.getAttribute("action");
            if (action) {
                return action;
            }
            node = node.parentNode;
        }
        return null;
    };
    // создает заголовок дереваа
    Tree.prototype.initHead = function () {
        this.head = new headtree_1.HeadTree({
            columns: this.props.columns
        }, this);
    };
    // создает контент дереваа
    Tree.prototype.initView = function () {
        this.view = new viewtree_1.ViewTree({
            data: this.props.data,
            getId: this.props.getId,
            columns: [],
            multiSelect: this.props.multiSelect,
            emptyRowText: this.props.emptyRowText,
            bufferEnable: this.props.bufferEnable,
            bufferHeight: this.props.bufferHeight,
            bufferStock: this.props.bufferStock,
            bufferScrollMin: this.props.bufferScrollMin
        }, this);
    };
    return Tree;
}(grid_1.Grid));
exports.Tree = Tree;


/***/ }),

/***/ "./src/widgets/tree/viewtree/viewtree.ts":
/*!***********************************************!*\
  !*** ./src/widgets/tree/viewtree/viewtree.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var viewgrid_1 = __webpack_require__(/*! ./../../grid/viewgrid/viewgrid */ "./src/widgets/grid/viewgrid/viewgrid.ts");
var ViewTree = /** @class */ (function (_super) {
    __extends(ViewTree, _super);
    function ViewTree() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ViewTree.prototype.loadData = function (data) {
        this.rawList = data;
        this.rawHash = {};
        if (data.length > 0) {
            this.initNodes(this.rawHash, null, [data[0]], 0);
        }
        this.refresh();
    };
    // преобразует дерево в список
    ViewTree.prototype.updateListRender = function () {
        var _this = this;
        var tree = this.parent;
        var root = this.rawList[0];
        var nodeList;
        if (root) {
            if (tree.props.rootVisible) {
                nodeList = [root];
            }
            else {
                nodeList = root.children || [];
            }
        }
        else {
            nodeList = [];
        }
        var list = [];
        nodeList.forEach(function (node) {
            tree.cascadeBefore(node, function (n) {
                if (_this.filterNode(n)) {
                    list.push(n);
                }
                else {
                    return false;
                }
            });
        });
        this.dataList = list;
    };
    ViewTree.prototype.filterNode = function (node) {
        if (node.parentNodeId === null) {
            return true;
        }
        var parent = this.getRowById(node.parentNodeId);
        return parent.expanded;
    };
    ViewTree.prototype.scrollBy = function (node, isTop) {
        if (isTop === void 0) { isTop = true; }
        var tree = this.parent;
        var parent = node.parentNode;
        while (parent /* && !parent.isRoot()*/) {
            if (!parent.expanded) {
                tree.expand(parent);
            }
            parent = parent.parentNode;
        }
        this.updateListRender();
        _super.prototype.scrollBy.call(this, node, isTop);
    };
    ViewTree.prototype.initNodes = function (hash, parent, children, depth) {
        var _this = this;
        var getId = this.props.getId;
        var parentNodeId = parent ? getId(parent) : null;
        children.forEach(function (child, index) {
            var first = index === 0;
            var last = children.length - 1 === index;
            var id = getId(child);
            if (hash.hasOwnProperty(id)) {
                console.error("two nodes with same id: " + id);
                console.error(hash[id], child);
            }
            else {
                hash[id] = child;
            }
            child.parentNodeId = parentNodeId;
            child.prevNodeId = first ? null : getId(children[index - 1]);
            child.nextNodeId = last ? null : getId(children[index + 1]);
            child.expanded = child.expanded !== false;
            // icon
            // checked
            // checkedUndetermined
            child.depth = depth;
            if (Array.isArray(child.children)) {
                child.leaf = false;
                _this.initNodes(hash, child, child.children, depth + 1);
            }
            else {
                child.leaf = child.leaf !== false;
            }
        });
    };
    return ViewTree;
}(viewgrid_1.ViewGrid));
exports.ViewTree = ViewTree;


/***/ }),

/***/ "./src/widgets/utils/util.ts":
/*!***********************************!*\
  !*** ./src/widgets/utils/util.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(/*! core */ "./src/core/index.ts");
// ищет родительский узел по имени тега
function findParentNode(node, parentName, root) {
    while (node && node !== root) {
        if ((node.nodeName || "").toLowerCase() === parentName) {
            return node;
        }
        node = node.parentNode;
    }
    return null;
}
exports.findParentNode = findParentNode;
function arrayToObject(array, getKey, getVal) {
    var result = {};
    if (!getKey) {
        getKey = function (item) { return item; };
    }
    if (!getVal) {
        getVal = function (item) { return item; };
    }
    array.forEach(function (item, i) {
        result[getKey(item, i, array)] = getVal(item, i, array);
    });
    return result;
}
exports.arrayToObject = arrayToObject;
// -------------------------------
var div = null;
var cacheScrollbarSize = null;
function injectScrollbarInfo() {
    if (div === null) {
        div = document.createElement("div");
        div.setAttribute("class", "ngrid-info-scroll");
        div.innerHTML = [
            "<div class=\"ngrid-info-scroll-child\"></div>",
            "<iframe src=\"\" class=\"ngrid-info-scroll-iframe\"></iframe>"
        ].join("");
        document.body.appendChild(div);
        core_1.event.on(div.children[1].contentWindow, {
            resize: function () {
                cacheScrollbarSize = null;
            }
        });
    }
}
exports.injectScrollbarInfo = injectScrollbarInfo;
function getScrollbarSize() {
    if (cacheScrollbarSize === null) {
        initScrollbarSize();
    }
    return cacheScrollbarSize;
}
exports.getScrollbarSize = getScrollbarSize;
function initScrollbarSize() {
    var main = div.getBoundingClientRect();
    var child = div.children[0].getBoundingClientRect();
    cacheScrollbarSize = main.width - child.width;
}
function correctionCoordinate(coord, size) {
    var margin = 5;
    var bodyWidth = document.body.offsetWidth;
    var bodyHeight = document.body.offsetHeight;
    var endX = size.width + coord.x + margin;
    var endY = size.height + coord.y + margin;
    var needCorrectX = endX > bodyWidth;
    var needCorrectY = endY > bodyHeight;
    if (needCorrectX) {
        if (needCorrectY) {
            return {
                x: coord.x - size.width - margin,
                y: coord.y - size.height - margin
            };
        }
        else {
            return {
                x: coord.x - (endX - bodyWidth),
                y: coord.y + margin
            };
        }
    }
    else {
        if (needCorrectY) {
            return {
                x: coord.x + margin,
                y: coord.y - (endY - bodyHeight)
            };
        }
        else {
            return {
                x: coord.x + margin,
                y: coord.y + margin
            };
        }
    }
}
exports.correctionCoordinate = correctionCoordinate;
// -------------------------------
function getDecl(titles, count) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
}
exports.getDecl = getDecl;
// -------------------------------
function isNumber(value) {
    return typeof value === "number" && isFinite(value);
}
exports.isNumber = isNumber;
// -------------------------------
function reedProperty(object, property) {
    return object[property];
}
exports.reedProperty = reedProperty;
function writeProperty(object, property, value) {
    object[property] = value;
}
exports.writeProperty = writeProperty;


/***/ })

/******/ });
//# sourceMappingURL=native-widgets.js.map