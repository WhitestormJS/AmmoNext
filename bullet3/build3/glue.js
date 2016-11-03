
// Bindings utilities

function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare: function() {
    if (this.needed) {
      // clear the temps
      for (var i = 0; i < this.temps.length; i++) {
        Module['_free'](this.temps[i]);
      }
      this.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_free'](this.buffer);
      this.buffer = 0;
      this.size += this.needed;
      // clean up
      this.needed = 0;
    }
    if (!this.buffer) { // happens first time, or when we need to grow
      this.size += 128; // heuristic, avoid many small grow events
      this.buffer = Module['_malloc'](this.size);
      assert(this.buffer);
    }
    this.pos = 0;
  },
  alloc: function(array, view) {
    assert(this.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = (len + 7) & -8; // keep things aligned to 8 byte boundaries
    var ret;
    if (this.pos + len >= this.size) {
      // we failed to allocate in the buffer, this time around :(
      assert(len > 0); // null terminator, at least
      this.needed += len;
      ret = Module['_malloc'](len);
      this.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = this.buffer + this.pos;
      this.pos += len;
    }
    var retShifted = ret;
    switch (bytes) {
      case 2: retShifted >>= 1; break;
      case 4: retShifted >>= 2; break;
      case 8: retShifted >>= 3; break;
    }
    for (var i = 0; i < array.length; i++) {
      view[retShifted + i] = array[i];
    }
    return ret;
  },
};

function ensureString(value) {
  if (typeof value === 'string') return ensureCache.alloc(intArrayFromString(value), HEAP8);
  return value;
}
function ensureInt8(value) {
  if (typeof value === 'object') return ensureCache.alloc(value, HEAP8);
  return value;
}
function ensureInt16(value) {
  if (typeof value === 'object') return ensureCache.alloc(value, HEAP16);
  return value;
}
function ensureInt32(value) {
  if (typeof value === 'object') return ensureCache.alloc(value, HEAP32);
  return value;
}
function ensureFloat32(value) {
  if (typeof value === 'object') return ensureCache.alloc(value, HEAPF32);
  return value;
}
function ensureFloat64(value) {
  if (typeof value === 'object') return ensureCache.alloc(value, HEAPF64);
  return value;
}


// btCollisionWorld
function btCollisionWorld() { throw "cannot construct a btCollisionWorld, no constructor in IDL" }
btCollisionWorld.prototype = Object.create(WrapperObject.prototype);
btCollisionWorld.prototype.constructor = btCollisionWorld;
btCollisionWorld.prototype.__class__ = btCollisionWorld;
btCollisionWorld.__cache__ = {};
Module['btCollisionWorld'] = btCollisionWorld;

btCollisionWorld.prototype['getDispatcher'] = btCollisionWorld.prototype.getDispatcher = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getDispatcher_0(self), btDispatcher);
};;

btCollisionWorld.prototype['rayTest'] = btCollisionWorld.prototype.rayTest = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btCollisionWorld_rayTest_3(self, arg0, arg1, arg2);
};;

btCollisionWorld.prototype['getPairCache'] = btCollisionWorld.prototype.getPairCache = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getPairCache_0(self), btOverlappingPairCache);
};;

btCollisionWorld.prototype['getDispatchInfo'] = btCollisionWorld.prototype.getDispatchInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getDispatchInfo_0(self), btDispatcherInfo);
};;

btCollisionWorld.prototype['addCollisionObject'] = btCollisionWorld.prototype.addCollisionObject = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btCollisionWorld_addCollisionObject_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btCollisionWorld_addCollisionObject_2(self, arg0, arg1);  return }
  _emscripten_bind_btCollisionWorld_addCollisionObject_3(self, arg0, arg1, arg2);
};;

btCollisionWorld.prototype['getBroadphase'] = btCollisionWorld.prototype.getBroadphase = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getBroadphase_0(self), btBroadphaseInterface);
};;

btCollisionWorld.prototype['convexSweepTest'] = btCollisionWorld.prototype.convexSweepTest = function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btCollisionWorld_convexSweepTest_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btCollisionWorld.prototype['contactPairTest'] = btCollisionWorld.prototype.contactPairTest = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btCollisionWorld_contactPairTest_3(self, arg0, arg1, arg2);
};;

btCollisionWorld.prototype['contactTest'] = btCollisionWorld.prototype.contactTest = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCollisionWorld_contactTest_2(self, arg0, arg1);
};;

  btCollisionWorld.prototype['__destroy__'] = btCollisionWorld.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionWorld___destroy___0(self);
};
// btCollisionShape
function btCollisionShape() { throw "cannot construct a btCollisionShape, no constructor in IDL" }
btCollisionShape.prototype = Object.create(WrapperObject.prototype);
btCollisionShape.prototype.constructor = btCollisionShape;
btCollisionShape.prototype.__class__ = btCollisionShape;
btCollisionShape.__cache__ = {};
Module['btCollisionShape'] = btCollisionShape;

btCollisionShape.prototype['setLocalScaling'] = btCollisionShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionShape_setLocalScaling_1(self, arg0);
};;

btCollisionShape.prototype['calculateLocalInertia'] = btCollisionShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCollisionShape_calculateLocalInertia_2(self, arg0, arg1);
};;

btCollisionShape.prototype['setMargin'] = btCollisionShape.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionShape_setMargin_1(self, arg0);
};;

btCollisionShape.prototype['getMargin'] = btCollisionShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionShape_getMargin_0(self);
};;

  btCollisionShape.prototype['__destroy__'] = btCollisionShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionShape___destroy___0(self);
};
// btCollisionObject
function btCollisionObject() { throw "cannot construct a btCollisionObject, no constructor in IDL" }
btCollisionObject.prototype = Object.create(WrapperObject.prototype);
btCollisionObject.prototype.constructor = btCollisionObject;
btCollisionObject.prototype.__class__ = btCollisionObject;
btCollisionObject.__cache__ = {};
Module['btCollisionObject'] = btCollisionObject;

btCollisionObject.prototype['setAnisotropicFriction'] = btCollisionObject.prototype.setAnisotropicFriction = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCollisionObject_setAnisotropicFriction_2(self, arg0, arg1);
};;

btCollisionObject.prototype['getCollisionShape'] = btCollisionObject.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObject_getCollisionShape_0(self), btCollisionShape);
};;

btCollisionObject.prototype['setContactProcessingThreshold'] = btCollisionObject.prototype.setContactProcessingThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setContactProcessingThreshold_1(self, arg0);
};;

btCollisionObject.prototype['setActivationState'] = btCollisionObject.prototype.setActivationState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setActivationState_1(self, arg0);
};;

btCollisionObject.prototype['forceActivationState'] = btCollisionObject.prototype.forceActivationState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_forceActivationState_1(self, arg0);
};;

btCollisionObject.prototype['activate'] = btCollisionObject.prototype.activate = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { _emscripten_bind_btCollisionObject_activate_0(self);  return }
  _emscripten_bind_btCollisionObject_activate_1(self, arg0);
};;

btCollisionObject.prototype['isActive'] = btCollisionObject.prototype.isActive = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btCollisionObject_isActive_0(self));
};;

btCollisionObject.prototype['isKinematicObject'] = btCollisionObject.prototype.isKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btCollisionObject_isKinematicObject_0(self));
};;

btCollisionObject.prototype['setRestitution'] = btCollisionObject.prototype.setRestitution = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setRestitution_1(self, arg0);
};;

btCollisionObject.prototype['setFriction'] = btCollisionObject.prototype.setFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setFriction_1(self, arg0);
};;

btCollisionObject.prototype['setRollingFriction'] = btCollisionObject.prototype.setRollingFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setRollingFriction_1(self, arg0);
};;

btCollisionObject.prototype['getWorldTransform'] = btCollisionObject.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObject_getWorldTransform_0(self), btTransform);
};;

btCollisionObject.prototype['getCollisionFlags'] = btCollisionObject.prototype.getCollisionFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionObject_getCollisionFlags_0(self);
};;

btCollisionObject.prototype['setCollisionFlags'] = btCollisionObject.prototype.setCollisionFlags = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setCollisionFlags_1(self, arg0);
};;

btCollisionObject.prototype['setWorldTransform'] = btCollisionObject.prototype.setWorldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setWorldTransform_1(self, arg0);
};;

btCollisionObject.prototype['setCollisionShape'] = btCollisionObject.prototype.setCollisionShape = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setCollisionShape_1(self, arg0);
};;

btCollisionObject.prototype['setCcdMotionThreshold'] = btCollisionObject.prototype.setCcdMotionThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setCcdMotionThreshold_1(self, arg0);
};;

btCollisionObject.prototype['setCcdSweptSphereRadius'] = btCollisionObject.prototype.setCcdSweptSphereRadius = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1(self, arg0);
};;

btCollisionObject.prototype['getUserIndex'] = btCollisionObject.prototype.getUserIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionObject_getUserIndex_0(self);
};;

btCollisionObject.prototype['setUserIndex'] = btCollisionObject.prototype.setUserIndex = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setUserIndex_1(self, arg0);
};;

btCollisionObject.prototype['getUserPointer'] = btCollisionObject.prototype.getUserPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObject_getUserPointer_0(self), VoidPtr);
};;

btCollisionObject.prototype['setUserPointer'] = btCollisionObject.prototype.setUserPointer = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setUserPointer_1(self, arg0);
};;

  btCollisionObject.prototype['__destroy__'] = btCollisionObject.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionObject___destroy___0(self);
};
// btDynamicsWorld
function btDynamicsWorld() { throw "cannot construct a btDynamicsWorld, no constructor in IDL" }
btDynamicsWorld.prototype = Object.create(btCollisionWorld.prototype);
btDynamicsWorld.prototype.constructor = btDynamicsWorld;
btDynamicsWorld.prototype.__class__ = btDynamicsWorld;
btDynamicsWorld.__cache__ = {};
Module['btDynamicsWorld'] = btDynamicsWorld;

btDynamicsWorld.prototype['addAction'] = btDynamicsWorld.prototype.addAction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDynamicsWorld_addAction_1(self, arg0);
};;

btDynamicsWorld.prototype['removeAction'] = btDynamicsWorld.prototype.removeAction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDynamicsWorld_removeAction_1(self, arg0);
};;

btDynamicsWorld.prototype['getSolverInfo'] = btDynamicsWorld.prototype.getSolverInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getSolverInfo_0(self), btContactSolverInfo);
};;

btDynamicsWorld.prototype['getDispatcher'] = btDynamicsWorld.prototype.getDispatcher = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getDispatcher_0(self), btDispatcher);
};;

btDynamicsWorld.prototype['rayTest'] = btDynamicsWorld.prototype.rayTest = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDynamicsWorld_rayTest_3(self, arg0, arg1, arg2);
};;

btDynamicsWorld.prototype['getPairCache'] = btDynamicsWorld.prototype.getPairCache = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getPairCache_0(self), btOverlappingPairCache);
};;

btDynamicsWorld.prototype['getDispatchInfo'] = btDynamicsWorld.prototype.getDispatchInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getDispatchInfo_0(self), btDispatcherInfo);
};;

btDynamicsWorld.prototype['addCollisionObject'] = btDynamicsWorld.prototype.addCollisionObject = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btDynamicsWorld_addCollisionObject_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btDynamicsWorld_addCollisionObject_2(self, arg0, arg1);  return }
  _emscripten_bind_btDynamicsWorld_addCollisionObject_3(self, arg0, arg1, arg2);
};;

btDynamicsWorld.prototype['getBroadphase'] = btDynamicsWorld.prototype.getBroadphase = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getBroadphase_0(self), btBroadphaseInterface);
};;

btDynamicsWorld.prototype['convexSweepTest'] = btDynamicsWorld.prototype.convexSweepTest = function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btDynamicsWorld_convexSweepTest_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btDynamicsWorld.prototype['contactPairTest'] = btDynamicsWorld.prototype.contactPairTest = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDynamicsWorld_contactPairTest_3(self, arg0, arg1, arg2);
};;

btDynamicsWorld.prototype['contactTest'] = btDynamicsWorld.prototype.contactTest = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btDynamicsWorld_contactTest_2(self, arg0, arg1);
};;

  btDynamicsWorld.prototype['__destroy__'] = btDynamicsWorld.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDynamicsWorld___destroy___0(self);
};
// btTypedConstraint
function btTypedConstraint() { throw "cannot construct a btTypedConstraint, no constructor in IDL" }
btTypedConstraint.prototype = Object.create(WrapperObject.prototype);
btTypedConstraint.prototype.constructor = btTypedConstraint;
btTypedConstraint.prototype.__class__ = btTypedConstraint;
btTypedConstraint.__cache__ = {};
Module['btTypedConstraint'] = btTypedConstraint;

btTypedConstraint.prototype['enableFeedback'] = btTypedConstraint.prototype.enableFeedback = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btTypedConstraint_enableFeedback_1(self, arg0);
};;

btTypedConstraint.prototype['getBreakingImpulseThreshold'] = btTypedConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0(self);
};;

btTypedConstraint.prototype['setBreakingImpulseThreshold'] = btTypedConstraint.prototype.setBreakingImpulseThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

  btTypedConstraint.prototype['__destroy__'] = btTypedConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btTypedConstraint___destroy___0(self);
};
// btConcaveShape
function btConcaveShape() { throw "cannot construct a btConcaveShape, no constructor in IDL" }
btConcaveShape.prototype = Object.create(btCollisionShape.prototype);
btConcaveShape.prototype.constructor = btConcaveShape;
btConcaveShape.prototype.__class__ = btConcaveShape;
btConcaveShape.__cache__ = {};
Module['btConcaveShape'] = btConcaveShape;

btConcaveShape.prototype['setLocalScaling'] = btConcaveShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConcaveShape_setLocalScaling_1(self, arg0);
};;

btConcaveShape.prototype['calculateLocalInertia'] = btConcaveShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConcaveShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btConcaveShape.prototype['__destroy__'] = btConcaveShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConcaveShape___destroy___0(self);
};
// btCapsuleShape
function btCapsuleShape(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  this.ptr = _emscripten_bind_btCapsuleShape_btCapsuleShape_2(arg0, arg1);
  getCache(btCapsuleShape)[this.ptr] = this;
};;
btCapsuleShape.prototype = Object.create(btCollisionShape.prototype);
btCapsuleShape.prototype.constructor = btCapsuleShape;
btCapsuleShape.prototype.__class__ = btCapsuleShape;
btCapsuleShape.__cache__ = {};
Module['btCapsuleShape'] = btCapsuleShape;

btCapsuleShape.prototype['setMargin'] = btCapsuleShape.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShape_setMargin_1(self, arg0);
};;

btCapsuleShape.prototype['getMargin'] = btCapsuleShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShape_getMargin_0(self);
};;

btCapsuleShape.prototype['setLocalScaling'] = btCapsuleShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShape_setLocalScaling_1(self, arg0);
};;

btCapsuleShape.prototype['calculateLocalInertia'] = btCapsuleShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCapsuleShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCapsuleShape.prototype['__destroy__'] = btCapsuleShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCapsuleShape___destroy___0(self);
};
// btDefaultCollisionConfiguration
function btDefaultCollisionConfiguration(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { this.ptr = _emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0(); getCache(btDefaultCollisionConfiguration)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1(arg0);
  getCache(btDefaultCollisionConfiguration)[this.ptr] = this;
};;
btDefaultCollisionConfiguration.prototype = Object.create(WrapperObject.prototype);
btDefaultCollisionConfiguration.prototype.constructor = btDefaultCollisionConfiguration;
btDefaultCollisionConfiguration.prototype.__class__ = btDefaultCollisionConfiguration;
btDefaultCollisionConfiguration.__cache__ = {};
Module['btDefaultCollisionConfiguration'] = btDefaultCollisionConfiguration;

  btDefaultCollisionConfiguration.prototype['__destroy__'] = btDefaultCollisionConfiguration.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultCollisionConfiguration___destroy___0(self);
};
// ConvexResultCallback
function ConvexResultCallback() { throw "cannot construct a ConvexResultCallback, no constructor in IDL" }
ConvexResultCallback.prototype = Object.create(WrapperObject.prototype);
ConvexResultCallback.prototype.constructor = ConvexResultCallback;
ConvexResultCallback.prototype.__class__ = ConvexResultCallback;
ConvexResultCallback.__cache__ = {};
Module['ConvexResultCallback'] = ConvexResultCallback;

ConvexResultCallback.prototype['hasHit'] = ConvexResultCallback.prototype.hasHit = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ConvexResultCallback_hasHit_0(self));
};;

  ConvexResultCallback.prototype['get_m_collisionFilterGroup'] = ConvexResultCallback.prototype.get_m_collisionFilterGroup = function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0(self);
};
    ConvexResultCallback.prototype['set_m_collisionFilterGroup'] = ConvexResultCallback.prototype.set_m_collisionFilterGroup = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};
  ConvexResultCallback.prototype['get_m_collisionFilterMask'] = ConvexResultCallback.prototype.get_m_collisionFilterMask = function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0(self);
};
    ConvexResultCallback.prototype['set_m_collisionFilterMask'] = ConvexResultCallback.prototype.set_m_collisionFilterMask = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1(self, arg0);
};
  ConvexResultCallback.prototype['get_m_closestHitFraction'] = ConvexResultCallback.prototype.get_m_closestHitFraction = function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0(self);
};
    ConvexResultCallback.prototype['set_m_closestHitFraction'] = ConvexResultCallback.prototype.set_m_closestHitFraction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1(self, arg0);
};
  ConvexResultCallback.prototype['__destroy__'] = ConvexResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ConvexResultCallback___destroy___0(self);
};
// btTriangleMeshShape
function btTriangleMeshShape() { throw "cannot construct a btTriangleMeshShape, no constructor in IDL" }
btTriangleMeshShape.prototype = Object.create(btConcaveShape.prototype);
btTriangleMeshShape.prototype.constructor = btTriangleMeshShape;
btTriangleMeshShape.prototype.__class__ = btTriangleMeshShape;
btTriangleMeshShape.__cache__ = {};
Module['btTriangleMeshShape'] = btTriangleMeshShape;

btTriangleMeshShape.prototype['setLocalScaling'] = btTriangleMeshShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btTriangleMeshShape_setLocalScaling_1(self, arg0);
};;

btTriangleMeshShape.prototype['calculateLocalInertia'] = btTriangleMeshShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btTriangleMeshShape.prototype['__destroy__'] = btTriangleMeshShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btTriangleMeshShape___destroy___0(self);
};
// btGhostObject
function btGhostObject() {
  this.ptr = _emscripten_bind_btGhostObject_btGhostObject_0();
  getCache(btGhostObject)[this.ptr] = this;
};;
btGhostObject.prototype = Object.create(btCollisionObject.prototype);
btGhostObject.prototype.constructor = btGhostObject;
btGhostObject.prototype.__class__ = btGhostObject;
btGhostObject.__cache__ = {};
Module['btGhostObject'] = btGhostObject;

btGhostObject.prototype['getNumOverlappingObjects'] = btGhostObject.prototype.getNumOverlappingObjects = function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getNumOverlappingObjects_0(self);
};;

btGhostObject.prototype['getOverlappingObject'] = btGhostObject.prototype.getOverlappingObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getOverlappingObject_1(self, arg0), btCollisionObject);
};;

btGhostObject.prototype['setAnisotropicFriction'] = btGhostObject.prototype.setAnisotropicFriction = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btGhostObject_setAnisotropicFriction_2(self, arg0, arg1);
};;

btGhostObject.prototype['getCollisionShape'] = btGhostObject.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getCollisionShape_0(self), btCollisionShape);
};;

btGhostObject.prototype['setContactProcessingThreshold'] = btGhostObject.prototype.setContactProcessingThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setContactProcessingThreshold_1(self, arg0);
};;

btGhostObject.prototype['setActivationState'] = btGhostObject.prototype.setActivationState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setActivationState_1(self, arg0);
};;

btGhostObject.prototype['forceActivationState'] = btGhostObject.prototype.forceActivationState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_forceActivationState_1(self, arg0);
};;

btGhostObject.prototype['activate'] = btGhostObject.prototype.activate = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { _emscripten_bind_btGhostObject_activate_0(self);  return }
  _emscripten_bind_btGhostObject_activate_1(self, arg0);
};;

btGhostObject.prototype['isActive'] = btGhostObject.prototype.isActive = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGhostObject_isActive_0(self));
};;

btGhostObject.prototype['isKinematicObject'] = btGhostObject.prototype.isKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGhostObject_isKinematicObject_0(self));
};;

btGhostObject.prototype['setRestitution'] = btGhostObject.prototype.setRestitution = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setRestitution_1(self, arg0);
};;

btGhostObject.prototype['setFriction'] = btGhostObject.prototype.setFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setFriction_1(self, arg0);
};;

btGhostObject.prototype['setRollingFriction'] = btGhostObject.prototype.setRollingFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setRollingFriction_1(self, arg0);
};;

btGhostObject.prototype['getWorldTransform'] = btGhostObject.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getWorldTransform_0(self), btTransform);
};;

btGhostObject.prototype['getCollisionFlags'] = btGhostObject.prototype.getCollisionFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getCollisionFlags_0(self);
};;

btGhostObject.prototype['setCollisionFlags'] = btGhostObject.prototype.setCollisionFlags = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setCollisionFlags_1(self, arg0);
};;

btGhostObject.prototype['setWorldTransform'] = btGhostObject.prototype.setWorldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setWorldTransform_1(self, arg0);
};;

btGhostObject.prototype['setCollisionShape'] = btGhostObject.prototype.setCollisionShape = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setCollisionShape_1(self, arg0);
};;

btGhostObject.prototype['setCcdMotionThreshold'] = btGhostObject.prototype.setCcdMotionThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setCcdMotionThreshold_1(self, arg0);
};;

btGhostObject.prototype['setCcdSweptSphereRadius'] = btGhostObject.prototype.setCcdSweptSphereRadius = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1(self, arg0);
};;

btGhostObject.prototype['getUserIndex'] = btGhostObject.prototype.getUserIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getUserIndex_0(self);
};;

btGhostObject.prototype['setUserIndex'] = btGhostObject.prototype.setUserIndex = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setUserIndex_1(self, arg0);
};;

btGhostObject.prototype['getUserPointer'] = btGhostObject.prototype.getUserPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getUserPointer_0(self), VoidPtr);
};;

btGhostObject.prototype['setUserPointer'] = btGhostObject.prototype.setUserPointer = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setUserPointer_1(self, arg0);
};;

  btGhostObject.prototype['__destroy__'] = btGhostObject.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGhostObject___destroy___0(self);
};
// btConeShape
function btConeShape(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  this.ptr = _emscripten_bind_btConeShape_btConeShape_2(arg0, arg1);
  getCache(btConeShape)[this.ptr] = this;
};;
btConeShape.prototype = Object.create(btCollisionShape.prototype);
btConeShape.prototype.constructor = btConeShape;
btConeShape.prototype.__class__ = btConeShape;
btConeShape.__cache__ = {};
Module['btConeShape'] = btConeShape;

btConeShape.prototype['setLocalScaling'] = btConeShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeShape_setLocalScaling_1(self, arg0);
};;

btConeShape.prototype['calculateLocalInertia'] = btConeShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConeShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btConeShape.prototype['__destroy__'] = btConeShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConeShape___destroy___0(self);
};
// btActionInterface
function btActionInterface() { throw "cannot construct a btActionInterface, no constructor in IDL" }
btActionInterface.prototype = Object.create(WrapperObject.prototype);
btActionInterface.prototype.constructor = btActionInterface;
btActionInterface.prototype.__class__ = btActionInterface;
btActionInterface.__cache__ = {};
Module['btActionInterface'] = btActionInterface;

  btActionInterface.prototype['__destroy__'] = btActionInterface.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btActionInterface___destroy___0(self);
};
// btVector3
function btVector3(arg0, arg1, arg2) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg0 === undefined) { this.ptr = _emscripten_bind_btVector3_btVector3_0(); getCache(btVector3)[this.ptr] = this;return }
  if (arg1 === undefined) { this.ptr = _emscripten_bind_btVector3_btVector3_1(arg0); getCache(btVector3)[this.ptr] = this;return }
  if (arg2 === undefined) { this.ptr = _emscripten_bind_btVector3_btVector3_2(arg0, arg1); getCache(btVector3)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btVector3_btVector3_3(arg0, arg1, arg2);
  getCache(btVector3)[this.ptr] = this;
};;
btVector3.prototype = Object.create(WrapperObject.prototype);
btVector3.prototype.constructor = btVector3;
btVector3.prototype.__class__ = btVector3;
btVector3.__cache__ = {};
Module['btVector3'] = btVector3;

btVector3.prototype['length'] = btVector3.prototype.length = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_length_0(self);
};;

btVector3.prototype['x'] = btVector3.prototype.x = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_x_0(self);
};;

btVector3.prototype['y'] = btVector3.prototype.y = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_y_0(self);
};;

btVector3.prototype['z'] = btVector3.prototype.z = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_z_0(self);
};;

btVector3.prototype['setX'] = btVector3.prototype.setX = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector3_setX_1(self, arg0);
};;

btVector3.prototype['setY'] = btVector3.prototype.setY = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector3_setY_1(self, arg0);
};;

btVector3.prototype['setZ'] = btVector3.prototype.setZ = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector3_setZ_1(self, arg0);
};;

btVector3.prototype['setValue'] = btVector3.prototype.setValue = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btVector3_setValue_3(self, arg0, arg1, arg2);
};;

btVector3.prototype['normalize'] = btVector3.prototype.normalize = function() {
  var self = this.ptr;
  _emscripten_bind_btVector3_normalize_0(self);
};;

btVector3.prototype['dot'] = btVector3.prototype.dot = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btVector3_dot_1(self, arg0);
};;

btVector3.prototype['op_mul'] = btVector3.prototype.op_mul = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector3_op_mul_1(self, arg0), btVector3);
};;

btVector3.prototype['op_add'] = btVector3.prototype.op_add = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector3_op_add_1(self, arg0), btVector3);
};;

btVector3.prototype['op_sub'] = btVector3.prototype.op_sub = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector3_op_sub_1(self, arg0), btVector3);
};;

  btVector3.prototype['__destroy__'] = btVector3.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btVector3___destroy___0(self);
};
// btVehicleRaycaster
function btVehicleRaycaster() { throw "cannot construct a btVehicleRaycaster, no constructor in IDL" }
btVehicleRaycaster.prototype = Object.create(WrapperObject.prototype);
btVehicleRaycaster.prototype.constructor = btVehicleRaycaster;
btVehicleRaycaster.prototype.__class__ = btVehicleRaycaster;
btVehicleRaycaster.__cache__ = {};
Module['btVehicleRaycaster'] = btVehicleRaycaster;

  btVehicleRaycaster.prototype['__destroy__'] = btVehicleRaycaster.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btVehicleRaycaster___destroy___0(self);
};
// btQuadWord
function btQuadWord() { throw "cannot construct a btQuadWord, no constructor in IDL" }
btQuadWord.prototype = Object.create(WrapperObject.prototype);
btQuadWord.prototype.constructor = btQuadWord;
btQuadWord.prototype.__class__ = btQuadWord;
btQuadWord.__cache__ = {};
Module['btQuadWord'] = btQuadWord;

btQuadWord.prototype['x'] = btQuadWord.prototype.x = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_x_0(self);
};;

btQuadWord.prototype['y'] = btQuadWord.prototype.y = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_y_0(self);
};;

btQuadWord.prototype['z'] = btQuadWord.prototype.z = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_z_0(self);
};;

btQuadWord.prototype['w'] = btQuadWord.prototype.w = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_w_0(self);
};;

btQuadWord.prototype['setX'] = btQuadWord.prototype.setX = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuadWord_setX_1(self, arg0);
};;

btQuadWord.prototype['setY'] = btQuadWord.prototype.setY = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuadWord_setY_1(self, arg0);
};;

btQuadWord.prototype['setZ'] = btQuadWord.prototype.setZ = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuadWord_setZ_1(self, arg0);
};;

btQuadWord.prototype['setW'] = btQuadWord.prototype.setW = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuadWord_setW_1(self, arg0);
};;

  btQuadWord.prototype['__destroy__'] = btQuadWord.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btQuadWord___destroy___0(self);
};
// btCylinderShape
function btCylinderShape(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btCylinderShape_btCylinderShape_1(arg0);
  getCache(btCylinderShape)[this.ptr] = this;
};;
btCylinderShape.prototype = Object.create(btCollisionShape.prototype);
btCylinderShape.prototype.constructor = btCylinderShape;
btCylinderShape.prototype.__class__ = btCylinderShape;
btCylinderShape.__cache__ = {};
Module['btCylinderShape'] = btCylinderShape;

btCylinderShape.prototype['setMargin'] = btCylinderShape.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShape_setMargin_1(self, arg0);
};;

btCylinderShape.prototype['getMargin'] = btCylinderShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCylinderShape_getMargin_0(self);
};;

btCylinderShape.prototype['setLocalScaling'] = btCylinderShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShape_setLocalScaling_1(self, arg0);
};;

btCylinderShape.prototype['calculateLocalInertia'] = btCylinderShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCylinderShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCylinderShape.prototype['__destroy__'] = btCylinderShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCylinderShape___destroy___0(self);
};
// btDiscreteDynamicsWorld
function btDiscreteDynamicsWorld(arg0, arg1, arg2, arg3) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  this.ptr = _emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4(arg0, arg1, arg2, arg3);
  getCache(btDiscreteDynamicsWorld)[this.ptr] = this;
};;
btDiscreteDynamicsWorld.prototype = Object.create(btDynamicsWorld.prototype);
btDiscreteDynamicsWorld.prototype.constructor = btDiscreteDynamicsWorld;
btDiscreteDynamicsWorld.prototype.__class__ = btDiscreteDynamicsWorld;
btDiscreteDynamicsWorld.__cache__ = {};
Module['btDiscreteDynamicsWorld'] = btDiscreteDynamicsWorld;

btDiscreteDynamicsWorld.prototype['setGravity'] = btDiscreteDynamicsWorld.prototype.setGravity = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_setGravity_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['getGravity'] = btDiscreteDynamicsWorld.prototype.getGravity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getGravity_0(self), btVector3);
};;

btDiscreteDynamicsWorld.prototype['addRigidBody'] = btDiscreteDynamicsWorld.prototype.addRigidBody = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_2(self, arg0, arg1);  return }
  _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['removeRigidBody'] = btDiscreteDynamicsWorld.prototype.removeRigidBody = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['addVehicle'] = btDiscreteDynamicsWorld.prototype.addVehicle = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_addVehicle_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['removeVehicle'] = btDiscreteDynamicsWorld.prototype.removeVehicle = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeVehicle_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['addConstraint'] = btDiscreteDynamicsWorld.prototype.addConstraint = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1(self, arg0);  return }
  _emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2(self, arg0, arg1);
};;

btDiscreteDynamicsWorld.prototype['removeConstraint'] = btDiscreteDynamicsWorld.prototype.removeConstraint = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['stepSimulation'] = btDiscreteDynamicsWorld.prototype.stepSimulation = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { return _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1(self, arg0) }
  if (arg2 === undefined) { return _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2(self, arg0, arg1) }
  return _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['getDispatcher'] = btDiscreteDynamicsWorld.prototype.getDispatcher = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0(self), btDispatcher);
};;

btDiscreteDynamicsWorld.prototype['rayTest'] = btDiscreteDynamicsWorld.prototype.rayTest = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_rayTest_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['getPairCache'] = btDiscreteDynamicsWorld.prototype.getPairCache = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0(self), btOverlappingPairCache);
};;

btDiscreteDynamicsWorld.prototype['getDispatchInfo'] = btDiscreteDynamicsWorld.prototype.getDispatchInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0(self), btDispatcherInfo);
};;

btDiscreteDynamicsWorld.prototype['addCollisionObject'] = btDiscreteDynamicsWorld.prototype.addCollisionObject = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2(self, arg0, arg1);  return }
  _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['getBroadphase'] = btDiscreteDynamicsWorld.prototype.getBroadphase = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0(self), btBroadphaseInterface);
};;

btDiscreteDynamicsWorld.prototype['convexSweepTest'] = btDiscreteDynamicsWorld.prototype.convexSweepTest = function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btDiscreteDynamicsWorld.prototype['contactPairTest'] = btDiscreteDynamicsWorld.prototype.contactPairTest = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['contactTest'] = btDiscreteDynamicsWorld.prototype.contactTest = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_contactTest_2(self, arg0, arg1);
};;

btDiscreteDynamicsWorld.prototype['addAction'] = btDiscreteDynamicsWorld.prototype.addAction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_addAction_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['removeAction'] = btDiscreteDynamicsWorld.prototype.removeAction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeAction_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['getSolverInfo'] = btDiscreteDynamicsWorld.prototype.getSolverInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0(self), btContactSolverInfo);
};;

  btDiscreteDynamicsWorld.prototype['__destroy__'] = btDiscreteDynamicsWorld.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld___destroy___0(self);
};
// btConvexShape
function btConvexShape() { throw "cannot construct a btConvexShape, no constructor in IDL" }
btConvexShape.prototype = Object.create(btCollisionShape.prototype);
btConvexShape.prototype.constructor = btConvexShape;
btConvexShape.prototype.__class__ = btConvexShape;
btConvexShape.__cache__ = {};
Module['btConvexShape'] = btConvexShape;

btConvexShape.prototype['setLocalScaling'] = btConvexShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexShape_setLocalScaling_1(self, arg0);
};;

btConvexShape.prototype['calculateLocalInertia'] = btConvexShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConvexShape_calculateLocalInertia_2(self, arg0, arg1);
};;

btConvexShape.prototype['setMargin'] = btConvexShape.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexShape_setMargin_1(self, arg0);
};;

btConvexShape.prototype['getMargin'] = btConvexShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexShape_getMargin_0(self);
};;

  btConvexShape.prototype['__destroy__'] = btConvexShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConvexShape___destroy___0(self);
};
// btDispatcher
function btDispatcher() { throw "cannot construct a btDispatcher, no constructor in IDL" }
btDispatcher.prototype = Object.create(WrapperObject.prototype);
btDispatcher.prototype.constructor = btDispatcher;
btDispatcher.prototype.__class__ = btDispatcher;
btDispatcher.__cache__ = {};
Module['btDispatcher'] = btDispatcher;

btDispatcher.prototype['getNumManifolds'] = btDispatcher.prototype.getNumManifolds = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcher_getNumManifolds_0(self);
};;

btDispatcher.prototype['getManifoldByIndexInternal'] = btDispatcher.prototype.getManifoldByIndexInternal = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btDispatcher_getManifoldByIndexInternal_1(self, arg0), btPersistentManifold);
};;

  btDispatcher.prototype['__destroy__'] = btDispatcher.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDispatcher___destroy___0(self);
};
// btGeneric6DofConstraint
function btGeneric6DofConstraint(arg0, arg1, arg2, arg3, arg4) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg3 === undefined) { this.ptr = _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3(arg0, arg1, arg2); getCache(btGeneric6DofConstraint)[this.ptr] = this;return }
  if (arg4 === undefined) { this.ptr = _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_4(arg0, arg1, arg2, arg3); getCache(btGeneric6DofConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5(arg0, arg1, arg2, arg3, arg4);
  getCache(btGeneric6DofConstraint)[this.ptr] = this;
};;
btGeneric6DofConstraint.prototype = Object.create(btTypedConstraint.prototype);
btGeneric6DofConstraint.prototype.constructor = btGeneric6DofConstraint;
btGeneric6DofConstraint.prototype.__class__ = btGeneric6DofConstraint;
btGeneric6DofConstraint.__cache__ = {};
Module['btGeneric6DofConstraint'] = btGeneric6DofConstraint;

btGeneric6DofConstraint.prototype['setLinearLowerLimit'] = btGeneric6DofConstraint.prototype.setLinearLowerLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['setLinearUpperLimit'] = btGeneric6DofConstraint.prototype.setLinearUpperLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['setAngularLowerLimit'] = btGeneric6DofConstraint.prototype.setAngularLowerLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['setAngularUpperLimit'] = btGeneric6DofConstraint.prototype.setAngularUpperLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['getRotationalLimitMotor'] = btGeneric6DofConstraint.prototype.getRotationalLimitMotor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btGeneric6DofConstraint_getRotationalLimitMotor_1(self, arg0), btRotationalLimitMotor);
};;

btGeneric6DofConstraint.prototype['enableFeedback'] = btGeneric6DofConstraint.prototype.enableFeedback = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_enableFeedback_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['getBreakingImpulseThreshold'] = btGeneric6DofConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0(self);
};;

btGeneric6DofConstraint.prototype['setBreakingImpulseThreshold'] = btGeneric6DofConstraint.prototype.setBreakingImpulseThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

  btGeneric6DofConstraint.prototype['__destroy__'] = btGeneric6DofConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGeneric6DofConstraint___destroy___0(self);
};
// btStridingMeshInterface
function btStridingMeshInterface() { throw "cannot construct a btStridingMeshInterface, no constructor in IDL" }
btStridingMeshInterface.prototype = Object.create(WrapperObject.prototype);
btStridingMeshInterface.prototype.constructor = btStridingMeshInterface;
btStridingMeshInterface.prototype.__class__ = btStridingMeshInterface;
btStridingMeshInterface.__cache__ = {};
Module['btStridingMeshInterface'] = btStridingMeshInterface;

  btStridingMeshInterface.prototype['__destroy__'] = btStridingMeshInterface.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btStridingMeshInterface___destroy___0(self);
};
// btMotionState
function btMotionState() { throw "cannot construct a btMotionState, no constructor in IDL" }
btMotionState.prototype = Object.create(WrapperObject.prototype);
btMotionState.prototype.constructor = btMotionState;
btMotionState.prototype.__class__ = btMotionState;
btMotionState.__cache__ = {};
Module['btMotionState'] = btMotionState;

btMotionState.prototype['getWorldTransform'] = btMotionState.prototype.getWorldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btMotionState_getWorldTransform_1(self, arg0);
};;

btMotionState.prototype['setWorldTransform'] = btMotionState.prototype.setWorldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btMotionState_setWorldTransform_1(self, arg0);
};;

  btMotionState.prototype['__destroy__'] = btMotionState.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btMotionState___destroy___0(self);
};
// ContactResultCallback
function ContactResultCallback() { throw "cannot construct a ContactResultCallback, no constructor in IDL" }
ContactResultCallback.prototype = Object.create(WrapperObject.prototype);
ContactResultCallback.prototype.constructor = ContactResultCallback;
ContactResultCallback.prototype.__class__ = ContactResultCallback;
ContactResultCallback.__cache__ = {};
Module['ContactResultCallback'] = ContactResultCallback;

ContactResultCallback.prototype['addSingleResult'] = ContactResultCallback.prototype.addSingleResult = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg5 && typeof arg5 === 'object') arg5 = arg5.ptr;
  if (arg6 && typeof arg6 === 'object') arg6 = arg6.ptr;
  return _emscripten_bind_ContactResultCallback_addSingleResult_7(self, arg0, arg1, arg2, arg3, arg4, arg5, arg6);
};;

  ContactResultCallback.prototype['__destroy__'] = ContactResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ContactResultCallback___destroy___0(self);
};
// btSoftBodySolver
function btSoftBodySolver() { throw "cannot construct a btSoftBodySolver, no constructor in IDL" }
btSoftBodySolver.prototype = Object.create(WrapperObject.prototype);
btSoftBodySolver.prototype.constructor = btSoftBodySolver;
btSoftBodySolver.prototype.__class__ = btSoftBodySolver;
btSoftBodySolver.__cache__ = {};
Module['btSoftBodySolver'] = btSoftBodySolver;

  btSoftBodySolver.prototype['__destroy__'] = btSoftBodySolver.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodySolver___destroy___0(self);
};
// RayResultCallback
function RayResultCallback() { throw "cannot construct a RayResultCallback, no constructor in IDL" }
RayResultCallback.prototype = Object.create(WrapperObject.prototype);
RayResultCallback.prototype.constructor = RayResultCallback;
RayResultCallback.prototype.__class__ = RayResultCallback;
RayResultCallback.__cache__ = {};
Module['RayResultCallback'] = RayResultCallback;

RayResultCallback.prototype['hasHit'] = RayResultCallback.prototype.hasHit = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_RayResultCallback_hasHit_0(self));
};;

  RayResultCallback.prototype['get_m_collisionFilterGroup'] = RayResultCallback.prototype.get_m_collisionFilterGroup = function() {
  var self = this.ptr;
  return _emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0(self);
};
    RayResultCallback.prototype['set_m_collisionFilterGroup'] = RayResultCallback.prototype.set_m_collisionFilterGroup = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};
  RayResultCallback.prototype['get_m_collisionFilterMask'] = RayResultCallback.prototype.get_m_collisionFilterMask = function() {
  var self = this.ptr;
  return _emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0(self);
};
    RayResultCallback.prototype['set_m_collisionFilterMask'] = RayResultCallback.prototype.set_m_collisionFilterMask = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1(self, arg0);
};
  RayResultCallback.prototype['get_m_collisionObject'] = RayResultCallback.prototype.get_m_collisionObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RayResultCallback_get_m_collisionObject_0(self), btCollisionObject);
};
    RayResultCallback.prototype['set_m_collisionObject'] = RayResultCallback.prototype.set_m_collisionObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_collisionObject_1(self, arg0);
};
  RayResultCallback.prototype['__destroy__'] = RayResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_RayResultCallback___destroy___0(self);
};
// btMatrix3x3
function btMatrix3x3() { throw "cannot construct a btMatrix3x3, no constructor in IDL" }
btMatrix3x3.prototype = Object.create(WrapperObject.prototype);
btMatrix3x3.prototype.constructor = btMatrix3x3;
btMatrix3x3.prototype.__class__ = btMatrix3x3;
btMatrix3x3.__cache__ = {};
Module['btMatrix3x3'] = btMatrix3x3;

btMatrix3x3.prototype['setEulerZYX'] = btMatrix3x3.prototype.setEulerZYX = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btMatrix3x3_setEulerZYX_3(self, arg0, arg1, arg2);
};;

btMatrix3x3.prototype['getRotation'] = btMatrix3x3.prototype.getRotation = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btMatrix3x3_getRotation_1(self, arg0);
};;

btMatrix3x3.prototype['getRow'] = btMatrix3x3.prototype.getRow = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btMatrix3x3_getRow_1(self, arg0), btVector3);
};;

  btMatrix3x3.prototype['__destroy__'] = btMatrix3x3.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btMatrix3x3___destroy___0(self);
};
// btDispatcherInfo
function btDispatcherInfo() { throw "cannot construct a btDispatcherInfo, no constructor in IDL" }
btDispatcherInfo.prototype = Object.create(WrapperObject.prototype);
btDispatcherInfo.prototype.constructor = btDispatcherInfo;
btDispatcherInfo.prototype.__class__ = btDispatcherInfo;
btDispatcherInfo.__cache__ = {};
Module['btDispatcherInfo'] = btDispatcherInfo;

  btDispatcherInfo.prototype['get_m_timeStep'] = btDispatcherInfo.prototype.get_m_timeStep = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_timeStep_0(self);
};
    btDispatcherInfo.prototype['set_m_timeStep'] = btDispatcherInfo.prototype.set_m_timeStep = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_timeStep_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_stepCount'] = btDispatcherInfo.prototype.get_m_stepCount = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_stepCount_0(self);
};
    btDispatcherInfo.prototype['set_m_stepCount'] = btDispatcherInfo.prototype.set_m_stepCount = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_stepCount_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_dispatchFunc'] = btDispatcherInfo.prototype.get_m_dispatchFunc = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0(self);
};
    btDispatcherInfo.prototype['set_m_dispatchFunc'] = btDispatcherInfo.prototype.set_m_dispatchFunc = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_timeOfImpact'] = btDispatcherInfo.prototype.get_m_timeOfImpact = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0(self);
};
    btDispatcherInfo.prototype['set_m_timeOfImpact'] = btDispatcherInfo.prototype.set_m_timeOfImpact = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_useContinuous'] = btDispatcherInfo.prototype.get_m_useContinuous = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_useContinuous_0(self));
};
    btDispatcherInfo.prototype['set_m_useContinuous'] = btDispatcherInfo.prototype.set_m_useContinuous = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_useContinuous_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_enableSatConvex'] = btDispatcherInfo.prototype.get_m_enableSatConvex = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0(self));
};
    btDispatcherInfo.prototype['set_m_enableSatConvex'] = btDispatcherInfo.prototype.set_m_enableSatConvex = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_enableSPU'] = btDispatcherInfo.prototype.get_m_enableSPU = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_enableSPU_0(self));
};
    btDispatcherInfo.prototype['set_m_enableSPU'] = btDispatcherInfo.prototype.set_m_enableSPU = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_enableSPU_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_useEpa'] = btDispatcherInfo.prototype.get_m_useEpa = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_useEpa_0(self));
};
    btDispatcherInfo.prototype['set_m_useEpa'] = btDispatcherInfo.prototype.set_m_useEpa = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_useEpa_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_allowedCcdPenetration'] = btDispatcherInfo.prototype.get_m_allowedCcdPenetration = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0(self);
};
    btDispatcherInfo.prototype['set_m_allowedCcdPenetration'] = btDispatcherInfo.prototype.set_m_allowedCcdPenetration = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_useConvexConservativeDistanceUtil'] = btDispatcherInfo.prototype.get_m_useConvexConservativeDistanceUtil = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0(self));
};
    btDispatcherInfo.prototype['set_m_useConvexConservativeDistanceUtil'] = btDispatcherInfo.prototype.set_m_useConvexConservativeDistanceUtil = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_convexConservativeDistanceThreshold'] = btDispatcherInfo.prototype.get_m_convexConservativeDistanceThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0(self);
};
    btDispatcherInfo.prototype['set_m_convexConservativeDistanceThreshold'] = btDispatcherInfo.prototype.set_m_convexConservativeDistanceThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1(self, arg0);
};
  btDispatcherInfo.prototype['__destroy__'] = btDispatcherInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDispatcherInfo___destroy___0(self);
};
// Material
function Material() { throw "cannot construct a Material, no constructor in IDL" }
Material.prototype = Object.create(WrapperObject.prototype);
Material.prototype.constructor = Material;
Material.prototype.__class__ = Material;
Material.__cache__ = {};
Module['Material'] = Material;

  Material.prototype['get_m_kLST'] = Material.prototype.get_m_kLST = function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_kLST_0(self);
};
    Material.prototype['set_m_kLST'] = Material.prototype.set_m_kLST = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_kLST_1(self, arg0);
};
  Material.prototype['get_m_kAST'] = Material.prototype.get_m_kAST = function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_kAST_0(self);
};
    Material.prototype['set_m_kAST'] = Material.prototype.set_m_kAST = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_kAST_1(self, arg0);
};
  Material.prototype['get_m_kVST'] = Material.prototype.get_m_kVST = function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_kVST_0(self);
};
    Material.prototype['set_m_kVST'] = Material.prototype.set_m_kVST = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_kVST_1(self, arg0);
};
  Material.prototype['get_m_flags'] = Material.prototype.get_m_flags = function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_flags_0(self);
};
    Material.prototype['set_m_flags'] = Material.prototype.set_m_flags = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_flags_1(self, arg0);
};
  Material.prototype['__destroy__'] = Material.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Material___destroy___0(self);
};
// btConvexTriangleMeshShape
function btConvexTriangleMeshShape(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { this.ptr = _emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1(arg0); getCache(btConvexTriangleMeshShape)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2(arg0, arg1);
  getCache(btConvexTriangleMeshShape)[this.ptr] = this;
};;
btConvexTriangleMeshShape.prototype = Object.create(btConvexShape.prototype);
btConvexTriangleMeshShape.prototype.constructor = btConvexTriangleMeshShape;
btConvexTriangleMeshShape.prototype.__class__ = btConvexTriangleMeshShape;
btConvexTriangleMeshShape.__cache__ = {};
Module['btConvexTriangleMeshShape'] = btConvexTriangleMeshShape;

btConvexTriangleMeshShape.prototype['setLocalScaling'] = btConvexTriangleMeshShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1(self, arg0);
};;

btConvexTriangleMeshShape.prototype['calculateLocalInertia'] = btConvexTriangleMeshShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2(self, arg0, arg1);
};;

btConvexTriangleMeshShape.prototype['setMargin'] = btConvexTriangleMeshShape.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexTriangleMeshShape_setMargin_1(self, arg0);
};;

btConvexTriangleMeshShape.prototype['getMargin'] = btConvexTriangleMeshShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexTriangleMeshShape_getMargin_0(self);
};;

  btConvexTriangleMeshShape.prototype['__destroy__'] = btConvexTriangleMeshShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConvexTriangleMeshShape___destroy___0(self);
};
// btBroadphaseInterface
function btBroadphaseInterface() { throw "cannot construct a btBroadphaseInterface, no constructor in IDL" }
btBroadphaseInterface.prototype = Object.create(WrapperObject.prototype);
btBroadphaseInterface.prototype.constructor = btBroadphaseInterface;
btBroadphaseInterface.prototype.__class__ = btBroadphaseInterface;
btBroadphaseInterface.__cache__ = {};
Module['btBroadphaseInterface'] = btBroadphaseInterface;

  btBroadphaseInterface.prototype['__destroy__'] = btBroadphaseInterface.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btBroadphaseInterface___destroy___0(self);
};
// btRigidBodyConstructionInfo
function btRigidBodyConstructionInfo(arg0, arg1, arg2, arg3) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg3 === undefined) { this.ptr = _emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3(arg0, arg1, arg2); getCache(btRigidBodyConstructionInfo)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4(arg0, arg1, arg2, arg3);
  getCache(btRigidBodyConstructionInfo)[this.ptr] = this;
};;
btRigidBodyConstructionInfo.prototype = Object.create(WrapperObject.prototype);
btRigidBodyConstructionInfo.prototype.constructor = btRigidBodyConstructionInfo;
btRigidBodyConstructionInfo.prototype.__class__ = btRigidBodyConstructionInfo;
btRigidBodyConstructionInfo.__cache__ = {};
Module['btRigidBodyConstructionInfo'] = btRigidBodyConstructionInfo;

  btRigidBodyConstructionInfo.prototype['get_m_linearDamping'] = btRigidBodyConstructionInfo.prototype.get_m_linearDamping = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_linearDamping'] = btRigidBodyConstructionInfo.prototype.set_m_linearDamping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_angularDamping'] = btRigidBodyConstructionInfo.prototype.get_m_angularDamping = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_angularDamping'] = btRigidBodyConstructionInfo.prototype.set_m_angularDamping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_friction'] = btRigidBodyConstructionInfo.prototype.get_m_friction = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_friction'] = btRigidBodyConstructionInfo.prototype.set_m_friction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_rollingFriction'] = btRigidBodyConstructionInfo.prototype.get_m_rollingFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_rollingFriction'] = btRigidBodyConstructionInfo.prototype.set_m_rollingFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_restitution'] = btRigidBodyConstructionInfo.prototype.get_m_restitution = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_restitution'] = btRigidBodyConstructionInfo.prototype.set_m_restitution = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_linearSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.get_m_linearSleepingThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_linearSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.set_m_linearSleepingThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_angularSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.get_m_angularSleepingThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_angularSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.set_m_angularSleepingThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_additionalDamping'] = btRigidBodyConstructionInfo.prototype.get_m_additionalDamping = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0(self));
};
    btRigidBodyConstructionInfo.prototype['set_m_additionalDamping'] = btRigidBodyConstructionInfo.prototype.set_m_additionalDamping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_additionalDampingFactor'] = btRigidBodyConstructionInfo.prototype.get_m_additionalDampingFactor = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_additionalDampingFactor'] = btRigidBodyConstructionInfo.prototype.set_m_additionalDampingFactor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_additionalLinearDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.get_m_additionalLinearDampingThresholdSqr = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_additionalLinearDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.set_m_additionalLinearDampingThresholdSqr = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_additionalAngularDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.get_m_additionalAngularDampingThresholdSqr = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_additionalAngularDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.set_m_additionalAngularDampingThresholdSqr = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_additionalAngularDampingFactor'] = btRigidBodyConstructionInfo.prototype.get_m_additionalAngularDampingFactor = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_additionalAngularDampingFactor'] = btRigidBodyConstructionInfo.prototype.set_m_additionalAngularDampingFactor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['__destroy__'] = btRigidBodyConstructionInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo___destroy___0(self);
};
// btCollisionConfiguration
function btCollisionConfiguration() { throw "cannot construct a btCollisionConfiguration, no constructor in IDL" }
btCollisionConfiguration.prototype = Object.create(WrapperObject.prototype);
btCollisionConfiguration.prototype.constructor = btCollisionConfiguration;
btCollisionConfiguration.prototype.__class__ = btCollisionConfiguration;
btCollisionConfiguration.__cache__ = {};
Module['btCollisionConfiguration'] = btCollisionConfiguration;

  btCollisionConfiguration.prototype['__destroy__'] = btCollisionConfiguration.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionConfiguration___destroy___0(self);
};
// btPersistentManifold
function btPersistentManifold() {
  this.ptr = _emscripten_bind_btPersistentManifold_btPersistentManifold_0();
  getCache(btPersistentManifold)[this.ptr] = this;
};;
btPersistentManifold.prototype = Object.create(WrapperObject.prototype);
btPersistentManifold.prototype.constructor = btPersistentManifold;
btPersistentManifold.prototype.__class__ = btPersistentManifold;
btPersistentManifold.__cache__ = {};
Module['btPersistentManifold'] = btPersistentManifold;

btPersistentManifold.prototype['getBody0'] = btPersistentManifold.prototype.getBody0 = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPersistentManifold_getBody0_0(self), btCollisionObject);
};;

btPersistentManifold.prototype['getBody1'] = btPersistentManifold.prototype.getBody1 = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPersistentManifold_getBody1_0(self), btCollisionObject);
};;

btPersistentManifold.prototype['getNumContacts'] = btPersistentManifold.prototype.getNumContacts = function() {
  var self = this.ptr;
  return _emscripten_bind_btPersistentManifold_getNumContacts_0(self);
};;

btPersistentManifold.prototype['getContactPoint'] = btPersistentManifold.prototype.getContactPoint = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btPersistentManifold_getContactPoint_1(self, arg0), btManifoldPoint);
};;

  btPersistentManifold.prototype['__destroy__'] = btPersistentManifold.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btPersistentManifold___destroy___0(self);
};
// btCompoundShape
function btCompoundShape(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { this.ptr = _emscripten_bind_btCompoundShape_btCompoundShape_0(); getCache(btCompoundShape)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btCompoundShape_btCompoundShape_1(arg0);
  getCache(btCompoundShape)[this.ptr] = this;
};;
btCompoundShape.prototype = Object.create(btCollisionShape.prototype);
btCompoundShape.prototype.constructor = btCompoundShape;
btCompoundShape.prototype.__class__ = btCompoundShape;
btCompoundShape.__cache__ = {};
Module['btCompoundShape'] = btCompoundShape;

btCompoundShape.prototype['addChildShape'] = btCompoundShape.prototype.addChildShape = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCompoundShape_addChildShape_2(self, arg0, arg1);
};;

btCompoundShape.prototype['removeChildShapeByIndex'] = btCompoundShape.prototype.removeChildShapeByIndex = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCompoundShape_removeChildShapeByIndex_1(self, arg0);
};;

btCompoundShape.prototype['getNumChildShapes'] = btCompoundShape.prototype.getNumChildShapes = function() {
  var self = this.ptr;
  return _emscripten_bind_btCompoundShape_getNumChildShapes_0(self);
};;

btCompoundShape.prototype['getChildShape'] = btCompoundShape.prototype.getChildShape = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btCompoundShape_getChildShape_1(self, arg0), btCollisionShape);
};;

btCompoundShape.prototype['setMargin'] = btCompoundShape.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCompoundShape_setMargin_1(self, arg0);
};;

btCompoundShape.prototype['getMargin'] = btCompoundShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCompoundShape_getMargin_0(self);
};;

btCompoundShape.prototype['setLocalScaling'] = btCompoundShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCompoundShape_setLocalScaling_1(self, arg0);
};;

btCompoundShape.prototype['calculateLocalInertia'] = btCompoundShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCompoundShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCompoundShape.prototype['__destroy__'] = btCompoundShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCompoundShape___destroy___0(self);
};
// ClosestConvexResultCallback
function ClosestConvexResultCallback(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  this.ptr = _emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2(arg0, arg1);
  getCache(ClosestConvexResultCallback)[this.ptr] = this;
};;
ClosestConvexResultCallback.prototype = Object.create(ConvexResultCallback.prototype);
ClosestConvexResultCallback.prototype.constructor = ClosestConvexResultCallback;
ClosestConvexResultCallback.prototype.__class__ = ClosestConvexResultCallback;
ClosestConvexResultCallback.__cache__ = {};
Module['ClosestConvexResultCallback'] = ClosestConvexResultCallback;

ClosestConvexResultCallback.prototype['hasHit'] = ClosestConvexResultCallback.prototype.hasHit = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ClosestConvexResultCallback_hasHit_0(self));
};;

  ClosestConvexResultCallback.prototype['get_m_convexFromWorld'] = ClosestConvexResultCallback.prototype.get_m_convexFromWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0(self), btVector3);
};
    ClosestConvexResultCallback.prototype['set_m_convexFromWorld'] = ClosestConvexResultCallback.prototype.set_m_convexFromWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_convexToWorld'] = ClosestConvexResultCallback.prototype.get_m_convexToWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0(self), btVector3);
};
    ClosestConvexResultCallback.prototype['set_m_convexToWorld'] = ClosestConvexResultCallback.prototype.set_m_convexToWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_hitNormalWorld'] = ClosestConvexResultCallback.prototype.get_m_hitNormalWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0(self), btVector3);
};
    ClosestConvexResultCallback.prototype['set_m_hitNormalWorld'] = ClosestConvexResultCallback.prototype.set_m_hitNormalWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_hitPointWorld'] = ClosestConvexResultCallback.prototype.get_m_hitPointWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0(self), btVector3);
};
    ClosestConvexResultCallback.prototype['set_m_hitPointWorld'] = ClosestConvexResultCallback.prototype.set_m_hitPointWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_collisionFilterGroup'] = ClosestConvexResultCallback.prototype.get_m_collisionFilterGroup = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0(self);
};
    ClosestConvexResultCallback.prototype['set_m_collisionFilterGroup'] = ClosestConvexResultCallback.prototype.set_m_collisionFilterGroup = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_collisionFilterMask'] = ClosestConvexResultCallback.prototype.get_m_collisionFilterMask = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0(self);
};
    ClosestConvexResultCallback.prototype['set_m_collisionFilterMask'] = ClosestConvexResultCallback.prototype.set_m_collisionFilterMask = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_closestHitFraction'] = ClosestConvexResultCallback.prototype.get_m_closestHitFraction = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0(self);
};
    ClosestConvexResultCallback.prototype['set_m_closestHitFraction'] = ClosestConvexResultCallback.prototype.set_m_closestHitFraction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['__destroy__'] = ClosestConvexResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ClosestConvexResultCallback___destroy___0(self);
};
// tMaterialArray
function tMaterialArray() { throw "cannot construct a tMaterialArray, no constructor in IDL" }
tMaterialArray.prototype = Object.create(WrapperObject.prototype);
tMaterialArray.prototype.constructor = tMaterialArray;
tMaterialArray.prototype.__class__ = tMaterialArray;
tMaterialArray.__cache__ = {};
Module['tMaterialArray'] = tMaterialArray;

tMaterialArray.prototype['size'] = tMaterialArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_tMaterialArray_size_0(self);
};;

tMaterialArray.prototype['at'] = tMaterialArray.prototype.at = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_tMaterialArray_at_1(self, arg0), Material);
};;

  tMaterialArray.prototype['__destroy__'] = tMaterialArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_tMaterialArray___destroy___0(self);
};
// btDefaultVehicleRaycaster
function btDefaultVehicleRaycaster(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1(arg0);
  getCache(btDefaultVehicleRaycaster)[this.ptr] = this;
};;
btDefaultVehicleRaycaster.prototype = Object.create(btVehicleRaycaster.prototype);
btDefaultVehicleRaycaster.prototype.constructor = btDefaultVehicleRaycaster;
btDefaultVehicleRaycaster.prototype.__class__ = btDefaultVehicleRaycaster;
btDefaultVehicleRaycaster.__cache__ = {};
Module['btDefaultVehicleRaycaster'] = btDefaultVehicleRaycaster;

  btDefaultVehicleRaycaster.prototype['__destroy__'] = btDefaultVehicleRaycaster.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultVehicleRaycaster___destroy___0(self);
};
// btConstraintSetting
function btConstraintSetting() {
  this.ptr = _emscripten_bind_btConstraintSetting_btConstraintSetting_0();
  getCache(btConstraintSetting)[this.ptr] = this;
};;
btConstraintSetting.prototype = Object.create(WrapperObject.prototype);
btConstraintSetting.prototype.constructor = btConstraintSetting;
btConstraintSetting.prototype.__class__ = btConstraintSetting;
btConstraintSetting.__cache__ = {};
Module['btConstraintSetting'] = btConstraintSetting;

  btConstraintSetting.prototype['get_m_tau'] = btConstraintSetting.prototype.get_m_tau = function() {
  var self = this.ptr;
  return _emscripten_bind_btConstraintSetting_get_m_tau_0(self);
};
    btConstraintSetting.prototype['set_m_tau'] = btConstraintSetting.prototype.set_m_tau = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConstraintSetting_set_m_tau_1(self, arg0);
};
  btConstraintSetting.prototype['get_m_damping'] = btConstraintSetting.prototype.get_m_damping = function() {
  var self = this.ptr;
  return _emscripten_bind_btConstraintSetting_get_m_damping_0(self);
};
    btConstraintSetting.prototype['set_m_damping'] = btConstraintSetting.prototype.set_m_damping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConstraintSetting_set_m_damping_1(self, arg0);
};
  btConstraintSetting.prototype['get_m_impulseClamp'] = btConstraintSetting.prototype.get_m_impulseClamp = function() {
  var self = this.ptr;
  return _emscripten_bind_btConstraintSetting_get_m_impulseClamp_0(self);
};
    btConstraintSetting.prototype['set_m_impulseClamp'] = btConstraintSetting.prototype.set_m_impulseClamp = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConstraintSetting_set_m_impulseClamp_1(self, arg0);
};
  btConstraintSetting.prototype['__destroy__'] = btConstraintSetting.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConstraintSetting___destroy___0(self);
};
// LocalShapeInfo
function LocalShapeInfo() { throw "cannot construct a LocalShapeInfo, no constructor in IDL" }
LocalShapeInfo.prototype = Object.create(WrapperObject.prototype);
LocalShapeInfo.prototype.constructor = LocalShapeInfo;
LocalShapeInfo.prototype.__class__ = LocalShapeInfo;
LocalShapeInfo.__cache__ = {};
Module['LocalShapeInfo'] = LocalShapeInfo;

  LocalShapeInfo.prototype['get_m_shapePart'] = LocalShapeInfo.prototype.get_m_shapePart = function() {
  var self = this.ptr;
  return _emscripten_bind_LocalShapeInfo_get_m_shapePart_0(self);
};
    LocalShapeInfo.prototype['set_m_shapePart'] = LocalShapeInfo.prototype.set_m_shapePart = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalShapeInfo_set_m_shapePart_1(self, arg0);
};
  LocalShapeInfo.prototype['get_m_triangleIndex'] = LocalShapeInfo.prototype.get_m_triangleIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0(self);
};
    LocalShapeInfo.prototype['set_m_triangleIndex'] = LocalShapeInfo.prototype.set_m_triangleIndex = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1(self, arg0);
};
  LocalShapeInfo.prototype['__destroy__'] = LocalShapeInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_LocalShapeInfo___destroy___0(self);
};
// btRigidBody
function btRigidBody(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btRigidBody_btRigidBody_1(arg0);
  getCache(btRigidBody)[this.ptr] = this;
};;
btRigidBody.prototype = Object.create(btCollisionObject.prototype);
btRigidBody.prototype.constructor = btRigidBody;
btRigidBody.prototype.__class__ = btRigidBody;
btRigidBody.__cache__ = {};
Module['btRigidBody'] = btRigidBody;

btRigidBody.prototype['getCenterOfMassTransform'] = btRigidBody.prototype.getCenterOfMassTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getCenterOfMassTransform_0(self), btTransform);
};;

btRigidBody.prototype['setCenterOfMassTransform'] = btRigidBody.prototype.setCenterOfMassTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setCenterOfMassTransform_1(self, arg0);
};;

btRigidBody.prototype['setSleepingThresholds'] = btRigidBody.prototype.setSleepingThresholds = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_setSleepingThresholds_2(self, arg0, arg1);
};;

btRigidBody.prototype['setDamping'] = btRigidBody.prototype.setDamping = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_setDamping_2(self, arg0, arg1);
};;

btRigidBody.prototype['setMassProps'] = btRigidBody.prototype.setMassProps = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_setMassProps_2(self, arg0, arg1);
};;

btRigidBody.prototype['setLinearFactor'] = btRigidBody.prototype.setLinearFactor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setLinearFactor_1(self, arg0);
};;

btRigidBody.prototype['applyTorque'] = btRigidBody.prototype.applyTorque = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_applyTorque_1(self, arg0);
};;

btRigidBody.prototype['applyForce'] = btRigidBody.prototype.applyForce = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_applyForce_2(self, arg0, arg1);
};;

btRigidBody.prototype['applyCentralForce'] = btRigidBody.prototype.applyCentralForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_applyCentralForce_1(self, arg0);
};;

btRigidBody.prototype['applyTorqueImpulse'] = btRigidBody.prototype.applyTorqueImpulse = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_applyTorqueImpulse_1(self, arg0);
};;

btRigidBody.prototype['applyImpulse'] = btRigidBody.prototype.applyImpulse = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_applyImpulse_2(self, arg0, arg1);
};;

btRigidBody.prototype['applyCentralImpulse'] = btRigidBody.prototype.applyCentralImpulse = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_applyCentralImpulse_1(self, arg0);
};;

btRigidBody.prototype['updateInertiaTensor'] = btRigidBody.prototype.updateInertiaTensor = function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBody_updateInertiaTensor_0(self);
};;

btRigidBody.prototype['getLinearVelocity'] = btRigidBody.prototype.getLinearVelocity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getLinearVelocity_0(self), btVector3);
};;

btRigidBody.prototype['getAngularVelocity'] = btRigidBody.prototype.getAngularVelocity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getAngularVelocity_0(self), btVector3);
};;

btRigidBody.prototype['setLinearVelocity'] = btRigidBody.prototype.setLinearVelocity = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setLinearVelocity_1(self, arg0);
};;

btRigidBody.prototype['setAngularVelocity'] = btRigidBody.prototype.setAngularVelocity = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setAngularVelocity_1(self, arg0);
};;

btRigidBody.prototype['getMotionState'] = btRigidBody.prototype.getMotionState = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getMotionState_0(self), btMotionState);
};;

btRigidBody.prototype['setMotionState'] = btRigidBody.prototype.setMotionState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setMotionState_1(self, arg0);
};;

btRigidBody.prototype['setAngularFactor'] = btRigidBody.prototype.setAngularFactor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setAngularFactor_1(self, arg0);
};;

btRigidBody.prototype['upcast'] = btRigidBody.prototype.upcast = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_upcast_1(self, arg0), btRigidBody);
};;

btRigidBody.prototype['setAnisotropicFriction'] = btRigidBody.prototype.setAnisotropicFriction = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_setAnisotropicFriction_2(self, arg0, arg1);
};;

btRigidBody.prototype['getCollisionShape'] = btRigidBody.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getCollisionShape_0(self), btCollisionShape);
};;

btRigidBody.prototype['setContactProcessingThreshold'] = btRigidBody.prototype.setContactProcessingThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setContactProcessingThreshold_1(self, arg0);
};;

btRigidBody.prototype['setActivationState'] = btRigidBody.prototype.setActivationState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setActivationState_1(self, arg0);
};;

btRigidBody.prototype['forceActivationState'] = btRigidBody.prototype.forceActivationState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_forceActivationState_1(self, arg0);
};;

btRigidBody.prototype['activate'] = btRigidBody.prototype.activate = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { _emscripten_bind_btRigidBody_activate_0(self);  return }
  _emscripten_bind_btRigidBody_activate_1(self, arg0);
};;

btRigidBody.prototype['isActive'] = btRigidBody.prototype.isActive = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBody_isActive_0(self));
};;

btRigidBody.prototype['isKinematicObject'] = btRigidBody.prototype.isKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBody_isKinematicObject_0(self));
};;

btRigidBody.prototype['setRestitution'] = btRigidBody.prototype.setRestitution = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setRestitution_1(self, arg0);
};;

btRigidBody.prototype['setFriction'] = btRigidBody.prototype.setFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setFriction_1(self, arg0);
};;

btRigidBody.prototype['setRollingFriction'] = btRigidBody.prototype.setRollingFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setRollingFriction_1(self, arg0);
};;

btRigidBody.prototype['getWorldTransform'] = btRigidBody.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getWorldTransform_0(self), btTransform);
};;

btRigidBody.prototype['getCollisionFlags'] = btRigidBody.prototype.getCollisionFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getCollisionFlags_0(self);
};;

btRigidBody.prototype['setCollisionFlags'] = btRigidBody.prototype.setCollisionFlags = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setCollisionFlags_1(self, arg0);
};;

btRigidBody.prototype['setWorldTransform'] = btRigidBody.prototype.setWorldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setWorldTransform_1(self, arg0);
};;

btRigidBody.prototype['setCollisionShape'] = btRigidBody.prototype.setCollisionShape = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setCollisionShape_1(self, arg0);
};;

btRigidBody.prototype['setCcdMotionThreshold'] = btRigidBody.prototype.setCcdMotionThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setCcdMotionThreshold_1(self, arg0);
};;

btRigidBody.prototype['setCcdSweptSphereRadius'] = btRigidBody.prototype.setCcdSweptSphereRadius = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1(self, arg0);
};;

btRigidBody.prototype['getUserIndex'] = btRigidBody.prototype.getUserIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getUserIndex_0(self);
};;

btRigidBody.prototype['setUserIndex'] = btRigidBody.prototype.setUserIndex = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setUserIndex_1(self, arg0);
};;

btRigidBody.prototype['getUserPointer'] = btRigidBody.prototype.getUserPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getUserPointer_0(self), VoidPtr);
};;

btRigidBody.prototype['setUserPointer'] = btRigidBody.prototype.setUserPointer = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setUserPointer_1(self, arg0);
};;

  btRigidBody.prototype['__destroy__'] = btRigidBody.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBody___destroy___0(self);
};
// btDbvtBroadphase
function btDbvtBroadphase() {
  this.ptr = _emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0();
  getCache(btDbvtBroadphase)[this.ptr] = this;
};;
btDbvtBroadphase.prototype = Object.create(WrapperObject.prototype);
btDbvtBroadphase.prototype.constructor = btDbvtBroadphase;
btDbvtBroadphase.prototype.__class__ = btDbvtBroadphase;
btDbvtBroadphase.__cache__ = {};
Module['btDbvtBroadphase'] = btDbvtBroadphase;

  btDbvtBroadphase.prototype['__destroy__'] = btDbvtBroadphase.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDbvtBroadphase___destroy___0(self);
};
// btDefaultSoftBodySolver
function btDefaultSoftBodySolver() {
  this.ptr = _emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0();
  getCache(btDefaultSoftBodySolver)[this.ptr] = this;
};;
btDefaultSoftBodySolver.prototype = Object.create(btSoftBodySolver.prototype);
btDefaultSoftBodySolver.prototype.constructor = btDefaultSoftBodySolver;
btDefaultSoftBodySolver.prototype.__class__ = btDefaultSoftBodySolver;
btDefaultSoftBodySolver.__cache__ = {};
Module['btDefaultSoftBodySolver'] = btDefaultSoftBodySolver;

  btDefaultSoftBodySolver.prototype['__destroy__'] = btDefaultSoftBodySolver.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultSoftBodySolver___destroy___0(self);
};
// btKinematicCharacterController
function btKinematicCharacterController(arg0, arg1, arg2, arg3) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg3 === undefined) { this.ptr = _emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3(arg0, arg1, arg2); getCache(btKinematicCharacterController)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4(arg0, arg1, arg2, arg3);
  getCache(btKinematicCharacterController)[this.ptr] = this;
};;
btKinematicCharacterController.prototype = Object.create(btActionInterface.prototype);
btKinematicCharacterController.prototype.constructor = btKinematicCharacterController;
btKinematicCharacterController.prototype.__class__ = btKinematicCharacterController;
btKinematicCharacterController.__cache__ = {};
Module['btKinematicCharacterController'] = btKinematicCharacterController;

btKinematicCharacterController.prototype['setUp'] = btKinematicCharacterController.prototype.setUp = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setUp_1(self, arg0);
};;

btKinematicCharacterController.prototype['setWalkDirection'] = btKinematicCharacterController.prototype.setWalkDirection = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setWalkDirection_1(self, arg0);
};;

btKinematicCharacterController.prototype['setVelocityForTimeInterval'] = btKinematicCharacterController.prototype.setVelocityForTimeInterval = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2(self, arg0, arg1);
};;

btKinematicCharacterController.prototype['warp'] = btKinematicCharacterController.prototype.warp = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_warp_1(self, arg0);
};;

btKinematicCharacterController.prototype['preStep'] = btKinematicCharacterController.prototype.preStep = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_preStep_1(self, arg0);
};;

btKinematicCharacterController.prototype['playerStep'] = btKinematicCharacterController.prototype.playerStep = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btKinematicCharacterController_playerStep_2(self, arg0, arg1);
};;

btKinematicCharacterController.prototype['setFallSpeed'] = btKinematicCharacterController.prototype.setFallSpeed = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setFallSpeed_1(self, arg0);
};;

btKinematicCharacterController.prototype['setJumpSpeed'] = btKinematicCharacterController.prototype.setJumpSpeed = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setJumpSpeed_1(self, arg0);
};;

btKinematicCharacterController.prototype['setMaxJumpHeight'] = btKinematicCharacterController.prototype.setMaxJumpHeight = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1(self, arg0);
};;

btKinematicCharacterController.prototype['canJump'] = btKinematicCharacterController.prototype.canJump = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btKinematicCharacterController_canJump_0(self));
};;

btKinematicCharacterController.prototype['jump'] = btKinematicCharacterController.prototype.jump = function() {
  var self = this.ptr;
  _emscripten_bind_btKinematicCharacterController_jump_0(self);
};;

btKinematicCharacterController.prototype['setGravity'] = btKinematicCharacterController.prototype.setGravity = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setGravity_1(self, arg0);
};;

btKinematicCharacterController.prototype['getGravity'] = btKinematicCharacterController.prototype.getGravity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btKinematicCharacterController_getGravity_0(self), btVector3);
};;

btKinematicCharacterController.prototype['setMaxSlope'] = btKinematicCharacterController.prototype.setMaxSlope = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setMaxSlope_1(self, arg0);
};;

btKinematicCharacterController.prototype['getMaxSlope'] = btKinematicCharacterController.prototype.getMaxSlope = function() {
  var self = this.ptr;
  return _emscripten_bind_btKinematicCharacterController_getMaxSlope_0(self);
};;

btKinematicCharacterController.prototype['getGhostObject'] = btKinematicCharacterController.prototype.getGhostObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btKinematicCharacterController_getGhostObject_0(self), btPairCachingGhostObject);
};;

btKinematicCharacterController.prototype['setUseGhostSweepTest'] = btKinematicCharacterController.prototype.setUseGhostSweepTest = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1(self, arg0);
};;

btKinematicCharacterController.prototype['onGround'] = btKinematicCharacterController.prototype.onGround = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btKinematicCharacterController_onGround_0(self));
};;

  btKinematicCharacterController.prototype['__destroy__'] = btKinematicCharacterController.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btKinematicCharacterController___destroy___0(self);
};
// btAxisSweep3
function btAxisSweep3(arg0, arg1, arg2, arg3, arg4) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg2 === undefined) { this.ptr = _emscripten_bind_btAxisSweep3_btAxisSweep3_2(arg0, arg1); getCache(btAxisSweep3)[this.ptr] = this;return }
  if (arg3 === undefined) { this.ptr = _emscripten_bind_btAxisSweep3_btAxisSweep3_3(arg0, arg1, arg2); getCache(btAxisSweep3)[this.ptr] = this;return }
  if (arg4 === undefined) { this.ptr = _emscripten_bind_btAxisSweep3_btAxisSweep3_4(arg0, arg1, arg2, arg3); getCache(btAxisSweep3)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btAxisSweep3_btAxisSweep3_5(arg0, arg1, arg2, arg3, arg4);
  getCache(btAxisSweep3)[this.ptr] = this;
};;
btAxisSweep3.prototype = Object.create(WrapperObject.prototype);
btAxisSweep3.prototype.constructor = btAxisSweep3;
btAxisSweep3.prototype.__class__ = btAxisSweep3;
btAxisSweep3.__cache__ = {};
Module['btAxisSweep3'] = btAxisSweep3;

  btAxisSweep3.prototype['__destroy__'] = btAxisSweep3.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btAxisSweep3___destroy___0(self);
};
// btSoftBodyWorldInfo
function btSoftBodyWorldInfo() {
  this.ptr = _emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0();
  getCache(btSoftBodyWorldInfo)[this.ptr] = this;
};;
btSoftBodyWorldInfo.prototype = Object.create(WrapperObject.prototype);
btSoftBodyWorldInfo.prototype.constructor = btSoftBodyWorldInfo;
btSoftBodyWorldInfo.prototype.__class__ = btSoftBodyWorldInfo;
btSoftBodyWorldInfo.__cache__ = {};
Module['btSoftBodyWorldInfo'] = btSoftBodyWorldInfo;

  btSoftBodyWorldInfo.prototype['get_air_density'] = btSoftBodyWorldInfo.prototype.get_air_density = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_air_density_0(self);
};
    btSoftBodyWorldInfo.prototype['set_air_density'] = btSoftBodyWorldInfo.prototype.set_air_density = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_air_density_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_water_density'] = btSoftBodyWorldInfo.prototype.get_water_density = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_water_density_0(self);
};
    btSoftBodyWorldInfo.prototype['set_water_density'] = btSoftBodyWorldInfo.prototype.set_water_density = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_water_density_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_water_offset'] = btSoftBodyWorldInfo.prototype.get_water_offset = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0(self);
};
    btSoftBodyWorldInfo.prototype['set_water_offset'] = btSoftBodyWorldInfo.prototype.set_water_offset = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_m_maxDisplacement'] = btSoftBodyWorldInfo.prototype.get_m_maxDisplacement = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0(self);
};
    btSoftBodyWorldInfo.prototype['set_m_maxDisplacement'] = btSoftBodyWorldInfo.prototype.set_m_maxDisplacement = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_water_normal'] = btSoftBodyWorldInfo.prototype.get_water_normal = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0(self), btVector3);
};
    btSoftBodyWorldInfo.prototype['set_water_normal'] = btSoftBodyWorldInfo.prototype.set_water_normal = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_m_broadphase'] = btSoftBodyWorldInfo.prototype.get_m_broadphase = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0(self), btBroadphaseInterface);
};
    btSoftBodyWorldInfo.prototype['set_m_broadphase'] = btSoftBodyWorldInfo.prototype.set_m_broadphase = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_m_dispatcher'] = btSoftBodyWorldInfo.prototype.get_m_dispatcher = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0(self), btDispatcher);
};
    btSoftBodyWorldInfo.prototype['set_m_dispatcher'] = btSoftBodyWorldInfo.prototype.set_m_dispatcher = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_m_gravity'] = btSoftBodyWorldInfo.prototype.get_m_gravity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0(self), btVector3);
};
    btSoftBodyWorldInfo.prototype['set_m_gravity'] = btSoftBodyWorldInfo.prototype.set_m_gravity = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['__destroy__'] = btSoftBodyWorldInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyWorldInfo___destroy___0(self);
};
// btConeTwistConstraint
function btConeTwistConstraint(arg0, arg1, arg2, arg3) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg2 === undefined) { this.ptr = _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2(arg0, arg1); getCache(btConeTwistConstraint)[this.ptr] = this;return }
  if (arg3 === undefined) { this.ptr = _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_3(arg0, arg1, arg2); getCache(btConeTwistConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4(arg0, arg1, arg2, arg3);
  getCache(btConeTwistConstraint)[this.ptr] = this;
};;
btConeTwistConstraint.prototype = Object.create(btTypedConstraint.prototype);
btConeTwistConstraint.prototype.constructor = btConeTwistConstraint;
btConeTwistConstraint.prototype.__class__ = btConeTwistConstraint;
btConeTwistConstraint.__cache__ = {};
Module['btConeTwistConstraint'] = btConeTwistConstraint;

btConeTwistConstraint.prototype['setLimit'] = btConeTwistConstraint.prototype.setLimit = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConeTwistConstraint_setLimit_2(self, arg0, arg1);
};;

btConeTwistConstraint.prototype['setAngularOnly'] = btConeTwistConstraint.prototype.setAngularOnly = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setAngularOnly_1(self, arg0);
};;

btConeTwistConstraint.prototype['setDamping'] = btConeTwistConstraint.prototype.setDamping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setDamping_1(self, arg0);
};;

btConeTwistConstraint.prototype['enableMotor'] = btConeTwistConstraint.prototype.enableMotor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_enableMotor_1(self, arg0);
};;

btConeTwistConstraint.prototype['setMaxMotorImpulse'] = btConeTwistConstraint.prototype.setMaxMotorImpulse = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1(self, arg0);
};;

btConeTwistConstraint.prototype['setMaxMotorImpulseNormalized'] = btConeTwistConstraint.prototype.setMaxMotorImpulseNormalized = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1(self, arg0);
};;

btConeTwistConstraint.prototype['setMotorTarget'] = btConeTwistConstraint.prototype.setMotorTarget = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setMotorTarget_1(self, arg0);
};;

btConeTwistConstraint.prototype['setMotorTargetInConstraintSpace'] = btConeTwistConstraint.prototype.setMotorTargetInConstraintSpace = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1(self, arg0);
};;

btConeTwistConstraint.prototype['enableFeedback'] = btConeTwistConstraint.prototype.enableFeedback = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_enableFeedback_1(self, arg0);
};;

btConeTwistConstraint.prototype['getBreakingImpulseThreshold'] = btConeTwistConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0(self);
};;

btConeTwistConstraint.prototype['setBreakingImpulseThreshold'] = btConeTwistConstraint.prototype.setBreakingImpulseThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

  btConeTwistConstraint.prototype['__destroy__'] = btConeTwistConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConeTwistConstraint___destroy___0(self);
};
// btHingeConstraint
function btHingeConstraint(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg5 && typeof arg5 === 'object') arg5 = arg5.ptr;
  if (arg6 && typeof arg6 === 'object') arg6 = arg6.ptr;
  if (arg2 === undefined) { this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_2(arg0, arg1); getCache(btHingeConstraint)[this.ptr] = this;return }
  if (arg3 === undefined) { this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_3(arg0, arg1, arg2); getCache(btHingeConstraint)[this.ptr] = this;return }
  if (arg4 === undefined) { this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_4(arg0, arg1, arg2, arg3); getCache(btHingeConstraint)[this.ptr] = this;return }
  if (arg5 === undefined) { this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_5(arg0, arg1, arg2, arg3, arg4); getCache(btHingeConstraint)[this.ptr] = this;return }
  if (arg6 === undefined) { this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_6(arg0, arg1, arg2, arg3, arg4, arg5); getCache(btHingeConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_7(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
  getCache(btHingeConstraint)[this.ptr] = this;
};;
btHingeConstraint.prototype = Object.create(btTypedConstraint.prototype);
btHingeConstraint.prototype.constructor = btHingeConstraint;
btHingeConstraint.prototype.__class__ = btHingeConstraint;
btHingeConstraint.__cache__ = {};
Module['btHingeConstraint'] = btHingeConstraint;

btHingeConstraint.prototype['setLimit'] = btHingeConstraint.prototype.setLimit = function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg4 === undefined) { _emscripten_bind_btHingeConstraint_setLimit_4(self, arg0, arg1, arg2, arg3);  return }
  _emscripten_bind_btHingeConstraint_setLimit_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btHingeConstraint.prototype['enableAngularMotor'] = btHingeConstraint.prototype.enableAngularMotor = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btHingeConstraint_enableAngularMotor_3(self, arg0, arg1, arg2);
};;

btHingeConstraint.prototype['setAngularOnly'] = btHingeConstraint.prototype.setAngularOnly = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHingeConstraint_setAngularOnly_1(self, arg0);
};;

btHingeConstraint.prototype['enableMotor'] = btHingeConstraint.prototype.enableMotor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHingeConstraint_enableMotor_1(self, arg0);
};;

btHingeConstraint.prototype['setMaxMotorImpulse'] = btHingeConstraint.prototype.setMaxMotorImpulse = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1(self, arg0);
};;

btHingeConstraint.prototype['setMotorTarget'] = btHingeConstraint.prototype.setMotorTarget = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btHingeConstraint_setMotorTarget_2(self, arg0, arg1);
};;

btHingeConstraint.prototype['enableFeedback'] = btHingeConstraint.prototype.enableFeedback = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHingeConstraint_enableFeedback_1(self, arg0);
};;

btHingeConstraint.prototype['getBreakingImpulseThreshold'] = btHingeConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0(self);
};;

btHingeConstraint.prototype['setBreakingImpulseThreshold'] = btHingeConstraint.prototype.setBreakingImpulseThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

  btHingeConstraint.prototype['__destroy__'] = btHingeConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btHingeConstraint___destroy___0(self);
};
// btRotationalLimitMotor
function btRotationalLimitMotor(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { this.ptr = _emscripten_bind_btRotationalLimitMotor_btRotationalLimitMotor_0(); getCache(btRotationalLimitMotor)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btRotationalLimitMotor_btRotationalLimitMotor_1(arg0);
  getCache(btRotationalLimitMotor)[this.ptr] = this;
};;
btRotationalLimitMotor.prototype = Object.create(WrapperObject.prototype);
btRotationalLimitMotor.prototype.constructor = btRotationalLimitMotor;
btRotationalLimitMotor.prototype.__class__ = btRotationalLimitMotor;
btRotationalLimitMotor.__cache__ = {};
Module['btRotationalLimitMotor'] = btRotationalLimitMotor;

btRotationalLimitMotor.prototype['isLimited'] = btRotationalLimitMotor.prototype.isLimited = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRotationalLimitMotor_isLimited_0(self));
};;

btRotationalLimitMotor.prototype['needApplyTorques'] = btRotationalLimitMotor.prototype.needApplyTorques = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRotationalLimitMotor_needApplyTorques_0(self));
};;

  btRotationalLimitMotor.prototype['get_m_loLimit'] = btRotationalLimitMotor.prototype.get_m_loLimit = function() {
  var self = this.ptr;
  return _emscripten_bind_btRotationalLimitMotor_get_m_loLimit_0(self);
};
    btRotationalLimitMotor.prototype['set_m_loLimit'] = btRotationalLimitMotor.prototype.set_m_loLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRotationalLimitMotor_set_m_loLimit_1(self, arg0);
};
  btRotationalLimitMotor.prototype['get_m_hiLimit'] = btRotationalLimitMotor.prototype.get_m_hiLimit = function() {
  var self = this.ptr;
  return _emscripten_bind_btRotationalLimitMotor_get_m_hiLimit_0(self);
};
    btRotationalLimitMotor.prototype['set_m_hiLimit'] = btRotationalLimitMotor.prototype.set_m_hiLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRotationalLimitMotor_set_m_hiLimit_1(self, arg0);
};
  btRotationalLimitMotor.prototype['get_m_targetVelocity'] = btRotationalLimitMotor.prototype.get_m_targetVelocity = function() {
  var self = this.ptr;
  return _emscripten_bind_btRotationalLimitMotor_get_m_targetVelocity_0(self);
};
    btRotationalLimitMotor.prototype['set_m_targetVelocity'] = btRotationalLimitMotor.prototype.set_m_targetVelocity = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRotationalLimitMotor_set_m_targetVelocity_1(self, arg0);
};
  btRotationalLimitMotor.prototype['get_m_maxMotorForce'] = btRotationalLimitMotor.prototype.get_m_maxMotorForce = function() {
  var self = this.ptr;
  return _emscripten_bind_btRotationalLimitMotor_get_m_maxMotorForce_0(self);
};
    btRotationalLimitMotor.prototype['set_m_maxMotorForce'] = btRotationalLimitMotor.prototype.set_m_maxMotorForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRotationalLimitMotor_set_m_maxMotorForce_1(self, arg0);
};
  btRotationalLimitMotor.prototype['get_m_enableMotor'] = btRotationalLimitMotor.prototype.get_m_enableMotor = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRotationalLimitMotor_get_m_enableMotor_0(self));
};
    btRotationalLimitMotor.prototype['set_m_enableMotor'] = btRotationalLimitMotor.prototype.set_m_enableMotor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRotationalLimitMotor_set_m_enableMotor_1(self, arg0);
};
  btRotationalLimitMotor.prototype['__destroy__'] = btRotationalLimitMotor.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btRotationalLimitMotor___destroy___0(self);
};
// btConeShapeZ
function btConeShapeZ(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  this.ptr = _emscripten_bind_btConeShapeZ_btConeShapeZ_2(arg0, arg1);
  getCache(btConeShapeZ)[this.ptr] = this;
};;
btConeShapeZ.prototype = Object.create(btConeShape.prototype);
btConeShapeZ.prototype.constructor = btConeShapeZ;
btConeShapeZ.prototype.__class__ = btConeShapeZ;
btConeShapeZ.__cache__ = {};
Module['btConeShapeZ'] = btConeShapeZ;

btConeShapeZ.prototype['setLocalScaling'] = btConeShapeZ.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeShapeZ_setLocalScaling_1(self, arg0);
};;

btConeShapeZ.prototype['calculateLocalInertia'] = btConeShapeZ.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConeShapeZ_calculateLocalInertia_2(self, arg0, arg1);
};;

  btConeShapeZ.prototype['__destroy__'] = btConeShapeZ.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConeShapeZ___destroy___0(self);
};
// btConeShapeX
function btConeShapeX(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  this.ptr = _emscripten_bind_btConeShapeX_btConeShapeX_2(arg0, arg1);
  getCache(btConeShapeX)[this.ptr] = this;
};;
btConeShapeX.prototype = Object.create(btConeShape.prototype);
btConeShapeX.prototype.constructor = btConeShapeX;
btConeShapeX.prototype.__class__ = btConeShapeX;
btConeShapeX.__cache__ = {};
Module['btConeShapeX'] = btConeShapeX;

btConeShapeX.prototype['setLocalScaling'] = btConeShapeX.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeShapeX_setLocalScaling_1(self, arg0);
};;

btConeShapeX.prototype['calculateLocalInertia'] = btConeShapeX.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConeShapeX_calculateLocalInertia_2(self, arg0, arg1);
};;

  btConeShapeX.prototype['__destroy__'] = btConeShapeX.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConeShapeX___destroy___0(self);
};
// btTriangleMesh
function btTriangleMesh(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg0 === undefined) { this.ptr = _emscripten_bind_btTriangleMesh_btTriangleMesh_0(); getCache(btTriangleMesh)[this.ptr] = this;return }
  if (arg1 === undefined) { this.ptr = _emscripten_bind_btTriangleMesh_btTriangleMesh_1(arg0); getCache(btTriangleMesh)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btTriangleMesh_btTriangleMesh_2(arg0, arg1);
  getCache(btTriangleMesh)[this.ptr] = this;
};;
btTriangleMesh.prototype = Object.create(btStridingMeshInterface.prototype);
btTriangleMesh.prototype.constructor = btTriangleMesh;
btTriangleMesh.prototype.__class__ = btTriangleMesh;
btTriangleMesh.__cache__ = {};
Module['btTriangleMesh'] = btTriangleMesh;

btTriangleMesh.prototype['addTriangle'] = btTriangleMesh.prototype.addTriangle = function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg3 === undefined) { _emscripten_bind_btTriangleMesh_addTriangle_3(self, arg0, arg1, arg2);  return }
  _emscripten_bind_btTriangleMesh_addTriangle_4(self, arg0, arg1, arg2, arg3);
};;

  btTriangleMesh.prototype['__destroy__'] = btTriangleMesh.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btTriangleMesh___destroy___0(self);
};
// btConvexHullShape
function btConvexHullShape() {
  this.ptr = _emscripten_bind_btConvexHullShape_btConvexHullShape_0();
  getCache(btConvexHullShape)[this.ptr] = this;
};;
btConvexHullShape.prototype = Object.create(btCollisionShape.prototype);
btConvexHullShape.prototype.constructor = btConvexHullShape;
btConvexHullShape.prototype.__class__ = btConvexHullShape;
btConvexHullShape.__cache__ = {};
Module['btConvexHullShape'] = btConvexHullShape;

btConvexHullShape.prototype['addPoint'] = btConvexHullShape.prototype.addPoint = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { _emscripten_bind_btConvexHullShape_addPoint_1(self, arg0);  return }
  _emscripten_bind_btConvexHullShape_addPoint_2(self, arg0, arg1);
};;

btConvexHullShape.prototype['setMargin'] = btConvexHullShape.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexHullShape_setMargin_1(self, arg0);
};;

btConvexHullShape.prototype['getMargin'] = btConvexHullShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexHullShape_getMargin_0(self);
};;

btConvexHullShape.prototype['setLocalScaling'] = btConvexHullShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexHullShape_setLocalScaling_1(self, arg0);
};;

btConvexHullShape.prototype['calculateLocalInertia'] = btConvexHullShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConvexHullShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btConvexHullShape.prototype['__destroy__'] = btConvexHullShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConvexHullShape___destroy___0(self);
};
// btVehicleTuning
function btVehicleTuning() {
  this.ptr = _emscripten_bind_btVehicleTuning_btVehicleTuning_0();
  getCache(btVehicleTuning)[this.ptr] = this;
};;
btVehicleTuning.prototype = Object.create(WrapperObject.prototype);
btVehicleTuning.prototype.constructor = btVehicleTuning;
btVehicleTuning.prototype.__class__ = btVehicleTuning;
btVehicleTuning.__cache__ = {};
Module['btVehicleTuning'] = btVehicleTuning;

  btVehicleTuning.prototype['get_m_suspensionStiffness'] = btVehicleTuning.prototype.get_m_suspensionStiffness = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0(self);
};
    btVehicleTuning.prototype['set_m_suspensionStiffness'] = btVehicleTuning.prototype.set_m_suspensionStiffness = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1(self, arg0);
};
  btVehicleTuning.prototype['get_m_suspensionCompression'] = btVehicleTuning.prototype.get_m_suspensionCompression = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0(self);
};
    btVehicleTuning.prototype['set_m_suspensionCompression'] = btVehicleTuning.prototype.set_m_suspensionCompression = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1(self, arg0);
};
  btVehicleTuning.prototype['get_m_suspensionDamping'] = btVehicleTuning.prototype.get_m_suspensionDamping = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0(self);
};
    btVehicleTuning.prototype['set_m_suspensionDamping'] = btVehicleTuning.prototype.set_m_suspensionDamping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1(self, arg0);
};
  btVehicleTuning.prototype['get_m_maxSuspensionTravelCm'] = btVehicleTuning.prototype.get_m_maxSuspensionTravelCm = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0(self);
};
    btVehicleTuning.prototype['set_m_maxSuspensionTravelCm'] = btVehicleTuning.prototype.set_m_maxSuspensionTravelCm = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1(self, arg0);
};
  btVehicleTuning.prototype['get_m_frictionSlip'] = btVehicleTuning.prototype.get_m_frictionSlip = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_frictionSlip_0(self);
};
    btVehicleTuning.prototype['set_m_frictionSlip'] = btVehicleTuning.prototype.set_m_frictionSlip = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_frictionSlip_1(self, arg0);
};
  btVehicleTuning.prototype['get_m_maxSuspensionForce'] = btVehicleTuning.prototype.get_m_maxSuspensionForce = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0(self);
};
    btVehicleTuning.prototype['set_m_maxSuspensionForce'] = btVehicleTuning.prototype.set_m_maxSuspensionForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1(self, arg0);
};
// btCollisionObjectWrapper
function btCollisionObjectWrapper() { throw "cannot construct a btCollisionObjectWrapper, no constructor in IDL" }
btCollisionObjectWrapper.prototype = Object.create(WrapperObject.prototype);
btCollisionObjectWrapper.prototype.constructor = btCollisionObjectWrapper;
btCollisionObjectWrapper.prototype.__class__ = btCollisionObjectWrapper;
btCollisionObjectWrapper.__cache__ = {};
Module['btCollisionObjectWrapper'] = btCollisionObjectWrapper;

// btDefaultMotionState
function btDefaultMotionState(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg0 === undefined) { this.ptr = _emscripten_bind_btDefaultMotionState_btDefaultMotionState_0(); getCache(btDefaultMotionState)[this.ptr] = this;return }
  if (arg1 === undefined) { this.ptr = _emscripten_bind_btDefaultMotionState_btDefaultMotionState_1(arg0); getCache(btDefaultMotionState)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btDefaultMotionState_btDefaultMotionState_2(arg0, arg1);
  getCache(btDefaultMotionState)[this.ptr] = this;
};;
btDefaultMotionState.prototype = Object.create(btMotionState.prototype);
btDefaultMotionState.prototype.constructor = btDefaultMotionState;
btDefaultMotionState.prototype.__class__ = btDefaultMotionState;
btDefaultMotionState.__cache__ = {};
Module['btDefaultMotionState'] = btDefaultMotionState;

btDefaultMotionState.prototype['getWorldTransform'] = btDefaultMotionState.prototype.getWorldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDefaultMotionState_getWorldTransform_1(self, arg0);
};;

btDefaultMotionState.prototype['setWorldTransform'] = btDefaultMotionState.prototype.setWorldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDefaultMotionState_setWorldTransform_1(self, arg0);
};;

  btDefaultMotionState.prototype['get_m_graphicsWorldTrans'] = btDefaultMotionState.prototype.get_m_graphicsWorldTrans = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0(self), btTransform);
};
    btDefaultMotionState.prototype['set_m_graphicsWorldTrans'] = btDefaultMotionState.prototype.set_m_graphicsWorldTrans = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1(self, arg0);
};
  btDefaultMotionState.prototype['__destroy__'] = btDefaultMotionState.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultMotionState___destroy___0(self);
};
// btWheelInfo
function btWheelInfo() { throw "cannot construct a btWheelInfo, no constructor in IDL" }
btWheelInfo.prototype = Object.create(WrapperObject.prototype);
btWheelInfo.prototype.constructor = btWheelInfo;
btWheelInfo.prototype.__class__ = btWheelInfo;
btWheelInfo.__cache__ = {};
Module['btWheelInfo'] = btWheelInfo;

  btWheelInfo.prototype['get_m_worldTransform'] = btWheelInfo.prototype.get_m_worldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_worldTransform_0(self), btTransform);
};
    btWheelInfo.prototype['set_m_worldTransform'] = btWheelInfo.prototype.set_m_worldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_worldTransform_1(self, arg0);
};
  btWheelInfo.prototype['get_m_suspensionStiffness'] = btWheelInfo.prototype.get_m_suspensionStiffness = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0(self);
};
    btWheelInfo.prototype['set_m_suspensionStiffness'] = btWheelInfo.prototype.set_m_suspensionStiffness = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1(self, arg0);
};
  btWheelInfo.prototype['get_m_frictionSlip'] = btWheelInfo.prototype.get_m_frictionSlip = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_frictionSlip_0(self);
};
    btWheelInfo.prototype['set_m_frictionSlip'] = btWheelInfo.prototype.set_m_frictionSlip = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_frictionSlip_1(self, arg0);
};
  btWheelInfo.prototype['get_m_engineForce'] = btWheelInfo.prototype.get_m_engineForce = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_engineForce_0(self);
};
    btWheelInfo.prototype['set_m_engineForce'] = btWheelInfo.prototype.set_m_engineForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_engineForce_1(self, arg0);
};
  btWheelInfo.prototype['get_m_rollInfluence'] = btWheelInfo.prototype.get_m_rollInfluence = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_rollInfluence_0(self);
};
    btWheelInfo.prototype['set_m_rollInfluence'] = btWheelInfo.prototype.set_m_rollInfluence = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_rollInfluence_1(self, arg0);
};
  btWheelInfo.prototype['get_m_suspensionRestLength1'] = btWheelInfo.prototype.get_m_suspensionRestLength1 = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0(self);
};
    btWheelInfo.prototype['set_m_suspensionRestLength1'] = btWheelInfo.prototype.set_m_suspensionRestLength1 = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1(self, arg0);
};
  btWheelInfo.prototype['get_m_wheelsRadius'] = btWheelInfo.prototype.get_m_wheelsRadius = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsRadius_0(self);
};
    btWheelInfo.prototype['set_m_wheelsRadius'] = btWheelInfo.prototype.set_m_wheelsRadius = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsRadius_1(self, arg0);
};
  btWheelInfo.prototype['get_m_wheelsDampingCompression'] = btWheelInfo.prototype.get_m_wheelsDampingCompression = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0(self);
};
    btWheelInfo.prototype['set_m_wheelsDampingCompression'] = btWheelInfo.prototype.set_m_wheelsDampingCompression = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1(self, arg0);
};
  btWheelInfo.prototype['get_m_wheelsDampingRelaxation'] = btWheelInfo.prototype.get_m_wheelsDampingRelaxation = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0(self);
};
    btWheelInfo.prototype['set_m_wheelsDampingRelaxation'] = btWheelInfo.prototype.set_m_wheelsDampingRelaxation = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1(self, arg0);
};
  btWheelInfo.prototype['get_m_steering'] = btWheelInfo.prototype.get_m_steering = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_steering_0(self);
};
    btWheelInfo.prototype['set_m_steering'] = btWheelInfo.prototype.set_m_steering = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_steering_1(self, arg0);
};
  btWheelInfo.prototype['get_m_maxSuspensionForce'] = btWheelInfo.prototype.get_m_maxSuspensionForce = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0(self);
};
    btWheelInfo.prototype['set_m_maxSuspensionForce'] = btWheelInfo.prototype.set_m_maxSuspensionForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1(self, arg0);
};
  btWheelInfo.prototype['get_m_maxSuspensionTravelCm'] = btWheelInfo.prototype.get_m_maxSuspensionTravelCm = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0(self);
};
    btWheelInfo.prototype['set_m_maxSuspensionTravelCm'] = btWheelInfo.prototype.set_m_maxSuspensionTravelCm = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1(self, arg0);
};
  btWheelInfo.prototype['get_m_wheelsSuspensionForce'] = btWheelInfo.prototype.get_m_wheelsSuspensionForce = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0(self);
};
    btWheelInfo.prototype['set_m_wheelsSuspensionForce'] = btWheelInfo.prototype.set_m_wheelsSuspensionForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1(self, arg0);
};
  btWheelInfo.prototype['get_m_bIsFrontWheel'] = btWheelInfo.prototype.get_m_bIsFrontWheel = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0(self));
};
    btWheelInfo.prototype['set_m_bIsFrontWheel'] = btWheelInfo.prototype.set_m_bIsFrontWheel = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1(self, arg0);
};
  btWheelInfo.prototype['get_m_raycastInfo'] = btWheelInfo.prototype.get_m_raycastInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_raycastInfo_0(self), RaycastInfo);
};
    btWheelInfo.prototype['set_m_raycastInfo'] = btWheelInfo.prototype.set_m_raycastInfo = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_raycastInfo_1(self, arg0);
};
  btWheelInfo.prototype['get_m_chassisConnectionPointCS'] = btWheelInfo.prototype.get_m_chassisConnectionPointCS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0(self), btVector3);
};
    btWheelInfo.prototype['set_m_chassisConnectionPointCS'] = btWheelInfo.prototype.set_m_chassisConnectionPointCS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1(self, arg0);
};
  btWheelInfo.prototype['__destroy__'] = btWheelInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btWheelInfo___destroy___0(self);
};
// btVector4
function btVector4(arg0, arg1, arg2, arg3) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg0 === undefined) { this.ptr = _emscripten_bind_btVector4_btVector4_0(); getCache(btVector4)[this.ptr] = this;return }
  if (arg1 === undefined) { this.ptr = _emscripten_bind_btVector4_btVector4_1(arg0); getCache(btVector4)[this.ptr] = this;return }
  if (arg2 === undefined) { this.ptr = _emscripten_bind_btVector4_btVector4_2(arg0, arg1); getCache(btVector4)[this.ptr] = this;return }
  if (arg3 === undefined) { this.ptr = _emscripten_bind_btVector4_btVector4_3(arg0, arg1, arg2); getCache(btVector4)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btVector4_btVector4_4(arg0, arg1, arg2, arg3);
  getCache(btVector4)[this.ptr] = this;
};;
btVector4.prototype = Object.create(btVector3.prototype);
btVector4.prototype.constructor = btVector4;
btVector4.prototype.__class__ = btVector4;
btVector4.__cache__ = {};
Module['btVector4'] = btVector4;

btVector4.prototype['w'] = btVector4.prototype.w = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_w_0(self);
};;

btVector4.prototype['setValue'] = btVector4.prototype.setValue = function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  _emscripten_bind_btVector4_setValue_4(self, arg0, arg1, arg2, arg3);
};;

btVector4.prototype['length'] = btVector4.prototype.length = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_length_0(self);
};;

btVector4.prototype['x'] = btVector4.prototype.x = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_x_0(self);
};;

btVector4.prototype['y'] = btVector4.prototype.y = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_y_0(self);
};;

btVector4.prototype['z'] = btVector4.prototype.z = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_z_0(self);
};;

btVector4.prototype['setX'] = btVector4.prototype.setX = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector4_setX_1(self, arg0);
};;

btVector4.prototype['setY'] = btVector4.prototype.setY = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector4_setY_1(self, arg0);
};;

btVector4.prototype['setZ'] = btVector4.prototype.setZ = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector4_setZ_1(self, arg0);
};;

btVector4.prototype['normalize'] = btVector4.prototype.normalize = function() {
  var self = this.ptr;
  _emscripten_bind_btVector4_normalize_0(self);
};;

btVector4.prototype['dot'] = btVector4.prototype.dot = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btVector4_dot_1(self, arg0);
};;

btVector4.prototype['op_mul'] = btVector4.prototype.op_mul = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector4_op_mul_1(self, arg0), btVector3);
};;

btVector4.prototype['op_add'] = btVector4.prototype.op_add = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector4_op_add_1(self, arg0), btVector3);
};;

btVector4.prototype['op_sub'] = btVector4.prototype.op_sub = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector4_op_sub_1(self, arg0), btVector3);
};;

  btVector4.prototype['__destroy__'] = btVector4.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btVector4___destroy___0(self);
};
// btDefaultCollisionConstructionInfo
function btDefaultCollisionConstructionInfo() {
  this.ptr = _emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0();
  getCache(btDefaultCollisionConstructionInfo)[this.ptr] = this;
};;
btDefaultCollisionConstructionInfo.prototype = Object.create(WrapperObject.prototype);
btDefaultCollisionConstructionInfo.prototype.constructor = btDefaultCollisionConstructionInfo;
btDefaultCollisionConstructionInfo.prototype.__class__ = btDefaultCollisionConstructionInfo;
btDefaultCollisionConstructionInfo.__cache__ = {};
Module['btDefaultCollisionConstructionInfo'] = btDefaultCollisionConstructionInfo;

  btDefaultCollisionConstructionInfo.prototype['__destroy__'] = btDefaultCollisionConstructionInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0(self);
};
// btConstraintSolver
function btConstraintSolver() { throw "cannot construct a btConstraintSolver, no constructor in IDL" }
btConstraintSolver.prototype = Object.create(WrapperObject.prototype);
btConstraintSolver.prototype.constructor = btConstraintSolver;
btConstraintSolver.prototype.__class__ = btConstraintSolver;
btConstraintSolver.__cache__ = {};
Module['btConstraintSolver'] = btConstraintSolver;

  btConstraintSolver.prototype['__destroy__'] = btConstraintSolver.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConstraintSolver___destroy___0(self);
};
// btRaycastVehicle
function btRaycastVehicle(arg0, arg1, arg2) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  this.ptr = _emscripten_bind_btRaycastVehicle_btRaycastVehicle_3(arg0, arg1, arg2);
  getCache(btRaycastVehicle)[this.ptr] = this;
};;
btRaycastVehicle.prototype = Object.create(btActionInterface.prototype);
btRaycastVehicle.prototype.constructor = btRaycastVehicle;
btRaycastVehicle.prototype.__class__ = btRaycastVehicle;
btRaycastVehicle.__cache__ = {};
Module['btRaycastVehicle'] = btRaycastVehicle;

btRaycastVehicle.prototype['applyEngineForce'] = btRaycastVehicle.prototype.applyEngineForce = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRaycastVehicle_applyEngineForce_2(self, arg0, arg1);
};;

btRaycastVehicle.prototype['setSteeringValue'] = btRaycastVehicle.prototype.setSteeringValue = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRaycastVehicle_setSteeringValue_2(self, arg0, arg1);
};;

btRaycastVehicle.prototype['getWheelTransformWS'] = btRaycastVehicle.prototype.getWheelTransformWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getWheelTransformWS_1(self, arg0), btTransform);
};;

btRaycastVehicle.prototype['updateWheelTransform'] = btRaycastVehicle.prototype.updateWheelTransform = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRaycastVehicle_updateWheelTransform_2(self, arg0, arg1);
};;

btRaycastVehicle.prototype['addWheel'] = btRaycastVehicle.prototype.addWheel = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg5 && typeof arg5 === 'object') arg5 = arg5.ptr;
  if (arg6 && typeof arg6 === 'object') arg6 = arg6.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_addWheel_7(self, arg0, arg1, arg2, arg3, arg4, arg5, arg6), btWheelInfo);
};;

btRaycastVehicle.prototype['getNumWheels'] = btRaycastVehicle.prototype.getNumWheels = function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getNumWheels_0(self);
};;

btRaycastVehicle.prototype['getRigidBody'] = btRaycastVehicle.prototype.getRigidBody = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getRigidBody_0(self), btRigidBody);
};;

btRaycastVehicle.prototype['getWheelInfo'] = btRaycastVehicle.prototype.getWheelInfo = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getWheelInfo_1(self, arg0), btWheelInfo);
};;

btRaycastVehicle.prototype['setBrake'] = btRaycastVehicle.prototype.setBrake = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRaycastVehicle_setBrake_2(self, arg0, arg1);
};;

btRaycastVehicle.prototype['setCoordinateSystem'] = btRaycastVehicle.prototype.setCoordinateSystem = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btRaycastVehicle_setCoordinateSystem_3(self, arg0, arg1, arg2);
};;

btRaycastVehicle.prototype['getCurrentSpeedKmHour'] = btRaycastVehicle.prototype.getCurrentSpeedKmHour = function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0(self);
};;

  btRaycastVehicle.prototype['__destroy__'] = btRaycastVehicle.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btRaycastVehicle___destroy___0(self);
};
// btCylinderShapeX
function btCylinderShapeX(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btCylinderShapeX_btCylinderShapeX_1(arg0);
  getCache(btCylinderShapeX)[this.ptr] = this;
};;
btCylinderShapeX.prototype = Object.create(btCylinderShape.prototype);
btCylinderShapeX.prototype.constructor = btCylinderShapeX;
btCylinderShapeX.prototype.__class__ = btCylinderShapeX;
btCylinderShapeX.__cache__ = {};
Module['btCylinderShapeX'] = btCylinderShapeX;

btCylinderShapeX.prototype['setMargin'] = btCylinderShapeX.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShapeX_setMargin_1(self, arg0);
};;

btCylinderShapeX.prototype['getMargin'] = btCylinderShapeX.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCylinderShapeX_getMargin_0(self);
};;

btCylinderShapeX.prototype['setLocalScaling'] = btCylinderShapeX.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShapeX_setLocalScaling_1(self, arg0);
};;

btCylinderShapeX.prototype['calculateLocalInertia'] = btCylinderShapeX.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCylinderShapeX_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCylinderShapeX.prototype['__destroy__'] = btCylinderShapeX.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCylinderShapeX___destroy___0(self);
};
// btCylinderShapeZ
function btCylinderShapeZ(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1(arg0);
  getCache(btCylinderShapeZ)[this.ptr] = this;
};;
btCylinderShapeZ.prototype = Object.create(btCylinderShape.prototype);
btCylinderShapeZ.prototype.constructor = btCylinderShapeZ;
btCylinderShapeZ.prototype.__class__ = btCylinderShapeZ;
btCylinderShapeZ.__cache__ = {};
Module['btCylinderShapeZ'] = btCylinderShapeZ;

btCylinderShapeZ.prototype['setMargin'] = btCylinderShapeZ.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShapeZ_setMargin_1(self, arg0);
};;

btCylinderShapeZ.prototype['getMargin'] = btCylinderShapeZ.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCylinderShapeZ_getMargin_0(self);
};;

btCylinderShapeZ.prototype['setLocalScaling'] = btCylinderShapeZ.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShapeZ_setLocalScaling_1(self, arg0);
};;

btCylinderShapeZ.prototype['calculateLocalInertia'] = btCylinderShapeZ.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCylinderShapeZ.prototype['__destroy__'] = btCylinderShapeZ.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCylinderShapeZ___destroy___0(self);
};
// btSequentialImpulseConstraintSolver
function btSequentialImpulseConstraintSolver() {
  this.ptr = _emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0();
  getCache(btSequentialImpulseConstraintSolver)[this.ptr] = this;
};;
btSequentialImpulseConstraintSolver.prototype = Object.create(WrapperObject.prototype);
btSequentialImpulseConstraintSolver.prototype.constructor = btSequentialImpulseConstraintSolver;
btSequentialImpulseConstraintSolver.prototype.__class__ = btSequentialImpulseConstraintSolver;
btSequentialImpulseConstraintSolver.__cache__ = {};
Module['btSequentialImpulseConstraintSolver'] = btSequentialImpulseConstraintSolver;

  btSequentialImpulseConstraintSolver.prototype['__destroy__'] = btSequentialImpulseConstraintSolver.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0(self);
};
// RaycastInfo
function RaycastInfo() { throw "cannot construct a RaycastInfo, no constructor in IDL" }
RaycastInfo.prototype = Object.create(WrapperObject.prototype);
RaycastInfo.prototype.constructor = RaycastInfo;
RaycastInfo.prototype.__class__ = RaycastInfo;
RaycastInfo.__cache__ = {};
Module['RaycastInfo'] = RaycastInfo;

  RaycastInfo.prototype['get_m_contactNormalWS'] = RaycastInfo.prototype.get_m_contactNormalWS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_contactNormalWS_0(self), btVector3);
};
    RaycastInfo.prototype['set_m_contactNormalWS'] = RaycastInfo.prototype.set_m_contactNormalWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_contactNormalWS_1(self, arg0);
};
  RaycastInfo.prototype['get_m_contactPointWS'] = RaycastInfo.prototype.get_m_contactPointWS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_contactPointWS_0(self), btVector3);
};
    RaycastInfo.prototype['set_m_contactPointWS'] = RaycastInfo.prototype.set_m_contactPointWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_contactPointWS_1(self, arg0);
};
  RaycastInfo.prototype['get_m_suspensionLength'] = RaycastInfo.prototype.get_m_suspensionLength = function() {
  var self = this.ptr;
  return _emscripten_bind_RaycastInfo_get_m_suspensionLength_0(self);
};
    RaycastInfo.prototype['set_m_suspensionLength'] = RaycastInfo.prototype.set_m_suspensionLength = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_suspensionLength_1(self, arg0);
};
  RaycastInfo.prototype['get_m_hardPointWS'] = RaycastInfo.prototype.get_m_hardPointWS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_hardPointWS_0(self), btVector3);
};
    RaycastInfo.prototype['set_m_hardPointWS'] = RaycastInfo.prototype.set_m_hardPointWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_hardPointWS_1(self, arg0);
};
  RaycastInfo.prototype['get_m_wheelDirectionWS'] = RaycastInfo.prototype.get_m_wheelDirectionWS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0(self), btVector3);
};
    RaycastInfo.prototype['set_m_wheelDirectionWS'] = RaycastInfo.prototype.set_m_wheelDirectionWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1(self, arg0);
};
  RaycastInfo.prototype['get_m_wheelAxleWS'] = RaycastInfo.prototype.get_m_wheelAxleWS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0(self), btVector3);
};
    RaycastInfo.prototype['set_m_wheelAxleWS'] = RaycastInfo.prototype.set_m_wheelAxleWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1(self, arg0);
};
  RaycastInfo.prototype['get_m_isInContact'] = RaycastInfo.prototype.get_m_isInContact = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_RaycastInfo_get_m_isInContact_0(self));
};
    RaycastInfo.prototype['set_m_isInContact'] = RaycastInfo.prototype.set_m_isInContact = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_isInContact_1(self, arg0);
};
  RaycastInfo.prototype['get_m_groundObject'] = RaycastInfo.prototype.get_m_groundObject = function() {
  var self = this.ptr;
  return _emscripten_bind_RaycastInfo_get_m_groundObject_0(self);
};
    RaycastInfo.prototype['set_m_groundObject'] = RaycastInfo.prototype.set_m_groundObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_groundObject_1(self, arg0);
};
  RaycastInfo.prototype['__destroy__'] = RaycastInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_RaycastInfo___destroy___0(self);
};
// tNodeArray
function tNodeArray() { throw "cannot construct a tNodeArray, no constructor in IDL" }
tNodeArray.prototype = Object.create(WrapperObject.prototype);
tNodeArray.prototype.constructor = tNodeArray;
tNodeArray.prototype.__class__ = tNodeArray;
tNodeArray.__cache__ = {};
Module['tNodeArray'] = tNodeArray;

tNodeArray.prototype['size'] = tNodeArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_tNodeArray_size_0(self);
};;

tNodeArray.prototype['at'] = tNodeArray.prototype.at = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_tNodeArray_at_1(self, arg0), Node);
};;

  tNodeArray.prototype['__destroy__'] = tNodeArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_tNodeArray___destroy___0(self);
};
// btSoftBody
function btSoftBody(arg0, arg1, arg2, arg3) {
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (typeof arg3 == 'object') { arg3 = ensureFloat32(arg3); }
  this.ptr = _emscripten_bind_btSoftBody_btSoftBody_4(arg0, arg1, arg2, arg3);
  getCache(btSoftBody)[this.ptr] = this;
};;
btSoftBody.prototype = Object.create(btCollisionObject.prototype);
btSoftBody.prototype.constructor = btSoftBody;
btSoftBody.prototype.__class__ = btSoftBody;
btSoftBody.__cache__ = {};
Module['btSoftBody'] = btSoftBody;

btSoftBody.prototype['checkLink'] = btSoftBody.prototype.checkLink = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return !!(_emscripten_bind_btSoftBody_checkLink_2(self, arg0, arg1));
};;

btSoftBody.prototype['checkFace'] = btSoftBody.prototype.checkFace = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  return !!(_emscripten_bind_btSoftBody_checkFace_3(self, arg0, arg1, arg2));
};;

btSoftBody.prototype['appendMaterial'] = btSoftBody.prototype.appendMaterial = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_appendMaterial_0(self), Material);
};;

btSoftBody.prototype['appendNode'] = btSoftBody.prototype.appendNode = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftBody_appendNode_2(self, arg0, arg1);
};;

btSoftBody.prototype['appendLink'] = btSoftBody.prototype.appendLink = function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  _emscripten_bind_btSoftBody_appendLink_4(self, arg0, arg1, arg2, arg3);
};;

btSoftBody.prototype['appendFace'] = btSoftBody.prototype.appendFace = function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  _emscripten_bind_btSoftBody_appendFace_4(self, arg0, arg1, arg2, arg3);
};;

btSoftBody.prototype['appendTetra'] = btSoftBody.prototype.appendTetra = function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btSoftBody_appendTetra_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btSoftBody.prototype['appendAnchor'] = btSoftBody.prototype.appendAnchor = function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  _emscripten_bind_btSoftBody_appendAnchor_4(self, arg0, arg1, arg2, arg3);
};;

btSoftBody.prototype['getTotalMass'] = btSoftBody.prototype.getTotalMass = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getTotalMass_0(self);
};;

btSoftBody.prototype['setTotalMass'] = btSoftBody.prototype.setTotalMass = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftBody_setTotalMass_2(self, arg0, arg1);
};;

btSoftBody.prototype['setMass'] = btSoftBody.prototype.setMass = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftBody_setMass_2(self, arg0, arg1);
};;

btSoftBody.prototype['transform'] = btSoftBody.prototype.transform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_transform_1(self, arg0);
};;

btSoftBody.prototype['translate'] = btSoftBody.prototype.translate = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_translate_1(self, arg0);
};;

btSoftBody.prototype['rotate'] = btSoftBody.prototype.rotate = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_rotate_1(self, arg0);
};;

btSoftBody.prototype['scale'] = btSoftBody.prototype.scale = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_scale_1(self, arg0);
};;

btSoftBody.prototype['generateClusters'] = btSoftBody.prototype.generateClusters = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { return _emscripten_bind_btSoftBody_generateClusters_1(self, arg0) }
  return _emscripten_bind_btSoftBody_generateClusters_2(self, arg0, arg1);
};;

btSoftBody.prototype['upcast'] = btSoftBody.prototype.upcast = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_upcast_1(self, arg0), btSoftBody);
};;

btSoftBody.prototype['setAnisotropicFriction'] = btSoftBody.prototype.setAnisotropicFriction = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftBody_setAnisotropicFriction_2(self, arg0, arg1);
};;

btSoftBody.prototype['getCollisionShape'] = btSoftBody.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_getCollisionShape_0(self), btCollisionShape);
};;

btSoftBody.prototype['setContactProcessingThreshold'] = btSoftBody.prototype.setContactProcessingThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setContactProcessingThreshold_1(self, arg0);
};;

btSoftBody.prototype['setActivationState'] = btSoftBody.prototype.setActivationState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setActivationState_1(self, arg0);
};;

btSoftBody.prototype['forceActivationState'] = btSoftBody.prototype.forceActivationState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_forceActivationState_1(self, arg0);
};;

btSoftBody.prototype['activate'] = btSoftBody.prototype.activate = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { _emscripten_bind_btSoftBody_activate_0(self);  return }
  _emscripten_bind_btSoftBody_activate_1(self, arg0);
};;

btSoftBody.prototype['isActive'] = btSoftBody.prototype.isActive = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btSoftBody_isActive_0(self));
};;

btSoftBody.prototype['isKinematicObject'] = btSoftBody.prototype.isKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btSoftBody_isKinematicObject_0(self));
};;

btSoftBody.prototype['setRestitution'] = btSoftBody.prototype.setRestitution = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setRestitution_1(self, arg0);
};;

btSoftBody.prototype['setFriction'] = btSoftBody.prototype.setFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setFriction_1(self, arg0);
};;

btSoftBody.prototype['setRollingFriction'] = btSoftBody.prototype.setRollingFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setRollingFriction_1(self, arg0);
};;

btSoftBody.prototype['getWorldTransform'] = btSoftBody.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_getWorldTransform_0(self), btTransform);
};;

btSoftBody.prototype['getCollisionFlags'] = btSoftBody.prototype.getCollisionFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getCollisionFlags_0(self);
};;

btSoftBody.prototype['setCollisionFlags'] = btSoftBody.prototype.setCollisionFlags = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setCollisionFlags_1(self, arg0);
};;

btSoftBody.prototype['setWorldTransform'] = btSoftBody.prototype.setWorldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setWorldTransform_1(self, arg0);
};;

btSoftBody.prototype['setCollisionShape'] = btSoftBody.prototype.setCollisionShape = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setCollisionShape_1(self, arg0);
};;

btSoftBody.prototype['setCcdMotionThreshold'] = btSoftBody.prototype.setCcdMotionThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setCcdMotionThreshold_1(self, arg0);
};;

btSoftBody.prototype['setCcdSweptSphereRadius'] = btSoftBody.prototype.setCcdSweptSphereRadius = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1(self, arg0);
};;

btSoftBody.prototype['getUserIndex'] = btSoftBody.prototype.getUserIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getUserIndex_0(self);
};;

btSoftBody.prototype['setUserIndex'] = btSoftBody.prototype.setUserIndex = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setUserIndex_1(self, arg0);
};;

btSoftBody.prototype['getUserPointer'] = btSoftBody.prototype.getUserPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_getUserPointer_0(self), VoidPtr);
};;

btSoftBody.prototype['setUserPointer'] = btSoftBody.prototype.setUserPointer = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setUserPointer_1(self, arg0);
};;

  btSoftBody.prototype['get_m_cfg'] = btSoftBody.prototype.get_m_cfg = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_cfg_0(self), Config);
};
    btSoftBody.prototype['set_m_cfg'] = btSoftBody.prototype.set_m_cfg = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_cfg_1(self, arg0);
};
  btSoftBody.prototype['get_m_nodes'] = btSoftBody.prototype.get_m_nodes = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_nodes_0(self), tNodeArray);
};
    btSoftBody.prototype['set_m_nodes'] = btSoftBody.prototype.set_m_nodes = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_nodes_1(self, arg0);
};
  btSoftBody.prototype['get_m_materials'] = btSoftBody.prototype.get_m_materials = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_materials_0(self), tMaterialArray);
};
    btSoftBody.prototype['set_m_materials'] = btSoftBody.prototype.set_m_materials = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_materials_1(self, arg0);
};
  btSoftBody.prototype['__destroy__'] = btSoftBody.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBody___destroy___0(self);
};
// btHeightfieldTerrainShape
function btHeightfieldTerrainShape(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg5 && typeof arg5 === 'object') arg5 = arg5.ptr;
  if (arg6 && typeof arg6 === 'object') arg6 = arg6.ptr;
  if (arg7 && typeof arg7 === 'object') arg7 = arg7.ptr;
  if (arg8 && typeof arg8 === 'object') arg8 = arg8.ptr;
  this.ptr = _emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
  getCache(btHeightfieldTerrainShape)[this.ptr] = this;
};;
btHeightfieldTerrainShape.prototype = Object.create(btConcaveShape.prototype);
btHeightfieldTerrainShape.prototype.constructor = btHeightfieldTerrainShape;
btHeightfieldTerrainShape.prototype.__class__ = btHeightfieldTerrainShape;
btHeightfieldTerrainShape.__cache__ = {};
Module['btHeightfieldTerrainShape'] = btHeightfieldTerrainShape;

btHeightfieldTerrainShape.prototype['setMargin'] = btHeightfieldTerrainShape.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHeightfieldTerrainShape_setMargin_1(self, arg0);
};;

btHeightfieldTerrainShape.prototype['getMargin'] = btHeightfieldTerrainShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btHeightfieldTerrainShape_getMargin_0(self);
};;

btHeightfieldTerrainShape.prototype['setLocalScaling'] = btHeightfieldTerrainShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1(self, arg0);
};;

btHeightfieldTerrainShape.prototype['calculateLocalInertia'] = btHeightfieldTerrainShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btHeightfieldTerrainShape.prototype['__destroy__'] = btHeightfieldTerrainShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btHeightfieldTerrainShape___destroy___0(self);
};
// Config
function Config() { throw "cannot construct a Config, no constructor in IDL" }
Config.prototype = Object.create(WrapperObject.prototype);
Config.prototype.constructor = Config;
Config.prototype.__class__ = Config;
Config.__cache__ = {};
Module['Config'] = Config;

  Config.prototype['get_kVCF'] = Config.prototype.get_kVCF = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kVCF_0(self);
};
    Config.prototype['set_kVCF'] = Config.prototype.set_kVCF = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kVCF_1(self, arg0);
};
  Config.prototype['get_kDP'] = Config.prototype.get_kDP = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kDP_0(self);
};
    Config.prototype['set_kDP'] = Config.prototype.set_kDP = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kDP_1(self, arg0);
};
  Config.prototype['get_kDG'] = Config.prototype.get_kDG = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kDG_0(self);
};
    Config.prototype['set_kDG'] = Config.prototype.set_kDG = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kDG_1(self, arg0);
};
  Config.prototype['get_kLF'] = Config.prototype.get_kLF = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kLF_0(self);
};
    Config.prototype['set_kLF'] = Config.prototype.set_kLF = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kLF_1(self, arg0);
};
  Config.prototype['get_kPR'] = Config.prototype.get_kPR = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kPR_0(self);
};
    Config.prototype['set_kPR'] = Config.prototype.set_kPR = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kPR_1(self, arg0);
};
  Config.prototype['get_kVC'] = Config.prototype.get_kVC = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kVC_0(self);
};
    Config.prototype['set_kVC'] = Config.prototype.set_kVC = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kVC_1(self, arg0);
};
  Config.prototype['get_kDF'] = Config.prototype.get_kDF = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kDF_0(self);
};
    Config.prototype['set_kDF'] = Config.prototype.set_kDF = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kDF_1(self, arg0);
};
  Config.prototype['get_kMT'] = Config.prototype.get_kMT = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kMT_0(self);
};
    Config.prototype['set_kMT'] = Config.prototype.set_kMT = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kMT_1(self, arg0);
};
  Config.prototype['get_kCHR'] = Config.prototype.get_kCHR = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kCHR_0(self);
};
    Config.prototype['set_kCHR'] = Config.prototype.set_kCHR = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kCHR_1(self, arg0);
};
  Config.prototype['get_kKHR'] = Config.prototype.get_kKHR = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kKHR_0(self);
};
    Config.prototype['set_kKHR'] = Config.prototype.set_kKHR = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kKHR_1(self, arg0);
};
  Config.prototype['get_kSHR'] = Config.prototype.get_kSHR = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSHR_0(self);
};
    Config.prototype['set_kSHR'] = Config.prototype.set_kSHR = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSHR_1(self, arg0);
};
  Config.prototype['get_kAHR'] = Config.prototype.get_kAHR = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kAHR_0(self);
};
    Config.prototype['set_kAHR'] = Config.prototype.set_kAHR = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kAHR_1(self, arg0);
};
  Config.prototype['get_kSRHR_CL'] = Config.prototype.get_kSRHR_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSRHR_CL_0(self);
};
    Config.prototype['set_kSRHR_CL'] = Config.prototype.set_kSRHR_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSRHR_CL_1(self, arg0);
};
  Config.prototype['get_kSKHR_CL'] = Config.prototype.get_kSKHR_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSKHR_CL_0(self);
};
    Config.prototype['set_kSKHR_CL'] = Config.prototype.set_kSKHR_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSKHR_CL_1(self, arg0);
};
  Config.prototype['get_kSSHR_CL'] = Config.prototype.get_kSSHR_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSSHR_CL_0(self);
};
    Config.prototype['set_kSSHR_CL'] = Config.prototype.set_kSSHR_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSSHR_CL_1(self, arg0);
};
  Config.prototype['get_kSR_SPLT_CL'] = Config.prototype.get_kSR_SPLT_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSR_SPLT_CL_0(self);
};
    Config.prototype['set_kSR_SPLT_CL'] = Config.prototype.set_kSR_SPLT_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSR_SPLT_CL_1(self, arg0);
};
  Config.prototype['get_kSK_SPLT_CL'] = Config.prototype.get_kSK_SPLT_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSK_SPLT_CL_0(self);
};
    Config.prototype['set_kSK_SPLT_CL'] = Config.prototype.set_kSK_SPLT_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSK_SPLT_CL_1(self, arg0);
};
  Config.prototype['get_kSS_SPLT_CL'] = Config.prototype.get_kSS_SPLT_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSS_SPLT_CL_0(self);
};
    Config.prototype['set_kSS_SPLT_CL'] = Config.prototype.set_kSS_SPLT_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSS_SPLT_CL_1(self, arg0);
};
  Config.prototype['get_maxvolume'] = Config.prototype.get_maxvolume = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_maxvolume_0(self);
};
    Config.prototype['set_maxvolume'] = Config.prototype.set_maxvolume = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_maxvolume_1(self, arg0);
};
  Config.prototype['get_timescale'] = Config.prototype.get_timescale = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_timescale_0(self);
};
    Config.prototype['set_timescale'] = Config.prototype.set_timescale = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_timescale_1(self, arg0);
};
  Config.prototype['get_viterations'] = Config.prototype.get_viterations = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_viterations_0(self);
};
    Config.prototype['set_viterations'] = Config.prototype.set_viterations = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_viterations_1(self, arg0);
};
  Config.prototype['get_piterations'] = Config.prototype.get_piterations = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_piterations_0(self);
};
    Config.prototype['set_piterations'] = Config.prototype.set_piterations = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_piterations_1(self, arg0);
};
  Config.prototype['get_diterations'] = Config.prototype.get_diterations = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_diterations_0(self);
};
    Config.prototype['set_diterations'] = Config.prototype.set_diterations = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_diterations_1(self, arg0);
};
  Config.prototype['get_citerations'] = Config.prototype.get_citerations = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_citerations_0(self);
};
    Config.prototype['set_citerations'] = Config.prototype.set_citerations = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_citerations_1(self, arg0);
};
  Config.prototype['get_collisions'] = Config.prototype.get_collisions = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_collisions_0(self);
};
    Config.prototype['set_collisions'] = Config.prototype.set_collisions = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_collisions_1(self, arg0);
};
  Config.prototype['__destroy__'] = Config.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Config___destroy___0(self);
};
// Node
function Node() { throw "cannot construct a Node, no constructor in IDL" }
Node.prototype = Object.create(WrapperObject.prototype);
Node.prototype.constructor = Node;
Node.prototype.__class__ = Node;
Node.__cache__ = {};
Module['Node'] = Node;

  Node.prototype['get_m_x'] = Node.prototype.get_m_x = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_x_0(self), btVector3);
};
    Node.prototype['set_m_x'] = Node.prototype.set_m_x = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_x_1(self, arg0);
};
  Node.prototype['get_m_n'] = Node.prototype.get_m_n = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_n_0(self), btVector3);
};
    Node.prototype['set_m_n'] = Node.prototype.set_m_n = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_n_1(self, arg0);
};
  Node.prototype['__destroy__'] = Node.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Node___destroy___0(self);
};
// btGhostPairCallback
function btGhostPairCallback() {
  this.ptr = _emscripten_bind_btGhostPairCallback_btGhostPairCallback_0();
  getCache(btGhostPairCallback)[this.ptr] = this;
};;
btGhostPairCallback.prototype = Object.create(WrapperObject.prototype);
btGhostPairCallback.prototype.constructor = btGhostPairCallback;
btGhostPairCallback.prototype.__class__ = btGhostPairCallback;
btGhostPairCallback.__cache__ = {};
Module['btGhostPairCallback'] = btGhostPairCallback;

  btGhostPairCallback.prototype['__destroy__'] = btGhostPairCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGhostPairCallback___destroy___0(self);
};
// btOverlappingPairCallback
function btOverlappingPairCallback() { throw "cannot construct a btOverlappingPairCallback, no constructor in IDL" }
btOverlappingPairCallback.prototype = Object.create(WrapperObject.prototype);
btOverlappingPairCallback.prototype.constructor = btOverlappingPairCallback;
btOverlappingPairCallback.prototype.__class__ = btOverlappingPairCallback;
btOverlappingPairCallback.__cache__ = {};
Module['btOverlappingPairCallback'] = btOverlappingPairCallback;

  btOverlappingPairCallback.prototype['__destroy__'] = btOverlappingPairCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btOverlappingPairCallback___destroy___0(self);
};
// btCollisionDispatcher
function btCollisionDispatcher(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1(arg0);
  getCache(btCollisionDispatcher)[this.ptr] = this;
};;
btCollisionDispatcher.prototype = Object.create(btDispatcher.prototype);
btCollisionDispatcher.prototype.constructor = btCollisionDispatcher;
btCollisionDispatcher.prototype.__class__ = btCollisionDispatcher;
btCollisionDispatcher.__cache__ = {};
Module['btCollisionDispatcher'] = btCollisionDispatcher;

btCollisionDispatcher.prototype['getNumManifolds'] = btCollisionDispatcher.prototype.getNumManifolds = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionDispatcher_getNumManifolds_0(self);
};;

btCollisionDispatcher.prototype['getManifoldByIndexInternal'] = btCollisionDispatcher.prototype.getManifoldByIndexInternal = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1(self, arg0), btPersistentManifold);
};;

  btCollisionDispatcher.prototype['__destroy__'] = btCollisionDispatcher.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionDispatcher___destroy___0(self);
};
// btSoftBodyArray
function btSoftBodyArray() { throw "cannot construct a btSoftBodyArray, no constructor in IDL" }
btSoftBodyArray.prototype = Object.create(WrapperObject.prototype);
btSoftBodyArray.prototype.constructor = btSoftBodyArray;
btSoftBodyArray.prototype.__class__ = btSoftBodyArray;
btSoftBodyArray.__cache__ = {};
Module['btSoftBodyArray'] = btSoftBodyArray;

btSoftBodyArray.prototype['size'] = btSoftBodyArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyArray_size_0(self);
};;

btSoftBodyArray.prototype['at'] = btSoftBodyArray.prototype.at = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyArray_at_1(self, arg0), btSoftBody);
};;

  btSoftBodyArray.prototype['__destroy__'] = btSoftBodyArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyArray___destroy___0(self);
};
// btStaticPlaneShape
function btStaticPlaneShape(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  this.ptr = _emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2(arg0, arg1);
  getCache(btStaticPlaneShape)[this.ptr] = this;
};;
btStaticPlaneShape.prototype = Object.create(btConcaveShape.prototype);
btStaticPlaneShape.prototype.constructor = btStaticPlaneShape;
btStaticPlaneShape.prototype.__class__ = btStaticPlaneShape;
btStaticPlaneShape.__cache__ = {};
Module['btStaticPlaneShape'] = btStaticPlaneShape;

btStaticPlaneShape.prototype['setLocalScaling'] = btStaticPlaneShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btStaticPlaneShape_setLocalScaling_1(self, arg0);
};;

btStaticPlaneShape.prototype['calculateLocalInertia'] = btStaticPlaneShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btStaticPlaneShape.prototype['__destroy__'] = btStaticPlaneShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btStaticPlaneShape___destroy___0(self);
};
// btOverlappingPairCache
function btOverlappingPairCache() { throw "cannot construct a btOverlappingPairCache, no constructor in IDL" }
btOverlappingPairCache.prototype = Object.create(WrapperObject.prototype);
btOverlappingPairCache.prototype.constructor = btOverlappingPairCache;
btOverlappingPairCache.prototype.__class__ = btOverlappingPairCache;
btOverlappingPairCache.__cache__ = {};
Module['btOverlappingPairCache'] = btOverlappingPairCache;

btOverlappingPairCache.prototype['setInternalGhostPairCallback'] = btOverlappingPairCache.prototype.setInternalGhostPairCallback = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1(self, arg0);
};;

  btOverlappingPairCache.prototype['__destroy__'] = btOverlappingPairCache.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btOverlappingPairCache___destroy___0(self);
};
// btSoftRigidDynamicsWorld
function btSoftRigidDynamicsWorld(arg0, arg1, arg2, arg3, arg4) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  this.ptr = _emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5(arg0, arg1, arg2, arg3, arg4);
  getCache(btSoftRigidDynamicsWorld)[this.ptr] = this;
};;
btSoftRigidDynamicsWorld.prototype = Object.create(btDiscreteDynamicsWorld.prototype);
btSoftRigidDynamicsWorld.prototype.constructor = btSoftRigidDynamicsWorld;
btSoftRigidDynamicsWorld.prototype.__class__ = btSoftRigidDynamicsWorld;
btSoftRigidDynamicsWorld.__cache__ = {};
Module['btSoftRigidDynamicsWorld'] = btSoftRigidDynamicsWorld;

btSoftRigidDynamicsWorld.prototype['addSoftBody'] = btSoftRigidDynamicsWorld.prototype.addSoftBody = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['removeSoftBody'] = btSoftRigidDynamicsWorld.prototype.removeSoftBody = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['removeCollisionObject'] = btSoftRigidDynamicsWorld.prototype.removeCollisionObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['getWorldInfo'] = btSoftRigidDynamicsWorld.prototype.getWorldInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0(self), btSoftBodyWorldInfo);
};;

btSoftRigidDynamicsWorld.prototype['getSoftBodyArray'] = btSoftRigidDynamicsWorld.prototype.getSoftBodyArray = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0(self), btSoftBodyArray);
};;

btSoftRigidDynamicsWorld.prototype['getDispatcher'] = btSoftRigidDynamicsWorld.prototype.getDispatcher = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0(self), btDispatcher);
};;

btSoftRigidDynamicsWorld.prototype['rayTest'] = btSoftRigidDynamicsWorld.prototype.rayTest = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['getPairCache'] = btSoftRigidDynamicsWorld.prototype.getPairCache = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0(self), btOverlappingPairCache);
};;

btSoftRigidDynamicsWorld.prototype['getDispatchInfo'] = btSoftRigidDynamicsWorld.prototype.getDispatchInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0(self), btDispatcherInfo);
};;

btSoftRigidDynamicsWorld.prototype['addCollisionObject'] = btSoftRigidDynamicsWorld.prototype.addCollisionObject = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2(self, arg0, arg1);  return }
  _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['getBroadphase'] = btSoftRigidDynamicsWorld.prototype.getBroadphase = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0(self), btBroadphaseInterface);
};;

btSoftRigidDynamicsWorld.prototype['convexSweepTest'] = btSoftRigidDynamicsWorld.prototype.convexSweepTest = function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btSoftRigidDynamicsWorld.prototype['contactPairTest'] = btSoftRigidDynamicsWorld.prototype.contactPairTest = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['contactTest'] = btSoftRigidDynamicsWorld.prototype.contactTest = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2(self, arg0, arg1);
};;

btSoftRigidDynamicsWorld.prototype['setGravity'] = btSoftRigidDynamicsWorld.prototype.setGravity = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['getGravity'] = btSoftRigidDynamicsWorld.prototype.getGravity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0(self), btVector3);
};;

btSoftRigidDynamicsWorld.prototype['addRigidBody'] = btSoftRigidDynamicsWorld.prototype.addRigidBody = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_2(self, arg0, arg1);  return }
  _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['removeRigidBody'] = btSoftRigidDynamicsWorld.prototype.removeRigidBody = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['addVehicle'] = btSoftRigidDynamicsWorld.prototype.addVehicle = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_addVehicle_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['removeVehicle'] = btSoftRigidDynamicsWorld.prototype.removeVehicle = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeVehicle_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['addConstraint'] = btSoftRigidDynamicsWorld.prototype.addConstraint = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1(self, arg0);  return }
  _emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2(self, arg0, arg1);
};;

btSoftRigidDynamicsWorld.prototype['removeConstraint'] = btSoftRigidDynamicsWorld.prototype.removeConstraint = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['stepSimulation'] = btSoftRigidDynamicsWorld.prototype.stepSimulation = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { return _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1(self, arg0) }
  if (arg2 === undefined) { return _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2(self, arg0, arg1) }
  return _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['addAction'] = btSoftRigidDynamicsWorld.prototype.addAction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_addAction_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['removeAction'] = btSoftRigidDynamicsWorld.prototype.removeAction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['getSolverInfo'] = btSoftRigidDynamicsWorld.prototype.getSolverInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0(self), btContactSolverInfo);
};;

  btSoftRigidDynamicsWorld.prototype['__destroy__'] = btSoftRigidDynamicsWorld.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld___destroy___0(self);
};
// btTransform
function btTransform(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg0 === undefined) { this.ptr = _emscripten_bind_btTransform_btTransform_0(); getCache(btTransform)[this.ptr] = this;return }
  if (arg1 === undefined) { this.ptr = _emscripten_bind_btTransform_btTransform_1(arg0); getCache(btTransform)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btTransform_btTransform_2(arg0, arg1);
  getCache(btTransform)[this.ptr] = this;
};;
btTransform.prototype = Object.create(WrapperObject.prototype);
btTransform.prototype.constructor = btTransform;
btTransform.prototype.__class__ = btTransform;
btTransform.__cache__ = {};
Module['btTransform'] = btTransform;

btTransform.prototype['setIdentity'] = btTransform.prototype.setIdentity = function() {
  var self = this.ptr;
  _emscripten_bind_btTransform_setIdentity_0(self);
};;

btTransform.prototype['setOrigin'] = btTransform.prototype.setOrigin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btTransform_setOrigin_1(self, arg0);
};;

btTransform.prototype['setRotation'] = btTransform.prototype.setRotation = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btTransform_setRotation_1(self, arg0);
};;

btTransform.prototype['getOrigin'] = btTransform.prototype.getOrigin = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_getOrigin_0(self), btVector3);
};;

btTransform.prototype['getRotation'] = btTransform.prototype.getRotation = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_getRotation_0(self), btQuaternion);
};;

btTransform.prototype['getBasis'] = btTransform.prototype.getBasis = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_getBasis_0(self), btMatrix3x3);
};;

btTransform.prototype['setFromOpenGLMatrix'] = btTransform.prototype.setFromOpenGLMatrix = function(arg0) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof arg0 == 'object') { arg0 = ensureFloat32(arg0); }
  _emscripten_bind_btTransform_setFromOpenGLMatrix_1(self, arg0);
};;

  btTransform.prototype['__destroy__'] = btTransform.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btTransform___destroy___0(self);
};
// ClosestRayResultCallback
function ClosestRayResultCallback(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  this.ptr = _emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2(arg0, arg1);
  getCache(ClosestRayResultCallback)[this.ptr] = this;
};;
ClosestRayResultCallback.prototype = Object.create(RayResultCallback.prototype);
ClosestRayResultCallback.prototype.constructor = ClosestRayResultCallback;
ClosestRayResultCallback.prototype.__class__ = ClosestRayResultCallback;
ClosestRayResultCallback.__cache__ = {};
Module['ClosestRayResultCallback'] = ClosestRayResultCallback;

ClosestRayResultCallback.prototype['hasHit'] = ClosestRayResultCallback.prototype.hasHit = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ClosestRayResultCallback_hasHit_0(self));
};;

  ClosestRayResultCallback.prototype['get_m_rayFromWorld'] = ClosestRayResultCallback.prototype.get_m_rayFromWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0(self), btVector3);
};
    ClosestRayResultCallback.prototype['set_m_rayFromWorld'] = ClosestRayResultCallback.prototype.set_m_rayFromWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_rayToWorld'] = ClosestRayResultCallback.prototype.get_m_rayToWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0(self), btVector3);
};
    ClosestRayResultCallback.prototype['set_m_rayToWorld'] = ClosestRayResultCallback.prototype.set_m_rayToWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_hitNormalWorld'] = ClosestRayResultCallback.prototype.get_m_hitNormalWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0(self), btVector3);
};
    ClosestRayResultCallback.prototype['set_m_hitNormalWorld'] = ClosestRayResultCallback.prototype.set_m_hitNormalWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_hitPointWorld'] = ClosestRayResultCallback.prototype.get_m_hitPointWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0(self), btVector3);
};
    ClosestRayResultCallback.prototype['set_m_hitPointWorld'] = ClosestRayResultCallback.prototype.set_m_hitPointWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_collisionFilterGroup'] = ClosestRayResultCallback.prototype.get_m_collisionFilterGroup = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0(self);
};
    ClosestRayResultCallback.prototype['set_m_collisionFilterGroup'] = ClosestRayResultCallback.prototype.set_m_collisionFilterGroup = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_collisionFilterMask'] = ClosestRayResultCallback.prototype.get_m_collisionFilterMask = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0(self);
};
    ClosestRayResultCallback.prototype['set_m_collisionFilterMask'] = ClosestRayResultCallback.prototype.set_m_collisionFilterMask = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_collisionObject'] = ClosestRayResultCallback.prototype.get_m_collisionObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0(self), btCollisionObject);
};
    ClosestRayResultCallback.prototype['set_m_collisionObject'] = ClosestRayResultCallback.prototype.set_m_collisionObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1(self, arg0);
};
  ClosestRayResultCallback.prototype['__destroy__'] = ClosestRayResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ClosestRayResultCallback___destroy___0(self);
};
// btSoftBodyRigidBodyCollisionConfiguration
function btSoftBodyRigidBodyCollisionConfiguration(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { this.ptr = _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0(); getCache(btSoftBodyRigidBodyCollisionConfiguration)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1(arg0);
  getCache(btSoftBodyRigidBodyCollisionConfiguration)[this.ptr] = this;
};;
btSoftBodyRigidBodyCollisionConfiguration.prototype = Object.create(btDefaultCollisionConfiguration.prototype);
btSoftBodyRigidBodyCollisionConfiguration.prototype.constructor = btSoftBodyRigidBodyCollisionConfiguration;
btSoftBodyRigidBodyCollisionConfiguration.prototype.__class__ = btSoftBodyRigidBodyCollisionConfiguration;
btSoftBodyRigidBodyCollisionConfiguration.__cache__ = {};
Module['btSoftBodyRigidBodyCollisionConfiguration'] = btSoftBodyRigidBodyCollisionConfiguration;

  btSoftBodyRigidBodyCollisionConfiguration.prototype['__destroy__'] = btSoftBodyRigidBodyCollisionConfiguration.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0(self);
};
// ConcreteContactResultCallback
function ConcreteContactResultCallback() {
  this.ptr = _emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0();
  getCache(ConcreteContactResultCallback)[this.ptr] = this;
};;
ConcreteContactResultCallback.prototype = Object.create(ContactResultCallback.prototype);
ConcreteContactResultCallback.prototype.constructor = ConcreteContactResultCallback;
ConcreteContactResultCallback.prototype.__class__ = ConcreteContactResultCallback;
ConcreteContactResultCallback.__cache__ = {};
Module['ConcreteContactResultCallback'] = ConcreteContactResultCallback;

ConcreteContactResultCallback.prototype['addSingleResult'] = ConcreteContactResultCallback.prototype.addSingleResult = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg5 && typeof arg5 === 'object') arg5 = arg5.ptr;
  if (arg6 && typeof arg6 === 'object') arg6 = arg6.ptr;
  return _emscripten_bind_ConcreteContactResultCallback_addSingleResult_7(self, arg0, arg1, arg2, arg3, arg4, arg5, arg6);
};;

  ConcreteContactResultCallback.prototype['__destroy__'] = ConcreteContactResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ConcreteContactResultCallback___destroy___0(self);
};
// btBvhTriangleMeshShape
function btBvhTriangleMeshShape(arg0, arg1, arg2) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg2 === undefined) { this.ptr = _emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2(arg0, arg1); getCache(btBvhTriangleMeshShape)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3(arg0, arg1, arg2);
  getCache(btBvhTriangleMeshShape)[this.ptr] = this;
};;
btBvhTriangleMeshShape.prototype = Object.create(btTriangleMeshShape.prototype);
btBvhTriangleMeshShape.prototype.constructor = btBvhTriangleMeshShape;
btBvhTriangleMeshShape.prototype.__class__ = btBvhTriangleMeshShape;
btBvhTriangleMeshShape.__cache__ = {};
Module['btBvhTriangleMeshShape'] = btBvhTriangleMeshShape;

btBvhTriangleMeshShape.prototype['setLocalScaling'] = btBvhTriangleMeshShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1(self, arg0);
};;

btBvhTriangleMeshShape.prototype['calculateLocalInertia'] = btBvhTriangleMeshShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btBvhTriangleMeshShape.prototype['__destroy__'] = btBvhTriangleMeshShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btBvhTriangleMeshShape___destroy___0(self);
};
// btSliderConstraint
function btSliderConstraint(arg0, arg1, arg2, arg3, arg4) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg3 === undefined) { this.ptr = _emscripten_bind_btSliderConstraint_btSliderConstraint_3(arg0, arg1, arg2); getCache(btSliderConstraint)[this.ptr] = this;return }
  if (arg4 === undefined) { this.ptr = _emscripten_bind_btSliderConstraint_btSliderConstraint_4(arg0, arg1, arg2, arg3); getCache(btSliderConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btSliderConstraint_btSliderConstraint_5(arg0, arg1, arg2, arg3, arg4);
  getCache(btSliderConstraint)[this.ptr] = this;
};;
btSliderConstraint.prototype = Object.create(btTypedConstraint.prototype);
btSliderConstraint.prototype.constructor = btSliderConstraint;
btSliderConstraint.prototype.__class__ = btSliderConstraint;
btSliderConstraint.__cache__ = {};
Module['btSliderConstraint'] = btSliderConstraint;

btSliderConstraint.prototype['setLowerLinLimit'] = btSliderConstraint.prototype.setLowerLinLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_setLowerLinLimit_1(self, arg0);
};;

btSliderConstraint.prototype['setUpperLinLimit'] = btSliderConstraint.prototype.setUpperLinLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_setUpperLinLimit_1(self, arg0);
};;

btSliderConstraint.prototype['setLowerAngLimit'] = btSliderConstraint.prototype.setLowerAngLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_setLowerAngLimit_1(self, arg0);
};;

btSliderConstraint.prototype['setUpperAngLimit'] = btSliderConstraint.prototype.setUpperAngLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_setUpperAngLimit_1(self, arg0);
};;

btSliderConstraint.prototype['enableFeedback'] = btSliderConstraint.prototype.enableFeedback = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_enableFeedback_1(self, arg0);
};;

btSliderConstraint.prototype['getBreakingImpulseThreshold'] = btSliderConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0(self);
};;

btSliderConstraint.prototype['setBreakingImpulseThreshold'] = btSliderConstraint.prototype.setBreakingImpulseThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

  btSliderConstraint.prototype['__destroy__'] = btSliderConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSliderConstraint___destroy___0(self);
};
// btPairCachingGhostObject
function btPairCachingGhostObject() {
  this.ptr = _emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0();
  getCache(btPairCachingGhostObject)[this.ptr] = this;
};;
btPairCachingGhostObject.prototype = Object.create(btGhostObject.prototype);
btPairCachingGhostObject.prototype.constructor = btPairCachingGhostObject;
btPairCachingGhostObject.prototype.__class__ = btPairCachingGhostObject;
btPairCachingGhostObject.__cache__ = {};
Module['btPairCachingGhostObject'] = btPairCachingGhostObject;

btPairCachingGhostObject.prototype['setAnisotropicFriction'] = btPairCachingGhostObject.prototype.setAnisotropicFriction = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2(self, arg0, arg1);
};;

btPairCachingGhostObject.prototype['getCollisionShape'] = btPairCachingGhostObject.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getCollisionShape_0(self), btCollisionShape);
};;

btPairCachingGhostObject.prototype['setContactProcessingThreshold'] = btPairCachingGhostObject.prototype.setContactProcessingThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setActivationState'] = btPairCachingGhostObject.prototype.setActivationState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setActivationState_1(self, arg0);
};;

btPairCachingGhostObject.prototype['forceActivationState'] = btPairCachingGhostObject.prototype.forceActivationState = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_forceActivationState_1(self, arg0);
};;

btPairCachingGhostObject.prototype['activate'] = btPairCachingGhostObject.prototype.activate = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { _emscripten_bind_btPairCachingGhostObject_activate_0(self);  return }
  _emscripten_bind_btPairCachingGhostObject_activate_1(self, arg0);
};;

btPairCachingGhostObject.prototype['isActive'] = btPairCachingGhostObject.prototype.isActive = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPairCachingGhostObject_isActive_0(self));
};;

btPairCachingGhostObject.prototype['isKinematicObject'] = btPairCachingGhostObject.prototype.isKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPairCachingGhostObject_isKinematicObject_0(self));
};;

btPairCachingGhostObject.prototype['setRestitution'] = btPairCachingGhostObject.prototype.setRestitution = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setRestitution_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setFriction'] = btPairCachingGhostObject.prototype.setFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setFriction_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setRollingFriction'] = btPairCachingGhostObject.prototype.setRollingFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setRollingFriction_1(self, arg0);
};;

btPairCachingGhostObject.prototype['getWorldTransform'] = btPairCachingGhostObject.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getWorldTransform_0(self), btTransform);
};;

btPairCachingGhostObject.prototype['getCollisionFlags'] = btPairCachingGhostObject.prototype.getCollisionFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0(self);
};;

btPairCachingGhostObject.prototype['setCollisionFlags'] = btPairCachingGhostObject.prototype.setCollisionFlags = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setWorldTransform'] = btPairCachingGhostObject.prototype.setWorldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setWorldTransform_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setCollisionShape'] = btPairCachingGhostObject.prototype.setCollisionShape = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCollisionShape_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setCcdMotionThreshold'] = btPairCachingGhostObject.prototype.setCcdMotionThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setCcdSweptSphereRadius'] = btPairCachingGhostObject.prototype.setCcdSweptSphereRadius = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1(self, arg0);
};;

btPairCachingGhostObject.prototype['getUserIndex'] = btPairCachingGhostObject.prototype.getUserIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getUserIndex_0(self);
};;

btPairCachingGhostObject.prototype['setUserIndex'] = btPairCachingGhostObject.prototype.setUserIndex = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setUserIndex_1(self, arg0);
};;

btPairCachingGhostObject.prototype['getUserPointer'] = btPairCachingGhostObject.prototype.getUserPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getUserPointer_0(self), VoidPtr);
};;

btPairCachingGhostObject.prototype['setUserPointer'] = btPairCachingGhostObject.prototype.setUserPointer = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setUserPointer_1(self, arg0);
};;

btPairCachingGhostObject.prototype['getNumOverlappingObjects'] = btPairCachingGhostObject.prototype.getNumOverlappingObjects = function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0(self);
};;

btPairCachingGhostObject.prototype['getOverlappingObject'] = btPairCachingGhostObject.prototype.getOverlappingObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1(self, arg0), btCollisionObject);
};;

  btPairCachingGhostObject.prototype['__destroy__'] = btPairCachingGhostObject.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btPairCachingGhostObject___destroy___0(self);
};
// btManifoldPoint
function btManifoldPoint() { throw "cannot construct a btManifoldPoint, no constructor in IDL" }
btManifoldPoint.prototype = Object.create(WrapperObject.prototype);
btManifoldPoint.prototype.constructor = btManifoldPoint;
btManifoldPoint.prototype.__class__ = btManifoldPoint;
btManifoldPoint.__cache__ = {};
Module['btManifoldPoint'] = btManifoldPoint;

btManifoldPoint.prototype['getPositionWorldOnA'] = btManifoldPoint.prototype.getPositionWorldOnA = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_getPositionWorldOnA_0(self), btVector3);
};;

btManifoldPoint.prototype['getPositionWorldOnB'] = btManifoldPoint.prototype.getPositionWorldOnB = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_getPositionWorldOnB_0(self), btVector3);
};;

btManifoldPoint.prototype['getAppliedImpulse'] = btManifoldPoint.prototype.getAppliedImpulse = function() {
  var self = this.ptr;
  return _emscripten_bind_btManifoldPoint_getAppliedImpulse_0(self);
};;

btManifoldPoint.prototype['getDistance'] = btManifoldPoint.prototype.getDistance = function() {
  var self = this.ptr;
  return _emscripten_bind_btManifoldPoint_getDistance_0(self);
};;

  btManifoldPoint.prototype['get_m_localPointA'] = btManifoldPoint.prototype.get_m_localPointA = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_localPointA_0(self), btVector3);
};
    btManifoldPoint.prototype['set_m_localPointA'] = btManifoldPoint.prototype.set_m_localPointA = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_localPointA_1(self, arg0);
};
  btManifoldPoint.prototype['get_m_localPointB'] = btManifoldPoint.prototype.get_m_localPointB = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_localPointB_0(self), btVector3);
};
    btManifoldPoint.prototype['set_m_localPointB'] = btManifoldPoint.prototype.set_m_localPointB = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_localPointB_1(self, arg0);
};
  btManifoldPoint.prototype['get_m_positionWorldOnB'] = btManifoldPoint.prototype.get_m_positionWorldOnB = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0(self), btVector3);
};
    btManifoldPoint.prototype['set_m_positionWorldOnB'] = btManifoldPoint.prototype.set_m_positionWorldOnB = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1(self, arg0);
};
  btManifoldPoint.prototype['get_m_positionWorldOnA'] = btManifoldPoint.prototype.get_m_positionWorldOnA = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0(self), btVector3);
};
    btManifoldPoint.prototype['set_m_positionWorldOnA'] = btManifoldPoint.prototype.set_m_positionWorldOnA = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1(self, arg0);
};
  btManifoldPoint.prototype['get_m_normalWorldOnB'] = btManifoldPoint.prototype.get_m_normalWorldOnB = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0(self), btVector3);
};
    btManifoldPoint.prototype['set_m_normalWorldOnB'] = btManifoldPoint.prototype.set_m_normalWorldOnB = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1(self, arg0);
};
  btManifoldPoint.prototype['__destroy__'] = btManifoldPoint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btManifoldPoint___destroy___0(self);
};
// btPoint2PointConstraint
function btPoint2PointConstraint(arg0, arg1, arg2, arg3) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg2 === undefined) { this.ptr = _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2(arg0, arg1); getCache(btPoint2PointConstraint)[this.ptr] = this;return }
  if (arg3 === undefined) { this.ptr = _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_3(arg0, arg1, arg2); getCache(btPoint2PointConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4(arg0, arg1, arg2, arg3);
  getCache(btPoint2PointConstraint)[this.ptr] = this;
};;
btPoint2PointConstraint.prototype = Object.create(btTypedConstraint.prototype);
btPoint2PointConstraint.prototype.constructor = btPoint2PointConstraint;
btPoint2PointConstraint.prototype.__class__ = btPoint2PointConstraint;
btPoint2PointConstraint.__cache__ = {};
Module['btPoint2PointConstraint'] = btPoint2PointConstraint;

btPoint2PointConstraint.prototype['setPivotA'] = btPoint2PointConstraint.prototype.setPivotA = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_setPivotA_1(self, arg0);
};;

btPoint2PointConstraint.prototype['setPivotB'] = btPoint2PointConstraint.prototype.setPivotB = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_setPivotB_1(self, arg0);
};;

btPoint2PointConstraint.prototype['getPivotInA'] = btPoint2PointConstraint.prototype.getPivotInA = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPoint2PointConstraint_getPivotInA_0(self), btVector3);
};;

btPoint2PointConstraint.prototype['getPivotInB'] = btPoint2PointConstraint.prototype.getPivotInB = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPoint2PointConstraint_getPivotInB_0(self), btVector3);
};;

btPoint2PointConstraint.prototype['enableFeedback'] = btPoint2PointConstraint.prototype.enableFeedback = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_enableFeedback_1(self, arg0);
};;

btPoint2PointConstraint.prototype['getBreakingImpulseThreshold'] = btPoint2PointConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0(self);
};;

btPoint2PointConstraint.prototype['setBreakingImpulseThreshold'] = btPoint2PointConstraint.prototype.setBreakingImpulseThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

  btPoint2PointConstraint.prototype['get_m_setting'] = btPoint2PointConstraint.prototype.get_m_setting = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPoint2PointConstraint_get_m_setting_0(self), btConstraintSetting);
};
    btPoint2PointConstraint.prototype['set_m_setting'] = btPoint2PointConstraint.prototype.set_m_setting = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_set_m_setting_1(self, arg0);
};
  btPoint2PointConstraint.prototype['__destroy__'] = btPoint2PointConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btPoint2PointConstraint___destroy___0(self);
};
// btSoftBodyHelpers
function btSoftBodyHelpers() {
  this.ptr = _emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0();
  getCache(btSoftBodyHelpers)[this.ptr] = this;
};;
btSoftBodyHelpers.prototype = Object.create(WrapperObject.prototype);
btSoftBodyHelpers.prototype.constructor = btSoftBodyHelpers;
btSoftBodyHelpers.prototype.__class__ = btSoftBodyHelpers;
btSoftBodyHelpers.__cache__ = {};
Module['btSoftBodyHelpers'] = btSoftBodyHelpers;

btSoftBodyHelpers.prototype['CreateRope'] = btSoftBodyHelpers.prototype.CreateRope = function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateRope_5(self, arg0, arg1, arg2, arg3, arg4), btSoftBody);
};;

btSoftBodyHelpers.prototype['CreatePatch'] = btSoftBodyHelpers.prototype.CreatePatch = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg5 && typeof arg5 === 'object') arg5 = arg5.ptr;
  if (arg6 && typeof arg6 === 'object') arg6 = arg6.ptr;
  if (arg7 && typeof arg7 === 'object') arg7 = arg7.ptr;
  if (arg8 && typeof arg8 === 'object') arg8 = arg8.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreatePatch_9(self, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8), btSoftBody);
};;

btSoftBodyHelpers.prototype['CreatePatchUV'] = btSoftBodyHelpers.prototype.CreatePatchUV = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg5 && typeof arg5 === 'object') arg5 = arg5.ptr;
  if (arg6 && typeof arg6 === 'object') arg6 = arg6.ptr;
  if (arg7 && typeof arg7 === 'object') arg7 = arg7.ptr;
  if (arg8 && typeof arg8 === 'object') arg8 = arg8.ptr;
  if (typeof arg9 == 'object') { arg9 = ensureFloat32(arg9); }
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10(self, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9), btSoftBody);
};;

btSoftBodyHelpers.prototype['CreateEllipsoid'] = btSoftBodyHelpers.prototype.CreateEllipsoid = function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4(self, arg0, arg1, arg2, arg3), btSoftBody);
};;

btSoftBodyHelpers.prototype['CreateFromTriMesh'] = btSoftBodyHelpers.prototype.CreateFromTriMesh = function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (typeof arg1 == 'object') { arg1 = ensureFloat32(arg1); }
  if (typeof arg2 == 'object') { arg2 = ensureInt32(arg2); }
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5(self, arg0, arg1, arg2, arg3, arg4), btSoftBody);
};;

btSoftBodyHelpers.prototype['CreateFromConvexHull'] = btSoftBodyHelpers.prototype.CreateFromConvexHull = function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4(self, arg0, arg1, arg2, arg3), btSoftBody);
};;

  btSoftBodyHelpers.prototype['__destroy__'] = btSoftBodyHelpers.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyHelpers___destroy___0(self);
};
// VoidPtr
function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

  VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};
// btBoxShape
function btBoxShape(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btBoxShape_btBoxShape_1(arg0);
  getCache(btBoxShape)[this.ptr] = this;
};;
btBoxShape.prototype = Object.create(btCollisionShape.prototype);
btBoxShape.prototype.constructor = btBoxShape;
btBoxShape.prototype.__class__ = btBoxShape;
btBoxShape.__cache__ = {};
Module['btBoxShape'] = btBoxShape;

btBoxShape.prototype['setMargin'] = btBoxShape.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btBoxShape_setMargin_1(self, arg0);
};;

btBoxShape.prototype['getMargin'] = btBoxShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btBoxShape_getMargin_0(self);
};;

btBoxShape.prototype['setLocalScaling'] = btBoxShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btBoxShape_setLocalScaling_1(self, arg0);
};;

btBoxShape.prototype['calculateLocalInertia'] = btBoxShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btBoxShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btBoxShape.prototype['__destroy__'] = btBoxShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btBoxShape___destroy___0(self);
};
// btCapsuleShapeX
function btCapsuleShapeX(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  this.ptr = _emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2(arg0, arg1);
  getCache(btCapsuleShapeX)[this.ptr] = this;
};;
btCapsuleShapeX.prototype = Object.create(btCapsuleShape.prototype);
btCapsuleShapeX.prototype.constructor = btCapsuleShapeX;
btCapsuleShapeX.prototype.__class__ = btCapsuleShapeX;
btCapsuleShapeX.__cache__ = {};
Module['btCapsuleShapeX'] = btCapsuleShapeX;

btCapsuleShapeX.prototype['setMargin'] = btCapsuleShapeX.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShapeX_setMargin_1(self, arg0);
};;

btCapsuleShapeX.prototype['getMargin'] = btCapsuleShapeX.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeX_getMargin_0(self);
};;

btCapsuleShapeX.prototype['setLocalScaling'] = btCapsuleShapeX.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShapeX_setLocalScaling_1(self, arg0);
};;

btCapsuleShapeX.prototype['calculateLocalInertia'] = btCapsuleShapeX.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCapsuleShapeX.prototype['__destroy__'] = btCapsuleShapeX.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCapsuleShapeX___destroy___0(self);
};
// btQuaternion
function btQuaternion(arg0, arg1, arg2, arg3) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  this.ptr = _emscripten_bind_btQuaternion_btQuaternion_4(arg0, arg1, arg2, arg3);
  getCache(btQuaternion)[this.ptr] = this;
};;
btQuaternion.prototype = Object.create(btQuadWord.prototype);
btQuaternion.prototype.constructor = btQuaternion;
btQuaternion.prototype.__class__ = btQuaternion;
btQuaternion.__cache__ = {};
Module['btQuaternion'] = btQuaternion;

btQuaternion.prototype['setValue'] = btQuaternion.prototype.setValue = function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  _emscripten_bind_btQuaternion_setValue_4(self, arg0, arg1, arg2, arg3);
};;

btQuaternion.prototype['setEulerZYX'] = btQuaternion.prototype.setEulerZYX = function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btQuaternion_setEulerZYX_3(self, arg0, arg1, arg2);
};;

btQuaternion.prototype['normalize'] = btQuaternion.prototype.normalize = function() {
  var self = this.ptr;
  _emscripten_bind_btQuaternion_normalize_0(self);
};;

btQuaternion.prototype['x'] = btQuaternion.prototype.x = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_x_0(self);
};;

btQuaternion.prototype['y'] = btQuaternion.prototype.y = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_y_0(self);
};;

btQuaternion.prototype['z'] = btQuaternion.prototype.z = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_z_0(self);
};;

btQuaternion.prototype['w'] = btQuaternion.prototype.w = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_w_0(self);
};;

btQuaternion.prototype['setX'] = btQuaternion.prototype.setX = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuaternion_setX_1(self, arg0);
};;

btQuaternion.prototype['setY'] = btQuaternion.prototype.setY = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuaternion_setY_1(self, arg0);
};;

btQuaternion.prototype['setZ'] = btQuaternion.prototype.setZ = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuaternion_setZ_1(self, arg0);
};;

btQuaternion.prototype['setW'] = btQuaternion.prototype.setW = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuaternion_setW_1(self, arg0);
};;

  btQuaternion.prototype['__destroy__'] = btQuaternion.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btQuaternion___destroy___0(self);
};
// btCapsuleShapeZ
function btCapsuleShapeZ(arg0, arg1) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  this.ptr = _emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2(arg0, arg1);
  getCache(btCapsuleShapeZ)[this.ptr] = this;
};;
btCapsuleShapeZ.prototype = Object.create(btCapsuleShape.prototype);
btCapsuleShapeZ.prototype.constructor = btCapsuleShapeZ;
btCapsuleShapeZ.prototype.__class__ = btCapsuleShapeZ;
btCapsuleShapeZ.__cache__ = {};
Module['btCapsuleShapeZ'] = btCapsuleShapeZ;

btCapsuleShapeZ.prototype['setMargin'] = btCapsuleShapeZ.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShapeZ_setMargin_1(self, arg0);
};;

btCapsuleShapeZ.prototype['getMargin'] = btCapsuleShapeZ.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeZ_getMargin_0(self);
};;

btCapsuleShapeZ.prototype['setLocalScaling'] = btCapsuleShapeZ.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShapeZ_setLocalScaling_1(self, arg0);
};;

btCapsuleShapeZ.prototype['calculateLocalInertia'] = btCapsuleShapeZ.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCapsuleShapeZ.prototype['__destroy__'] = btCapsuleShapeZ.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCapsuleShapeZ___destroy___0(self);
};
// btContactSolverInfo
function btContactSolverInfo() { throw "cannot construct a btContactSolverInfo, no constructor in IDL" }
btContactSolverInfo.prototype = Object.create(WrapperObject.prototype);
btContactSolverInfo.prototype.constructor = btContactSolverInfo;
btContactSolverInfo.prototype.__class__ = btContactSolverInfo;
btContactSolverInfo.__cache__ = {};
Module['btContactSolverInfo'] = btContactSolverInfo;

  btContactSolverInfo.prototype['get_m_splitImpulse'] = btContactSolverInfo.prototype.get_m_splitImpulse = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0(self));
};
    btContactSolverInfo.prototype['set_m_splitImpulse'] = btContactSolverInfo.prototype.set_m_splitImpulse = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1(self, arg0);
};
  btContactSolverInfo.prototype['get_m_splitImpulsePenetrationThreshold'] = btContactSolverInfo.prototype.get_m_splitImpulsePenetrationThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0(self);
};
    btContactSolverInfo.prototype['set_m_splitImpulsePenetrationThreshold'] = btContactSolverInfo.prototype.set_m_splitImpulsePenetrationThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1(self, arg0);
};
  btContactSolverInfo.prototype['__destroy__'] = btContactSolverInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btContactSolverInfo___destroy___0(self);
};
// btGeneric6DofSpringConstraint
function btGeneric6DofSpringConstraint(arg0, arg1, arg2, arg3, arg4) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg3 === undefined) { this.ptr = _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3(arg0, arg1, arg2); getCache(btGeneric6DofSpringConstraint)[this.ptr] = this;return }
  if (arg4 === undefined) { this.ptr = _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_4(arg0, arg1, arg2, arg3); getCache(btGeneric6DofSpringConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5(arg0, arg1, arg2, arg3, arg4);
  getCache(btGeneric6DofSpringConstraint)[this.ptr] = this;
};;
btGeneric6DofSpringConstraint.prototype = Object.create(btGeneric6DofConstraint.prototype);
btGeneric6DofSpringConstraint.prototype.constructor = btGeneric6DofSpringConstraint;
btGeneric6DofSpringConstraint.prototype.__class__ = btGeneric6DofSpringConstraint;
btGeneric6DofSpringConstraint.__cache__ = {};
Module['btGeneric6DofSpringConstraint'] = btGeneric6DofSpringConstraint;

btGeneric6DofSpringConstraint.prototype['enableSpring'] = btGeneric6DofSpringConstraint.prototype.enableSpring = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2(self, arg0, arg1);
};;

btGeneric6DofSpringConstraint.prototype['setStiffness'] = btGeneric6DofSpringConstraint.prototype.setStiffness = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2(self, arg0, arg1);
};;

btGeneric6DofSpringConstraint.prototype['setDamping'] = btGeneric6DofSpringConstraint.prototype.setDamping = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2(self, arg0, arg1);
};;

btGeneric6DofSpringConstraint.prototype['setLinearLowerLimit'] = btGeneric6DofSpringConstraint.prototype.setLinearLowerLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['setLinearUpperLimit'] = btGeneric6DofSpringConstraint.prototype.setLinearUpperLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['setAngularLowerLimit'] = btGeneric6DofSpringConstraint.prototype.setAngularLowerLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['setAngularUpperLimit'] = btGeneric6DofSpringConstraint.prototype.setAngularUpperLimit = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['getRotationalLimitMotor'] = btGeneric6DofSpringConstraint.prototype.getRotationalLimitMotor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btGeneric6DofSpringConstraint_getRotationalLimitMotor_1(self, arg0), btRotationalLimitMotor);
};;

btGeneric6DofSpringConstraint.prototype['enableFeedback'] = btGeneric6DofSpringConstraint.prototype.enableFeedback = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['getBreakingImpulseThreshold'] = btGeneric6DofSpringConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0(self);
};;

btGeneric6DofSpringConstraint.prototype['setBreakingImpulseThreshold'] = btGeneric6DofSpringConstraint.prototype.setBreakingImpulseThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

  btGeneric6DofSpringConstraint.prototype['__destroy__'] = btGeneric6DofSpringConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint___destroy___0(self);
};
// btSphereShape
function btSphereShape(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btSphereShape_btSphereShape_1(arg0);
  getCache(btSphereShape)[this.ptr] = this;
};;
btSphereShape.prototype = Object.create(btCollisionShape.prototype);
btSphereShape.prototype.constructor = btSphereShape;
btSphereShape.prototype.__class__ = btSphereShape;
btSphereShape.__cache__ = {};
Module['btSphereShape'] = btSphereShape;

btSphereShape.prototype['setMargin'] = btSphereShape.prototype.setMargin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSphereShape_setMargin_1(self, arg0);
};;

btSphereShape.prototype['getMargin'] = btSphereShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btSphereShape_getMargin_0(self);
};;

btSphereShape.prototype['setLocalScaling'] = btSphereShape.prototype.setLocalScaling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSphereShape_setLocalScaling_1(self, arg0);
};;

btSphereShape.prototype['calculateLocalInertia'] = btSphereShape.prototype.calculateLocalInertia = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSphereShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btSphereShape.prototype['__destroy__'] = btSphereShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSphereShape___destroy___0(self);
};
// LocalConvexResult
function LocalConvexResult(arg0, arg1, arg2, arg3, arg4) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  this.ptr = _emscripten_bind_LocalConvexResult_LocalConvexResult_5(arg0, arg1, arg2, arg3, arg4);
  getCache(LocalConvexResult)[this.ptr] = this;
};;
LocalConvexResult.prototype = Object.create(WrapperObject.prototype);
LocalConvexResult.prototype.constructor = LocalConvexResult;
LocalConvexResult.prototype.__class__ = LocalConvexResult;
LocalConvexResult.__cache__ = {};
Module['LocalConvexResult'] = LocalConvexResult;

  LocalConvexResult.prototype['get_m_hitCollisionObject'] = LocalConvexResult.prototype.get_m_hitCollisionObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0(self), btCollisionObject);
};
    LocalConvexResult.prototype['set_m_hitCollisionObject'] = LocalConvexResult.prototype.set_m_hitCollisionObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1(self, arg0);
};
  LocalConvexResult.prototype['get_m_localShapeInfo'] = LocalConvexResult.prototype.get_m_localShapeInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0(self), LocalShapeInfo);
};
    LocalConvexResult.prototype['set_m_localShapeInfo'] = LocalConvexResult.prototype.set_m_localShapeInfo = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1(self, arg0);
};
  LocalConvexResult.prototype['get_m_hitNormalLocal'] = LocalConvexResult.prototype.get_m_hitNormalLocal = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0(self), btVector3);
};
    LocalConvexResult.prototype['set_m_hitNormalLocal'] = LocalConvexResult.prototype.set_m_hitNormalLocal = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1(self, arg0);
};
  LocalConvexResult.prototype['get_m_hitPointLocal'] = LocalConvexResult.prototype.get_m_hitPointLocal = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0(self), btVector3);
};
    LocalConvexResult.prototype['set_m_hitPointLocal'] = LocalConvexResult.prototype.set_m_hitPointLocal = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1(self, arg0);
};
  LocalConvexResult.prototype['get_m_hitFraction'] = LocalConvexResult.prototype.get_m_hitFraction = function() {
  var self = this.ptr;
  return _emscripten_bind_LocalConvexResult_get_m_hitFraction_0(self);
};
    LocalConvexResult.prototype['set_m_hitFraction'] = LocalConvexResult.prototype.set_m_hitFraction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitFraction_1(self, arg0);
};
  LocalConvexResult.prototype['__destroy__'] = LocalConvexResult.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_LocalConvexResult___destroy___0(self);
};
(function() {
  function setupEnums() {
    

    // PHY_ScalarType

    Module['PHY_FLOAT'] = _emscripten_enum_PHY_ScalarType_PHY_FLOAT();

    Module['PHY_DOUBLE'] = _emscripten_enum_PHY_ScalarType_PHY_DOUBLE();

    Module['PHY_INTEGER'] = _emscripten_enum_PHY_ScalarType_PHY_INTEGER();

    Module['PHY_SHORT'] = _emscripten_enum_PHY_ScalarType_PHY_SHORT();

    Module['PHY_FIXEDPOINT88'] = _emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88();

    Module['PHY_UCHAR'] = _emscripten_enum_PHY_ScalarType_PHY_UCHAR();

  }
  if (Module['calledRun']) setupEnums();
  else addOnPreMain(setupEnums);
})();
