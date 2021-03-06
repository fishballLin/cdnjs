// resources(34):
//   [function] ../../src/basis/dragdrop.js -> f.js
//   [function] library.js -> 0.js
//   [function] ../../src/basis/event.js -> 2.js
//   [function] ../../src/basis/template/html.js -> 3.js
//   [function] ../../src/basis/l10n.js -> 4.js
//   [function] ../../src/basis/template/htmlfgen.js -> 5.js
//   [function] ../../src/basis/template/const.js -> 6.js
//   [function] ../../src/basis/template.js -> 7.js
//   [function] ../../src/basis/template/declaration.js -> 8.js
//   [function] ../../src/basis/template/tokenize.js -> w.js
//   [function] ../../src/basis/template/isolateCss.js -> x.js
//   [function] ../../src/basis/template/store.js -> 9.js
//   [function] ../../src/basis/template/theme.js -> a.js
//   [function] ../../src/basis/template/buildDom.js -> b.js
//   [function] ../../src/basis/dom/event.js -> c.js
//   [function] ../../src/basis/dom/wrapper.js -> d.js
//   [function] ../../src/basis/data.js -> e.js
//   [function] ../../src/basis/ui.js -> 1.js
//   [function] ../../src/basis/dom/computedStyle.js -> g.js
//   [function] ../../src/basis/layout.js -> h.js
//   [function] ../../src/basis/data/dataset.js -> i.js
//   [function] ../../src/basis/data/value.js -> j.js
//   [function] ../../src/basis/data/index.js -> k.js
//   [function] ../../src/basis/data/object.js -> l.js
//   [function] ../../src/basis/entity.js -> m.js
//   [function] ../../src/basis/net/jsonp.js -> n.js
//   [function] ../../src/basis/net.js -> o.js
//   [function] ../../src/basis/net/service.js -> p.js
//   [function] ../../src/basis/net/ajax.js -> q.js
//   [function] ../../src/basis/ua.js -> r.js
//   [function] ../../src/basis/net/action.js -> s.js
//   [function] ../../src/basis/promise.js -> t.js
//   [function] ../../src/basis/router.js -> u.js
//   [function] ../../src/basis/app.js -> v.js
//
// filelist(1):
//   /scripts/release-configs/library.js
//
(function(){
"use strict";

var __namespace_map__ = {"0.js":"library","1.js":"basis.ui","2.js":"basis.event","3.js":"basis.template.html","4.js":"basis.l10n","5.js":"basis.template.htmlfgen","6.js":"basis.template.const","7.js":"basis.template","8.js":"basis.template.declaration","9.js":"basis.template.store","a.js":"basis.template.theme","b.js":"basis.template.buildDom","c.js":"basis.dom.event","d.js":"basis.dom.wrapper","e.js":"basis.data","f.js":"basis.dragdrop","g.js":"basis.dom.computedStyle","h.js":"basis.layout","i.js":"basis.data.dataset","j.js":"basis.data.value","k.js":"basis.data.index","l.js":"basis.data.object","m.js":"basis.entity","n.js":"basis.net.jsonp","o.js":"basis.net","p.js":"basis.net.service","q.js":"basis.net.ajax","r.js":"basis.ua","s.js":"basis.net.action","t.js":"basis.promise","u.js":"basis.router","v.js":"basis.app"};
var library;

var __resources__ = {
  "f.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var document = global.document;
    var cleaner = basis.cleaner;
    var eventUtils = basis.require("./c.js");
    var addGlobalHandler = eventUtils.addGlobalHandler;
    var removeGlobalHandler = eventUtils.removeGlobalHandler;
    var basisEvent = basis.require("./2.js");
    var Emitter = basisEvent.Emitter;
    var createEvent = basisEvent.create;
    var getComputedStyle = basis.require("./g.js").get;
    var basisLayout = basis.require("./h.js");
    var getBoundingRect = basisLayout.getBoundingRect;
    var getViewportRect = basisLayout.getViewportRect;
    var SELECTSTART_SUPPORTED = eventUtils.getEventInfo("selectstart").supported;
    var dragging;
    var dragElement;
    var dragData;
    function resolveElement(value) {
      return typeof value == "string" ? document.getElementById(value) : value;
    }
    function startDrag(event) {
      if (dragElement || this.ignoreTarget(event.sender, event)) return;
      var viewport = getViewportRect(event.sender);
      if (event.mouseX < viewport.left || event.mouseX > viewport.right || event.mouseY < viewport.top || event.mouseY > viewport.bottom) return;
      dragElement = this;
      dragData = {
        initX: event.mouseX,
        initY: event.mouseY,
        deltaX: 0,
        minDeltaX: -Infinity,
        maxDeltaX: Infinity,
        deltaY: 0,
        minDeltaY: -Infinity,
        maxDeltaY: Infinity
      };
      addGlobalHandler("mousedown", stopDrag);
      addGlobalHandler("touchstart", stopDrag);
      addGlobalHandler("mousemove", onDrag);
      addGlobalHandler("touchmove", onDrag);
      addGlobalHandler("mouseup", stopDrag);
      addGlobalHandler("touchend", stopDrag);
      if (SELECTSTART_SUPPORTED) addGlobalHandler("selectstart", eventUtils.kill);
      event.preventDefault();
      this.prepareDrag(dragData, event);
    }
    function onDrag(event) {
      var deltaX = event.mouseX - dragData.initX;
      var deltaY = event.mouseY - dragData.initY;
      if (!dragging) {
        if (!dragElement.startRule(deltaX, deltaY)) return;
        dragging = true;
        dragElement.emit_start(dragData, event);
      }
      if (dragElement.axisX) dragData.deltaX = dragElement.axisXproxy(basis.number.fit(deltaX, dragData.minDeltaX, dragData.maxDeltaX));
      if (dragElement.axisY) dragData.deltaY = dragElement.axisYproxy(basis.number.fit(deltaY, dragData.minDeltaY, dragData.maxDeltaY));
      dragElement.emit_drag(dragData, event);
    }
    function stopDrag(event) {
      removeGlobalHandler("mousedown", stopDrag);
      removeGlobalHandler("touchstart", stopDrag);
      removeGlobalHandler("mousemove", onDrag);
      removeGlobalHandler("touchmove", onDrag);
      removeGlobalHandler("mouseup", stopDrag);
      removeGlobalHandler("touchend", stopDrag);
      if (SELECTSTART_SUPPORTED) removeGlobalHandler("selectstart", eventUtils.kill);
      var element = dragElement;
      var data = dragData;
      dragElement = null;
      dragData = null;
      if (dragging) {
        dragging = false;
        element.emit_over(data, event);
      }
      event.die();
    }
    var DragDropElement = Emitter.subclass({
      className: namespace + ".DragDropElement",
      element: null,
      trigger: null,
      baseElement: null,
      axisX: true,
      axisY: true,
      axisXproxy: basis.fn.$self,
      axisYproxy: basis.fn.$self,
      prepareDrag: basis.fn.$undef,
      startRule: basis.fn.$true,
      ignoreTarget: function(target) {
        return /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName);
      },
      emit_start: createEvent("start"),
      emit_drag: createEvent("drag"),
      emit_over: createEvent("over"),
      init: function() {
        Emitter.prototype.init.call(this);
        var element = this.element;
        var trigger = this.trigger;
        this.element = null;
        this.trigger = null;
        this.setElement(element, trigger);
        this.setBase(this.baseElement);
        cleaner.add(this);
      },
      setElement: function(element, trigger) {
        this.element = resolveElement(element);
        trigger = resolveElement(trigger) || this.element;
        if (this.trigger !== trigger) {
          if (this.trigger) {
            eventUtils.removeHandler(this.trigger, "mousedown", startDrag, this);
            eventUtils.removeHandler(this.trigger, "touchstart", startDrag, this);
          }
          this.trigger = trigger;
          if (this.trigger) {
            eventUtils.addHandler(this.trigger, "mousedown", startDrag, this);
            eventUtils.addHandler(this.trigger, "touchstart", startDrag, this);
          }
        }
      },
      setBase: function(baseElement) {
        this.baseElement = resolveElement(baseElement);
      },
      getBase: function() {
        if (getComputedStyle(this.element, "position") == "fixed") return global;
        if (this.baseElement) return this.baseElement;
        return document.compatMode == "CSS1Compat" ? document.documentElement : document.body;
      },
      isDragging: function() {
        return dragElement === this;
      },
      start: function(event) {
        if (!this.isDragging()) startDrag.call(this, event);
      },
      stop: function() {
        if (this.isDragging()) stopDrag();
      },
      destroy: function() {
        this.stop();
        cleaner.remove(this);
        Emitter.prototype.destroy.call(this);
        this.setElement();
        this.setBase();
      }
    });
    var DeltaWriter = basis.Class(null, {
      className: namespace + ".DeltaWriter",
      property: null,
      invert: false,
      format: basis.fn.$self,
      init: function(element) {
        if (typeof this.property == "function") this.property = this.property(element);
        if (typeof this.invert == "function") this.invert = this.invert(this.property);
        this.value = this.read(element);
      },
      read: function(element) {
        return element[this.property];
      },
      write: function(element, formattedValue) {
        element[this.property] = formattedValue;
      },
      applyDelta: function(element, delta) {
        if (this.invert) delta = -delta;
        this.write(element, this.format(this.value + delta, delta));
      }
    });
    var StyleDeltaWriter = DeltaWriter.subclass({
      className: namespace + ".StyleDeltaWriter",
      format: function(value) {
        return value + "px";
      },
      read: function(element) {
        return parseFloat(getComputedStyle(element, this.property)) || 0;
      },
      write: function(element, formattedValue) {
        element.style[this.property] = formattedValue;
      }
    });
    var StylePositionX = StyleDeltaWriter.subclass({
      property: function(element) {
        return getComputedStyle(element, "left") == "auto" && getComputedStyle(element, "right") != "auto" ? "right" : "left";
      },
      invert: function(property) {
        return property == "right";
      }
    });
    var StylePositionY = StyleDeltaWriter.subclass({
      property: function(element) {
        return getComputedStyle(element, "top") == "auto" && getComputedStyle(element, "bottom") != "auto" ? "bottom" : "top";
      },
      invert: function(property) {
        return property == "bottom";
      }
    });
    var MoveableElement = DragDropElement.subclass({
      className: namespace + ".MoveableElement",
      fixTop: true,
      fixRight: true,
      fixBottom: true,
      fixLeft: true,
      axisX: StylePositionX,
      axisY: StylePositionY,
      emit_start: function(dragData, event) {
        var element = this.element;
        if (element) {
          var viewport = getViewportRect(this.getBase());
          var box = getBoundingRect(element, this.getBase());
          dragData.element = element;
          if (this.axisX) {
            dragData.axisX = new this.axisX(element);
            if (this.fixLeft) dragData.minDeltaX = viewport.left - box.left;
            if (this.fixRight) dragData.maxDeltaX = viewport.right - box.right;
          }
          if (this.axisY) {
            dragData.axisY = new this.axisY(element);
            if (this.fixTop) dragData.minDeltaY = viewport.top - box.top;
            if (this.fixBottom) dragData.maxDeltaY = viewport.bottom - box.bottom;
          }
        }
        DragDropElement.prototype.emit_start.call(this, dragData, event);
      },
      emit_drag: function(dragData, event) {
        if (!dragData.element) return;
        if (dragData.axisX) dragData.axisX.applyDelta(dragData.element, dragData.deltaX);
        if (dragData.axisY) dragData.axisY.applyDelta(dragData.element, dragData.deltaY);
        DragDropElement.prototype.emit_drag.call(this, dragData, event);
      }
    });
    module.exports = {
      DragDropElement: DragDropElement,
      MoveableElement: MoveableElement,
      DeltaWriter: DeltaWriter,
      StyleDeltaWriter: StyleDeltaWriter
    };
  },
  "0.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    basis.require("./1.js");
    basis.require("./f.js");
    basis.require("./i.js");
    basis.require("./j.js");
    basis.require("./k.js");
    basis.require("./l.js");
    basis.require("./m.js");
    basis.require("./n.js");
    basis.require("./p.js");
    basis.require("./s.js");
    basis.require("./u.js");
    basis.require("./v.js");
    global.basis = basis;
  },
  "2.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var Class = basis.Class;
    var NULL_HANDLER = {};
    var events = {};
    var warnOnDestroy = function() {
      basis.dev.warn("Object had been destroyed before. Destroy method must not be called more than once.");
    };
    function createDispatcher(eventName) {
      var eventFunction = events[eventName];
      if (!eventFunction) {
        eventFunction = function() {
          var cursor = this;
          var args;
          var fn;
          while (cursor = cursor.handler) {
            fn = cursor.callbacks[eventName];
            if (typeof fn == "function") {
              if (!args) {
                args = [ this ];
                for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
              }
              fn.apply(cursor.context || this, args);
            }
            fn = cursor.callbacks["*"];
            if (typeof fn == "function") {
              if (!args) {
                args = [ this ];
                for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
              }
              fn.call(cursor.context || this, {
                sender: this,
                type: eventName,
                args: args
              });
            }
          }
          if (this.debug_emit) {
            args = [];
            for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
            this.debug_emit({
              sender: this,
              type: eventName,
              args: args
            });
          }
        };
        eventFunction = (new Function('return {"' + namespace + ".events." + eventName + '":\n\n      ' + "function(" + basis.array(arguments, 1).join(", ") + "){" + eventFunction.toString().replace(/\beventName\b/g, '"' + eventName + '"').replace(/^function[^(]*\(\)[^{]*\{|\}$/g, "") + "}" + '\n\n}["' + namespace + ".events." + eventName + '"];'))();
        events[eventName] = eventFunction;
      }
      return eventFunction;
    }
    function createHandler(events, eventCallback) {
      var handler = {
        events: []
      };
      if (events) {
        events = String(events).trim().split(/\s+|\s*,\s*/).sort();
        handler = {
          events: events
        };
        for (var i = 0, eventName; eventName = events[i]; i++) if (eventName != "destroy") handler[eventName] = eventCallback;
      }
      return handler;
    }
    var Emitter = Class(null, {
      className: namespace + ".Emitter",
      extendConstructor_: true,
      handler: null,
      emit_destroy: createDispatcher("destroy"),
      listen: Class.nestedExtendProperty(),
      debug_handlers: function() {
        var result = [];
        var cursor = this;
        while (cursor = cursor.handler) result.push([ cursor.callbacks, cursor.context ]);
        return result;
      },
      debug_emit: null,
      init: function() {
        if (this.handler && !this.handler.callbacks) this.handler = {
          callbacks: this.handler,
          context: this,
          handler: null
        };
      },
      addHandler: function(callbacks, context) {
        if (!callbacks) basis.dev.warn(namespace + ".Emitter#addHandler: callbacks is not an object (", callbacks, ")");
        context = context || this;
        var cursor = this;
        while (cursor = cursor.handler) {
          if (cursor.callbacks === callbacks && cursor.context === context) {
            basis.dev.warn(namespace + ".Emitter#addHandler: add duplicate event callbacks", callbacks, "to Emitter instance:", this);
            break;
          }
        }
        this.handler = {
          callbacks: callbacks,
          context: context,
          handler: this.handler
        };
      },
      removeHandler: function(callbacks, context) {
        var cursor = this;
        var prev;
        context = context || this;
        while (prev = cursor, cursor = cursor.handler) if (cursor.callbacks === callbacks && cursor.context === context) {
          cursor.callbacks = NULL_HANDLER;
          prev.handler = cursor.handler;
          return;
        }
        basis.dev.warn(namespace + ".Emitter#removeHandler: no handler removed");
      },
      destroy: function() {
        this.destroy = warnOnDestroy;
        this.emit_destroy();
        this.handler = null;
      }
    });
    module.exports = {
      create: createDispatcher,
      createHandler: createHandler,
      events: events,
      Emitter: Emitter
    };
  },
  "3.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var document = global.document;
    var Node = global.Node;
    var camelize = basis.string.camelize;
    var isMarkupToken = basis.require("./4.js").isMarkupToken;
    var getL10nToken = basis.require("./4.js").token;
    var getFunctions = basis.require("./5.js").getFunctions;
    var basisTemplate = basis.require("./7.js");
    var TemplateSwitchConfig = basisTemplate.TemplateSwitchConfig;
    var TemplateSwitcher = basisTemplate.TemplateSwitcher;
    var Template = basisTemplate.Template;
    var getSourceByPath = basisTemplate.get;
    var buildDOM = basis.require("./b.js");
    var CLONE_NORMALIZATION_TEXT_BUG = basis.require("./6.js").CLONE_NORMALIZATION_TEXT_BUG;
    var IS_SET_STYLE_SAFE = !!function() {
      try {
        return document.documentElement.style.color = "x";
      } catch (e) {}
    }();
    var l10nTemplate = {};
    var l10nTemplateSource = {};
    function getSourceFromL10nToken(token) {
      var dict = token.dictionary;
      var url = dict.resource ? dict.resource.url : "dictionary" + dict.basisObjectId;
      var name = token.getName();
      var id = name + "@" + url;
      var result = l10nTemplateSource[id];
      var sourceWrapper;
      if (!result) {
        var sourceToken = dict.token(name);
        result = l10nTemplateSource[id] = sourceToken.as(function(value) {
          if (sourceToken.getType() == "markup") {
            var parentType = sourceToken.getParentType();
            if (typeof value == "string" && (parentType == "plural" || parentType == "plural-markup")) value = value.replace(/\{#\}/g, "{__templateContext}");
            if (value != this.value) if (sourceWrapper) {
              sourceWrapper.detach(sourceToken, sourceToken.apply);
              sourceWrapper = null;
            }
            if (value && String(value).substr(0, 5) == "path:") {
              sourceWrapper = getSourceByPath(value.substr(5));
              sourceWrapper.attach(sourceToken, sourceToken.apply);
            }
            return sourceWrapper ? sourceWrapper.bindingBridge.get(sourceWrapper) : value;
          }
          return this.value;
        });
        result.id = "{l10n:" + id + "}";
        result.url = url + ":" + name;
      }
      return result;
    }
    function getL10nHtmlTemplate(token) {
      if (typeof token == "string") token = getL10nToken(token);
      if (!token) return null;
      var templateSource = getSourceFromL10nToken(token);
      var id = templateSource.id;
      var htmlTemplate = l10nTemplate[id];
      if (!htmlTemplate) htmlTemplate = l10nTemplate[id] = new HtmlTemplate(templateSource);
      return htmlTemplate;
    }
    var builder = function() {
      var WHITESPACE = /\s+/;
      var CLASSLIST_SUPPORTED = global.DOMTokenList && document && document.documentElement.classList instanceof global.DOMTokenList;
      var W3C_DOM_NODE_SUPPORTED = function() {
        try {
          return document instanceof Node;
        } catch (e) {}
      }() || false;
      function collapseDomFragment(fragment) {
        var startMarker = fragment.startMarker;
        var endMarker = fragment.endMarker;
        var cursor = startMarker.nextSibling;
        while (cursor && cursor !== endMarker) {
          var tmp = cursor;
          cursor = cursor.nextSibling;
          fragment.appendChild(tmp);
        }
        endMarker.parentNode.removeChild(endMarker);
        fragment.startMarker = null;
        fragment.endMarker = null;
        return startMarker;
      }
      var bind_node = W3C_DOM_NODE_SUPPORTED ? function(domRef, oldNode, newValue, domNodeBindingProhibited) {
        var newNode = !domNodeBindingProhibited && newValue && newValue instanceof Node ? newValue : domRef;
        if (newNode !== oldNode) {
          if (newNode.nodeType === 11 && !newNode.startMarker) {
            newNode.startMarker = document.createTextNode("");
            newNode.endMarker = document.createTextNode("");
            newNode.insertBefore(newNode.startMarker, newNode.firstChild);
            newNode.appendChild(newNode.endMarker);
          }
          if (oldNode.nodeType === 11 && oldNode.startMarker) oldNode = collapseDomFragment(oldNode);
          oldNode.parentNode.replaceChild(newNode, oldNode);
        }
        return newNode;
      } : function(domRef, oldNode, newValue, domNodeBindingProhibited) {
        var newNode = !domNodeBindingProhibited && newValue && typeof newValue == "object" ? newValue : domRef;
        if (newNode !== oldNode) {
          try {
            oldNode.parentNode.replaceChild(newNode, oldNode);
          } catch (e) {
            newNode = domRef;
            if (oldNode !== newNode) oldNode.parentNode.replaceChild(newNode, oldNode);
          }
        }
        return newNode;
      };
      var bind_element = function(domRef, oldNode, newValue, domNodeBindingProhibited) {
        var newNode = bind_node(domRef, oldNode, newValue, domNodeBindingProhibited);
        if (newNode === domRef && typeof newValue == "string") domRef.innerHTML = newValue;
        return newNode;
      };
      var bind_comment = bind_node;
      var bind_textNode = function(domRef, oldNode, newValue, domNodeBindingProhibited) {
        var newNode = bind_node(domRef, oldNode, newValue, domNodeBindingProhibited);
        if (newNode === domRef) domRef.nodeValue = String(newValue);
        return newNode;
      };
      var bind_attrClass = CLASSLIST_SUPPORTED ? function(domRef, oldClass, newValue, anim) {
        var newClass = newValue ? newValue : "";
        if (newClass != oldClass) {
          if (oldClass) domRef.classList.remove(oldClass);
          if (newClass) {
            domRef.classList.add(newClass);
            if (anim) {
              domRef.classList.add(newClass + "-anim");
              basis.nextTick(function() {
                domRef.classList.remove(newClass + "-anim");
              });
            }
          }
        }
        return newClass;
      } : function(domRef, oldClass, newValue, anim) {
        var newClass = newValue ? newValue : "";
        if (newClass != oldClass) {
          var className = domRef.className;
          var classNameIsObject = typeof className != "string";
          var classList;
          if (classNameIsObject) className = className.baseVal;
          classList = className.split(WHITESPACE);
          if (oldClass) basis.array.remove(classList, oldClass);
          if (newClass) {
            classList.push(newClass);
            if (anim) {
              basis.array.add(classList, newClass + "-anim");
              basis.nextTick(function() {
                var classList = (classNameIsObject ? domRef.className.baseVal : domRef.className).split(WHITESPACE);
                basis.array.remove(classList, newClass + "-anim");
                if (classNameIsObject) domRef.className.baseVal = classList.join(" "); else domRef.className = classList.join(" ");
              });
            }
          }
          if (classNameIsObject) domRef.className.baseVal = classList.join(" "); else domRef.className = classList.join(" ");
        }
        return newClass;
      };
      var bind_attrStyle = IS_SET_STYLE_SAFE ? function(domRef, propertyName, oldValue, newValue) {
        if (oldValue !== newValue) domRef.style[camelize(propertyName)] = newValue;
        return newValue;
      } : function(domRef, propertyName, oldValue, newValue) {
        if (oldValue !== newValue) {
          try {
            domRef.style[camelize(propertyName)] = newValue;
          } catch (e) {}
        }
        return newValue;
      };
      var bind_attr = function(domRef, attrName, oldValue, newValue) {
        if (oldValue !== newValue) {
          if (newValue) domRef.setAttribute(attrName, newValue); else domRef.removeAttribute(attrName);
        }
        return newValue;
      };
      function updateAttach() {
        this.set(this.name, this.value);
      }
      function resolveValue(bindingName, value, Attaches) {
        var bridge = value && value.bindingBridge;
        var oldAttach = this.attaches && this.attaches[bindingName];
        var tmpl = null;
        if (bridge || oldAttach) {
          if (bridge) {
            var isMarkup = isMarkupToken(value);
            var template;
            if (isMarkup) template = getL10nHtmlTemplate(value);
            if (!oldAttach || oldAttach.value !== value || oldAttach.template !== template) {
              if (oldAttach) {
                if (oldAttach.tmpl) oldAttach.template.clearInstance(oldAttach.tmpl);
                oldAttach.value.bindingBridge.detach(oldAttach.value, updateAttach, oldAttach);
              }
              if (template) {
                var context = this.context;
                var bindings = this.bindings;
                var onAction = this.action;
                var bindingInterface = this.bindingInterface;
                tmpl = template.createInstance(context, onAction, function onRebuild() {
                  tmpl = newAttach.tmpl = template.createInstance(context, onAction, onRebuild, bindings, bindingInterface);
                  tmpl.parent = tmpl.element.parentNode || tmpl.element;
                  updateAttach.call(newAttach);
                }, bindings, bindingInterface);
                tmpl.parent = tmpl.element.parentNode || tmpl.element;
              }
              if (!this.attaches) this.attaches = new Attaches;
              var newAttach = this.attaches[bindingName] = {
                name: bindingName,
                value: value,
                template: template,
                tmpl: tmpl,
                set: this.tmpl.set
              };
              bridge.attach(value, updateAttach, newAttach);
            } else tmpl = value && isMarkupToken(value) ? oldAttach.tmpl : null;
            if (tmpl) {
              tmpl.set("__templateContext", value.value);
              return tmpl.parent;
            }
            value = bridge.get(value);
          } else {
            if (oldAttach) {
              if (oldAttach.tmpl) oldAttach.template.clearInstance(oldAttach.tmpl);
              oldAttach.value.bindingBridge.detach(oldAttach.value, updateAttach, oldAttach);
              this.attaches[bindingName] = null;
            }
          }
        }
        return value;
      }
      function createBindingUpdater(names, getters) {
        var name1 = names[0];
        var name2 = names[1];
        var getter1 = getters[name1];
        var getter2 = getters[name2];
        switch (names.length) {
          case 1:
            return function bindingUpdater1(object) {
              this(name1, getter1(object));
            };
          case 2:
            return function bindingUpdater2(object) {
              this(name1, getter1(object));
              this(name2, getter2(object));
            };
          default:
            var getters_ = names.map(function(name) {
              return getters[name];
            });
            return function bindingUpdaterN(object) {
              for (var i = 0; i < names.length; i++) this(names[i], getters_[i](object));
            };
        }
      }
      function makeHandler(events, getters) {
        for (var name in events) events[name] = createBindingUpdater(events[name], getters);
        return name ? events : null;
      }
      function createBindingFunction(keys) {
        var bindingCache = {};
        return function getBinding(instance, set) {
          var bindings = instance.bindings;
          if (!bindings) return {};
          var cacheId = "bindingId" in bindings ? bindings.bindingId : null;
          if (!cacheId) basis.dev.warn("basis.template.Template.getBinding: bindings has no bindingId property, cache is not used");
          var result = bindingCache[cacheId];
          if (!result) {
            var names = [];
            var getters = {};
            var events = {};
            for (var i = 0, bindingName; bindingName = keys[i]; i++) {
              var binding = bindings[bindingName];
              var getter = binding && binding.getter;
              if (getter) {
                getters[bindingName] = getter;
                names.push(bindingName);
                if (binding.events) {
                  var eventList = String(binding.events).trim().split(/\s+|\s*,\s*/);
                  for (var j = 0, eventName; eventName = eventList[j]; j++) {
                    if (events[eventName]) events[eventName].push(bindingName); else events[eventName] = [ bindingName ];
                  }
                }
              }
            }
            result = {
              names: names,
              sync: createBindingUpdater(names, getters),
              handler: makeHandler(events, getters)
            };
            if (cacheId) bindingCache[cacheId] = result;
          }
          if (set) result.sync.call(set, instance.context);
          if (!instance.bindingInterface) return;
          if (result.handler) instance.bindingInterface.attach(instance.context, result.handler, set);
          return result.handler;
        };
      }
      var tools = {
        bind_textNode: bind_textNode,
        bind_node: bind_node,
        bind_element: bind_element,
        bind_comment: bind_comment,
        bind_attr: bind_attr,
        bind_attrClass: bind_attrClass,
        bind_attrStyle: bind_attrStyle,
        resolve: resolveValue,
        l10nToken: getL10nToken
      };
      return function(tokens, instances) {
        var fn = getFunctions(tokens, true, this.source.url, tokens.source_, !CLONE_NORMALIZATION_TEXT_BUG);
        var hasL10n = fn.createL10nSync;
        var initInstance;
        var l10nProtoSync;
        var l10nMap = {};
        var l10nLinks = [];
        var l10nMarkupTokens = [];
        var seed = 0;
        var proto = {
          cloneNode: function() {
            if (seed == 1) return buildDOM(tokens);
            proto = buildDOM(tokens);
            if (hasL10n) {
              l10nProtoSync = fn.createL10nSync(proto, l10nMap, bind_attr, CLONE_NORMALIZATION_TEXT_BUG);
              for (var i = 0, l10nToken; l10nToken = l10nLinks[i]; i++) l10nProtoSync(l10nToken.path, l10nMap[l10nToken.path]);
            }
            return proto.cloneNode(true);
          }
        };
        var createDOM = function() {
          return proto.cloneNode(true);
        };
        if (hasL10n) {
          var initL10n = function(set) {
            for (var i = 0, token; token = l10nLinks[i]; i++) set(token.path, l10nMap[token.path]);
          };
          var linkHandler = function(value) {
            var isMarkup = isMarkupToken(this.token);
            if (isMarkup) basis.array.add(l10nMarkupTokens, this); else basis.array.remove(l10nMarkupTokens, this);
            l10nMap[this.path] = isMarkup ? undefined : value == null ? "{" + this.path + "}" : value;
            if (l10nProtoSync) l10nProtoSync(this.path, l10nMap[this.path]);
            for (var key in instances) instances[key].tmpl.set(this.path, isMarkup ? this.token : value);
          };
          l10nLinks = fn.l10nKeys.map(function(key) {
            var token = getL10nToken(key);
            var link = {
              path: key,
              token: token,
              handler: linkHandler
            };
            token.attach(linkHandler, link);
            if (isMarkupToken(token)) l10nMarkupTokens.push(link); else l10nMap[key] = token.value == null ? "{" + key + "}" : token.value;
            return link;
          });
        }
        initInstance = fn.createInstanceFactory(this.templateId, createDOM, tools, l10nMap, l10nMarkupTokens, createBindingFunction(fn.keys), CLONE_NORMALIZATION_TEXT_BUG);
        return {
          createInstance: function(obj, onAction, onRebuild, bindings, bindingInterface) {
            var instanceId = seed++;
            var instance = {
              context: obj,
              action: onAction,
              rebuild: onRebuild,
              handler: null,
              bindings: bindings,
              bindingInterface: bindingInterface,
              attaches: null,
              compute: null,
              tmpl: null
            };
            initInstance(instanceId, instance, !instanceId ? initL10n : null);
            instances[instanceId] = instance;
            return instance.tmpl;
          },
          destroyInstance: function(tmpl) {
            var instanceId = tmpl.templateId_;
            var instance = instances[instanceId];
            if (instance) {
              if (instance.handler) instance.bindingInterface.detach(instance.context, instance.handler, instance.tmpl.set);
              if (instance.compute) {
                for (var i = 0; i < instance.compute.length; i++) instance.compute[i].destroy();
                instance.compute = null;
              }
              for (var key in instance.attaches) resolveValue.call(instance, key, null);
              delete instances[instanceId];
            }
          },
          destroy: function(rebuild) {
            for (var i = 0, link; link = l10nLinks[i]; i++) link.token.detach(link.handler, link);
            for (var key in instances) {
              var instance = instances[key];
              if (rebuild && instance.rebuild) instance.rebuild.call(instance.context);
              if (!rebuild || key in instances) {
                if (instance.handler) instance.bindingInterface.detach(instance.context, instance.handler, instance.tmpl.set);
                for (var key in instance.attaches) resolveValue.call(key, null);
              }
            }
            fn = null;
            proto = null;
            l10nMap = null;
            l10nLinks = null;
            l10nProtoSync = null;
            instances = null;
          }
        };
      };
    }();
    var HtmlTemplate = Template.subclass({
      className: namespace + ".Template",
      __extend__: function(value) {
        if (value instanceof HtmlTemplate) return value;
        if (value instanceof TemplateSwitchConfig) return new HtmlTemplateSwitcher(value);
        return new HtmlTemplate(value);
      },
      builder: builder
    });
    var HtmlTemplateSwitcher = TemplateSwitcher.subclass({
      className: namespace + ".TemplateSwitcher",
      templateClass: HtmlTemplate
    });
    module.exports = {
      Template: HtmlTemplate,
      TemplateSwitcher: HtmlTemplateSwitcher
    };
  },
  "4.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var Class = basis.Class;
    var Emitter = basis.require("./2.js").Emitter;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    basis.resource.extensions[".l10n"] = function(content, url) {
      return resolveDictionary(url).update(basis.resource.extensions[".json"](content, url));
    };
    var tokenIndex = [];
    var tokenComputeFn = {};
    var basisTokenPrototypeSet = basis.Token.prototype.set;
    var tokenType = {
      "default": true,
      plural: true,
      markup: true,
      "plural-markup": true,
      "enum-markup": true
    };
    var nestedType = {
      "default": "default",
      plural: "default",
      markup: "default",
      "plural-markup": "markup",
      "enum-markup": "markup"
    };
    var isPluralType = {
      plural: true,
      "plural-markup": true
    };
    var ComputeToken = Class(basis.Token, {
      className: namespace + ".ComputeToken",
      dictionary: null,
      token: null,
      parent: "",
      init: function(value) {
        this.token.computeTokens[this.basisObjectId] = this;
        basis.Token.prototype.init.call(this, value);
      },
      get: function() {
        var value = this.dictionary.getValue(this.getName());
        if (isPluralType[this.token.getType()]) value = String(value).replace(/\{#\}/g, this.value);
        return value;
      },
      getName: function() {
        var key = this.value;
        if (isPluralType[this.token.getType()]) key = cultures[currentCulture].plural(key);
        return this.parent + "." + key;
      },
      getType: function() {
        var type = this.token.getType();
        return this.dictionary.types[this.getName()] || nestedType[type] || "default";
      },
      getParentType: function() {
        return this.token.getType();
      },
      toString: function() {
        return this.get();
      },
      destroy: function() {
        delete this.token.computeTokens[this.basisObjectId];
        basis.Token.prototype.destroy.call(this);
      }
    });
    var Token = Class(basis.Token, {
      className: namespace + ".Token",
      index: NaN,
      dictionary: null,
      name: "",
      type: "default",
      computeTokens: null,
      computeTokenClass: null,
      init: function(dictionary, tokenName, value) {
        basis.Token.prototype.init.call(this, value);
        this.index = tokenIndex.push(this) - 1;
        this.name = tokenName;
        this.parent = tokenName.replace(/(^|\.)[^.]+$/, "");
        this.dictionary = dictionary;
        this.computeTokens = {};
      },
      toString: function() {
        return this.get();
      },
      apply: function() {
        for (var key in this.computeTokens) this.computeTokens[key].apply();
        basis.Token.prototype.apply.call(this);
      },
      set: function() {
        basis.dev.warn("basis.l10n: Value for l10n token can't be set directly, but through dictionary update only");
      },
      getName: function() {
        return this.name;
      },
      getType: function() {
        return this.dictionary.types[this.name] || nestedType[this.dictionary.types[this.parent]] || "default";
      },
      getParentType: function() {
        return this.parent ? this.dictionary.token(this.parent).getType() : "default";
      },
      setType: function() {
        basis.dev.warn("basis.l10n: Token#setType() is deprecated");
      },
      compute: function(events, getter) {
        if (arguments.length == 1) {
          getter = events;
          events = "";
        }
        getter = basis.getter(getter);
        events = String(events).trim().split(/\s+|\s*,\s*/).sort();
        var tokenId = this.basisObjectId;
        var enumId = events.concat(tokenId, getter[basis.getter.ID]).join("_");
        if (tokenComputeFn[enumId]) return tokenComputeFn[enumId];
        var token = this;
        var objectTokenMap = {};
        var updateValue = function(object) {
          basisTokenPrototypeSet.call(this, getter(object));
        };
        var handler = {
          destroy: function(object) {
            delete objectTokenMap[object.basisObjectId];
            this.destroy();
          }
        };
        for (var i = 0, eventName; eventName = events[i]; i++) if (eventName != "destroy") handler[eventName] = updateValue;
        return tokenComputeFn[enumId] = function(object) {
          if (object instanceof Emitter == false) throw "basis.l10n.Token#compute: object must be an instanceof Emitter";
          var objectId = object.basisObjectId;
          var computeToken = objectTokenMap[objectId];
          if (!computeToken) {
            computeToken = objectTokenMap[objectId] = token.computeToken(getter(object));
            object.addHandler(handler, computeToken);
          }
          return computeToken;
        };
      },
      computeToken: function(value) {
        var ComputeTokenClass = this.computeTokenClass;
        if (!ComputeTokenClass) ComputeTokenClass = this.computeTokenClass = ComputeToken.subclass({
          dictionary: this.dictionary,
          token: this,
          parent: this.name
        });
        return new ComputeTokenClass(value);
      },
      token: function(name) {
        if (isPluralType[this.getType()]) return this.computeToken(name, this);
        if (this.dictionary) return this.dictionary.token(this.name + "." + name);
      },
      destroy: function() {
        for (var key in this.computeTokens) this.computeTokens[key].destroy();
        this.computeTokenClass = null;
        this.computeTokens = null;
        this.value = null;
        this.dictionary = null;
        tokenIndex[this.index] = null;
        basis.Token.prototype.destroy.call(this);
      }
    });
    function resolveToken(path) {
      if (path.charAt(0) == "#") {
        return tokenIndex[parseInt(path.substr(1), 36)];
      } else {
        var parts = path.match(/^(.+?)@(.+)$/);
        if (parts) return resolveDictionary(basis.path.resolve(parts[2])).token(parts[1]);
        basis.dev.warn("basis.l10n.token accepts token references in format `token.path@path/to/dict.l10n` only");
      }
    }
    function isToken(value) {
      return value ? value instanceof Token || value instanceof ComputeToken : false;
    }
    function isPluralToken(value) {
      return isToken(value) && isPluralType[value.getType()];
    }
    function isMarkupToken(value) {
      return isToken(value) && value.getType() == "markup";
    }
    var dictionaries = [];
    var dictionaryByUrl = {};
    var createDictionaryNotifier = new basis.Token;
    function walkTokens(dictionary, culture, tokens, path) {
      var cultureValues = dictionary.cultureValues[culture];
      path = path ? path + "." : "";
      for (var name in tokens) {
        if (name.indexOf(".") != -1) {
          basis.dev.warn((dictionary.resource ? dictionary.resource.url : "[anonymous dictionary]") + ": wrong token name `" + name + "`, token ignored.");
          continue;
        }
        if (hasOwnProperty.call(tokens, name)) {
          var tokenName = path + name;
          var tokenValue = tokens[name];
          cultureValues[tokenName] = tokenValue;
          if (tokenValue && (typeof tokenValue == "object" || Array.isArray(tokenValue))) walkTokens(dictionary, culture, tokenValue, tokenName);
        }
      }
    }
    var Dictionary = Class(null, {
      className: namespace + ".Dictionary",
      tokens: null,
      types: null,
      cultureValues: null,
      index: NaN,
      resource: null,
      init: function(content) {
        this.tokens = {};
        this.types = {};
        this.cultureValues = {};
        this.index = dictionaries.push(this) - 1;
        if (basis.resource.isResource(content)) {
          var resource = content;
          this.resource = resource;
          if (!dictionaryByUrl[resource.url]) {
            dictionaryByUrl[resource.url] = this;
            createDictionaryNotifier.set(resource.url);
          }
          resource.fetch();
        } else {
          this.update(content || {});
        }
      },
      update: function(data) {
        if (!data) data = {};
        this.cultureValues = {};
        for (var culture in data) if (!/^_|_$/.test(culture)) {
          this.cultureValues[culture] = {};
          walkTokens(this, culture, data[culture]);
        }
        var newTypes = data._meta && data._meta.type || {};
        var currentTypes = {};
        for (var path in this.tokens) currentTypes[path] = this.tokens[path].getType();
        this.types = {};
        for (var path in newTypes) this.types[path] = tokenType[newTypes[path]] == true ? newTypes[path] : "default";
        for (var path in this.tokens) {
          var token = this.tokens[path];
          if (token.getType() != currentTypes[path]) this.tokens[path].apply();
        }
        this.syncValues();
        return this;
      },
      syncValues: function() {
        for (var tokenName in this.tokens) basisTokenPrototypeSet.call(this.tokens[tokenName], this.getValue(tokenName));
      },
      getValue: function(tokenName) {
        var fallback = cultureFallback[currentCulture] || [];
        for (var i = 0, cultureName; cultureName = fallback[i]; i++) {
          var cultureValues = this.cultureValues[cultureName];
          if (cultureValues && tokenName in cultureValues) return cultureValues[tokenName];
        }
      },
      getCultureValue: function(culture, tokenName) {
        return this.cultureValues[culture] && this.cultureValues[culture][tokenName];
      },
      token: function(tokenName) {
        var token = this.tokens[tokenName];
        if (!token) {
          token = this.tokens[tokenName] = new Token(this, tokenName, this.getValue(tokenName));
        }
        return token;
      },
      destroy: function() {
        this.tokens = null;
        this.cultureValues = null;
        basis.array.remove(dictionaries, this);
        if (this.resource) {
          delete dictionaryByUrl[this.resource.url];
          this.resource = null;
        }
      }
    });
    function resolveDictionary(source) {
      var dictionary;
      if (typeof source == "string") {
        var location = source;
        var extname = basis.path.extname(location);
        if (extname != ".l10n") location = location.replace(new RegExp(extname + "([#?]|$)"), ".l10n$1");
        source = basis.resource(location);
      }
      if (basis.resource.isResource(source)) dictionary = dictionaryByUrl[source.url];
      return dictionary || new Dictionary(source);
    }
    function getDictionaries() {
      return dictionaries.slice(0);
    }
    var cultureList = [];
    var currentCulture = null;
    var cultures = {};
    var cultureFallback = {};
    var pluralFormsMap = {};
    var pluralForms = [ [ 1, function() {
      return 0;
    } ], [ 2, function(n) {
      return n == 1 || n % 10 == 1 ? 0 : 1;
    } ], [ 2, function(n) {
      return n == 0 ? 0 : 1;
    } ], [ 2, function(n) {
      return n == 1 ? 0 : 1;
    } ], [ 2, function(n) {
      return n == 0 || n == 1 ? 0 : 1;
    } ], [ 2, function(n) {
      return n % 10 != 1 || n % 100 == 11 ? 1 : 0;
    } ], [ 3, function(n) {
      return n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
    } ], [ 3, function(n) {
      return n % 10 == 1 && n % 100 != 11 ? 0 : n != 0 ? 1 : 2;
    } ], [ 3, function(n) {
      return n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
    } ], [ 3, function(n) {
      return n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
    } ], [ 3, function(n) {
      return n == 0 ? 0 : n == 1 ? 1 : 2;
    } ], [ 3, function(n) {
      return n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2;
    } ], [ 3, function(n) {
      return n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
    } ], [ 3, function(n) {
      return n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2;
    } ], [ 4, function(n) {
      return n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3;
    } ], [ 4, function(n) {
      return n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3;
    } ], [ 4, function(n) {
      return n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0;
    } ], [ 4, function(n) {
      return n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3;
    } ], [ 4, function(n) {
      return n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3;
    } ], [ 5, function(n) {
      return n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4;
    } ], [ 6, function(n) {
      return n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
    } ] ];
    [ "ay bo cgg dz fa id ja jbo ka kk km ko ky lo ms my sah su th tt ug vi wo zh", "mk", "jv", "af an ast az bg bn brx ca da de doi el en eo es es-AR et eu ff fi fo fur fy gl gu ha he hi hne hu hy ia it kn ku lb mai ml mn mni mr nah nap nb ne nl nn no nso or pa pap pms ps pt rm rw sat sco sd se si so son sq sv sw ta te tk ur yo", "ach ak am arn br fil fr gun ln mfe mg mi oc pt-BR tg ti tr uz wa zh", "is", "csb", "lv", "lt", "be bs hr ru sr uk", "mnk", "ro", "pl", "cs sk", "cy", "kw", "sl", "mt", "gd", "ga", "ar" ].forEach(function(langs, idx) {
      langs.split(" ").forEach(function(lang) {
        pluralFormsMap[lang] = this;
      }, pluralForms[idx]);
    });
    var Culture = basis.Class(null, {
      className: namespace + ".Culture",
      name: "",
      pluralForm: null,
      init: function(name, pluralForm) {
        this.name = name;
        if (!cultures[name]) cultures[name] = this;
        this.pluralForm = pluralForm || pluralFormsMap[name] || pluralFormsMap[name.split("-")[0]] || pluralForms[0];
      },
      plural: function(value) {
        return Number(this.pluralForm[1](Math.abs(parseInt(value, 10))));
      }
    });
    function resolveCulture(name, pluralForm) {
      if (name && !cultures[name]) cultures[name] = new Culture(name, pluralForm);
      return cultures[name || currentCulture];
    }
    basis.object.extend(resolveCulture, new basis.Token);
    resolveCulture.set = setCulture;
    function getCulture() {
      return currentCulture;
    }
    function setCulture(culture) {
      if (!culture) return;
      if (currentCulture != culture) {
        if (cultureList.indexOf(culture) == -1) {
          basis.dev.warn("basis.l10n.setCulture: culture `" + culture + "` not in the list, the culture isn't changed");
          return;
        }
        currentCulture = culture;
        for (var i = 0, dictionary; dictionary = dictionaries[i]; i++) dictionary.syncValues();
        basis.Token.prototype.set.call(resolveCulture, culture);
      }
    }
    function getCultureList() {
      return cultureList.slice(0);
    }
    function setCultureList(list) {
      if (typeof list == "string") list = list.trim().split(" ");
      if (!list.length) {
        basis.dev.warn("basis.l10n.setCultureList: culture list can't be empty, the culture list isn't changed");
        return;
      }
      var cultures = {};
      var cultureRow;
      var baseCulture;
      cultureFallback = {};
      for (var i = 0, culture, cultureName; culture = list[i]; i++) {
        cultureRow = culture.split("/");
        if (cultureRow.length > 2) {
          basis.dev.warn("basis.l10n.setCultureList: only one fallback culture can be set for certain culture, try to set `" + culture + "`; other cultures except first one was ignored");
          cultureRow = cultureRow.slice(0, 2);
        }
        cultureName = cultureRow[0];
        if (!baseCulture) baseCulture = cultureName;
        cultures[cultureName] = resolveCulture(cultureName);
        cultureFallback[cultureName] = cultureRow;
      }
      for (var cultureName in cultureFallback) {
        cultureFallback[cultureName] = basis.array.flatten(cultureFallback[cultureName].map(function(name) {
          return cultureFallback[name];
        })).concat(baseCulture).filter(function(item, idx, array) {
          return !idx || array.lastIndexOf(item, idx - 1) == -1;
        });
      }
      cultureList = basis.object.keys(cultures);
      if (currentCulture in cultures == false) setCulture(baseCulture);
    }
    function onCultureChange(fn, context, fire) {
      resolveCulture.attach(fn, context);
      if (fire) fn.call(context, currentCulture);
    }
    setCultureList("en-US");
    setCulture("en-US");
    module.exports = {
      ComputeToken: ComputeToken,
      Token: Token,
      token: resolveToken,
      isToken: isToken,
      isPluralToken: isPluralToken,
      isMarkupToken: isMarkupToken,
      Dictionary: Dictionary,
      dictionary: resolveDictionary,
      getDictionaries: getDictionaries,
      addCreateDictionaryHandler: createDictionaryNotifier.attach.bind(createDictionaryNotifier),
      removeCreateDictionaryHandler: createDictionaryNotifier.detach.bind(createDictionaryNotifier),
      Culture: Culture,
      culture: resolveCulture,
      getCulture: getCulture,
      setCulture: setCulture,
      getCultureList: getCultureList,
      setCultureList: setCultureList,
      pluralForms: pluralForms,
      onCultureChange: onCultureChange
    };
    (function() {
      var value = false;
      try {
        Object.defineProperty(module.exports, "enableMarkup", {
          get: function() {
            return value;
          },
          set: function(newValue) {
            basis.dev.warn("basis.l10n: enableMarkup option is deprecated, just remove it from your source code as markup l10n tokens enabled by default now");
            value = newValue;
          }
        });
      } catch (e) {}
    })();
  },
  "5.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var consts = basis.require("./6.js");
    var MARKER = consts.MARKER;
    var TYPE_ELEMENT = consts.TYPE_ELEMENT;
    var TYPE_ATTRIBUTE = consts.TYPE_ATTRIBUTE;
    var TYPE_ATTRIBUTE_CLASS = consts.TYPE_ATTRIBUTE_CLASS;
    var TYPE_ATTRIBUTE_STYLE = consts.TYPE_ATTRIBUTE_STYLE;
    var TYPE_ATTRIBUTE_EVENT = consts.TYPE_ATTRIBUTE_EVENT;
    var TYPE_TEXT = consts.TYPE_TEXT;
    var TYPE_COMMENT = consts.TYPE_COMMENT;
    var TOKEN_TYPE = consts.TOKEN_TYPE;
    var TOKEN_BINDINGS = consts.TOKEN_BINDINGS;
    var TOKEN_REFS = consts.TOKEN_REFS;
    var ATTR_NAME = consts.ATTR_NAME;
    var ATTR_NAME_BY_TYPE = consts.ATTR_NAME_BY_TYPE;
    var ELEMENT_NAME = consts.ELEMENT_NAME;
    var ELEMENT_ATTRIBUTES_AND_CHILDREN = consts.ELEMENT_ATTRIBUTES_AND_CHILDREN;
    var CLASS_BINDING_ENUM = consts.CLASS_BINDING_ENUM;
    var CLASS_BINDING_BOOL = consts.CLASS_BINDING_BOOL;
    var inlineSeed = 1;
    var tmplFunctions = {};
    var SET_NONELEMENT_PROPERTY_SUPPORT = function() {
      try {
        global.document.createTextNode("").x = 1;
        return true;
      } catch (e) {
        return false;
      }
    }();
    var buildPathes = function() {
      var PATH_REF_NAME = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      var pathList;
      var refList;
      var bindingList;
      var markedElementList;
      var rootPath;
      var attrExprId;
      function putRefs(refs, pathIdx) {
        for (var i = 0, refName; refName = refs[i]; i++) if (refName.indexOf(":") == -1) refList.push(refName + ":" + pathIdx);
      }
      function putPath(path) {
        var len = pathList.length;
        var pathRef = PATH_REF_NAME[len] || "r" + len;
        pathList.push(pathRef + "=" + path);
        return pathRef;
      }
      function putBinding(binding) {
        bindingList.push(binding);
      }
      function processTokens(tokens, path, noTextBug) {
        var localPath;
        var refs;
        var myRef;
        var explicitRef;
        var bindings;
        for (var i = 0, cp = 0, closeText = 0, token; token = tokens[i]; i++, cp++, explicitRef = false) {
          if (!i) localPath = path + ".firstChild"; else {
            if (!tokens[i + 1]) localPath = path + ".lastChild"; else {
              if (token[TOKEN_TYPE] == tokens[i - 1][TOKEN_TYPE] && token[TOKEN_TYPE] == TYPE_TEXT) closeText++;
              localPath = path + ".childNodes[" + (noTextBug ? cp : cp + (closeText ? " + " + closeText + " * TEXT_BUG" : "")) + "]";
            }
          }
          if (refs = token[TOKEN_REFS]) {
            explicitRef = true;
            localPath = putPath(localPath);
            putRefs(refs, localPath);
          }
          if (token[TOKEN_BINDINGS]) {
            if (token[TOKEN_BINDINGS] && typeof token[TOKEN_BINDINGS] == "number") token[TOKEN_BINDINGS] = token[TOKEN_REFS][token[TOKEN_BINDINGS] - 1];
            if (!explicitRef) {
              explicitRef = true;
              localPath = putPath(localPath);
            }
            putBinding([ token[TOKEN_TYPE], localPath, token[TOKEN_BINDINGS], refs ? refs.indexOf("element") != -1 : false ]);
          }
          if (path == rootPath && (SET_NONELEMENT_PROPERTY_SUPPORT || token[TOKEN_TYPE] == TYPE_ELEMENT)) markedElementList.push(localPath + "." + MARKER);
          if (token[TOKEN_TYPE] == TYPE_ELEMENT) {
            myRef = -1;
            if (!explicitRef) {
              localPath = putPath(localPath);
              myRef = pathList.length;
            }
            var attrs = [];
            var children = [];
            for (var j = ELEMENT_ATTRIBUTES_AND_CHILDREN, t; t = token[j]; j++) if (t[TOKEN_TYPE] == TYPE_ELEMENT || t[TOKEN_TYPE] == TYPE_TEXT || t[TOKEN_TYPE] == TYPE_COMMENT) children.push(t); else attrs.push(t);
            for (var j = 0, attr; attr = attrs[j]; j++) {
              var attrTokenType = attr[TOKEN_TYPE];
              if (attrTokenType == TYPE_ATTRIBUTE_EVENT) continue;
              var attrName = ATTR_NAME_BY_TYPE[attrTokenType] || attr[ATTR_NAME];
              if (refs = attr[TOKEN_REFS]) {
                explicitRef = true;
                putRefs(refs, putPath(localPath + '.getAttributeNode("' + attrName + '")'));
              }
              if (bindings = attr[TOKEN_BINDINGS]) {
                explicitRef = true;
                switch (attrTokenType) {
                  case TYPE_ATTRIBUTE_CLASS:
                    for (var k = 0, binding; binding = bindings[k]; k++) putBinding([ 2, localPath, binding[1], attrName, binding[0] ].concat(binding[2] == -1 ? [] : binding.slice(2)));
                    break;
                  case TYPE_ATTRIBUTE_STYLE:
                    for (var k = 0, property; property = bindings[k]; k++) {
                      attrExprId++;
                      for (var m = 0, bindName; bindName = property[0][m]; m++) putBinding([ 2, localPath, bindName, attrName, property[0], property[1], property[2], property[3], attrExprId ]);
                    }
                    break;
                  default:
                    attrExprId++;
                    for (var k = 0, bindName; bindName = bindings[0][k]; k++) putBinding([ 2, localPath, bindName, attrName, bindings[0], bindings[1], token[ELEMENT_NAME], attrExprId ]);
                }
              }
            }
            if (children.length) processTokens(children, localPath, noTextBug);
            if (!explicitRef && myRef == pathList.length) pathList.pop();
          }
        }
      }
      return function(tokens, path, noTextBug) {
        pathList = [];
        refList = [];
        bindingList = [];
        markedElementList = [];
        rootPath = path || "_";
        attrExprId = 0;
        processTokens(tokens, rootPath, noTextBug);
        return {
          path: pathList,
          ref: refList,
          binding: bindingList,
          markedElementList: markedElementList
        };
      };
    }();
    var buildBindings = function() {
      var L10N_BINDING = /\.\{([a-zA-Z_][a-zA-Z0-9_\-]*)\}/;
      var SPECIAL_ATTR_MAP = {
        disabled: "*",
        checked: [ "input" ],
        indeterminate: [ "input" ],
        value: [ "input", "textarea", "select" ],
        minlength: [ "input" ],
        maxlength: [ "input" ],
        readonly: [ "input" ],
        selected: [ "option" ],
        multiple: [ "select" ]
      };
      var SPECIAL_ATTR_SINGLE = {
        disabled: true,
        checked: true,
        selected: true,
        readonly: true,
        multiple: true,
        indeterminate: true
      };
      var STYLE_EXPR_VALUE = {
        show: '"none"',
        visible: '"hidden"'
      };
      var STYLE_EXPR_TOGGLE = {
        hide: '?"none":""',
        show: '?"":"none"',
        hidden: '?"hidden":""',
        visible: '?"":"hidden"'
      };
      var bindFunctions = {
        1: "bind_element",
        3: "bind_textNode",
        8: "bind_comment"
      };
      function quoteString(value) {
        return '"' + value.replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '"';
      }
      function simpleStringify(val) {
        return typeof val == "string" ? quoteString(val) : val;
      }
      function buildAttrExpression(binding, special, l10n) {
        var expression = [];
        var symbols = binding[5];
        var dictionary = binding[4];
        var exprVar;
        var colonPos;
        for (var j = 0; j < symbols.length; j++) {
          if (typeof symbols[j] == "string") expression.push(quoteString(symbols[j])); else {
            exprVar = dictionary[symbols[j]];
            colonPos = exprVar.indexOf(":");
            if (colonPos == -1) {
              expression.push(special == "l10n" ? '"{' + exprVar + '}"' : special == "bool" ? "(__" + exprVar + '||"")' : "__" + exprVar);
            } else {
              var bindingName = null;
              var l10nPath = exprVar.substr(colonPos + 1).replace(L10N_BINDING, function(m, name) {
                bindingName = name;
                return "";
              });
              if (bindingName) expression.push(l10n[exprVar.substr(colonPos + 1)]); else expression.push('l10n["' + l10nPath + '"]');
            }
          }
        }
        if (expression.length == 1) expression.push('""');
        return expression.join("+");
      }
      return function(bindings) {
        function putBindCode(type) {
          toolsUsed[type] = true;
          bindCode.push(bindVar + "=" + type + "(" + basis.array(arguments, 1) + ");");
        }
        var bindMap = {};
        var bindCode;
        var bindVar;
        var bindVarSeed = 0;
        var varList = [];
        var result = [];
        var bindingsWoL10nCompute = [];
        var varName;
        var l10nMap;
        var l10nCompute = [];
        var l10nBindings = {};
        var l10nBindSeed = 0;
        var attrExprId;
        var attrExprMap = {};
        var debugList = [];
        var toolsUsed = {
          resolve: true
        };
        for (var i = 0, binding; binding = bindings[i]; i++) {
          var bindType = binding[0];
          var domRef = binding[1];
          var bindName = binding[2];
          var nodeBindingProhibited = binding[3];
          var namePart = bindName.split(":");
          if (namePart[0] == "l10n" && namePart[1]) {
            var l10nFullPath = namePart[1];
            var l10nBinding = null;
            var l10nName = l10nFullPath.replace(L10N_BINDING, function(m, name) {
              l10nBinding = name;
              return "";
            });
            if (l10nBinding) {
              if (l10nFullPath in l10nBindings == false) {
                varName = "$l10n_" + l10nBindSeed++;
                l10nBindings[l10nFullPath] = varName;
                l10nCompute.push(varName);
                varList.push(varName + '=tools.l10nToken("' + l10nName + '").computeToken()');
                bindCode = bindMap[l10nBinding];
                if (!bindCode) {
                  bindCode = bindMap[l10nBinding] = [];
                  varList.push("__" + l10nBinding);
                }
                bindCode.push(varName + ".set(__" + l10nBinding + ");");
              }
              bindName = l10nBindings[l10nFullPath];
              bindVar = "_" + bindVarSeed++;
              varName = "__" + bindName;
              bindCode = bindMap[bindName];
              if (!bindCode) {
                bindCode = bindMap[bindName] = [];
                varList.push(varName);
              }
              if (bindType == TYPE_TEXT) {
                debugList.push("{" + [ 'binding:"' + bindName + '"', "dom:" + domRef, "val:" + bindVar, "l10n:true", "attachment:" + bindName ] + "}");
                varList.push(bindVar + "=" + domRef);
                putBindCode(bindFunctions[bindType], domRef, bindVar, "value", nodeBindingProhibited);
              } else {
                attrName = '"' + binding[ATTR_NAME] + '"';
                debugList.push("{" + [ 'binding:"' + l10nFullPath + '"', "dom:" + domRef, "attr:" + attrName, "val:" + bindVar, "l10n:true", "attachment:" + bindName ] + "}");
                varList.push(bindVar);
                putBindCode("bind_attr", domRef, attrName, bindVar, buildAttrExpression(binding, false, l10nBindings));
              }
              continue;
            }
          }
          bindingsWoL10nCompute.push(binding);
        }
        for (var i = 0, binding; binding = bindingsWoL10nCompute[i]; i++) {
          var bindType = binding[0];
          var domRef = binding[1];
          var bindName = binding[2];
          var nodeBindingProhibited = binding[3];
          if ([ "get", "set", "templateId_" ].indexOf(bindName) != -1) {
            basis.dev.warn("binding name `" + bindName + "` is prohibited, binding ignored");
            continue;
          }
          var namePart = bindName.split(":");
          var anim = namePart[0] == "anim";
          var l10n = namePart[0] == "l10n";
          if (anim) bindName = namePart[1];
          bindCode = hasOwnProperty.call(bindMap, bindName) ? bindMap[bindName] : null;
          bindVar = "_" + bindVarSeed++;
          varName = "__" + bindName;
          if (l10n && namePart[1]) {
            var l10nFullPath = namePart[1];
            var l10nBinding = null;
            var l10nName = l10nFullPath;
            if (!l10nMap) l10nMap = {};
            if (!bindMap[l10nName]) {
              bindMap[l10nName] = [];
              bindMap[l10nName].l10n = "$l10n_" + l10nBindSeed++;
              varList.push("__" + bindMap[l10nName].l10n + '=l10n["' + l10nName + '"]');
              l10nMap[l10nName] = [];
            }
            bindCode = bindMap[l10nName];
            if (bindType == TYPE_TEXT) {
              debugList.push("{" + [ 'binding:"' + l10nFullPath + '"', "dom:" + domRef, 'val:l10n["' + l10nName + '"]', "l10n:true", 'attachment:l10nToken("' + l10nName + '")' ] + "}");
              toolsUsed.l10nToken = true;
              l10nMap[l10nName].push(domRef + ".nodeValue=value;");
              if (!bindCode.nodeBind) {
                varList.push(bindVar + "=" + domRef);
                putBindCode(bindFunctions[bindType], domRef, bindVar, "value", nodeBindingProhibited);
                bindCode.nodeBind = bindVar;
              } else {
                bindCode.push(domRef + ".nodeValue=value;");
              }
              continue;
            } else {
              l10nMap[l10nName].push("bind_attr(" + [ domRef, '"' + binding[ATTR_NAME] + '"', "NaN", buildAttrExpression(binding, "l10n", l10nBindings) ] + ");");
            }
          }
          if (!bindCode) {
            bindCode = bindMap[bindName] = [];
            varList.push(varName);
          }
          if (bindType != TYPE_ATTRIBUTE) {
            debugList.push("{" + [ 'binding:"' + bindName + '"', "dom:" + domRef, "val:" + (bindCode.nodeBind ? varName : bindVar), "updates:$$" + bindName, 'attachment:instance.attaches&&instance.attaches["' + bindName + '"]&&instance.attaches["' + bindName + '"].value' ] + "}");
            if (!bindCode.nodeBind) {
              varList.push(bindVar + "=" + domRef);
              putBindCode(bindFunctions[bindType], domRef, bindVar, "value", nodeBindingProhibited);
              bindCode.nodeBind = bindVar;
            } else {
              switch (bindType) {
                case TYPE_ELEMENT:
                  putBindCode(bindFunctions[bindType], domRef, domRef, "value!==null?String(value):null");
                  break;
                case TYPE_TEXT:
                  bindCode.push(domRef + ".nodeValue=value;");
                  break;
              }
            }
          } else {
            var attrName = binding[ATTR_NAME];
            switch (attrName) {
              case "class":
                var defaultExpr = "";
                var valueExpr = "value";
                var bindingType = binding[5];
                var defaultValue = binding[7];
                switch (bindingType) {
                  case CLASS_BINDING_BOOL:
                    var values = [ binding[6] ];
                    var prefix = binding[4];
                    var classes = Array.isArray(prefix) ? prefix : values.map(function(val) {
                      return prefix + val;
                    });
                    valueExpr = 'value?"' + classes[0] + '":""';
                    if (defaultValue) defaultExpr = classes[defaultValue - 1];
                    break;
                  case CLASS_BINDING_ENUM:
                    var values = binding[8];
                    var prefix = binding[4];
                    var classes = Array.isArray(prefix) ? prefix : values.map(function(val) {
                      return prefix + val;
                    });
                    valueExpr = values.map(function(val, idx) {
                      return 'value=="' + val + '"?"' + classes[idx] + '"';
                    }).join(":") + ':""';
                    if (defaultValue) defaultExpr = classes[defaultValue - 1];
                    break;
                  default:
                    var prefix = binding[4];
                    valueExpr = 'typeof value=="string"||typeof value=="number"?"' + prefix + '"+value:(value?"' + prefix + bindName + '":"")';
                }
                varList.push(bindVar + '="' + defaultExpr + '"');
                putBindCode("bind_attrClass", domRef, bindVar, valueExpr, anim);
                debugList.push("{" + [ 'binding:"' + bindName + '"', "raw:__" + bindName, 'prefix:"' + "???" + '"', "anim:" + anim, "dom:" + domRef, 'attr:"' + attrName + '"', "val:" + bindVar, 'attachment:instance.attaches&&instance.attaches["' + bindName + '"]&&instance.attaches["' + bindName + '"].value' ] + "}");
                break;
              case "style":
                var expr = buildAttrExpression(binding, false, l10nBindings);
                attrExprId = binding[8];
                if (!attrExprMap[attrExprId]) {
                  attrExprMap[attrExprId] = bindVar;
                  varList.push(bindVar + "=" + (STYLE_EXPR_VALUE[binding[7]] || '""'));
                }
                if (binding[7]) expr = expr.replace(/\+""$/, "") + (STYLE_EXPR_TOGGLE[binding[7]] || "");
                bindVar = attrExprMap[attrExprId];
                putBindCode("bind_attrStyle", domRef, '"' + binding[6] + '"', bindVar, expr);
                debugList.push("{" + [ 'binding:"' + bindName + '"', "raw:__" + bindName, 'property:"' + binding[6] + '"', "expr:[[" + binding[5].map(simpleStringify) + "],[" + binding[4].map(simpleStringify) + "]]", "dom:" + domRef, 'attr:"' + attrName + '"', "val:" + bindVar, 'attachment:instance.attaches&&instance.attaches["' + bindName + '"]&&instance.attaches["' + bindName + '"].value' ] + "}");
                break;
              default:
                var specialAttr = SPECIAL_ATTR_MAP[attrName];
                var tagName = binding[6].toLowerCase();
                var expr = specialAttr && SPECIAL_ATTR_SINGLE[attrName] ? buildAttrExpression(binding, "bool", l10nBindings) + '?"' + attrName + '":""' : buildAttrExpression(binding, false, l10nBindings);
                attrExprId = binding[7];
                if (!attrExprMap[attrExprId]) {
                  varList.push(bindVar + "=" + expr);
                  attrExprMap[attrExprId] = bindVar;
                }
                bindVar = attrExprMap[attrExprId];
                if (attrName == "tabindex") putBindCode("bind_attr", domRef, '"' + attrName + '"', bindVar, expr + "==-1?" + ([ "input", "button", "textarea" ].indexOf(tagName) == -1 ? '""' : "-1") + ":" + expr); else putBindCode("bind_attr", domRef, '"' + attrName + '"', bindVar, expr);
                if (specialAttr && (specialAttr == "*" || specialAttr.indexOf(tagName) != -1)) bindCode.push("if(" + domRef + "." + attrName + "!=" + bindVar + ")" + domRef + "." + attrName + "=" + (SPECIAL_ATTR_SINGLE[attrName] ? "!!" + bindVar : bindVar) + ";");
                debugList.push("{" + [ 'binding:"' + bindName + '"', "raw:" + (l10n ? 'l10n["' + bindName + '"]' : "__" + bindName), 'type:"' + (specialAttr && SPECIAL_ATTR_SINGLE[attrName] ? "bool" : "string") + '"', "expr:[[" + binding[5].map(simpleStringify) + "],[" + binding[4].map(simpleStringify) + "]]", "dom:" + domRef, 'attr:"' + attrName + '"', "val:" + bindVar, 'attachment:instance.attaches&&instance.attaches["' + bindName + '"]&&instance.attaches["' + bindName + '"].value' ] + "}");
            }
          }
        }
        result.push(";function set(bindName,value){" + 'if(typeof bindName!="string")');
        for (var bindName in bindMap) if (bindMap[bindName].nodeBind) {
          result.push("if(bindName===" + bindMap[bindName].nodeBind + ")" + 'bindName="' + bindName + '";' + "else ");
        }
        result.push("return;");
        result.push("value=resolve.call(instance,bindName,value,Attaches);" + "switch(bindName){");
        for (var bindName in bindMap) {
          var stateVar = bindMap[bindName].l10n || bindName;
          varList.push("$$" + stateVar + "=0");
          result.push('case"' + bindName + '":' + "if(__" + stateVar + "!==value)" + "{" + "$$" + stateVar + "++;" + "__" + stateVar + "=value;" + bindMap[bindName].join("") + "}" + "break;");
        }
        result.push("}}");
        var toolsVarList = [];
        for (var key in toolsUsed) toolsVarList.push(key + "=tools." + key);
        return {
          debugList: debugList,
          keys: basis.object.keys(bindMap).filter(function(key) {
            return key.indexOf("@") == -1;
          }),
          tools: toolsVarList,
          vars: varList,
          set: result.join(""),
          l10n: l10nMap,
          l10nCompute: l10nCompute
        };
      };
    }();
    function compileFunction(args, body) {
      try {
        return new Function(args, body);
      } catch (e) {
        basis.dev.error("Can't build template function: " + e + "\n", "function(" + args + "){\n" + body + "\n}");
      }
    }
    var getFunctions = function(tokens, debug, uri, source, noTextBug) {
      var fn = tmplFunctions[uri && basis.path.relative(uri)];
      if (fn) return fn;
      var paths = buildPathes(tokens, "_", noTextBug);
      var bindings = buildBindings(paths.binding);
      var objectRefs = paths.markedElementList.join("=");
      var result = {
        keys: bindings.keys,
        l10nKeys: basis.object.keys(bindings.l10n)
      };
      if (tokens.length == 1) paths.path[0] = "a=_";
      if (!uri) uri = basis.path.baseURI + "inline_template" + inlineSeed++ + ".tmpl";
      if (bindings.l10n) {
        var code = [];
        for (var key in bindings.l10n) code.push('case"' + key + '":' + bindings.l10n[key].join("") + "break;");
        result.createL10nSync = compileFunction([ "_", "l10n", "bind_attr", "TEXT_BUG" ], (source ? "\n// " + source.split(/\r\n?|\n\r?/).join("\n// ") + "\n\n" : "") + "var " + paths.path + ";" + "return function(path, value){" + "switch(path){" + code.join("") + "}" + "}" + "\n\n//# sourceURL=" + basis.path.origin + uri + "_l10n");
      }
      result.createInstanceFactory = compileFunction([ "tid", "createDOM", "tools", "l10nMap", "l10nMarkup", "getBindings", "TEXT_BUG" ], (source ? "\n// " + source.split(/\r\n?|\n\r?/).join("\n// ") + "\n\n" : "") + "var " + (bindings.tools.length ? bindings.tools + "," : "") + "Attaches=function(){};" + "Attaches.prototype={" + bindings.keys.map(function(key) {
        return key + ":null";
      }) + "};" + "return function createTmpl_(id,instance,initL10n){" + "var _=createDOM()," + (bindings.l10n ? "l10n=initL10n?{}:l10nMap," : "") + paths.path.concat(bindings.vars) + (debug ? ";instance.debug=function debug(){" + "return {" + "bindings:[" + bindings.debugList + "]," + "values:{" + bindings.keys.map(function(key) {
        return '"' + key + '":__' + key;
      }) + "}," + "compute:Array.prototype.slice.call(instance.compute || [])" + "}" + "}" : "") + (bindings.l10nCompute.length ? ";instance.compute=[" + bindings.l10nCompute + "]" : "") + ";instance.tmpl={" + [ paths.ref, "templateId_:id", "set:set" ] + "}" + (objectRefs ? ";if(instance.context||instance.onAction)" + objectRefs + "=(id<<12)|tid" : "") + bindings.set + (bindings.l10n ? ";if(initL10n){l10n=l10nMap;initL10n(set)}" + ";if(l10nMarkup.length)for(var idx=0,token;token=l10nMarkup[idx];idx++)set(token.path,token.token);" : "") + ";if(instance.bindings)instance.handler=getBindings(instance,set)" + ";" + bindings.l10nCompute.map(function(varName) {
        return 'set("' + varName + '",' + varName + ")";
      }) + "}" + "\n\n//# sourceURL=" + basis.path.origin + uri);
      return result;
    };
    module.exports = {
      getFunctions: getFunctions
    };
  },
  "6.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var MARKER = "basisTemplateId_" + basis.genUID();
    var TYPE_ELEMENT = 1;
    var TYPE_ATTRIBUTE = 2;
    var TYPE_ATTRIBUTE_CLASS = 4;
    var TYPE_ATTRIBUTE_STYLE = 5;
    var TYPE_ATTRIBUTE_EVENT = 6;
    var TYPE_TEXT = 3;
    var TYPE_COMMENT = 8;
    var TOKEN_TYPE = 0;
    var TOKEN_BINDINGS = 1;
    var TOKEN_REFS = 2;
    var ATTR_NAME = 3;
    var ATTR_VALUE = 4;
    var ATTR_NAME_BY_TYPE = {
      4: "class",
      5: "style"
    };
    var ATTR_TYPE_BY_NAME = {
      "class": TYPE_ATTRIBUTE_CLASS,
      style: TYPE_ATTRIBUTE_STYLE
    };
    var ATTR_VALUE_INDEX = {
      2: ATTR_VALUE,
      4: ATTR_VALUE - 1,
      5: ATTR_VALUE - 1,
      6: 2
    };
    var ELEMENT_NAME = 3;
    var ELEMENT_ATTRIBUTES_AND_CHILDREN = 4;
    var TEXT_VALUE = 3;
    var COMMENT_VALUE = 3;
    var CLASS_BINDING_ENUM = 1;
    var CLASS_BINDING_BOOL = 2;
    var CLASS_BINDING_INVERT = 3;
    var CLASS_BINDING_EQUAL = 4;
    var CLASS_BINDING_NOTEQUAL = 5;
    var document = global.document;
    var CLONE_NORMALIZATION_TEXT_BUG = !document ? true : function() {
      var element = document.createElement("div");
      element.appendChild(document.createTextNode("a"));
      element.appendChild(document.createTextNode("a"));
      return element.cloneNode(true).childNodes.length == 1;
    }();
    module.exports = {
      MARKER: MARKER,
      TYPE_ELEMENT: TYPE_ELEMENT,
      TYPE_ATTRIBUTE: TYPE_ATTRIBUTE,
      TYPE_ATTRIBUTE_CLASS: TYPE_ATTRIBUTE_CLASS,
      TYPE_ATTRIBUTE_STYLE: TYPE_ATTRIBUTE_STYLE,
      TYPE_ATTRIBUTE_EVENT: TYPE_ATTRIBUTE_EVENT,
      TYPE_TEXT: TYPE_TEXT,
      TYPE_COMMENT: TYPE_COMMENT,
      TOKEN_TYPE: TOKEN_TYPE,
      TOKEN_BINDINGS: TOKEN_BINDINGS,
      TOKEN_REFS: TOKEN_REFS,
      ATTR_NAME: ATTR_NAME,
      ATTR_VALUE: ATTR_VALUE,
      ATTR_NAME_BY_TYPE: ATTR_NAME_BY_TYPE,
      ATTR_TYPE_BY_NAME: ATTR_TYPE_BY_NAME,
      ATTR_VALUE_INDEX: ATTR_VALUE_INDEX,
      ELEMENT_NAME: ELEMENT_NAME,
      ELEMENT_ATTRIBUTES_AND_CHILDREN: ELEMENT_ATTRIBUTES_AND_CHILDREN,
      TEXT_VALUE: TEXT_VALUE,
      COMMENT_VALUE: COMMENT_VALUE,
      CLASS_BINDING_ENUM: CLASS_BINDING_ENUM,
      CLASS_BINDING_BOOL: CLASS_BINDING_BOOL,
      CLASS_BINDING_INVERT: CLASS_BINDING_INVERT,
      CLASS_BINDING_EQUAL: CLASS_BINDING_EQUAL,
      CLASS_BINDING_NOTEQUAL: CLASS_BINDING_NOTEQUAL,
      CLONE_NORMALIZATION_TEXT_BUG: CLONE_NORMALIZATION_TEXT_BUG
    };
  },
  "7.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var document = global.document;
    var Class = basis.Class;
    var cleaner = basis.cleaner;
    var path = basis.path;
    var consts = basis.require("./6.js");
    var DECLARATION_VERSION = basis.require("./8.js").VERSION;
    var getDeclFromSource = basis.require("./8.js").getDeclFromSource;
    var makeDeclaration = basis.require("./8.js").makeDeclaration;
    var store = basis.require("./9.js");
    var theme = basis.require("./a.js");
    var getSourceByPath = theme.get;
    var templateList = [];
    var sourceByDocumentId = {};
    function resolveSourceByDocumentId(sourceId) {
      var resource = sourceByDocumentId[sourceId];
      if (!resource) {
        var host = document.getElementById(sourceId);
        var source = "";
        if (host && host.tagName == "SCRIPT" && host.type == "text/basis-template") source = host.textContent || host.text; else if (!host) basis.dev.warn("Template script element with id `" + sourceId + "` not found"); else basis.dev.warn('Template should be declared in <script type="text/basis-template"> element (id `' + sourceId + "`)");
        resource = sourceByDocumentId[sourceId] = basis.resource.virtual("tmpl", source || "");
        resource.id = sourceId;
        resource.url = '<script id="' + sourceId + '"/>';
      }
      return resource;
    }
    function resolveResource(ref, baseURI) {
      if (/^#\d+$/.test(ref)) return templateList[ref.substr(1)];
      if (/^id:/.test(ref)) return resolveSourceByDocumentId(ref.substr(3));
      if (/^[a-z0-9\.]+$/i.test(ref) && !/\.tmpl$/.test(ref)) return getSourceByPath(ref);
      return basis.resource(basis.resource.resolveURI(ref, baseURI, '<b:include src="{url}"/>'));
    }
    function templateSourceUpdate() {
      if (this.destroyBuilder) buildTemplate.call(this);
      var cursor = this;
      while (cursor = cursor.attaches_) cursor.handler.call(cursor.context);
    }
    function buildTemplate() {
      var declaration = getDeclFromSource(this.source, this.baseURI, false, {
        isolate: this.getIsolatePrefix()
      });
      var destroyBuilder = this.destroyBuilder;
      var instances = {};
      var funcs = this.builder(declaration.tokens, instances);
      this.createInstance = funcs.createInstance;
      this.clearInstance = funcs.destroyInstance;
      this.destroyBuilder = funcs.destroy;
      store.add(this.templateId, this, instances);
      this.instances_ = instances;
      this.decl_ = declaration;
      var newDeps = declaration.deps;
      var oldDeps = this.deps_;
      this.deps_ = newDeps;
      if (oldDeps) for (var i = 0, dep; dep = oldDeps[i]; i++) dep.bindingBridge.detach(dep, buildTemplate, this);
      if (newDeps) for (var i = 0, dep; dep = newDeps[i]; i++) dep.bindingBridge.attach(dep, buildTemplate, this);
      var newResources = declaration.resources;
      var oldResources = this.resources;
      this.resources = newResources;
      if (newResources) for (var i = 0, url; url = newResources[i]; i++) {
        var resource = basis.resource(url).fetch();
        if (typeof resource.startUse == "function") resource.startUse();
      }
      if (oldResources) for (var i = 0, url; url = oldResources[i]; i++) {
        var resource = basis.resource(url).fetch();
        if (typeof resource.stopUse == "function") resource.stopUse();
      }
      if (destroyBuilder) destroyBuilder(true);
    }
    var Template = Class(null, {
      className: namespace + ".Template",
      __extend__: function(value) {
        if (value instanceof Template) return value;
        if (value instanceof TemplateSwitchConfig) return new TemplateSwitcher(value);
        return new Template(value);
      },
      source: "",
      baseURI: "",
      url: "",
      attaches_: null,
      init: function(source) {
        if (templateList.length == 4096) throw "Too many templates (maximum 4096)";
        this.setSource(source || "");
        this.templateId = templateList.push(this) - 1;
      },
      bindingBridge: {
        attach: function(template, handler, context) {
          var cursor = template;
          while (cursor = cursor.attaches_) if (cursor.handler === handler && cursor.context === context) basis.dev.warn("basis.template.Template#bindingBridge.attach: duplicate handler & context pair");
          template.attaches_ = {
            handler: handler,
            context: context,
            attaches_: template.attaches_
          };
        },
        detach: function(template, handler, context) {
          var cursor = template;
          var prev;
          while (prev = cursor, cursor = cursor.attaches_) if (cursor.handler === handler && cursor.context === context) {
            prev.attaches_ = cursor.attaches_;
            return;
          }
          basis.dev.warn("basis.template.Template#bindingBridge.detach: handler & context pair not found, nothing was removed");
        },
        get: function(template) {
          var source = template.source;
          return source && source.bindingBridge ? source.bindingBridge.get(source) : source;
        }
      },
      createInstance: function(object, actionCallback, updateCallback, bindings, bindingInterface) {
        buildTemplate.call(this);
        return this.createInstance(object, actionCallback, updateCallback, bindings, bindingInterface);
      },
      clearInstance: function() {},
      getIsolatePrefix: function() {
        return "i" + this.templateId + "__";
      },
      setSource: function(source) {
        var oldSource = this.source;
        if (oldSource != source) {
          if (typeof source == "string") {
            var m = source.match(/^([a-z]+):/);
            if (m) {
              source = source.substr(m[0].length);
              switch (m[1]) {
                case "id":
                  source = resolveSourceByDocumentId(source);
                  break;
                case "path":
                  source = getSourceByPath(source);
                  break;
                default:
                  basis.dev.warn(namespace + ".Template.setSource: Unknown prefix " + m[1] + " for template source was ingnored.");
              }
            }
          }
          if (oldSource && oldSource.bindingBridge) {
            this.url = "";
            this.baseURI = "";
            oldSource.bindingBridge.detach(oldSource, templateSourceUpdate, this);
          }
          if (source && source.bindingBridge) {
            if (source.url) {
              this.url = source.url;
              this.baseURI = path.dirname(source.url) + "/";
            }
            source.bindingBridge.attach(source, templateSourceUpdate, this);
          }
          this.source = source;
          templateSourceUpdate.call(this);
        }
      },
      destroy: function() {
        if (this.destroyBuilder) {
          store.remove(this.templateId);
          this.destroyBuilder();
        }
        this.attaches_ = null;
        this.createInstance = null;
        this.resources = null;
        this.source = null;
        this.instances_ = null;
        this.decl_ = null;
      }
    });
    var TemplateSwitchConfig = function(config) {
      basis.object.extend(this, config);
    };
    var TemplateSwitcher = basis.Class(null, {
      className: namespace + ".TemplateSwitcher",
      ruleRet_: null,
      templates_: null,
      templateClass: Template,
      ruleEvents: null,
      rule: String,
      init: function(config) {
        this.ruleRet_ = [];
        this.templates_ = [];
        this.rule = config.rule;
        var events = config.events;
        if (events && events.length) {
          this.ruleEvents = {};
          for (var i = 0, eventName; eventName = events[i]; i++) this.ruleEvents[eventName] = true;
        }
        cleaner.add(this);
      },
      resolve: function(object) {
        var ret = this.rule(object);
        var idx = this.ruleRet_.indexOf(ret);
        if (idx == -1) {
          this.ruleRet_.push(ret);
          idx = this.templates_.push(new this.templateClass(ret)) - 1;
        }
        return this.templates_[idx];
      },
      destroy: function() {
        this.rule = null;
        this.templates_ = null;
        this.ruleRet_ = null;
      }
    });
    function switcher(events, rule) {
      if (!rule) {
        rule = events;
        events = null;
      }
      if (typeof events == "string") events = events.split(/\s+/);
      return new TemplateSwitchConfig({
        rule: rule,
        events: events
      });
    }
    cleaner.add({
      destroy: function() {
        for (var i = 0, template; template = templateList[i]; i++) template.destroy();
        templateList = null;
      }
    });
    module.exports = {
      DECLARATION_VERSION: DECLARATION_VERSION,
      TYPE_ELEMENT: consts.TYPE_ELEMENT,
      TYPE_ATTRIBUTE: consts.TYPE_ATTRIBUTE,
      TYPE_ATTRIBUTE_CLASS: consts.TYPE_ATTRIBUTE_CLASS,
      TYPE_ATTRIBUTE_STYLE: consts.TYPE_ATTRIBUTE_STYLE,
      TYPE_ATTRIBUTE_EVENT: consts.TYPE_ATTRIBUTE_EVENT,
      TYPE_TEXT: consts.TYPE_TEXT,
      TYPE_COMMENT: consts.TYPE_COMMENT,
      TOKEN_TYPE: consts.TOKEN_TYPE,
      TOKEN_BINDINGS: consts.TOKEN_BINDINGS,
      TOKEN_REFS: consts.TOKEN_REFS,
      ATTR_NAME: consts.ATTR_NAME,
      ATTR_VALUE: consts.ATTR_VALUE,
      ATTR_NAME_BY_TYPE: consts.ATTR_NAME_BY_TYPE,
      CLASS_BINDING_ENUM: consts.CLASS_BINDING_ENUM,
      CLASS_BINDING_BOOL: consts.CLASS_BINDING_BOOL,
      ELEMENT_NAME: consts.ELEMENT_NAME,
      ELEMENT_ATTRS: consts.ELEMENT_ATTRIBUTES_AND_CHILDREN,
      ELEMENT_ATTRIBUTES_AND_CHILDREN: consts.ELEMENT_ATTRIBUTES_AND_CHILDREN,
      TEXT_VALUE: consts.TEXT_VALUE,
      COMMENT_VALUE: consts.COMMENT_VALUE,
      TemplateSwitchConfig: TemplateSwitchConfig,
      TemplateSwitcher: TemplateSwitcher,
      Template: Template,
      switcher: switcher,
      getDeclFromSource: getDeclFromSource,
      makeDeclaration: makeDeclaration,
      resolveResource: resolveResource,
      getDebugInfoById: store.getDebugInfoById,
      getTemplateCount: function() {
        return templateList.length;
      },
      resolveTemplateById: store.resolveTemplateById,
      resolveObjectById: store.resolveObjectById,
      resolveTmplById: store.resolveTmplById,
      SourceWrapper: theme.SourceWrapper,
      Theme: theme.Theme,
      theme: theme.theme,
      getThemeList: theme.getThemeList,
      currentTheme: theme.currentTheme,
      setTheme: theme.setTheme,
      onThemeChange: theme.onThemeChange,
      define: theme.define,
      get: theme.get,
      getPathList: theme.getPathList
    };
  },
  "8.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var arraySearch = basis.array.search;
    var arrayAdd = basis.array.add;
    var arrayRemove = basis.array.remove;
    var tokenize = basis.require("./w.js");
    var isolateCss = basis.require("./x.js");
    var consts = basis.require("./6.js");
    var TYPE_ELEMENT = consts.TYPE_ELEMENT;
    var TYPE_ATTRIBUTE = consts.TYPE_ATTRIBUTE;
    var TYPE_ATTRIBUTE_CLASS = consts.TYPE_ATTRIBUTE_CLASS;
    var TYPE_ATTRIBUTE_STYLE = consts.TYPE_ATTRIBUTE_STYLE;
    var TYPE_ATTRIBUTE_EVENT = consts.TYPE_ATTRIBUTE_EVENT;
    var TYPE_TEXT = consts.TYPE_TEXT;
    var TYPE_COMMENT = consts.TYPE_COMMENT;
    var TOKEN_TYPE = consts.TOKEN_TYPE;
    var TOKEN_BINDINGS = consts.TOKEN_BINDINGS;
    var TOKEN_REFS = consts.TOKEN_REFS;
    var ATTR_NAME = consts.ATTR_NAME;
    var ATTR_VALUE = consts.ATTR_VALUE;
    var ATTR_NAME_BY_TYPE = consts.ATTR_NAME_BY_TYPE;
    var ATTR_TYPE_BY_NAME = consts.ATTR_TYPE_BY_NAME;
    var ATTR_VALUE_INDEX = consts.ATTR_VALUE_INDEX;
    var ELEMENT_ATTRIBUTES_AND_CHILDREN = consts.ELEMENT_ATTRIBUTES_AND_CHILDREN;
    var TEXT_VALUE = consts.TEXT_VALUE;
    var CLASS_BINDING_ENUM = consts.CLASS_BINDING_ENUM;
    var CLASS_BINDING_BOOL = consts.CLASS_BINDING_BOOL;
    var IDENT = /^[a-z_][a-z0-9_\-]*$/i;
    var ATTR_EVENT_RX = /^event-(.+)$/;
    var Template = function() {};
    var resolveResource = function() {};
    function genIsolateMarker() {
      return basis.genUID() + "__";
    }
    var makeDeclaration = function() {
      var includeStack = [];
      var styleNamespaceIsolate = {};
      var styleNamespaceResource = {};
      function getTokenName(token) {
        return (token.prefix ? token.prefix + ":" : "") + token.name;
      }
      function refList(token) {
        var array = token.refs;
        if (!array || !array.length) return 0;
        return array;
      }
      function addTokenRef(token, refName) {
        if (!token[TOKEN_REFS]) token[TOKEN_REFS] = [];
        arrayAdd(token[TOKEN_REFS], refName);
        if (refName != "element") token[TOKEN_BINDINGS] = token[TOKEN_REFS].length == 1 ? refName : 0;
      }
      function removeTokenRef(token, refName) {
        var idx = token[TOKEN_REFS].indexOf(refName);
        if (idx != -1) {
          var indexBinding = token[TOKEN_BINDINGS] && typeof token[TOKEN_BINDINGS] == "number";
          token[TOKEN_REFS].splice(idx, 1);
          if (indexBinding) if (idx == token[TOKEN_BINDINGS] - 1) {
            token[TOKEN_BINDINGS] = refName;
            indexBinding = false;
          }
          if (!token[TOKEN_REFS].length) token[TOKEN_REFS] = 0; else {
            if (indexBinding) token[TOKEN_BINDINGS] -= idx < token[TOKEN_BINDINGS] - 1;
          }
        }
      }
      function tokenAttrs(token) {
        var result = {};
        if (token.attrs) for (var i = 0, attr; attr = token.attrs[i]; i++) result[getTokenName(attr)] = attr.value;
        return result;
      }
      function tokenAttrs_(token) {
        var result = {};
        if (token.attrs) for (var i = 0, attr; attr = token.attrs[i]; i++) result[getTokenName(attr)] = attr;
        return result;
      }
      function addUnique(array, items) {
        for (var i = 0; i < items.length; i++) arrayAdd(array, items[i]);
      }
      function importStyles(array, items, prefix, includeToken) {
        for (var i = 0, item; item = items[i]; i++) {
          if (item[1] !== styleNamespaceIsolate) item[1] = prefix + item[1];
          if (!item[3]) item[3] = includeToken;
        }
        array.unshift.apply(array, items);
      }
      function addStyle(template, token, src, isolatePrefix, namespace) {
        var text = token.children[0];
        var url = src ? basis.resource.resolveURI(src, template.baseURI, '<b:style src="{url}"/>') : basis.resource.virtual("css", text ? text.value : "", template.sourceUrl).url;
        token.sourceUrl = template.sourceUrl;
        template.resources.push([ url, isolatePrefix, token, null, src ? false : text || true, namespace ]);
        return url;
      }
      function getLocation(template, loc) {
        if (loc) return (template.sourceUrl || "") + ":" + loc.start.line + ":" + (loc.start.column + 1);
      }
      function addTemplateWarn(template, options, message, loc) {
        if (loc && options.loc) {
          message = Object(message);
          message.loc = typeof loc == "string" ? loc : getLocation(template, loc);
        }
        template.warns.push(message);
      }
      function applyTokenLocation(template, options, dest, source) {
        if (options.loc && source && source.loc && !dest.loc) dest.loc = getLocation(template, source.loc);
      }
      function process(tokens, template, options) {
        function addTokenLocation(item, token) {
          applyTokenLocation(template, options, item, token);
        }
        function getAttributeValueLocationMap(token) {
          if (!token || !token.map_) return null;
          return token.map_.reduce(function(res, part) {
            if (!part.binding) res[part.value] = getLocation(template, part.loc);
            return res;
          }, {});
        }
        function addStateInfo(name, type, value) {
          if (!hasOwnProperty.call(template.states, name)) template.states[name] = {};
          var info = template.states[name];
          var isArray = Array.isArray(value);
          if (!hasOwnProperty.call(info, type) || !isArray) info[type] = isArray ? basis.array(value) : value; else addUnique(info[type], value);
        }
        function parseIncludeOptions(str) {
          var result = {};
          var pairs = (str || "").trim().split(/\s*,\s*/);
          for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split(/\s*:\s*/);
            if (pair.length != 2) {
              return {};
            }
            result[pair[0]] = pair[1];
          }
          return result;
        }
        function getAttrByName(token, name) {
          var offset = typeof token[0] == "number" ? ELEMENT_ATTRIBUTES_AND_CHILDREN : 0;
          for (var i = offset, attr, attrName; attr = token[i]; i++) {
            if (attr[TOKEN_TYPE] == TYPE_ATTRIBUTE_EVENT) attrName = "event-" + attr[1]; else attrName = ATTR_NAME_BY_TYPE[attr[TOKEN_TYPE]] || attr[ATTR_NAME];
            if (attrName == name) return attr;
          }
        }
        function getStyleBindingProperty(attr, name) {
          var bindings = attr[TOKEN_BINDINGS];
          if (bindings) for (var i = 0, binding; binding = bindings[i]; i++) if (binding[2] == name) return binding;
        }
        function setStylePropertyBinding(host, attr, property, showByDefault, defaultValue) {
          var styleAttr = getAttrByName(host, "style");
          if (!styleAttr) {
            styleAttr = [ TYPE_ATTRIBUTE_STYLE, 0, 0 ];
            addTokenLocation(styleAttr, attr);
            host.push(styleAttr);
          }
          var binding = attr.binding;
          var addDefault = false;
          var show = attr.name == showByDefault;
          var value = styleAttr[3];
          if (!binding || binding[0].length != binding[1].length) {
            addDefault = !(show ^ attr.value === "");
          } else {
            var bindings = styleAttr[TOKEN_BINDINGS];
            binding = binding.concat(property, attr.name);
            addDefault = show;
            if (bindings) {
              arrayRemove(bindings, getStyleBindingProperty(styleAttr, property));
              bindings.push(binding);
            } else styleAttr[TOKEN_BINDINGS] = [ binding ];
          }
          if (value) value = value.replace(new RegExp(property + "\\s*:\\s*[^;]+(;|$)"), "");
          if (addDefault) value = (value ? value + " " : "") + defaultValue;
          styleAttr[3] = value;
        }
        function applyShowHideAttribute(host, attr) {
          if (attr.name == "show" || attr.name == "hide") setStylePropertyBinding(host, attr, "display", "show", "display: none;");
          if (attr.name == "visible" || attr.name == "hidden") setStylePropertyBinding(host, attr, "visibility", "visible", "visibility: hidden;");
        }
        function processAttrs(token, declToken) {
          var result = [];
          var styleAttr;
          var displayAttr;
          var visibilityAttr;
          var item;
          var m;
          for (var i = 0, attr; attr = token.attrs[i]; i++) {
            if (attr.prefix == "b") {
              switch (attr.name) {
                case "ref":
                  var refs = (attr.value || "").trim().split(/\s+/);
                  for (var j = 0; j < refs.length; j++) addTokenRef(declToken, refs[j]);
                  break;
                case "show":
                case "hide":
                  displayAttr = attr;
                  break;
                case "visible":
                case "hidden":
                  visibilityAttr = attr;
                  break;
              }
              continue;
            }
            if (m = attr.name.match(ATTR_EVENT_RX)) {
              item = m[1] == attr.value ? [ TYPE_ATTRIBUTE_EVENT, m[1] ] : [ TYPE_ATTRIBUTE_EVENT, m[1], attr.value ];
            } else {
              item = [ attr.type, attr.binding, 0 ];
              if (attr.type == 2) item.push(getTokenName(attr));
              if (attr.value && (!options.optimizeSize || !attr.binding || attr.type != 2)) item.push(attr.value);
              if (attr.type == TYPE_ATTRIBUTE_STYLE) styleAttr = item;
            }
            item.valueLocMap = getAttributeValueLocationMap(attr);
            item.sourceToken = attr;
            addTokenLocation(item, attr);
            result.push(item);
          }
          if (displayAttr) applyShowHideAttribute(result, displayAttr);
          if (visibilityAttr) applyShowHideAttribute(result, visibilityAttr);
          return result.length ? result : 0;
        }
        function modifyAttr(include, token, name, action) {
          var attrs = tokenAttrs(token);
          var attrs_ = tokenAttrs_(token);
          if (name) attrs.name = name;
          if (!attrs.name) {
            addTemplateWarn(template, options, "Instruction <b:" + token.name + "> has no `name` attribute", token.loc);
            return;
          }
          if (!IDENT.test(attrs.name)) {
            addTemplateWarn(template, options, "Bad attribute name `" + attrs.name + "`", token.loc);
            return;
          }
          var includedToken = tokenRefMap[attrs.ref || "element"];
          if (includedToken) {
            if (includedToken.token[TOKEN_TYPE] == TYPE_ELEMENT) {
              var itAttrs = includedToken.token;
              var isEvent = attrs.name.match(ATTR_EVENT_RX);
              var isClassOrStyle = attrs.name == "class" || attrs.name == "style";
              var itType = isEvent ? TYPE_ATTRIBUTE_EVENT : ATTR_TYPE_BY_NAME[attrs.name] || TYPE_ATTRIBUTE;
              var valueIdx = ATTR_VALUE_INDEX[itType] || ATTR_VALUE;
              var valueLocMap = getAttributeValueLocationMap(attrs_.value);
              var itAttrToken = itAttrs && getAttrByName(itAttrs, attrs.name);
              if (itAttrToken && action == "set") {
                template.removals.push({
                  reason: "<b:" + token.name + ">",
                  removeToken: token,
                  includeToken: include,
                  token: itAttrToken
                });
                arrayRemove(itAttrs, itAttrToken);
                itAttrToken = null;
              }
              if (!itAttrToken && (action == "set" || action == "append")) {
                action = "set";
                if (isEvent) {
                  itAttrToken = [ itType, isEvent[1] ];
                } else {
                  itAttrToken = [ itType, 0, 0, itType == TYPE_ATTRIBUTE ? attrs.name : "" ];
                  if (itType == TYPE_ATTRIBUTE) itAttrToken.push("");
                }
                if (!itAttrs) {
                  itAttrs = [];
                  includedToken.token.push(itAttrs);
                }
                itAttrs.push(itAttrToken);
                itAttrToken.valueLocMap = valueLocMap;
                addTokenLocation(itAttrToken, token);
              }
              switch (action) {
                case "set":
                  if (itAttrToken[TOKEN_TYPE] == TYPE_ATTRIBUTE_EVENT) {
                    if (attrs.value == isEvent[1]) itAttrToken.length = 2; else itAttrToken[valueIdx] = attrs.value;
                    return;
                  }
                  var valueAttr = attrs_.value || {};
                  itAttrToken[TOKEN_BINDINGS] = valueAttr.binding || 0;
                  itAttrToken.valueLocMap = valueLocMap;
                  if (!options.optimizeSize || !itAttrToken[TOKEN_BINDINGS] || isClassOrStyle) itAttrToken[valueIdx] = valueAttr.value || ""; else itAttrToken.length = valueIdx;
                  if (isClassOrStyle) if (!itAttrToken[TOKEN_BINDINGS] && !itAttrToken[valueIdx]) {
                    arrayRemove(itAttrs, itAttrToken);
                    return;
                  }
                  break;
                case "append":
                  var valueAttr = attrs_.value || {};
                  var appendValue = valueAttr.value || "";
                  var appendBinding = valueAttr.binding;
                  if (!isEvent) {
                    if (appendBinding) {
                      var attrBindings = itAttrToken[TOKEN_BINDINGS];
                      if (attrBindings) {
                        switch (attrs.name) {
                          case "style":
                            for (var i = 0, newBinding; newBinding = appendBinding[i]; i++) {
                              arrayRemove(attrBindings, getStyleBindingProperty(itAttrToken, newBinding[2]));
                              attrBindings.push(newBinding);
                            }
                            break;
                          case "class":
                            attrBindings.push.apply(attrBindings, appendBinding);
                            break;
                          default:
                            appendBinding[0].forEach(function(name) {
                              arrayAdd(this, name);
                            }, attrBindings[0]);
                            for (var i = 0; i < appendBinding[1].length; i++) {
                              var value = appendBinding[1][i];
                              if (typeof value == "number") value = attrBindings[0].indexOf(appendBinding[0][value]);
                              attrBindings[1].push(value);
                            }
                        }
                      } else {
                        itAttrToken[TOKEN_BINDINGS] = appendBinding;
                        if (!isClassOrStyle) itAttrToken[TOKEN_BINDINGS][1].unshift(itAttrToken[valueIdx]);
                      }
                    } else {
                      if (!isClassOrStyle && itAttrToken[TOKEN_BINDINGS]) itAttrToken[TOKEN_BINDINGS][1].push(attrs.value);
                    }
                  }
                  if (appendValue) {
                    if (isEvent || attrs.name == "class") {
                      var parts = (itAttrToken[valueIdx] || "").trim();
                      var appendParts = appendValue.trim();
                      parts = parts ? parts.split(/\s+/) : [];
                      appendParts = appendParts ? appendParts.split(/\s+/) : [];
                      for (var i = 0; i < appendParts.length; i++) {
                        var part = appendParts[i];
                        basis.array.remove(parts, part);
                        parts.push(part);
                      }
                      itAttrToken[valueIdx] = parts.join(" ");
                    } else {
                      itAttrToken[valueIdx] = (itAttrToken[valueIdx] || "") + (itAttrToken[valueIdx] && isClassOrStyle ? " " : "") + appendValue;
                    }
                    if (valueLocMap) {
                      if (itAttrToken.valueLocMap) for (var name in valueLocMap) itAttrToken.valueLocMap[name] = valueLocMap[name]; else itAttrToken.valueLocMap = valueLocMap;
                    }
                  }
                  if (isClassOrStyle && !itAttrToken[TOKEN_BINDINGS] && !itAttrToken[valueIdx]) arrayRemove(itAttrs, itAttrToken);
                  break;
                case "remove-class":
                  if (itAttrToken) {
                    var valueAttr = attrs_.value || {};
                    var values = (itAttrToken[valueIdx] || "").split(" ");
                    var removeValues = (valueAttr.value || "").split(" ");
                    var bindings = itAttrToken[TOKEN_BINDINGS];
                    var removedValues = [];
                    var removedBindings = 0;
                    if (valueAttr.binding && bindings) {
                      for (var i = 0, removeBinding; removeBinding = valueAttr.binding[i]; i++) for (var j = bindings.length - 1, classBinding; classBinding = bindings[j]; j--) {
                        var prefix = classBinding[0];
                        var bindingName = classBinding[3] || classBinding[1];
                        if (prefix === removeBinding[0] && bindingName === removeBinding[1]) {
                          bindings.splice(j, 1);
                          if (!removedBindings) removedBindings = [ classBinding ]; else removedBindings.push(classBinding);
                        }
                      }
                      if (!bindings.length) itAttrToken[TOKEN_BINDINGS] = 0;
                    }
                    for (var i = 0; i < removeValues.length; i++) {
                      if (values.indexOf(removeValues[i]) != -1) removedValues.push(removeValues[i]);
                      arrayRemove(values, removeValues[i]);
                      if (itAttrToken.valueLocMap) delete itAttrToken.valueLocMap[removeValues[i]];
                    }
                    itAttrToken[valueIdx] = values.join(" ");
                    if (!bindings.length && !values.length) arrayRemove(itAttrs, itAttrToken);
                    if (removedValues.length || removedBindings.length) template.removals.push({
                      reason: "<b:" + token.name + ">",
                      removeToken: token,
                      includeToken: include,
                      token: [ TYPE_ATTRIBUTE_CLASS, removedBindings, 0, removedValues.join(" ") ]
                    });
                  }
                  break;
                case "remove":
                  if (itAttrToken) {
                    arrayRemove(itAttrs, itAttrToken);
                    template.removals.push({
                      reason: "<b:" + token.name + ">",
                      removeToken: token,
                      includeToken: include,
                      token: itAttrToken
                    });
                  }
                  break;
              }
            } else {
              addTemplateWarn(template, options, "Attribute modificator is not reference to element token (reference name: " + (attrs.ref || "element") + ")", token.loc);
            }
          }
        }
        var result = [];
        for (var i = 0, token, item; token = tokens[i]; i++) {
          var refs = refList(token);
          var bindings = refs && refs.length == 1 ? refs[0] : 0;
          switch (token.type) {
            case TYPE_ELEMENT:
              if (token.prefix == "b") {
                var elAttrs = tokenAttrs(token);
                var elAttrs_ = tokenAttrs_(token);
                switch (token.name) {
                  case "style":
                    var useStyle = true;
                    if (elAttrs.options) {
                      var filterOptions = parseIncludeOptions(elAttrs.options);
                      for (var name in filterOptions) useStyle = useStyle && filterOptions[name] == options.includeOptions[name];
                    }
                    if (useStyle) {
                      var namespaceAttrName = elAttrs.namespace ? "namespace" : "ns";
                      var styleNamespace = elAttrs[namespaceAttrName];
                      var styleIsolate = styleNamespace ? styleNamespaceIsolate : "";
                      var src = addStyle(template, token, elAttrs.src, styleIsolate, styleNamespace);
                      if (styleNamespace) {
                        if (src in styleNamespaceIsolate == false) styleNamespaceIsolate[src] = genIsolateMarker();
                        template.styleNSPrefix[styleNamespace] = {
                          loc: getLocation(template, elAttrs_[namespaceAttrName].loc),
                          used: false,
                          name: styleNamespace,
                          prefix: styleNamespaceIsolate[src]
                        };
                      }
                    } else {
                      token.sourceUrl = template.sourceUrl;
                      template.resources.push([ null, styleIsolate, token, null, elAttrs.src ? false : token.children[0] || true, styleNamespace ]);
                    }
                    break;
                  case "isolate":
                    if (!template.isolate) template.isolate = elAttrs.prefix || options.isolate || genIsolateMarker(); else addTemplateWarn(template, options, "<b:isolate> is already set to `" + template.isolate + "`", token.loc);
                    break;
                  case "l10n":
                    if (elAttrs.src) options.dictURI = basis.resource.resolveURI(elAttrs.src, template.baseURI, "<b:" + token.name + ' src="{url}"/>');
                    break;
                  case "define":
                    if ("name" in elAttrs == false) addTemplateWarn(template, options, "<b:define> has no `name` attribute", token.loc);
                    if ("type" in elAttrs == false) addTemplateWarn(template, options, "<b:define> has no `type` attribute", token.loc);
                    if (hasOwnProperty.call(options.defines, elAttrs.name)) addTemplateWarn(template, options, "<b:define> for `" + elAttrs.name + "` has already defined", token.loc);
                    if ("name" in elAttrs && "type" in elAttrs && !hasOwnProperty.call(options.defines, elAttrs.name)) {
                      var bindingName = elAttrs.from || elAttrs.name;
                      var defineName = elAttrs.name;
                      var define = false;
                      var defaultIndex;
                      var values;
                      switch (elAttrs.type) {
                        case "bool":
                          define = [ bindingName, CLASS_BINDING_BOOL, defineName, elAttrs["default"] == "true" ? 1 : 0 ];
                          addStateInfo(bindingName, "bool", true);
                          break;
                        case "enum":
                          if ("values" in elAttrs == false) {
                            addTemplateWarn(template, options, "Enum <b:define> has no `values` attribute", token.loc);
                            break;
                          }
                          values = (elAttrs.values || "").trim();
                          if (!values) {
                            addTemplateWarn(template, options, "Enum <b:define> has no variants (`values` attribute is empty)", elAttrs_.values && elAttrs_.values.loc);
                            break;
                          }
                          values = values.split(/\s+/);
                          defaultIndex = values.indexOf(elAttrs["default"]);
                          if ("default" in elAttrs && defaultIndex == -1) addTemplateWarn(template, options, "Enum <b:define> has bad value as default (value ignored)", elAttrs_["default"] && elAttrs_["default"].loc);
                          define = [ bindingName, CLASS_BINDING_ENUM, defineName, defaultIndex + 1, values ];
                          addStateInfo(bindingName, "enum", values);
                          break;
                        default:
                          addTemplateWarn(template, options, "Bad type in <b:define> for `" + defineName + "`: " + elAttrs.type, elAttrs_.type && elAttrs_.type.valueLoc);
                      }
                      if (define) {
                        addTokenLocation(define, token);
                        options.defines[defineName] = define;
                      }
                    }
                    break;
                  case "text":
                    var text = token.children[0];
                    tokens[i--] = basis.object.extend(text, {
                      refs: (elAttrs.ref || "").trim().split(/\s+/),
                      value: "notrim" in elAttrs ? text.value : text.value.replace(/^\s*[\r\n]+|[\r\n]+\s*$/g, "")
                    });
                    break;
                  case "include":
                    var templateSrc = elAttrs.src;
                    if (templateSrc) {
                      var resource = resolveResource(templateSrc, template.baseURI);
                      if (!resource) {
                        addTemplateWarn(template, options, '<b:include src="' + templateSrc + '"> is not resolved, instruction ignored', token.loc);
                        continue;
                      }
                      if (includeStack.indexOf(resource) == -1) {
                        var isolatePrefix = elAttrs_.isolate ? elAttrs_.isolate.value || genIsolateMarker() : "";
                        var includeOptions = elAttrs.options ? parseIncludeOptions(elAttrs.options) : null;
                        var declarationOptions = basis.object.merge(options, {
                          includeOptions: includeOptions
                        });
                        var decl = getDeclFromSource(resource, "", true, declarationOptions);
                        arrayAdd(template.deps, resource);
                        template.includes.push({
                          token: token,
                          resource: resource,
                          nested: decl.includes
                        });
                        if (decl.deps) addUnique(template.deps, decl.deps);
                        if (decl.warns) template.warns.push.apply(template.warns, decl.warns);
                        if (decl.removals) template.removals.push.apply(template.removals, decl.removals);
                        if (decl.resources && "no-style" in elAttrs == false) importStyles(template.resources, decl.resources, isolatePrefix, token);
                        var instructions = basis.array(token.children);
                        var styleNSIsolate = {
                          map: options.styleNSIsolateMap,
                          prefix: genIsolateMarker()
                        };
                        var tokenRefMap = normalizeRefs(decl.tokens, styleNSIsolate);
                        for (var key in decl.styleNSPrefix) template.styleNSPrefix[styleNSIsolate.prefix + key] = basis.object.merge(decl.styleNSPrefix[key], {
                          used: hasOwnProperty.call(options.styleNSIsolateMap, styleNSIsolate.prefix + key)
                        });
                        if (isolatePrefix) {
                          isolateTokens(decl.tokens, isolatePrefix);
                          if (decl.removals) decl.removals.forEach(function(item) {
                            isolateTokens([ item.token ], isolatePrefix);
                          });
                        }
                        for (var includeAttrName in elAttrs_) switch (includeAttrName) {
                          case "class":
                            instructions.unshift({
                              type: TYPE_ELEMENT,
                              prefix: "b",
                              name: "append-class",
                              attrs: [ basis.object.complete({
                                name: "value"
                              }, elAttrs_["class"]) ]
                            });
                            break;
                          case "id":
                            instructions.unshift({
                              type: TYPE_ELEMENT,
                              prefix: "b",
                              name: "set-attr",
                              attrs: [ {
                                type: TYPE_ATTRIBUTE,
                                name: "name",
                                value: "id"
                              }, basis.object.complete({
                                name: "value"
                              }, elAttrs_.id) ]
                            });
                            break;
                          case "ref":
                            if (tokenRefMap.element) elAttrs.ref.trim().split(/\s+/).map(function(refName) {
                              addTokenRef(tokenRefMap.element.token, refName);
                            });
                            break;
                          case "show":
                          case "hide":
                          case "visible":
                          case "hidden":
                            var tokenRef = tokenRefMap.element;
                            var token = tokenRef && tokenRef.token;
                            if (token && token[TOKEN_TYPE] == TYPE_ELEMENT) applyShowHideAttribute(token, elAttrs_[includeAttrName]);
                            break;
                        }
                        for (var j = 0, child; child = instructions[j]; j++) {
                          if (child.type == TYPE_ELEMENT && child.prefix == "b") {
                            switch (child.name) {
                              case "style":
                                var childAttrs = tokenAttrs(child);
                                var childAttrs_ = tokenAttrs_(child);
                                var useStyle = true;
                                if (childAttrs.options) {
                                  var filterOptions = parseIncludeOptions(childAttrs.options);
                                  for (var name in filterOptions) useStyle = useStyle && filterOptions[name] == includeOptions[name];
                                }
                                if (useStyle) {
                                  var namespaceAttrName = childAttrs.namespace ? "namespace" : "ns";
                                  var styleNamespace = childAttrs[namespaceAttrName];
                                  var styleIsolate = styleNamespace ? styleNamespaceIsolate : isolatePrefix;
                                  var src = addStyle(template, child, childAttrs.src, styleIsolate, styleNamespace);
                                  if (styleNamespace) {
                                    if (src in styleNamespaceIsolate == false) styleNamespaceIsolate[src] = genIsolateMarker();
                                    template.styleNSPrefix[styleNSIsolate.prefix + styleNamespace] = {
                                      loc: getLocation(template, childAttrs_[namespaceAttrName].loc),
                                      used: false,
                                      name: styleNamespace,
                                      prefix: styleNamespaceIsolate[src]
                                    };
                                  }
                                } else {
                                  child.sourceUrl = template.sourceUrl;
                                  template.resources.push([ null, styleIsolate, child, token, childAttrs.src ? false : child.children[0] || true, styleNamespace ]);
                                }
                                break;
                              case "replace":
                              case "remove":
                              case "before":
                              case "after":
                                var replaceOrRemove = child.name == "replace" || child.name == "remove";
                                var childAttrs = tokenAttrs(child);
                                var ref = "ref" in childAttrs || !replaceOrRemove ? childAttrs.ref : "element";
                                var tokenRef = ref && tokenRefMap[ref];
                                if (tokenRef) {
                                  var parent = tokenRef.owner;
                                  var pos = parent.indexOf(tokenRef.token);
                                  if (pos != -1) {
                                    var args = [ pos + (child.name == "after"), replaceOrRemove ];
                                    if (child.name != "remove") args = args.concat(process(child.children, template, options) || []);
                                    parent.splice.apply(parent, args);
                                    if (replaceOrRemove) template.removals.push({
                                      reason: "<b:" + child.name + ">",
                                      removeToken: child,
                                      includeToken: token,
                                      token: tokenRef.token
                                    });
                                  }
                                }
                                break;
                              case "prepend":
                              case "append":
                                var childAttrs = tokenAttrs(child);
                                var ref = "ref" in childAttrs ? childAttrs.ref : "element";
                                var tokenRef = ref && tokenRefMap[ref];
                                var token = tokenRef && tokenRef.token;
                                if (token && token[TOKEN_TYPE] == TYPE_ELEMENT) {
                                  var children = process(child.children, template, options) || [];
                                  if (child.name == "prepend") token.splice.apply(token, [ ELEMENT_ATTRIBUTES_AND_CHILDREN, 0 ].concat(children)); else token.push.apply(token, children);
                                }
                                break;
                              case "show":
                              case "hide":
                              case "visible":
                              case "hidden":
                                var childAttrs = tokenAttrs(child);
                                var ref = "ref" in childAttrs ? childAttrs.ref : "element";
                                var tokenRef = ref && tokenRefMap[ref];
                                var token = tokenRef && tokenRef.token;
                                if (token && token[TOKEN_TYPE] == TYPE_ELEMENT) {
                                  var expr = tokenAttrs_(child).expr;
                                  if (!expr) {
                                    addTemplateWarn(template, options, "Instruction <b:" + child.name + "> has no `expr` attribute", child.loc);
                                    break;
                                  }
                                  applyShowHideAttribute(token, basis.object.complete({
                                    name: child.name
                                  }, tokenAttrs_(child).expr));
                                }
                                break;
                              case "attr":
                              case "set-attr":
                                modifyAttr(token, child, false, "set");
                                break;
                              case "append-attr":
                                modifyAttr(token, child, false, "append");
                                break;
                              case "remove-attr":
                                modifyAttr(token, child, false, "remove");
                                break;
                              case "class":
                              case "append-class":
                                modifyAttr(token, child, "class", "append");
                                break;
                              case "set-class":
                                modifyAttr(token, child, "class", "set");
                                break;
                              case "remove-class":
                                var childAttrs_ = tokenAttrs_(child);
                                var valueAttr = childAttrs_.value;
                                if (valueAttr) {
                                  valueAttr.value = valueAttr.value.split(/\s+/).map(function(name) {
                                    return name.indexOf(":") > 0 ? styleNSIsolate.prefix + name : name;
                                  }).join(" ");
                                  if (valueAttr.binding) valueAttr.binding.forEach(function(bind) {
                                    if (bind[0].indexOf(":") > 0) bind[0] = styleNSIsolate.prefix + bind[0];
                                  });
                                  if (valueAttr.map_) valueAttr.map_.forEach(function(item) {
                                    if (item.value.indexOf(":") > 0) item.value = styleNSIsolate.prefix + item.value;
                                  });
                                }
                                modifyAttr(token, child, "class", "remove-class");
                                break;
                              case "add-ref":
                                var childAttrs = tokenAttrs(child);
                                var ref = "ref" in childAttrs ? childAttrs.ref : "element";
                                var tokenRef = ref && tokenRefMap[ref];
                                var token = tokenRef && tokenRef.token;
                                if (token && childAttrs.name) addTokenRef(token, childAttrs.name);
                                break;
                              case "remove-ref":
                                var childAttrs = tokenAttrs(child);
                                var ref = "ref" in childAttrs ? childAttrs.ref : "element";
                                var tokenRef = ref && tokenRefMap[ref];
                                var token = tokenRef && tokenRef.token;
                                if (token) removeTokenRef(token, childAttrs.name || childAttrs.ref);
                                break;
                              default:
                                addTemplateWarn(template, options, "Unknown instruction tag: <b:" + child.name + ">", child.loc);
                            }
                          } else {
                            decl.tokens.push.apply(decl.tokens, process([ child ], template, options) || []);
                          }
                        }
                        if (tokenRefMap.element) removeTokenRef(tokenRefMap.element.token, "element");
                        result.push.apply(result, decl.tokens);
                      } else {
                        var stack = includeStack.slice(includeStack.indexOf(resource) || 0).concat(resource).map(function(res) {
                          if (res instanceof Template) res = res.source;
                          return res.id || res.url || "[inline template]";
                        });
                        template.warns.push("Recursion: ", stack.join(" -> "));
                        basis.dev.warn("Recursion in template: ", stack.join(" -> "));
                      }
                    }
                    break;
                  default:
                    addTemplateWarn(template, options, "Unknown instruction tag: <b:" + token.name + ">", token.loc);
                }
                continue;
              }
              item = [ 1, bindings, refs, getTokenName(token) ];
              item.push.apply(item, processAttrs(token, item, options.optimizeSize) || []);
              item.push.apply(item, process(token.children, template, options) || []);
              addTokenLocation(item, token);
              item.sourceToken = token;
              break;
            case TYPE_TEXT:
              if (refs && refs.length == 2 && arraySearch(refs, "element")) bindings = refs[+!refs.lastSearchIndex];
              item = [ 3, bindings, refs ];
              if (!refs || token.value != "{" + refs.join("|") + "}") item.push(token.value);
              addTokenLocation(item, token);
              item.sourceToken = token;
              break;
            case TYPE_COMMENT:
              if (options.optimizeSize && !bindings && !refs) continue;
              item = [ 8, bindings, refs ];
              if (!options.optimizeSize) if (!refs || token.value != "{" + refs.join("|") + "}") item.push(token.value);
              addTokenLocation(item, token);
              item.sourceToken = token;
              break;
          }
          while (item[item.length - 1] === 0) item.pop();
          result.push(item);
        }
        return result.length ? result : 0;
      }
      function absl10n(value, dictURI, l10nMap) {
        if (typeof value == "string") {
          var parts = value.split(":");
          var key = parts[1];
          if (parts[0] == "l10n") {
            if (parts.length == 2 && key.indexOf("@") == -1) {
              if (!dictURI) return false;
              key = key + "@" + dictURI;
              value = "l10n:" + key;
            }
            arrayAdd(l10nMap, key);
          }
        }
        return value;
      }
      function normalizeRefs(tokens, isolate, map, stIdx) {
        function processName(name) {
          if (name.indexOf(":") <= 0) return name;
          var prefix = name.split(":")[0];
          isolate.map[isolate.prefix + prefix] = prefix;
          return isolate.prefix + name;
        }
        if (!map) map = {};
        for (var i = stIdx || 0, token; token = tokens[i]; i++) {
          var tokenType = token[TOKEN_TYPE];
          var refs = token[TOKEN_REFS];
          if (isolate && tokenType == TYPE_ATTRIBUTE_CLASS) {
            var bindings = token[TOKEN_BINDINGS];
            var valueIndex = ATTR_VALUE_INDEX[tokenType];
            if (token[valueIndex]) token[valueIndex] = token[valueIndex].split(/\s+/).map(processName).join(" ");
            if (token.valueLocMap) {
              var oldValueLocMap = token.valueLocMap;
              token.valueLocMap = {};
              for (var name in oldValueLocMap) token.valueLocMap[processName(name)] = oldValueLocMap[name];
            }
            if (bindings) for (var k = 0, bind; bind = bindings[k]; k++) bind[0] = processName(bind[0]);
          }
          if (tokenType != TYPE_ATTRIBUTE_EVENT && refs) {
            for (var j = refs.length - 1, refName; refName = refs[j]; j--) {
              if (refName.indexOf(":") != -1) {
                removeTokenRef(token, refName);
                continue;
              }
              if (map[refName]) removeTokenRef(map[refName].token, refName);
              if (token[TOKEN_BINDINGS] == refName) token[TOKEN_BINDINGS] = j + 1;
              map[refName] = {
                owner: tokens,
                token: token
              };
            }
          }
          if (tokenType === TYPE_ELEMENT) normalizeRefs(token, isolate, map, ELEMENT_ATTRIBUTES_AND_CHILDREN);
        }
        return map;
      }
      function applyDefines(tokens, template, options, stIdx) {
        for (var i = stIdx || 0, token; token = tokens[i]; i++) {
          var tokenType = token[TOKEN_TYPE];
          var bindings = token[TOKEN_BINDINGS];
          switch (token[TOKEN_TYPE]) {
            case TYPE_ELEMENT:
              applyDefines(token, template, options, ELEMENT_ATTRIBUTES_AND_CHILDREN);
              break;
            case TYPE_TEXT:
              if (bindings) {
                var binding = absl10n(bindings, options.dictURI, template.l10n);
                token[TOKEN_BINDINGS] = binding || 0;
                if (binding === false) {
                  addTemplateWarn(template, options, "Dictionary for l10n binding on text node can't be resolved: {" + bindings + "}", token.loc);
                  token[TEXT_VALUE] = "{" + bindings + "}";
                }
              }
              break;
            case TYPE_ATTRIBUTE:
              if (bindings) {
                var array = bindings[0];
                for (var j = 0; j < array.length; j++) {
                  var binding = absl10n(array[j], options.dictURI, template.l10n);
                  array[j] = binding === false ? "{" + array[j] + "}" : binding;
                  if (binding === false) addTemplateWarn(template, options, "Dictionary for l10n binding on attribute can't be resolved: {" + array[j] + "}", token.loc);
                }
              }
              break;
            case TYPE_ATTRIBUTE_CLASS:
              if (bindings) {
                for (var k = 0, bind; bind = bindings[k]; k++) {
                  if (bind.length > 2) continue;
                  applyTokenLocation(template, options, bind, bind.info_);
                  var bindNameParts = bind[1].split(":");
                  var bindName = bindNameParts.pop();
                  var bindPrefix = bindNameParts.pop() || "";
                  if (hasOwnProperty.call(options.defines, bindName)) {
                    var define = options.defines[bindName];
                    bind[1] = (bindPrefix ? bindPrefix + ":" : "") + define[0];
                    bind.push.apply(bind, define.slice(1));
                    define.used = true;
                  } else {
                    bind.push(0);
                    addTemplateWarn(template, options, "Unpredictable class binding: " + bind[0] + "{" + bind[1] + "}", bind.loc);
                  }
                }
                if (options.optimizeSize) {
                  var valueIdx = ATTR_VALUE_INDEX[tokenType];
                  if (!token[valueIdx]) token.length = valueIdx;
                }
              }
              break;
          }
        }
      }
      function isolateTokens(tokens, isolate, template, options, stIdx) {
        function processName(name) {
          if (name.indexOf(":") == -1) return isolate + name;
          if (!template) return name;
          var parts = name.split(":");
          if (!parts[0]) return parts[1];
          var namespace = hasOwnProperty.call(template.styleNSPrefix, parts[0]) ? template.styleNSPrefix[parts[0]] : false;
          if (!namespace) {
            var isolatedPrefix = options.styleNSIsolateMap[parts[0]];
            var oldPrefix = parts[0];
            var fullName = arguments[1];
            var loc = arguments[2];
            if (fullName) {
              if (isolatedPrefix) fullName = fullName.replace(oldPrefix, isolatedPrefix);
              addTemplateWarn(template, options, "Namespace `" + (isolatedPrefix || oldPrefix) + "` is not defined: " + fullName, loc);
            }
            return false;
          } else {
            namespace.used = true;
            return namespace.prefix + parts[1];
          }
        }
        for (var i = stIdx || 0, token; token = tokens[i]; i++) {
          var tokenType = token[TOKEN_TYPE];
          if (tokenType == TYPE_ELEMENT) isolateTokens(token, isolate, template, options, ELEMENT_ATTRIBUTES_AND_CHILDREN);
          if (tokenType == TYPE_ATTRIBUTE_CLASS) {
            var bindings = token[TOKEN_BINDINGS];
            var valueIndex = ATTR_VALUE_INDEX[tokenType];
            if (token[valueIndex]) token[valueIndex] = token[valueIndex].split(/\s+/).map(function(name) {
              return processName(name, name, token.valueLocMap ? token.valueLocMap[name] : null);
            }).filter(Boolean).join(" ");
            if (bindings) {
              for (var j = 0, bind, prefix, removed; bind = bindings[j]; j++) {
                prefix = processName(bind[0], bind[0] + "{" + bind[1] + "}", bind.loc);
                if (prefix === false) {
                  removed = true;
                  bindings[j] = null;
                } else bind[0] = prefix;
              }
              if (removed) {
                bindings = bindings.filter(Boolean);
                token[TOKEN_BINDINGS] = bindings.length ? bindings : 0;
              }
            }
            if (token.valueLocMap) {
              var oldValueLocMap = token.valueLocMap;
              token.valueLocMap = {};
              for (var name in oldValueLocMap) {
                var newKey = processName(name);
                if (newKey) token.valueLocMap[newKey] = oldValueLocMap[name];
              }
            }
          }
        }
      }
      function styleHash(style) {
        return style[0] + "|" + style[1];
      }
      return function makeDeclaration(source, baseURI, options, sourceUrl, sourceOrigin) {
        var warns = [];
        var source_;
        options = basis.object.slice(options);
        options.includeOptions = options.includeOptions || {};
        options.defines = {};
        options.dictURI = sourceUrl ? basis.path.resolve(sourceUrl) : baseURI || "";
        options.styleNSIsolateMap = {};
        options.loc = true;
        options.range = true;
        var result = {
          sourceUrl: sourceUrl,
          baseURI: baseURI || "",
          tokens: null,
          includes: [],
          deps: [],
          isolate: false,
          styleNSPrefix: {},
          resources: [],
          l10n: [],
          warns: warns
        };
        result.removals = [];
        result.states = {};
        if (options.dictURI) {
          var extname = basis.path.extname(options.dictURI);
          if (extname && extname != ".l10n") options.dictURI = options.dictURI.substr(0, options.dictURI.length - extname.length) + ".l10n";
        }
        if (!source.templateTokens) {
          source_ = source;
          source = tokenize(String(source), {
            loc: !!options.loc,
            range: !!options.range
          });
        }
        if (source.warns) source.warns.forEach(function(warn) {
          addTemplateWarn(result, options, warn[0], warn[1].loc);
        });
        includeStack.push(sourceOrigin !== true && sourceOrigin || {});
        result.tokens = process(source, result, options);
        includeStack.pop();
        if (!result.tokens) result.tokens = [ [ TYPE_TEXT, 0, 0, "" ] ];
        if (source_) result.tokens.source_ = source_;
        addTokenRef(result.tokens[0], "element");
        normalizeRefs(result.tokens);
        applyDefines(result.tokens, result, options);
        if (/^[^a-z]/i.test(result.isolate)) basis.dev.error("basis.template: isolation prefix `" + result.isolate + "` should not starts with symbol other than letter, otherwise it leads to incorrect css class names and broken styles");
        if (includeStack.length == 0) {
          isolateTokens(result.tokens, result.isolate || "", result, options);
          result.warns = [];
          if (result.removals) result.removals.forEach(function(item) {
            isolateTokens([ item.token ], result.isolate || "", result, options);
          });
          result.warns = warns;
          for (var key in result.styleNSPrefix) {
            var styleNSPrefix = result.styleNSPrefix[key];
            if (!styleNSPrefix.used) addTemplateWarn(result, options, "Unused namespace: " + styleNSPrefix.name, styleNSPrefix.loc);
          }
          if (result.isolate) for (var i = 0, item; item = result.resources[i]; i++) if (item[1] !== styleNamespaceIsolate) item[1] = result.isolate + item[1];
          var styles = result.resources;
          result.resources = result.resources.filter(function(item, idx, array) {
            return item[0] && !basis.array.search(array, styleHash(item), styleHash, idx + 1);
          }).map(function(item) {
            var url = item[0];
            var isolate = item[1];
            var namespaceIsolate = isolate === styleNamespaceIsolate;
            var cssMap;
            if (namespaceIsolate) {
              isolate = styleNamespaceIsolate[url];
              if (url in styleNamespaceResource) {
                item.url = styleNamespaceResource[url].url;
                return styleNamespaceResource[url].url;
              }
            }
            if (!isolate) {
              item.url = url;
              return url;
            }
            var resource = basis.resource.virtual("css", "").ready(function(cssResource) {
              cssResource.url = url + "?isolate-prefix=" + isolate;
              cssResource.baseURI = basis.path.dirname(url) + "/";
              cssResource.map = cssMap;
              sourceResource();
            });
            var sourceResource = basis.resource(url).ready(function(cssResource) {
              var isolated = isolateCss(cssResource.cssText || "", isolate, true);
              if (typeof global.btoa == "function") isolated.css += "\n/*# sourceMappingURL=data:application/json;base64," + global.btoa('{"version":3,"sources":["' + basis.path.origin + url + '"],' + '"mappings":"AAAA' + basis.string.repeat(";AACA", isolated.css.split("\n").length) + '"}') + " */";
              cssMap = isolated.map;
              resource.update(isolated.css);
            });
            if (namespaceIsolate) styleNamespaceResource[url] = resource;
            item.url = resource.url;
            return resource.url;
          });
          result.styles = styles.map(function(item, idx) {
            var sourceUrl = item[0] || tokenAttrs(item[2]).src;
            return {
              resource: item.url || false,
              sourceUrl: basis.resource.resolveURI(sourceUrl),
              isolate: item[1] === styleNamespaceIsolate ? styleNamespaceIsolate[item[0]] : item[1] || false,
              namespace: item[5] || false,
              inline: item[4],
              styleToken: item[2],
              includeToken: item[3]
            };
          });
        }
        for (var key in options.defines) {
          var define = options.defines[key];
          if (!define.used) addTemplateWarn(result, options, "Unused define: " + key, define.loc);
        }
        if (!warns.length) result.warns = false;
        return result;
      };
    }();
    function cloneDecl(array) {
      var result = [];
      if (array.source_) result.source_ = array.source_;
      for (var i = 0; i < array.length; i++) result.push(Array.isArray(array[i]) ? cloneDecl(array[i]) : array[i]);
      return result;
    }
    function getDeclFromSource(source, baseURI, clone, options) {
      var result = source;
      var sourceUrl;
      if (source.bindingBridge) {
        baseURI = "baseURI" in source ? source.baseURI : "url" in source ? basis.path.dirname(source.url) : baseURI;
        sourceUrl = "url" in source ? source.url : sourceUrl;
        result = source.bindingBridge.get(source);
      }
      if (Array.isArray(result)) {
        if (clone) result = cloneDecl(result);
        result = {
          tokens: result
        };
      } else {
        if (typeof result != "object" || !Array.isArray(result.tokens)) result = String(result);
      }
      if (typeof result == "string") result = makeDeclaration(result, baseURI, options, sourceUrl, source);
      return result;
    }
    basis.resource("./7.js").ready(function(exports) {
      resolveResource = exports.resolveResource;
      Template = exports.Template;
    });
    module.exports = {
      VERSION: 3,
      makeDeclaration: makeDeclaration,
      getDeclFromSource: getDeclFromSource
    };
  },
  "w.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var consts = basis.require("./6.js");
    var TYPE_ELEMENT = consts.TYPE_ELEMENT;
    var TYPE_ATTRIBUTE = consts.TYPE_ATTRIBUTE;
    var TYPE_TEXT = consts.TYPE_TEXT;
    var TYPE_COMMENT = consts.TYPE_COMMENT;
    var ATTR_TYPE_BY_NAME = consts.ATTR_TYPE_BY_NAME;
    var SYNTAX_ERROR = "Invalid or unsupported syntax";
    var TEXT = /((?:.|[\r\n])*?)(\{(?:l10n:([a-zA-Z_][a-zA-Z0-9_\-]*(?:\.[a-zA-Z_][a-zA-Z0-9_\-]*)*(?:\.\{[a-zA-Z_][a-zA-Z0-9_\-]*\})?)\})?|<(\/|!--(\s*\{)?)?|$)/g;
    var TAG_NAME = /([a-z_][a-z0-9\-_]*)(:|\{|\s*(\/?>)?)/ig;
    var ATTRIBUTE_NAME_OR_END = /([a-z_][a-z0-9_\-]*)(:|\{|=|\s*)|(\/?>)/ig;
    var COMMENT = /(.|[\r\n])*?-->/g;
    var CLOSE_TAG = /([a-z_][a-z0-9_\-]*(?::[a-z_][a-z0-9_\-]*)?)>/ig;
    var REFERENCE = /([a-z_][a-z0-9_]*)(\||\}\s*)/ig;
    var ATTRIBUTE_VALUE = /"((?:(\\")|[^"])*?)"\s*/g;
    var QUOTE_UNESCAPE = /\\"/g;
    var BREAK_TAG_PARSE = /^/g;
    var SINGLETON_TAG = /^(area|base|br|col|command|embed|hr|img|input|link|meta|param|source)$/i;
    var TAG_IGNORE_CONTENT = {
      text: /((?:.|[\r\n])*?)(?:<\/b:text>|$)/g,
      style: /((?:.|[\r\n])*?)(?:<\/b:style>|$)/g
    };
    var ATTR_BINDING = /\{([a-z_][a-z0-9_]*|l10n:[a-z_][a-z0-9_]*(?:\.[a-z_][a-z0-9_]*)*(?:\.\{[a-z_][a-z0-9_]*\})?)\}/i;
    var CLASS_ATTR_BINDING = /^((?:[a-z_][a-z0-9_\-]*)?(?::(?:[a-z_][a-z0-9_\-]*)?)?)\{((anim:)?[a-z_][a-z0-9_\-]*)\}$/i;
    var STYLE_ATTR_PARTS = /\s*[^:]+?\s*:(?:\(.*?\)|".*?"|'.*?'|[^;]+?)+(?:;|$)/gi;
    var STYLE_PROPERTY = /\s*([^:]+?)\s*:((?:\(.*?\)|".*?"|'.*?'|[^;]+?)+);?$/i;
    var STYLE_ATTR_BINDING = /\{([a-z_][a-z0-9_]*)\}/i;
    var ATTRIBUTE_MODE = /^(?:|append-|set-|remove-)(class|attr)$/;
    var decodeHTMLTokens = function() {
      var tokenMap = {};
      var tokenElement = !basis.NODE_ENV ? global.document.createElement("div") : null;
      var NAMED_CHARACTER_REF = /&([a-z]+\d*|#\d+|#x[0-9a-f]{1,4});?/gi;
      if (basis.NODE_ENV) tokenMap = __nodejsRequire("./htmlentity.json");
      function namedCharReplace(m, token) {
        if (!tokenMap[token]) {
          if (token.charAt(0) == "#") {
            tokenMap[token] = String.fromCharCode(token.charAt(1) == "x" || token.charAt(1) == "X" ? parseInt(token.substr(2), 16) : token.substr(1));
          } else {
            if (tokenElement) {
              tokenElement.innerHTML = m;
              tokenMap[token] = tokenElement.firstChild ? tokenElement.firstChild.nodeValue : m;
            }
          }
        }
        return tokenMap[token] || m;
      }
      return function decodeHTMLTokens(string) {
        return String(string).replace(NAMED_CHARACTER_REF, namedCharReplace);
      };
    }();
    function buildAttrExpression(parts) {
      var bindName;
      var names = [];
      var expression = [];
      var map = {};
      for (var j = 0; j < parts.length; j++) if (j % 2) {
        bindName = parts[j];
        if (!map[bindName]) {
          map[bindName] = names.length;
          names.push(bindName);
        }
        expression.push(map[bindName]);
      } else {
        if (parts[j]) expression.push(decodeHTMLTokens(parts[j]));
      }
      return [ names, expression ];
    }
    function processAttr(token, mode, convertRange) {
      var value = token.value;
      var bindings = 0;
      var parts;
      var m;
      if (value) {
        switch (mode) {
          case "class":
            var pos = token.valueRange.start_;
            var rx = /(\s*)(\S+)/g;
            var newValue = [];
            var partMap = [];
            var binding;
            bindings = [];
            while (part = rx.exec(value)) {
              var val = part[2];
              var valInfo = {
                value: val,
                binding: false,
                range: {
                  start_: pos += part[1].length,
                  end_: pos += val.length
                }
              };
              convertRange(valInfo);
              if (m = val.match(CLASS_ATTR_BINDING)) {
                binding = [ m[1] || "", m[2] ];
                binding.info_ = valInfo;
                valInfo.binding = true;
                bindings.push(binding);
              } else newValue.push(val);
              partMap.push(valInfo);
            }
            value = newValue.join(" ");
            token.map_ = partMap;
            break;
          case "style":
            var props = [];
            bindings = [];
            if (parts = value.match(STYLE_ATTR_PARTS)) {
              for (var j = 0, part; part = parts[j]; j++) {
                var m = part.match(STYLE_PROPERTY);
                var propertyName = m[1];
                var value = m[2].trim();
                var valueParts = value.split(STYLE_ATTR_BINDING);
                if (valueParts.length > 1) {
                  var expr = buildAttrExpression(valueParts);
                  expr.push(propertyName);
                  bindings.push(expr);
                } else props.push(propertyName + ": " + decodeHTMLTokens(value));
              }
            } else {
              if (/\S/.test(value)) basis.dev.warn("Bad value for style attribute (value ignored):", value);
            }
            value = props.join("; ");
            if (value) value += ";";
            break;
          default:
            parts = value.split(ATTR_BINDING);
            if (parts.length > 1) bindings = buildAttrExpression(parts); else value = decodeHTMLTokens(value);
        }
      }
      if (bindings && !bindings.length) bindings = 0;
      token.binding = bindings;
      token.value = value;
      token.type = ATTR_TYPE_BY_NAME[mode] || TYPE_ATTRIBUTE;
    }
    function postProcessing(tokens, options, source) {
      function tokenName(token) {
        return (token.prefix ? token.prefix + ":" : "") + token.name;
      }
      function getTokenAttrs(token) {
        return token.attrs.reduce(function(res, attr) {
          res[tokenName(attr)] = attr.value;
          return res;
        }, {});
      }
      function buildLocationIndex() {
        var line = 1;
        var column = 0;
        lineIdx = new Array(source.length);
        columnIdx = new Array(source.length);
        for (var i = 0; i < source.length + 1; i++) {
          lineIdx[i] = line;
          columnIdx[i] = column;
          if (source[i] === "\n") {
            line++;
            column = 0;
          } else column++;
        }
      }
      function findLocationByOffset(offset) {
        return {
          line: lineIdx[offset],
          column: columnIdx[offset]
        };
      }
      function getLocationFromRange(range) {
        return {
          start: findLocationByOffset(range.start_),
          end: findLocationByOffset(range.end_)
        };
      }
      function convertRange(token) {
        if (options.loc) {
          token.loc = getLocationFromRange(token.range);
          if (token.valueRange) token.valueLoc = getLocationFromRange(token.valueRange);
        }
        if (options.range) {
          token.range = [ token.range.start_, token.range.end_ ];
          if (token.valueRange) token.valueRange = [ token.valueRange.start_, token.valueRange.end_ ];
        } else {
          delete token.range;
          delete token.valueRange;
        }
      }
      function walk(tokens) {
        var token;
        var prev;
        for (var i = 0; token = tokens[i++]; prev = token) {
          if (token.type == TYPE_ELEMENT) {
            var attrs = getTokenAttrs(token);
            for (var j = 0, attr; attr = token.attrs[j++]; ) {
              var mode = attr.name;
              if (token.prefix == "b" && attr.name == "value") {
                var m = token.name.match(ATTRIBUTE_MODE);
                if (m) mode = m[1] == "class" ? "class" : attrs.name;
              }
              processAttr(attr, mode, convertRange);
              convertRange(attr);
            }
            walk(token.children);
          }
          if (token.type == TYPE_TEXT) {
            token.value = decodeHTMLTokens(token.value);
            if (!token.refs && prev && prev.type == TYPE_TEXT && !prev.refs) {
              prev.value += token.value;
              prev.end_ = token.end_;
              tokens.splice(--i, 1);
            }
          }
          if (token.type == TYPE_COMMENT) {
            token.value = decodeHTMLTokens(token.value);
          }
          convertRange(token);
        }
      }
      var lineIdx;
      var columnIdx;
      if (options.loc) buildLocationIndex();
      walk(tokens);
    }
    function tokenize(source, options) {
      var result = [];
      var tagStack = [];
      var lastTag = {
        children: result
      };
      var parseTag = false;
      var token;
      var state = TEXT;
      var pos = 0;
      var textStateEndPos = 0;
      var textEndPos;
      var bufferPos;
      var startPos;
      var m;
      var attrMap;
      result.source_ = source;
      result.warns = [];
      if (!options || options.trim !== false) {
        pos = textStateEndPos = source.match(/^\s*/)[0].length;
        source = source.trimRight();
      }
      while (pos < source.length || state != TEXT) {
        state.lastIndex = pos;
        startPos = pos;
        m = state.exec(source);
        if (!m || m.index !== pos) {
          if (state == REFERENCE && token && token.type == TYPE_COMMENT) {
            state = COMMENT;
            continue;
          }
          if (parseTag) lastTag = tagStack.pop();
          if (token) lastTag.children.pop();
          if (token = lastTag.children.pop()) {
            if (token.type == TYPE_TEXT && !token.refs) textStateEndPos -= "len" in token ? token.len : token.value.length; else lastTag.children.push(token);
          }
          parseTag = false;
          state = TEXT;
          continue;
        }
        pos = state.lastIndex;
        switch (state) {
          case TEXT:
            textEndPos = startPos + m[1].length;
            if (textStateEndPos != textEndPos) {
              var sourceText = textStateEndPos == startPos ? m[1] : source.substring(textStateEndPos, textEndPos);
              sourceText = sourceText.replace(/\s*(\r\n?|\n\r?)\s*/g, "");
              if (sourceText) lastTag.children.push({
                type: TYPE_TEXT,
                len: sourceText.length,
                value: sourceText,
                range: {
                  start_: textStateEndPos,
                  end_: textEndPos
                }
              });
            }
            textStateEndPos = textEndPos;
            if (m[3]) {
              lastTag.children.push({
                type: TYPE_TEXT,
                refs: [ "l10n:" + m[3] ],
                value: "{l10n:" + m[3] + "}",
                range: {
                  start_: textEndPos,
                  end_: pos
                }
              });
            } else if (m[2] == "{") {
              bufferPos = pos - 1;
              lastTag.children.push(token = {
                type: TYPE_TEXT,
                range: {
                  start_: textEndPos,
                  end_: textEndPos
                }
              });
              state = REFERENCE;
            } else if (m[4]) {
              if (m[4] == "/") {
                token = null;
                state = CLOSE_TAG;
              } else {
                lastTag.children.push(token = {
                  type: TYPE_COMMENT,
                  range: {
                    start_: textEndPos,
                    end_: textEndPos
                  }
                });
                if (m[5]) {
                  bufferPos = pos - m[5].length;
                  state = REFERENCE;
                } else {
                  bufferPos = pos;
                  state = COMMENT;
                }
              }
            } else if (m[2]) {
              parseTag = true;
              tagStack.push(lastTag);
              lastTag.children.push(token = {
                type: TYPE_ELEMENT,
                attrs: [],
                children: [],
                range: {
                  start_: textEndPos,
                  end_: textEndPos
                }
              });
              lastTag = token;
              state = TAG_NAME;
              attrMap = {};
            }
            break;
          case CLOSE_TAG:
            if (m[1] !== (lastTag.prefix ? lastTag.prefix + ":" : "") + lastTag.name) {
              lastTag.children.push({
                type: TYPE_TEXT,
                value: "</" + m[0],
                range: {
                  start_: startPos - 2,
                  end_: startPos + m[0].length
                }
              });
              result.warns.push([ "Wrong close tag: " + source.substr(startPos - 2, m[0].length + 2), lastTag.children[lastTag.children.length - 1] ]);
            } else lastTag = tagStack.pop();
            state = TEXT;
            break;
          case TAG_NAME:
          case ATTRIBUTE_NAME_OR_END:
            if (m[2] == ":") {
              if (token.prefix) state = BREAK_TAG_PARSE; else token.prefix = m[1];
              break;
            }
            if (m[1]) {
              token.name = m[1];
              token.range.end_ = startPos + m[1].length;
              if (token.type == TYPE_ATTRIBUTE) {
                var fullName = (token.prefix ? token.prefix + ":" : "") + token.name;
                if (Object.prototype.hasOwnProperty.call(attrMap, fullName)) result.warns.push([ "Duplicate attribute: " + fullName, token ]);
                attrMap[fullName] = true;
                lastTag.attrs.push(token);
              }
            }
            if (m[2] == "{") {
              if (token.type == TYPE_ELEMENT) state = REFERENCE; else state = BREAK_TAG_PARSE;
              break;
            }
            if (m[3]) {
              parseTag = false;
              lastTag.range.end_ = pos;
              if (m[3] == "/>" || !lastTag.prefix && SINGLETON_TAG.test(lastTag.name)) {
                if (m[3] != "/>") result.warns.push([ "Tag <" + lastTag.name + "> doesn't closed explicit (use `/>` as tag ending)", lastTag ]);
                lastTag = tagStack.pop();
              } else {
                if (lastTag.prefix == "b" && lastTag.name in TAG_IGNORE_CONTENT) {
                  state = TAG_IGNORE_CONTENT[lastTag.name];
                  break;
                }
              }
              state = TEXT;
              break;
            }
            if (m[2] == "=") {
              state = ATTRIBUTE_VALUE;
              break;
            }
            token = {
              type: TYPE_ATTRIBUTE,
              range: {
                start_: pos,
                end_: pos
              }
            };
            state = ATTRIBUTE_NAME_OR_END;
            break;
          case COMMENT:
            token.value = source.substring(bufferPos, pos - 3);
            token.range.end_ = pos;
            state = TEXT;
            break;
          case REFERENCE:
            if (token.refs) token.refs.push(m[1]); else token.refs = [ m[1] ];
            if (m[2] != "|") {
              if (token.type == TYPE_TEXT) {
                pos -= m[2].length - 1;
                token.value = source.substring(bufferPos, pos);
                token.range.end_ = pos;
                state = TEXT;
              } else if (token.type == TYPE_COMMENT) {
                state = COMMENT;
              } else if (token.type == TYPE_ATTRIBUTE && source[pos] == "=") {
                pos++;
                state = ATTRIBUTE_VALUE;
              } else {
                token = {
                  type: TYPE_ATTRIBUTE,
                  range: {
                    start_: pos,
                    end_: pos
                  }
                };
                state = ATTRIBUTE_NAME_OR_END;
              }
            }
            break;
          case ATTRIBUTE_VALUE:
            token.value = m[1].replace(QUOTE_UNESCAPE, '"');
            token.range.end_ = pos;
            token.valueRange = {
              start_: startPos + 1,
              end_: startPos + 1 + m[1].length
            };
            token = {
              type: TYPE_ATTRIBUTE,
              range: {
                start_: pos,
                end_: pos
              }
            };
            state = ATTRIBUTE_NAME_OR_END;
            break;
          case TAG_IGNORE_CONTENT.text:
          case TAG_IGNORE_CONTENT.style:
            lastTag.children.push({
              type: TYPE_TEXT,
              value: m[1],
              range: {
                start_: startPos,
                end_: startPos + m[1].length
              }
            });
            lastTag = tagStack.pop();
            state = TEXT;
            break;
          default:
            throw SYNTAX_ERROR;
        }
        if (state == TEXT) textStateEndPos = pos;
      }
      if (textStateEndPos != pos) lastTag.children.push({
        type: TYPE_TEXT,
        value: source.substring(textStateEndPos, pos),
        range: {
          start_: textStateEndPos,
          end_: pos
        }
      });
      postProcessing(result, options || {}, source);
      if (lastTag.name) result.warns.push([ "No close tag for <" + (lastTag.prefix ? lastTag.prefix + ":" : "") + lastTag.name + ">", lastTag ]);
      if (!result.warns.length) delete result.warns;
      result.templateTokens = true;
      return result;
    }
    module.exports = tokenize;
  },
  "x.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var CSS_CLASSNAME_START = /^\-?([_a-z]|[^\x00-\xb1]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])/i;
    var CSS_CLASSNAME_START_MAXLEN = 8;
    var CSS_NESTED_ATRULE = /^(media|supports|document)\b/i;
    var CSS_NESTED_ATRULE_MAXLEN = 8;
    var CSS_FNSELECTOR = /^(not|has|matches|nth-child|nth-last-child)\(/i;
    var CSS_FNSELECTOR_MAXLEN = 15;
    function genIsolateMarker() {
      return basis.genUID() + "__";
    }
    function isolateCss(css, prefix, info) {
      function jumpAfter(str, offset) {
        var index = css.indexOf(str, offset);
        i = index !== -1 ? index + str.length : sym.length;
      }
      function parseString() {
        var quote = sym[i];
        if (quote !== '"' && quote !== "'") return;
        for (i++; i < len && sym[i] !== quote; i++) if (sym[i] === "\\") i++;
        return true;
      }
      function parseBraces() {
        var bracket = sym[i];
        if (bracket === "(") {
          jumpAfter(")", i + 1);
          return true;
        }
        if (bracket === "[") {
          for (i++; i < len && sym[i] !== "]"; i++) parseString();
          return true;
        }
      }
      function parseComment() {
        if (sym[i] !== "/" || sym[i + 1] !== "*") return;
        jumpAfter("*/", i + 2);
        return true;
      }
      function parsePseudoContent() {
        for (; i < len && sym[i] != ")"; i++) if (parseComment() || parseBraces() || parsePseudo() || parseClassName()) continue;
      }
      function parsePseudo() {
        if (sym[i] !== ":") return;
        var m = css.substr(i + 1, CSS_FNSELECTOR_MAXLEN).match(CSS_FNSELECTOR);
        if (m) {
          i += m[0].length + 1;
          parsePseudoContent();
        }
        return true;
      }
      function parseAtRule() {
        if (sym[i] !== "@") return;
        var m = css.substr(i + 1, CSS_NESTED_ATRULE_MAXLEN).match(CSS_NESTED_ATRULE);
        if (m) {
          i += m[0].length;
          nestedStyleSheet = true;
        }
        return true;
      }
      function parseBlock() {
        if (sym[i] !== "{") return;
        if (nestedStyleSheet) {
          i++;
          parseStyleSheet(true);
          return;
        }
        for (i++; i < len && sym[i] !== "}"; i++) parseString() || parseBraces();
        return true;
      }
      function parseClassName() {
        if (sym[i] !== ".") return;
        var m = css.substr(i + 1, CSS_CLASSNAME_START_MAXLEN).match(CSS_CLASSNAME_START);
        if (m) {
          i++;
          map[i + result.length / 2 * prefix.length - 1] = i;
          result.push(css.substring(lastMatchPos, i), prefix);
          lastMatchPos = i;
        }
        return true;
      }
      function parseStyleSheet(nested) {
        for (nestedStyleSheet = false; i < len; i++) {
          if (parseComment() || parseAtRule() || parsePseudo() || parseBraces() || parseClassName()) continue;
          if (nested && sym[i] == "}") return;
          parseBlock();
        }
      }
      var map = {};
      var result = [];
      var sym = css.split("");
      var len = sym.length;
      var lastMatchPos = 0;
      var i = 0;
      var nestedStyleSheet;
      if (!prefix) prefix = genIsolateMarker();
      parseStyleSheet(false);
      result = result.join("") + css.substring(lastMatchPos);
      return info ? {
        css: result,
        map: map,
        prefix: prefix
      } : result;
    }
    module.exports = isolateCss;
  },
  "9.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var templates = {};
    function add(id, template, instances) {
      templates[id] = {
        template: template,
        instances: instances
      };
    }
    function remove(id) {
      delete templates[id];
    }
    function resolveTemplateById(refId) {
      var templateId = refId & 4095;
      var object = templates[templateId];
      return object && object.template;
    }
    function resolveInstanceById(refId) {
      var templateId = refId & 4095;
      var instanceId = refId >> 12;
      var object = templates[templateId];
      return object && object.instances[instanceId];
    }
    function resolveObjectById(refId) {
      var templateRef = resolveInstanceById(refId);
      return templateRef && templateRef.context;
    }
    function resolveTmplById(refId) {
      var templateRef = resolveInstanceById(refId);
      return templateRef && templateRef.tmpl;
    }
    function resolveActionById(refId) {
      var templateRef = resolveInstanceById(refId);
      return templateRef && {
        context: templateRef.context,
        action: templateRef.action
      };
    }
    function getDebugInfoById(refId) {
      var templateRef = resolveInstanceById(refId);
      return templateRef && templateRef.debug && templateRef.debug();
    }
    module.exports = {
      getDebugInfoById: getDebugInfoById,
      add: add,
      remove: remove,
      resolveActionById: resolveActionById,
      resolveTemplateById: resolveTemplateById,
      resolveObjectById: resolveObjectById,
      resolveTmplById: resolveTmplById
    };
  },
  "a.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var themes = {};
    var sourceByPath = {};
    var themeChangeHandlers = [];
    var currentThemeName = "base";
    var baseTheme;
    var Theme = basis.Class(null, {
      className: namespace + ".Theme",
      get: getSourceByPath
    });
    var SourceWrapper = basis.Class(basis.Token, {
      className: namespace + ".SourceWrapper",
      path: "",
      url: "",
      baseURI: "",
      init: function(value, path) {
        this.path = path;
        basis.Token.prototype.init.call(this, "");
      },
      get: function() {
        return this.value && this.value.bindingBridge ? this.value.bindingBridge.get(this.value) : this.value;
      },
      set: function() {
        var content = getThemeSource(currentThemeName, this.path);
        if (this.value != content) {
          if (this.value && this.value.bindingBridge) this.value.bindingBridge.detach(this.value, SourceWrapper.prototype.apply, this);
          this.value = content;
          this.url = content && content.url || "";
          this.baseURI = (typeof content == "object" || typeof content == "function") && "baseURI" in content ? content.baseURI : basis.path.dirname(this.url) + "/";
          if (this.value && this.value.bindingBridge) this.value.bindingBridge.attach(this.value, SourceWrapper.prototype.apply, this);
          this.apply();
        }
      },
      destroy: function() {
        this.url = null;
        this.baseURI = null;
        if (this.value && this.value.bindingBridge) this.value.bindingBridge.detach(this.value, this.apply, this);
        basis.Token.prototype.destroy.call(this);
      }
    });
    function getSourceByPath() {
      var path = basis.array(arguments).join(".");
      var source = sourceByPath[path];
      if (!source) {
        source = new SourceWrapper("", path);
        sourceByPath[path] = source;
      }
      return source;
    }
    function normalize(list) {
      var used = {};
      var result = [];
      for (var i = 0; i < list.length; i++) if (!used[list[i]]) {
        used[list[i]] = true;
        result.push(list[i]);
      }
      return result;
    }
    function extendFallback(themeName, list) {
      var result = [];
      result.source = normalize(list).join("/");
      var used = {
        base: true
      };
      for (var i = 0; i < list.length; i++) {
        var name = list[i] || "base";
        if (name == themeName || used[name]) continue;
        used[name] = true;
        result.push(name);
        list.splice.apply(list, [ i + 1, 0 ].concat(themes[name].fallback));
      }
      result.unshift(themeName);
      if (themeName != "base") result.push("base");
      result.value = result.join("/");
      return result;
    }
    function getThemeSource(name, path) {
      var sourceList = themes[name].sourcesList;
      for (var i = 0, map; map = sourceList[i]; i++) if (map.hasOwnProperty(path)) return map[path];
      return "";
    }
    function themeHasEffect(themeName) {
      return themes[currentThemeName].fallback.indexOf(themeName) != -1;
    }
    function syncCurrentThemePath(path) {
      getSourceByPath(path).set();
    }
    function syncCurrentTheme() {
      basis.dev.log("re-apply templates");
      for (var path in sourceByPath) syncCurrentThemePath(path);
    }
    function getTheme(name) {
      if (!name) name = "base";
      if (themes[name]) return themes[name].theme;
      if (!/^([a-z0-9\_\-]+)$/.test(name)) throw "Bad name for theme - " + name;
      var sources = {};
      var sourceList = [ sources ];
      var themeInterface = new Theme;
      themes[name] = {
        theme: themeInterface,
        sources: sources,
        sourcesList: sourceList,
        fallback: []
      };
      var addSource = function(path, source) {
        if (path in sources == false) {
          sources[path] = source;
          if (themeHasEffect(name)) syncCurrentThemePath(path);
        } else basis.dev.warn("Template path `" + path + "` is already defined for theme `" + name + "` (definition ignored).");
        return getSourceByPath(path);
      };
      basis.object.extend(themeInterface, {
        name: name,
        fallback: function(value) {
          if (themeInterface !== baseTheme && arguments.length > 0) {
            var newFallback = typeof value == "string" ? value.split("/") : [];
            var changed = {};
            newFallback = extendFallback(name, newFallback);
            if (themes[name].fallback.source != newFallback.source) {
              themes[name].fallback.source = newFallback.source;
              basis.dev.log("fallback changed");
              for (var themeName in themes) {
                var curFallback = themes[themeName].fallback;
                var newFallback = extendFallback(themeName, (curFallback.source || "").split("/"));
                if (newFallback.value != curFallback.value) {
                  changed[themeName] = true;
                  themes[themeName].fallback = newFallback;
                  var sourceList = themes[themeName].sourcesList;
                  sourceList.length = newFallback.length;
                  for (var i = 0; i < sourceList.length; i++) sourceList[i] = themes[newFallback[i]].sources;
                }
              }
            }
            for (var themeName in changed) if (themeHasEffect(themeName)) {
              syncCurrentTheme();
              break;
            }
          }
          var result = themes[name].fallback.slice(1);
          result.source = themes[name].fallback.source;
          return result;
        },
        define: function(what, wherewith) {
          if (typeof what == "function") what = what();
          if (typeof what == "string") {
            if (typeof wherewith == "object") {
              var namespace = what;
              var dictionary = wherewith;
              var result = {};
              for (var key in dictionary) if (dictionary.hasOwnProperty(key)) result[key] = addSource(namespace + "." + key, dictionary[key]);
              return result;
            } else {
              if (arguments.length == 1) {
                return getSourceByPath(what);
              } else {
                return addSource(what, wherewith);
              }
            }
          } else {
            if (typeof what == "object") {
              var dictionary = what;
              for (var path in dictionary) if (dictionary.hasOwnProperty(path)) addSource(path, dictionary[path]);
              return themeInterface;
            } else {
              basis.dev.warn("Wrong first argument for basis.template.Theme#define");
            }
          }
        },
        apply: function() {
          if (name != currentThemeName) {
            currentThemeName = name;
            syncCurrentTheme();
            for (var i = 0, handler; handler = themeChangeHandlers[i]; i++) handler.fn.call(handler.context, name);
            basis.dev.info("Template theme switched to `" + name + "`");
          }
          return themeInterface;
        },
        getSource: function(path, withFallback) {
          return withFallback ? getThemeSource(name, path) : sources[path];
        },
        drop: function(path) {
          if (sources.hasOwnProperty(path)) {
            delete sources[path];
            if (themeHasEffect(name)) syncCurrentThemePath(path);
          }
        }
      });
      themes[name].fallback = extendFallback(name, []);
      sourceList.push(themes.base.sources);
      return themeInterface;
    }
    function onThemeChange(fn, context, fire) {
      themeChangeHandlers.push({
        fn: fn,
        context: context
      });
      if (fire) fn.call(context, currentThemeName);
    }
    basis.cleaner.add({
      destroy: function() {
        for (var path in sourceByPath) sourceByPath[path].destroy();
        themes = null;
        sourceByPath = null;
      }
    });
    baseTheme = getTheme();
    module.exports = {
      SourceWrapper: SourceWrapper,
      Theme: Theme,
      theme: getTheme,
      getThemeList: function() {
        return basis.object.keys(themes);
      },
      currentTheme: function() {
        return themes[currentThemeName].theme;
      },
      setTheme: function(name) {
        return getTheme(name).apply();
      },
      onThemeChange: onThemeChange,
      define: baseTheme.define,
      get: getSourceByPath,
      getPathList: function() {
        return basis.object.keys(sourceByPath);
      }
    };
  },
  "b.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var Node = global.Node;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var eventUtils = basis.require("./c.js");
    var resolveActionById = basis.require("./9.js").resolveActionById;
    var consts = basis.require("./6.js");
    var MARKER = consts.MARKER;
    var CLONE_NORMALIZATION_TEXT_BUG = consts.CLONE_NORMALIZATION_TEXT_BUG;
    var TYPE_ELEMENT = consts.TYPE_ELEMENT;
    var TYPE_ATTRIBUTE = consts.TYPE_ATTRIBUTE;
    var TYPE_ATTRIBUTE_CLASS = consts.TYPE_ATTRIBUTE_CLASS;
    var TYPE_ATTRIBUTE_STYLE = consts.TYPE_ATTRIBUTE_STYLE;
    var TYPE_ATTRIBUTE_EVENT = consts.TYPE_ATTRIBUTE_EVENT;
    var TYPE_TEXT = consts.TYPE_TEXT;
    var TYPE_COMMENT = consts.TYPE_COMMENT;
    var TOKEN_TYPE = consts.TOKEN_TYPE;
    var TOKEN_BINDINGS = consts.TOKEN_BINDINGS;
    var TOKEN_REFS = consts.TOKEN_REFS;
    var ATTR_NAME = consts.ATTR_NAME;
    var ATTR_VALUE = consts.ATTR_VALUE;
    var ATTR_VALUE_INDEX = consts.ATTR_VALUE_INDEX;
    var ELEMENT_NAME = consts.ELEMENT_NAME;
    var ELEMENT_ATTRIBUTES_AND_CHILDREN = consts.ELEMENT_ATTRIBUTES_AND_CHILDREN;
    var TEXT_VALUE = consts.TEXT_VALUE;
    var COMMENT_VALUE = consts.COMMENT_VALUE;
    var CLASS_BINDING_ENUM = consts.CLASS_BINDING_ENUM;
    var CLASS_BINDING_BOOL = consts.CLASS_BINDING_BOOL;
    var MOUSE_ENTER_LEAVE_SUPPORT = "onmouseenter" in document.documentElement;
    var USE_CAPTURE_FALLBACK = false;
    var tmplEventListeners = {};
    var afterEventAction = {};
    var insideElementEvent = {};
    var contains;
    if (Node && !Node.prototype.contains) contains = function(parent, child) {
      return parent.compareDocumentPosition(child) & 16;
    }; else contains = function(parent, child) {
      return parent.contains(child);
    };
    if (!document.addEventListener) USE_CAPTURE_FALLBACK = basis.publicCallback(function(eventName, event) {
      eventUtils.fireEvent(document, eventName);
      event.returnValue = true;
      var listener = tmplEventListeners[eventName];
      if (listener) listener(new eventUtils.Event(event));
    }, true);
    function createEventHandler(attrName) {
      return function(event) {
        if (event.type == "click" && event.which == 3) return;
        var bubble = insideElementEvent[event.type] || event.type != "mouseenter" && event.type != "mouseleave";
        var attrCursor = event.sender;
        var attr;
        while (attrCursor) {
          attr = attrCursor.getAttribute && attrCursor.getAttribute(attrName);
          if (!bubble || typeof attr == "string") break;
          attrCursor = attrCursor.parentNode;
        }
        if (typeof attr == "string") {
          var cursor = attrCursor;
          var actionTarget = cursor;
          var refId;
          var tmplRef;
          if (insideElementEvent[event.type]) {
            var relTarget = event.relatedTarget;
            if (relTarget && (cursor === relTarget || contains(cursor, relTarget))) cursor = null;
          }
          while (cursor) {
            refId = cursor[MARKER];
            if (typeof refId == "number") {
              if (tmplRef = resolveActionById(refId)) break;
            }
            cursor = cursor.parentNode;
          }
          var actions = attr.trim().split(/\s+/);
          var actionCallback = tmplRef && tmplRef.action;
          for (var i = 0, actionName; actionName = actions[i++]; ) switch (actionName) {
            case "prevent-default":
              event.preventDefault();
              break;
            case "stop-propagation":
              event.stopPropagation();
              break;
            case "log-event":
              basis.dev.log("Template event:", event);
              break;
            default:
              if (actionCallback) {
                event.actionTarget = actionTarget;
                actionCallback.call(tmplRef.context, actionName, event);
              }
          }
        }
        if (event.type in afterEventAction) afterEventAction[event.type](event, attrCursor);
      };
    }
    function emulateEvent(origEventName, emulEventName) {
      regEventHandler(emulEventName);
      insideElementEvent[origEventName] = true;
      afterEventAction[emulEventName] = function(event) {
        event = new eventUtils.Event(event);
        event.type = origEventName;
        tmplEventListeners[origEventName](event);
      };
      afterEventAction[origEventName] = function(event, cursor) {
        if (!cursor || !cursor.parentNode) return;
        event = new eventUtils.Event(event);
        event.type = origEventName;
        event.sender = cursor.parentNode;
        tmplEventListeners[origEventName](event);
      };
    }
    function regEventHandler(eventName) {
      if (hasOwnProperty.call(tmplEventListeners, eventName)) return;
      tmplEventListeners[eventName] = createEventHandler("event-" + eventName);
      if (USE_CAPTURE_FALLBACK) return;
      if (!MOUSE_ENTER_LEAVE_SUPPORT) {
        if (eventName == "mouseenter") return emulateEvent(eventName, "mouseover");
        if (eventName == "mouseleave") return emulateEvent(eventName, "mouseout");
      }
      for (var i = 0, names = eventUtils.browserEvents(eventName), browserEventName; browserEventName = names[i]; i++) eventUtils.addGlobalHandler(browserEventName, tmplEventListeners[eventName]);
    }
    var namespaceURI = {
      svg: "http://www.w3.org/2000/svg"
    };
    var SET_CLASS_ATTRIBUTE_BUG = function() {
      var element = document.createElement("div");
      element.setAttribute("class", "a");
      return !element.className;
    }();
    var SET_STYLE_ATTRIBUTE_BUG = function() {
      var element = document.createElement("div");
      element.setAttribute("style", "position:absolute");
      return element.style.position != "absolute";
    }();
    function setEventAttribute(node, eventName, actions) {
      regEventHandler(eventName);
      if (USE_CAPTURE_FALLBACK) node.setAttribute("on" + eventName, USE_CAPTURE_FALLBACK + '("' + eventName + '",event)');
      node.setAttribute("event-" + eventName, actions);
    }
    function setAttribute(node, name, value) {
      if (SET_CLASS_ATTRIBUTE_BUG && name == "class") name = "className";
      if (SET_STYLE_ATTRIBUTE_BUG && name == "style") return node.style.cssText = value;
      node.setAttribute(name, value);
    }
    var buildDOM = function(tokens, parent) {
      var result = parent || document.createDocumentFragment();
      var offset = parent ? ELEMENT_ATTRIBUTES_AND_CHILDREN : 0;
      for (var i = offset, token; token = tokens[i]; i++) {
        var tokenType = token[TOKEN_TYPE];
        switch (tokenType) {
          case TYPE_ELEMENT:
            var tagName = token[ELEMENT_NAME];
            var colonIndex = tagName.indexOf(":");
            var element = colonIndex != -1 ? document.createElementNS(namespaceURI[tagName.substr(0, colonIndex)], tagName) : document.createElement(tagName);
            buildDOM(token, element);
            result.appendChild(element);
            break;
          case TYPE_ATTRIBUTE:
            if (!token[TOKEN_BINDINGS]) setAttribute(result, token[ATTR_NAME], token[ATTR_VALUE] || "");
            break;
          case TYPE_ATTRIBUTE_CLASS:
            var attrValue = token[ATTR_VALUE_INDEX[tokenType]];
            attrValue = attrValue ? [ attrValue ] : [];
            if (token[TOKEN_BINDINGS]) for (var j = 0, binding; binding = token[TOKEN_BINDINGS][j]; j++) {
              var defaultValue = binding[4];
              if (defaultValue) {
                var prefix = binding[0];
                if (Array.isArray(prefix)) {
                  attrValue.push(prefix[defaultValue - 1]);
                } else {
                  switch (binding[2]) {
                    case CLASS_BINDING_BOOL:
                      attrValue.push(prefix + binding[3]);
                      break;
                    case CLASS_BINDING_ENUM:
                      attrValue.push(prefix + binding[5][defaultValue - 1]);
                      break;
                  }
                }
              }
            }
            if (attrValue.length) setAttribute(result, "class", attrValue.join(" "));
            break;
          case TYPE_ATTRIBUTE_STYLE:
            var attrValue = token[ATTR_VALUE_INDEX[tokenType]];
            if (attrValue) setAttribute(result, "style", attrValue);
            break;
          case TYPE_ATTRIBUTE_EVENT:
            setEventAttribute(result, token[1], token[2] || token[1]);
            break;
          case TYPE_COMMENT:
            result.appendChild(document.createComment(token[COMMENT_VALUE] || (token[TOKEN_REFS] ? "{" + token[TOKEN_REFS].join("|") + "}" : "")));
            break;
          case TYPE_TEXT:
            if (CLONE_NORMALIZATION_TEXT_BUG && i && tokens[i - 1][TOKEN_TYPE] == TYPE_TEXT) result.appendChild(document.createComment(""));
            result.appendChild(document.createTextNode(token[TEXT_VALUE] || (token[TOKEN_REFS] ? "{" + token[TOKEN_REFS].join("|") + "}" : "") || (token[TOKEN_BINDINGS] ? "{" + token[TOKEN_BINDINGS] + "}" : "")));
            break;
        }
      }
      if (!parent && tokens.length == 1) result = result.firstChild;
      return result;
    };
    module.exports = buildDOM;
  },
  "c.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var document = global.document;
    var $null = basis.fn.$null;
    var arrayFrom = basis.array.from;
    var globalEvents = {};
    var EVENT_HOLDER = "basisEvents_" + basis.genUID();
    var W3CSUPPORT = !!document.addEventListener;
    var KEY = {
      BACKSPACE: 8,
      TAB: 9,
      CTRL_ENTER: 10,
      ENTER: 13,
      SHIFT: 16,
      CTRL: 17,
      ALT: 18,
      ESC: 27,
      ESCAPE: 27,
      SPACE: 32,
      PAGEUP: 33,
      PAGEDOWN: 34,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      INSERT: 45,
      DELETE: 46,
      F1: 112,
      F2: 113,
      F3: 114,
      F4: 115,
      F5: 116,
      F6: 117,
      F7: 118,
      F8: 119,
      F9: 120,
      F10: 121,
      F11: 122,
      F12: 123
    };
    var MOUSE_LEFT = {
      VALUE: 1,
      BIT: 1
    };
    var MOUSE_MIDDLE = {
      VALUE: 2,
      BIT: 4
    };
    var MOUSE_RIGHT = {
      VALUE: 3,
      BIT: 2
    };
    var BROWSER_EVENTS = {
      mousewheel: [ "wheel", "mousewheel", "DOMMouseScroll" ]
    };
    function browserEvents(eventName) {
      return BROWSER_EVENTS[eventName] || [ eventName ];
    }
    var Event = basis.Class(null, {
      className: namespace + ".Event",
      KEY: KEY,
      init: function(event) {
        event = wrap(event);
        for (var name in event) if (name != "returnValue" && name != "keyLocation" && name != "layerX" && name != "layerY" && (event.type != "progress" || name != "totalSize" && name != "position")) if (typeof event[name] != "function" && name in this == false) this[name] = event[name];
        var target = sender(event);
        basis.object.extend(this, {
          event_: event,
          sender: target,
          target: target,
          key: key(event),
          charCode: charCode(event),
          mouseLeft: mouseButton(event, MOUSE_LEFT),
          mouseMiddle: mouseButton(event, MOUSE_MIDDLE),
          mouseRight: mouseButton(event, MOUSE_RIGHT),
          mouseX: mouseX(event),
          mouseY: mouseY(event),
          wheelDelta: wheelDelta(event)
        });
      },
      stopBubble: function() {
        cancelBubble(this.event_);
      },
      stopPropagation: function() {
        cancelBubble(this.event_);
      },
      preventDefault: function() {
        cancelDefault(this.event_);
      },
      die: function() {
        this.stopBubble();
        this.preventDefault();
      }
    });
    function wrap(event) {
      return event instanceof Event ? event.event_ : event || global.event;
    }
    function getNode(ref) {
      return typeof ref == "string" ? document.getElementById(ref) : ref;
    }
    function sender(event) {
      var target = event.target || event.srcElement || document;
      return target.nodeType == 3 ? target.parentNode : target;
    }
    function cancelBubble(event) {
      if (event.stopPropagation) event.stopPropagation(); else event.cancelBubble = true;
    }
    function cancelDefault(event) {
      if (event.preventDefault) event.preventDefault(); else event.returnValue = false;
    }
    function kill(event, node) {
      node = getNode(node);
      if (node) addHandler(node, event, kill); else {
        cancelDefault(event);
        cancelBubble(event);
      }
    }
    function key(event) {
      return event.keyCode || event.which || 0;
    }
    function charCode(event) {
      return event.charCode || event.keyCode || 0;
    }
    function mouseButton(event, button) {
      if (typeof event.which == "number") return event.which == button.VALUE; else return !!(event.button & button.BIT);
    }
    function mouseX(event) {
      if (event.changedTouches) return event.changedTouches[0].pageX; else if ("pageX" in event) return event.pageX; else return "clientX" in event ? event.clientX + (document.compatMode == "CSS1Compat" ? document.documentElement.scrollLeft : document.body.scrollLeft) : 0;
    }
    function mouseY(event) {
      if (event.changedTouches) return event.changedTouches[0].pageY; else if ("pageY" in event) return event.pageY; else return "clientY" in event ? event.clientY + (document.compatMode == "CSS1Compat" ? document.documentElement.scrollTop : document.body.scrollTop) : 0;
    }
    function wheelDelta(event) {
      var delta = 0;
      if ("deltaY" in event) delta = -event.deltaY; else if ("wheelDelta" in event) delta = event.wheelDelta; else if (event.type == "DOMMouseScroll") delta = -event.detail;
      return delta && delta / Math.abs(delta);
    }
    var globalHandlers = {};
    var captureHandlers = {};
    var noCaptureScheme = !W3CSUPPORT;
    var flushAsap = true;
    var lastFrameStartEvent;
    var lastFrameFinishEvent;
    function startFrame(event) {
      if (flushAsap && event !== lastFrameStartEvent) {
        lastFrameStartEvent = event;
        basis.codeFrame.start();
      }
    }
    function finishFrame(event) {
      if (flushAsap && event !== lastFrameFinishEvent) {
        lastFrameFinishEvent = event;
        basis.codeFrame.finish();
      }
    }
    function observeGlobalEvents(event) {
      var handlers = arrayFrom(globalHandlers[event.type]);
      var captureHandler = captureHandlers[event.type];
      var wrappedEvent = new Event(event);
      startFrame(event);
      if (captureHandler) {
        captureHandler.handler.call(captureHandler.thisObject, wrappedEvent);
      } else {
        if (handlers) {
          for (var i = handlers.length; i-- > 0; ) {
            var handlerObject = handlers[i];
            handlerObject.handler.call(handlerObject.thisObject, wrappedEvent);
          }
        }
      }
      finishFrame(event);
    }
    function captureEvent(eventType, handler, thisObject) {
      if (captureHandlers[eventType]) releaseEvent(eventType);
      if (!handler) handler = basis.fn.$undef;
      addGlobalHandler(eventType, handler, thisObject);
      captureHandlers[eventType] = {
        handler: handler,
        thisObject: thisObject
      };
    }
    function releaseEvent(eventType) {
      var handlerObject = captureHandlers[eventType];
      if (handlerObject) {
        removeGlobalHandler(eventType, handlerObject.handler, handlerObject.thisObject);
        delete captureHandlers[eventType];
      }
    }
    function addGlobalHandler(eventType, handler, thisObject) {
      var handlers = globalHandlers[eventType];
      if (handlers) {
        for (var i = 0, item; item = handlers[i]; i++) if (item.handler === handler && item.thisObject === thisObject) return;
      } else {
        if (noCaptureScheme) addHandler(document, eventType, $null); else document.addEventListener(eventType, observeGlobalEvents, true);
        handlers = globalHandlers[eventType] = [];
      }
      handlers.push({
        handler: handler,
        thisObject: thisObject
      });
    }
    function removeGlobalHandler(eventType, handler, thisObject) {
      var handlers = globalHandlers[eventType];
      if (handlers) {
        for (var i = 0, item; item = handlers[i]; i++) {
          if (item.handler === handler && item.thisObject === thisObject) {
            handlers.splice(i, 1);
            if (!handlers.length) {
              delete globalHandlers[eventType];
              if (noCaptureScheme) removeHandler(document, eventType, $null); else document.removeEventListener(eventType, observeGlobalEvents, true);
            }
            return;
          }
        }
      }
    }
    function addHandler(node, eventType, handler, thisObject) {
      node = getNode(node);
      if (!node) throw "basis.event.addHandler: can't attach event listener to undefined";
      if (typeof handler != "function") throw "basis.event.addHandler: handler is not a function";
      var handlers = node === global ? globalEvents : node[EVENT_HOLDER];
      if (!handlers) handlers = node[EVENT_HOLDER] = {};
      var eventTypeHandlers = handlers[eventType];
      var handlerObject = {
        handler: handler,
        thisObject: thisObject
      };
      if (!eventTypeHandlers) {
        eventTypeHandlers = handlers[eventType] = [ handlerObject ];
        eventTypeHandlers.fireEvent = function(event) {
          event = wrap(event);
          if (noCaptureScheme && event && globalHandlers[eventType]) {
            if (typeof event.returnValue == "undefined") {
              observeGlobalEvents(event);
              if (event.cancelBubble === true) return;
              if (typeof event.returnValue == "undefined") event.returnValue = true;
            }
          }
          startFrame(event);
          for (var i = 0, wrappedEvent = new Event(event), item; item = eventTypeHandlers[i++]; ) item.handler.call(item.thisObject, wrappedEvent);
          finishFrame(event);
        };
        if (W3CSUPPORT) node.addEventListener(eventType, eventTypeHandlers.fireEvent, false); else node.attachEvent("on" + eventType, eventTypeHandlers.fireEvent);
      } else {
        for (var i = 0, item; item = eventTypeHandlers[i]; i++) if (item.handler === handler && item.thisObject === thisObject) return;
        eventTypeHandlers.push(handlerObject);
      }
    }
    function addHandlers(node, handlers, thisObject) {
      node = getNode(node);
      for (var eventType in handlers) addHandler(node, eventType, handlers[eventType], thisObject);
    }
    function removeHandler(node, eventType, handler, thisObject) {
      node = getNode(node);
      var handlers = node === global ? globalEvents : node[EVENT_HOLDER];
      if (handlers) {
        var eventTypeHandlers = handlers[eventType];
        if (eventTypeHandlers) {
          for (var i = 0, item; item = eventTypeHandlers[i]; i++) {
            if (item.handler === handler && item.thisObject === thisObject) {
              eventTypeHandlers.splice(i, 1);
              if (!eventTypeHandlers.length) clearHandlers(node, eventType);
              return;
            }
          }
        }
      }
    }
    function clearHandlers(node, eventType) {
      node = getNode(node);
      var handlers = node === global ? globalEvents : node[EVENT_HOLDER];
      if (handlers) {
        if (typeof eventType != "string") {
          for (eventType in handlers) clearHandlers(node, eventType);
        } else {
          var eventTypeHandlers = handlers[eventType];
          if (eventTypeHandlers) {
            if (node.removeEventListener) node.removeEventListener(eventType, eventTypeHandlers.fireEvent, false); else node.detachEvent("on" + eventType, eventTypeHandlers.fireEvent);
            delete handlers[eventType];
          }
        }
      }
    }
    function fireEvent(node, eventType, event) {
      node = getNode(node);
      var handlers = node === global ? globalEvents : node[EVENT_HOLDER];
      if (handlers && handlers[eventType]) {
        try {
          flushAsap = false;
          handlers[eventType].fireEvent(event);
        } finally {
          flushAsap = true;
        }
      }
    }
    function onUnload(handler, thisObject) {
      basis.dev.warn("basis.dom.event.onUnload() is deprecated, use basis.teardown() instead");
      basis.teardown(handler, thisObject);
    }
    var tagNameEventMap = {};
    function getEventInfo(eventName, tagName) {
      if (!tagName) tagName = "div";
      var id = tagName + "-" + eventName;
      if (tagNameEventMap[id]) return tagNameEventMap[id]; else {
        var supported = false;
        var bubble = false;
        if (!W3CSUPPORT) {
          var onevent = "on" + eventName;
          var host = document.createElement("div");
          var target = host.appendChild(document.createElement(tagName));
          host[onevent] = function() {
            bubble = true;
          };
          try {
            target.fireEvent(onevent);
            supported = true;
          } catch (e) {}
        }
        return tagNameEventMap[id] = {
          supported: supported,
          bubble: bubble
        };
      }
    }
    function wrapEventFunction(fn) {
      return function(event, arg) {
        return fn(wrap(event), arg);
      };
    }
    module.exports = {
      W3CSUPPORT: W3CSUPPORT,
      browserEvents: browserEvents,
      getEventInfo: getEventInfo,
      KEY: KEY,
      MOUSE_LEFT: MOUSE_LEFT,
      MOUSE_RIGHT: MOUSE_RIGHT,
      MOUSE_MIDDLE: MOUSE_MIDDLE,
      Event: Event,
      sender: wrapEventFunction(sender),
      cancelBubble: wrapEventFunction(cancelBubble),
      cancelDefault: wrapEventFunction(cancelDefault),
      kill: wrapEventFunction(kill),
      key: wrapEventFunction(key),
      charCode: wrapEventFunction(charCode),
      mouseButton: wrapEventFunction(mouseButton),
      mouseX: wrapEventFunction(mouseX),
      mouseY: wrapEventFunction(mouseY),
      wheelDelta: wrapEventFunction(wheelDelta),
      addGlobalHandler: addGlobalHandler,
      removeGlobalHandler: removeGlobalHandler,
      captureEvent: captureEvent,
      releaseEvent: releaseEvent,
      addHandler: addHandler,
      addHandlers: addHandlers,
      removeHandler: removeHandler,
      clearHandlers: clearHandlers,
      fireEvent: fireEvent,
      onUnload: onUnload,
      wrap: wrap
    };
  },
  "d.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var Class = basis.Class;
    var complete = basis.object.complete;
    var arrayFrom = basis.array;
    var arrayRemove = basis.array.remove;
    var $undef = basis.fn.$undef;
    var getter = basis.getter;
    var nullGetter = basis.fn.nullGetter;
    var basisEvent = basis.require("./2.js");
    var createEvent = basisEvent.create;
    var events = basisEvent.events;
    var basisData = basis.require("./e.js");
    var resolveValue = basisData.resolveValue;
    var resolveDataset = basisData.resolveDataset;
    var createResolveFunction = basisData.createResolveFunction;
    var SUBSCRIPTION = basisData.SUBSCRIPTION;
    var STATE = basisData.STATE;
    var DataObject = basisData.Object;
    var ReadOnlyDataset = basisData.ReadOnlyDataset;
    var Dataset = basisData.Dataset;
    var EXCEPTION_CANT_INSERT = namespace + ": Node can't be inserted at specified point in hierarchy";
    var EXCEPTION_NODE_NOT_FOUND = namespace + ": Node was not found";
    var EXCEPTION_BAD_CHILD_CLASS = namespace + ": Child node has wrong class";
    var EXCEPTION_NULL_CHILD = namespace + ": Child node is null";
    var EXCEPTION_DATASOURCE_CONFLICT = namespace + ": Operation is not allowed because node is under dataSource control";
    var EXCEPTION_DATASOURCEADAPTER_CONFLICT = namespace + ": Operation is not allowed because node is under dataSource adapter control";
    var EXCEPTION_PARENTNODE_OWNER_CONFLICT = namespace + ": Node can't has owner and parentNode";
    var EXCEPTION_NO_CHILDCLASS = namespace + ": Node can't has children and dataSource as childClass isn't specified";
    var AUTO = "__auto__";
    var DELEGATE = {
      ANY: true,
      NONE: false,
      PARENT: "parent",
      OWNER: "owner"
    };
    var childNodesDatasetMap = {};
    function warnOnDataSourceItemNodeDestoy() {
      basis.dev.warn(namespace + ": node can't be destroyed as representing dataSource item, destroy delegate item or remove it from dataSource first");
    }
    function warnOnAutoSatelliteOwnerChange() {
      basis.dev.warn(namespace + ": satellite can't change owner as it auto-satellite");
    }
    function warnOnAutoSatelliteDestoy() {
      basis.dev.warn(namespace + ": satellite can't be destroyed as it auto-create satellite, and could be destroyed on owner destroy");
    }
    function lockDataSourceItemNode(node) {
      node.setDelegate = basis.fn.$undef;
      node.destroy = warnOnDataSourceItemNodeDestoy;
    }
    function unlockDataSourceItemNode(node) {
      var proto = node.constructor.prototype;
      node.setDelegate = proto.setDelegate;
      node.destroy = proto.destroy;
    }
    function getSortingValue(node) {
      return node.sortingValue;
    }
    function sortAsc(a, b) {
      a = a.sortingValue || 0;
      b = b.sortingValue || 0;
      return +(a > b) || -(a < b);
    }
    function sortDesc(a, b) {
      a = a.sortingValue || 0;
      b = b.sortingValue || 0;
      return -(a > b) || +(a < b);
    }
    function sortChildNodes(obj) {
      return obj.childNodes.sort(obj.sortingDesc ? sortDesc : sortAsc);
    }
    function binarySearchPos(array, value, valueGetter, desc) {
      if (!array.length) return 0;
      desc = !!desc;
      var l = 0;
      var r = array.length - 1;
      var valueType = typeof value;
      var compareValue;
      var compareValueType;
      var pos;
      do {
        pos = l + r >> 1;
        compareValue = valueGetter(array[pos]);
        compareValueType = typeof compareValue;
        if (desc) {
          if (valueType > compareValueType || value > compareValue) {
            r = pos - 1;
            continue;
          }
          if (valueType < compareValueType || value < compareValue) {
            l = pos + 1;
            continue;
          }
        } else {
          if (valueType < compareValueType || value < compareValue) {
            r = pos - 1;
            continue;
          }
          if (valueType > compareValueType || value > compareValue) {
            l = pos + 1;
            continue;
          }
        }
        return value == compareValue ? pos : 0;
      } while (l <= r);
      return pos + ((compareValueType < valueType || compareValue < value) ^ desc);
    }
    function updateNodeContextSelection(root, oldSelection, newSelection, rootUpdate, ignoreRootSelection) {
      if (oldSelection === newSelection) return;
      var nextNode;
      var cursor = root;
      var selected = [];
      if (rootUpdate) {
        root.contextSelection = newSelection;
        if (root.selected && !root.selectedRA_) selected.push(root);
      }
      while (cursor) {
        nextNode = !cursor.selection || ignoreRootSelection && cursor === root ? cursor.firstChild : null;
        if (nextNode && nextNode.contextSelection !== oldSelection) throw "Try change wrong context selection";
        while (!nextNode) {
          if (cursor === root) {
            if (selected.length) {
              if (oldSelection) oldSelection.remove(selected);
              if (newSelection) {
                newSelection.add(selected);
                for (var i = 0; i < selected.length; i++) {
                  var node = selected[i];
                  if (node.selected && !newSelection.has(node)) {
                    node.selected = false;
                    node.emit_unselect();
                  }
                }
              }
            }
            return;
          }
          nextNode = cursor.nextSibling;
          if (!nextNode) cursor = cursor.parentNode;
        }
        cursor = nextNode;
        if (cursor.selected && !cursor.selectedRA_) selected.push(cursor);
        cursor.contextSelection = newSelection;
      }
    }
    function updateNodeDisableContext(node, disabled) {
      if (node.contextDisabled != disabled) {
        node.contextDisabled = disabled;
        if (node.disabled) return;
        if (disabled) node.emit_disable(); else node.emit_enable();
      }
    }
    SUBSCRIPTION.addProperty("owner");
    SUBSCRIPTION.addProperty("dataSource");
    SUBSCRIPTION.add("CHILD", {
      childNodesModified: function(object, delta) {
        var array;
        if (array = delta.inserted) for (var i = 0, item; item = array[i]; i++) SUBSCRIPTION.link("child", object, array[i]);
        if (array = delta.deleted) for (var i = 0, item; item = array[i]; i++) SUBSCRIPTION.unlink("child", object, array[i]);
      }
    }, function(action, object) {
      var childNodes = object.childNodes || [];
      for (var i = 0, child; child = childNodes[i]; i++) action("child", object, child);
    });
    SUBSCRIPTION.add("SATELLITE", {
      satelliteChanged: function(object, name, oldSatellite) {
        if (oldSatellite) SUBSCRIPTION.unlink("satellite", object, oldSatellite);
        if (object.satellite[name]) SUBSCRIPTION.link("satellite", object, object.satellite[name]);
      }
    }, function(action, object) {
      var satellites = object.satellite;
      if (satellites !== NULL_SATELLITE) for (var name in satellites) if (name !== AUTO) action("satellite", object, satellites[name]);
    });
    function processInstanceClass(InstanceClass) {
      if (!InstanceClass.isSubclassOf(AbstractNode)) {
        basis.dev.warn(namespace + ": Bad class for instance, should be subclass of basis.dom.wrapper.AbstractNode");
        return AbstractNode;
      }
      return InstanceClass;
    }
    function processSatelliteConfig(satelliteConfig) {
      if (!satelliteConfig) return null;
      if (satelliteConfig.isSatelliteConfig) return satelliteConfig;
      if (satelliteConfig instanceof AbstractNode) return satelliteConfig;
      if (satelliteConfig.constructor !== Object) satelliteConfig = {
        instance: satelliteConfig
      };
      var handlerRequired = false;
      var events = "update";
      var config = {
        isSatelliteConfig: true
      };
      for (var key in satelliteConfig) {
        var value = satelliteConfig[key];
        switch (key) {
          case "instance":
            if (value instanceof AbstractNode) {
              config.instance = value;
            } else {
              if (Class.isClass(value)) config.instanceClass = processInstanceClass(value); else {
                if (typeof value == "string") value = basis.getter(value);
                config.getInstance = value;
              }
            }
            break;
          case "instanceOf":
          case "satelliteClass":
            if (key == "instanceOf") {
              basis.dev.warn(namespace + ": `instanceOf` in satellite config is deprecated, use `instance` instead");
              if ("satelliteClass" in satelliteConfig) {
                basis.dev.warn(namespace + ": `instanceOf` in satellite config has been ignored, as `satelliteClass` is specified");
                break;
              }
            }
            if ("instance" in satelliteConfig) {
              basis.dev.warn(namespace + ": `" + key + "` in satellite config has been ignored, as `instance` is specified");
              break;
            }
            if (Class.isClass(value)) {
              basis.dev.warn(namespace + ": `satelliteClass` in satellite config is deprecated, use `instance` instead");
              config.instanceClass = processInstanceClass(value);
            } else basis.dev.warn(namespace + ": bad value for `" + key + "` in satellite config, value should be a subclass of basis.dom.wrapper.AbstractNode");
            break;
          case "existsIf":
          case "delegate":
          case "dataSource":
            if (value) {
              if (typeof value == "string") value = getter(value);
              if (typeof value != "function") value = basis.fn.$const(value); else handlerRequired = true;
            }
            config[key] = value;
            break;
          case "config":
            if (typeof value == "string") value = getter(value);
            config.config = value;
            break;
          case "events":
            events = satelliteConfig.events;
            break;
          default:
            basis.dev.warn("Unknown satellite config option – " + key);
        }
      }
      if (!config.instance && !config.getInstance && !config.instanceClass) config.instanceClass = processInstanceClass(AbstractNode);
      if (handlerRequired) {
        if (Array.isArray(events)) events = events.join(" ");
        if (typeof events == "string") {
          var handler = {};
          events = events.split(/\s+/);
          for (var i = 0, eventName; eventName = events[i]; i++) {
            handler[eventName] = SATELLITE_UPDATE;
            config.handler = handler;
          }
        }
      }
      return config;
    }
    function applySatellites(node, satellites) {
      for (var name in satellites) if (satellites[name] && typeof satellites[name] == "object") node.setSatellite(name, satellites[name]);
    }
    var NULL_SATELLITE = Class.customExtendProperty({}, function(result, extend) {
      for (var name in extend) result[name] = processSatelliteConfig(extend[name]);
    });
    var SATELLITE_UPDATE = function() {
      var name = this.name;
      var config = this.config;
      var owner = this.owner;
      var exists = "existsIf" in config == false || config.existsIf(owner);
      if (resolveValue(this, SATELLITE_UPDATE, exists, "existsRA_")) {
        var satellite = this.instance || config.instance;
        if (!satellite || this.factoryType == "value") {
          if (!this.factoryType) {
            var instanceValue = config.getInstance;
            var instanceClass = config.instanceClass;
            if (typeof instanceValue == "function") {
              instanceValue = instanceValue.call(owner, owner);
              if (Class.isClass(instanceValue)) instanceClass = processInstanceClass(instanceValue);
            }
            this.factoryType = instanceClass ? "class" : "value";
            this.factory = instanceClass || instanceValue;
          }
          if (this.factoryType == "class") {
            var satelliteConfig = {
              destroy: warnOnAutoSatelliteDestoy
            };
            if (config.delegate) {
              satelliteConfig.autoDelegate = false;
              satelliteConfig.delegate = config.delegate(owner);
            }
            if (config.dataSource) satelliteConfig.dataSource = config.dataSource(owner);
            if (config.config) basis.object.complete(satelliteConfig, typeof config.config == "function" ? config.config(owner) : config.config);
            this.instance = new this.factory(satelliteConfig);
            owner.setSatellite(name, this.instance, true);
            return;
          }
          satellite = resolveAbstractNode(this, SATELLITE_UPDATE, this.factory, "instanceRA_");
        }
        if (this.instance !== satellite) {
          this.instance = satellite || null;
          owner.setSatellite(name, this.instance, true);
        }
        if (satellite && satellite.owner === owner) {
          if (config.delegate) satellite.setDelegate(config.delegate(owner));
          if (config.dataSource) satellite.setDataSource(config.dataSource(owner));
        }
      } else {
        var satellite = this.instance;
        if (satellite) {
          if (config.instance) {
            if (config.delegate) satellite.setDelegate();
            if (config.dataSource) satellite.setDataSource();
          }
          this.instance = null;
          owner.setSatellite(name, null, true);
        }
      }
    };
    var AUTO_SATELLITE_INSTANCE_HANDLER = {
      destroy: function() {
        if (!this.instanceRA_) this.owner.setSatellite(this.name, null);
      }
    };
    var AbstractNode = Class(DataObject, {
      className: namespace + ".AbstractNode",
      subscribeTo: DataObject.prototype.subscribeTo + SUBSCRIPTION.DATASOURCE + SUBSCRIPTION.SATELLITE,
      isSyncRequired: function() {
        return this.state == STATE.UNDEFINED || this.state == STATE.DEPRECATED;
      },
      syncEvents: {
        activeChanged: false
      },
      emit_update: function(delta) {
        DataObject.prototype.emit_update.call(this, delta);
        var parentNode = this.parentNode;
        if (parentNode) {
          if (parentNode.matchFunction) this.match(parentNode.matchFunction);
          parentNode.insertBefore(this, this.nextSibling);
        }
      },
      listen: {
        owner: {
          destroy: function() {
            if (!this.ownerSatelliteName) this.setOwner();
          }
        }
      },
      autoDelegate: DELEGATE.NONE,
      name: null,
      childNodes: null,
      emit_childNodesModified: createEvent("childNodesModified", "delta") && function(delta) {
        events.childNodesModified.call(this, delta);
        var listen = this.listen.childNode;
        var array;
        if (listen) {
          if (array = delta.inserted) for (var i = 0, child; child = array[i]; i++) child.addHandler(listen, this);
          if (array = delta.deleted) for (var i = 0, child; child = array[i]; i++) child.removeHandler(listen, this);
        }
      },
      childNodesState: STATE.UNDEFINED,
      emit_childNodesStateChanged: createEvent("childNodesStateChanged", "oldState"),
      childClass: AbstractNode,
      dataSource: null,
      emit_dataSourceChanged: createEvent("dataSourceChanged", "oldDataSource"),
      dataSourceRA_: null,
      dataSourceMap_: null,
      destroyDataSourceMember: true,
      parentNode: null,
      emit_parentChanged: createEvent("parentChanged", "oldParentNode"),
      nextSibling: null,
      previousSibling: null,
      firstChild: null,
      lastChild: null,
      sorting: nullGetter,
      sortingDesc: false,
      emit_sortingChanged: createEvent("sortingChanged", "oldSorting", "oldSortingDesc"),
      groupingClass: null,
      grouping: null,
      emit_groupingChanged: createEvent("groupingChanged", "oldGrouping"),
      groupNode: null,
      groupId: NaN,
      satellite: NULL_SATELLITE,
      ownerSatelliteName: null,
      emit_satelliteChanged: createEvent("satelliteChanged", "name", "oldSatellite"),
      owner: null,
      emit_ownerChanged: createEvent("ownerChanged", "oldOwner"),
      init: function() {
        DataObject.prototype.init.call(this);
        var childNodes = this.childNodes;
        var dataSource = this.dataSource;
        if (childNodes) this.childNodes = null;
        if (dataSource) this.dataSource = null;
        var grouping = this.grouping;
        if (grouping) {
          this.grouping = null;
          this.setGrouping(grouping);
        }
        if (this.childClass) {
          this.childNodes = [];
          if (dataSource) {
            this.setDataSource(dataSource);
          } else {
            if (childNodes) this.setChildNodes(childNodes);
          }
        }
        var satellites = this.satellite;
        if (satellites !== NULL_SATELLITE) {
          this.satellite = NULL_SATELLITE;
          applySatellites(this, satellites);
        }
        var owner = this.owner;
        if (owner) {
          this.owner = null;
          this.setOwner(owner);
        }
      },
      setChildNodesState: function(state, data) {
        var stateCode = String(state);
        var oldState = this.childNodesState;
        if (!STATE.values[stateCode]) throw new Error("Wrong state value");
        if (oldState != stateCode || oldState.data != data) {
          this.childNodesState = Object(stateCode);
          this.childNodesState.data = data;
          this.emit_childNodesStateChanged(oldState);
        }
      },
      appendChild: function(newChild) {},
      insertBefore: function(newChild, refChild) {},
      removeChild: function(oldChild) {},
      replaceChild: function(newChild, oldChild) {},
      clear: function(alive) {},
      setChildNodes: function(nodes) {},
      setGrouping: function(grouping, alive) {},
      setSorting: function(sorting, desc) {},
      setDataSource: function(dataSource) {},
      setOwner: function(owner) {
        if (!owner || owner instanceof AbstractNode == false) owner = null;
        if (owner && this.parentNode) throw EXCEPTION_PARENTNODE_OWNER_CONFLICT;
        var oldOwner = this.owner;
        if (oldOwner !== owner) {
          var listenHandler = this.listen.owner;
          if (oldOwner) {
            if (this.ownerSatelliteName && oldOwner.satellite[AUTO] && this.ownerSatelliteName in oldOwner.satellite[AUTO]) {
              basis.dev.warn(namespace + ": auto-satellite can't change it's owner");
              return;
            }
            if (listenHandler) oldOwner.removeHandler(listenHandler, this);
            if (this.ownerSatelliteName) {
              this.owner = null;
              oldOwner.setSatellite(this.ownerSatelliteName, null);
            }
          }
          if (owner && listenHandler) owner.addHandler(listenHandler, this);
          this.owner = owner;
          this.emit_ownerChanged(oldOwner);
          if (this.autoDelegate == DELEGATE.OWNER || this.autoDelegate === DELEGATE.ANY) this.setDelegate(owner);
        }
      },
      setSatellite: function(name, satellite, autoSet) {
        var oldSatellite = this.satellite[name] || null;
        var auto = this.satellite[AUTO];
        var autoConfig = auto && auto[name];
        var preserveAuto = autoSet && autoConfig;
        if (preserveAuto) {
          satellite = autoConfig.instance;
          if (satellite && autoConfig.config.instance) delete autoConfig.config.instance.setOwner;
        } else {
          satellite = processSatelliteConfig(satellite);
          if (satellite && satellite.owner === this && auto && satellite.ownerSatelliteName && auto[satellite.ownerSatelliteName]) {
            basis.dev.warn(namespace + ": auto-create satellite can't change name inside owner");
            return;
          }
          if (autoConfig) {
            delete auto[name];
            if (autoConfig.config.instance) autoConfig.config.instance.removeHandler(AUTO_SATELLITE_INSTANCE_HANDLER, autoConfig);
            if (autoConfig.config.handler) this.removeHandler(autoConfig.config.handler, autoConfig);
          }
        }
        if (oldSatellite !== satellite) {
          var satelliteListen = this.listen.satellite;
          var satellitePersonalListen = this.listen["satellite:" + name];
          var destroySatellite;
          if (oldSatellite) {
            delete this.satellite[name];
            oldSatellite.ownerSatelliteName = null;
            if (autoConfig && oldSatellite.destroy === warnOnAutoSatelliteDestoy) {
              destroySatellite = oldSatellite;
            } else {
              if (satelliteListen) oldSatellite.removeHandler(satelliteListen, this);
              if (satellitePersonalListen) oldSatellite.removeHandler(satellitePersonalListen, this);
              oldSatellite.setOwner(null);
            }
            if (preserveAuto && !satellite && autoConfig.config.instance) autoConfig.config.instance.setOwner = warnOnAutoSatelliteOwnerChange;
          }
          if (satellite) {
            if (satellite instanceof AbstractNode == false) {
              var autoConfig = {
                owner: this,
                name: name,
                config: satellite,
                factoryType: null,
                factory: null,
                instance: null,
                instanceRA_: null,
                existsRA_: null
              };
              if (satellite.handler) this.addHandler(satellite.handler, autoConfig);
              if (satellite.instance) {
                satellite.instance.addHandler(AUTO_SATELLITE_INSTANCE_HANDLER, autoConfig);
                satellite.instance.setOwner = warnOnAutoSatelliteOwnerChange;
              }
              if (!auto) {
                if (this.satellite === NULL_SATELLITE) this.satellite = {};
                auto = this.satellite[AUTO] = {};
              }
              auto[name] = autoConfig;
              SATELLITE_UPDATE.call(autoConfig, this);
              if (!autoConfig.instance && oldSatellite) this.emit_satelliteChanged(name, oldSatellite);
              if (destroySatellite) {
                delete destroySatellite.destroy;
                destroySatellite.destroy();
              }
              return;
            }
            if (satellite.owner !== this) {
              if (autoConfig && autoConfig.config.delegate) {
                var autoDelegate = satellite.autoDelegate;
                satellite.autoDelegate = false;
                satellite.setOwner(this);
                satellite.autoDelegate = autoDelegate;
              } else satellite.setOwner(this);
              if (satellite.owner !== this) {
                this.setSatellite(name, null);
                return;
              }
              if (satelliteListen) satellite.addHandler(satelliteListen, this);
              if (satellitePersonalListen) satellite.addHandler(satellitePersonalListen, this);
            } else {
              if (satellite.ownerSatelliteName) {
                delete this.satellite[satellite.ownerSatelliteName];
                this.emit_satelliteChanged(satellite.ownerSatelliteName, satellite);
              }
            }
            if (this.satellite == NULL_SATELLITE) this.satellite = {};
            this.satellite[name] = satellite;
            satellite.ownerSatelliteName = name;
          }
          this.emit_satelliteChanged(name, oldSatellite);
          if (destroySatellite) {
            delete destroySatellite.destroy;
            destroySatellite.destroy();
          }
        }
      },
      getChildNodesDataset: function() {
        return childNodesDatasetMap[this.basisObjectId] || new ChildNodesDataset({
          sourceNode: this
        });
      },
      destroy: function() {
        DataObject.prototype.destroy.call(this);
        if (this.dataSource || this.dataSourceRA_) {
          this.setDataSource();
        } else {
          if (this.firstChild) this.clear();
        }
        if (this.parentNode) this.parentNode.removeChild(this);
        if (this.grouping) {
          this.grouping.setOwner();
          this.grouping = null;
        }
        if (this.owner) this.setOwner();
        var satellites = this.satellite;
        if (satellites !== NULL_SATELLITE) {
          var auto = satellites[AUTO];
          delete satellites[AUTO];
          for (var name in auto) {
            if (auto[name].config.instance && !auto[name].instance) auto[name].config.instance.destroy();
            if (auto[name].existsRA_) resolveValue(auto[name], null, null, "existsRA_");
            if (auto[name].instanceRA_) resolveValue(auto[name], null, null, "instanceRA_");
          }
          for (var name in satellites) {
            var satellite = satellites[name];
            satellite.owner = null;
            satellite.ownerSatelliteName = null;
            if (satellite.destroy === warnOnAutoSatelliteDestoy) delete satellite.destroy;
            satellite.destroy();
          }
          this.satellite = null;
        }
        this.childNodes = null;
      }
    });
    var resolveAbstractNode = createResolveFunction(AbstractNode);
    var PartitionNode = Class(AbstractNode, {
      className: namespace + ".PartitionNode",
      autoDestroyIfEmpty: false,
      nodes: null,
      first: null,
      last: null,
      init: function() {
        this.nodes = [];
        AbstractNode.prototype.init.call(this);
      },
      insert: function(newNode, refNode) {
        var nodes = this.nodes;
        var pos = refNode ? nodes.indexOf(refNode) : -1;
        if (pos == -1) {
          nodes.push(newNode);
          this.last = newNode;
        } else nodes.splice(pos, 0, newNode);
        this.first = nodes[0];
        newNode.groupNode = this;
        this.emit_childNodesModified({
          inserted: [ newNode ]
        });
      },
      remove: function(oldNode) {
        var nodes = this.nodes;
        if (arrayRemove(nodes, oldNode)) {
          this.first = nodes[0] || null;
          this.last = nodes[nodes.length - 1] || null;
          oldNode.groupNode = null;
          this.emit_childNodesModified({
            deleted: [ oldNode ]
          });
        }
        if (!this.first && this.autoDestroyIfEmpty) this.destroy();
      },
      clear: function() {
        if (!this.first) return;
        var nodes = this.nodes;
        for (var i = nodes.length; i-- > 0; ) nodes[i].groupNode = null;
        this.nodes = [];
        this.first = null;
        this.last = null;
        this.emit_childNodesModified({
          deleted: nodes
        });
        if (this.autoDestroyIfEmpty) this.destroy();
      },
      destroy: function() {
        AbstractNode.prototype.destroy.call(this);
        this.nodes = null;
        this.first = null;
        this.last = null;
      }
    });
    var DOMMIXIN_DATASOURCE_HANDLER = {
      itemsChanged: function(dataSource, delta) {
        var newDelta = {};
        var deleted = [];
        if (delta.deleted) {
          newDelta.deleted = deleted;
          if (this.childNodes.length == delta.deleted.length) {
            deleted = arrayFrom(this.childNodes);
            for (var i = 0, child; child = deleted[i]; i++) unlockDataSourceItemNode(child);
            this.dataSourceMap_ = null;
            this.clear(true);
            this.dataSourceMap_ = {};
          } else {
            for (var i = 0, item; item = delta.deleted[i]; i++) {
              var delegateId = item.basisObjectId;
              var oldChild = this.dataSourceMap_[delegateId];
              unlockDataSourceItemNode(oldChild);
              delete this.dataSourceMap_[delegateId];
              this.removeChild(oldChild);
              deleted.push(oldChild);
            }
          }
        }
        if (delta.inserted) {
          newDelta.inserted = [];
          for (var i = 0, item; item = delta.inserted[i]; i++) {
            var newChild = createChildByFactory(this, {
              delegate: item
            });
            lockDataSourceItemNode(newChild);
            this.dataSourceMap_[item.basisObjectId] = newChild;
            newDelta.inserted.push(newChild);
            if (this.firstChild) this.insertBefore(newChild);
          }
        }
        if (!this.firstChild) this.setChildNodes(newDelta.inserted); else this.emit_childNodesModified(newDelta);
        if (this.destroyDataSourceMember && deleted.length) for (var i = 0, item; item = deleted[i]; i++) item.destroy();
      },
      stateChanged: function(dataSource) {
        this.setChildNodesState(dataSource.state, dataSource.state.data);
      },
      destroy: function() {
        if (!this.dataSourceRA_) this.setDataSource();
      }
    };
    function fastChildNodesOrder(node, order) {
      var lastIndex = order.length - 1;
      node.childNodes = order;
      node.firstChild = order[0] || null;
      node.lastChild = order[lastIndex] || null;
      for (var orderNode, i = lastIndex; orderNode = order[i]; i--) {
        orderNode.nextSibling = order[i + 1] || null;
        orderNode.previousSibling = order[i - 1] || null;
        node.insertBefore(orderNode, orderNode.nextSibling);
      }
    }
    function fastChildNodesGroupOrder(node, order) {
      for (var i = 0, child; child = order[i]; i++) child.groupNode.nodes.push(child);
      var groups = [ node.grouping.nullGroup ].concat(node.grouping.childNodes);
      var result = [];
      for (var i = 0, group; group = groups[i]; i++) {
        var nodes = group.nodes;
        group.first = nodes[0] || null;
        group.last = nodes[nodes.length - 1] || null;
        result.push.apply(result, nodes);
        group.emit_childNodesModified({
          inserted: nodes
        });
      }
      return result;
    }
    function createChildByFactory(node, config) {
      var child;
      if (typeof node.childFactory == "function") {
        child = node.childFactory(config);
        if (child instanceof node.childClass) return child;
      }
      if (!child) throw EXCEPTION_NULL_CHILD;
      basis.dev.warn(EXCEPTION_BAD_CHILD_CLASS + " (expected " + (node.childClass && node.childClass.className) + " but " + (child && child.constructor && child.constructor.className) + ")");
      throw EXCEPTION_BAD_CHILD_CLASS;
    }
    var DomMixin = {
      childClass: AbstractNode,
      childFactory: null,
      listen: {
        dataSource: DOMMIXIN_DATASOURCE_HANDLER
      },
      getChild: function(value, getter) {
        return basis.array.search(this.childNodes, value, getter);
      },
      getChildByName: function(name) {
        return this.getChild(name, "name");
      },
      appendChild: function(newChild) {
        return this.insertBefore(newChild);
      },
      insertBefore: function(newChild, refChild) {
        if (!this.childClass) throw EXCEPTION_NO_CHILDCLASS;
        if (newChild.firstChild) {
          var cursor = this;
          while (cursor = cursor.parentNode) {
            if (cursor === newChild) throw EXCEPTION_CANT_INSERT;
          }
        }
        var isChildClassInstance = newChild && newChild instanceof this.childClass;
        if (this.dataSource) {
          if (!isChildClassInstance || !newChild.delegate || this.dataSourceMap_[newChild.delegate.basisObjectId] !== newChild) throw EXCEPTION_DATASOURCE_CONFLICT;
        } else {
          if (this.dataSourceRA_) throw EXCEPTION_DATASOURCEADAPTER_CONFLICT;
        }
        if (!isChildClassInstance) newChild = createChildByFactory(this, newChild instanceof DataObject ? {
          delegate: newChild
        } : newChild);
        if (newChild.owner) throw EXCEPTION_PARENTNODE_OWNER_CONFLICT;
        var isInside = newChild.parentNode === this;
        var childNodes = this.childNodes;
        var grouping = this.grouping;
        var groupNodes;
        var currentNewChildGroup = newChild.groupNode;
        var group = null;
        var sorting = this.sorting;
        var sortingDesc;
        var correctSortPos = false;
        var newChildValue;
        var pos = -1;
        var nextSibling;
        var prevSibling;
        if (isInside) {
          nextSibling = newChild.nextSibling;
          prevSibling = newChild.previousSibling;
        }
        if (sorting !== nullGetter) {
          refChild = null;
          sortingDesc = this.sortingDesc;
          newChildValue = sorting(newChild);
          if (newChildValue == null) newChildValue = -Infinity; else if (typeof newChildValue != "number" || newChildValue !== newChildValue) newChildValue = String(newChildValue);
          if (isInside) {
            if (newChildValue === newChild.sortingValue) {
              correctSortPos = true;
            } else {
              if (sortingDesc) {
                correctSortPos = (!nextSibling || typeof nextSibling.sortingValue <= typeof newChildValue && nextSibling.sortingValue <= newChildValue) && (!prevSibling || typeof prevSibling.sortingValue >= typeof newChildValue && prevSibling.sortingValue >= newChildValue);
              } else {
                correctSortPos = (!nextSibling || typeof nextSibling.sortingValue >= typeof newChildValue && nextSibling.sortingValue >= newChildValue) && (!prevSibling || typeof prevSibling.sortingValue <= typeof newChildValue && prevSibling.sortingValue <= newChildValue);
              }
              if (correctSortPos) newChild.sortingValue = newChildValue;
            }
          }
        }
        if (grouping) {
          var cursor;
          group = grouping.getGroupNode(newChild, true);
          groupNodes = group.nodes;
          if (currentNewChildGroup === group) if (correctSortPos || sorting === nullGetter && nextSibling === refChild) return newChild;
          if (sorting !== nullGetter) {
            if (currentNewChildGroup === group && correctSortPos) {
              if (nextSibling && nextSibling.groupNode === group) pos = groupNodes.indexOf(nextSibling); else pos = groupNodes.length;
            } else {
              pos = binarySearchPos(groupNodes, newChildValue, getSortingValue, sortingDesc);
              newChild.sortingValue = newChildValue;
            }
          } else {
            if (refChild && refChild.groupNode === group) pos = groupNodes.indexOf(refChild); else pos = groupNodes.length;
          }
          if (pos < groupNodes.length) {
            refChild = groupNodes[pos];
          } else {
            if (group.last) {
              refChild = group.last.nextSibling;
            } else {
              cursor = group;
              refChild = null;
              while (cursor = cursor.nextSibling) if (refChild = cursor.first) break;
            }
          }
          if (newChild === refChild || isInside && nextSibling === refChild) {
            if (currentNewChildGroup !== group) {
              if (currentNewChildGroup) currentNewChildGroup.remove(newChild);
              group.insert(newChild, refChild);
            }
            return newChild;
          }
          pos = -1;
        } else {
          if (sorting !== nullGetter) {
            if (correctSortPos) return newChild;
            pos = binarySearchPos(childNodes, newChildValue, getSortingValue, sortingDesc, this.lll);
            refChild = childNodes[pos];
            newChild.sortingValue = newChildValue;
            if (newChild === refChild || isInside && nextSibling === refChild) return newChild;
          } else {
            if (refChild && refChild.parentNode !== this) throw EXCEPTION_NODE_NOT_FOUND;
            if (isInside) {
              if (nextSibling === refChild) return newChild;
              if (newChild === refChild) throw EXCEPTION_CANT_INSERT;
            }
          }
        }
        if (isInside) {
          if (nextSibling) {
            nextSibling.previousSibling = prevSibling;
            newChild.nextSibling = null;
          } else this.lastChild = prevSibling;
          if (prevSibling) {
            prevSibling.nextSibling = nextSibling;
            newChild.previousSibling = null;
          } else this.firstChild = nextSibling;
          if (pos == -1) arrayRemove(childNodes, newChild); else {
            var oldPos = childNodes.indexOf(newChild);
            childNodes.splice(oldPos, 1);
            pos -= oldPos < pos;
          }
          if (currentNewChildGroup) {
            currentNewChildGroup.remove(newChild);
            currentNewChildGroup = null;
          }
        } else {
          if (newChild.parentNode) newChild.parentNode.removeChild(newChild);
        }
        if (currentNewChildGroup != group) group.insert(newChild, refChild);
        if (refChild) {
          if (pos == -1) pos = childNodes.indexOf(refChild);
          if (pos == -1) throw EXCEPTION_NODE_NOT_FOUND;
          newChild.nextSibling = refChild;
          childNodes.splice(pos, 0, newChild);
        } else {
          pos = childNodes.length;
          childNodes.push(newChild);
          refChild = {
            previousSibling: this.lastChild
          };
          this.lastChild = newChild;
        }
        newChild.parentNode = this;
        newChild.previousSibling = refChild.previousSibling;
        if (pos == 0) this.firstChild = newChild; else refChild.previousSibling.nextSibling = newChild;
        refChild.previousSibling = newChild;
        if (!isInside) {
          updateNodeContextSelection(newChild, newChild.contextSelection, this.selection || this.contextSelection, true);
          updateNodeDisableContext(newChild, this.disabled || this.contextDisabled);
          if ((newChild.underMatch_ || this.matchFunction) && newChild.match) newChild.match(this.matchFunction);
          if (newChild.autoDelegate == DELEGATE.PARENT || newChild.autoDelegate === DELEGATE.ANY) newChild.setDelegate(this);
          newChild.emit_parentChanged(null);
          if (!this.dataSource) this.emit_childNodesModified({
            inserted: [ newChild ]
          });
          if (newChild.listen.parentNode) this.addHandler(newChild.listen.parentNode, newChild);
        }
        return newChild;
      },
      removeChild: function(oldChild) {
        if (!oldChild || oldChild.parentNode !== this) throw EXCEPTION_NODE_NOT_FOUND;
        if (oldChild instanceof this.childClass == false) throw EXCEPTION_BAD_CHILD_CLASS;
        if (this.dataSource) {
          if (this.dataSource.has(oldChild.delegate)) throw EXCEPTION_DATASOURCE_CONFLICT;
        } else {
          if (this.dataSourceRA_) throw EXCEPTION_DATASOURCEADAPTER_CONFLICT;
        }
        var pos = this.childNodes.indexOf(oldChild);
        if (pos == -1) throw EXCEPTION_NODE_NOT_FOUND;
        this.childNodes.splice(pos, 1);
        oldChild.parentNode = null;
        if (oldChild.nextSibling) oldChild.nextSibling.previousSibling = oldChild.previousSibling; else this.lastChild = oldChild.previousSibling;
        if (oldChild.previousSibling) oldChild.previousSibling.nextSibling = oldChild.nextSibling; else this.firstChild = oldChild.nextSibling;
        oldChild.nextSibling = null;
        oldChild.previousSibling = null;
        if (oldChild.listen.parentNode) this.removeHandler(oldChild.listen.parentNode, oldChild);
        updateNodeContextSelection(oldChild, oldChild.contextSelection, null, true);
        if (oldChild.groupNode) oldChild.groupNode.remove(oldChild);
        oldChild.emit_parentChanged(this);
        if (!this.dataSource) this.emit_childNodesModified({
          deleted: [ oldChild ]
        });
        if (oldChild.autoDelegate == DELEGATE.PARENT || oldChild.autoDelegate === DELEGATE.ANY) oldChild.setDelegate();
        return oldChild;
      },
      replaceChild: function(newChild, oldChild) {
        if (this.dataSource) throw EXCEPTION_DATASOURCE_CONFLICT;
        if (this.dataSourceRA_) throw EXCEPTION_DATASOURCEADAPTER_CONFLICT;
        if (oldChild == null || oldChild.parentNode !== this) throw EXCEPTION_NODE_NOT_FOUND;
        this.insertBefore(newChild, oldChild);
        return this.removeChild(oldChild);
      },
      clear: function(alive) {
        if (this.dataSource && this.dataSourceMap_ && this.dataSource.itemCount) throw EXCEPTION_DATASOURCE_CONFLICT;
        if (!this.firstChild) return;
        if (alive) updateNodeContextSelection(this, this.selection || this.contextSelection, null, false, true);
        var childNodes = this.childNodes;
        this.firstChild = null;
        this.lastChild = null;
        this.childNodes = [];
        this.emit_childNodesModified({
          deleted: childNodes
        });
        for (var i = childNodes.length; i-- > 0; ) {
          var child = childNodes[i];
          if (child.listen.parentNode) child.parentNode.removeHandler(child.listen.parentNode, child);
          child.parentNode = null;
          child.groupNode = null;
          if (alive) {
            child.nextSibling = null;
            child.previousSibling = null;
            child.emit_parentChanged(this);
            if (child.autoDelegate == DELEGATE.PARENT || child.autoDelegate === DELEGATE.ANY) child.setDelegate();
          } else child.destroy();
        }
        if (this.grouping) {
          for (var childNodes = this.grouping.childNodes, i = childNodes.length - 1, group; group = childNodes[i]; i--) group.clear();
        }
      },
      setChildNodes: function(newChildNodes, keepAlive) {
        if (!this.dataSource && !this.dataSourceRA_) this.clear(keepAlive);
        if (newChildNodes) {
          if ("length" in newChildNodes == false) newChildNodes = [ newChildNodes ];
          if (newChildNodes.length) {
            var tmp = this.emit_childNodesModified;
            this.emit_childNodesModified = $undef;
            for (var i = 0, len = newChildNodes.length; i < len; i++) this.insertBefore(newChildNodes[i]);
            this.emit_childNodesModified = tmp;
            this.emit_childNodesModified({
              inserted: this.childNodes
            });
          }
        }
      },
      setDataSource: function(dataSource) {
        if (!this.childClass) throw EXCEPTION_NO_CHILDCLASS;
        dataSource = resolveDataset(this, this.setDataSource, dataSource, "dataSourceRA_");
        if (this.dataSource !== dataSource) {
          var oldDataSource = this.dataSource;
          var listenHandler = this.listen.dataSource;
          if (oldDataSource) {
            this.dataSourceMap_ = null;
            this.dataSource = null;
            if (listenHandler) oldDataSource.removeHandler(listenHandler, this);
          }
          if (this.firstChild) {
            if (oldDataSource) for (var i = 0, child; child = this.childNodes[i]; i++) unlockDataSourceItemNode(child);
            this.clear(!this.destroyDataSourceMember);
          }
          this.dataSource = dataSource;
          if (dataSource) {
            this.dataSourceMap_ = {};
            this.setChildNodesState(dataSource.state, dataSource.state.data);
            if (listenHandler) {
              dataSource.addHandler(listenHandler, this);
              if (dataSource.itemCount && listenHandler.itemsChanged) {
                listenHandler.itemsChanged.call(this, dataSource, {
                  inserted: dataSource.getItems()
                });
              }
            }
          } else {
            this.setChildNodesState(STATE.UNDEFINED);
          }
          this.emit_dataSourceChanged(oldDataSource);
        }
      },
      setGrouping: function(grouping, alive) {
        if (typeof grouping == "function" || typeof grouping == "string") grouping = {
          rule: grouping
        };
        if (grouping instanceof GroupingNode == false) {
          grouping = grouping && typeof grouping == "object" ? new this.groupingClass(grouping) : null;
        }
        if (this.grouping !== grouping) {
          var oldGrouping = this.grouping;
          var order;
          if (oldGrouping) {
            this.grouping = null;
            if (!grouping) {
              if (this.firstChild) {
                if (this.sorting !== nullGetter) order = sortChildNodes(this); else order = this.childNodes;
                oldGrouping.nullGroup.clear();
                var groups = oldGrouping.childNodes.slice(0);
                for (var i = 0; i < groups.length; i++) groups[i].clear();
                fastChildNodesOrder(this, order);
              }
            }
            oldGrouping.setOwner();
          }
          if (grouping) {
            this.grouping = grouping;
            grouping.setOwner(this);
            if (this.firstChild) {
              if (this.sorting !== nullGetter) order = sortChildNodes(this); else order = this.childNodes;
              for (var i = 0, child; child = order[i]; i++) child.groupNode = this.grouping.getGroupNode(child, true);
              order = fastChildNodesGroupOrder(this, order);
              fastChildNodesOrder(this, order);
            }
          }
          this.emit_groupingChanged(oldGrouping);
          if (oldGrouping && !alive) oldGrouping.destroy();
        }
      },
      setSorting: function(sorting, sortingDesc) {
        sorting = getter(sorting);
        sortingDesc = !!sortingDesc;
        if (this.sorting !== sorting || this.sortingDesc != !!sortingDesc) {
          var oldSorting = this.sorting;
          var oldSortingDesc = this.sortingDesc;
          this.sorting = sorting;
          this.sortingDesc = !!sortingDesc;
          if (sorting !== nullGetter && this.firstChild) {
            var order = [];
            var nodes;
            for (var node = this.firstChild; node; node = node.nextSibling) {
              var newChildValue = sorting(node);
              if (newChildValue == null) newChildValue = -Infinity; else if (typeof newChildValue != "number" || newChildValue !== newChildValue) newChildValue = String(newChildValue);
              node.sortingValue = newChildValue;
            }
            if (this.grouping) {
              var groups = [ this.grouping.nullGroup ].concat(this.grouping.childNodes);
              for (var i = 0, group; group = groups[i]; i++) {
                nodes = group.nodes = sortChildNodes({
                  childNodes: group.nodes,
                  sortingDesc: this.sortingDesc
                });
                group.first = nodes[0] || null;
                group.last = nodes[nodes.length - 1] || null;
                order.push.apply(order, nodes);
              }
            } else {
              order = sortChildNodes(this);
            }
            fastChildNodesOrder(this, order);
          }
          this.emit_sortingChanged(oldSorting, oldSortingDesc);
        }
      },
      setMatchFunction: function(matchFunction) {
        if (this.matchFunction != matchFunction) {
          var oldMatchFunction = this.matchFunction;
          this.matchFunction = matchFunction;
          for (var node = this.lastChild; node; node = node.previousSibling) node.match(matchFunction);
          this.emit_matchFunctionChanged(oldMatchFunction);
        }
      }
    };
    var Node = Class(AbstractNode, DomMixin, {
      className: namespace + ".Node",
      emit_enable: createEvent("enable") && function() {
        for (var child = this.firstChild; child; child = child.nextSibling) updateNodeDisableContext(child, false);
        events.enable.call(this);
      },
      emit_disable: createEvent("disable") && function() {
        for (var child = this.firstChild; child; child = child.nextSibling) updateNodeDisableContext(child, true);
        events.disable.call(this);
      },
      emit_satelliteChanged: function(name, oldSatellite) {
        AbstractNode.prototype.emit_satelliteChanged.call(this, name, oldSatellite);
        if (this.satellite[name] instanceof Node) updateNodeDisableContext(this.satellite[name], this.disabled || this.contextDisabled);
      },
      emit_select: createEvent("select"),
      emit_unselect: createEvent("unselect"),
      emit_match: createEvent("match"),
      emit_unmatch: createEvent("unmatch"),
      emit_matchFunctionChanged: createEvent("matchFunctionChanged", "oldMatchFunction"),
      selected: false,
      selectedRA_: null,
      selection: null,
      contextSelection: null,
      matchFunction: null,
      matched: true,
      disabled: false,
      disabledRA_: null,
      contextDisabled: false,
      listen: {
        owner: {
          enable: function() {
            updateNodeDisableContext(this, false);
          },
          disable: function() {
            updateNodeDisableContext(this, true);
          }
        },
        selection: {
          destroy: function() {
            this.setSelection();
          }
        }
      },
      init: function() {
        var disabled = this.disabled;
        this.disabled = false;
        var selection = this.selection;
        if (selection) {
          this.selection = null;
          this.setSelection(selection);
        }
        AbstractNode.prototype.init.call(this);
        if (disabled) {
          disabled = !!resolveValue(this, this.setDisabled, disabled, "disabledRA_");
          if (disabled) {
            this.disabled = disabled;
            for (var child = this.firstChild; child; child = child.nextSibling) updateNodeDisableContext(child, true);
          }
        }
        if (this.selected) this.selected = !!resolveValue(this, this.setSelected, this.selected, "selectedRA_");
      },
      setSelection: function(selection) {
        if (selection instanceof Selection === false) selection = selection ? new Selection(selection) : null;
        if (this.selection !== selection) {
          updateNodeContextSelection(this, this.selection || this.contextSelection, selection || this.contextSelection, false, true);
          if (this.selection && this.listen.selection) this.selection.removeHandler(this.listen.selection, this);
          this.selection = selection;
          if (selection && this.listen.selection) selection.addHandler(this.listen.selection, this);
          return true;
        }
      },
      setSelected: function(selected, multiple) {
        var selection = this.contextSelection;
        selected = !!resolveValue(this, this.setSelected, selected, "selectedRA_");
        if (this.selected && selection) {
          if (this.selectedRA_) {
            if (selection.has(this)) {
              this.selected = false;
              selection.remove(this);
              this.selected = true;
            }
          } else {
            if (!selection.has(this)) selection.add(this);
          }
        }
        if (selected !== this.selected) {
          if (this.selectedRA_) {
            this.selected = selected;
            if (selected) this.emit_select(); else this.emit_unselect();
          } else {
            if (selected) {
              if (selection) {
                if (multiple) selection.add(this); else selection.set(this);
              } else {
                this.selected = true;
                this.emit_select();
              }
            } else {
              if (selection) {
                selection.remove(this);
              } else {
                this.selected = false;
                this.emit_unselect();
              }
            }
          }
          return true;
        } else {
          if (!this.selectedRA_ && selected && selection) {
            if (multiple) selection.remove(this); else selection.set(this);
          }
        }
        return false;
      },
      select: function(multiple) {
        if (this.selectedRA_) {
          basis.dev.warn("`selected` property is under bb-value and can't be changed by `select()` method. Use `setSelected()` instead.");
          return false;
        }
        return this.setSelected(true, multiple);
      },
      unselect: function() {
        if (this.selectedRA_) {
          basis.dev.warn("`selected` property is under bb-value and can't be changed by `unselect()` method. Use `setSelected()` instead.");
          return false;
        }
        return this.setSelected(false);
      },
      setDisabled: function(disabled) {
        disabled = !!resolveValue(this, this.setDisabled, disabled, "disabledRA_");
        if (this.disabled !== disabled) {
          this.disabled = disabled;
          if (!this.contextDisabled) if (disabled) this.emit_disable(); else this.emit_enable();
          return true;
        }
        return false;
      },
      disable: function() {
        if (this.disabledRA_) {
          basis.dev.warn("`disabled` property is under bb-value and can't be changed by `disable()` method. Use `setDisabled()` instead.");
          return false;
        }
        return this.setDisabled(true);
      },
      enable: function() {
        if (this.disabledRA_) {
          basis.dev.warn("`disabled` property is under bb-value and can't be changed by `enable()` method. Use `setDisabled()` instead.");
          return false;
        }
        return this.setDisabled(false);
      },
      isDisabled: function() {
        return this.disabled || this.contextDisabled;
      },
      match: function(func) {
        if (typeof func != "function") func = null;
        if (this.underMatch_ && !func) this.underMatch_(this, true);
        this.underMatch_ = func;
        var matched = !func || func(this);
        if (this.matched != matched) {
          this.matched = matched;
          if (matched) this.emit_match(); else this.emit_unmatch();
        }
      },
      destroy: function() {
        if (this.disabledRA_) resolveValue(this, null, null, "disabledRA_");
        if (this.selectedRA_) resolveValue(this, null, null, "selectedRA_");
        this.contextSelection = null;
        if (this.selection) this.setSelection();
        AbstractNode.prototype.destroy.call(this);
      }
    });
    var GroupingNode = Class(AbstractNode, DomMixin, {
      className: namespace + ".GroupingNode",
      emit_childNodesModified: function(delta) {
        events.childNodesModified.call(this, delta);
        var array;
        if (array = delta.inserted) {
          for (var i = 0, child; child = array[i++]; ) {
            child.groupId_ = child.delegate ? child.delegate.basisObjectId : child.data.id;
            this.map_[child.groupId_] = child;
          }
          if (this.dataSource && this.nullGroup.first) {
            var parentNode = this.owner;
            var nodes = arrayFrom(this.nullGroup.nodes);
            for (var i = nodes.length; i-- > 0; ) parentNode.insertBefore(nodes[i], nodes[i].nextSibling);
          }
        }
      },
      emit_ownerChanged: function(oldOwner) {
        if (oldOwner && oldOwner.grouping === this) oldOwner.setGrouping(null, true);
        if (this.owner && this.owner.grouping !== this) this.owner.setGrouping(this);
        events.ownerChanged.call(this, oldOwner);
        if (!this.owner && this.autoDestroyWithNoOwner) this.destroy();
      },
      map_: null,
      nullGroup: null,
      autoDestroyWithNoOwner: true,
      autoDestroyEmptyGroups: true,
      rule: nullGetter,
      childClass: PartitionNode,
      childFactory: function(config) {
        return new this.childClass(complete({
          autoDestroyIfEmpty: this.dataSource ? false : this.autoDestroyEmptyGroups
        }, config));
      },
      init: function() {
        this.map_ = {};
        this.nullGroup = new PartitionNode;
        AbstractNode.prototype.init.call(this);
      },
      getGroupNode: function(node, autocreate) {
        var groupRef = this.rule(node);
        var isDelegate = groupRef instanceof DataObject;
        var group = this.map_[isDelegate ? groupRef.basisObjectId : groupRef];
        if (this.dataSource) autocreate = false;
        if (!group && autocreate) {
          group = this.appendChild(isDelegate ? groupRef : {
            data: {
              id: groupRef,
              title: groupRef
            }
          });
        }
        return group || this.nullGroup;
      },
      setDataSource: function(dataSource) {
        var curDataSource = this.dataSource;
        DomMixin.setDataSource.call(this, dataSource);
        var owner = this.owner;
        if (owner && this.dataSource !== curDataSource) {
          var nodes = arrayFrom(owner.childNodes);
          for (var i = nodes.length - 1; i >= 0; i--) owner.insertBefore(nodes[i], nodes[i + 1]);
        }
      },
      insertBefore: function(newChild, refChild) {
        newChild = DomMixin.insertBefore.call(this, newChild, refChild);
        var firstNode = newChild.first;
        if (firstNode) {
          var parent = firstNode.parentNode;
          var lastNode = newChild.last;
          var beforePrev;
          var beforeNext;
          var afterPrev;
          var afterNext = null;
          var cursor = newChild;
          while (cursor = cursor.nextSibling) {
            if (afterNext = cursor.first) break;
          }
          afterPrev = afterNext ? afterNext.previousSibling : parent.lastChild;
          beforePrev = firstNode.previousSibling;
          beforeNext = lastNode.nextSibling;
          if (beforeNext !== afterNext) {
            var parentChildNodes = parent.childNodes;
            var nodes = newChild.nodes;
            var nodesCount = nodes.length;
            if (beforePrev) beforePrev.nextSibling = beforeNext;
            if (beforeNext) beforeNext.previousSibling = beforePrev;
            if (afterPrev) afterPrev.nextSibling = firstNode;
            if (afterNext) afterNext.previousSibling = lastNode;
            firstNode.previousSibling = afterPrev;
            lastNode.nextSibling = afterNext;
            var firstPos = parentChildNodes.indexOf(firstNode);
            var afterNextPos = afterNext ? parentChildNodes.indexOf(afterNext) : parentChildNodes.length;
            if (afterNextPos > firstPos) afterNextPos -= nodesCount;
            parentChildNodes.splice(firstPos, nodesCount);
            parentChildNodes.splice.apply(parentChildNodes, [ afterNextPos, 0 ].concat(nodes));
            if (!afterPrev || !beforePrev) parent.firstChild = parentChildNodes[0];
            if (!afterNext || !beforeNext) parent.lastChild = parentChildNodes[parentChildNodes.length - 1];
            if (firstNode instanceof PartitionNode) for (var i = nodesCount, insertBefore = afterNext; i-- > 0; ) {
              parent.insertBefore(nodes[i], insertBefore);
              insertBefore = nodes[i];
            }
          }
        }
        return newChild;
      },
      removeChild: function(oldChild) {
        if (oldChild = DomMixin.removeChild.call(this, oldChild)) {
          delete this.map_[oldChild.groupId_];
          for (var i = 0, node; node = oldChild.nodes[i]; i++) node.parentNode.insertBefore(node);
        }
        return oldChild;
      },
      clear: function(alive) {
        var nodes = [];
        var getGroupNode = this.getGroupNode;
        var nullGroup = this.nullGroup;
        this.getGroupNode = function() {
          return nullGroup;
        };
        for (var group = this.firstChild; group; group = group.nextSibling) nodes.push.apply(nodes, group.nodes);
        for (var i = 0, child; child = nodes[i]; i++) child.parentNode.insertBefore(child);
        this.getGroupNode = getGroupNode;
        DomMixin.clear.call(this, alive);
        this.map_ = {};
      },
      destroy: function() {
        this.autoDestroyWithNoOwner = false;
        AbstractNode.prototype.destroy.call(this);
        this.nullGroup.destroy();
        this.nullGroup = null;
        this.map_ = null;
      }
    });
    AbstractNode.prototype.groupingClass = GroupingNode;
    var CHILDNODESDATASET_HANDLER = {
      childNodesModified: function(sender, delta) {
        var memberMap = this.members_;
        var newDelta = {};
        var node;
        var insertCount = 0;
        var deleteCount = 0;
        var inserted = delta.inserted;
        var deleted = delta.deleted;
        if (inserted && inserted.length) {
          newDelta.inserted = inserted;
          while (node = inserted[insertCount]) {
            memberMap[node.basisObjectId] = node;
            insertCount++;
          }
        }
        if (deleted && deleted.length) {
          newDelta.deleted = deleted;
          while (node = deleted[deleteCount]) {
            delete memberMap[node.basisObjectId];
            deleteCount++;
          }
        }
        if (insertCount || deleteCount) this.emit_itemsChanged(newDelta);
      },
      destroy: function() {
        this.destroy();
      }
    };
    var ChildNodesDataset = Class(ReadOnlyDataset, {
      className: namespace + ".ChildNodesDataset",
      sourceNode: null,
      init: function() {
        ReadOnlyDataset.prototype.init.call(this);
        var sourceNode = this.sourceNode;
        childNodesDatasetMap[sourceNode.basisObjectId] = this;
        if (sourceNode.firstChild) CHILDNODESDATASET_HANDLER.childNodesModified.call(this, sourceNode, {
          inserted: sourceNode.childNodes
        });
        sourceNode.addHandler(CHILDNODESDATASET_HANDLER, this);
      },
      destroy: function() {
        this.sourceNode.removeHandler(CHILDNODESDATASET_HANDLER, this);
        delete childNodesDatasetMap[this.sourceNode.basisObjectId];
        ReadOnlyDataset.prototype.destroy.call(this);
      }
    });
    var Selection = Class(Dataset, {
      className: namespace + ".Selection",
      multiple: false,
      emit_itemsChanged: function(delta) {
        var array;
        Dataset.prototype.emit_itemsChanged.call(this, delta);
        if (array = delta.deleted) for (var i = 0, node; node = array[i]; i++) {
          if (node.selected && node.contextSelection === this) {
            node.selected = false;
            node.emit_unselect();
          }
        }
        if (array = delta.inserted) for (var i = 0, node; node = array[i]; i++) {
          if (!node.selected && node.contextSelection === this) {
            node.selected = true;
            node.emit_select();
          }
        }
      },
      add: function(nodes) {
        if (!nodes) return;
        if (!this.multiple && this.itemCount) return this.set(nodes);
        if (!Array.isArray(nodes)) nodes = [ nodes ];
        nodes = nodes.filter(this.filter, this);
        if (!this.multiple && nodes.length > 1) {
          basis.dev.warn(namespace + ".Selection#add() can't accept more than one node as not in multiple mode");
          nodes = [ nodes[0] ];
        }
        if (nodes.length) return Dataset.prototype.add.call(this, nodes);
      },
      set: function(nodes) {
        if (!nodes) return this.clear();
        if (!Array.isArray(nodes)) nodes = [ nodes ];
        nodes = nodes.filter(this.filter, this);
        if (!this.multiple && nodes.length > 1) {
          basis.dev.warn(namespace + ".Selection#set() can't accept more than one node as not in multiple mode");
          nodes = [ nodes[0] ];
        }
        if (nodes.length) return Dataset.prototype.set.call(this, nodes); else return this.clear();
      },
      filter: function(node) {
        return node instanceof Node && !node.selectedRA_ && node.contextSelection === this;
      }
    });
    module.exports = {
      DELEGATE: DELEGATE,
      AbstractNode: AbstractNode,
      Node: Node,
      GroupingNode: GroupingNode,
      PartitionNode: PartitionNode,
      ChildNodesDataset: ChildNodesDataset,
      Selection: Selection,
      nullSelection: new ReadOnlyDataset
    };
  },
  "e.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var Class = basis.Class;
    var sliceArray = Array.prototype.slice;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var values = basis.object.values;
    var $self = basis.fn.$self;
    var basisEvent = basis.require("./2.js");
    var Emitter = basisEvent.Emitter;
    var createEvent = basisEvent.create;
    var createEventHandler = basisEvent.createHandler;
    var events = basisEvent.events;
    var NULL_OBJECT = {};
    var EMPTY_ARRAY = [];
    var FACTORY = basis.FACTORY;
    var PROXY = basis.PROXY;
    var STATE_EXISTS = {};
    var STATE = {
      priority: [],
      values: {},
      add: function(state, order) {
        var name = state;
        var value = state.toLowerCase();
        STATE[name] = value;
        STATE_EXISTS[value] = name;
        this.values[value] = name;
        if (order) order = this.priority.indexOf(order); else order = -1;
        if (order == -1) this.priority.push(value); else this.priority.splice(order, 0, value);
      },
      getList: function() {
        return values(STATE_EXISTS);
      },
      factory: function(events, getter) {
        basis.dev.warn("basis.data.STATE.factory() is deprecated, use basis.data.Value.stateFactory() instead.");
        return Value.stateFactory(events, getter);
      },
      from: function(source) {
        basis.dev.warn("basis.data.STATE.state() is deprecated, use basis.data.Value.state() instead.");
        return Value.state(source);
      }
    };
    STATE.add("READY");
    STATE.add("DEPRECATED");
    STATE.add("UNDEFINED");
    STATE.add("ERROR");
    STATE.add("PROCESSING");
    var subscriptionConfig = {};
    var subscriptionSeed = 1;
    var SUBSCRIPTION = {
      NONE: 0,
      ALL: 0,
      link: function(type, from, to) {
        var subscriberId = type + from.basisObjectId;
        var subscribers = to.subscribers_;
        if (!subscribers) subscribers = to.subscribers_ = {};
        if (!subscribers[subscriberId]) {
          subscribers[subscriberId] = from;
          var count = to.subscriberCount += 1;
          if (count == 1) to.emit_subscribersChanged(+1);
        } else {
          basis.dev.warn("Attempt to add duplicate subscription");
        }
      },
      unlink: function(type, from, to) {
        var subscriberId = type + from.basisObjectId;
        var subscribers = to.subscribers_;
        if (subscribers && subscribers[subscriberId]) {
          delete subscribers[subscriberId];
          var count = to.subscriberCount -= 1;
          if (count == 0) {
            to.emit_subscribersChanged(-1);
            to.subscribers_ = null;
          }
        } else {
          basis.dev.warn("Trying remove non-exists subscription");
        }
      },
      add: function(name, handler, action) {
        subscriptionConfig[subscriptionSeed] = {
          handler: handler,
          action: action
        };
        SUBSCRIPTION[name] = subscriptionSeed;
        SUBSCRIPTION.ALL |= subscriptionSeed;
        subscriptionSeed <<= 1;
      },
      addProperty: function(propertyName, eventName) {
        var handler = {};
        handler[eventName || propertyName + "Changed"] = function(object, oldValue) {
          if (oldValue instanceof AbstractData) SUBSCRIPTION.unlink(propertyName, object, oldValue);
          if (object[propertyName] instanceof AbstractData) SUBSCRIPTION.link(propertyName, object, object[propertyName]);
        };
        this.add(propertyName.toUpperCase(), handler, function(fn, object) {
          if (object[propertyName]) fn(propertyName, object, object[propertyName]);
        });
      }
    };
    var maskConfig = {};
    function mixFunctions(fnA, fnB) {
      return function() {
        fnA.apply(this, arguments);
        fnB.apply(this, arguments);
      };
    }
    function getMaskConfig(mask) {
      var config = maskConfig[mask];
      if (!config) {
        var actions = [];
        var handler = {};
        var idx = 1;
        config = maskConfig[mask] = {
          actions: actions,
          handler: handler
        };
        while (mask) {
          if (mask & 1) {
            var cfg = subscriptionConfig[idx];
            actions.push(cfg.action);
            for (var key in cfg.handler) handler[key] = handler[key] ? mixFunctions(handler[key], cfg.handler[key]) : cfg.handler[key];
          }
          idx <<= 1;
          mask >>= 1;
        }
      }
      return config;
    }
    function addSub(object, mask) {
      var config = getMaskConfig(mask);
      for (var i = 0, action; action = config.actions[i]; i++) action(SUBSCRIPTION.link, object);
      object.addHandler(config.handler);
    }
    function remSub(object, mask) {
      var config = getMaskConfig(mask);
      for (var i = 0, action; action = config.actions[i++]; ) action(SUBSCRIPTION.unlink, object);
      object.removeHandler(config.handler);
    }
    SUBSCRIPTION.addProperty("delegate");
    SUBSCRIPTION.addProperty("target");
    SUBSCRIPTION.addProperty("dataset");
    SUBSCRIPTION.addProperty("value", "change");
    var AbstractData = Class(Emitter, {
      className: namespace + ".AbstractData",
      state: STATE.UNDEFINED,
      stateRA_: null,
      emit_stateChanged: createEvent("stateChanged", "oldState"),
      active: false,
      activeRA_: null,
      emit_activeChanged: createEvent("activeChanged"),
      subscribeTo: SUBSCRIPTION.NONE,
      subscriberCount: 0,
      subscribers_: null,
      emit_subscribersChanged: createEvent("subscribersChanged", "delta"),
      syncEvents: Class.oneFunctionProperty(function() {
        if (this.isSyncRequired()) this.syncAction();
      }, {
        stateChanged: true,
        subscribersChanged: true
      }),
      syncAction: null,
      init: function() {
        Emitter.prototype.init.call(this);
        if (this.active) {
          if (this.active === PROXY) this.active = Value.from(this, "subscribersChanged", "subscriberCount");
          this.active = !!resolveValue(this, this.setActive, this.active, "activeRA_");
          if (this.active) this.addHandler(getMaskConfig(this.subscribeTo).handler);
        }
        if (this.state != STATE.UNDEFINED) {
          var state = this.state;
          if (typeof this.state != "string") state = resolveValue(this, this.setState, state, "stateRA_");
          if (state && !hasOwnProperty.call(STATE_EXISTS, state)) {
            basis.dev.error("Wrong value for state (value has been ignored and state set to STATE.UNDEFINED)", state);
            state = false;
          }
          this.state = state || STATE.UNDEFINED;
        }
        var syncAction = this.syncAction;
        if (syncAction) {
          this.syncAction = null;
          this.setSyncAction(syncAction);
        }
      },
      setState: function(state, data) {
        state = resolveValue(this, this.setState, state, "stateRA_") || STATE.UNDEFINED;
        var stateCode = String(state);
        if (!hasOwnProperty.call(STATE_EXISTS, stateCode)) {
          basis.dev.error("Wrong value for state (value has been ignored)", stateCode);
          return false;
        }
        if (this.stateRA_ && data === undefined) data = state.data;
        if (this.state != stateCode || this.state.data != data) {
          var oldState = this.state;
          this.state = Object(stateCode);
          this.state.data = data;
          this.emit_stateChanged(oldState);
          return true;
        }
        return false;
      },
      deprecate: function() {
        if (this.state != STATE.PROCESSING) this.setState(STATE.DEPRECATED);
      },
      setActive: function(isActive) {
        if (isActive === PROXY) isActive = Value.from(this, "subscribersChanged", "subscriberCount");
        isActive = !!resolveValue(this, this.setActive, isActive, "activeRA_");
        if (this.active != isActive) {
          this.active = isActive;
          this.emit_activeChanged();
          if (isActive) addSub(this, this.subscribeTo); else remSub(this, this.subscribeTo);
          return true;
        }
        return false;
      },
      setSubscription: function(subscriptionType) {
        var curSubscriptionType = this.subscribeTo;
        var newSubscriptionType = subscriptionType & SUBSCRIPTION.ALL;
        var delta = curSubscriptionType ^ newSubscriptionType;
        if (delta) {
          this.subscribeTo = newSubscriptionType;
          if (this.active) {
            var curConfig = getMaskConfig(curSubscriptionType);
            var newConfig = getMaskConfig(newSubscriptionType);
            this.removeHandler(curConfig.handler);
            this.addHandler(newConfig.handler);
            var idx = 1;
            while (delta) {
              if (delta & 1) {
                var cfg = subscriptionConfig[idx];
                if (curSubscriptionType & idx) cfg.action(SUBSCRIPTION.unlink, this); else cfg.action(SUBSCRIPTION.link, this);
              }
              idx <<= 1;
              delta >>= 1;
            }
          }
          return true;
        }
        return false;
      },
      isSyncRequired: function() {
        return this.subscriberCount > 0 && (this.state == STATE.UNDEFINED || this.state == STATE.DEPRECATED);
      },
      setSyncAction: function(syncAction) {
        var oldAction = this.syncAction;
        if (typeof syncAction != "function") syncAction = null;
        this.syncAction = syncAction;
        if (syncAction) {
          if (!oldAction) this.addHandler(this.syncEvents);
          if (this.isSyncRequired()) this.syncAction();
        } else {
          if (oldAction) this.removeHandler(this.syncEvents);
        }
      },
      destroy: function() {
        Emitter.prototype.destroy.call(this);
        if (this.active) {
          var config = getMaskConfig(this.subscribeTo);
          for (var i = 0, action; action = config.actions[i]; i++) action(SUBSCRIPTION.unlink, this);
        }
        if (this.activeRA_) resolveValue(this, false, false, "activeRA_");
        if (this.stateRA_) resolveValue(this, false, false, "stateRA_");
        this.state = STATE.UNDEFINED;
      }
    });
    var GETTER_ID = basis.getter.ID;
    var VALUE_EMMITER_HANDLER = {
      destroy: function(object) {
        this.value.unlink(object, this.fn);
      }
    };
    var VALUE_EMMITER_DESTROY_HANDLER = {
      destroy: function() {
        this.set(null);
      }
    };
    var computeFunctions = {};
    var valueSetters = {};
    var valueSyncAs = function(value) {
      Value.prototype.set.call(this, value);
    };
    var valueSyncPipe = function(newValue, oldValue) {
      if (oldValue instanceof Emitter) oldValue.removeHandler(this.pipeHandler, this); else oldValue = null;
      if (newValue instanceof Emitter) newValue.addHandler(this.pipeHandler, this); else newValue = null;
      if (newValue !== oldValue) Value.prototype.set.call(this, newValue);
    };
    var Value = Class(AbstractData, {
      className: namespace + ".Value",
      subscribeTo: SUBSCRIPTION.VALUE,
      emit_change: createEvent("change", "oldValue") && function(oldValue) {
        events.change.call(this, oldValue);
        var cursor = this;
        while (cursor = cursor.links_) cursor.fn.call(cursor.context, this.value, oldValue);
      },
      value: null,
      initValue: null,
      proxy: null,
      locked: 0,
      lockedValue_: null,
      links_: null,
      deferred_: null,
      pipes_: null,
      setNullOnEmitterDestroy: true,
      bindingBridge: {
        attach: function(host, callback, context, onDestroy) {
          host.link(context, callback, true, onDestroy);
        },
        detach: function(host, callback, context) {
          host.unlink(context, callback);
        },
        get: function(host) {
          return host.value;
        }
      },
      init: function() {
        AbstractData.prototype.init.call(this);
        if (this.proxy) this.value = this.proxy(this.value);
        if (this.setNullOnEmitterDestroy && this.value instanceof Emitter) this.value.addHandler(VALUE_EMMITER_DESTROY_HANDLER, this);
        this.initValue = this.value;
      },
      set: function(value) {
        var oldValue = this.value;
        var newValue = this.proxy ? this.proxy(value) : value;
        var changed = newValue !== oldValue;
        if (changed) {
          if (this.setNullOnEmitterDestroy) {
            if (oldValue instanceof Emitter) oldValue.removeHandler(VALUE_EMMITER_DESTROY_HANDLER, this);
            if (newValue instanceof Emitter) newValue.addHandler(VALUE_EMMITER_DESTROY_HANDLER, this);
          }
          this.value = newValue;
          if (!this.locked) this.emit_change(oldValue);
        }
        return changed;
      },
      reset: function() {
        this.set(this.initValue);
      },
      isLocked: function() {
        return this.locked > 0;
      },
      lock: function() {
        this.locked++;
        if (this.locked == 1) this.lockedValue_ = this.value;
      },
      unlock: function() {
        if (this.locked) {
          this.locked--;
          if (!this.locked) {
            var lockedValue = this.lockedValue_;
            this.lockedValue_ = null;
            if (this.value !== lockedValue) this.emit_change(lockedValue);
          }
        }
      },
      compute: function(events, fn) {
        if (!fn) {
          fn = events;
          events = null;
        }
        if (!fn) fn = $self;
        var hostValue = this;
        var handler = createEventHandler(events, function(object) {
          Value.prototype.set.call(this, fn(object, hostValue.value));
        });
        var fnId = fn[GETTER_ID] || String(fn);
        var getComputeValueId = handler.events.concat(fnId, this.basisObjectId).join("_");
        var getComputeValue = computeFunctions[getComputeValueId];
        if (!getComputeValue) {
          var computeMap = {};
          handler.destroy = function(object) {
            delete computeMap[object.basisObjectId];
            this.destroy();
          };
          this.addHandler({
            change: function() {
              for (var key in computeMap) {
                var pair = computeMap[key];
                Value.prototype.set.call(pair.value, fn(pair.object, this.value));
              }
            },
            destroy: function() {
              for (var key in computeMap) {
                var pair = computeMap[key];
                pair.object.removeHandler(handler, pair.value);
                pair.value.destroy();
              }
              computeMap = null;
              hostValue = null;
            }
          });
          getComputeValue = computeFunctions[getComputeValueId] = chainValueFactory(function(object) {
            if (object instanceof Emitter == false) basis.dev.warn("basis.data.Value#compute: object should be an instanceof basis.event.Emitter");
            var objectId = object.basisObjectId;
            var pair = computeMap[objectId];
            var value = fn(object, hostValue.value);
            if (!pair) {
              var computeValue = new ReadOnlyValue({
                value: value
              });
              object.addHandler(handler, computeValue);
              pair = computeMap[objectId] = {
                value: computeValue,
                object: object
              };
            } else {
              Value.prototype.set.call(pair.value, value);
            }
            return pair.value;
          });
        }
        return getComputeValue;
      },
      pipe: function(events, getter) {
        var pipeHandler = createEventHandler(events, valueFromSetProxy);
        var getterId = getter[GETTER_ID] || String(getter);
        var id = pipeHandler.events.join("_") + "_" + getterId;
        var pipes = this.pipes_;
        var pipeValue;
        if (!pipes) pipes = this.pipes_ = {}; else pipeValue = pipes[id];
        if (!pipeValue) {
          pipeValue = new PipeValue({
            source: this,
            pipeId: id,
            pipeHandler: pipeHandler
          });
          pipeValue.proxy = basis.getter(getter);
          if (this.value instanceof Emitter) {
            pipeValue.value = pipeValue.proxy(this.value);
            this.value.addHandler(pipeHandler, pipeValue);
          }
          pipes[id] = pipeValue;
          this.link(pipeValue, valueSyncPipe, true, pipeValue.destroy);
        }
        return pipeValue;
      },
      as: function(fn) {
        if (arguments.length > 1) basis.dev.warn("basis.data.Value#as() doesn't accept deferred flag as second parameter anymore. Use value.as(fn).deferred() instead.");
        if (!fn || fn === $self) return this;
        if (this.links_) {
          var cursor = this;
          var fnId = fn[GETTER_ID] || String(fn);
          while (cursor = cursor.links_) {
            var context = cursor.context;
            if (context instanceof ReadOnlyValue && context.proxy && (context.proxy[GETTER_ID] || String(context.proxy)) == fnId) return context;
          }
        }
        var result = new ReadOnlyValue({
          proxy: fn,
          value: this.value
        });
        this.link(result, valueSyncAs, true, result.destroy);
        return result;
      },
      deferred: function() {
        if (arguments.length > 0) basis.dev.warn("basis.data.Value#deferred() doesn't accept parameters anymore. Use value.as(fn).deferred() instead.");
        if (!this.deferred_) this.deferred_ = new DeferredValue({
          source: this,
          value: this.value
        });
        return this.deferred_;
      },
      link: function(context, fn, noApply, onDestroy) {
        if (typeof fn != "function") {
          var property = String(fn);
          fn = valueSetters[property];
          if (!fn) fn = valueSetters[property] = function(value) {
            this[property] = value;
          };
        }
        var cursor = this;
        while (cursor = cursor.links_) if (cursor.context === context && cursor.fn === fn) {
          basis.dev.warn(this.constructor.className + "#attach: Duplicate link pair context-fn");
          break;
        }
        this.links_ = {
          value: this,
          context: context,
          fn: fn,
          destroy: onDestroy || null,
          links_: this.links_
        };
        if (context instanceof Emitter) context.addHandler(VALUE_EMMITER_HANDLER, this.links_);
        if (!noApply) fn.call(context, this.value);
        return context;
      },
      unlink: function(context, fn) {
        var cursor = this;
        var prev;
        while (prev = cursor, cursor = cursor.links_) if (cursor.context === context && (!fn || cursor.fn === fn)) {
          cursor.fn = basis.fn.$undef;
          prev.links_ = cursor.links_;
          if (cursor.context instanceof Emitter) cursor.context.removeHandler(VALUE_EMMITER_HANDLER, cursor);
        }
      },
      destroy: function() {
        AbstractData.prototype.destroy.call(this);
        if (this.setNullOnEmitterDestroy && this.value instanceof Emitter) this.value.removeHandler(VALUE_EMMITER_DESTROY_HANDLER, this);
        var cursor = this.links_;
        this.links_ = null;
        while (cursor) {
          if (cursor.context instanceof Emitter) cursor.context.removeHandler(VALUE_EMMITER_HANDLER, cursor);
          if (cursor.destroy) cursor.destroy.call(cursor.context);
          cursor = cursor.links_;
        }
        this.proxy = null;
        this.initValue = null;
        this.value = null;
        this.lockedValue_ = null;
        this.deferred_ = null;
        this.pipes_ = null;
      }
    });
    var ReadOnlyValue = Class(Value, {
      className: namespace + ".ReadOnlyValue",
      set: basis.fn.$false
    });
    var DEFERRED_HANDLER = {
      change: function(source) {
        if (!this.isLocked()) {
          this.lock();
          deferredSchedule.add(this);
        }
        Value.prototype.set.call(this, source.value);
      },
      destroy: function() {
        this.destroy();
      }
    };
    var deferredSchedule = basis.asap.schedule(function(value) {
      value.unlock();
    });
    var DeferredValue = Class(ReadOnlyValue, {
      className: namespace + ".DeferredValue",
      setNullOnEmitterDestroy: false,
      source: null,
      init: function() {
        Value.prototype.init.call(this);
        this.source.addHandler(DEFERRED_HANDLER, this);
      },
      deferred: function() {
        return this;
      },
      destroy: function() {
        deferredSchedule.remove(this);
        this.source = null;
        Value.prototype.destroy.call(this);
      }
    });
    var PipeValue = Class(ReadOnlyValue, {
      className: namespace + ".PipeValue",
      source: null,
      pipeId: null,
      pipeHandler: null,
      destroy: function() {
        var source = this.source;
        var sourceValue = source.value;
        if (sourceValue instanceof Emitter) sourceValue.removeHandler(this.pipeHandler, this);
        source.pipes_[this.pipeId] = null;
        this.source = null;
        this.pipeHandler = null;
        Value.prototype.destroy.call(this);
      }
    });
    var valueFromMap = {};
    var valueFromSetProxy = function(sender) {
      Value.prototype.set.call(this, sender);
    };
    Value.from = function(obj, events, getter) {
      var result;
      if (!obj) return null;
      if (obj instanceof Emitter) {
        if (!getter) {
          getter = events;
          events = null;
        }
        if (!getter) getter = $self;
        var handler = createEventHandler(events, valueFromSetProxy);
        var getterId = getter[GETTER_ID] || String(getter);
        var id = handler.events.concat(getterId, obj.basisObjectId).join("_");
        result = valueFromMap[id];
        if (!result) {
          result = valueFromMap[id] = new ReadOnlyValue({
            proxy: basis.getter(getter),
            value: obj,
            handler: {
              destroy: function() {
                valueFromMap[id] = null;
                obj.removeHandler(handler, this);
              }
            }
          });
          handler.destroy = function() {
            valueFromMap[id] = null;
            this.destroy();
          };
          obj.addHandler(handler, result);
        }
      }
      if (!result) {
        var id = obj.basisObjectId;
        var bindingBridge = obj.bindingBridge;
        if (id && bindingBridge) {
          result = valueFromMap[id];
          if (!result) {
            result = valueFromMap[id] = new ReadOnlyValue({
              value: bindingBridge.get(obj),
              handler: {
                destroy: function() {
                  valueFromMap[id] = null;
                  bindingBridge.detach(obj, Value.prototype.set, result);
                }
              }
            });
            bindingBridge.attach(obj, Value.prototype.set, result, result.destroy);
          }
        }
      }
      if (!result) throw "Bad object type";
      return result;
    };
    function chainValueFactory(fn) {
      fn.factory = FACTORY;
      fn.deferred = valueDeferredFactory;
      fn.compute = valueComputeFactory;
      fn.pipe = valuePipeFactory;
      fn.as = valueAsFactory;
      return fn;
    }
    function valueDeferredFactory() {
      var factory = this;
      return chainValueFactory(function(value) {
        value = factory(value);
        return value ? value.deferred() : value;
      });
    }
    function valueComputeFactory(events, getter) {
      var factory = this;
      return chainValueFactory(function(sourceValue) {
        var value = factory(sourceValue);
        return value ? value.compute(events, getter)(sourceValue) : value;
      });
    }
    function valueAsFactory(getter) {
      var factory = this;
      return chainValueFactory(function(value) {
        value = factory(value);
        return value ? value.as(getter) : value;
      });
    }
    function valuePipeFactory(events, getter) {
      var factory = this;
      return chainValueFactory(function(value) {
        value = factory(value);
        return value ? value.pipe(events, getter) : value;
      });
    }
    Value.factory = function(events, getter) {
      return chainValueFactory(function(object) {
        return Value.from(object, events, getter);
      });
    };
    Value.state = function(source) {
      return source instanceof AbstractData ? Value.from(source, "stateChanged", "state") : STATE.UNDEFINED;
    };
    Value.stateFactory = function(events, getter) {
      return Value.factory(events, getter).pipe("stateChanged", "state").as(function(state) {
        return state || STATE.UNDEFINED;
      });
    };
    var INIT_DATA = {};
    function isConnected(a, b) {
      while (b && b !== a && b !== b.delegate) b = b.delegate;
      return b === a;
    }
    function applyDelegateChanges(object, oldRoot, oldTarget) {
      var delegate = object.delegate;
      if (delegate) {
        object.root = delegate.root;
        object.target = delegate.target;
        object.data = delegate.data;
        object.state = delegate.state;
      }
      if (object.root !== oldRoot) {
        var rootListenHandler = object.listen.root;
        if (rootListenHandler) {
          if (oldRoot && oldRoot !== object) oldRoot.removeHandler(rootListenHandler, object);
          if (object.root && object.root !== object) object.root.addHandler(rootListenHandler, object);
        }
        object.emit_rootChanged(oldRoot);
      }
      if (object.target !== oldTarget) {
        var targetListenHandler = object.listen.target;
        if (targetListenHandler) {
          if (oldTarget && oldTarget !== object) oldTarget.removeHandler(targetListenHandler, object);
          if (object.target && object.target !== object) object.target.addHandler(targetListenHandler, object);
        }
        object.emit_targetChanged(oldTarget);
      }
      var cursor = object.delegates_;
      while (cursor) {
        if (cursor.delegate) applyDelegateChanges(cursor.delegate, oldRoot, oldTarget);
        cursor = cursor.next;
      }
    }
    var DataObject = Class(AbstractData, {
      className: namespace + ".Object",
      subscribeTo: SUBSCRIPTION.DELEGATE + SUBSCRIPTION.TARGET,
      data: null,
      emit_update: createEvent("update", "delta") && function(delta) {
        var cursor = this.delegates_;
        events.update.call(this, delta);
        while (cursor) {
          if (cursor.delegate) cursor.delegate.emit_update(delta);
          cursor = cursor.next;
        }
      },
      emit_stateChanged: function(oldState) {
        var cursor = this.delegates_;
        AbstractData.prototype.emit_stateChanged.call(this, oldState);
        while (cursor) {
          if (cursor.delegate) {
            cursor.delegate.state = this.state;
            cursor.delegate.emit_stateChanged(oldState);
          }
          cursor = cursor.next;
        }
      },
      delegate: null,
      delegateRA_: null,
      delegates_: null,
      debug_delegates: function() {
        var cursor = this.delegates_;
        var result = [];
        while (cursor) {
          result.push(cursor.delegate);
          cursor = cursor.next;
        }
        return result;
      },
      emit_delegateChanged: createEvent("delegateChanged", "oldDelegate"),
      target: null,
      emit_targetChanged: createEvent("targetChanged", "oldTarget"),
      root: null,
      emit_rootChanged: createEvent("rootChanged", "oldRoot"),
      init: function() {
        this.root = this;
        AbstractData.prototype.init.call(this);
        var delegate = this.delegate;
        var data = this.data;
        if (delegate) {
          this.delegate = null;
          this.target = null;
          this.data = INIT_DATA;
          this.setDelegate(delegate);
          if (this.data === INIT_DATA) this.data = data || {};
        } else {
          if (!data) this.data = {};
          if (this.target !== null) this.target = this;
        }
      },
      setSyncAction: function(syncAction) {
        if (syncAction && this.delegate) basis.dev.warn(this.constructor.syncAction + " instance has a delegate and syncAction - it may produce conflics with data & state");
        AbstractData.prototype.setSyncAction.call(this, syncAction);
      },
      setDelegate: function(newDelegate) {
        newDelegate = resolveObject(this, this.setDelegate, newDelegate, "delegateRA_");
        if (newDelegate && newDelegate instanceof DataObject) {
          if (newDelegate.delegate && isConnected(this, newDelegate)) {
            basis.dev.warn("New delegate has already connected to object. Delegate assignment has been ignored.", this, newDelegate);
            return false;
          }
        } else {
          newDelegate = null;
        }
        if (this.delegate !== newDelegate) {
          var oldState = this.state;
          var oldData = this.data;
          var oldDelegate = this.delegate;
          var oldTarget = this.target;
          var oldRoot = this.root;
          var delegateListenHandler = this.listen.delegate;
          var dataChanged = false;
          var delta;
          if (oldDelegate) {
            if (delegateListenHandler) oldDelegate.removeHandler(delegateListenHandler, this);
            var cursor = oldDelegate.delegates_;
            var prev = oldDelegate;
            while (cursor) {
              if (cursor.delegate === this) {
                cursor.delegate = null;
                if (prev === oldDelegate) oldDelegate.delegates_ = cursor.next; else prev.next = cursor.next;
                break;
              }
              prev = cursor;
              cursor = cursor.next;
            }
          }
          if (newDelegate) {
            this.delegate = newDelegate;
            if (delegateListenHandler) newDelegate.addHandler(delegateListenHandler, this);
            newDelegate.delegates_ = {
              delegate: this,
              next: newDelegate.delegates_
            };
            if (this.data !== INIT_DATA) {
              delta = {};
              for (var key in newDelegate.data) if (key in oldData === false) {
                dataChanged = true;
                delta[key] = undefined;
              }
              for (var key in oldData) if (oldData[key] !== newDelegate.data[key]) {
                dataChanged = true;
                delta[key] = oldData[key];
              }
            }
          } else {
            this.delegate = null;
            this.target = null;
            this.root = this;
            this.data = {};
            for (var key in oldData) this.data[key] = oldData[key];
          }
          applyDelegateChanges(this, oldRoot, oldTarget);
          if (dataChanged) this.emit_update(delta);
          if (delta && oldState !== this.state && (String(oldState) != this.state || oldState.data !== this.state.data)) this.emit_stateChanged(oldState);
          this.emit_delegateChanged(oldDelegate);
          return true;
        }
        return false;
      },
      setState: function(state, data) {
        if (this.delegate) return this.root.setState(state, data); else return AbstractData.prototype.setState.call(this, state, data);
      },
      update: function(data) {
        if (this.delegate) return this.root.update(data);
        if (data) {
          var delta = {};
          var changed = false;
          for (var prop in data) if (this.data[prop] !== data[prop]) {
            changed = true;
            delta[prop] = this.data[prop];
            this.data[prop] = data[prop];
          }
          if (changed) {
            this.emit_update(delta);
            return delta;
          }
        }
        return false;
      },
      destroy: function() {
        AbstractData.prototype.destroy.call(this);
        var cursor = this.delegates_;
        this.delegates_ = null;
        while (cursor) {
          cursor.delegate.setDelegate();
          cursor = cursor.next;
        }
        if (this.delegate) this.setDelegate();
        if (this.delegateRA_) resolveObject(this, false, false, "delegateRA_");
        this.data = NULL_OBJECT;
        this.root = null;
        this.target = null;
      }
    });
    var Slot = Class(DataObject, {
      className: namespace + ".Slot"
    });
    var KEYOBJECTMAP_MEMBER_HANDLER = {
      destroy: function() {
        delete this.map[this.id];
      }
    };
    var KeyObjectMap = Class(AbstractData, {
      className: namespace + ".KeyObjectMap",
      itemClass: DataObject,
      keyGetter: basis.getter($self),
      autoDestroyMembers: true,
      map_: null,
      extendConstructor_: true,
      init: function() {
        this.map_ = {};
        AbstractData.prototype.init.call(this);
      },
      resolve: function(object) {
        return this.get(this.keyGetter(object), object);
      },
      create: function(key) {
        var itemConfig;
        if (key instanceof DataObject) itemConfig = {
          delegate: key
        }; else itemConfig = {
          data: {
            id: key,
            title: key
          }
        };
        return new this.itemClass(itemConfig);
      },
      get: function(key, autocreate) {
        var itemId = key instanceof DataObject ? key.basisObjectId : key;
        var itemInfo = this.map_[itemId];
        if (!itemInfo && autocreate) {
          itemInfo = this.map_[itemId] = {
            map: this.map_,
            id: itemId,
            item: this.create(key, autocreate)
          };
          itemInfo.item.addHandler(KEYOBJECTMAP_MEMBER_HANDLER, itemInfo);
        }
        if (itemInfo) return itemInfo.item;
      },
      destroy: function() {
        AbstractData.prototype.destroy.call(this);
        var map = this.map_;
        this.map_ = null;
        for (var itemId in map) {
          var itemInfo = map[itemId];
          if (this.autoDestroyMembers) itemInfo.item.destroy(); else itemInfo.item.removeHandler(KEYOBJECTMAP_MEMBER_HANDLER, itemInfo);
        }
      }
    });
    function getDelta(inserted, deleted) {
      var delta = {};
      var result;
      if (inserted && inserted.length) result = delta.inserted = inserted;
      if (deleted && deleted.length) result = delta.deleted = deleted;
      if (result) return delta;
    }
    function getDatasetDelta(a, b) {
      if (!a || !a.itemCount) {
        if (b && b.itemCount) return {
          inserted: b.getItems()
        };
      } else {
        if (!b || !b.itemCount) {
          if (a.itemCount) return {
            deleted: a.getItems()
          };
        } else {
          var inserted = [];
          var deleted = [];
          for (var key in a.items_) {
            var item = a.items_[key];
            if (item.basisObjectId in b.items_ == false) deleted.push(item);
          }
          for (var key in b.items_) {
            var item = b.items_[key];
            if (item.basisObjectId in a.items_ == false) inserted.push(item);
          }
          return getDelta(inserted, deleted);
        }
      }
    }
    var DatasetWrapper = Class(DataObject, {
      className: namespace + ".DatasetWrapper",
      active: basis.PROXY,
      subscribeTo: DataObject.prototype.subscribeTo + SUBSCRIPTION.DATASET,
      listen: {
        dataset: {
          itemsChanged: function(dataset, delta) {
            this.itemCount = dataset.itemCount;
            this.emit_itemsChanged(delta);
          },
          destroy: function() {
            this.setDataset();
          }
        }
      },
      dataset: null,
      datasetRA_: null,
      emit_datasetChanged: createEvent("datasetChanged", "oldDataset"),
      emit_itemsChanged: createEvent("itemsChanged", "delta"),
      init: function() {
        DataObject.prototype.init.call(this);
        var dataset = this.dataset;
        if (dataset) {
          this.dataset = null;
          this.setDataset(dataset);
        }
      },
      setDataset: function(dataset) {
        dataset = resolveDataset(this, this.setDataset, dataset, "datasetRA_");
        if (this.dataset !== dataset) {
          var listenHandler = this.listen.dataset;
          var oldDataset = this.dataset;
          var delta;
          if (listenHandler) {
            if (oldDataset) oldDataset.removeHandler(listenHandler, this);
            if (dataset) dataset.addHandler(listenHandler, this);
          }
          this.itemCount = dataset ? dataset.itemCount : 0;
          this.dataset = dataset;
          if (delta = getDatasetDelta(oldDataset, dataset)) this.emit_itemsChanged(delta);
          this.emit_datasetChanged(oldDataset);
        }
      },
      has: function(object) {
        return this.dataset ? this.dataset.has(object) : null;
      },
      getItems: function() {
        return this.dataset ? this.dataset.getItems() : [];
      },
      getValues: function(getter) {
        return this.dataset ? this.dataset.getValues(getter) : [];
      },
      pick: function() {
        return this.dataset ? this.dataset.pick() : null;
      },
      top: function(count) {
        return this.dataset ? this.dataset.top(count) : [];
      },
      forEach: function(fn) {
        if (this.dataset) return this.dataset.forEach(fn);
      },
      destroy: function() {
        if (this.dataset || this.datasetRA_) this.setDataset();
        DataObject.prototype.destroy.call(this);
      }
    });
    var ReadOnlyDataset = Class(AbstractData, {
      className: namespace + ".ReadOnlyDataset",
      itemCount: 0,
      items_: null,
      members_: null,
      cache_: null,
      emit_itemsChanged: createEvent("itemsChanged", "delta") && function(delta) {
        var items;
        var insertCount = 0;
        var deleteCount = 0;
        var object;
        if (items = delta.inserted) {
          while (object = items[insertCount]) {
            this.items_[object.basisObjectId] = object;
            insertCount++;
          }
        }
        if (items = delta.deleted) {
          while (object = items[deleteCount]) {
            delete this.items_[object.basisObjectId];
            deleteCount++;
          }
        }
        this.itemCount += insertCount - deleteCount;
        this.cache_ = insertCount == this.itemCount ? delta.inserted : null;
        events.itemsChanged.call(this, delta);
      },
      init: function() {
        AbstractData.prototype.init.call(this);
        this.members_ = {};
        this.items_ = {};
      },
      has: function(object) {
        return !!(object && this.items_[object.basisObjectId]);
      },
      getItems: function() {
        if (!this.cache_) this.cache_ = values(this.items_);
        return this.cache_;
      },
      getValues: function(getter) {
        return this.getItems().map(basis.getter(getter || $self));
      },
      pick: function() {
        for (var objectId in this.items_) return this.items_[objectId];
        return null;
      },
      top: function(count) {
        var result = [];
        if (count) for (var objectId in this.items_) if (result.push(this.items_[objectId]) >= count) break;
        return result;
      },
      forEach: function(fn) {
        var items = this.getItems();
        for (var i = 0; i < items.length; i++) fn(items[i]);
      },
      destroy: function() {
        AbstractData.prototype.destroy.call(this);
        this.cache_ = EMPTY_ARRAY;
        this.itemCount = 0;
        this.members_ = null;
        this.items_ = null;
      }
    });
    var Dataset = Class(ReadOnlyDataset, {
      className: namespace + ".Dataset",
      listen: {
        item: {
          destroy: function(object) {
            this.remove([ object ]);
          }
        }
      },
      init: function() {
        ReadOnlyDataset.prototype.init.call(this);
        var items = this.items;
        if (items) {
          this.items = null;
          this.set(items);
        }
      },
      add: function(items) {
        var memberMap = this.members_;
        var listenHandler = this.listen.item;
        var inserted = [];
        var delta;
        if (items && !Array.isArray(items)) items = [ items ];
        for (var i = 0; i < items.length; i++) {
          var object = items[i];
          if (object instanceof DataObject) {
            var objectId = object.basisObjectId;
            if (!memberMap[objectId]) {
              memberMap[objectId] = object;
              if (listenHandler) object.addHandler(listenHandler, this);
              inserted.push(object);
            }
          } else {
            basis.dev.warn("Wrong data type: value should be an instance of basis.data.Object");
          }
        }
        if (inserted.length) {
          this.emit_itemsChanged(delta = {
            inserted: inserted
          });
        }
        return delta;
      },
      remove: function(items) {
        var memberMap = this.members_;
        var listenHandler = this.listen.item;
        var deleted = [];
        var delta;
        if (items && !Array.isArray(items)) items = [ items ];
        for (var i = 0; i < items.length; i++) {
          var object = items[i];
          if (object instanceof DataObject) {
            var objectId = object.basisObjectId;
            if (memberMap[objectId]) {
              if (listenHandler) object.removeHandler(listenHandler, this);
              delete memberMap[objectId];
              deleted.push(object);
            }
          } else {
            basis.dev.warn("Wrong data type: value should be an instance of basis.data.Object");
          }
        }
        if (deleted.length) {
          this.emit_itemsChanged(delta = {
            deleted: deleted
          });
        }
        return delta;
      },
      set: function(items) {
        if (!this.itemCount) return this.add(items);
        if (!items || !items.length) return this.clear();
        var memberMap = this.members_;
        var listenHandler = this.listen.item;
        var exists = {};
        var deleted = [];
        var inserted = [];
        var object;
        var objectId;
        var delta;
        for (var i = 0; i < items.length; i++) {
          object = items[i];
          if (object instanceof DataObject) {
            objectId = object.basisObjectId;
            exists[objectId] = object;
            if (!memberMap[objectId]) {
              memberMap[objectId] = object;
              if (listenHandler) object.addHandler(listenHandler, this);
              inserted.push(object);
            }
          } else {
            basis.dev.warn("Wrong data type: value should be an instance of basis.data.Object");
          }
        }
        for (var objectId in memberMap) {
          if (!exists[objectId]) {
            object = memberMap[objectId];
            if (listenHandler) object.removeHandler(listenHandler, this);
            delete memberMap[objectId];
            deleted.push(object);
          }
        }
        if (delta = getDelta(inserted, deleted)) this.emit_itemsChanged(delta);
        return delta;
      },
      sync: function(items) {
        basis.dev.warn("basis.data.Dataset#sync() method is deprecated, use basis.data.Dataset#setAndDestroyRemoved() instead.");
        return this.setAndDestroyRemoved(items);
      },
      setAndDestroyRemoved: function(items) {
        var delta = this.set(items) || {};
        var deleted = delta.deleted;
        Dataset.setAccumulateState(true);
        if (deleted) for (var i = 0, object; object = deleted[i]; i++) object.destroy();
        Dataset.setAccumulateState(false);
        return delta.inserted;
      },
      clear: function() {
        var deleted = this.getItems();
        var listenHandler = this.listen.item;
        var delta;
        if (deleted.length) {
          if (listenHandler) for (var i = 0; i < deleted.length; i++) deleted[i].removeHandler(listenHandler, this);
          this.emit_itemsChanged(delta = {
            deleted: deleted
          });
          this.members_ = {};
        }
        return delta;
      },
      destroy: function() {
        this.clear();
        ReadOnlyDataset.prototype.destroy.call(this);
      }
    });
    function resolveAdapterProxy() {
      this.fn.call(this.context, this.source);
    }
    var ResolveAdapter = function(context, fn, source, handler) {
      this.context = context;
      this.fn = fn;
      this.source = source;
      this.handler = handler;
    };
    ResolveAdapter.prototype = {
      context: null,
      fn: null,
      source: null,
      handler: null,
      next: null,
      attach: function() {
        this.source.addHandler(this.handler, this);
      },
      detach: function() {
        this.source.removeHandler(this.handler, this);
      }
    };
    var BBResolveAdapter = function() {
      ResolveAdapter.apply(this, arguments);
    };
    BBResolveAdapter.prototype = new ResolveAdapter;
    BBResolveAdapter.prototype.attach = function(destroyCallback) {
      this.source.bindingBridge.attach(this.source, this.handler, this, destroyCallback);
    };
    BBResolveAdapter.prototype.detach = function() {
      this.source.bindingBridge.detach(this.source, this.handler, this);
    };
    var DEFAULT_CHANGE_ADAPTER_HANDLER = function() {
      this.fn.call(this.context, this.source);
    };
    var DEFAULT_DESTROY_ADAPTER_HANDLER = function() {
      this.fn.call(this.context, null);
    };
    var RESOLVEVALUE_DESTROY_ADAPTER_HANDLER = function() {
      this.fn.call(this.context, resolveValue(NULL_OBJECT, null, this.source.bindingBridge.get(this.source)));
    };
    var DATASETWRAPPER_ADAPTER_HANDLER = {
      datasetChanged: DEFAULT_CHANGE_ADAPTER_HANDLER,
      destroy: DEFAULT_DESTROY_ADAPTER_HANDLER
    };
    function resolveDataset(context, fn, source, property, factoryContext) {
      var oldAdapter = context[property] || null;
      var newAdapter = null;
      if (fn !== resolveAdapterProxy && typeof source == "function") source = source.call(factoryContext || context, factoryContext || context);
      if (source) {
        var adapter = newAdapter = oldAdapter && oldAdapter.source === source ? oldAdapter : null;
        if (source instanceof DatasetWrapper) {
          newAdapter = adapter || new ResolveAdapter(context, fn, source, DATASETWRAPPER_ADAPTER_HANDLER);
          source = source.dataset;
        } else if (source.bindingBridge) {
          newAdapter = adapter || new BBResolveAdapter(context, fn, source, DEFAULT_CHANGE_ADAPTER_HANDLER);
          source = resolveDataset(newAdapter, resolveAdapterProxy, source.value, "next");
        }
      }
      if (source instanceof ReadOnlyDataset == false) source = null;
      if (property && oldAdapter !== newAdapter) {
        var cursor = oldAdapter;
        while (cursor) {
          var adapter = cursor;
          adapter.detach();
          cursor = adapter.next;
          adapter.next = null;
        }
        if (newAdapter) newAdapter.attach(DEFAULT_DESTROY_ADAPTER_HANDLER);
        context[property] = newAdapter;
      }
      return source;
    }
    function createResolveFunction(Class) {
      return function resolveObject(context, fn, source, property, factoryContext) {
        var oldAdapter = context[property] || null;
        var newAdapter = null;
        if (fn !== resolveAdapterProxy && typeof source == "function") source = source.call(factoryContext || context, factoryContext || context);
        if (source && source.bindingBridge) {
          if (!oldAdapter || oldAdapter.source !== source) newAdapter = new BBResolveAdapter(context, fn, source, DEFAULT_CHANGE_ADAPTER_HANDLER); else newAdapter = oldAdapter;
          source = resolveObject(newAdapter, resolveAdapterProxy, source.bindingBridge.get(source), "next");
        }
        if (source instanceof Class == false) source = null;
        if (property && oldAdapter !== newAdapter) {
          var cursor = oldAdapter;
          while (cursor) {
            var adapter = cursor;
            adapter.detach();
            cursor = adapter.next;
            adapter.next = null;
          }
          if (newAdapter) newAdapter.attach(DEFAULT_DESTROY_ADAPTER_HANDLER);
          context[property] = newAdapter;
        }
        return source;
      };
    }
    var resolveObject = createResolveFunction(DataObject);
    function resolveValue(context, fn, source, property, factoryContext) {
      var oldAdapter = context[property] || null;
      var newAdapter = null;
      if (source && fn !== resolveAdapterProxy && basis.fn.isFactory(source)) source = source.call(factoryContext || context, factoryContext || context);
      if (source && source.bindingBridge) {
        if (!oldAdapter || oldAdapter.source !== source) newAdapter = new BBResolveAdapter(context, fn, source, DEFAULT_CHANGE_ADAPTER_HANDLER); else newAdapter = oldAdapter;
        source = resolveValue(newAdapter, resolveAdapterProxy, source.bindingBridge.get(source), "next");
      }
      if (property && oldAdapter !== newAdapter) {
        var cursor = oldAdapter;
        while (cursor) {
          var adapter = cursor;
          adapter.detach();
          cursor = adapter.next;
          adapter.next = null;
        }
        if (newAdapter) newAdapter.attach(RESOLVEVALUE_DESTROY_ADAPTER_HANDLER);
        context[property] = newAdapter;
      }
      return source;
    }
    Dataset.setAccumulateState = function() {
      var proto = ReadOnlyDataset.prototype;
      var eventCache = {};
      var setStateCount = 0;
      var urgentTimer;
      var realEvent;
      function flushCache(cache) {
        var dataset = cache.dataset;
        realEvent.call(dataset, cache);
      }
      function flushAllDataset() {
        var eventCacheCopy = eventCache;
        eventCache = {};
        for (var datasetId in eventCacheCopy) {
          var entry = eventCacheCopy[datasetId];
          if (entry) flushCache(entry);
        }
      }
      function storeDatasetDelta(delta) {
        var dataset = this;
        var datasetId = dataset.basisObjectId;
        var inserted = delta.inserted;
        var deleted = delta.deleted;
        var cache = eventCache[datasetId];
        if (inserted && deleted || cache && cache.mixed) {
          if (cache) {
            eventCache[datasetId] = null;
            flushCache(cache);
          }
          realEvent.call(dataset, delta);
          return;
        }
        if (cache) {
          var mode = inserted ? "inserted" : "deleted";
          var array = cache[mode];
          if (!array) {
            var inCacheMode = inserted ? "deleted" : "inserted";
            var inCache = cache[inCacheMode];
            var inCacheMap = {};
            var deltaItems = inserted || deleted;
            var newInCacheItems = [];
            var inCacheRemoves = 0;
            for (var i = 0; i < inCache.length; i++) inCacheMap[inCache[i].basisObjectId] = i;
            for (var i = 0; i < deltaItems.length; i++) {
              var id = deltaItems[i].basisObjectId;
              if (id in inCacheMap == false) {
                newInCacheItems.push(deltaItems[i]);
              } else {
                if (!inCacheRemoves) inCache = sliceArray.call(inCache);
                inCacheRemoves++;
                inCache[inCacheMap[id]] = null;
              }
            }
            if (inCacheRemoves) {
              if (inCacheRemoves < inCache.length) {
                inCache = inCache.filter(Boolean);
              } else {
                inCache = null;
              }
              cache[inCacheMode] = inCache;
            }
            if (!newInCacheItems.length) {
              newInCacheItems = null;
              if (!inCache) eventCache[datasetId] = null;
            } else {
              cache[mode] = newInCacheItems;
              if (inCache) cache.mixed = true;
            }
          } else array.push.apply(array, inserted || deleted);
          return;
        }
        eventCache[datasetId] = {
          inserted: inserted,
          deleted: deleted,
          dataset: dataset,
          mixed: false
        };
      }
      function urgentFlush() {
        urgentTimer = null;
        if (setStateCount) {
          basis.dev.warn("(debug) Urgent flush dataset changes");
          setStateCount = 0;
          setAccumulateStateOff();
        }
      }
      function setAccumulateStateOff() {
        proto.emit_itemsChanged = realEvent;
        flushAllDataset();
      }
      return function(state) {
        if (state) {
          if (setStateCount == 0) {
            realEvent = proto.emit_itemsChanged;
            proto.emit_itemsChanged = storeDatasetDelta;
            if (!urgentTimer) urgentTimer = basis.setImmediate(urgentFlush);
          }
          setStateCount++;
        } else {
          setStateCount -= setStateCount > 0;
          if (setStateCount == 0) setAccumulateStateOff();
        }
      };
    }();
    function wrapData(data) {
      if (Array.isArray(data)) return data.map(function(item) {
        return {
          data: item
        };
      }); else return {
        data: data
      };
    }
    function wrapObject(data) {
      if (!data || data.constructor !== Object) data = {
        value: data
      };
      return new DataObject({
        data: data
      });
    }
    function wrap(value, retObject) {
      var wrapper = retObject ? wrapObject : wrapData;
      return Array.isArray(value) ? value.map(wrapper) : wrapper(value);
    }
    module.exports = {
      STATE: STATE,
      SUBSCRIPTION: SUBSCRIPTION,
      AbstractData: AbstractData,
      Value: Value,
      ReadOnlyValue: ReadOnlyValue,
      DeferredValue: DeferredValue,
      PipeValue: PipeValue,
      Object: DataObject,
      Slot: Slot,
      KeyObjectMap: KeyObjectMap,
      ReadOnlyDataset: ReadOnlyDataset,
      Dataset: Dataset,
      DatasetWrapper: DatasetWrapper,
      isConnected: isConnected,
      getDatasetDelta: getDatasetDelta,
      ResolveAdapter: ResolveAdapter,
      createResolveFunction: createResolveFunction,
      resolveDataset: resolveDataset,
      resolveObject: resolveObject,
      resolveValue: resolveValue,
      wrapData: wrapData,
      wrapObject: wrapObject,
      wrap: wrap
    };
  },
  "1.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var document = global.document;
    var Class = basis.Class;
    var createEvent = basis.require("./2.js").create;
    var HtmlTemplate = basis.require("./3.js").Template;
    var htmlTemplateIdMarker = basis.require("./6.js").MARKER;
    var TemplateSwitcher = basis.require("./7.js").TemplateSwitcher;
    var basisDomWrapper = basis.require("./d.js");
    var DWNode = basisDomWrapper.Node;
    var DWPartitionNode = basisDomWrapper.PartitionNode;
    var DWGroupingNode = basisDomWrapper.GroupingNode;
    var instances = {};
    var notifier = new basis.Token;
    var bindingSeed = 1;
    var unknownEventBindingCheck = {};
    function extendBinding(binding, extension) {
      binding.bindingId = bindingSeed++;
      for (var key in extension) {
        var def = null;
        var value = extension[key];
        if (Node && value instanceof Node || basis.resource.isResource(value)) {
          def = {
            events: "satelliteChanged",
            getter: function(key, satellite) {
              var resource = typeof satellite == "function" ? satellite : null;
              var init = function(node) {
                init = false;
                if (resource) {
                  satellite = resource();
                  if (satellite instanceof Node == false) return;
                  resource = null;
                }
                node.setSatellite(key, satellite);
                if (node.satellite[key] !== satellite) basis.dev.warn("basis.ui.binding: implicit satellite `" + key + "` attach to owner failed");
              };
              return function(node) {
                if (init) init(node);
                return resource || (node.satellite[key] ? node.satellite[key].element : null);
              };
            }(key, value)
          };
        } else {
          if (value) {
            if (typeof value == "string") value = BINDING_PRESET.process(key, value); else if (value.bindingBridge) value = basis.fn.$const(value);
            if (typeof value != "object") {
              def = {
                getter: typeof value == "function" ? value : basis.getter(value)
              };
            } else if (Array.isArray(value)) {
              def = {
                events: value[0],
                getter: basis.getter(value[1])
              };
            } else {
              def = {
                events: value.events,
                getter: basis.getter(value.getter)
              };
            }
          }
        }
        binding[key] = def;
      }
    }
    var BINDING_PRESET = function() {
      var presets = {};
      var prefixRegExp = /^([a-z_][a-z0-9_]*):(.*)/i;
      return {
        add: function(prefix, func) {
          if (!presets[prefix]) {
            presets[prefix] = func;
          } else {
            basis.dev.warn("Preset `" + prefix + "` already exists, new definition ignored");
          }
        },
        process: function(key, value) {
          var preset;
          var m = value.match(prefixRegExp);
          if (m) {
            preset = presets[m[1]];
            value = m[2] || key;
          }
          return preset ? preset(value) : value;
        }
      };
    }();
    BINDING_PRESET.add("data", function(path) {
      return {
        events: "update",
        getter: "data." + path
      };
    });
    BINDING_PRESET.add("satellite", function(satelliteName) {
      return {
        events: "satelliteChanged",
        getter: function(node) {
          return node.satellite[satelliteName] ? node.satellite[satelliteName].element : null;
        }
      };
    });
    var TEMPLATE_BINDING = Class.customExtendProperty({
      active: {
        events: "activeChanged",
        getter: function(node) {
          return node.active;
        }
      },
      state: {
        events: "stateChanged",
        getter: function(node) {
          return String(node.state);
        }
      },
      childNodesState: {
        events: "childNodesStateChanged",
        getter: function(node) {
          return String(node.childNodesState);
        }
      },
      childCount: {
        events: "childNodesModified",
        getter: function(node) {
          return node.childNodes ? node.childNodes.length : 0;
        }
      },
      hasChildren: {
        events: "childNodesModified",
        getter: function(node) {
          return !!node.firstChild;
        }
      },
      empty: {
        events: "childNodesModified",
        getter: function(node) {
          return !node.firstChild;
        }
      }
    }, extendBinding);
    var BINDING_TEMPLATE_INTERFACE = {
      attach: function(object, handler, context) {
        object.addHandler(handler, context);
      },
      detach: function(object, handler, context) {
        object.removeHandler(handler, context);
      }
    };
    var TEMPLATE_ACTION = Class.extensibleProperty({
      select: function(event) {
        if (this.isDisabled()) return;
        if (this.selectedRA_) {
          basis.dev.warn("`selected` property is under bb-value and can't be changed by user action. Override `select` action to make your logic working.");
          return;
        }
        if (this.contextSelection && this.contextSelection.multiple) this.select(event.ctrlKey || event.metaKey); else this.select();
      }
    });
    var TEMPLATE_SWITCHER_HANDLER = {
      "*": function(event) {
        var switcher = this.templateSwitcher_;
        if (switcher && switcher.ruleEvents && switcher.ruleEvents[event.type]) this.setTemplate(switcher.resolve(this));
      }
    };
    var TEMPLATE = new HtmlTemplate("<div/>");
    var fragments = [];
    function getDocumentFragment() {
      return fragments.pop() || document.createDocumentFragment();
    }
    function reinsertPartitionNodes(partition) {
      var nodes = partition.nodes;
      if (nodes) for (var i = nodes.length - 1, child; child = nodes[i]; i--) child.parentNode.insertBefore(child, child.nextSibling);
    }
    var focusTimer;
    var TemplateMixin = function(super_) {
      return {
        template: TEMPLATE,
        emit_templateChanged: createEvent("templateChanged"),
        templateSwitcher_: null,
        binding: TEMPLATE_BINDING,
        action: TEMPLATE_ACTION,
        tmpl: null,
        element: null,
        childNodesElement: null,
        init: function() {
          this.element = this.childNodesElement = getDocumentFragment();
          super_.init.call(this);
        },
        postInit: function() {
          super_.postInit.call(this);
          var template = this.template;
          if (template) {
            var nodeDocumentFragment = this.childNodesElement;
            var bindingId = this.constructor.basisClassId_ + "_" + this.binding.bindingId;
            if (bindingId in unknownEventBindingCheck == false) {
              unknownEventBindingCheck[bindingId] = true;
              for (var bindName in this.binding) {
                var events = this.binding[bindName] && this.binding[bindName].events;
                if (events) {
                  events = String(events).trim().split(/\s+|\s*,\s*/);
                  for (var i = 0, eventName; eventName = events[i]; i++) if ("emit_" + eventName in this == false) basis.dev.warn("basis.ui: binding `" + bindName + "` has unknown event `" + eventName + "` for " + this.constructor.className);
                }
              }
            }
            this.template = null;
            this.setTemplate(template);
            fragments.push(nodeDocumentFragment);
            if (this.container) {
              this.container.appendChild(this.element);
              this.container = null;
            }
          }
          instances[this.basisObjectId] = this;
          notifier.set({
            action: "create",
            instance: this
          });
        },
        templateSync: function() {
          var oldElement = this.element;
          var tmpl = this.template.createInstance(this, this.templateAction, this.templateSync, this.binding, BINDING_TEMPLATE_INTERFACE);
          var noChildNodesElement;
          if (tmpl.childNodesHere) {
            tmpl.childNodesElement = tmpl.childNodesHere.parentNode;
            tmpl.childNodesElement.insertPoint = tmpl.childNodesHere;
          }
          this.tmpl = tmpl;
          this.element = tmpl.element;
          this.childNodesElement = tmpl.childNodesElement || tmpl.element;
          noChildNodesElement = this.childNodesElement.nodeType != 1;
          if (noChildNodesElement) this.childNodesElement = document.createDocumentFragment();
          if (noChildNodesElement) this.noChildNodesElement_ = true; else delete this.noChildNodesElement_;
          if (this.grouping) {
            this.grouping.syncDomRefs();
            var cursor = this;
            while (cursor.grouping) cursor = cursor.grouping;
            var topGrouping = cursor;
            for (var groupNode = topGrouping.lastChild; groupNode; groupNode = groupNode.previousSibling) {
              if (groupNode instanceof PartitionNode) topGrouping.insertBefore(groupNode, groupNode.nextSibling); else reinsertPartitionNodes(groupNode);
            }
            reinsertPartitionNodes(topGrouping.nullGroup);
          } else {
            for (var child = this.lastChild; child; child = child.previousSibling) this.insertBefore(child, child.nextSibling);
          }
          if (this instanceof PartitionNode) reinsertPartitionNodes(this);
          if (oldElement && oldElement !== this.element && oldElement.nodeType != 11) {
            var parentNode = oldElement && oldElement.parentNode;
            if (parentNode) {
              if (this.owner && this.owner.tmpl) this.owner.tmpl.set(oldElement, this.element);
              if (this.element.parentNode !== parentNode) parentNode.replaceChild(this.element, oldElement);
            }
          }
          this.emit_templateChanged();
        },
        setTemplate: function(template) {
          var curSwitcher = this.templateSwitcher_;
          var switcher;
          if (template instanceof TemplateSwitcher) {
            switcher = template;
            template = switcher.resolve(this);
          }
          if (template instanceof HtmlTemplate == false) template = null;
          if (!template) {
            basis.dev.warn("basis.ui.Node#setTemplate: set null to template possible only on node destroy");
            return;
          }
          if (switcher) {
            this.templateSwitcher_ = switcher;
            if (!curSwitcher) this.addHandler(TEMPLATE_SWITCHER_HANDLER, this);
          }
          if (curSwitcher && curSwitcher.resolve(this) !== template) {
            this.templateSwitcher_ = null;
            this.removeHandler(TEMPLATE_SWITCHER_HANDLER, this);
          }
          var oldTmpl = this.tmpl;
          var oldTemplate = this.template;
          if (oldTemplate !== template) {
            this.template = template;
            this.templateSync();
            if (oldTemplate) oldTemplate.clearInstance(oldTmpl);
          }
        },
        updateBind: function(bindName) {
          var binding = this.binding[bindName];
          var getter = binding && binding.getter;
          if (getter && this.tmpl) this.tmpl.set(bindName, getter(this));
        },
        templateAction: function(actionName, event) {
          var action = this.action[actionName];
          if (action) action.call(this, event);
          if (!action) basis.dev.warn("template call `" + actionName + "` action, but it isn't defined in action list");
        },
        focus: function(select) {
          var focusElement = this.tmpl ? this.tmpl.focus || this.element : null;
          if (focusElement) {
            if (focusTimer) focusTimer = basis.clearImmediate(focusTimer);
            focusTimer = basis.setImmediate(function() {
              try {
                focusElement.focus();
                if (select) focusElement.select();
              } catch (e) {}
            });
          }
        },
        blur: function() {
          var focusElement = this.tmpl ? this.tmpl.focus || this.element : null;
          if (focusElement) try {
            focusElement.blur();
          } catch (e) {}
        },
        destroy: function() {
          delete instances[this.basisObjectId];
          notifier.set({
            action: "destroy",
            instance: this
          });
          var template = this.template;
          var element = this.element;
          if (this.templateSwitcher_) {
            this.templateSwitcher_ = null;
            this.removeHandler(TEMPLATE_SWITCHER_HANDLER, this);
          }
          template.clearInstance(this.tmpl);
          super_.destroy.call(this);
          this.tmpl = null;
          this.element = null;
          this.childNodesElement = null;
          var parentNode = element && element.parentNode;
          if (parentNode && parentNode.nodeType == 1) parentNode.removeChild(element);
        }
      };
    };
    var ContainerTemplateMixin = function(super_) {
      return {
        insertBefore: function(newChild, refChild) {
          if (this.noChildNodesElement_) {
            delete this.noChildNodesElement_;
            basis.dev.warn("basis.ui: Template has no childNodesElement container, but insertBefore method called; probably it's a bug");
          }
          newChild = super_.insertBefore.call(this, newChild, refChild);
          var target = newChild.groupNode || this;
          var container = target.childNodesElement || this.childNodesElement;
          var nextSibling = newChild.nextSibling;
          var insertPoint = nextSibling && nextSibling.element.parentNode == container ? nextSibling.element : null;
          var childElement = newChild.element;
          var refNode = insertPoint || container.insertPoint || null;
          if (childElement.parentNode !== container || childElement.nextSibling !== refNode) container.insertBefore(childElement, refNode);
          return newChild;
        },
        removeChild: function(oldChild) {
          super_.removeChild.call(this, oldChild);
          var element = oldChild.element;
          var parent = element.parentNode;
          if (parent) parent.removeChild(element);
          return oldChild;
        },
        clear: function(alive) {
          if (alive) {
            var node = this.firstChild;
            while (node) {
              var element = node.element;
              var parent = element.parentNode;
              if (parent) parent.removeChild(element);
              node = node.nextSibling;
            }
          }
          super_.clear.call(this, alive);
        },
        setChildNodes: function(childNodes, keepAlive) {
          if (this.noChildNodesElement_) {
            delete this.noChildNodesElement_;
            basis.dev.warn("basis.ui: Template has no childNodesElement container, but setChildNodes method called; probably it's a bug");
          }
          var domFragment = document.createDocumentFragment();
          var target = this.grouping || this;
          var container = target.childNodesElement;
          target.childNodesElement = domFragment;
          super_.setChildNodes.call(this, childNodes, keepAlive);
          container.insertBefore(domFragment, container.insertPoint || null);
          target.childNodesElement = container;
        }
      };
    };
    var PartitionNode = Class(DWPartitionNode, TemplateMixin, {
      className: namespace + ".PartitionNode",
      binding: {
        title: "data:"
      }
    });
    var GroupingNode = Class(DWGroupingNode, ContainerTemplateMixin, {
      className: namespace + ".GroupingNode",
      childClass: PartitionNode,
      groupingClass: Class.SELF,
      element: null,
      childNodesElement: null,
      emit_ownerChanged: function(oldOwner) {
        this.syncDomRefs();
        DWGroupingNode.prototype.emit_ownerChanged.call(this, oldOwner);
      },
      init: function() {
        this.element = this.childNodesElement = document.createDocumentFragment();
        DWGroupingNode.prototype.init.call(this);
        instances[this.basisObjectId] = this;
        notifier.set({
          action: "create",
          instance: this
        });
      },
      syncDomRefs: function() {
        var cursor = this;
        var owner = this.owner;
        var element = null;
        if (owner) element = owner.tmpl && owner.tmpl.groupsElement || owner.childNodesElement;
        do {
          cursor.element = cursor.childNodesElement = element;
        } while (cursor = cursor.grouping);
      },
      destroy: function() {
        delete instances[this.basisObjectId];
        notifier.set({
          action: "destroy",
          instance: this
        });
        DWGroupingNode.prototype.destroy.call(this);
        this.element = null;
        this.childNodesElement = null;
      }
    });
    var Node = Class(DWNode, TemplateMixin, ContainerTemplateMixin, {
      className: namespace + ".Node",
      binding: {
        selected: {
          events: "select unselect",
          getter: function(node) {
            return node.selected;
          }
        },
        unselected: {
          events: "select unselect",
          getter: function(node) {
            return !node.selected;
          }
        },
        disabled: {
          events: "disable enable",
          getter: function(node) {
            return node.isDisabled();
          }
        },
        enabled: {
          events: "disable enable",
          getter: function(node) {
            return !node.isDisabled();
          }
        },
        tabindex: {
          events: "enable disable",
          getter: function(node) {
            return node.isDisabled() ? -1 : node.tabindex || 0;
          }
        }
      },
      childClass: Class.SELF,
      childFactory: function(config) {
        return new this.childClass(config);
      },
      groupingClass: GroupingNode
    });
    var ShadowNodeList = Node.subclass({
      className: namespace + ".ShadowNodeList",
      emit_ownerChanged: function(oldOwner) {
        Node.prototype.emit_ownerChanged.call(this, oldOwner);
        this.setDataSource(this.owner && this.owner.getChildNodesDataset());
      },
      getChildNodesElement: function(owner) {
        return owner.childNodesElement;
      },
      listen: {
        owner: {
          templateChanged: function() {
            this.childNodes.forEach(function(child) {
              this.appendChild(child.element);
            }, this.getChildNodesElement(this.owner) || this.owner.element);
          }
        }
      },
      childClass: {
        className: namespace + ".ShadowNode",
        getElement: function(node) {
          return node.element;
        },
        templateSync: function() {
          Node.prototype.templateSync.call(this);
          var newElement = this.getElement(this.delegate);
          if (newElement) {
            newElement[htmlTemplateIdMarker] = this.delegate.element[htmlTemplateIdMarker];
            this.element = newElement;
          }
        },
        listen: {
          delegate: {
            templateChanged: function() {
              var oldElement = this.element;
              var oldElementParent = oldElement.parentNode;
              var newElement = this.getElement(this.delegate);
              if (newElement) newElement[htmlTemplateIdMarker] = this.delegate.element[htmlTemplateIdMarker];
              this.element = newElement || this.tmpl.element;
              if (oldElementParent) oldElementParent.replaceChild(this.element, oldElement);
            }
          }
        }
      }
    });
    module.exports = {
      debug_notifier: notifier,
      debug_getInstances: function() {
        return basis.object.values(instances);
      },
      BINDING_PRESET: BINDING_PRESET,
      Node: Node,
      PartitionNode: PartitionNode,
      GroupingNode: GroupingNode,
      ShadowNodeList: ShadowNodeList,
      ShadowNode: ShadowNodeList.prototype.childClass
    };
  },
  "g.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var document = global.document;
    var computedStyle;
    if ("getComputedStyle" in global) {
      var GETCOMPUTEDSTYLE_BUGGY = {
        top: true,
        bottom: true,
        left: true,
        right: true,
        height: true,
        width: true
      };
      var testForBuggyProperties = basis.fn.runOnce(function() {
        var testElement = document.createElement("div");
        testElement.setAttribute("style", "position:absolute;top:auto!important");
        basis.doc.body.add(testElement);
        if (global.getComputedStyle(testElement).top == "auto") GETCOMPUTEDSTYLE_BUGGY = {};
        basis.doc.remove(testElement);
      });
      computedStyle = function(element, styleProp) {
        var style = global.getComputedStyle(element);
        var res;
        if (style) {
          if (styleProp in GETCOMPUTEDSTYLE_BUGGY) testForBuggyProperties();
          if (GETCOMPUTEDSTYLE_BUGGY[styleProp] && style.position != "static") {
            var display = element.style.display;
            element.style.display = "none";
            res = style.getPropertyValue(styleProp);
            element.style.display = display;
          } else {
            res = style.getPropertyValue(styleProp);
          }
          return res;
        }
      };
    } else {
      var VALUE_UNIT = /^-?(\d*\.)?\d+([a-z]+|%)?$/i;
      var IS_PIXEL = /\dpx$/i;
      var getPixelValue = function(element, value) {
        if (IS_PIXEL.test(value)) return parseInt(value, 10) + "px";
        var style = element.style;
        var runtimeStyle = element.runtimeStyle;
        var left = style.left;
        var runtimeLeft = runtimeStyle.left;
        runtimeStyle.left = element.currentStyle.left;
        style.left = value || 0;
        value = style.pixelLeft;
        style.left = left;
        runtimeStyle.left = runtimeLeft;
        return value + "px";
      };
      computedStyle = function(element, styleProp) {
        var style = element.currentStyle;
        if (style) {
          var value = style[styleProp == "float" ? "styleFloat" : basis.string.camelize(styleProp)];
          var unit = (value || "").match(VALUE_UNIT);
          if (unit && unit[2] && unit[2] != "px") value = getPixelValue(element, value);
          return value;
        }
      };
    }
    module.exports = {
      get: computedStyle
    };
  },
  "h.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var document = global.document;
    var documentElement = document.documentElement;
    var getComputedStyle = basis.require("./g.js").get;
    var standartsMode = document.compatMode == "CSS1Compat";
    function getOffsetParent(node) {
      var offsetParent = node.offsetParent || documentElement;
      while (offsetParent && offsetParent !== documentElement && getComputedStyle(offsetParent, "position") == "static") offsetParent = offsetParent.offsetParent;
      return offsetParent || documentElement;
    }
    function getOffset(element) {
      var top = 0;
      var left = 0;
      if (element && element.getBoundingClientRect) {
        var relRect = element.getBoundingClientRect();
        top = -relRect.top;
        left = -relRect.left;
      } else {
        if (standartsMode) {
          top = global.pageYOffset || documentElement.scrollTop;
          left = global.pageXOffset || documentElement.scrollLeft;
        } else {
          var body = document.body;
          if (element !== body) {
            top = body.scrollTop - body.clientTop;
            left = body.scrollLeft - body.clientLeft;
          }
        }
      }
      return {
        left: left,
        top: top
      };
    }
    function getTopLeftPoint(element, relElement) {
      var left = 0;
      var top = 0;
      var offset = getOffset(relElement);
      if (element && element.getBoundingClientRect) {
        var box = element.getBoundingClientRect();
        top = box.top;
        left = box.left;
      }
      return {
        top: top + offset.top,
        left: left + offset.left
      };
    }
    function getBoundingRect(element, relElement) {
      var top = 0;
      var left = 0;
      var right = 0;
      var bottom = 0;
      var offset = getOffset(relElement);
      if (element && element.getBoundingClientRect) {
        var rect = element.getBoundingClientRect();
        top = rect.top;
        left = rect.left;
        right = rect.right;
        bottom = rect.bottom;
      }
      return {
        top: top + offset.top,
        left: left + offset.left,
        right: right + offset.left,
        bottom: bottom + offset.top,
        width: right - left,
        height: bottom - top
      };
    }
    function getViewportRect(element, relElement) {
      var topViewport = standartsMode ? document.documentElement : document.body;
      var point = element === topViewport && !relElement ? getOffset() : getTopLeftPoint(element, relElement);
      var top = point.top;
      var left = point.left;
      var width;
      var height;
      if (!element || element === global) {
        width = global.innerWidth || 0;
        height = global.innerHeight || 0;
      } else {
        top += element.clientTop;
        left += element.clientLeft;
        width = element.clientWidth;
        height = element.clientHeight;
      }
      return {
        top: top,
        left: left,
        right: left + width,
        bottom: top + height,
        width: width,
        height: height
      };
    }
    module.exports = {
      getOffset: getOffset,
      getOffsetParent: getOffsetParent,
      getTopLeftPoint: getTopLeftPoint,
      getBoundingRect: getBoundingRect,
      getViewportRect: getViewportRect
    };
  },
  "i.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var Class = basis.Class;
    var extend = basis.object.extend;
    var values = basis.object.values;
    var objectSlice = basis.object.slice;
    var arrayAdd = basis.array.add;
    var arrayRemove = basis.array.remove;
    var getter = basis.getter;
    var $self = basis.fn.$self;
    var $true = basis.fn.$true;
    var $false = basis.fn.$false;
    var $undef = basis.fn.$undef;
    var arrayFrom = basis.array.from;
    var basisEvent = basis.require("./2.js");
    var createEvent = basisEvent.create;
    var createEventHandler = basisEvent.createHandler;
    var Emitter = basisEvent.Emitter;
    var basisData = basis.require("./e.js");
    var SUBSCRIPTION = basisData.SUBSCRIPTION;
    var Value = basisData.Value;
    var DataObject = basisData.Object;
    var KeyObjectMap = basisData.KeyObjectMap;
    var ReadOnlyDataset = basisData.ReadOnlyDataset;
    var Dataset = basisData.Dataset;
    var DatasetWrapper = basisData.DatasetWrapper;
    var resolveDataset = basisData.resolveDataset;
    var setAccumulateState = Dataset.setAccumulateState;
    SUBSCRIPTION.add("SOURCE", {
      sourceChanged: function(object, oldSource) {
        if (oldSource) SUBSCRIPTION.unlink("source", object, oldSource);
        if (object.source) SUBSCRIPTION.link("source", object, object.source);
      },
      sourcesChanged: function(object, delta) {
        var array;
        if (array = delta.inserted) for (var i = 0, item; item = array[i]; i++) SUBSCRIPTION.link("source", object, array[i]);
        if (array = delta.deleted) for (var i = 0, item; item = array[i]; i++) SUBSCRIPTION.unlink("source", object, array[i]);
      }
    }, function(action, object) {
      var sources = object.sources || (object.source ? [ object.source ] : []);
      for (var i = 0, source; source = sources[i++]; ) action("source", object, source);
    });
    SUBSCRIPTION.addProperty("minuend");
    SUBSCRIPTION.addProperty("subtrahend");
    function getDelta(inserted, deleted) {
      var delta = {};
      var result;
      if (inserted && inserted.length) result = delta.inserted = inserted;
      if (deleted && deleted.length) result = delta.deleted = deleted;
      if (result) return delta;
    }
    function createRuleEvents(fn, events) {
      return function createRuleEventsExtend(events) {
        if (!events) return null;
        if (events.__extend__) return events;
        if (typeof events != "string" && !Array.isArray(events)) events = null;
        return extend(createEventHandler(events, fn), {
          __extend__: createRuleEventsExtend
        });
      }(events);
    }
    function createKeyMap(config, keyGetter, ItemClass, SubsetClass) {
      return new KeyObjectMap(extend({
        keyGetter: keyGetter,
        itemClass: ItemClass,
        create: function(key, object) {
          var datasetWrapper = KeyObjectMap.prototype.create.call(this, key, object);
          datasetWrapper.ruleValue = key;
          datasetWrapper.setDataset(new SubsetClass({
            ruleValue: key
          }));
          return datasetWrapper;
        }
      }, config));
    }
    var MERGE_DATASET_HANDLER = {
      itemsChanged: function(source, delta) {
        var memberMap = this.members_;
        var updated = {};
        var object;
        var objectId;
        if (delta.inserted) {
          for (var i = 0; object = delta.inserted[i]; i++) {
            objectId = object.basisObjectId;
            if (memberMap[objectId]) {
              memberMap[objectId].count++;
            } else {
              memberMap[objectId] = {
                count: 1,
                object: object
              };
            }
            updated[objectId] = memberMap[objectId];
          }
        }
        if (delta.deleted) {
          for (var i = 0; object = delta.deleted[i]; i++) {
            objectId = object.basisObjectId;
            updated[objectId] = memberMap[objectId];
            memberMap[objectId].count--;
          }
        }
        this.applyRule(updated);
      }
    };
    var Merge = Class(ReadOnlyDataset, {
      className: namespace + ".Merge",
      active: basis.PROXY,
      subscribeTo: SUBSCRIPTION.SOURCE,
      emit_sourcesChanged: createEvent("sourcesChanged", "delta"),
      sources: null,
      sourceValues_: null,
      sourcesMap_: null,
      sourceDelta_: null,
      rule: function(count) {
        return count > 0;
      },
      emit_ruleChanged: createEvent("ruleChanged", "oldRule"),
      listen: {
        source: MERGE_DATASET_HANDLER,
        sourceValue: {
          destroy: function(sender) {
            this.removeSource(sender);
          }
        }
      },
      init: function() {
        ReadOnlyDataset.prototype.init.call(this);
        var sources = this.sources;
        this.sources = [];
        this.sourcesMap_ = {};
        this.sourceValues_ = [];
        if (sources) this.setSources(sources);
      },
      setRule: function(rule) {
        rule = getter(rule || Merge.UNION);
        if (this.rule !== rule) {
          var oldRule = this.rule;
          this.rule = rule;
          this.emit_ruleChanged(oldRule);
          return this.applyRule();
        }
      },
      applyRule: function(scope) {
        var memberMap = this.members_;
        var rule = this.rule;
        var sourceCount = this.sources.length;
        var inserted = [];
        var deleted = [];
        var memberCounter;
        var isMember;
        var delta;
        if (!scope) scope = memberMap;
        for (var objectId in scope) {
          memberCounter = memberMap[objectId];
          isMember = sourceCount && memberCounter.count && rule(memberCounter.count, sourceCount);
          if (isMember != objectId in this.items_) {
            if (isMember) inserted.push(memberCounter.object); else deleted.push(memberCounter.object);
          }
          if (memberCounter.count == 0) delete memberMap[objectId];
        }
        if (delta = getDelta(inserted, deleted)) this.emit_itemsChanged(delta);
        return delta;
      },
      addDataset_: function(dataset) {
        this.sources.push(dataset);
        if (this.listen.source) dataset.addHandler(this.listen.source, this);
        var memberMap = this.members_;
        for (var objectId in dataset.items_) {
          if (memberMap[objectId]) {
            memberMap[objectId].count++;
          } else {
            memberMap[objectId] = {
              count: 1,
              object: dataset.items_[objectId]
            };
          }
        }
        return true;
      },
      removeDataset_: function(dataset) {
        arrayRemove(this.sources, dataset);
        if (this.listen.source) dataset.removeHandler(this.listen.source, this);
        var memberMap = this.members_;
        for (var objectId in dataset.items_) memberMap[objectId].count--;
      },
      updateDataset_: function(source) {
        var merge = this.owner;
        var sourcesMap_ = merge.sourcesMap_;
        var dataset = resolveDataset(this, merge.updateDataset_, source, "adapter", merge);
        var inserted;
        var deleted;
        var delta;
        if (this.dataset === dataset) return;
        if (dataset) {
          var count = (sourcesMap_[dataset.basisObjectId] || 0) + 1;
          sourcesMap_[dataset.basisObjectId] = count;
          if (count == 1) {
            merge.addDataset_(dataset);
            inserted = [ dataset ];
          }
        }
        if (this.dataset) {
          var count = (sourcesMap_[this.dataset.basisObjectId] || 0) - 1;
          sourcesMap_[this.dataset.basisObjectId] = count;
          if (count == 0) {
            merge.removeDataset_(this.dataset);
            deleted = [ this.dataset ];
          }
        }
        this.dataset = dataset;
        merge.applyRule();
        if (delta = getDelta(inserted, deleted)) {
          var setSourcesTransaction = merge.sourceDelta_;
          if (setSourcesTransaction) {
            if (delta.inserted) delta.inserted.forEach(function(item) {
              if (!arrayRemove(this.deleted, item)) arrayAdd(this.inserted, item);
            }, setSourcesTransaction);
            if (delta.deleted) delta.deleted.forEach(function(item) {
              if (!arrayRemove(this.inserted, item)) arrayAdd(this.deleted, item);
            }, setSourcesTransaction);
          } else {
            merge.emit_sourcesChanged(delta);
          }
        }
        return delta;
      },
      getSourceValues: function() {
        return this.sourceValues_.map(function(item) {
          return item.source;
        });
      },
      addSource: function(source) {
        if (!source || typeof source != "object" && typeof source != "function") {
          basis.dev.warn(this.constructor.className + ".addSource: value should be a dataset instance or to be able to resolve in dataset");
          return;
        }
        if (this.hasSource(source)) {
          basis.dev.warn(this.constructor.className + ".addSource: value is already in source list");
          return;
        }
        var sourceInfo = {
          owner: this,
          source: source,
          adapter: null,
          dataset: null
        };
        this.sourceValues_.push(sourceInfo);
        this.updateDataset_.call(sourceInfo, source);
        if (this.listen.sourceValue && source instanceof Emitter) source.addHandler(this.listen.sourceValue, this);
      },
      removeSource: function(source) {
        for (var i = 0, sourceInfo; sourceInfo = this.sourceValues_[i]; i++) if (sourceInfo.source === source) {
          if (this.listen.sourceValue && source instanceof Emitter) source.removeHandler(this.listen.sourceValue, this);
          this.updateDataset_.call(sourceInfo, null);
          this.sourceValues_.splice(i, 1);
          return;
        }
        basis.dev.warn(this.constructor.className + ".removeSource: source value isn't found in source list");
      },
      hasSource: function(source) {
        for (var i = 0, sourceInfo; sourceInfo = this.sourceValues_[i]; i++) if (sourceInfo.source === source) return true;
        return false;
      },
      setSources: function(sources) {
        var exists = this.sourceValues_.map(function(sourceInfo) {
          return sourceInfo.source;
        });
        var inserted = [];
        var deleted = [];
        var delta;
        if (!sources) sources = [];
        this.sourceDelta_ = {
          inserted: inserted,
          deleted: deleted
        };
        for (var i = 0; i < sources.length; i++) {
          var source = sources[i];
          if (!arrayRemove(exists, source)) this.addSource(source);
        }
        exists.forEach(this.removeSource, this);
        this.sourceDelta_ = null;
        if (delta = getDelta(inserted, deleted)) this.emit_sourcesChanged(delta);
        return delta;
      },
      destroy: function() {
        this.setSources();
        ReadOnlyDataset.prototype.destroy.call(this);
        this.sourceValues_ = null;
        this.sourcesMap_ = null;
        this.sourceDelta_ = null;
        this.sources = null;
      }
    });
    Merge.UNION = Merge.prototype.rule;
    Merge.INTERSECTION = function(count, sourceCount) {
      return count == sourceCount;
    };
    Merge.DIFFERENCE = function(count) {
      return count == 1;
    };
    Merge.MORE_THAN_ONE_INCLUDE = function(count, sourceCount) {
      return sourceCount == 1 || count > 1;
    };
    Merge.AT_LEAST_ONE_EXCLUDE = function(count, sourceCount) {
      return sourceCount == 1 || count < sourceCount;
    };
    var datasetAbsentFilter = function(item) {
      return !this.has(item);
    };
    var SUBTRACTDATASET_MINUEND_HANDLER = {
      itemsChanged: function(dataset, delta) {
        if (!this.subtrahend) return;
        var newDelta = getDelta(delta.inserted && delta.inserted.filter(datasetAbsentFilter, this.subtrahend), delta.deleted && delta.deleted.filter(this.has, this));
        if (newDelta) this.emit_itemsChanged(newDelta);
      },
      destroy: function() {
        if (!this.minuendRA_) this.setMinuend(null);
      }
    };
    var SUBTRACTDATASET_SUBTRAHEND_HANDLER = {
      itemsChanged: function(dataset, delta) {
        if (!this.minuend) return;
        var newDelta = getDelta(delta.deleted && delta.deleted.filter(this.minuend.has, this.minuend), delta.inserted && delta.inserted.filter(this.has, this));
        if (newDelta) this.emit_itemsChanged(newDelta);
      },
      destroy: function() {
        if (!this.subtrahendRA_) this.setSubtrahend(null);
      }
    };
    var Subtract = Class(ReadOnlyDataset, {
      className: namespace + ".Subtract",
      active: basis.PROXY,
      subscribeTo: SUBSCRIPTION.MINUEND + SUBSCRIPTION.SUBTRAHEND,
      minuend: null,
      minuendRA_: null,
      emit_minuendChanged: createEvent("minuendChanged", "oldMinuend"),
      subtrahend: null,
      subtrahendRA_: null,
      emit_subtrahendChanged: createEvent("subtrahendChanged", "oldSubtrahend"),
      listen: {
        minuend: SUBTRACTDATASET_MINUEND_HANDLER,
        subtrahend: SUBTRACTDATASET_SUBTRAHEND_HANDLER
      },
      init: function() {
        ReadOnlyDataset.prototype.init.call(this);
        var minuend = this.minuend;
        var subtrahend = this.subtrahend;
        this.minuend = null;
        this.subtrahend = null;
        if (minuend || subtrahend) this.setOperands(minuend, subtrahend);
      },
      setOperands: function(minuend, subtrahend) {
        var delta;
        var operandsChanged = false;
        minuend = resolveDataset(this, this.setMinuend, minuend, "minuendRA_");
        subtrahend = resolveDataset(this, this.setSubtrahend, subtrahend, "subtrahendRA_");
        var oldMinuend = this.minuend;
        var oldSubtrahend = this.subtrahend;
        if (oldMinuend !== minuend) {
          operandsChanged = true;
          this.minuend = minuend;
          var listenHandler = this.listen.minuend;
          if (listenHandler) {
            if (oldMinuend) oldMinuend.removeHandler(listenHandler, this);
            if (minuend) minuend.addHandler(listenHandler, this);
          }
          this.emit_minuendChanged(oldMinuend);
        }
        if (oldSubtrahend !== subtrahend) {
          operandsChanged = true;
          this.subtrahend = subtrahend;
          var listenHandler = this.listen.subtrahend;
          if (listenHandler) {
            if (oldSubtrahend) oldSubtrahend.removeHandler(listenHandler, this);
            if (subtrahend) subtrahend.addHandler(listenHandler, this);
          }
          this.emit_subtrahendChanged(oldSubtrahend);
        }
        if (!operandsChanged) return false;
        if (!minuend || !subtrahend) {
          if (this.itemCount) this.emit_itemsChanged(delta = {
            deleted: this.getItems()
          });
        } else {
          var deleted = [];
          var inserted = [];
          for (var key in this.items_) if (!minuend.items_[key] || subtrahend.items_[key]) deleted.push(this.items_[key]);
          for (var key in minuend.items_) if (!this.items_[key] && !subtrahend.items_[key]) inserted.push(minuend.items_[key]);
          if (delta = getDelta(inserted, deleted)) this.emit_itemsChanged(delta);
        }
        return delta;
      },
      setMinuend: function(minuend) {
        return this.setOperands(minuend, this.subtrahendRA_ ? this.subtrahendRA_.source : this.subtrahend);
      },
      setSubtrahend: function(subtrahend) {
        return this.setOperands(this.minuendRA_ ? this.minuendRA_.source : this.minuend, subtrahend);
      },
      destroy: function() {
        this.setOperands();
        ReadOnlyDataset.prototype.destroy.call(this);
      }
    });
    var SourceDataset = Class(ReadOnlyDataset, {
      className: namespace + ".SourceDataset",
      active: basis.PROXY,
      subscribeTo: SUBSCRIPTION.SOURCE,
      source: null,
      emit_sourceChanged: createEvent("sourceChanged", "oldSource"),
      sourceRA_: null,
      sourceMap_: null,
      listen: {
        source: {
          destroy: function() {
            if (!this.sourceRA_) this.setSource();
          }
        }
      },
      init: function() {
        var source = this.source;
        this.source = null;
        this.sourceMap_ = {};
        ReadOnlyDataset.prototype.init.call(this);
        if (source) this.setSource(source);
      },
      setSource: function(source) {
        source = resolveDataset(this, this.setSource, source, "sourceRA_");
        if (this.source !== source) {
          var oldSource = this.source;
          var listenHandler = this.listen.source;
          var itemsChangedHandler;
          if (listenHandler) {
            itemsChangedHandler = listenHandler.itemsChanged;
            if (oldSource) oldSource.removeHandler(listenHandler, this);
            if (source) source.addHandler(listenHandler, this);
          }
          this.source = source;
          this.emit_sourceChanged(oldSource);
          if (itemsChangedHandler) {
            Dataset.setAccumulateState(true);
            if (oldSource) itemsChangedHandler.call(this, oldSource, {
              deleted: oldSource.getItems()
            });
            if (source) itemsChangedHandler.call(this, source, {
              inserted: source.getItems()
            });
            Dataset.setAccumulateState(false);
          }
        }
      },
      destroy: function() {
        this.setSource();
        ReadOnlyDataset.prototype.destroy.call(this);
        this.sourceMap_ = null;
      }
    });
    var MAPFILTER_SOURCEOBJECT_UPDATE = function(sourceObject) {
      var newMember = this.map ? this.map(sourceObject) : sourceObject;
      if (newMember instanceof DataObject == false || this.filter(newMember)) newMember = null;
      var sourceMap = this.sourceMap_[sourceObject.basisObjectId];
      var curMember = sourceMap.member;
      if (curMember !== newMember) {
        var memberMap = this.members_;
        var delta;
        var inserted;
        var deleted;
        sourceMap.member = newMember;
        if (curMember) {
          var curMemberId = curMember.basisObjectId;
          if (this.removeMemberRef) this.removeMemberRef(curMember, sourceObject);
          if (--memberMap[curMemberId] == 0) {
            delete memberMap[curMemberId];
            deleted = [ curMember ];
          }
        }
        if (newMember) {
          var newMemberId = newMember.basisObjectId;
          if (this.addMemberRef) this.addMemberRef(newMember, sourceObject);
          if (memberMap[newMemberId]) {
            memberMap[newMemberId]++;
          } else {
            memberMap[newMemberId] = 1;
            inserted = [ newMember ];
          }
        }
        if (delta = getDelta(inserted, deleted)) this.emit_itemsChanged(delta);
      }
    };
    var MAPFILTER_SOURCE_HANDLER = {
      itemsChanged: function(source, delta) {
        var sourceMap = this.sourceMap_;
        var memberMap = this.members_;
        var inserted = [];
        var deleted = [];
        var sourceObject;
        var sourceObjectId;
        var member;
        var updateHandler = this.ruleEvents;
        setAccumulateState(true);
        if (delta.inserted) {
          for (var i = 0; sourceObject = delta.inserted[i]; i++) {
            member = this.map ? this.map(sourceObject) : sourceObject;
            if (member instanceof DataObject == false || this.filter(member)) member = null;
            if (updateHandler) sourceObject.addHandler(updateHandler, this);
            sourceMap[sourceObject.basisObjectId] = {
              sourceObject: sourceObject,
              member: member
            };
            if (member) {
              var memberId = member.basisObjectId;
              if (memberMap[memberId]) {
                memberMap[memberId]++;
              } else {
                memberMap[memberId] = 1;
                inserted.push(member);
              }
              if (this.addMemberRef) this.addMemberRef(member, sourceObject);
            }
          }
        }
        if (delta.deleted) {
          for (var i = 0; sourceObject = delta.deleted[i]; i++) {
            sourceObjectId = sourceObject.basisObjectId;
            member = sourceMap[sourceObjectId].member;
            if (updateHandler) sourceObject.removeHandler(updateHandler, this);
            delete sourceMap[sourceObjectId];
            if (member) {
              var memberId = member.basisObjectId;
              if (--memberMap[memberId] == 0) {
                delete memberMap[memberId];
                deleted.push(member);
              }
              if (this.removeMemberRef) this.removeMemberRef(member, sourceObject);
            }
          }
        }
        setAccumulateState(false);
        if (delta = getDelta(inserted, deleted)) this.emit_itemsChanged(delta);
      }
    };
    var MapFilter = Class(SourceDataset, {
      className: namespace + ".MapFilter",
      map: $self,
      filter: $false,
      rule: getter($true),
      emit_ruleChanged: createEvent("ruleChanged", "oldRule"),
      ruleEvents: createRuleEvents(MAPFILTER_SOURCEOBJECT_UPDATE, "update"),
      addMemberRef: null,
      removeMemberRef: null,
      listen: {
        source: MAPFILTER_SOURCE_HANDLER
      },
      setMap: function(map) {
        if (typeof map != "function") map = $self;
        if (this.map !== map) {
          this.map = map;
          return this.applyRule();
        }
      },
      setFilter: function(filter) {
        if (typeof filter != "function") filter = $false;
        if (this.filter !== filter) {
          this.filter = filter;
          return this.applyRule();
        }
      },
      setRule: function(rule) {
        rule = getter(rule || $true);
        if (this.rule !== rule) {
          var oldRule = this.rule;
          this.rule = rule;
          this.emit_ruleChanged(oldRule);
          return this.applyRule();
        }
      },
      applyRule: function() {
        var sourceMap = this.sourceMap_;
        var memberMap = this.members_;
        var curMember;
        var newMember;
        var curMemberId;
        var newMemberId;
        var sourceObject;
        var sourceObjectInfo;
        var inserted = [];
        var deleted = [];
        var delta;
        for (var sourceObjectId in sourceMap) {
          sourceObjectInfo = sourceMap[sourceObjectId];
          sourceObject = sourceObjectInfo.sourceObject;
          curMember = sourceObjectInfo.member;
          newMember = this.map ? this.map(sourceObject) : sourceObject;
          if (newMember instanceof DataObject == false || this.filter(newMember)) newMember = null;
          if (curMember != newMember) {
            sourceObjectInfo.member = newMember;
            if (curMember) {
              curMemberId = curMember.basisObjectId;
              if (this.removeMemberRef) this.removeMemberRef(curMember, sourceObject);
              memberMap[curMemberId]--;
            }
            if (newMember) {
              newMemberId = newMember.basisObjectId;
              if (this.addMemberRef) this.addMemberRef(newMember, sourceObject);
              if (newMemberId in memberMap) {
                memberMap[newMemberId]++;
              } else {
                memberMap[newMemberId] = 1;
                inserted.push(newMember);
              }
            }
          }
        }
        for (curMemberId in this.items_) if (memberMap[curMemberId] == 0) {
          delete memberMap[curMemberId];
          deleted.push(this.items_[curMemberId]);
        }
        if (delta = getDelta(inserted, deleted)) this.emit_itemsChanged(delta);
        return delta;
      }
    });
    var Filter = Class(MapFilter, {
      className: namespace + ".Filter",
      filter: function(object) {
        return !this.rule(object);
      }
    });
    var Split = Class(MapFilter, {
      className: namespace + ".Split",
      subsetClass: ReadOnlyDataset,
      subsetWrapperClass: DatasetWrapper,
      keyMap: null,
      map: function(sourceObject) {
        return this.keyMap.resolve(sourceObject);
      },
      rule: getter($undef),
      setRule: function(rule) {
        rule = getter(rule || $undef);
        if (this.rule !== rule) {
          var oldRule = this.rule;
          this.rule = rule;
          this.keyMap.keyGetter = rule;
          this.emit_ruleChanged(oldRule);
          return this.applyRule();
        }
      },
      addMemberRef: function(wrapper, sourceObject) {
        wrapper.dataset.emit_itemsChanged({
          inserted: [ sourceObject ]
        });
      },
      removeMemberRef: function(wrapper, sourceObject) {
        wrapper.dataset.emit_itemsChanged({
          deleted: [ sourceObject ]
        });
      },
      init: function() {
        if (!this.keyMap || this.keyMap instanceof KeyObjectMap == false) this.keyMap = createKeyMap(this.keyMap, this.rule, this.subsetWrapperClass, this.subsetClass);
        MapFilter.prototype.init.call(this);
      },
      getSubset: function(data, autocreate) {
        return this.keyMap.get(data, autocreate);
      },
      destroy: function() {
        MapFilter.prototype.destroy.call(this);
        this.keyMap.destroy();
        this.keyMap = null;
      }
    });
    function binarySearchPos(array, map) {
      if (!array.length) return 0;
      var value = map.value;
      var id = map.object.basisObjectId;
      var cmpValue;
      var cmpId;
      var pos;
      var item;
      var l = 0;
      var r = array.length - 1;
      do {
        pos = l + r >> 1;
        item = array[pos];
        cmpValue = item.value;
        if (value < cmpValue) r = pos - 1; else if (value > cmpValue) l = pos + 1; else {
          cmpId = item.object.basisObjectId;
          if (id < cmpId) r = pos - 1; else if (id > cmpId) l = pos + 1; else return pos;
        }
      } while (l <= r);
      return pos + (cmpValue == value ? cmpId < id : cmpValue < value);
    }
    var SLICE_SOURCEOBJECT_UPDATE = function(sourceObject) {
      var sourceObjectInfo = this.sourceMap_[sourceObject.basisObjectId];
      var newValue = this.rule(sourceObject);
      var index = this.index_;
      if (newValue !== sourceObjectInfo.value) {
        var pos = binarySearchPos(index, sourceObjectInfo);
        var prev = index[pos - 1];
        var next = index[pos + 1];
        sourceObjectInfo.value = newValue;
        if (prev && (prev.value > newValue || prev.value == newValue && prev.object.basisObjectId > sourceObjectInfo.object.basisObjectId) || next && (next.value < newValue || next.value == newValue && next.object.basisObjectId < sourceObjectInfo.object.basisObjectId)) {
          index.splice(pos, 1);
          index.splice(binarySearchPos(index, sourceObjectInfo), 0, sourceObjectInfo);
          this.applyRule();
        }
      }
    };
    function sliceIndexSort(a, b) {
      return +(a.value > b.value) || -(a.value < b.value) || a.object.basisObjectId - b.object.basisObjectId;
    }
    var SLICE_SOURCE_HANDLER = {
      itemsChanged: function(source, delta) {
        var sourceMap = this.sourceMap_;
        var index = this.index_;
        var updateHandler = this.ruleEvents;
        var dropIndex = false;
        var buildIndex = false;
        var sourceObjectInfo;
        var inserted = delta.inserted;
        var deleted = delta.deleted;
        if (deleted) {
          if (deleted.length > index.length - deleted.length) {
            dropIndex = true;
            buildIndex = deleted.length != index.length;
            index.length = 0;
          }
          for (var i = 0, sourceObject; sourceObject = deleted[i]; i++) {
            if (!dropIndex) {
              sourceObjectInfo = sourceMap[sourceObject.basisObjectId];
              index.splice(binarySearchPos(index, sourceObjectInfo), 1);
            }
            delete sourceMap[sourceObject.basisObjectId];
            if (updateHandler) sourceObject.removeHandler(updateHandler, this);
          }
          if (buildIndex) for (var key in sourceMap) {
            sourceObjectInfo = sourceMap[key];
            index.splice(binarySearchPos(index, sourceObjectInfo), 0, sourceObjectInfo);
          }
        }
        if (inserted) {
          buildIndex = !index.length;
          for (var i = 0, sourceObject; sourceObject = inserted[i]; i++) {
            sourceObjectInfo = {
              object: sourceObject,
              value: this.rule(sourceObject)
            };
            sourceMap[sourceObject.basisObjectId] = sourceObjectInfo;
            if (!buildIndex) index.splice(binarySearchPos(index, sourceObjectInfo), 0, sourceObjectInfo); else index.push(sourceObjectInfo);
            if (updateHandler) sourceObject.addHandler(updateHandler, this);
          }
          if (buildIndex) index.sort(sliceIndexSort);
        }
        this.applyRule();
      }
    };
    var Slice = Class(SourceDataset, {
      className: namespace + ".Slice",
      rule: getter($true),
      emit_ruleChanged: createEvent("ruleChanged", "oldRule", "oldOrderDesc"),
      ruleEvents: createRuleEvents(SLICE_SOURCEOBJECT_UPDATE, "update"),
      index_: null,
      left_: null,
      right_: null,
      orderDesc: false,
      offset: 0,
      limit: 10,
      listen: {
        source: SLICE_SOURCE_HANDLER
      },
      emit_rangeChanged: createEvent("rangeChanged", "oldOffset", "oldLimit"),
      init: function() {
        this.index_ = [];
        SourceDataset.prototype.init.call(this);
      },
      setRange: function(offset, limit) {
        var oldOffset = this.offset;
        var oldLimit = this.limit;
        var delta = false;
        if (oldOffset != offset || oldLimit != limit) {
          this.offset = offset;
          this.limit = limit;
          delta = this.applyRule();
          this.emit_rangeChanged(oldOffset, oldLimit);
        }
        return delta;
      },
      setOffset: function(offset) {
        return this.setRange(offset, this.limit);
      },
      setLimit: function(limit) {
        return this.setRange(this.offset, limit);
      },
      setRule: function(rule, orderDesc) {
        rule = getter(rule || $true);
        orderDesc = !!orderDesc;
        if (this.rule != rule || this.orderDesc != orderDesc) {
          var oldRule = this.rule;
          var oldOrderDesc = this.orderDesc;
          if (this.rule != rule) {
            var index = this.index_;
            for (var i = 0; i < index.length; i++) index[i].value = rule(index[i].object);
            index.sort(sliceIndexSort);
            this.rule = rule;
          }
          this.orderDesc = orderDesc;
          this.rule = rule;
          this.emit_ruleChanged(oldRule, oldOrderDesc);
          return this.applyRule();
        }
      },
      applyRule: function() {
        var start = this.offset;
        var end = start + this.limit;
        if (this.orderDesc) {
          start = this.index_.length - end;
          end = start + this.limit;
        }
        var curSet = objectSlice(this.members_);
        var newSet = this.index_.slice(Math.max(0, start), Math.max(0, end));
        var inserted = [];
        var delta;
        for (var i = 0, item; item = newSet[i]; i++) {
          var objectId = item.object.basisObjectId;
          if (curSet[objectId]) delete curSet[objectId]; else {
            inserted.push(item.object);
            this.members_[objectId] = item.object;
          }
        }
        for (var objectId in curSet) delete this.members_[objectId];
        if (this.left_) for (var offset in this.left_) {
          var item = this.index_[this.orderDesc ? end + Number(offset) - 1 : start - Number(offset)];
          this.left_[offset].set(item ? item.object : null);
        }
        if (this.right_) for (var offset in this.right_) {
          var item = this.index_[this.orderDesc ? start - Number(offset) : end + Number(offset) - 1];
          this.right_[offset].set(item ? item.object : null);
        }
        if (delta = getDelta(inserted, values(curSet))) this.emit_itemsChanged(delta);
        return delta;
      },
      left: function(offset) {
        offset = parseInt(offset, 10) || 0;
        if (!this.left_) this.left_ = {};
        var value = this.left_[offset];
        if (!value) {
          var start = this.offset;
          var end = start + this.limit;
          if (this.orderDesc) {
            start = this.index_.length - end;
            end = start + this.limit;
          }
          var item = this.index_[this.orderDesc ? end + offset - 1 : start - offset];
          value = this.left_[offset] = new Value({
            value: item ? item.object : null
          });
        }
        return value;
      },
      right: function(offset) {
        offset = parseInt(offset, 10) || 0;
        if (!this.right_) this.right_ = {};
        var value = this.right_[offset];
        if (!value) {
          var start = this.offset;
          var end = start + this.limit;
          if (this.orderDesc) {
            start = this.index_.length - end;
            end = start + this.limit;
          }
          var item = this.index_[this.orderDesc ? start - offset : end + offset - 1];
          value = this.right_[offset] = new Value({
            value: item ? item.object : null
          });
        }
        return value;
      },
      destroy: function() {
        SourceDataset.prototype.destroy.call(this);
        if (this.left_) {
          for (var offset in this.left_) this.left_[offset].destroy();
          this.left_ = null;
        }
        if (this.right_) {
          for (var offset in this.right_) this.right_[offset].destroy();
          this.right_ = null;
        }
        this.index_ = null;
      }
    });
    var CLOUD_SOURCEOBJECT_UPDATE = function(sourceObject) {
      var sourceMap = this.sourceMap_;
      var memberMap = this.members_;
      var sourceObjectId = sourceObject.basisObjectId;
      var oldList = sourceMap[sourceObjectId].list;
      var newList = sourceMap[sourceObjectId].list = {};
      var list = this.rule(sourceObject);
      var delta;
      var inserted = [];
      var deleted = [];
      var subset;
      if (Array.isArray(list)) for (var j = 0; j < list.length; j++) {
        subset = this.keyMap.get(list[j], true);
        if (subset && !subset.has(sourceObject)) {
          subsetId = subset.basisObjectId;
          newList[subsetId] = subset;
          if (!oldList[subsetId]) {
            subset.dataset.emit_itemsChanged({
              inserted: [ sourceObject ]
            });
            if (!memberMap[subsetId]) {
              inserted.push(subset);
              memberMap[subsetId] = 1;
            } else memberMap[subsetId]++;
          }
        }
      }
      for (var subsetId in oldList) if (!newList[subsetId]) {
        var subset = oldList[subsetId];
        subset.dataset.emit_itemsChanged({
          deleted: [ sourceObject ]
        });
        if (!--memberMap[subsetId]) {
          delete memberMap[subsetId];
          deleted.push(subset);
        }
      }
      if (delta = getDelta(inserted, deleted)) this.emit_itemsChanged(delta);
    };
    var CLOUD_SOURCE_HANDLER = {
      itemsChanged: function(dataset, delta) {
        var sourceMap = this.sourceMap_;
        var memberMap = this.members_;
        var updateHandler = this.ruleEvents;
        var array;
        var subset;
        var subsetId;
        var inserted = [];
        var deleted = [];
        setAccumulateState(true);
        if (array = delta.inserted) for (var i = 0, sourceObject; sourceObject = array[i]; i++) {
          var list = this.rule(sourceObject);
          var sourceObjectInfo = {
            object: sourceObject,
            list: {}
          };
          sourceMap[sourceObject.basisObjectId] = sourceObjectInfo;
          if (Array.isArray(list)) for (var j = 0, dupFilter = {}; j < list.length; j++) {
            subset = this.keyMap.get(list[j], true);
            if (subset && !dupFilter[subset.basisObjectId]) {
              subsetId = subset.basisObjectId;
              dupFilter[subsetId] = true;
              sourceObjectInfo.list[subsetId] = subset;
              subset.dataset.emit_itemsChanged({
                inserted: [ sourceObject ]
              });
              if (!memberMap[subsetId]) {
                inserted.push(subset);
                memberMap[subsetId] = 1;
              } else memberMap[subsetId]++;
            }
          }
          if (updateHandler) sourceObject.addHandler(updateHandler, this);
        }
        if (array = delta.deleted) for (var i = 0, sourceObject; sourceObject = array[i]; i++) {
          var sourceObjectId = sourceObject.basisObjectId;
          var list = sourceMap[sourceObjectId].list;
          delete sourceMap[sourceObjectId];
          for (var subsetId in list) {
            subset = list[subsetId];
            subset.dataset.emit_itemsChanged({
              deleted: [ sourceObject ]
            });
            if (!--memberMap[subsetId]) {
              delete memberMap[subsetId];
              deleted.push(subset);
            }
          }
          if (updateHandler) sourceObject.removeHandler(updateHandler, this);
        }
        setAccumulateState(false);
        if (delta = getDelta(inserted, deleted)) this.emit_itemsChanged(delta);
      }
    };
    var Cloud = Class(SourceDataset, {
      className: namespace + ".Cloud",
      subsetClass: ReadOnlyDataset,
      subsetWrapperClass: DatasetWrapper,
      rule: getter($undef),
      ruleEvents: createRuleEvents(CLOUD_SOURCEOBJECT_UPDATE, "update"),
      keyMap: null,
      map: $self,
      listen: {
        source: CLOUD_SOURCE_HANDLER
      },
      init: function() {
        if (!this.keyMap || this.keyMap instanceof KeyObjectMap == false) this.keyMap = createKeyMap(this.keyMap, this.rule, this.subsetWrapperClass, this.subsetClass);
        SourceDataset.prototype.init.call(this);
      },
      getSubset: function(data, autocreate) {
        return this.keyMap.get(data, autocreate);
      },
      destroy: function() {
        SourceDataset.prototype.destroy.call(this);
        this.keyMap.destroy();
        this.keyMap = null;
      }
    });
    var EXTRACT_SOURCEOBJECT_UPDATE = function(sourceObject) {
      var sourceObjectInfo = this.sourceMap_[sourceObject.basisObjectId];
      var newValue = this.rule(sourceObject) || null;
      var oldValue = sourceObjectInfo.value;
      var inserted;
      var deleted;
      var delta;
      if (newValue === oldValue) return;
      if (newValue instanceof DataObject || newValue instanceof ReadOnlyDataset) inserted = addToExtract(this, newValue, sourceObject);
      if (oldValue) deleted = removeFromExtract(this, oldValue, sourceObject);
      sourceObjectInfo.value = newValue;
      if (delta = getDelta(inserted, deleted)) this.emit_itemsChanged(delta);
    };
    var EXTRACT_DATASET_ITEMSCHANGED = function(dataset, delta) {
      var inserted = delta.inserted;
      var deleted = delta.deleted;
      var delta;
      if (inserted) inserted = addToExtract(this, inserted, dataset);
      if (deleted) deleted = removeFromExtract(this, deleted, dataset);
      if (delta = getDelta(inserted, deleted)) this.emit_itemsChanged(delta);
    };
    var EXTRACT_DATASET_HANDLER = {
      itemsChanged: EXTRACT_DATASET_ITEMSCHANGED,
      destroy: function(dataset) {
        var sourceMap = this.sourceMap_;
        for (var cursor = sourceMap[dataset.basisObjectId]; cursor = cursor.ref; ) sourceMap[cursor.object.basisObjectId].value = null;
        delete sourceMap[dataset.basisObjectId];
      }
    };
    function hasExtractSourceRef(extract, object, marker) {
      var sourceObjectInfo = extract.sourceMap_[object.basisObjectId];
      if (sourceObjectInfo && sourceObjectInfo.visited !== marker) {
        for (var cursor = sourceObjectInfo; cursor = cursor.ref; ) if (cursor.object === extract.source) return true;
        sourceObjectInfo.visited = marker;
        for (var cursor = sourceObjectInfo; cursor = cursor.ref; ) if (hasExtractSourceRef(extract, cursor.object, marker || {})) return true;
      }
    }
    function addToExtract(extract, items, ref) {
      var sourceMap = extract.sourceMap_;
      var members = extract.members_;
      var queue = arrayFrom(items);
      var inserted = [];
      for (var i = 0; i < queue.length; i++) {
        var item = queue[i];
        var sourceObjectId = item.basisObjectId;
        if (!sourceObjectId) {
          ref = item.ref;
          item = item.object;
          sourceObjectId = item.basisObjectId;
        }
        var sourceObjectInfo = sourceMap[sourceObjectId];
        if (sourceObjectInfo) {
          sourceObjectInfo.ref = {
            object: ref,
            ref: sourceObjectInfo.ref
          };
        } else {
          sourceObjectInfo = sourceMap[sourceObjectId] = {
            source: item,
            ref: {
              object: ref,
              ref: null
            },
            visited: null,
            value: null
          };
          if (item instanceof DataObject) {
            var value = extract.rule(item) || null;
            if (value instanceof DataObject || value instanceof ReadOnlyDataset) {
              sourceObjectInfo.value = value;
              queue.push({
                object: value,
                ref: item
              });
            }
            members[sourceObjectId] = sourceObjectInfo;
            inserted.push(item);
            if (extract.ruleEvents) item.addHandler(extract.ruleEvents, extract);
          } else {
            item.addHandler(EXTRACT_DATASET_HANDLER, extract);
            for (var j = 0, datasetItems = item.getItems(); j < datasetItems.length; j++) queue.push({
              object: datasetItems[j],
              ref: item
            });
          }
        }
      }
      return inserted;
    }
    function removeFromExtract(extract, items, ref) {
      var sourceMap = extract.sourceMap_;
      var members = extract.members_;
      var queue = arrayFrom(items);
      var deleted = [];
      for (var i = 0; i < queue.length; i++) {
        var item = queue[i];
        var sourceObjectId = item.basisObjectId;
        if (!sourceObjectId) {
          ref = item.ref;
          item = item.object;
          sourceObjectId = item.basisObjectId;
        }
        var sourceObjectInfo = sourceMap[sourceObjectId];
        var sourceObjectValue = sourceObjectInfo.value;
        for (var cursor = sourceObjectInfo, prevCursor = sourceObjectInfo; cursor = cursor.ref; ) {
          if (cursor.object === ref) {
            prevCursor.ref = cursor.ref;
            break;
          }
          prevCursor = cursor;
        }
        if (!sourceObjectInfo.ref) {
          if (item instanceof DataObject) {
            delete members[sourceObjectId];
            deleted.push(item);
            if (extract.ruleEvents) item.removeHandler(extract.ruleEvents, extract);
            if (sourceObjectValue) queue.push({
              object: sourceObjectValue,
              ref: item
            });
          } else {
            item.removeHandler(EXTRACT_DATASET_HANDLER, extract);
            for (var j = 0, datasetItems = item.getItems(); j < datasetItems.length; j++) queue.push({
              object: datasetItems[j],
              ref: item
            });
          }
          delete sourceMap[sourceObjectId];
        } else {
          if (sourceObjectValue && !hasExtractSourceRef(extract, item)) {
            sourceObjectInfo.value = null;
            queue.push({
              object: sourceObjectValue,
              ref: item
            });
          }
        }
      }
      return deleted;
    }
    var Extract = SourceDataset.subclass({
      className: namespace + ".Extract",
      rule: getter($undef),
      emit_ruleChanged: createEvent("ruleChanged", "oldRule"),
      ruleEvents: createRuleEvents(EXTRACT_SOURCEOBJECT_UPDATE, "update"),
      listen: {
        source: {
          itemsChanged: EXTRACT_DATASET_ITEMSCHANGED
        }
      },
      setRule: function(rule) {
        rule = getter(rule || $undef);
        if (this.rule !== rule) {
          var oldRule = this.rule;
          this.rule = rule;
          this.emit_ruleChanged(oldRule);
          return this.applyRule();
        }
      },
      applyRule: function() {
        var insertedMap = {};
        var deletedMap = {};
        var delta;
        for (var key in this.sourceMap_) {
          var sourceObjectInfo = this.sourceMap_[key];
          var sourceObject = sourceObjectInfo.source;
          if (sourceObject instanceof DataObject) {
            var newValue = this.rule(sourceObject) || null;
            var oldValue = sourceObjectInfo.value;
            if (newValue === oldValue) continue;
            if (newValue instanceof DataObject || newValue instanceof ReadOnlyDataset) {
              var inserted = addToExtract(this, newValue, sourceObject);
              for (var i = 0; i < inserted.length; i++) {
                var item = inserted[i];
                var id = item.basisObjectId;
                if (deletedMap[id]) delete deletedMap[id]; else insertedMap[id] = item;
              }
            }
            if (oldValue) {
              var deleted = removeFromExtract(this, oldValue, sourceObject);
              for (var i = 0; i < deleted.length; i++) {
                var item = deleted[i];
                var id = item.basisObjectId;
                if (insertedMap[id]) delete insertedMap[id]; else deletedMap[id] = item;
              }
            }
            sourceObjectInfo.value = newValue;
          }
        }
        if (delta = getDelta(values(insertedMap), values(deletedMap))) this.emit_itemsChanged(delta);
        return delta;
      }
    });
    module.exports = {
      getDelta: getDelta,
      createRuleEvents: createRuleEvents,
      Merge: Merge,
      Subtract: Subtract,
      SourceDataset: SourceDataset,
      MapFilter: MapFilter,
      Filter: Filter,
      Split: Split,
      Extract: Extract,
      Slice: Slice,
      Cloud: Cloud
    };
  },
  "j.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var cleaner = basis.cleaner;
    var basisData = basis.require("./e.js");
    var AbstractData = basisData.AbstractData;
    var Value = basisData.Value;
    var ReadOnlyValue = basisData.ReadOnlyValue;
    var STATE = basisData.STATE;
    var Property = Value.subclass({
      className: namespace + ".Property",
      extendConstructor_: false,
      init: function(initValue, handler, proxy) {
        this.value = initValue;
        this.handler = handler;
        this.proxy = proxy;
        Value.prototype.init.call(this);
      }
    });
    var OBJECTSET_STATE_PRIORITY = STATE.priority;
    var OBJECTSET_HANDLER = {
      stateChanged: function() {
        this.fire(false, true);
      },
      update: function() {
        this.fire(true);
      },
      change: function() {
        this.fire(true);
      },
      destroy: function(object) {
        this.remove(object);
      }
    };
    var objectSetUpdater = basis.asap.schedule(function(object) {
      object.update();
    });
    var ObjectSet = Value.subclass({
      className: namespace + ".ObjectSet",
      objects: null,
      value: 0,
      valueChanged_: false,
      calculateValue: function() {
        return this.value + 1;
      },
      calculateOnInit: false,
      statePriority: OBJECTSET_STATE_PRIORITY,
      stateChanged_: true,
      init: function() {
        Value.prototype.init.call(this);
        var objects = this.objects;
        this.objects = [];
        if (objects && Array.isArray(objects)) {
          this.lock();
          this.add.apply(this, objects);
          this.unlock();
        }
        this.valueChanged_ = this.stateChanged_ = !!this.calculateOnInit;
        this.update();
      },
      add: function() {
        for (var i = 0, len = arguments.length; i < len; i++) {
          var object = arguments[i];
          if (object instanceof AbstractData) {
            if (basis.array.add(this.objects, object)) object.addHandler(OBJECTSET_HANDLER, this);
          } else {
            basis.dev.warn(this.constructor.className + "#add: Instance of AbstractData required");
          }
        }
        this.fire(true, true);
      },
      remove: function(object) {
        if (basis.array.remove(this.objects, object)) object.removeHandler(OBJECTSET_HANDLER, this);
        this.fire(true, true);
      },
      clear: function() {
        for (var i = 0, object; object = this.objects[i]; i++) object.removeHandler(OBJECTSET_HANDLER, this);
        this.objects.length = 0;
        this.fire(true, true);
      },
      fire: function(valueChanged, stateChanged) {
        if (!this.locked) {
          this.valueChanged_ = this.valueChanged_ || !!valueChanged;
          this.stateChanged_ = this.stateChanged_ || !!stateChanged;
          if (this.valueChanged_ || this.stateChanged_) objectSetUpdater.add(this);
        }
      },
      lock: function() {
        this.locked = true;
      },
      unlock: function() {
        this.locked = false;
      },
      update: function() {
        var valueChanged = this.valueChanged_;
        var stateChanged = this.stateChanged_;
        this.valueChanged_ = false;
        this.stateChanged_ = false;
        objectSetUpdater.remove(this);
        if (!cleaner.globalDestroy) {
          if (valueChanged) this.set(this.calculateValue());
          if (stateChanged) {
            var len = this.objects.length;
            if (!len) this.setState(STATE.UNDEFINED); else {
              var maxWeight = -2;
              var curObject;
              for (var i = 0; i < len; i++) {
                var object = this.objects[i];
                var weight = this.statePriority.indexOf(String(object.state));
                if (weight > maxWeight) {
                  curObject = object;
                  maxWeight = weight;
                }
              }
              if (curObject) this.setState(curObject.state, curObject.state.data);
            }
          }
        }
      },
      destroy: function() {
        this.lock();
        this.clear();
        objectSetUpdater.remove(this);
        Value.prototype.destroy.call(this);
      }
    });
    var EXPRESSION_BBVALUE_HANDLER = function() {
      objectSetUpdater.add(this);
    };
    var EXPRESSION_BBVALUE_DESTROY_HANDLER = function() {
      this.destroy();
    };
    var BBVALUE_GETTER = function(value) {
      return value.bindingBridge.get(value);
    };
    var Expression = ReadOnlyValue.subclass({
      className: namespace + ".Expression",
      calc_: null,
      values_: null,
      extendConstructor_: false,
      init: function() {
        ReadOnlyValue.prototype.init.call(this);
        var count = arguments.length - 1;
        var calc = arguments[count];
        if (typeof calc != "function") throw new Error(this.constructor.className + ": Last argument of constructor must be a function");
        for (var values = new Array(count), i = 0; i < count; i++) {
          var value = values[i] = arguments[i];
          if (!value.bindingBridge) throw new Error(this.constructor.className + ": bb-value required");
          value.bindingBridge.attach(value, EXPRESSION_BBVALUE_HANDLER, this, EXPRESSION_BBVALUE_DESTROY_HANDLER);
        }
        this.calc_ = calc;
        this.values_ = values;
        this.update();
      },
      update: function() {
        objectSetUpdater.remove(this);
        Value.prototype.set.call(this, this.calc_.apply(null, this.values_.map(BBVALUE_GETTER)));
      },
      destroy: function() {
        objectSetUpdater.remove(this);
        for (var i = 0, value; value = this.values_[i]; i++) value.bindingBridge.detach(value, EXPRESSION_BBVALUE_HANDLER, this);
        ReadOnlyValue.prototype.destroy.call(this);
      }
    });
    module.exports = {
      Property: Property,
      ObjectSet: ObjectSet,
      Expression: Expression
    };
  },
  "k.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var Class = basis.Class;
    var iterate = basis.object.iterate;
    var basisData = basis.require("./e.js");
    var Value = basisData.Value;
    var DataObject = basisData.Object;
    var ReadOnlyDataset = basisData.ReadOnlyDataset;
    var DatasetWrapper = basisData.DatasetWrapper;
    var resolveDataset = basisData.resolveDataset;
    var basisDataset = basis.require("./i.js");
    var MapFilter = basisDataset.MapFilter;
    var createRuleEvents = basisDataset.createRuleEvents;
    function binarySearchPos(array, value) {
      if (!array.length) return 0;
      var pos;
      var cmpValue;
      var l = 0;
      var r = array.length - 1;
      do {
        pos = l + r >> 1;
        cmpValue = array[pos] || 0;
        if (value < cmpValue) r = pos - 1; else if (value > cmpValue) l = pos + 1; else return value == cmpValue ? pos : 0;
      } while (l <= r);
      return pos + (cmpValue < value);
    }
    var Index = Class(Value, {
      className: namespace + ".Index",
      explicit: false,
      wrapperCount: 0,
      indexCache_: null,
      valueGetter: basis.fn.$null,
      updateEvents: {},
      value: 0,
      setNullOnEmitterDestroy: false,
      init: function() {
        this.indexCache_ = {};
        Value.prototype.init.call(this);
      },
      add_: function(value) {},
      remove_: function(value) {},
      update_: function(newValue, oldValue) {},
      normalize: function(value) {
        return Number(value) || 0;
      },
      destroy: function() {
        Value.prototype.destroy.call(this);
        this.indexCache_ = null;
      }
    });
    var Sum = Class(Index, {
      className: namespace + ".Sum",
      add_: function(value) {
        this.value += value;
      },
      remove_: function(value) {
        this.value -= value;
      },
      update_: function(newValue, oldValue) {
        this.set(this.value - oldValue + newValue);
      }
    });
    var Count = Class(Index, {
      className: namespace + ".Count",
      valueGetter: basis.fn.$true,
      add_: function(value) {
        this.value += value;
      },
      remove_: function(value) {
        this.value -= value;
      },
      normalize: function(value) {
        return !!value;
      },
      update_: function(newValue, oldValue) {
        this.set(this.value - !!oldValue + !!newValue);
      }
    });
    var Avg = Class(Index, {
      className: namespace + ".Avg",
      sum_: 0,
      count_: 0,
      add_: function(value) {
        this.sum_ += value;
        this.count_ += 1;
        this.value = this.sum_ / this.count_;
      },
      remove_: function(value) {
        this.sum_ -= value;
        this.count_ -= 1;
        this.value = this.count_ ? this.sum_ / this.count_ : 0;
      },
      update_: function(newValue, oldValue) {
        this.sum_ += newValue - oldValue;
        this.set(this.sum_ / this.count_);
      }
    });
    var VectorIndex = Class(Index, {
      className: namespace + ".VectorIndex",
      vectorGetter: basis.fn.$null,
      vector_: null,
      value: undefined,
      init: function() {
        this.vector_ = [];
        Index.prototype.init.call(this);
      },
      add_: function(value) {
        if (value !== null) {
          this.vector_.splice(binarySearchPos(this.vector_, value), 0, value);
          this.value = this.vectorGetter(this.vector_);
        }
      },
      remove_: function(value) {
        if (value !== null) {
          this.vector_.splice(binarySearchPos(this.vector_, value), 1);
          this.value = this.vectorGetter(this.vector_);
        }
      },
      update_: function(newValue, oldValue) {
        if (oldValue !== null) this.vector_.splice(binarySearchPos(this.vector_, oldValue), 1);
        if (newValue !== null) this.vector_.splice(binarySearchPos(this.vector_, newValue), 0, newValue);
        this.set(this.vectorGetter(this.vector_));
      },
      normalize: function(value) {
        return typeof value == "string" || typeof value == "number" ? value : null;
      },
      destroy: function() {
        Index.prototype.destroy.call(this);
        this.vector_ = null;
      }
    });
    var Min = Class(VectorIndex, {
      className: namespace + ".Min",
      vectorGetter: function(vector) {
        return vector[0];
      }
    });
    var Max = Class(VectorIndex, {
      className: namespace + ".Max",
      vectorGetter: function(vector) {
        return vector[vector.length - 1];
      }
    });
    var Distinct = Class(Index, {
      className: namespace + ".Distinct",
      map_: null,
      init: function() {
        this.map_ = {};
        Index.prototype.init.call(this);
      },
      add_: function(value) {
        if (!this.map_.hasOwnProperty(value)) this.map_[value] = 0;
        if (++this.map_[value] == 1) this.value += 1;
      },
      remove_: function(value) {
        if (--this.map_[value] == 0) this.value -= 1;
      },
      update_: function(newValue, oldValue) {
        var delta = 0;
        if (!this.map_.hasOwnProperty(newValue)) this.map_[newValue] = 0;
        if (++this.map_[newValue] == 1) delta += 1;
        if (--this.map_[oldValue] == 0) delta -= 1;
        if (delta) this.set(this.value + delta);
      },
      normalize: String,
      destroy: function() {
        Index.prototype.destroy.call(this);
        this.map_ = null;
      }
    });
    var INDEXWRAPPER_HANDLER = {
      destroy: function() {
        Value.prototype.set.call(this, this.initValue);
        this.index = null;
      }
    };
    var IndexWrapper = Value.subclass({
      className: namespace + ".IndexWrapper",
      extendConstructor_: false,
      source: null,
      dataset: null,
      datasetRA_: null,
      indexConstructor: null,
      index: null,
      init: function(source, indexConstructor) {
        this.source = source;
        this.indexConstructor = indexConstructor;
        this.value = indexConstructorCache[indexConstructor.indexId].indexClass.prototype.value;
        Value.prototype.init.call(this);
        source.bindingBridge.attach(source, basis.fn.$undef, this, this.destroy);
        this.setDataset(source);
        this.source[indexConstructor.indexId] = this;
      },
      setDataset: function(source) {
        var oldDataset = this.dataset;
        var newDataset = resolveDataset(this, this.setDataset, source, "sourceRA_");
        if (newDataset !== oldDataset) {
          var index = this.index;
          if (index) {
            index.removeHandler(INDEXWRAPPER_HANDLER, this);
            index.wrapperCount -= 1;
            if (!index.wrapperCount && !index.explicit) index.destroy();
          }
          if (newDataset) {
            index = getDatasetIndex(newDataset, this.indexConstructor);
            index.wrapperCount += 1;
            index.link(this, Value.prototype.set);
            index.addHandler(INDEXWRAPPER_HANDLER, this);
          } else {
            index = null;
            Value.prototype.set.call(this, this.initValue);
          }
          this.dataset = newDataset;
          this.index = index;
        }
      },
      set: function() {
        basis.dev.warn(this.className + ": value can't be set as IndexWrapper is read only");
      },
      destroy: function() {
        this.source.bindingBridge.detach(this.source, basis.fn.$undef, this);
        this.setDataset();
        Value.prototype.destroy.call(this);
        delete this.source[this.indexConstructor.indexId];
        this.source = null;
        this.indexConstructor = null;
      }
    });
    var indexConstructorIdPrefix = "basisjsIndexConstructor" + basis.genUID();
    var indexConstructorCache = {};
    var DATASET_INDEX_HANDLER = {
      destroy: function(object) {
        removeDatasetIndex(this, object);
      }
    };
    function IndexConstructor(indexId) {
      this.indexId = indexId;
    }
    function getIndexConstructor(BaseClass, getter, events) {
      if (!Class.isClass(BaseClass) || !BaseClass.isSubclassOf(Index)) throw "Wrong class for index constructor";
      getter = basis.getter(getter);
      events = events || "update";
      if (typeof events != "string") throw "Events must be a event names space separated string";
      events = events.trim().split(" ").sort();
      var indexId = indexConstructorIdPrefix + [ BaseClass.basisClassId_, getter[basis.getter.ID], events ].join("_");
      var indexConstructor = indexConstructorCache[indexId];
      if (indexConstructor) return indexConstructor.owner;
      var events_ = {};
      for (var i = 0; i < events.length; i++) events_[events[i]] = true;
      indexConstructor = new IndexConstructor(indexId);
      indexConstructorCache[indexId] = {
        owner: indexConstructor,
        indexClass: BaseClass.subclass({
          indexId: indexId,
          updateEvents: events_,
          valueGetter: getter
        })
      };
      return indexConstructor;
    }
    var createIndexConstructor = function(IndexClass, defGetter) {
      return function(source, events, getter) {
        if (typeof source == "function" || typeof source == "string") {
          getter = events;
          events = source;
          source = null;
        }
        if (!getter) {
          getter = events;
          events = "";
        }
        var indexConstructor = getIndexConstructor(IndexClass, getter || defGetter, events);
        if (!source) return indexConstructor;
        if (source instanceof ReadOnlyDataset || source instanceof DatasetWrapper) {
          var index = getDatasetIndex(source, indexConstructor);
          index.explicit = true;
          return index;
        }
        if (source.bindingBridge) return source[indexConstructor.indexId] || new IndexWrapper(source, indexConstructor);
        basis.dev.warn(IndexClass.className + ": wrong source value for index (should be instance of basis.data.ReadOnlyDataset, basis.data.DatasetWrapper or bb-value)");
        return null;
      };
    };
    var count = createIndexConstructor(Count, basis.fn.$true);
    var sum = createIndexConstructor(Sum);
    var avg = createIndexConstructor(Avg);
    var min = createIndexConstructor(Min);
    var max = createIndexConstructor(Max);
    var distinct = createIndexConstructor(Distinct);
    function applyIndexDelta(index, inserted, deleted) {
      var indexCache = index.indexCache_;
      var objectId;
      index.lock();
      if (inserted) for (var i = 0, object; object = inserted[i++]; ) {
        var newValue = index.normalize(index.valueGetter(object));
        indexCache[object.basisObjectId] = newValue;
        index.add_(newValue);
      }
      if (deleted) for (var i = 0, object; object = deleted[i++]; ) {
        objectId = object.basisObjectId;
        index.remove_(indexCache[objectId]);
        delete indexCache[objectId];
      }
      index.unlock();
    }
    var ITEM_INDEX_HANDLER = {
      "*": function(event) {
        var oldValue;
        var newValue;
        var index;
        var eventType = event.type;
        var object = event.sender;
        var objectId = object.basisObjectId;
        var indexes = datasetIndexes[this.basisObjectId];
        for (var indexId in indexes) {
          index = indexes[indexId];
          if (index.updateEvents[eventType]) {
            oldValue = index.indexCache_[objectId];
            newValue = index.normalize(index.valueGetter(object));
            if (newValue !== oldValue) {
              index.update_(newValue, oldValue);
              index.indexCache_[objectId] = newValue;
            }
          }
        }
      }
    };
    var DATASET_WITH_INDEX_HANDLER = {
      itemsChanged: function(object, delta) {
        var array;
        if (array = delta.inserted) for (var i = array.length; i-- > 0; ) array[i].addHandler(ITEM_INDEX_HANDLER, this);
        if (array = delta.deleted) for (var i = array.length; i-- > 0; ) array[i].removeHandler(ITEM_INDEX_HANDLER, this);
        var indexes = datasetIndexes[this.basisObjectId];
        for (var indexId in indexes) applyIndexDelta(indexes[indexId], delta.inserted, delta.deleted);
      },
      destroy: function() {
        var indexes = datasetIndexes[this.basisObjectId];
        for (var indexId in indexes) {
          var index = indexes[indexId];
          removeDatasetIndex(this, index);
          index.destroy();
        }
      }
    };
    var datasetIndexes = {};
    function getDatasetIndex(dataset, indexConstructor) {
      if (indexConstructor instanceof IndexConstructor == false) throw "indexConstructor must be an instance of IndexConstructor";
      var datasetId = dataset.basisObjectId;
      var indexes = datasetIndexes[datasetId];
      if (!indexes) {
        indexes = datasetIndexes[datasetId] = {};
        dataset.addHandler(DATASET_WITH_INDEX_HANDLER);
        DATASET_WITH_INDEX_HANDLER.itemsChanged.call(dataset, dataset, {
          inserted: dataset.getItems()
        });
      }
      var indexId = indexConstructor.indexId;
      var index = indexes[indexId];
      if (!index) {
        indexConstructor = indexConstructorCache[indexId];
        if (!indexConstructor) throw "Wrong index constructor";
        index = new indexConstructor.indexClass;
        index.addHandler(DATASET_INDEX_HANDLER, dataset);
        indexes[indexId] = index;
        applyIndexDelta(index, dataset.getItems());
      }
      return index;
    }
    function removeDatasetIndex(dataset, index) {
      var indexes = datasetIndexes[dataset.basisObjectId];
      if (indexes && indexes[index.indexId]) {
        delete indexes[index.indexId];
        index.removeHandler(DATASET_INDEX_HANDLER, dataset);
        for (var key in indexes) return;
        dataset.removeHandler(DATASET_WITH_INDEX_HANDLER);
        DATASET_WITH_INDEX_HANDLER.itemsChanged.call(dataset, dataset, {
          deleted: dataset.getItems()
        });
        delete datasetIndexes[dataset.basisObjectId];
      }
    }
    var indexMapRecalcShedule = basis.asap.schedule(function(indexMap) {
      indexMap.recalc();
    });
    var calcIndexPresetSeed = 1;
    function getUniqueCalcIndexId() {
      return "calc-index-preset-" + basis.number.lead(calcIndexPresetSeed++, 8);
    }
    var CalcIndexPreset = Class(null, {
      className: namespace + ".CalcIndexPreset",
      extendConstructor_: true,
      indexes: {},
      calc: basis.fn.$null
    });
    function percentOfRange(events, getter) {
      var minIndex = "min_" + getUniqueCalcIndexId();
      var maxIndex = "max_" + getUniqueCalcIndexId();
      var indexes = {};
      indexes[minIndex] = min(events, getter);
      indexes[maxIndex] = max(events, getter);
      getter = basis.getter(getter || events);
      var calc = function(data, index, object) {
        return (getter(object) - index[minIndex]) / (index[maxIndex] - index[minIndex]);
      };
      return calc.preset = new CalcIndexPreset({
        indexes: indexes,
        calc: calc
      });
    }
    function percentOfMax(events, getter) {
      var maxIndex = "max_" + getUniqueCalcIndexId();
      var indexes = {};
      indexes[maxIndex] = max(events, getter);
      getter = basis.getter(getter || events);
      var calc = function(data, index, object) {
        return getter(object) / index[maxIndex];
      };
      return calc.preset = new CalcIndexPreset({
        indexes: indexes,
        calc: calc
      });
    }
    function percentOfSum(getter, events) {
      var sumIndex = "sum_" + getUniqueCalcIndexId();
      var indexes = {};
      indexes[sumIndex] = sum(events, getter);
      getter = basis.getter(getter || events);
      var calc = function(data, index, object) {
        return getter(object) / index[sumIndex];
      };
      return calc.preset = new CalcIndexPreset({
        indexes: indexes,
        calc: calc
      });
    }
    var IndexMap = Class(MapFilter, {
      className: namespace + ".IndexMap",
      calcs: null,
      copyDataFromSource: true,
      indexes: null,
      indexValues: null,
      indexUpdated: false,
      itemClass: DataObject,
      map: function(sourceObject) {
        var member = this.getMember(sourceObject);
        if (!member) {
          var data = {};
          for (var calcName in this.calcs) data[calcName] = this.calcs[calcName](sourceObject.data, this.indexValues, sourceObject);
          if (this.copyDataFromSource) for (var key in sourceObject.data) if (!this.calcs.hasOwnProperty(key)) data[key] = sourceObject.data[key];
          member = new this.itemClass({
            source: sourceObject,
            data: data
          });
        }
        return member;
      },
      addMemberRef: function(member) {
        if (this.listen.member) member.addHandler(this.listen.member, this);
      },
      removeMemberRef: function(member) {
        if (this.listen.member) member.removeHandler(this.listen.member, this);
        member.source = null;
        member.destroy();
      },
      ruleEvents: createRuleEvents(function(sender) {
        MapFilter.prototype.ruleEvents.update.call(this, sender);
        this.sourceMap_[sender.basisObjectId].updated = true;
        this.scheduleRecalc();
      }, "update"),
      init: function() {
        var indexes = this.indexes;
        this.indexes = {};
        this.indexValues = {};
        var calcs = this.calcs;
        this.calcs = {};
        MapFilter.prototype.init.call(this);
        iterate(indexes, this.addIndex, this);
        for (var name in calcs) {
          var calcCfg = calcs[name];
          if (calcCfg instanceof CalcIndexPreset) {
            iterate(calcCfg.indexes, this.addIndex, this);
            calcCfg = calcCfg.calc;
          }
          this.calcs[name] = calcCfg;
        }
        if (this.itemCount) this.recalc();
      },
      addIndex: function(key, indexConstructor) {
        if (indexConstructor instanceof IndexConstructor == false) {
          basis.dev.warn("MapIndex.addIndex(): `index` should be instance of `basis.data.index.IndexConstructor`");
          return;
        }
        if (this.indexes[key]) {
          basis.dev.warn("MapIndex.addIndex(): Index `" + key + "` already exists");
          return;
        }
        var index = new IndexWrapper(Value.from(this, "sourceChanged", "source"), indexConstructor);
        this.indexes[key] = index;
        this.indexValues[key] = index.value;
        index.link(this, function(value) {
          this.indexValues[key] = value;
          this.indexUpdated = true;
          this.scheduleRecalc();
        });
      },
      removeIndex: function(key) {
        var index = this.indexes[key];
        if (index) {
          delete this.indexes[key];
          delete this.indexValues[key];
          index.destroy();
        }
      },
      lock: function() {
        for (var indexId in this.indexes) this.indexes[indexId].lock();
      },
      unlock: function() {
        for (var indexId in this.indexes) this.indexes[indexId].unlock();
      },
      scheduleRecalc: function() {
        indexMapRecalcShedule.add(this);
      },
      recalc: function() {
        for (var id in this.sourceMap_) this.calcMember(this.sourceMap_[id]);
        this.indexUpdated = false;
        indexMapRecalcShedule.remove(this);
      },
      calcMember: function(memberInfo) {
        var member = memberInfo.member;
        if (memberInfo.updated || this.indexUpdated) {
          var sourceObject = memberInfo.sourceObject;
          var delta = {};
          var newValue;
          var oldValue;
          var update;
          for (var calcName in this.calcs) {
            newValue = this.calcs[calcName](sourceObject.data, this.indexValues, sourceObject);
            oldValue = member.data[calcName];
            if (oldValue !== newValue && (newValue === newValue || oldValue === oldValue)) {
              delta[calcName] = newValue;
              update = true;
            }
          }
          if (this.copyDataFromSource) {
            for (var key in sourceObject.data) if (!this.calcs.hasOwnProperty(key)) {
              newValue = sourceObject.data[key];
              oldValue = member.data[key];
              if (oldValue !== newValue && (newValue === newValue || oldValue === oldValue)) {
                delta[key] = newValue;
                update = true;
              }
            }
            for (var key in member.data) if (!this.calcs.hasOwnProperty(key) && !sourceObject.data.hasOwnProperty(key)) {
              delta[key] = undefined;
              update = true;
            }
          }
          if (update) member.update(delta);
          memberInfo.updated = false;
        }
      },
      getMember: function(sourceObject) {
        var memberInfo = sourceObject && this.sourceMap_[sourceObject.basisObjectId];
        return memberInfo ? memberInfo.member : null;
      },
      destroy: function() {
        iterate(this.indexes, this.removeIndex, this);
        MapFilter.prototype.destroy.call(this);
        indexMapRecalcShedule.remove(this);
        this.calcs = null;
        this.indexes = null;
        this.indexValues = null;
      }
    });
    module.exports = {
      IndexConstructor: IndexConstructor,
      createIndexConstructor: createIndexConstructor,
      getDatasetIndex: getDatasetIndex,
      removeDatasetIndex: removeDatasetIndex,
      Index: Index,
      Count: Count,
      Sum: Sum,
      Avg: Avg,
      VectorIndex: VectorIndex,
      Min: Min,
      Max: Max,
      Distinct: Distinct,
      count: count,
      sum: sum,
      avg: avg,
      max: max,
      min: min,
      distinct: distinct,
      CalcIndexPreset: CalcIndexPreset,
      percentOfRange: percentOfRange,
      percentOfMax: percentOfMax,
      percentOfSum: percentOfSum,
      IndexMap: IndexMap
    };
  },
  "l.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var createEvent = basis.require("./2.js").create;
    var SUBSCRIPTION = basis.require("./e.js").SUBSCRIPTION;
    var DataObject = basis.require("./e.js").Object;
    var resolveObject = basis.require("./e.js").resolveObject;
    SUBSCRIPTION.add("OBJECTSOURCE", {
      sourceChanged: function(object, name, oldSource) {
        if (oldSource) SUBSCRIPTION.unlink("sources", object, oldSource);
        if (object.sources[name]) SUBSCRIPTION.link("sources", object, object.sources[name]);
      }
    }, function(action, object) {
      var sources = object.sources;
      for (var name in sources) action("sources", object, sources[name]);
    });
    var MERGE_SOURCE_HANDLER = {
      update: function(sender, senderDelta) {
        var fields = this.host.fields;
        var data = {};
        if (this.name == fields.defaultSource) {
          for (var key in senderDelta) if (key in fields.fieldSource == false) data[key] = sender.data[key];
        } else {
          for (var key in senderDelta) {
            var mergeKey = fields.fromNames[this.name][key];
            if (mergeKey && this.host.fields.fieldSource[mergeKey] == this.name) data[mergeKey] = sender.data[key];
          }
        }
        for (var key in data) return this.host.update(data);
      },
      destroy: function() {
        this.host.setSource(this.name, null);
      }
    };
    function generateDataGetter(nameMap) {
      return new Function("data", "return {" + basis.object.iterate(nameMap, function(ownName, sourceName) {
        ownName = ownName.replace(/"/g, '\\"');
        sourceName = sourceName.replace(/"/g, '\\"');
        return '"' + ownName + '": data["' + sourceName + '"]';
      }) + "}");
    }
    var fieldsExtend = function(fields) {
      var sources = {};
      var toNames = {};
      var fromNames = {};
      var result = {
        defaultSource: false,
        fieldSource: {},
        toNames: toNames,
        fromNames: fromNames,
        sources: sources,
        __extend__: fieldsExtend
      };
      if (fields["*"]) result.defaultSource = fields["*"];
      for (var field in fields) {
        var def = fields[field].split(":");
        var sourceName = def.shift();
        var sourceField = def.length ? def.join(":") : field;
        if (sourceName == result.defaultSource) {
          if (field != "*") basis.dev.warn("basis.data.object.Merge: source `" + sourceName + "` has already defined for any field (star rule), definition this source for `" + field + "` field is superfluous (ignored).");
          continue;
        }
        if (sourceName == "-" && sourceField != field) {
          basis.dev.warn("basis.data.object.Merge: custom field name can't be used for own properties, definition `" + field + ': "' + fields[field] + '"` ignored.');
          continue;
        }
        if (!toNames[sourceName]) {
          toNames[sourceName] = {};
          fromNames[sourceName] = {};
        }
        toNames[sourceName][field] = sourceField;
        fromNames[sourceName][sourceField] = field;
        result.fieldSource[field] = sourceName;
      }
      for (var sourceName in toNames) sources[sourceName] = generateDataGetter(toNames[sourceName]);
      if (result.defaultSource) sources[result.defaultSource] = function(data) {
        var res = {};
        for (var key in data) if (key in result.fieldSource == false) res[key] = data[key];
        return res;
      };
      return result;
    };
    function resolveSetSource(source) {
      this.host.setSource(this.name, source);
    }
    var Merge = DataObject.subclass({
      className: namespace + ".Merge",
      subscribeTo: DataObject.prototype.subscribeTo + SUBSCRIPTION.OBJECTSOURCE,
      emit_sourceChanged: createEvent("sourceChanged", "name", "oldSource"),
      fields: fieldsExtend({
        "*": "-"
      }),
      sources: null,
      sourcesContext_: null,
      delta_: null,
      init: function() {
        var data = this.data;
        var sources = this.sources;
        if (this.delegate) basis.dev.warn(this.constructor.className + " can't has a delegate");
        this.delegate = null;
        if (data && "-" in this.fields.sources) {
          if (this.fields.defaultSource !== "-") {
            this.data = this.fields.sources["-"](data);
          } else {
            this.data = {};
            for (var key in data) {
              var name = this.fields.fieldSource[key] || this.fields.defaultSource;
              if (name == "-") this.data[key] = data[key];
            }
          }
        } else {
          this.data = {};
        }
        DataObject.prototype.init.call(this);
        this.sources = {};
        this.sourcesContext_ = {};
        if (sources) this.setSources(sources);
      },
      update: function(data) {
        if (this.delta_) {
          for (var key in data) {
            var sourceName = this.fields.fieldSource[key] || this.fields.defaultSource;
            if (!sourceName) {
              basis.dev.warn("Unknown source for field `" + key + "`");
              continue;
            }
            var sourceKey = sourceName != this.fields.defaultSource ? this.fields.toNames[sourceName][key] : key;
            var value = this.sources[sourceName].data[sourceKey];
            if (value !== this.data[key]) {
              if (key in this.delta_ == false) {
                this.delta_[key] = this.data[key];
              } else {
                if (this.delta_[key] === value) delete this.delta_[key];
              }
              this.data[key] = value;
            }
          }
          return;
        }
        var sourceDelta;
        var delta = {};
        this.delta_ = delta;
        for (var key in data) {
          var sourceName = this.fields.fieldSource[key] || this.fields.defaultSource;
          if (!sourceName) {
            basis.dev.warn("Unknown source for field `" + key + "`");
            continue;
          }
          if (sourceName == "-") {
            delta[key] = this.data[key];
            this.data[key] = data[key];
            continue;
          }
          if (this.sources[sourceName]) {
            var sourceKey = sourceName != this.fields.defaultSource ? this.fields.toNames[sourceName][key] : key;
            if (this.sources[sourceName].data[sourceKey] !== data[key]) {
              if (!sourceDelta) sourceDelta = {};
              if (sourceName in sourceDelta == false) sourceDelta[sourceName] = {};
              sourceDelta[sourceName][sourceKey] = data[key];
            } else {
              if (this.data[key] !== data[key]) {
                delta[key] = this.data[key];
                this.data[key] = data[key];
              }
            }
          }
        }
        if (sourceDelta) for (var sourceName in sourceDelta) this.sources[sourceName].update(sourceDelta[sourceName]);
        this.delta_ = null;
        for (var key in delta) {
          this.emit_update(delta);
          return delta;
        }
        return false;
      },
      setDelegate: function() {
        basis.dev.warn(namespace + ".Merge can't has a delegate");
      },
      setSource: function(name, source) {
        var oldSource = this.sources[name];
        if (name in this.fields.sources == false) {
          basis.dev.warn("basis.data.object.Merge#setSource: can't set source with name `" + name + "` as not specified by fields configuration");
          return;
        }
        if (name == "-") return;
        if (name in this.sourcesContext_ == false) this.sourcesContext_[name] = {
          host: this,
          name: name,
          adapter: null
        };
        source = resolveObject(this.sourcesContext_[name], resolveSetSource, source, "adapter", this);
        if (oldSource !== source) {
          var listenHandler = this.listen["source:" + name];
          if (oldSource) {
            if (listenHandler) oldSource.removeHandler(listenHandler, this);
            oldSource.removeHandler(MERGE_SOURCE_HANDLER, this.sourcesContext_[name]);
          }
          this.sources[name] = source;
          if (source) {
            source.addHandler(MERGE_SOURCE_HANDLER, this.sourcesContext_[name]);
            if (listenHandler) source.addHandler(listenHandler, this);
            var newData = this.fields.sources[name](source.data);
            if (this.fields.defaultSource == name) for (var key in this.data) if (!this.fields.fieldSource.hasOwnProperty(key) && !newData.hasOwnProperty(key)) newData[key] = undefined;
            this.update(newData);
          }
          this.emit_sourceChanged(name, oldSource);
        }
      },
      setSources: function(sources) {
        if (!sources) sources = {};
        for (var name in this.fields.sources) this.setSource(name, sources[name]);
        for (var name in sources) if (name in this.fields.sources == false) basis.dev.warn("basis.data.object.Merge#setSource: can't set source with name `" + name + "` as not specified by fields configuration");
      },
      destroy: function() {
        this.setSources();
        this.sources = null;
        this.sourcesContext_ = null;
        DataObject.prototype.destroy.call(this);
      }
    });
    module.exports = {
      Merge: Merge
    };
  },
  "m.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var Class = basis.Class;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var keys = basis.object.keys;
    var extend = basis.object.extend;
    var complete = basis.object.complete;
    var $self = basis.fn.$self;
    var arrayFrom = basis.array.from;
    var basisEvent = basis.require("./2.js");
    var Emitter = basisEvent.Emitter;
    var createEvent = basisEvent.create;
    var basisData = basis.require("./e.js");
    var DataObject = basisData.Object;
    var Slot = basisData.Slot;
    var Dataset = basisData.Dataset;
    var basisDataset = basis.require("./i.js");
    var Filter = basisDataset.Filter;
    var Split = basisDataset.Split;
    var NULL_INFO = {};
    var entityTypes = [];
    var isKeyType = {
      string: true,
      number: true
    };
    var NumericId = function(value) {
      return value == null || isNaN(value) ? null : Number(value);
    };
    var NumberId = function(value) {
      return value == null || isNaN(value) ? null : Number(value);
    };
    var IntId = function(value) {
      return value == null || isNaN(value) ? null : parseInt(value, 10);
    };
    var StringId = function(value) {
      return value == null ? null : String(value);
    };
    var untitledNames = {};
    function getUntitledName(name) {
      untitledNames[name] = untitledNames[name] || 0;
      return name + untitledNames[name]++;
    }
    var namedTypes = {};
    var namedIndexes = {};
    var deferredTypeDef = {};
    var TYPE_DEFINITION_PLACEHOLDER = function TYPE_DEFINITION_PLACEHOLDER() {};
    function resolveType(typeName, type) {
      var list = deferredTypeDef[typeName];
      if (list) {
        for (var i = 0, def; def = list[i]; i++) {
          var typeHost = def[0];
          var fieldName = def[1];
          typeHost[fieldName] = type;
        }
        delete deferredTypeDef[typeName];
      }
      namedTypes[typeName] = type;
    }
    function getTypeByName(typeName, typeHost, field) {
      if (namedTypes[typeName]) return namedTypes[typeName];
      var list = deferredTypeDef[typeName];
      if (!list) list = deferredTypeDef[typeName] = [];
      list.push([ typeHost, field ]);
      return function(value, oldValue) {
        var Type = namedTypes[typeName];
        if (Type) return Type(value, oldValue);
        if (arguments.length && value != null) basis.dev.warn(namespace + ": type `" + typeName + "` is not defined for `" + field + "`, but function called");
      };
    }
    function validateScheme() {
      for (var typeName in deferredTypeDef) basis.dev.warn(namespace + ": type `" + typeName + "` is not defined, but used by " + deferredTypeDef[typeName].length + " type(s)");
    }
    var Index = Class(null, {
      className: namespace + ".Index",
      items: null,
      init: function() {
        this.items = {};
      },
      get: function(value, checkType) {
        var item = hasOwnProperty.call(this.items, value) && this.items[value];
        if (item && (!checkType || item.entityType === checkType)) return item;
      },
      add: function(value, newItem) {
        if (newItem) {
          var curItem = this.get(value);
          if (!curItem) {
            this.items[value] = newItem;
            return true;
          }
          if (curItem !== newItem) throw "basis.entity: Value `" + value + "` for index is already occupied";
        }
      },
      remove: function(value, item) {
        if (this.items[value] === item) {
          delete this.items[value];
          return true;
        }
      },
      destroy: function() {
        this.items = null;
      }
    });
    function CalculateField() {
      var names = arrayFrom(arguments);
      var calcFn = names.pop();
      var foo = names[0];
      var bar = names[1];
      var baz = names[2];
      var result;
      if (typeof calcFn != "function") throw "Last argument for calculate field constructor must be a function";
      switch (names.length) {
        case 0:
          result = function() {
            return calcFn();
          };
          break;
        case 1:
          result = function(delta, data, oldValue) {
            if (foo in delta) return calcFn(data[foo]);
            return oldValue;
          };
          break;
        case 2:
          result = function(delta, data, oldValue) {
            if (foo in delta || bar in delta) return calcFn(data[foo], data[bar]);
            return oldValue;
          };
          break;
        case 3:
          result = function(delta, data, oldValue) {
            if (foo in delta || bar in delta || baz in delta) return calcFn(data[foo], data[bar], data[baz]);
            return oldValue;
          };
          break;
        default:
          result = function(delta, data, oldValue) {
            var changed = false;
            var args = [];
            for (var i = 0, name; name = names[i]; i++) {
              changed = changed || name in delta;
              args.push(data[name]);
            }
            if (changed) return calcFn.apply(null, args);
            return oldValue;
          };
      }
      result = Function("calcFn", "names", "return " + result.toString().replace(/(foo|bar|baz)/g, function(m, w) {
        return '"' + names[w == "foo" ? 0 : w == "bar" ? 1 : 2] + '"';
      }).replace(/\[\"([^"]+)\"\]/g, ".$1"))(calcFn, names);
      result.args = names;
      result.calc = result;
      return result;
    }
    function ConcatStringField(name) {
      if (arguments.length == 1) return function(delta, data, oldValue) {
        if (name in delta) return data[name] != null ? String(data[name]) : null;
        return oldValue;
      };
      return CalculateField.apply(null, arrayFrom(arguments).concat(function() {
        for (var i = arguments.length - 1; i >= 0; i--) if (arguments[i] == null) return null;
        return Array.prototype.join.call(arguments, "-");
      }));
    }
    function getDelta(inserted, deleted) {
      var delta = {};
      var result;
      if (inserted && inserted.length) result = delta.inserted = inserted;
      if (deleted && deleted.length) result = delta.deleted = deleted;
      if (result) return delta;
    }
    var WRAPPED_MARKER = "wrapped" + basis.genUID();
    var ENTITYSET_WRAP_METHOD = function(superClass, method) {
      return function(data) {
        if (data && !Array.isArray(data)) data = [ data ];
        var needToWrap = data && !data[WRAPPED_MARKER];
        if (needToWrap) {
          if (this.localId) {
            var items = arrayFrom(this.getItems());
            data = data.map(function(newItem) {
              for (var i = 0; i < items.length; i++) if (this.localId(newItem, items[i])) return this.wrapper(newItem, items[i]);
              newItem = this.wrapper(newItem);
              items.push(newItem);
              return newItem;
            }, this);
          } else {
            data = data.map(this.wrapper);
          }
          data[WRAPPED_MARKER] = true;
        }
        var delta = superClass.prototype[method].call(this, data);
        if (needToWrap) {
          data[WRAPPED_MARKER] = false;
          if (this.localId && delta && delta.deleted) {
            Dataset.setAccumulateState(true);
            for (var i = 0; i < delta.deleted.length; i++) if (delta.deleted[i].root) delta.deleted[i].destroy();
            Dataset.setAccumulateState(false);
          }
        }
        return delta;
      };
    };
    var ENTITYSET_INIT_METHOD = function(superClass, name) {
      return function() {
        if (!this.name) this.name = getUntitledName(name);
        superClass.prototype.init.call(this);
      };
    };
    var ENTITYSET_SYNC_METHOD = function() {
      return function(data) {
        if (this.localId) return this.set(data);
        var destroyItems = basis.object.slice(this.items_);
        var itemsChangedFired = false;
        var listenHandler = this.listen.item;
        var inserted = [];
        var deleted = [];
        var delta;
        if (data) {
          Dataset.setAccumulateState(true);
          for (var i = 0; i < data.length; i++) {
            var entity = this.wrapper(data[i]);
            if (entity) {
              if (entity.basisObjectId in destroyItems == false) inserted.push(entity);
              destroyItems[entity.basisObjectId] = false;
            }
          }
          var checkHandler = {
            itemsChanged: function() {
              itemsChangedFired = true;
            }
          };
          this.addHandler(checkHandler);
          Dataset.setAccumulateState(false);
          this.removeHandler(checkHandler);
        }
        for (var key in destroyItems) if (destroyItems[key]) deleted.push(destroyItems[key]);
        if (!itemsChangedFired && (delta = getDelta(inserted, deleted))) {
          if (listenHandler) {
            if (delta.deleted) for (var i = 0; i < delta.deleted.length; i++) delta.deleted[i].removeHandler(listenHandler, this);
            if (delta.inserted) for (var i = 0; i < delta.inserted.length; i++) delta.inserted[i].addHandler(listenHandler, this);
          }
          this.emit_itemsChanged(delta);
        }
        if (deleted.length && this.wrapper.all) this.wrapper.all.emit_itemsChanged({
          deleted: deleted
        });
        Dataset.setAccumulateState(true);
        for (var i = 0; i < deleted.length; i++) deleted[i].destroy();
        Dataset.setAccumulateState(false);
        return inserted.length ? inserted : null;
      };
    };
    var EntitySet = Class(Dataset, {
      className: namespace + ".EntitySet",
      name: null,
      wrapper: $self,
      init: ENTITYSET_INIT_METHOD(Dataset, "EntitySet"),
      setAndDestroyRemoved: ENTITYSET_SYNC_METHOD(Dataset),
      set: ENTITYSET_WRAP_METHOD(Dataset, "set"),
      add: ENTITYSET_WRAP_METHOD(Dataset, "add"),
      remove: ENTITYSET_WRAP_METHOD(Dataset, "remove"),
      clear: function() {
        var delta = Dataset.prototype.clear.call(this);
        if (this.localId && delta && delta.deleted) {
          Dataset.setAccumulateState(true);
          for (var i = 0; i < delta.deleted.length; i++) delta.deleted[i].destroy();
          Dataset.setAccumulateState(false);
        }
        return delta;
      },
      destroy: function() {
        Dataset.prototype.destroy.call(this);
        this.wrapper = null;
      }
    });
    var ReadOnlyEntitySet = Class(EntitySet, {
      className: namespace + ".ReadOnlyEntitySet",
      set: basis.fn.$false,
      add: basis.fn.$false,
      remove: basis.fn.$false,
      clear: basis.fn.$false
    });
    var EntityCollection = Class(Filter, {
      className: namespace + ".EntityCollection",
      name: null,
      init: ENTITYSET_INIT_METHOD(Filter, "EntityCollection")
    });
    var EntityGrouping = Class(Split, {
      className: namespace + ".EntityGrouping",
      name: null,
      subsetClass: ReadOnlyEntitySet,
      init: ENTITYSET_INIT_METHOD(Split, "EntityGrouping"),
      getSubset: function(object, autocreate) {
        var group = Split.prototype.getSubset.call(this, object, autocreate);
        if (group && group.dataset) group.dataset.wrapper = this.wrapper;
        return group;
      }
    });
    var EntitySetWrapper = function(wrapper, name, options) {
      function createLocalId(id) {
        if (typeof id == "string") return function(data, item) {
          return data[id] == item.data[id];
        };
        if (typeof id == "function") return id;
      }
      if (this instanceof EntitySetWrapper) {
        if (!wrapper) wrapper = $self;
        if (!name || namedTypes[name]) {
          if (namedTypes[name]) basis.dev.warn(namespace + ": Duplicate entity set type name `" + this.name + "`, name ignored");
          name = getUntitledName("UntitledEntitySetType");
        }
        var entitySetType = new EntitySetConstructor({
          entitySetClass: {
            className: namespace + ".EntitySet(" + (typeof wrapper == "string" ? wrapper : (wrapper.type || wrapper).name || "UnknownType") + ")",
            name: "Set of {" + (typeof wrapper == "string" ? wrapper : (wrapper.type || wrapper).name || "UnknownType") + "}",
            wrapper: wrapper,
            localId: createLocalId(options && options.localId)
          }
        });
        var EntitySetClass = entitySetType.entitySetClass;
        var result = function(data, entitySet) {
          if (data != null) {
            if (entitySet instanceof EntitySet == false) entitySet = entitySetType.createEntitySet();
            entitySet.set(data instanceof Dataset ? data.getItems() : arrayFrom(data));
            return entitySet;
          } else return null;
        };
        if (typeof wrapper == "string") EntitySetClass.prototype.wrapper = getTypeByName(wrapper, EntitySetClass.prototype, "wrapper");
        resolveType(name, result);
        extend(result, {
          type: entitySetType,
          typeName: name,
          toString: function() {
            return name + "()";
          },
          reader: function(data) {
            if (Array.isArray(data)) {
              var wrapper = EntitySetClass.prototype.wrapper;
              return data.map(wrapper.reader || wrapper);
            }
            return data;
          },
          extendClass: function(source) {
            EntitySetClass.extend.call(EntitySetClass, source);
            return result;
          },
          extendReader: function(extReader) {
            var reader = result.reader;
            result.reader = function(data) {
              if (Array.isArray(data)) extReader(data);
              return reader(data);
            };
            return result;
          },
          entitySetType: entitySetType,
          extend: function() {
            basis.dev.warn("basis.entity: EntitySetType.extend() is deprecated, use EntitySetType.extendClass() instead.");
            return EntitySetClass.extend.apply(EntitySetClass, arguments);
          }
        });
        basis.dev.warnPropertyAccess(result, "entitySetType", entitySetType, "basis.entity: EntitySetType.entitySetType is deprecated, use EntitySetType.type instead.");
        return result;
      }
    };
    EntitySetWrapper.className = namespace + ".EntitySetWrapper";
    var EntitySetConstructor = Class(null, {
      className: namespace + ".EntitySetConstructor",
      entitySetClass: EntitySet,
      extendConstructor_: true,
      createEntitySet: function() {
        return new this.entitySetClass;
      }
    });
    var EntityTypeWrapper = function(config) {
      if (this instanceof EntityTypeWrapper) {
        var result;
        if (config.singleton) result = function(data) {
          var entity = entityType.get();
          if (entity) {
            if (data) entity.update(data);
          } else entity = new EntityClass(data || {});
          return entity;
        }; else result = function(data, entity) {
          if (data != null) {
            if (!entity || entity.entityType !== entityType) entity = null;
            if (data === entity || data.entityType === entityType) return data;
            var idValue;
            var idField = entityType.idField;
            if (isKeyType[typeof data]) {
              if (!idField) {
                if (entityType.compositeKey) basis.dev.warn("basis.entity: Entity type `" + entityType.name + "` wrapper was invoked with " + typeof data + " value as index, but entity type index is composite and consists of [" + keys(entityType.idFields).join(", ") + "] fields"); else basis.dev.warn("basis.entity: Entity type `" + entityType.name + "` wrapper was invoked with " + typeof data + " value as index, but entity type has no index");
                return;
              }
              if (entity = entityType.index.get(data, entityType)) return entity;
              idValue = data;
              data = {};
              data[idField] = idValue;
            } else {
              if (entityType.compositeKey) idValue = entityType.compositeKey(data, data);
              if (idValue != null) entity = entityType.index.get(idValue, entityType);
            }
            if (entity && entity.entityType === entityType) entity.update(data); else entity = new EntityClass(data);
            return entity;
          }
        };
        var entityType = new EntityTypeConstructor(config || {}, result);
        var EntityClass = entityType.entityClass;
        var name = entityType.name;
        resolveType(name, result);
        extend(result, {
          all: entityType.all,
          type: entityType,
          typeName: name,
          toString: function() {
            return name + "()";
          },
          get: function(data) {
            return entityType.get(data);
          },
          getSlot: function(id, defaults) {
            return entityType.getSlot(id, defaults);
          },
          reader: function(data) {
            return entityType.reader(data);
          },
          readList: function(value, map) {
            if (!value) return [];
            if (!Array.isArray(value)) value = [ value ];
            if (typeof map != "function") map = $self;
            for (var i = 0; i < value.length; i++) value[i] = result(result.reader(map(value[i], i)));
            return value;
          },
          extendClass: function(source) {
            EntityClass.extend.call(EntityClass, source);
            return result;
          },
          extendReader: function(extReader) {
            var reader = result.reader;
            result.reader = function(data) {
              if (data && typeof data == "object") extReader(data);
              return reader(data);
            };
            return result;
          },
          entityType: entityType,
          extend: function() {
            basis.dev.warn("basis.entity: EntityType.extend() is deprecated, use EntityType.extendClass() instead.");
            return EntityClass.extend.apply(EntityClass, arguments);
          }
        });
        basis.dev.warnPropertyAccess(result, "entityType", entityType, "basis.entity: EntityType.entityType is deprecated, use EntityType.type instead.");
        return result;
      }
    };
    EntityTypeWrapper.className = namespace + ".EntityTypeWrapper";
    var fieldDestroyHandlers = {};
    var dataBuilderFactory = {};
    var calcFieldWrapper = function(value, oldValue) {
      basis.dev.warn("Calculate fields are readonly");
      return oldValue;
    };
    var warnCalcReadOnly = function(name) {
      basis.dev.warn("basis.entity: Attempt to set value for `" + name + "` field was ignored as field is calc (read only)");
    };
    function getDataBuilder(defaults, fields, calcs) {
      var args = [ "has" ];
      var values = [ hasOwnProperty ];
      var obj = [];
      args.push("warnCalcReadOnly");
      values.push(warnCalcReadOnly);
      for (var key in defaults) if (hasOwnProperty.call(defaults, key)) {
        var escapedKey = '"' + key.replace(/"/g, '"') + '"';
        if (hasOwnProperty.call(calcs, key)) {
          obj.push(escapedKey + ":" + "has.call(data," + escapedKey + ")" + "?" + "warnCalcReadOnly(" + escapedKey + ")" + ":" + "undefined");
          continue;
        }
        var name = "v" + obj.length;
        var fname = "f" + obj.length;
        var defValue = defaults[key];
        args.push(name, fname);
        values.push(defValue, fields[key]);
        obj.push(escapedKey + ":" + fname + "(" + "has.call(data," + escapedKey + ")" + "?" + "data[" + escapedKey + "]" + ":" + name + (typeof defValue == "function" ? "(data)" : "") + ")");
      }
      var code = obj.sort().join(",");
      var fn = dataBuilderFactory[code];
      if (!fn) fn = dataBuilderFactory[code] = new Function(args, "return function(data){" + "return {" + code + "};" + "};");
      return fn.apply(null, values);
    }
    function arrayField(newArray, oldArray) {
      if (!Array.isArray(newArray)) return null;
      if (!Array.isArray(oldArray) || newArray.length != oldArray.length) return newArray || null;
      for (var i = 0; i < newArray.length; i++) if (newArray[i] !== oldArray[i]) return newArray;
      return oldArray;
    }
    var reIsoStringSplit = /\D/;
    var reIsoTimezoneDesignator = /(.{10,})([\-\+]\d{1,2}):?(\d{1,2})?$/;
    var fromISOString = function() {
      function fastDateParse(y, m, d, h, i, s, ms) {
        var date = new Date(y, m - 1, d, h || 0, 0, s || 0, ms ? ms.substr(0, 3) : 0);
        date.setMinutes((i || 0) - tz - date.getTimezoneOffset());
        return date;
      }
      var tz;
      return function(isoDateString) {
        tz = 0;
        return fastDateParse.apply(null, String(isoDateString || "").replace(reIsoTimezoneDesignator, function(m, pre, h, i) {
          tz = Number(h || 0) * 60 + Number(i || 0);
          return pre;
        }).split(reIsoStringSplit));
      };
    }();
    function dateField(value, oldValue) {
      if (typeof value == "string" && value) return fromISOString(value);
      if (typeof value == "number" && isNaN(value) == false) return new Date(value);
      if (value == null) return null;
      if (value && value.constructor === Date) return value;
      basis.dev.warn("basis.entity: Bad value for Date field, value ignored");
      return oldValue || null;
    }
    function addField(entityType, name, config) {
      if (typeof config == "string" || Array.isArray(config) || typeof config == "function" && config.calc !== config) {
        config = {
          type: config
        };
      } else {
        config = config ? basis.object.slice(config) : {};
      }
      if ("type" in config) {
        if (typeof config.type == "string") config.type = getTypeByName(config.type, entityType.fields, name);
        if (Array.isArray(config.type)) {
          var values = config.type.slice();
          if (!values.length) basis.dev.warn("Empty array set as type definition for " + entityType.name + "#field." + name + ", is it a bug?");
          if (values.length == 1) {
            config.type = basis.fn.$const(values[0]);
            config.defValue = values[0];
          } else {
            var defaultValue;
            config.type = function(value, oldValue) {
              var exists = value === defaultValue || values.indexOf(value) != -1;
              if (!exists) basis.dev.warn("Set value that not in list for " + entityType.name + "#field." + name + " (new value ignored).\nVariants:", values, "\nIgnored value:", value);
              return exists ? value : oldValue === undefined ? defaultValue : oldValue;
            };
            defaultValue = values.indexOf(config.defValue) != -1 ? config.defValue : values[0];
            config.defValue = defaultValue;
          }
        }
        if (config.type === Array) config.type = arrayField;
        if (config.type === Date) config.type = dateField;
        if (typeof config.type != "function") {
          basis.dev.warn("EntityType " + entityType.name + ": Field wrapper for `" + name + "` field is not a function. Field wrapper has been ignored. Wrapper: ", config.type);
          config.type = null;
        }
      }
      var wrapper = config.type || $self;
      if (config.id || config.index || [ NumericId, NumberId, IntId, StringId ].indexOf(wrapper) != -1) entityType.idFields[name] = config;
      if (config.calc) {
        addCalcField(entityType, name, config.calc);
        entityType.fields[name] = calcFieldWrapper;
      } else {
        entityType.fields[name] = wrapper;
        entityType.aliases[name] = name;
      }
      entityType.defaults[name] = "defValue" in config ? config.defValue : wrapper();
      if (!fieldDestroyHandlers[name]) fieldDestroyHandlers[name] = {
        destroy: function() {
          this.set(name, null);
        }
      };
    }
    function addFieldAlias(entityType, alias, name) {
      if (name in entityType.fields == false) {
        basis.dev.warn("basis.entity: Can't add alias `" + alias + "` for non-exists field `" + name + "`");
        return;
      }
      if (name in entityType.calcMap) {
        basis.dev.warn("basis.entity: Can't add alias `" + alias + "` for calc field `" + name + "`");
        return;
      }
      if (alias in entityType.aliases) {
        basis.dev.warn("basis.entity: Alias `" + alias + "` already exists");
        return;
      }
      entityType.aliases[alias] = name;
    }
    function addCalcField(entityType, name, wrapper) {
      var calcs = entityType.calcs;
      var deps = entityType.deps;
      var calcArgs = wrapper.args || [];
      var calcConfig = {
        args: calcArgs,
        wrapper: wrapper
      };
      var before = entityType.calcs.length;
      var after = 0;
      if (calcArgs) for (var i = 0, calc; calc = calcs[i]; i++) if (calcArgs.indexOf(calc.key) != -1) after = i + 1;
      if (name) {
        calcConfig.key = name;
        entityType.calcMap[name] = calcConfig;
        for (var i = 0, calc; calc = calcs[i]; i++) if (calc.args.indexOf(name) != -1) {
          before = i;
          break;
        }
        if (after > before) {
          basis.dev.warn("Can't add calculate field `" + name + "`, because recursion");
          return;
        }
        deps[name] = calcArgs.reduce(function(res, ref) {
          var items = deps[ref] || [ ref ];
          for (var i = 0; i < items.length; i++) basis.array.add(res, items[i]);
          return res;
        }, []);
        for (var ref in deps) {
          var idx = deps[ref].indexOf(name);
          if (idx != -1) Array.prototype.splice.apply(deps[ref], [ idx, 1 ].concat(deps[name]));
        }
      } else {
        before = after;
      }
      calcs.splice(Math.min(before, after), 0, calcConfig);
    }
    function getFieldGetter(name) {
      return function(real) {
        if (real && this.modified && name in this.modified) return this.modified[name];
        return this.data[name];
      };
    }
    function getFieldSetter(name) {
      return function(value, rollback) {
        return this.set(name, value, rollback);
      };
    }
    var EntityTypeConstructor = Class(null, {
      className: namespace + ".EntityType",
      wrapper: null,
      all: null,
      fields: null,
      idField: null,
      idFields: null,
      compositeKey: null,
      idProperty: null,
      defaults: null,
      calcs: null,
      calcMap: null,
      aliases: null,
      slots: null,
      singleton: false,
      index: null,
      indexes: null,
      entityClass: null,
      init: function(config, wrapper) {
        this.name = config.name;
        if (!this.name || namedTypes[this.name]) {
          if (namedTypes[this.name]) basis.dev.warn(namespace + ": Duplicate type name `" + this.name + "`, name ignored");
          this.name = getUntitledName("UntitledEntityType");
        }
        this.fields = {};
        this.calcs = [];
        this.calcMap = {};
        this.deps = {};
        this.idFields = {};
        this.defaults = {};
        this.aliases = {};
        this.slots = {};
        var index = config.index;
        if (index) {
          if (index instanceof Index) this.index = index; else basis.dev.warn("index must be instanceof basis.entity.Index");
        }
        this.wrapper = wrapper;
        if ("all" in config == false || config.all || config.singleton) this.all = new ReadOnlyEntitySet(complete({
          wrapper: wrapper
        }, config.all));
        this.singleton = !!config.singleton;
        if (this.singleton) {
          var singletonInstance;
          this.get = function() {
            return singletonInstance;
          };
          this.all.addHandler({
            itemsChanged: function(sender, delta) {
              singletonInstance = delta.inserted ? delta.inserted[0] : null;
            }
          }, this);
        }
        for (var key in config.fields) addField(this, key, config.fields[key]);
        for (var key in config.aliases) addFieldAlias(this, key, config.aliases[key]);
        if (config.constrains) config.constrains.forEach(function(item) {
          addCalcField(this, null, item);
        }, this);
        if (!this.calcs.length) this.calcs = null;
        var idFields = keys(this.idFields);
        var indexes = {};
        if (idFields.length) {
          for (var field in this.idFields) {
            var fieldCfg = this.idFields[field];
            var index = fieldCfg.index;
            var indexDescriptor;
            if (!index || index instanceof Index == false) {
              if (typeof index == "string") {
                if (index in namedIndexes == false) namedIndexes[index] = new Index;
                index = namedIndexes[index];
              } else {
                if (!this.index) this.index = new Index;
                index = this.index;
              }
            }
            indexDescriptor = indexes[index.basisObjectId];
            if (!indexDescriptor) indexDescriptor = indexes[index.basisObjectId] = {
              index: index,
              fields: []
            };
            indexDescriptor.fields.push(field);
            this.idFields[field] = indexDescriptor;
          }
          if (this.index && this.index.basisObjectId in indexes == false) {
            basis.dev.warn("basis.entity: entity index is not used for any field, index ignored");
            this.index = null;
          }
          for (var id in indexes) {
            var indexDescriptor = indexes[id];
            indexDescriptor.property = "__id__" + id;
            indexDescriptor.compositeKey = ConcatStringField.apply(null, indexDescriptor.fields);
            if (indexDescriptor.fields.length == 1) indexDescriptor.idField = indexDescriptor.fields[0];
          }
          var indexesKeys = keys(indexes);
          var primaryIndex = indexes[this.index ? this.index.basisObjectId : indexesKeys[0]];
          this.index = primaryIndex.index;
          this.idField = primaryIndex.idField;
          this.compositeKey = primaryIndex.compositeKey;
          this.idProperty = primaryIndex.property;
          this.indexes = indexes;
        } else {
          if (this.index) {
            basis.dev.warn("basis.entity: entity has no any id field, index ignored");
            this.index = null;
          }
        }
        var initDelta = {};
        for (var key in this.defaults) initDelta[key] = undefined;
        if (hasOwnProperty.call(config, "state")) basis.dev.warn("basis.entity: default instance state can't be defined via type config anymore, use Type.extendClass({ state: .. }) instead");
        this.entityClass = createEntityClass(this, this.all, this.fields, this.slots);
        this.entityClass.extend({
          entityType: this,
          type: wrapper,
          typeName: this.name,
          generateData: getDataBuilder(this.defaults, this.fields, this.calcMap),
          initDelta: initDelta
        });
        for (var name in this.fields) {
          this.entityClass.prototype["get_" + name] = getFieldGetter(name);
          if (this.fields[name] !== calcFieldWrapper) this.entityClass.prototype["set_" + name] = getFieldSetter(name);
        }
        entityTypes.push(this);
      },
      reader: function(data) {
        var result = {};
        if (isKeyType[typeof data]) return this.idField ? data : null;
        if (!data || data == null) return null;
        for (var key in data) {
          var fieldKey = this.aliases[key];
          if (fieldKey) {
            var reader = this.fields[fieldKey].reader;
            result[fieldKey] = reader ? reader(data[key]) : data[key];
          }
        }
        return result;
      },
      get: function(entityOrData) {
        var id = this.getId(entityOrData);
        if (this.index && id != null) return this.index.get(id, this);
      },
      getId: function(entityOrData) {
        if (this.compositeKey && entityOrData != null) {
          if (isKeyType[typeof entityOrData]) return entityOrData;
          if (entityOrData && entityOrData.entityType === this) return entityOrData[this.idProperty];
          if (entityOrData instanceof DataObject) entityOrData = entityOrData.data;
          if (this.compositeKey) return this.compositeKey(entityOrData, entityOrData);
        }
      },
      getSlot: function(data) {
        var id = this.getId(data);
        if (id != null) {
          var slot = hasOwnProperty.call(this.slots, id) && this.slots[id];
          if (!slot) {
            if (isKeyType[typeof data]) {
              var tmp = {};
              if (this.idField) tmp[this.idField] = data;
              data = tmp;
            }
            slot = this.slots[id] = new Slot({
              delegate: this.get(id) || null,
              data: data
            });
          }
          return slot;
        }
      }
    });
    function entityWarn(entity, message) {
      basis.dev.warn("[basis.entity " + entity.entityType.name + "#" + entity.basisObjectId + "] " + message, entity);
    }
    var BaseEntity = Class(DataObject, {
      className: namespace + ".BaseEntity",
      target: true,
      setDelegate: function() {},
      extendConstructor_: false,
      fieldHandlers_: null,
      modified: null,
      emit_rollbackUpdate: createEvent("rollbackUpdate")
    });
    var createEntityClass = function(entityType, all, fields, slots) {
      function calc(entity, delta, rollbackDelta) {
        var calcs = entityType.calcs;
        var data = entity.data;
        var updated = false;
        try {
          if (calcs) {
            for (var i = 0, calc; calc = calcs[i]; i++) {
              var key = calc.key;
              var oldValue = data[key];
              var newValue = calc.wrapper(delta, data, oldValue);
              if (key && newValue !== oldValue) {
                delta[key] = oldValue;
                data[key] = newValue;
                updated = true;
              }
            }
          }
          for (var id in entityType.indexes) {
            var indexDescriptor = entityType.indexes[id];
            var curId = entity[indexDescriptor.property];
            var newId = curId;
            if (indexDescriptor.compositeKey) newId = indexDescriptor.compositeKey(delta, data, curId);
            if (newId !== curId) {
              updateIndex(indexDescriptor.index, entity, curId, newId);
              entity[indexDescriptor.property] = newId;
            }
          }
          return updated;
        } catch (e) {
          entityWarn(entity, "(rollback changes) Exception on field calcs: " + (e && e.message || e));
          for (var key in delta) entity.data[key] = delta[key];
          if (rollbackDelta && !entity.modified) entity.modified = rollbackDelta;
        }
      }
      function updateIndex(index, entity, curValue, newValue) {
        if (newValue != null) {
          index.add(newValue, entity);
          if (hasOwnProperty.call(slots, newValue)) slots[newValue].setDelegate(entity);
        }
        if (curValue != null) {
          index.remove(curValue, entity);
          if (hasOwnProperty.call(slots, curValue)) slots[curValue].setDelegate();
        }
      }
      return Class(BaseEntity, {
        className: entityType.name,
        syncEvents: {
          update: true,
          stateChanged: true,
          subscribersChanged: true
        },
        isSyncRequired: function() {
          return DataObject.prototype.isSyncRequired.call(this) && (!entityType.idProperty || this[entityType.idProperty] != null);
        },
        init: function(data) {
          this.delegate = null;
          this.data = this.generateData(data);
          BaseEntity.prototype.init.call(this);
          for (var key in data) if (key in fields == false) entityWarn(this, 'Field "' + key + '" is not defined, value has been ignored.');
          var value;
          for (var key in this.data) {
            value = this.data[key];
            if (value && value !== this && value instanceof Emitter) {
              value.addHandler(fieldDestroyHandlers[key], this);
              if (!this.fieldHandlers_) this.fieldHandlers_ = {};
              this.fieldHandlers_[key] = true;
            }
          }
          calc(this, this.initDelta);
          if (all) all.emit_itemsChanged({
            inserted: [ this ]
          });
        },
        toString: function() {
          return "[object " + this.constructor.className + "(" + this.entityType.name + ")]";
        },
        getId: function() {
          return this[entityType.idProperty];
        },
        get: function(key, real) {
          if (real && this.modified && key in this.modified) return this.modified[key];
          return this.data[key];
        },
        set: function(key, value, rollback, silent_) {
          var valueWrapper = fields[key];
          if (!valueWrapper) {
            entityWarn(this, 'Field "' + key + '" is not defined, value has been ignored.');
            return false;
          }
          var result;
          var rollbackData = this.modified;
          if (valueWrapper === arrayField && rollbackData && key in rollbackData) value = arrayField(value, rollbackData[key]);
          var newValue = valueWrapper(value, this.data[key]);
          var curValue = this.data[key];
          var valueChanged = newValue !== curValue && (!newValue || !curValue || newValue.constructor !== Date || curValue.constructor !== Date || +newValue !== +curValue);
          if (valueChanged) updateField : {
            result = {};
            if (!entityType.idFields[key]) {
              if (rollback) {
                if (!rollbackData) this.modified = rollbackData = {};
                if (key in rollbackData === false) {
                  result.rollback = {
                    key: key,
                    value: undefined
                  };
                  rollbackData[key] = curValue;
                } else {
                  if (rollbackData[key] === newValue) {
                    result.rollback = {
                      key: key,
                      value: newValue
                    };
                    delete rollbackData[key];
                    if (!keys(rollbackData).length) this.modified = null;
                  }
                }
              } else {
                if (rollbackData && key in rollbackData) {
                  if (rollbackData[key] !== newValue) {
                    result.rollback = {
                      key: key,
                      value: rollbackData[key]
                    };
                    rollbackData[key] = newValue;
                    break updateField;
                  } else return false;
                }
              }
            }
            this.data[key] = newValue;
            if (this.fieldHandlers_ && this.fieldHandlers_[key]) {
              curValue.removeHandler(fieldDestroyHandlers[key], this);
              this.fieldHandlers_[key] = false;
            }
            if (newValue && newValue !== this && newValue instanceof Emitter) {
              newValue.addHandler(fieldDestroyHandlers[key], this);
              if (!this.fieldHandlers_) this.fieldHandlers_ = {};
              this.fieldHandlers_[key] = true;
            }
            result.key = key;
            result.value = curValue;
            result.delta = {};
            result.delta[key] = curValue;
          } else {
            if (!rollback && rollbackData && key in rollbackData) {
              result = {
                rollback: {
                  key: key,
                  value: rollbackData[key]
                }
              };
              delete rollbackData[key];
              if (!keys(rollbackData).length) this.modified = null;
            }
          }
          if (!silent_ && result) {
            var update = result.key;
            var delta = result.delta || {};
            var rollbackDelta;
            if (result.rollback) {
              rollbackDelta = {};
              rollbackDelta[result.rollback.key] = result.rollback.value;
            }
            if (calc(this, delta, rollbackDelta)) update = true;
            if (update) {
              this.emit_update(delta);
              result.delta = delta;
            }
            if (rollbackDelta) this.emit_rollbackUpdate(rollbackDelta);
          }
          return result || false;
        },
        update: function(data, rollback) {
          var update = false;
          var delta = {};
          if (data) {
            var rollbackDelta;
            var setResult;
            for (var key in data) {
              if (setResult = this.set(key, data[key], rollback, true)) {
                if (setResult.key) {
                  update = true;
                  delta[setResult.key] = setResult.value;
                }
                if (setResult.rollback) {
                  if (!rollbackDelta) rollbackDelta = {};
                  rollbackDelta[setResult.rollback.key] = setResult.rollback.value;
                }
              }
            }
            if (calc(this, delta, rollbackDelta)) update = true;
            if (update) this.emit_update(delta);
            if (rollbackDelta) this.emit_rollbackUpdate(rollbackDelta);
          }
          return update ? delta : false;
        },
        read: function(data) {
          return this.update(this.type.reader(data));
        },
        generateData: function() {
          return {};
        },
        reset: function() {
          this.update(this.generateData({}));
        },
        clear: function() {
          var data = {};
          for (var key in this.data) data[key] = undefined;
          return this.update(data);
        },
        commit: function(data) {
          var rollbackData = this.modified;
          this.modified = null;
          if (data) this.update(data);
          if (rollbackData) this.emit_rollbackUpdate(rollbackData);
        },
        rollback: function(keys) {
          var rollbackData = this.modified;
          if (rollbackData && keys) {
            if (!Array.isArray(keys)) keys = [ keys ];
            rollbackData = basis.object.slice(rollbackData, keys.reduce(function(res, item) {
              return res.concat(entityType.deps[item] || item);
            }, []));
          }
          this.update(rollbackData, true);
        },
        destroy: function() {
          if (this.fieldHandlers_) {
            for (var key in this.fieldHandlers_) if (this.fieldHandlers_[key]) this.data[key].removeHandler(fieldDestroyHandlers[key], this);
            this.fieldHandlers_ = null;
          }
          for (var key in entityType.indexes) {
            var indexDescriptor = entityType.indexes[key];
            var id = this[indexDescriptor.property];
            if (id != null) updateIndex(indexDescriptor.index, this, id, null);
          }
          if (all && all.has(this)) all.emit_itemsChanged({
            deleted: [ this ]
          });
          DataObject.prototype.destroy.call(this);
          this.data = NULL_INFO;
          this.modified = null;
        }
      });
    };
    function isEntity(value) {
      return value && value instanceof BaseEntity;
    }
    function createType(configOrName, fields) {
      if (this instanceof createType) basis.dev.warn("`new` operator was used with basis.entity.createType, it's a mistake");
      var config = configOrName || {};
      if (typeof configOrName == "string") {
        config = {
          name: config,
          fields: fields || {}
        };
      } else {
        if (fields) config = basis.object.merge(config, {
          fields: fields
        });
      }
      return new EntityTypeWrapper(config);
    }
    function createSetType(name, type, options) {
      if (this instanceof createSetType) basis.dev.warn("`new` operator was used with basis.entity.createSetType, it's a mistake");
      switch (arguments.length) {
        case 0:
        case 1:
          if (name && name.constructor === Object) {
            options = basis.object.slice(name);
            type = basis.object.splice(options).type;
            name = basis.object.splice(options).name;
          } else {
            type = name;
            name = undefined;
          }
          break;
        case 2:
          if (type && type.constructor === Object) {
            options = type;
            type = name;
            name = undefined;
          }
          break;
      }
      return new EntitySetWrapper(type, name, options);
    }
    module.exports = {
      isEntity: isEntity,
      createType: createType,
      createSetType: createSetType,
      validate: validateScheme,
      getTypeByName: function(typeName) {
        return namedTypes[typeName];
      },
      getIndexByName: function(name) {
        return namedIndexes[name];
      },
      is: function(value, type) {
        var EntityClass;
        if (typeof type == "string") type = namedTypes[type];
        EntityClass = type && type.type && type.type.entityClass;
        return value && EntityClass ? value instanceof EntityClass : false;
      },
      get: function(typeName, value) {
        var Type = namedTypes[typeName];
        if (Type) return Type.get(value);
      },
      resolve: function(typeName, value) {
        var Type = namedTypes[typeName];
        if (Type) return Type(value);
      },
      getByIndex: function(indexName, id) {
        if (indexName in namedIndexes) return namedIndexes[indexName].get(id); else basis.dev.warn("basis.entity: index with name `" + indexName + "` doesn't exists");
      },
      NumericId: NumericId,
      NumberId: NumberId,
      IntId: IntId,
      StringId: StringId,
      Index: Index,
      CalculateField: CalculateField,
      ConcatStringField: ConcatStringField,
      calc: CalculateField,
      EntityType: EntityTypeWrapper,
      Entity: createEntityClass,
      BaseEntity: BaseEntity,
      EntitySetType: EntitySetWrapper,
      EntitySet: EntitySet,
      ReadOnlyEntitySet: ReadOnlyEntitySet,
      Collection: EntityCollection,
      Grouping: EntityGrouping
    };
    basis.resource("./m.js").ready(function() {
      basis.dev.warnPropertyAccess(module.exports, "Collection", EntityCollection, "basis.entity: Collection class is deprecated, use basis.data.dataset.Filter instead.");
      basis.dev.warnPropertyAccess(module.exports, "Grouping", EntityGrouping, "basis.entity: Grouping class is deprecated, use basis.data.dataset.Split instead.");
    });
  },
  "n.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var document = global.document;
    var escapeValue = global.encodeURIComponent;
    var extend = basis.object.extend;
    var objectSlice = basis.object.slice;
    var objectMerge = basis.object.merge;
    var basisNet = basis.require("./o.js");
    var createTransportEvent = basisNet.createTransportEvent;
    var createRequestEvent = basisNet.createRequestEvent;
    var AbstractRequest = basisNet.AbstractRequest;
    var AbstractTransport = basisNet.AbstractTransport;
    var STATE = basis.require("./e.js").STATE;
    var STATE_UNSENT = 0;
    var STATE_LOADING = 3;
    var STATE_DONE = 4;
    var callbackData = {};
    function getCallback() {
      var name = basis.fn.publicCallback(function(data) {
        callbackData[name] = data;
      });
      return name;
    }
    function fetchCallbackData(name) {
      var data = callbackData[name];
      delete callbackData[name];
      return data;
    }
    function releaseCallback(name) {
      delete callbackData[name];
      delete global[name];
    }
    function readyStateChangeHandler(readyState, abort) {
      var newState;
      var newStateData;
      var error = false;
      if (typeof readyState != "number") {
        if (!readyState || this.script !== readyState.target) return;
        error = readyState && readyState.type == "error";
        readyState = error || !this.script.readyState || /loaded|complete/.test(this.script.readyState) ? STATE_DONE : STATE_LOADING;
      }
      if (readyState == this.prevReadyState_) return;
      this.prevReadyState_ = readyState;
      this.emit_readyStateChanged(readyState);
      if (readyState == STATE_DONE) {
        this.clearTimeout();
        this.script.onload = this.script.onerror = this.script.onreadystatechange = null;
        if (this.script.parentNode) this.script.parentNode.removeChild(this.script);
        this.script = null;
        if (abort) {
          this.emit_abort();
          newState = this.stateOnAbort;
        } else {
          this.processResponse();
          if (this.isSuccessful() && !error) {
            newState = STATE.READY;
            this.emit_success(this.getResponseData());
          } else {
            newState = STATE.ERROR;
            newStateData = this.getResponseError();
            this.emit_failure(newStateData);
          }
        }
        this.emit_complete(this);
        var callback = this.callback;
        if (abort) {
          setTimeout(global[callback] = function() {
            releaseCallback(callback);
          }, 5 * 60 * 1e3);
        } else {
          releaseCallback(callback);
        }
      } else newState = STATE.PROCESSING;
      this.setState(newState, newStateData);
    }
    var Request = AbstractRequest.subclass({
      className: namespace + ".Request",
      timeout: 3e4,
      timer_: null,
      emit_readyStateChanged: createRequestEvent("readyStateChanged"),
      isIdle: function() {
        return !this.script;
      },
      isSuccessful: function() {
        return this.data.status == 200;
      },
      processResponse: function() {
        if (this.callback in callbackData) this.update({
          contentType: "application/javascript",
          data: fetchCallbackData(this.callback),
          status: 200
        });
      },
      getResponseData: function() {
        return this.data.data;
      },
      getResponseError: function() {
        return {
          code: "ERROR",
          msg: "ERROR"
        };
      },
      prepare: basis.fn.$true,
      prepareRequestData: function(requestData) {
        var params = [];
        var url = requestData.url;
        requestData = objectSlice(requestData);
        this.callback = getCallback();
        for (var key in requestData.params) {
          var value = requestData.params[key];
          if (value == null || value.toString() == null) continue;
          params.push(escapeValue(key) + "=" + escapeValue(value.toString()));
        }
        params.push(escapeValue(requestData.callbackParam) + "=" + escapeValue(this.callback));
        params = params.join("&");
        if (requestData.routerParams) url = url.replace(/:([a-z\_\-][a-z0-9\_\-]+)/gi, function(m, key) {
          if (key in requestData.routerParams) return requestData.routerParams[key]; else return m;
        });
        if (params) url += (url.indexOf("?") == -1 ? "?" : "&") + params;
        requestData.requestUrl = url;
        return requestData;
      },
      doRequest: function() {
        this.send(this.prepareRequestData(this.requestData));
      },
      send: function(requestData) {
        if (!document) throw "JSONP is not supported for current environment";
        var head = document.head || document.getElementByName("head")[0] || document.documentElement;
        var script = document.createElement("script");
        this.update({
          data: undefined,
          status: "",
          error: ""
        });
        this.script = script;
        script.async = true;
        script.src = requestData.requestUrl;
        script.charset = requestData.encoding;
        script.onload = script.onerror = script.onreadystatechange = readyStateChangeHandler.bind(this);
        this.prevReadyState_ = -1;
        this.emit_start();
        readyStateChangeHandler.call(this, STATE_UNSENT);
        this.setTimeout(this.timeout);
        head.appendChild(this.script);
      },
      repeat: function() {
        if (this.requestData) {
          this.abort();
          this.doRequest();
        }
      },
      abort: function() {
        if (!this.isIdle()) {
          this.clearTimeout();
          readyStateChangeHandler.call(this, STATE_DONE, true);
        }
      },
      setTimeout: function(timeout) {
        this.timer_ = setTimeout(this.timeoutAbort.bind(this), timeout);
      },
      clearTimeout: function() {
        if (this.timer_) this.timer_ = clearTimeout(this.timer_);
      },
      timeoutAbort: function() {
        this.update({
          error: {
            code: "TIMEOUT_ERROR",
            message: "Timeout error"
          }
        });
        this.emit_timeout(this);
        this.abort();
      },
      destroy: function() {
        this.abort();
        AbstractRequest.prototype.destroy.call(this);
      }
    });
    var Transport = AbstractTransport.subclass({
      className: namespace + ".Transport",
      requestClass: Request,
      emit_readyStateChanged: createTransportEvent("readyStateChanged"),
      encoding: null,
      params: null,
      callbackParam: "callback",
      init: function() {
        AbstractTransport.prototype.init.call(this);
        this.params = objectSlice(this.params);
      },
      setParam: function(name, value) {
        this.params[name] = value;
      },
      setParams: function(params) {
        this.clearParams();
        for (var key in params) this.setParam(key, params[key]);
      },
      removeParam: function(name) {
        delete this.params[name];
      },
      clearParams: function() {
        for (var key in this.params) delete this.params[key];
      },
      prepareRequestData: function(requestData) {
        var url = requestData.url || this.url;
        if (!url) throw new Error("URL is not defined");
        extend(requestData, {
          url: url,
          encoding: requestData.encoding || this.encoding,
          params: objectMerge(this.params, requestData.params),
          routerParams: requestData.routerParams,
          callbackParam: requestData.callbackParam || this.callbackParam
        });
        return requestData;
      }
    });
    module.exports = {
      Request: Request,
      Transport: Transport,
      request: function(config, successCallback, failureCallback) {
        if (typeof config == "string") config = {
          url: config
        };
        var transport = new Transport(config);
        transport.addHandler({
          success: successCallback && function(sender, req, data) {
            successCallback(data);
          },
          failure: failureCallback && function(sender, req, error) {
            failureCallback(error);
          },
          complete: function() {
            basis.nextTick(function() {
              transport.destroy();
            });
          }
        });
        transport.request();
      }
    };
  },
  "o.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var arrayFrom = basis.array.from;
    var objectSlice = basis.object.slice;
    var basisEvent = basis.require("./2.js");
    var createEvent = basisEvent.create;
    var Emitter = basisEvent.Emitter;
    var DataObject = basis.require("./e.js").Object;
    var STATE = basis.require("./e.js").STATE;
    function createTransportEvent(eventName) {
      var event = createEvent(eventName);
      return function transportEvent() {
        event.apply(transportDispatcher, arguments);
        if (this.service) event.apply(this.service, arguments);
        event.apply(this, arguments);
      };
    }
    function createRequestEvent(eventName) {
      var event = createEvent(eventName);
      return function requestEvent() {
        var args = [ this ].concat(arrayFrom(arguments));
        if (this.transport) this.transport["emit_" + eventName].apply(this.transport, args); else event.apply(transportDispatcher, args);
        event.apply(this, arguments);
      };
    }
    var inprogressTransports = [];
    var transportDispatcher = new Emitter({
      abort: function() {
        var result = arrayFrom(inprogressTransports);
        for (var i = 0; i < result.length; i++) result[i].abort();
        return result;
      },
      handler: {
        start: function(request) {
          basis.array.add(inprogressTransports, request.transport);
        },
        complete: function(request) {
          basis.array.remove(inprogressTransports, request.transport);
        }
      }
    });
    var AbstractRequest = DataObject.subclass({
      className: namespace + ".AbstractRequest",
      requestData: null,
      transport: null,
      stateOnAbort: STATE.UNDEFINED,
      emit_start: createRequestEvent("start"),
      emit_timeout: createRequestEvent("timeout"),
      emit_abort: createRequestEvent("abort"),
      emit_success: createRequestEvent("success"),
      emit_failure: createRequestEvent("failure"),
      emit_complete: createRequestEvent("complete"),
      abort: basis.fn.$undef,
      doRequest: basis.fn.$undef,
      destroy: function() {
        DataObject.prototype.destroy.call(this);
        this.requestData = null;
      }
    });
    var TRANSPORT_REQUEST_HANDLER = {
      start: function(sender, request) {
        basis.array.add(this.inprogressRequests, request);
      },
      complete: function(sender, request) {
        basis.array.remove(this.inprogressRequests, request);
      }
    };
    var TRANSPORT_POOL_LIMIT_HANDLER = {
      complete: function() {
        var nextRequest = this.requestQueue.shift();
        if (nextRequest) {
          basis.nextTick(function() {
            nextRequest.doRequest();
          });
        }
      }
    };
    var AbstractTransport = Emitter.subclass({
      className: namespace + ".AbstractTransport",
      requestClass: AbstractRequest,
      stopped: false,
      poolLimit: null,
      poolHashGetter: null,
      requests: null,
      requestQueue: null,
      inprogressRequests: null,
      stoppedRequests: null,
      emit_start: createTransportEvent("start"),
      emit_timeout: createTransportEvent("timeout"),
      emit_abort: createTransportEvent("abort"),
      emit_success: createTransportEvent("success"),
      emit_failure: createTransportEvent("failure"),
      emit_complete: createTransportEvent("complete"),
      init: function() {
        this.requests = {};
        this.requestQueue = [];
        this.inprogressRequests = [];
        Emitter.prototype.init.call(this);
        this.addHandler(TRANSPORT_REQUEST_HANDLER, this);
        if (this.poolLimit) this.addHandler(TRANSPORT_POOL_LIMIT_HANDLER, this);
      },
      getRequestByHash: function(requestData) {
        function findIdleRequest(transport) {
          for (var id in transport.requests) {
            var request = transport.requests[id];
            if (request.isIdle() && transport.requestQueue.indexOf(request) == -1) {
              delete transport.requests[id];
              return request;
            }
          }
        }
        var requestHashId = this.poolHashGetter ? this.poolHashGetter(requestData) : requestData.origin ? requestData.origin.basisObjectId : "default";
        var request = this.requests[requestHashId];
        if (!request) {
          request = findIdleRequest(this) || new this.requestClass({
            transport: this
          });
          this.requests[requestHashId] = request;
        }
        return request;
      },
      prepare: basis.fn.$true,
      prepareRequestData: basis.fn.$self,
      request: function(config) {
        if (!this.prepare()) return;
        var requestData = this.prepareRequestData(objectSlice(config));
        var request = this.getRequestByHash(requestData);
        if (request.requestData) request.abort();
        request.requestData = requestData;
        if (!this.poolLimit || this.inprogressRequests.length < this.poolLimit) {
          request.doRequest();
        } else {
          this.requestQueue.push(request);
          request.setState(STATE.PROCESSING);
        }
        return request;
      },
      abort: function() {
        for (var request; request = this.requestQueue.pop(); ) request.setState(STATE.ERROR);
        for (var request; request = this.inprogressRequests.pop(); ) request.abort();
      },
      stop: function() {
        if (!this.stopped) {
          this.stoppedRequests = this.inprogressRequests.concat(this.requestQueue);
          this.abort();
          this.stopped = true;
        }
      },
      resume: function() {
        if (this.stopped) {
          for (var request; request = this.stoppedRequests.pop(); ) this.request(request.requestData);
          this.stopped = false;
        }
      },
      destroy: function() {
        for (var id in this.requests) this.requests[id].destroy();
        this.requests = null;
        this.inprogressRequests = null;
        this.requestQueue = null;
        this.stoppedRequests = null;
        Emitter.prototype.destroy.call(this);
      }
    });
    module.exports = {
      createTransportEvent: createTransportEvent,
      createRequestEvent: createRequestEvent,
      transportDispatcher: transportDispatcher,
      AbstractRequest: AbstractRequest,
      AbstractTransport: AbstractTransport
    };
  },
  "p.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var basisEvent = basis.require("./2.js");
    var createEvent = basisEvent.create;
    var Emitter = basisEvent.Emitter;
    var AjaxTransport = basis.require("./q.js").Transport;
    var createAction = basis.require("./s.js").create;
    function removeTransportFromService(service, transport) {
      service.inprogressRequests = service.inprogressRequests.filter(function(request) {
        return request.transport !== transport;
      });
      basis.array.remove(service.inprogressTransports, transport);
      if (service.inprogressTransports.indexOf(transport) == -1 && (!service.stoppedTransports || service.stoppedTransports.indexOf(transport) == -1)) transport.removeHandler(TRANSPORT_HANDLER, service);
    }
    var TRANSPORT_HANDLER = {
      destroy: function(transport) {
        if (this.stoppedTransports) basis.array.remove(this.stoppedTransports, transport);
        removeTransportFromService(this, transport);
      }
    };
    var SERVICE_HANDLER = {
      start: function(service, request) {
        this.inprogressRequests.push(request);
        if (basis.array.add(this.inprogressTransports, request.transport)) request.transport.addHandler(TRANSPORT_HANDLER, this);
      },
      complete: function(service, request) {
        basis.array.remove(this.inprogressRequests, request);
        var hasOtherTransportRequests = this.inprogressRequests.some(function(request) {
          return request.transport === this.transport;
        }, request);
        if (!hasOtherTransportRequests) removeTransportFromService(this, request.transport);
      }
    };
    var Service = Emitter.subclass({
      className: namespace + ".Service",
      inprogressRequests: null,
      inprogressTransports: null,
      stoppedTransports: null,
      transportClass: AjaxTransport,
      emit_sessionOpen: createEvent("sessionOpen"),
      emit_sessionClose: createEvent("sessionClose"),
      emit_sessionFreeze: createEvent("sessionFreeze"),
      emit_sessionUnfreeze: createEvent("sessionUnfreeze"),
      secure: false,
      prepare: basis.fn.$true,
      signature: basis.fn.$undef,
      isSessionExpiredError: basis.fn.$false,
      init: function() {
        if (this.requestClass) basis.dev.warn(namespace + ".Service#requestClass is not supported; set requestClass via transportClass");
        Emitter.prototype.init.call(this);
        if ("isSecure" in this) {
          basis.dev.warn(namespace + ".Service#isSecure is deprecated and will be remove in next version. Please, use Service.secure property instead");
          this.secure = this.isSecure;
        }
        this.inprogressRequests = [];
        this.inprogressTransports = [];
        var TransportClass = this.transportClass;
        this.transportClass = TransportClass.subclass({
          service: this,
          secure: this.secure,
          emit_failure: function(request, error) {
            TransportClass.prototype.emit_failure.call(this, request, error);
            if (this.secure && this.service.isSessionExpiredError(request)) {
              this.service.freeze();
              if (this.service.stoppedTransports) if (basis.array.add(this.service.stoppedTransports, this)) this.addHandler(TRANSPORT_HANDLER, this.service);
              this.stop();
            }
          },
          init: function() {
            TransportClass.prototype.init.call(this);
            if ("needSignature" in this) {
              basis.dev.warn("`needSignature` property is deprecated and will be remove in next version. Please, use `secure` property instead");
              this.secure = this.needSignature;
            }
          },
          request: function(requestData) {
            if (!this.service.prepare(this, requestData)) return;
            if (this.secure && !this.service.sign(this)) return;
            return TransportClass.prototype.request.call(this, requestData);
          }
        });
        this.addHandler(SERVICE_HANDLER);
      },
      sign: function(transport) {
        if (this.sessionKey) {
          this.signature(transport, this.sessionData);
          return true;
        } else {
          basis.dev.warn("Request ignored. Service have no session key");
        }
      },
      openSession: function(sessionKey, sessionData) {
        this.sessionKey = sessionKey;
        this.sessionData = sessionData || sessionKey;
        this.unfreeze();
        this.emit_sessionOpen();
      },
      closeSession: function() {
        this.freeze();
        this.emit_sessionClose();
      },
      freeze: function() {
        if (!this.sessionKey) return;
        this.sessionKey = null;
        this.sessionData = null;
        this.stoppedTransports = this.inprogressTransports.filter(function(transport) {
          return transport.secure;
        });
        for (var i = 0, transport; transport = this.inprogressTransports[i]; i++) transport.stop();
        this.emit_sessionFreeze();
      },
      unfreeze: function() {
        if (this.stoppedTransports) {
          for (var i = 0, transport; transport = this.stoppedTransports[i]; i++) transport.resume();
          this.stoppedTransports = null;
        }
        this.emit_sessionUnfreeze();
      },
      createTransport: function(config) {
        return new this.transportClass(config);
      },
      createAction: function(config) {
        return createAction(basis.object.complete({
          service: this
        }, config));
      },
      destroy: function() {
        this.inprogressRequests = null;
        this.inprogressTransports = null;
        this.stoppedTransports = null;
        this.sessionKey = null;
        this.sessionData = null;
        Emitter.prototype.destroy.call(this);
      }
    });
    module.exports = {
      Service: Service
    };
  },
  "q.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var escapeValue = global.encodeURIComponent;
    var FormData = global.FormData;
    var XMLHttpRequest = global.XMLHttpRequest;
    var extend = basis.object.extend;
    var objectSlice = basis.object.slice;
    var objectMerge = basis.object.merge;
    var objectIterate = basis.object.iterate;
    var ua = basis.require("./r.js");
    var basisNet = basis.require("./o.js");
    var createTransportEvent = basisNet.createTransportEvent;
    var createRequestEvent = basisNet.createRequestEvent;
    var AbstractRequest = basisNet.AbstractRequest;
    var AbstractTransport = basisNet.AbstractTransport;
    var STATE_UNSENT = 0;
    var STATE_OPENED = 1;
    var STATE_DONE = 4;
    var STATE = basis.require("./e.js").STATE;
    var METHODS = "HEAD GET POST PUT PATCH DELETE TRACE LINK UNLINK CONNECT".split(" ");
    var IS_METHOD_WITH_BODY = /^(POST|PUT|PATCH|LINK|UNLINK)$/i;
    var URL_METHOD_PREFIX = new RegExp("^(" + METHODS.join("|") + ")\\s+", "i");
    var JSON_CONTENT_TYPE = /^application\/json/i;
    var XHRSupport = "native";
    var createXmlHttpRequest = function() {
      if ("XMLHttpRequest" in global) return function() {
        return new XMLHttpRequest;
      };
      var ActiveXObject = global.ActiveXObject;
      if (ActiveXObject) {
        var progID = [ "MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];
        for (var i = 0; XHRSupport = progID[i]; i++) try {
          if (new ActiveXObject(XHRSupport)) return function() {
            return new ActiveXObject(XHRSupport);
          };
        } catch (e) {}
      }
      throw new Error(XHRSupport = "XMLHttpRequest is not supported!");
    }();
    function setRequestHeaders(xhr, requestData) {
      var headers = {};
      if (IS_METHOD_WITH_BODY.test(requestData.method)) {
        if (!FormData || requestData.body instanceof FormData == false) headers["Content-Type"] = requestData.contentType + (requestData.encoding ? ";charset=" + requestData.encoding : "");
      } else {
        if (ua.test("ie")) {
          headers["If-Modified-Since"] = "Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
      headers = basis.object.merge(headers, requestData.headers);
      objectIterate(requestData.headers, function(name, value) {
        if (name.trim().toLowerCase() == "content-type") {
          basis.dev.warn("basis.net.ajax: `Content-Type` header found in request data, use contentType and encoding properties instead");
          headers["Content-Type"] = value;
        } else headers[name] = value;
      });
      objectIterate(headers, function(key, value) {
        if (value != null && typeof value != "function") xhr.setRequestHeader(key, value); else delete headers[key];
      });
      return headers;
    }
    function setResponseType(xhr, requestData) {
      if (requestData.responseType && requestData.asynchronous && "responseType" in xhr) try {
        xhr.responseType = requestData.responseType;
      } catch (e) {
        basis.dev.warn("Can't set resposeType `" + requestData.responseType + "` to XMLHttpRequest", requestData);
      }
    }
    function safeJsonParse(content) {
      try {
        return basis.json.parse(content);
      } catch (e) {
        var url = arguments[1];
        basis.dev.warn("basis.net.ajax: Can't parse JSON from " + url, {
          url: url,
          content: content
        });
      }
    }
    function readyStateChangeHandler(readyState) {
      var xhr = this.xhr;
      var newState;
      var newStateData;
      var aborted;
      this.sendDelayTimer_ = clearTimeout(this.sendDelayTimer_);
      if (!xhr) return;
      if (typeof readyState != "number") readyState = xhr.readyState;
      if (readyState == this.prevReadyState_) return;
      this.prevReadyState_ = readyState;
      if (this.debug) basis.dev.log("State: (" + readyState + ") " + [ "UNSENT", "OPENED", "HEADERS_RECEIVED", "LOADING", "DONE" ][readyState]);
      this.emit_readyStateChanged(readyState);
      if (readyState == STATE_DONE) {
        this.clearTimeout();
        xhr.onreadystatechange = basis.fn.$undef;
        aborted = xhr.status == 0;
        if (!aborted && !xhr.responseType) aborted = typeof xhr.responseText == "unknown" || !xhr.responseText && !xhr.getAllResponseHeaders();
        if (aborted) {
          this.emit_abort();
          newState = this.stateOnAbort;
        } else {
          this.processResponse();
          if (this.isSuccessful()) {
            newState = STATE.READY;
            this.emit_success(this.getResponseData());
          } else {
            newState = STATE.ERROR;
            newStateData = this.getResponseError();
            if (!newStateData && this.data.error) {
              basis.dev.warn("Request#getResponseError should not update request data, but returns error data. Please, fix your method implementation, as data updating is deprecated behaviour.");
              newStateData = this.data.error;
            }
            this.emit_failure(newStateData);
          }
        }
        this.emit_complete(this);
      } else newState = STATE.PROCESSING;
      this.setState(newState, newStateData);
    }
    var Request = AbstractRequest.subclass({
      className: namespace + ".Request",
      requestStartTime: 0,
      timeout: 3e4,
      timer_: null,
      sendDelay: null,
      sendDelayTimer_: null,
      lastRequestUrl_: null,
      debug: false,
      emit_readyStateChanged: createRequestEvent("readyStateChanged"),
      init: function() {
        AbstractRequest.prototype.init.call(this);
        this.xhr = createXmlHttpRequest();
      },
      isIdle: function() {
        return this.xhr.readyState == STATE_DONE || this.xhr.readyState == STATE_UNSENT;
      },
      isSuccessful: function() {
        var status = this.xhr.status;
        return status >= 200 && status < 300 || status == 304;
      },
      processResponse: function() {
        this.update({
          contentType: this.xhr.getResponseHeader("content-type"),
          status: this.xhr.status
        });
      },
      getResponseData: function() {
        var xhr = this.xhr;
        if (!xhr.responseType) if (this.responseType == "json" || JSON_CONTENT_TYPE.test(this.data.contentType)) return safeJsonParse(xhr.responseText, this.lastRequestUrl_);
        if ("response" in xhr) return xhr.response;
        return xhr.responseText;
      },
      processErrorResponse: function() {
        basis.dev.warn(namespace + ".Request#processErrorResponse is deprecated now, use Request#getResponseError instead");
        return this.getResponseError();
      },
      getResponseError: function() {
        var xhr = this.xhr;
        var msg = !this.responseType ? xhr.responseText : xhr.response || xhr.statusText || "Error";
        return {
          code: "SERVER_ERROR",
          msg: msg,
          response: this.getResponseData()
        };
      },
      prepare: basis.fn.$true,
      prepareRequestData: function(requestData) {
        var params = [];
        var url = requestData.url;
        requestData = objectSlice(requestData);
        for (var key in requestData.params) {
          var value = requestData.params[key];
          if (value == null || value.toString() == null) continue;
          params.push(escapeValue(key) + "=" + escapeValue(value.toString()));
        }
        params = params.join("&");
        if (!requestData.body && IS_METHOD_WITH_BODY.test(requestData.method)) {
          requestData.body = params || "";
          params = "";
        }
        if (requestData.routerParams) url = url.replace(/:([a-z\_\-][a-z0-9\_\-]+)/gi, function(m, key) {
          if (key in requestData.routerParams) return requestData.routerParams[key]; else return m;
        });
        if (params) url += (url.indexOf("?") == -1 ? "?" : "&") + params;
        requestData.requestUrl = url;
        return requestData;
      },
      doRequest: function() {
        this.send(this.prepareRequestData(this.requestData));
      },
      send: function(requestData) {
        this.update({
          contentType: "",
          status: ""
        });
        if (ua.test("gecko1.8.1-") && requestData.asynchronous) this.xhr = createXmlHttpRequest();
        this.emit_start();
        var xhr = this.xhr;
        this.prevReadyState_ = -1;
        xhr.onreadystatechange = readyStateChangeHandler.bind(this);
        if (!requestData.asynchronous) readyStateChangeHandler.call(this, STATE_UNSENT);
        xhr.open(requestData.method, requestData.requestUrl, requestData.asynchronous);
        this.lastRequestUrl_ = requestData.requestUrl;
        setResponseType(xhr, requestData);
        this.responseType = requestData.responseType || "";
        var requestHeaders = setRequestHeaders(xhr, requestData);
        this.setTimeout(this.timeout);
        var payload = null;
        if (IS_METHOD_WITH_BODY.test(requestData.method)) {
          payload = requestData.body;
          if (typeof payload == "function") payload = payload.call(requestData.bodyContext);
          if (JSON_CONTENT_TYPE.test(requestHeaders["Content-Type"])) if (typeof payload != "string") payload = JSON.stringify(payload);
          if (ua.test("ie9-")) {
            if (typeof payload == "object" && typeof payload.documentElement != "undefined" && typeof payload.xml == "string") payload = payload.xml; else if (typeof payload == "string") payload = payload.replace(/\r/g, ""); else if (payload == null || payload == "") payload = "[No data]";
          }
        }
        if (this.sendDelay) {
          if (this.sendDelayTimer_) this.sendDelayTimer_ = clearTimeout(this.sendDelayTimer_);
          this.sendDelayTimer_ = setTimeout(function() {
            this.sendDelayTimer_ = null;
            if (this.xhr === xhr && xhr.readyState == STATE_OPENED) xhr.send(payload);
          }.bind(this), this.sendDelay);
        } else xhr.send(payload);
        if (this.debug) basis.dev.log("Request over, waiting for response");
        return true;
      },
      repeat: function() {
        if (this.requestData) {
          this.abort();
          this.doRequest();
        }
      },
      abort: function() {
        if (!this.isIdle()) {
          this.clearTimeout();
          this.xhr.abort();
          if (this.xhr.readyState != STATE_DONE && this.xhr.readyState != STATE_UNSENT) readyStateChangeHandler.call(this, STATE_DONE);
        }
      },
      setTimeout: function(timeout) {
        if (!this.xhr.asynchronous) return;
        if ("ontimeout" in this.xhr) {
          this.xhr.timeout = timeout;
          this.xhr.ontimeout = this.timeoutAbort.bind(this);
        } else this.timer_ = setTimeout(this.timeoutAbort.bind(this), timeout);
      },
      clearTimeout: function() {
        if (this.timer_) this.timer_ = clearTimeout(this.timer_);
      },
      timeoutAbort: function() {
        this.update({
          error: {
            code: "TIMEOUT_ERROR",
            message: "Timeout error"
          }
        });
        this.emit_timeout(this);
        this.abort();
      },
      destroy: function() {
        this.abort();
        this.xhr = null;
        AbstractRequest.prototype.destroy.call(this);
      }
    });
    var Transport = AbstractTransport.subclass({
      className: namespace + ".Transport",
      requestClass: Request,
      emit_readyStateChanged: createTransportEvent("readyStateChanged"),
      asynchronous: true,
      method: "GET",
      contentType: "application/x-www-form-urlencoded",
      encoding: null,
      requestHeaders: basis.Class.extensibleProperty(),
      responseType: "",
      params: null,
      routerParams: null,
      url: "",
      body: null,
      bodyContext: null,
      init: function() {
        AbstractTransport.prototype.init.call(this);
        if ("postBody" in this) {
          basis.dev.warn("basis.net.ajax.Transport: `postBody` paramenter is deprecated, use `body` instead");
          if (this.body == null) this.body = this.postBody;
          this.postBody = null;
        }
        this.params = objectSlice(this.params);
        this.routerParams = objectSlice(this.routerParams);
      },
      setParam: function(name, value) {
        this.params[name] = value;
      },
      setParams: function(params) {
        this.clearParams();
        for (var key in params) this.setParam(key, params[key]);
      },
      removeParam: function(name) {
        delete this.params[name];
      },
      clearParams: function() {
        for (var key in this.params) delete this.params[key];
      },
      prepareRequestData: function(requestData) {
        if (!requestData.url && !this.url) throw new Error("URL is not defined");
        extend(requestData, {
          headers: objectMerge(this.requestHeaders, requestData.headers),
          params: objectMerge(this.params, requestData.params),
          routerParams: objectMerge(this.routerParams, requestData.routerParams)
        });
        if ("postBody" in requestData) {
          basis.dev.warn("basis.net.ajax.Transport: `postBody` paramenter is deprecated, use `body` instead");
          if (this.body == null) requestData.body = requestData.postBody;
          requestData.postBody = null;
        }
        basis.object.complete(requestData, {
          asynchronous: this.asynchronous,
          url: this.url,
          method: this.method,
          contentType: this.contentType,
          encoding: this.encoding,
          body: this.body,
          bodyContext: this.bodyContext,
          responseType: this.responseType
        });
        var urlMethodPrefix = requestData.url.match(URL_METHOD_PREFIX);
        if (urlMethodPrefix) {
          requestData.method = urlMethodPrefix[1];
          requestData.url = requestData.url.substr(urlMethodPrefix[0].length);
        }
        return requestData;
      }
    });
    module.exports = {
      Request: Request,
      Transport: Transport,
      request: function(config, successCallback, failureCallback) {
        if (typeof config == "string") config = {
          url: config,
          asynchronous: !!(successCallback || failureCallback)
        };
        var transport = new Transport(config);
        transport.addHandler({
          success: successCallback && function(sender, req, data) {
            successCallback(data);
          },
          failure: failureCallback && function(sender, req, error) {
            failureCallback(error);
          },
          complete: function() {
            basis.nextTick(function() {
              transport.destroy();
            });
          }
        });
        var req = transport.request();
        if (!req.requestData.asynchronous) return req.getResponseData();
      }
    };
  },
  "r.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var userAgent = global.navigator && global.navigator.userAgent || "";
    var opera = global.opera;
    var versions = {};
    var answers = {};
    var browserName = "unknown";
    var browserPrettyName = "unknown";
    var browserNames = {
      MSIE: [ "Internet Explorer", "msie", "ie" ],
      Gecko: [ "Gecko", "gecko" ],
      Safari: [ "Safari", "safari" ],
      "iPhone OS": [ "iPhone", "iphone" ],
      AdobeAir: [ "AdobeAir", "air" ],
      AppleWebKit: [ "WebKit" ],
      Chrome: [ "Chrome", "chrome" ],
      FireFox: [ "FireFox", "firefox", "ff" ],
      Iceweasel: [ "FireFox", "firefox", "ff" ],
      Shiretoko: [ "FireFox", "firefox", "ff" ],
      Opera: [ "Opera", "opera" ]
    };
    for (var name in browserNames) {
      var prefix = name;
      if (name == "MSIE" && opera) continue;
      if (name == "Safari" && /chrome/i.test(userAgent)) continue;
      if (name == "AppleWebKit" && /iphone/i.test(userAgent)) continue;
      if (name == "MSIE" && /Trident\/\d+/i.test(userAgent) && /rv:\d+/i.test(userAgent)) prefix = "rv";
      if (userAgent.match(new RegExp(prefix + ".(\\d+(\\.\\d+)*)", "i"))) {
        var names = browserNames[name];
        var version = opera && typeof opera.version == "function" ? opera.version() : RegExp.$1;
        var verNumber = versionToInt(version);
        browserName = names[0] + verNumber;
        browserPrettyName = names[0] + " " + version;
        for (var j = 0; j < names.length; j++) versions[names[j].toLowerCase()] = verNumber;
      }
    }
    function versionToInt(version) {
      var base = 1e6;
      var part = String(version).split(".");
      for (var i = 0, result = 0; i < 4 && i < part.length; i++, base /= 100) result += part[i] * base;
      return result;
    }
    function testBrowser(browserName) {
      var forTest = browserName.toLowerCase();
      if (forTest in answers) return answers[forTest];
      var m = forTest.match(/^([a-z]+)(([\d\.]+)([+-=]?))?$/i);
      if (m) {
        answers[forTest] = false;
        var name = m[1].toLowerCase();
        var version = versionToInt(m[3]);
        var operation = m[4] || "=";
        var cmpVersion = versions[name];
        if (cmpVersion) return answers[forTest] = !version || operation == "=" && cmpVersion == version || operation == "+" && cmpVersion >= version || operation == "-" && cmpVersion < version;
      } else {
        basis.dev.warn("Bad browser version description in Browser.test() function: " + forTest);
      }
      return false;
    }
    module.exports = {
      prettyName: browserPrettyName,
      is: testBrowser,
      test: function() {
        return basis.array(arguments).some(testBrowser);
      }
    };
  },
  "s.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var STATE = basis.require("./e.js").STATE;
    var STATE_UNDEFINED = STATE.UNDEFINED;
    var STATE_READY = STATE.READY;
    var STATE_PROCESSING = STATE.PROCESSING;
    var STATE_ERROR = STATE.ERROR;
    var AjaxTransport = basis.require("./q.js").Transport;
    var Promise = basis.require("./t.js");
    var nothingToDo = function() {};
    var CALLBACK_HANDLER = {
      start: function(transport, request) {
        var origin = request.requestData.origin;
        this.start.call(request.requestData.origin);
        if (origin.state != STATE_PROCESSING) origin.setState(STATE_PROCESSING);
      },
      success: function(transport, request, data) {
        var origin = request.requestData.origin;
        this.success.call(origin, data);
        if (origin.state == STATE_PROCESSING) origin.setState(STATE_READY);
      },
      failure: function(transport, request, error) {
        var origin = request.requestData.origin;
        this.failure.call(origin, error);
        if (origin.state == STATE_PROCESSING) origin.setState(STATE_ERROR, error);
      },
      abort: function(transport, request) {
        var origin = request.requestData.origin;
        this.abort.call(origin);
        if (origin.state == STATE_PROCESSING) origin.setState(transport.stateOnAbort || request.stateOnAbort || STATE_UNDEFINED);
      },
      complete: function(transport, request) {
        this.complete.call(request.requestData.origin);
      }
    };
    var DEFAULT_CALLBACK = {
      start: nothingToDo,
      success: nothingToDo,
      failure: nothingToDo,
      abort: nothingToDo,
      complete: nothingToDo
    };
    var PROMISE_REQUEST_HANDLER = {
      success: function(request, data) {
        this.fulfill(data);
      },
      abort: function() {
        this.reject("Request aborted");
      },
      failure: function(request, error) {
        this.reject(error);
      },
      complete: function() {
        this.request.removeHandler(PROMISE_REQUEST_HANDLER, this);
      }
    };
    function resolveTransport(config) {
      if (config.transport) return config.transport;
      if (config.service) return config.service.createTransport(config);
      if (config.createTransport) return config.createTransport(config);
      return new AjaxTransport(config);
    }
    function createAction(config) {
      config = basis.object.extend({
        prepare: nothingToDo,
        request: nothingToDo
      }, config);
      if (typeof config.body == "function") {
        var bodyFn = config.body;
        config.body = function() {
          return bodyFn.apply(this.context, this.args);
        };
      }
      var fn = basis.object.splice(config, [ "prepare", "request" ]);
      var callback = basis.object.merge(DEFAULT_CALLBACK, basis.object.splice(config, [ "start", "success", "failure", "abort", "complete" ]));
      var getTransport = basis.fn.lazyInit(function() {
        var transport = resolveTransport(config);
        transport.addHandler(CALLBACK_HANDLER, callback);
        return transport;
      });
      return function action() {
        if (this.state != STATE_PROCESSING) {
          if (fn.prepare.apply(this, arguments)) {
            basis.dev.warn("Prepare handler returns trulthy result. Operation aborted. Context: ", this);
            return Promise.reject("Prepare handler returns trulthy result. Operation aborted. Context: ", this);
          }
          var request;
          var requestData = basis.object.complete({
            origin: this,
            bodyContext: {
              context: this,
              args: basis.array(arguments)
            }
          }, fn.request.apply(this, arguments));
          if (typeof requestData.body == "function") {
            var bodyFn = requestData.body;
            requestData.body = function() {
              return bodyFn.apply(this.context, this.args);
            };
          }
          if (request = getTransport().request(requestData)) return new Promise(function(fulfill, reject) {
            request.addHandler(PROMISE_REQUEST_HANDLER, {
              request: request,
              fulfill: fulfill,
              reject: reject
            });
          });
          return Promise.reject("Request is not performed");
        } else {
          basis.dev.warn("Context in processing state. Operation aborted. Context: ", this);
          return Promise.reject("Context in processing state, request is not performed");
        }
      };
    }
    module.exports = {
      create: createAction
    };
  },
  "t.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var PENDING = "pending";
    var SEALED = "sealed";
    var FULFILLED = "fulfilled";
    var REJECTED = "rejected";
    var NOOP = function() {};
    var asyncQueue = [];
    var asyncTimer;
    function asyncFlush() {
      for (var i = 0; i < asyncQueue.length; i++) asyncQueue[i][0](asyncQueue[i][1]);
      asyncQueue = [];
      asyncTimer = false;
    }
    function asyncCall(callback, arg) {
      asyncQueue.push([ callback, arg ]);
      if (!asyncTimer) {
        asyncTimer = true;
        basis.nextTick(asyncFlush, 0);
      }
    }
    function invokeResolver(resolver, promise) {
      function resolvePromise(value) {
        resolve(promise, value);
      }
      function rejectPromise(reason) {
        reject(promise, reason);
      }
      try {
        resolver(resolvePromise, rejectPromise);
      } catch (e) {
        rejectPromise(e);
      }
    }
    function invokeCallback(subscriber) {
      var owner = subscriber.owner;
      var settled = owner.state_;
      var value = owner.data_;
      var callback = subscriber[settled];
      var promise = subscriber.then;
      if (typeof callback === "function") {
        settled = FULFILLED;
        try {
          value = callback(value);
        } catch (e) {
          reject(promise, e);
        }
      }
      if (!handleThenable(promise, value)) {
        if (settled === FULFILLED) resolve(promise, value);
        if (settled === REJECTED) reject(promise, value);
      }
    }
    function handleThenable(promise, value) {
      var resolved;
      try {
        if (promise === value) throw new TypeError("A promises callback cannot return that same promise.");
        if (value && (typeof value === "function" || typeof value === "object")) {
          var then = value.then;
          if (typeof then === "function") {
            then.call(value, function(val) {
              if (!resolved) {
                resolved = true;
                if (value !== val) resolve(promise, val); else fulfill(promise, val);
              }
            }, function(reason) {
              if (!resolved) {
                resolved = true;
                reject(promise, reason);
              }
            });
            return true;
          }
        }
      } catch (e) {
        if (!resolved) reject(promise, e);
        return true;
      }
      return false;
    }
    function resolve(promise, value) {
      if (promise === value || !handleThenable(promise, value)) fulfill(promise, value);
    }
    function fulfill(promise, value) {
      if (promise.state_ === PENDING) {
        promise.state_ = SEALED;
        promise.data_ = value;
        asyncCall(publishFulfillment, promise);
      }
    }
    function reject(promise, reason) {
      if (promise.state_ === PENDING) {
        promise.state_ = SEALED;
        promise.data_ = reason;
        asyncCall(publishRejection, promise);
      }
    }
    function publish(promise) {
      promise.then_ = promise.then_.forEach(invokeCallback);
    }
    function publishFulfillment(promise) {
      promise.state_ = FULFILLED;
      publish(promise);
    }
    function publishRejection(promise) {
      promise.state_ = REJECTED;
      publish(promise);
    }
    var Promise = function(resolver) {
      if (typeof resolver !== "function") throw new TypeError("Promise constructor takes a function argument");
      if (this instanceof Promise === false) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
      this.then_ = [];
      invokeResolver(resolver, this);
    };
    Promise.prototype = {
      constructor: Promise,
      state_: PENDING,
      then_: null,
      data_: undefined,
      then: function(onFulfillment, onRejection) {
        var subscriber = {
          owner: this,
          then: new this.constructor(NOOP),
          fulfilled: onFulfillment,
          rejected: onRejection
        };
        if (this.state_ === FULFILLED || this.state_ === REJECTED) {
          asyncCall(invokeCallback, subscriber);
        } else {
          this.then_.push(subscriber);
        }
        return subscriber.then;
      },
      "catch": function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    Promise.all = function(promises) {
      var Class = this;
      if (!Array.isArray(promises)) throw new TypeError("You must pass an array to Promise.all().");
      return new Class(function(resolve, reject) {
        var results = [];
        var remaining = 0;
        function resolver(index) {
          remaining++;
          return function(value) {
            results[index] = value;
            if (!--remaining) resolve(results);
          };
        }
        for (var i = 0, promise; i < promises.length; i++) {
          promise = promises[i];
          if (promise && typeof promise.then === "function") promise.then(resolver(i), reject); else results[i] = promise;
        }
        if (!remaining) resolve(results);
      });
    };
    Promise.race = function(promises) {
      var Class = this;
      if (!Array.isArray(promises)) throw new TypeError("You must pass an array to Promise.race().");
      return new Class(function(resolve, reject) {
        for (var i = 0, promise; i < promises.length; i++) {
          promise = promises[i];
          if (promise && typeof promise.then === "function") promise.then(resolve, reject); else resolve(promise);
        }
      });
    };
    Promise.resolve = function(value) {
      var Class = this;
      if (value && typeof value === "object" && value.constructor === Class) return value;
      return new Class(function(resolve) {
        resolve(value);
      });
    };
    Promise.reject = function(reason) {
      var Class = this;
      return new Class(function(resolve, reject) {
        reject(reason);
      });
    };
    module.exports = Promise;
  },
  "u.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var namespace = this.path;
    var location = global.location;
    var document = global.document;
    var eventUtils = basis.require("./c.js");
    var docMode = document.documentMode;
    var eventSupport = "onhashchange" in global && (docMode === undefined || docMode > 7);
    var CHECK_INTERVAL = 50;
    var arrayFrom = basis.array.from;
    var routes = {};
    var matched = {};
    var started = false;
    var currentPath;
    var timer;
    var Route = basis.Token.subclass({
      className: namespace + ".Route",
      matched: null,
      params_: null,
      names_: null,
      init: function(names) {
        basis.Token.prototype.init.call(this, null);
        this.matched = this.as(Boolean);
        this.names_ = Array.isArray(names) ? names : [];
        this.params_ = {};
      },
      param: function(nameOrIdx) {
        var idx = typeof nameOrIdx == "number" ? nameOrIdx : this.names_.indexOf(nameOrIdx);
        if (idx in this.params_ == false) this.params_[idx] = this.as(function(value) {
          return value && value[idx];
        });
        return this.params_[idx];
      },
      set: function(value) {
        if (value) {
          value = basis.object.slice(value);
          for (var key in value) if (key in this.names_) value[this.names_[key]] = value[key];
        }
        basis.Token.prototype.set.call(this, value);
      }
    });
    function pathToRegExp(route) {
      var value = String(route || "");
      var params = [];
      function findWord(offset) {
        return value.substr(offset).match(/^\w+/);
      }
      function parse(offset, stopChar) {
        var result = "";
        var res;
        for (var i = offset; i < value.length; i++) {
          var c = value.charAt(i);
          switch (c) {
            case stopChar:
              return {
                result: result,
                offset: i
              };
            case "\\":
              result += "\\" + value.charAt(++i);
              break;
            case "|":
              result += stopChar != ")" ? "\\|" : "|";
              break;
            case "(":
              if (res = parse(i + 1, ")")) {
                i = res.offset;
                result += "(?:" + res.result + ")?";
              } else {
                result += "\\(";
              }
              break;
            case ":":
              if (res = findWord(i + 1)) {
                i += res[0].length;
                result += "([^/]+)";
                params.push(res[0]);
              } else {
                result += ":";
              }
              break;
            case "*":
              if (res = findWord(i + 1)) {
                i += res[0].length;
                result += "(.*?)";
                params.push(res[0]);
              } else {
                result += "\\*";
              }
              break;
            default:
              result += basis.string.forRegExp(c);
          }
        }
        return stopChar ? null : result;
      }
      var regexp = new RegExp("^" + parse(0) + "$", "i");
      regexp.params = params;
      return regexp;
    }
    function startWatch() {
      if (eventSupport) eventUtils.addHandler(global, "hashchange", checkUrl); else timer = setInterval(checkUrl, CHECK_INTERVAL);
    }
    function stopWatch() {
      if (eventSupport) eventUtils.removeHandler(global, "hashchange", checkUrl); else clearInterval(timer);
    }
    function start() {
      if (!started) {
        startWatch();
        started = true;
        if (module.exports.debug) basis.dev.log(namespace + " started");
        checkUrl();
      }
    }
    function stop() {
      if (started) {
        stopWatch();
        started = false;
        if (module.exports.debug) basis.dev.log(namespace + " stopped");
      }
    }
    function checkUrl() {
      var newPath = location.hash.substr(1) || "";
      if (newPath != currentPath) {
        var inserted = [];
        var deleted = [];
        var log = [];
        currentPath = newPath;
        for (var path in routes) {
          var route = routes[path];
          var match = newPath.match(route.regexp);
          if (match) {
            if (!matched[path]) inserted.push(route);
            match = arrayFrom(match, 1);
            matched[path] = match;
          } else {
            if (matched[path]) {
              deleted.push(route);
              delete matched[path];
              route.token.set(null);
            }
          }
        }
        for (var i = 0, route; route = deleted[i]; i++) {
          var callbacks = arrayFrom(route.callbacks);
          for (var j = 0, item; item = callbacks[j]; j++) if (item.callback.leave) {
            item.callback.leave.call(item.context);
            log.push("\n", {
              type: "leave",
              path: route.id,
              cb: item,
              route: route
            });
          }
        }
        for (var i = 0, route; route = inserted[i]; i++) {
          var callbacks = arrayFrom(route.callbacks);
          for (var j = 0, item; item = callbacks[j]; j++) if (item.callback.enter) {
            item.callback.enter.call(item.context);
            log.push("\n", {
              type: "enter",
              path: route.id,
              cb: item,
              route: route
            });
          }
        }
        for (var path in matched) {
          var route = routes[path];
          var args = matched[path];
          var callbacks = arrayFrom(route.callbacks);
          for (var i = 0, item; item = callbacks[i]; i++) if (item.callback.match) {
            item.callback.match.apply(item.context, args);
            log.push("\n", {
              type: "match",
              path: route.id,
              cb: item,
              route: route,
              args: args
            });
          }
          route.token.set(args);
        }
        if (module.exports.debug) basis.dev.info.apply(basis.dev, [ namespace + ': hash changed to "' + newPath + '"' ].concat(log.length ? log : "\n<no matches>"));
      }
    }
    function get(path, autocreate) {
      var route = path instanceof Route ? path : routes[path];
      if (!route && autocreate) {
        var regexp = Object.prototype.toString.call(path) == "[object RegExp]" ? path : pathToRegExp(path);
        route = routes[path] = {
          id: path,
          callbacks: [],
          token: new Route(regexp.params),
          regexp: regexp
        };
        if (typeof currentPath == "string") {
          var match = currentPath.match(route.regexp);
          if (match) {
            match = arrayFrom(match, 1);
            matched[path] = match;
            route.token.set(match);
          }
        }
      }
      return route;
    }
    function add(path, callback, context) {
      var route = get(path, true);
      var config;
      var log = [];
      config = {
        cb_: callback,
        context: context,
        callback: typeof callback != "function" ? callback || {} : {
          match: callback
        }
      };
      route.callbacks.push(config);
      if (route.id in matched) {
        if (config.callback.enter) {
          config.callback.enter.call(context);
          log.push("\n", {
            type: "enter",
            path: route.id,
            cb: config,
            route: route
          });
        }
        if (config.callback.match) {
          config.callback.match.apply(context, matched[path]);
          log.push("\n", {
            type: "match",
            path: route.id,
            cb: config,
            route: route,
            args: matched[path]
          });
        }
      }
      if (module.exports.debug) basis.dev.info.apply(basis.dev, [ namespace + ": add handler for route `" + path + "`" ].concat(log.length ? log : "\n<no matches>"));
      return route.token;
    }
    function remove(path, callback, context) {
      var route = get(path);
      if (route) {
        for (var i = 0, cb; cb = route.callbacks[i]; i++) if (cb.cb_ === callback && cb.context === context) {
          var token = route.token;
          route.callbacks.splice(i, 1);
          if (!route.callbacks.length) {
            if ((!token.handler || !token.handler.handler) && !token.matched.handler) {
              delete routes[route.id];
              delete matched[route.id];
            }
          }
          break;
        }
      }
    }
    function navigate(path, replace) {
      if (replace) location.replace(location.pathname + "#" + path); else location.hash = path;
      if (started) checkUrl();
    }
    start();
    module.exports = {
      debug: false,
      start: start,
      stop: stop,
      checkUrl: checkUrl,
      navigate: navigate,
      add: add,
      remove: remove,
      route: function(path) {
        return get(path, true).token;
      }
    };
  },
  "v.js": function(exports, module, basis, global, __filename, __dirname, require, resource, asset) {
    var resolveValue = basis.require("./e.js").resolveValue;
    var document = global.document || {
      title: "unknown"
    };
    var appTitle = document.title;
    var appInit = basis.fn.$undef;
    var appInjectPoint;
    var appEl;
    function updateTitle(value) {
      document.title = value;
    }
    function resolveNode(ref) {
      return typeof ref == "string" ? document.getElementById(ref) : ref;
    }
    function replaceNode(oldChild, newChild) {
      try {
        oldChild.parentNode.replaceChild(newChild, oldChild);
        return newChild;
      } catch (e) {
        return oldChild;
      }
    }
    function appendNode(container, newChild) {
      try {
        return container.appendChild(newChild);
      } catch (e) {
        return container.appendChild(document.createComment(""));
      }
    }
    var createApp = basis.fn.lazyInit(function(config) {
      var readyHandlers = [];
      var inited = false;
      var app = {
        inited: false,
        setTitle: function(title) {
          if (title != appTitle) {
            if (appTitle instanceof basis.Token) appTitle.detach(updateTitle);
            if (title instanceof basis.Token) {
              title.attach(updateTitle);
              updateTitle(title.get());
            } else updateTitle(title);
            appTitle = title;
          }
        },
        setElement: function(el) {
          el = resolveValue(app, app.setElement, el, "elementRA_");
          if (el && el.element) el = el.element;
          var newAppEl = resolveNode(el);
          if (appEl === newAppEl) return;
          if (appEl) {
            appEl = replaceNode(appEl, newAppEl);
            return;
          }
          if (!appInjectPoint) appInjectPoint = {
            type: "append",
            node: document.body
          };
          var node = resolveNode(appInjectPoint.node);
          appEl = newAppEl;
          if (!node) return;
          if (appInjectPoint.type == "append") appEl = appendNode(node, appEl); else appEl = replaceNode(node, appEl);
        },
        ready: function(fn, context) {
          if (inited) fn.call(context, app); else readyHandlers.push({
            fn: fn,
            context: context
          });
        }
      };
      if (config.constructor !== Object) config = {
        element: config
      };
      for (var key in config) {
        var value = config[key];
        switch (key) {
          case "title":
            app.setTitle(value);
            break;
          case "container":
            appInjectPoint = {
              type: "append",
              node: value
            };
            break;
          case "replace":
            appInjectPoint = {
              type: "replace",
              node: value
            };
            break;
          case "element":
            appEl = value;
            break;
          case "init":
            appInit = typeof value == "function" ? value : appInit;
            break;
          default:
            basis.dev.warn("Unknown config property `" + key + "` for app, value:", value);
        }
      }
      basis.doc.body.ready(function() {
        var insertEl = appEl;
        var initResult = appInit.call(app);
        if (initResult) insertEl = initResult;
        appEl = null;
        app.setElement(insertEl);
        inited = true;
        app.inited = true;
        var handler;
        while (handler = readyHandlers.shift()) handler.fn.call(handler.context, app);
      });
      return app;
    });
    module.exports = {
      create: createApp
    };
  }
};

(function createBasisInstance(context, __basisFilename, __config) {
  "use strict";
  var VERSION = "1.4.1";
  var global = Function("return this")();
  var NODE_ENV = global !== context ? global : false;
  var document = global.document;
  var location = global.location;
  var process = global.process;
  var toString = Object.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  global = context;
  var FACTORY = {};
  var PROXY = {};
  FACTORY = new (devVerboseName("basis.FACTORY", {}, function() {}));
  PROXY = new (devVerboseName("basis.PROXY", {}, function() {}));
  function genUID(len) {
    function base36(val) {
      return Math.round(val).toString(36);
    }
    var result = base36(10 + 25 * Math.random());
    if (!len) len = 16;
    while (result.length < len) result += base36(new Date * Math.random());
    return result.substr(0, len);
  }
  var warnPropertyAccess = function() {
    try {
      if (Object.defineProperty) {
        var obj = {};
        Object.defineProperty(obj, "foo", {
          get: function() {
            return true;
          }
        });
        if (obj.foo === true) {
          return function(object, name, value, warning) {
            Object.defineProperty(object, name, {
              get: function() {
                consoleMethods.warn(warning);
                return value;
              },
              set: function(newValue) {
                value = newValue;
              }
            });
          };
        }
      }
    } catch (e) {}
    return function() {};
  }();
  function extend(dest, source) {
    for (var key in source) dest[key] = source[key];
    return dest;
  }
  function complete(dest, source) {
    for (var key in source) if (key in dest == false) dest[key] = source[key];
    return dest;
  }
  function keys(object) {
    var result = [];
    for (var key in object) result.push(key);
    return result;
  }
  function values(object) {
    var result = [];
    for (var key in object) result.push(object[key]);
    return result;
  }
  function slice(source, keys) {
    var result = {};
    if (!keys) return extend(result, source);
    for (var i = 0, key; key = keys[i++]; ) if (key in source) result[key] = source[key];
    return result;
  }
  function splice(source, keys) {
    var result = {};
    if (!keys) return extend(result, source);
    for (var i = 0, key; key = keys[i++]; ) if (key in source) {
      result[key] = source[key];
      delete source[key];
    }
    return result;
  }
  function merge() {
    var result = {};
    for (var i = 0; i < arguments.length; i++) extend(result, arguments[i]);
    return result;
  }
  function iterate(object, callback, thisObject) {
    var result = [];
    for (var key in object) result.push(callback.call(thisObject, key, object[key]));
    return result;
  }
  function $undefined(value) {
    return value == undefined;
  }
  function $defined(value) {
    return value != undefined;
  }
  function $isNull(value) {
    return value == null || value == undefined;
  }
  function $isNotNull(value) {
    return value != null && value != undefined;
  }
  function $isSame(value) {
    return value === this;
  }
  function $isNotSame(value) {
    return value !== this;
  }
  function $self(value) {
    return value;
  }
  function $const(value) {
    return function() {
      return value;
    };
  }
  function $false() {
    return false;
  }
  function $true() {
    return true;
  }
  function $null() {
    return null;
  }
  function $undef() {}
  var getter = function() {
    var GETTER_ID_PREFIX = "basisGetterId" + genUID() + "_";
    var GETTER_ID = GETTER_ID_PREFIX + "root";
    var ID = GETTER_ID_PREFIX;
    var SOURCE = GETTER_ID_PREFIX + "base";
    var PARENT = GETTER_ID_PREFIX + "parent";
    var getterSeed = 1;
    var pathCache = {};
    function as(path) {
      var self = this;
      var wrapper;
      var result;
      var id;
      if (typeof path == "function" || typeof path == "string") {
        wrapper = resolveFunction(path, self[ID]);
        id = GETTER_ID_PREFIX + wrapper[ID];
        if (hasOwnProperty.call(self, id)) return self[id];
        if (typeof wrapper[SOURCE] == "function") wrapper = wrapper[SOURCE];
        result = function(value) {
          return wrapper(self(value));
        };
      } else {
        var map = path;
        if (!map) return nullGetter;
        result = function(value) {
          return map[self(value)];
        };
      }
      result[PARENT] = self;
      result[ID] = getterSeed++;
      result[SOURCE] = path;
      result.__extend__ = getter;
      result.as = as;
      if (id) self[id] = result;
      return result;
    }
    function buildFunction(path) {
      return new Function("object", "return object != null ? object." + path + " : object");
    }
    function resolveFunction(value, id) {
      var fn = value;
      var result;
      if (value && typeof value == "string") {
        if (hasOwnProperty.call(pathCache, value)) return pathCache[value];
        fn = pathCache[value] = buildFunction(value);
      }
      if (typeof fn != "function") {
        basis.dev.warn("path for root getter should be function or non-empty string");
        return nullGetter;
      }
      if (fn.__extend__ === getter) return fn;
      if (hasOwnProperty.call(fn, id)) return fn[id];
      result = fn[id] = fn !== value ? fn : function(value) {
        return fn(value);
      };
      result[ID] = getterSeed++;
      result[SOURCE] = value;
      result.__extend__ = getter;
      result.as = as;
      return result;
    }
    function getter(path, value) {
      var result = path && path !== nullGetter ? resolveFunction(path, GETTER_ID) : nullGetter;
      if (value || value === "") {
        basis.dev.warn("second argument for getter is deprecated, use `as` method of getter instead");
        if (typeof value == "string") value = stringFunctions.formatter(value);
        return result.as(value);
      }
      return result;
    }
    getter.ID = ID;
    getter.SOURCE = SOURCE;
    getter.PARENT = PARENT;
    return getter;
  }();
  var nullGetter = function() {
    var nullGetter = function() {};
    nullGetter[getter.ID] = getter.ID + "nullGetter";
    nullGetter.__extend__ = getter, nullGetter.as = function() {
      return nullGetter;
    };
    return nullGetter;
  }();
  function wrapper(key) {
    return function(value) {
      var result = {};
      result[key] = value;
      return result;
    };
  }
  function lazyInit(init, thisObject) {
    var inited = 0;
    var self;
    var data;
    return self = function() {
      if (!(inited++)) {
        self.inited = true;
        self.data = data = init.apply(thisObject || this, arguments);
        if (typeof data == "undefined") consoleMethods.warn("lazyInit function returns nothing:\n" + init);
      }
      return data;
    };
  }
  function lazyInitAndRun(init, run, thisObject) {
    var inited = 0;
    var self;
    var data;
    return self = function() {
      if (!(inited++)) {
        self.inited = true;
        self.data = data = init.call(thisObject || this);
        if (typeof data == "undefined") consoleMethods.warn("lazyInitAndRun function returns nothing:\n" + init);
      }
      run.apply(data, arguments);
      return data;
    };
  }
  function runOnce(run, thisObject) {
    var fired = 0;
    return function() {
      if (!(fired++)) return run.apply(thisObject || this, arguments);
    };
  }
  function factory(fn) {
    if (typeof fn != "function") fn = getter(fn);
    var result = function(value) {
      return fn(value);
    };
    result.factory = FACTORY;
    return result;
  }
  function isFactory(value) {
    return typeof value === "function" && value.factory === FACTORY;
  }
  function publicCallback(fn, permanent) {
    var name = "basisjsCallback" + genUID();
    global[name] = permanent ? fn : function() {
      try {
        delete global[name];
      } catch (e) {
        global[name] = undefined;
      }
      fn.apply(this, arguments);
    };
    return name;
  }
  function devVerboseName(name, args, fn) {
    return (new Function(keys(args), 'return {"' + name + '": ' + fn + '\n}["' + name + '"]')).apply(null, values(args));
  }
  var consoleMethods = function() {
    var console = global.console;
    var methods = {
      log: $undef,
      info: $undef,
      warn: $undef,
      error: $undef
    };
    if (console) iterate(methods, function(methodName) {
      methods[methodName] = "bind" in Function.prototype && typeof console[methodName] == "function" ? Function.prototype.bind.call(console[methodName], console) : function() {
        Function.prototype.apply.call(console[methodName], console, arguments);
      };
    });
    return methods;
  }();
  var setImmediate = global.setImmediate || global.msSetImmediate;
  var clearImmediate = global.clearImmediate || global.msSetImmediate;
  if (setImmediate) setImmediate = setImmediate.bind(global);
  if (clearImmediate) clearImmediate = clearImmediate.bind(global);
  if (!setImmediate) {
    (function() {
      var runTask = function() {
        var taskById = {};
        var taskId = 0;
        setImmediate = function(fn) {
          if (typeof fn != "function") {
            consoleMethods.warn("basis.setImmediate() and basis.nextTick() accept functions only (call ignored)");
            return;
          }
          taskById[++taskId] = {
            fn: fn,
            args: arrayFrom(arguments, 1)
          };
          addToQueue(taskId);
          return taskId;
        };
        clearImmediate = function(taskId) {
          delete taskById[taskId];
        };
        return function(taskId) {
          var task = taskById[taskId];
          if (task) {
            delete taskById[taskId];
            task.fn.apply(undefined, task.args);
          }
          asap.process();
        };
      }();
      var addToQueue = function(taskId) {
        setTimeout(function() {
          runTask(taskId);
        }, 0);
      };
      if (NODE_ENV && NODE_ENV.process && typeof process.nextTick == "function") {
        addToQueue = function(taskId) {
          process.nextTick(function() {
            runTask(taskId);
          });
        };
      } else {
        var postMessageSupported = global.postMessage && !global.importScripts;
        if (postMessageSupported) {
          var oldOnMessage = global.onmessage;
          global.onmessage = function() {
            postMessageSupported = false;
          };
          global.postMessage("", "*");
          global.onmessage = oldOnMessage;
        }
        if (postMessageSupported) {
          var taskIdByMessage = {};
          var setImmediateHandler = function(event) {
            if (event && event.source == global) {
              var data = event.data;
              if (hasOwnProperty.call(taskIdByMessage, data)) {
                var taskId = taskIdByMessage[data];
                delete taskIdByMessage[data];
                runTask(taskId);
              }
            }
          };
          if (global.addEventListener) global.addEventListener("message", setImmediateHandler, true); else global.attachEvent("onmessage", setImmediateHandler);
          addToQueue = function(taskId) {
            var message = genUID(32);
            taskIdByMessage[message] = taskId;
            global.postMessage(message, "*");
          };
        } else {
          if (global.MessageChannel) {
            var channel = new global.MessageChannel;
            channel.port1.onmessage = function(event) {
              runTask(event.data);
            };
            addToQueue = function(taskId) {
              channel.port2.postMessage(taskId);
            };
          } else {
            var createScript = function() {
              return document.createElement("script");
            };
            if (document && "onreadystatechange" in createScript()) {
              var defaultAddToQueue = addToQueue;
              addToQueue = function beforeHeadReady(taskId) {
                if (typeof documentInterface != "undefined") {
                  addToQueue = defaultAddToQueue;
                  documentInterface.head.ready(function() {
                    addToQueue = function(taskId) {
                      var scriptEl = createScript();
                      scriptEl.onreadystatechange = function() {
                        scriptEl.onreadystatechange = null;
                        documentInterface.remove(scriptEl);
                        scriptEl = null;
                        runTask(taskId);
                      };
                      documentInterface.head.add(scriptEl);
                    };
                  });
                }
                if (addToQueue === beforeHeadReady) defaultAddToQueue(taskId); else addToQueue(taskId);
              };
            }
          }
        }
      }
    })();
  }
  var asap = function() {
    var queue = [];
    var processing = false;
    var timer;
    function processQueue() {
      try {
        processing = true;
        var item;
        while (item = queue.shift()) item.fn.call(item.context);
      } finally {
        processing = false;
        if (queue.length) timer = setImmediate(process);
      }
    }
    function process() {
      if (timer) timer = clearImmediate(timer);
      if (queue.length) processQueue();
    }
    var asap = function(fn, context) {
      queue.push({
        fn: fn,
        context: context
      });
      if (!timer) timer = setImmediate(process);
      return true;
    };
    asap.process = function() {
      if (!processing) process();
    };
    asap.schedule = function(scheduleFn) {
      var queue = {};
      var scheduled = false;
      function process() {
        var etimer = setImmediate(process);
        scheduled = false;
        for (var id in queue) {
          var object = queue[id];
          delete queue[id];
          scheduleFn(object);
        }
        clearImmediate(etimer);
        if (!scheduled) queue = {};
      }
      return {
        add: function(object) {
          queue[object.basisObjectId] = object;
          if (!scheduled) scheduled = basis.asap(process);
        },
        remove: function(object) {
          delete queue[object.basisObjectId];
        }
      };
    };
    return asap;
  }();
  var codeFrame = function() {
    var count = 0;
    var info = {
      id: count,
      start: function() {
        info.id = count++;
      },
      finish: function() {
        asap.process();
        info.id = "unknown";
      }
    };
    return info;
  }();
  var pathUtils = function() {
    var ABSOLUTE_RX = /^([^\/]+:|\/)/;
    var PROTOCOL_RX = /^[a-zA-Z0-9\-]+:\/?/;
    var ORIGIN_RX = /^(?:[a-zA-Z0-9\-]+:)?\/\/[^\/]+\/?/;
    var SEARCH_HASH_RX = /[\?#].*$/;
    var baseURI;
    var origin;
    var utils;
    if (NODE_ENV) {
      var path = (process.basisjsBaseURI || require("path").resolve(".")).replace(/\\/g, "/");
      baseURI = path.replace(/^[^\/]*/, "");
      origin = path.replace(/\/.*/, "");
    } else {
      baseURI = location.pathname.replace(/[^\/]+$/, "");
      origin = location.protocol + "//" + location.host;
    }
    utils = {
      baseURI: baseURI,
      origin: origin,
      normalize: function(path) {
        path = (path || "").replace(PROTOCOL_RX, "/").replace(ORIGIN_RX, "/").replace(SEARCH_HASH_RX, "");
        var result = [];
        var parts = path.split("/");
        for (var i = 0; i < parts.length; i++) {
          if (parts[i] == "..") {
            if (result.length > 1 || result[0]) result.pop();
          } else {
            if ((parts[i] || !i) && parts[i] != ".") result.push(parts[i]);
          }
        }
        return result.join("/") || (path[0] === "/" ? "/" : "");
      },
      dirname: function(path) {
        var result = utils.normalize(path);
        return result.replace(/\/([^\/]*)$|^[^\/]+$/, "") || (result[0] == "/" ? "/" : ".");
      },
      extname: function(path) {
        var ext = utils.normalize(path).match(/[^\/](\.[^\/\.]*)$/);
        return ext ? ext[1] : "";
      },
      basename: function(path, ext) {
        var filename = utils.normalize(path).match(/[^\\\/]*$/);
        filename = filename ? filename[0] : "";
        if (ext == utils.extname(filename)) filename = filename.substring(0, filename.length - ext.length);
        return filename;
      },
      resolve: function() {
        var args = arrayFrom(arguments).reverse();
        var path = [];
        var absoluteFound = false;
        for (var i = 0; !absoluteFound && i < args.length; i++) if (typeof args[i] == "string") {
          path.unshift(args[i]);
          absoluteFound = ABSOLUTE_RX.test(args[i]);
        }
        if (!absoluteFound) path.unshift(baseURI == "/" ? "" : baseURI);
        return utils.normalize(path.join("/"));
      },
      relative: function(from, to) {
        if (typeof to != "string") {
          to = from;
          from = baseURI;
        }
        from = utils.normalize(from);
        to = utils.normalize(to);
        if (from[0] == "/" && to[0] != "/") return from;
        if (to[0] == "/" && from[0] != "/") return to;
        var base = from.replace(/^\/$/, "").split(/\//);
        var path = to.replace(/^\/$/, "").split(/\//);
        var result = [];
        var i = 0;
        while (path[i] == base[i] && typeof base[i] == "string") i++;
        for (var j = base.length - i; j > 0; j--) result.push("..");
        return result.concat(path.slice(i).filter(Boolean)).join("/");
      }
    };
    return utils;
  }();
  var basisFilename = __basisFilename || "";
  var config = __config || {
    noConflict: true,
    implicitExt: true,
    modules: {},
    autoload: [ "./0.js" ]
  };
  function fetchConfig() {
    var config = __config;
    if (!config) {
      if (NODE_ENV) {
        basisFilename = process.basisjsFilename;
        if (process.basisjsConfig) {
          config = process.basisjsConfig;
          if (typeof config == "string") {
            try {
              config = Function("return{" + config + "}")();
            } catch (e) {
              consoleMethods.error("basis-config: basis.js config parse fault: " + e);
            }
          }
        }
      } else {
        var scripts = document.scripts;
        for (var i = 0, scriptEl; scriptEl = scripts[i]; i++) {
          var configAttrValue = scriptEl.hasAttribute("basis-config") ? scriptEl.getAttribute("basis-config") : scriptEl.getAttribute("data-basis-config");
          scriptEl.removeAttribute("basis-config");
          scriptEl.removeAttribute("data-basis-config");
          if (configAttrValue !== null) {
            basisFilename = pathUtils.normalize(scriptEl.src);
            try {
              config = Function("return{" + configAttrValue + "}")();
            } catch (e) {
              consoleMethods.error("basis-config: basis.js config parse fault: " + e);
            }
            break;
          }
        }
      }
    }
    return processConfig(config);
  }
  function processConfig(config) {
    config = slice(config);
    complete(config, {
      implicitExt: NODE_ENV ? true : "warn"
    });
    if ("extProto" in config) consoleMethods.warn("basis-config: `extProto` option in basis-config is not support anymore");
    if ("path" in config) consoleMethods.warn("basis-config: `path` option in basis-config is deprecated, use `modules` instead");
    var autoload = [];
    var modules = merge(config.path, config.modules, {
      basis: basisFilename
    });
    config.modules = {};
    if (config.autoload) {
      var m = String(config.autoload).match(/^((?:[^\/]*\/)*)([a-z$_][a-z0-9$_]*)((?:\.[a-z$_][a-z0-9$_]*)*)$/i);
      if (m) {
        modules[m[2]] = {
          autoload: true,
          filename: m[1] + m[2] + (m[3] || ".js")
        };
      } else {
        consoleMethods.warn("basis-config: wrong `autoload` value (setting ignored): " + config.autoload);
      }
      delete config.autoload;
    }
    for (var name in modules) {
      var module = modules[name];
      if (typeof module == "string") module = {
        filename: module.replace(/\/$/, "/" + name + ".js")
      };
      var filename = module.filename;
      var path = module.path;
      if (filename && !path) {
        filename = pathUtils.resolve(filename);
        path = filename.substr(0, filename.length - pathUtils.extname(filename).length);
        filename = "../" + pathUtils.basename(filename);
      }
      path = pathUtils.resolve(path);
      if (!filename && path) {
        filename = pathUtils.basename(path);
        path = pathUtils.dirname(path);
      }
      if (!pathUtils.extname(filename)) filename += ".js";
      filename = pathUtils.resolve(path, filename);
      config.modules[name] = {
        path: path,
        filename: filename
      };
      if (module.autoload) {
        config.autoload = autoload;
        autoload.push(name);
      }
    }
    return config;
  }
  var Class = function() {
    var instanceSeed = {
      id: 1
    };
    var classSeed = 1;
    var classes = [];
    var SELF = {};
    function isClass(object) {
      return typeof object == "function" && !!object.basisClassId_;
    }
    function isSubclassOf(superClass) {
      var cursor = this;
      while (cursor && cursor !== superClass) cursor = cursor.superClass_;
      return cursor === superClass;
    }
    var TOSTRING_BUG = function() {
      for (var key in {
        toString: 1
      }) return false;
      return true;
    }();
    function createClass(SuperClass) {
      var classId = classSeed++;
      if (typeof SuperClass != "function") SuperClass = BaseClass;
      var className = "";
      for (var i = 1, extension; extension = arguments[i]; i++) if (typeof extension != "function" && extension.className) className = extension.className;
      if (!className) className = SuperClass.className + "._Class" + classId;
      var NewClassProto = function() {};
      NewClassProto = devVerboseName(className, {}, NewClassProto);
      NewClassProto.prototype = SuperClass.prototype;
      var newProto = new NewClassProto;
      var newClassProps = {
        className: className,
        basisClassId_: classId,
        superClass_: SuperClass,
        extendConstructor_: !!SuperClass.extendConstructor_,
        isSubclassOf: isSubclassOf,
        subclass: function() {
          return createClass.apply(null, [ newClass ].concat(arrayFrom(arguments)));
        },
        extend: extendClass,
        __extend__: function(value) {
          if (value && value !== SELF && (typeof value == "object" || typeof value == "function" && !isClass(value))) return BaseClass.create.call(null, newClass, value); else return value;
        },
        prototype: newProto
      };
      for (var i = 1, extension; extension = arguments[i]; i++) newClassProps.extend(extension);
      if (newProto.init !== BaseClass.prototype.init && !/^function[^(]*\(\)/.test(newProto.init) && newClassProps.extendConstructor_) consoleMethods.warn("probably wrong extendConstructor_ value for " + newClassProps.className);
      var newClass = newClassProps.extendConstructor_ ? function(extend) {
        this.basisObjectId = instanceSeed.id++;
        var prop;
        for (var key in extend) {
          prop = this[key];
          this[key] = prop && prop.__extend__ ? prop.__extend__(extend[key]) : extend[key];
        }
        this.init();
        this.postInit();
      } : function() {
        this.basisObjectId = instanceSeed.id++;
        this.init.apply(this, arguments);
        this.postInit();
      };
      newClass = devVerboseName(className, {
        instanceSeed: instanceSeed
      }, newClass);
      newProto.constructor = newClass;
      for (var key in newProto) if (newProto[key] === SELF) newProto[key] = newClass;
      extend(newClass, newClassProps);
      classes.push(newClass);
      return newClass;
    }
    function extendClass(source) {
      var proto = this.prototype;
      if (typeof source == "function" && !isClass(source)) source = source(this.superClass_.prototype, slice(proto));
      if (source.prototype) source = source.prototype;
      for (var key in source) {
        var value = source[key];
        var protoValue = proto[key];
        if (key == "className" || key == "extendConstructor_") this[key] = value; else {
          if (protoValue && protoValue.__extend__) proto[key] = protoValue.__extend__(value); else {
            proto[key] = value;
          }
        }
      }
      if (TOSTRING_BUG && source[key = "toString"] !== toString) proto[key] = source[key];
      return this;
    }
    var BaseClass = extend(createClass, {
      className: "basis.Class",
      extendConstructor_: false,
      prototype: {
        basisObjectId: 0,
        constructor: null,
        init: function() {},
        postInit: function() {},
        toString: function() {
          return "[object " + (this.constructor || this).className + "]";
        },
        destroy: function() {
          for (var prop in this) if (hasOwnProperty.call(this, prop)) this[prop] = null;
          this.destroy = $undef;
        }
      }
    });
    var customExtendProperty = function(extension, fn) {
      return {
        __extend__: function(extension) {
          if (!extension) return extension;
          if (extension && extension.__extend__) return extension;
          var Base = function() {};
          Base = devVerboseName(arguments[2] || "customExtendProperty", {}, Base);
          Base.prototype = this;
          var result = new Base;
          fn(result, extension);
          return result;
        }
      }.__extend__(extension || {});
    };
    var extensibleProperty = function(extension) {
      return customExtendProperty(extension, extend, "extensibleProperty");
    };
    var nestedExtendProperty = function(extension) {
      return customExtendProperty(extension, function(result, extension) {
        for (var key in extension) if (hasOwnProperty.call(extension, key)) {
          var value = result[key];
          var newValue = extension[key];
          if (newValue) result[key] = value && value.__extend__ ? value.__extend__(newValue) : extensibleProperty(newValue); else result[key] = null;
        }
      }, "nestedExtendProperty");
    };
    var oneFunctionProperty = function(fn, keys) {
      var create = function(keys) {
        var result = {
          __extend__: create
        };
        if (keys) {
          if (keys.__extend__) return keys;
          var Cls = devVerboseName("oneFunctionProperty", {}, function() {});
          result = new Cls;
          result.__extend__ = create;
          for (var key in keys) if (hasOwnProperty.call(keys, key) && keys[key]) result[key] = fn;
        }
        return result;
      };
      return create(keys || {});
    };
    return extend(BaseClass, {
      all_: classes,
      SELF: SELF,
      create: createClass,
      isClass: isClass,
      customExtendProperty: customExtendProperty,
      extensibleProperty: extensibleProperty,
      nestedExtendProperty: nestedExtendProperty,
      oneFunctionProperty: oneFunctionProperty
    });
  }();
  var Token = Class(null, {
    className: "basis.Token",
    value: null,
    handler: null,
    deferredToken: null,
    bindingBridge: {
      attach: function(host, fn, context, onDestroy) {
        host.attach(fn, context, onDestroy);
      },
      detach: function(host, fn, context) {
        host.detach(fn, context);
      },
      get: function(host) {
        return host.get();
      }
    },
    init: function(value) {
      this.value = value;
    },
    get: function() {
      return this.value;
    },
    set: function(value) {
      if (this.value !== value) {
        this.value = value;
        this.apply();
      }
    },
    attach: function(fn, context, onDestroy) {
      var cursor = this;
      while (cursor = cursor.handler) if (cursor.fn === fn && cursor.context === context) consoleMethods.warn("basis.Token#attach: duplicate fn & context pair");
      this.handler = {
        fn: fn,
        context: context,
        destroy: onDestroy || null,
        handler: this.handler
      };
    },
    detach: function(fn, context) {
      var cursor = this;
      var prev;
      while (prev = cursor, cursor = cursor.handler) if (cursor.fn === fn && cursor.context === context) {
        cursor.fn = $undef;
        cursor.destroy = cursor.destroy && $undef;
        prev.handler = cursor.handler;
        return;
      }
      consoleMethods.warn("basis.Token#detach: fn & context pair not found, nothing was removed");
    },
    apply: function() {
      var value = this.get();
      var cursor = this;
      while (cursor = cursor.handler) cursor.fn.call(cursor.context, value);
    },
    deferred: function() {
      var token = this.deferredToken;
      if (!token) {
        token = this.deferredToken = new DeferredToken(this.get());
        this.attach(token.set, token);
      }
      return token;
    },
    as: function(fn) {
      var token = new Token;
      var setter = function(value) {
        this.set(fn.call(this, value));
      };
      if (typeof fn != "function") fn = getter(fn);
      setter.call(token, this.get());
      this.attach(setter, token, token.destroy);
      token.attach($undef, this, function() {
        this.detach(setter, token);
      });
      return token;
    },
    destroy: function() {
      if (this.deferredToken) {
        this.deferredToken.destroy();
        this.deferredToken = null;
      }
      this.attach = $undef;
      this.detach = $undef;
      var cursor = this;
      while (cursor = cursor.handler) if (cursor.destroy) cursor.destroy.call(cursor.context);
      this.handler = null;
      this.value = null;
    }
  });
  var deferredTokenApplyQueue = asap.schedule(function(token) {
    token.apply();
  });
  var DeferredToken = Token.subclass({
    className: "basis.DeferredToken",
    set: function(value) {
      if (this.value !== value) {
        this.value = value;
        deferredTokenApplyQueue.add(this);
      }
    },
    deferred: function() {
      return this;
    }
  });
  var resources = {};
  var resourceRequestCache = {};
  var resourceContentCache = {};
  var resourcePatch = {};
  var virtualResourceSeed = 1;
  var resourceResolvingStack = [];
  var requires;
  (function() {
    var map = typeof __resources__ != "undefined" ? __resources__ : null;
    if (map) {
      for (var key in map) resourceContentCache[pathUtils.resolve(key)] = map[key];
    }
  })();
  function applyResourcePatches(resource) {
    var patches = resourcePatch[resource.url];
    if (patches) for (var i = 0; i < patches.length; i++) {
      consoleMethods.info("Apply patch for " + resource.url);
      patches[i](resource.get(), resource.url);
    }
  }
  var resolveResourceFilename = function(url, baseURI) {
    var rootNS = url.match(/^([a-zA-Z0-9\_\-]+):/);
    if (rootNS) {
      var namespaceRoot = rootNS[1];
      if (namespaceRoot in nsRootPath == false) nsRootPath[namespaceRoot] = pathUtils.baseURI + namespaceRoot + "/";
      url = nsRootPath[namespaceRoot] + pathUtils.normalize("./" + url.substr(rootNS[0].length));
    } else {
      if (!/^(\.\/|\.\.|\/)/.test(url)) {
        var clr = arguments[2];
        consoleMethods.warn("Bad usage: " + (clr ? clr.replace("{url}", url) : url) + ".\nFilenames should starts with `./`, `..` or `/`. Otherwise it may treats as special reference in next releases.");
      }
      url = pathUtils.resolve(baseURI, url);
    }
    return url;
  };
  var getResourceContent = function(url, ignoreCache) {
    if (ignoreCache || !hasOwnProperty.call(resourceContentCache, url)) {
      var resourceContent = "";
      if (!NODE_ENV) {
        var req = new global.XMLHttpRequest;
        req.open("GET", url, false);
        req.setRequestHeader("If-Modified-Since", (new Date(0)).toGMTString());
        req.setRequestHeader("X-Basis-Resource", 1);
        req.send("");
        if (req.status >= 200 && req.status < 400) resourceContent = req.responseText; else {
          consoleMethods.error("basis.resource: Unable to load " + url + " (status code " + req.status + ")");
        }
      } else {
        try {
          resourceContent = process.basisjsReadFile ? process.basisjsReadFile(url) : require("fs").readFileSync(url, "utf-8");
        } catch (e) {
          consoleMethods.error("basis.resource: Unable to load " + url, e);
        }
      }
      resourceContentCache[url] = resourceContent;
    }
    return resourceContentCache[url];
  };
  var createResource = function(resourceUrl, content) {
    var contentType = pathUtils.extname(resourceUrl);
    var contentWrapper = getResource.extensions[contentType];
    var isVirtual = arguments.length > 1;
    var resolved = false;
    var wrapped = false;
    var wrappedContent;
    if (isVirtual) resourceUrl += "#virtual";
    var resource = function() {
      if (resolved) return content;
      var urlContent = isVirtual ? content : getResourceContent(resourceUrl);
      var idx = resourceResolvingStack.indexOf(resourceUrl);
      if (idx != -1) consoleMethods.warn("basis.resource recursion:", resourceResolvingStack.slice(idx).concat(resourceUrl).map(pathUtils.relative, pathUtils).join(" -> "));
      resourceResolvingStack.push(resourceUrl);
      if (contentWrapper) {
        if (!wrapped) {
          wrapped = true;
          content = contentWrapper(urlContent, resourceUrl);
          wrappedContent = urlContent;
        }
      } else {
        content = urlContent;
      }
      resolved = true;
      applyResourcePatches(resource);
      resource.apply();
      resourceResolvingStack.pop();
      return content;
    };
    extend(resource, extend(new Token, {
      url: resourceUrl,
      type: contentType,
      virtual: isVirtual,
      fetch: function() {
        return resource();
      },
      toString: function() {
        return "[basis.resource " + resourceUrl + "]";
      },
      isResolved: function() {
        return resolved;
      },
      hasChanges: function() {
        return contentWrapper ? resourceContentCache[resourceUrl] !== wrappedContent : false;
      },
      update: function(newContent) {
        if (!resolved || isVirtual || newContent != resourceContentCache[resourceUrl]) {
          if (!isVirtual) resourceContentCache[resourceUrl] = newContent;
          if (contentWrapper) {
            if (!wrapped && isVirtual) content = newContent;
            if (wrapped && !contentWrapper.permanent) {
              content = contentWrapper(newContent, resourceUrl, content);
              applyResourcePatches(resource);
              resource.apply();
            }
          } else {
            content = newContent;
            resolved = true;
            applyResourcePatches(resource);
            resource.apply();
          }
        }
      },
      reload: function() {
        if (isVirtual) return;
        var oldContent = resourceContentCache[resourceUrl];
        var newContent = getResourceContent(resourceUrl, true);
        if (newContent != oldContent) {
          resolved = false;
          resource.update(newContent);
        }
      },
      get: function(source) {
        if (isVirtual) if (source) return contentWrapper ? wrappedContent : content;
        return source ? getResourceContent(resourceUrl) : resource();
      },
      ready: function(fn, context) {
        if (resolved) {
          fn.call(context, resource());
          if (contentWrapper && contentWrapper.permanent) return;
        }
        resource.attach(fn, context);
        return resource;
      }
    }));
    resources[resourceUrl] = resource;
    resourceRequestCache[resourceUrl] = resource;
    return resource;
  };
  var getResource = function(url, baseURI) {
    var reference = baseURI ? baseURI + "\0" + url : url;
    var resource = resourceRequestCache[reference];
    if (!resource) {
      var resolvedUrl = resolveResourceFilename(url, baseURI, "basis.resource('{url}')");
      resource = resources[resolvedUrl] || createResource(resolvedUrl);
      resourceRequestCache[reference] = resource;
    }
    return resource;
  };
  extend(getResource, {
    resolveURI: resolveResourceFilename,
    isResource: function(value) {
      return value ? resources[value.url] === value : false;
    },
    isResolved: function(resourceUrl) {
      var resource = getResource.get(resourceUrl);
      return resource ? resource.isResolved() : false;
    },
    exists: function(resourceUrl) {
      return hasOwnProperty.call(resources, resolveResourceFilename(resourceUrl, null, "basis.resource.exists('{url}')"));
    },
    get: function(resourceUrl) {
      resourceUrl = resolveResourceFilename(resourceUrl, null, "basis.resource.get('{url}')");
      if (!getResource.exists(resourceUrl)) return null;
      return getResource(resourceUrl);
    },
    getFiles: function(cache) {
      return cache ? keys(resourceContentCache) : keys(resources).filter(function(filename) {
        return !resources[filename].virtual;
      });
    },
    virtual: function(type, content, ownerUrl) {
      return createResource((ownerUrl ? ownerUrl + ":" : pathUtils.normalize(pathUtils.baseURI == "/" ? "" : pathUtils.baseURI) + "/") + "virtual-resource" + virtualResourceSeed++ + "." + type, content);
    },
    extensions: {
      ".js": extend(function processJsResourceContent(content, filename) {
        var namespace = filename2namespace[filename];
        if (!namespace) {
          var implicitNamespace = true;
          var resolvedFilename = (pathUtils.dirname(filename) + "/" + pathUtils.basename(filename, pathUtils.extname(filename))).replace(/^\/\//, "/");
          for (var ns in nsRootPath) {
            var path = nsRootPath[ns] + ns + "/";
            if (resolvedFilename.substr(0, path.length) == path) {
              implicitNamespace = false;
              resolvedFilename = resolvedFilename.substr(nsRootPath[ns].length);
              break;
            }
          }
          namespace = resolvedFilename.replace(/\./g, "_").replace(/^\//g, "").replace(/\//g, ".");
          if (implicitNamespace) namespace = "implicit." + namespace;
        }
        if (requires) arrayFunctions.add(requires, namespace);
        var ns = getNamespace(namespace);
        if (!ns.inited) {
          var savedRequires = requires;
          requires = [];
          ns.inited = true;
          ns.exports = runScriptInContext({
            path: ns.path,
            exports: ns.exports
          }, filename, content).exports;
          if (ns.exports && ns.exports.constructor === Object) {
            if (config.implicitExt) {
              if (config.implicitExt == "warn") {
                for (var key in ns.exports) if (key in ns == false && key != "path") {
                  ns[key] = ns.exports[key];
                  warnPropertyAccess(ns, key, ns.exports[key], "basis.js: Access to implicit namespace property `" + namespace + "." + key + "`");
                }
              } else complete(ns, ns.exports);
            }
          }
          ns.filename_ = filename;
          ns.source_ = content;
          ns.requires_ = requires;
          requires = savedRequires;
        }
        return ns.exports;
      }, {
        permanent: true
      }),
      ".css": function processCssResourceContent(content, url, cssResource) {
        if (!cssResource) cssResource = new CssResource(url);
        cssResource.updateCssText(content);
        return cssResource;
      },
      ".json": function processJsonResourceContent(content) {
        if (typeof content == "object") return content;
        var result;
        try {
          content = String(content);
          result = basis.json.parse(content);
        } catch (e) {
          var url = arguments[1];
          consoleMethods.warn("basis.resource: Can't parse JSON from " + url, {
            url: url,
            content: content
          });
        }
        return result || null;
      }
    }
  });
  function compileFunction(sourceURL, args, body) {
    try {
      return new Function(args, '"use strict";\n' + (NODE_ENV ? "var __nodejsRequire = require;\n" : "") + body + "\n\n//# sourceURL=" + pathUtils.origin + sourceURL);
    } catch (e) {
      if (document && "line" in e == false && "addEventListener" in global) {
        global.addEventListener("error", function onerror(event) {
          if (event.filename == pathUtils.origin + sourceURL) {
            global.removeEventListener("error", onerror);
            consoleMethods.error("Compilation error at " + event.filename + ":" + event.lineno + ": " + e);
            event.preventDefault();
          }
        });
        var script = document.createElement("script");
        script.src = sourceURL;
        script.async = false;
        document.head.appendChild(script);
        document.head.removeChild(script);
      }
      consoleMethods.error("Compilation error at " + sourceURL + ("line" in e ? ":" + (e.line - 1) : "") + ": " + e);
    }
  }
  var runScriptInContext = function(context, sourceURL, sourceCode) {
    var baseURL = pathUtils.dirname(sourceURL);
    var compiledSourceCode = sourceCode;
    if (!context.exports) context.exports = {};
    if (typeof compiledSourceCode != "function") compiledSourceCode = compileFunction(sourceURL, [ "exports", "module", "basis", "global", "__filename", "__dirname", "resource", "require", "asset" ], sourceCode);
    if (typeof compiledSourceCode == "function") {
      compiledSourceCode.displayName = "[module] " + (filename2namespace[sourceURL] || sourceURL);
      compiledSourceCode.call(context.exports, context.exports, context, basis, global, sourceURL, baseURL, function(path) {
        return getResource(path, baseURL);
      }, function(path) {
        return requireNamespace(path, baseURL);
      }, function(path) {
        return resolveResourceFilename(path, baseURL, "asset('{url}')");
      });
    }
    return context;
  };
  var namespaces = {};
  var namespace2filename = {};
  var filename2namespace = {};
  var nsRootPath = {};
  iterate(config.modules, function(name, module) {
    nsRootPath[name] = module.path + "/";
    namespace2filename[name] = module.filename;
    filename2namespace[module.filename] = name;
  });
  (function(map) {
    var map = typeof __namespace_map__ != "undefined" ? __namespace_map__ : null;
    if (map) {
      for (var key in map) {
        var filename = pathUtils.resolve(key);
        var namespace = map[key];
        filename2namespace[filename] = namespace;
        namespace2filename[namespace] = filename;
      }
    }
  })();
  var Namespace = Class(null, {
    className: "basis.Namespace",
    init: function(name) {
      this.name = name;
      this.exports = {
        path: this.name
      };
    },
    toString: function() {
      return "[basis.namespace " + this.path + "]";
    },
    extend: function(names) {
      extend(this.exports, names);
      return complete(this, names);
    }
  });
  function resolveNSFilename(namespace) {
    if (namespace in namespace2filename == false) {
      var parts = namespace.split(".");
      var namespaceRoot = parts.shift();
      var filename = resolveResourceFilename(namespaceRoot + ":" + parts.join("/") + ".js").replace(/\/\.js$/, ".js");
      namespace2filename[namespace] = filename;
      filename2namespace[filename] = namespace;
    }
    return namespace2filename[namespace];
  }
  function getRootNamespace(name) {
    var namespace = namespaces[name];
    if (!namespace) {
      namespace = namespaces[name] = new Namespace(name);
      namespace.namespaces_ = {};
      namespace.namespaces_[name] = namespace;
      if (!config.noConflict) global[name] = namespace;
    }
    if (name == "library" && !library) library = namespaces[name];
    return namespace;
  }
  function getNamespace(path) {
    if (hasOwnProperty.call(namespaces, path)) return namespaces[path];
    path = path.split(".");
    var rootNs = getRootNamespace(path[0]);
    var cursor = rootNs;
    for (var i = 1; i < path.length; i++) {
      var name = path[i];
      var nspath = path.slice(0, i + 1).join(".");
      if (!hasOwnProperty.call(rootNs.namespaces_, nspath)) {
        var namespace = new Namespace(nspath);
        if (config.implicitExt) {
          cursor[name] = namespace;
          if (config.implicitExt == "warn") {
            cursor[name] = namespace;
            warnPropertyAccess(cursor, name, namespace, "basis.js: Access to implicit namespace `" + nspath + "`");
          }
        }
        rootNs.namespaces_[nspath] = namespace;
      }
      cursor = rootNs.namespaces_[nspath];
    }
    namespaces[path.join(".")] = cursor;
    return cursor;
  }
  var requireNamespace = function(path, baseURI) {
    if (!/[^a-z0-9_\.]/i.test(path) && pathUtils.extname(path) != ".js") {
      path = resolveNSFilename(path);
    } else {
      if (!/[\?#]/.test(path)) path = resolveResourceFilename(path, baseURI, "basis.require('{url}')");
    }
    return getResource(path).fetch();
  };
  requireNamespace.displayName = "basis.require";
  function patch(filename, patchFn) {
    if (!/[^a-z0-9_\.]/i.test(filename) && pathUtils.extname(filename) != ".js") {
      filename = resolveNSFilename(filename);
    } else {
      filename = resolveResourceFilename(filename, null, "basis.patch('{url}')");
    }
    if (!resourcePatch[filename]) resourcePatch[filename] = [ patchFn ]; else resourcePatch[filename].push(patchFn);
    var resource = getResource.get(filename);
    if (resource && resource.isResolved()) {
      consoleMethods.info("Apply patch for " + resource.url);
      patchFn(resource.get(), resource.url);
    }
  }
  complete(Function.prototype, {
    bind: function(thisObject) {
      var fn = this;
      var params = arrayFrom(arguments, 1);
      return params.length ? function() {
        return fn.apply(thisObject, params.concat.apply(params, arguments));
      } : function() {
        return fn.apply(thisObject, arguments);
      };
    }
  });
  complete(Array, {
    isArray: function(value) {
      return toString.call(value) === "[object Array]";
    }
  });
  function arrayFrom(object, offset) {
    if (object != null) {
      var len = object.length;
      if (typeof len == "undefined" || toString.call(object) == "[object Function]") return [ object ];
      if (!offset) offset = 0;
      if (len - offset > 0) {
        for (var result = [], k = 0, i = offset; i < len; ) result[k++] = object[i++];
        return result;
      }
    }
    return [];
  }
  function createArray(length, fillValue, thisObject) {
    var result = [];
    var isFunc = typeof fillValue == "function";
    for (var i = 0; i < length; i++) result[i] = isFunc ? fillValue.call(thisObject, i, result) : fillValue;
    return result;
  }
  complete(Array.prototype, {
    indexOf: function(searchElement, offset) {
      offset = parseInt(offset, 10) || 0;
      if (offset < 0) return -1;
      for (; offset < this.length; offset++) if (this[offset] === searchElement) return offset;
      return -1;
    },
    lastIndexOf: function(searchElement, offset) {
      var len = this.length;
      offset = parseInt(offset, 10);
      if (isNaN(offset) || offset >= len) offset = len - 1; else offset = (offset + len) % len;
      for (; offset >= 0; offset--) if (this[offset] === searchElement) return offset;
      return -1;
    },
    forEach: function(callback, thisObject) {
      for (var i = 0, len = this.length; i < len; i++) if (i in this) callback.call(thisObject, this[i], i, this);
    },
    every: function(callback, thisObject) {
      for (var i = 0, len = this.length; i < len; i++) if (i in this && !callback.call(thisObject, this[i], i, this)) return false;
      return true;
    },
    some: function(callback, thisObject) {
      for (var i = 0, len = this.length; i < len; i++) if (i in this && callback.call(thisObject, this[i], i, this)) return true;
      return false;
    },
    filter: function(callback, thisObject) {
      var result = [];
      for (var i = 0, len = this.length; i < len; i++) if (i in this && callback.call(thisObject, this[i], i, this)) result.push(this[i]);
      return result;
    },
    map: function(callback, thisObject) {
      var result = [];
      for (var i = 0, len = this.length; i < len; i++) if (i in this) result[i] = callback.call(thisObject, this[i], i, this);
      return result;
    },
    reduce: function(callback, initialValue) {
      var len = this.length;
      var argsLen = arguments.length;
      if (len == 0 && argsLen == 1) throw new TypeError;
      var result;
      var inited = 0;
      if (argsLen > 1) {
        result = initialValue;
        inited = 1;
      }
      for (var i = 0; i < len; i++) if (i in this) if (inited++) result = callback.call(null, result, this[i], i, this); else result = this[i];
      return result;
    }
  });
  var arrayFunctions = {
    from: arrayFrom,
    create: createArray,
    flatten: function(this_) {
      return this_.concat.apply([], this_);
    },
    repeat: function(this_, count) {
      return arrayFunctions.flatten(createArray(parseInt(count, 10) || 0, this_));
    },
    search: function(this_, value, getter_, offset) {
      this_.lastSearchIndex = -1;
      getter_ = getter(getter_ || $self);
      for (var index = parseInt(offset, 10) || 0, len = this_.length; index < len; index++) if (getter_(this_[index]) === value) return this_[this_.lastSearchIndex = index];
    },
    lastSearch: function(this_, value, getter_, offset) {
      this_.lastSearchIndex = -1;
      getter_ = getter(getter_ || $self);
      var len = this_.length;
      var index = isNaN(offset) || offset == null ? len : parseInt(offset, 10);
      for (var i = index > len ? len : index; i-- > 0; ) if (getter_(this_[i]) === value) return this_[this_.lastSearchIndex = i];
    },
    add: function(this_, value) {
      return this_.indexOf(value) == -1 && !!this_.push(value);
    },
    remove: function(this_, value) {
      var index = this_.indexOf(value);
      return index != -1 && !!this_.splice(index, 1);
    },
    has: function(this_, value) {
      return this_.indexOf(value) != -1;
    },
    sortAsObject: function() {
      consoleMethods.warn("basis.array.sortAsObject is deprecated, use basis.array.sort instead");
      return arrayFunctions.sort.apply(this, arguments);
    },
    sort: function(this_, getter_, comparator, desc) {
      getter_ = getter(getter_);
      desc = desc ? -1 : 1;
      return this_.map(function(item, index) {
        return {
          i: index,
          v: getter_(item)
        };
      }).sort(comparator || function(a, b) {
        return desc * (a.v > b.v || -(a.v < b.v) || (a.i > b.i ? 1 : -1));
      }).map(function(item) {
        return this[item.i];
      }, this_);
    }
  };
  if (![ 1, 2 ].splice(1).length) {
    var nativeArraySplice = Array.prototype.splice;
    Array.prototype.splice = function() {
      var params = arrayFrom(arguments);
      if (params.length < 2) params[1] = this.length;
      return nativeArraySplice.apply(this, params);
    };
  }
  var ESCAPE_FOR_REGEXP = /([\/\\\(\)\[\]\?\{\}\|\*\+\-\.\^\$])/g;
  var FORMAT_REGEXP = /\{([a-z\d_]+)(?::([\.0])(\d+)|:(\?))?\}/gi;
  var stringFormatCache = {};
  complete(String, {
    toLowerCase: function(value) {
      return String(value).toLowerCase();
    },
    toUpperCase: function(value) {
      return String(value).toUpperCase();
    },
    trim: function(value) {
      return String(value).trim();
    },
    trimLeft: function(value) {
      return String(value).trimLeft();
    },
    trimRight: function(value) {
      return String(value).trimRight();
    }
  });
  complete(String.prototype, {
    trimLeft: function() {
      return this.replace(/^\s+/, "");
    },
    trimRight: function() {
      return this.replace(/\s+$/, "");
    },
    trim: function() {
      return this.trimLeft().trimRight();
    }
  });
  var stringFunctions = {
    toObject: function(this_, rethrow) {
      try {
        return (new Function("return 0," + this_))();
      } catch (e) {
        if (rethrow) throw e;
      }
    },
    repeat: function(this_, count) {
      return (new Array(parseInt(count, 10) + 1 || 0)).join(this_);
    },
    qw: function(this_) {
      var trimmed = this_.trim();
      return trimmed ? trimmed.split(/\s+/) : [];
    },
    forRegExp: function(this_) {
      return this_.replace(ESCAPE_FOR_REGEXP, "\\$1");
    },
    format: function(this_, first) {
      var data = arrayFrom(arguments, 1);
      if (typeof first == "object") extend(data, first);
      return this_.replace(FORMAT_REGEXP, function(m, key, numFormat, num, noNull) {
        var value = key in data ? data[key] : noNull ? "" : m;
        if (numFormat && !isNaN(value)) {
          value = Number(value);
          return numFormat == "." ? value.toFixed(num) : numberFunctions.lead(value, num);
        }
        return value;
      });
    },
    formatter: function(formatString) {
      formatString = String(formatString);
      if (hasOwnProperty.call(stringFormatCache, formatString)) return stringFormatCache[formatString];
      var formatter = function(value) {
        return stringFunctions.format(formatString, value);
      };
      var escapsedFormatString = '"' + formatString.replace(/"/g, '\\"') + '"';
      formatter = (new Function("stringFunctions", "return " + formatter.toString().replace("formatString", escapsedFormatString)))(stringFunctions);
      formatter.toString = function() {
        return "basis.string.formatter(" + escapsedFormatString + ")";
      };
      stringFormatCache[formatString] = formatter;
      return formatter;
    },
    capitalize: function(this_) {
      return this_.charAt(0).toUpperCase() + this_.substr(1).toLowerCase();
    },
    camelize: function(this_) {
      return this_.replace(/-(.)/g, function(m, chr) {
        return chr.toUpperCase();
      });
    },
    dasherize: function(this_) {
      return this_.replace(/[A-Z]/g, function(m) {
        return "-" + m.toLowerCase();
      });
    },
    isEmpty: function(value) {
      return value == null || String(value) == "";
    },
    isNotEmpty: function(value) {
      return value != null && String(value) != "";
    }
  };
  if ("|||".split(/\|/).length + "|||".split(/(\|)/).length != 11) {
    var nativeStringSplit = String.prototype.split;
    String.prototype.split = function(pattern, count) {
      if (!pattern || pattern instanceof RegExp == false || pattern.source == "") return nativeStringSplit.call(this, pattern, count);
      var result = [];
      var pos = 0;
      var match;
      if (!pattern.global) pattern = new RegExp(pattern.source, /\/([mi]*)$/.exec(pattern)[1] + "g");
      while (match = pattern.exec(this)) {
        match[0] = this.substring(pos, match.index);
        result.push.apply(result, match);
        pos = pattern.lastIndex;
      }
      result.push(this.substr(pos));
      return result;
    };
  }
  if ("12".substr(-1) != "2") {
    var nativeStringSubstr = String.prototype.substr;
    String.prototype.substr = function(start, end) {
      return nativeStringSubstr.call(this, start < 0 ? Math.max(0, this.length + start) : start, end);
    };
  }
  var numberFunctions = {
    fit: function(this_, min, max) {
      if (!isNaN(min) && this_ < min) return Number(min);
      if (!isNaN(max) && this_ > max) return Number(max);
      return this_;
    },
    lead: function(this_, len, leadChar) {
      return String(this_).replace(/\d+/, function(number) {
        return (len -= number.length - 1) > 1 ? (new Array(len)).join(leadChar || 0) + number : number;
      });
    },
    group: function(this_, len, splitter) {
      return String(this_).replace(/\d+/, function(number) {
        return number.replace(/\d/g, function(m, pos) {
          return !pos + (number.length - pos) % (len || 3) ? m : (splitter || " ") + m;
        });
      });
    },
    format: function(this_, prec, gs, prefix, postfix, comma) {
      var res = this_.toFixed(prec);
      if (gs || comma) res = res.replace(/(\d+)(\.?)/, function(m, number, c) {
        return (gs ? basis.number.group(Number(number), 3, gs) : number) + (c ? comma || c : "");
      });
      if (prefix) res = res.replace(/^-?/, "$&" + (prefix || ""));
      return res + (postfix || "");
    }
  };
  complete(Date, {
    now: function() {
      return Number(new Date);
    }
  });
  var ready = function() {
    var eventFired = !document || document.readyState == "complete";
    var readyHandlers = [];
    var timer;
    function processReadyHandler() {
      var handler;
      if (timer) timer = clearImmediate(timer);
      if (readyHandlers.length > 1) timer = setImmediate(processReadyHandler);
      while (handler = readyHandlers.shift()) handler[0].call(handler[1]);
      timer = clearImmediate(timer);
      asap.process();
    }
    function fireHandlers() {
      if (!(eventFired++)) processReadyHandler();
    }
    function doScrollCheck() {
      try {
        document.documentElement.doScroll("left");
        fireHandlers();
      } catch (e) {
        setTimeout(doScrollCheck, 1);
      }
    }
    if (!eventFired) {
      if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", fireHandlers, false);
        global.addEventListener("load", fireHandlers, false);
      } else {
        document.attachEvent("onreadystatechange", fireHandlers);
        global.attachEvent("onload", fireHandlers);
        try {
          if (!global.frameElement && document.documentElement.doScroll) doScrollCheck();
        } catch (e) {}
      }
    }
    return function(callback, context) {
      if (!readyHandlers.length && eventFired && !timer) timer = setImmediate(processReadyHandler);
      readyHandlers.push([ callback, context ]);
    };
  }();
  var teardown = function() {
    if ("addEventListener" in global) return function(callback, context) {
      global.addEventListener("unload", function(event) {
        callback.call(context || null, event || global.event);
      }, false);
    };
    if ("attachEvent" in global) return function(callback, context) {
      global.attachEvent("onunload", function(event) {
        callback.call(context || null, event || global.event);
      });
    };
    return $undef;
  }();
  var documentInterface = function() {
    var timer;
    var reference = {};
    var callbacks = {
      head: [],
      body: []
    };
    function getParent(name) {
      if (document && !reference[name]) {
        reference[name] = document[name] || document.getElementsByTagName(name)[0];
        if (reference[name]) {
          var items = callbacks[name];
          delete callbacks[name];
          for (var i = 0, cb; cb = items[i]; i++) cb[0].call(cb[1], reference[name]);
        }
      }
      return reference[name];
    }
    function add() {
      var name = this[0];
      var node = this[1];
      var ref = this[2];
      remove(node);
      var parent = getParent(name);
      if (parent) {
        if (ref === true) ref = parent.firstChild;
        if (!ref || ref.parentNode !== parent) ref = null;
        parent.insertBefore(node, ref);
      } else callbacks[name].push([ add, [ name, node, ref ] ]);
    }
    function docReady(name, fn, context) {
      if (callbacks[name]) callbacks[name].push([ fn, context ]); else fn.call(context, reference[name]);
    }
    function remove(node) {
      for (var key in callbacks) {
        var entry = arrayFunctions.search(callbacks[key], node, function(item) {
          return item[1] && item[1][1];
        });
        if (entry) arrayFunctions.remove(callbacks[key], entry);
      }
      if (node && node.parentNode && node.parentNode.nodeType == 1) node.parentNode.removeChild(node);
    }
    function checkParents() {
      if (timer && getParent("head") && getParent("body")) timer = clearInterval(timer);
    }
    if (document && (!getParent("head") || !getParent("body"))) {
      timer = setInterval(checkParents, 5);
      ready(checkParents);
    }
    return {
      head: {
        ready: function(fn, context) {
          docReady("head", fn, context);
        },
        add: function(node, ref) {
          add.call([ "head", node, ref ]);
        }
      },
      body: {
        ready: function(fn, context) {
          docReady("body", fn, context);
        },
        add: function(node, ref) {
          add.call([ "body", node, ref ]);
        }
      },
      remove: remove
    };
  }();
  var cleaner = function() {
    var objects = [];
    function destroy() {
      var logDestroy = arguments[0] === true;
      result.globalDestroy = true;
      result.add = $undef;
      result.remove = $undef;
      var object;
      while (object = objects.pop()) {
        if (typeof object.destroy == "function") {
          try {
            if (logDestroy) consoleMethods.log("destroy", "[" + String(object.className) + "]", object);
            object.destroy();
          } catch (e) {
            consoleMethods.warn(String(object), e);
          }
        } else {
          for (var prop in object) object[prop] = null;
        }
      }
      objects = [];
    }
    if (teardown === $undef) return {
      add: $undef,
      remove: $undef
    };
    teardown(destroy);
    var result = {
      add: function(object) {
        if (object != null) objects.push(object);
      },
      remove: function(object) {
        arrayFunctions.remove(objects, object);
      }
    };
    result.destroy_ = destroy;
    result.objects_ = objects;
    return result;
  }();
  var CssResource = function() {
    var STYLE_APPEND_BUGGY = function() {
      try {
        return !document.createElement("style").appendChild(document.createTextNode(""));
      } catch (e) {
        return true;
      }
    }();
    var baseEl = document && document.createElement("base");
    function setBase(baseURI) {
      baseEl.setAttribute("href", baseURI);
      documentInterface.head.add(baseEl, true);
    }
    function restoreBase() {
      baseEl.setAttribute("href", location.href);
      documentInterface.remove(baseEl);
    }
    function injectStyleToHead() {
      setBase(this.baseURI);
      if (!this.element) {
        this.element = document.createElement("style");
        if (!STYLE_APPEND_BUGGY) this.element.appendChild(document.createTextNode(""));
        this.element.setAttribute("src", this.url);
      }
      documentInterface.head.add(this.element);
      this.syncCssText();
      restoreBase();
    }
    return Class(null, {
      className: "basis.CssResource",
      inUse: 0,
      url: "",
      baseURI: "",
      cssText: undefined,
      element: null,
      init: function(url) {
        this.url = url;
        this.baseURI = pathUtils.dirname(url) + "/";
      },
      updateCssText: function(cssText) {
        if (this.cssText != cssText) {
          this.cssText = cssText;
          if (this.inUse && this.element) {
            setBase(this.baseURI);
            this.syncCssText();
            restoreBase();
          }
        }
      },
      syncCssText: STYLE_APPEND_BUGGY ? function() {
        this.element.styleSheet.cssText = this.cssText;
      } : function() {
        var cssText = this.cssText;
        cssText += "\n/*# sourceURL=" + pathUtils.origin + this.url + " */";
        this.element.firstChild.nodeValue = cssText;
      },
      startUse: function() {
        if (!this.inUse) documentInterface.head.ready(injectStyleToHead, this);
        this.inUse += 1;
      },
      stopUse: function() {
        if (this.inUse) {
          this.inUse -= 1;
          if (!this.inUse && this.element) documentInterface.remove(this.element);
        }
      },
      destroy: function() {
        if (this.element) documentInterface.remove(this.element);
        this.element = null;
        this.cssText = null;
      }
    });
  }();
  var basis = getNamespace("basis").extend({
    filename_: basisFilename,
    processConfig: processConfig,
    version: VERSION,
    NODE_ENV: NODE_ENV,
    config: config,
    createSandbox: function(config) {
      return createBasisInstance(global, basisFilename, complete({
        noConflict: true
      }, config));
    },
    dev: (new Namespace("basis.dev")).extend(consoleMethods).extend({
      warnPropertyAccess: warnPropertyAccess
    }),
    resolveNSFilename: resolveNSFilename,
    patch: patch,
    namespace: getNamespace,
    require: requireNamespace,
    resource: getResource,
    asset: function(path) {
      return resolveResourceFilename(path, null, "basis.asset('{url}')");
    },
    setImmediate: setImmediate,
    clearImmediate: clearImmediate,
    nextTick: function() {
      setImmediate.apply(null, arguments);
    },
    asap: asap,
    FACTORY: FACTORY,
    PROXY: PROXY,
    Class: Class,
    Token: Token,
    DeferredToken: DeferredToken,
    codeFrame: codeFrame,
    ready: ready,
    teardown: teardown,
    cleaner: cleaner,
    genUID: genUID,
    getter: getter,
    console: consoleMethods,
    path: pathUtils,
    doc: documentInterface,
    object: {
      extend: extend,
      complete: complete,
      keys: keys,
      values: values,
      slice: slice,
      splice: splice,
      merge: merge,
      iterate: iterate
    },
    fn: {
      $undefined: $undefined,
      $defined: $defined,
      $isNull: $isNull,
      $isNotNull: $isNotNull,
      $isSame: $isSame,
      $isNotSame: $isNotSame,
      $self: $self,
      $const: $const,
      $false: $false,
      $true: $true,
      $null: $null,
      $undef: $undef,
      getter: getter,
      nullGetter: nullGetter,
      wrapper: wrapper,
      factory: factory,
      isFactory: isFactory,
      lazyInit: lazyInit,
      lazyInitAndRun: lazyInitAndRun,
      runOnce: runOnce,
      publicCallback: publicCallback
    },
    array: extend(arrayFrom, arrayFunctions),
    string: stringFunctions,
    number: numberFunctions,
    bool: {
      invert: function(value) {
        return !value;
      }
    },
    json: {
      parse: typeof JSON != "undefined" ? JSON.parse : function(str) {
        return stringFunctions.toObject(str, true);
      }
    }
  });
  if (config.autoload && !NODE_ENV) config.autoload.forEach(function(name) {
    requireNamespace(name);
  });
  if (NODE_ENV && exports) exports.basis = basis;
  return basis;
})(this);
}).call(this);