"use strict";

function mintLoaded(e, t) {
    e && e.trackEvent({
        engagementType: t,
        engagementMeta: "mintLoad"
    })
}

function mintStart(e, t) {
    e && e.trackEvent({
        engagementType: t + "_startBtn",
        engagementMeta: "mintStart"
    })
}

function hasClass(e, t) {
    if (e.classList.contains(t)) return !0
}

function getQueryParams(e) {
    for (var t = {}, n = e.location.search.substring(1), a = n.split("&"), i = 0; i < a.length; i++) {
        var o = a[i];
        o = o.split("="), o[0] && o[1] && (t[o[0]] = o[1])
    }
    return t
}

function throttle(e, t) {
    var n, a, i, o, r, s, l = debounce(function() {
        r = o = !1
    }, t);
    return function() {
        n = this, a = arguments;
        var d = function() {
            i = null, r && e.apply(n, a), l()
        };
        return i || (i = setTimeout(d, t)), o ? r = !0 : s = e.apply(n, a), l(), o = !0, s
    }
}

function debounce(e, t, n) {
    var a;
    return function() {
        var i = this,
            o = arguments,
            r = function() {
                a = null, n || e.apply(i, o)
            };
        n && !a && e.apply(i, o), clearTimeout(a), a = setTimeout(r, t)
    }
}

function labelButtonOver(e) {
    e.overSound.play()
}

function labelButtonDown(e) {
    e.downSound.play()
}

function styledButtonOver(e) {
    labelButtonOver(e), this.playButtonTween = this.game.CTHelpers.pulseAnimationStart(this, e, 1.06, 800, 0, !1)
}

function styledButtonOut(e) {
    e.outSound.play(), this.playButtonTween = this.game.CTHelpers.pulseAnimationStart(this, e, 1, 800, 0, !1)
}

function styledButtonAnalytics(e) {
    var t = e.game.cto,
        n = e.game.analyticsPrefix,
        a = n + "_" + e.buttonType + "Btn",
        i = "replay" === e.buttonType ? "restartGame" : "startGame";
    t && t.trackEvent({
        engagementType: a,
        engagementMeta: i
    })
}

function fullScreenEnabledHandler(e) {
    var t = this;
    e ? t.game.scale.startFullScreen(!1) : t.game.scale.stopFullScreen()
}

function fullScreenDisabledHandler(e) {
    var t = e ? "fullscreen" : "exit_fullscreen";
    window.parent.postMessage(t, "*")
}

function onFullScreenChange() {
    var e = this,
        t = e.game.CTHelpers,
        n = isNativeFullScreen();
    n !== e.game.iframeFullscreen && (e.game.iframeFullscreen = n), t.updateFullScreenState(e), t.toggleNav(e, !0, !1, !0)
}

function initFullScreenListeners(e) {
    document.removeEventListener("fullscreenchange", onFullScreenChange.bind(e)), document.removeEventListener("webkitfullscreenchange", onFullScreenChange.bind(e)), document.removeEventListener("mozfullscreenchange", onFullScreenChange.bind(e)), document.removeEventListener("MSFullscreenChange", onFullScreenChange.bind(e)), document.addEventListener("fullscreenchange", onFullScreenChange.bind(e)), document.addEventListener("webkitfullscreenchange", onFullScreenChange.bind(e)), document.addEventListener("mozfullscreenchange", onFullScreenChange.bind(e)), document.addEventListener("MSFullscreenChange", onFullScreenChange.bind(e))
}

function isNativeFullScreen() {
    return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement)
}

function nativeFullScreenEnabled() {
    return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled)
}

function hexToRgbComponents(e) {
    var t = sanitizeHex(e);
    if (t) {
        var n = parseInt(t.substring(1, 3), 16),
            a = parseInt(t.substring(3, 5), 16),
            i = parseInt(t.substring(5, 7), 16),
            o = {
                r: n,
                g: a,
                b: i
            };
        return o
    }
}

function sanitizeHex(e) {
    if (e && e.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
        if (7 === e.length) return e;
        if (4 === e.length) return e[0] + e[1] + e[1] + e[2] + e[2] + e[3] + e[3]
    }
}

function initFloatingTweens(e, t) {
    var n = e.game.CTHelpers,
        a = "up" === t ? {
            repeat: 0,
            posYFinal: -1 * e.height - n.getRandomInt(0, 800),
            deltaX: n.getRandomSign() * n.getRandomInt(10, 30),
            yoyo: !1,
            duration: e.upward_duration,
            delay: n.getRandomInt(0, e.upward_duration / 2)
        } : {
            repeat: 1 / 0,
            posYFinal: null,
            deltaY: n.getRandomSign() * n.getRandomInt(10, 80),
            deltaX: n.getRandomSign() * n.getRandomInt(10, 40),
            yoyo: !0,
            duration: e.rot_duration,
            delay: 0
        };
    e.floatConfig = a, startFloatingTweens(e)
}

function startFloatingTweens(e) {
    var t = e.game,
        n = e.floatConfig,
        a = e.children[0] || e,
        i = e.x + n.deltaX,
        o = n.posYFinal || e.y + n.deltaY;
    e.anim_tweens.x = t.add.tween(e).to({
        x: i
    }, n.duration / 2, Phaser.Easing.Cubic.InOut, !1, n.delay, n.repeat, n.yoyo), e.anim_tweens.y = t.add.tween(e).to({
        y: o
    }, n.duration, Phaser.Easing.Cubic.OutIn, !1, n.delay, n.repeat, n.yoyo), a.anim_tweens.rot = t.add.tween(a).to({
        rotation: a.rotation_target
    }, a.rot_duration, Phaser.Easing.Linear.None, !1, n.delay, n.repeat, !0), toggleFloatingTweens(e.anim_tweens, "start"), toggleFloatingTweens(a.anim_tweens, "start")
}

function pauseFloatingTweens(e) {
    toggleFloatingTweens(e.anim_tweens, "stop")
}

function toggleFloatingTweens(e, t) {
    for (var n in e) e[n][t]()
}

function Bubble(e, t) {
    this.game = e, this.bitmapData = void 0, this.bubbles = [], this.bubblesCountMin = 5, this.bubblesCountMax = 15, this.diameter = 20, this.diameterModificationCaliber = this.diameter / 8, this.drawNonOriginBubbles = !1, this.durationOfExpansionBeforeBurst = 125, this.fillColor = "0xFFFFFF", this.fillGradient = void 0, this.fillImageKey = void 0, this.fillImageSprite = void 0, this.fillOpacity = 0, this.hexToRGBString = function(e) {
        var t = CTHelpers.hexToRgba(e, 1),
            n = t.replace(/(^rgba\(\s*)|(\s*,\s*[\.0-9]+\s*\)\s*$)/gi, "");
        return n
    }, this.id = void 0, this.onlyCollideWith = [], this.padding = 2, this.phaserGameObject = void 0, this.phaserPhysicsObject = void 0, this.image = void 0, this.popProcessHasBegun = !1, this.isOriginBubble = !0, this.positionModificationCaliber = this.diameter / 4, this.onCollide = void 0, this.onCollideStandard = function(e, t, n, a, i) {}, this.randomOffset = void 0, this.shape = void 0, this.sprite = void 0, this.strokeColor = "0xFFFFFF", this.strokeWidth = 1, this.strokeOpacity = 1, this.popStartTimestamp = void 0, this.x = 0, this.xOrigin = 0, this.y = 0, this.yOrigin = 0, this.createCircleWithFillGradientBitmapData = function() {
        var e = .5 * (this.diameter + this.strokeWidth) + this.padding;
        this.fillGradient.relOffset && this.fillGradient.relOffset.x && (e += .5 * this.fillGradient.relOffset.x * this.diameter);
        var t = .5 * (this.diameter + this.strokeWidth) + this.padding;
        this.fillGradient.relOffset && this.fillGradient.relOffset.y && (t += .5 * this.fillGradient.relOffset.y * this.diameter);
        var n = .5 * this.diameter;
        this.fillGradient.relSize && (n *= this.fillGradient.relSize);
        for (var a = this.bitmapData.context.createRadialGradient(e, t, 0, e, t, n), i = 0; i < this.fillGradient.texture.length; i++) {
            var o = "rgba(" + this.hexToRGBString(this.fillGradient.texture[i].color) + ", " + this.fillGradient.texture[i].alpha + ")";
            a.addColorStop(this.fillGradient.texture[i].position, o)
        }
        this.bitmapData.circle(.5 * (this.diameter + this.strokeWidth) + this.padding, .5 * (this.diameter + this.strokeWidth) + this.padding, .5 * this.diameter, a)
    }, t && CTHelpers.extendObject(this, t), 0 === this.xOrigin && (this.xOrigin = this.x), 0 === this.yOrigin && (this.yOrigin = this.y), this.randomOffset = Math.random(this.x + this.y + this.diameter), this.shape = new Phaser.Circle(this.x + this.padding, this.y + this.padding, this.diameter + this.strokeWidth)
}

function initAscendingBubbleMotion(e, t) {
    var n = {
        destroySpriteUponTweenCompletion: !1,
        duration: 1e3,
        durationToDampenSway: 500,
        smoothness: 100,
        maxXSway: 40,
        randomNoiseOffset: 3 * Math.random(),
        randomAscensionSpeedOffset: Math.random().map(0, 1, 1, 1.4),
        sprite: void 0,
        xPath: [],
        y: void 0,
        yPath: []
    };
    if (t && CTHelpers.extendObject(n, t), n.sprite && n.y) {
        for (var a = 0; a < n.smoothness; a++) {
            var i = n.sprite.y + a * ((n.y - n.sprite.y) * n.randomAscensionSpeedOffset / n.smoothness);
            n.yPath.push(i)
        }
        for (var a = 0; a < n.smoothness; a++) {
            var o = noise.perlin2(.03 * a + n.randomNoiseOffset, 0).map(-.5, .5, -1 * n.maxXSway, n.maxXSway);
            a / n.smoothness < n.durationToDampenSway / n.duration && (o = a / n.smoothness / (n.durationToDampenSway / n.duration) * o);
            var r = n.sprite.x + o;
            n.xPath.push(r)
        }
        e.add.tween(n.sprite).to({
            x: n.xPath,
            y: n.yPath
        }, n.duration, Phaser.Easing.Linear.NONE, !0, 0, 0, !1), n.destroySpriteUponTweenCompletion && e.time.events.add(n.duration + 100, function() {
            n.sprite.destroy()
        })
    }
}

function drawTrailingBubbles(e, t) {
    var n = {
        trailingBubbleDataIndex: void 0,
        resistance: 1e3,
        trailID: void 0,
        x: void 0,
        y: void 0
    };
    t && CTHelpers.extendObject(n, t), "undefined" == typeof trailingBubbleData && (window.trailingBubbles = [], window.trailingBubbleData = []);
    for (var a = 0; a < trailingBubbleData.length; a++)
        if (trailingBubbleData[a].trailID === n.trailID) {
            n.trailingBubbleDataIndex = a;
            break
        }
        "undefined" == typeof n.trailingBubbleDataIndex && (trailingBubbleData.push({
        trailID: n.trailID,
        timeStampOfWhenLastTrailingBubbleWasSpawned: Date.now()
    }), n.trailingBubbleDataIndex = trailingBubbleData.length - 1);
    var i = 0;
    trailingBubbleData[n.trailingBubbleDataIndex].x && trailingBubbleData[n.trailingBubbleDataIndex].y && n.x && n.y && (i = Math.dist(n.x, n.y, trailingBubbleData[n.trailingBubbleDataIndex].x, trailingBubbleData[n.trailingBubbleDataIndex].y));
    var o = i.map(0, 25, n.resistance, 0);
    if (i < .01 && (o = 1e9), Date.now() - trailingBubbleData[n.trailingBubbleDataIndex].timeStampOfWhenLastTrailingBubbleWasSpawned > o && ("undefined" == typeof trailingBubbleData[n.trailingBubbleDataIndex].timeStampOfWhenThisDateWasRecorded || Date.now() - trailingBubbleData[n.trailingBubbleDataIndex].timeStampOfWhenThisDateWasRecorded < 2 * e.time.desiredFps)) {
        var r = 14,
            s = 30,
            l = r + Math.round(Math.random() * (s - r));
        trailingBubbles.push(new Bubble(e, {
            x: n.x,
            y: n.y,
            diameter: l,
            durationOfExpansionBeforeBurst: 0,
            fillGradient: {
                texture: [{
                    position: 0,
                    color: "#fff",
                    alpha: .8
                }, {
                    position: .06,
                    color: "#fff",
                    alpha: .8
                }, {
                    position: .3,
                    color: "#fff",
                    alpha: .5
                }, {
                    position: .75,
                    color: "#fff",
                    alpha: 0
                }, {
                    position: 1,
                    color: "#fff",
                    alpha: .2
                }],
                relOffset: {
                    x: .65,
                    y: -.8
                },
                relSize: 1.5
            },
            padding: 2
        }));
        var d = trailingBubbles[trailingBubbles.length - 1];
        d.draw(), initAscendingBubbleMotion(e, {
            destroySpriteUponTweenCompletion: !0,
            duration: 5e3,
            sprite: d.sprite,
            y: d.y - e.height
        });
        5e3 * d.y / e.height
    }
    Date.now() - trailingBubbleData[n.trailingBubbleDataIndex].timeStampOfWhenLastTrailingBubbleWasSpawned > o && (trailingBubbleData[n.trailingBubbleDataIndex].timeStampOfWhenLastTrailingBubbleWasSpawned = Date.now()), trailingBubbleData[n.trailingBubbleDataIndex].timeStampOfWhenThisDateWasRecorded = Date.now(), trailingBubbleData[n.trailingBubbleDataIndex].x = n.x, trailingBubbleData[n.trailingBubbleDataIndex].y = n.y
}

function pauseBubbleTweens(e, t) {
    pauseFloatingTweens(e), "undefined" == typeof e.xPositionBeforeFirstDrag && (e.xPositionBeforeFirstDrag = e.x, e.yPositionBeforeFirstDrag = e.y, t.xPositionBeforeFirstDrag = t.x, t.yPositionBeforeFirstDrag = t.y), e.xPositionBeforeLastDrag = e.x, e.yPositionBeforeLastDrag = e.y, t.xPositionBeforeLastDrag = t.x, t.yPositionBeforeLastDrag = t.y
}

function releaseOrPopBubble(e) {
    var t = e.game;
    e.children[0] || e;
    if (e && ("undefined" == typeof e.isAlreadyPoppedAndSinking || !e.isAlreadyPoppedAndSinking) && e.xPositionBeforeLastDrag && e.yPositionBeforeLastDrag && e.xPositionBeforeLastDrag === e.x && e.yPositionBeforeLastDrag === e.y) {
        e.isAlreadyPoppedAndSinking = !0, e.input.useHandCursor = !1, e.input.draggable = !1, e.key.clear(), "undefined" == typeof e.bubbleBeforePop && (e.bubbleBeforePop = new Bubble(t, {
            diameter: e.key.width,
            fillGradient: {
                texture: [{
                    position: 0,
                    color: "#fff",
                    alpha: .8
                }, {
                    position: .06,
                    color: "#fff",
                    alpha: .8
                }, {
                    position: .3,
                    color: "#fff",
                    alpha: .5
                }, {
                    position: .75,
                    color: "#fff",
                    alpha: 0
                }, {
                    position: 1,
                    color: "#fff",
                    alpha: .2
                }],
                relOffset: {
                    x: .65,
                    y: -.8
                },
                relSize: 1.5
            },
            opacity: 0,
            padding: 2
        }), e.addChild(t.make.sprite(-.5 * e.key.width, -.5 * e.key.width, e.bubbleBeforePop.generateBitmapData())), e.children[e.children.length - 1].inputEnabled = !1), e.children[e.children.length - 1].alpha = 0, e.alphaBeforePop = e.alpha, e.xPositionBeforePop = e.x, e.yPositionBeforePop = e.y;
        var n = void 0;
        if (t.sound && t.sound._sounds)
            for (var a = 0; a < t.sound._sounds.length; a++)
                if (t.sound._sounds[a].name && "connectFX0" === t.sound._sounds[a].name) {
                    n = t.sound._sounds[a];
                    break
                }
        n && n.play(), e.littleBubble = [];
        for (var i = 5, o = 15, r = i + Math.round(Math.random() * (o - i)), a = 0; a < r; a++) {
            var s = 2 * Math.random() * Math.PI,
                l = .5 * Math.random() * e.width,
                d = e.width / r,
                u = .35 * e.width,
                h = d + Math.round(Math.random() * (u - d));
            e.littleBubble.push(new Bubble(t, {
                x: e.x + l * Math.cos(s),
                y: e.y + l * Math.sin(s),
                diameter: h,
                durationOfExpansionBeforeBurst: 0,
                fillGradient: {
                    texture: [{
                        position: 0,
                        color: "#fff",
                        alpha: .8
                    }, {
                        position: .06,
                        color: "#fff",
                        alpha: .8
                    }, {
                        position: .3,
                        color: "#fff",
                        alpha: .5
                    }, {
                        position: .75,
                        color: "#fff",
                        alpha: 0
                    }, {
                        position: 1,
                        color: "#fff",
                        alpha: .2
                    }],
                    relOffset: {
                        x: .65,
                        y: -.8
                    },
                    relSize: 1.5
                },
                padding: 2
            })), e.littleBubble[a].draw(), initAscendingBubbleMotion(t, {
                destroySpriteUponTweenCompletion: !0,
                duration: 5e3,
                sprite: e.littleBubble[a].sprite,
                y: e.littleBubble[a].sprite.y - t.height
            });
            5e3 * e.littleBubble[a].sprite.y / t.height
        }
        t.add.tween(e).to({
            y: e.y + .5 * e.width + t.height
        }, 6e3, Phaser.Easing.Linear.None, !0, 0, 0, !1), t.time.events.add(6100, function() {
            e.alpha = 0, e.isAlreadyPoppedAndSinking = !1, e.input.useHandCursor = !0, e.input.draggable = !0, e.x = e.xPositionBeforeFirstDrag, e.y = e.yPositionBeforeFirstDrag, e.children[e.children.length - 1].alpha = 1, t.add.tween(e).to({
                alpha: e.alphaBeforePop
            }, 1e3, Phaser.Easing.Linear.None, !0, 0, 0, !1), startFloatingTweens(e)
        })
    } else startFloatingTweens(e)
}

function playLittleBubbleSoundFX(e) {
    var t = {
        playCondition: void 0,
        soundFile: void 0,
        soundKey: void 0,
        indexOfDesiredSoundAmongOtherGameSounds: void 0
    };
    if (e && CTHelpers.extendObject(t, e), game.sound && game.sound._sounds)
        for (var n = 0; n < game.sound._sounds.length; n++)
            if (game.sound._sounds[n].key && (t.soundKey && game.sound._sounds[n].key === t.soundKey || t.soundFile && game.sound._sounds[n].file === t.soundFile)) {
                t.indexOfDesiredSoundAmongOtherGameSounds = n;
                break
            }
            "undefined" == typeof t.indexOfDesiredSoundAmongOtherGameSounds && t.soundFile && t.soundKey && (game.load.audio(t.soundKey, t.soundFile), game.load.start(), game.load.onLoadComplete.add(function() {
        var e = !1;
        if (t.soundKey && game.sound && game.sound._sounds)
            for (var n = 0; n < game.sound._sounds.length; n++)
                if (game.sound._sounds[n].key && game.sound._sounds[n].key === t.soundKey) {
                    t.indexOfDesiredSoundAmongOtherGameSounds = n, e = !0;
                    break
                }
        if (!e) {
            game.add.audio(t.soundKey);
            for (var n = 0; n < game.sound._sounds.length; n++) game.sound._sounds[n].key === t.soundKey && (game.sound._sounds[n].file = t.soundFile)
        }
    })), t.indexOfDesiredSoundAmongOtherGameSounds && game.sound._sounds[t.indexOfDesiredSoundAmongOtherGameSounds].isPlaying === !1 && (game.sound._sounds[t.indexOfDesiredSoundAmongOtherGameSounds].loop = !0, game.sound._sounds[t.indexOfDesiredSoundAmongOtherGameSounds].play(), game.sound._sounds[t.indexOfDesiredSoundAmongOtherGameSounds].volume = 0), t.indexOfDesiredSoundAmongOtherGameSounds && ("undefined" == typeof t.playCondition || "undefined" != typeof game.sound._sounds[t.indexOfDesiredSoundAmongOtherGameSounds].lastRecordedPlayCondition && game.sound._sounds[t.indexOfDesiredSoundAmongOtherGameSounds].lastRecordedPlayCondition === t.playCondition ? "undefined" == typeof t.playCondition && (game.sound._sounds[t.indexOfDesiredSoundAmongOtherGameSounds].volume = 1) : (t.playCondition === !0 ? game.add.tween(game.sound._sounds[t.indexOfDesiredSoundAmongOtherGameSounds]).to({
        volume: 1
    }, 500).start() : game.add.tween(game.sound._sounds[t.indexOfDesiredSoundAmongOtherGameSounds]).to({
        volume: 0
    }, 500).start(), game.sound._sounds[t.indexOfDesiredSoundAmongOtherGameSounds].lastRecordedPlayCondition = t.playCondition))
}
var Phaser = window.Phaser;
! function() {
    var e, t = window.self !== window.top,
        n = document.querySelector("html"),
        a = null,
        i = 300;
    t || n.classList.add("no-parent-window"), "ontouchstart" in document.documentElement ? n.classList.add("touch") : n.classList.add("no-touch"), window.onload = function() {
        var n = document.querySelector("#start"),
            s = window.cto,
            l = "mint_memory_dory",
            d = getQueryParams(window),
            u = t && d.mint_container;
        if (e = new Phaser.Game(1024, 576, Phaser.AUTO, "game"), e.state.add("Boot", MemoryGame.Boot), e.debugScreen = a, e.cto = s, mintLoaded(s, l), a) n.classList.remove("pre-click"), e.startTime = e.time && e.time.totalElapsedSeconds() || 0, e.state.start("Boot");
        else {
            n.classList.add("visible");
            var h = document.querySelector("#play-button"),
                p = hasClass(n, "visible");
            h.addEventListener("click", function() {
                var t = 1e4,
                    a = function(e, t) {
                        e && e.trackEvent({
                            engagementType: l + "_timeDuration",
                            engagementMeta: t.time && t.time.totalElapsedSeconds() || 0
                        })
                    };
                mintStart(s, l), e.beaconInterval = setInterval(a, t, s, e), e.analyticsPrefix = l, e.beaconTiming = t, e.beaconTracking = a;
                var i = function(e) {
                    "visibility" === e.propertyName && (e.currentTarget.style.display = "none", n.removeEventListener("transitionend", i))
                };
                p && (n.addEventListener("transitionend", i), n.classList.remove("visible"), n.classList.remove("pre-click"), e.maxTimerStart = e.time && e.time.totalElapsedSeconds() || 0, e.state.start("Boot"))
            })
        }
        if (u) {
            var g = function(t) {
                if (t.data instanceof Object && "mint_config" === t.data.key) {
                    var n = t.data.options_string && JSON.parse(t.data.options_string);
                    e.customOptions = n.custom_options, e.socialEnabled = n.social_enabled, e.fauxFullscreenEnabled = n.faux_fullscreen
                }
            };
            window.addEventListener("message", g), window.parent.postMessage("mint_ready", "*")
        }
        t ? window.addEventListener("resize", throttle(r, i)) : (o(), window.addEventListener("resize", throttle(o, i))), r()
    };
    var o = function() {
            var e = document.querySelector("#game-bound"),
                t = e.dataset.ratio,
                n = window.innerHeight,
                a = Math.round(n / t);
            e.style.width = a + "px", r()
        },
        r = function() {
            var t = window.innerWidth <= 600;
            e.smallDevice !== t && (e.smallDevice = t)
        }
}(this);
var Phaser = window.Phaser;
Phaser.Plugin.CTHelpers = function(e, t) {
    Phaser.Plugin.call(this, e, t)
}, Phaser.Plugin.CTHelpers.prototype = Object.create(Phaser.Plugin.prototype), Phaser.Plugin.CTHelpers.prototype.constructor = Phaser.Plugin.SamplePlugin, Phaser.Plugin.CTHelpers.prototype.loadImages = function(e, t) {
    this.loadAssets("image", e, t)
}, Phaser.Plugin.CTHelpers.prototype.loadSpritesheets = function(e, t) {
    this.loadAssets("spritesheet", e, t)
}, Phaser.Plugin.CTHelpers.prototype.loadAudio = function(e, t) {
    this.loadAssets("audio", e, t)
}, Phaser.Plugin.CTHelpers.prototype.loadAssets = function(e, t, n) {
    for (var a in t) {
        var i = t[a];
        2 === i.length ? n.load[e](i[0], i[1]) : 4 === i.length && n.load[e](i[0], i[1], i[2], i[3])
    }
}, Phaser.Plugin.CTHelpers.prototype.bindInput = function(e, t, n) {
    e.inputEnabled = !0, e.input.useHandCursor = !0;
    for (var a in t) e.events[a].add(t[a], n)
};
var LabelButton = function(e, t, n, a, i, o, r, s, l, d, u, h, p, g, m, c, f) {
    Phaser.Button.call(this, e, t, n, a, d, u, g, m, c, f);
    var b = r && o || i,
        y = r && p || h;
    "icon" === s ? this.anchor.setTo(0, .5) : this.anchor.set(.5), this.frame = y, this.defaultFrame = h, this.activeFrame = p, this.defaultLabelText = i, this.activeLabelText = o;
    var v = "icon" === s,
        x = v ? this.width + 8 : 0,
        S = v ? 0 : 3,
        P = v ? [0, .4] : [.5, .49];
    this.label = this.game.CTHelpers.renderText(e, x, S, this.activeLabelText, l, {
        anchor: P
    }), this.activeLabelWidth = this.label.width, this.label.setText(b), this.addChild(this.label), e.add.existing(this), this.width < this.label.width && (this.buttonWidth = this.label.width), "icon" === s && (this.buttonWidth = x + Math.max(this.activeLabelWidth, this.label.width))
};
LabelButton.prototype = Object.create(Phaser.Button.prototype), LabelButton.prototype.constructor = LabelButton, Phaser.Plugin.CTHelpers.prototype.addLabeledButton = function(e, t, n, a, i, o, r, s, l, d, u, h, p, g, m) {
    var c = e.CTHelpers,
        f = new LabelButton(e, t, n, a, i, o, r, s, l, d, u, h, p, g, m);
    return e.add.existing(f), f.overSound = e.add.audio("buttonOver"), f.downSound = e.add.audio("buttonDown"), c.bindInput(f, {
        onInputOver: labelButtonOver,
        onInputDown: labelButtonDown
    }, u), f
}, Phaser.Plugin.CTHelpers.prototype.styledButton = function(e, t, n, a, i, o) {
    var r = e.CTHelpers,
        s = r.addLabeledButton(e, t, n, "buttonBg", a, null, !1, "background", e.fonts.fontStyleButton, o, e, 0, 0);
    return s.buttonType = i, s.outSound = e.add.audio("buttonOut"), r.bindInput(s, {
        onInputOver: styledButtonOver,
        onInputOut: styledButtonOut,
        onInputDown: styledButtonAnalytics
    }, this), r.sharpenText(s.label), s
}, Phaser.Plugin.CTHelpers.prototype.playButton = function(e, t, n, a, i) {
    var o = e.CTHelpers,
        r = o.styledButton(e, t, n, a, i, o.startGame);
    return r
}, Phaser.Plugin.CTHelpers.prototype.goToMain = function(e) {
    e.game.state.start("MainMenu")
}, Phaser.Plugin.CTHelpers.prototype.startGame = function(e) {
    e.game.state.start("Game")
}, Phaser.Plugin.CTHelpers.prototype.launchInterstitial = function(e) {
    e.game.state.start("Interstitial")
}, Phaser.Plugin.CTHelpers.prototype.toggleAudio = function(e) {
    var t = e.game.cto;
    e.game.isMuted = !this.game.sound.mute, e.game.isMuted ? (e.game.CTHelpers.replaceText(e.label, e.activeLabelText), e.frame = e.activeFrame) : (e.game.CTHelpers.replaceText(e.label, e.defaultLabelText), e.frame = e.defaultFrame), t && t.trackEvent({
        engagementType: e.game.analyticsPrefix + "_mute_btn",
        engagementMeta: e.game.isMuted ? "mute" : "unmute"
    }), e.game.sound.mute = e.game.isMuted
}, Phaser.Plugin.CTHelpers.prototype.transitionBgMusic = function(e, t, n) {
    var a, i = e.game.CTHelpers,
        o = e.game.currentAudioIndex,
        r = e.game.currentAudioTracks[o],
        s = n && n.volume || .6,
        l = n && n.duration || 1e3;
    e.game[t] ? e.game[t].paused = !1 : e.game[t] = e.game.add.audio(t), r && (r.fadeOut(), e.game.currentAudioIndex = 1 - o), a = e.game.currentAudioTracks[e.game.currentAudioIndex] = e.game[t], a.targetVolume = s, a.isDecoded ? i.fadeInLoopingAudio(a, l, s) : a.onDecoded.add(function() {
        i.fadeInLoopingAudio(a, l, s)
    }, e)
}, Phaser.Plugin.CTHelpers.prototype.fadeInLoopingAudio = function(e, t, n) {
    e.play(null, null, 0, !0), e.fadeTo(t, n)
}, Phaser.Plugin.CTHelpers.prototype.playResultFX = function(e, t, n, a) {
    var i = e.game.currentAudioTracks[e.game.currentAudioIndex],
        o = i.targetVolume || .8,
        r = a ? .05 : .2;
    i ? (i.fadeTo(500, r), i.onFadeComplete.addOnce(function() {
        a && i.pause(), t.play()
    })) : t.play(), (n || i) && t.onStop.addOnce(function() {
        n ? n(e) : i && (i.resume(), i.fadeTo(300, o))
    })
}, Phaser.Plugin.CTHelpers.prototype.restoreBgMusic = function(e) {
    var t = e.game.bg_music;
    t && (t.paused && t.resume(), t.targetVolume && t.volume < t.targetVolume && t.fadeTo(300, t.targetVolume))
}, Phaser.Plugin.CTHelpers.prototype.debugBgMusic = function(e) {
    e.game.currentAudioTracks[e.game.currentAudioIndex] && e.game.debug.soundInfo(e.game.currentAudioTracks[e.game.currentAudioIndex], 20, 32 + 130 * e.game.currentAudioIndex), e.game.currentAudioTracks[1 - e.game.currentAudioIndex] && e.game.debug.soundInfo(e.game.currentAudioTracks[1 - e.game.currentAudioIndex], 20, 32 + 130 * (1 - e.game.currentAudioIndex))
}, Phaser.Plugin.CTHelpers.prototype.onFullscreenBtnClick = function() {
    var e = this,
        t = e.game.CTHelpers;
    e.game.iframeFullscreen = !e.game.iframeFullscreen, e.toggleFullScreenFunction(e.game.iframeFullscreen), e.game.fullscreenEnabled || (t.updateFullScreenState(e), t.toggleNav(e, !0))
}, Phaser.Plugin.CTHelpers.prototype.updateFullScreenState = function(e) {
    var t = e.game.CTHelpers,
        n = e.enterFullscreen,
        a = e.game.cto;
    e.game.iframeFullscreen ? (t.replaceText(n.label, n.activeLabelText), n.frame = n.activeFrame) : (t.replaceText(n.label, n.defaultLabelText), n.frame = n.defaultFrame), e.game.navFullscreenSound.play(), a && a.trackEvent({
        engagementType: e.game.analyticsPrefix + "_fullscreen",
        engagementMeta: e.game.iframeFullscreen ? "isFullScreen" : "notFullScreen"
    })
}, Phaser.Plugin.CTHelpers.prototype.initNav = function(e, t) {
    var n = this,
        t = t || {},
        a = {
            exitFunction: null,
            disabledItems: []
        };
    n.extendObject(a, t);
    var i = e.game.navSettings,
        o = i.navItems,
        r = e.game.smallDevice ? e.game.fonts.fontStyleNavMobile : e.game.fonts.fontStyleNavDesktop,
        s = e.game.smallDevice ? e.game.fonts.fontStyleNavMobileDisabled : e.game.fonts.fontStyleNavDesktopDisabled,
        l = e.game.smallDevice ? 36 : 24,
        d = 42,
        u = e.add.button(0, 0, "navtoggle", n.toggleNavHandler, e);
    u.anchor.set(.5), u.scale.set(.5), u.x = u.width, u.y = u.height, u.tint = n.colorStringToHexInteger(e.game.colors.navTextColor.active), u.overSound = e.add.audio("buttonOver"), u.downSound = e.add.audio("buttonDown"), n.bindInput(u, {
        onInputOver: labelButtonOver,
        onInputDown: labelButtonDown
    }, e);
    for (var h = e.add.group(), p = n.newGroup(u, e), g = 0; g < o.length; g++) {
        var m, c = o[g].buttonName,
            f = o[g].defaultLabel,
            b = o[g].activeLabel,
            y = o[g].defaultFrame,
            v = o[g].activeFrame,
            x = o[g].persistentProperty,
            S = !!e.game[x],
            P = a.disabledItems.indexOf(c) >= 0;
        if (!P) switch (c) {
            case "goHome":
                S = "MainMenu" === e.game.state.current, S || (m = function() {
                    a.exitFunction && a.exitFunction(), n.goToMain(e)
                });
                break;
            case "enterFullscreen":
                var w = !nativeFullScreenEnabled() && !e.game.fauxFullscreenEnabled;
                if (w) {
                    o[g].skipButton = w;
                    break
                }
                if (m = n.onFullscreenBtnClick, e.game.fullscreenEnabled = nativeFullScreenEnabled(), e.game.fullscreenEnabled) e.toggleFullScreenFunction = fullScreenEnabledHandler, initFullScreenListeners(e);
                else {
                    if (!e.game.fauxFullscreenEnabled) {
                        o[g].skipButton = w;
                        break
                    }
                    e.toggleFullScreenFunction = fullScreenDisabledHandler
                }
                break;
            case "muteAudio":
                m = n.toggleAudio
        }
        o[g].skipButton || (e[c] = new n.addLabeledButton(e.game, 2 * u.width + l, 0, i.sprite, f, b, S, "icon", r, m, e, y, v), h.add(e[c]), P ? (e[c].label.setStyle(s), e[c].tint = n.colorStringToHexInteger(e.game.colors.navTextColor.disabled), e[c].inputEnabled = !1, e[c].input.useHandCursor = !1) : e[c].tint = n.colorStringToHexInteger(e.game.colors.navTextColor.active))
    }
    i.drawerWidth = 0;
    for (var g = 0; g < h.children.length; g++) {
        h.children[g].buttonWidth > i.drawerWidth && (i.drawerWidth = h.children[g].buttonWidth);
        var T = Math.max(h.children[g].height, h.children[g].label.height) + l;
        h.children[g].y = g * T + d
    }
    p.add(h), p.x = e.game.world.width - 2 * u.width, i.drawerWidth = i.drawerWidth + 2 * l, i.navPos = p.x;
    var C = i.drawerWidth + 2 * u.width,
        B = p.height + 1.2 * d,
        D = e.add.bitmapData(C, B),
        F = e.game.colors.navBg.color,
        O = n.hexToRgba(F, e.game.colors.navBg.opacity.main);
    if (e.game.colors.navBg.opacity.min && e.game.colors.navBg.opacity.min !== e.game.colors.navBg.opacity.main) {
        var M = D.ctx.createLinearGradient(0, 0, C, 0),
            I = n.hexToRgba(F, e.game.colors.navBg.opacity.min),
            A = 2 * u.width / C,
            H = 1;
        M.addColorStop(A, I), M.addColorStop(H, O), D.ctx.fillStyle = M
    } else D.ctx.fillStyle = F;
    D.ctx.beginPath(), D.ctx.rect(0, 0, 2 * u.width, 2 * u.height), D.ctx.rect(2 * u.width, 0, C, B), D.ctx.fill();
    var E = e.add.sprite(0, 0, D);
    return E.anchor.setTo(0, 0), E.inputEnabled = !0, p.add(E), E.sendToBack(), e.game.navSettings = i, e.game.navElements = p, e.game.navToggle = u, p
}, Phaser.Plugin.CTHelpers.prototype.toggleNavHandler = function() {
    var e = this,
        t = e.game.CTHelpers;
    t.toggleNav(e)
}, Phaser.Plugin.CTHelpers.prototype.toggleNav = function(e, t, n, a) {
    var i, o, r = void 0 === n ? e.game.navElements.x === e.game.navSettings.navPos : n,
        s = Phaser.Easing.Cubic.InOut,
        l = 300,
        d = e.game.cto,
        u = e.game.analyticsPrefix + "_navToggle";
    if (r ? (i = e.game.navSettings.navPos - e.game.navSettings.drawerWidth, o = e.game.navOpenSound, e.game.navToggle.frame = 1, d && d.trackEvent({
            engagementType: u,
            engagementMeta: "navOpen"
        })) : (i = e.game.navSettings.navPos, o = e.game.navCloseSound, e.game.navToggle.frame = 0, a || d && d.trackEvent({
            engagementType: u,
            engagementMeta: "navClose"
        })), t) e.game.navElements.x = i;
    else {
        e.add.tween(e.game.navElements).to({
            x: i
        }, l, s, !0);
        o.play()
    }
}, Phaser.Plugin.CTHelpers.prototype.fadeToAlpha = function(e, t, n, a, i) {
    var o = i || Phaser.Easing.Linear.None,
        r = e.game.add.tween(t).to({
            alpha: n
        }, a, o).start();
    return r
}, Phaser.Plugin.CTHelpers.prototype.fadeToAlphaWithCallback = function(e, t, n, a, i, o) {
    var r = this.game.CTHelpers,
        s = r.fadeToAlpha(e, t, n, a, o);
    s.onComplete.add(i, e)
}, Phaser.Plugin.CTHelpers.prototype.pulseAnimationStart = function(e, t, n, a, i, o, r) {
    var s = o ? [n, 1] : n,
        l = r || Phaser.Easing.Linear.None,
        d = e.game.add.tween(t.scale).to({
            x: s,
            y: s
        }, a, l);
    return d.repeatCounter = i, d.start()
}, Phaser.Plugin.CTHelpers.prototype.drawCircleSprite = function(e, t, n, a, i) {
    var o = a / 2,
        r = e.add.bitmapData(a, a),
        s = e.add.sprite(t, n, r);
    return i && r.circle(o, o, o, i), s
}, Phaser.Plugin.CTHelpers.prototype.getRandomInt = function(e, t) {
    return Math.floor(Math.random() * (t - e) + e)
}, Phaser.Plugin.CTHelpers.prototype.getRandomArbitrary = function(e, t) {
    return Math.random() * (t - e) + e
}, Phaser.Plugin.CTHelpers.prototype.getRandomSign = function() {
    return Math.pow(-1, this.getRandomInt(0, 2))
}, Phaser.Plugin.CTHelpers.prototype.numberWithCommas = function(e) {
    return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}, Phaser.Plugin.CTHelpers.prototype.updateRelativePosition = function(e, t, n, a) {
    e.rel_pos ? (e.x = e.rel_pos.x * t, e.y = e.rel_pos.y * n) : e.rel_pos = {
        x: e.x / a.game.width,
        y: e.y / a.game.height
    }
}, Phaser.Plugin.CTHelpers.prototype.renderText = function(e, t, n, a, i, o) {
    var r = this,
        s = e.add.text(Math.round(t), Math.round(n), a, i);
    return o ? r.restyleText(s, o) : this.sharpenText(s), s
}, Phaser.Plugin.CTHelpers.prototype.restyleText = function(e, t) {
    var n = t || {};
    return n.anchor && 2 == n.anchor.length && e.anchor.setTo(n.anchor[0], n.anchor[1]), n.lineSpacing && (e.lineSpacing = n.lineSpacing), n.alignment && (e.align = n.alignment), n.alpha && (e.alpha = n.alpha), n.x && (e.x = n.x), n.y && (e.y = n.y), this.sharpenText(e), e
}, Phaser.Plugin.CTHelpers.prototype.replaceText = function(e, t) {
    e.setText(t), this.sharpenText(e)
}, Phaser.Plugin.CTHelpers.prototype.sharpenText = function(e) {
    for (var t = [{
            key: "x",
            prop: "width"
        }, {
            key: "y",
            prop: "height"
        }], n = 0; n < t.length; n++) {
        var a = t[n],
            i = a.key,
            o = e[i],
            r = e[a.prop],
            s = e.anchor[i],
            l = r * s;
        s > 0 && s < 1 && l !== Math.floor(l) && (e.anchor[i] = Math.round(l) / r), o !== Math.floor(o) && (e[i] = Math.round(e[i]))
    }
}, Phaser.Plugin.CTHelpers.prototype.newGroup = function(e, t) {
    var n = t.game.add.group();
    return Array.isArray(e) ? this.addToGroup(n, e) : n.add(e), n
}, Phaser.Plugin.CTHelpers.prototype.addToGroup = function(e, t) {
    for (var n = 0; n < t.length; n++) e.add(t[n])
}, Phaser.Plugin.CTHelpers.prototype.extendObject = function(e, t) {
    for (var n in t) e[n] = t[n];
    return e
}, Phaser.Plugin.CTHelpers.prototype.colorStringToHexInteger = function(e) {
    if (e && "string" == typeof e && "#" === e[0]) {
        var t = e;
        if (7 === t.length) return t.replace("#", "0x");
        if (4 === t.length) return "0x" + t[1] + t[1] + t[2] + t[2] + t[3] + t[3]
    }
}, Phaser.Plugin.CTHelpers.prototype.hexToRgba = function(e, t) {
    var n = hexToRgbComponents(e);
    if (n) {
        var a = void 0 !== t ? t : 1,
            i = [n.r, n.g, n.b].join(", ");
        return "rgba(" + i + ", " + a + ")"
    }
}, Phaser.Plugin.CTHelpers.prototype.queryParentWindow = function(e, t, n) {
    var a = function(e) {
        n(e), window.removeEventListener("message", a)
    };
    window.addEventListener("message", a), window.parent.postMessage(t, "*")
};
var Phaser = window.Phaser;
Phaser.Plugin.CTAnimations = function(e, t) {
        Phaser.Plugin.call(this, e, t)
    }, Phaser.Plugin.CTAnimations.prototype = Object.create(Phaser.Plugin.prototype), Phaser.Plugin.CTAnimations.prototype.constructor = Phaser.Plugin.SamplePlugin, Phaser.Plugin.CTAnimations.prototype.animateImage = function(e, t, n) {
        var a = e.game.CTHelpers,
            i = {
                timing: {
                    min: 3200,
                    max: 3500
                },
                xShift: {
                    min: -5,
                    max: 5
                },
                yShift: {
                    min: -8,
                    max: 8
                },
                rotation: {
                    min: 0,
                    max: .25 * Math.PI
                }
            },
            o = n || {};
        a.extendObject(i, o);
        var r = a.getRandomInt(i.timing.min, i.timing.max);
        e.add.tween(t).to({
            x: Math.round(t.x + a.getRandomSign() * a.getRandomInt(i.xShift.min, i.xShift.max))
        }, r / 2, Phaser.Easing.Sinusoidal.InOut, !0, 0, 1 / 0, !0), e.add.tween(t).to({
            y: Math.round(t.y + a.getRandomSign() * a.getRandomInt(i.yShift.min, i.yShift.max))
        }, r, Phaser.Easing.Sinusoidal.OutIn, !0, 0, 1 / 0, !0), e.add.tween(t).to({
            rotation: a.getRandomArbitrary(i.rotation.min, i.rotation.max) * a.getRandomSign()
        }, 2 * r, Phaser.Easing.Sinusoidal.InOut, !0, 0, 1 / 0, !0)
    }, Phaser.Plugin.CTAnimations.prototype.drawGradientCircle = function(e, t) {
        var n = e.game.CTHelpers,
            a = {
                width: 60,
                gradientSizeRel: 1,
                centerPos: {
                    x: .5,
                    y: .5
                },
                color: "#fff",
                colorStops: [{
                    position: 0,
                    alpha: .6
                }, {
                    position: 1,
                    alpha: 0
                }]
            },
            i = t || {};
        n.extendObject(a, i);
        for (var o = a.width, r = o / 2, s = r * a.gradientSizeRel, l = {
                x: a.centerPos.x * o,
                y: a.centerPos.y * o
            }, d = e.add.bitmapData(o, o), u = d.context.createRadialGradient(l.x, l.y, 0, l.x, l.y, s), h = e.add.sprite(0, 0, d), p = 0; p < a.colorStops.length; p++) {
            var g = a.colorStops[p],
                m = n.hexToRgba(a.color, g.alpha);
            u.addColorStop(g.position, m)
        }
        return d.circle(r, r, r, u), h
    }, Phaser.Plugin.CTAnimations.prototype.drawBubbleSprite = function(e, t) {
        var n = e.game.CTHelpers,
            a = e.game.CTAnimations,
            i = {
                width: 120,
                gradientSizeRel: 1.5,
                centerPos: {
                    x: .65,
                    y: .2
                },
                color: "#fff",
                colorStops: [{
                    position: 0,
                    alpha: .8
                }, {
                    position: .06,
                    alpha: .8
                }, {
                    position: .3,
                    alpha: .5
                }, {
                    position: .75,
                    alpha: 0
                }, {
                    position: 1,
                    alpha: .2
                }]
            },
            o = t || {};
        return n.extendObject(i, o), a.drawGradientCircle(e, i)
    }, Phaser.Plugin.CTAnimations.prototype.initFloatingAnimation = function(e, t) {
        var n = e.game.CTHelpers,
            a = {
                spriteKey: "floatingEls",
                bgSpriteKey: null,
                bgSpriteDynamic: null,
                bgSpriteRelativeSize: 1.3,
                bgSpriteConfig: {},
                numFrames: 5,
                numItems: 40,
                itemSize: {
                    min: 35,
                    max: 100
                },
                itemAlpha: {
                    min: 1,
                    max: 1
                },
                durationRange: {
                    min: 12e3,
                    max: 24e3
                },
                rotationMax: 2 * Math.PI,
                rotationStart: {
                    min: -Math.PI / 4,
                    max: Math.PI / 4
                },
                allowDrag: !0,
                safeContent: null,
                foregroundContent: e.game.navElements,
                floatDirection: null,
                sortProperty: "width",
                sortOrder: "SORT_ASCENDING",
                soundFX: null,
                loopSoundFX: !0,
                onDragStart: pauseFloatingTweens,
                onDragStop: startFloatingTweens
            },
            i = t || {};
        n.extendObject(a, i);
        for (var o = a.safeContent && (a.safeContent.width + 40) / e.game.width, r = o && o > 0 ? 2 : 1, s = r > 1 ? (1 - o) / r : 1, l = Math.max(1, Math.floor(a.numItems / r)), d = Math.min(Math.floor(s / .1), l), u = Math.max(1, Math.floor(l / d)), h = e.game.width / d * s, p = e.game.height / u, g = e.game.cache._cache.image[a.spriteKey].frameWidth, m = {
                min: a.itemSize.min / g,
                max: a.itemSize.max / g
            }, c = m.max, f = [], b = 0; b < a.numItems; b++) {
            var y, v, x, S = e.add.sprite(0, 0, a.spriteKey),
                P = Math.floor(b / r) % u,
                w = Math.floor(b / u / r) % d,
                T = b % r,
                C = n.getRandomArbitrary(Math.abs(S.width / 8), Math.abs(h - S.width / 8)),
                B = n.getRandomArbitrary(Math.abs(S.height / 2), Math.abs(p - S.height / 2)),
                D = T > 0 ? c : c = [Math.pow(Math.random(), 2), m.min, m.max].sort()[1],
                F = r > 1 && a.numFrames <= a.numItems / r && a.numFrames % r === 0 ? r : 1,
                O = Math.floor(b / F) % a.numFrames,
                M = T * e.game.width + Math.pow(-1, T) * (w * h + C),
                I = B + p * P;
            if (S.anchor.set(.5, .5), n.extendObject(S, {
                    frame: O,
                    rotation: n.getRandomArbitrary(a.rotationStart.min, a.rotationStart.max),
                    rotation_target: n.getRandomArbitrary(0, a.rotationMax) * n.getRandomSign(),
                    rot_duration: n.getRandomInt(a.durationRange.min, a.durationRange.max),
                    anim_tweens: {}
                }), S.initialRotation = S.rotation, a.bgSpriteDynamic || a.bgSpriteKey) {
                if (a.bgSpriteDynamic) {
                    var A = a.bgSpriteDynamic.constructorFunction,
                        H = a.bgSpriteDynamic.context,
                        E = a.bgSpriteRelativeSize,
                        L = a.bgSpriteConfig;
                    L.width = g * E, y = A(H, L)
                } else y = e.add.sprite(0, 0, a.bgSpriteKey);
                y.anchor.set(.5, .5), y.addChild(S)
            }
            x = y || S, v = x.children[0] || x, "up" === a.floatDirection && (x.upward_duration = n.getRandomInt(a.durationRange.min, a.durationRange.min), I = I + e.game.height + x.height), x.scale.set(D), n.extendObject(x, {
                x: M,
                y: I,
                initialPos: {
                    x: M,
                    y: I
                },
                alpha: n.getRandomArbitrary(a.itemAlpha.min, a.itemAlpha.max),
                rot_duration: n.getRandomInt(a.durationRange.min, a.durationRange.max),
                anim_tweens: {}
            }), v.alpha = 0, initFloatingTweens(x, a.floatDirection), a.allowDrag && (x.inputEnabled = !0, x.input.enableDrag(), n.bindInput(x, {
                onDragStart: a.onDragStart,
                onDragStop: a.onDragStop
            }, e)), f.push(x)
        }
        var k = n.newGroup(f, e);
        return k.config = a, a.sortProperty && k.sort(a.sortProperty, Phaser.Group[a.sortProperty]), a.foregroundContent && e.game.world.bringToTop(a.foregroundContent), a.soundFX && (a.loopSoundFX && !a.loopSoundFX.playing ? a.soundFX.loopFull() : (a.soundFX.paused ? a.soundFX.resume() : a.soundFX.play(), e.game.time.events.add(a.durationRange.max / 2, function() {
            a.soundFX.pause()
        }))), k
    }, Phaser.Plugin.CTAnimations.prototype.shutdownFloatingAnimation = function(e) {
        e.config.soundFX && e.config.soundFX.stop();
        for (var t = 0; t < e.children.length; t++) toggleFloatingTweens(e.children[t].anim_tweens, "stop")
    }, Phaser.Plugin.CTAnimations.prototype.initBubbleWipe = function(e, t) {
        var n = e.game.CTAnimations,
            a = e.game.CTHelpers,
            i = {
                bgSpriteDynamic: {
                    constructorFunction: n.drawBubbleSprite,
                    context: e
                },
                numItems: 100,
                itemSize: {
                    min: 80,
                    max: 150
                },
                itemAlpha: {
                    min: .7,
                    max: 1
                },
                rotationMax: Math.PI / 1.5,
                rotationStart: {
                    min: -Math.PI / 8,
                    max: Math.PI / 8
                },
                durationRange: {
                    min: 1800,
                    max: 6e3
                },
                floatDirection: "up",
                sortProperty: "alpha",
                allowDrag: !1,
                soundFX: e.game.bubbleLoop,
                loopSoundFX: !1
            },
            o = t || {};
        return a.extendObject(i, o), n.initFloatingAnimation(e, i)
    },
    function(e) {
        function t(e, t, n) {
            this.x = e, this.y = t, this.z = n
        }

        function n(e) {
            return e * e * e * (e * (6 * e - 15) + 10)
        }

        function a(e, t, n) {
            return (1 - n) * e + n * t
        }
        var i = e.noise = {};
        t.prototype.dot2 = function(e, t) {
            return this.x * e + this.y * t
        }, t.prototype.dot3 = function(e, t, n) {
            return this.x * e + this.y * t + this.z * n
        };
        var o = [new t(1, 1, 0), new t((-1), 1, 0), new t(1, (-1), 0), new t((-1), (-1), 0), new t(1, 0, 1), new t((-1), 0, 1), new t(1, 0, (-1)), new t((-1), 0, (-1)), new t(0, 1, 1), new t(0, (-1), 1), new t(0, 1, (-1)), new t(0, (-1), (-1))],
            r = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180],
            s = new Array(512),
            l = new Array(512);
        i.seed = function(e) {
            e > 0 && e < 1 && (e *= 65536), e = Math.floor(e), e < 256 && (e |= e << 8);
            for (var t = 0; t < 256; t++) {
                var n;
                n = 1 & t ? r[t] ^ 255 & e : r[t] ^ e >> 8 & 255, s[t] = s[t + 256] = n, l[t] = l[t + 256] = o[n % 12]
            }
        }, i.seed(0);
        var d = .5 * (Math.sqrt(3) - 1),
            u = (3 - Math.sqrt(3)) / 6,
            h = 1 / 3,
            p = 1 / 6;
        i.simplex2 = function(e, t) {
            var n, a, i, o, r, h = (e + t) * d,
                p = Math.floor(e + h),
                g = Math.floor(t + h),
                m = (p + g) * u,
                c = e - p + m,
                f = t - g + m;
            c > f ? (o = 1, r = 0) : (o = 0, r = 1);
            var b = c - o + u,
                y = f - r + u,
                v = c - 1 + 2 * u,
                x = f - 1 + 2 * u;
            p &= 255, g &= 255;
            var S = l[p + s[g]],
                P = l[p + o + s[g + r]],
                w = l[p + 1 + s[g + 1]],
                T = .5 - c * c - f * f;
            T < 0 ? n = 0 : (T *= T, n = T * T * S.dot2(c, f));
            var C = .5 - b * b - y * y;
            C < 0 ? a = 0 : (C *= C, a = C * C * P.dot2(b, y));
            var B = .5 - v * v - x * x;
            return B < 0 ? i = 0 : (B *= B, i = B * B * w.dot2(v, x)), 70 * (n + a + i)
        }, i.simplex3 = function(e, t, n) {
            var a, i, o, r, d, u, g, m, c, f, b = (e + t + n) * h,
                y = Math.floor(e + b),
                v = Math.floor(t + b),
                x = Math.floor(n + b),
                S = (y + v + x) * p,
                P = e - y + S,
                w = t - v + S,
                T = n - x + S;
            P >= w ? w >= T ? (d = 1, u = 0, g = 0, m = 1, c = 1, f = 0) : P >= T ? (d = 1, u = 0, g = 0, m = 1, c = 0, f = 1) : (d = 0, u = 0, g = 1, m = 1, c = 0, f = 1) : w < T ? (d = 0, u = 0, g = 1, m = 0, c = 1, f = 1) : P < T ? (d = 0, u = 1, g = 0, m = 0, c = 1, f = 1) : (d = 0, u = 1, g = 0, m = 1, c = 1, f = 0);
            var C = P - d + p,
                B = w - u + p,
                D = T - g + p,
                F = P - m + 2 * p,
                O = w - c + 2 * p,
                M = T - f + 2 * p,
                I = P - 1 + 3 * p,
                A = w - 1 + 3 * p,
                H = T - 1 + 3 * p;
            y &= 255, v &= 255, x &= 255;
            var E = l[y + s[v + s[x]]],
                L = l[y + d + s[v + u + s[x + g]]],
                k = l[y + m + s[v + c + s[x + f]]],
                _ = l[y + 1 + s[v + 1 + s[x + 1]]],
                G = .6 - P * P - w * w - T * T;
            G < 0 ? a = 0 : (G *= G, a = G * G * E.dot3(P, w, T));
            var R = .6 - C * C - B * B - D * D;
            R < 0 ? i = 0 : (R *= R, i = R * R * L.dot3(C, B, D));
            var W = .6 - F * F - O * O - M * M;
            W < 0 ? o = 0 : (W *= W, o = W * W * k.dot3(F, O, M));
            var N = .6 - I * I - A * A - H * H;
            return N < 0 ? r = 0 : (N *= N, r = N * N * _.dot3(I, A, H)), 32 * (a + i + o + r)
        }, i.perlin2 = function(e, t) {
            var i = Math.floor(e),
                o = Math.floor(t);
            e -= i, t -= o, i = 255 & i, o = 255 & o;
            var r = l[i + s[o]].dot2(e, t),
                d = l[i + s[o + 1]].dot2(e, t - 1),
                u = l[i + 1 + s[o]].dot2(e - 1, t),
                h = l[i + 1 + s[o + 1]].dot2(e - 1, t - 1),
                p = n(e);
            return a(a(r, u, p), a(d, h, p), n(t))
        }, i.perlin3 = function(e, t, i) {
            var o = Math.floor(e),
                r = Math.floor(t),
                d = Math.floor(i);
            e -= o, t -= r, i -= d, o = 255 & o, r = 255 & r, d = 255 & d;
            var u = l[o + s[r + s[d]]].dot3(e, t, i),
                h = l[o + s[r + s[d + 1]]].dot3(e, t, i - 1),
                p = l[o + s[r + 1 + s[d]]].dot3(e, t - 1, i),
                g = l[o + s[r + 1 + s[d + 1]]].dot3(e, t - 1, i - 1),
                m = l[o + 1 + s[r + s[d]]].dot3(e - 1, t, i),
                c = l[o + 1 + s[r + s[d + 1]]].dot3(e - 1, t, i - 1),
                f = l[o + 1 + s[r + 1 + s[d]]].dot3(e - 1, t - 1, i),
                b = l[o + 1 + s[r + 1 + s[d + 1]]].dot3(e - 1, t - 1, i - 1),
                y = n(e),
                v = n(t),
                x = n(i);
            return a(a(a(u, m, y), a(h, c, y), x), a(a(p, f, y), a(g, b, y), x), v)
        }
    }(this), Number.prototype.map = function(e, t, n, a) {
        return (this - e) * (a - n) / (t - e) + n
    }, Math.dist = function(e, t, n, a) {
        return n || (n = 0), a || (a = 0), Math.sqrt((n - e) * (n - e) + (a - t) * (a - t))
    }, Bubble.prototype.draw = function() {
        var e = this.game;
        if (this.bitmapData && this.bitmapData.clear(), this.popProcessHasBegun && "undefined" == typeof this.popStartTimestamp && (this.popStartTimestamp = Date.now()), this.popProcessHasBegun && Date.now() - this.popStartTimestamp > this.durationOfExpansionBeforeBurst) {
            if (0 === this.bubbles.length)
                for (var t = this.bubblesCountMin + Math.round(Math.random() * (this.bubblesCountMax - this.bubblesCountMin)), n = Math.PI * Math.pow(.5 * this.diameter, 2), a = n / t, i = 2 * a, o = 0; o < t; o++) {
                    var r = a + Math.random() * (i - a),
                        s = .75 * Math.pow(r / Math.PI, .5),
                        l = 2 * Math.random() * Math.PI,
                        d = .5 * Math.random() * this.diameter - .5 * s;
                    this.bubbles.push(new Bubble(e, {
                        x: this.x + d * Math.cos(l),
                        y: this.y + d * Math.sin(l),
                        diameter: s,
                        fillGradient: this.fillGradient,
                        isOriginBubble: !1,
                        popStartTimestamp: Date.now()
                    }))
                }
            for (var o = 0; o < this.bubbles.length; o++) {
                this.bubbles[o].bitmapData && this.bubbles[o].bitmapData.clear();
                var u = this.bubbles[o].diameter + this.bubbles[o].strokeWidth + 2 * this.bubbles[o].padding,
                    h = u;
                this.bubbles[o].bitmapData = e.make.bitmapData(u, h);
                var p = Date.now() - this.bubbles[o].popStartTimestamp,
                    g = (.001 * this.bubbles[o].randomOffset, .5 * this.bubbles[o].bitmapData.width, .5 * this.bubbles[o].bitmapData.height, noise.perlin2(.001 * p + this.bubbles[o].randomOffset, 0)),
                    m = g.map(-.5, .5, -20, 20),
                    c = g.map(-.5, .5, 0, 10),
                    f = 1 + 3e-4 * p,
                    b = this.bubbles[o].x + m,
                    y = this.bubbles[o].y - .15 * f * p - c;
                this.bubbles[o].fillGradient && this.bubbles[o].fillGradient.texture && this.bubbles[o].fillGradient.texture.length > 0 && this.bubbles[o].createCircleWithFillGradientBitmapData(), this.bubbles[o].sprite && this.bubbles[o].sprite.destroy(), this.bubbles[o].sprite = e.add.sprite(b - .5 * this.bubbles[o].bitmapData.width - this.bubbles[o].padding, y - .5 * this.bubbles[o].bitmapData.height - this.bubbles[o].padding, this.bubbles[o].bitmapData)
            }
        } else this.popStartTimestamp && (this.diameter += 1), this.bitmapData = e.make.bitmapData(this.diameter + this.strokeWidth + 2 * this.padding, this.diameter + this.strokeWidth + 2 * this.padding), this.fillGradient && this.fillGradient.texture && this.fillGradient.texture.length > 0 && this.createCircleWithFillGradientBitmapData();
        this.sprite && this.sprite.destroy(), this.sprite = e.add.sprite(this.x - .5 * (this.diameter + this.strokeWidth) + this.padding, this.y - .5 * (this.diameter + this.strokeWidth) + this.padding, this.bitmapData)
    }, Bubble.prototype.generateBitmapData = function() {
        var e = this;
        return this.draw(), this.sprite.alpha = 0, setTimeout(function() {
            e.sprite.destroy()
        }, 10, e.sprite), this.bitmapData
    }, Bubble.prototype.pop = function() {
        this.popProcessHasBegun = !0
    };
var visibleLittleBubblesPresent = !1,
    numVisibleLittleBubbles = 0;