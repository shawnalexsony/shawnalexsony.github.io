function animateScrollTo(t) {
    "use strict";
    var e = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
        n = {
            speed: 500,
            minDuration: 250,
            maxDuration: 3e3,
            cancelOnUserAction: !0
        },
        i = {};
    Object.keys(n).forEach(function(t) {
        i[t] = e[t] ? e[t] : n[t]
    });
    var r = window.scrollY || document.documentElement.scrollTop,
        s = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - window.innerHeight;
    t > s && (t = s);
    var o = t - r;
    if (0 !== o) {
        var a = Math.abs(Math.round(o / 1e3 * i.speed));
        a < i.minDuration ? a = i.minDuration : a > i.maxDuration && (a = i.maxDuration);
        var h = Date.now(),
            l = null,
            u = null;
        i.cancelOnUserAction ? (u = function(t) {
            cancelAnimationFrame(l)
        }, window.addEventListener("keydown", u)) : (u = function(t) {
            t.preventDefault()
        }, window.addEventListener("scroll", u)), window.addEventListener("wheel", u), window.addEventListener("touchstart", u);
        var c = function e() {
            var n = Date.now() - h,
                s = n / a - 1,
                c = s * s * s + 1,
                d = Math.round(r + o * c);
            n < a && d !== t ? (window.scrollTo(0, d), l = requestAnimationFrame(e)) : (window.scrollTo(0, t), cancelAnimationFrame(l), window.removeEventListener("wheel", u), window.removeEventListener("touchstart", u), i.cancelOnUserAction ? window.removeEventListener("keydown", u) : window.removeEventListener("scroll", u))
        };
        l = requestAnimationFrame(c)
    }
}! function(t) {
    "use strict";

    function e(t) {
        return new RegExp("(^|\\s+)" + t + "(\\s+|$)")
    }

    function n(t, e) {
        (i(t, e) ? s : r)(t, e)
    }
    var i, r, s;
    "classList" in document.documentElement ? (i = function(t, e) {
        return t.classList.contains(e)
    }, r = function(t, e) {
        t.classList.add(e)
    }, s = function(t, e) {
        t.classList.remove(e)
    }) : (i = function(t, n) {
        return e(n).test(t.className)
    }, r = function(t, e) {
        i(t, e) || (t.className = t.className + " " + e)
    }, s = function(t, n) {
        t.className = t.className.replace(e(n), " ")
    });
    var o = {
        hasClass: i,
        addClass: r,
        removeClass: s,
        toggleClass: n,
        has: i,
        add: r,
        remove: s,
        toggle: n
    };
    "function" == typeof define && define.amd ? define(o) : "object" == typeof exports ? module.exports = o : t.classie = o
}(window),
function() {
    "use strict";

    function t(i) {
        if (!i) throw new Error("No options passed to Waypoint constructor");
        if (!i.element) throw new Error("No element option passed to Waypoint constructor");
        if (!i.handler) throw new Error("No handler option passed to Waypoint constructor");
        this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, i), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = i.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({
            name: this.options.group,
            axis: this.axis
        }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), n[this.key] = this, e += 1
    }
    var e = 0,
        n = {};
    t.prototype.queueTrigger = function(t) {
        this.group.queueTrigger(this, t)
    }, t.prototype.trigger = function(t) {
        this.enabled && this.callback && this.callback.apply(this, t)
    }, t.prototype.destroy = function() {
        this.context.remove(this), this.group.remove(this), delete n[this.key]
    }, t.prototype.disable = function() {
        return this.enabled = !1, this
    }, t.prototype.enable = function() {
        return this.context.refresh(), this.enabled = !0, this
    }, t.prototype.next = function() {
        return this.group.next(this)
    }, t.prototype.previous = function() {
        return this.group.previous(this)
    }, t.invokeAll = function(t) {
        var e = [];
        for (var i in n) e.push(n[i]);
        for (var r = 0, s = e.length; r < s; r++) e[r][t]()
    }, t.destroyAll = function() {
        t.invokeAll("destroy")
    }, t.disableAll = function() {
        t.invokeAll("disable")
    }, t.enableAll = function() {
        t.Context.refreshAll();
        for (var e in n) n[e].enabled = !0;
        return this
    }, t.refreshAll = function() {
        t.Context.refreshAll()
    }, t.viewportHeight = function() {
        return window.innerHeight || document.documentElement.clientHeight
    }, t.viewportWidth = function() {
        return document.documentElement.clientWidth
    }, t.adapters = [], t.defaults = {
        context: window,
        continuous: !0,
        enabled: !0,
        group: "default",
        horizontal: !1,
        offset: 0
    }, t.offsetAliases = {
        "bottom-in-view": function() {
            return this.context.innerHeight() - this.adapter.outerHeight()
        },
        "right-in-view": function() {
            return this.context.innerWidth() - this.adapter.outerWidth()
        }
    }, window.Waypoint = t
}(),
function() {
    "use strict";

    function t(t) {
        window.setTimeout(t, 1e3 / 60)
    }

    function e(t) {
        this.element = t, this.Adapter = r.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + n, this.didScroll = !1, this.didResize = !1, this.oldScroll = {
            x: this.adapter.scrollLeft(),
            y: this.adapter.scrollTop()
        }, this.waypoints = {
            vertical: {},
            horizontal: {}
        }, t.waypointContextKey = this.key, i[t.waypointContextKey] = this, n += 1, r.windowContext || (r.windowContext = !0, r.windowContext = new e(window)), this.createThrottledScrollHandler(), this.createThrottledResizeHandler()
    }
    var n = 0,
        i = {},
        r = window.Waypoint,
        s = window.onload;
    e.prototype.add = function(t) {
        var e = t.options.horizontal ? "horizontal" : "vertical";
        this.waypoints[e][t.key] = t, this.refresh()
    }, e.prototype.checkEmpty = function() {
        var t = this.Adapter.isEmptyObject(this.waypoints.horizontal),
            e = this.Adapter.isEmptyObject(this.waypoints.vertical),
            n = this.element == this.element.window;
        t && e && !n && (this.adapter.off(".waypoints"), delete i[this.key])
    }, e.prototype.createThrottledResizeHandler = function() {
        function t() {
            e.handleResize(), e.didResize = !1
        }
        var e = this;
        this.adapter.on("resize.waypoints", function() {
            e.didResize || (e.didResize = !0, r.requestAnimationFrame(t))
        })
    }, e.prototype.createThrottledScrollHandler = function() {
        function t() {
            e.handleScroll(), e.didScroll = !1
        }
        var e = this;
        this.adapter.on("scroll.waypoints", function() {
            e.didScroll && !r.isTouch || (e.didScroll = !0, r.requestAnimationFrame(t))
        })
    }, e.prototype.handleResize = function() {
        r.Context.refreshAll()
    }, e.prototype.handleScroll = function() {
        var t = {},
            e = {
                horizontal: {
                    newScroll: this.adapter.scrollLeft(),
                    oldScroll: this.oldScroll.x,
                    forward: "right",
                    backward: "left"
                },
                vertical: {
                    newScroll: this.adapter.scrollTop(),
                    oldScroll: this.oldScroll.y,
                    forward: "down",
                    backward: "up"
                }
            };
        for (var n in e) {
            var i = e[n],
                r = i.newScroll > i.oldScroll,
                s = r ? i.forward : i.backward;
            for (var o in this.waypoints[n]) {
                var a = this.waypoints[n][o];
                if (null !== a.triggerPoint) {
                    var h = i.oldScroll < a.triggerPoint,
                        l = i.newScroll >= a.triggerPoint,
                        u = h && l,
                        c = !h && !l;
                    (u || c) && (a.queueTrigger(s), t[a.group.id] = a.group)
                }
            }
        }
        for (var d in t) t[d].flushTriggers();
        this.oldScroll = {
            x: e.horizontal.newScroll,
            y: e.vertical.newScroll
        }
    }, e.prototype.innerHeight = function() {
        return this.element == this.element.window ? r.viewportHeight() : this.adapter.innerHeight()
    }, e.prototype.remove = function(t) {
        delete this.waypoints[t.axis][t.key], this.checkEmpty()
    }, e.prototype.innerWidth = function() {
        return this.element == this.element.window ? r.viewportWidth() : this.adapter.innerWidth()
    }, e.prototype.destroy = function() {
        var t = [];
        for (var e in this.waypoints)
            for (var n in this.waypoints[e]) t.push(this.waypoints[e][n]);
        for (var i = 0, r = t.length; i < r; i++) t[i].destroy()
    }, e.prototype.refresh = function() {
        var t, e = this.element == this.element.window,
            n = e ? void 0 : this.adapter.offset(),
            i = {};
        this.handleScroll(), t = {
            horizontal: {
                contextOffset: e ? 0 : n.left,
                contextScroll: e ? 0 : this.oldScroll.x,
                contextDimension: this.innerWidth(),
                oldScroll: this.oldScroll.x,
                forward: "right",
                backward: "left",
                offsetProp: "left"
            },
            vertical: {
                contextOffset: e ? 0 : n.top,
                contextScroll: e ? 0 : this.oldScroll.y,
                contextDimension: this.innerHeight(),
                oldScroll: this.oldScroll.y,
                forward: "down",
                backward: "up",
                offsetProp: "top"
            }
        };
        for (var s in t) {
            var o = t[s];
            for (var a in this.waypoints[s]) {
                var h, l, u, c, d, f = this.waypoints[s][a],
                    p = f.options.offset,
                    g = f.triggerPoint,
                    m = 0,
                    v = null == g;
                f.element !== f.element.window && (m = f.adapter.offset()[o.offsetProp]), "function" == typeof p ? p = p.apply(f) : "string" == typeof p && (p = parseFloat(p), f.options.offset.indexOf("%") > -1 && (p = Math.ceil(o.contextDimension * p / 100))), h = o.contextScroll - o.contextOffset, f.triggerPoint = Math.floor(m + h - p), l = g < o.oldScroll, u = f.triggerPoint >= o.oldScroll, c = l && u, d = !l && !u, !v && c ? (f.queueTrigger(o.backward), i[f.group.id] = f.group) : !v && d ? (f.queueTrigger(o.forward), i[f.group.id] = f.group) : v && o.oldScroll >= f.triggerPoint && (f.queueTrigger(o.forward), i[f.group.id] = f.group)
            }
        }
        return r.requestAnimationFrame(function() {
            for (var t in i) i[t].flushTriggers()
        }), this
    }, e.findOrCreateByElement = function(t) {
        return e.findByElement(t) || new e(t)
    }, e.refreshAll = function() {
        for (var t in i) i[t].refresh()
    }, e.findByElement = function(t) {
        return i[t.waypointContextKey]
    }, window.onload = function() {
        s && s(), e.refreshAll()
    }, r.requestAnimationFrame = function(e) {
        (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t).call(window, e)
    }, r.Context = e
}(),
function() {
    "use strict";

    function t(t, e) {
        return t.triggerPoint - e.triggerPoint
    }

    function e(t, e) {
        return e.triggerPoint - t.triggerPoint
    }

    function n(t) {
        this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), i[this.axis][this.name] = this
    }
    var i = {
            vertical: {},
            horizontal: {}
        },
        r = window.Waypoint;
    n.prototype.add = function(t) {
        this.waypoints.push(t)
    }, n.prototype.clearTriggerQueues = function() {
        this.triggerQueues = {
            up: [],
            down: [],
            left: [],
            right: []
        }
    }, n.prototype.flushTriggers = function() {
        for (var n in this.triggerQueues) {
            var i = this.triggerQueues[n],
                r = "up" === n || "left" === n;
            i.sort(r ? e : t);
            for (var s = 0, o = i.length; s < o; s += 1) {
                var a = i[s];
                (a.options.continuous || s === i.length - 1) && a.trigger([n])
            }
        }
        this.clearTriggerQueues()
    }, n.prototype.next = function(e) {
        this.waypoints.sort(t);
        var n = r.Adapter.inArray(e, this.waypoints);
        return n === this.waypoints.length - 1 ? null : this.waypoints[n + 1]
    }, n.prototype.previous = function(e) {
        this.waypoints.sort(t);
        var n = r.Adapter.inArray(e, this.waypoints);
        return n ? this.waypoints[n - 1] : null
    }, n.prototype.queueTrigger = function(t, e) {
        this.triggerQueues[e].push(t)
    }, n.prototype.remove = function(t) {
        var e = r.Adapter.inArray(t, this.waypoints);
        e > -1 && this.waypoints.splice(e, 1)
    }, n.prototype.first = function() {
        return this.waypoints[0]
    }, n.prototype.last = function() {
        return this.waypoints[this.waypoints.length - 1]
    }, n.findOrCreate = function(t) {
        return i[t.axis][t.name] || new n(t)
    }, r.Group = n
}(),
function() {
    "use strict";

    function t(t) {
        return t === t.window
    }

    function e(e) {
        return t(e) ? e : e.defaultView
    }

    function n(t) {
        this.element = t, this.handlers = {}
    }
    var i = window.Waypoint;
    n.prototype.innerHeight = function() {
        return t(this.element) ? this.element.innerHeight : this.element.clientHeight
    }, n.prototype.innerWidth = function() {
        return t(this.element) ? this.element.innerWidth : this.element.clientWidth
    }, n.prototype.off = function(t, e) {
        function n(t, e, n) {
            for (var i = 0, r = e.length - 1; i < r; i++) {
                var s = e[i];
                n && n !== s || t.removeEventListener(s)
            }
        }
        var i = t.split("."),
            r = i[0],
            s = i[1],
            o = this.element;
        if (s && this.handlers[s] && r) n(o, this.handlers[s][r], e), this.handlers[s][r] = [];
        else if (r)
            for (var a in this.handlers) n(o, this.handlers[a][r] || [], e), this.handlers[a][r] = [];
        else if (s && this.handlers[s]) {
            for (var h in this.handlers[s]) n(o, this.handlers[s][h], e);
            this.handlers[s] = {}
        }
    }, n.prototype.offset = function() {
        if (!this.element.ownerDocument) return null;
        var t = this.element.ownerDocument.documentElement,
            n = e(this.element.ownerDocument),
            i = {
                top: 0,
                left: 0
            };
        return this.element.getBoundingClientRect && (i = this.element.getBoundingClientRect()), {
            top: i.top + n.pageYOffset - t.clientTop,
            left: i.left + n.pageXOffset - t.clientLeft
        }
    }, n.prototype.on = function(t, e) {
        var n = t.split("."),
            i = n[0],
            r = n[1] || "__default",
            s = this.handlers[r] = this.handlers[r] || {};
        (s[i] = s[i] || []).push(e), this.element.addEventListener(i, e)
    }, n.prototype.outerHeight = function(e) {
        var n, i = this.innerHeight();
        return e && !t(this.element) && (n = window.getComputedStyle(this.element), i += parseInt(n.marginTop, 10), i += parseInt(n.marginBottom, 10)), i
    }, n.prototype.outerWidth = function(e) {
        var n, i = this.innerWidth();
        return e && !t(this.element) && (n = window.getComputedStyle(this.element), i += parseInt(n.marginLeft, 10), i += parseInt(n.marginRight, 10)), i
    }, n.prototype.scrollLeft = function() {
        var t = e(this.element);
        return t ? t.pageXOffset : this.element.scrollLeft
    }, n.prototype.scrollTop = function() {
        var t = e(this.element);
        return t ? t.pageYOffset : this.element.scrollTop
    }, n.extend = function() {
        for (var t = Array.prototype.slice.call(arguments), e = 1, n = t.length; e < n; e++) ! function(t, e) {
            if ("object" == typeof t && "object" == typeof e)
                for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
        }(t[0], t[e]);
        return t[0]
    }, n.inArray = function(t, e, n) {
        return null == e ? -1 : e.indexOf(t, n)
    }, n.isEmptyObject = function(t) {
        for (var e in t) return !1;
        return !0
    }, i.adapters.push({
        name: "noframework",
        Adapter: n
    }), i.Adapter = n
}();
var paper = function(t, e) {
    t = t || require("./node/self.js");
    var n = t.window,
        i = t.document,
        r = new function() {
            function t(t, e, r, s, o) {
                function l(i, l) {
                    "string" == typeof(l = l || (l = a(e, i)) && (l.get ? l : l.value)) && "#" === l[0] && (l = t[l.substring(1)] || l);
                    var c, d = "function" == typeof l,
                        f = l,
                        p = o || d && !l.base ? l && l.get ? i in t : t[i] : null;
                    o && p || (d && p && (l.base = p), d && !1 !== s && (c = i.match(/^([gs]et|is)(([A-Z])(.*))$/)) && (u[c[3].toLowerCase() + c[4]] = c[2]), f && !d && f.get && "function" == typeof f.get && n.isPlainObject(f) || (f = {
                        value: f,
                        writable: !0
                    }), (a(t, i) || {
                        configurable: !0
                    }).configurable && (f.configurable = !0, f.enumerable = null != r ? r : !c), h(t, i, f))
                }
                var u = {};
                if (e) {
                    for (var c in e) e.hasOwnProperty(c) && !i.test(c) && l(c);
                    for (var c in u) {
                        var d = u[c],
                            f = t["set" + d],
                            p = t["get" + d] || f && t["is" + d];
                        !p || !0 !== s && 0 !== p.length || l(c, {
                            get: p,
                            set: f
                        })
                    }
                }
                return t
            }

            function n() {
                for (var t = 0, e = arguments.length; t < e; t++) {
                    var n = arguments[t];
                    n && c(this, n)
                }
                return this
            }
            var i = /^(statics|enumerable|beans|preserve)$/,
                r = [],
                s = r.slice,
                o = Object.create,
                a = Object.getOwnPropertyDescriptor,
                h = Object.defineProperty,
                l = r.forEach || function(t, e) {
                    for (var n = 0, i = this.length; n < i; n++) t.call(e, this[n], n, this)
                },
                u = function(t, e) {
                    for (var n in this) this.hasOwnProperty(n) && t.call(e, this[n], n, this)
                },
                c = Object.assign || function(t) {
                    for (var e = 1, n = arguments.length; e < n; e++) {
                        var i = arguments[e];
                        for (var r in i) i.hasOwnProperty(r) && (t[r] = i[r])
                    }
                    return t
                },
                d = function(t, e, n) {
                    if (t) {
                        var i = a(t, "length");
                        (i && "number" == typeof i.value ? l : u).call(t, e, n = n || t)
                    }
                    return n
                };
            return t(n, {
                inject: function(e) {
                    if (e) {
                        var n = !0 === e.statics ? e : e.statics,
                            i = e.beans,
                            r = e.preserve;
                        n !== e && t(this.prototype, e, e.enumerable, i, r), t(this, n, null, i, r)
                    }
                    for (var s = 1, o = arguments.length; s < o; s++) this.inject(arguments[s]);
                    return this
                },
                extend: function() {
                    for (var e, n, i, r = this, s = 0, a = arguments.length; s < a && (!e || !n); s++) i = arguments[s], e = e || i.initialize, n = n || i.prototype;
                    return e = e || function() {
                        r.apply(this, arguments)
                    }, n = e.prototype = n || o(this.prototype), h(n, "constructor", {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }), t(e, this), arguments.length && this.inject.apply(e, arguments), e.base = r, e
                }
            }).inject({
                enumerable: !1,
                initialize: n,
                set: n,
                inject: function() {
                    for (var e = 0, n = arguments.length; e < n; e++) {
                        var i = arguments[e];
                        i && t(this, i, i.enumerable, i.beans, i.preserve)
                    }
                    return this
                },
                extend: function() {
                    var t = o(this);
                    return t.inject.apply(t, arguments)
                },
                each: function(t, e) {
                    return d(this, t, e)
                },
                clone: function() {
                    return new this.constructor(this)
                },
                statics: {
                    set: c,
                    each: d,
                    create: o,
                    define: h,
                    describe: a,
                    clone: function(t) {
                        return c(new t.constructor, t)
                    },
                    isPlainObject: function(t) {
                        var e = null != t && t.constructor;
                        return e && (e === Object || e === n || "Object" === e.name)
                    },
                    pick: function(t, n) {
                        return t !== e ? t : n
                    },
                    slice: function(t, e, n) {
                        return s.call(t, e, n)
                    }
                }
            })
        };
    "undefined" != typeof module && (module.exports = r), r.inject({
        enumerable: !1,
        toString: function() {
            return null != this._id ? (this._class || "Object") + (this._name ? " '" + this._name + "'" : " @" + this._id) : "{ " + r.each(this, function(t, e) {
                if (!/^_/.test(e)) {
                    var n = typeof t;
                    this.push(e + ": " + ("number" === n ? h.instance.number(t) : "string" === n ? "'" + t + "'" : t))
                }
            }, []).join(", ") + " }"
        },
        getClassName: function() {
            return this._class || ""
        },
        importJSON: function(t) {
            return r.importJSON(t, this)
        },
        exportJSON: function(t) {
            return r.exportJSON(this, t)
        },
        toJSON: function() {
            return r.serialize(this)
        },
        set: function(t, e) {
            return t && r.filter(this, t, e, this._prioritize), this
        }
    }, {
        beans: !1,
        statics: {
            exports: {},
            extend: function t() {
                var e = t.base.apply(this, arguments),
                    n = e.prototype._class;
                return n && !r.exports[n] && (r.exports[n] = e), e
            },
            equals: function(t, e) {
                if (t === e) return !0;
                if (t && t.equals) return t.equals(e);
                if (e && e.equals) return e.equals(t);
                if (t && e && "object" == typeof t && "object" == typeof e) {
                    if (Array.isArray(t) && Array.isArray(e)) {
                        var n = t.length;
                        if (n !== e.length) return !1;
                        for (; n--;)
                            if (!r.equals(t[n], e[n])) return !1
                    } else {
                        var i = Object.keys(t),
                            n = i.length;
                        if (n !== Object.keys(e).length) return !1;
                        for (; n--;) {
                            var s = i[n];
                            if (!e.hasOwnProperty(s) || !r.equals(t[s], e[s])) return !1
                        }
                    }
                    return !0
                }
                return !1
            },
            read: function(t, n, i, s) {
                if (this === r) {
                    var o = this.peek(t, n);
                    return t.__index++, o
                }
                var a = this.prototype,
                    h = a._readIndex,
                    l = n || h && t.__index || 0,
                    u = t.length,
                    c = t[l];
                if (s = s || u - l, c instanceof this || i && i.readNull && null == c && s <= 1) return h && (t.__index = l + 1), c && i && i.clone ? c.clone() : c;
                if (c = r.create(a), h && (c.__read = !0), c = c.initialize.apply(c, l > 0 || l + s < u ? r.slice(t, l, l + s) : t) || c, h) {
                    t.__index = l + c.__read;
                    var d = c.__filtered;
                    d && (t.__filtered = d, c.__filtered = e), c.__read = e
                }
                return c
            },
            peek: function(t, e) {
                return t[t.__index = e || t.__index || 0]
            },
            remain: function(t) {
                return t.length - (t.__index || 0)
            },
            readList: function(t, e, n, i) {
                for (var r, s = [], o = e || 0, a = i ? o + i : t.length, h = o; h < a; h++) s.push(Array.isArray(r = t[h]) ? this.read(r, 0, n) : this.read(t, h, n, 1));
                return s
            },
            readNamed: function(t, n, i, s, o) {
                var a = this.getNamed(t, n),
                    h = a !== e;
                if (h) {
                    var l = t.__filtered;
                    l || (l = t.__filtered = r.create(t[0]), l.__unfiltered = t[0]), l[n] = e
                }
                var u = h ? [a] : t;
                return this.read(u, i, s, o)
            },
            getNamed: function(t, n) {
                var i = t[0];
                if (t._hasObject === e && (t._hasObject = 1 === t.length && r.isPlainObject(i)), t._hasObject) return n ? i[n] : t.__filtered || i
            },
            hasNamed: function(t, e) {
                return !!this.getNamed(t, e)
            },
            filter: function(t, n, i, r) {
                function s(r) {
                    if (!(i && r in i || o && r in o)) {
                        var s = n[r];
                        s !== e && (t[r] = s)
                    }
                }
                var o;
                if (r) {
                    for (var a, h = {}, l = 0, u = r.length; l < u; l++)(a = r[l]) in n && (s(a), h[a] = !0);
                    o = h
                }
                return Object.keys(n.__unfiltered || n).forEach(s), t
            },
            isPlainValue: function(t, e) {
                return r.isPlainObject(t) || Array.isArray(t) || e && "string" == typeof t
            },
            serialize: function(t, e, n, i) {
                e = e || {};
                var s, o = !i;
                if (o && (e.formatter = new h(e.precision), i = {
                        length: 0,
                        definitions: {},
                        references: {},
                        add: function(t, e) {
                            var n = "#" + t._id,
                                i = this.references[n];
                            if (!i) {
                                this.length++;
                                var r = e.call(t),
                                    s = t._class;
                                s && r[0] !== s && r.unshift(s), this.definitions[n] = r, i = this.references[n] = [n]
                            }
                            return i
                        }
                    }), t && t._serialize) {
                    s = t._serialize(e, i);
                    var a = t._class;
                    !a || t._compactSerialize || !o && n || s[0] === a || s.unshift(a)
                } else if (Array.isArray(t)) {
                    s = [];
                    for (var l = 0, u = t.length; l < u; l++) s[l] = r.serialize(t[l], e, n, i)
                } else if (r.isPlainObject(t)) {
                    s = {};
                    for (var c = Object.keys(t), l = 0, u = c.length; l < u; l++) {
                        var d = c[l];
                        s[d] = r.serialize(t[d], e, n, i)
                    }
                } else s = "number" == typeof t ? e.formatter.number(t, e.precision) : t;
                return o && i.length > 0 ? [
                    ["dictionary", i.definitions], s
                ] : s
            },
            deserialize: function(t, e, n, i, s) {
                var o = t,
                    a = !n,
                    h = a && t && t.length && "dictionary" === t[0][0];
                if (n = n || {}, Array.isArray(t)) {
                    var l = t[0],
                        u = "dictionary" === l;
                    if (1 == t.length && /^#/.test(l)) return n.dictionary[l];
                    l = r.exports[l], o = [];
                    for (var c = l ? 1 : 0, d = t.length; c < d; c++) o.push(r.deserialize(t[c], e, n, u, h));
                    if (l) {
                        var f = o;
                        e ? o = e(l, f, a || s) : (o = r.create(l.prototype), l.apply(o, f))
                    }
                } else if (r.isPlainObject(t)) {
                    o = {}, i && (n.dictionary = o);
                    for (var p in t) o[p] = r.deserialize(t[p], e, n)
                }
                return h ? o[1] : o
            },
            exportJSON: function(t, e) {
                var n = r.serialize(t, e);
                return e && 0 == e.asString ? n : JSON.stringify(n)
            },
            importJSON: function(t, e) {
                return r.deserialize("string" == typeof t ? JSON.parse(t) : t, function(t, n, i) {
                    var s = i && e && e.constructor === t,
                        o = s ? e : r.create(t.prototype);
                    if (1 === n.length && o instanceof w && (s || !(o instanceof b))) {
                        var a = n[0];
                        r.isPlainObject(a) && (a.insert = !1)
                    }
                    return (s ? o.set : t).apply(o, n), s && (e = null), o
                })
            },
            splice: function(t, n, i, r) {
                var s = n && n.length,
                    o = i === e;
                (i = o ? t.length : i) > t.length && (i = t.length);
                for (var a = 0; a < s; a++) n[a]._index = i + a;
                if (o) return t.push.apply(t, n), [];
                var h = [i, r];
                n && h.push.apply(h, n);
                for (var l = t.splice.apply(t, h), a = 0, u = l.length; a < u; a++) l[a]._index = e;
                for (var a = i + s, u = t.length; a < u; a++) t[a]._index = a;
                return l
            },
            capitalize: function(t) {
                return t.replace(/\b[a-z]/g, function(t) {
                    return t.toUpperCase()
                })
            },
            camelize: function(t) {
                return t.replace(/-(.)/g, function(t, e) {
                    return e.toUpperCase()
                })
            },
            hyphenate: function(t) {
                return t.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
            }
        }
    });
    var s = {
            on: function(t, e) {
                if ("string" != typeof t) r.each(t, function(t, e) {
                    this.on(e, t)
                }, this);
                else {
                    var n = this._eventTypes,
                        i = n && n[t],
                        s = this._callbacks = this._callbacks || {};
                    s = s[t] = s[t] || [], -1 === s.indexOf(e) && (s.push(e), i && i.install && 1 === s.length && i.install.call(this, t))
                }
                return this
            },
            off: function(t, e) {
                if ("string" != typeof t) return void r.each(t, function(t, e) {
                    this.off(e, t)
                }, this);
                var n, i = this._eventTypes,
                    s = i && i[t],
                    o = this._callbacks && this._callbacks[t];
                return o && (!e || -1 !== (n = o.indexOf(e)) && 1 === o.length ? (s && s.uninstall && s.uninstall.call(this, t), delete this._callbacks[t]) : -1 !== n && o.splice(n, 1)), this
            },
            once: function(t, e) {
                return this.on(t, function() {
                    e.apply(this, arguments), this.off(t, e)
                })
            },
            emit: function(t, e) {
                var n = this._callbacks && this._callbacks[t];
                if (!n) return !1;
                var i = r.slice(arguments, 1),
                    s = e && e.target && !e.currentTarget;
                n = n.slice(), s && (e.currentTarget = this);
                for (var o = 0, a = n.length; o < a; o++)
                    if (0 == n[o].apply(this, i)) {
                        e && e.stop && e.stop();
                        break
                    }
                return s && delete e.currentTarget, !0
            },
            responds: function(t) {
                return !(!this._callbacks || !this._callbacks[t])
            },
            attach: "#on",
            detach: "#off",
            fire: "#emit",
            _installEvents: function(t) {
                var e = this._eventTypes,
                    n = this._callbacks,
                    i = t ? "install" : "uninstall";
                if (e)
                    for (var r in n)
                        if (n[r].length > 0) {
                            var s = e[r],
                                o = s && s[i];
                            o && o.call(this, r)
                        }
            },
            statics: {
                inject: function t(e) {
                    var n = e._events;
                    if (n) {
                        var i = {};
                        r.each(n, function(t, n) {
                            var s = "string" == typeof t,
                                o = s ? t : n,
                                a = r.capitalize(o),
                                h = o.substring(2).toLowerCase();
                            i[h] = s ? {} : t, o = "_" + o, e["get" + a] = function() {
                                return this[o]
                            }, e["set" + a] = function(t) {
                                var e = this[o];
                                e && this.off(h, e), t && this.on(h, t), this[o] = t
                            }
                        }), e._eventTypes = i
                    }
                    return t.base.apply(this, arguments)
                }
            }
        },
        o = r.extend({
            _class: "PaperScope",
            initialize: function e() {
                paper = this, this.settings = new r({
                    applyMatrix: !0,
                    insertItems: !0,
                    handleSize: 4,
                    hitTolerance: 0
                }), this.project = null, this.projects = [], this.tools = [], this._id = e._id++, e._scopes[this._id] = this;
                var n = e.prototype;
                if (!this.support) {
                    var i = tt.getContext(1, 1) || {};
                    n.support = {
                        nativeDash: "setLineDash" in i || "mozDash" in i,
                        nativeBlendModes: et.nativeModes
                    }, tt.release(i)
                }
                if (!this.agent) {
                    var s = t.navigator.userAgent.toLowerCase(),
                        o = (/(darwin|win|mac|linux|freebsd|sunos)/.exec(s) || [])[0],
                        a = "darwin" === o ? "mac" : o,
                        h = n.agent = n.browser = {
                            platform: a
                        };
                    a && (h[a] = !0), s.replace(/(opera|chrome|safari|webkit|firefox|msie|trident|atom|node)\/?\s*([.\d]+)(?:.*version\/([.\d]+))?(?:.*rv\:v?([.\d]+))?/g, function(t, e, n, i, r) {
                        if (!h.chrome) {
                            var s = "opera" === e ? i : /^(node|trident)$/.test(e) ? r : n;
                            h.version = s, h.versionNumber = parseFloat(s), e = "trident" === e ? "msie" : e, h.name = e, h[e] = !0
                        }
                    }), h.chrome && delete h.webkit, h.atom && delete h.chrome
                }
            },
            version: "0.11.5",
            getView: function() {
                var t = this.project;
                return t && t._view
            },
            getPaper: function() {
                return this
            },
            execute: function(t, e) {
                paper.PaperScript.execute(t, this, e), U.updateFocus()
            },
            install: function(t) {
                var e = this;
                r.each(["project", "view", "tool"], function(n) {
                    r.define(t, n, {
                        configurable: !0,
                        get: function() {
                            return e[n]
                        }
                    })
                });
                for (var n in this) !/^_/.test(n) && this[n] && (t[n] = this[n])
            },
            setup: function(t) {
                return paper = this, this.project = new y(t), this
            },
            createCanvas: function(t, e) {
                return tt.getCanvas(t, e)
            },
            activate: function() {
                paper = this
            },
            clear: function() {
                for (var t = this.projects, e = this.tools, n = t.length - 1; n >= 0; n--) t[n].remove();
                for (var n = e.length - 1; n >= 0; n--) e[n].remove()
            },
            remove: function() {
                this.clear(), delete o._scopes[this._id]
            },
            statics: new function() {
                function t(t) {
                    return t += "Attribute",
                        function(e, n) {
                            return e[t](n) || e[t]("data-paper-" + n)
                        }
                }
                return {
                    _scopes: {},
                    _id: 0,
                    get: function(t) {
                        return this._scopes[t] || null
                    },
                    getAttribute: t("get"),
                    hasAttribute: t("has")
                }
            }
        }),
        a = r.extend(s, {
            initialize: function(t) {
                this._scope = paper, this._index = this._scope[this._list].push(this) - 1, !t && this._scope[this._reference] || this.activate()
            },
            activate: function() {
                if (!this._scope) return !1;
                var t = this._scope[this._reference];
                return t && t !== this && t.emit("deactivate"), this._scope[this._reference] = this, this.emit("activate", t), !0
            },
            isActive: function() {
                return this._scope[this._reference] === this
            },
            remove: function() {
                return null != this._index && (r.splice(this._scope[this._list], null, this._index, 1), this._scope[this._reference] == this && (this._scope[this._reference] = null), this._scope = null, !0)
            },
            getView: function() {
                return this._scope.getView()
            }
        }),
        h = r.extend({
            initialize: function(t) {
                this.precision = r.pick(t, 5), this.multiplier = Math.pow(10, this.precision)
            },
            number: function(t) {
                return this.precision < 16 ? Math.round(t * this.multiplier) / this.multiplier : t
            },
            pair: function(t, e, n) {
                return this.number(t) + (n || ",") + this.number(e)
            },
            point: function(t, e) {
                return this.number(t.x) + (e || ",") + this.number(t.y)
            },
            size: function(t, e) {
                return this.number(t.width) + (e || ",") + this.number(t.height)
            },
            rectangle: function(t, e) {
                return this.point(t, e) + (e || ",") + this.size(t, e)
            }
        });
    h.instance = new h;
    var l = new function() {
            function t(t, e, n) {
                return t < e ? e : t > n ? n : t
            }

            function e(t, e, n) {
                function i(t) {
                    var e = 134217729 * t,
                        n = t - e,
                        i = n + e;
                    return [i, t - i]
                }
                var r = e * e - t * n,
                    o = e * e + t * n;
                if (3 * s(r) < o) {
                    var a = i(t),
                        h = i(e),
                        l = i(n),
                        u = e * e,
                        c = h[0] * h[0] - u + 2 * h[0] * h[1] + h[1] * h[1],
                        d = t * n;
                    r = u - d + (c - (a[0] * l[0] - d + a[0] * l[1] + a[1] * l[0] + a[1] * l[1]))
                }
                return r
            }

            function n() {
                var t = Math.max.apply(Math, arguments);
                return t && (t < 1e-8 || t > 1e8) ? a(2, -Math.round(h(t))) : 0
            }
            var i = [
                    [.5773502691896257],
                    [0, .7745966692414834],
                    [.33998104358485626, .8611363115940526],
                    [0, .5384693101056831, .906179845938664],
                    [.2386191860831969, .6612093864662645, .932469514203152],
                    [0, .4058451513773972, .7415311855993945, .9491079123427585],
                    [.1834346424956498, .525532409916329, .7966664774136267, .9602898564975363],
                    [0, .3242534234038089, .6133714327005904, .8360311073266358, .9681602395076261],
                    [.14887433898163122, .4333953941292472, .6794095682990244, .8650633666889845, .9739065285171717],
                    [0, .26954315595234496, .5190961292068118, .7301520055740494, .8870625997680953, .978228658146057],
                    [.1252334085114689, .3678314989981802, .5873179542866175, .7699026741943047, .9041172563704749, .9815606342467192],
                    [0, .2304583159551348, .44849275103644687, .6423493394403402, .8015780907333099, .9175983992229779, .9841830547185881],
                    [.10805494870734367, .31911236892788974, .5152486363581541, .6872929048116855, .827201315069765, .9284348836635735, .9862838086968123],
                    [0, .20119409399743451, .3941513470775634, .5709721726085388, .7244177313601701, .8482065834104272, .937273392400706, .9879925180204854],
                    [.09501250983763744, .2816035507792589, .45801677765722737, .6178762444026438, .755404408355003, .8656312023878318, .9445750230732326, .9894009349916499]
                ],
                r = [
                    [1],
                    [.8888888888888888, .5555555555555556],
                    [.6521451548625461, .34785484513745385],
                    [.5688888888888889, .47862867049936647, .23692688505618908],
                    [.46791393457269104, .3607615730481386, .17132449237917036],
                    [.4179591836734694, .3818300505051189, .27970539148927664, .1294849661688697],
                    [.362683783378362, .31370664587788727, .22238103445337448, .10122853629037626],
                    [.3302393550012598, .31234707704000286, .26061069640293544, .1806481606948574, .08127438836157441],
                    [.29552422471475287, .26926671930999635, .21908636251598204, .1494513491505806, .06667134430868814],
                    [.2729250867779006, .26280454451024665, .23319376459199048, .18629021092773426, .1255803694649046, .05566856711617366],
                    [.24914704581340277, .2334925365383548, .20316742672306592, .16007832854334622, .10693932599531843, .04717533638651183],
                    [.2325515532308739, .22628318026289723, .2078160475368885, .17814598076194574, .13887351021978725, .09212149983772845, .04048400476531588],
                    [.2152638534631578, .2051984637212956, .18553839747793782, .15720316715819355, .12151857068790319, .08015808715976021, .03511946033175186],
                    [.2025782419255613, .19843148532711158, .1861610000155622, .16626920581699392, .13957067792615432, .10715922046717194, .07036604748810812, .03075324199611727],
                    [.1894506104550685, .18260341504492358, .16915651939500254, .14959598881657674, .12462897125553388, .09515851168249279, .062253523938647894, .027152459411754096]
                ],
                s = Math.abs,
                o = Math.sqrt,
                a = Math.pow,
                h = Math.log2 || function(t) {
                    return Math.log(t) * Math.LOG2E
                };
            return {
                EPSILON: 1e-12,
                MACHINE_EPSILON: 1.12e-16,
                CURVETIME_EPSILON: 1e-8,
                GEOMETRIC_EPSILON: 1e-7,
                TRIGONOMETRIC_EPSILON: 1e-8,
                KAPPA: 4 * (o(2) - 1) / 3,
                isZero: function(t) {
                    return t >= -1e-12 && t <= 1e-12
                },
                clamp: t,
                integrate: function(t, e, n, s) {
                    for (var o = i[s - 2], a = r[s - 2], h = .5 * (n - e), l = h + e, u = 0, c = s + 1 >> 1, d = 1 & s ? a[u++] * t(l) : 0; u < c;) {
                        var f = h * o[u];
                        d += a[u++] * (t(l + f) + t(l - f))
                    }
                    return h * d
                },
                findRoot: function(e, n, i, r, o, a, h) {
                    for (var l = 0; l < a; l++) {
                        var u = e(i),
                            c = u / n(i),
                            d = i - c;
                        if (s(c) < h) {
                            i = d;
                            break
                        }
                        u > 0 ? (o = i, i = d <= r ? .5 * (r + o) : d) : (r = i, i = d >= o ? .5 * (r + o) : d)
                    }
                    return t(i, r, o)
                },
                solveQuadratic: function(i, r, a, h, l, u) {
                    var c, d = 1 / 0;
                    if (s(i) < 1e-12) {
                        if (s(r) < 1e-12) return s(a) < 1e-12 ? -1 : 0;
                        c = -a / r
                    } else {
                        r *= -.5;
                        var f = e(i, r, a);
                        if (f && s(f) < 1.12e-16) {
                            var p = n(s(i), s(r), s(a));
                            p && (i *= p, r *= p, a *= p, f = e(i, r, a))
                        }
                        if (f >= -1.12e-16) {
                            var g = f < 0 ? 0 : o(f),
                                m = r + (r < 0 ? -g : g);
                            0 === m ? (c = a / i, d = -c) : (c = m / i, d = a / m)
                        }
                    }
                    var v = 0,
                        _ = null == l,
                        y = l - 1e-12,
                        w = u + 1e-12;
                    return isFinite(c) && (_ || c > y && c < w) && (h[v++] = _ ? c : t(c, l, u)), d !== c && isFinite(d) && (_ || d > y && d < w) && (h[v++] = _ ? d : t(d, l, u)), v
                },
                solveCubic: function(e, i, r, h, u, c, d) {
                    function f(t) {
                        p = t;
                        var n = e * p;
                        g = n + i, m = g * p + r, v = (n + g) * p + m, _ = m * p + h
                    }
                    var p, g, m, v, _, y = n(s(e), s(i), s(r), s(h));
                    if (y && (e *= y, i *= y, r *= y, h *= y), s(e) < 1e-12) e = i, g = r, m = h, p = 1 / 0;
                    else if (s(h) < 1e-12) g = i, m = r, p = 0;
                    else {
                        f(-i / e / 3);
                        var w = _ / e,
                            x = a(s(w), 1 / 3),
                            b = w < 0 ? -1 : 1,
                            C = -v / e,
                            S = C > 0 ? 1.324717957244746 * Math.max(x, o(C)) : x,
                            T = p - b * S;
                        if (T !== p) {
                            do {
                                f(T), T = 0 === v ? p : p - _ / v / (1 + 1.12e-16)
                            } while (b * T > b * p);
                            s(e) * p * p > s(h / p) && (m = -h / p, g = (m - r) / p)
                        }
                    }
                    var E = l.solveQuadratic(e, g, m, u, c, d),
                        P = null == c;
                    return isFinite(p) && (0 === E || E > 0 && p !== u[0] && p !== u[1]) && (P || p > c - 1e-12 && p < d + 1e-12) && (u[E++] = P ? p : t(p, c, d)), E
                }
            }
        },
        u = {
            _id: 1,
            _pools: {},
            get: function(t) {
                if (t) {
                    var e = this._pools[t];
                    return e || (e = this._pools[t] = {
                        _id: 1
                    }), e._id++
                }
                return this._id++
            }
        },
        c = r.extend({
            _class: "Point",
            _readIndex: !0,
            initialize: function(t, e) {
                var n = typeof t,
                    i = this.__read,
                    r = 0;
                if ("number" === n) {
                    var s = "number" == typeof e;
                    this._set(t, s ? e : t), i && (r = s ? 2 : 1)
                } else if ("undefined" === n || null === t) this._set(0, 0), i && (r = null === t ? 1 : 0);
                else {
                    var o = "string" === n ? t.split(/[\s,]+/) || [] : t;
                    r = 1, Array.isArray(o) ? this._set(+o[0], +(o.length > 1 ? o[1] : o[0])) : "x" in o ? this._set(o.x || 0, o.y || 0) : "width" in o ? this._set(o.width || 0, o.height || 0) : "angle" in o ? (this._set(o.length || 0, 0), this.setAngle(o.angle || 0)) : (this._set(0, 0), r = 0)
                }
                return i && (this.__read = r), this
            },
            set: "#initialize",
            _set: function(t, e) {
                return this.x = t, this.y = e, this
            },
            equals: function(t) {
                return this === t || t && (this.x === t.x && this.y === t.y || Array.isArray(t) && this.x === t[0] && this.y === t[1]) || !1
            },
            clone: function() {
                return new c(this.x, this.y)
            },
            toString: function() {
                var t = h.instance;
                return "{ x: " + t.number(this.x) + ", y: " + t.number(this.y) + " }"
            },
            _serialize: function(t) {
                var e = t.formatter;
                return [e.number(this.x), e.number(this.y)]
            },
            getLength: function() {
                return Math.sqrt(this.x * this.x + this.y * this.y)
            },
            setLength: function(t) {
                if (this.isZero()) {
                    var e = this._angle || 0;
                    this._set(Math.cos(e) * t, Math.sin(e) * t)
                } else {
                    var n = t / this.getLength();
                    l.isZero(n) && this.getAngle(), this._set(this.x * n, this.y * n)
                }
            },
            getAngle: function() {
                return 180 * this.getAngleInRadians.apply(this, arguments) / Math.PI
            },
            setAngle: function(t) {
                this.setAngleInRadians.call(this, t * Math.PI / 180)
            },
            getAngleInDegrees: "#getAngle",
            setAngleInDegrees: "#setAngle",
            getAngleInRadians: function() {
                if (arguments.length) {
                    var t = c.read(arguments),
                        e = this.getLength() * t.getLength();
                    if (l.isZero(e)) return NaN;
                    var n = this.dot(t) / e;
                    return Math.acos(n < -1 ? -1 : n > 1 ? 1 : n)
                }
                return this.isZero() ? this._angle || 0 : this._angle = Math.atan2(this.y, this.x)
            },
            setAngleInRadians: function(t) {
                if (this._angle = t, !this.isZero()) {
                    var e = this.getLength();
                    this._set(Math.cos(t) * e, Math.sin(t) * e)
                }
            },
            getQuadrant: function() {
                return this.x >= 0 ? this.y >= 0 ? 1 : 4 : this.y >= 0 ? 2 : 3
            }
        }, {
            beans: !1,
            getDirectedAngle: function() {
                var t = c.read(arguments);
                return 180 * Math.atan2(this.cross(t), this.dot(t)) / Math.PI
            },
            getDistance: function() {
                var t = c.read(arguments),
                    e = t.x - this.x,
                    n = t.y - this.y,
                    i = e * e + n * n;
                return r.read(arguments) ? i : Math.sqrt(i)
            },
            normalize: function(t) {
                t === e && (t = 1);
                var n = this.getLength(),
                    i = 0 !== n ? t / n : 0,
                    r = new c(this.x * i, this.y * i);
                return i >= 0 && (r._angle = this._angle), r
            },
            rotate: function(t, e) {
                if (0 === t) return this.clone();
                t = t * Math.PI / 180;
                var n = e ? this.subtract(e) : this,
                    i = Math.sin(t),
                    r = Math.cos(t);
                return n = new c(n.x * r - n.y * i, n.x * i + n.y * r), e ? n.add(e) : n
            },
            transform: function(t) {
                return t ? t._transformPoint(this) : this
            },
            add: function() {
                var t = c.read(arguments);
                return new c(this.x + t.x, this.y + t.y)
            },
            subtract: function() {
                var t = c.read(arguments);
                return new c(this.x - t.x, this.y - t.y)
            },
            multiply: function() {
                var t = c.read(arguments);
                return new c(this.x * t.x, this.y * t.y)
            },
            divide: function() {
                var t = c.read(arguments);
                return new c(this.x / t.x, this.y / t.y)
            },
            modulo: function() {
                var t = c.read(arguments);
                return new c(this.x % t.x, this.y % t.y)
            },
            negate: function() {
                return new c(-this.x, -this.y)
            },
            isInside: function() {
                return g.read(arguments).contains(this)
            },
            isClose: function() {
                var t = c.read(arguments),
                    e = r.read(arguments);
                return this.getDistance(t) <= e
            },
            isCollinear: function() {
                var t = c.read(arguments);
                return c.isCollinear(this.x, this.y, t.x, t.y)
            },
            isColinear: "#isCollinear",
            isOrthogonal: function() {
                var t = c.read(arguments);
                return c.isOrthogonal(this.x, this.y, t.x, t.y)
            },
            isZero: function() {
                var t = l.isZero;
                return t(this.x) && t(this.y)
            },
            isNaN: function() {
                return isNaN(this.x) || isNaN(this.y)
            },
            isInQuadrant: function(t) {
                return this.x * (t > 1 && t < 4 ? -1 : 1) >= 0 && this.y * (t > 2 ? -1 : 1) >= 0
            },
            dot: function() {
                var t = c.read(arguments);
                return this.x * t.x + this.y * t.y
            },
            cross: function() {
                var t = c.read(arguments);
                return this.x * t.y - this.y * t.x
            },
            project: function() {
                var t = c.read(arguments),
                    e = t.isZero() ? 0 : this.dot(t) / t.dot(t);
                return new c(t.x * e, t.y * e)
            },
            statics: {
                min: function() {
                    var t = c.read(arguments),
                        e = c.read(arguments);
                    return new c(Math.min(t.x, e.x), Math.min(t.y, e.y))
                },
                max: function() {
                    var t = c.read(arguments),
                        e = c.read(arguments);
                    return new c(Math.max(t.x, e.x), Math.max(t.y, e.y))
                },
                random: function() {
                    return new c(Math.random(), Math.random())
                },
                isCollinear: function(t, e, n, i) {
                    return Math.abs(t * i - e * n) <= 1e-8 * Math.sqrt((t * t + e * e) * (n * n + i * i))
                },
                isOrthogonal: function(t, e, n, i) {
                    return Math.abs(t * n + e * i) <= 1e-8 * Math.sqrt((t * t + e * e) * (n * n + i * i))
                }
            }
        }, r.each(["round", "ceil", "floor", "abs"], function(t) {
            var e = Math[t];
            this[t] = function() {
                return new c(e(this.x), e(this.y))
            }
        }, {})),
        d = c.extend({
            initialize: function(t, e, n, i) {
                this._x = t, this._y = e, this._owner = n, this._setter = i
            },
            _set: function(t, e, n) {
                return this._x = t, this._y = e, n || this._owner[this._setter](this), this
            },
            getX: function() {
                return this._x
            },
            setX: function(t) {
                this._x = t, this._owner[this._setter](this)
            },
            getY: function() {
                return this._y
            },
            setY: function(t) {
                this._y = t, this._owner[this._setter](this)
            },
            isSelected: function() {
                return !!(this._owner._selection & this._getSelection())
            },
            setSelected: function(t) {
                this._owner._changeSelection(this._getSelection(), t)
            },
            _getSelection: function() {
                return "setPosition" === this._setter ? 4 : 0
            }
        }),
        f = r.extend({
            _class: "Size",
            _readIndex: !0,
            initialize: function(t, e) {
                var n = typeof t,
                    i = this.__read,
                    r = 0;
                if ("number" === n) {
                    var s = "number" == typeof e;
                    this._set(t, s ? e : t), i && (r = s ? 2 : 1)
                } else if ("undefined" === n || null === t) this._set(0, 0), i && (r = null === t ? 1 : 0);
                else {
                    var o = "string" === n ? t.split(/[\s,]+/) || [] : t;
                    r = 1, Array.isArray(o) ? this._set(+o[0], +(o.length > 1 ? o[1] : o[0])) : "width" in o ? this._set(o.width || 0, o.height || 0) : "x" in o ? this._set(o.x || 0, o.y || 0) : (this._set(0, 0), r = 0)
                }
                return i && (this.__read = r), this
            },
            set: "#initialize",
            _set: function(t, e) {
                return this.width = t, this.height = e, this
            },
            equals: function(t) {
                return t === this || t && (this.width === t.width && this.height === t.height || Array.isArray(t) && this.width === t[0] && this.height === t[1]) || !1
            },
            clone: function() {
                return new f(this.width, this.height)
            },
            toString: function() {
                var t = h.instance;
                return "{ width: " + t.number(this.width) + ", height: " + t.number(this.height) + " }"
            },
            _serialize: function(t) {
                var e = t.formatter;
                return [e.number(this.width), e.number(this.height)]
            },
            add: function() {
                var t = f.read(arguments);
                return new f(this.width + t.width, this.height + t.height)
            },
            subtract: function() {
                var t = f.read(arguments);
                return new f(this.width - t.width, this.height - t.height)
            },
            multiply: function() {
                var t = f.read(arguments);
                return new f(this.width * t.width, this.height * t.height)
            },
            divide: function() {
                var t = f.read(arguments);
                return new f(this.width / t.width, this.height / t.height)
            },
            modulo: function() {
                var t = f.read(arguments);
                return new f(this.width % t.width, this.height % t.height)
            },
            negate: function() {
                return new f(-this.width, -this.height)
            },
            isZero: function() {
                var t = l.isZero;
                return t(this.width) && t(this.height)
            },
            isNaN: function() {
                return isNaN(this.width) || isNaN(this.height)
            },
            statics: {
                min: function(t, e) {
                    return new f(Math.min(t.width, e.width), Math.min(t.height, e.height))
                },
                max: function(t, e) {
                    return new f(Math.max(t.width, e.width), Math.max(t.height, e.height))
                },
                random: function() {
                    return new f(Math.random(), Math.random())
                }
            }
        }, r.each(["round", "ceil", "floor", "abs"], function(t) {
            var e = Math[t];
            this[t] = function() {
                return new f(e(this.width), e(this.height))
            }
        }, {})),
        p = f.extend({
            initialize: function(t, e, n, i) {
                this._width = t, this._height = e, this._owner = n, this._setter = i
            },
            _set: function(t, e, n) {
                return this._width = t, this._height = e, n || this._owner[this._setter](this), this
            },
            getWidth: function() {
                return this._width
            },
            setWidth: function(t) {
                this._width = t, this._owner[this._setter](this)
            },
            getHeight: function() {
                return this._height
            },
            setHeight: function(t) {
                this._height = t, this._owner[this._setter](this)
            }
        }),
        g = r.extend({
            _class: "Rectangle",
            _readIndex: !0,
            beans: !0,
            initialize: function(t, n, i, s) {
                var o, a = typeof t;
                if ("number" === a ? (this._set(t, n, i, s), o = 4) : "undefined" === a || null === t ? (this._set(0, 0, 0, 0), o = null === t ? 1 : 0) : 1 === arguments.length && (Array.isArray(t) ? (this._set.apply(this, t), o = 1) : t.x !== e || t.width !== e ? (this._set(t.x || 0, t.y || 0, t.width || 0, t.height || 0), o = 1) : t.from === e && t.to === e && (this._set(0, 0, 0, 0), r.filter(this, t), o = 1)), o === e) {
                    var h, l, u = c.readNamed(arguments, "from"),
                        d = r.peek(arguments),
                        p = u.x,
                        g = u.y;
                    if (d && d.x !== e || r.hasNamed(arguments, "to")) {
                        var m = c.readNamed(arguments, "to");
                        h = m.x - p, l = m.y - g, h < 0 && (p = m.x, h = -h), l < 0 && (g = m.y, l = -l)
                    } else {
                        var v = f.read(arguments);
                        h = v.width, l = v.height
                    }
                    this._set(p, g, h, l), o = arguments.__index;
                    var _ = arguments.__filtered;
                    _ && (this.__filtered = _)
                }
                return this.__read && (this.__read = o), this
            },
            set: "#initialize",
            _set: function(t, e, n, i) {
                return this.x = t, this.y = e, this.width = n, this.height = i, this
            },
            clone: function() {
                return new g(this.x, this.y, this.width, this.height)
            },
            equals: function(t) {
                var e = r.isPlainValue(t) ? g.read(arguments) : t;
                return e === this || e && this.x === e.x && this.y === e.y && this.width === e.width && this.height === e.height || !1
            },
            toString: function() {
                var t = h.instance;
                return "{ x: " + t.number(this.x) + ", y: " + t.number(this.y) + ", width: " + t.number(this.width) + ", height: " + t.number(this.height) + " }"
            },
            _serialize: function(t) {
                var e = t.formatter;
                return [e.number(this.x), e.number(this.y), e.number(this.width), e.number(this.height)]
            },
            getPoint: function(t) {
                return new(t ? c : d)(this.x, this.y, this, "setPoint")
            },
            setPoint: function() {
                var t = c.read(arguments);
                this.x = t.x, this.y = t.y
            },
            getSize: function(t) {
                return new(t ? f : p)(this.width, this.height, this, "setSize")
            },
            _fw: 1,
            _fh: 1,
            setSize: function() {
                var t = f.read(arguments),
                    e = this._sx,
                    n = this._sy,
                    i = t.width,
                    r = t.height;
                e && (this.x += (this.width - i) * e), n && (this.y += (this.height - r) * n), this.width = i, this.height = r, this._fw = this._fh = 1
            },
            getLeft: function() {
                return this.x
            },
            setLeft: function(t) {
                if (!this._fw) {
                    var e = t - this.x;
                    this.width -= .5 === this._sx ? 2 * e : e
                }
                this.x = t, this._sx = this._fw = 0
            },
            getTop: function() {
                return this.y
            },
            setTop: function(t) {
                if (!this._fh) {
                    var e = t - this.y;
                    this.height -= .5 === this._sy ? 2 * e : e
                }
                this.y = t, this._sy = this._fh = 0
            },
            getRight: function() {
                return this.x + this.width
            },
            setRight: function(t) {
                if (!this._fw) {
                    var e = t - this.x;
                    this.width = .5 === this._sx ? 2 * e : e
                }
                this.x = t - this.width, this._sx = 1, this._fw = 0
            },
            getBottom: function() {
                return this.y + this.height
            },
            setBottom: function(t) {
                if (!this._fh) {
                    var e = t - this.y;
                    this.height = .5 === this._sy ? 2 * e : e
                }
                this.y = t - this.height, this._sy = 1, this._fh = 0
            },
            getCenterX: function() {
                return this.x + this.width / 2
            },
            setCenterX: function(t) {
                this._fw || .5 === this._sx ? this.x = t - this.width / 2 : (this._sx && (this.x += 2 * (t - this.x) * this._sx), this.width = 2 * (t - this.x)), this._sx = .5, this._fw = 0
            },
            getCenterY: function() {
                return this.y + this.height / 2
            },
            setCenterY: function(t) {
                this._fh || .5 === this._sy ? this.y = t - this.height / 2 : (this._sy && (this.y += 2 * (t - this.y) * this._sy), this.height = 2 * (t - this.y)), this._sy = .5, this._fh = 0
            },
            getCenter: function(t) {
                return new(t ? c : d)(this.getCenterX(), this.getCenterY(), this, "setCenter")
            },
            setCenter: function() {
                var t = c.read(arguments);
                return this.setCenterX(t.x), this.setCenterY(t.y), this
            },
            getArea: function() {
                return this.width * this.height
            },
            isEmpty: function() {
                return 0 === this.width || 0 === this.height
            },
            contains: function(t) {
                return t && t.width !== e || 4 === (Array.isArray(t) ? t : arguments).length ? this._containsRectangle(g.read(arguments)) : this._containsPoint(c.read(arguments))
            },
            _containsPoint: function(t) {
                var e = t.x,
                    n = t.y;
                return e >= this.x && n >= this.y && e <= this.x + this.width && n <= this.y + this.height
            },
            _containsRectangle: function(t) {
                var e = t.x,
                    n = t.y;
                return e >= this.x && n >= this.y && e + t.width <= this.x + this.width && n + t.height <= this.y + this.height
            },
            intersects: function() {
                var t = g.read(arguments),
                    e = r.read(arguments) || 0;
                return t.x + t.width > this.x - e && t.y + t.height > this.y - e && t.x < this.x + this.width + e && t.y < this.y + this.height + e
            },
            intersect: function() {
                var t = g.read(arguments),
                    e = Math.max(this.x, t.x),
                    n = Math.max(this.y, t.y),
                    i = Math.min(this.x + this.width, t.x + t.width),
                    r = Math.min(this.y + this.height, t.y + t.height);
                return new g(e, n, i - e, r - n)
            },
            unite: function() {
                var t = g.read(arguments),
                    e = Math.min(this.x, t.x),
                    n = Math.min(this.y, t.y),
                    i = Math.max(this.x + this.width, t.x + t.width),
                    r = Math.max(this.y + this.height, t.y + t.height);
                return new g(e, n, i - e, r - n)
            },
            include: function() {
                var t = c.read(arguments),
                    e = Math.min(this.x, t.x),
                    n = Math.min(this.y, t.y),
                    i = Math.max(this.x + this.width, t.x),
                    r = Math.max(this.y + this.height, t.y);
                return new g(e, n, i - e, r - n)
            },
            expand: function() {
                var t = f.read(arguments),
                    e = t.width,
                    n = t.height;
                return new g(this.x - e / 2, this.y - n / 2, this.width + e, this.height + n)
            },
            scale: function(t, n) {
                return this.expand(this.width * t - this.width, this.height * (n === e ? t : n) - this.height)
            }
        }, r.each([
            ["Top", "Left"],
            ["Top", "Right"],
            ["Bottom", "Left"],
            ["Bottom", "Right"],
            ["Left", "Center"],
            ["Top", "Center"],
            ["Right", "Center"],
            ["Bottom", "Center"]
        ], function(t, e) {
            var n = t.join(""),
                i = /^[RL]/.test(n);
            e >= 4 && (t[1] += i ? "Y" : "X");
            var r = t[i ? 0 : 1],
                s = t[i ? 1 : 0],
                o = "get" + r,
                a = "get" + s,
                h = "set" + r,
                l = "set" + s,
                u = "get" + n,
                f = "set" + n;
            this[u] = function(t) {
                return new(t ? c : d)(this[o](), this[a](), this, f)
            }, this[f] = function() {
                var t = c.read(arguments);
                this[h](t.x), this[l](t.y)
            }
        }, {
            beans: !0
        })),
        m = g.extend({
            initialize: function(t, e, n, i, r, s) {
                this._set(t, e, n, i, !0), this._owner = r, this._setter = s
            },
            _set: function(t, e, n, i, r) {
                return this._x = t, this._y = e, this._width = n, this._height = i, r || this._owner[this._setter](this), this
            }
        }, new function() {
            var t = g.prototype;
            return r.each(["x", "y", "width", "height"], function(t) {
                var e = r.capitalize(t),
                    n = "_" + t;
                this["get" + e] = function() {
                    return this[n]
                }, this["set" + e] = function(t) {
                    this[n] = t, this._dontNotify || this._owner[this._setter](this)
                }
            }, r.each(["Point", "Size", "Center", "Left", "Top", "Right", "Bottom", "CenterX", "CenterY", "TopLeft", "TopRight", "BottomLeft", "BottomRight", "LeftCenter", "TopCenter", "RightCenter", "BottomCenter"], function(e) {
                var n = "set" + e;
                this[n] = function() {
                    this._dontNotify = !0, t[n].apply(this, arguments), this._dontNotify = !1, this._owner[this._setter](this)
                }
            }, {
                isSelected: function() {
                    return !!(2 & this._owner._selection)
                },
                setSelected: function(t) {
                    var e = this._owner;
                    e._changeSelection && e._changeSelection(2, t)
                }
            }))
        }),
        v = r.extend({
            _class: "Matrix",
            initialize: function t(e, n) {
                var i = arguments.length,
                    r = !0;
                if (i >= 6 ? this._set.apply(this, arguments) : 1 === i || 2 === i ? e instanceof t ? this._set(e._a, e._b, e._c, e._d, e._tx, e._ty, n) : Array.isArray(e) ? this._set.apply(this, n ? e.concat([n]) : e) : r = !1 : i ? r = !1 : this.reset(), !r) throw new Error("Unsupported matrix parameters");
                return this
            },
            set: "#initialize",
            _set: function(t, e, n, i, r, s, o) {
                return this._a = t, this._b = e, this._c = n, this._d = i, this._tx = r, this._ty = s, o || this._changed(), this
            },
            _serialize: function(t, e) {
                return r.serialize(this.getValues(), t, !0, e)
            },
            _changed: function() {
                var t = this._owner;
                t && (t._applyMatrix ? t.transform(null, !0) : t._changed(9))
            },
            clone: function() {
                return new v(this._a, this._b, this._c, this._d, this._tx, this._ty)
            },
            equals: function(t) {
                return t === this || t && this._a === t._a && this._b === t._b && this._c === t._c && this._d === t._d && this._tx === t._tx && this._ty === t._ty
            },
            toString: function() {
                var t = h.instance;
                return "[[" + [t.number(this._a), t.number(this._c), t.number(this._tx)].join(", ") + "], [" + [t.number(this._b), t.number(this._d), t.number(this._ty)].join(", ") + "]]"
            },
            reset: function(t) {
                return this._a = this._d = 1, this._b = this._c = this._tx = this._ty = 0, t || this._changed(), this
            },
            apply: function(t, e) {
                var n = this._owner;
                return !!n && (n.transform(null, !0, r.pick(t, !0), e), this.isIdentity())
            },
            translate: function() {
                var t = c.read(arguments),
                    e = t.x,
                    n = t.y;
                return this._tx += e * this._a + n * this._c, this._ty += e * this._b + n * this._d, this._changed(), this
            },
            scale: function() {
                var t = c.read(arguments),
                    e = c.read(arguments, 0, {
                        readNull: !0
                    });
                return e && this.translate(e), this._a *= t.x, this._b *= t.x, this._c *= t.y, this._d *= t.y, e && this.translate(e.negate()), this._changed(), this
            },
            rotate: function(t) {
                t *= Math.PI / 180;
                var e = c.read(arguments, 1),
                    n = e.x,
                    i = e.y,
                    r = Math.cos(t),
                    s = Math.sin(t),
                    o = n - n * r + i * s,
                    a = i - n * s - i * r,
                    h = this._a,
                    l = this._b,
                    u = this._c,
                    d = this._d;
                return this._a = r * h + s * u, this._b = r * l + s * d, this._c = -s * h + r * u, this._d = -s * l + r * d, this._tx += o * h + a * u, this._ty += o * l + a * d, this._changed(), this
            },
            shear: function() {
                var t = c.read(arguments),
                    e = c.read(arguments, 0, {
                        readNull: !0
                    });
                e && this.translate(e);
                var n = this._a,
                    i = this._b;
                return this._a += t.y * this._c, this._b += t.y * this._d, this._c += t.x * n, this._d += t.x * i, e && this.translate(e.negate()), this._changed(), this
            },
            skew: function() {
                var t = c.read(arguments),
                    e = c.read(arguments, 0, {
                        readNull: !0
                    }),
                    n = Math.PI / 180,
                    i = new c(Math.tan(t.x * n), Math.tan(t.y * n));
                return this.shear(i, e)
            },
            append: function(t, e) {
                if (t) {
                    var n = this._a,
                        i = this._b,
                        r = this._c,
                        s = this._d,
                        o = t._a,
                        a = t._c,
                        h = t._b,
                        l = t._d,
                        u = t._tx,
                        c = t._ty;
                    this._a = o * n + h * r, this._c = a * n + l * r, this._b = o * i + h * s, this._d = a * i + l * s, this._tx += u * n + c * r, this._ty += u * i + c * s, e || this._changed()
                }
                return this
            },
            prepend: function(t, e) {
                if (t) {
                    var n = this._a,
                        i = this._b,
                        r = this._c,
                        s = this._d,
                        o = this._tx,
                        a = this._ty,
                        h = t._a,
                        l = t._c,
                        u = t._b,
                        c = t._d,
                        d = t._tx,
                        f = t._ty;
                    this._a = h * n + l * i, this._c = h * r + l * s, this._b = u * n + c * i, this._d = u * r + c * s, this._tx = h * o + l * a + d, this._ty = u * o + c * a + f, e || this._changed()
                }
                return this
            },
            appended: function(t) {
                return this.clone().append(t)
            },
            prepended: function(t) {
                return this.clone().prepend(t)
            },
            invert: function() {
                var t = this._a,
                    e = this._b,
                    n = this._c,
                    i = this._d,
                    r = this._tx,
                    s = this._ty,
                    o = t * i - e * n,
                    a = null;
                return o && !isNaN(o) && isFinite(r) && isFinite(s) && (this._a = i / o, this._b = -e / o, this._c = -n / o, this._d = t / o, this._tx = (n * s - i * r) / o, this._ty = (e * r - t * s) / o, a = this), a
            },
            inverted: function() {
                return this.clone().invert()
            },
            concatenate: "#append",
            preConcatenate: "#prepend",
            chain: "#appended",
            _shiftless: function() {
                return new v(this._a, this._b, this._c, this._d, 0, 0)
            },
            _orNullIfIdentity: function() {
                return this.isIdentity() ? null : this
            },
            isIdentity: function() {
                return 1 === this._a && 0 === this._b && 0 === this._c && 1 === this._d && 0 === this._tx && 0 === this._ty
            },
            isInvertible: function() {
                var t = this._a * this._d - this._c * this._b;
                return t && !isNaN(t) && isFinite(this._tx) && isFinite(this._ty)
            },
            isSingular: function() {
                return !this.isInvertible()
            },
            transform: function(t, e, n) {
                return arguments.length < 3 ? this._transformPoint(c.read(arguments)) : this._transformCoordinates(t, e, n)
            },
            _transformPoint: function(t, e, n) {
                var i = t.x,
                    r = t.y;
                return e || (e = new c), e._set(i * this._a + r * this._c + this._tx, i * this._b + r * this._d + this._ty, n)
            },
            _transformCoordinates: function(t, e, n) {
                for (var i = 0, r = 2 * n; i < r; i += 2) {
                    var s = t[i],
                        o = t[i + 1];
                    e[i] = s * this._a + o * this._c + this._tx, e[i + 1] = s * this._b + o * this._d + this._ty
                }
                return e
            },
            _transformCorners: function(t) {
                var e = t.x,
                    n = t.y,
                    i = e + t.width,
                    r = n + t.height,
                    s = [e, n, i, n, i, r, e, r];
                return this._transformCoordinates(s, s, 4)
            },
            _transformBounds: function(t, e, n) {
                for (var i = this._transformCorners(t), r = i.slice(0, 2), s = r.slice(), o = 2; o < 8; o++) {
                    var a = i[o],
                        h = 1 & o;
                    a < r[h] ? r[h] = a : a > s[h] && (s[h] = a)
                }
                return e || (e = new g), e._set(r[0], r[1], s[0] - r[0], s[1] - r[1], n)
            },
            inverseTransform: function() {
                return this._inverseTransform(c.read(arguments))
            },
            _inverseTransform: function(t, e, n) {
                var i = this._a,
                    r = this._b,
                    s = this._c,
                    o = this._d,
                    a = this._tx,
                    h = this._ty,
                    l = i * o - r * s,
                    u = null;
                if (l && !isNaN(l) && isFinite(a) && isFinite(h)) {
                    var d = t.x - this._tx,
                        f = t.y - this._ty;
                    e || (e = new c), u = e._set((d * o - f * s) / l, (f * i - d * r) / l, n)
                }
                return u
            },
            decompose: function() {
                var t, e, n, i = this._a,
                    r = this._b,
                    s = this._c,
                    o = this._d,
                    a = i * o - r * s,
                    h = Math.sqrt,
                    l = Math.atan2,
                    u = 180 / Math.PI;
                if (0 !== i || 0 !== r) {
                    var d = h(i * i + r * r);
                    t = Math.acos(i / d) * (r > 0 ? 1 : -1), e = [d, a / d], n = [l(i * s + r * o, d * d), 0]
                } else if (0 !== s || 0 !== o) {
                    var f = h(s * s + o * o);
                    t = Math.asin(s / f) * (o > 0 ? 1 : -1), e = [a / f, f], n = [0, l(i * s + r * o, f * f)]
                } else t = 0, n = e = [0, 0];
                return {
                    translation: this.getTranslation(),
                    rotation: t * u,
                    scaling: new c(e),
                    skewing: new c(n[0] * u, n[1] * u)
                }
            },
            getValues: function() {
                return [this._a, this._b, this._c, this._d, this._tx, this._ty]
            },
            getTranslation: function() {
                return new c(this._tx, this._ty)
            },
            getScaling: function() {
                return (this.decompose() || {}).scaling
            },
            getRotation: function() {
                return (this.decompose() || {}).rotation
            },
            applyToContext: function(t) {
                this.isIdentity() || t.transform(this._a, this._b, this._c, this._d, this._tx, this._ty)
            }
        }, r.each(["a", "b", "c", "d", "tx", "ty"], function(t) {
            var e = r.capitalize(t),
                n = "_" + t;
            this["get" + e] = function() {
                return this[n]
            }, this["set" + e] = function(t) {
                this[n] = t, this._changed()
            }
        }, {})),
        _ = r.extend({
            _class: "Line",
            initialize: function(t, e, n, i, r) {
                var s = !1;
                arguments.length >= 4 ? (this._px = t, this._py = e, this._vx = n, this._vy = i, s = r) : (this._px = t.x, this._py = t.y, this._vx = e.x, this._vy = e.y, s = n), s || (this._vx -= this._px, this._vy -= this._py)
            },
            getPoint: function() {
                return new c(this._px, this._py)
            },
            getVector: function() {
                return new c(this._vx, this._vy)
            },
            getLength: function() {
                return this.getVector().getLength()
            },
            intersect: function(t, e) {
                return _.intersect(this._px, this._py, this._vx, this._vy, t._px, t._py, t._vx, t._vy, !0, e)
            },
            getSide: function(t, e) {
                return _.getSide(this._px, this._py, this._vx, this._vy, t.x, t.y, !0, e)
            },
            getDistance: function(t) {
                return Math.abs(this.getSignedDistance(t))
            },
            getSignedDistance: function(t) {
                return _.getSignedDistance(this._px, this._py, this._vx, this._vy, t.x, t.y, !0)
            },
            isCollinear: function(t) {
                return c.isCollinear(this._vx, this._vy, t._vx, t._vy)
            },
            isOrthogonal: function(t) {
                return c.isOrthogonal(this._vx, this._vy, t._vx, t._vy)
            },
            statics: {
                intersect: function(t, e, n, i, r, s, o, a, h, u) {
                    h || (n -= t, i -= e, o -= r, a -= s);
                    var d = n * a - i * o;
                    if (!l.isZero(d)) {
                        var f = t - r,
                            p = e - s,
                            g = (o * p - a * f) / d,
                            m = (n * p - i * f) / d;
                        if (u || -1e-12 < g && g < 1 + 1e-12 && -1e-12 < m && m < 1 + 1e-12) return u || (g = g <= 0 ? 0 : g >= 1 ? 1 : g), new c(t + g * n, e + g * i)
                    }
                },
                getSide: function(t, e, n, i, r, s, o, a) {
                    o || (n -= t, i -= e);
                    var h = r - t,
                        u = s - e,
                        c = h * i - u * n;
                    return !a && l.isZero(c) && (c = (h * n + h * n) / (n * n + i * i)) >= 0 && c <= 1 && (c = 0), c < 0 ? -1 : c > 0 ? 1 : 0
                },
                getSignedDistance: function(t, e, n, i, r, s, o) {
                    return o || (n -= t, i -= e), 0 === n ? i > 0 ? r - t : t - r : 0 === i ? n < 0 ? s - e : e - s : ((r - t) * i - (s - e) * n) / Math.sqrt(n * n + i * i)
                },
                getDistance: function(t, e, n, i, r, s, o) {
                    return Math.abs(_.getSignedDistance(t, e, n, i, r, s, o))
                }
            }
        }),
        y = a.extend({
            _class: "Project",
            _list: "projects",
            _reference: "project",
            _compactSerialize: !0,
            initialize: function(t) {
                a.call(this, !0), this._children = [], this._namedChildren = {}, this._activeLayer = null, this._currentStyle = new j(null, null, this), this._view = U.create(this, t || tt.getCanvas(1, 1)), this._selectionItems = {}, this._selectionCount = 0, this._updateVersion = 0
            },
            _serialize: function(t, e) {
                return r.serialize(this._children, t, !0, e)
            },
            _changed: function(t, e) {
                if (1 & t) {
                    var n = this._view;
                    n && (n._needsUpdate = !0, !n._requested && n._autoUpdate && n.requestUpdate())
                }
                var i = this._changes;
                if (i && e) {
                    var r = this._changesById,
                        s = e._id,
                        o = r[s];
                    o ? o.flags |= t : i.push(r[s] = {
                        item: e,
                        flags: t
                    })
                }
            },
            clear: function() {
                for (var t = this._children, e = t.length - 1; e >= 0; e--) t[e].remove()
            },
            isEmpty: function() {
                return !this._children.length
            },
            remove: function t() {
                return !!t.base.call(this) && (this._view && this._view.remove(), !0)
            },
            getView: function() {
                return this._view
            },
            getCurrentStyle: function() {
                return this._currentStyle
            },
            setCurrentStyle: function(t) {
                this._currentStyle.set(t)
            },
            getIndex: function() {
                return this._index
            },
            getOptions: function() {
                return this._scope.settings
            },
            getLayers: function() {
                return this._children
            },
            getActiveLayer: function() {
                return this._activeLayer || new b({
                    project: this,
                    insert: !0
                })
            },
            getSymbolDefinitions: function() {
                var t = [],
                    e = {};
                return this.getItems({
                    class: T,
                    match: function(n) {
                        var i = n._definition,
                            r = i._id;
                        return e[r] || (e[r] = !0, t.push(i)), !1
                    }
                }), t
            },
            getSymbols: "getSymbolDefinitions",
            getSelectedItems: function() {
                var t = this._selectionItems,
                    e = [];
                for (var n in t) {
                    var i = t[n],
                        r = i._selection;
                    1 & r && i.isInserted() ? e.push(i) : r || this._updateSelection(i)
                }
                return e
            },
            _updateSelection: function(t) {
                var e = t._id,
                    n = this._selectionItems;
                t._selection ? n[e] !== t && (this._selectionCount++, n[e] = t) : n[e] === t && (this._selectionCount--, delete n[e])
            },
            selectAll: function() {
                for (var t = this._children, e = 0, n = t.length; e < n; e++) t[e].setFullySelected(!0)
            },
            deselectAll: function() {
                var t = this._selectionItems;
                for (var e in t) t[e].setFullySelected(!1)
            },
            addLayer: function(t) {
                return this.insertLayer(e, t)
            },
            insertLayer: function(t, e) {
                if (e instanceof b) {
                    e._remove(!1, !0), r.splice(this._children, [e], t, 0), e._setProject(this, !0);
                    var n = e._name;
                    n && e.setName(n), this._changes && e._changed(5), this._activeLayer || (this._activeLayer = e)
                } else e = null;
                return e
            },
            _insertItem: function(t, n, i) {
                return n = this.insertLayer(t, n) || (this._activeLayer || this._insertItem(e, new b(w.NO_INSERT), !0)).insertChild(t, n), i && n.activate && n.activate(), n
            },
            getItems: function(t) {
                return w._getItems(this, t)
            },
            getItem: function(t) {
                return w._getItems(this, t, null, null, !0)[0] || null
            },
            importJSON: function(t) {
                this.activate();
                var e = this._activeLayer;
                return r.importJSON(t, e && e.isEmpty() && e)
            },
            removeOn: function(t) {
                var e = this._removeSets;
                if (e) {
                    "mouseup" === t && (e.mousedrag = null);
                    var n = e[t];
                    if (n) {
                        for (var i in n) {
                            var r = n[i];
                            for (var s in e) {
                                var o = e[s];
                                o && o != n && delete o[r._id]
                            }
                            r.remove()
                        }
                        e[t] = null
                    }
                }
            },
            draw: function(t, e, n) {
                this._updateVersion++, t.save(), e.applyToContext(t);
                for (var i = this._children, s = new r({
                        offset: new c(0, 0),
                        pixelRatio: n,
                        viewMatrix: e.isIdentity() ? null : e,
                        matrices: [new v],
                        updateMatrix: !0
                    }), o = 0, a = i.length; o < a; o++) i[o].draw(t, s);
                if (t.restore(), this._selectionCount > 0) {
                    t.save(), t.strokeWidth = 1;
                    var h = this._selectionItems,
                        l = this._scope.settings.handleSize,
                        u = this._updateVersion;
                    for (var d in h) h[d]._drawSelection(t, e, l, h, u);
                    t.restore()
                }
            }
        }),
        w = r.extend(s, {
            statics: {
                extend: function t(e) {
                    return e._serializeFields && (e._serializeFields = r.set({}, this.prototype._serializeFields, e._serializeFields)), t.base.apply(this, arguments)
                },
                NO_INSERT: {
                    insert: !1
                }
            },
            _class: "Item",
            _name: null,
            _applyMatrix: !0,
            _canApplyMatrix: !0,
            _canScaleStroke: !1,
            _pivot: null,
            _visible: !0,
            _blendMode: "normal",
            _opacity: 1,
            _locked: !1,
            _guide: !1,
            _clipMask: !1,
            _selection: 0,
            _selectBounds: !0,
            _selectChildren: !1,
            _serializeFields: {
                name: null,
                applyMatrix: null,
                matrix: new v,
                pivot: null,
                visible: !0,
                blendMode: "normal",
                opacity: 1,
                locked: !1,
                guide: !1,
                clipMask: !1,
                selected: !1,
                data: {}
            },
            _prioritize: ["applyMatrix"]
        }, new function() {
            var t = ["onMouseDown", "onMouseUp", "onMouseDrag", "onClick", "onDoubleClick", "onMouseMove", "onMouseEnter", "onMouseLeave"];
            return r.each(t, function(t) {
                this._events[t] = {
                    install: function(t) {
                        this.getView()._countItemEvent(t, 1)
                    },
                    uninstall: function(t) {
                        this.getView()._countItemEvent(t, -1)
                    }
                }
            }, {
                _events: {
                    onFrame: {
                        install: function() {
                            this.getView()._animateItem(this, !0)
                        },
                        uninstall: function() {
                            this.getView()._animateItem(this, !1)
                        }
                    },
                    onLoad: {},
                    onError: {}
                },
                statics: {
                    _itemHandlers: t
                }
            })
        }, {
            initialize: function() {},
            _initialize: function(t, n) {
                var i = t && r.isPlainObject(t),
                    s = i && !0 === t.internal,
                    o = this._matrix = new v,
                    a = i && t.project || paper.project,
                    h = paper.settings;
                return this._id = s ? null : u.get(), this._parent = this._index = null, this._applyMatrix = this._canApplyMatrix && h.applyMatrix, n && o.translate(n), o._owner = this, this._style = new j(a._currentStyle, this, a), s || i && 0 == t.insert || !h.insertItems && (!i || !0 !== t.insert) ? this._setProject(a) : (i && t.parent || a)._insertItem(e, this, !0), i && t !== w.NO_INSERT && this.set(t, {
                    internal: !0,
                    insert: !0,
                    project: !0,
                    parent: !0
                }), i
            },
            _serialize: function(t, e) {
                function n(n) {
                    for (var o in n) {
                        var a = s[o];
                        r.equals(a, "leading" === o ? 1.2 * n.fontSize : n[o]) || (i[o] = r.serialize(a, t, "data" !== o, e))
                    }
                }
                var i = {},
                    s = this;
                return n(this._serializeFields), this instanceof x || n(this._style._defaults), [this._class, i]
            },
            _changed: function(t) {
                var n = this._symbol,
                    i = this._parent || n,
                    r = this._project;
                8 & t && (this._bounds = this._position = this._decomposed = this._globalMatrix = e), i && 40 & t && w._clearBoundsCache(i), 2 & t && w._clearBoundsCache(this), r && r._changed(t, this), n && n._changed(t)
            },
            getId: function() {
                return this._id
            },
            getName: function() {
                return this._name
            },
            setName: function(t) {
                if (this._name && this._removeNamed(), t === +t + "") throw new Error("Names consisting only of numbers are not supported.");
                var n = this._getOwner();
                if (t && n) {
                    var i = n._children,
                        r = n._namedChildren;
                    (r[t] = r[t] || []).push(this), t in i || (i[t] = this)
                }
                this._name = t || e, this._changed(128)
            },
            getStyle: function() {
                return this._style
            },
            setStyle: function(t) {
                this.getStyle().set(t)
            }
        }, r.each(["locked", "visible", "blendMode", "opacity", "guide"], function(t) {
            var e = r.capitalize(t),
                n = "_" + t,
                i = {
                    locked: 128,
                    visible: 137
                };
            this["get" + e] = function() {
                return this[n]
            }, this["set" + e] = function(e) {
                e != this[n] && (this[n] = e, this._changed(i[t] || 129))
            }
        }, {}), {
            beans: !0,
            getSelection: function() {
                return this._selection
            },
            setSelection: function(t) {
                if (t !== this._selection) {
                    this._selection = t;
                    var e = this._project;
                    e && (e._updateSelection(this), this._changed(129))
                }
            },
            _changeSelection: function(t, e) {
                var n = this._selection;
                this.setSelection(e ? n | t : n & ~t)
            },
            isSelected: function() {
                if (this._selectChildren)
                    for (var t = this._children, e = 0, n = t.length; e < n; e++)
                        if (t[e].isSelected()) return !0;
                return !!(1 & this._selection)
            },
            setSelected: function(t) {
                if (this._selectChildren)
                    for (var e = this._children, n = 0, i = e.length; n < i; n++) e[n].setSelected(t);
                this._changeSelection(1, t)
            },
            isFullySelected: function() {
                var t = this._children,
                    e = !!(1 & this._selection);
                if (t && e) {
                    for (var n = 0, i = t.length; n < i; n++)
                        if (!t[n].isFullySelected()) return !1;
                    return !0
                }
                return e
            },
            setFullySelected: function(t) {
                var e = this._children;
                if (e)
                    for (var n = 0, i = e.length; n < i; n++) e[n].setFullySelected(t);
                this._changeSelection(1, t)
            },
            isClipMask: function() {
                return this._clipMask
            },
            setClipMask: function(t) {
                this._clipMask != (t = !!t) && (this._clipMask = t, t && (this.setFillColor(null), this.setStrokeColor(null)), this._changed(129), this._parent && this._parent._changed(1024))
            },
            getData: function() {
                return this._data || (this._data = {}), this._data
            },
            setData: function(t) {
                this._data = t
            },
            getPosition: function(t) {
                var e = this._position,
                    n = t ? c : d;
                if (!e) {
                    var i = this._pivot;
                    e = this._position = i ? this._matrix._transformPoint(i) : this.getBounds().getCenter(!0)
                }
                return new n(e.x, e.y, this, "setPosition")
            },
            setPosition: function() {
                this.translate(c.read(arguments).subtract(this.getPosition(!0)))
            },
            getPivot: function() {
                var t = this._pivot;
                return t ? new d(t.x, t.y, this, "setPivot") : null
            },
            setPivot: function() {
                this._pivot = c.read(arguments, 0, {
                    clone: !0,
                    readNull: !0
                }), this._position = e
            }
        }, r.each({
            getStrokeBounds: {
                stroke: !0
            },
            getHandleBounds: {
                handle: !0
            },
            getInternalBounds: {
                internal: !0
            }
        }, function(t, e) {
            this[e] = function(e) {
                return this.getBounds(e, t)
            }
        }, {
            beans: !0,
            getBounds: function(t, e) {
                var n = e || t instanceof v,
                    i = r.set({}, n ? e : t, this._boundsOptions);
                i.stroke && !this.getStrokeScaling() || (i.cacheItem = this);
                var s = this._getCachedBounds(n && t, i).rect;
                return arguments.length ? s : new m(s.x, s.y, s.width, s.height, this, "setBounds")
            },
            setBounds: function() {
                var t = g.read(arguments),
                    e = this.getBounds(),
                    n = this._matrix,
                    i = new v,
                    r = t.getCenter();
                i.translate(r), t.width == e.width && t.height == e.height || (n.isInvertible() || (n.set(n._backup || (new v).translate(n.getTranslation())), e = this.getBounds()), i.scale(0 !== e.width ? t.width / e.width : 0, 0 !== e.height ? t.height / e.height : 0)), r = e.getCenter(), i.translate(-r.x, -r.y), this.transform(i)
            },
            _getBounds: function(t, e) {
                var n = this._children;
                return n && n.length ? (w._updateBoundsCache(this, e.cacheItem), w._getBounds(n, t, e)) : new g
            },
            _getBoundsCacheKey: function(t, e) {
                return [t.stroke ? 1 : 0, t.handle ? 1 : 0, e ? 1 : 0].join("")
            },
            _getCachedBounds: function(t, e, n) {
                t = t && t._orNullIfIdentity();
                var i = e.internal && !n,
                    r = e.cacheItem,
                    s = i ? null : this._matrix._orNullIfIdentity(),
                    o = r && (!t || t.equals(s)) && this._getBoundsCacheKey(e, i),
                    a = this._bounds;
                if (w._updateBoundsCache(this._parent || this._symbol, r), o && a && o in a) {
                    var h = a[o];
                    return {
                        rect: h.rect.clone(),
                        nonscaling: h.nonscaling
                    }
                }
                var l = this._getBounds(t || s, e),
                    u = l.rect || l,
                    c = this._style,
                    d = l.nonscaling || c.hasStroke() && !c.getStrokeScaling();
                if (o) {
                    a || (this._bounds = a = {});
                    var h = a[o] = {
                        rect: u.clone(),
                        nonscaling: d,
                        internal: i
                    }
                }
                return {
                    rect: u,
                    nonscaling: d
                }
            },
            _getStrokeMatrix: function(t, e) {
                var n = this.getStrokeScaling() ? null : e && e.internal ? this : this._parent || this._symbol && this._symbol._item,
                    i = n ? n.getViewMatrix().invert() : t;
                return i && i._shiftless()
            },
            statics: {
                _updateBoundsCache: function(t, e) {
                    if (t && e) {
                        var n = e._id,
                            i = t._boundsCache = t._boundsCache || {
                                ids: {},
                                list: []
                            };
                        i.ids[n] || (i.list.push(e), i.ids[n] = e)
                    }
                },
                _clearBoundsCache: function(t) {
                    var n = t._boundsCache;
                    if (n) {
                        t._bounds = t._position = t._boundsCache = e;
                        for (var i = 0, r = n.list, s = r.length; i < s; i++) {
                            var o = r[i];
                            o !== t && (o._bounds = o._position = e, o._boundsCache && w._clearBoundsCache(o))
                        }
                    }
                },
                _getBounds: function(t, e, n) {
                    var i = 1 / 0,
                        r = -i,
                        s = i,
                        o = r,
                        a = !1;
                    n = n || {};
                    for (var h = 0, l = t.length; h < l; h++) {
                        var u = t[h];
                        if (u._visible && !u.isEmpty()) {
                            var c = u._getCachedBounds(e && e.appended(u._matrix), n, !0),
                                d = c.rect;
                            i = Math.min(d.x, i), s = Math.min(d.y, s), r = Math.max(d.x + d.width, r), o = Math.max(d.y + d.height, o), c.nonscaling && (a = !0)
                        }
                    }
                    return {
                        rect: isFinite(i) ? new g(i, s, r - i, o - s) : new g,
                        nonscaling: a
                    }
                }
            }
        }), {
            beans: !0,
            _decompose: function() {
                return this._applyMatrix ? null : this._decomposed || (this._decomposed = this._matrix.decompose())
            },
            getRotation: function() {
                var t = this._decompose();
                return t ? t.rotation : 0
            },
            setRotation: function(t) {
                var e = this.getRotation();
                if (null != e && null != t) {
                    var n = this._decomposed;
                    this.rotate(t - e), n && (n.rotation = t, this._decomposed = n)
                }
            },
            getScaling: function() {
                var t = this._decompose(),
                    e = t && t.scaling;
                return new d(e ? e.x : 1, e ? e.y : 1, this, "setScaling")
            },
            setScaling: function() {
                var t = this.getScaling(),
                    e = c.read(arguments, 0, {
                        clone: !0,
                        readNull: !0
                    });
                if (t && e && !t.equals(e)) {
                    var n = this.getRotation(),
                        i = this._decomposed,
                        r = new v,
                        s = this.getPosition(!0);
                    r.translate(s), n && r.rotate(n), r.scale(e.x / t.x, e.y / t.y), n && r.rotate(-n), r.translate(s.negate()), this.transform(r), i && (i.scaling = e, this._decomposed = i)
                }
            },
            getMatrix: function() {
                return this._matrix
            },
            setMatrix: function() {
                var t = this._matrix;
                t.initialize.apply(t, arguments)
            },
            getGlobalMatrix: function(t) {
                var e = this._globalMatrix,
                    n = this._project._updateVersion;
                if (e && e._updateVersion !== n && (e = null), !e) {
                    e = this._globalMatrix = this._matrix.clone();
                    var i = this._parent;
                    i && e.prepend(i.getGlobalMatrix(!0)), e._updateVersion = n
                }
                return t ? e : e.clone()
            },
            getViewMatrix: function() {
                return this.getGlobalMatrix().prepend(this.getView()._matrix)
            },
            getApplyMatrix: function() {
                return this._applyMatrix
            },
            setApplyMatrix: function(t) {
                (this._applyMatrix = this._canApplyMatrix && !!t) && this.transform(null, !0)
            },
            getTransformContent: "#getApplyMatrix",
            setTransformContent: "#setApplyMatrix"
        }, {
            getProject: function() {
                return this._project
            },
            _setProject: function(t, e) {
                if (this._project !== t) {
                    this._project && this._installEvents(!1), this._project = t;
                    for (var n = this._children, i = 0, r = n && n.length; i < r; i++) n[i]._setProject(t);
                    e = !0
                }
                e && this._installEvents(!0)
            },
            getView: function() {
                return this._project._view
            },
            _installEvents: function t(e) {
                t.base.call(this, e);
                for (var n = this._children, i = 0, r = n && n.length; i < r; i++) n[i]._installEvents(e)
            },
            getLayer: function() {
                for (var t = this; t = t._parent;)
                    if (t instanceof b) return t;
                return null
            },
            getParent: function() {
                return this._parent
            },
            setParent: function(t) {
                return t.addChild(this)
            },
            _getOwner: "#getParent",
            getChildren: function() {
                return this._children
            },
            setChildren: function(t) {
                this.removeChildren(), this.addChildren(t)
            },
            getFirstChild: function() {
                return this._children && this._children[0] || null
            },
            getLastChild: function() {
                return this._children && this._children[this._children.length - 1] || null
            },
            getNextSibling: function() {
                var t = this._getOwner();
                return t && t._children[this._index + 1] || null
            },
            getPreviousSibling: function() {
                var t = this._getOwner();
                return t && t._children[this._index - 1] || null
            },
            getIndex: function() {
                return this._index
            },
            equals: function(t) {
                return t === this || t && this._class === t._class && this._style.equals(t._style) && this._matrix.equals(t._matrix) && this._locked === t._locked && this._visible === t._visible && this._blendMode === t._blendMode && this._opacity === t._opacity && this._clipMask === t._clipMask && this._guide === t._guide && this._equals(t) || !1
            },
            _equals: function(t) {
                return r.equals(this._children, t._children)
            },
            clone: function(t) {
                var n = new this.constructor(w.NO_INSERT),
                    i = this._children,
                    s = r.pick(t ? t.insert : e, t === e || !0 === t),
                    o = r.pick(t ? t.deep : e, !0);
                i && n.copyAttributes(this), i && !o || n.copyContent(this), i || n.copyAttributes(this), s && n.insertAbove(this);
                var a = this._name,
                    h = this._parent;
                if (a && h) {
                    for (var i = h._children, l = a, u = 1; i[a];) a = l + " " + u++;
                    a !== l && n.setName(a)
                }
                return n
            },
            copyContent: function(t) {
                for (var e = t._children, n = 0, i = e && e.length; n < i; n++) this.addChild(e[n].clone(!1), !0)
            },
            copyAttributes: function(t, e) {
                this.setStyle(t._style);
                for (var n = ["_locked", "_visible", "_blendMode", "_opacity", "_clipMask", "_guide"], i = 0, s = n.length; i < s; i++) {
                    var o = n[i];
                    t.hasOwnProperty(o) && (this[o] = t[o])
                }
                e || this._matrix.set(t._matrix, !0), this.setApplyMatrix(t._applyMatrix), this.setPivot(t._pivot), this.setSelection(t._selection);
                var a = t._data,
                    h = t._name;
                this._data = a ? r.clone(a) : null, h && this.setName(h)
            },
            rasterize: function(t, n) {
                var i = this.getStrokeBounds(),
                    s = (t || this.getView().getResolution()) / 72,
                    o = i.getTopLeft().floor(),
                    a = i.getBottomRight().ceil(),
                    h = new f(a.subtract(o)),
                    l = new S(w.NO_INSERT);
                if (!h.isZero()) {
                    var u = tt.getCanvas(h.multiply(s)),
                        c = u.getContext("2d"),
                        d = (new v).scale(s).translate(o.negate());
                    c.save(), d.applyToContext(c), this.draw(c, new r({
                        matrices: [d]
                    })), c.restore(), l.setCanvas(u)
                }
                return l.transform((new v).translate(o.add(h.divide(2))).scale(1 / s)), (n === e || n) && l.insertAbove(this), l
            },
            contains: function() {
                return !!this._contains(this._matrix._inverseTransform(c.read(arguments)))
            },
            _contains: function(t) {
                var e = this._children;
                if (e) {
                    for (var n = e.length - 1; n >= 0; n--)
                        if (e[n].contains(t)) return !0;
                    return !1
                }
                return t.isInside(this.getInternalBounds())
            },
            isInside: function() {
                return g.read(arguments).contains(this.getBounds())
            },
            _asPathItem: function() {
                return new O.Rectangle({
                    rectangle: this.getInternalBounds(),
                    matrix: this._matrix,
                    insert: !1
                })
            },
            intersects: function(t, e) {
                return t instanceof w && this._asPathItem().getIntersections(t._asPathItem(), null, e, !0).length > 0
            }
        }, new function() {
            function t() {
                return this._hitTest(c.read(arguments), P.getOptions(arguments))
            }

            function e() {
                var t = c.read(arguments),
                    e = P.getOptions(arguments),
                    n = [];
                return this._hitTest(t, r.set({
                    all: n
                }, e)), n
            }

            function n(t, e, n, i) {
                var r = this._children;
                if (r)
                    for (var s = r.length - 1; s >= 0; s--) {
                        var o = r[s],
                            a = o !== i && o._hitTest(t, e, n);
                        if (a && !e.all) return a
                    }
                return null
            }
            return y.inject({
                hitTest: t,
                hitTestAll: e,
                _hitTest: n
            }), {
                hitTest: t,
                hitTestAll: e,
                _hitTestChildren: n
            }
        }, {
            _hitTest: function(t, e, n) {
                function i(t) {
                    return t && p && !p(t) && (t = null), t && e.all && e.all.push(t), t
                }

                function s(e, n) {
                    var i = n ? u["get" + n]() : g.getPosition();
                    if (t.subtract(i).divide(l).length <= 1) return new P(e, g, {
                        name: n ? r.hyphenate(n) : e,
                        point: i
                    })
                }
                if (this._locked || !this._visible || this._guide && !e.guides || this.isEmpty()) return null;
                var o = this._matrix,
                    a = n ? n.appended(o) : this.getGlobalMatrix().prepend(this.getView()._matrix),
                    h = Math.max(e.tolerance, 1e-12),
                    l = e._tolerancePadding = new f(O._getStrokePadding(h, o._shiftless().invert()));
                if (!(t = o._inverseTransform(t)) || !this._children && !this.getBounds({
                        internal: !0,
                        stroke: !0,
                        handle: !0
                    }).expand(l.multiply(2))._containsPoint(t)) return null;
                var u, c, d = !(e.guides && !this._guide || e.selected && !this.isSelected() || e.type && e.type !== r.hyphenate(this._class) || e.class && !(this instanceof e.class)),
                    p = e.match,
                    g = this,
                    m = e.position,
                    v = e.center,
                    _ = e.bounds;
                if (d && this._parent && (m || v || _)) {
                    if ((v || _) && (u = this.getInternalBounds()), !(c = m && s("position") || v && s("center", "Center")) && _)
                        for (var y = ["TopLeft", "TopRight", "BottomLeft", "BottomRight", "LeftCenter", "TopCenter", "RightCenter", "BottomCenter"], w = 0; w < 8 && !c; w++) c = s("bounds", y[w]);
                    c = i(c)
                }
                return c || (c = this._hitTestChildren(t, e, a) || d && i(this._hitTestSelf(t, e, a, this.getStrokeScaling() ? null : a._shiftless().invert())) || null), c && c.point && (c.point = o.transform(c.point)), c
            },
            _hitTestSelf: function(t, e) {
                if (e.fill && this.hasFill() && this._contains(t)) return new P("fill", this)
            },
            matches: function(t, e) {
                function n(t, e) {
                    for (var i in t)
                        if (t.hasOwnProperty(i)) {
                            var s = t[i],
                                o = e[i];
                            if (r.isPlainObject(s) && r.isPlainObject(o)) {
                                if (!n(s, o)) return !1
                            } else if (!r.equals(s, o)) return !1
                        }
                    return !0
                }
                var i = typeof t;
                if ("object" === i) {
                    for (var s in t)
                        if (t.hasOwnProperty(s) && !this.matches(s, t[s])) return !1;
                    return !0
                }
                if ("function" === i) return t(this);
                if ("match" === t) return e(this);
                var o = /^(empty|editable)$/.test(t) ? this["is" + r.capitalize(t)]() : "type" === t ? r.hyphenate(this._class) : this[t];
                if ("class" === t) {
                    if ("function" == typeof e) return this instanceof e;
                    o = this._class
                }
                if ("function" == typeof e) return !!e(o);
                if (e) {
                    if (e.test) return e.test(o);
                    if (r.isPlainObject(e)) return n(e, o)
                }
                return r.equals(o, e)
            },
            getItems: function(t) {
                return w._getItems(this, t, this._matrix)
            },
            getItem: function(t) {
                return w._getItems(this, t, this._matrix, null, !0)[0] || null
            },
            statics: {
                _getItems: function t(e, n, i, s, o) {
                    if (!s) {
                        var a = "object" == typeof n && n,
                            h = a && a.overlapping,
                            l = a && a.inside,
                            u = h || l,
                            c = u && g.read([u]);
                        s = {
                            items: [],
                            recursive: a && !1 !== a.recursive,
                            inside: !!l,
                            overlapping: !!h,
                            rect: c,
                            path: h && new O.Rectangle({
                                rectangle: c,
                                insert: !1
                            })
                        }, a && (n = r.filter({}, n, {
                            recursive: !0,
                            inside: !0,
                            overlapping: !0
                        }))
                    }
                    var d = e._children,
                        f = s.items,
                        c = s.rect;
                    i = c && (i || new v);
                    for (var p = 0, m = d && d.length; p < m; p++) {
                        var _ = d[p],
                            y = i && i.appended(_._matrix),
                            w = !0;
                        if (c) {
                            var u = _.getBounds(y);
                            if (!c.intersects(u)) continue;
                            c.contains(u) || s.overlapping && (u.contains(c) || s.path.intersects(_, y)) || (w = !1)
                        }
                        if (w && _.matches(n) && (f.push(_), o)) break;
                        if (!1 !== s.recursive && t(_, n, y, s, o), o && f.length > 0) break
                    }
                    return f
                }
            }
        }, {
            importJSON: function(t) {
                var e = r.importJSON(t, this);
                return e !== this ? this.addChild(e) : e
            },
            addChild: function(t) {
                return this.insertChild(e, t)
            },
            insertChild: function(t, e) {
                var n = e ? this.insertChildren(t, [e]) : null;
                return n && n[0]
            },
            addChildren: function(t) {
                return this.insertChildren(this._children.length, t)
            },
            insertChildren: function(t, e) {
                var n = this._children;
                if (n && e && e.length > 0) {
                    e = r.slice(e);
                    for (var i = {}, s = e.length - 1; s >= 0; s--) {
                        var o = e[s],
                            a = o && o._id;
                        !o || i[a] ? e.splice(s, 1) : (o._remove(!1, !0), i[a] = !0)
                    }
                    r.splice(n, e, t, 0);
                    for (var h = this._project, l = h._changes, s = 0, u = e.length; s < u; s++) {
                        var o = e[s],
                            c = o._name;
                        o._parent = this, o._setProject(h, !0), c && o.setName(c), l && o._changed(5)
                    }
                    this._changed(11)
                } else e = null;
                return e
            },
            _insertItem: "#insertChild",
            _insertAt: function(t, e) {
                var n = t && t._getOwner(),
                    i = t !== this && n ? this : null;
                return i && (i._remove(!1, !0), n._insertItem(t._index + e, i)), i
            },
            insertAbove: function(t) {
                return this._insertAt(t, 1)
            },
            insertBelow: function(t) {
                return this._insertAt(t, 0)
            },
            sendToBack: function() {
                var t = this._getOwner();
                return t ? t._insertItem(0, this) : null
            },
            bringToFront: function() {
                var t = this._getOwner();
                return t ? t._insertItem(e, this) : null
            },
            appendTop: "#addChild",
            appendBottom: function(t) {
                return this.insertChild(0, t)
            },
            moveAbove: "#insertAbove",
            moveBelow: "#insertBelow",
            addTo: function(t) {
                return t._insertItem(e, this)
            },
            copyTo: function(t) {
                return this.clone(!1).addTo(t)
            },
            reduce: function(t) {
                var e = this._children;
                if (e && 1 === e.length) {
                    var n = e[0].reduce(t);
                    return this._parent ? (n.insertAbove(this), this.remove()) : n.remove(), n
                }
                return this
            },
            _removeNamed: function() {
                var t = this._getOwner();
                if (t) {
                    var e = t._children,
                        n = t._namedChildren,
                        i = this._name,
                        r = n[i],
                        s = r ? r.indexOf(this) : -1; - 1 !== s && (e[i] == this && delete e[i], r.splice(s, 1), r.length ? e[i] = r[0] : delete n[i])
                }
            },
            _remove: function(t, e) {
                var n = this._getOwner(),
                    i = this._project,
                    s = this._index;
                return !!n && (this._name && this._removeNamed(), null != s && (i._activeLayer === this && (i._activeLayer = this.getNextSibling() || this.getPreviousSibling()), r.splice(n._children, null, s, 1)), this._installEvents(!1), t && i._changes && this._changed(5), e && n._changed(11, this), this._parent = null, !0)
            },
            remove: function() {
                return this._remove(!0, !0)
            },
            replaceWith: function(t) {
                var e = t && t.insertBelow(this);
                return e && this.remove(), e
            },
            removeChildren: function(t, e) {
                if (!this._children) return null;
                t = t || 0, e = r.pick(e, this._children.length);
                for (var n = r.splice(this._children, null, t, e - t), i = n.length - 1; i >= 0; i--) n[i]._remove(!0, !1);
                return n.length > 0 && this._changed(11), n
            },
            clear: "#removeChildren",
            reverseChildren: function() {
                if (this._children) {
                    this._children.reverse();
                    for (var t = 0, e = this._children.length; t < e; t++) this._children[t]._index = t;
                    this._changed(11)
                }
            },
            isEmpty: function() {
                var t = this._children;
                return !t || !t.length
            },
            isEditable: function() {
                for (var t = this; t;) {
                    if (!t._visible || t._locked) return !1;
                    t = t._parent
                }
                return !0
            },
            hasFill: function() {
                return this.getStyle().hasFill()
            },
            hasStroke: function() {
                return this.getStyle().hasStroke()
            },
            hasShadow: function() {
                return this.getStyle().hasShadow()
            },
            _getOrder: function(t) {
                function e(t) {
                    var e = [];
                    do {
                        e.unshift(t)
                    } while (t = t._parent);
                    return e
                }
                for (var n = e(this), i = e(t), r = 0, s = Math.min(n.length, i.length); r < s; r++)
                    if (n[r] != i[r]) return n[r]._index < i[r]._index ? 1 : -1;
                return 0
            },
            hasChildren: function() {
                return this._children && this._children.length > 0
            },
            isInserted: function() {
                return !!this._parent && this._parent.isInserted()
            },
            isAbove: function(t) {
                return -1 === this._getOrder(t)
            },
            isBelow: function(t) {
                return 1 === this._getOrder(t)
            },
            isParent: function(t) {
                return this._parent === t
            },
            isChild: function(t) {
                return t && t._parent === this
            },
            isDescendant: function(t) {
                for (var e = this; e = e._parent;)
                    if (e === t) return !0;
                return !1
            },
            isAncestor: function(t) {
                return !!t && t.isDescendant(this)
            },
            isSibling: function(t) {
                return this._parent === t._parent
            },
            isGroupedWith: function(t) {
                for (var e = this._parent; e;) {
                    if (e._parent && /^(Group|Layer|CompoundPath)$/.test(e._class) && t.isDescendant(e)) return !0;
                    e = e._parent
                }
                return !1
            }
        }, r.each(["rotate", "scale", "shear", "skew"], function(t) {
            var e = "rotate" === t;
            this[t] = function() {
                var n = (e ? r : c).read(arguments),
                    i = c.read(arguments, 0, {
                        readNull: !0
                    });
                return this.transform((new v)[t](n, i || this.getPosition(!0)))
            }
        }, {
            translate: function() {
                var t = new v;
                return this.transform(t.translate.apply(t, arguments))
            },
            transform: function(t, e, n, i) {
                var r = this._matrix,
                    s = t && !t.isIdentity(),
                    o = (e || this._applyMatrix) && (!r.isIdentity() || s || e && n && this._children);
                if (!s && !o) return this;
                if (s) {
                    !t.isInvertible() && r.isInvertible() && (r._backup = r.getValues()), r.prepend(t, !0);
                    var a = this._style,
                        h = a.getFillColor(!0),
                        l = a.getStrokeColor(!0);
                    h && h.transform(t), l && l.transform(t)
                }
                if (o && (o = this._transformContent(r, n, i))) {
                    var u = this._pivot;
                    u && r._transformPoint(u, u, !0), r.reset(!0), i && this._canApplyMatrix && (this._applyMatrix = !0)
                }
                var c = this._bounds,
                    d = this._position;
                (s || o) && this._changed(9);
                var f = s && c && t.decompose();
                if (f && f.skewing.isZero() && f.rotation % 90 == 0) {
                    for (var p in c) {
                        var g = c[p];
                        if (g.nonscaling) delete c[p];
                        else if (o || !g.internal) {
                            var m = g.rect;
                            t._transformBounds(m, m)
                        }
                    }
                    this._bounds = c;
                    var v = c[this._getBoundsCacheKey(this._boundsOptions || {})];
                    v && (this._position = v.rect.getCenter(!0))
                } else s && d && this._pivot && (this._position = t._transformPoint(d, d));
                return this
            },
            _transformContent: function(t, e, n) {
                var i = this._children;
                if (i) {
                    for (var r = 0, s = i.length; r < s; r++) i[r].transform(t, !0, e, n);
                    return !0
                }
            },
            globalToLocal: function() {
                return this.getGlobalMatrix(!0)._inverseTransform(c.read(arguments))
            },
            localToGlobal: function() {
                return this.getGlobalMatrix(!0)._transformPoint(c.read(arguments))
            },
            parentToLocal: function() {
                return this._matrix._inverseTransform(c.read(arguments))
            },
            localToParent: function() {
                return this._matrix._transformPoint(c.read(arguments))
            },
            fitBounds: function(t, e) {
                t = g.read(arguments);
                var n = this.getBounds(),
                    i = n.height / n.width,
                    r = t.height / t.width,
                    s = (e ? i > r : i < r) ? t.width / n.width : t.height / n.height,
                    o = new g(new c, new f(n.width * s, n.height * s));
                o.setCenter(t.getCenter()), this.setBounds(o)
            }
        }), {
            _setStyles: function(t, e, n) {
                var i = this._style,
                    r = this._matrix;
                if (i.hasFill() && (t.fillStyle = i.getFillColor().toCanvasStyle(t, r)), i.hasStroke()) {
                    t.strokeStyle = i.getStrokeColor().toCanvasStyle(t, r), t.lineWidth = i.getStrokeWidth();
                    var s = i.getStrokeJoin(),
                        o = i.getStrokeCap(),
                        a = i.getMiterLimit();
                    if (s && (t.lineJoin = s), o && (t.lineCap = o), a && (t.miterLimit = a), paper.support.nativeDash) {
                        var h = i.getDashArray(),
                            l = i.getDashOffset();
                        h && h.length && ("setLineDash" in t ? (t.setLineDash(h), t.lineDashOffset = l) : (t.mozDash = h, t.mozDashOffset = l))
                    }
                }
                if (i.hasShadow()) {
                    var u = e.pixelRatio || 1,
                        d = n._shiftless().prepend((new v).scale(u, u)),
                        f = d.transform(new c(i.getShadowBlur(), 0)),
                        p = d.transform(this.getShadowOffset());
                    t.shadowColor = i.getShadowColor().toCanvasStyle(t), t.shadowBlur = f.getLength(), t.shadowOffsetX = p.x, t.shadowOffsetY = p.y
                }
            },
            draw: function(t, e, n) {
                var i = this._updateVersion = this._project._updateVersion;
                if (this._visible && 0 !== this._opacity) {
                    var r = e.matrices,
                        s = e.viewMatrix,
                        o = this._matrix,
                        a = r[r.length - 1].appended(o);
                    if (a.isInvertible()) {
                        s = s ? s.appended(a) : a, r.push(a), e.updateMatrix && (a._updateVersion = i, this._globalMatrix = a);
                        var h, l, u, c = this._blendMode,
                            d = this._opacity,
                            f = "normal" === c,
                            p = et.nativeModes[c],
                            g = f && 1 === d || e.dontStart || e.clip || (p || f && d < 1) && this._canComposite(),
                            m = e.pixelRatio || 1;
                        if (!g) {
                            var v = this.getStrokeBounds(s);
                            if (!v.width || !v.height) return;
                            u = e.offset, l = e.offset = v.getTopLeft().floor(), h = t, t = tt.getContext(v.getSize().ceil().add(1).multiply(m)), 1 !== m && t.scale(m, m)
                        }
                        t.save();
                        var _ = n ? n.appended(o) : this._canScaleStroke && !this.getStrokeScaling(!0) && s,
                            y = !g && e.clipItem,
                            w = !_ || y;
                        if (g ? (t.globalAlpha = d, p && (t.globalCompositeOperation = c)) : w && t.translate(-l.x, -l.y), w && (g ? o : s).applyToContext(t), y && e.clipItem.draw(t, e.extend({
                                clip: !0
                            })), _) {
                            t.setTransform(m, 0, 0, m, 0, 0);
                            var x = e.offset;
                            x && t.translate(-x.x, -x.y)
                        }
                        this._draw(t, e, s, _), t.restore(), r.pop(), e.clip && !e.dontFinish && t.clip(), g || (et.process(c, t, h, d, l.subtract(u).multiply(m)), tt.release(t), e.offset = u)
                    }
                }
            },
            _isUpdated: function(t) {
                var e = this._parent;
                if (e instanceof L) return e._isUpdated(t);
                var n = this._updateVersion === t;
                return !n && e && e._visible && e._isUpdated(t) && (this._updateVersion = t, n = !0), n
            },
            _drawSelection: function(t, e, n, i, r) {
                var s = this._selection,
                    o = 1 & s,
                    a = 2 & s || o && this._selectBounds,
                    h = 4 & s;
                if (this._drawSelected || (o = !1), (o || a || h) && this._isUpdated(r)) {
                    var l, u = this.getSelectedColor(!0) || (l = this.getLayer()) && l.getSelectedColor(!0),
                        c = e.appended(this.getGlobalMatrix(!0)),
                        d = n / 2;
                    if (t.strokeStyle = t.fillStyle = u ? u.toCanvasStyle(t) : "#009dec", o && this._drawSelected(t, c, i), h) {
                        var f = this.getPosition(!0),
                            p = f.x,
                            g = f.y;
                        t.beginPath(), t.arc(p, g, d, 0, 2 * Math.PI, !0), t.stroke();
                        for (var m = [
                                [0, -1],
                                [1, 0],
                                [0, 1],
                                [-1, 0]
                            ], v = d, _ = n + 1, y = 0; y < 4; y++) {
                            var w = m[y],
                                x = w[0],
                                b = w[1];
                            t.moveTo(p + x * v, g + b * v), t.lineTo(p + x * _, g + b * _), t.stroke()
                        }
                    }
                    if (a) {
                        var C = c._transformCorners(this.getInternalBounds());
                        t.beginPath();
                        for (var y = 0; y < 8; y++) t[y ? "lineTo" : "moveTo"](C[y], C[++y]);
                        t.closePath(), t.stroke();
                        for (var y = 0; y < 8; y++) t.fillRect(C[y] - d, C[++y] - d, n, n)
                    }
                }
            },
            _canComposite: function() {
                return !1
            }
        }, r.each(["down", "drag", "up", "move"], function(t) {
            this["removeOn" + r.capitalize(t)] = function() {
                var e = {};
                return e[t] = !0, this.removeOn(e)
            }
        }, {
            removeOn: function(t) {
                for (var e in t)
                    if (t[e]) {
                        var n = "mouse" + e,
                            i = this._project,
                            r = i._removeSets = i._removeSets || {};
                        r[n] = r[n] || {}, r[n][this._id] = this
                    }
                return this
            }
        })),
        x = w.extend({
            _class: "Group",
            _selectBounds: !1,
            _selectChildren: !0,
            _serializeFields: {
                children: []
            },
            initialize: function(t) {
                this._children = [], this._namedChildren = {}, this._initialize(t) || this.addChildren(Array.isArray(t) ? t : arguments)
            },
            _changed: function t(n) {
                t.base.call(this, n), 1026 & n && (this._clipItem = e)
            },
            _getClipItem: function() {
                var t = this._clipItem;
                if (t === e) {
                    t = null;
                    for (var n = this._children, i = 0, r = n.length; i < r; i++)
                        if (n[i]._clipMask) {
                            t = n[i];
                            break
                        }
                    this._clipItem = t
                }
                return t
            },
            isClipped: function() {
                return !!this._getClipItem()
            },
            setClipped: function(t) {
                var e = this.getFirstChild();
                e && e.setClipMask(t)
            },
            _getBounds: function t(e, n) {
                var i = this._getClipItem();
                return i ? i._getCachedBounds(e && e.appended(i._matrix), r.set({}, n, {
                    stroke: !1
                })) : t.base.call(this, e, n)
            },
            _hitTestChildren: function t(e, n, i) {
                var r = this._getClipItem();
                return (!r || r.contains(e)) && t.base.call(this, e, n, i, r)
            },
            _draw: function(t, e) {
                var n = e.clip,
                    i = !n && this._getClipItem();
                e = e.extend({
                    clipItem: i,
                    clip: !1
                }), n ? (t.beginPath(), e.dontStart = e.dontFinish = !0) : i && i.draw(t, e.extend({
                    clip: !0
                }));
                for (var r = this._children, s = 0, o = r.length; s < o; s++) {
                    var a = r[s];
                    a !== i && a.draw(t, e)
                }
            }
        }),
        b = x.extend({
            _class: "Layer",
            initialize: function() {
                x.apply(this, arguments)
            },
            _getOwner: function() {
                return this._parent || null != this._index && this._project
            },
            isInserted: function t() {
                return this._parent ? t.base.call(this) : null != this._index
            },
            activate: function() {
                this._project._activeLayer = this
            },
            _hitTestSelf: function() {}
        }),
        C = w.extend({
            _class: "Shape",
            _applyMatrix: !1,
            _canApplyMatrix: !1,
            _canScaleStroke: !0,
            _serializeFields: {
                type: null,
                size: null,
                radius: null
            },
            initialize: function(t, e) {
                this._initialize(t, e)
            },
            _equals: function(t) {
                return this._type === t._type && this._size.equals(t._size) && r.equals(this._radius, t._radius)
            },
            copyContent: function(t) {
                this.setType(t._type), this.setSize(t._size), this.setRadius(t._radius)
            },
            getType: function() {
                return this._type
            },
            setType: function(t) {
                this._type = t
            },
            getShape: "#getType",
            setShape: "#setType",
            getSize: function() {
                var t = this._size;
                return new p(t.width, t.height, this, "setSize")
            },
            setSize: function() {
                var t = f.read(arguments);
                if (this._size) {
                    if (!this._size.equals(t)) {
                        var e = this._type,
                            n = t.width,
                            i = t.height;
                        "rectangle" === e ? this._radius.set(f.min(this._radius, t.divide(2))) : "circle" === e ? (n = i = (n + i) / 2, this._radius = n / 2) : "ellipse" === e && this._radius._set(n / 2, i / 2), this._size._set(n, i), this._changed(9)
                    }
                } else this._size = t.clone()
            },
            getRadius: function() {
                var t = this._radius;
                return "circle" === this._type ? t : new p(t.width, t.height, this, "setRadius")
            },
            setRadius: function(t) {
                var e = this._type;
                if ("circle" === e) {
                    if (t === this._radius) return;
                    var n = 2 * t;
                    this._radius = t, this._size._set(n, n)
                } else if (t = f.read(arguments), this._radius) {
                    if (this._radius.equals(t)) return;
                    if (this._radius.set(t), "rectangle" === e) {
                        var n = f.max(this._size, t.multiply(2));
                        this._size.set(n)
                    } else "ellipse" === e && this._size._set(2 * t.width, 2 * t.height)
                } else this._radius = t.clone();
                this._changed(9)
            },
            isEmpty: function() {
                return !1
            },
            toPath: function(t) {
                var n = new(O[r.capitalize(this._type)])({
                    center: new c,
                    size: this._size,
                    radius: this._radius,
                    insert: !1
                });
                return n.copyAttributes(this), paper.settings.applyMatrix && n.setApplyMatrix(!0), (t === e || t) && n.insertAbove(this), n
            },
            toShape: "#clone",
            _asPathItem: function() {
                return this.toPath(!1)
            },
            _draw: function(t, e, n, i) {
                var r = this._style,
                    s = r.hasFill(),
                    o = r.hasStroke(),
                    a = e.dontFinish || e.clip,
                    h = !i;
                if (s || o || a) {
                    var l = this._type,
                        u = this._radius,
                        c = "circle" === l;
                    if (e.dontStart || t.beginPath(), h && c) t.arc(0, 0, u, 0, 2 * Math.PI, !0);
                    else {
                        var d = c ? u : u.width,
                            f = c ? u : u.height,
                            p = this._size,
                            g = p.width,
                            m = p.height;
                        if (h && "rectangle" === l && 0 === d && 0 === f) t.rect(-g / 2, -m / 2, g, m);
                        else {
                            var v = g / 2,
                                _ = m / 2,
                                y = .44771525016920644,
                                w = d * y,
                                x = f * y,
                                b = [-v, -_ + f, -v, -_ + x, -v + w, -_, -v + d, -_, v - d, -_, v - w, -_, v, -_ + x, v, -_ + f, v, _ - f, v, _ - x, v - w, _, v - d, _, -v + d, _, -v + w, _, -v, _ - x, -v, _ - f];
                            i && i.transform(b, b, 32), t.moveTo(b[0], b[1]), t.bezierCurveTo(b[2], b[3], b[4], b[5], b[6], b[7]), v !== d && t.lineTo(b[8], b[9]), t.bezierCurveTo(b[10], b[11], b[12], b[13], b[14], b[15]), _ !== f && t.lineTo(b[16], b[17]), t.bezierCurveTo(b[18], b[19], b[20], b[21], b[22], b[23]), v !== d && t.lineTo(b[24], b[25]), t.bezierCurveTo(b[26], b[27], b[28], b[29], b[30], b[31])
                        }
                    }
                    t.closePath()
                }
                a || !s && !o || (this._setStyles(t, e, n), s && (t.fill(r.getFillRule()), t.shadowColor = "rgba(0,0,0,0)"), o && t.stroke())
            },
            _canComposite: function() {
                return !(this.hasFill() && this.hasStroke())
            },
            _getBounds: function(t, e) {
                var n = new g(this._size).setCenter(0, 0),
                    i = this._style,
                    r = e.stroke && i.hasStroke() && i.getStrokeWidth();
                return t && (n = t._transformBounds(n)), r ? n.expand(O._getStrokePadding(r, this._getStrokeMatrix(t, e))) : n
            }
        }, new function() {
            function t(t, e, n) {
                var i = t._radius;
                if (!i.isZero())
                    for (var r = t._size.divide(2), s = 1; s <= 4; s++) {
                        var o = new c(s > 1 && s < 4 ? -1 : 1, s > 2 ? -1 : 1),
                            a = o.multiply(r),
                            h = a.subtract(o.multiply(i)),
                            l = new g(n ? a.add(o.multiply(n)) : a, h);
                        if (l.contains(e)) return {
                            point: h,
                            quadrant: s
                        }
                    }
            }

            function e(t, e, n, i) {
                var r = t.divide(e);
                return (!i || r.isInQuadrant(i)) && r.subtract(r.normalize()).multiply(e).divide(n).length <= 1
            }
            return {
                _contains: function e(n) {
                    if ("rectangle" === this._type) {
                        var i = t(this, n);
                        return i ? n.subtract(i.point).divide(this._radius).getLength() <= 1 : e.base.call(this, n)
                    }
                    return n.divide(this.size).getLength() <= .5
                },
                _hitTestSelf: function n(i, r, s, o) {
                    var a = !1,
                        h = this._style,
                        l = r.stroke && h.hasStroke(),
                        u = r.fill && h.hasFill();
                    if (l || u) {
                        var c = this._type,
                            d = this._radius,
                            f = l ? h.getStrokeWidth() / 2 : 0,
                            p = r._tolerancePadding.add(O._getStrokePadding(f, !h.getStrokeScaling() && o));
                        if ("rectangle" === c) {
                            var m = p.multiply(2),
                                v = t(this, i, m);
                            if (v) a = e(i.subtract(v.point), d, p, v.quadrant);
                            else {
                                var _ = new g(this._size).setCenter(0, 0),
                                    y = _.expand(m),
                                    w = _.expand(m.negate());
                                a = y._containsPoint(i) && !w._containsPoint(i)
                            }
                        } else a = e(i, d, p)
                    }
                    return a ? new P(l ? "stroke" : "fill", this) : n.base.apply(this, arguments)
                }
            }
        }, {
            statics: new function() {
                function t(t, e, n, i, s) {
                    var o = new C(r.getNamed(s), e);
                    return o._type = t, o._size = n, o._radius = i, o
                }
                return {
                    Circle: function() {
                        var e = c.readNamed(arguments, "center"),
                            n = r.readNamed(arguments, "radius");
                        return t("circle", e, new f(2 * n), n, arguments)
                    },
                    Rectangle: function() {
                        var e = g.readNamed(arguments, "rectangle"),
                            n = f.min(f.readNamed(arguments, "radius"), e.getSize(!0).divide(2));
                        return t("rectangle", e.getCenter(!0), e.getSize(!0), n, arguments)
                    },
                    Ellipse: function() {
                        var e = C._readEllipse(arguments),
                            n = e.radius;
                        return t("ellipse", e.center, n.multiply(2), n, arguments)
                    },
                    _readEllipse: function(t) {
                        var e, n;
                        if (r.hasNamed(t, "radius")) e = c.readNamed(t, "center"), n = f.readNamed(t, "radius");
                        else {
                            var i = g.readNamed(t, "rectangle");
                            e = i.getCenter(!0), n = i.getSize(!0).divide(2)
                        }
                        return {
                            center: e,
                            radius: n
                        }
                    }
                }
            }
        }),
        S = w.extend({
            _class: "Raster",
            _applyMatrix: !1,
            _canApplyMatrix: !1,
            _boundsOptions: {
                stroke: !1,
                handle: !1
            },
            _serializeFields: {
                crossOrigin: null,
                source: null
            },
            _prioritize: ["crossOrigin"],
            initialize: function(t, n) {
                if (!this._initialize(t, n !== e && c.read(arguments, 1))) {
                    var r = "string" == typeof t ? i.getElementById(t) : t;
                    r ? this.setImage(r) : this.setSource(t)
                }
                this._size || (this._size = new f, this._loaded = !1)
            },
            _equals: function(t) {
                return this.getSource() === t.getSource()
            },
            copyContent: function(t) {
                var e = t._image,
                    n = t._canvas;
                if (e) this._setImage(e);
                else if (n) {
                    var i = tt.getCanvas(t._size);
                    i.getContext("2d").drawImage(n, 0, 0), this._setImage(i)
                }
                this._crossOrigin = t._crossOrigin
            },
            getSize: function() {
                var t = this._size;
                return new p(t ? t.width : 0, t ? t.height : 0, this, "setSize")
            },
            setSize: function() {
                var t = f.read(arguments);
                if (!t.equals(this._size))
                    if (t.width > 0 && t.height > 0) {
                        var e = this.getElement();
                        this._setImage(tt.getCanvas(t)), e && this.getContext(!0).drawImage(e, 0, 0, t.width, t.height)
                    } else this._canvas && tt.release(this._canvas), this._size = t.clone()
            },
            getWidth: function() {
                return this._size ? this._size.width : 0
            },
            setWidth: function(t) {
                this.setSize(t, this.getHeight())
            },
            getHeight: function() {
                return this._size ? this._size.height : 0
            },
            setHeight: function(t) {
                this.setSize(this.getWidth(), t)
            },
            getLoaded: function() {
                return this._loaded
            },
            isEmpty: function() {
                var t = this._size;
                return !t || 0 === t.width && 0 === t.height
            },
            getResolution: function() {
                var t = this._matrix,
                    e = new c(0, 0).transform(t),
                    n = new c(1, 0).transform(t).subtract(e),
                    i = new c(0, 1).transform(t).subtract(e);
                return new f(72 / n.getLength(), 72 / i.getLength())
            },
            getPpi: "#getResolution",
            getImage: function() {
                return this._image
            },
            setImage: function(t) {
                function e(t) {
                    var e = n.getView(),
                        i = t && t.type || "load";
                    e && n.responds(i) && (paper = e._scope, n.emit(i, new X(t)))
                }
                var n = this;
                this._setImage(t), this._loaded ? setTimeout(e, 0) : t && V.add(t, {
                    load: function(i) {
                        n._setImage(t), e(i)
                    },
                    error: e
                })
            },
            _setImage: function(t) {
                this._canvas && tt.release(this._canvas), t && t.getContext ? (this._image = null, this._canvas = t, this._loaded = !0) : (this._image = t, this._canvas = null, this._loaded = !!(t && t.src && t.complete)), this._size = new f(t ? t.naturalWidth || t.width : 0, t ? t.naturalHeight || t.height : 0), this._context = null, this._changed(521)
            },
            getCanvas: function() {
                if (!this._canvas) {
                    var t = tt.getContext(this._size);
                    try {
                        this._image && t.drawImage(this._image, 0, 0), this._canvas = t.canvas
                    } catch (e) {
                        tt.release(t)
                    }
                }
                return this._canvas
            },
            setCanvas: "#setImage",
            getContext: function(t) {
                return this._context || (this._context = this.getCanvas().getContext("2d")), t && (this._image = null, this._changed(513)), this._context
            },
            setContext: function(t) {
                this._context = t
            },
            getSource: function() {
                var t = this._image;
                return t && t.src || this.toDataURL()
            },
            setSource: function(e) {
                var n = new t.Image,
                    i = this._crossOrigin;
                i && (n.crossOrigin = i), n.src = e, this.setImage(n)
            },
            getCrossOrigin: function() {
                var t = this._image;
                return t && t.crossOrigin || this._crossOrigin || ""
            },
            setCrossOrigin: function(t) {
                this._crossOrigin = t;
                var e = this._image;
                e && (e.crossOrigin = t)
            },
            getElement: function() {
                return this._canvas || this._loaded && this._image
            }
        }, {
            beans: !1,
            getSubCanvas: function() {
                var t = g.read(arguments),
                    e = tt.getContext(t.getSize());
                return e.drawImage(this.getCanvas(), t.x, t.y, t.width, t.height, 0, 0, t.width, t.height), e.canvas
            },
            getSubRaster: function() {
                var t = g.read(arguments),
                    e = new S(w.NO_INSERT);
                return e._setImage(this.getSubCanvas(t)), e.translate(t.getCenter().subtract(this.getSize().divide(2))), e._matrix.prepend(this._matrix), e.insertAbove(this), e
            },
            toDataURL: function() {
                var t = this._image,
                    e = t && t.src;
                if (/^data:/.test(e)) return e;
                var n = this.getCanvas();
                return n ? n.toDataURL.apply(n, arguments) : null
            },
            drawImage: function(t) {
                var e = c.read(arguments, 1);
                this.getContext(!0).drawImage(t, e.x, e.y)
            },
            getAverageColor: function(t) {
                var e, n;
                if (t ? t instanceof M ? (n = t, e = t.getBounds()) : "object" == typeof t && ("width" in t ? e = new g(t) : "x" in t && (e = new g(t.x - .5, t.y - .5, 1, 1))) : e = this.getBounds(), !e) return null;
                var i = Math.min(e.width, 32),
                    s = Math.min(e.height, 32),
                    o = S._sampleContext;
                o ? o.clearRect(0, 0, 33, 33) : o = S._sampleContext = tt.getContext(new f(32)), o.save();
                var a = (new v).scale(i / e.width, s / e.height).translate(-e.x, -e.y);
                a.applyToContext(o), n && n.draw(o, new r({
                    clip: !0,
                    matrices: [a]
                })), this._matrix.applyToContext(o);
                var h = this.getElement(),
                    l = this._size;
                h && o.drawImage(h, -l.width / 2, -l.height / 2), o.restore();
                for (var u = o.getImageData(.5, .5, Math.ceil(i), Math.ceil(s)).data, c = [0, 0, 0], d = 0, p = 0, m = u.length; p < m; p += 4) {
                    var _ = u[p + 3];
                    d += _, _ /= 255, c[0] += u[p] * _, c[1] += u[p + 1] * _, c[2] += u[p + 2] * _
                }
                for (var p = 0; p < 3; p++) c[p] /= d;
                return d ? H.read(c) : null
            },
            getPixel: function() {
                var t = c.read(arguments),
                    e = this.getContext().getImageData(t.x, t.y, 1, 1).data;
                return new H("rgb", [e[0] / 255, e[1] / 255, e[2] / 255], e[3] / 255)
            },
            setPixel: function() {
                var t = c.read(arguments),
                    e = H.read(arguments),
                    n = e._convert("rgb"),
                    i = e._alpha,
                    r = this.getContext(!0),
                    s = r.createImageData(1, 1),
                    o = s.data;
                o[0] = 255 * n[0], o[1] = 255 * n[1], o[2] = 255 * n[2], o[3] = null != i ? 255 * i : 255, r.putImageData(s, t.x, t.y)
            },
            createImageData: function() {
                var t = f.read(arguments);
                return this.getContext().createImageData(t.width, t.height)
            },
            getImageData: function() {
                var t = g.read(arguments);
                return t.isEmpty() && (t = new g(this._size)), this.getContext().getImageData(t.x, t.y, t.width, t.height)
            },
            setImageData: function(t) {
                var e = c.read(arguments, 1);
                this.getContext(!0).putImageData(t, e.x, e.y)
            },
            _getBounds: function(t, e) {
                var n = new g(this._size).setCenter(0, 0);
                return t ? t._transformBounds(n) : n
            },
            _hitTestSelf: function(t) {
                if (this._contains(t)) {
                    var e = this;
                    return new P("pixel", e, {
                        offset: t.add(e._size.divide(2)).round(),
                        color: {
                            get: function() {
                                return e.getPixel(this.offset)
                            }
                        }
                    })
                }
            },
            _draw: function(t) {
                var e = this.getElement();
                e && (t.globalAlpha = this._opacity, t.drawImage(e, -this._size.width / 2, -this._size.height / 2))
            },
            _canComposite: function() {
                return !0
            }
        }),
        T = w.extend({
            _class: "SymbolItem",
            _applyMatrix: !1,
            _canApplyMatrix: !1,
            _boundsOptions: {
                stroke: !0
            },
            _serializeFields: {
                symbol: null
            },
            initialize: function(t, n) {
                this._initialize(t, n !== e && c.read(arguments, 1)) || this.setDefinition(t instanceof E ? t : new E(t))
            },
            _equals: function(t) {
                return this._definition === t._definition
            },
            copyContent: function(t) {
                this.setDefinition(t._definition)
            },
            getDefinition: function() {
                return this._definition
            },
            setDefinition: function(t) {
                this._definition = t, this._changed(9)
            },
            getSymbol: "#getDefinition",
            setSymbol: "#setDefinition",
            isEmpty: function() {
                return this._definition._item.isEmpty()
            },
            _getBounds: function(t, e) {
                var n = this._definition._item;
                return n._getCachedBounds(n._matrix.prepended(t), e)
            },
            _hitTestSelf: function(t, e, n) {
                var i = this._definition._item._hitTest(t, e, n);
                return i && (i.item = this), i
            },
            _draw: function(t, e) {
                this._definition._item.draw(t, e)
            }
        }),
        E = r.extend({
            _class: "SymbolDefinition",
            initialize: function(t, e) {
                this._id = u.get(), this.project = paper.project, t && this.setItem(t, e)
            },
            _serialize: function(t, e) {
                return e.add(this, function() {
                    return r.serialize([this._class, this._item], t, !1, e)
                })
            },
            _changed: function(t) {
                8 & t && w._clearBoundsCache(this), 1 & t && this.project._changed(t)
            },
            getItem: function() {
                return this._item
            },
            setItem: function(t, e) {
                t._symbol && (t = t.clone()), this._item && (this._item._symbol = null), this._item = t, t.remove(), t.setSelected(!1), e || t.setPosition(new c), t._symbol = this, this._changed(9)
            },
            getDefinition: "#getItem",
            setDefinition: "#setItem",
            place: function(t) {
                return new T(this, t)
            },
            clone: function() {
                return new E(this._item.clone(!1))
            },
            equals: function(t) {
                return t === this || t && this._item.equals(t._item) || !1
            }
        }),
        P = r.extend({
            _class: "HitResult",
            initialize: function(t, e, n) {
                this.type = t, this.item = e, n && this.inject(n)
            },
            statics: {
                getOptions: function(t) {
                    var e = t && r.read(t);
                    return r.set({
                        type: null,
                        tolerance: paper.settings.hitTolerance,
                        fill: !e,
                        stroke: !e,
                        segments: !e,
                        handles: !1,
                        ends: !1,
                        position: !1,
                        center: !1,
                        bounds: !1,
                        guides: !1,
                        selected: !1
                    }, e)
                }
            }
        }),
        k = r.extend({
            _class: "Segment",
            beans: !0,
            _selection: 0,
            initialize: function(t, n, i, r, s, o) {
                var a, h, l, u, c = arguments.length;
                c > 0 && (null == t || "object" == typeof t ? 1 === c && t && "point" in t ? (a = t.point, h = t.handleIn, l = t.handleOut, u = t.selection) : (a = t, h = n, l = i, u = r) : (a = [t, n], h = i !== e ? [i, r] : null, l = s !== e ? [s, o] : null)), new A(a, this, "_point"), new A(h, this, "_handleIn"), new A(l, this, "_handleOut"), u && this.setSelection(u)
            },
            _serialize: function(t, e) {
                var n = this._point,
                    i = this._selection,
                    s = i || this.hasHandles() ? [n, this._handleIn, this._handleOut] : n;
                return i && s.push(i), r.serialize(s, t, !0, e)
            },
            _changed: function(t) {
                var e = this._path;
                if (e) {
                    var n, i = e._curves,
                        r = this._index;
                    i && (t && t !== this._point && t !== this._handleIn || !(n = r > 0 ? i[r - 1] : e._closed ? i[i.length - 1] : null) || n._changed(), t && t !== this._point && t !== this._handleOut || !(n = i[r]) || n._changed()), e._changed(25)
                }
            },
            getPoint: function() {
                return this._point
            },
            setPoint: function() {
                this._point.set(c.read(arguments))
            },
            getHandleIn: function() {
                return this._handleIn
            },
            setHandleIn: function() {
                this._handleIn.set(c.read(arguments))
            },
            getHandleOut: function() {
                return this._handleOut
            },
            setHandleOut: function() {
                this._handleOut.set(c.read(arguments))
            },
            hasHandles: function() {
                return !this._handleIn.isZero() || !this._handleOut.isZero()
            },
            isSmooth: function() {
                var t = this._handleIn,
                    e = this._handleOut;
                return !t.isZero() && !e.isZero() && t.isCollinear(e)
            },
            clearHandles: function() {
                this._handleIn._set(0, 0), this._handleOut._set(0, 0)
            },
            getSelection: function() {
                return this._selection
            },
            setSelection: function(t) {
                var e = this._selection,
                    n = this._path;
                this._selection = t = t || 0, n && t !== e && (n._updateSelection(this, e, t), n._changed(129))
            },
            _changeSelection: function(t, e) {
                var n = this._selection;
                this.setSelection(e ? n | t : n & ~t)
            },
            isSelected: function() {
                return !!(7 & this._selection)
            },
            setSelected: function(t) {
                this._changeSelection(7, t)
            },
            getIndex: function() {
                return this._index !== e ? this._index : null
            },
            getPath: function() {
                return this._path || null
            },
            getCurve: function() {
                var t = this._path,
                    e = this._index;
                return t ? (e > 0 && !t._closed && e === t._segments.length - 1 && e--, t.getCurves()[e] || null) : null
            },
            getLocation: function() {
                var t = this.getCurve();
                return t ? new I(t, this === t._segment1 ? 0 : 1) : null
            },
            getNext: function() {
                var t = this._path && this._path._segments;
                return t && (t[this._index + 1] || this._path._closed && t[0]) || null
            },
            smooth: function(t, n, i) {
                var r = t || {},
                    s = r.type,
                    o = r.factor,
                    a = this.getPrevious(),
                    h = this.getNext(),
                    l = (a || this)._point,
                    u = this._point,
                    d = (h || this)._point,
                    f = l.getDistance(u),
                    p = u.getDistance(d);
                if (s && "catmull-rom" !== s) {
                    if ("geometric" !== s) throw new Error("Smoothing method '" + s + "' not supported.");
                    if (a && h) {
                        var g = l.subtract(d),
                            m = o === e ? .4 : o,
                            v = m * f / (f + p);
                        n || this.setHandleIn(g.multiply(v)), i || this.setHandleOut(g.multiply(v - m))
                    }
                } else {
                    var _ = o === e ? .5 : o,
                        y = Math.pow(f, _),
                        w = y * y,
                        x = Math.pow(p, _),
                        b = x * x;
                    if (!n && a) {
                        var C = 2 * b + 3 * x * y + w,
                            S = 3 * x * (x + y);
                        this.setHandleIn(0 !== S ? new c((b * l._x + C * u._x - w * d._x) / S - u._x, (b * l._y + C * u._y - w * d._y) / S - u._y) : new c)
                    }
                    if (!i && h) {
                        var C = 2 * w + 3 * y * x + b,
                            S = 3 * y * (y + x);
                        this.setHandleOut(0 !== S ? new c((w * d._x + C * u._x - b * l._x) / S - u._x, (w * d._y + C * u._y - b * l._y) / S - u._y) : new c)
                    }
                }
            },
            getPrevious: function() {
                var t = this._path && this._path._segments;
                return t && (t[this._index - 1] || this._path._closed && t[t.length - 1]) || null
            },
            isFirst: function() {
                return !this._index
            },
            isLast: function() {
                var t = this._path;
                return t && this._index === t._segments.length - 1 || !1
            },
            reverse: function() {
                var t = this._handleIn,
                    e = this._handleOut,
                    n = t.clone();
                t.set(e), e.set(n)
            },
            reversed: function() {
                return new k(this._point, this._handleOut, this._handleIn)
            },
            remove: function() {
                return !!this._path && !!this._path.removeSegment(this._index)
            },
            clone: function() {
                return new k(this._point, this._handleIn, this._handleOut)
            },
            equals: function(t) {
                return t === this || t && this._class === t._class && this._point.equals(t._point) && this._handleIn.equals(t._handleIn) && this._handleOut.equals(t._handleOut) || !1
            },
            toString: function() {
                var t = ["point: " + this._point];
                return this._handleIn.isZero() || t.push("handleIn: " + this._handleIn), this._handleOut.isZero() || t.push("handleOut: " + this._handleOut), "{ " + t.join(", ") + " }"
            },
            transform: function(t) {
                this._transformCoordinates(t, new Array(6), !0), this._changed()
            },
            interpolate: function(t, e, n) {
                var i = 1 - n,
                    r = n,
                    s = t._point,
                    o = e._point,
                    a = t._handleIn,
                    h = e._handleIn,
                    l = e._handleOut,
                    u = t._handleOut;
                this._point._set(i * s._x + r * o._x, i * s._y + r * o._y, !0), this._handleIn._set(i * a._x + r * h._x, i * a._y + r * h._y, !0), this._handleOut._set(i * u._x + r * l._x, i * u._y + r * l._y, !0), this._changed()
            },
            _transformCoordinates: function(t, e, n) {
                var i = this._point,
                    r = n && this._handleIn.isZero() ? null : this._handleIn,
                    s = n && this._handleOut.isZero() ? null : this._handleOut,
                    o = i._x,
                    a = i._y,
                    h = 2;
                return e[0] = o, e[1] = a, r && (e[h++] = r._x + o, e[h++] = r._y + a), s && (e[h++] = s._x + o, e[h++] = s._y + a), t && (t._transformCoordinates(e, e, h / 2), o = e[0], a = e[1], n ? (i._x = o, i._y = a, h = 2, r && (r._x = e[h++] - o, r._y = e[h++] - a), s && (s._x = e[h++] - o, s._y = e[h++] - a)) : (r || (e[h++] = o, e[h++] = a), s || (e[h++] = o, e[h++] = a))), e
            }
        }),
        A = c.extend({
            initialize: function(t, n, i) {
                var r, s, o;
                if (t)
                    if ((r = t[0]) !== e) s = t[1];
                    else {
                        var a = t;
                        (r = a.x) === e && (a = c.read(arguments), r = a.x), s = a.y, o = a.selected
                    }
                else r = s = 0;
                this._x = r, this._y = s, this._owner = n, n[i] = this, o && this.setSelected(!0)
            },
            _set: function(t, e) {
                return this._x = t, this._y = e, this._owner._changed(this), this
            },
            getX: function() {
                return this._x
            },
            setX: function(t) {
                this._x = t, this._owner._changed(this)
            },
            getY: function() {
                return this._y
            },
            setY: function(t) {
                this._y = t, this._owner._changed(this)
            },
            isZero: function() {
                var t = l.isZero;
                return t(this._x) && t(this._y)
            },
            isSelected: function() {
                return !!(this._owner._selection & this._getSelection())
            },
            setSelected: function(t) {
                this._owner._changeSelection(this._getSelection(), t)
            },
            _getSelection: function() {
                var t = this._owner;
                return this === t._point ? 1 : this === t._handleIn ? 2 : this === t._handleOut ? 4 : 0
            }
        }),
        z = r.extend({
            _class: "Curve",
            beans: !0,
            initialize: function(t, e, n, i, r, s, o, a) {
                var h, l, u, c, d, f, p = arguments.length;
                3 === p ? (this._path = t, h = e, l = n) : p ? 1 === p ? "segment1" in t ? (h = new k(t.segment1), l = new k(t.segment2)) : "point1" in t ? (u = t.point1, d = t.handle1, f = t.handle2, c = t.point2) : Array.isArray(t) && (u = [t[0], t[1]], c = [t[6], t[7]], d = [t[2] - t[0], t[3] - t[1]], f = [t[4] - t[6], t[5] - t[7]]) : 2 === p ? (h = new k(t), l = new k(e)) : 4 === p ? (u = t, d = e, f = n, c = i) : 8 === p && (u = [t, e], c = [o, a], d = [n - t, i - e], f = [r - o, s - a]) : (h = new k, l = new k), this._segment1 = h || new k(u, null, d), this._segment2 = l || new k(c, f, null)
            },
            _serialize: function(t, e) {
                return r.serialize(this.hasHandles() ? [this.getPoint1(), this.getHandle1(), this.getHandle2(), this.getPoint2()] : [this.getPoint1(), this.getPoint2()], t, !0, e)
            },
            _changed: function() {
                this._length = this._bounds = e
            },
            clone: function() {
                return new z(this._segment1, this._segment2)
            },
            toString: function() {
                var t = ["point1: " + this._segment1._point];
                return this._segment1._handleOut.isZero() || t.push("handle1: " + this._segment1._handleOut), this._segment2._handleIn.isZero() || t.push("handle2: " + this._segment2._handleIn), t.push("point2: " + this._segment2._point), "{ " + t.join(", ") + " }"
            },
            classify: function() {
                return z.classify(this.getValues())
            },
            remove: function() {
                var t = !1;
                if (this._path) {
                    var e = this._segment2,
                        n = e._handleOut;
                    t = e.remove(), t && this._segment1._handleOut.set(n)
                }
                return t
            },
            getPoint1: function() {
                return this._segment1._point
            },
            setPoint1: function() {
                this._segment1._point.set(c.read(arguments))
            },
            getPoint2: function() {
                return this._segment2._point
            },
            setPoint2: function() {
                this._segment2._point.set(c.read(arguments))
            },
            getHandle1: function() {
                return this._segment1._handleOut
            },
            setHandle1: function() {
                this._segment1._handleOut.set(c.read(arguments))
            },
            getHandle2: function() {
                return this._segment2._handleIn
            },
            setHandle2: function() {
                this._segment2._handleIn.set(c.read(arguments))
            },
            getSegment1: function() {
                return this._segment1
            },
            getSegment2: function() {
                return this._segment2
            },
            getPath: function() {
                return this._path
            },
            getIndex: function() {
                return this._segment1._index
            },
            getNext: function() {
                var t = this._path && this._path._curves;
                return t && (t[this._segment1._index + 1] || this._path._closed && t[0]) || null
            },
            getPrevious: function() {
                var t = this._path && this._path._curves;
                return t && (t[this._segment1._index - 1] || this._path._closed && t[t.length - 1]) || null
            },
            isFirst: function() {
                return !this._segment1._index
            },
            isLast: function() {
                var t = this._path;
                return t && this._segment1._index === t._curves.length - 1 || !1
            },
            isSelected: function() {
                return this.getPoint1().isSelected() && this.getHandle1().isSelected() && this.getHandle2().isSelected() && this.getPoint2().isSelected()
            },
            setSelected: function(t) {
                this.getPoint1().setSelected(t), this.getHandle1().setSelected(t), this.getHandle2().setSelected(t), this.getPoint2().setSelected(t)
            },
            getValues: function(t) {
                return z.getValues(this._segment1, this._segment2, t)
            },
            getPoints: function() {
                for (var t = this.getValues(), e = [], n = 0; n < 8; n += 2) e.push(new c(t[n], t[n + 1]));
                return e
            }
        }, {
            getLength: function() {
                return null == this._length && (this._length = z.getLength(this.getValues(), 0, 1)), this._length
            },
            getArea: function() {
                return z.getArea(this.getValues())
            },
            getLine: function() {
                return new _(this._segment1._point, this._segment2._point)
            },
            getPart: function(t, e) {
                return new z(z.getPart(this.getValues(), t, e))
            },
            getPartLength: function(t, e) {
                return z.getLength(this.getValues(), t, e)
            },
            divideAt: function(t) {
                return this.divideAtTime(t && t.curve === this ? t.time : this.getTimeAt(t))
            },
            divideAtTime: function(t, e) {
                var n = null;
                if (t >= 1e-8 && t <= 1 - 1e-8) {
                    var i = z.subdivide(this.getValues(), t),
                        r = i[0],
                        s = i[1],
                        o = e || this.hasHandles(),
                        a = this._segment1,
                        h = this._segment2,
                        l = this._path;
                    o && (a._handleOut._set(r[2] - r[0], r[3] - r[1]), h._handleIn._set(s[4] - s[6], s[5] - s[7]));
                    var u = r[6],
                        d = r[7],
                        f = new k(new c(u, d), o && new c(r[4] - u, r[5] - d), o && new c(s[2] - u, s[3] - d));
                    l ? (l.insert(a._index + 1, f), n = this.getNext()) : (this._segment2 = f, this._changed(), n = new z(f, h))
                }
                return n
            },
            splitAt: function(t) {
                var e = this._path;
                return e ? e.splitAt(t) : null
            },
            splitAtTime: function(t) {
                return this.splitAt(this.getLocationAtTime(t))
            },
            divide: function(t, n) {
                return this.divideAtTime(t === e ? .5 : n ? t : this.getTimeAt(t))
            },
            split: function(t, n) {
                return this.splitAtTime(t === e ? .5 : n ? t : this.getTimeAt(t))
            },
            reversed: function() {
                return new z(this._segment2.reversed(), this._segment1.reversed())
            },
            clearHandles: function() {
                this._segment1._handleOut._set(0, 0), this._segment2._handleIn._set(0, 0)
            },
            statics: {
                getValues: function(t, e, n, i) {
                    var r = t._point,
                        s = t._handleOut,
                        o = e._handleIn,
                        a = e._point,
                        h = r.x,
                        l = r.y,
                        u = a.x,
                        c = a.y,
                        d = i ? [h, l, h, l, u, c, u, c] : [h, l, h + s._x, l + s._y, u + o._x, c + o._y, u, c];
                    return n && n._transformCoordinates(d, d, 4), d
                },
                subdivide: function(t, n) {
                    var i = t[0],
                        r = t[1],
                        s = t[2],
                        o = t[3],
                        a = t[4],
                        h = t[5],
                        l = t[6],
                        u = t[7];
                    n === e && (n = .5);
                    var c = 1 - n,
                        d = c * i + n * s,
                        f = c * r + n * o,
                        p = c * s + n * a,
                        g = c * o + n * h,
                        m = c * a + n * l,
                        v = c * h + n * u,
                        _ = c * d + n * p,
                        y = c * f + n * g,
                        w = c * p + n * m,
                        x = c * g + n * v,
                        b = c * _ + n * w,
                        C = c * y + n * x;
                    return [
                        [i, r, d, f, _, y, b, C],
                        [b, C, w, x, m, v, l, u]
                    ]
                },
                getMonoCurves: function(t, e) {
                    var n = [],
                        i = e ? 0 : 1,
                        r = t[i + 0],
                        s = t[i + 2],
                        o = t[i + 4],
                        a = t[i + 6];
                    if (r >= s == s >= o && s >= o == o >= a || z.isStraight(t)) n.push(t);
                    else {
                        var h = 3 * (s - o) - r + a,
                            u = 2 * (r + o) - 4 * s,
                            c = s - r,
                            d = [],
                            f = l.solveQuadratic(h, u, c, d, 1e-8, 1 - 1e-8);
                        if (f) {
                            d.sort();
                            var p = d[0],
                                g = z.subdivide(t, p);
                            n.push(g[0]), f > 1 && (p = (d[1] - p) / (1 - p), g = z.subdivide(g[1], p), n.push(g[0])), n.push(g[1])
                        } else n.push(t)
                    }
                    return n
                },
                solveCubic: function(t, e, n, i, r, s) {
                    var o = t[e],
                        a = t[e + 2],
                        h = t[e + 4],
                        u = t[e + 6],
                        c = 0;
                    if (!(o < n && u < n && a < n && h < n || o > n && u > n && a > n && h > n)) {
                        var d = 3 * (a - o),
                            f = 3 * (h - a) - d,
                            p = u - o - d - f;
                        c = l.solveCubic(p, f, d, o - n, i, r, s)
                    }
                    return c
                },
                getTimeOf: function(t, e) {
                    var n = new c(t[0], t[1]),
                        i = new c(t[6], t[7]);
                    if (null === (e.isClose(n, 1e-12) ? 0 : e.isClose(i, 1e-12) ? 1 : null))
                        for (var r = [e.x, e.y], s = [], o = 0; o < 2; o++)
                            for (var a = z.solveCubic(t, o, r[o], s, 0, 1), h = 0; h < a; h++) {
                                var l = s[h];
                                if (e.isClose(z.getPoint(t, l), 1e-7)) return l
                            }
                    return e.isClose(n, 1e-7) ? 0 : e.isClose(i, 1e-7) ? 1 : null
                },
                getNearestTime: function(t, e) {
                    function n(n) {
                        if (n >= 0 && n <= 1) {
                            var i = e.getDistance(z.getPoint(t, n), !0);
                            if (i < d) return d = i, f = n, !0
                        }
                    }
                    if (z.isStraight(t)) {
                        var i = t[0],
                            r = t[1],
                            s = t[6],
                            o = t[7],
                            a = s - i,
                            h = o - r,
                            l = a * a + h * h;
                        if (0 === l) return 0;
                        var u = ((e.x - i) * a + (e.y - r) * h) / l;
                        return u < 1e-12 ? 0 : u > .999999999999 ? 1 : z.getTimeOf(t, new c(i + u * a, r + u * h))
                    }
                    for (var d = 1 / 0, f = 0, p = 0; p <= 100; p++) n(p / 100);
                    for (var g = .005; g > 1e-8;) n(f - g) || n(f + g) || (g /= 2);
                    return f
                },
                getPart: function(t, e, n) {
                    var i = e > n;
                    if (i) {
                        var r = e;
                        e = n, n = r
                    }
                    return e > 0 && (t = z.subdivide(t, e)[1]), n < 1 && (t = z.subdivide(t, (n - e) / (1 - e))[0]), i ? [t[6], t[7], t[4], t[5], t[2], t[3], t[0], t[1]] : t
                },
                isFlatEnough: function(t, e) {
                    var n = t[0],
                        i = t[1],
                        r = t[2],
                        s = t[3],
                        o = t[4],
                        a = t[5],
                        h = t[6],
                        l = t[7],
                        u = 3 * r - 2 * n - h,
                        c = 3 * s - 2 * i - l,
                        d = 3 * o - 2 * h - n,
                        f = 3 * a - 2 * l - i;
                    return Math.max(u * u, d * d) + Math.max(c * c, f * f) <= 16 * e * e
                },
                getArea: function(t) {
                    var e = t[0],
                        n = t[1],
                        i = t[2],
                        r = t[3],
                        s = t[4],
                        o = t[5],
                        a = t[6],
                        h = t[7];
                    return 3 * ((h - n) * (i + s) - (a - e) * (r + o) + r * (e - s) - i * (n - o) + h * (s + e / 3) - a * (o + n / 3)) / 20
                },
                getBounds: function(t) {
                    for (var e = t.slice(0, 2), n = e.slice(), i = [0, 0], r = 0; r < 2; r++) z._addBounds(t[r], t[r + 2], t[r + 4], t[r + 6], r, 0, e, n, i);
                    return new g(e[0], e[1], n[0] - e[0], n[1] - e[1])
                },
                _addBounds: function(t, e, n, i, r, s, o, a, h) {
                    function u(t, e) {
                        var n = t - e,
                            i = t + e;
                        n < o[r] && (o[r] = n), i > a[r] && (a[r] = i)
                    }
                    s /= 2;
                    var c = o[r] - s,
                        d = a[r] + s;
                    if (t < c || e < c || n < c || i < c || t > d || e > d || n > d || i > d)
                        if (e < t != e < i && n < t != n < i) u(t, s), u(i, s);
                        else {
                            var f = 3 * (e - n) - t + i,
                                p = 2 * (t + n) - 4 * e,
                                g = e - t,
                                m = l.solveQuadratic(f, p, g, h);
                            u(i, 0);
                            for (var v = 0; v < m; v++) {
                                var _ = h[v],
                                    y = 1 - _;
                                1e-8 <= _ && _ <= 1 - 1e-8 && u(y * y * y * t + 3 * y * y * _ * e + 3 * y * _ * _ * n + _ * _ * _ * i, s)
                            }
                        }
                }
            }
        }, r.each(["getBounds", "getStrokeBounds", "getHandleBounds"], function(t) {
            this[t] = function() {
                this._bounds || (this._bounds = {});
                var e = this._bounds[t];
                return e || (e = this._bounds[t] = O[t]([this._segment1, this._segment2], !1, this._path)), e.clone()
            }
        }, {}), r.each({
            isStraight: function(t, e, n, i) {
                if (e.isZero() && n.isZero()) return !0;
                var r = i.subtract(t);
                if (r.isZero()) return !1;
                if (r.isCollinear(e) && r.isCollinear(n)) {
                    var s = new _(t, i);
                    if (s.getDistance(t.add(e)) < 1e-7 && s.getDistance(i.add(n)) < 1e-7) {
                        var o = r.dot(r),
                            a = r.dot(e) / o,
                            h = r.dot(n) / o;
                        return a >= 0 && a <= 1 && h <= 0 && h >= -1
                    }
                }
                return !1
            },
            isLinear: function(t, e, n, i) {
                var r = i.subtract(t).divide(3);
                return e.equals(r) && n.negate().equals(r)
            }
        }, function(t, e) {
            this[e] = function(e) {
                var n = this._segment1,
                    i = this._segment2;
                return t(n._point, n._handleOut, i._handleIn, i._point, e)
            }, this.statics[e] = function(e, n) {
                var i = e[0],
                    r = e[1],
                    s = e[6],
                    o = e[7];
                return t(new c(i, r), new c(e[2] - i, e[3] - r), new c(e[4] - s, e[5] - o), new c(s, o), n)
            }
        }, {
            statics: {},
            hasHandles: function() {
                return !this._segment1._handleOut.isZero() || !this._segment2._handleIn.isZero()
            },
            hasLength: function(t) {
                return (!this.getPoint1().equals(this.getPoint2()) || this.hasHandles()) && this.getLength() > (t || 0)
            },
            isCollinear: function(t) {
                return t && this.isStraight() && t.isStraight() && this.getLine().isCollinear(t.getLine())
            },
            isHorizontal: function() {
                return this.isStraight() && Math.abs(this.getTangentAtTime(.5).y) < 1e-8
            },
            isVertical: function() {
                return this.isStraight() && Math.abs(this.getTangentAtTime(.5).x) < 1e-8
            }
        }), {
            beans: !1,
            getLocationAt: function(t, e) {
                return this.getLocationAtTime(e ? t : this.getTimeAt(t))
            },
            getLocationAtTime: function(t) {
                return null != t && t >= 0 && t <= 1 ? new I(this, t) : null
            },
            getTimeAt: function(t, e) {
                return z.getTimeAt(this.getValues(), t, e)
            },
            getParameterAt: "#getTimeAt",
            getOffsetAtTime: function(t) {
                return this.getPartLength(0, t)
            },
            getLocationOf: function() {
                return this.getLocationAtTime(this.getTimeOf(c.read(arguments)))
            },
            getOffsetOf: function() {
                var t = this.getLocationOf.apply(this, arguments);
                return t ? t.getOffset() : null
            },
            getTimeOf: function() {
                return z.getTimeOf(this.getValues(), c.read(arguments))
            },
            getParameterOf: "#getTimeOf",
            getNearestLocation: function() {
                var t = c.read(arguments),
                    e = this.getValues(),
                    n = z.getNearestTime(e, t),
                    i = z.getPoint(e, n);
                return new I(this, n, i, null, t.getDistance(i))
            },
            getNearestPoint: function() {
                var t = this.getNearestLocation.apply(this, arguments);
                return t ? t.getPoint() : t
            }
        }, new function() {
            var t = ["getPoint", "getTangent", "getNormal", "getWeightedTangent", "getWeightedNormal", "getCurvature"];
            return r.each(t, function(t) {
                this[t + "At"] = function(e, n) {
                    var i = this.getValues();
                    return z[t](i, n ? e : z.getTimeAt(i, e))
                }, this[t + "AtTime"] = function(e) {
                    return z[t](this.getValues(), e)
                }
            }, {
                statics: {
                    _evaluateMethods: t
                }
            })
        }, new function() {
            function t(t) {
                var e = t[0],
                    n = t[1],
                    i = t[2],
                    r = t[3],
                    s = t[4],
                    o = t[5],
                    a = t[6],
                    h = t[7],
                    l = 9 * (i - s) + 3 * (a - e),
                    u = 6 * (e + s) - 12 * i,
                    c = 3 * (i - e),
                    d = 9 * (r - o) + 3 * (h - n),
                    f = 6 * (n + o) - 12 * r,
                    p = 3 * (r - n);
                return function(t) {
                    var e = (l * t + u) * t + c,
                        n = (d * t + f) * t + p;
                    return Math.sqrt(e * e + n * n)
                }
            }

            function n(t, e) {
                return Math.max(2, Math.min(16, Math.ceil(32 * Math.abs(e - t))))
            }

            function i(t, e, n, i) {
                if (null == e || e < 0 || e > 1) return null;
                var r = t[0],
                    s = t[1],
                    o = t[2],
                    a = t[3],
                    h = t[4],
                    u = t[5],
                    d = t[6],
                    f = t[7],
                    p = l.isZero;
                p(o - r) && p(a - s) && (o = r, a = s), p(h - d) && p(u - f) && (h = d, u = f);
                var g, m, v = 3 * (o - r),
                    _ = 3 * (h - o) - v,
                    y = d - r - v - _,
                    w = 3 * (a - s),
                    x = 3 * (u - a) - w,
                    b = f - s - w - x;
                if (0 === n) g = 0 === e ? r : 1 === e ? d : ((y * e + _) * e + v) * e + r, m = 0 === e ? s : 1 === e ? f : ((b * e + x) * e + w) * e + s;
                else {
                    if (e < 1e-8 ? (g = v, m = w) : e > 1 - 1e-8 ? (g = 3 * (d - h), m = 3 * (f - u)) : (g = (3 * y * e + 2 * _) * e + v, m = (3 * b * e + 2 * x) * e + w), i) {
                        0 === g && 0 === m && (e < 1e-8 || e > 1 - 1e-8) && (g = h - o, m = u - a);
                        var C = Math.sqrt(g * g + m * m);
                        C && (g /= C, m /= C)
                    }
                    if (3 === n) {
                        var h = 6 * y * e + 2 * _,
                            u = 6 * b * e + 2 * x,
                            S = Math.pow(g * g + m * m, 1.5);
                        g = 0 !== S ? (g * u - m * h) / S : 0, m = 0
                    }
                }
                return 2 === n ? new c(m, -g) : new c(g, m)
            }
            return {
                statics: {
                    classify: function(t) {
                        function n(t, n, i) {
                            var r = n !== e,
                                s = r && n > 0 && n < 1,
                                o = r && i > 0 && i < 1;
                            return !r || (s || o) && ("loop" !== t || s && o) || (t = "arch", s = o = !1), {
                                type: t,
                                roots: s || o ? s && o ? n < i ? [n, i] : [i, n] : [s ? n : i] : null
                            }
                        }
                        var i = t[0],
                            r = t[1],
                            s = t[2],
                            o = t[3],
                            a = t[4],
                            h = t[5],
                            u = t[6],
                            c = t[7],
                            d = i * (c - h) + r * (a - u) + u * h - c * a,
                            f = s * (r - c) + o * (u - i) + i * c - r * u,
                            p = a * (o - r) + h * (i - s) + s * r - o * i,
                            g = 3 * p,
                            m = g - f,
                            v = m - f + d,
                            _ = Math.sqrt(v * v + m * m + g * g),
                            y = 0 !== _ ? 1 / _ : 0,
                            w = l.isZero;
                        if (v *= y, m *= y, g *= y, w(v)) return w(m) ? n(w(g) ? "line" : "quadratic") : n("serpentine", g / (3 * m));
                        var x = 3 * m * m - 4 * v * g;
                        if (w(x)) return n("cusp", m / (2 * v));
                        var b = x > 0 ? Math.sqrt(x / 3) : Math.sqrt(-x),
                            C = 2 * v;
                        return n(x > 0 ? "serpentine" : "loop", (m + b) / C, (m - b) / C)
                    },
                    getLength: function(i, r, s, o) {
                        if (r === e && (r = 0), s === e && (s = 1), z.isStraight(i)) {
                            var a = i;
                            s < 1 && (a = z.subdivide(a, s)[0], r /= s), r > 0 && (a = z.subdivide(a, r)[1]);
                            var h = a[6] - a[0],
                                u = a[7] - a[1];
                            return Math.sqrt(h * h + u * u)
                        }
                        return l.integrate(o || t(i), r, s, n(r, s))
                    },
                    getTimeAt: function(i, r, s) {
                        function o(t) {
                            return m += l.integrate(d, s, t, n(s, t)), s = t, m - r
                        }
                        if (s === e && (s = r < 0 ? 1 : 0), 0 === r) return s;
                        var a = Math.abs,
                            h = r > 0,
                            u = h ? s : 0,
                            c = h ? 1 : s,
                            d = t(i),
                            f = z.getLength(i, u, c, d),
                            p = a(r) - f;
                        if (a(p) < 1e-12) return h ? c : u;
                        if (p > 1e-12) return null;
                        var g = r / f,
                            m = 0;
                        return l.findRoot(o, d, s + g, u, c, 32, 1e-12)
                    },
                    getPoint: function(t, e) {
                        return i(t, e, 0, !1)
                    },
                    getTangent: function(t, e) {
                        return i(t, e, 1, !0)
                    },
                    getWeightedTangent: function(t, e) {
                        return i(t, e, 1, !1)
                    },
                    getNormal: function(t, e) {
                        return i(t, e, 2, !0)
                    },
                    getWeightedNormal: function(t, e) {
                        return i(t, e, 2, !1)
                    },
                    getCurvature: function(t, e) {
                        return i(t, e, 3, !1).x
                    },
                    getPeaks: function(t) {
                        var e = t[0],
                            n = t[1],
                            i = t[2],
                            r = t[3],
                            s = t[4],
                            o = t[5],
                            a = t[6],
                            h = t[7],
                            u = 3 * i - e - 3 * s + a,
                            c = 3 * e - 6 * i + 3 * s,
                            d = -3 * e + 3 * i,
                            f = 3 * r - n - 3 * o + h,
                            p = 3 * n - 6 * r + 3 * o,
                            g = -3 * n + 3 * r,
                            m = [];
                        return l.solveCubic(9 * (u * u + f * f), 9 * (u * c + p * f), 2 * (c * c + p * p) + 3 * (d * u + g * f), d * c + p * g, m, 1e-8, 1 - 1e-8), m.sort()
                    }
                }
            }
        }, new function() {
            function t(t, e, n, i, r, s, o) {
                var a = !o && n.getPrevious() === r,
                    h = !o && n !== r && n.getNext() === r;
                if (null !== i && i >= (a ? 1e-8 : 0) && i <= (h ? 1 - 1e-8 : 1) && null !== s && s >= (h ? 1e-8 : 0) && s <= (a ? 1 - 1e-8 : 1)) {
                    var l = new I(n, i, null, o),
                        u = new I(r, s, null, o);
                    l._intersection = u, u._intersection = l, e && !e(l) || I.insert(t, l, !0)
                }
            }

            function e(r, s, o, a, h, l, u, c, d, f, p, g, m) {
                if (++d >= 4096 || ++c >= 40) return d;
                var v, y, w = s[0],
                    x = s[1],
                    b = s[6],
                    C = s[7],
                    S = _.getSignedDistance,
                    T = S(w, x, b, C, s[2], s[3]),
                    E = S(w, x, b, C, s[4], s[5]),
                    P = T * E > 0 ? .75 : 4 / 9,
                    k = P * Math.min(0, T, E),
                    A = P * Math.max(0, T, E),
                    I = S(w, x, b, C, r[0], r[1]),
                    M = S(w, x, b, C, r[2], r[3]),
                    O = S(w, x, b, C, r[4], r[5]),
                    L = S(w, x, b, C, r[6], r[7]),
                    N = n(I, M, O, L),
                    F = N[0],
                    D = N[1];
                if (0 === T && 0 === E && 0 === I && 0 === M && 0 === O && 0 === L || null == (v = i(F, D, k, A)) || null == (y = i(F.reverse(), D.reverse(), k, A))) return d;
                var R = f + (p - f) * v,
                    H = f + (p - f) * y;
                if (Math.max(m - g, H - R) < 1e-9) {
                    var q = (R + H) / 2,
                        B = (g + m) / 2;
                    t(h, l, u ? a : o, u ? B : q, u ? o : a, u ? q : B)
                } else if (r = z.getPart(r, v, y), y - v > .8)
                    if (H - R > m - g) {
                        var j = z.subdivide(r, .5),
                            q = (R + H) / 2;
                        d = e(s, j[0], a, o, h, l, !u, c, d, g, m, R, q), d = e(s, j[1], a, o, h, l, !u, c, d, g, m, q, H)
                    } else {
                        var j = z.subdivide(s, .5),
                            B = (g + m) / 2;
                        d = e(j[0], r, a, o, h, l, !u, c, d, g, B, R, H), d = e(j[1], r, a, o, h, l, !u, c, d, B, m, R, H)
                    }
                else d = m - g >= 1e-9 ? e(s, r, a, o, h, l, !u, c, d, g, m, R, H) : e(r, s, o, a, h, l, u, c, d, R, H, g, m);
                return d
            }

            function n(t, e, n, i) {
                var r, s = [0, t],
                    o = [1 / 3, e],
                    a = [2 / 3, n],
                    h = [1, i],
                    l = e - (2 * t + i) / 3,
                    u = n - (t + 2 * i) / 3;
                if (l * u < 0) r = [
                    [s, o, h],
                    [s, a, h]
                ];
                else {
                    var c = l / u;
                    r = [c >= 2 ? [s, o, h] : c <= .5 ? [s, a, h] : [s, o, a, h],
                        [s, h]
                    ]
                }
                return (l || u) < 0 ? r.reverse() : r
            }

            function i(t, e, n, i) {
                return t[0][1] < n ? r(t, !0, n) : e[0][1] > i ? r(e, !1, i) : t[0][0]
            }

            function r(t, e, n) {
                for (var i = t[0][0], r = t[0][1], s = 1, o = t.length; s < o; s++) {
                    var a = t[s][0],
                        h = t[s][1];
                    if (e ? h >= n : h <= n) return h === n ? a : i + (n - r) * (a - i) / (h - r);
                    i = a, r = h
                }
                return null
            }

            function s(t, e, n, i, r) {
                var s = l.isZero;
                if (s(i) && s(r)) {
                    var o = z.getTimeOf(t, new c(e, n));
                    return null === o ? [] : [o]
                }
                for (var a = Math.atan2(-r, i), h = Math.sin(a), u = Math.cos(a), d = [], f = [], p = 0; p < 8; p += 2) {
                    var g = t[p] - e,
                        m = t[p + 1] - n;
                    d.push(g * u - m * h, g * h + m * u)
                }
                return z.solveCubic(d, 1, 0, f, 0, 1), f
            }

            function o(e, n, i, r, o, a, h) {
                for (var l = n[0], u = n[1], c = n[6], d = n[7], f = s(e, l, u, c - l, d - u), p = 0, g = f.length; p < g; p++) {
                    var m = f[p],
                        v = z.getPoint(e, m),
                        _ = z.getTimeOf(n, v);
                    null !== _ && t(o, a, h ? r : i, h ? _ : m, h ? i : r, h ? m : _)
                }
            }

            function a(e, n, i, r, s, o) {
                var a = _.intersect(e[0], e[1], e[6], e[7], n[0], n[1], n[6], n[7]);
                a && t(s, o, i, z.getTimeOf(e, a), r, z.getTimeOf(n, a))
            }

            function h(n, i, r, s, h, l) {
                var u = Math.min,
                    d = Math.max;
                if (d(n[0], n[2], n[4], n[6]) + 1e-12 > u(i[0], i[2], i[4], i[6]) && u(n[0], n[2], n[4], n[6]) - 1e-12 < d(i[0], i[2], i[4], i[6]) && d(n[1], n[3], n[5], n[7]) + 1e-12 > u(i[1], i[3], i[5], i[7]) && u(n[1], n[3], n[5], n[7]) - 1e-12 < d(i[1], i[3], i[5], i[7])) {
                    var p = f(n, i);
                    if (p)
                        for (var g = 0; g < 2; g++) {
                            var m = p[g];
                            t(h, l, r, m[0], s, m[1], !0)
                        } else {
                            var v = z.isStraight(n),
                                _ = z.isStraight(i),
                                y = v && _,
                                w = v && !_,
                                x = h.length;
                            if ((y ? a : v || _ ? o : e)(w ? i : n, w ? n : i, w ? s : r, w ? r : s, h, l, w, 0, 0, 0, 1, 0, 1), !y || h.length === x)
                                for (var g = 0; g < 4; g++) {
                                    var b = g >> 1,
                                        C = 1 & g,
                                        S = 6 * b,
                                        T = 6 * C,
                                        E = new c(n[S], n[S + 1]),
                                        P = new c(i[T], i[T + 1]);
                                    E.isClose(P, 1e-12) && t(h, l, r, b, s, C)
                                }
                        }
                }
                return h
            }

            function u(e, n, i, r) {
                var s = z.classify(e);
                if ("loop" === s.type) {
                    var o = s.roots;
                    t(i, r, n, o[0], n, o[1])
                }
                return i
            }

            function d(t, e, n, i, r, s) {
                var o = !e;
                o && (e = t);
                for (var a, l, c = t.length, d = e.length, f = [], p = [], g = 0; g < d; g++) f[g] = e[g].getValues(r);
                for (var g = 0; g < c; g++) {
                    var m = t[g],
                        v = o ? f[g] : m.getValues(i),
                        _ = m.getPath();
                    _ !== l && (l = _, a = [], p.push(a)), o && u(v, m, a, n);
                    for (var y = o ? g + 1 : 0; y < d; y++) {
                        if (s && a.length) return a;
                        h(v, f[y], m, e[y], a, n)
                    }
                }
                a = [];
                for (var g = 0, w = p.length; g < w; g++) a.push.apply(a, p[g]);
                return a
            }

            function f(t, e) {
                function n(t) {
                    var e = t[6] - t[0],
                        n = t[7] - t[1];
                    return e * e + n * n
                }
                var i = Math.abs,
                    r = _.getDistance,
                    s = z.isStraight(t),
                    o = z.isStraight(e),
                    a = s && o,
                    h = n(t) < n(e),
                    l = h ? e : t,
                    u = h ? t : e,
                    d = l[0],
                    f = l[1],
                    p = l[6] - d,
                    g = l[7] - f;
                if (r(d, f, p, g, u[0], u[1], !0) < 1e-7 && r(d, f, p, g, u[6], u[7], !0) < 1e-7) !a && r(d, f, p, g, l[2], l[3], !0) < 1e-7 && r(d, f, p, g, l[4], l[5], !0) < 1e-7 && r(d, f, p, g, u[2], u[3], !0) < 1e-7 && r(d, f, p, g, u[4], u[5], !0) < 1e-7 && (s = o = a = !0);
                else if (a) return null;
                if (s ^ o) return null;
                for (var m = [t, e], v = [], y = 0; y < 4 && v.length < 2; y++) {
                    var w = 1 & y,
                        x = 1 ^ w,
                        b = y >> 1,
                        C = z.getTimeOf(m[w], new c(m[x][b ? 6 : 0], m[x][b ? 7 : 1]));
                    if (null != C) {
                        var S = w ? [b, C] : [C, b];
                        (!v.length || i(S[0] - v[0][0]) > 1e-8 && i(S[1] - v[0][1]) > 1e-8) && v.push(S)
                    }
                    if (y > 2 && !v.length) break
                }
                if (2 !== v.length) v = null;
                else if (!a) {
                    var T = z.getPart(t, v[0][0], v[1][0]),
                        E = z.getPart(e, v[0][1], v[1][1]);
                    (i(E[2] - T[2]) > 1e-7 || i(E[3] - T[3]) > 1e-7 || i(E[4] - T[4]) > 1e-7 || i(E[5] - T[5]) > 1e-7) && (v = null)
                }
                return v
            }
            return {
                getIntersections: function(t) {
                    var e = this.getValues(),
                        n = t && t !== this && t.getValues();
                    return n ? h(e, n, this, t, []) : u(e, this, [])
                },
                statics: {
                    getOverlaps: f,
                    getIntersections: d,
                    getCurveLineIntersections: s
                }
            }
        }),
        I = r.extend({
            _class: "CurveLocation",
            initialize: function(t, e, n, i, r) {
                if (e >= .99999999) {
                    var s = t.getNext();
                    s && (e = 0, t = s)
                }
                this._setCurve(t), this._time = e, this._point = n || t.getPointAtTime(e), this._overlap = i, this._distance = r, this._intersection = this._next = this._previous = null
            },
            _setCurve: function(t) {
                var e = t._path;
                this._path = e, this._version = e ? e._version : 0, this._curve = t, this._segment = null, this._segment1 = t._segment1, this._segment2 = t._segment2
            },
            _setSegment: function(t) {
                this._setCurve(t.getCurve()), this._segment = t, this._time = t === this._segment1 ? 0 : 1, this._point = t._point.clone()
            },
            getSegment: function() {
                var t = this._segment;
                if (!t) {
                    var e = this.getCurve(),
                        n = this.getTime();
                    0 === n ? t = e._segment1 : 1 === n ? t = e._segment2 : null != n && (t = e.getPartLength(0, n) < e.getPartLength(n, 1) ? e._segment1 : e._segment2), this._segment = t
                }
                return t
            },
            getCurve: function() {
                function t(t) {
                    var e = t && t.getCurve();
                    if (e && null != (n._time = e.getTimeOf(n._point))) return n._setCurve(e), e
                }
                var e = this._path,
                    n = this;
                return e && e._version !== this._version && (this._time = this._offset = this._curveOffset = this._curve = null), this._curve || t(this._segment) || t(this._segment1) || t(this._segment2.getPrevious())
            },
            getPath: function() {
                var t = this.getCurve();
                return t && t._path
            },
            getIndex: function() {
                var t = this.getCurve();
                return t && t.getIndex()
            },
            getTime: function() {
                var t = this.getCurve(),
                    e = this._time;
                return t && null == e ? this._time = t.getTimeOf(this._point) : e
            },
            getParameter: "#getTime",
            getPoint: function() {
                return this._point
            },
            getOffset: function() {
                var t = this._offset;
                if (null == t) {
                    t = 0;
                    var e = this.getPath(),
                        n = this.getIndex();
                    if (e && null != n)
                        for (var i = e.getCurves(), r = 0; r < n; r++) t += i[r].getLength();
                    this._offset = t += this.getCurveOffset()
                }
                return t
            },
            getCurveOffset: function() {
                var t = this._curveOffset;
                if (null == t) {
                    var e = this.getCurve(),
                        n = this.getTime();
                    this._curveOffset = t = null != n && e && e.getPartLength(0, n)
                }
                return t
            },
            getIntersection: function() {
                return this._intersection
            },
            getDistance: function() {
                return this._distance
            },
            divide: function() {
                var t = this.getCurve(),
                    e = t && t.divideAtTime(this.getTime());
                return e && this._setSegment(e._segment1), e
            },
            split: function() {
                var t = this.getCurve(),
                    e = t._path,
                    n = t && t.splitAtTime(this.getTime());
                return n && this._setSegment(e.getLastSegment()), n
            },
            equals: function(t, e) {
                var n = this === t;
                if (!n && t instanceof I) {
                    var i = this.getCurve(),
                        r = t.getCurve(),
                        s = i._path;
                    if (s === r._path) {
                        var o = Math.abs,
                            a = o(this.getOffset() - t.getOffset()),
                            h = !e && this._intersection,
                            l = !e && t._intersection;
                        n = (a < 1e-7 || s && o(s.getLength() - a) < 1e-7) && (!h && !l || h && l && h.equals(l, !0))
                    }
                }
                return n
            },
            toString: function() {
                var t = [],
                    e = this.getPoint(),
                    n = h.instance;
                e && t.push("point: " + e);
                var i = this.getIndex();
                null != i && t.push("index: " + i);
                var r = this.getTime();
                return null != r && t.push("time: " + n.number(r)), null != this._distance && t.push("distance: " + n.number(this._distance)), "{ " + t.join(", ") + " }"
            },
            isTouching: function() {
                var t = this._intersection;
                if (t && this.getTangent().isCollinear(t.getTangent())) {
                    var e = this.getCurve(),
                        n = t.getCurve();
                    return !(e.isStraight() && n.isStraight() && e.getLine().intersect(n.getLine()))
                }
                return !1
            },
            isCrossing: function() {
                function t(t, e) {
                    var n = t.getValues(),
                        i = z.classify(n).roots || z.getPeaks(n),
                        r = i.length,
                        s = e && r > 1 ? i[r - 1] : r > 0 ? i[0] : .5;
                    c.push(z.getLength(n, e ? s : 0, e ? 1 : s) / 2)
                }

                function e(t, e, n) {
                    return e < n ? t > e && t < n : t > e || t < n
                }
                var n = this._intersection;
                if (!n) return !1;
                var i = this.getTime(),
                    r = n.getTime(),
                    s = i >= 1e-8 && i <= 1 - 1e-8,
                    o = r >= 1e-8 && r <= 1 - 1e-8;
                if (s && o) return !this.isTouching();
                var a = this.getCurve(),
                    h = i < 1e-8 ? a.getPrevious() : a,
                    l = n.getCurve(),
                    u = r < 1e-8 ? l.getPrevious() : l;
                if (i > 1 - 1e-8 && (a = a.getNext()), r > 1 - 1e-8 && (l = l.getNext()), !(h && a && u && l)) return !1;
                var c = [];
                s || (t(h, !0), t(a, !1)), o || (t(u, !0), t(l, !1));
                var d = this.getPoint(),
                    f = Math.min.apply(Math, c),
                    p = s ? a.getTangentAtTime(i) : a.getPointAt(f).subtract(d),
                    g = s ? p.negate() : h.getPointAt(-f).subtract(d),
                    m = o ? l.getTangentAtTime(r) : l.getPointAt(f).subtract(d),
                    v = o ? m.negate() : u.getPointAt(-f).subtract(d),
                    _ = g.getAngle(),
                    y = p.getAngle(),
                    w = v.getAngle(),
                    x = m.getAngle();
                return !!(s ? e(_, w, x) ^ e(y, w, x) && e(_, x, w) ^ e(y, x, w) : e(w, _, y) ^ e(x, _, y) && e(w, y, _) ^ e(x, y, _))
            },
            hasOverlap: function() {
                return !!this._overlap
            }
        }, r.each(z._evaluateMethods, function(t) {
            var e = t + "At";
            this[t] = function() {
                var t = this.getCurve(),
                    n = this.getTime();
                return null != n && t && t[e](n, !0)
            }
        }, {
            preserve: !0
        }), new function() {
            function t(t, e, n) {
                function i(n, i) {
                    for (var s = n + i; s >= -1 && s <= r; s += i) {
                        var o = t[(s % r + r) % r];
                        if (!e.getPoint().isClose(o.getPoint(), 1e-7)) break;
                        if (e.equals(o)) return o
                    }
                    return null
                }
                for (var r = t.length, s = 0, o = r - 1; s <= o;) {
                    var a, h = s + o >>> 1,
                        l = t[h];
                    if (n && (a = e.equals(l) ? l : i(h, -1) || i(h, 1))) return e._overlap && (a._overlap = a._intersection._overlap = !0), a;
                    var u = e.getPath(),
                        c = l.getPath();
                    (u !== c ? u._id - c._id : e.getIndex() + e.getTime() - (l.getIndex() + l.getTime())) < 0 ? o = h - 1 : s = h + 1
                }
                return t.splice(s, 0, e), e
            }
            return {
                statics: {
                    insert: t,
                    expand: function(e) {
                        for (var n = e.slice(), i = e.length - 1; i >= 0; i--) t(n, e[i]._intersection, !1);
                        return n
                    }
                }
            }
        }),
        M = w.extend({
            _class: "PathItem",
            _selectBounds: !1,
            _canScaleStroke: !0,
            beans: !0,
            initialize: function() {},
            statics: {
                create: function(t) {
                    var e, n, i;
                    if (r.isPlainObject(t) ? (n = t.segments, e = t.pathData) : Array.isArray(t) ? n = t : "string" == typeof t && (e = t), n) {
                        var s = n[0];
                        i = s && Array.isArray(s[0])
                    } else e && (i = (e.match(/m/gi) || []).length > 1 || /z\s*\S+/i.test(e));
                    return new(i ? L : O)(t)
                }
            },
            _asPathItem: function() {
                return this
            },
            isClockwise: function() {
                return this.getArea() >= 0
            },
            setClockwise: function(t) {
                this.isClockwise() != (t = !!t) && this.reverse()
            },
            setPathData: function(t) {
                function e(t, e) {
                    var n = +i[t];
                    return a && (n += h[e]), n
                }

                function n(t) {
                    return new c(e(t, "x"), e(t + 1, "y"))
                }
                var i, r, s, o = t && t.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/gi),
                    a = !1,
                    h = new c,
                    l = new c;
                this.clear();
                for (var u = 0, d = o && o.length; u < d; u++) {
                    var p = o[u],
                        g = p[0],
                        m = g.toLowerCase();
                    i = p.match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g);
                    var v = i && i.length;
                    switch (a = g === m, "z" !== r || /[mz]/.test(m) || this.moveTo(h), m) {
                        case "m":
                        case "l":
                            for (var _ = "m" === m, y = 0; y < v; y += 2) this[_ ? "moveTo" : "lineTo"](h = n(y)), _ && (l = h, _ = !1);
                            s = h;
                            break;
                        case "h":
                        case "v":
                            var w = "h" === m ? "x" : "y";
                            h = h.clone();
                            for (var y = 0; y < v; y++) h[w] = e(y, w), this.lineTo(h);
                            s = h;
                            break;
                        case "c":
                            for (var y = 0; y < v; y += 6) this.cubicCurveTo(n(y), s = n(y + 2), h = n(y + 4));
                            break;
                        case "s":
                            for (var y = 0; y < v; y += 4) this.cubicCurveTo(/[cs]/.test(r) ? h.multiply(2).subtract(s) : h, s = n(y), h = n(y + 2)), r = m;
                            break;
                        case "q":
                            for (var y = 0; y < v; y += 4) this.quadraticCurveTo(s = n(y), h = n(y + 2));
                            break;
                        case "t":
                            for (var y = 0; y < v; y += 2) this.quadraticCurveTo(s = /[qt]/.test(r) ? h.multiply(2).subtract(s) : h, h = n(y)), r = m;
                            break;
                        case "a":
                            for (var y = 0; y < v; y += 7) this.arcTo(h = n(y + 5), new f(+i[y], +i[y + 1]), +i[y + 2], +i[y + 4], +i[y + 3]);
                            break;
                        case "z":
                            this.closePath(1e-12), h = l
                    }
                    r = m
                }
            },
            _canComposite: function() {
                return !(this.hasFill() && this.hasStroke())
            },
            _contains: function(t) {
                var e = t.isInside(this.getBounds({
                    internal: !0,
                    handle: !0
                })) ? this._getWinding(t) : {};
                return e.onPath || !!("evenodd" === this.getFillRule() ? 1 & e.windingL || 1 & e.windingR : e.winding)
            },
            getIntersections: function(t, e, n, i) {
                var r = this === t || !t,
                    s = this._matrix._orNullIfIdentity(),
                    o = r ? s : (n || t._matrix)._orNullIfIdentity();
                return r || this.getBounds(s).intersects(t.getBounds(o), 1e-12) ? z.getIntersections(this.getCurves(), !r && t.getCurves(), e, s, o, i) : []
            },
            getCrossings: function(t) {
                return this.getIntersections(t, function(t) {
                    return t.hasOverlap() || t.isCrossing()
                })
            },
            getNearestLocation: function() {
                for (var t = c.read(arguments), e = this.getCurves(), n = 1 / 0, i = null, r = 0, s = e.length; r < s; r++) {
                    var o = e[r].getNearestLocation(t);
                    o._distance < n && (n = o._distance, i = o)
                }
                return i
            },
            getNearestPoint: function() {
                var t = this.getNearestLocation.apply(this, arguments);
                return t ? t.getPoint() : t
            },
            interpolate: function(t, e, n) {
                var i = !this._children,
                    r = i ? "_segments" : "_children",
                    s = t[r],
                    o = e[r],
                    a = this[r];
                if (!s || !o || s.length !== o.length) throw new Error("Invalid operands in interpolate() call: " + t + ", " + e);
                var h = a.length,
                    l = o.length;
                if (h < l)
                    for (var u = i ? k : O, c = h; c < l; c++) this.add(new u);
                else h > l && this[i ? "removeSegments" : "removeChildren"](l, h);
                for (var c = 0; c < l; c++) a[c].interpolate(s[c], o[c], n);
                i && (this.setClosed(t._closed), this._changed(9))
            },
            compare: function(t) {
                var e = !1;
                if (t) {
                    var n = this._children || [this],
                        i = t._children ? t._children.slice() : [t],
                        r = n.length,
                        s = i.length,
                        o = [],
                        a = 0;
                    e = !0;
                    for (var h = r - 1; h >= 0 && e; h--) {
                        var l = n[h];
                        e = !1;
                        for (var u = s - 1; u >= 0 && !e; u--) l.compare(i[u]) && (o[u] || (o[u] = !0, a++), e = !0)
                    }
                    e = e && a === s
                }
                return e
            }
        }),
        O = M.extend({
            _class: "Path",
            _serializeFields: {
                segments: [],
                closed: !1
            },
            initialize: function(t) {
                this._closed = !1, this._segments = [], this._version = 0;
                var n = Array.isArray(t) ? "object" == typeof t[0] ? t : arguments : !t || t.size !== e || t.x === e && t.point === e ? null : arguments;
                n && n.length > 0 ? this.setSegments(n) : (this._curves = e, this._segmentSelection = 0, n || "string" != typeof t || (this.setPathData(t), t = null)), this._initialize(!n && t)
            },
            _equals: function(t) {
                return this._closed === t._closed && r.equals(this._segments, t._segments)
            },
            copyContent: function(t) {
                this.setSegments(t._segments), this._closed = t._closed
            },
            _changed: function t(n) {
                if (t.base.call(this, n), 8 & n) {
                    if (this._length = this._area = e, 16 & n) this._version++;
                    else if (this._curves)
                        for (var i = 0, r = this._curves.length; i < r; i++) this._curves[i]._changed()
                } else 32 & n && (this._bounds = e)
            },
            getStyle: function() {
                var t = this._parent;
                return (t instanceof L ? t : this)._style
            },
            getSegments: function() {
                return this._segments
            },
            setSegments: function(t) {
                var n = this.isFullySelected(),
                    i = t && t.length;
                if (this._segments.length = 0, this._segmentSelection = 0, this._curves = e, i) {
                    var r = t[i - 1];
                    "boolean" == typeof r && (this.setClosed(r), i--), this._add(k.readList(t, 0, {}, i))
                }
                n && this.setFullySelected(!0)
            },
            getFirstSegment: function() {
                return this._segments[0]
            },
            getLastSegment: function() {
                return this._segments[this._segments.length - 1]
            },
            getCurves: function() {
                var t = this._curves,
                    e = this._segments;
                if (!t) {
                    var n = this._countCurves();
                    t = this._curves = new Array(n);
                    for (var i = 0; i < n; i++) t[i] = new z(this, e[i], e[i + 1] || e[0])
                }
                return t
            },
            getFirstCurve: function() {
                return this.getCurves()[0]
            },
            getLastCurve: function() {
                var t = this.getCurves();
                return t[t.length - 1]
            },
            isClosed: function() {
                return this._closed
            },
            setClosed: function(t) {
                if (this._closed != (t = !!t)) {
                    if (this._closed = t, this._curves) {
                        var e = this._curves.length = this._countCurves();
                        t && (this._curves[e - 1] = new z(this, this._segments[e - 1], this._segments[0]))
                    }
                    this._changed(25)
                }
            }
        }, {
            beans: !0,
            getPathData: function(t, e) {
                function n(e, n) {
                    if (e._transformCoordinates(t, g), i = g[0], r = g[1], m) v.push("M" + p.pair(i, r)), m = !1;
                    else if (a = g[2], l = g[3], a === i && l === r && u === s && c === o) {
                        if (!n) {
                            var h = i - s,
                                d = r - o;
                            v.push(0 === h ? "v" + p.number(d) : 0 === d ? "h" + p.number(h) : "l" + p.pair(h, d))
                        }
                    } else v.push("c" + p.pair(u - s, c - o) + " " + p.pair(a - s, l - o) + " " + p.pair(i - s, r - o));
                    s = i, o = r, u = g[4], c = g[5]
                }
                var i, r, s, o, a, l, u, c, d = this._segments,
                    f = d.length,
                    p = new h(e),
                    g = new Array(6),
                    m = !0,
                    v = [];
                if (!f) return "";
                for (var _ = 0; _ < f; _++) n(d[_]);
                return this._closed && f > 0 && (n(d[0], !0), v.push("z")), v.join("")
            },
            isEmpty: function() {
                return !this._segments.length
            },
            _transformContent: function(t) {
                for (var e = this._segments, n = new Array(6), i = 0, r = e.length; i < r; i++) e[i]._transformCoordinates(t, n, !0);
                return !0
            },
            _add: function(t, e) {
                for (var n = this._segments, i = this._curves, r = t.length, s = null == e, e = s ? n.length : e, o = 0; o < r; o++) {
                    var a = t[o];
                    a._path && (a = t[o] = a.clone()), a._path = this, a._index = e + o, a._selection && this._updateSelection(a, 0, a._selection)
                }
                if (s) n.push.apply(n, t);
                else {
                    n.splice.apply(n, [e, 0].concat(t));
                    for (var o = e + r, h = n.length; o < h; o++) n[o]._index = o
                }
                if (i) {
                    var l = this._countCurves(),
                        u = e > 0 && e + r - 1 === l ? e - 1 : e,
                        c = u,
                        d = Math.min(u + r, l);
                    t._curves && (i.splice.apply(i, [u, 0].concat(t._curves)), c += t._curves.length);
                    for (var o = c; o < d; o++) i.splice(o, 0, new z(this, null, null));
                    this._adjustCurves(u, d)
                }
                return this._changed(25), t
            },
            _adjustCurves: function(t, e) {
                for (var n, i = this._segments, r = this._curves, s = t; s < e; s++) n = r[s], n._path = this, n._segment1 = i[s], n._segment2 = i[s + 1] || i[0], n._changed();
                (n = r[this._closed && !t ? i.length - 1 : t - 1]) && (n._segment2 = i[t] || i[0], n._changed()), (n = r[e]) && (n._segment1 = i[e], n._changed())
            },
            _countCurves: function() {
                var t = this._segments.length;
                return !this._closed && t > 0 ? t - 1 : t
            },
            add: function(t) {
                return arguments.length > 1 && "number" != typeof t ? this._add(k.readList(arguments)) : this._add([k.read(arguments)])[0]
            },
            insert: function(t, e) {
                return arguments.length > 2 && "number" != typeof e ? this._add(k.readList(arguments, 1), t) : this._add([k.read(arguments, 1)], t)[0]
            },
            addSegment: function() {
                return this._add([k.read(arguments)])[0]
            },
            insertSegment: function(t) {
                return this._add([k.read(arguments, 1)], t)[0]
            },
            addSegments: function(t) {
                return this._add(k.readList(t))
            },
            insertSegments: function(t, e) {
                return this._add(k.readList(e), t)
            },
            removeSegment: function(t) {
                return this.removeSegments(t, t + 1)[0] || null
            },
            removeSegments: function(t, e, n) {
                t = t || 0, e = r.pick(e, this._segments.length);
                var i = this._segments,
                    s = this._curves,
                    o = i.length,
                    a = i.splice(t, e - t),
                    h = a.length;
                if (!h) return a;
                for (var l = 0; l < h; l++) {
                    var u = a[l];
                    u._selection && this._updateSelection(u, u._selection, 0), u._index = u._path = null
                }
                for (var l = t, c = i.length; l < c; l++) i[l]._index = l;
                if (s) {
                    for (var d = t > 0 && e === o + (this._closed ? 1 : 0) ? t - 1 : t, s = s.splice(d, h), l = s.length - 1; l >= 0; l--) s[l]._path = null;
                    n && (a._curves = s.slice(1)), this._adjustCurves(d, d)
                }
                return this._changed(25), a
            },
            clear: "#removeSegments",
            hasHandles: function() {
                for (var t = this._segments, e = 0, n = t.length; e < n; e++)
                    if (t[e].hasHandles()) return !0;
                return !1
            },
            clearHandles: function() {
                for (var t = this._segments, e = 0, n = t.length; e < n; e++) t[e].clearHandles()
            },
            getLength: function() {
                if (null == this._length) {
                    for (var t = this.getCurves(), e = 0, n = 0, i = t.length; n < i; n++) e += t[n].getLength();
                    this._length = e
                }
                return this._length
            },
            getArea: function() {
                var t = this._area;
                if (null == t) {
                    var e = this._segments,
                        n = this._closed;
                    t = 0;
                    for (var i = 0, r = e.length; i < r; i++) {
                        var s = i + 1 === r;
                        t += z.getArea(z.getValues(e[i], e[s ? 0 : i + 1], null, s && !n))
                    }
                    this._area = t
                }
                return t
            },
            isFullySelected: function() {
                var t = this._segments.length;
                return this.isSelected() && t > 0 && this._segmentSelection === 7 * t
            },
            setFullySelected: function(t) {
                t && this._selectSegments(!0), this.setSelected(t)
            },
            setSelection: function t(e) {
                1 & e || this._selectSegments(!1), t.base.call(this, e)
            },
            _selectSegments: function(t) {
                var e = this._segments,
                    n = e.length,
                    i = t ? 7 : 0;
                this._segmentSelection = i * n;
                for (var r = 0; r < n; r++) e[r]._selection = i
            },
            _updateSelection: function(t, e, n) {
                t._selection = n, (this._segmentSelection += n - e) > 0 && this.setSelected(!0)
            },
            divideAt: function(t) {
                var e, n = this.getLocationAt(t);
                return n && (e = n.getCurve().divideAt(n.getCurveOffset())) ? e._segment1 : null
            },
            splitAt: function(t) {
                var e = this.getLocationAt(t),
                    n = e && e.index,
                    i = e && e.time;
                i > 1 - 1e-8 && (n++, i = 0);
                var r = this.getCurves();
                if (n >= 0 && n < r.length) {
                    i >= 1e-8 && r[n++].divideAtTime(i);
                    var s, o = this.removeSegments(n, this._segments.length, !0);
                    return this._closed ? (this.setClosed(!1), s = this) : (s = new O(w.NO_INSERT), s.insertAbove(this), s.copyAttributes(this)), s._add(o, 0), this.addSegment(o[0]), s
                }
                return null
            },
            split: function(t, n) {
                var i, r = n === e ? t : (i = this.getCurves()[t]) && i.getLocationAtTime(n);
                return null != r ? this.splitAt(r) : null
            },
            join: function(t, e) {
                var n = e || 0;
                if (t && t !== this) {
                    var i = t._segments,
                        r = this.getLastSegment(),
                        s = t.getLastSegment();
                    if (!s) return this;
                    r && r._point.isClose(s._point, n) && t.reverse();
                    var o = t.getFirstSegment();
                    if (r && r._point.isClose(o._point, n)) r.setHandleOut(o._handleOut), this._add(i.slice(1));
                    else {
                        var a = this.getFirstSegment();
                        a && a._point.isClose(o._point, n) && t.reverse(), s = t.getLastSegment(), a && a._point.isClose(s._point, n) ? (a.setHandleIn(s._handleIn), this._add(i.slice(0, i.length - 1), 0)) : this._add(i.slice())
                    }
                    t._closed && this._add([i[0]]), t.remove()
                }
                var h = this.getFirstSegment(),
                    l = this.getLastSegment();
                return h !== l && h._point.isClose(l._point, n) && (h.setHandleIn(l._handleIn), l.remove(), this.setClosed(!0)), this
            },
            reduce: function(t) {
                for (var e = this.getCurves(), n = t && t.simplify, i = n ? 1e-7 : 0, r = e.length - 1; r >= 0; r--) {
                    var s = e[r];
                    !s.hasHandles() && (!s.hasLength(i) || n && s.isCollinear(s.getNext())) && s.remove()
                }
                return this
            },
            reverse: function() {
                this._segments.reverse();
                for (var t = 0, e = this._segments.length; t < e; t++) {
                    var n = this._segments[t],
                        i = n._handleIn;
                    n._handleIn = n._handleOut, n._handleOut = i, n._index = t
                }
                this._curves = null, this._changed(9)
            },
            flatten: function(t) {
                for (var e = new N(this, t || .25, 256, !0), n = e.parts, i = n.length, r = [], s = 0; s < i; s++) r.push(new k(n[s].curve.slice(0, 2)));
                !this._closed && i > 0 && r.push(new k(n[i - 1].curve.slice(6))), this.setSegments(r)
            },
            simplify: function(t) {
                var e = new F(this).fit(t || 2.5);
                return e && this.setSegments(e), !!e
            },
            smooth: function(t) {
                function n(t, e) {
                    var n = t && t.index;
                    if (null != n) {
                        var r = t.path;
                        if (r && r !== i) throw new Error(t._class + " " + n + " of " + r + " is not part of " + i);
                        e && t instanceof z && n++
                    } else n = "number" == typeof t ? t : e;
                    return Math.min(n < 0 && h ? n % a : n < 0 ? n + a : n, a - 1)
                }
                var i = this,
                    r = t || {},
                    s = r.type || "asymmetric",
                    o = this._segments,
                    a = o.length,
                    h = this._closed,
                    l = h && r.from === e && r.to === e,
                    u = n(r.from, 0),
                    c = n(r.to, a - 1);
                if (u > c)
                    if (h) u -= a;
                    else {
                        var d = u;
                        u = c, c = d
                    }
                if (/^(?:asymmetric|continuous)$/.test(s)) {
                    var f = "asymmetric" === s,
                        p = Math.min,
                        g = c - u + 1,
                        m = g - 1,
                        v = l ? p(g, 4) : 1,
                        _ = v,
                        y = v,
                        w = [];
                    if (h || (_ = p(1, u), y = p(1, a - c - 1)), (m += _ + y) <= 1) return;
                    for (var x = 0, b = u - _; x <= m; x++, b++) w[x] = o[(b < 0 ? b + a : b) % a]._point;
                    for (var C = w[0]._x + 2 * w[1]._x, S = w[0]._y + 2 * w[1]._y, T = 2, E = m - 1, P = [C], k = [S], A = [T], I = [], M = [], x = 1; x < m; x++) {
                        var O = x < E,
                            L = O ? 1 : f ? 1 : 2,
                            N = O ? 4 : f ? 2 : 7,
                            F = O ? 4 : f ? 3 : 8,
                            D = O ? 2 : f ? 0 : 1,
                            R = L / T;
                        T = A[x] = N - R, C = P[x] = F * w[x]._x + D * w[x + 1]._x - R * C, S = k[x] = F * w[x]._y + D * w[x + 1]._y - R * S
                    }
                    I[E] = P[E] / A[E], M[E] = k[E] / A[E];
                    for (var x = m - 2; x >= 0; x--) I[x] = (P[x] - I[x + 1]) / A[x], M[x] = (k[x] - M[x + 1]) / A[x];
                    I[m] = (3 * w[m]._x - I[E]) / 2, M[m] = (3 * w[m]._y - M[E]) / 2;
                    for (var x = _, H = m - y, b = u; x <= H; x++, b++) {
                        var q = o[b < 0 ? b + a : b],
                            B = q._point,
                            j = I[x] - B._x,
                            W = M[x] - B._y;
                        (l || x < H) && q.setHandleOut(j, W), (l || x > _) && q.setHandleIn(-j, -W)
                    }
                } else
                    for (var x = u; x <= c; x++) o[x < 0 ? x + a : x].smooth(r, !l && x === u, !l && x === c)
            },
            toShape: function(t) {
                function n(t, e) {
                    var n = u[t],
                        i = n.getNext(),
                        r = u[e],
                        s = r.getNext();
                    return n._handleOut.isZero() && i._handleIn.isZero() && r._handleOut.isZero() && s._handleIn.isZero() && i._point.subtract(n._point).isCollinear(s._point.subtract(r._point))
                }

                function i(t) {
                    var e = u[t],
                        n = e.getNext(),
                        i = e._handleOut,
                        r = n._handleIn;
                    if (i.isOrthogonal(r)) {
                        var s = e._point,
                            o = n._point,
                            a = new _(s, i, !0).intersect(new _(o, r, !0), !0);
                        return a && l.isZero(i.getLength() / a.subtract(s).getLength() - .5522847498307936) && l.isZero(r.getLength() / a.subtract(o).getLength() - .5522847498307936)
                    }
                    return !1
                }

                function r(t, e) {
                    return u[t]._point.getDistance(u[e]._point)
                }
                if (!this._closed) return null;
                var s, o, a, h, u = this._segments;
                if (!this.hasHandles() && 4 === u.length && n(0, 2) && n(1, 3) && function(t) {
                        var e = u[t],
                            n = e.getPrevious(),
                            i = e.getNext();
                        return n._handleOut.isZero() && e._handleIn.isZero() && e._handleOut.isZero() && i._handleIn.isZero() && e._point.subtract(n._point).isOrthogonal(i._point.subtract(e._point))
                    }(1) ? (s = C.Rectangle, o = new f(r(0, 3), r(0, 1)), h = u[1]._point.add(u[2]._point).divide(2)) : 8 === u.length && i(0) && i(2) && i(4) && i(6) && n(1, 5) && n(3, 7) ? (s = C.Rectangle, o = new f(r(1, 6), r(0, 3)), a = o.subtract(new f(r(0, 7), r(1, 2))).divide(2), h = u[3]._point.add(u[4]._point).divide(2)) : 4 === u.length && i(0) && i(1) && i(2) && i(3) && (l.isZero(r(0, 2) - r(1, 3)) ? (s = C.Circle, a = r(0, 2) / 2) : (s = C.Ellipse, a = new f(r(2, 0) / 2, r(3, 1) / 2)), h = u[1]._point), s) {
                    var c = this.getPosition(!0),
                        d = new s({
                            center: c,
                            size: o,
                            radius: a,
                            insert: !1
                        });
                    return d.copyAttributes(this, !0), d._matrix.prepend(this._matrix), d.rotate(h.subtract(c).getAngle() + 90), (t === e || t) && d.insertAbove(this), d
                }
                return null
            },
            toPath: "#clone",
            compare: function t(e) {
                if (!e || e instanceof L) return t.base.call(this, e);
                var n = this.getCurves(),
                    i = e.getCurves(),
                    r = n.length,
                    s = i.length;
                if (!r || !s) return r == s;
                for (var o, a, h = n[0].getValues(), l = [], u = 0, c = 0, d = 0; d < s; d++) {
                    var f = i[d].getValues();
                    l.push(f);
                    var p = z.getOverlaps(h, f);
                    if (p) {
                        o = !d && p[0][0] > 0 ? s - 1 : d, a = p[0][1];
                        break
                    }
                }
                for (var g, m = Math.abs, f = l[o]; h && f;) {
                    var p = z.getOverlaps(h, f);
                    if (p) {
                        if (m(p[0][0] - c) < 1e-8) {
                            c = p[1][0], 1 === c && (h = ++u < r ? n[u].getValues() : null, c = 0);
                            var v = p[0][1];
                            if (m(v - a) < 1e-8) {
                                if (g || (g = [o, v]), a = p[1][1], 1 === a && (++o >= s && (o = 0), f = l[o] || i[o].getValues(), a = 0), !h) return g[0] === o && g[1] === a;
                                continue
                            }
                        }
                    }
                    break
                }
                return !1
            },
            _hitTestSelf: function(t, e, n, i) {
                function r(e, n) {
                    return t.subtract(e).divide(n).length <= 1
                }

                function s(t, n, i) {
                    if (!e.selected || n.isSelected()) {
                        var s = t._point;
                        if (n !== s && (n = n.add(s)), r(n, x)) return new P(i, g, {
                            segment: t,
                            point: n
                        })
                    }
                }

                function o(t, n) {
                    return (n || e.segments) && s(t, t._point, "segment") || !n && e.handles && (s(t, t._handleIn, "handle-in") || s(t, t._handleOut, "handle-out"))
                }

                function a(t) {
                    d.add(t)
                }

                function h(e) {
                    var n = y || e._index > 0 && e._index < _ - 1;
                    if ("round" === (n ? l : u)) return r(e._point, x);
                    if (d = new O({
                            internal: !0,
                            closed: !0
                        }), n ? e.isSmooth() || O._addBevelJoin(e, l, T, c, null, i, a, !0) : "square" === u && O._addSquareCap(e, u, T, null, i, a, !0), !d.isEmpty()) {
                        var s;
                        return d.contains(t) || (s = d.getNearestLocation(t)) && r(s.getPoint(), w)
                    }
                }
                var l, u, c, d, f, p, g = this,
                    m = this.getStyle(),
                    v = this._segments,
                    _ = v.length,
                    y = this._closed,
                    w = e._tolerancePadding,
                    x = w,
                    b = e.stroke && m.hasStroke(),
                    C = e.fill && m.hasFill(),
                    S = e.curves,
                    T = b ? m.getStrokeWidth() / 2 : C && e.tolerance > 0 || S ? 0 : null;
                if (null !== T && (T > 0 ? (l = m.getStrokeJoin(), u = m.getStrokeCap(), c = m.getMiterLimit(), x = x.add(O._getStrokePadding(T, i))) : l = u = "round"), !e.ends || e.segments || y) {
                    if (e.segments || e.handles)
                        for (var E = 0; E < _; E++)
                            if (p = o(v[E])) return p
                } else if (p = o(v[0], !0) || o(v[_ - 1], !0)) return p;
                if (null !== T) {
                    if (f = this.getNearestLocation(t)) {
                        var k = f.getTime();
                        0 === k || 1 === k && _ > 1 ? h(f.getSegment()) || (f = null) : r(f.getPoint(), x) || (f = null)
                    }
                    if (!f && "miter" === l && _ > 1)
                        for (var E = 0; E < _; E++) {
                            var A = v[E];
                            if (t.getDistance(A._point) <= c * T && h(A)) {
                                f = A.getLocation();
                                break
                            }
                        }
                }
                return !f && C && this._contains(t) || f && !b && !S ? new P("fill", this) : f ? new P(b ? "stroke" : "curve", this, {
                    location: f,
                    point: f.getPoint()
                }) : null
            }
        }, r.each(z._evaluateMethods, function(t) {
            this[t + "At"] = function(e) {
                var n = this.getLocationAt(e);
                return n && n[t]()
            }
        }, {
            beans: !1,
            getLocationOf: function() {
                for (var t = c.read(arguments), e = this.getCurves(), n = 0, i = e.length; n < i; n++) {
                    var r = e[n].getLocationOf(t);
                    if (r) return r
                }
                return null
            },
            getOffsetOf: function() {
                var t = this.getLocationOf.apply(this, arguments);
                return t ? t.getOffset() : null
            },
            getLocationAt: function(t) {
                if ("number" == typeof t) {
                    for (var e = this.getCurves(), n = 0, i = 0, r = e.length; i < r; i++) {
                        var s = n,
                            o = e[i];
                        if ((n += o.getLength()) > t) return o.getLocationAt(t - s)
                    }
                    if (e.length > 0 && t <= this.getLength()) return new I(e[e.length - 1], 1)
                } else if (t && t.getPath && t.getPath() === this) return t;
                return null
            }
        }), new function() {
            function t(t, e, n, i) {
                function r(e) {
                    var n = h[e],
                        i = h[e + 1];
                    s == n && o == i || (t.beginPath(), t.moveTo(s, o), t.lineTo(n, i), t.stroke(), t.beginPath(), t.arc(n, i, a, 0, 2 * Math.PI, !0), t.fill())
                }
                for (var s, o, a = i / 2, h = new Array(6), l = 0, u = e.length; l < u; l++) {
                    var c = e[l],
                        d = c._selection;
                    if (c._transformCoordinates(n, h), s = h[0], o = h[1], 2 & d && r(2), 4 & d && r(4), t.fillRect(s - a, o - a, i, i), !(1 & d)) {
                        var f = t.fillStyle;
                        t.fillStyle = "#ffffff", t.fillRect(s - a + 1, o - a + 1, i - 2, i - 2), t.fillStyle = f
                    }
                }
            }

            function e(t, e, n) {
                function i(e) {
                    if (n) e._transformCoordinates(n, p), r = p[0], s = p[1];
                    else {
                        var i = e._point;
                        r = i._x, s = i._y
                    }
                    if (g) t.moveTo(r, s), g = !1;
                    else {
                        if (n) h = p[2], l = p[3];
                        else {
                            var d = e._handleIn;
                            h = r + d._x, l = s + d._y
                        }
                        h === r && l === s && u === o && c === a ? t.lineTo(r, s) : t.bezierCurveTo(u, c, h, l, r, s)
                    }
                    if (o = r, a = s, n) u = p[4], c = p[5];
                    else {
                        var d = e._handleOut;
                        u = o + d._x, c = a + d._y
                    }
                }
                for (var r, s, o, a, h, l, u, c, d = e._segments, f = d.length, p = new Array(6), g = !0, m = 0; m < f; m++) i(d[m]);
                e._closed && f > 0 && i(d[0])
            }
            return {
                _draw: function(t, n, i, r) {
                    function s(t) {
                        return c[(t % d + d) % d]
                    }
                    var o = n.dontStart,
                        a = n.dontFinish || n.clip,
                        h = this.getStyle(),
                        l = h.hasFill(),
                        u = h.hasStroke(),
                        c = h.getDashArray(),
                        d = !paper.support.nativeDash && u && c && c.length;
                    if (o || t.beginPath(), (l || u && !d || a) && (e(t, this, r), this._closed && t.closePath()), !a && (l || u) && (this._setStyles(t, n, i), l && (t.fill(h.getFillRule()), t.shadowColor = "rgba(0,0,0,0)"), u)) {
                        if (d) {
                            o || t.beginPath();
                            var f, p = new N(this, .25, 32, !1, r),
                                g = p.length,
                                m = -h.getDashOffset(),
                                v = 0;
                            for (m %= g; m > 0;) m -= s(v--) + s(v--);
                            for (; m < g;) f = m + s(v++), (m > 0 || f > 0) && p.drawPart(t, Math.max(m, 0), Math.max(f, 0)), m = f + s(v++)
                        }
                        t.stroke()
                    }
                },
                _drawSelected: function(n, i) {
                    n.beginPath(), e(n, this, i), n.stroke(), t(n, this._segments, i, paper.settings.handleSize)
                }
            }
        }, new function() {
            function t(t) {
                var e = t._segments;
                if (!e.length) throw new Error("Use a moveTo() command first");
                return e[e.length - 1]
            }
            return {
                moveTo: function() {
                    var t = this._segments;
                    1 === t.length && this.removeSegment(0), t.length || this._add([new k(c.read(arguments))])
                },
                moveBy: function() {
                    throw new Error("moveBy() is unsupported on Path items.")
                },
                lineTo: function() {
                    this._add([new k(c.read(arguments))])
                },
                cubicCurveTo: function() {
                    var e = c.read(arguments),
                        n = c.read(arguments),
                        i = c.read(arguments),
                        r = t(this);
                    r.setHandleOut(e.subtract(r._point)), this._add([new k(i, n.subtract(i))])
                },
                quadraticCurveTo: function() {
                    var e = c.read(arguments),
                        n = c.read(arguments),
                        i = t(this)._point;
                    this.cubicCurveTo(e.add(i.subtract(e).multiply(1 / 3)), e.add(n.subtract(e).multiply(1 / 3)), n)
                },
                curveTo: function() {
                    var e = c.read(arguments),
                        n = c.read(arguments),
                        i = r.pick(r.read(arguments), .5),
                        s = 1 - i,
                        o = t(this)._point,
                        a = e.subtract(o.multiply(s * s)).subtract(n.multiply(i * i)).divide(2 * i * s);
                    if (a.isNaN()) throw new Error("Cannot put a curve through points with parameter = " + i);
                    this.quadraticCurveTo(a, n)
                },
                arcTo: function() {
                    var e, n, i, s, o, a = Math.abs,
                        h = Math.sqrt,
                        u = t(this),
                        d = u._point,
                        p = c.read(arguments),
                        g = r.peek(arguments),
                        m = r.pick(g, !0);
                    if ("boolean" == typeof m) var y = d.add(p).divide(2),
                        e = y.add(y.subtract(d).rotate(m ? -90 : 90));
                    else if (r.remain(arguments) <= 2) e = p, p = c.read(arguments);
                    else {
                        var w = f.read(arguments),
                            x = l.isZero;
                        if (x(w.width) || x(w.height)) return this.lineTo(p);
                        var b = r.read(arguments),
                            m = !!r.read(arguments),
                            C = !!r.read(arguments),
                            y = d.add(p).divide(2),
                            S = d.subtract(y).rotate(-b),
                            T = S.x,
                            E = S.y,
                            P = a(w.width),
                            A = a(w.height),
                            z = P * P,
                            I = A * A,
                            M = T * T,
                            O = E * E,
                            L = h(M / z + O / I);
                        if (L > 1 && (P *= L, A *= L, z = P * P, I = A * A), L = (z * I - z * O - I * M) / (z * O + I * M), a(L) < 1e-12 && (L = 0), L < 0) throw new Error("Cannot create an arc with the given arguments");
                        n = new c(P * E / A, -A * T / P).multiply((C === m ? -1 : 1) * h(L)).rotate(b).add(y), o = (new v).translate(n).rotate(b).scale(P, A), s = o._inverseTransform(d), i = s.getDirectedAngle(o._inverseTransform(p)), !m && i > 0 ? i -= 360 : m && i < 0 && (i += 360)
                    }
                    if (e) {
                        var N = new _(d.add(e).divide(2), e.subtract(d).rotate(90), !0),
                            F = new _(e.add(p).divide(2), p.subtract(e).rotate(90), !0),
                            D = new _(d, p),
                            R = D.getSide(e);
                        if (!(n = N.intersect(F, !0))) {
                            if (!R) return this.lineTo(p);
                            throw new Error("Cannot create an arc with the given arguments")
                        }
                        s = d.subtract(n), i = s.getDirectedAngle(p.subtract(n));
                        var H = D.getSide(n);
                        0 === H ? i = R * a(i) : R === H && (i += i < 0 ? 360 : -360)
                    }
                    for (var q = a(i), B = q >= 360 ? 4 : Math.ceil((q - 1e-7) / 90), j = i / B, W = j * Math.PI / 360, V = 4 / 3 * Math.sin(W) / (1 + Math.cos(W)), U = [], Y = 0; Y <= B; Y++) {
                        var S = p,
                            X = null;
                        if (Y < B && (X = s.rotate(90).multiply(V), o ? (S = o._transformPoint(s), X = o._transformPoint(s.add(X)).subtract(S)) : S = n.add(s)), Y) {
                            var Z = s.rotate(-90).multiply(V);
                            o && (Z = o._transformPoint(s.add(Z)).subtract(S)), U.push(new k(S, Z, X))
                        } else u.setHandleOut(X);
                        s = s.rotate(j)
                    }
                    this._add(U)
                },
                lineBy: function() {
                    var e = c.read(arguments),
                        n = t(this)._point;
                    this.lineTo(n.add(e))
                },
                curveBy: function() {
                    var e = c.read(arguments),
                        n = c.read(arguments),
                        i = r.read(arguments),
                        s = t(this)._point;
                    this.curveTo(s.add(e), s.add(n), i)
                },
                cubicCurveBy: function() {
                    var e = c.read(arguments),
                        n = c.read(arguments),
                        i = c.read(arguments),
                        r = t(this)._point;
                    this.cubicCurveTo(r.add(e), r.add(n), r.add(i))
                },
                quadraticCurveBy: function() {
                    var e = c.read(arguments),
                        n = c.read(arguments),
                        i = t(this)._point;
                    this.quadraticCurveTo(i.add(e), i.add(n))
                },
                arcBy: function() {
                    var e = t(this)._point,
                        n = e.add(c.read(arguments)),
                        i = r.pick(r.peek(arguments), !0);
                    "boolean" == typeof i ? this.arcTo(n, i) : this.arcTo(n, e.add(c.read(arguments)))
                },
                closePath: function(t) {
                    this.setClosed(!0), this.join(this, t)
                }
            }
        }, {
            _getBounds: function(t, e) {
                var n = e.handle ? "getHandleBounds" : e.stroke ? "getStrokeBounds" : "getBounds";
                return O[n](this._segments, this._closed, this, t, e)
            },
            statics: {
                getBounds: function(t, e, n, i, r, s) {
                    function o(t) {
                        t._transformCoordinates(i, h);
                        for (var e = 0; e < 2; e++) z._addBounds(l[e], l[e + 4], h[e + 2], h[e], e, s ? s[e] : 0, u, c, d);
                        var n = l;
                        l = h, h = n
                    }
                    var a = t[0];
                    if (!a) return new g;
                    for (var h = new Array(6), l = a._transformCoordinates(i, new Array(6)), u = l.slice(0, 2), c = u.slice(), d = new Array(2), f = 1, p = t.length; f < p; f++) o(t[f]);
                    return e && o(a), new g(u[0], u[1], c[0] - u[0], c[1] - u[1])
                },
                getStrokeBounds: function(t, e, n, i, r) {
                    function s(t) {
                        m = m.include(t)
                    }

                    function o(t) {
                        m = m.unite(x.setCenter(t._point.transform(i)))
                    }

                    function a(t, e) {
                        "round" === e || t.isSmooth() ? o(t) : O._addBevelJoin(t, e, v, w, i, d, s)
                    }

                    function h(t, e) {
                        "round" === e ? o(t) : O._addSquareCap(t, e, v, i, d, s)
                    }
                    var l = n.getStyle(),
                        u = l.hasStroke(),
                        c = l.getStrokeWidth(),
                        d = u && n._getStrokeMatrix(i, r),
                        p = u && O._getStrokePadding(c, d),
                        m = O.getBounds(t, e, n, i, r, p);
                    if (!u) return m;
                    for (var v = c / 2, _ = l.getStrokeJoin(), y = l.getStrokeCap(), w = l.getMiterLimit(), x = new g(new f(p)), b = t.length - (e ? 0 : 1), C = 1; C < b; C++) a(t[C], _);
                    return e ? a(t[0], _) : b > 0 && (h(t[0], y), h(t[t.length - 1], y)), m
                },
                _getStrokePadding: function(t, e) {
                    if (!e) return [t, t];
                    var n = new c(t, 0).transform(e),
                        i = new c(0, t).transform(e),
                        r = n.getAngleInRadians(),
                        s = n.getLength(),
                        o = i.getLength(),
                        a = Math.sin(r),
                        h = Math.cos(r),
                        l = Math.tan(r),
                        u = Math.atan2(o * l, s),
                        d = Math.atan2(o, l * s);
                    return [Math.abs(s * Math.cos(u) * h + o * Math.sin(u) * a), Math.abs(o * Math.sin(d) * h + s * Math.cos(d) * a)]
                },
                _addBevelJoin: function(t, e, n, i, r, s, o, a) {
                    var h = t.getCurve(),
                        l = h.getPrevious(),
                        u = h.getPoint1().transform(r),
                        d = l.getNormalAtTime(1).multiply(n).transform(s),
                        f = h.getNormalAtTime(0).multiply(n).transform(s);
                    if (d.getDirectedAngle(f) < 0 && (d = d.negate(), f = f.negate()), a && o(u), o(u.add(d)), "miter" === e) {
                        var p = new _(u.add(d), new c(-d.y, d.x), !0).intersect(new _(u.add(f), new c(-f.y, f.x), !0), !0);
                        p && u.getDistance(p) <= i * n && o(p)
                    }
                    o(u.add(f))
                },
                _addSquareCap: function(t, e, n, i, r, s, o) {
                    var a = t._point.transform(i),
                        h = t.getLocation(),
                        l = h.getNormal().multiply(0 === h.getTime() ? n : -n).transform(r);
                    "square" === e && (o && (s(a.subtract(l)), s(a.add(l))), a = a.add(l.rotate(-90))), s(a.add(l)), s(a.subtract(l))
                },
                getHandleBounds: function(t, e, n, i, r) {
                    var s, o, a = n.getStyle(),
                        h = r.stroke && a.hasStroke();
                    if (h) {
                        var l = n._getStrokeMatrix(i, r),
                            u = a.getStrokeWidth() / 2,
                            c = u;
                        "miter" === a.getStrokeJoin() && (c = u * a.getMiterLimit()), "square" === a.getStrokeCap() && (c = Math.max(c, u * Math.SQRT2)), s = O._getStrokePadding(u, l), o = O._getStrokePadding(c, l)
                    }
                    for (var d = new Array(6), f = 1 / 0, p = -f, m = f, v = p, _ = 0, y = t.length; _ < y; _++) {
                        t[_]._transformCoordinates(i, d);
                        for (var w = 0; w < 6; w += 2) {
                            var x = w ? s : o,
                                b = x ? x[0] : 0,
                                C = x ? x[1] : 0,
                                S = d[w],
                                T = d[w + 1],
                                E = S - b,
                                P = S + b,
                                k = T - C,
                                A = T + C;
                            E < f && (f = E), P > p && (p = P), k < m && (m = k), A > v && (v = A)
                        }
                    }
                    return new g(f, m, p - f, v - m)
                }
            }
        });
    O.inject({
        statics: new function() {
            function t(t, e, n) {
                var i = r.getNamed(n),
                    s = new O(i && 0 == i.insert && w.NO_INSERT);
                return s._add(t), s._closed = e, s.set(i, {
                    insert: !0
                })
            }

            function e(e, n, r) {
                for (var s = new Array(4), o = 0; o < 4; o++) {
                    var a = i[o];
                    s[o] = new k(a._point.multiply(n).add(e), a._handleIn.multiply(n), a._handleOut.multiply(n))
                }
                return t(s, !0, r)
            }
            var n = .5522847498307936,
                i = [new k([-1, 0], [0, n], [0, -n]), new k([0, -1], [-n, 0], [n, 0]), new k([1, 0], [0, -n], [0, n]), new k([0, 1], [n, 0], [-n, 0])];
            return {
                Line: function() {
                    return t([new k(c.readNamed(arguments, "from")), new k(c.readNamed(arguments, "to"))], !1, arguments)
                },
                Circle: function() {
                    var t = c.readNamed(arguments, "center"),
                        n = r.readNamed(arguments, "radius");
                    return e(t, new f(n), arguments)
                },
                Rectangle: function() {
                    var e, i = g.readNamed(arguments, "rectangle"),
                        r = f.readNamed(arguments, "radius", 0, {
                            readNull: !0
                        }),
                        s = i.getBottomLeft(!0),
                        o = i.getTopLeft(!0),
                        a = i.getTopRight(!0),
                        h = i.getBottomRight(!0);
                    if (!r || r.isZero()) e = [new k(s), new k(o), new k(a), new k(h)];
                    else {
                        r = f.min(r, i.getSize(!0).divide(2));
                        var l = r.width,
                            u = r.height,
                            c = l * n,
                            d = u * n;
                        e = [new k(s.add(l, 0), null, [-c, 0]), new k(s.subtract(0, u), [0, d]), new k(o.add(0, u), null, [0, -d]), new k(o.add(l, 0), [-c, 0], null), new k(a.subtract(l, 0), null, [c, 0]), new k(a.add(0, u), [0, -d], null), new k(h.subtract(0, u), null, [0, d]), new k(h.subtract(l, 0), [c, 0])]
                    }
                    return t(e, !0, arguments)
                },
                RoundRectangle: "#Rectangle",
                Ellipse: function() {
                    var t = C._readEllipse(arguments);
                    return e(t.center, t.radius, arguments)
                },
                Oval: "#Ellipse",
                Arc: function() {
                    var t = c.readNamed(arguments, "from"),
                        e = c.readNamed(arguments, "through"),
                        n = c.readNamed(arguments, "to"),
                        i = r.getNamed(arguments),
                        s = new O(i && 0 == i.insert && w.NO_INSERT);
                    return s.moveTo(t), s.arcTo(e, n), s.set(i)
                },
                RegularPolygon: function() {
                    for (var e = c.readNamed(arguments, "center"), n = r.readNamed(arguments, "sides"), i = r.readNamed(arguments, "radius"), s = 360 / n, o = n % 3 == 0, a = new c(0, o ? -i : i), h = o ? -1 : .5, l = new Array(n), u = 0; u < n; u++) l[u] = new k(e.add(a.rotate((u + h) * s)));
                    return t(l, !0, arguments)
                },
                Star: function() {
                    for (var e = c.readNamed(arguments, "center"), n = 2 * r.readNamed(arguments, "points"), i = r.readNamed(arguments, "radius1"), s = r.readNamed(arguments, "radius2"), o = 360 / n, a = new c(0, -1), h = new Array(n), l = 0; l < n; l++) h[l] = new k(e.add(a.rotate(o * l).multiply(l % 2 ? s : i)));
                    return t(h, !0, arguments)
                }
            }
        }
    });
    var L = M.extend({
        _class: "CompoundPath",
        _serializeFields: {
            children: []
        },
        beans: !0,
        initialize: function(t) {
            this._children = [], this._namedChildren = {}, this._initialize(t) || ("string" == typeof t ? this.setPathData(t) : this.addChildren(Array.isArray(t) ? t : arguments))
        },
        insertChildren: function t(e, n) {
            var i = n,
                s = i[0];
            s && "number" == typeof s[0] && (i = [i]);
            for (var o = n.length - 1; o >= 0; o--) {
                var a = i[o];
                i !== n || a instanceof O || (i = r.slice(i)), Array.isArray(a) ? i[o] = new O({
                    segments: a,
                    insert: !1
                }) : a instanceof L && (i.splice.apply(i, [o, 1].concat(a.removeChildren())), a.remove())
            }
            return t.base.call(this, e, i)
        },
        reduce: function t(e) {
            for (var n = this._children, i = n.length - 1; i >= 0; i--) {
                var r = n[i].reduce(e);
                r.isEmpty() && r.remove()
            }
            if (!n.length) {
                var r = new O(w.NO_INSERT);
                return r.copyAttributes(this), r.insertAbove(this), this.remove(), r
            }
            return t.base.call(this)
        },
        isClosed: function() {
            for (var t = this._children, e = 0, n = t.length; e < n; e++)
                if (!t[e]._closed) return !1;
            return !0
        },
        setClosed: function(t) {
            for (var e = this._children, n = 0, i = e.length; n < i; n++) e[n].setClosed(t)
        },
        getFirstSegment: function() {
            var t = this.getFirstChild();
            return t && t.getFirstSegment()
        },
        getLastSegment: function() {
            var t = this.getLastChild();
            return t && t.getLastSegment()
        },
        getCurves: function() {
            for (var t = this._children, e = [], n = 0, i = t.length; n < i; n++) e.push.apply(e, t[n].getCurves());
            return e
        },
        getFirstCurve: function() {
            var t = this.getFirstChild();
            return t && t.getFirstCurve()
        },
        getLastCurve: function() {
            var t = this.getLastChild();
            return t && t.getLastCurve()
        },
        getArea: function() {
            for (var t = this._children, e = 0, n = 0, i = t.length; n < i; n++) e += t[n].getArea();
            return e
        },
        getLength: function() {
            for (var t = this._children, e = 0, n = 0, i = t.length; n < i; n++) e += t[n].getLength();
            return e
        },
        getPathData: function(t, e) {
            for (var n = this._children, i = [], r = 0, s = n.length; r < s; r++) {
                var o = n[r],
                    a = o._matrix;
                i.push(o.getPathData(t && !a.isIdentity() ? t.appended(a) : t, e))
            }
            return i.join("")
        },
        _hitTestChildren: function t(e, n, i) {
            return t.base.call(this, e, n.class === O || "path" === n.type ? n : r.set({}, n, {
                fill: !1
            }), i)
        },
        _draw: function(t, e, n, i) {
            var r = this._children;
            if (r.length) {
                e = e.extend({
                    dontStart: !0,
                    dontFinish: !0
                }), t.beginPath();
                for (var s = 0, o = r.length; s < o; s++) r[s].draw(t, e, i);
                if (!e.clip) {
                    this._setStyles(t, e, n);
                    var a = this._style;
                    a.hasFill() && (t.fill(a.getFillRule()), t.shadowColor = "rgba(0,0,0,0)"), a.hasStroke() && t.stroke()
                }
            }
        },
        _drawSelected: function(t, e, n) {
            for (var i = this._children, r = 0, s = i.length; r < s; r++) {
                var o = i[r],
                    a = o._matrix;
                n[o._id] || o._drawSelected(t, a.isIdentity() ? e : e.appended(a))
            }
        }
    }, new function() {
        function t(t, e) {
            var n = t._children;
            if (e && !n.length) throw new Error("Use a moveTo() command first");
            return n[n.length - 1]
        }
        return r.each(["lineTo", "cubicCurveTo", "quadraticCurveTo", "curveTo", "arcTo", "lineBy", "cubicCurveBy", "quadraticCurveBy", "curveBy", "arcBy"], function(e) {
            this[e] = function() {
                var n = t(this, !0);
                n[e].apply(n, arguments)
            }
        }, {
            moveTo: function() {
                var e = t(this),
                    n = e && e.isEmpty() ? e : new O(w.NO_INSERT);
                n !== e && this.addChild(n), n.moveTo.apply(n, arguments)
            },
            moveBy: function() {
                var e = t(this, !0),
                    n = e && e.getLastSegment(),
                    i = c.read(arguments);
                this.moveTo(n ? i.add(n._point) : i)
            },
            closePath: function(e) {
                t(this, !0).closePath(e)
            }
        })
    }, r.each(["reverse", "flatten", "simplify", "smooth"], function(t) {
        this[t] = function(e) {
            for (var n, i = this._children, r = 0, s = i.length; r < s; r++) n = i[r][t](e) || n;
            return n
        }
    }, {}));
    M.inject(new function() {
        function t(t, e) {
            var n = t.clone(!1).reduce({
                simplify: !0
            }).transform(null, !0, !0);
            return e ? n.resolveCrossings().reorient("nonzero" === n.getFillRule(), !0) : n
        }

        function n(t, e, n, i, r) {
            var s = new L(w.NO_INSERT);
            return s.addChildren(t, !0), s = s.reduce({
                simplify: e
            }), r && 0 == r.insert || s.insertAbove(i && n.isSibling(i) && n.getIndex() < i.getIndex() ? i : n), s.copyAttributes(n, !0), s
        }

        function i(e, i, r, o) {
            function a(t) {
                for (var e = 0, n = t.length; e < n; e++) {
                    var i = t[e];
                    w.push.apply(w, i._segments), x.push.apply(x, i.getCurves()), i._overlapsOnly = !0
                }
            }
            if (o && (0 == o.trace || o.stroke) && /^(subtract|intersect)$/.test(r)) return s(e, i, r);
            var l = t(e, !0),
                c = i && e !== i && t(i, !0),
                p = v[r];
            p[r] = !0, c && (p.subtract || p.exclude) ^ c.isClockwise() ^ l.isClockwise() && c.reverse();
            var g, m = u(I.expand(l.getCrossings(c))),
                _ = l._children || [l],
                y = c && (c._children || [c]),
                w = [],
                x = [];
            if (m.length) {
                a(_), y && a(y);
                for (var b = 0, C = m.length; b < C; b++) d(m[b]._segment, l, c, x, p);
                for (var b = 0, C = w.length; b < C; b++) {
                    var S = w[b],
                        T = S._intersection;
                    S._winding || d(S, l, c, x, p), T && T._overlap || (S._path._overlapsOnly = !1)
                }
                g = f(w, p)
            } else g = h(y ? _.concat(y) : _.slice(), function(t) {
                return !!p[t]
            });
            return n(g, !0, e, i, o)
        }

        function s(e, i, r) {
            function s(t) {
                if (!c[t._id] && (u || a.contains(t.getPointAt(t.getLength() / 2)) ^ l)) return d.unshift(t), c[t._id] = !0
            }
            for (var o = t(e), a = t(i), h = o.getCrossings(a), l = "subtract" === r, u = "divide" === r, c = {}, d = [], f = h.length - 1; f >= 0; f--) {
                var p = h[f].split();
                p && (s(p) && p.getFirstSegment().setHandleIn(0, 0), o.getLastSegment().setHandleOut(0, 0))
            }
            return s(o), n(d, !1, e, i)
        }

        function o(t, e) {
            for (var n = t; n;) {
                if (n === e) return;
                n = n._previous
            }
            for (; t._next && t._next !== e;) t = t._next;
            if (!t._next) {
                for (; e._previous;) e = e._previous;
                t._next = e, e._previous = t
            }
        }

        function a(t) {
            for (var e = t.length - 1; e >= 0; e--) t[e].clearHandles()
        }

        function h(t, e, n) {
            var i = t && t.length;
            if (i) {
                var s = r.each(t, function(t, e) {
                        this[t._id] = {
                            container: null,
                            winding: t.isClockwise() ? 1 : -1,
                            index: e
                        }
                    }, {}),
                    o = t.slice().sort(function(t, e) {
                        return m(e.getArea()) - m(t.getArea())
                    }),
                    a = o[0];
                null == n && (n = a.isClockwise());
                for (var h = 0; h < i; h++) {
                    for (var l = o[h], u = s[l._id], c = l.getInteriorPoint(), d = 0, f = h - 1; f >= 0; f--) {
                        var p = o[f];
                        if (p.contains(c)) {
                            var g = s[p._id];
                            d = g.winding, u.winding += d, u.container = g.exclude ? g.container : p;
                            break
                        }
                    }
                    if (e(u.winding) === e(d)) u.exclude = !0, t[u.index] = null;
                    else {
                        var v = u.container;
                        l.setClockwise(v ? !v.isClockwise() : n)
                    }
                }
            }
            return t
        }

        function u(t, e, n) {
            function i(t) {
                return t._path._id + "." + t._segment1._index
            }
            for (var r, s, h, l = e && [], u = !1, c = n || [], d = n && {}, f = (n && n.length) - 1; f >= 0; f--) {
                var p = n[f];
                p._path && (d[i(p)] = !0)
            }
            for (var f = t.length - 1; f >= 0; f--) {
                var g, m = t[f],
                    v = m._time,
                    _ = v,
                    y = e && !e(m),
                    p = m._curve;
                if (p && (p !== s ? (u = !p.hasHandles() || d && d[i(p)], r = [], h = null, s = p) : h >= 1e-8 && (v /= h)), y) r && r.push(m);
                else {
                    if (e && l.unshift(m), h = _, v < 1e-8) g = p._segment1;
                    else if (v > 1 - 1e-8) g = p._segment2;
                    else {
                        var w = p.divideAtTime(v, !0);
                        u && c.push(p, w), g = w._segment1;
                        for (var x = r.length - 1; x >= 0; x--) {
                            var b = r[x];
                            b._time = (b._time - v) / (1 - v)
                        }
                    }
                    m._setSegment(g);
                    var C = g._intersection,
                        S = m._intersection;
                    if (C) {
                        o(C, S);
                        for (var T = C; T;) o(T._intersection, C), T = T._next
                    } else g._intersection = S
                }
            }
            return n || a(c), l || t
        }

        function c(t, e, n, i, r) {
            function s(s) {
                var o = s[u + 0],
                    h = s[u + 6];
                if (!(v < p(o, h) || v > g(o, h))) {
                    var d = s[l + 0],
                        m = s[l + 2],
                        x = s[l + 4],
                        b = s[l + 6];
                    if (o === h) return void((d < w && b > y || b < w && d > y) && (T = !0));
                    var E = v === o ? 0 : v === h ? 1 : y > g(d, m, x, b) || w < p(d, m, x, b) ? 1 : z.solveCubic(s, u, v, k, 0, 1) > 0 ? k[0] : 1,
                        A = 0 === E ? d : 1 === E ? b : z.getPoint(s, E)[n ? "y" : "x"],
                        I = o > h ? 1 : -1,
                        M = a[u] > a[u + 6] ? 1 : -1,
                        O = a[l + 6];
                    return v !== o ? (A < y ? C += I : A > w ? S += I : T = !0, A > f - _ && A < f + _ && (P /= 2)) : (I !== M ? d < y ? C += I : d > w && (S += I) : d != O && (O < w && A > w ? (S += I, T = !0) : O > y && A < y && (C += I, T = !0)), P = 0), a = s, !r && A > y && A < w && 0 === z.getTangent(s, E)[n ? "x" : "y"] && c(t, e, !n, i, !0)
                }
            }

            function o(t) {
                var e = t[u + 0],
                    i = t[u + 2],
                    r = t[u + 4],
                    o = t[u + 6];
                if (v <= g(e, i, r, o) && v >= p(e, i, r, o))
                    for (var a, h = t[l + 0], c = t[l + 2], d = t[l + 4], f = t[l + 6], m = y > g(h, c, d, f) || w < p(h, c, d, f) ? [t] : z.getMonoCurves(t, n), _ = 0, x = m.length; _ < x; _++)
                        if (a = s(m[_])) return a
            }
            for (var a, h, l = n ? 1 : 0, u = 1 ^ l, d = [t.x, t.y], f = d[l], v = d[u], _ = 1e-6, y = f - 1e-9, w = f + 1e-9, x = 0, b = 0, C = 0, S = 0, T = !1, E = !1, P = 1, k = [], A = 0, I = e.length; A < I; A++) {
                var M, O = e[A],
                    L = O._path,
                    N = O.getValues();
                if (!(A && e[A - 1]._path === L || (a = null, L._closed || (h = z.getValues(L.getLastCurve().getSegment2(), O.getSegment1(), null, !i), h[u] !== h[u + 6] && (a = h)), a))) {
                    a = N;
                    for (var F = L.getLastCurve(); F && F !== O;) {
                        var D = F.getValues();
                        if (D[u] !== D[u + 6]) {
                            a = D;
                            break
                        }
                        F = F.getPrevious()
                    }
                }
                if (M = o(N)) return M;
                if (A + 1 === I || e[A + 1]._path !== L) {
                    if (h && (M = o(h))) return M;
                    !T || C || S || (C = S = L.isClockwise(i) ^ n ? 1 : -1), x += C, b += S, C = S = 0, T && (E = !0, T = !1), h = null
                }
            }
            return x = m(x), b = m(b), {
                winding: g(x, b),
                windingL: x,
                windingR: b,
                quality: P,
                onPath: E
            }
        }

        function d(t, e, n, i, r) {
            var s, o = [],
                a = t,
                h = 0;
            do {
                var u = t.getCurve(),
                    d = u.getLength();
                o.push({
                    segment: t,
                    curve: u,
                    length: d
                }), h += d, t = t.getNext()
            } while (t && !t._intersection && t !== a);
            for (var f = [.5, .25, .75], s = {
                    winding: 0,
                    quality: -1
                }, p = 0; p < f.length && s.quality < .5; p++)
                for (var d = h * f[p], g = 0, v = o.length; g < v; g++) {
                    var _ = o[g],
                        y = _.length;
                    if (d <= y) {
                        var u = _.curve,
                            w = u._path,
                            x = w._parent,
                            b = x instanceof L ? x : w,
                            C = l.clamp(u.getTimeAt(d), 1e-8, 1 - 1e-8),
                            S = u.getPointAtTime(C),
                            T = m(u.getTangentAtTime(C).y) < Math.SQRT1_2,
                            E = r.subtract && n && (b === e && n._getWinding(S, T, !0).winding || b === n && !e._getWinding(S, T, !0).winding) ? {
                                winding: 0,
                                quality: 1
                            } : c(S, i, T, !0);
                        E.quality > s.quality && (s = E);
                        break
                    }
                    d -= y
                }
            for (var g = o.length - 1; g >= 0; g--) o[g].segment._winding = s
        }

        function f(t, e) {
            function n(t) {
                var n;
                return !(!t || t._visited || e && (!e[(n = t._winding || {}).winding] || e.unite && 2 === n.winding && n.windingL && n.windingR))
            }

            function i(t) {
                if (t)
                    for (var e = 0, n = s.length; e < n; e++)
                        if (t === s[e]) return !0;
                return !1
            }

            function r(t) {
                for (var e = t._segments, n = 0, i = e.length; n < i; n++) e[n]._visited = !0
            }
            var s, o = [];
            t.sort(function(t, e) {
                var n = t._intersection,
                    i = e._intersection,
                    r = !(!n || !n._overlap),
                    s = !(!i || !i._overlap),
                    o = t._path,
                    a = e._path;
                return r ^ s ? r ? 1 : -1 : !n ^ !i ? n ? 1 : -1 : o !== a ? o._id - a._id : t._index - e._index
            });
            for (var a = 0, h = t.length; a < h; a++) {
                var l, u, c, d = t[a],
                    f = n(d),
                    p = null,
                    g = !1,
                    m = !0,
                    v = [];
                if (f && d._path._overlapsOnly) {
                    var _ = d._path,
                        y = d._intersection._segment._path;
                    _.compare(y) && (_.getArea() && o.push(_.clone(!1)), r(_), r(y), f = !1)
                }
                for (; f;) {
                    var x = !p,
                        b = function(t, e) {
                            function r(r, o) {
                                for (; r && r !== o;) {
                                    var a = r._segment,
                                        l = a && a._path;
                                    if (l) {
                                        var u = a.getNext() || l.getFirstSegment(),
                                            c = u._intersection;
                                        a !== t && (i(a) || i(u) || u && n(a) && (n(u) || c && n(c._segment))) && h.push(a), e && s.push(a)
                                    }
                                    r = r._next
                                }
                            }
                            var o = t._intersection,
                                a = o,
                                h = [];
                            if (e && (s = [t]), o) {
                                for (r(o); o && o._prev;) o = o._prev;
                                r(o, a)
                            }
                            return h
                        }(d, x),
                        C = b.shift(),
                        g = !x && (i(d) || i(C)),
                        S = !g && C;
                    if (x && (p = new O(w.NO_INSERT), l = null), g) {
                        (d.isFirst() || d.isLast()) && (m = d._path._closed), d._visited = !0;
                        break
                    }
                    if (S && l && (v.push(l), l = null), l || (S && b.push(d), l = {
                            start: p._segments.length,
                            crossings: b,
                            visited: u = [],
                            handleIn: c
                        }), S && (d = C), !n(d)) {
                        p.removeSegments(l.start);
                        for (var T = 0, E = u.length; T < E; T++) u[T]._visited = !1;
                        u.length = 0;
                        do {
                            (d = l && l.crossings.shift()) && d._path || (d = null, (l = v.pop()) && (u = l.visited, c = l.handleIn))
                        } while (l && !n(d));
                        if (!d) break
                    }
                    var P = d.getNext();
                    p.add(new k(d._point, c, P && d._handleOut)), d._visited = !0, u.push(d), d = P || d._path.getFirstSegment(), c = P && P._handleIn
                }
                g && (m && (p.getFirstSegment().setHandleIn(c), p.setClosed(m)), 0 !== p.getArea() && o.push(p))
            }
            return o
        }
        var p = Math.min,
            g = Math.max,
            m = Math.abs,
            v = {
                unite: {
                    1: !0,
                    2: !0
                },
                intersect: {
                    2: !0
                },
                subtract: {
                    1: !0
                },
                exclude: {
                    1: !0,
                    "-1": !0
                }
            };
        return {
            _getWinding: function(t, e, n) {
                return c(t, this.getCurves(), e, n)
            },
            unite: function(t, e) {
                return i(this, t, "unite", e)
            },
            intersect: function(t, e) {
                return i(this, t, "intersect", e)
            },
            subtract: function(t, e) {
                return i(this, t, "subtract", e)
            },
            exclude: function(t, e) {
                return i(this, t, "exclude", e)
            },
            divide: function(t, e) {
                return e && (0 == e.trace || e.stroke) ? s(this, t, "divide") : n([this.subtract(t, e), this.intersect(t, e)], !0, this, t, e)
            },
            resolveCrossings: function() {
                function t(t, e) {
                    var n = t && t._intersection;
                    return n && n._overlap && n._path === e
                }
                var e = this._children,
                    n = e || [this],
                    i = !1,
                    s = !1,
                    o = this.getIntersections(null, function(t) {
                        return t.hasOverlap() && (i = !0) || t.isCrossing() && (s = !0)
                    }),
                    h = i && s && [];
                if (o = I.expand(o), i)
                    for (var l = u(o, function(t) {
                            return t.hasOverlap()
                        }, h), c = l.length - 1; c >= 0; c--) {
                        var d = l[c],
                            p = d._path,
                            g = d._segment,
                            m = g.getPrevious(),
                            v = g.getNext();
                        t(m, p) && t(v, p) && (g.remove(), m._handleOut._set(0, 0), v._handleIn._set(0, 0), m === g || m.getCurve().hasLength() || (v._handleIn.set(m._handleIn), m.remove()))
                    }
                s && (u(o, i && function(t) {
                    var e = t.getCurve(),
                        n = t.getSegment(),
                        i = t._intersection,
                        r = i._curve,
                        s = i._segment;
                    if (e && r && e._path && r._path) return !0;
                    n && (n._intersection = null), s && (s._intersection = null)
                }, h), h && a(h), n = f(r.each(n, function(t) {
                    this.push.apply(this, t._segments)
                }, [])));
                var _, y = n.length;
                return y > 1 && e ? (n !== e && this.setChildren(n), _ = this) : 1 !== y || e || (n[0] !== this && this.setSegments(n[0].removeSegments()), _ = this), _ || (_ = new L(w.NO_INSERT), _.addChildren(n), _ = _.reduce(), _.copyAttributes(this), this.replaceWith(_)), _
            },
            reorient: function(t, n) {
                var i = this._children;
                return i && i.length ? this.setChildren(h(this.removeChildren(), function(e) {
                    return !!(t ? e : 1 & e)
                }, n)) : n !== e && this.setClockwise(n), this
            },
            getInteriorPoint: function() {
                var t = this.getBounds(),
                    e = t.getCenter(!0);
                if (!this.contains(e)) {
                    for (var n = this.getCurves(), i = e.y, r = [], s = [], o = 0, a = n.length; o < a; o++) {
                        var h = n[o].getValues(),
                            l = h[1],
                            u = h[3],
                            c = h[5],
                            d = h[7];
                        if (i >= p(l, u, c, d) && i <= g(l, u, c, d))
                            for (var f = z.getMonoCurves(h), m = 0, v = f.length; m < v; m++) {
                                var _ = f[m],
                                    y = _[1],
                                    w = _[7];
                                if (y !== w && (i >= y && i <= w || i >= w && i <= y)) {
                                    var x = i === y ? _[0] : i === w ? _[6] : 1 === z.solveCubic(_, 1, i, s, 0, 1) ? z.getPoint(_, s[0]).x : (_[0] + _[6]) / 2;
                                    r.push(x)
                                }
                            }
                    }
                    r.length > 1 && (r.sort(function(t, e) {
                        return t - e
                    }), e.x = (r[0] + r[1]) / 2)
                }
                return e
            }
        }
    });
    var N = r.extend({
            _class: "PathFlattener",
            initialize: function(t, e, n, i, r) {
                function s(t, e) {
                    var n = z.getValues(t, e, r);
                    h.push(n), o(n, t._index, 0, 1)
                }

                function o(t, n, r, s) {
                    if (!(s - r > c) || i && z.isStraight(t) || z.isFlatEnough(t, e || .25)) {
                        var a = t[6] - t[0],
                            h = t[7] - t[1],
                            d = Math.sqrt(a * a + h * h);
                        d > 0 && (u += d, l.push({
                            offset: u,
                            curve: t,
                            index: n,
                            time: s
                        }))
                    } else {
                        var f = z.subdivide(t, .5),
                            p = (r + s) / 2;
                        o(f[0], n, r, p), o(f[1], n, p, s)
                    }
                }
                for (var a, h = [], l = [], u = 0, c = 1 / (n || 32), d = t._segments, f = d[0], p = 1, g = d.length; p < g; p++) a = d[p], s(f, a), f = a;
                t._closed && s(a, d[0]), this.curves = h, this.parts = l, this.length = u, this.index = 0
            },
            _get: function(t) {
                for (var e, n = this.parts, i = n.length, r = this.index; e = r, r && !(n[--r].offset < t););
                for (; e < i; e++) {
                    var s = n[e];
                    if (s.offset >= t) {
                        this.index = e;
                        var o = n[e - 1],
                            a = o && o.index === s.index ? o.time : 0,
                            h = o ? o.offset : 0;
                        return {
                            index: s.index,
                            time: a + (s.time - a) * (t - h) / (s.offset - h)
                        }
                    }
                }
                return {
                    index: n[i - 1].index,
                    time: 1
                }
            },
            drawPart: function(t, e, n) {
                for (var i = this._get(e), r = this._get(n), s = i.index, o = r.index; s <= o; s++) {
                    var a = z.getPart(this.curves[s], s === i.index ? i.time : 0, s === r.index ? r.time : 1);
                    s === i.index && t.moveTo(a[0], a[1]), t.bezierCurveTo.apply(t, a.slice(2))
                }
            }
        }, r.each(z._evaluateMethods, function(t) {
            this[t + "At"] = function(e) {
                var n = this._get(e);
                return z[t](this.curves[n.index], n.time)
            }
        }, {})),
        F = r.extend({
            initialize: function(t) {
                for (var e, n = this.points = [], i = t._segments, r = t._closed, s = 0, o = i.length; s < o; s++) {
                    var a = i[s].point;
                    e && e.equals(a) || n.push(e = a.clone())
                }
                r && (n.unshift(n[n.length - 1]), n.push(n[1])), this.closed = r
            },
            fit: function(t) {
                var e = this.points,
                    n = e.length,
                    i = null;
                return n > 0 && (i = [new k(e[0])], n > 1 && (this.fitCubic(i, t, 0, n - 1, e[1].subtract(e[0]), e[n - 2].subtract(e[n - 1])), this.closed && (i.shift(), i.pop()))), i
            },
            fitCubic: function(t, e, n, i, r, s) {
                var o = this.points;
                if (i - n == 1) {
                    var a = o[n],
                        h = o[i],
                        l = a.getDistance(h) / 3;
                    return void this.addCurve(t, [a, a.add(r.normalize(l)), h.add(s.normalize(l)), h])
                }
                for (var u, c = this.chordLengthParameterize(n, i), d = Math.max(e, e * e), f = !0, p = 0; p <= 4; p++) {
                    var g = this.generateBezier(n, i, c, r, s),
                        m = this.findMaxError(n, i, g, c);
                    if (m.error < e && f) return void this.addCurve(t, g);
                    if (u = m.index, m.error >= d) break;
                    f = this.reparameterize(n, i, c, g), d = m.error
                }
                var v = o[u - 1].subtract(o[u + 1]);
                this.fitCubic(t, e, n, u, r, v), this.fitCubic(t, e, u, i, v.negate(), s)
            },
            addCurve: function(t, e) {
                t[t.length - 1].setHandleOut(e[1].subtract(e[0])), t.push(new k(e[3], e[2].subtract(e[3])))
            },
            generateBezier: function(t, e, n, i, r) {
                for (var s = Math.abs, o = this.points, a = o[t], h = o[e], l = [
                        [0, 0],
                        [0, 0]
                    ], u = [0, 0], c = 0, d = e - t + 1; c < d; c++) {
                    var f = n[c],
                        p = 1 - f,
                        g = 3 * f * p,
                        m = p * p * p,
                        v = g * p,
                        _ = g * f,
                        y = f * f * f,
                        w = i.normalize(v),
                        x = r.normalize(_),
                        b = o[t + c].subtract(a.multiply(m + v)).subtract(h.multiply(_ + y));
                    l[0][0] += w.dot(w), l[0][1] += w.dot(x), l[1][0] = l[0][1], l[1][1] += x.dot(x), u[0] += w.dot(b), u[1] += x.dot(b)
                }
                var C, S, T = l[0][0] * l[1][1] - l[1][0] * l[0][1];
                if (s(T) > 1e-12) {
                    var E = l[0][0] * u[1] - l[1][0] * u[0];
                    C = (u[0] * l[1][1] - u[1] * l[0][1]) / T, S = E / T
                } else {
                    var P = l[0][0] + l[0][1],
                        k = l[1][0] + l[1][1];
                    C = S = s(P) > 1e-12 ? u[0] / P : s(k) > 1e-12 ? u[1] / k : 0
                }
                var A, z, I = h.getDistance(a),
                    M = 1e-12 * I;
                if (C < M || S < M) C = S = I / 3;
                else {
                    var O = h.subtract(a);
                    A = i.normalize(C), z = r.normalize(S), A.dot(O) - z.dot(O) > I * I && (C = S = I / 3, A = z = null)
                }
                return [a, a.add(A || i.normalize(C)), h.add(z || r.normalize(S)), h]
            },
            reparameterize: function(t, e, n, i) {
                for (var r = t; r <= e; r++) n[r - t] = this.findRoot(i, this.points[r], n[r - t]);
                for (var r = 1, s = n.length; r < s; r++)
                    if (n[r] <= n[r - 1]) return !1;
                return !0
            },
            findRoot: function(t, e, n) {
                for (var i = [], r = [], s = 0; s <= 2; s++) i[s] = t[s + 1].subtract(t[s]).multiply(3);
                for (var s = 0; s <= 1; s++) r[s] = i[s + 1].subtract(i[s]).multiply(2);
                var o = this.evaluate(3, t, n),
                    a = this.evaluate(2, i, n),
                    h = this.evaluate(1, r, n),
                    u = o.subtract(e),
                    c = a.dot(a) + u.dot(h);
                return l.isZero(c) ? n : n - u.dot(a) / c
            },
            evaluate: function(t, e, n) {
                for (var i = e.slice(), r = 1; r <= t; r++)
                    for (var s = 0; s <= t - r; s++) i[s] = i[s].multiply(1 - n).add(i[s + 1].multiply(n));
                return i[0]
            },
            chordLengthParameterize: function(t, e) {
                for (var n = [0], i = t + 1; i <= e; i++) n[i - t] = n[i - t - 1] + this.points[i].getDistance(this.points[i - 1]);
                for (var i = 1, r = e - t; i <= r; i++) n[i] /= n[r];
                return n
            },
            findMaxError: function(t, e, n, i) {
                for (var r = Math.floor((e - t + 1) / 2), s = 0, o = t + 1; o < e; o++) {
                    var a = this.evaluate(3, n, i[o - t]),
                        h = a.subtract(this.points[o]),
                        l = h.x * h.x + h.y * h.y;
                    l >= s && (s = l, r = o)
                }
                return {
                    error: s,
                    index: r
                }
            }
        }),
        D = w.extend({
            _class: "TextItem",
            _applyMatrix: !1,
            _canApplyMatrix: !1,
            _serializeFields: {
                content: null
            },
            _boundsOptions: {
                stroke: !1,
                handle: !1
            },
            initialize: function(t) {
                this._content = "", this._lines = [];
                var n = t && r.isPlainObject(t) && t.x === e && t.y === e;
                this._initialize(n && t, !n && c.read(arguments))
            },
            _equals: function(t) {
                return this._content === t._content
            },
            copyContent: function(t) {
                this.setContent(t._content)
            },
            getContent: function() {
                return this._content
            },
            setContent: function(t) {
                this._content = "" + t, this._lines = this._content.split(/\r\n|\n|\r/gm), this._changed(265)
            },
            isEmpty: function() {
                return !this._content
            },
            getCharacterStyle: "#getStyle",
            setCharacterStyle: "#setStyle",
            getParagraphStyle: "#getStyle",
            setParagraphStyle: "#setStyle"
        }),
        R = D.extend({
            _class: "PointText",
            initialize: function() {
                D.apply(this, arguments)
            },
            getPoint: function() {
                var t = this._matrix.getTranslation();
                return new d(t.x, t.y, this, "setPoint")
            },
            setPoint: function() {
                var t = c.read(arguments);
                this.translate(t.subtract(this._matrix.getTranslation()))
            },
            _draw: function(t, e, n) {
                if (this._content) {
                    this._setStyles(t, e, n);
                    var i = this._lines,
                        r = this._style,
                        s = r.hasFill(),
                        o = r.hasStroke(),
                        a = r.getLeading(),
                        h = t.shadowColor;
                    t.font = r.getFontStyle(), t.textAlign = r.getJustification();
                    for (var l = 0, u = i.length; l < u; l++) {
                        t.shadowColor = h;
                        var c = i[l];
                        s && (t.fillText(c, 0, 0), t.shadowColor = "rgba(0,0,0,0)"), o && t.strokeText(c, 0, 0), t.translate(0, a)
                    }
                }
            },
            _getBounds: function(t, e) {
                var n = this._style,
                    i = this._lines,
                    r = i.length,
                    s = n.getJustification(),
                    o = n.getLeading(),
                    a = this.getView().getTextWidth(n.getFontStyle(), i),
                    h = 0;
                "left" !== s && (h -= a / ("center" === s ? 2 : 1));
                var l = new g(h, r ? -.75 * o : 0, a, r * o);
                return t ? t._transformBounds(l, l) : l
            }
        }),
        H = r.extend(new function() {
            function t(t) {
                var i, r = t.match(/^#(\w{1,2})(\w{1,2})(\w{1,2})$/);
                if (r) {
                    i = [0, 0, 0];
                    for (var s = 0; s < 3; s++) {
                        var a = r[s + 1];
                        i[s] = parseInt(1 == a.length ? a + a : a, 16) / 255
                    }
                } else if (r = t.match(/^rgba?\((.*)\)$/)) {
                    i = r[1].split(",");
                    for (var s = 0, h = i.length; s < h; s++) {
                        var a = +i[s];
                        i[s] = s < 3 ? a / 255 : a
                    }
                } else if (n) {
                    var l = o[t];
                    if (!l) {
                        e || (e = tt.getContext(1, 1), e.globalCompositeOperation = "copy"), e.fillStyle = "rgba(0,0,0,0)", e.fillStyle = t, e.fillRect(0, 0, 1, 1);
                        var u = e.getImageData(0, 0, 1, 1).data;
                        l = o[t] = [u[0] / 255, u[1] / 255, u[2] / 255]
                    }
                    i = l.slice()
                } else i = [0, 0, 0];
                return i
            }
            var e, i = {
                    gray: ["gray"],
                    rgb: ["red", "green", "blue"],
                    hsb: ["hue", "saturation", "brightness"],
                    hsl: ["hue", "saturation", "lightness"],
                    gradient: ["gradient", "origin", "destination", "highlight"]
                },
                s = {},
                o = {},
                a = [
                    [0, 3, 1],
                    [2, 0, 1],
                    [1, 0, 3],
                    [1, 2, 0],
                    [3, 1, 0],
                    [0, 1, 2]
                ],
                l = {
                    "rgb-hsb": function(t, e, n) {
                        var i = Math.max(t, e, n),
                            r = Math.min(t, e, n),
                            s = i - r;
                        return [0 === s ? 0 : 60 * (i == t ? (e - n) / s + (e < n ? 6 : 0) : i == e ? (n - t) / s + 2 : (t - e) / s + 4), 0 === i ? 0 : s / i, i]
                    },
                    "hsb-rgb": function(t, e, n) {
                        t = (t / 60 % 6 + 6) % 6;
                        var i = Math.floor(t),
                            r = t - i,
                            i = a[i],
                            s = [n, n * (1 - e), n * (1 - e * r), n * (1 - e * (1 - r))];
                        return [s[i[0]], s[i[1]], s[i[2]]]
                    },
                    "rgb-hsl": function(t, e, n) {
                        var i = Math.max(t, e, n),
                            r = Math.min(t, e, n),
                            s = i - r,
                            o = 0 === s,
                            a = o ? 0 : 60 * (i == t ? (e - n) / s + (e < n ? 6 : 0) : i == e ? (n - t) / s + 2 : (t - e) / s + 4),
                            h = (i + r) / 2;
                        return [a, o ? 0 : h < .5 ? s / (i + r) : s / (2 - i - r), h]
                    },
                    "hsl-rgb": function(t, e, n) {
                        if (t = (t / 360 % 1 + 1) % 1, 0 === e) return [n, n, n];
                        for (var i = [t + 1 / 3, t, t - 1 / 3], r = n < .5 ? n * (1 + e) : n + e - n * e, s = 2 * n - r, o = [], a = 0; a < 3; a++) {
                            var h = i[a];
                            h < 0 && (h += 1), h > 1 && (h -= 1), o[a] = 6 * h < 1 ? s + 6 * (r - s) * h : 2 * h < 1 ? r : 3 * h < 2 ? s + (r - s) * (2 / 3 - h) * 6 : s
                        }
                        return o
                    },
                    "rgb-gray": function(t, e, n) {
                        return [.2989 * t + .587 * e + .114 * n]
                    },
                    "gray-rgb": function(t) {
                        return [t, t, t]
                    },
                    "gray-hsb": function(t) {
                        return [0, 0, t]
                    },
                    "gray-hsl": function(t) {
                        return [0, 0, t]
                    },
                    "gradient-rgb": function() {
                        return []
                    },
                    "rgb-gradient": function() {
                        return []
                    }
                };
            return r.each(i, function(t, e) {
                s[e] = [], r.each(t, function(t, n) {
                    var o = r.capitalize(t),
                        a = /^(hue|saturation)$/.test(t),
                        h = s[e][n] = "gradient" === t ? function(t) {
                            var e = this._components[0];
                            return t = q.read(Array.isArray(t) ? t : arguments, 0, {
                                readNull: !0
                            }), e !== t && (e && e._removeOwner(this), t && t._addOwner(this)), t
                        } : "gradient" === e ? function() {
                            return c.read(arguments, 0, {
                                readNull: "highlight" === t,
                                clone: !0
                            })
                        } : function(t) {
                            return null == t || isNaN(t) ? 0 : t
                        };
                    this["get" + o] = function() {
                        return this._type === e || a && /^hs[bl]$/.test(this._type) ? this._components[n] : this._convert(e)[n]
                    }, this["set" + o] = function(t) {
                        this._type === e || a && /^hs[bl]$/.test(this._type) || (this._components = this._convert(e), this._properties = i[e], this._type = e), this._components[n] = h.call(this, t), this._changed()
                    }
                }, this)
            }, {
                _class: "Color",
                _readIndex: !0,
                initialize: function e(n) {
                    var o, a, h, l, u = arguments,
                        c = this.__read,
                        d = 0;
                    Array.isArray(n) && (u = n, n = u[0]);
                    var f = null != n && typeof n;
                    if ("string" === f && n in i && (o = n, n = u[1], Array.isArray(n) ? (a = n, h = u[2]) : (c && (d = 1), u = r.slice(u, 1), f = typeof n)), !a) {
                        if (l = "number" === f ? u : "object" === f && null != n.length ? n : null) {
                            o || (o = l.length >= 3 ? "rgb" : "gray");
                            var p = i[o].length;
                            h = l[p], c && (d += l === arguments ? p + (null != h ? 1 : 0) : 1), l.length > p && (l = r.slice(l, 0, p))
                        } else if ("string" === f) o = "rgb", a = t(n), 4 === a.length && (h = a[3], a.length--);
                        else if ("object" === f)
                            if (n.constructor === e) {
                                if (o = n._type, a = n._components.slice(), h = n._alpha, "gradient" === o)
                                    for (var g = 1, m = a.length; g < m; g++) {
                                        var v = a[g];
                                        v && (a[g] = v.clone())
                                    }
                            } else if (n.constructor === q) o = "gradient", l = u;
                        else {
                            o = "hue" in n ? "lightness" in n ? "hsl" : "hsb" : "gradient" in n || "stops" in n || "radial" in n ? "gradient" : "gray" in n ? "gray" : "rgb";
                            var _ = i[o],
                                y = s[o];
                            this._components = a = [];
                            for (var g = 0, m = _.length; g < m; g++) {
                                var w = n[_[g]];
                                null == w && !g && "gradient" === o && "stops" in n && (w = {
                                    stops: n.stops,
                                    radial: n.radial
                                }), w = y[g].call(this, w), null != w && (a[g] = w)
                            }
                            h = n.alpha
                        }
                        c && o && (d = 1)
                    }
                    if (this._type = o || "rgb", !a) {
                        this._components = a = [];
                        for (var y = s[this._type], g = 0, m = y.length; g < m; g++) {
                            var w = y[g].call(this, l && l[g]);
                            null != w && (a[g] = w)
                        }
                    }
                    return this._components = a, this._properties = i[this._type], this._alpha = h, c && (this.__read = d), this
                },
                set: "#initialize",
                _serialize: function(t, e) {
                    var n = this.getComponents();
                    return r.serialize(/^(gray|rgb)$/.test(this._type) ? n : [this._type].concat(n), t, !0, e)
                },
                _changed: function() {
                    this._canvasStyle = null, this._owner && this._owner._changed(65)
                },
                _convert: function(t) {
                    var e;
                    return this._type === t ? this._components.slice() : (e = l[this._type + "-" + t]) ? e.apply(this, this._components) : l["rgb-" + t].apply(this, l[this._type + "-rgb"].apply(this, this._components))
                },
                convert: function(t) {
                    return new H(t, this._convert(t), this._alpha)
                },
                getType: function() {
                    return this._type
                },
                setType: function(t) {
                    this._components = this._convert(t), this._properties = i[t], this._type = t
                },
                getComponents: function() {
                    var t = this._components.slice();
                    return null != this._alpha && t.push(this._alpha), t
                },
                getAlpha: function() {
                    return null != this._alpha ? this._alpha : 1
                },
                setAlpha: function(t) {
                    this._alpha = null == t ? null : Math.min(Math.max(t, 0), 1), this._changed()
                },
                hasAlpha: function() {
                    return null != this._alpha
                },
                equals: function(t) {
                    var e = r.isPlainValue(t, !0) ? H.read(arguments) : t;
                    return e === this || e && this._class === e._class && this._type === e._type && this.getAlpha() === e.getAlpha() && r.equals(this._components, e._components) || !1
                },
                toString: function() {
                    for (var t = this._properties, e = [], n = "gradient" === this._type, i = h.instance, r = 0, s = t.length; r < s; r++) {
                        var o = this._components[r];
                        null != o && e.push(t[r] + ": " + (n ? o : i.number(o)))
                    }
                    return null != this._alpha && e.push("alpha: " + i.number(this._alpha)), "{ " + e.join(", ") + " }"
                },
                toCSS: function(t) {
                    function e(t) {
                        return Math.round(255 * (t < 0 ? 0 : t > 1 ? 1 : t))
                    }
                    var n = this._convert("rgb"),
                        i = t || null == this._alpha ? 1 : this._alpha;
                    return n = [e(n[0]), e(n[1]), e(n[2])], i < 1 && n.push(i < 0 ? 0 : i), t ? "#" + ((1 << 24) + (n[0] << 16) + (n[1] << 8) + n[2]).toString(16).slice(1) : (4 == n.length ? "rgba(" : "rgb(") + n.join(",") + ")"
                },
                toCanvasStyle: function(t, e) {
                    if (this._canvasStyle) return this._canvasStyle;
                    if ("gradient" !== this._type) return this._canvasStyle = this.toCSS();
                    var n, i = this._components,
                        r = i[0],
                        s = r._stops,
                        o = i[1],
                        a = i[2],
                        h = i[3],
                        l = e && e.inverted();
                    if (l && (o = l._transformPoint(o), a = l._transformPoint(a), h && (h = l._transformPoint(h))), r._radial) {
                        var u = a.getDistance(o);
                        if (h) {
                            var c = h.subtract(o);
                            c.getLength() > u && (h = o.add(c.normalize(u - .1)))
                        }
                        var d = h || o;
                        n = t.createRadialGradient(d.x, d.y, 0, o.x, o.y, u)
                    } else n = t.createLinearGradient(o.x, o.y, a.x, a.y);
                    for (var f = 0, p = s.length; f < p; f++) {
                        var g = s[f],
                            m = g._offset;
                        n.addColorStop(null == m ? f / (p - 1) : m, g._color.toCanvasStyle())
                    }
                    return this._canvasStyle = n
                },
                transform: function(t) {
                    if ("gradient" === this._type) {
                        for (var e = this._components, n = 1, i = e.length; n < i; n++) {
                            var r = e[n];
                            t._transformPoint(r, r, !0)
                        }
                        this._changed()
                    }
                },
                statics: {
                    _types: i,
                    random: function() {
                        var t = Math.random;
                        return new H(t(), t(), t())
                    }
                }
            })
        }, new function() {
            var t = {
                add: function(t, e) {
                    return t + e
                },
                subtract: function(t, e) {
                    return t - e
                },
                multiply: function(t, e) {
                    return t * e
                },
                divide: function(t, e) {
                    return t / e
                }
            };
            return r.each(t, function(t, e) {
                this[e] = function(e) {
                    e = H.read(arguments);
                    for (var n = this._type, i = this._components, r = e._convert(n), s = 0, o = i.length; s < o; s++) r[s] = t(i[s], r[s]);
                    return new H(n, r, null != this._alpha ? t(this._alpha, e.getAlpha()) : null)
                }
            }, {})
        }),
        q = r.extend({
            _class: "Gradient",
            initialize: function(t, e) {
                this._id = u.get(), t && r.isPlainObject(t) && (this.set(t), t = e = null), null == this._stops && this.setStops(t || ["white", "black"]), null == this._radial && this.setRadial("string" == typeof e && "radial" === e || e || !1)
            },
            _serialize: function(t, e) {
                return e.add(this, function() {
                    return r.serialize([this._stops, this._radial], t, !0, e)
                })
            },
            _changed: function() {
                for (var t = 0, e = this._owners && this._owners.length; t < e; t++) this._owners[t]._changed()
            },
            _addOwner: function(t) {
                this._owners || (this._owners = []), this._owners.push(t)
            },
            _removeOwner: function(t) {
                var n = this._owners ? this._owners.indexOf(t) : -1; - 1 != n && (this._owners.splice(n, 1), this._owners.length || (this._owners = e))
            },
            clone: function() {
                for (var t = [], e = 0, n = this._stops.length; e < n; e++) t[e] = this._stops[e].clone();
                return new q(t, this._radial)
            },
            getStops: function() {
                return this._stops
            },
            setStops: function(t) {
                if (t.length < 2) throw new Error("Gradient stop list needs to contain at least two stops.");
                var n = this._stops;
                if (n)
                    for (var i = 0, r = n.length; i < r; i++) n[i]._owner = e;
                n = this._stops = B.readList(t, 0, {
                    clone: !0
                });
                for (var i = 0, r = n.length; i < r; i++) n[i]._owner = this;
                this._changed()
            },
            getRadial: function() {
                return this._radial
            },
            setRadial: function(t) {
                this._radial = t, this._changed()
            },
            equals: function(t) {
                if (t === this) return !0;
                if (t && this._class === t._class) {
                    var e = this._stops,
                        n = t._stops,
                        i = e.length;
                    if (i === n.length) {
                        for (var r = 0; r < i; r++)
                            if (!e[r].equals(n[r])) return !1;
                        return !0
                    }
                }
                return !1
            }
        }),
        B = r.extend({
            _class: "GradientStop",
            initialize: function(t, n) {
                var i = t,
                    r = n;
                "object" == typeof t && n === e && (Array.isArray(t) && "number" != typeof t[0] ? (i = t[0], r = t[1]) : ("color" in t || "offset" in t || "rampPoint" in t) && (i = t.color, r = t.offset || t.rampPoint || 0)), this.setColor(i), this.setOffset(r)
            },
            clone: function() {
                return new B(this._color.clone(), this._offset)
            },
            _serialize: function(t, e) {
                var n = this._color,
                    i = this._offset;
                return r.serialize(null == i ? [n] : [n, i], t, !0, e)
            },
            _changed: function() {
                this._owner && this._owner._changed(65)
            },
            getOffset: function() {
                return this._offset
            },
            setOffset: function(t) {
                this._offset = t, this._changed()
            },
            getRampPoint: "#getOffset",
            setRampPoint: "#setOffset",
            getColor: function() {
                return this._color
            },
            setColor: function() {
                var t = H.read(arguments, 0, {
                    clone: !0
                });
                t && (t._owner = this), this._color = t, this._changed()
            },
            equals: function(t) {
                return t === this || t && this._class === t._class && this._color.equals(t._color) && this._offset == t._offset || !1
            }
        }),
        j = r.extend(new function() {
            var t = {
                    fillColor: null,
                    fillRule: "nonzero",
                    strokeColor: null,
                    strokeWidth: 1,
                    strokeCap: "butt",
                    strokeJoin: "miter",
                    strokeScaling: !0,
                    miterLimit: 10,
                    dashOffset: 0,
                    dashArray: [],
                    shadowColor: null,
                    shadowBlur: 0,
                    shadowOffset: new c,
                    selectedColor: null
                },
                n = r.set({}, t, {
                    fontFamily: "sans-serif",
                    fontWeight: "normal",
                    fontSize: 12,
                    leading: null,
                    justification: "left"
                }),
                i = r.set({}, n, {
                    fillColor: new H
                }),
                s = {
                    strokeWidth: 97,
                    strokeCap: 97,
                    strokeJoin: 97,
                    strokeScaling: 105,
                    miterLimit: 97,
                    fontFamily: 9,
                    fontWeight: 9,
                    fontSize: 9,
                    font: 9,
                    leading: 9,
                    justification: 9
                },
                o = {
                    beans: !0
                },
                a = {
                    _class: "Style",
                    beans: !0,
                    initialize: function(e, r, s) {
                        this._values = {}, this._owner = r, this._project = r && r._project || s || paper.project, this._defaults = !r || r instanceof x ? n : r instanceof D ? i : t, e && this.set(e)
                    }
                };
            return r.each(n, function(t, n) {
                var i = /Color$/.test(n),
                    h = "shadowOffset" === n,
                    l = r.capitalize(n),
                    u = s[n],
                    d = "set" + l,
                    f = "get" + l;
                a[d] = function(t) {
                    var r = this._owner,
                        s = r && r._children;
                    if (s && s.length > 0 && !(r instanceof L))
                        for (var o = 0, a = s.length; o < a; o++) s[o]._style[d](t);
                    else if (n in this._defaults) {
                        var h = this._values[n];
                        h !== t && (i && (h && h._owner !== e && (h._owner = e), t && t.constructor === H && (t._owner && (t = t.clone()), t._owner = r)), this._values[n] = t, r && r._changed(u || 65))
                    }
                }, a[f] = function(t) {
                    var s, o = this._owner,
                        a = o && o._children;
                    if (n in this._defaults && (!a || !a.length || t || o instanceof L)) {
                        var s = this._values[n];
                        if (s === e)(s = this._defaults[n]) && s.clone && (s = s.clone());
                        else {
                            var l = i ? H : h ? c : null;
                            !l || s && s.constructor === l || (this._values[n] = s = l.read([s], 0, {
                                readNull: !0,
                                clone: !0
                            }), s && i && (s._owner = o))
                        }
                    } else if (a)
                        for (var u = 0, d = a.length; u < d; u++) {
                            var p = a[u]._style[f]();
                            if (u) {
                                if (!r.equals(s, p)) return e
                            } else s = p
                        }
                    return s
                }, o[f] = function(t) {
                    return this._style[f](t)
                }, o[d] = function(t) {
                    this._style[d](t)
                }
            }), r.each({
                Font: "FontFamily",
                WindingRule: "FillRule"
            }, function(t, e) {
                var n = "get" + e,
                    i = "set" + e;
                a[n] = o[n] = "#get" + t, a[i] = o[i] = "#set" + t
            }), w.inject(o), a
        }, {
            set: function(t) {
                var e = t instanceof j,
                    n = e ? t._values : t;
                if (n)
                    for (var i in n)
                        if (i in this._defaults) {
                            var r = n[i];
                            this[i] = r && e && r.clone ? r.clone() : r
                        }
            },
            equals: function(t) {
                function n(t, n, i) {
                    var s = t._values,
                        o = n._values,
                        a = n._defaults;
                    for (var h in s) {
                        var l = s[h],
                            u = o[h];
                        if (!(i && h in o || r.equals(l, u === e ? a[h] : u))) return !1
                    }
                    return !0
                }
                return t === this || t && this._class === t._class && n(this, t) && n(t, this, !0) || !1
            },
            hasFill: function() {
                var t = this.getFillColor();
                return !!t && t.alpha > 0
            },
            hasStroke: function() {
                var t = this.getStrokeColor();
                return !!t && t.alpha > 0 && this.getStrokeWidth() > 0
            },
            hasShadow: function() {
                var t = this.getShadowColor();
                return !!t && t.alpha > 0 && (this.getShadowBlur() > 0 || !this.getShadowOffset().isZero())
            },
            getView: function() {
                return this._project._view
            },
            getFontStyle: function() {
                var t = this.getFontSize();
                return this.getFontWeight() + " " + t + (/[a-z]/i.test(t + "") ? " " : "px ") + this.getFontFamily()
            },
            getFont: "#getFontFamily",
            setFont: "#setFontFamily",
            getLeading: function t() {
                var e = t.base.call(this),
                    n = this.getFontSize();
                return /pt|em|%|px/.test(n) && (n = this.getView().getPixelSize(n)), null != e ? e : 1.2 * n
            }
        }),
        W = new function() {
            function t(t, e, n, i) {
                for (var r = ["", "webkit", "moz", "Moz", "ms", "o"], s = e[0].toUpperCase() + e.substring(1), o = 0; o < 6; o++) {
                    var a = r[o],
                        h = a ? a + s : e;
                    if (h in t) {
                        if (!n) return t[h];
                        t[h] = i;
                        break
                    }
                }
            }
            return {
                getStyles: function(t) {
                    var e = t && 9 !== t.nodeType ? t.ownerDocument : t,
                        n = e && e.defaultView;
                    return n && n.getComputedStyle(t, "")
                },
                getBounds: function(t, e) {
                    var n, i = t.ownerDocument,
                        r = i.body,
                        s = i.documentElement;
                    try {
                        n = t.getBoundingClientRect()
                    } catch (t) {
                        n = {
                            left: 0,
                            top: 0,
                            width: 0,
                            height: 0
                        }
                    }
                    var o = n.left - (s.clientLeft || r.clientLeft || 0),
                        a = n.top - (s.clientTop || r.clientTop || 0);
                    if (!e) {
                        var h = i.defaultView;
                        o += h.pageXOffset || s.scrollLeft || r.scrollLeft, a += h.pageYOffset || s.scrollTop || r.scrollTop
                    }
                    return new g(o, a, n.width, n.height)
                },
                getViewportBounds: function(t) {
                    var e = t.ownerDocument,
                        n = e.defaultView,
                        i = e.documentElement;
                    return new g(0, 0, n.innerWidth || i.clientWidth, n.innerHeight || i.clientHeight)
                },
                getOffset: function(t, e) {
                    return W.getBounds(t, e).getPoint()
                },
                getSize: function(t) {
                    return W.getBounds(t, !0).getSize()
                },
                isInvisible: function(t) {
                    return W.getSize(t).equals(new f(0, 0))
                },
                isInView: function(t) {
                    return !W.isInvisible(t) && W.getViewportBounds(t).intersects(W.getBounds(t, !0))
                },
                isInserted: function(t) {
                    return i.body.contains(t)
                },
                getPrefixed: function(e, n) {
                    return e && t(e, n)
                },
                setPrefixed: function(e, n, i) {
                    if ("object" == typeof n)
                        for (var r in n) t(e, r, !0, n[r]);
                    else t(e, n, !0, i)
                }
            }
        },
        V = {
            add: function(t, e) {
                if (t)
                    for (var n in e)
                        for (var i = e[n], r = n.split(/[\s,]+/g), s = 0, o = r.length; s < o; s++) t.addEventListener(r[s], i, !1)
            },
            remove: function(t, e) {
                if (t)
                    for (var n in e)
                        for (var i = e[n], r = n.split(/[\s,]+/g), s = 0, o = r.length; s < o; s++) t.removeEventListener(r[s], i, !1)
            },
            getPoint: function(t) {
                var e = t.targetTouches ? t.targetTouches.length ? t.targetTouches[0] : t.changedTouches[0] : t;
                return new c(e.pageX || e.clientX + i.documentElement.scrollLeft, e.pageY || e.clientY + i.documentElement.scrollTop)
            },
            getTarget: function(t) {
                return t.target || t.srcElement
            },
            getRelatedTarget: function(t) {
                return t.relatedTarget || t.toElement
            },
            getOffset: function(t, e) {
                return V.getPoint(t).subtract(W.getOffset(e || V.getTarget(t)))
            }
        };
    V.requestAnimationFrame = new function() {
        function t() {
            var e = s;
            s = [];
            for (var n = 0, o = e.length; n < o; n++) e[n]();
            (r = i && s.length) && i(t)
        }
        var e, i = W.getPrefixed(n, "requestAnimationFrame"),
            r = !1,
            s = [];
        return function(n) {
            s.push(n), i ? r || (i(t), r = !0) : e || (e = setInterval(t, 1e3 / 60))
        }
    };
    var U = r.extend(s, {
            _class: "View",
            initialize: function t(e, r) {
                function s(t) {
                    return r[t] || parseInt(r.getAttribute(t), 10)
                }

                function a() {
                    var t = W.getSize(r);
                    return t.isNaN() || t.isZero() ? new f(s("width"), s("height")) : t
                }
                var h;
                if (n && r) {
                    this._id = r.getAttribute("id"), null == this._id && r.setAttribute("id", this._id = "view-" + t._id++), V.add(r, this._viewEvents);
                    if (W.setPrefixed(r.style, {
                            userDrag: "none",
                            userSelect: "none",
                            touchCallout: "none",
                            contentZooming: "none",
                            tapHighlightColor: "rgba(0,0,0,0)"
                        }), o.hasAttribute(r, "resize")) {
                        var l = this;
                        V.add(n, this._windowEvents = {
                            resize: function() {
                                l.setViewSize(a())
                            }
                        })
                    }
                    if (h = a(), o.hasAttribute(r, "stats") && "undefined" != typeof Stats) {
                        this._stats = new Stats;
                        var u = this._stats.domElement,
                            c = u.style,
                            d = W.getOffset(r);
                        c.position = "absolute", c.left = d.x + "px", c.top = d.y + "px", i.body.appendChild(u)
                    }
                } else h = new f(r), r = null;
                this._project = e, this._scope = e._scope, this._element = r, this._pixelRatio || (this._pixelRatio = n && n.devicePixelRatio || 1), this._setElementSize(h.width, h.height), this._viewSize = h, t._views.push(this), t._viewsById[this._id] = this, (this._matrix = new v)._owner = this, t._focused || (t._focused = this), this._frameItems = {}, this._frameItemCount = 0, this._itemEvents = {
                    native: {},
                    virtual: {}
                }, this._autoUpdate = !paper.agent.node, this._needsUpdate = !1
            },
            remove: function() {
                if (!this._project) return !1;
                U._focused === this && (U._focused = null), U._views.splice(U._views.indexOf(this), 1), delete U._viewsById[this._id];
                var t = this._project;
                return t._view === this && (t._view = null), V.remove(this._element, this._viewEvents), V.remove(n, this._windowEvents), this._element = this._project = null, this.off("frame"), this._animate = !1, this._frameItems = {}, !0
            },
            _events: r.each(w._itemHandlers.concat(["onResize", "onKeyDown", "onKeyUp"]), function(t) {
                this[t] = {}
            }, {
                onFrame: {
                    install: function() {
                        this.play()
                    },
                    uninstall: function() {
                        this.pause()
                    }
                }
            }),
            _animate: !1,
            _time: 0,
            _count: 0,
            getAutoUpdate: function() {
                return this._autoUpdate
            },
            setAutoUpdate: function(t) {
                this._autoUpdate = t, t && this.requestUpdate()
            },
            update: function() {},
            draw: function() {
                this.update()
            },
            requestUpdate: function() {
                if (!this._requested) {
                    var t = this;
                    V.requestAnimationFrame(function() {
                        if (t._requested = !1, t._animate) {
                            t.requestUpdate();
                            var e = t._element;
                            W.getPrefixed(i, "hidden") && "true" !== o.getAttribute(e, "keepalive") || !W.isInView(e) || t._handleFrame()
                        }
                        t._autoUpdate && t.update()
                    }), this._requested = !0
                }
            },
            play: function() {
                this._animate = !0, this.requestUpdate()
            },
            pause: function() {
                this._animate = !1
            },
            _handleFrame: function() {
                paper = this._scope;
                var t = Date.now() / 1e3,
                    e = this._last ? t - this._last : 0;
                this._last = t, this.emit("frame", new r({
                    delta: e,
                    time: this._time += e,
                    count: this._count++
                })), this._stats && this._stats.update()
            },
            _animateItem: function(t, e) {
                var n = this._frameItems;
                e ? (n[t._id] = {
                    item: t,
                    time: 0,
                    count: 0
                }, 1 == ++this._frameItemCount && this.on("frame", this._handleFrameItems)) : (delete n[t._id], 0 == --this._frameItemCount && this.off("frame", this._handleFrameItems))
            },
            _handleFrameItems: function(t) {
                for (var e in this._frameItems) {
                    var n = this._frameItems[e];
                    n.item.emit("frame", new r(t, {
                        time: n.time += t.delta,
                        count: n.count++
                    }))
                }
            },
            _changed: function() {
                this._project._changed(2049), this._bounds = this._decomposed = e
            },
            getElement: function() {
                return this._element
            },
            getPixelRatio: function() {
                return this._pixelRatio
            },
            getResolution: function() {
                return 72 * this._pixelRatio
            },
            getViewSize: function() {
                var t = this._viewSize;
                return new p(t.width, t.height, this, "setViewSize")
            },
            setViewSize: function() {
                var t = f.read(arguments),
                    e = t.subtract(this._viewSize);
                e.isZero() || (this._setElementSize(t.width, t.height), this._viewSize.set(t), this._changed(), this.emit("resize", {
                    size: t,
                    delta: e
                }), this._autoUpdate && this.update())
            },
            _setElementSize: function(t, e) {
                var n = this._element;
                n && (n.width !== t && (n.width = t), n.height !== e && (n.height = e))
            },
            getBounds: function() {
                return this._bounds || (this._bounds = this._matrix.inverted()._transformBounds(new g(new c, this._viewSize))), this._bounds
            },
            getSize: function() {
                return this.getBounds().getSize()
            },
            isVisible: function() {
                return W.isInView(this._element)
            },
            isInserted: function() {
                return W.isInserted(this._element)
            },
            getPixelSize: function(t) {
                var e, n = this._element;
                if (n) {
                    var r = n.parentNode,
                        s = i.createElement("div");
                    s.style.fontSize = t, r.appendChild(s), e = parseFloat(W.getStyles(s).fontSize), r.removeChild(s)
                } else e = parseFloat(e);
                return e
            },
            getTextWidth: function(t, e) {
                return 0
            }
        }, r.each(["rotate", "scale", "shear", "skew"], function(t) {
            var e = "rotate" === t;
            this[t] = function() {
                var n = (e ? r : c).read(arguments),
                    i = c.read(arguments, 0, {
                        readNull: !0
                    });
                return this.transform((new v)[t](n, i || this.getCenter(!0)))
            }
        }, {
            _decompose: function() {
                return this._decomposed || (this._decomposed = this._matrix.decompose())
            },
            translate: function() {
                var t = new v;
                return this.transform(t.translate.apply(t, arguments))
            },
            getCenter: function() {
                return this.getBounds().getCenter()
            },
            setCenter: function() {
                var t = c.read(arguments);
                this.translate(this.getCenter().subtract(t))
            },
            getZoom: function() {
                var t = this._decompose(),
                    e = t && t.scaling;
                return e ? (e.x + e.y) / 2 : 0
            },
            setZoom: function(t) {
                this.transform((new v).scale(t / this.getZoom(), this.getCenter()))
            },
            getRotation: function() {
                var t = this._decompose();
                return t && t.rotation
            },
            setRotation: function(t) {
                var e = this.getRotation();
                null != e && null != t && this.rotate(t - e)
            },
            getScaling: function() {
                var t = this._decompose(),
                    n = t && t.scaling;
                return n ? new d(n.x, n.y, this, "setScaling") : e
            },
            setScaling: function() {
                var t = this.getScaling(),
                    e = c.read(arguments, 0, {
                        clone: !0,
                        readNull: !0
                    });
                t && e && this.scale(e.x / t.x, e.y / t.y)
            },
            getMatrix: function() {
                return this._matrix
            },
            setMatrix: function() {
                var t = this._matrix;
                t.initialize.apply(t, arguments)
            },
            transform: function(t) {
                this._matrix.append(t)
            },
            scrollBy: function() {
                this.translate(c.read(arguments).negate())
            }
        }), {
            projectToView: function() {
                return this._matrix._transformPoint(c.read(arguments))
            },
            viewToProject: function() {
                return this._matrix._inverseTransform(c.read(arguments))
            },
            getEventPoint: function(t) {
                return this.viewToProject(V.getOffset(t, this._element))
            }
        }, {
            statics: {
                _views: [],
                _viewsById: {},
                _id: 0,
                create: function(t, e) {
                    return i && "string" == typeof e && (e = i.getElementById(e)), new(n ? Y : U)(t, e)
                }
            }
        }, new function() {
            function t(t) {
                var e = V.getTarget(t);
                return e.getAttribute && U._viewsById[e.getAttribute("id")]
            }

            function e() {
                var t = U._focused;
                if (!t || !t.isVisible())
                    for (var e = 0, n = U._views.length; e < n; e++)
                        if ((t = U._views[e]).isVisible()) {
                            U._focused = h = t;
                            break
                        }
            }

            function r(t, e, n) {
                t._handleMouseEvent("mousemove", e, n)
            }

            function s(t, e, n, i, r, s, o) {
                function a(t, n) {
                    if (t.responds(n)) {
                        if (h || (h = new $(n, i, r, e || t, s ? r.subtract(s) : null)), t.emit(n, h) && (E = !0, h.prevented && (P = !0), h.stopped)) return l = !0
                    } else {
                        var o = k[n];
                        if (o) return a(t, o)
                    }
                }
                for (var h, l = !1; t && t !== o && !a(t, n);) t = t._parent;
                return l
            }

            function o(t, e, n, i, r, o) {
                return t._project.removeOn(n), P = E = !1, b && s(b, null, n, i, r, o) || e && e !== b && !e.isDescendant(b) && s(e, null, n, i, r, o, b) || s(t, b || e || t, n, i, r, o)
            }
            if (n) {
                var a, h, l, u, c, d = !1,
                    f = !1,
                    p = n.navigator;
                p.pointerEnabled || p.msPointerEnabled ? (l = "pointerdown MSPointerDown", u = "pointermove MSPointerMove", c = "pointerup pointercancel MSPointerUp MSPointerCancel") : (l = "touchstart", u = "touchmove", c = "touchend touchcancel", "ontouchstart" in n && p.userAgent.match(/mobile|tablet|ip(ad|hone|od)|android|silk/i) || (l += " mousedown", u += " mousemove", c += " mouseup"));
                var g = {},
                    m = {
                        mouseout: function(t) {
                            var e = U._focused,
                                n = V.getRelatedTarget(t);
                            if (e && (!n || "HTML" === n.nodeName)) {
                                var i = V.getOffset(t, e._element),
                                    s = i.x,
                                    o = Math.abs,
                                    a = o(s),
                                    h = a - (1 << 25);
                                i.x = o(h) < a ? h * (s < 0 ? -1 : 1) : s, r(e, t, e.viewToProject(i))
                            }
                        },
                        scroll: e
                    };
                g[l] = function(e) {
                    var n = U._focused = t(e);
                    d || (d = !0, n._handleMouseEvent("mousedown", e))
                }, m[u] = function(n) {
                    var i = U._focused;
                    if (!f) {
                        var s = t(n);
                        s ? i !== s && (i && r(i, n), a || (a = i), i = U._focused = h = s) : h && h === i && (a && !a.isInserted() && (a = null), i = U._focused = a, a = null, e())
                    }
                    i && r(i, n)
                }, m[l] = function() {
                    f = !0
                }, m[c] = function(t) {
                    var e = U._focused;
                    e && d && e._handleMouseEvent("mouseup", t), f = d = !1
                }, V.add(i, m), V.add(n, {
                    load: e
                });
                var v, _, y, w, x, b, C, S, T, E = !1,
                    P = !1,
                    k = {
                        doubleclick: "click",
                        mousedrag: "mousemove"
                    },
                    A = !1,
                    z = {
                        mousedown: {
                            mousedown: 1,
                            mousedrag: 1,
                            click: 1,
                            doubleclick: 1
                        },
                        mouseup: {
                            mouseup: 1,
                            mousedrag: 1,
                            click: 1,
                            doubleclick: 1
                        },
                        mousemove: {
                            mousedrag: 1,
                            mousemove: 1,
                            mouseenter: 1,
                            mouseleave: 1
                        }
                    };
                return {
                    _viewEvents: g,
                    _handleMouseEvent: function(t, e, n) {
                        function i(t) {
                            return r.virtual[t] || u.responds(t) || l && l.responds(t)
                        }
                        var r = this._itemEvents,
                            a = r.native[t],
                            h = "mousemove" === t,
                            l = this._scope.tool,
                            u = this;
                        h && d && i("mousedrag") && (t = "mousedrag"), n || (n = this.getEventPoint(e));
                        var c = this.getBounds().contains(n),
                            f = a && c && u._project.hitTest(n, {
                                tolerance: 0,
                                fill: !0,
                                stroke: !0
                            }),
                            p = f && f.item || null,
                            g = !1,
                            m = {};
                        if (m[t.substr(5)] = !0, a && p !== x && (x && s(x, null, "mouseleave", e, n), p && s(p, null, "mouseenter", e, n), x = p), A ^ c && (s(this, null, c ? "mouseenter" : "mouseleave", e, n), v = c ? this : null, g = !0), !c && !m.drag || n.equals(y) || (o(this, p, h ? t : "mousemove", e, n, y), g = !0), A = c, m.down && c || m.up && _) {
                            if (o(this, p, t, e, n, _), m.down) {
                                if (T = p === C && Date.now() - S < 300, w = C = p, !P && p) {
                                    for (var k = p; k && !k.responds("mousedrag");) k = k._parent;
                                    k && (b = p)
                                }
                                _ = n
                            } else m.up && (P || p !== w || (S = Date.now(), o(this, p, T ? "doubleclick" : "click", e, n, _), T = !1), w = b = null);
                            A = !1, g = !0
                        }
                        y = n, g && l && (E = l._handleMouseEvent(t, e, n, m) || E), (E && !m.move || m.down && i("mouseup")) && e.preventDefault()
                    },
                    _handleKeyEvent: function(t, e, n, i) {
                        function r(r) {
                            r.responds(t) && (paper = o, r.emit(t, s = s || new Z(t, e, n, i)))
                        }
                        var s, o = this._scope,
                            a = o.tool;
                        this.isVisible() && (r(this), a && a.responds(t) && r(a))
                    },
                    _countItemEvent: function(t, e) {
                        var n = this._itemEvents,
                            i = n.native,
                            r = n.virtual;
                        for (var s in z) i[s] = (i[s] || 0) + (z[s][t] || 0) * e;
                        r[t] = (r[t] || 0) + e
                    },
                    statics: {
                        updateFocus: e
                    }
                }
            }
        }),
        Y = U.extend({
            _class: "CanvasView",
            initialize: function(t, e) {
                if (!(e instanceof n.HTMLCanvasElement)) {
                    var i = f.read(arguments, 1);
                    if (i.isZero()) throw new Error("Cannot create CanvasView with the provided argument: " + r.slice(arguments, 1));
                    e = tt.getCanvas(i)
                }
                var s = this._context = e.getContext("2d");
                if (s.save(), this._pixelRatio = 1, !/^off|false$/.test(o.getAttribute(e, "hidpi"))) {
                    var a = n.devicePixelRatio || 1,
                        h = W.getPrefixed(s, "backingStorePixelRatio") || 1;
                    this._pixelRatio = a / h
                }
                U.call(this, t, e), this._needsUpdate = !0
            },
            remove: function t() {
                return this._context.restore(), t.base.call(this)
            },
            _setElementSize: function t(e, n) {
                var i = this._pixelRatio;
                if (t.base.call(this, e * i, n * i), 1 !== i) {
                    var r = this._element,
                        s = this._context;
                    if (!o.hasAttribute(r, "resize")) {
                        var a = r.style;
                        a.width = e + "px", a.height = n + "px"
                    }
                    s.restore(), s.save(), s.scale(i, i)
                }
            },
            getPixelSize: function t(e) {
                var n, i = paper.agent;
                if (i && i.firefox) n = t.base.call(this, e);
                else {
                    var r = this._context,
                        s = r.font;
                    r.font = e + " serif", n = parseFloat(r.font), r.font = s
                }
                return n
            },
            getTextWidth: function(t, e) {
                var n = this._context,
                    i = n.font,
                    r = 0;
                n.font = t;
                for (var s = 0, o = e.length; s < o; s++) r = Math.max(r, n.measureText(e[s]).width);
                return n.font = i, r
            },
            update: function() {
                if (!this._needsUpdate) return !1;
                var t = this._project,
                    e = this._context,
                    n = this._viewSize;
                return e.clearRect(0, 0, n.width + 1, n.height + 1), t && t.draw(e, this._matrix, this._pixelRatio), this._needsUpdate = !1, !0
            }
        }),
        X = r.extend({
            _class: "Event",
            initialize: function(t) {
                this.event = t, this.type = t && t.type
            },
            prevented: !1,
            stopped: !1,
            preventDefault: function() {
                this.prevented = !0, this.event.preventDefault()
            },
            stopPropagation: function() {
                this.stopped = !0, this.event.stopPropagation()
            },
            stop: function() {
                this.stopPropagation(), this.preventDefault()
            },
            getTimeStamp: function() {
                return this.event.timeStamp
            },
            getModifiers: function() {
                return G.modifiers
            }
        }),
        Z = X.extend({
            _class: "KeyEvent",
            initialize: function(t, e, n, i) {
                this.type = t, this.event = e, this.key = n, this.character = i
            },
            toString: function() {
                return "{ type: '" + this.type + "', key: '" + this.key + "', character: '" + this.character + "', modifiers: " + this.getModifiers() + " }"
            }
        }),
        G = new function() {
            function t(t) {
                var n = t.key || t.keyIdentifier;
                return n = /^U\+/.test(n) ? String.fromCharCode(parseInt(n.substr(2), 16)) : /^Arrow[A-Z]/.test(n) ? n.substr(5) : "Unidentified" === n || n === e ? String.fromCharCode(t.keyCode) : n, h[n] || (n.length > 1 ? r.hyphenate(n) : n.toLowerCase())
            }

            function s(t, e, n, i) {
                var a, h = U._focused;
                if (u[e] = t, t ? c[e] = n : delete c[e], e.length > 1 && (a = r.camelize(e)) in d) {
                    d[a] = t;
                    var l = paper && paper.agent;
                    if ("meta" === a && l && l.mac)
                        if (t) o = {};
                        else {
                            for (var f in o) f in c && s(!1, f, o[f], i);
                            o = null
                        }
                } else t && o && (o[e] = n);
                h && h._handleKeyEvent(t ? "keydown" : "keyup", i, e, n)
            }
            var o, a, h = {
                    "\t": "tab",
                    " ": "space",
                    "\b": "backspace",
                    "": "delete",
                    Spacebar: "space",
                    Del: "delete",
                    Win: "meta",
                    Esc: "escape"
                },
                l = {
                    tab: "\t",
                    space: " ",
                    enter: "\r"
                },
                u = {},
                c = {},
                d = new r({
                    shift: !1,
                    control: !1,
                    alt: !1,
                    meta: !1,
                    capsLock: !1,
                    space: !1
                }).inject({
                    option: {
                        get: function() {
                            return this.alt
                        }
                    },
                    command: {
                        get: function() {
                            var t = paper && paper.agent;
                            return t && t.mac ? this.meta : this.control
                        }
                    }
                });
            return V.add(i, {
                keydown: function(e) {
                    var n = t(e),
                        i = paper && paper.agent;
                    n.length > 1 || i && i.chrome && (e.altKey || i.mac && e.metaKey || !i.mac && e.ctrlKey) ? s(!0, n, l[n] || (n.length > 1 ? "" : n), e) : a = n
                },
                keypress: function(e) {
                    if (a) {
                        var n = t(e),
                            i = e.charCode,
                            r = i >= 32 ? String.fromCharCode(i) : n.length > 1 ? "" : n;
                        n !== a && (n = r.toLowerCase()), s(!0, n, r, e), a = null
                    }
                },
                keyup: function(e) {
                    var n = t(e);
                    n in c && s(!1, n, c[n], e)
                }
            }), V.add(n, {
                blur: function(t) {
                    for (var e in c) s(!1, e, c[e], t)
                }
            }), {
                modifiers: d,
                isDown: function(t) {
                    return !!u[t]
                }
            }
        },
        $ = X.extend({
            _class: "MouseEvent",
            initialize: function(t, e, n, i, r) {
                this.type = t, this.event = e, this.point = n, this.target = i, this.delta = r
            },
            toString: function() {
                return "{ type: '" + this.type + "', point: " + this.point + ", target: " + this.target + (this.delta ? ", delta: " + this.delta : "") + ", modifiers: " + this.getModifiers() + " }"
            }
        }),
        J = X.extend({
            _class: "ToolEvent",
            _item: null,
            initialize: function(t, e, n) {
                this.tool = t,
                    this.type = e, this.event = n
            },
            _choosePoint: function(t, e) {
                return t || (e ? e.clone() : null)
            },
            getPoint: function() {
                return this._choosePoint(this._point, this.tool._point)
            },
            setPoint: function(t) {
                this._point = t
            },
            getLastPoint: function() {
                return this._choosePoint(this._lastPoint, this.tool._lastPoint)
            },
            setLastPoint: function(t) {
                this._lastPoint = t
            },
            getDownPoint: function() {
                return this._choosePoint(this._downPoint, this.tool._downPoint)
            },
            setDownPoint: function(t) {
                this._downPoint = t
            },
            getMiddlePoint: function() {
                return !this._middlePoint && this.tool._lastPoint ? this.tool._point.add(this.tool._lastPoint).divide(2) : this._middlePoint
            },
            setMiddlePoint: function(t) {
                this._middlePoint = t
            },
            getDelta: function() {
                return !this._delta && this.tool._lastPoint ? this.tool._point.subtract(this.tool._lastPoint) : this._delta
            },
            setDelta: function(t) {
                this._delta = t
            },
            getCount: function() {
                return this.tool[/^mouse(down|up)$/.test(this.type) ? "_downCount" : "_moveCount"]
            },
            setCount: function(t) {
                this.tool[/^mouse(down|up)$/.test(this.type) ? "downCount" : "count"] = t
            },
            getItem: function() {
                if (!this._item) {
                    var t = this.tool._scope.project.hitTest(this.getPoint());
                    if (t) {
                        for (var e = t.item, n = e._parent;
                            /^(Group|CompoundPath)$/.test(n._class);) e = n, n = n._parent;
                        this._item = e
                    }
                }
                return this._item
            },
            setItem: function(t) {
                this._item = t
            },
            toString: function() {
                return "{ type: " + this.type + ", point: " + this.getPoint() + ", count: " + this.getCount() + ", modifiers: " + this.getModifiers() + " }"
            }
        }),
        Q = a.extend({
            _class: "Tool",
            _list: "tools",
            _reference: "tool",
            _events: ["onMouseDown", "onMouseUp", "onMouseDrag", "onMouseMove", "onActivate", "onDeactivate", "onEditOptions", "onKeyDown", "onKeyUp"],
            initialize: function(t) {
                a.call(this), this._moveCount = -1, this._downCount = -1, this.set(t)
            },
            getMinDistance: function() {
                return this._minDistance
            },
            setMinDistance: function(t) {
                this._minDistance = t, null != t && null != this._maxDistance && t > this._maxDistance && (this._maxDistance = t)
            },
            getMaxDistance: function() {
                return this._maxDistance
            },
            setMaxDistance: function(t) {
                this._maxDistance = t, null != this._minDistance && null != t && t < this._minDistance && (this._minDistance = t)
            },
            getFixedDistance: function() {
                return this._minDistance == this._maxDistance ? this._minDistance : null
            },
            setFixedDistance: function(t) {
                this._minDistance = this._maxDistance = t
            },
            _handleMouseEvent: function(t, e, n, i) {
                function r(t, e) {
                    var r = n,
                        s = o ? c._point : c._downPoint || r;
                    if (o) {
                        if (c._moveCount && r.equals(s)) return !1;
                        if (s && (null != t || null != e)) {
                            var a = r.subtract(s),
                                h = a.getLength();
                            if (h < (t || 0)) return !1;
                            e && (r = s.add(a.normalize(Math.min(h, e))))
                        }
                        c._moveCount++
                    }
                    return c._point = r, c._lastPoint = s || r, i.down && (c._moveCount = -1, c._downPoint = r, c._downCount++), !0
                }

                function s() {
                    a && (u = c.emit(t, new J(c, t, e)) || u)
                }
                paper = this._scope, i.drag && !this.responds(t) && (t = "mousemove");
                var o = i.move || i.drag,
                    a = this.responds(t),
                    h = this.minDistance,
                    l = this.maxDistance,
                    u = !1,
                    c = this;
                if (i.down) r(), s();
                else if (i.up) r(null, l), s();
                else if (a)
                    for (; r(h, l);) s();
                return u
            }
        }),
        K = {
            request: function(e) {
                var n = new t.XMLHttpRequest;
                return n.open((e.method || "get").toUpperCase(), e.url, r.pick(e.async, !0)), e.mimeType && n.overrideMimeType(e.mimeType), n.onload = function() {
                    var t = n.status;
                    0 === t || 200 === t ? e.onLoad && e.onLoad.call(n, n.responseText) : n.onerror()
                }, n.onerror = function() {
                    var t = n.status,
                        i = 'Could not load "' + e.url + '" (Status: ' + t + ")";
                    if (!e.onError) throw new Error(i);
                    e.onError(i, t)
                }, n.send(null)
            }
        },
        tt = {
            canvases: [],
            getCanvas: function(t, e) {
                if (!n) return null;
                var r, s = !0;
                "object" == typeof t && (e = t.height, t = t.width), this.canvases.length ? r = this.canvases.pop() : (r = i.createElement("canvas"), s = !1);
                var o = r.getContext("2d");
                if (!o) throw new Error("Canvas " + r + " is unable to provide a 2D context.");
                return r.width === t && r.height === e ? s && o.clearRect(0, 0, t + 1, e + 1) : (r.width = t, r.height = e), o.save(), r
            },
            getContext: function(t, e) {
                var n = this.getCanvas(t, e);
                return n ? n.getContext("2d") : null
            },
            release: function(t) {
                var e = t && t.canvas ? t.canvas : t;
                e && e.getContext && (e.getContext("2d").restore(), this.canvases.push(e))
            }
        },
        et = new function() {
            function t(t, e, n) {
                return .2989 * t + .587 * e + .114 * n
            }

            function e(e, n, i, r) {
                var s = r - t(e, n, i);
                f = e + s, p = n + s, g = i + s;
                var r = t(f, p, g),
                    o = m(f, p, g),
                    a = v(f, p, g);
                if (o < 0) {
                    var h = r - o;
                    f = r + (f - r) * r / h, p = r + (p - r) * r / h, g = r + (g - r) * r / h
                }
                if (a > 255) {
                    var l = 255 - r,
                        u = a - r;
                    f = r + (f - r) * l / u, p = r + (p - r) * l / u, g = r + (g - r) * l / u
                }
            }

            function n(t, e, n) {
                return v(t, e, n) - m(t, e, n)
            }

            function i(t, e, n, i) {
                var r, s = [t, e, n],
                    o = v(t, e, n),
                    a = m(t, e, n);
                a = a === t ? 0 : a === e ? 1 : 2, o = o === t ? 0 : o === e ? 1 : 2, r = 0 === m(a, o) ? 1 === v(a, o) ? 2 : 1 : 0, s[o] > s[a] ? (s[r] = (s[r] - s[a]) * i / (s[o] - s[a]), s[o] = i) : s[r] = s[o] = 0, s[a] = 0, f = s[0], p = s[1], g = s[2]
            }
            var s, o, a, h, l, u, c, d, f, p, g, m = Math.min,
                v = Math.max,
                _ = Math.abs,
                y = {
                    multiply: function() {
                        f = l * s / 255, p = u * o / 255, g = c * a / 255
                    },
                    screen: function() {
                        f = l + s - l * s / 255, p = u + o - u * o / 255, g = c + a - c * a / 255
                    },
                    overlay: function() {
                        f = l < 128 ? 2 * l * s / 255 : 255 - 2 * (255 - l) * (255 - s) / 255, p = u < 128 ? 2 * u * o / 255 : 255 - 2 * (255 - u) * (255 - o) / 255, g = c < 128 ? 2 * c * a / 255 : 255 - 2 * (255 - c) * (255 - a) / 255
                    },
                    "soft-light": function() {
                        var t = s * l / 255;
                        f = t + l * (255 - (255 - l) * (255 - s) / 255 - t) / 255, t = o * u / 255, p = t + u * (255 - (255 - u) * (255 - o) / 255 - t) / 255, t = a * c / 255, g = t + c * (255 - (255 - c) * (255 - a) / 255 - t) / 255
                    },
                    "hard-light": function() {
                        f = s < 128 ? 2 * s * l / 255 : 255 - 2 * (255 - s) * (255 - l) / 255, p = o < 128 ? 2 * o * u / 255 : 255 - 2 * (255 - o) * (255 - u) / 255, g = a < 128 ? 2 * a * c / 255 : 255 - 2 * (255 - a) * (255 - c) / 255
                    },
                    "color-dodge": function() {
                        f = 0 === l ? 0 : 255 === s ? 255 : m(255, 255 * l / (255 - s)), p = 0 === u ? 0 : 255 === o ? 255 : m(255, 255 * u / (255 - o)), g = 0 === c ? 0 : 255 === a ? 255 : m(255, 255 * c / (255 - a))
                    },
                    "color-burn": function() {
                        f = 255 === l ? 255 : 0 === s ? 0 : v(0, 255 - 255 * (255 - l) / s), p = 255 === u ? 255 : 0 === o ? 0 : v(0, 255 - 255 * (255 - u) / o), g = 255 === c ? 255 : 0 === a ? 0 : v(0, 255 - 255 * (255 - c) / a)
                    },
                    darken: function() {
                        f = l < s ? l : s, p = u < o ? u : o, g = c < a ? c : a
                    },
                    lighten: function() {
                        f = l > s ? l : s, p = u > o ? u : o, g = c > a ? c : a
                    },
                    difference: function() {
                        f = l - s, f < 0 && (f = -f), p = u - o, p < 0 && (p = -p), (g = c - a) < 0 && (g = -g)
                    },
                    exclusion: function() {
                        f = l + s * (255 - l - l) / 255, p = u + o * (255 - u - u) / 255, g = c + a * (255 - c - c) / 255
                    },
                    hue: function() {
                        i(s, o, a, n(l, u, c)), e(f, p, g, t(l, u, c))
                    },
                    saturation: function() {
                        i(l, u, c, n(s, o, a)), e(f, p, g, t(l, u, c))
                    },
                    luminosity: function() {
                        e(l, u, c, t(s, o, a))
                    },
                    color: function() {
                        e(s, o, a, t(l, u, c))
                    },
                    add: function() {
                        f = m(l + s, 255), p = m(u + o, 255), g = m(c + a, 255)
                    },
                    subtract: function() {
                        f = v(l - s, 0), p = v(u - o, 0), g = v(c - a, 0)
                    },
                    average: function() {
                        f = (l + s) / 2, p = (u + o) / 2, g = (c + a) / 2
                    },
                    negation: function() {
                        f = 255 - _(255 - s - l), p = 255 - _(255 - o - u), g = 255 - _(255 - a - c)
                    }
                },
                w = this.nativeModes = r.each(["source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out", "destination-atop", "lighter", "darker", "copy", "xor"], function(t) {
                    this[t] = !0
                }, {}),
                x = tt.getContext(1, 1);
            x && (r.each(y, function(t, e) {
                var n = "darken" === e,
                    i = !1;
                x.save();
                try {
                    x.fillStyle = n ? "#300" : "#a00", x.fillRect(0, 0, 1, 1), x.globalCompositeOperation = e, x.globalCompositeOperation === e && (x.fillStyle = n ? "#a00" : "#300", x.fillRect(0, 0, 1, 1), i = x.getImageData(0, 0, 1, 1).data[0] !== n ? 170 : 51)
                } catch (t) {}
                x.restore(), w[e] = i
            }), tt.release(x)), this.process = function(t, e, n, i, r) {
                var m = e.canvas,
                    v = "normal" === t;
                if (v || w[t]) n.save(), n.setTransform(1, 0, 0, 1, 0, 0), n.globalAlpha = i, v || (n.globalCompositeOperation = t), n.drawImage(m, r.x, r.y), n.restore();
                else {
                    var _ = y[t];
                    if (!_) return;
                    for (var x = n.getImageData(r.x, r.y, m.width, m.height), b = x.data, C = e.getImageData(0, 0, m.width, m.height).data, S = 0, T = b.length; S < T; S += 4) {
                        s = C[S], l = b[S], o = C[S + 1], u = b[S + 1], a = C[S + 2], c = b[S + 2], h = C[S + 3], d = b[S + 3], _();
                        var E = h * i / 255,
                            P = 1 - E;
                        b[S] = E * f + P * l, b[S + 1] = E * p + P * u, b[S + 2] = E * g + P * c, b[S + 3] = h * i + P * d
                    }
                    n.putImageData(x, r.x, r.y)
                }
            }
        },
        nt = new function() {
            function t(t, e, s) {
                return n(i.createElementNS(r, t), e, s)
            }

            function e(t, e) {
                var n = a[e],
                    i = n ? t.getAttributeNS(n, e) : t.getAttribute(e);
                return "null" === i ? null : i
            }

            function n(t, e, n) {
                for (var i in e) {
                    var r = e[i],
                        s = a[i];
                    "number" == typeof r && n && (r = n.number(r)), s ? t.setAttributeNS(s, i, r) : t.setAttribute(i, r)
                }
                return t
            }
            var r = "http://www.w3.org/2000/svg",
                s = "http://www.w3.org/2000/xmlns",
                o = "http://www.w3.org/1999/xlink",
                a = {
                    href: o,
                    xlink: s,
                    xmlns: s + "/",
                    "xmlns:xlink": s + "/"
                };
            return {
                svg: r,
                xmlns: s,
                xlink: o,
                create: t,
                get: e,
                set: n
            }
        },
        it = r.each({
            fillColor: ["fill", "color"],
            fillRule: ["fill-rule", "string"],
            strokeColor: ["stroke", "color"],
            strokeWidth: ["stroke-width", "number"],
            strokeCap: ["stroke-linecap", "string"],
            strokeJoin: ["stroke-linejoin", "string"],
            strokeScaling: ["vector-effect", "lookup", {
                true: "none",
                false: "non-scaling-stroke"
            }, function(t, e) {
                return !e && (t instanceof M || t instanceof C || t instanceof D)
            }],
            miterLimit: ["stroke-miterlimit", "number"],
            dashArray: ["stroke-dasharray", "array"],
            dashOffset: ["stroke-dashoffset", "number"],
            fontFamily: ["font-family", "string"],
            fontWeight: ["font-weight", "string"],
            fontSize: ["font-size", "number"],
            justification: ["text-anchor", "lookup", {
                left: "start",
                center: "middle",
                right: "end"
            }],
            opacity: ["opacity", "number"],
            blendMode: ["mix-blend-mode", "style"]
        }, function(t, e) {
            var n = r.capitalize(e),
                i = t[2];
            this[e] = {
                type: t[1],
                property: e,
                attribute: t[0],
                toSVG: i,
                fromSVG: i && r.each(i, function(t, e) {
                    this[t] = e
                }, {}),
                exportFilter: t[3],
                get: "get" + n,
                set: "set" + n
            }
        }, {});
    return new function() {
        function e(t, e, n) {
            var i = new r,
                s = t.getTranslation();
            if (e) {
                t = t._shiftless();
                var o = t._inverseTransform(s);
                i[n ? "cx" : "x"] = o.x, i[n ? "cy" : "y"] = o.y, s = null
            }
            if (!t.isIdentity()) {
                var a = t.decompose();
                if (a) {
                    var h = [],
                        u = a.rotation,
                        c = a.scaling,
                        d = a.skewing;
                    s && !s.isZero() && h.push("translate(" + S.point(s) + ")"), u && h.push("rotate(" + S.number(u) + ")"), l.isZero(c.x - 1) && l.isZero(c.y - 1) || h.push("scale(" + S.point(c) + ")"), d.x && h.push("skewX(" + S.number(d.x) + ")"), d.y && h.push("skewY(" + S.number(d.y) + ")"), i.transform = h.join(" ")
                } else i.transform = "matrix(" + t.getValues().join(",") + ")"
            }
            return i
        }

        function n(t, n) {
            for (var i = e(t._matrix), r = t._children, s = nt.create("g", i, S), o = 0, a = r.length; o < a; o++) {
                var h = r[o],
                    l = b(h, n);
                if (l)
                    if (h.isClipMask()) {
                        var u = nt.create("clipPath");
                        u.appendChild(l), _(h, u, "clip"), nt.set(s, {
                            "clip-path": "url(#" + u.id + ")"
                        })
                    } else s.appendChild(l)
            }
            return s
        }

        function i(t, n) {
            var i = e(t._matrix, !0),
                r = t.getSize(),
                s = t.getImage();
            return i.x -= r.width / 2, i.y -= r.height / 2, i.width = r.width, i.height = r.height, i.href = 0 == n.embedImages && s && s.src || t.toDataURL(), nt.create("image", i, S)
        }

        function s(t, n) {
            var i = n.matchShapes;
            if (i) {
                var r = t.toShape(!1);
                if (r) return o(r)
            }
            var s, a = t._segments,
                h = a.length,
                l = e(t._matrix);
            if (i && h >= 2 && !t.hasHandles())
                if (h > 2) {
                    s = t._closed ? "polygon" : "polyline";
                    for (var u = [], c = 0; c < h; c++) u.push(S.point(a[c]._point));
                    l.points = u.join(" ")
                } else {
                    s = "line";
                    var d = a[0]._point,
                        f = a[1]._point;
                    l.set({
                        x1: d.x,
                        y1: d.y,
                        x2: f.x,
                        y2: f.y
                    })
                }
            else s = "path", l.d = t.getPathData(null, n.precision);
            return nt.create(s, l, S)
        }

        function o(t) {
            var n = t._type,
                i = t._radius,
                r = e(t._matrix, !0, "rectangle" !== n);
            if ("rectangle" === n) {
                n = "rect";
                var s = t._size,
                    o = s.width,
                    a = s.height;
                r.x -= o / 2, r.y -= a / 2, r.width = o, r.height = a, i.isZero() && (i = null)
            }
            return i && ("circle" === n ? r.r = i : (r.rx = i.width, r.ry = i.height)), nt.create(n, r, S)
        }

        function a(t, n) {
            var i = e(t._matrix),
                r = t.getPathData(null, n.precision);
            return r && (i.d = r), nt.create("path", i, S)
        }

        function c(t, n) {
            var i = e(t._matrix, !0),
                r = t._definition,
                s = m(r, "symbol"),
                o = r._item,
                a = o.getBounds();
            return s || (s = nt.create("symbol", {
                viewBox: S.rectangle(a)
            }), s.appendChild(b(o, n)), _(r, s, "symbol")), i.href = "#" + s.id, i.x += a.x, i.y += a.y, i.width = a.width, i.height = a.height, i.overflow = "visible", nt.create("use", i, S)
        }

        function d(t) {
            var e = m(t, "color");
            if (!e) {
                var n, i = t.getGradient(),
                    r = i._radial,
                    s = t.getOrigin(),
                    o = t.getDestination();
                if (r) {
                    n = {
                        cx: s.x,
                        cy: s.y,
                        r: s.getDistance(o)
                    };
                    var a = t.getHighlight();
                    a && (n.fx = a.x, n.fy = a.y)
                } else n = {
                    x1: s.x,
                    y1: s.y,
                    x2: o.x,
                    y2: o.y
                };
                n.gradientUnits = "userSpaceOnUse", e = nt.create((r ? "radial" : "linear") + "Gradient", n, S);
                for (var h = i._stops, l = 0, u = h.length; l < u; l++) {
                    var c = h[l],
                        d = c._color,
                        f = d.getAlpha(),
                        p = c._offset;
                    n = {
                        offset: null == p ? l / (u - 1) : p
                    }, d && (n["stop-color"] = d.toCSS(!0)), f < 1 && (n["stop-opacity"] = f), e.appendChild(nt.create("stop", n, S))
                }
                _(t, e, "color")
            }
            return "url(#" + e.id + ")"
        }

        function f(t) {
            var n = nt.create("text", e(t._matrix, !0), S);
            return n.textContent = t._content, n
        }

        function p(t, e, n) {
            var i = {},
                s = !n && t.getParent(),
                o = [];
            return null != t._name && (i.id = t._name), r.each(it, function(e) {
                var n = e.get,
                    a = e.type,
                    h = t[n]();
                if (e.exportFilter ? e.exportFilter(t, h) : !s || !r.equals(s[n](), h)) {
                    if ("color" === a && null != h) {
                        var l = h.getAlpha();
                        l < 1 && (i[e.attribute + "-opacity"] = l)
                    }
                    "style" === a ? o.push(e.attribute + ": " + h) : i[e.attribute] = null == h ? "none" : "color" === a ? h.gradient ? d(h, t) : h.toCSS(!0) : "array" === a ? h.join(",") : "lookup" === a ? e.toSVG[h] : h
                }
            }), o.length && (i.style = o.join(";")), 1 === i.opacity && delete i.opacity, t._visible || (i.visibility = "hidden"), nt.set(e, i, S)
        }

        function m(t, e) {
            return T || (T = {
                ids: {},
                svgs: {}
            }), t && T.svgs[e + "-" + (t._id || t.__id || (t.__id = u.get("svg")))]
        }

        function _(t, e, n) {
            T || m();
            var i = T.ids[n] = (T.ids[n] || 0) + 1;
            e.id = n + "-" + i, T.svgs[n + "-" + (t._id || t.__id)] = e
        }

        function x(e, n) {
            var i = e,
                r = null;
            if (T) {
                i = "svg" === e.nodeName.toLowerCase() && e;
                for (var s in T.svgs) r || (i || (i = nt.create("svg"), i.appendChild(e)), r = i.insertBefore(nt.create("defs"), i.firstChild)), r.appendChild(T.svgs[s]);
                T = null
            }
            return n.asString ? (new t.XMLSerializer).serializeToString(i) : i
        }

        function b(t, e, n) {
            var i = E[t._class],
                r = i && i(t, e);
            if (r) {
                var s = e.onExport;
                s && (r = s(t, r, e) || r);
                var o = JSON.stringify(t._data);
                o && "{}" !== o && "null" !== o && r.setAttribute("data-paper-data", o)
            }
            return r && p(t, r, n)
        }

        function C(t) {
            return t || (t = {}), S = new h(t.precision), t
        }
        var S, T, E = {
            Group: n,
            Layer: n,
            Raster: i,
            Path: s,
            Shape: o,
            CompoundPath: a,
            SymbolItem: c,
            PointText: f
        };
        w.inject({
            exportSVG: function(t) {
                return t = C(t), x(b(this, t, !0), t)
            }
        }), y.inject({
            exportSVG: function(t) {
                t = C(t);
                var n = this._children,
                    i = this.getView(),
                    s = r.pick(t.bounds, "view"),
                    o = t.matrix || "view" === s && i._matrix,
                    a = o && v.read([o]),
                    h = "view" === s ? new g([0, 0], i.getViewSize()) : "content" === s ? w._getBounds(n, a, {
                        stroke: !0
                    }).rect : g.read([s], 0, {
                        readNull: !0
                    }),
                    l = {
                        version: "1.1",
                        xmlns: nt.svg,
                        "xmlns:xlink": nt.xlink
                    };
                h && (l.width = h.width, l.height = h.height, (h.x || h.y) && (l.viewBox = S.rectangle(h)));
                var u = nt.create("svg", l, S),
                    c = u;
                a && !a.isIdentity() && (c = u.appendChild(nt.create("g", e(a), S)));
                for (var d = 0, f = n.length; d < f; d++) c.appendChild(b(n[d], t, !0));
                return x(u, t)
            }
        })
    }, new function() {
        function s(t, e, n, i, r) {
            var s = nt.get(t, e),
                o = null == s ? i ? null : n ? "" : 0 : n ? s : parseFloat(s);
            return /%\s*$/.test(s) ? o / 100 * (r ? 1 : z[/x|^width/.test(e) ? "width" : "height"]) : o
        }

        function o(t, e, n, i, r) {
            return e = s(t, e || "x", !1, i, r), n = s(t, n || "y", !1, i, r), !i || null != e && null != n ? new c(e, n) : null
        }

        function a(t, e, n, i, r) {
            return e = s(t, e || "width", !1, i, r), n = s(t, n || "height", !1, i, r), !i || null != e && null != n ? new f(e, n) : null
        }

        function h(t, e, n) {
            return "none" === t ? null : "number" === e ? parseFloat(t) : "array" === e ? t ? t.split(/[\s,]+/g).map(parseFloat) : [] : "color" === e ? P(t) || t : "lookup" === e ? n[t] : t
        }

        function l(t, e, n, i) {
            var r = t.childNodes,
                s = "clippath" === e,
                o = "defs" === e,
                a = new x,
                h = a._project,
                l = h._currentStyle,
                u = [];
            if (s || o || (a = T(a, t, i), h._currentStyle = a._style.clone()), i)
                for (var c = t.querySelectorAll("defs"), d = 0, f = c.length; d < f; d++) k(c[d], n, !1);
            for (var d = 0, f = r.length; d < f; d++) {
                var p, g = r[d];
                1 !== g.nodeType || /^defs$/i.test(g.nodeName) || !(p = k(g, n, !1)) || p instanceof E || u.push(p)
            }
            return a.addChildren(u), s && (a = T(a.reduce(), t, i)), h._currentStyle = l, (s || o) && (a.remove(), a = null), a
        }

        function u(t, e) {
            for (var n = t.getAttribute("points").match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g), i = [], r = 0, s = n.length; r < s; r += 2) i.push(new c(parseFloat(n[r]), parseFloat(n[r + 1])));
            var o = new O(i);
            return "polygon" === e && o.closePath(), o
        }

        function d(t) {
            return M.create(t.getAttribute("d"))
        }

        function p(t, e) {
            var n, i = (s(t, "href", !0) || "").substring(1),
                r = "radialgradient" === e;
            if (i) n = I[i].getGradient(), n._radial ^ r && (n = n.clone(), n._radial = r);
            else {
                for (var a = t.childNodes, h = [], l = 0, u = a.length; l < u; l++) {
                    var c = a[l];
                    1 === c.nodeType && h.push(T(new B, c))
                }
                n = new q(h, r)
            }
            var d, f, p, g = "userSpaceOnUse" !== s(t, "gradientUnits", !0);
            return r ? (d = o(t, "cx", "cy", !1, g), f = d.add(s(t, "r", !1, !1, g), 0), p = o(t, "fx", "fy", !0, g)) : (d = o(t, "x1", "y1", !1, g), f = o(t, "x2", "y2", !1, g)), T(new H(n, d, f, p), t)._scaleToBounds = g, null
        }

        function m(t, e, n, i) {
            if (t.transform) {
                for (var r = (i.getAttribute(n) || "").split(/\)\s*/g), s = new v, o = 0, a = r.length; o < a; o++) {
                    var h = r[o];
                    if (!h) break;
                    for (var l = h.split(/\(\s*/), u = l[0], c = l[1].split(/[\s,]+/g), d = 0, f = c.length; d < f; d++) c[d] = parseFloat(c[d]);
                    switch (u) {
                        case "matrix":
                            s.append(new v(c[0], c[1], c[2], c[3], c[4], c[5]));
                            break;
                        case "rotate":
                            s.rotate(c[0], c[1], c[2]);
                            break;
                        case "translate":
                            s.translate(c[0], c[1]);
                            break;
                        case "scale":
                            s.scale(c);
                            break;
                        case "skewX":
                            s.skew(c[0], 0);
                            break;
                        case "skewY":
                            s.skew(0, c[0])
                    }
                }
                t.transform(s)
            }
        }

        function _(t, e, n) {
            var i = "fill-opacity" === n ? "getFillColor" : "getStrokeColor",
                r = t[i] && t[i]();
            r && r.setAlpha(parseFloat(e))
        }

        function b(t, n, i) {
            var s = t.attributes[n],
                o = s && s.value;
            if (!o) {
                var a = r.camelize(n);
                o = t.style[a], o || i.node[a] === i.parent[a] || (o = i.node[a])
            }
            return o ? "none" === o ? null : o : e
        }

        function T(t, n, i) {
            if (n.style) {
                var s = n.parentNode,
                    o = {
                        node: W.getStyles(n) || {},
                        parent: !i && !/^defs$/i.test(s.tagName) && W.getStyles(s) || {}
                    };
                r.each(N, function(i, r) {
                    var s = b(n, r, o);
                    t = s !== e && i(t, s, r, n, o) || t
                })
            }
            return t
        }

        function P(t) {
            var e = t && t.match(/\((?:["'#]*)([^"')]+)/),
                i = e && e[1],
                r = i && I[n ? i.replace(n.location.href.split("#")[0] + "#", "") : i];
            return r && r._scaleToBounds && (r = r.clone(), r._scaleToBounds = !0), r
        }

        function k(t, e, n) {
            var s, o, h, l = t.nodeName.toLowerCase(),
                u = "#document" !== l,
                c = i.body;
            n && u && (z = paper.getView().getSize(), z = a(t, null, null, !0) || z, s = nt.create("svg", {
                style: "stroke-width: 1px; stroke-miterlimit: 10"
            }), o = t.parentNode, h = t.nextSibling, s.appendChild(t), c.appendChild(s));
            var d = paper.settings,
                f = d.applyMatrix,
                p = d.insertItems;
            d.applyMatrix = !1, d.insertItems = !1;
            var g = L[l],
                m = g && g(t, l, e, n) || null;
            if (d.insertItems = p, d.applyMatrix = f, m) {
                !u || m instanceof x || (m = T(m, t, n));
                var v = e.onImport,
                    _ = u && t.getAttribute("data-paper-data");
                v && (m = v(t, m, e) || m), e.expandShapes && m instanceof C && (m.remove(), m = m.toPath()), _ && (m._data = JSON.parse(_))
            }
            return s && (c.removeChild(s), o && (h ? o.insertBefore(t, h) : o.appendChild(t))), n && (I = {}, m && r.pick(e.applyMatrix, f) && m.matrix.apply(!0, !0)), m
        }

        function A(n, r, s) {
            function o(i) {
                try {
                    var o = "object" == typeof i ? i : (new t.DOMParser).parseFromString(i, "image/svg+xml");
                    if (!o.nodeName) throw o = null, new Error("Unsupported SVG source: " + n);
                    paper = h, l = k(o, r, !0), r && !1 === r.insert || s._insertItem(e, l);
                    var u = r.onLoad;
                    u && u(l, i)
                } catch (t) {
                    a(t)
                }
            }

            function a(t, e) {
                var n = r.onError;
                if (!n) throw new Error(t);
                n(t, e)
            }
            if (!n) return null;
            r = "function" == typeof r ? {
                onLoad: r
            } : r || {};
            var h = paper,
                l = null;
            if ("string" != typeof n || /^.*</.test(n)) {
                if ("undefined" != typeof File && n instanceof File) {
                    var u = new FileReader;
                    return u.onload = function() {
                        o(u.result)
                    }, u.onerror = function() {
                        a(u.error)
                    }, u.readAsText(n)
                }
                o(n)
            } else {
                var c = i.getElementById(n);
                c ? o(c) : K.request({
                    url: n,
                    async: !0,
                    onLoad: o,
                    onError: a
                })
            }
            return l
        }
        var z, I = {},
            L = {
                "#document": function(t, e, n, i) {
                    for (var r = t.childNodes, s = 0, o = r.length; s < o; s++) {
                        var a = r[s];
                        if (1 === a.nodeType) return k(a, n, i)
                    }
                },
                g: l,
                svg: l,
                clippath: l,
                polygon: u,
                polyline: u,
                path: d,
                lineargradient: p,
                radialgradient: p,
                image: function(t) {
                    var e = new S(s(t, "href", !0));
                    return e.on("load", function() {
                        var e = a(t);
                        this.setSize(e);
                        var n = this._matrix._transformPoint(o(t).add(e.divide(2)));
                        this.translate(n)
                    }), e
                },
                symbol: function(t, e, n, i) {
                    return new E(l(t, e, n, i), !0)
                },
                defs: l,
                use: function(t) {
                    var e = (s(t, "href", !0) || "").substring(1),
                        n = I[e],
                        i = o(t);
                    return n ? n instanceof E ? n.place(i) : n.clone().translate(i) : null
                },
                circle: function(t) {
                    return new C.Circle(o(t, "cx", "cy"), s(t, "r"))
                },
                ellipse: function(t) {
                    return new C.Ellipse({
                        center: o(t, "cx", "cy"),
                        radius: a(t, "rx", "ry")
                    })
                },
                rect: function(t) {
                    return new C.Rectangle(new g(o(t), a(t)), a(t, "rx", "ry"))
                },
                line: function(t) {
                    return new O.Line(o(t, "x1", "y1"), o(t, "x2", "y2"))
                },
                text: function(t) {
                    var e = new R(o(t).add(o(t, "dx", "dy")));
                    return e.setContent(t.textContent.trim() || ""), e
                }
            },
            N = r.set(r.each(it, function(t) {
                this[t.attribute] = function(e, n) {
                    if (e[t.set] && (e[t.set](h(n, t.type, t.fromSVG)), "color" === t.type)) {
                        var i = e[t.get]();
                        if (i && i._scaleToBounds) {
                            var r = e.getBounds();
                            i.transform((new v).translate(r.getPoint()).scale(r.getSize()))
                        }
                    }
                }
            }, {}), {
                id: function(t, e) {
                    I[e] = t, t.setName && t.setName(e)
                },
                "clip-path": function(t, e) {
                    var n = P(e);
                    if (n) {
                        if (n = n.clone(), n.setClipMask(!0), !(t instanceof x)) return new x(n, t);
                        t.insertChild(0, n)
                    }
                },
                gradientTransform: m,
                transform: m,
                "fill-opacity": _,
                "stroke-opacity": _,
                visibility: function(t, e) {
                    t.setVisible && t.setVisible("visible" === e)
                },
                display: function(t, e) {
                    t.setVisible && t.setVisible(null !== e)
                },
                "stop-color": function(t, e) {
                    t.setColor && t.setColor(e)
                },
                "stop-opacity": function(t, e) {
                    t._color && t._color.setAlpha(parseFloat(e))
                },
                offset: function(t, e) {
                    if (t.setOffset) {
                        var n = e.match(/(.*)%$/);
                        t.setOffset(n ? n[1] / 100 : parseFloat(e))
                    }
                },
                viewBox: function(t, e, n, i, r) {
                    var s, o, l = new g(h(e, "array")),
                        u = a(i, null, null, !0);
                    if (t instanceof x) {
                        var c = u ? u.divide(l.getSize()) : 1,
                            o = (new v).scale(c).translate(l.getPoint().negate());
                        s = t
                    } else t instanceof E && (u && l.setSize(u), s = t._item);
                    if (s) {
                        if ("visible" !== b(i, "overflow", r)) {
                            var d = new C.Rectangle(l);
                            d.setClipMask(!0), s.addChild(d)
                        }
                        o && s.transform(o)
                    }
                }
            });
        w.inject({
            importSVG: function(t, e) {
                return A(t, e, this)
            }
        }), y.inject({
            importSVG: function(t, e) {
                return this.activate(), A(t, e, this)
            }
        })
    }, r.exports.PaperScript = function() {
        function e(t, e) {
            return (g.acorn || m).parse(t, e)
        }

        function s(t, e, n) {
            var i = y[e];
            if (t && t[i]) {
                var r = t[i](n);
                return "!=" === e ? !r : r
            }
            switch (e) {
                case "+":
                    return t + n;
                case "-":
                    return t - n;
                case "*":
                    return t * n;
                case "/":
                    return t / n;
                case "%":
                    return t % n;
                case "==":
                    return t == n;
                case "!=":
                    return t != n
            }
        }

        function a(t, e) {
            var n = w[t];
            if (e && e[n]) return e[n]();
            switch (t) {
                case "+":
                    return +e;
                case "-":
                    return -e
            }
        }

        function h(r, s) {
            function o(t) {
                for (var e = 0, n = d.length; e < n; e++) {
                    var i = d[e];
                    if (i[0] >= t) break;
                    t += i[1]
                }
                return t
            }

            function a(t) {
                return r.substring(o(t.range[0]), o(t.range[1]))
            }

            function h(t, e) {
                return r.substring(o(t.range[1]), o(e.range[0]))
            }

            function l(t, e) {
                for (var n = o(t.range[0]), i = o(t.range[1]), s = 0, a = d.length - 1; a >= 0; a--)
                    if (n > d[a][0]) {
                        s = a + 1;
                        break
                    }
                d.splice(s, 0, [n, e.length - i + n]), r = r.substring(0, n) + e + r.substring(i)
            }

            function u(t, e) {
                if (t) {
                    for (var n in t)
                        if ("range" !== n && "loc" !== n) {
                            var i = t[n];
                            if (Array.isArray(i))
                                for (var r = 0, s = i.length; r < s; r++) u(i[r], t);
                            else i && "object" == typeof i && u(i, t)
                        }
                    switch (t.type) {
                        case "UnaryExpression":
                            if (t.operator in w && "Literal" !== t.argument.type) {
                                var o = a(t.argument);
                                l(t, '$__("' + t.operator + '", ' + o + ")")
                            }
                            break;
                        case "BinaryExpression":
                            if (t.operator in y && "Literal" !== t.left.type) {
                                var c = a(t.left),
                                    d = a(t.right),
                                    f = h(t.left, t.right),
                                    p = t.operator;
                                l(t, "__$__(" + c + "," + f.replace(new RegExp("\\" + p), '"' + p + '"') + ", " + d + ")")
                            }
                            break;
                        case "UpdateExpression":
                        case "AssignmentExpression":
                            var g = e && e.type;
                            if (!("ForStatement" === g || "BinaryExpression" === g && /^[=!<>]/.test(e.operator) || "MemberExpression" === g && e.computed))
                                if ("UpdateExpression" === t.type) {
                                    var o = a(t.argument),
                                        m = "__$__(" + o + ', "' + t.operator[0] + '", 1)',
                                        v = o + " = " + m;
                                    t.prefix || "AssignmentExpression" !== g && "VariableDeclarator" !== g || (a(e.left || e.id) === o && (v = m), v = o + "; " + v), l(t, v)
                                } else if (/^.=$/.test(t.operator) && "Literal" !== t.left.type) {
                                var c = a(t.left),
                                    d = a(t.right),
                                    m = c + " = __$__(" + c + ', "' + t.operator[0] + '", ' + d + ")";
                                l(t, /^\(.*\)$/.test(a(t)) ? "(" + m + ")" : m)
                            }
                    }
                }
            }
            if (!r) return "";
            s = s || {};
            var c, d = [],
                f = s.url || "",
                p = paper.agent,
                g = p.versionNumber,
                m = !1,
                v = s.sourceMaps,
                _ = s.source || r,
                x = /\r\n|\n|\r/gm,
                b = s.offset || 0;
            if (v && (p.chrome && g >= 30 || p.webkit && g >= 537.76 || p.firefox && g >= 23 || p.node)) {
                if (p.node) b -= 2;
                else if (n && f && !n.location.href.indexOf(f)) {
                    var C = i.getElementsByTagName("html")[0].innerHTML;
                    b = C.substr(0, C.indexOf(r) + 1).match(x).length + 1
                }
                m = b > 0 && !(p.chrome && g >= 36 || p.safari && g >= 600 || p.firefox && g >= 40 || p.node);
                var S = ["AA" + function(t) {
                    var e = "";
                    for (t = (Math.abs(t) << 1) + (t < 0 ? 1 : 0); t || !e;) {
                        var n = 31 & t;
                        t >>= 5, t && (n |= 32), e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [n]
                    }
                    return e
                }(m ? 0 : b) + "A"];
                S.length = (r.match(x) || []).length + 1 + (m ? b : 0), c = {
                    version: 3,
                    file: f,
                    names: [],
                    mappings: S.join(";AACA"),
                    sourceRoot: "",
                    sources: [f],
                    sourcesContent: [_]
                }
            }
            return u(e(r, {
                ranges: !0,
                preserveParens: !0
            })), c && (m && (r = new Array(b + 1).join("\n") + r), /^(inline|both)$/.test(v) && (r += "\n//# sourceMappingURL=data:application/json;base64," + t.btoa(unescape(encodeURIComponent(JSON.stringify(c))))), r += "\n//# sourceURL=" + (f || "paperscript")), {
                url: f,
                source: _,
                code: r,
                map: c
            }
        }

        function l(t, e, n) {
            function o(e, n) {
                for (var i in e) !n && /^_/.test(i) || !new RegExp("([\\b\\s\\W]|^)" + i.replace(/\$/g, "\\$") + "\\b").test(t) || (g.push(i), m.push(e[i]))
            }
            paper = e;
            var l, u = e.getView(),
                d = /\btool\.\w+|\s+on(?:Key|Mouse)(?:Up|Down|Move|Drag)\b/.test(t) && !/\bnew\s+Tool\b/.test(t) ? new Q : null,
                f = d ? d._events : [],
                p = ["onFrame", "onResize"].concat(f),
                g = [],
                m = [],
                v = "object" == typeof t ? t : h(t, n);
            t = v.code, o({
                __$__: s,
                $__: a,
                paper: e,
                view: u,
                tool: d
            }, !0), o(e), (p = r.each(p, function(e) {
                new RegExp("\\s+" + e + "\\b").test(t) && (g.push(e), this.push(e + ": " + e))
            }, []).join(", ")) && (t += "\nreturn { " + p + " };");
            var _ = paper.agent;
            if (i && (_.chrome || _.firefox && _.versionNumber < 40)) {
                var y = i.createElement("script"),
                    w = i.head || i.getElementsByTagName("head")[0];
                _.firefox && (t = "\n" + t), y.appendChild(i.createTextNode("paper._execute = function(" + g + ") {" + t + "\n}")), w.appendChild(y), l = paper._execute, delete paper._execute, w.removeChild(y)
            } else l = Function(g, t);
            var x = l.apply(e, m) || {};
            return r.each(f, function(t) {
                var e = x[t];
                e && (d[t] = e)
            }), u && (x.onResize && u.setOnResize(x.onResize), u.emit("resize", {
                size: u.size,
                delta: new c
            }), x.onFrame && u.setOnFrame(x.onFrame), u.requestUpdate()), v
        }

        function u(t) {
            if (/^text\/(?:x-|)paperscript$/.test(t.type) && "true" !== o.getAttribute(t, "ignore")) {
                var e = o.getAttribute(t, "canvas"),
                    n = i.getElementById(e),
                    r = t.src || t.getAttribute("data-src"),
                    s = o.hasAttribute(t, "async");
                if (!n) throw new Error('Unable to find canvas with id "' + e + '"');
                var a = o.get(n.getAttribute("data-paper-scope")) || (new o).setup(n);
                return n.setAttribute("data-paper-scope", a._id), r ? K.request({
                    url: r,
                    async: s,
                    mimeType: "text/plain",
                    onLoad: function(t) {
                        l(t, a, r)
                    }
                }) : l(t.innerHTML, a, t.baseURI), t.setAttribute("data-paper-ignore", "true"), a
            }
        }

        function d() {
            r.each(i && i.getElementsByTagName("script"), u)
        }

        function p(t) {
            return t ? u(t) : d()
        }
        var g = this,
            m = g.acorn;
        if (!m && "undefined" != typeof require) try {
            m = require("acorn")
        } catch (t) {}
        if (!m) {
            var v, _;
            m = v = _ = {},
                function(t, e) {
                    "object" == typeof v && "object" == typeof _ ? e(v) : "function" == typeof define && define.amd ? define(["exports"], e) : e(t.acorn || (t.acorn = {}))
                }(this, function(t) {
                    "use strict";

                    function e(t) {
                        ct = t || {};
                        for (var e in gt) Object.prototype.hasOwnProperty.call(ct, e) || (ct[e] = gt[e]);
                        pt = ct.sourceFile || null
                    }

                    function n(t, e) {
                        var n = mt(dt, t);
                        e += " (" + n.line + ":" + n.column + ")";
                        var i = new SyntaxError(e);
                        throw i.pos = t, i.loc = n, i.raisedAt = vt, i
                    }

                    function i(t) {
                        function e(t) {
                            if (1 == t.length) return n += "return str === " + JSON.stringify(t[0]) + ";";
                            n += "switch(str){";
                            for (var e = 0; e < t.length; ++e) n += "case " + JSON.stringify(t[e]) + ":";
                            n += "return true}return false;"
                        }
                        t = t.split(" ");
                        var n = "",
                            i = [];
                        t: for (var r = 0; r < t.length; ++r) {
                            for (var s = 0; s < i.length; ++s)
                                if (i[s][0].length == t[r].length) {
                                    i[s].push(t[r]);
                                    continue t
                                }
                            i.push([t[r]])
                        }
                        if (i.length > 3) {
                            i.sort(function(t, e) {
                                return e.length - t.length
                            }), n += "switch(str.length){";
                            for (var r = 0; r < i.length; ++r) {
                                var o = i[r];
                                n += "case " + o[0].length + ":", e(o)
                            }
                            n += "}"
                        } else e(t);
                        return new Function("str", n)
                    }

                    function r() {
                        this.line = Tt, this.column = vt - Et
                    }

                    function s() {
                        Tt = 1, vt = Et = 0, St = !0, l()
                    }

                    function o(t, e) {
                        yt = vt, ct.locations && (xt = new r), bt = t, l(), Ct = e, St = t.beforeExpr
                    }

                    function a() {
                        var t = ct.onComment && ct.locations && new r,
                            e = vt,
                            i = dt.indexOf("*/", vt += 2);
                        if (-1 === i && n(vt - 2, "Unterminated comment"), vt = i + 2, ct.locations) {
                            Ge.lastIndex = e;
                            for (var s;
                                (s = Ge.exec(dt)) && s.index < vt;) ++Tt, Et = s.index + s[0].length
                        }
                        ct.onComment && ct.onComment(!0, dt.slice(e + 2, i), e, vt, t, ct.locations && new r)
                    }

                    function h() {
                        for (var t = vt, e = ct.onComment && ct.locations && new r, n = dt.charCodeAt(vt += 2); vt < ft && 10 !== n && 13 !== n && 8232 !== n && 8233 !== n;) ++vt, n = dt.charCodeAt(vt);
                        ct.onComment && ct.onComment(!1, dt.slice(t + 2, vt), t, vt, e, ct.locations && new r)
                    }

                    function l() {
                        for (; vt < ft;) {
                            var t = dt.charCodeAt(vt);
                            if (32 === t) ++vt;
                            else if (13 === t) {
                                ++vt;
                                var e = dt.charCodeAt(vt);
                                10 === e && ++vt, ct.locations && (++Tt, Et = vt)
                            } else if (10 === t || 8232 === t || 8233 === t) ++vt, ct.locations && (++Tt, Et = vt);
                            else if (t > 8 && t < 14) ++vt;
                            else if (47 === t) {
                                var e = dt.charCodeAt(vt + 1);
                                if (42 === e) a();
                                else {
                                    if (47 !== e) break;
                                    h()
                                }
                            } else if (160 === t) ++vt;
                            else {
                                if (!(t >= 5760 && Ve.test(String.fromCharCode(t)))) break;
                                ++vt
                            }
                        }
                    }

                    function u() {
                        var t = dt.charCodeAt(vt + 1);
                        return t >= 48 && t <= 57 ? S(!0) : (++vt, o(we))
                    }

                    function c() {
                        var t = dt.charCodeAt(vt + 1);
                        return St ? (++vt, x()) : 61 === t ? w(Se, 2) : w(be, 1)
                    }

                    function d() {
                        return 61 === dt.charCodeAt(vt + 1) ? w(Se, 2) : w(Fe, 1)
                    }

                    function f(t) {
                        var e = dt.charCodeAt(vt + 1);
                        return e === t ? w(124 === t ? Pe : ke, 2) : 61 === e ? w(Se, 2) : w(124 === t ? Ae : Ie, 1)
                    }

                    function p() {
                        return 61 === dt.charCodeAt(vt + 1) ? w(Se, 2) : w(ze, 1)
                    }

                    function g(t) {
                        var e = dt.charCodeAt(vt + 1);
                        return e === t ? 45 == e && 62 == dt.charCodeAt(vt + 2) && Ze.test(dt.slice(kt, vt)) ? (vt += 3, h(), l(), y()) : w(Te, 2) : 61 === e ? w(Se, 2) : w(Ne, 1)
                    }

                    function m(t) {
                        var e = dt.charCodeAt(vt + 1),
                            n = 1;
                        return e === t ? (n = 62 === t && 62 === dt.charCodeAt(vt + 2) ? 3 : 2, 61 === dt.charCodeAt(vt + n) ? w(Se, n + 1) : w(Le, n)) : 33 == e && 60 == t && 45 == dt.charCodeAt(vt + 2) && 45 == dt.charCodeAt(vt + 3) ? (vt += 4, h(), l(), y()) : (61 === e && (n = 61 === dt.charCodeAt(vt + 2) ? 3 : 2), w(Oe, n))
                    }

                    function v(t) {
                        return 61 === dt.charCodeAt(vt + 1) ? w(Me, 61 === dt.charCodeAt(vt + 2) ? 3 : 2) : w(61 === t ? Ce : Ee, 1)
                    }

                    function _(t) {
                        switch (t) {
                            case 46:
                                return u();
                            case 40:
                                return ++vt, o(ge);
                            case 41:
                                return ++vt, o(me);
                            case 59:
                                return ++vt, o(_e);
                            case 44:
                                return ++vt, o(ve);
                            case 91:
                                return ++vt, o(ce);
                            case 93:
                                return ++vt, o(de);
                            case 123:
                                return ++vt, o(fe);
                            case 125:
                                return ++vt, o(pe);
                            case 58:
                                return ++vt, o(ye);
                            case 63:
                                return ++vt, o(xe);
                            case 48:
                                var e = dt.charCodeAt(vt + 1);
                                if (120 === e || 88 === e) return C();
                            case 49:
                            case 50:
                            case 51:
                            case 52:
                            case 53:
                            case 54:
                            case 55:
                            case 56:
                            case 57:
                                return S(!1);
                            case 34:
                            case 39:
                                return T(t);
                            case 47:
                                return c(t);
                            case 37:
                            case 42:
                                return d();
                            case 124:
                            case 38:
                                return f(t);
                            case 94:
                                return p();
                            case 43:
                            case 45:
                                return g(t);
                            case 60:
                            case 62:
                                return m(t);
                            case 61:
                            case 33:
                                return v(t);
                            case 126:
                                return w(Ee, 1)
                        }
                        return !1
                    }

                    function y(t) {
                        if (t ? vt = _t + 1 : _t = vt, ct.locations && (wt = new r), t) return x();
                        if (vt >= ft) return o(Rt);
                        var e = dt.charCodeAt(vt);
                        if ($e(e) || 92 === e) return k();
                        var i = _(e);
                        if (!1 === i) {
                            var s = String.fromCharCode(e);
                            if ("\\" === s || Ye.test(s)) return k();
                            n(vt, "Unexpected character '" + s + "'")
                        }
                        return i
                    }

                    function w(t, e) {
                        var n = dt.slice(vt, vt + e);
                        vt += e, o(t, n)
                    }

                    function x() {
                        for (var t, e, i = "", r = vt;;) {
                            vt >= ft && n(r, "Unterminated regular expression");
                            var s = dt.charAt(vt);
                            if (Ze.test(s) && n(r, "Unterminated regular expression"), t) t = !1;
                            else {
                                if ("[" === s) e = !0;
                                else if ("]" === s && e) e = !1;
                                else if ("/" === s && !e) break;
                                t = "\\" === s
                            }++vt
                        }
                        var i = dt.slice(r, vt);
                        ++vt;
                        var a = P();
                        a && !/^[gmsiy]*$/.test(a) && n(r, "Invalid regexp flag");
                        try {
                            var h = new RegExp(i, a)
                        } catch (t) {
                            t instanceof SyntaxError && n(r, t.message), n(t)
                        }
                        return o(Nt, h)
                    }

                    function b(t, e) {
                        for (var n = vt, i = 0, r = 0, s = null == e ? 1 / 0 : e; r < s; ++r) {
                            var o, a = dt.charCodeAt(vt);
                            if ((o = a >= 97 ? a - 97 + 10 : a >= 65 ? a - 65 + 10 : a >= 48 && a <= 57 ? a - 48 : 1 / 0) >= t) break;
                            ++vt, i = i * t + o
                        }
                        return vt === n || null != e && vt - n !== e ? null : i
                    }

                    function C() {
                        vt += 2;
                        var t = b(16);
                        return null == t && n(_t + 2, "Expected hexadecimal number"), $e(dt.charCodeAt(vt)) && n(vt, "Identifier directly after number"), o(Lt, t)
                    }

                    function S(t) {
                        var e = vt,
                            i = !1,
                            r = 48 === dt.charCodeAt(vt);
                        t || null !== b(10) || n(e, "Invalid number"), 46 === dt.charCodeAt(vt) && (++vt, b(10), i = !0);
                        var s = dt.charCodeAt(vt);
                        69 !== s && 101 !== s || (s = dt.charCodeAt(++vt), 43 !== s && 45 !== s || ++vt, null === b(10) && n(e, "Invalid number"), i = !0), $e(dt.charCodeAt(vt)) && n(vt, "Identifier directly after number");
                        var a, h = dt.slice(e, vt);
                        return i ? a = parseFloat(h) : r && 1 !== h.length ? /[89]/.test(h) || Mt ? n(e, "Invalid number") : a = parseInt(h, 8) : a = parseInt(h, 10), o(Lt, a)
                    }

                    function T(t) {
                        vt++;
                        for (var e = "";;) {
                            vt >= ft && n(_t, "Unterminated string constant");
                            var i = dt.charCodeAt(vt);
                            if (i === t) return ++vt, o(Ft, e);
                            if (92 === i) {
                                i = dt.charCodeAt(++vt);
                                var r = /^[0-7]+/.exec(dt.slice(vt, vt + 3));
                                for (r && (r = r[0]); r && parseInt(r, 8) > 255;) r = r.slice(0, -1);
                                if ("0" === r && (r = null), ++vt, r) Mt && n(vt - 2, "Octal literal in strict mode"), e += String.fromCharCode(parseInt(r, 8)), vt += r.length - 1;
                                else switch (i) {
                                    case 110:
                                        e += "\n";
                                        break;
                                    case 114:
                                        e += "\r";
                                        break;
                                    case 120:
                                        e += String.fromCharCode(E(2));
                                        break;
                                    case 117:
                                        e += String.fromCharCode(E(4));
                                        break;
                                    case 85:
                                        e += String.fromCharCode(E(8));
                                        break;
                                    case 116:
                                        e += "\t";
                                        break;
                                    case 98:
                                        e += "\b";
                                        break;
                                    case 118:
                                        e += "\v";
                                        break;
                                    case 102:
                                        e += "\f";
                                        break;
                                    case 48:
                                        e += "\0";
                                        break;
                                    case 13:
                                        10 === dt.charCodeAt(vt) && ++vt;
                                    case 10:
                                        ct.locations && (Et = vt, ++Tt);
                                        break;
                                    default:
                                        e += String.fromCharCode(i)
                                }
                            } else 13 !== i && 10 !== i && 8232 !== i && 8233 !== i || n(_t, "Unterminated string constant"), e += String.fromCharCode(i), ++vt
                        }
                    }

                    function E(t) {
                        var e = b(16, t);
                        return null === e && n(_t, "Bad character escape sequence"), e
                    }

                    function P() {
                        Re = !1;
                        for (var t, e = !0, i = vt;;) {
                            var r = dt.charCodeAt(vt);
                            if (Je(r)) Re && (t += dt.charAt(vt)), ++vt;
                            else {
                                if (92 !== r) break;
                                Re || (t = dt.slice(i, vt)), Re = !0, 117 != dt.charCodeAt(++vt) && n(vt, "Expecting Unicode escape sequence \\uXXXX"), ++vt;
                                var s = E(4),
                                    o = String.fromCharCode(s);
                                o || n(vt - 1, "Invalid Unicode escape"), (e ? $e(s) : Je(s)) || n(vt - 4, "Invalid Unicode escape"), t += o
                            }
                            e = !1
                        }
                        return Re ? t : dt.slice(i, vt)
                    }

                    function k() {
                        var t = P(),
                            e = Dt;
                        return !Re && We(t) && (e = ue[t]), o(e, t)
                    }

                    function A() {
                        Pt = _t, kt = yt, At = xt, y()
                    }

                    function z(t) {
                        if (Mt = t, vt = _t,
                            ct.locations)
                            for (; vt < Et;) Et = dt.lastIndexOf("\n", Et - 2) + 1, --Tt;
                        l(), y()
                    }

                    function I() {
                        this.type = null, this.start = _t, this.end = null
                    }

                    function M() {
                        this.start = wt, this.end = null, null !== pt && (this.source = pt)
                    }

                    function O() {
                        var t = new I;
                        return ct.locations && (t.loc = new M), ct.directSourceFile && (t.sourceFile = ct.directSourceFile), ct.ranges && (t.range = [_t, 0]), t
                    }

                    function L(t) {
                        var e = new I;
                        return e.start = t.start, ct.locations && (e.loc = new M, e.loc.start = t.loc.start), ct.ranges && (e.range = [t.range[0], 0]), e
                    }

                    function N(t, e) {
                        return t.type = e, t.end = kt, ct.locations && (t.loc.end = At), ct.ranges && (t.range[1] = kt), t
                    }

                    function F(t) {
                        return ct.ecmaVersion >= 5 && "ExpressionStatement" === t.type && "Literal" === t.expression.type && "use strict" === t.expression.value
                    }

                    function D(t) {
                        if (bt === t) return A(), !0
                    }

                    function R() {
                        return !ct.strictSemicolons && (bt === Rt || bt === pe || Ze.test(dt.slice(kt, _t)))
                    }

                    function H() {
                        D(_e) || R() || B()
                    }

                    function q(t) {
                        bt === t ? A() : B()
                    }

                    function B() {
                        n(_t, "Unexpected token")
                    }

                    function j(t) {
                        "Identifier" !== t.type && "MemberExpression" !== t.type && n(t.start, "Assigning to rvalue"), Mt && "Identifier" === t.type && je(t.name) && n(t.start, "Assigning to " + t.name + " in strict mode")
                    }

                    function W(t) {
                        Pt = kt = vt, ct.locations && (At = new r), zt = Mt = null, It = [], y();
                        var e = t || O(),
                            n = !0;
                        for (t || (e.body = []); bt !== Rt;) {
                            var i = V();
                            e.body.push(i), n && F(i) && z(!0), n = !1
                        }
                        return N(e, "Program")
                    }

                    function V() {
                        (bt === be || bt === Se && "/=" == Ct) && y(!0);
                        var t = bt,
                            e = O();
                        switch (t) {
                            case Ht:
                            case jt:
                                A();
                                var i = t === Ht;
                                D(_e) || R() ? e.label = null : bt !== Dt ? B() : (e.label = ut(), H());
                                for (var r = 0; r < It.length; ++r) {
                                    var s = It[r];
                                    if (null == e.label || s.name === e.label.name) {
                                        if (null != s.kind && (i || "loop" === s.kind)) break;
                                        if (e.label && i) break
                                    }
                                }
                                return r === It.length && n(e.start, "Unsyntactic " + t.keyword), N(e, i ? "BreakStatement" : "ContinueStatement");
                            case Wt:
                                return A(), H(), N(e, "DebuggerStatement");
                            case Ut:
                                return A(), It.push(Qe), e.body = V(), It.pop(), q(ne), e.test = U(), H(), N(e, "DoWhileStatement");
                            case Zt:
                                if (A(), It.push(Qe), q(ge), bt === _e) return X(e, null);
                                if (bt === ee) {
                                    var o = O();
                                    return A(), G(o, !0), N(o, "VariableDeclaration"), 1 === o.declarations.length && D(le) ? Z(e, o) : X(e, o)
                                }
                                var o = $(!1, !0);
                                return D(le) ? (j(o), Z(e, o)) : X(e, o);
                            case Gt:
                                return A(), ht(e, !0);
                            case $t:
                                return A(), e.test = U(), e.consequent = V(), e.alternate = D(Yt) ? V() : null, N(e, "IfStatement");
                            case Jt:
                                return zt || ct.allowReturnOutsideFunction || n(_t, "'return' outside of function"), A(), D(_e) || R() ? e.argument = null : (e.argument = $(), H()), N(e, "ReturnStatement");
                            case Qt:
                                A(), e.discriminant = U(), e.cases = [], q(fe), It.push(Ke);
                                for (var a, h; bt != pe;)
                                    if (bt === qt || bt === Vt) {
                                        var l = bt === qt;
                                        a && N(a, "SwitchCase"), e.cases.push(a = O()), a.consequent = [], A(), l ? a.test = $() : (h && n(Pt, "Multiple default clauses"), h = !0, a.test = null), q(ye)
                                    } else a || B(), a.consequent.push(V());
                                return a && N(a, "SwitchCase"), A(), It.pop(), N(e, "SwitchStatement");
                            case Kt:
                                return A(), Ze.test(dt.slice(kt, _t)) && n(kt, "Illegal newline after throw"), e.argument = $(), H(), N(e, "ThrowStatement");
                            case te:
                                if (A(), e.block = Y(), e.handler = null, bt === Bt) {
                                    var u = O();
                                    A(), q(ge), u.param = ut(), Mt && je(u.param.name) && n(u.param.start, "Binding " + u.param.name + " in strict mode"), q(me), u.guard = null, u.body = Y(), e.handler = N(u, "CatchClause")
                                }
                                return e.guardedHandlers = Ot, e.finalizer = D(Xt) ? Y() : null, e.handler || e.finalizer || n(e.start, "Missing catch or finally clause"), N(e, "TryStatement");
                            case ee:
                                return A(), G(e), H(), N(e, "VariableDeclaration");
                            case ne:
                                return A(), e.test = U(), It.push(Qe), e.body = V(), It.pop(), N(e, "WhileStatement");
                            case ie:
                                return Mt && n(_t, "'with' in strict mode"), A(), e.object = U(), e.body = V(), N(e, "WithStatement");
                            case fe:
                                return Y();
                            case _e:
                                return A(), N(e, "EmptyStatement");
                            default:
                                var c = Ct,
                                    d = $();
                                if (t === Dt && "Identifier" === d.type && D(ye)) {
                                    for (var r = 0; r < It.length; ++r) It[r].name === c && n(d.start, "Label '" + c + "' is already declared");
                                    var f = bt.isLoop ? "loop" : bt === Qt ? "switch" : null;
                                    return It.push({
                                        name: c,
                                        kind: f
                                    }), e.body = V(), It.pop(), e.label = d, N(e, "LabeledStatement")
                                }
                                return e.expression = d, H(), N(e, "ExpressionStatement")
                        }
                    }

                    function U() {
                        q(ge);
                        var t = $();
                        return q(me), t
                    }

                    function Y(t) {
                        var e, n = O(),
                            i = !0,
                            r = !1;
                        for (n.body = [], q(fe); !D(pe);) {
                            var s = V();
                            n.body.push(s), i && t && F(s) && (e = r, z(r = !0)), i = !1
                        }
                        return r && !e && z(!1), N(n, "BlockStatement")
                    }

                    function X(t, e) {
                        return t.init = e, q(_e), t.test = bt === _e ? null : $(), q(_e), t.update = bt === me ? null : $(), q(me), t.body = V(), It.pop(), N(t, "ForStatement")
                    }

                    function Z(t, e) {
                        return t.left = e, t.right = $(), q(me), t.body = V(), It.pop(), N(t, "ForInStatement")
                    }

                    function G(t, e) {
                        for (t.declarations = [], t.kind = "var";;) {
                            var i = O();
                            if (i.id = ut(), Mt && je(i.id.name) && n(i.id.start, "Binding " + i.id.name + " in strict mode"), i.init = D(Ce) ? $(!0, e) : null, t.declarations.push(N(i, "VariableDeclarator")), !D(ve)) break
                        }
                        return t
                    }

                    function $(t, e) {
                        var n = J(e);
                        if (!t && bt === ve) {
                            var i = L(n);
                            for (i.expressions = [n]; D(ve);) i.expressions.push(J(e));
                            return N(i, "SequenceExpression")
                        }
                        return n
                    }

                    function J(t) {
                        var e = Q(t);
                        if (bt.isAssign) {
                            var n = L(e);
                            return n.operator = Ct, n.left = e, A(), n.right = J(t), j(e), N(n, "AssignmentExpression")
                        }
                        return e
                    }

                    function Q(t) {
                        var e = K(t);
                        if (D(xe)) {
                            var n = L(e);
                            return n.test = e, n.consequent = $(!0), q(ye), n.alternate = $(!0, t), N(n, "ConditionalExpression")
                        }
                        return e
                    }

                    function K(t) {
                        return tt(et(), -1, t)
                    }

                    function tt(t, e, n) {
                        var i = bt.binop;
                        if (null != i && (!n || bt !== le) && i > e) {
                            var r = L(t);
                            r.left = t, r.operator = Ct;
                            var s = bt;
                            A(), r.right = tt(et(), i, n);
                            return tt(N(r, s === Pe || s === ke ? "LogicalExpression" : "BinaryExpression"), e, n)
                        }
                        return t
                    }

                    function et() {
                        if (bt.prefix) {
                            var t = O(),
                                e = bt.isUpdate;
                            return t.operator = Ct, t.prefix = !0, St = !0, A(), t.argument = et(), e ? j(t.argument) : Mt && "delete" === t.operator && "Identifier" === t.argument.type && n(t.start, "Deleting local variable in strict mode"), N(t, e ? "UpdateExpression" : "UnaryExpression")
                        }
                        for (var i = nt(); bt.postfix && !R();) {
                            var t = L(i);
                            t.operator = Ct, t.prefix = !1, t.argument = i, j(i), A(), i = N(t, "UpdateExpression")
                        }
                        return i
                    }

                    function nt() {
                        return it(rt())
                    }

                    function it(t, e) {
                        if (D(we)) {
                            var n = L(t);
                            return n.object = t, n.property = ut(!0), n.computed = !1, it(N(n, "MemberExpression"), e)
                        }
                        if (D(ce)) {
                            var n = L(t);
                            return n.object = t, n.property = $(), n.computed = !0, q(de), it(N(n, "MemberExpression"), e)
                        }
                        if (!e && D(ge)) {
                            var n = L(t);
                            return n.callee = t, n.arguments = lt(me, !1), it(N(n, "CallExpression"), e)
                        }
                        return t
                    }

                    function rt() {
                        switch (bt) {
                            case se:
                                var t = O();
                                return A(), N(t, "ThisExpression");
                            case Dt:
                                return ut();
                            case Lt:
                            case Ft:
                            case Nt:
                                var t = O();
                                return t.value = Ct, t.raw = dt.slice(_t, yt), A(), N(t, "Literal");
                            case oe:
                            case ae:
                            case he:
                                var t = O();
                                return t.value = bt.atomValue, t.raw = bt.keyword, A(), N(t, "Literal");
                            case ge:
                                var e = wt,
                                    n = _t;
                                A();
                                var i = $();
                                return i.start = n, i.end = yt, ct.locations && (i.loc.start = e, i.loc.end = xt), ct.ranges && (i.range = [n, yt]), q(me), i;
                            case ce:
                                var t = O();
                                return A(), t.elements = lt(de, !0, !0), N(t, "ArrayExpression");
                            case fe:
                                return ot();
                            case Gt:
                                var t = O();
                                return A(), ht(t, !1);
                            case re:
                                return st();
                            default:
                                B()
                        }
                    }

                    function st() {
                        var t = O();
                        return A(), t.callee = it(rt(), !0), D(ge) ? t.arguments = lt(me, !1) : t.arguments = Ot, N(t, "NewExpression")
                    }

                    function ot() {
                        var t = O(),
                            e = !0,
                            i = !1;
                        for (t.properties = [], A(); !D(pe);) {
                            if (e) e = !1;
                            else if (q(ve), ct.allowTrailingCommas && D(pe)) break;
                            var r, s = {
                                    key: at()
                                },
                                o = !1;
                            if (D(ye) ? (s.value = $(!0), r = s.kind = "init") : ct.ecmaVersion >= 5 && "Identifier" === s.key.type && ("get" === s.key.name || "set" === s.key.name) ? (o = i = !0, r = s.kind = s.key.name, s.key = at(), bt !== ge && B(), s.value = ht(O(), !1)) : B(), "Identifier" === s.key.type && (Mt || i))
                                for (var a = 0; a < t.properties.length; ++a) {
                                    var h = t.properties[a];
                                    if (h.key.name === s.key.name) {
                                        var l = r == h.kind || o && "init" === h.kind || "init" === r && ("get" === h.kind || "set" === h.kind);
                                        l && !Mt && "init" === r && "init" === h.kind && (l = !1), l && n(s.key.start, "Redefinition of property")
                                    }
                                }
                            t.properties.push(s)
                        }
                        return N(t, "ObjectExpression")
                    }

                    function at() {
                        return bt === Lt || bt === Ft ? rt() : ut(!0)
                    }

                    function ht(t, e) {
                        bt === Dt ? t.id = ut() : e ? B() : t.id = null, t.params = [];
                        var i = !0;
                        for (q(ge); !D(me);) i ? i = !1 : q(ve), t.params.push(ut());
                        var r = zt,
                            s = It;
                        if (zt = !0, It = [], t.body = Y(!0), zt = r, It = s, Mt || t.body.body.length && F(t.body.body[0]))
                            for (var o = t.id ? -1 : 0; o < t.params.length; ++o) {
                                var a = o < 0 ? t.id : t.params[o];
                                if ((Be(a.name) || je(a.name)) && n(a.start, "Defining '" + a.name + "' in strict mode"), o >= 0)
                                    for (var h = 0; h < o; ++h) a.name === t.params[h].name && n(a.start, "Argument name clash in strict mode")
                            }
                        return N(t, e ? "FunctionDeclaration" : "FunctionExpression")
                    }

                    function lt(t, e, n) {
                        for (var i = [], r = !0; !D(t);) {
                            if (r) r = !1;
                            else if (q(ve), e && ct.allowTrailingCommas && D(t)) break;
                            n && bt === ve ? i.push(null) : i.push($(!0))
                        }
                        return i
                    }

                    function ut(t) {
                        var e = O();
                        return t && "everywhere" == ct.forbidReserved && (t = !1), bt === Dt ? (!t && (ct.forbidReserved && (3 === ct.ecmaVersion ? He : qe)(Ct) || Mt && Be(Ct)) && -1 == dt.slice(_t, yt).indexOf("\\") && n(_t, "The keyword '" + Ct + "' is reserved"), e.name = Ct) : t && bt.keyword ? e.name = bt.keyword : B(), St = !1, A(), N(e, "Identifier")
                    }
                    t.version = "0.5.0";
                    var ct, dt, ft, pt;
                    t.parse = function(t, n) {
                        return dt = String(t), ft = dt.length, e(n), s(), W(ct.program)
                    };
                    var gt = t.defaultOptions = {
                            ecmaVersion: 5,
                            strictSemicolons: !1,
                            allowTrailingCommas: !0,
                            forbidReserved: !1,
                            allowReturnOutsideFunction: !1,
                            locations: !1,
                            onComment: null,
                            ranges: !1,
                            program: null,
                            sourceFile: null,
                            directSourceFile: null
                        },
                        mt = t.getLineInfo = function(t, e) {
                            for (var n = 1, i = 0;;) {
                                Ge.lastIndex = i;
                                var r = Ge.exec(t);
                                if (!(r && r.index < e)) break;
                                ++n, i = r.index + r[0].length
                            }
                            return {
                                line: n,
                                column: e - i
                            }
                        };
                    t.tokenize = function(t, n) {
                        function i(t) {
                            return kt = yt, y(t), r.start = _t, r.end = yt, r.startLoc = wt, r.endLoc = xt, r.type = bt, r.value = Ct, r
                        }
                        dt = String(t), ft = dt.length, e(n), s();
                        var r = {};
                        return i.jumpTo = function(t, e) {
                            if (vt = t, ct.locations) {
                                Tt = 1, Et = Ge.lastIndex = 0;
                                for (var n;
                                    (n = Ge.exec(dt)) && n.index < t;) ++Tt, Et = n.index + n[0].length
                            }
                            St = e, l()
                        }, i
                    };
                    var vt, _t, yt, wt, xt, bt, Ct, St, Tt, Et, Pt, kt, At, zt, It, Mt, Ot = [],
                        Lt = {
                            type: "num"
                        },
                        Nt = {
                            type: "regexp"
                        },
                        Ft = {
                            type: "string"
                        },
                        Dt = {
                            type: "name"
                        },
                        Rt = {
                            type: "eof"
                        },
                        Ht = {
                            keyword: "break"
                        },
                        qt = {
                            keyword: "case",
                            beforeExpr: !0
                        },
                        Bt = {
                            keyword: "catch"
                        },
                        jt = {
                            keyword: "continue"
                        },
                        Wt = {
                            keyword: "debugger"
                        },
                        Vt = {
                            keyword: "default"
                        },
                        Ut = {
                            keyword: "do",
                            isLoop: !0
                        },
                        Yt = {
                            keyword: "else",
                            beforeExpr: !0
                        },
                        Xt = {
                            keyword: "finally"
                        },
                        Zt = {
                            keyword: "for",
                            isLoop: !0
                        },
                        Gt = {
                            keyword: "function"
                        },
                        $t = {
                            keyword: "if"
                        },
                        Jt = {
                            keyword: "return",
                            beforeExpr: !0
                        },
                        Qt = {
                            keyword: "switch"
                        },
                        Kt = {
                            keyword: "throw",
                            beforeExpr: !0
                        },
                        te = {
                            keyword: "try"
                        },
                        ee = {
                            keyword: "var"
                        },
                        ne = {
                            keyword: "while",
                            isLoop: !0
                        },
                        ie = {
                            keyword: "with"
                        },
                        re = {
                            keyword: "new",
                            beforeExpr: !0
                        },
                        se = {
                            keyword: "this"
                        },
                        oe = {
                            keyword: "null",
                            atomValue: null
                        },
                        ae = {
                            keyword: "true",
                            atomValue: !0
                        },
                        he = {
                            keyword: "false",
                            atomValue: !1
                        },
                        le = {
                            keyword: "in",
                            binop: 7,
                            beforeExpr: !0
                        },
                        ue = {
                            break: Ht,
                            case: qt,
                            catch: Bt,
                            continue: jt,
                            debugger: Wt,
                            default: Vt,
                            do: Ut,
                            else: Yt,
                            finally: Xt,
                            for: Zt,
                            function: Gt,
                            if: $t,
                            return: Jt,
                            switch: Qt,
                            throw: Kt,
                            try: te,
                            var: ee,
                            while: ne,
                            with: ie,
                            null: oe,
                            true: ae,
                            false: he,
                            new: re,
                            in: le,
                            instanceof: {
                                keyword: "instanceof",
                                binop: 7,
                                beforeExpr: !0
                            },
                            this: se,
                            typeof: {
                                keyword: "typeof",
                                prefix: !0,
                                beforeExpr: !0
                            },
                            void: {
                                keyword: "void",
                                prefix: !0,
                                beforeExpr: !0
                            },
                            delete: {
                                keyword: "delete",
                                prefix: !0,
                                beforeExpr: !0
                            }
                        },
                        ce = {
                            type: "[",
                            beforeExpr: !0
                        },
                        de = {
                            type: "]"
                        },
                        fe = {
                            type: "{",
                            beforeExpr: !0
                        },
                        pe = {
                            type: "}"
                        },
                        ge = {
                            type: "(",
                            beforeExpr: !0
                        },
                        me = {
                            type: ")"
                        },
                        ve = {
                            type: ",",
                            beforeExpr: !0
                        },
                        _e = {
                            type: ";",
                            beforeExpr: !0
                        },
                        ye = {
                            type: ":",
                            beforeExpr: !0
                        },
                        we = {
                            type: "."
                        },
                        xe = {
                            type: "?",
                            beforeExpr: !0
                        },
                        be = {
                            binop: 10,
                            beforeExpr: !0
                        },
                        Ce = {
                            isAssign: !0,
                            beforeExpr: !0
                        },
                        Se = {
                            isAssign: !0,
                            beforeExpr: !0
                        },
                        Te = {
                            postfix: !0,
                            prefix: !0,
                            isUpdate: !0
                        },
                        Ee = {
                            prefix: !0,
                            beforeExpr: !0
                        },
                        Pe = {
                            binop: 1,
                            beforeExpr: !0
                        },
                        ke = {
                            binop: 2,
                            beforeExpr: !0
                        },
                        Ae = {
                            binop: 3,
                            beforeExpr: !0
                        },
                        ze = {
                            binop: 4,
                            beforeExpr: !0
                        },
                        Ie = {
                            binop: 5,
                            beforeExpr: !0
                        },
                        Me = {
                            binop: 6,
                            beforeExpr: !0
                        },
                        Oe = {
                            binop: 7,
                            beforeExpr: !0
                        },
                        Le = {
                            binop: 8,
                            beforeExpr: !0
                        },
                        Ne = {
                            binop: 9,
                            prefix: !0,
                            beforeExpr: !0
                        },
                        Fe = {
                            binop: 10,
                            beforeExpr: !0
                        };
                    t.tokTypes = {
                        bracketL: ce,
                        bracketR: de,
                        braceL: fe,
                        braceR: pe,
                        parenL: ge,
                        parenR: me,
                        comma: ve,
                        semi: _e,
                        colon: ye,
                        dot: we,
                        question: xe,
                        slash: be,
                        eq: Ce,
                        name: Dt,
                        eof: Rt,
                        num: Lt,
                        regexp: Nt,
                        string: Ft
                    };
                    for (var De in ue) t.tokTypes["_" + De] = ue[De];
                    var Re, He = i("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile"),
                        qe = i("class enum extends super const export import"),
                        Be = i("implements interface let package private protected public static yield"),
                        je = i("eval arguments"),
                        We = i("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this"),
                        Ve = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
                        Ue = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-ࢬऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〇〡-〩〱-〵〸-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚗꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ",
                        Ye = new RegExp("[" + Ue + "]"),
                        Xe = new RegExp("[" + Ue + "̀-ͯ҃-֑҇-ׇֽֿׁׂׅׄؐ-ؚؠ-ىٲ-ۓۧ-ۨۻ-ۼܰ-݊ࠀ-ࠔࠛ-ࠣࠥ-ࠧࠩ-࠭ࡀ-ࡗࣤ-ࣾऀ-ःऺ-़ा-ॏ॑-ॗॢ-ॣ०-९ঁ-ঃ়া-ৄেৈৗয়-ৠਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢ-ૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୟ-ୠ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఁ-ఃె-ైొ-్ౕౖౢ-ౣ౦-౯ಂಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢ-ೣ೦-೯ംഃെ-ൈൗൢ-ൣ൦-൯ංඃ්ා-ුූෘ-ෟෲෳิ-ฺเ-ๅ๐-๙ິ-ູ່-ໍ໐-໙༘༙༠-༩༹༵༷ཁ-ཇཱ-྄྆-྇ྍ-ྗྙ-ྼ࿆က-ဩ၀-၉ၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟ᜎ-ᜐᜠ-ᜰᝀ-ᝐᝲᝳក-ឲ៝០-៩᠋-᠍᠐-᠙ᤠ-ᤫᤰ-᤻ᥑ-ᥭᦰ-ᧀᧈ-ᧉ᧐-᧙ᨀ-ᨕᨠ-ᩓ᩠-᩿᩼-᪉᪐-᪙ᭆ-ᭋ᭐-᭙᭫-᭳᮰-᮹᯦-᯳ᰀ-ᰢ᱀-᱉ᱛ-ᱽ᳐-᳒ᴀ-ᶾḁ-ἕ‌‍‿⁀⁔⃐-⃥⃜⃡-⃰ⶁ-ⶖⷠ-ⷿ〡-〨゙゚Ꙁ-ꙭꙴ-꙽ꚟ꛰-꛱ꟸ-ꠀ꠆ꠋꠣ-ꠧꢀ-ꢁꢴ-꣄꣐-꣙ꣳ-ꣷ꤀-꤉ꤦ-꤭ꤰ-ꥅꦀ-ꦃ꦳-꧀ꨀ-ꨧꩀ-ꩁꩌ-ꩍ꩐-꩙ꩻꫠ-ꫩꫲ-ꫳꯀ-ꯡ꯬꯭꯰-꯹ﬠ-ﬨ︀-️︠-︦︳︴﹍-﹏０-９＿]"),
                        Ze = /[\n\r\u2028\u2029]/,
                        Ge = /\r\n|[\n\r\u2028\u2029]/g,
                        $e = t.isIdentifierStart = function(t) {
                            return t < 65 ? 36 === t : t < 91 || (t < 97 ? 95 === t : t < 123 || t >= 170 && Ye.test(String.fromCharCode(t)))
                        },
                        Je = t.isIdentifierChar = function(t) {
                            return t < 48 ? 36 === t : t < 58 || !(t < 65) && (t < 91 || (t < 97 ? 95 === t : t < 123 || t >= 170 && Xe.test(String.fromCharCode(t))))
                        },
                        Qe = {
                            kind: "loop"
                        },
                        Ke = {
                            kind: "switch"
                        }
                }), m.version || (m = null)
        }
        var y = {
                "+": "__add",
                "-": "__subtract",
                "*": "__multiply",
                "/": "__divide",
                "%": "__modulo",
                "==": "__equals",
                "!=": "__equals"
            },
            w = {
                "-": "__negate",
                "+": "__self"
            },
            x = r.each(["add", "subtract", "multiply", "divide", "modulo", "equals", "negate"], function(t) {
                this["__" + t] = "#" + t
            }, {
                __self: function() {
                    return this
                }
            });
        return c.inject(x), f.inject(x), H.inject(x), n && ("complete" === i.readyState ? setTimeout(d) : V.add(n, {
            load: d
        })), {
            compile: h,
            execute: l,
            load: p,
            parse: e
        }
    }.call(this), paper = new(o.inject(r.exports, {
        Base: r,
        Numerical: l,
        Key: G,
        DomEvent: V,
        DomElement: W,
        document: i,
        window: n,
        Symbol: E,
        PlacedSymbol: T
    })), paper.agent.node && require("./node/extend.js")(paper), "function" == typeof define && define.amd ? define("paper", paper) : "object" == typeof module && module && (module.exports = paper), paper
}.call(this, "object" == typeof self ? self : null);
! function t(e, n, i) {
    function r(o, a) {
        if (!n[o]) {
            if (!e[o]) {
                var h = "function" == typeof require && require;
                if (!a && h) return h(o, !0);
                if (s) return s(o, !0);
                var l = new Error("Cannot find module '" + o + "'");
                throw l.code = "MODULE_NOT_FOUND", l
            }
            var u = n[o] = {
                exports: {}
            };
            e[o][0].call(u.exports, function(t) {
                return r(e[o][1][t] || t)
            }, u, u.exports, t, e, n, i)
        }
        return n[o].exports
    }
    for (var s = "function" == typeof require && require, o = 0; o < i.length; o++) r(i[o]);
    return r
}({
    1: [function(t, e, n) {}, {}],
    2: [function(t, e, n) {
        "use strict";

        function i(t) {
            var e = {
                duration: 400,
                delay: 0,
                repeat: 0,
                easing: "linear",
                complete: void 0,
                step: void 0,
                mode: "onFrame"
            };
            return void 0 === t && (t = {}), void 0 === t.duration ? t.duration = e.duration : (t.duration = Number(t.duration), t.duration < 0 && (t.duration = e.duration)), void 0 === t.delay ? t.delay = e.delay : (t.delay = Number(t.delay), t.delay < 1 && (t.delay = e.delay)), void 0 === t.repeat ? t.repeat = e.repeat : "function" == typeof t.repeat || !0 !== t.repeat && (t.repeat = Number(t.repeat), t.repeat < 0 && (t.repeat = e.repeat)), void 0 === t.easing && (t.easing = e.easing), "function" == typeof t.easing ? t.easingFunction = t.easing : void 0 !== o.easing[t.easing] && o.easing.hasOwnProperty(t.easing) ? t.easingFunction = o.easing[t.easing] : (t.easing = e.easing, t.easingFunction = o.easing[e.easing]), "function" != typeof t.complete && (t.complete = void 0), "function" != typeof t.step && (t.step = void 0), -1 === ["onFrame", "timeout"].indexOf(t.mode) && (t.mode = e.mode), t
        }
        n.__esModule = !0;
        var r = (t("./getPaper"), t("./tween")),
            s = t("./frameManager"),
            o = t("./easing"),
            a = function() {
                function t(e, n, o, a) {
                    var h = this;
                    if (this.stopped = !1, this.startTime = (new Date).getTime(), this.settings = i(o), this.item = e, this.itemForAnimations = this.settings.parentItem || this.item, this.repeat = this.settings.repeat || 0, "function" == typeof this.settings.repeat) {
                        var l = this.settings.repeat;
                        this.repeatCallback = function() {
                            return l(e, h) ? new t(e, n, o, a) : null
                        }
                    } else(!0 === this.repeat || this.repeat > 0) && (this.repeatCallback = function(i) {
                        return o.repeat = i, new t(e, n, o, a)
                    });
                    this.tweens = [], this.ticker = null, this._continue = a, void 0 === this.itemForAnimations.data && (this.itemForAnimations.data = {}), void 0 === this.itemForAnimations.data._animatePaperAnims && (this.itemForAnimations.data._animatePaperAnims = []), this._dataIndex = this.itemForAnimations.data._animatePaperAnims.length, this.itemForAnimations.data._animatePaperAnims[this._dataIndex] = this;
                    for (var u in n) n.hasOwnProperty(u) && this.tweens.push(new r.Tween(u, n[u], this));
                    "onFrame" === this.settings.mode && (this.ticker = s.add(this.itemForAnimations, "_animate" + this.startTime + (Math.floor(999 * Math.random()) + 1), function() {
                        h.tick()
                    }))
                }
                return t.prototype.tick = function() {
                    var t = this;
                    if (t.stopped) return !1;
                    var e = (new Date).getTime();
                    if (t.startTime + t.settings.delay > e) return !1;
                    for (var n = Math.max(0, t.startTime + t.settings.delay + t.settings.duration - e), i = n / t.settings.duration || 0, r = 1 - i, s = 0, o = t.tweens.length; s < o; s++) t.tweens[s].run(r);
                    return void 0 !== t.settings.step && t.settings.step.call(t.item, {
                        percent: r,
                        remaining: n
                    }), void 0 !== t.settings.parentItem ? t.settings.parentItem.project.view.draw() : t.item.project.view.draw(), t.settings.mode, r < 1 && o ? n : (t.end(), !1)
                }, t.prototype.stop = function(t, e) {
                    void 0 === t && (t = !1), void 0 === e && (e = !1);
                    var n = this,
                        i = 0,
                        r = t ? n.tweens.length : 0;
                    if (n.stopped) return n;
                    for (n.stopped = !0; i < r; i++) n.tweens[i].run(1);
                    t && (n._continue && (n._continue = null), n.end(e))
                }, t.prototype.end = function(t) {
                    void 0 === t && (t = !1);
                    var e = this;
                    if ("onFrame" === e.settings.mode && s.remove(e.itemForAnimations, e.ticker), void 0 !== e.settings.complete && e.settings.complete.call(e.item, this), e.settings.mode, "function" == typeof e._continue && e._continue.call(e.item), e.itemForAnimations.data._animatePaperAnims[e._dataIndex] = null, !t && "function" == typeof e.repeatCallback) {
                        var n = e.repeat;
                        return !0 !== e.repeat && (n = e.repeat - 1), e.repeatCallback(n)
                    }
                    e = null
                }, t
            }();
        n.Animation = a
    }, {
        "./easing": 3,
        "./frameManager": 7,
        "./getPaper": 8,
        "./tween": 10
    }],
    3: [function(t, e, n) {
        "use strict";
        n.__esModule = !0, n.easing = {
            extendEasing: function(t) {
                for (var e in t) t.hasOwnProperty(e) && (n.easing[e] = t[e])
            },
            linear: function(t) {
                return t
            },
            swing: function(t) {
                return .5 - Math.cos(t * Math.PI) / 2
            },
            Sine: function(t) {
                return 1 - Math.cos(t * Math.PI / 2)
            },
            Circ: function(t) {
                return 1 - Math.sqrt(1 - t * t)
            },
            Elastic: function(t) {
                return 0 === t || 1 === t ? t : -Math.pow(2, 8 * (t - 1)) * Math.sin((80 * (t - 1) - 7.5) * Math.PI / 15)
            },
            Back: function(t) {
                return t * t * (3 * t - 2)
            },
            Bounce: function(t) {
                for (var e, n = 4; t < ((e = Math.pow(2, --n)) - 1) / 11;);
                return 1 / Math.pow(4, 3 - n) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2)
            }
        };
        for (var i = ["Quad", "Cubic", "Quart", "Quint", "Expo"], r = 0, s = i.length; r < s; r++) n.easing[i[r]] = function(t) {
            return Math.pow(t, r + 2)
        };
        i = null;
        for (var o in n.easing)
            if (n.easing.hasOwnProperty(o)) {
                var a = n.easing[o];
                n.easing["easeIn" + o] = a, n.easing["easeOut" + o] = function(t) {
                    return 1 - a(1 - t)
                }, n.easing["easeInOut" + o] = function(t) {
                    return t < .5 ? a(2 * t) / 2 : 1 - a(-2 * t + 2) / 2
                }
            }
    }, {}],
    4: [function(t, e, n) {
        "use strict";
        n.__esModule = !0;
        var i = t("./animation"),
            r = function(t, e) {
                var n = [];
                e instanceof Array ? n = e : n.push(e);
                var r = 0;
                return new i.Animation(t, n[r].properties, n[r].settings, function e() {
                    r++, void 0 !== n[r] && new i.Animation(t, n[r].properties, n[r].settings, e)
                }), t
            };
        n.grow = function(t, e) {
            return console.log("segmentGrow was buggy and has been removed, sorry :/"), t
        }, n.shake = function(t, e) {
            for (var n = 2 * Math.floor(e ? e.nb || 2 : 2), i = Math.floor(e ? e.movement || 40 : 40), s = [], o = !0; n > 0; n--) {
                var a = n % 2 ? "+" : "-",
                    h = i,
                    l = null;
                1 === n && e && void 0 !== e.complete && (l = e.complete), (o || 1 === n) && (h /= 2, o = !1), s.push({
                    properties: {
                        position: {
                            x: a + h
                        }
                    },
                    settings: {
                        duration: 100,
                        easing: "swing",
                        complete: l
                    }
                })
            }
            r(t, s)
        }, n.fadeIn = function(t, e) {
            var n = 500,
                i = void 0,
                s = "swing";
            void 0 !== e && (void 0 !== e.duration && (n = Number(e.duration)), "function" == typeof e.complete && (i = e.complete), void 0 !== e.easing && (s = e.easing)), r(t, {
                properties: {
                    opacity: 1
                },
                settings: {
                    duration: n,
                    easing: s,
                    complete: i
                }
            })
        }, n.fadeOut = function(t, e) {
            var n = 500,
                i = void 0,
                s = "swing";
            void 0 !== e && (void 0 !== e.duration && (n = Number(e.duration)), "function" == typeof e.complete && (i = e.complete), void 0 !== e.easing && (s = e.easing)), r(t, {
                properties: {
                    opacity: 0
                },
                settings: {
                    duration: n,
                    easing: s,
                    complete: i
                }
            })
        }, n.slideUp = function(t, e) {
            var n = 500,
                i = void 0,
                s = 50,
                o = "swing";
            void 0 !== e && (void 0 !== e.duration && (n = Number(e.duration)), "function" == typeof e.complete && (i = e.complete), void 0 !== e.easing && (o = e.easing), void 0 !== e.distance && (s = e.distance)), r(t, {
                properties: {
                    opacity: 1,
                    position: {
                        y: "-" + s
                    }
                },
                settings: {
                    duration: n,
                    easing: o,
                    complete: i
                }
            })
        }, n.slideDown = function(t, e) {
            var n = 500,
                i = void 0,
                s = 50,
                o = "swing";
            void 0 !== e && (void 0 !== e.duration && (n = Number(e.duration)), "function" == typeof e.complete && (i = e.complete), void 0 !== e.easing && (o = e.easing), void 0 !== e.distance && (s = e.distance)), r(t, {
                properties: {
                    opacity: 0,
                    position: {
                        y: "+" + s
                    }
                },
                settings: {
                    duration: n,
                    easing: o,
                    complete: i
                }
            })
        }, n.splash = function(t, e) {
            var n = 500,
                i = void 0,
                s = "swing";
            void 0 !== e && (void 0 !== e.duration && (n = Number(e.duration)), "function" == typeof e.complete && (i = e.complete), void 0 !== e.easing && (s = e.easing)), r(t, {
                properties: {
                    opacity: 1,
                    scale: 3,
                    rotate: 360
                },
                settings: {
                    duration: n,
                    easing: s,
                    complete: i
                }
            })
        }, void 0 !== e && (e.exports = {
            grow: function(t, e) {
                return console.log("segmentGrow was buggy and has been removed, sorry :/"), t
            },
            shake: n.shake,
            fadeIn: n.fadeIn,
            fadeOut: n.fadeOut,
            slideUp: n.slideUp,
            slideDown: n.slideDown,
            splash: n.splash
        })
    }, {
        "./animation": 2
    }],
    5: [function(t, e, n) {
        "use strict";
        n.__esModule = !0;
        var i = t("./export");
        window.animatePaper = i
    }, {
        "./export": 6
    }],
    6: [function(t, e, n) {
        "use strict";
        n.__esModule = !0;
        var i = t("./animation"),
            r = t("./effects"),
            s = t("./easing"),
            o = t("./frameManager"),
            a = t("./prophooks"),
            h = t("./getPaper");
        n.animate = function(t, e) {
            var n = [];
            e instanceof Array ? n = e : n.push(e);
            var r = 0;
            return new i.Animation(t, n[r].properties, n[r].settings, function e() {
                r++, void 0 !== n[r] && new i.Animation(t, n[r].properties, n[r].settings, e)
            }), t
        }, n.stop = function(t, e, n) {
            if (t.data._animatePaperAnims)
                for (var i = 0, r = t.data._animatePaperAnims.length; i < r; i++) t.data._animatePaperAnims[i] && t.data._animatePaperAnims[i].stop(e, n);
            return t
        }, n.extendEasing = s.easing.extendEasing, n.frameManager = o, n.fx = r, h.Item.prototype.animate || (h.Item.prototype.animate = function(t) {
            return n.animate(this, t)
        }), h.Item.prototype.stop || (h.Item.prototype.stop = function(t, e) {
            return n.stop(this, t, e)
        }), void 0 !== e && (e.exports = {
            animate: n.animate,
            stop: n.stop,
            frameManager: n.frameManager,
            fx: n.fx,
            extendEasing: n.extendEasing,
            extendPropHooks: a.extendPropHooks
        })
    }, {
        "./animation": 2,
        "./easing": 3,
        "./effects": 4,
        "./frameManager": 7,
        "./getPaper": 8,
        "./prophooks": 9
    }],
    7: [function(t, e, n) {
        "use strict";

        function i(t) {
            var e = this;
            if (void 0 === e.data && (e.data = {}), void 0 !== e.data._customHandlers && e.data._customHandlersCount > 0)
                for (var n in e.data._customHandlers) e.data._customHandlers.hasOwnProperty(n) && "function" == typeof e.data._customHandlers[n] && e.data._customHandlers[n].call(e, t)
        }
        n.__esModule = !0, n.add = function(t, e, n, r) {
            return void 0 === t.data._customHandlers && (t.data._customHandlers = {}, t.data._customHandlersCount = 0), t.data._customHandlers[e] = n, t.data._customHandlersCount += 1, t.data._customHandlersCount > 0 && (void 0 !== r ? r.onFrame = i : t.onFrame = i), e
        }, n.remove = function(t, e) {
            void 0 !== t.data._customHandlers && (t.data._customHandlers[e] = null, t.data._customHandlersCount -= 1, t.data._customHandlersCount <= 0 && (t.data._customHandlersCount = 0))
        }
    }, {}],
    8: [function(t, e, n) {
        var i = t("paper");
        "undefined" != typeof window && void 0 !== window.paper && (i = window.paper), e.exports = i
    }, {
        paper: 1
    }],
    9: [function(t, e, n) {
        "use strict";

        function i(t) {
            var e = null,
                n = "";
            if (e = Number(t), "string" == typeof t) {
                var i = t.match(o);
                n = i[1], e = Number(i[2])
            }
            return {
                value: e,
                direction: n
            }
        }

        function r(t) {
            var e;
            return t.type ? e = t.type : (t.red, e = "rgb"), e
        }

        function s(t) {
            var e;
            if (t._properties) e = t._properties;
            else switch (r(t)) {
                case "gray":
                    e = ["gray"];
                    break;
                case "rgb":
                    e = ["red", "green", "blue"];
                    break;
                case "hsl":
                    e = ["hue", "saturation", "lightness"];
                    break;
                case "hsb":
                    e = ["hue", "brightness", "saturation"]
            }
            return e
        }
        n.__esModule = !0;
        for (var o = /^([+\-])(.+)/, a = function(t, e, n) {
                if (-1 !== ["+", "-"].indexOf(n) && void 0 !== t && void 0 !== e) {
                    if (t.x, e.x, t.y, e.y, "+" === n) return t.add(e);
                    if ("-" === n) return t.subtract(e);
                    throw new Error("Unknown operator")
                }
            }, h = {
                _default: {
                    get: function(t) {
                        var e;
                        return null !== t.item[t.prop] && (e = t.item[t.prop]), e
                    },
                    set: function(t) {
                        var e = {};
                        e[t.prop] = t.now, t.item.set(e)
                    }
                },
                scale: {
                    get: function(t) {
                        return t.item.data._animatePaperVals || (t.item.data._animatePaperVals = {}), void 0 === t.item.data._animatePaperVals.scale && (t.item.data._animatePaperVals.scale = 1), t.item.data._animatePaperVals.scale
                    },
                    set: function(t) {
                        var e = t.item.data._animatePaperVals.scale,
                            n = t.now / e;
                        t.item.data._animatePaperVals.scale = t.now;
                        var i = !1;
                        void 0 !== t.A.settings.center && (i = t.A.settings.center), void 0 !== t.A.settings.scaleCenter && (i = t.A.settings.scaleCenter), !1 !== i ? t.item.scale(n, i) : t.item.scale(n)
                    }
                },
                rotate: {
                    get: function(t) {
                        return t.item.data._animatePaperVals || (t.item.data._animatePaperVals = {}), void 0 === t.item.data._animatePaperVals.rotate && (t.item.data._animatePaperVals.rotate = -0), t.item.data._animatePaperVals.rotate
                    },
                    set: function(t) {
                        var e = t.item.data._animatePaperVals.rotate,
                            n = t.now - e;
                        t.item.data._animatePaperVals.rotate = t.now;
                        var i = !1;
                        void 0 !== t.A.settings.center && (i = t.A.settings.center), void 0 !== t.A.settings.rotateCenter && (i = t.A.settings.rotateCenter), !1 !== i ? t.item.rotate(n, i) : t.item.rotate(n)
                    }
                },
                translate: {
                    get: function(t) {
                        return t.item.data._animatePaperVals || (t.item.data._animatePaperVals = {}), void 0 === t.item.data._animatePaperVals.translate && (t.item.data._animatePaperVals.translate = new paper.Point(0, 0)), t.item.data._animatePaperVals.translate
                    },
                    set: function(t) {
                        var e = t.item.data._animatePaperVals.translate,
                            n = a(t.now, e, "-");
                        t.item.data._animatePaperVals.translate = t.now, t.item.translate(n)
                    },
                    ease: function(t, e) {
                        var n = a(t.end, t.start, "-");
                        return n.x = n.x * e, n.y = n.y * e, t.now = a(n, t.start, "+"), t.now
                    }
                },
                position: {
                    get: function(t) {
                        return {
                            x: t.item.position.x,
                            y: t.item.position.y
                        }
                    },
                    set: function(t) {
                        t.item.position.x += t.now.x, t.item.position.y += t.now.y
                    },
                    ease: function(t, e) {
                        void 0 === t._easePositionCache && (t._easePositionCache = {
                            x: 0,
                            y: 0
                        });
                        var n = i(t.end.x || 0),
                            r = n.value,
                            s = n.direction,
                            o = i(t.end.y || 0),
                            a = o.value,
                            h = o.direction,
                            l = function(t) {
                                return (t || 0) * e
                            };
                        return void 0 !== t.end.x ? "+" === s ? (t.now.x = l(r) - t._easePositionCache.x, t._easePositionCache.x += t.now.x) : "-" === s ? (t.now.x = l(r) - t._easePositionCache.x, t._easePositionCache.x += t.now.x, t.now.x = -t.now.x) : (t.now.x = (r - t.start.x) * e - t._easePositionCache.x, t._easePositionCache.x += t.now.x) : t.now.x = 0, void 0 !== t.end.y ? "+" === h ? (t.now.y = l(a) - t._easePositionCache.y, t._easePositionCache.y += t.now.y) : "-" === h ? (t.now.y = l(a) - t._easePositionCache.y, t._easePositionCache.y += t.now.y, t.now.y = -t.now.y) : (t.now.y = (a - t.start.y) * e - t._easePositionCache.y, t._easePositionCache.y += t.now.y) : t.now.y = 0, t.now
                    }
                },
                pointPosition: {
                    get: function(t) {
                        return {
                            x: t.item.x,
                            y: t.item.y
                        }
                    },
                    set: function(t) {
                        t.item.x += t.now.x, t.item.y += t.now.y
                    },
                    ease: function(t, e) {
                        void 0 === t._easePositionCache && (t._easePositionCache = {
                            x: 0,
                            y: 0
                        });
                        var n = i(t.end.x || 0),
                            r = n.value,
                            s = n.direction,
                            o = i(t.end.y || 0),
                            a = o.value,
                            h = o.direction,
                            l = function(t) {
                                return (t || 0) * e
                            };
                        return void 0 !== t.end.x ? "+" === s ? (t.now.x = l(r) - t._easePositionCache.x, t._easePositionCache.x += t.now.x) : "-" === s ? (t.now.x = l(r) - t._easePositionCache.x, t._easePositionCache.x += t.now.x, t.now.x = -t.now.x) : (t.now.x = (r - t.start.x) * e - t._easePositionCache.x, t._easePositionCache.x += t.now.x) : t.now.x = 0, void 0 !== t.end.y ? "+" === h ? (t.now.y = l(a) - t._easePositionCache.y, t._easePositionCache.y += t.now.y) : "-" === h ? (t.now.y = l(a) - t._easePositionCache.y, t._easePositionCache.y += t.now.y, t.now.y = -t.now.y) : (t.now.y = (a - t.start.y) * e - t._easePositionCache.y, t._easePositionCache.y += t.now.y) : t.now.y = 0, t.now
                    }
                },
                Color: {
                    get: function(t) {
                        for (var e = t.item[t.prop], n = s(e), i = {}, r = 0, o = n; r < o.length; r++) {
                            var a = o[r];
                            i[a] = e[a]
                        }
                        return i
                    },
                    set: function(t) {
                        for (var e = s(t.item[t.prop]), n = t.item[t.prop], i = {}, r = 0, o = e; r < o.length; r++) {
                            var a = o[r];
                            i[a] = n[a] + t.now[a]
                        }
                        t.item[t.prop] = i
                    },
                    ease: function(t, e) {
                        for (var n = s(t.item[t.prop]), r = function(t) {
                                return (t || 0) * e
                            }, o = 0, a = n; o < a.length; o++) {
                            var h = a[o],
                                l = h;
                            void 0 === t._easeColorCache && (t._easeColorCache = {}), void 0 === t._easeColorCache[l] && (t._easeColorCache[l] = 0);
                            var u = i(t.end[l] || 0),
                                c = u.value,
                                d = u.direction;
                            void 0 !== t.end[l] ? "+" === d ? (t.now[l] = r(c) - t._easeColorCache[l], t._easeColorCache[l] += t.now[l]) : "-" === d ? (t.now[l] = r(c) - t._easeColorCache[l], t._easeColorCache[l] += t.now[l], t.now[l] = -t.now[l]) : (t.now[l] = (c - t.start[l]) * e - t._easeColorCache[l], t._easeColorCache[l] += t.now[l]) : t.now[l] = 0
                        }
                        return t.now
                    }
                }
            }, l = ["fill", "stroke"], u = 0, c = l.length; u < c; u++) h[l[u] + "Color"] = h.Color;
        n._tweenPropHooks = h, n._pointDiff = a, n.extendPropHooks = function(t) {
            for (var e in t) t.hasOwnProperty(e) && (h[e] = t[e])
        }, void 0 !== e && (e.exports = {
            _tweenPropHooks: h,
            __pointDiff: a,
            extendPropHooks: n.extendPropHooks
        })
    }, {}],
    10: [function(t, e, n) {
        "use strict";
        n.__esModule = !0;
        var i = t("./prophooks"),
            r = t("./easing"),
            s = function() {
                function t(t, e, n) {
                    var i = this;
                    i.A = n, i.item = n.item, i.prop = t, i.end = e, i.start = i.cur(), "string" == typeof i.end && "+" === i.end.charAt(0) ? i.end = i.start + parseFloat(i.end) : "string" == typeof i.end && "-" === i.end.charAt(0) && (i.end = i.start + parseFloat(i.end)), i.now = i.cur(), i.direction = i.end > i.start ? "+" : "-"
                }
                return t.prototype.cur = function() {
                    var t = this,
                        e = i._tweenPropHooks[t.prop];
                    return e && e.get ? e.get(t) : i._tweenPropHooks._default.get(t)
                }, t.prototype.run = function(t) {
                    var e, n = this,
                        s = i._tweenPropHooks[n.prop],
                        o = n.A.settings;
                    if (o.duration) {
                        var a = void 0;
                        a = "function" == typeof o.easing ? o.easing : r.easing[o.easing], n.pos = e = a(t, o.duration * t, 0, 1, n.duration)
                    } else n.pos = e = t;
                    return s && s.ease ? s.ease(n, e) : n.now = (n.end - n.start) * e + n.start, s && s.set ? s.set(n) : i._tweenPropHooks._default.set(n), n
                }, t
            }();
        n.Tween = s
    }, {
        "./easing": 3,
        "./prophooks": 9
    }]
}, {}, [5]),
function(t, e) {
    "use strict";
    "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? module.exports = e() : t.Headroom = e()
}(this, function() {
    "use strict";

    function t(t) {
        this.callback = t, this.ticking = !1
    }

    function e(t) {
        return t && "undefined" != typeof window && (t === window || t.nodeType)
    }

    function n(t) {
        if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
        var i, r, s = t || {};
        for (r = 1; r < arguments.length; r++) {
            var o = arguments[r] || {};
            for (i in o) "object" != typeof s[i] || e(s[i]) ? s[i] = s[i] || o[i] : s[i] = n(s[i], o[i])
        }
        return s
    }

    function i(t) {
        return t === Object(t) ? t : {
            down: t,
            up: t
        }
    }

    function r(t, e) {
        e = n(e, r.options), this.lastKnownScrollY = 0, this.elem = t, this.tolerance = i(e.tolerance), this.classes = e.classes, this.offset = e.offset, this.scroller = e.scroller, this.initialised = !1, this.onPin = e.onPin, this.onUnpin = e.onUnpin, this.onTop = e.onTop, this.onNotTop = e.onNotTop, this.onBottom = e.onBottom, this.onNotBottom = e.onNotBottom
    }
    var s = {
        bind: !! function() {}.bind,
        classList: "classList" in document.documentElement,
        rAF: !!(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame)
    };
    return window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame, t.prototype = {
        constructor: t,
        update: function() {
            this.callback && this.callback(), this.ticking = !1
        },
        requestTick: function() {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), this.ticking = !0)
        },
        handleEvent: function() {
            this.requestTick()
        }
    }, r.prototype = {
        constructor: r,
        init: function() {
            if (r.cutsTheMustard) return this.debouncer = new t(this.update.bind(this)), this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), this
        },
        destroy: function() {
            var t = this.classes;
            this.initialised = !1;
            for (var e in t) t.hasOwnProperty(e) && this.elem.classList.remove(t[e]);
            this.scroller.removeEventListener("scroll", this.debouncer, !1)
        },
        attachEvent: function() {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(),
                this.initialised = !0, this.scroller.addEventListener("scroll", this.debouncer, !1), this.debouncer.handleEvent())
        },
        unpin: function() {
            var t = this.elem.classList,
                e = this.classes;
            !t.contains(e.pinned) && t.contains(e.unpinned) || (t.add(e.unpinned), t.remove(e.pinned), this.onUnpin && this.onUnpin.call(this))
        },
        pin: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.unpinned) && (t.remove(e.unpinned), t.add(e.pinned), this.onPin && this.onPin.call(this))
        },
        top: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.top) || (t.add(e.top), t.remove(e.notTop), this.onTop && this.onTop.call(this))
        },
        notTop: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.notTop) || (t.add(e.notTop), t.remove(e.top), this.onNotTop && this.onNotTop.call(this))
        },
        bottom: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.bottom) || (t.add(e.bottom), t.remove(e.notBottom), this.onBottom && this.onBottom.call(this))
        },
        notBottom: function() {
            var t = this.elem.classList,
                e = this.classes;
            t.contains(e.notBottom) || (t.add(e.notBottom), t.remove(e.bottom), this.onNotBottom && this.onNotBottom.call(this))
        },
        getScrollY: function() {
            return void 0 !== this.scroller.pageYOffset ? this.scroller.pageYOffset : void 0 !== this.scroller.scrollTop ? this.scroller.scrollTop : (document.documentElement || document.body.parentNode || document.body).scrollTop
        },
        getViewportHeight: function() {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        },
        getElementPhysicalHeight: function(t) {
            return Math.max(t.offsetHeight, t.clientHeight)
        },
        getScrollerPhysicalHeight: function() {
            return this.scroller === window || this.scroller === document.body ? this.getViewportHeight() : this.getElementPhysicalHeight(this.scroller)
        },
        getDocumentHeight: function() {
            var t = document.body,
                e = document.documentElement;
            return Math.max(t.scrollHeight, e.scrollHeight, t.offsetHeight, e.offsetHeight, t.clientHeight, e.clientHeight)
        },
        getElementHeight: function(t) {
            return Math.max(t.scrollHeight, t.offsetHeight, t.clientHeight)
        },
        getScrollerHeight: function() {
            return this.scroller === window || this.scroller === document.body ? this.getDocumentHeight() : this.getElementHeight(this.scroller)
        },
        isOutOfBounds: function(t) {
            var e = t < 0,
                n = t + this.getScrollerPhysicalHeight() > this.getScrollerHeight();
            return e || n
        },
        toleranceExceeded: function(t, e) {
            return Math.abs(t - this.lastKnownScrollY) >= this.tolerance[e]
        },
        shouldUnpin: function(t, e) {
            var n = t > this.lastKnownScrollY,
                i = t >= this.offset;
            return n && i && e
        },
        shouldPin: function(t, e) {
            var n = t < this.lastKnownScrollY,
                i = t <= this.offset;
            return n && e || i
        },
        update: function() {
            var t = this.getScrollY(),
                e = t > this.lastKnownScrollY ? "down" : "up",
                n = this.toleranceExceeded(t, e);
            this.isOutOfBounds(t) || (t <= this.offset ? this.top() : this.notTop(), t + this.getViewportHeight() >= this.getScrollerHeight() ? this.bottom() : this.notBottom(), this.shouldUnpin(t, n) ? this.unpin() : this.shouldPin(t, n) && this.pin(), this.lastKnownScrollY = t)
        }
    }, r.options = {
        tolerance: {
            up: 0,
            down: 0
        },
        offset: 0,
        scroller: window,
        classes: {
            pinned: "headroom--pinned",
            unpinned: "headroom--unpinned",
            top: "headroom--top",
            notTop: "headroom--not-top",
            bottom: "headroom--bottom",
            notBottom: "headroom--not-bottom",
            initial: "headroom"
        }
    }, r.cutsTheMustard = void 0 !== s && s.rAF && s.bind && s.classList, r
}),
function() {
    var t;
    t = function() {
            function t(t, e) {
                var n, i;
                if (this.options = {
                        target: "instafeed",
                        get: "popular",
                        resolution: "thumbnail",
                        sortBy: "none",
                        links: !0,
                        mock: !1,
                        useHttp: !1
                    }, "object" == typeof t)
                    for (n in t) i = t[n], this.options[n] = i;
                this.context = null != e ? e : this, this.unique = this._genKey()
            }
            return t.prototype.hasNext = function() {
                return "string" == typeof this.context.nextUrl && this.context.nextUrl.length > 0
            }, t.prototype.next = function() {
                return !!this.hasNext() && this.run(this.context.nextUrl)
            }, t.prototype.run = function(e) {
                var n, i, r;
                if ("string" != typeof this.options.clientId && "string" != typeof this.options.accessToken) throw new Error("Missing clientId or accessToken.");
                if ("string" != typeof this.options.accessToken && "string" != typeof this.options.clientId) throw new Error("Missing clientId or accessToken.");
                return null != this.options.before && "function" == typeof this.options.before && this.options.before.call(this), "undefined" != typeof document && null !== document && (r = document.createElement("script"), r.id = "instafeed-fetcher", r.src = e || this._buildUrl(), n = document.getElementsByTagName("head"), n[0].appendChild(r), i = "instafeedCache" + this.unique, window[i] = new t(this.options, this), window[i].unique = this.unique), !0
            }, t.prototype.parse = function(t) {
                var e, n, i, r, s, o, a, h, l, u, c, d, f, p, g, m, v, _, y, w, x, b, C, S, T, E, P, k, A, z, I;
                if ("object" != typeof t) {
                    if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "Invalid JSON data"), !1;
                    throw new Error("Invalid JSON response")
                }
                if (200 !== t.meta.code) {
                    if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, t.meta.error_message), !1;
                    throw new Error("Error from Instagram: " + t.meta.error_message)
                }
                if (0 === t.data.length) {
                    if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "No images were returned from Instagram"), !1;
                    throw new Error("No images were returned from Instagram")
                }
                if (null != this.options.success && "function" == typeof this.options.success && this.options.success.call(this, t), this.context.nextUrl = "", null != t.pagination && (this.context.nextUrl = t.pagination.next_url), "none" !== this.options.sortBy) switch (A = "random" === this.options.sortBy ? ["", "random"] : this.options.sortBy.split("-"), k = "least" === A[0], A[1]) {
                    case "random":
                        t.data.sort(function() {
                            return .5 - Math.random()
                        });
                        break;
                    case "recent":
                        t.data = this._sortBy(t.data, "created_time", k);
                        break;
                    case "liked":
                        t.data = this._sortBy(t.data, "likes.count", k);
                        break;
                    case "commented":
                        t.data = this._sortBy(t.data, "comments.count", k);
                        break;
                    default:
                        throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.")
                }
                if ("undefined" != typeof document && null !== document && !1 === this.options.mock) {
                    if (g = t.data, P = parseInt(this.options.limit, 10), null != this.options.limit && g.length > P && (g = g.slice(0, P)), o = document.createDocumentFragment(), null != this.options.filter && "function" == typeof this.options.filter && (g = this._filter(g, this.options.filter)), null != this.options.template && "string" == typeof this.options.template) {
                        for (h = "", f = "", "", I = document.createElement("div"), u = 0, C = g.length; u < C; u++) {
                            if (c = g[u], "object" != typeof(d = c.images[this.options.resolution])) throw s = "No image found for resolution: " + this.options.resolution + ".", new Error(s);
                            y = d.width, v = d.height, _ = "square", y > v && (_ = "landscape"), y < v && (_ = "portrait"), p = d.url, l = window.location.protocol.indexOf("http") >= 0, l && !this.options.useHttp && (p = p.replace(/https?:\/\//, "//")), f = this._makeTemplate(this.options.template, {
                                model: c,
                                id: c.id,
                                link: c.link,
                                type: c.type,
                                image: p,
                                width: y,
                                height: v,
                                orientation: _,
                                caption: this._getObjectProperty(c, "caption.text"),
                                likes: c.likes.count,
                                comments: c.comments.count,
                                location: this._getObjectProperty(c, "location.name")
                            }), h += f
                        }
                        for (I.innerHTML = h, r = [], i = 0, n = I.childNodes.length; i < n;) r.push(I.childNodes[i]), i += 1;
                        for (x = 0, S = r.length; x < S; x++) E = r[x], o.appendChild(E)
                    } else
                        for (b = 0, T = g.length; b < T; b++) {
                            if (c = g[b], m = document.createElement("img"), "object" != typeof(d = c.images[this.options.resolution])) throw s = "No image found for resolution: " + this.options.resolution + ".", new Error(s);
                            p = d.url, l = window.location.protocol.indexOf("http") >= 0, l && !this.options.useHttp && (p = p.replace(/https?:\/\//, "//")), m.src = p, !0 === this.options.links ? (e = document.createElement("a"), e.href = c.link, e.appendChild(m), o.appendChild(e)) : o.appendChild(m)
                        }
                    if (z = this.options.target, "string" == typeof z && (z = document.getElementById(z)), null == z) throw s = 'No element with id="' + this.options.target + '" on page.', new Error(s);
                    z.appendChild(o), a = document.getElementsByTagName("head")[0], a.removeChild(document.getElementById("instafeed-fetcher")), w = "instafeedCache" + this.unique, window[w] = void 0;
                    try {
                        delete window[w]
                    } catch (t) {
                        t
                    }
                }
                return null != this.options.after && "function" == typeof this.options.after && this.options.after.call(this), !0
            }, t.prototype._buildUrl = function() {
                var t, e, n;
                switch (t = "https://api.instagram.com/v1", this.options.get) {
                    case "popular":
                        e = "media/popular";
                        break;
                    case "tagged":
                        if (!this.options.tagName) throw new Error("No tag name specified. Use the 'tagName' option.");
                        e = "tags/" + this.options.tagName + "/media/recent";
                        break;
                    case "location":
                        if (!this.options.locationId) throw new Error("No location specified. Use the 'locationId' option.");
                        e = "locations/" + this.options.locationId + "/media/recent";
                        break;
                    case "user":
                        if (!this.options.userId) throw new Error("No user specified. Use the 'userId' option.");
                        e = "users/" + this.options.userId + "/media/recent";
                        break;
                    default:
                        throw new Error("Invalid option for get: '" + this.options.get + "'.")
                }
                return n = t + "/" + e, null != this.options.accessToken ? n += "?access_token=" + this.options.accessToken : n += "?client_id=" + this.options.clientId, null != this.options.limit && (n += "&count=" + this.options.limit), n += "&callback=instafeedCache" + this.unique + ".parse"
            }, t.prototype._genKey = function() {
                var t;
                return "" + (t = function() {
                    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
                })() + t() + t() + t()
            }, t.prototype._makeTemplate = function(t, e) {
                var n, i, r, s, o;
                for (i = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, n = t; i.test(n);) s = n.match(i)[1], o = null != (r = this._getObjectProperty(e, s)) ? r : "", n = n.replace(i, function() {
                    return "" + o
                });
                return n
            }, t.prototype._getObjectProperty = function(t, e) {
                var n, i;
                for (e = e.replace(/\[(\w+)\]/g, ".$1"), i = e.split("."); i.length;) {
                    if (n = i.shift(), !(null != t && n in t)) return null;
                    t = t[n]
                }
                return t
            }, t.prototype._sortBy = function(t, e, n) {
                var i;
                return i = function(t, i) {
                    var r, s;
                    return r = this._getObjectProperty(t, e), s = this._getObjectProperty(i, e), n ? r > s ? 1 : -1 : r < s ? 1 : -1
                }, t.sort(i.bind(this)), t
            }, t.prototype._filter = function(t, e) {
                var n, i, r, s, o;
                for (n = [], i = function(t) {
                        if (e(t)) return n.push(t)
                    }, r = 0, o = t.length; r < o; r++) s = t[r], i(s);
                return n
            }, t
        }(),
        function(t, e) {
            "function" == typeof define && define.amd ? define([], e) : "object" == typeof module && module.exports ? module.exports = e() : t.Instafeed = e()
        }(this, function() {
            return t
        })
}.call(this),
    function(t, e, n, i) {
        "use strict";

        function r(t, e, n) {
            return setTimeout(l(t, n), e)
        }

        function s(t, e, n) {
            return !!Array.isArray(t) && (o(t, n[e], n), !0)
        }

        function o(t, e, n) {
            var r;
            if (t)
                if (t.forEach) t.forEach(e, n);
                else if (t.length !== i)
                for (r = 0; r < t.length;) e.call(n, t[r], r, t), r++;
            else
                for (r in t) t.hasOwnProperty(r) && e.call(n, t[r], r, t)
        }

        function a(e, n, i) {
            var r = "DEPRECATED METHOD: " + n + "\n" + i + " AT \n";
            return function() {
                var n = new Error("get-stack-trace"),
                    i = n && n.stack ? n.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
                    s = t.console && (t.console.warn || t.console.log);
                return s && s.call(t.console, r, i), e.apply(this, arguments)
            }
        }

        function h(t, e, n) {
            var i, r = e.prototype;
            i = t.prototype = Object.create(r), i.constructor = t, i._super = r, n && ut(i, n)
        }

        function l(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        }

        function u(t, e) {
            return typeof t == ft ? t.apply(e ? e[0] || i : i, e) : t
        }

        function c(t, e) {
            return t === i ? e : t
        }

        function d(t, e, n) {
            o(m(e), function(e) {
                t.addEventListener(e, n, !1)
            })
        }

        function f(t, e, n) {
            o(m(e), function(e) {
                t.removeEventListener(e, n, !1)
            })
        }

        function p(t, e) {
            for (; t;) {
                if (t == e) return !0;
                t = t.parentNode
            }
            return !1
        }

        function g(t, e) {
            return t.indexOf(e) > -1
        }

        function m(t) {
            return t.trim().split(/\s+/g)
        }

        function v(t, e, n) {
            if (t.indexOf && !n) return t.indexOf(e);
            for (var i = 0; i < t.length;) {
                if (n && t[i][n] == e || !n && t[i] === e) return i;
                i++
            }
            return -1
        }

        function _(t) {
            return Array.prototype.slice.call(t, 0)
        }

        function y(t, e, n) {
            for (var i = [], r = [], s = 0; s < t.length;) {
                var o = e ? t[s][e] : t[s];
                v(r, o) < 0 && i.push(t[s]), r[s] = o, s++
            }
            return n && (i = e ? i.sort(function(t, n) {
                return t[e] > n[e]
            }) : i.sort()), i
        }

        function w(t, e) {
            for (var n, r, s = e[0].toUpperCase() + e.slice(1), o = 0; o < ct.length;) {
                if (n = ct[o], (r = n ? n + s : e) in t) return r;
                o++
            }
            return i
        }

        function x() {
            return yt++
        }

        function b(e) {
            var n = e.ownerDocument || e;
            return n.defaultView || n.parentWindow || t
        }

        function C(t, e) {
            var n = this;
            this.manager = t, this.callback = e, this.element = t.element, this.target = t.options.inputTarget, this.domHandler = function(e) {
                u(t.options.enable, [t]) && n.handler(e)
            }, this.init()
        }

        function S(t) {
            var e = t.options.inputClass;
            return new(e || (bt ? R : Ct ? B : xt ? W : D))(t, T)
        }

        function T(t, e, n) {
            var i = n.pointers.length,
                r = n.changedPointers.length,
                s = e & Tt && i - r == 0,
                o = e & (Pt | kt) && i - r == 0;
            n.isFirst = !!s, n.isFinal = !!o, s && (t.session = {}), n.eventType = e, E(t, n), t.emit("hammer.input", n), t.recognize(n), t.session.prevInput = n
        }

        function E(t, e) {
            var n = t.session,
                i = e.pointers,
                r = i.length;
            n.firstInput || (n.firstInput = A(e)), r > 1 && !n.firstMultiple ? n.firstMultiple = A(e) : 1 === r && (n.firstMultiple = !1);
            var s = n.firstInput,
                o = n.firstMultiple,
                a = o ? o.center : s.center,
                h = e.center = z(i);
            e.timeStamp = mt(), e.deltaTime = e.timeStamp - s.timeStamp, e.angle = L(a, h), e.distance = O(a, h), P(n, e), e.offsetDirection = M(e.deltaX, e.deltaY);
            var l = I(e.deltaTime, e.deltaX, e.deltaY);
            e.overallVelocityX = l.x, e.overallVelocityY = l.y, e.overallVelocity = gt(l.x) > gt(l.y) ? l.x : l.y, e.scale = o ? F(o.pointers, i) : 1, e.rotation = o ? N(o.pointers, i) : 0, e.maxPointers = n.prevInput ? e.pointers.length > n.prevInput.maxPointers ? e.pointers.length : n.prevInput.maxPointers : e.pointers.length, k(n, e);
            var u = t.element;
            p(e.srcEvent.target, u) && (u = e.srcEvent.target), e.target = u
        }

        function P(t, e) {
            var n = e.center,
                i = t.offsetDelta || {},
                r = t.prevDelta || {},
                s = t.prevInput || {};
            e.eventType !== Tt && s.eventType !== Pt || (r = t.prevDelta = {
                x: s.deltaX || 0,
                y: s.deltaY || 0
            }, i = t.offsetDelta = {
                x: n.x,
                y: n.y
            }), e.deltaX = r.x + (n.x - i.x), e.deltaY = r.y + (n.y - i.y)
        }

        function k(t, e) {
            var n, r, s, o, a = t.lastInterval || e,
                h = e.timeStamp - a.timeStamp;
            if (e.eventType != kt && (h > St || a.velocity === i)) {
                var l = e.deltaX - a.deltaX,
                    u = e.deltaY - a.deltaY,
                    c = I(h, l, u);
                r = c.x, s = c.y, n = gt(c.x) > gt(c.y) ? c.x : c.y, o = M(l, u), t.lastInterval = e
            } else n = a.velocity, r = a.velocityX, s = a.velocityY, o = a.direction;
            e.velocity = n, e.velocityX = r, e.velocityY = s, e.direction = o
        }

        function A(t) {
            for (var e = [], n = 0; n < t.pointers.length;) e[n] = {
                clientX: pt(t.pointers[n].clientX),
                clientY: pt(t.pointers[n].clientY)
            }, n++;
            return {
                timeStamp: mt(),
                pointers: e,
                center: z(e),
                deltaX: t.deltaX,
                deltaY: t.deltaY
            }
        }

        function z(t) {
            var e = t.length;
            if (1 === e) return {
                x: pt(t[0].clientX),
                y: pt(t[0].clientY)
            };
            for (var n = 0, i = 0, r = 0; r < e;) n += t[r].clientX, i += t[r].clientY, r++;
            return {
                x: pt(n / e),
                y: pt(i / e)
            }
        }

        function I(t, e, n) {
            return {
                x: e / t || 0,
                y: n / t || 0
            }
        }

        function M(t, e) {
            return t === e ? At : gt(t) >= gt(e) ? t < 0 ? zt : It : e < 0 ? Mt : Ot
        }

        function O(t, e, n) {
            n || (n = Dt);
            var i = e[n[0]] - t[n[0]],
                r = e[n[1]] - t[n[1]];
            return Math.sqrt(i * i + r * r)
        }

        function L(t, e, n) {
            n || (n = Dt);
            var i = e[n[0]] - t[n[0]],
                r = e[n[1]] - t[n[1]];
            return 180 * Math.atan2(r, i) / Math.PI
        }

        function N(t, e) {
            return L(e[1], e[0], Rt) + L(t[1], t[0], Rt)
        }

        function F(t, e) {
            return O(e[0], e[1], Rt) / O(t[0], t[1], Rt)
        }

        function D() {
            this.evEl = qt, this.evWin = Bt, this.pressed = !1, C.apply(this, arguments)
        }

        function R() {
            this.evEl = Vt, this.evWin = Ut, C.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
        }

        function H() {
            this.evTarget = Xt, this.evWin = Zt, this.started = !1, C.apply(this, arguments)
        }

        function q(t, e) {
            var n = _(t.touches),
                i = _(t.changedTouches);
            return e & (Pt | kt) && (n = y(n.concat(i), "identifier", !0)), [n, i]
        }

        function B() {
            this.evTarget = $t, this.targetIds = {}, C.apply(this, arguments)
        }

        function j(t, e) {
            var n = _(t.touches),
                i = this.targetIds;
            if (e & (Tt | Et) && 1 === n.length) return i[n[0].identifier] = !0, [n, n];
            var r, s, o = _(t.changedTouches),
                a = [],
                h = this.target;
            if (s = n.filter(function(t) {
                    return p(t.target, h)
                }), e === Tt)
                for (r = 0; r < s.length;) i[s[r].identifier] = !0, r++;
            for (r = 0; r < o.length;) i[o[r].identifier] && a.push(o[r]), e & (Pt | kt) && delete i[o[r].identifier], r++;
            return a.length ? [y(s.concat(a), "identifier", !0), a] : void 0
        }

        function W() {
            C.apply(this, arguments);
            var t = l(this.handler, this);
            this.touch = new B(this.manager, t), this.mouse = new D(this.manager, t), this.primaryTouch = null, this.lastTouches = []
        }

        function V(t, e) {
            t & Tt ? (this.primaryTouch = e.changedPointers[0].identifier, U.call(this, e)) : t & (Pt | kt) && U.call(this, e)
        }

        function U(t) {
            var e = t.changedPointers[0];
            if (e.identifier === this.primaryTouch) {
                var n = {
                    x: e.clientX,
                    y: e.clientY
                };
                this.lastTouches.push(n);
                var i = this.lastTouches,
                    r = function() {
                        var t = i.indexOf(n);
                        t > -1 && i.splice(t, 1)
                    };
                setTimeout(r, Jt)
            }
        }

        function Y(t) {
            for (var e = t.srcEvent.clientX, n = t.srcEvent.clientY, i = 0; i < this.lastTouches.length; i++) {
                var r = this.lastTouches[i],
                    s = Math.abs(e - r.x),
                    o = Math.abs(n - r.y);
                if (s <= Qt && o <= Qt) return !0
            }
            return !1
        }

        function X(t, e) {
            this.manager = t, this.set(e)
        }

        function Z(t) {
            if (g(t, ie)) return ie;
            var e = g(t, re),
                n = g(t, se);
            return e && n ? ie : e || n ? e ? re : se : g(t, ne) ? ne : ee
        }

        function G(t) {
            this.options = ut({}, this.defaults, t || {}), this.id = x(), this.manager = null, this.options.enable = c(this.options.enable, !0), this.state = ae, this.simultaneous = {}, this.requireFail = []
        }

        function $(t) {
            return t & de ? "cancel" : t & ue ? "end" : t & le ? "move" : t & he ? "start" : ""
        }

        function J(t) {
            return t == Ot ? "down" : t == Mt ? "up" : t == zt ? "left" : t == It ? "right" : ""
        }

        function Q(t, e) {
            var n = e.manager;
            return n ? n.get(t) : t
        }

        function K() {
            G.apply(this, arguments)
        }

        function tt() {
            K.apply(this, arguments), this.pX = null, this.pY = null
        }

        function et() {
            K.apply(this, arguments)
        }

        function nt() {
            G.apply(this, arguments), this._timer = null, this._input = null
        }

        function it() {
            K.apply(this, arguments)
        }

        function rt() {
            K.apply(this, arguments)
        }

        function st() {
            G.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
        }

        function ot(t, e) {
            return e = e || {}, e.recognizers = c(e.recognizers, ot.defaults.preset), new at(t, e)
        }

        function at(t, e) {
            this.options = ut({}, ot.defaults, e || {}), this.options.inputTarget = this.options.inputTarget || t, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = t, this.input = S(this), this.touchAction = new X(this, this.options.touchAction), ht(this, !0), o(this.options.recognizers, function(t) {
                var e = this.add(new t[0](t[1]));
                t[2] && e.recognizeWith(t[2]), t[3] && e.requireFailure(t[3])
            }, this)
        }

        function ht(t, e) {
            var n = t.element;
            if (n.style) {
                var i;
                o(t.options.cssProps, function(r, s) {
                    i = w(n.style, s), e ? (t.oldCssProps[i] = n.style[i], n.style[i] = r) : n.style[i] = t.oldCssProps[i] || ""
                }), e || (t.oldCssProps = {})
            }
        }

        function lt(t, n) {
            var i = e.createEvent("Event");
            i.initEvent(t, !0, !0), i.gesture = n, n.target.dispatchEvent(i)
        }
        var ut, ct = ["", "webkit", "Moz", "MS", "ms", "o"],
            dt = e.createElement("div"),
            ft = "function",
            pt = Math.round,
            gt = Math.abs,
            mt = Date.now;
        ut = "function" != typeof Object.assign ? function(t) {
            if (t === i || null === t) throw new TypeError("Cannot convert undefined or null to object");
            for (var e = Object(t), n = 1; n < arguments.length; n++) {
                var r = arguments[n];
                if (r !== i && null !== r)
                    for (var s in r) r.hasOwnProperty(s) && (e[s] = r[s])
            }
            return e
        } : Object.assign;
        var vt = a(function(t, e, n) {
                for (var r = Object.keys(e), s = 0; s < r.length;)(!n || n && t[r[s]] === i) && (t[r[s]] = e[r[s]]), s++;
                return t
            }, "extend", "Use `assign`."),
            _t = a(function(t, e) {
                return vt(t, e, !0)
            }, "merge", "Use `assign`."),
            yt = 1,
            wt = /mobile|tablet|ip(ad|hone|od)|android/i,
            xt = "ontouchstart" in t,
            bt = w(t, "PointerEvent") !== i,
            Ct = xt && wt.test(navigator.userAgent),
            St = 25,
            Tt = 1,
            Et = 2,
            Pt = 4,
            kt = 8,
            At = 1,
            zt = 2,
            It = 4,
            Mt = 8,
            Ot = 16,
            Lt = zt | It,
            Nt = Mt | Ot,
            Ft = Lt | Nt,
            Dt = ["x", "y"],
            Rt = ["clientX", "clientY"];
        C.prototype = {
            handler: function() {},
            init: function() {
                this.evEl && d(this.element, this.evEl, this.domHandler), this.evTarget && d(this.target, this.evTarget, this.domHandler), this.evWin && d(b(this.element), this.evWin, this.domHandler)
            },
            destroy: function() {
                this.evEl && f(this.element, this.evEl, this.domHandler), this.evTarget && f(this.target, this.evTarget, this.domHandler), this.evWin && f(b(this.element), this.evWin, this.domHandler)
            }
        };
        var Ht = {
                mousedown: Tt,
                mousemove: Et,
                mouseup: Pt
            },
            qt = "mousedown",
            Bt = "mousemove mouseup";
        h(D, C, {
            handler: function(t) {
                var e = Ht[t.type];
                e & Tt && 0 === t.button && (this.pressed = !0), e & Et && 1 !== t.which && (e = Pt), this.pressed && (e & Pt && (this.pressed = !1), this.callback(this.manager, e, {
                    pointers: [t],
                    changedPointers: [t],
                    pointerType: "mouse",
                    srcEvent: t
                }))
            }
        });
        var jt = {
                pointerdown: Tt,
                pointermove: Et,
                pointerup: Pt,
                pointercancel: kt,
                pointerout: kt
            },
            Wt = {
                2: "touch",
                3: "pen",
                4: "mouse",
                5: "kinect"
            },
            Vt = "pointerdown",
            Ut = "pointermove pointerup pointercancel";
        t.MSPointerEvent && !t.PointerEvent && (Vt = "MSPointerDown", Ut = "MSPointerMove MSPointerUp MSPointerCancel"), h(R, C, {
            handler: function(t) {
                var e = this.store,
                    n = !1,
                    i = t.type.toLowerCase().replace("ms", ""),
                    r = jt[i],
                    s = Wt[t.pointerType] || t.pointerType,
                    o = "touch" == s,
                    a = v(e, t.pointerId, "pointerId");
                r & Tt && (0 === t.button || o) ? a < 0 && (e.push(t), a = e.length - 1) : r & (Pt | kt) && (n = !0), a < 0 || (e[a] = t, this.callback(this.manager, r, {
                    pointers: e,
                    changedPointers: [t],
                    pointerType: s,
                    srcEvent: t
                }), n && e.splice(a, 1))
            }
        });
        var Yt = {
                touchstart: Tt,
                touchmove: Et,
                touchend: Pt,
                touchcancel: kt
            },
            Xt = "touchstart",
            Zt = "touchstart touchmove touchend touchcancel";
        h(H, C, {
            handler: function(t) {
                var e = Yt[t.type];
                if (e === Tt && (this.started = !0), this.started) {
                    var n = q.call(this, t, e);
                    e & (Pt | kt) && n[0].length - n[1].length == 0 && (this.started = !1), this.callback(this.manager, e, {
                        pointers: n[0],
                        changedPointers: n[1],
                        pointerType: "touch",
                        srcEvent: t
                    })
                }
            }
        });
        var Gt = {
                touchstart: Tt,
                touchmove: Et,
                touchend: Pt,
                touchcancel: kt
            },
            $t = "touchstart touchmove touchend touchcancel";
        h(B, C, {
            handler: function(t) {
                var e = Gt[t.type],
                    n = j.call(this, t, e);
                n && this.callback(this.manager, e, {
                    pointers: n[0],
                    changedPointers: n[1],
                    pointerType: "touch",
                    srcEvent: t
                })
            }
        });
        var Jt = 2500,
            Qt = 25;
        h(W, C, {
            handler: function(t, e, n) {
                var i = "touch" == n.pointerType,
                    r = "mouse" == n.pointerType;
                if (!(r && n.sourceCapabilities && n.sourceCapabilities.firesTouchEvents)) {
                    if (i) V.call(this, e, n);
                    else if (r && Y.call(this, n)) return;
                    this.callback(t, e, n)
                }
            },
            destroy: function() {
                this.touch.destroy(), this.mouse.destroy()
            }
        });
        var Kt = w(dt.style, "touchAction"),
            te = Kt !== i,
            ee = "auto",
            ne = "manipulation",
            ie = "none",
            re = "pan-x",
            se = "pan-y",
            oe = function() {
                if (!te) return !1;
                var e = {},
                    n = t.CSS && t.CSS.supports;
                return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(i) {
                    e[i] = !n || t.CSS.supports("touch-action", i)
                }), e
            }();
        X.prototype = {
            set: function(t) {
                "compute" == t && (t = this.compute()), te && this.manager.element.style && oe[t] && (this.manager.element.style[Kt] = t), this.actions = t.toLowerCase().trim()
            },
            update: function() {
                this.set(this.manager.options.touchAction)
            },
            compute: function() {
                var t = [];
                return o(this.manager.recognizers, function(e) {
                    u(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
                }), Z(t.join(" "))
            },
            preventDefaults: function(t) {
                var e = t.srcEvent,
                    n = t.offsetDirection;
                if (this.manager.session.prevented) return void e.preventDefault();
                var i = this.actions,
                    r = g(i, ie) && !oe[ie],
                    s = g(i, se) && !oe[se],
                    o = g(i, re) && !oe[re];
                if (r) {
                    var a = 1 === t.pointers.length,
                        h = t.distance < 2,
                        l = t.deltaTime < 250;
                    if (a && h && l) return
                }
                return o && s ? void 0 : r || s && n & Lt || o && n & Nt ? this.preventSrc(e) : void 0
            },
            preventSrc: function(t) {
                this.manager.session.prevented = !0, t.preventDefault()
            }
        };
        var ae = 1,
            he = 2,
            le = 4,
            ue = 8,
            ce = ue,
            de = 16;
        G.prototype = {
            defaults: {},
            set: function(t) {
                return ut(this.options, t), this.manager && this.manager.touchAction.update(), this
            },
            recognizeWith: function(t) {
                if (s(t, "recognizeWith", this)) return this;
                var e = this.simultaneous;
                return t = Q(t, this), e[t.id] || (e[t.id] = t, t.recognizeWith(this)), this
            },
            dropRecognizeWith: function(t) {
                return s(t, "dropRecognizeWith", this) ? this : (t = Q(t, this), delete this.simultaneous[t.id], this)
            },
            requireFailure: function(t) {
                if (s(t, "requireFailure", this)) return this;
                var e = this.requireFail;
                return t = Q(t, this), -1 === v(e, t) && (e.push(t), t.requireFailure(this)), this
            },
            dropRequireFailure: function(t) {
                if (s(t, "dropRequireFailure", this)) return this;
                t = Q(t, this);
                var e = v(this.requireFail, t);
                return e > -1 && this.requireFail.splice(e, 1), this
            },
            hasRequireFailures: function() {
                return this.requireFail.length > 0
            },
            canRecognizeWith: function(t) {
                return !!this.simultaneous[t.id]
            },
            emit: function(t) {
                function e(e) {
                    n.manager.emit(e, t)
                }
                var n = this,
                    i = this.state;
                i < ue && e(n.options.event + $(i)), e(n.options.event), t.additionalEvent && e(t.additionalEvent), i >= ue && e(n.options.event + $(i))
            },
            tryEmit: function(t) {
                if (this.canEmit()) return this.emit(t);
                this.state = 32
            },
            canEmit: function() {
                for (var t = 0; t < this.requireFail.length;) {
                    if (!(this.requireFail[t].state & (32 | ae))) return !1;
                    t++
                }
                return !0
            },
            recognize: function(t) {
                var e = ut({}, t);
                if (!u(this.options.enable, [this, e])) return this.reset(), void(this.state = 32);
                this.state & (ce | de | 32) && (this.state = ae), this.state = this.process(e), this.state & (he | le | ue | de) && this.tryEmit(e)
            },
            process: function(t) {},
            getTouchAction: function() {},
            reset: function() {}
        }, h(K, G, {
            defaults: {
                pointers: 1
            },
            attrTest: function(t) {
                var e = this.options.pointers;
                return 0 === e || t.pointers.length === e
            },
            process: function(t) {
                var e = this.state,
                    n = t.eventType,
                    i = e & (he | le),
                    r = this.attrTest(t);
                return i && (n & kt || !r) ? e | de : i || r ? n & Pt ? e | ue : e & he ? e | le : he : 32
            }
        }), h(tt, K, {
            defaults: {
                event: "pan",
                threshold: 10,
                pointers: 1,
                direction: Ft
            },
            getTouchAction: function() {
                var t = this.options.direction,
                    e = [];
                return t & Lt && e.push(se), t & Nt && e.push(re), e
            },
            directionTest: function(t) {
                var e = this.options,
                    n = !0,
                    i = t.distance,
                    r = t.direction,
                    s = t.deltaX,
                    o = t.deltaY;
                return r & e.direction || (e.direction & Lt ? (r = 0 === s ? At : s < 0 ? zt : It, n = s != this.pX, i = Math.abs(t.deltaX)) : (r = 0 === o ? At : o < 0 ? Mt : Ot, n = o != this.pY, i = Math.abs(t.deltaY))), t.direction = r, n && i > e.threshold && r & e.direction
            },
            attrTest: function(t) {
                return K.prototype.attrTest.call(this, t) && (this.state & he || !(this.state & he) && this.directionTest(t))
            },
            emit: function(t) {
                this.pX = t.deltaX, this.pY = t.deltaY;
                var e = J(t.direction);
                e && (t.additionalEvent = this.options.event + e), this._super.emit.call(this, t)
            }
        }), h(et, K, {
            defaults: {
                event: "pinch",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [ie]
            },
            attrTest: function(t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this.options.threshold || this.state & he)
            },
            emit: function(t) {
                if (1 !== t.scale) {
                    var e = t.scale < 1 ? "in" : "out";
                    t.additionalEvent = this.options.event + e
                }
                this._super.emit.call(this, t)
            }
        }), h(nt, G, {
            defaults: {
                event: "press",
                pointers: 1,
                time: 251,
                threshold: 9
            },
            getTouchAction: function() {
                return [ee]
            },
            process: function(t) {
                var e = this.options,
                    n = t.pointers.length === e.pointers,
                    i = t.distance < e.threshold,
                    s = t.deltaTime > e.time;
                if (this._input = t, !i || !n || t.eventType & (Pt | kt) && !s) this.reset();
                else if (t.eventType & Tt) this.reset(), this._timer = r(function() {
                    this.state = ce, this.tryEmit()
                }, e.time, this);
                else if (t.eventType & Pt) return ce;
                return 32
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function(t) {
                this.state === ce && (t && t.eventType & Pt ? this.manager.emit(this.options.event + "up", t) : (this._input.timeStamp = mt(), this.manager.emit(this.options.event, this._input)))
            }
        }), h(it, K, {
            defaults: {
                event: "rotate",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [ie]
            },
            attrTest: function(t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this.options.threshold || this.state & he)
            }
        }), h(rt, K, {
            defaults: {
                event: "swipe",
                threshold: 10,
                velocity: .3,
                direction: Lt | Nt,
                pointers: 1
            },
            getTouchAction: function() {
                return tt.prototype.getTouchAction.call(this)
            },
            attrTest: function(t) {
                var e, n = this.options.direction;
                return n & (Lt | Nt) ? e = t.overallVelocity : n & Lt ? e = t.overallVelocityX : n & Nt && (e = t.overallVelocityY), this._super.attrTest.call(this, t) && n & t.offsetDirection && t.distance > this.options.threshold && t.maxPointers == this.options.pointers && gt(e) > this.options.velocity && t.eventType & Pt
            },
            emit: function(t) {
                var e = J(t.offsetDirection);
                e && this.manager.emit(this.options.event + e, t), this.manager.emit(this.options.event, t)
            }
        }), h(st, G, {
            defaults: {
                event: "tap",
                pointers: 1,
                taps: 1,
                interval: 300,
                time: 250,
                threshold: 9,
                posThreshold: 10
            },
            getTouchAction: function() {
                return [ne]
            },
            process: function(t) {
                var e = this.options,
                    n = t.pointers.length === e.pointers,
                    i = t.distance < e.threshold,
                    s = t.deltaTime < e.time;
                if (this.reset(), t.eventType & Tt && 0 === this.count) return this.failTimeout();
                if (i && s && n) {
                    if (t.eventType != Pt) return this.failTimeout();
                    var o = !this.pTime || t.timeStamp - this.pTime < e.interval,
                        a = !this.pCenter || O(this.pCenter, t.center) < e.posThreshold;
                    this.pTime = t.timeStamp, this.pCenter = t.center, a && o ? this.count += 1 : this.count = 1, this._input = t;
                    if (0 === this.count % e.taps) return this.hasRequireFailures() ? (this._timer = r(function() {
                        this.state = ce, this.tryEmit()
                    }, e.interval, this), he) : ce
                }
                return 32
            },
            failTimeout: function() {
                return this._timer = r(function() {
                    this.state = 32
                }, this.options.interval, this), 32
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function() {
                this.state == ce && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
            }
        }), ot.VERSION = "2.0.7", ot.defaults = {
            domEvents: !1,
            touchAction: "compute",
            enable: !0,
            inputTarget: null,
            inputClass: null,
            preset: [
                [it, {
                    enable: !1
                }],
                [et, {
                        enable: !1
                    },
                    ["rotate"]
                ],
                [rt, {
                    direction: Lt
                }],
                [tt, {
                        direction: Lt
                    },
                    ["swipe"]
                ],
                [st],
                [st, {
                        event: "doubletap",
                        taps: 2
                    },
                    ["tap"]
                ],
                [nt]
            ],
            cssProps: {
                userSelect: "none",
                touchSelect: "none",
                touchCallout: "none",
                contentZooming: "none",
                userDrag: "none",
                tapHighlightColor: "rgba(0,0,0,0)"
            }
        };
        at.prototype = {
            set: function(t) {
                return ut(this.options, t), t.touchAction && this.touchAction.update(), t.inputTarget && (this.input.destroy(), this.input.target = t.inputTarget, this.input.init()), this
            },
            stop: function(t) {
                this.session.stopped = t ? 2 : 1
            },
            recognize: function(t) {
                var e = this.session;
                if (!e.stopped) {
                    this.touchAction.preventDefaults(t);
                    var n, i = this.recognizers,
                        r = e.curRecognizer;
                    (!r || r && r.state & ce) && (r = e.curRecognizer = null);
                    for (var s = 0; s < i.length;) n = i[s], 2 === e.stopped || r && n != r && !n.canRecognizeWith(r) ? n.reset() : n.recognize(t), !r && n.state & (he | le | ue) && (r = e.curRecognizer = n), s++
                }
            },
            get: function(t) {
                if (t instanceof G) return t;
                for (var e = this.recognizers, n = 0; n < e.length; n++)
                    if (e[n].options.event == t) return e[n];
                return null
            },
            add: function(t) {
                if (s(t, "add", this)) return this;
                var e = this.get(t.options.event);
                return e && this.remove(e), this.recognizers.push(t), t.manager = this, this.touchAction.update(), t
            },
            remove: function(t) {
                if (s(t, "remove", this)) return this;
                if (t = this.get(t)) {
                    var e = this.recognizers,
                        n = v(e, t); - 1 !== n && (e.splice(n, 1), this.touchAction.update())
                }
                return this
            },
            on: function(t, e) {
                if (t !== i && e !== i) {
                    var n = this.handlers;
                    return o(m(t), function(t) {
                        n[t] = n[t] || [], n[t].push(e)
                    }), this
                }
            },
            off: function(t, e) {
                if (t !== i) {
                    var n = this.handlers;
                    return o(m(t), function(t) {
                        e ? n[t] && n[t].splice(v(n[t], e), 1) : delete n[t]
                    }), this
                }
            },
            emit: function(t, e) {
                this.options.domEvents && lt(t, e);
                var n = this.handlers[t] && this.handlers[t].slice();
                if (n && n.length) {
                    e.type = t, e.preventDefault = function() {
                        e.srcEvent.preventDefault()
                    };
                    for (var i = 0; i < n.length;) n[i](e), i++
                }
            },
            destroy: function() {
                this.element && ht(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
            }
        }, ut(ot, {
            INPUT_START: Tt,
            INPUT_MOVE: Et,
            INPUT_END: Pt,
            INPUT_CANCEL: kt,
            STATE_POSSIBLE: ae,
            STATE_BEGAN: he,
            STATE_CHANGED: le,
            STATE_ENDED: ue,
            STATE_RECOGNIZED: ce,
            STATE_CANCELLED: de,
            STATE_FAILED: 32,
            DIRECTION_NONE: At,
            DIRECTION_LEFT: zt,
            DIRECTION_RIGHT: It,
            DIRECTION_UP: Mt,
            DIRECTION_DOWN: Ot,
            DIRECTION_HORIZONTAL: Lt,
            DIRECTION_VERTICAL: Nt,
            DIRECTION_ALL: Ft,
            Manager: at,
            Input: C,
            TouchAction: X,
            TouchInput: B,
            MouseInput: D,
            PointerEventInput: R,
            TouchMouseInput: W,
            SingleTouchInput: H,
            Recognizer: G,
            AttrRecognizer: K,
            Tap: st,
            Pan: tt,
            Swipe: rt,
            Pinch: et,
            Rotate: it,
            Press: nt,
            on: d,
            off: f,
            each: o,
            merge: _t,
            extend: vt,
            assign: ut,
            inherit: h,
            bindFn: l,
            prefixed: w
        }), (void 0 !== t ? t : "undefined" != typeof self ? self : {}).Hammer = ot, "function" == typeof define && define.amd ? define(function() {
            return ot
        }) : "undefined" != typeof module && module.exports ? module.exports = ot : t.Hammer = ot
    }(window, document),
    function(t, e) {
        "function" == typeof define && define.amd ? define("jquery-bridget/jquery-bridget", ["jquery"], function(n) {
            return e(t, n)
        }) : "object" == typeof module && module.exports ? module.exports = e(t, require("jquery")) : t.jQueryBridget = e(t, t.jQuery)
    }(window, function(t, e) {
        "use strict";

        function n(n, s, a) {
            function h(t, e, i) {
                var r, s = "$()." + n + '("' + e + '")';
                return t.each(function(t, h) {
                    var l = a.data(h, n);
                    if (!l) return void o(n + " not initialized. Cannot call methods, i.e. " + s);
                    var u = l[e];
                    if (!u || "_" == e.charAt(0)) return void o(s + " is not a valid method");
                    var c = u.apply(l, i);
                    r = void 0 === r ? c : r
                }), void 0 !== r ? r : t
            }

            function l(t, e) {
                t.each(function(t, i) {
                    var r = a.data(i, n);
                    r ? (r.option(e), r._init()) : (r = new s(i, e), a.data(i, n, r))
                })
            }(a = a || e || t.jQuery) && (s.prototype.option || (s.prototype.option = function(t) {
                a.isPlainObject(t) && (this.options = a.extend(!0, this.options, t))
            }), a.fn[n] = function(t) {
                if ("string" == typeof t) {
                    return h(this, t, r.call(arguments, 1))
                }
                return l(this, t), this
            }, i(a))
        }

        function i(t) {
            !t || t && t.bridget || (t.bridget = n)
        }
        var r = Array.prototype.slice,
            s = t.console,
            o = void 0 === s ? function() {} : function(t) {
                s.error(t)
            };
        return i(e || t.jQuery), n
    }),
    function(t, e) {
        "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
    }("undefined" != typeof window ? window : this, function() {
        function t() {}
        var e = t.prototype;
        return e.on = function(t, e) {
            if (t && e) {
                var n = this._events = this._events || {},
                    i = n[t] = n[t] || [];
                return -1 == i.indexOf(e) && i.push(e), this
            }
        }, e.once = function(t, e) {
            if (t && e) {
                this.on(t, e);
                var n = this._onceEvents = this._onceEvents || {};
                return (n[t] = n[t] || {})[e] = !0, this
            }
        }, e.off = function(t, e) {
            var n = this._events && this._events[t];
            if (n && n.length) {
                var i = n.indexOf(e);
                return -1 != i && n.splice(i, 1), this
            }
        }, e.emitEvent = function(t, e) {
            var n = this._events && this._events[t];
            if (n && n.length) {
                n = n.slice(0), e = e || [];
                for (var i = this._onceEvents && this._onceEvents[t], r = 0; r < n.length; r++) {
                    var s = n[r];
                    i && i[s] && (this.off(t, s), delete i[s]), s.apply(this, e)
                }
                return this
            }
        }, e.allOff = function() {
            delete this._events, delete this._onceEvents
        }, t
    }),
    function(t, e) {
        "use strict";
        "function" == typeof define && define.amd ? define("get-size/get-size", [], function() {
            return e()
        }) : "object" == typeof module && module.exports ? module.exports = e() : t.getSize = e()
    }(window, function() {
        "use strict";

        function t(t) {
            var e = parseFloat(t);
            return -1 == t.indexOf("%") && !isNaN(e) && e
        }

        function e() {}

        function n() {
            for (var t = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, e = 0; e < l; e++) {
                t[h[e]] = 0
            }
            return t
        }

        function i(t) {
            var e = getComputedStyle(t);
            return e || a("Style returned " + e + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), e
        }

        function r() {
            if (!u) {
                u = !0;
                var e = document.createElement("div");
                e.style.width = "200px", e.style.padding = "1px 2px 3px 4px", e.style.borderStyle = "solid", e.style.borderWidth = "1px 2px 3px 4px", e.style.boxSizing = "border-box";
                var n = document.body || document.documentElement;
                n.appendChild(e);
                var r = i(e);
                s.isBoxSizeOuter = o = 200 == t(r.width), n.removeChild(e)
            }
        }

        function s(e) {
            if (r(), "string" == typeof e && (e = document.querySelector(e)), e && "object" == typeof e && e.nodeType) {
                var s = i(e);
                if ("none" == s.display) return n();
                var a = {};
                a.width = e.offsetWidth, a.height = e.offsetHeight;
                for (var u = a.isBorderBox = "border-box" == s.boxSizing, c = 0; c < l; c++) {
                    var d = h[c],
                        f = s[d],
                        p = parseFloat(f);
                    a[d] = isNaN(p) ? 0 : p
                }
                var g = a.paddingLeft + a.paddingRight,
                    m = a.paddingTop + a.paddingBottom,
                    v = a.marginLeft + a.marginRight,
                    _ = a.marginTop + a.marginBottom,
                    y = a.borderLeftWidth + a.borderRightWidth,
                    w = a.borderTopWidth + a.borderBottomWidth,
                    x = u && o,
                    b = t(s.width);
                !1 !== b && (a.width = b + (x ? 0 : g + y));
                var C = t(s.height);
                return !1 !== C && (a.height = C + (x ? 0 : m + w)), a.innerWidth = a.width - (g + y), a.innerHeight = a.height - (m + w), a.outerWidth = a.width + v, a.outerHeight = a.height + _, a
            }
        }
        var o, a = "undefined" == typeof console ? e : function(t) {
                console.error(t)
            },
            h = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"],
            l = h.length,
            u = !1;
        return s
    }),
    function(t, e) {
        "use strict";
        "function" == typeof define && define.amd ? define("desandro-matches-selector/matches-selector", e) : "object" == typeof module && module.exports ? module.exports = e() : t.matchesSelector = e()
    }(window, function() {
        "use strict";
        var t = function() {
            var t = window.Element.prototype;
            if (t.matches) return "matches";
            if (t.matchesSelector) return "matchesSelector";
            for (var e = ["webkit", "moz", "ms", "o"], n = 0; n < e.length; n++) {
                var i = e[n],
                    r = i + "MatchesSelector";
                if (t[r]) return r
            }
        }();
        return function(e, n) {
            return e[t](n)
        }
    }),
    function(t, e) {
        "function" == typeof define && define.amd ? define("fizzy-ui-utils/utils", ["desandro-matches-selector/matches-selector"], function(n) {
            return e(t, n)
        }) : "object" == typeof module && module.exports ? module.exports = e(t, require("desandro-matches-selector")) : t.fizzyUIUtils = e(t, t.matchesSelector)
    }(window, function(t, e) {
        var n = {};
        n.extend = function(t, e) {
            for (var n in e) t[n] = e[n];
            return t
        }, n.modulo = function(t, e) {
            return (t % e + e) % e
        }, n.makeArray = function(t) {
            var e = [];
            if (Array.isArray(t)) e = t;
            else if (t && "object" == typeof t && "number" == typeof t.length)
                for (var n = 0; n < t.length; n++) e.push(t[n]);
            else e.push(t);
            return e
        }, n.removeFrom = function(t, e) {
            var n = t.indexOf(e); - 1 != n && t.splice(n, 1)
        }, n.getParent = function(t, n) {
            for (; t.parentNode && t != document.body;)
                if (t = t.parentNode, e(t, n)) return t
        }, n.getQueryElement = function(t) {
            return "string" == typeof t ? document.querySelector(t) : t
        }, n.handleEvent = function(t) {
            var e = "on" + t.type;
            this[e] && this[e](t)
        }, n.filterFindElements = function(t, i) {
            t = n.makeArray(t);
            var r = [];
            return t.forEach(function(t) {
                if (t instanceof HTMLElement) {
                    if (!i) return void r.push(t);
                    e(t, i) && r.push(t);
                    for (var n = t.querySelectorAll(i), s = 0; s < n.length; s++) r.push(n[s])
                }
            }), r
        }, n.debounceMethod = function(t, e, n) {
            var i = t.prototype[e],
                r = e + "Timeout";
            t.prototype[e] = function() {
                var t = this[r];
                t && clearTimeout(t);
                var e = arguments,
                    s = this;
                this[r] = setTimeout(function() {
                    i.apply(s, e), delete s[r]
                }, n || 100)
            }
        }, n.docReady = function(t) {
            var e = document.readyState;
            "complete" == e || "interactive" == e ? setTimeout(t) : document.addEventListener("DOMContentLoaded", t)
        }, n.toDashed = function(t) {
            return t.replace(/(.)([A-Z])/g, function(t, e, n) {
                return e + "-" + n
            }).toLowerCase()
        };
        var i = t.console;
        return n.htmlInit = function(e, r) {
            n.docReady(function() {
                var s = n.toDashed(r),
                    o = "data-" + s,
                    a = document.querySelectorAll("[" + o + "]"),
                    h = document.querySelectorAll(".js-" + s),
                    l = n.makeArray(a).concat(n.makeArray(h)),
                    u = o + "-options",
                    c = t.jQuery;
                l.forEach(function(t) {
                    var n, s = t.getAttribute(o) || t.getAttribute(u);
                    try {
                        n = s && JSON.parse(s)
                    } catch (e) {
                        return void(i && i.error("Error parsing " + o + " on " + t.className + ": " + e))
                    }
                    var a = new e(t, n);
                    c && c.data(t, r, a)
                })
            })
        }, n
    }),
    function(t, e) {
        "function" == typeof define && define.amd ? define("outlayer/item", ["ev-emitter/ev-emitter", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("ev-emitter"), require("get-size")) : (t.Outlayer = {}, t.Outlayer.Item = e(t.EvEmitter, t.getSize))
    }(window, function(t, e) {
        "use strict";

        function n(t) {
            for (var e in t) return !1;
            return null, !0
        }

        function i(t, e) {
            t && (this.element = t, this.layout = e, this.position = {
                x: 0,
                y: 0
            }, this._create())
        }
        var r = document.documentElement.style,
            s = "string" == typeof r.transition ? "transition" : "WebkitTransition",
            o = "string" == typeof r.transform ? "transform" : "WebkitTransform",
            a = {
                WebkitTransition: "webkitTransitionEnd",
                transition: "transitionend"
            }[s],
            h = {
                transform: o,
                transition: s,
                transitionDuration: s + "Duration",
                transitionProperty: s + "Property",
                transitionDelay: s + "Delay"
            },
            l = i.prototype = Object.create(t.prototype);
        l.constructor = i, l._create = function() {
            this._transn = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            }, this.css({
                position: "absolute"
            })
        }, l.handleEvent = function(t) {
            var e = "on" + t.type;
            this[e] && this[e](t)
        }, l.getSize = function() {
            this.size = e(this.element)
        }, l.css = function(t) {
            var e = this.element.style;
            for (var n in t) {
                e[h[n] || n] = t[n]
            }
        }, l.getPosition = function() {
            var t = getComputedStyle(this.element),
                e = this.layout._getOption("originLeft"),
                n = this.layout._getOption("originTop"),
                i = t[e ? "left" : "right"],
                r = t[n ? "top" : "bottom"],
                s = this.layout.size,
                o = -1 != i.indexOf("%") ? parseFloat(i) / 100 * s.width : parseInt(i, 10),
                a = -1 != r.indexOf("%") ? parseFloat(r) / 100 * s.height : parseInt(r, 10);
            o = isNaN(o) ? 0 : o, a = isNaN(a) ? 0 : a, o -= e ? s.paddingLeft : s.paddingRight, a -= n ? s.paddingTop : s.paddingBottom, this.position.x = o, this.position.y = a
        }, l.layoutPosition = function() {
            var t = this.layout.size,
                e = {},
                n = this.layout._getOption("originLeft"),
                i = this.layout._getOption("originTop"),
                r = n ? "paddingLeft" : "paddingRight",
                s = n ? "left" : "right",
                o = n ? "right" : "left",
                a = this.position.x + t[r];
            e[s] = this.getXValue(a), e[o] = "";
            var h = i ? "paddingTop" : "paddingBottom",
                l = i ? "top" : "bottom",
                u = i ? "bottom" : "top",
                c = this.position.y + t[h];
            e[l] = this.getYValue(c), e[u] = "", this.css(e), this.emitEvent("layout", [this])
        }, l.getXValue = function(t) {
            var e = this.layout._getOption("horizontal");
            return this.layout.options.percentPosition && !e ? t / this.layout.size.width * 100 + "%" : t + "px"
        }, l.getYValue = function(t) {
            var e = this.layout._getOption("horizontal");
            return this.layout.options.percentPosition && e ? t / this.layout.size.height * 100 + "%" : t + "px"
        }, l._transitionTo = function(t, e) {
            this.getPosition();
            var n = this.position.x,
                i = this.position.y,
                r = parseInt(t, 10),
                s = parseInt(e, 10),
                o = r === this.position.x && s === this.position.y;
            if (this.setPosition(t, e), o && !this.isTransitioning) return void this.layoutPosition();
            var a = t - n,
                h = e - i,
                l = {};
            l.transform = this.getTranslate(a, h), this.transition({
                to: l,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: !0
            })
        }, l.getTranslate = function(t, e) {
            var n = this.layout._getOption("originLeft"),
                i = this.layout._getOption("originTop");
            return t = n ? t : -t, e = i ? e : -e, "translate3d(" + t + "px, " + e + "px, 0)"
        }, l.goTo = function(t, e) {
            this.setPosition(t, e), this.layoutPosition()
        }, l.moveTo = l._transitionTo, l.setPosition = function(t, e) {
            this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
        }, l._nonTransition = function(t) {
            this.css(t.to), t.isCleaning && this._removeStyles(t.to);
            for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this)
        }, l.transition = function(t) {
            if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(t);
            var e = this._transn;
            for (var n in t.onTransitionEnd) e.onEnd[n] = t.onTransitionEnd[n];
            for (n in t.to) e.ingProperties[n] = !0, t.isCleaning && (e.clean[n] = !0);
            if (t.from) {
                this.css(t.from);
                this.element.offsetHeight;
                null
            }
            this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0
        };
        var u = "opacity," + function(t) {
            return t.replace(/([A-Z])/g, function(t) {
                return "-" + t.toLowerCase()
            })
        }(o);
        l.enableTransition = function() {
            if (!this.isTransitioning) {
                var t = this.layout.options.transitionDuration;
                t = "number" == typeof t ? t + "ms" : t, this.css({
                    transitionProperty: u,
                    transitionDuration: t,
                    transitionDelay: this.staggerDelay || 0
                }), this.element.addEventListener(a, this, !1)
            }
        }, l.onwebkitTransitionEnd = function(t) {
            this.ontransitionend(t)
        }, l.onotransitionend = function(t) {
            this.ontransitionend(t)
        };
        var c = {
            "-webkit-transform": "transform"
        };
        l.ontransitionend = function(t) {
            if (t.target === this.element) {
                var e = this._transn,
                    i = c[t.propertyName] || t.propertyName;
                if (delete e.ingProperties[i], n(e.ingProperties) && this.disableTransition(), i in e.clean && (this.element.style[t.propertyName] = "", delete e.clean[i]), i in e.onEnd) {
                    e.onEnd[i].call(this), delete e.onEnd[i]
                }
                this.emitEvent("transitionEnd", [this])
            }
        }, l.disableTransition = function() {
            this.removeTransitionStyles(), this.element.removeEventListener(a, this, !1), this.isTransitioning = !1
        }, l._removeStyles = function(t) {
            var e = {};
            for (var n in t) e[n] = "";
            this.css(e)
        };
        var d = {
            transitionProperty: "",
            transitionDuration: "",
            transitionDelay: ""
        };
        return l.removeTransitionStyles = function() {
            this.css(d)
        }, l.stagger = function(t) {
            t = isNaN(t) ? 0 : t, this.staggerDelay = t + "ms"
        }, l.removeElem = function() {
            this.element.parentNode.removeChild(this.element), this.css({
                display: ""
            }), this.emitEvent("remove", [this])
        }, l.remove = function() {
            if (!s || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
            this.once("transitionEnd", function() {
                this.removeElem()
            }), this.hide()
        }, l.reveal = function() {
            delete this.isHidden, this.css({
                display: ""
            });
            var t = this.layout.options,
                e = {};
            e[this.getHideRevealTransitionEndProperty("visibleStyle")] = this.onRevealTransitionEnd, this.transition({
                from: t.hiddenStyle,
                to: t.visibleStyle,
                isCleaning: !0,
                onTransitionEnd: e
            })
        }, l.onRevealTransitionEnd = function() {
            this.isHidden || this.emitEvent("reveal")
        }, l.getHideRevealTransitionEndProperty = function(t) {
            var e = this.layout.options[t];
            if (e.opacity) return "opacity";
            for (var n in e) return n
        }, l.hide = function() {
            this.isHidden = !0, this.css({
                display: ""
            });
            var t = this.layout.options,
                e = {};
            e[this.getHideRevealTransitionEndProperty("hiddenStyle")] = this.onHideTransitionEnd, this.transition({
                from: t.visibleStyle,
                to: t.hiddenStyle,
                isCleaning: !0,
                onTransitionEnd: e
            })
        }, l.onHideTransitionEnd = function() {
            this.isHidden && (this.css({
                display: "none"
            }), this.emitEvent("hide"))
        }, l.destroy = function() {
            this.css({
                position: "",
                left: "",
                right: "",
                top: "",
                bottom: "",
                transition: "",
                transform: ""
            })
        }, i
    }),
    function(t, e) {
        "use strict";
        "function" == typeof define && define.amd ? define("outlayer/outlayer", ["ev-emitter/ev-emitter", "get-size/get-size", "fizzy-ui-utils/utils", "./item"], function(n, i, r, s) {
            return e(t, n, i, r, s)
        }) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter"), require("get-size"), require("fizzy-ui-utils"), require("./item")) : t.Outlayer = e(t, t.EvEmitter, t.getSize, t.fizzyUIUtils, t.Outlayer.Item)
    }(window, function(t, e, n, i, r) {
        "use strict";

        function s(t, e) {
            var n = i.getQueryElement(t);
            if (!n) return void(h && h.error("Bad element for " + this.constructor.namespace + ": " + (n || t)));
            this.element = n, l && (this.$element = l(this.element)), this.options = i.extend({}, this.constructor.defaults), this.option(e);
            var r = ++c;
            this.element.outlayerGUID = r, d[r] = this, this._create(), this._getOption("initLayout") && this.layout()
        }

        function o(t) {
            function e() {
                t.apply(this, arguments)
            }
            return e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e
        }

        function a(t) {
            if ("number" == typeof t) return t;
            var e = t.match(/(^\d*\.?\d*)(\w*)/),
                n = e && e[1],
                i = e && e[2];
            return n.length ? (n = parseFloat(n)) * (p[i] || 1) : 0
        }
        var h = t.console,
            l = t.jQuery,
            u = function() {},
            c = 0,
            d = {};
        s.namespace = "outlayer", s.Item = r, s.defaults = {
            containerStyle: {
                position: "relative"
            },
            initLayout: !0,
            originLeft: !0,
            originTop: !0,
            resize: !0,
            resizeContainer: !0,
            transitionDuration: "0.4s",
            hiddenStyle: {
                opacity: 0,
                transform: "scale(0.001)"
            },
            visibleStyle: {
                opacity: 1,
                transform: "scale(1)"
            }
        };
        var f = s.prototype;
        i.extend(f, e.prototype), f.option = function(t) {
            i.extend(this.options, t)
        }, f._getOption = function(t) {
            var e = this.constructor.compatOptions[t];
            return e && void 0 !== this.options[e] ? this.options[e] : this.options[t]
        }, s.compatOptions = {
            initLayout: "isInitLayout",
            horizontal: "isHorizontal",
            layoutInstant: "isLayoutInstant",
            originLeft: "isOriginLeft",
            originTop: "isOriginTop",
            resize: "isResizeBound",
            resizeContainer: "isResizingContainer"
        }, f._create = function() {
            this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), i.extend(this.element.style, this.options.containerStyle), this._getOption("resize") && this.bindResize()
        }, f.reloadItems = function() {
            this.items = this._itemize(this.element.children)
        }, f._itemize = function(t) {
            for (var e = this._filterFindItemElements(t), n = this.constructor.Item, i = [], r = 0; r < e.length; r++) {
                var s = e[r],
                    o = new n(s, this);
                i.push(o)
            }
            return i
        }, f._filterFindItemElements = function(t) {
            return i.filterFindElements(t, this.options.itemSelector)
        }, f.getItemElements = function() {
            return this.items.map(function(t) {
                return t.element
            })
        }, f.layout = function() {
            this._resetLayout(), this._manageStamps();
            var t = this._getOption("layoutInstant"),
                e = void 0 !== t ? t : !this._isLayoutInited;
            this.layoutItems(this.items, e), this._isLayoutInited = !0
        }, f._init = f.layout, f._resetLayout = function() {
            this.getSize()
        }, f.getSize = function() {
            this.size = n(this.element)
        }, f._getMeasurement = function(t, e) {
            var i, r = this.options[t];
            r ? ("string" == typeof r ? i = this.element.querySelector(r) : r instanceof HTMLElement && (i = r), this[t] = i ? n(i)[e] : r) : this[t] = 0
        }, f.layoutItems = function(t, e) {
            t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
        }, f._getItemsForLayout = function(t) {
            return t.filter(function(t) {
                return !t.isIgnored
            })
        }, f._layoutItems = function(t, e) {
            if (this._emitCompleteOnItems("layout", t), t && t.length) {
                var n = [];
                t.forEach(function(t) {
                    var i = this._getItemLayoutPosition(t);
                    i.item = t, i.isInstant = e || t.isLayoutInstant, n.push(i)
                }, this), this._processLayoutQueue(n)
            }
        }, f._getItemLayoutPosition = function() {
            return {
                x: 0,
                y: 0
            }
        }, f._processLayoutQueue = function(t) {
            this.updateStagger(), t.forEach(function(t, e) {
                this._positionItem(t.item, t.x, t.y, t.isInstant, e)
            }, this)
        }, f.updateStagger = function() {
            var t = this.options.stagger;
            return null === t || void 0 === t ? void(this.stagger = 0) : (this.stagger = a(t), this.stagger)
        }, f._positionItem = function(t, e, n, i, r) {
            i ? t.goTo(e, n) : (t.stagger(r * this.stagger), t.moveTo(e, n))
        }, f._postLayout = function() {
            this.resizeContainer()
        }, f.resizeContainer = function() {
            if (this._getOption("resizeContainer")) {
                var t = this._getContainerSize();
                t && (this._setContainerMeasure(t.width, !0), this._setContainerMeasure(t.height, !1))
            }
        }, f._getContainerSize = u, f._setContainerMeasure = function(t, e) {
            if (void 0 !== t) {
                var n = this.size;
                n.isBorderBox && (t += e ? n.paddingLeft + n.paddingRight + n.borderLeftWidth + n.borderRightWidth : n.paddingBottom + n.paddingTop + n.borderTopWidth + n.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
            }
        }, f._emitCompleteOnItems = function(t, e) {
            function n() {
                r.dispatchEvent(t + "Complete", null, [e])
            }

            function i() {
                ++o == s && n()
            }
            var r = this,
                s = e.length;
            if (!e || !s) return void n();
            var o = 0;
            e.forEach(function(e) {
                e.once(t, i)
            })
        }, f.dispatchEvent = function(t, e, n) {
            var i = e ? [e].concat(n) : n;
            if (this.emitEvent(t, i), l)
                if (this.$element = this.$element || l(this.element), e) {
                    var r = l.Event(e);
                    r.type = t, this.$element.trigger(r, n)
                } else this.$element.trigger(t, n)
        }, f.ignore = function(t) {
            var e = this.getItem(t);
            e && (e.isIgnored = !0)
        }, f.unignore = function(t) {
            var e = this.getItem(t);
            e && delete e.isIgnored
        }, f.stamp = function(t) {
            (t = this._find(t)) && (this.stamps = this.stamps.concat(t), t.forEach(this.ignore, this))
        }, f.unstamp = function(t) {
            (t = this._find(t)) && t.forEach(function(t) {
                i.removeFrom(this.stamps, t), this.unignore(t)
            }, this)
        }, f._find = function(t) {
            if (t) return "string" == typeof t && (t = this.element.querySelectorAll(t)), t = i.makeArray(t)
        }, f._manageStamps = function() {
            this.stamps && this.stamps.length && (this._getBoundingRect(), this.stamps.forEach(this._manageStamp, this))
        }, f._getBoundingRect = function() {
            var t = this.element.getBoundingClientRect(),
                e = this.size;
            this._boundingRect = {
                left: t.left + e.paddingLeft + e.borderLeftWidth,
                top: t.top + e.paddingTop + e.borderTopWidth,
                right: t.right - (e.paddingRight + e.borderRightWidth),
                bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
            }
        }, f._manageStamp = u, f._getElementOffset = function(t) {
            var e = t.getBoundingClientRect(),
                i = this._boundingRect,
                r = n(t);
            return {
                left: e.left - i.left - r.marginLeft,
                top: e.top - i.top - r.marginTop,
                right: i.right - e.right - r.marginRight,
                bottom: i.bottom - e.bottom - r.marginBottom
            }
        }, f.handleEvent = i.handleEvent, f.bindResize = function() {
            t.addEventListener("resize", this), this.isResizeBound = !0
        }, f.unbindResize = function() {
            t.removeEventListener("resize", this), this.isResizeBound = !1
        }, f.onresize = function() {
            this.resize()
        }, i.debounceMethod(s, "onresize", 100), f.resize = function() {
            this.isResizeBound && this.needsResizeLayout() && this.layout()
        }, f.needsResizeLayout = function() {
            var t = n(this.element);
            return this.size && t && t.innerWidth !== this.size.innerWidth
        }, f.addItems = function(t) {
            var e = this._itemize(t);
            return e.length && (this.items = this.items.concat(e)), e
        }, f.appended = function(t) {
            var e = this.addItems(t);
            e.length && (this.layoutItems(e, !0), this.reveal(e))
        }, f.prepended = function(t) {
            var e = this._itemize(t);
            if (e.length) {
                var n = this.items.slice(0);
                this.items = e.concat(n), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(n)
            }
        }, f.reveal = function(t) {
            if (this._emitCompleteOnItems("reveal", t), t && t.length) {
                var e = this.updateStagger();
                t.forEach(function(t, n) {
                    t.stagger(n * e), t.reveal()
                })
            }
        }, f.hide = function(t) {
            if (this._emitCompleteOnItems("hide", t), t && t.length) {
                var e = this.updateStagger();
                t.forEach(function(t, n) {
                    t.stagger(n * e), t.hide()
                })
            }
        }, f.revealItemElements = function(t) {
            var e = this.getItems(t);
            this.reveal(e)
        }, f.hideItemElements = function(t) {
            var e = this.getItems(t);
            this.hide(e)
        }, f.getItem = function(t) {
            for (var e = 0; e < this.items.length; e++) {
                var n = this.items[e];
                if (n.element == t) return n
            }
        }, f.getItems = function(t) {
            t = i.makeArray(t);
            var e = [];
            return t.forEach(function(t) {
                var n = this.getItem(t);
                n && e.push(n)
            }, this), e
        }, f.remove = function(t) {
            var e = this.getItems(t);
            this._emitCompleteOnItems("remove", e), e && e.length && e.forEach(function(t) {
                t.remove(), i.removeFrom(this.items, t)
            }, this)
        }, f.destroy = function() {
            var t = this.element.style;
            t.height = "", t.position = "", t.width = "", this.items.forEach(function(t) {
                t.destroy()
            }), this.unbindResize();
            var e = this.element.outlayerGUID;
            delete d[e], delete this.element.outlayerGUID, l && l.removeData(this.element, this.constructor.namespace)
        }, s.data = function(t) {
            t = i.getQueryElement(t);
            var e = t && t.outlayerGUID;
            return e && d[e]
        }, s.create = function(t, e) {
            var n = o(s);
            return n.defaults = i.extend({}, s.defaults), i.extend(n.defaults, e), n.compatOptions = i.extend({}, s.compatOptions), n.namespace = t, n.data = s.data, n.Item = o(r), i.htmlInit(n, t), l && l.bridget && l.bridget(t, n), n
        };
        var p = {
            ms: 1,
            s: 1e3
        };
        return s.Item = r, s
    }),
    function(t, e) {
        "function" == typeof define && define.amd ? define(["outlayer/outlayer", "get-size/get-size"], e) : "object" == typeof module && module.exports ? module.exports = e(require("outlayer"), require("get-size")) : t.Masonry = e(t.Outlayer, t.getSize)
    }(window, function(t, e) {
        var n = t.create("masonry");
        n.compatOptions.fitWidth = "isFitWidth";
        var i = n.prototype;
        return i._resetLayout = function() {
            this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns(), this.colYs = [];
            for (var t = 0; t < this.cols; t++) this.colYs.push(0);
            this.maxY = 0, this.horizontalColIndex = 0
        }, i.measureColumns = function() {
            if (this.getContainerWidth(), !this.columnWidth) {
                var t = this.items[0],
                    n = t && t.element;
                this.columnWidth = n && e(n).outerWidth || this.containerWidth
            }
            var i = this.columnWidth += this.gutter,
                r = this.containerWidth + this.gutter,
                s = r / i,
                o = i - r % i,
                a = o && o < 1 ? "round" : "floor";
            s = Math[a](s), this.cols = Math.max(s, 1)
        }, i.getContainerWidth = function() {
            var t = this._getOption("fitWidth"),
                n = t ? this.element.parentNode : this.element,
                i = e(n);
            this.containerWidth = i && i.innerWidth
        }, i._getItemLayoutPosition = function(t) {
            t.getSize();
            var e = t.size.outerWidth % this.columnWidth,
                n = e && e < 1 ? "round" : "ceil",
                i = Math[n](t.size.outerWidth / this.columnWidth);
            i = Math.min(i, this.cols);
            for (var r = this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition", s = this[r](i, t), o = {
                    x: this.columnWidth * s.col,
                    y: s.y
                }, a = s.y + t.size.outerHeight, h = i + s.col, l = s.col; l < h; l++) this.colYs[l] = a;
            return o
        }, i._getTopColPosition = function(t) {
            var e = this._getTopColGroup(t),
                n = Math.min.apply(Math, e);
            return {
                col: e.indexOf(n),
                y: n
            }
        }, i._getTopColGroup = function(t) {
            if (t < 2) return this.colYs;
            for (var e = [], n = this.cols + 1 - t, i = 0; i < n; i++) e[i] = this._getColGroupY(i, t);
            return e
        }, i._getColGroupY = function(t, e) {
            if (e < 2) return this.colYs[t];
            var n = this.colYs.slice(t, t + e);
            return Math.max.apply(Math, n)
        }, i._getHorizontalColPosition = function(t, e) {
            var n = this.horizontalColIndex % this.cols;
            n = t > 1 && n + t > this.cols ? 0 : n;
            var i = e.size.outerWidth && e.size.outerHeight;
            return this.horizontalColIndex = i ? n + t : this.horizontalColIndex, {
                col: n,
                y: this._getColGroupY(n, t)
            }
        }, i._manageStamp = function(t) {
            var n = e(t),
                i = this._getElementOffset(t),
                r = this._getOption("originLeft"),
                s = r ? i.left : i.right,
                o = s + n.outerWidth,
                a = Math.floor(s / this.columnWidth);
            a = Math.max(0, a);
            var h = Math.floor(o / this.columnWidth);
            h -= o % this.columnWidth ? 0 : 1, h = Math.min(this.cols - 1, h);
            for (var l = this._getOption("originTop"), u = (l ? i.top : i.bottom) + n.outerHeight, c = a; c <= h; c++) this.colYs[c] = Math.max(u, this.colYs[c])
        }, i._getContainerSize = function() {
            this.maxY = Math.max.apply(Math, this.colYs);
            var t = {
                height: this.maxY
            };
            return this._getOption("fitWidth") && (t.width = this._getContainerFitWidth()), t
        }, i._getContainerFitWidth = function() {
            for (var t = 0, e = this.cols; --e && 0 === this.colYs[e];) t++;
            return (this.cols - t) * this.columnWidth - this.gutter
        }, i.needsResizeLayout = function() {
            var t = this.containerWidth;
            return this.getContainerWidth(), t != this.containerWidth
        }, n
    }),
    function(t, e) {
        "use strict";
        "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? module.exports = e() : t.MediaBox = e()
    }(this, function() {
        "use strict";
        var t = function(e) {
            return this && this instanceof t ? !!e && (this.selector = e instanceof NodeList ? e : document.querySelectorAll(e), this.root = document.querySelector("body"), void this.run()) : new t(e)
        };
        return t.prototype = {
            run: function() {
                Array.prototype.forEach.call(this.selector, function(t) {
                    t.addEventListener("click", function(e) {
                        e.preventDefault();
                        var n = this.parseUrl(t.getAttribute("href"));
                        this.render(n), this.events()
                    }.bind(this), !1)
                }.bind(this)), this.root.addEventListener("keyup", function(t) {
                    27 === (t.keyCode || t.which) && this.close(this.root.querySelector(".mediabox-wrap"))
                }.bind(this), !1)
            },
            template: function(t, e) {
                var n;
                for (n in e) e.hasOwnProperty(n) && (t = t.replace(new RegExp("{" + n + "}", "g"), e[n]));
                return t
            },
            parseUrl: function(t) {
                var e, n = {};
                return (e = t.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/)) ? (n.provider = "youtube", n.id = e[2]) : (e = t.match(/https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/)) ? (n.provider = "vimeo", n.id = e[3]) : (n.provider = "Unknown", n.id = ""), n
            },
            render: function(t) {
                var e, n;
                if ("youtube" === t.provider) e = "https://www.youtube.com/embed/" + t.id;
                else {
                    if ("vimeo" !== t.provider) throw new Error("Invalid video URL");
                    e = "https://player.vimeo.com/video/" + t.id
                }
                n = this.template('<div class="mediabox-wrap" role="dialog" aria-hidden="false"><div class="mediabox-content" role="document" tabindex="0"><span class="mediabox-close" aria-label="close"></span><iframe src="{embed}?autoplay=1" frameborder="0" allowfullscreen></iframe></div></div>', {
                    embed: e
                }), this.root.insertAdjacentHTML("beforeend", n)
            },
            events: function() {
                var t = document.querySelector(".mediabox-wrap");
                t.addEventListener("click", function(e) {
                    (e.target && "SPAN" === e.target.nodeName && "mediabox-close" === e.target.className || "DIV" === e.target.nodeName && "mediabox-wrap" === e.target.className) && this.close(t)
                }.bind(this), !1)
            },
            close: function(t) {
                if (null === t) return !0;
                var e = null;
                e && clearTimeout(e), t.classList.add("mediabox-hide"), e = setTimeout(function() {
                    var t = document.querySelector(".mediabox-wrap");
                    null !== t && this.root.removeChild(t)
                }.bind(this), 500)
            }
        }, t
    }),
    function(t, e) {
        t.IS_TOUCH_DEVICE = function() {
            "use strict";
            try {
                return "ontouchstart" in window || navigator.maxTouchPoints
            } catch (t) {
                return !1
            }
        }()
    }(this), ResizeSensor = function(t, e) {
        function n() {
            this.q = [], this.add = function(t) {
                this.q.push(t)
            };
            var t, e;
            this.call = function() {
                for (t = 0, e = this.q.length; t < e; t++) this.q[t].call()
            }
        }

        function i(t, e) {
            return t.currentStyle ? t.currentStyle[e] : window.getComputedStyle ? window.getComputedStyle(t, null).getPropertyValue(e) : t.style[e]
        }

        function r(t, e) {
            if (t.resizedAttached) {
                if (t.resizedAttached) return void t.resizedAttached.add(e)
            } else t.resizedAttached = new n, t.resizedAttached.add(e);
            t.resizeSensor = document.createElement("div"), t.resizeSensor.className = "resize-sensor";
            var r = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;",
                s = "position: absolute; left: 0; top: 0;";
            t.resizeSensor.style.cssText = r, t.resizeSensor.innerHTML = '<div class="resize-sensor-expand" style="' + r + '"><div style="' + s + '"></div></div><div class="resize-sensor-shrink" style="' + r + '"><div style="' + s + ' width: 200%; height: 200%"></div></div>', t.appendChild(t.resizeSensor), {
                fixed: 1,
                absolute: 1
            }[i(t, "position")] || (t.style.position = "relative");
            var o, a, h = t.resizeSensor.childNodes[0],
                l = h.childNodes[0],
                u = t.resizeSensor.childNodes[1],
                c = (u.childNodes[0], function() {
                    l.style.width = h.offsetWidth + 10 + "px", l.style.height = h.offsetHeight + 10 + "px", h.scrollLeft = h.scrollWidth, h.scrollTop = h.scrollHeight, u.scrollLeft = u.scrollWidth, u.scrollTop = u.scrollHeight, o = t.offsetWidth, a = t.offsetHeight
                });
            c();
            var d = function() {
                    t.resizedAttached && t.resizedAttached.call()
                },
                f = function(t, e, n) {
                    t.attachEvent ? t.attachEvent("on" + e, n) : t.addEventListener(e, n)
                };
            f(h, "scroll", function() {
                (t.offsetWidth > o || t.offsetHeight > a) && d(), c()
            }), f(u, "scroll", function() {
                (t.offsetWidth < o || t.offsetHeight < a) && d(), c()
            })
        }
        if ("[object Array]" === Object.prototype.toString.call(t) || "undefined" != typeof jQuery && t instanceof jQuery || "undefined" != typeof Elements && t instanceof Elements)
            for (var s = 0, o = t.length; s < o; s++) r(t[s], e);
        else r(t, e);
        this.detach = function() {
            ResizeSensor.detach(t)
        }
    }, ResizeSensor.detach = function(t) {
        t.resizeSensor && (t.removeChild(t.resizeSensor), delete t.resizeSensor, delete t.resizedAttached)
    },
    function(t, e) {
        "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define("Siema", [], e) : "object" == typeof exports ? exports.Siema = e() : t.Siema = e()
    }(this, function() {
        return function(t) {
            function e(i) {
                if (n[i]) return n[i].exports;
                var r = n[i] = {
                    i: i,
                    l: !1,
                    exports: {}
                };
                return t[i].call(r.exports, r, r.exports, e), r.l = !0, r.exports
            }
            var n = {};
            return e.m = t, e.c = n, e.i = function(t) {
                return t
            }, e.d = function(t, n, i) {
                e.o(t, n) || Object.defineProperty(t, n, {
                    configurable: !1,
                    enumerable: !0,
                    get: i
                })
            }, e.n = function(t) {
                var n = t && t.__esModule ? function() {
                    return t.default
                } : function() {
                    return t
                };
                return e.d(n, "a", n), n
            }, e.o = function(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
            }, e.p = "", e(e.s = 0)
        }([function(t, e, n) {
            "use strict";

            function i(t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(e, "__esModule", {
                value: !0
            });
            var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                } : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                },
                s = function() {
                    function t(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var i = e[n];
                            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                        }
                    }
                    return function(e, n, i) {
                        return n && t(e.prototype, n), i && t(e, i), e
                    }
                }(),
                o = function() {
                    function t(e) {
                        var n = this;
                        i(this, t), this.config = t.mergeSettings(e), this.selector = "string" == typeof this.config.selector ? document.querySelector(this.config.selector) : this.config.selector, this.selectorWidth = this.selector.offsetWidth, this.innerElements = [].slice.call(this.selector.children), this.currentSlide = this.config.startIndex, this.transformProperty = t.webkitOrNot(), ["resizeHandler", "touchstartHandler", "touchendHandler", "touchmoveHandler", "mousedownHandler", "mouseupHandler", "mouseleaveHandler", "mousemoveHandler"].forEach(function(t) {
                            n[t] = n[t].bind(n)
                        }), this.init()
                    }
                    return s(t, [{
                        key: "init",
                        value: function() {
                            if (window.addEventListener("resize", this.resizeHandler), this.config.draggable && (this.pointerDown = !1, this.drag = {
                                    startX: 0,
                                    endX: 0,
                                    startY: 0,
                                    letItGo: null
                                }, this.selector.addEventListener("touchstart", this.touchstartHandler), this.selector.addEventListener("touchend", this.touchendHandler), this.selector.addEventListener("touchmove", this.touchmoveHandler, {
                                    passive: !0
                                }), this.selector.addEventListener("mousedown", this.mousedownHandler), this.selector.addEventListener("mouseup", this.mouseupHandler), this.selector.addEventListener("mouseleave", this.mouseleaveHandler), this.selector.addEventListener("mousemove", this.mousemoveHandler)), null === this.selector) throw new Error("Something wrong with your selector 😭");
                            this.resolveSlidesNumber(), this.selector.style.overflow = "hidden", this.sliderFrame = document.createElement("div"), this.sliderFrame.style.width = this.selectorWidth / this.perPage * this.innerElements.length + "px", this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing, this.config.draggable && (this.selector.style.cursor = "-webkit-grab");
                            for (var t = document.createDocumentFragment(), e = 0; e < this.innerElements.length; e++) {
                                var n = document.createElement("div");
                                n.style.cssFloat = "left", n.style.float = "left", n.style.width = 100 / this.innerElements.length + "%", n.appendChild(this.innerElements[e]), t.appendChild(n)
                            }
                            this.sliderFrame.appendChild(t), this.selector.innerHTML = "", this.selector.appendChild(this.sliderFrame), this.slideToCurrent(), this.config.onInit.call(this)
                        }
                    }, {
                        key: "resolveSlidesNumber",
                        value: function() {
                            if ("number" == typeof this.config.perPage) this.perPage = this.config.perPage;
                            else if ("object" === r(this.config.perPage)) {
                                this.perPage = 1;
                                for (var t in this.config.perPage) window.innerWidth >= t && (this.perPage = this.config.perPage[t])
                            }
                        }
                    }, {
                        key: "prev",
                        value: function() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
                                e = arguments[1];
                            if (!(this.innerElements.length <= this.perPage)) {
                                var n = this.currentSlide;
                                0 === this.currentSlide && this.config.loop ? this.currentSlide = this.innerElements.length - this.perPage : this.currentSlide = Math.max(this.currentSlide - t, 0), n !== this.currentSlide && (this.slideToCurrent(), this.config.onChange.call(this), e && e.call(this))
                            }
                        }
                    }, {
                        key: "next",
                        value: function() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
                                e = arguments[1];
                            if (!(this.innerElements.length <= this.perPage)) {
                                var n = this.currentSlide;
                                this.currentSlide === this.innerElements.length - this.perPage && this.config.loop ? this.currentSlide = 0 : this.currentSlide = Math.min(this.currentSlide + t, this.innerElements.length - this.perPage), n !== this.currentSlide && (this.slideToCurrent(), this.config.onChange.call(this), e && e.call(this))
                            }
                        }
                    }, {
                        key: "goTo",
                        value: function(t, e) {
                            this.innerElements.length <= this.perPage || (this.currentSlide = Math.min(Math.max(t, 0), this.innerElements.length - this.perPage), this.slideToCurrent(), e && e.call(this))
                        }
                    }, {
                        key: "slideToCurrent",
                        value: function() {
                            this.sliderFrame.style[this.transformProperty] = "translate3d(-" + this.currentSlide * (this.selectorWidth / this.perPage) + "px, 0, 0)"
                        }
                    }, {
                        key: "updateAfterDrag",
                        value: function() {
                            var t = this.drag.endX - this.drag.startX,
                                e = Math.abs(t),
                                n = Math.ceil(e / (this.selectorWidth / this.perPage));
                            t > 0 && e > this.config.threshold && this.innerElements.length > this.perPage ? this.prev(n) : t < 0 && e > this.config.threshold && this.innerElements.length > this.perPage && this.next(n), this.slideToCurrent()
                        }
                    }, {
                        key: "resizeHandler",
                        value: function() {
                            this.resolveSlidesNumber(), this.selectorWidth = this.selector.offsetWidth, this.sliderFrame.style.width = this.selectorWidth / this.perPage * this.innerElements.length + "px", this.slideToCurrent()
                        }
                    }, {
                        key: "clearDrag",
                        value: function() {
                            this.drag = {
                                startX: 0,
                                endX: 0,
                                startY: 0,
                                letItGo: null
                            }
                        }
                    }, {
                        key: "touchstartHandler",
                        value: function(t) {
                            t.stopPropagation(), this.pointerDown = !0, this.drag.startX = t.touches[0].pageX, this.drag.startY = t.touches[0].pageY
                        }
                    }, {
                        key: "touchendHandler",
                        value: function(t) {
                            t.stopPropagation(), this.pointerDown = !1, this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing, this.drag.endX && this.updateAfterDrag(), this.clearDrag()
                        }
                    }, {
                        key: "touchmoveHandler",
                        value: function(t) {
                            t.stopPropagation(), null === this.drag.letItGo && (this.drag.letItGo = Math.abs(this.drag.startY - t.touches[0].pageY) < Math.abs(this.drag.startX - t.touches[0].pageX)), this.pointerDown && this.drag.letItGo && (this.drag.endX = t.touches[0].pageX, this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing, this.sliderFrame.style[this.transformProperty] = "translate3d(" + -1 * (this.currentSlide * (this.selectorWidth / this.perPage) + (this.drag.startX - this.drag.endX)) + "px, 0, 0)")
                        }
                    }, {
                        key: "mousedownHandler",
                        value: function(t) {
                            t.preventDefault(), t.stopPropagation(), this.pointerDown = !0, this.drag.startX = t.pageX
                        }
                    }, {
                        key: "mouseupHandler",
                        value: function(t) {
                            t.stopPropagation(), this.pointerDown = !1, this.selector.style.cursor = "-webkit-grab", this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing, this.drag.endX && this.updateAfterDrag(), this.clearDrag()
                        }
                    }, {
                        key: "mousemoveHandler",
                        value: function(t) {
                            t.preventDefault(), this.pointerDown && (this.drag.endX = t.pageX, this.selector.style.cursor = "-webkit-grabbing", this.sliderFrame.style.webkitTransition = "all 0ms " + this.config.easing, this.sliderFrame.style.transition = "all 0ms " + this.config.easing, this.sliderFrame.style[this.transformProperty] = "translate3d(" + -1 * (this.currentSlide * (this.selectorWidth / this.perPage) + (this.drag.startX - this.drag.endX)) + "px, 0, 0)")
                        }
                    }, {
                        key: "mouseleaveHandler",
                        value: function(t) {
                            this.pointerDown && (this.pointerDown = !1, this.selector.style.cursor = "-webkit-grab", this.drag.endX = t.pageX, this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing, this.updateAfterDrag(), this.clearDrag())
                        }
                    }, {
                        key: "updateFrame",
                        value: function() {
                            this.sliderFrame = document.createElement("div"), this.sliderFrame.style.width = this.selectorWidth / this.perPage * this.innerElements.length + "px", this.sliderFrame.style.webkitTransition = "all " + this.config.duration + "ms " + this.config.easing, this.sliderFrame.style.transition = "all " + this.config.duration + "ms " + this.config.easing, this.config.draggable && (this.selector.style.cursor = "-webkit-grab");
                            for (var t = document.createDocumentFragment(), e = 0; e < this.innerElements.length; e++) {
                                var n = document.createElement("div");
                                n.style.cssFloat = "left", n.style.float = "left", n.style.width = 100 / this.innerElements.length + "%", n.appendChild(this.innerElements[e]), t.appendChild(n)
                            }
                            this.sliderFrame.appendChild(t), this.selector.innerHTML = "", this.selector.appendChild(this.sliderFrame), this.slideToCurrent()
                        }
                    }, {
                        key: "remove",
                        value: function(t, e) {
                            if (t < 0 || t > this.innerElements.length) throw new Error("Item to remove doesn't exist 😭");
                            this.innerElements.splice(t, 1), this.currentSlide = t < this.currentSlide ? this.currentSlide - 1 : this.currentSlide, this.updateFrame(), e && e.call(this)
                        }
                    }, {
                        key: "insert",
                        value: function(t, e, n) {
                            if (e < 0 || e > this.innerElements.length + 1) throw new Error("Unable to inset it at this index 😭");
                            if (-1 !== this.innerElements.indexOf(t)) throw new Error("The same item in a carousel? Really? Nope 😭");
                            this.innerElements.splice(e, 0, t), this.currentSlide = e <= this.currentSlide ? this.currentSlide + 1 : this.currentSlide, this.updateFrame(), n && n.call(this)
                        }
                    }, {
                        key: "prepend",
                        value: function(t, e) {
                            this.insert(t, 0), e && e.call(this)
                        }
                    }, {
                        key: "append",
                        value: function(t, e) {
                            this.insert(t, this.innerElements.length + 1), e && e.call(this)
                        }
                    }, {
                        key: "destroy",
                        value: function() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                                e = arguments[1];
                            if (window.removeEventListener("resize", this.resizeHandler), this.selector.style.cursor = "auto", this.selector.removeEventListener("touchstart", this.touchstartHandler), this.selector.removeEventListener("touchend", this.touchendHandler), this.selector.removeEventListener("touchmove", this.touchmoveHandler), this.selector.removeEventListener("mousedown", this.mousedownHandler), this.selector.removeEventListener("mouseup", this.mouseupHandler), this.selector.removeEventListener("mouseleave", this.mouseleaveHandler), this.selector.removeEventListener("mousemove", this.mousemoveHandler), t) {
                                for (var n = document.createDocumentFragment(), i = 0; i < this.innerElements.length; i++) n.appendChild(this.innerElements[i]);
                                this.selector.innerHTML = "", this.selector.appendChild(n), this.selector.removeAttribute("style")
                            }
                            e && e.call(this)
                        }
                    }], [{
                        key: "mergeSettings",
                        value: function(t) {
                            var e = {
                                    selector: ".siema",
                                    duration: 200,
                                    easing: "ease-out",
                                    perPage: 1,
                                    startIndex: 0,
                                    draggable: !0,
                                    threshold: 20,
                                    loop: !1,
                                    onInit: function() {},
                                    onChange: function() {}
                                },
                                n = t;
                            for (var i in n) e[i] = n[i];
                            return e
                        }
                    }, {
                        key: "webkitOrNot",
                        value: function() {
                            return "string" == typeof document.documentElement.style.transform ? "transform" : "WebkitTransform"
                        }
                    }]), t
                }();
            e.default = o, t.exports = e.default
        }])
    }),
    function(t, e) {
        var n = function(t, e) {
            "use strict";
            if (e.getElementsByClassName) {
                var n, i, r = e.documentElement,
                    s = t.Date,
                    o = t.HTMLPictureElement,
                    a = t.addEventListener,
                    h = t.setTimeout,
                    l = t.requestAnimationFrame || h,
                    u = t.requestIdleCallback,
                    c = /^picture$/i,
                    d = ["load", "error", "lazyincluded", "_lazyloaded"],
                    f = {},
                    p = Array.prototype.forEach,
                    g = function(t, e) {
                        return f[e] || (f[e] = new RegExp("(\\s|^)" + e + "(\\s|$)")), f[e].test(t.getAttribute("class") || "") && f[e]
                    },
                    m = function(t, e) {
                        g(t, e) || t.setAttribute("class", (t.getAttribute("class") || "").trim() + " " + e)
                    },
                    v = function(t, e) {
                        var n;
                        (n = g(t, e)) && t.setAttribute("class", (t.getAttribute("class") || "").replace(n, " "))
                    },
                    _ = function(t, e, n) {
                        var i = n ? "addEventListener" : "removeEventListener";
                        n && _(t, e), d.forEach(function(n) {
                            t[i](n, e)
                        })
                    },
                    y = function(t, i, r, s, o) {
                        var a = e.createEvent("CustomEvent");
                        return r || (r = {}), r.instance = n, a.initCustomEvent(i, !s, !o, r), t.dispatchEvent(a), a
                    },
                    w = function(e, n) {
                        var r;
                        !o && (r = t.picturefill || i.pf) ? r({
                            reevaluate: !0,
                            elements: [e]
                        }) : n && n.src && (e.src = n.src)
                    },
                    x = function(t, e) {
                        return (getComputedStyle(t, null) || {})[e]
                    },
                    b = function(t, e, n) {
                        for (n = n || t.offsetWidth; n < i.minSize && e && !t._lazysizesWidth;) n = e.offsetWidth, e = e.parentNode;
                        return n
                    },
                    C = function() {
                        var t, n, i = [],
                            r = [],
                            s = i,
                            o = function() {
                                var e = s;
                                for (s = i.length ? r : i, t = !0, n = !1; e.length;) e.shift()();
                                t = !1
                            },
                            a = function(i, r) {
                                t && !r ? i.apply(this, arguments) : (s.push(i), n || (n = !0, (e.hidden ? h : l)(o)))
                            };
                        return a._lsFlush = o, a
                    }(),
                    S = function(t, e) {
                        return e ? function() {
                            C(t)
                        } : function() {
                            var e = this,
                                n = arguments;
                            C(function() {
                                t.apply(e, n)
                            })
                        }
                    },
                    T = function(t) {
                        var e, n = 0,
                            r = i.throttleDelay,
                            o = i.ricTimeout,
                            a = function() {
                                e = !1, n = s.now(), t()
                            },
                            l = u && o > 49 ? function() {
                                u(a, {
                                    timeout: o
                                }), o !== i.ricTimeout && (o = i.ricTimeout)
                            } : S(function() {
                                h(a)
                            }, !0);
                        return function(t) {
                            var i;
                            (t = !0 === t) && (o = 33), e || (e = !0, i = r - (s.now() - n), i < 0 && (i = 0), t || i < 9 ? l() : h(l, i))
                        }
                    },
                    E = function(t) {
                        var e, n, i = function() {
                                e = null, t()
                            },
                            r = function() {
                                var t = s.now() - n;
                                t < 99 ? h(r, 99 - t) : (u || i)(i)
                            };
                        return function() {
                            n = s.now(), e || (e = h(r, 99))
                        }
                    };
                ! function() {
                    var e, n = {
                        lazyClass: "lazyload",
                        loadedClass: "lazyloaded",
                        loadingClass: "lazyloading",
                        preloadClass: "lazypreload",
                        errorClass: "lazyerror",
                        autosizesClass: "lazyautosizes",
                        srcAttr: "data-src",
                        srcsetAttr: "data-srcset",
                        sizesAttr: "data-sizes",
                        minSize: 40,
                        customMedia: {},
                        init: !0,
                        expFactor: 1.5,
                        hFac: .8,
                        loadMode: 2,
                        loadHidden: !0,
                        ricTimeout: 0,
                        throttleDelay: 125
                    };
                    i = t.lazySizesConfig || t.lazysizesConfig || {};
                    for (e in n) e in i || (i[e] = n[e]);
                    t.lazySizesConfig = i, h(function() {
                        i.init && A()
                    })
                }();
                var P = function() {
                        var o, l, u, d, f, b, P, A, z, I, M, O, L, N, F = /^img$/i,
                            D = /^iframe$/i,
                            R = "onscroll" in t && !/glebot/.test(navigator.userAgent),
                            H = 0,
                            q = 0,
                            B = -1,
                            j = function(t) {
                                q--, t && t.target && _(t.target, j), (!t || q < 0 || !t.target) && (q = 0)
                            },
                            W = function(t, n) {
                                var i, s = t,
                                    o = "hidden" == x(e.body, "visibility") || "hidden" != x(t, "visibility");
                                for (A -= n, M += n, z -= n, I += n; o && (s = s.offsetParent) && s != e.body && s != r;)(o = (x(s, "opacity") || 1) > 0) && "visible" != x(s, "overflow") && (i = s.getBoundingClientRect(), o = I > i.left && z < i.right && M > i.top - 1 && A < i.bottom + 1);
                                return o
                            },
                            V = function() {
                                var t, s, a, h, u, c, f, p, g, m = n.elements;
                                if ((d = i.loadMode) && q < 8 && (t = m.length)) {
                                    s = 0, B++, null == L && ("expand" in i || (i.expand = r.clientHeight > 500 && r.clientWidth > 500 ? 500 : 370), O = i.expand, L = O * i.expFactor), H < L && q < 1 && B > 2 && d > 2 && !e.hidden ? (H = L, B = 0) : H = d > 1 && B > 1 && q < 6 ? O : 0;
                                    for (; s < t; s++)
                                        if (m[s] && !m[s]._lazyRace)
                                            if (R)
                                                if ((p = m[s].getAttribute("data-expand")) && (c = 1 * p) || (c = H), g !== c && (b = innerWidth + c * N, P = innerHeight + c, f = -1 * c, g = c), a = m[s].getBoundingClientRect(), (M = a.bottom) >= f && (A = a.top) <= P && (I = a.right) >= f * N && (z = a.left) <= b && (M || I || z || A) && (i.loadHidden || "hidden" != x(m[s], "visibility")) && (l && q < 3 && !p && (d < 3 || B < 4) || W(m[s], c))) {
                                                    if (Q(m[s]), u = !0, q > 9) break
                                                } else !u && l && !h && q < 4 && B < 4 && d > 2 && (o[0] || i.preloadAfterLoad) && (o[0] || !p && (M || I || z || A || "auto" != m[s].getAttribute(i.sizesAttr))) && (h = o[0] || m[s]);
                                    else Q(m[s]);
                                    h && !u && Q(h)
                                }
                            },
                            U = T(V),
                            Y = function(t) {
                                m(t.target, i.loadedClass), v(t.target, i.loadingClass), _(t.target, Z), y(t.target, "lazyloaded")
                            },
                            X = S(Y),
                            Z = function(t) {
                                X({
                                    target: t.target
                                })
                            },
                            G = function(t, e) {
                                try {
                                    t.contentWindow.location.replace(e)
                                } catch (n) {
                                    t.src = e
                                }
                            },
                            $ = function(t) {
                                var e, n = t.getAttribute(i.srcsetAttr);
                                (e = i.customMedia[t.getAttribute("data-media") || t.getAttribute("media")]) && t.setAttribute("media", e), n && t.setAttribute("srcset", n)
                            },
                            J = S(function(t, e, n, r, s) {
                                var o, a, l, d, f, g;
                                (f = y(t, "lazybeforeunveil", e)).defaultPrevented || (r && (n ? m(t, i.autosizesClass) : t.setAttribute("sizes", r)), a = t.getAttribute(i.srcsetAttr), o = t.getAttribute(i.srcAttr), s && (l = t.parentNode, d = l && c.test(l.nodeName || "")), g = e.firesLoad || "src" in t && (a || o || d), f = {
                                    target: t
                                }, g && (_(t, j, !0), clearTimeout(u), u = h(j, 2500), m(t, i.loadingClass), _(t, Z, !0)), d && p.call(l.getElementsByTagName("source"), $), a ? t.setAttribute("srcset", a) : o && !d && (D.test(t.nodeName) ? G(t, o) : t.src = o), s && (a || d) && w(t, {
                                    src: o
                                })), t._lazyRace && delete t._lazyRace, v(t, i.lazyClass), C(function() {
                                    (!g || t.complete && t.naturalWidth > 1) && (g ? j(f) : q--, Y(f))
                                }, !0)
                            }),
                            Q = function(t) {
                                var e, n = F.test(t.nodeName),
                                    r = n && (t.getAttribute(i.sizesAttr) || t.getAttribute("sizes")),
                                    s = "auto" == r;
                                (!s && l || !n || !t.getAttribute("src") && !t.srcset || t.complete || g(t, i.errorClass) || !g(t, i.lazyClass)) && (e = y(t, "lazyunveilread").detail, s && k.updateElem(t, !0, t.offsetWidth), t._lazyRace = !0, q++, J(t, e, s, r, n))
                            },
                            K = function() {
                                if (!l) {
                                    if (s.now() - f < 999) return void h(K, 999);
                                    var t = E(function() {
                                        i.loadMode = 3, U()
                                    });
                                    l = !0, i.loadMode = 3, U(), a("scroll", function() {
                                        3 == i.loadMode && (i.loadMode = 2), t()
                                    }, !0)
                                }
                            };
                        return {
                            _: function() {
                                f = s.now(), n.elements = e.getElementsByClassName(i.lazyClass), o = e.getElementsByClassName(i.lazyClass + " " + i.preloadClass), N = i.hFac, a("scroll", U, !0), a("resize", U, !0), t.MutationObserver ? new MutationObserver(U).observe(r, {
                                    childList: !0,
                                    subtree: !0,
                                    attributes: !0
                                }) : (r.addEventListener("DOMNodeInserted", U, !0), r.addEventListener("DOMAttrModified", U, !0), setInterval(U, 999)), a("hashchange", U, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function(t) {
                                    e.addEventListener(t, U, !0)
                                }), /d$|^c/.test(e.readyState) ? K() : (a("load", K), e.addEventListener("DOMContentLoaded", U), h(K, 2e4)), n.elements.length ? (V(), C._lsFlush()) : U()
                            },
                            checkElems: U,
                            unveil: Q
                        }
                    }(),
                    k = function() {
                        var t, n = S(function(t, e, n, i) {
                                var r, s, o;
                                if (t._lazysizesWidth = i, i += "px", t.setAttribute("sizes", i), c.test(e.nodeName || ""))
                                    for (r = e.getElementsByTagName("source"), s = 0, o = r.length; s < o; s++) r[s].setAttribute("sizes", i);
                                n.detail.dataAttr || w(t, n.detail)
                            }),
                            r = function(t, e, i) {
                                var r, s = t.parentNode;
                                s && (i = b(t, s, i), r = y(t, "lazybeforesizes", {
                                    width: i,
                                    dataAttr: !!e
                                }), r.defaultPrevented || (i = r.detail.width) && i !== t._lazysizesWidth && n(t, s, r, i))
                            },
                            s = function() {
                                var e, n = t.length;
                                if (n)
                                    for (e = 0; e < n; e++) r(t[e])
                            },
                            o = E(s);
                        return {
                            _: function() {
                                t = e.getElementsByClassName(i.autosizesClass), a("resize", o)
                            },
                            checkElems: o,
                            updateElem: r
                        }
                    }(),
                    A = function() {
                        A.i || (A.i = !0, k._(), P._())
                    };
                return n = {
                    cfg: i,
                    autoSizer: k,
                    loader: P,
                    init: A,
                    uP: w,
                    aC: m,
                    rC: v,
                    hC: g,
                    fire: y,
                    gW: b,
                    rAF: C
                }
            }
        }(t, t.document);
        t.lazySizes = n, "object" == typeof module && module.exports && (module.exports = n)
    }(window),
    function(t, e) {
        "use strict";

        function n(t, n) {
            if (!s[t]) {
                var i = e.createElement(n ? "link" : "script"),
                    r = e.getElementsByTagName("script")[0];
                n ? (i.rel = "stylesheet", i.href = t) : i.src = t, s[t] = !0, s[i.src || i.href] = !0, r.parentNode.insertBefore(i, r)
            }
        }
        var i, r, s = {};
        e.addEventListener && (r = /\(|\)|\s|'/, i = function(t, n) {
            var i = e.createElement("img");
            i.onload = function() {
                i.onload = null, i.onerror = null, i = null, n()
            }, i.onerror = i.onload, i.src = t, i && i.complete && i.onload && i.onload()
        }, addEventListener("lazybeforeunveil", function(t) {
            var e, s, o, a;
            t.defaultPrevented || ("none" == t.target.preload && (t.target.preload = "auto"), e = t.target.getAttribute("data-link"), e && n(e, !0), e = t.target.getAttribute("data-script"), e && n(e), e = t.target.getAttribute("data-require"), e && (lazySizes.cfg.requireJs ? lazySizes.cfg.requireJs([e]) : n(e)), o = t.target.getAttribute("data-bg"), o && (t.detail.firesLoad = !0, s = function() {
                t.target.style.backgroundImage = "url(" + (r.test(o) ? JSON.stringify(o) : o) + ")", t.detail.firesLoad = !1, lazySizes.fire(t.target, "_lazyloaded", {}, !0, !0)
            }, i(o, s)), (a = t.target.getAttribute("data-poster")) && (t.detail.firesLoad = !0, s = function() {
                t.target.poster = a, t.detail.firesLoad = !1, lazySizes.fire(t.target, "_lazyloaded", {}, !0, !0)
            }, i(a, s)))
        }, !1))
    }(window, document),
    function(t, e) {
        "use strict";

        function n() {
            void 0 !== paper && t.querySelectorAll(".paper--patterns").forEach(function(t) {
                var n = t.querySelector("canvas"),
                    i = e[t.getAttribute("data-elements")],
                    r = new paper.PaperScope;
                r.setup(n), r.view.viewSize.width = n.clientWidth, r.view.viewSize.height = n.clientHeight;
                var s, o = new r.Tool,
                    a = !1,
                    h = !1,
                    l = "desktop",
                    u = {},
                    c = {
                        x: 0,
                        y: 0,
                        limit: .2,
                        speed: 15e-5,
                        onmove: !1
                    },
                    d = {
                        min: 40,
                        max: -40,
                        speed: .002,
                        angle: 0,
                        direction: 1
                    },
                    f = {
                        deltaX: 0,
                        deltaY: 0
                    },
                    p = function(t) {
                        if (!1 === h && void 0 !== s && void 0 !== s.children)
                            for (var e = 0, n = s.children.length; e < n; e++) f.deltaX = s.children[e].position.x + (c.x - u.x) * ((e + 1) * c.speed), f.deltaX > s.children[e].limits.x.min && f.deltaX < s.children[e].limits.x.max && (s.children[e].position.x = f.deltaX), f.deltaY = s.children[e].position.y + (c.y - u.y) * ((e + 1) * c.speed), f.deltaY > s.children[e].limits.y.min && f.deltaY < s.children[e].limits.y.max && (s.children[e].position.y = f.deltaY)
                    },
                    g = function(t) {
                        if (!1 === h) {
                            d.angle > d.min ? d.direction = -1 : d.angle < d.max && (d.direction = 1), d.angle += d.direction;
                            for (var e = 0, n = s.children.length; e < n; e++) s.children[e].position.y += d.angle * d.speed * (e + 1)
                        }
                    },
                    m = function(t, e) {
                        return void 0 !== e && (t = {
                            x: t,
                            y: e
                        }), new r.Point(t.x, t.y)
                    },
                    v = function(t) {
                        return {
                            x: u.x + t[l].x,
                            y: u.y + t[l].y
                        }
                    },
                    _ = function(t) {
                        return m(v(t))
                    },
                    w = function() {
                        !1 === a && (a = !0, r.view.onFrame = null, r.project.activeLayer.removeChildren(), l = e.innerWidth < 992 ? "mobile" : "desktop", s = new r.Group, u = r.view.center, s.position = r.view.center, S(), a = !1)
                    },
                    x = function(t) {
                        clearTimeout(c.onmove), c.x = t.x, c.y = t.y, !0 !== y && p(), c.onmove = setTimeout(function() {
                            c.onmove = !1
                        }, 100)
                    },
                    b = function(t) {
                        for (var e = 0, n = s.children.length; e < n; e++) t = (s.children[e].index + 1) / c.limit, s.children[e].limits = {
                            x: {
                                min: s.children[e].position.x - t,
                                max: s.children[e].position.x + t
                            },
                            y: {
                                min: s.children[e].position.y - t,
                                max: s.children[e].position.y + t
                            }
                        };
                        r.view.onFrame = !0 !== y ? g : null
                    },
                    C = {
                        triangle: function(t, e) {
                            e = new r.Path.RegularPolygon(_(t), 3, t[l].size), e.strokeColor = t.strokeColor, e.strokeWidth = t.strokeWidth, e.blendMode = t.blendMode || "normal", e.rotate(t.rotate || 0), s.addChild(e)
                        },
                        circle: function(t, e) {
                            e = new r.Path.Circle(_(t), t[l].size), e.strokeColor = t.strokeColor, e.strokeWidth = t.strokeWidth, e.blendMode = t.blendMode || "normal", s.addChild(e)
                        },
                        wave: function(t, e, n) {
                            n = v(t), n.a = t[l].size, n.b = Math.floor(.5 * n.a), n.c = Math.floor(.5 * n.b), e = new r.Path, e.strokeColor = t.strokeColor, e.strokeWidth = t.strokeWidth, e.blendMode = t.blendMode || "normal", e.add(m(n.x - n.a, n.y)), e.add(m(n.x - n.a, n.y)), e.add(m(n.x - n.b, n.y + n.c)), e.add(m(n.x, n.y)), e.add(m(n.x + n.b, n.y + n.c)), e.add(m(n.x + n.a, n.y)), e.smooth({
                                type: "catmull-rom",
                                factor: .5
                            }), e.rotate(t.rotate || 0), s.addChild(e)
                        },
                        raster: function(t, e) {
                            e = new r.Raster({
                                source: t.src,
                                position: _(t)
                            }), e.blendMode = t.blendMode || "normal", e.on("load", function() {
                                e.setHeight(e.height + 1), e.setHeight(e.height - 1), e.scale(t[l].scale || .5), e.rotate(t.rotate || 0)
                            }), s.addChild(e)
                        }
                    },
                    S = function() {
                        for (var t = 0, e = i.length; t < e; t++) C[i[t].type] && C[i[t].type](i[t]);
                        b()
                    };
                w();
                var T = 0;
                r.view.onResize = function(e) {
                    r.activate(), r.view._needsUpdate = !0, r.view.update(), w(), classie.add(t, "resizing"), clearTimeout(T), T = setTimeout(function() {
                        classie.remove(t, "resizing")
                    }, 500)
                }, e.addEventListener("scroll", function(t) {
                    clearTimeout(h), h = setTimeout(function() {
                        h = !1
                    }, 25)
                }, !1), o.onMouseMove = function(t) {
                    x(t.lastPoint)
                }
            })
        }

        function i() {
            void 0 !== paper && "undefined" != typeof animatePaper && t.querySelectorAll(".paper--gooey").forEach(function(t) {
                var n = t.querySelector("canvas"),
                    i = [].concat(e[t.getAttribute("data-elements")]),
                    r = new paper.PaperScope;
                r.setup(n), r.view.viewSize.width = n.clientWidth, r.view.viewSize.height = n.clientHeight;
                var s = new r.Tool,
                    o = !1,
                    a = "desktop",
                    h = new r.Point(-1e3, -1e3),
                    l = [],
                    u = function() {
                        if (!1 === o) {
                            o = !0, r.view.onFrame = null, r.project.activeLayer.removeChildren(), a = e.innerWidth < 992 ? "mobile" : "desktop", l = [];
                            for (var t = 0, n = i.length; t < n; t++) {
                                var s = Object.assign({}, i[t]),
                                    h = {
                                        center: {
                                            x: r.view.center.x + s[a].center.x,
                                            y: r.view.center.y + s[a].center.y
                                        }
                                    },
                                    u = Object.assign({
                                        radius: 100,
                                        center: {
                                            x: 0,
                                            y: 0
                                        },
                                        fillColor: "#00000"
                                    }, s[a], h);
                                s.mesh = u;
                                var d = !1;
                                "mask" === s.type && (d = new r.Raster({
                                    source: s.src,
                                    position: u.center
                                }), d.opacity = 0, d.on("load", function() {
                                    animatePaper.animate(d, {
                                        properties: {
                                            opacity: 1
                                        },
                                        settings: {
                                            duration: s.fadeIn || 2e3,
                                            easing: "easeInOutCirc",
                                            complete: function(t, e) {}
                                        }
                                    })
                                }));
                                var f = new r.Path.Circle(u);
                                s.flatten && (f.flatten(s.flatten), f.smooth({
                                    type: "asymmetric"
                                }));
                                for (var p = u.radius / 200, g = [], m = 0; m < f.segments.length; m++) g.push({
                                    relativeX: f.segments[m].point.x - u.center.x,
                                    relativeY: f.segments[m].point.y - u.center.y,
                                    offsetX: p,
                                    offsetY: p,
                                    momentum: new r.Point(0, 0)
                                });
                                if (s.settings = g, s.threshold = 1.4 * u.radius, s.circlePath = f, s.group = new r.Group([f]), s.controlCircle = f.clone(), s.rotationMultiplicator = p, s.controlCircle.fullySelected = !1, s.controlCircle.visible = !1, !1 !== d) {
                                    var v = new r.Group([s.group, d]);
                                    v.clipped = !0, s.mask = d, s.maskGroup = v
                                }
                                f.opacity = 0, animatePaper.animate(f, {
                                    properties: {
                                        opacity: 1
                                    },
                                    settings: {
                                        duration: s.fadeIn || 2e3,
                                        easing: "easeInOutCirc",
                                        complete: function(t, e) {}
                                    }
                                }), l.push(s)
                            }!0 !== y && (r.view.onFrame = function(t) {
                                c(t)
                            }), o = !1
                        }
                    },
                    c = function(t) {
                        for (var e = 0, n = l.length; e < n; e++) {
                            var i = l[e],
                                s = i.mesh;
                            i.group.rotate(-.2, s.center);
                            for (var o = 0; o < i.circlePath.segments.length; o++) {
                                var a = i.circlePath.segments[o],
                                    u = i.settings[o],
                                    c = i.controlCircle.segments[o].point,
                                    d = h.subtract(c),
                                    f = h.getDistance(c),
                                    p = 0;
                                f < i.threshold && (p = .15 * (f - i.threshold));
                                var g = new r.Point(0, 0);
                                0 !== f && (g = new r.Point(d.x / f * p, d.y / f * p));
                                var m = c.add(g),
                                    v = a.point.subtract(m);
                                u.momentum = u.momentum.subtract(v.divide(6)), u.momentum = u.momentum.multiply(.6);
                                var _ = u.offsetX,
                                    y = u.offsetY,
                                    w = Math.sin(t.time + 4 * o),
                                    x = Math.cos(t.time + 4 * o);
                                u.momentum = u.momentum.add(new r.Point(x * -_, w * -y)), a.point = a.point.add(u.momentum)
                            }
                        }
                    };
                u(), r.view.onResize = function(t) {
                    r.activate(), r.view._needsUpdate = !0, r.view.update(), u()
                }, e.addEventListener("scroll", function(t) {
                    clearTimeout(self.pageScrolling), self.pageScrolling = setTimeout(function() {
                        self.pageScrolling = !1
                    }, 25)
                }, !1), s.onMouseMove = function(t) {
                    h = t.lastPoint
                }
            })
        }

        function r() {
            void 0 !== paper && t.querySelectorAll(".paper--stars").forEach(function(t) {
                var n = t.querySelector("canvas"),
                    i = e[t.getAttribute("data-elements")],
                    r = new paper.PaperScope;
                r.setup(n), r.view.viewSize.width = n.clientWidth, r.view.viewSize.height = n.clientHeight;
                var s = new r.Tool,
                    o = new r.Point(r.view.center.x, r.view.center.y + 100),
                    a = r.view.center,
                    h = function() {
                        a = new r.Point(a.x + (o.x - a.x) / 10, a.y + (o.y - a.y) / 10);
                        var t = new r.Point((r.view.center.x - a.x) / 10, (r.view.center.y - a.y) / 10);
                        l(t)
                    },
                    l = new function() {
                        function t(t) {
                            var e = t.position,
                                n = r.view.bounds;
                            if (!e.isInside(n)) {
                                var i = t.bounds;
                                e.x > n.width + 5 && (e.x = -t.bounds.width), e.x < -i.width - 5 && (e.x = n.width), e.y > n.height + 5 && (e.y = -i.height), e.y < -i.height - 5 && (e.y = n.height)
                            }
                        }
                        for (var e = i.count || 50, n = new r.Path.Circle({
                                center: [0, 0],
                                radius: i.radius || 4,
                                fillColor: i.fillColor || "black"
                            }), s = new r.Symbol(n), o = 0; o < e; o++) {
                            var a = r.Point.random(),
                                h = new r.Point(a.x * r.view.size.width, a.y * r.view.size.height),
                                l = s.place(h);
                            l.scale(o / e + .01), l.data = {
                                vector: new r.Point({
                                    angle: 360 * Math.random(),
                                    length: o / e * Math.random() / 5
                                })
                            }
                        }
                        new r.Point({
                            angle: 45,
                            length: 0
                        });
                        return function(n) {
                            for (var i = r.project.activeLayer, s = 0; s < e; s++) {
                                var o = i.children[s],
                                    a = o.bounds.size,
                                    h = n.length / 10 * a.width / 10,
                                    l = n.normalize(h);
                                o.position = new r.Point(o.position.x + l.x + o.data.vector.x, o.position.y + l.y + o.data.vector.y), t(o)
                            }
                        }
                    };
                h(), r.view.onFrame = null, !0 !== y && (s.onMouseMove = function(t) {
                    o = t.lastPoint
                }, r.view.onFrame = h)
            })
        }

        function s() {
            function n(t, e) {
                !1 === e && (t.selector.style.height = Math.ceil(t.innerElements[t.currentSlide].clientHeight) + "px")
            }

            function i(t) {
                clearTimeout(t.autoPlayTimeout), t.autoPlayTimeout = setTimeout(function() {
                    !0 === t.config.loop ? t.next() : t.currentSlide >= t.innerElements.length - 1 ? (t.goTo(t.config.startIndex), r(t)) : t.next()
                }, t.config.autoplay || 3e3)
            }

            function r(t, e, r) {
                t = t || this, e = t.selector.parentElement, r = t.innerElements[t.currentSlide].querySelector(".dashed"), t.lastSlide > t.currentSlide ? classie.add(e, "carousel--reverse") : classie.remove(e, "carousel--reverse"), t.lastSlide = t.currentSlide;
                for (var s = 0, o = t.innerElements.length; s < o; s++) classie.remove(t.innerElements[s], "carousel__item--active"), 0 < t.dotElements.length && classie.remove(t.dotElements[s], "active"), null !== r && classie.remove(t.innerElements[s].querySelector(".dashed"), "in-view__child--in");
                classie.add(t.innerElements[t.currentSlide], "carousel__item--active"), 0 < t.dotElements.length && classie.add(t.dotElements[t.currentSlide], "active"), setTimeout(function() {
                    null !== r && classie.add(r, "in-view__child--in")
                }, t.config.duration), classie.remove(e, "carousel--on-first"), classie.remove(e, "carousel--on-last"), !1 === t.config.loop && 0 === t.currentSlide && classie.add(e, "carousel--on-first"), !1 === t.config.loop && t.innerElements.length - 1 === t.currentSlide && classie.add(e, "carousel--on-last"), n(t, !0), i(t)
            }

            function s(t, i, s, o, a) {
                if (t = this, i = t.selector.parentElement, t.lastSlide = t.currentSlide, t.dotElements = [], t.dots = i.querySelector(".carousel__dots"), o = i.querySelector(".carousel__prev"), s = i.querySelector(".carousel__next"), null !== o && o.addEventListener("click", function() {
                        t.prev()
                    }), null !== s && s.addEventListener("click", function() {
                        t.next()
                    }), null !== t.dots && !1 === t.config.loop)
                    for (var h = 0, l = t.innerElements.length; h < l; h++) {
                        var u = document.createElement("span");
                        u.slideTarget = h, h === t.currentSlide && classie.add(u, "active"), u.style.transition = "all 0.6s 0." + (h + 2) + "s cubic-bezier(0.68, -1, 0.27, 2)", t.dotElements.push(u), t.dots.appendChild(u), u.addEventListener("click", function() {
                            t.goTo(this.slideTarget), r(t)
                        })
                    }
                e.addEventListener("resize", function() {
                    classie.add(i, "carousel--resizing"), clearTimeout(a), a = setTimeout(function() {
                        n(t, !1), classie.remove(i, "carousel--resizing")
                    }, 200)
                }, !1);
                for (var h = 0, l = t.innerElements.length; h < l; h++) t.innerElements[h].resizeSensor = new ResizeSensor(t.innerElements[h], function() {
                    n(t, !1)
                });
                r(t), classie.add(i, "carousel--init")
            }
            var o = t.querySelectorAll(".carousel");
            if (null !== o && 0 !== o.length && "undefined" != typeof Siema)
                for (var a = 0, h = o.length; a < h; a++) o[a].siema = new Siema({
                    selector: o[a].querySelector(".carousel__frame"),
                    duration: 500,
                    easing: "ease",
                    perPage: 1,
                    draggable: !0,
                    threshold: 100,
                    autoplay: 3e3,
                    onInit: s,
                    onChange: r
                })
        }

        function o() {
            var e = t.querySelectorAll('a[href^="#"]:not([href="#"])');
            if (null !== e && 0 !== e.length && void 0 !== animateScrollTo)
                for (var n = 0, i = e.length; n < i; n++) e[n].addEventListener("click", function(e, n) {
                    null !== (e = t.querySelector(this.hash)) && 0 !== e.length && (n = e.getBoundingClientRect(), animateScrollTo(n.top + window.pageYOffset || 0, {
                        cancelOnUserAction: !1
                    }))
                }, !1)
        }

        function a() {
            function e() {
                !1 === i.opened && (classie.add(t.documentElement, i.classes.active), setTimeout(function() {
                    classie.add(t.documentElement, i.classes.display), i.opened = !0
                }, 50))
            }

            function n() {
                !0 === i.opened && (classie.remove(t.documentElement, i.classes.display), setTimeout(function() {
                    classie.remove(t.documentElement, i.classes.active), i.opened = !1
                }, 300))
            }
            var i = {
                opened: !1,
                trigger: t.querySelectorAll(".side-menu-trigger"),
                swipeable: t.querySelectorAll(".side-menu-swipeable"),
                sidemenu: t.querySelector(".site-sidenav__elements"),
                overlay: t.querySelector(".site-sidenav__overlay"),
                sidemenuitems: t.querySelectorAll(".site-sidenav__elements a"),
                classes: {
                    active: "side-menu",
                    display: "side-menu--display",
                    avoid: "side-menu-trigger"
                }
            };
            if (null !== i.sidemenu && 0 !== i.sidemenu.length) {
                if (0 < i.swipeable.length && function() {
                        if ("undefined" != typeof Hammer)
                            for (var e = 0, r = i.swipeable.length; e < r; e++) {
                                var s = 0,
                                    o = i.sidemenu.clientWidth,
                                    a = new Hammer(i.swipeable[e]);
                                a.on("panstart", function(e) {
                                    classie.add(t.documentElement, "side-menu--panning")
                                }), a.on("swipeleft", n), a.on("panright panleft", function(t) {
                                    s += 4 === t.direction ? Math.round(Math.max(3, t.velocity)) : Math.round(Math.min(-3, t.velocity)), s > 0 && (s = 0), Math.abs(s) > o && (s = -1 * o), i.overlay.style.opacity = 1 + 1 * s / o, i.sidemenu.style.webkitTransform = "translateX(" + s + "px)", i.sidemenu.style.transform = "translateX(" + s + "px)"
                                }), a.on("panend pancancel", function(e) {
                                    classie.remove(t.documentElement, "side-menu--panning"), Math.abs(s) > .5 * o && n(), i.overlay.style.opacity = "", i.sidemenu.style.webkitTransform = "", i.sidemenu.style.transform = "", s = 0
                                })
                            }
                    }(), t.addEventListener("click", function(t) {
                        !0 === i.opened && t.pageX > i.sidemenu.clientWidth && !1 === classie.has(t.target, i.classes.avoid) && n()
                    }, !1), null !== i.sidemenuitems && 0 < i.sidemenuitems.length)
                    for (var r = 0, s = i.sidemenuitems.length; r < s; r++) i.sidemenuitems[r].addEventListener("click", n, !1);
                if (null !== i.trigger && 0 < i.trigger.length)
                    for (var r = 0, s = i.trigger.length; r < s; r++) i.trigger[r].addEventListener("click", e, !1)
            }
        }

        function h(e) {
            function n(t, e, n) {
                setTimeout(function() {
                    classie.add(t, e)
                }, n)
            }
            if (null !== typeof(e = t.getElementsByClassName("in-view")) && 0 !== e.length && "undefined" != typeof Waypoint)
                for (var i = {
                        offset: "80%",
                        delay: 200,
                        classes: {
                            child: "in-view__child",
                            scope_in: "in-view--in",
                            child_in: "in-view__child--in"
                        }
                    }, r = 0, s = e.length; r < s; r++) {
                    new Waypoint({
                        element: e[r],
                        handler: function(t) {
                            var e = this.element.getElementsByClassName(i.classes.child);
                            if (0 < e.length)
                                for (var r = 0, s = e.length; r < s; r++) n(e[r], i.classes.child_in, i.delay * (r + 1));
                            n(this.element, i.classes.scope_in, 0), this.destroy()
                        },
                        offset: e[r].getAttribute("data-offset") || i.offset
                    })
                }
        }

        function l(e, n) {
            null !== (e = t.getElementById("masthead")) && null !== typeof e && 0 !== e.length && "undefined" != typeof Headroom && (n = new Headroom(e, {
                offset: e.clientHeight || 120
            }), n.init())
        }

        function u(n, i) {
            null !== (n = t.getElementById("up")) && "undefined" != typeof Headroom && (i = new Headroom(n, {
                offset: e.innerHeight
            }), i.init())
        }

        function c(e) {
            function n(t, e, n, i) {
                if (!0 !== classie.has(t, "tabs__nav--active") && null !== (i = e.querySelector('.tabs__item[data-tab="' + t.getAttribute("data-tab") + '"]')) && 0 !== i.length) {
                    for (var r = 0, s = n.length; r < s; r++) classie.remove(n[r], "tabs__nav--active"), classie.remove(n[r], "tabs__item--active"), n[r].setAttribute("tabindex", "-1"), n[r].setAttribute("aria-selected", "false");
                    classie.add(t, "tabs__nav--active"), t.setAttribute("tabindex", "0"), t.setAttribute("aria-selected", "true"), classie.add(i, "tabs__item--active"), i.setAttribute("tabindex", "0"), i.setAttribute("aria-selected", "true")
                }
            }
            if (null !== typeof(e = t.querySelectorAll(".tabs")) && 0 !== e.length)
                for (var i = 0, r = e.length; i < r; i++) ! function(t, e, i) {
                    e = t.querySelectorAll(".tabs__nav"), i = t.querySelectorAll("[data-tab]");
                    for (var r = 0, s = e.length; r < s; r++) e[r].addEventListener("click", function() {
                        n(this, t, i)
                    }, !1)
                }(e[i])
        }

        function d(n) {
            "undefined" != typeof Instafeed && null !== (n = t.getElementById("instafeed")) && function(t, n, i, r) {
                null !== (i = t.getAttribute("data-config")) && void 0 !== e[i] && void 0 !== e[i].userId && void 0 !== e[i].accessToken && (n = new Instafeed({
                    get: "user",
                    userId: e[i].userId,
                    accessToken: e[i].accessToken,
                    limit: e[i].limit || 6,
                    resolution: e[i].resolution || "standard_resolution",
                    template: '<figure class="instagram-feed__item lazyload--el lazyload" data-bg="{{image}}"></figure>',
                    error: function(t) {
                        console.warn("Instagram feed warning:", t)
                    },
                    success: function(t) {}
                }), n.run())
            }(n)
        }

        function f(e) {
            if (null !== typeof(e = t.querySelectorAll(".masonry")) && 0 !== e.length && "undefined" != typeof Masonry)
                for (var n = 0, i = e.length; n < i; n++) {
                    var r = new Masonry(e[n], {
                        itemSelector: ".masonry-item",
                        columnWidth: ".masonry-item",
                        horizontalOrder: !0,
                        percentPosition: !0
                    });
                    r.once("layoutComplete", function(t, e, n, i) {
                            function r(t, e, n) {
                                setTimeout(function() {
                                    classie.add(t, e)
                                }, n)
                            }
                            e = 0, n = t[0].layout.cols, i = {
                                offset: "80%",
                                delay: 200,
                                classes: {
                                    scope_in: "indexed-list__in-view--in"
                                }
                            };
                            for (var s = 0, o = t.length; s < o; s++) {
                                t[s].element.inViewDelay = e * i.delay, e++, e === n && (e = 0);
                                new Waypoint({
                                    element: t[s].element,
                                    handler: function(t) {
                                        r(this.element.querySelector(".indexed-list__in-view"), i.classes.scope_in, this.element.inViewDelay), this.destroy()
                                    },
                                    offset: i.offset
                                })
                            }
                        }),
                        function(t) {
                            setTimeout(function() {
                                t.layout()
                            }, 0)
                        }(r)
                }
        }

        function p(e) {
            null !== typeof(e = t.querySelectorAll(".video-popup")) && 0 !== e.length && "undefined" != typeof MediaBox && MediaBox(".video-popup")
        }

        function g(e) {
            if (null !== typeof(e = t.querySelectorAll("[data-sources]")) && 0 !== e.length)
                for (var n = 0, i = e.length; n < i; n++) try {
                    var r = e[n].getAttribute("data-sources").split("|");
                    if (0 === r.length) continue;
                    ! function(e, n) {
                        for (var i = 0, r = n.length; i < r; i++) {
                            var s = t.createElement("source");
                            e.appendChild(s), s.src = n[i]
                        }
                        e.removeAttribute("data-sources"), e.load()
                    }(e[n], r)
                } catch (t) {
                    console.warn(t)
                }
        }

        function m(n, i) {
            null !== (n = t.getElementById("mc-embedded-subscribe-form")) && null !== typeof n && 0 !== n.length && (i = t.createElement("script"), i.type = "text/javascript", i.src = "https://s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js", t.head.appendChild(i), i.onload = function() {
                e.fnames = ["EMAIL", "FNAME"], e.ftypes = ["email", "text"], e.$mcj = jQuery.noConflict(!0)
            })
        }

        function v(e) {
            if (null !== typeof(e = t.querySelectorAll(".countdown")) && 0 !== e.length)
                for (var n = 0, i = e.length; n < i; n++) ! function(t) {
                    function e() {
                        var e = (new Date).getTime(),
                            i = r - e;
                        if (i < 0) return clearInterval(s), void console.warn("Countdown timer is expired!", {
                            element: t,
                            target: n
                        });
                        for (var a = {
                                days: Math.floor(i / 864e5),
                                hours: Math.floor(i % 864e5 / 36e5),
                                minutes: Math.floor(i % 36e5 / 6e4),
                                seconds: Math.floor(i % 6e4 / 1e3)
                            }, h = 0, l = o.length; h < l; h++) {
                            var u = a[o[h].type];
                            void 0 !== u && (o[h].count.innerText = u < o[h].max ? (o[h].default+u).slice(o[h].length) : u)
                        }
                    }
                    var n = t.getAttribute("data-count");
                    try {
                        var i = new Date;
                        i.setHours(i.getHours() + 2), n = i
                    } catch (t) {}
                    if (void 0 !== n) {
                        var r = new Date(n).getTime();
                        if (!0 !== isNaN(r) && !0 !== isNaN(r - 0)) {
                            for (var s, o = [], a = t.querySelectorAll(".countdown__el"), h = 0, l = a.length; h < l; h++) {
                                var u = a[h].getAttribute("data-display");
                                if (void 0 !== u) {
                                    var c = a[h].querySelector(".countdown__count");
                                    if (null !== c) {
                                        var d = c.innerText || "00";
                                        o.push({
                                            type: u,
                                            count: c,
                                            default: d,
                                            length: -1 * d.length,
                                            max: 1 * Array(d.length + 1).join("9")
                                        })
                                    }
                                }
                            }
                            e(), s = setInterval(e, 1e3)
                        }
                    }
                }(e[n])
        }

        function _() {
            classie.add(t.documentElement, "loaded")
        }
        var y = !("undefined" === IS_TOUCH_DEVICE || !IS_TOUCH_DEVICE),
            w = !1;
        try {
            -1 !== ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].indexOf(e.navigator.platform) && (w = !0)
        } catch (t) {}
        var x = !1;
        try {
            x = !!window.chrome && !!window.chrome.webstore
        } catch (t) {}
        e.addEventListener("load", _),
            function() {
                !0 === y && classie.add(t.documentElement, "is-touch"), !0 === w && classie.add(t.documentElement, "is-mac"), !0 === x && classie.add(t.documentElement, "is-chrome"), setTimeout(n, 0), setTimeout(i, 0), setTimeout(r, 0), setTimeout(s, 0), setTimeout(o, 0), setTimeout(a, 0), setTimeout(l, 0), setTimeout(u, 0), setTimeout(c, 0), setTimeout(f, 0), setTimeout(p, 0), setTimeout(m, 0), setTimeout(d, 0), setTimeout(h, 0), setTimeout(v, 0), setTimeout(g, 0)
            }()
    }(document, window);



var end = new Date('09/28/2018 10:1 AM');

    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;

    function showRemaining() {
        var now = new Date();
        var distance = end - now;
        if (distance < 0) {

            clearInterval(timer);
            document.getElementById('countdown').innerHTML = 'EXPIRED!';

            return;
        }
        var days = Math.floor(distance / _day);
        var hours = Math.floor((distance % _day) / _hour);
        var minutes = Math.floor((distance % _hour) / _minute);
        var seconds = Math.floor((distance % _minute) / _second);

        document.getElementById('countdown').innerHTML = days + '  DAYS ';
        document.getElementById('countdown').innerHTML += hours + '  HRS ';
        document.getElementById('countdown').innerHTML += minutes + '  MINS ';
        document.getElementById('countdown').innerHTML += seconds + '  SECS LEFT !';
    }

    timer = setInterval(showRemaining, 1000);
