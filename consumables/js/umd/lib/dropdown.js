(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'babel-runtime/core-js/weak-map', 'babel-runtime/helpers/toConsumableArray', 'babel-runtime/core-js/object/assign', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', '../misc/on', '../polyfills/array-from', '../polyfills/object-assign', '../polyfills/custom-event'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('babel-runtime/core-js/weak-map'), require('babel-runtime/helpers/toConsumableArray'), require('babel-runtime/core-js/object/assign'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('../misc/on'), require('../polyfills/array-from'), require('../polyfills/object-assign'), require('../polyfills/custom-event'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.weakMap, global.toConsumableArray, global.assign, global.classCallCheck, global.createClass, global.on, global.arrayFrom, global.objectAssign, global.customEvent);
    global.dropdown = mod.exports;
  }
})(this, function (exports, _weakMap, _toConsumableArray2, _assign, _classCallCheck2, _createClass2, _on) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _weakMap2 = _interopRequireDefault(_weakMap);

  var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

  var _assign2 = _interopRequireDefault(_assign);

  var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

  var _createClass3 = _interopRequireDefault(_createClass2);

  var _on2 = _interopRequireDefault(_on);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var Dropdown = function () {
    /**
     * A selector with drop downs.
     * @implements Component
     * @param {HTMLElement} element The element working as a selector.
     * @param {Object} [options] The component options.
     * @param {string} [options.selectorItem] The CSS selector to find clickable areas in dropdown items.
     * @param {string} [options.selectorItemSelected] The CSS selector to find the clickable area in the selected dropdown item.
     * @param {string} [options.classSelected] The CSS class for the selected dropdown item.
     * @param {string} [options.eventBeforeSelected]
     *   The name of the custom event fired before a drop down item is selected.
     *   Cancellation of this event stops selection of drop down item.
     * @param {string} [options.eventAfterSelected] The name of the custom event fired after a drop down item is selected.
     */

    function Dropdown(element) {
      var _this = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      (0, _classCallCheck3.default)(this, Dropdown);

      if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        throw new TypeError('DOM element should be given to initialize this widget.');
      }

      this.element = element;

      this.options = (0, _assign2.default)({
        selectorItem: '[data-option] > .bx--dropdown__link',
        selectorItemSelected: '[data-option] > .bx--dropdown__link.bx--dropdown--selected',
        classSelected: 'bx--dropdown--selected',
        eventBeforeSelected: 'dropdown-beingselected',
        eventAfterSelected: 'dropdown-selected'
      }, options);

      if (this.element.dataset.dropdown !== 'navigation') {
        this.element.dataset.dropdown = '';
      }
      this.constructor.components.set(this.element, this);

      /**
       * The handle to release click event listener on document object.
       * @member {Handle}
       */
      this.hDocumentClick = (0, _on2.default)(this.element.ownerDocument, 'click', function (event) {
        return _this.toggle(event);
      });

      this.element.addEventListener('keypress', function (event) {
        return _this.toggle(event);
      });
      this.element.addEventListener('click', function (event) {
        return _this.selected(event);
      });
    }

    /**
     * Instantiates selector of the given element.
     * @param {HTMLElement} element The element working as a selector.
     * @param {Object} [options] The component options.
     * @param {string} [options.selectorItem] The CSS selector to find clickable areas in dropdown items.
     * @param {string} [options.selectorItemSelected] The CSS selector to find the clickable area in the selected dropdown item.
     * @param {string} [options.classSelected] The CSS class for the selected dropdown item.
     * @param {string} [options.eventBeforeSelected]
     *   The name of the custom event fired before a drop down item is selected.
     *   Cancellation of this event stops selection of drop down item.
     * @param {string} [options.eventAfterSelected] The name of the custom event fired after a drop down item is selected.
     */


    (0, _createClass3.default)(Dropdown, [{
      key: 'release',
      value: function release() {
        if (this.hDocumentClick) {
          this.hDocumentClick = this.hDocumentClick.release();
        }
        this.constructor.components.delete(this.element);
      }
    }, {
      key: 'toggle',
      value: function toggle(event) {
        if (event.which === 13 || event.type === 'click') {
          var isOfSelf = this.element.contains(event.target);

          if (isOfSelf) {
            this.element.classList.toggle('bx--dropdown--open');
          } else if (!isOfSelf && this.element.classList.contains('bx--dropdown--open')) {
            this.element.classList.remove('bx--dropdown--open');
          }
        }
      }
    }, {
      key: 'selected',
      value: function selected(event) {
        var _this2 = this;

        var activatedElement = event.target;
        if (activatedElement.parentElement.dataset.option !== undefined) {
          var eventStart = new CustomEvent(this.options.eventBeforeSelected, {
            bubbles: true,
            cancelable: true,
            detail: { item: activatedElement }
          });

          if (this.element.dispatchEvent(eventStart)) {
            if (this.element.dataset.dropdown !== 'navigation') {
              this.element.firstElementChild.textContent = activatedElement.textContent;
              activatedElement.classList.add(this.options.classSelected);
            }
            this.element.dataset.value = activatedElement.parentElement.dataset.value;
            [].concat((0, _toConsumableArray3.default)(this.element.querySelectorAll(this.options.selectorItemSelected))).forEach(function (item) {
              if (activatedElement !== item) {
                item.classList.remove(_this2.options.classSelected);
              }
            });

            this.element.dispatchEvent(new CustomEvent(this.options.eventAfterSelected, {
              bubbles: true,
              cancelable: true,
              detail: { item: activatedElement }
            }));
          }
        }
      }
    }], [{
      key: 'create',
      value: function create(element, options) {
        return this.components.get(element) || new this(element, options);
      }
    }, {
      key: 'init',
      value: function init() {
        var _this3 = this;

        var target = arguments.length <= 0 || arguments[0] === undefined ? document : arguments[0];
        var options = arguments[1];

        if (target.nodeType !== Node.ELEMENT_NODE && target.nodeType !== Node.DOCUMENT_NODE) {
          throw new Error('DOM document or DOM element should be given to search for and initialize this widget.');
        }
        if (target.nodeType === Node.ELEMENT_NODE && target.dataset.loading !== undefined) {
          this.create(target, options);
        } else {
          [].concat((0, _toConsumableArray3.default)(target.querySelectorAll('[data-dropdown]'))).forEach(function (element) {
            return _this3.create(element, options);
          });
        }
      }
    }]);
    return Dropdown;
  }();

  exports.default = Dropdown;


  /**
   * The component options.
   * @member {Object} Dropdown#options
   * @property {string} [selectorItem] The CSS selector to find clickable areas in dropdown items.
   * @property {string} [selectorItemSelected] The CSS selector to find the clickable area in the selected dropdown item.
   * @property {string} [classSelected] The CSS class for the selected dropdown item.
   * @property {string} [eventBeforeSelected]
   *   The name of the custom event fired before a drop down item is selected.
   *   Cancellation of this event stops selection of drop down item.
   * @property {string} [eventAfterSelected] The name of the custom event fired after a drop down item is selected.
   */

  /**
   * The map associating DOM element and selector instance.
   * @type {WeakMap}
   */
  Dropdown.components = new _weakMap2.default();
});