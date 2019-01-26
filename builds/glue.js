
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
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc: function(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = (len + 7) & -8; // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy: function(array, view, offset) {
    var offsetShifted = offset;
    var bytes = view.BYTES_PER_ELEMENT;
    switch (bytes) {
      case 2: offsetShifted >>= 1; break;
      case 4: offsetShifted >>= 2; break;
      case 8: offsetShifted >>= 3; break;
    }
    for (var i = 0; i < array.length; i++) {
      view[offsetShifted + i] = array[i];
    }
  },
};

function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}


// btCollisionWorld
function btCollisionWorld() { throw "cannot construct a btCollisionWorld, no constructor in IDL" }
btCollisionWorld.prototype = Object.create(WrapperObject.prototype);
btCollisionWorld.prototype.constructor = btCollisionWorld;
btCollisionWorld.prototype.__class__ = btCollisionWorld;
btCollisionWorld.__cache__ = {};
Module['btCollisionWorld'] = btCollisionWorld;

btCollisionWorld.prototype['getDispatcher'] = btCollisionWorld.prototype.getDispatcher = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getDispatcher_0(self), btDispatcher);
};;

btCollisionWorld.prototype['rayTest'] = btCollisionWorld.prototype.rayTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btCollisionWorld_rayTest_3(self, arg0, arg1, arg2);
};;

btCollisionWorld.prototype['getPairCache'] = btCollisionWorld.prototype.getPairCache = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getPairCache_0(self), btOverlappingPairCache);
};;

btCollisionWorld.prototype['getDispatchInfo'] = btCollisionWorld.prototype.getDispatchInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getDispatchInfo_0(self), btDispatcherInfo);
};;

btCollisionWorld.prototype['addCollisionObject'] = btCollisionWorld.prototype.addCollisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btCollisionWorld_addCollisionObject_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btCollisionWorld_addCollisionObject_2(self, arg0, arg1);  return }
  _emscripten_bind_btCollisionWorld_addCollisionObject_3(self, arg0, arg1, arg2);
};;

btCollisionWorld.prototype['removeCollisionObject'] = btCollisionWorld.prototype.removeCollisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionWorld_removeCollisionObject_1(self, arg0);
};;

btCollisionWorld.prototype['getBroadphase'] = btCollisionWorld.prototype.getBroadphase = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getBroadphase_0(self), btBroadphaseInterface);
};;

btCollisionWorld.prototype['convexSweepTest'] = btCollisionWorld.prototype.convexSweepTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btCollisionWorld_convexSweepTest_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btCollisionWorld.prototype['contactPairTest'] = btCollisionWorld.prototype.contactPairTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btCollisionWorld_contactPairTest_3(self, arg0, arg1, arg2);
};;

btCollisionWorld.prototype['contactTest'] = btCollisionWorld.prototype.contactTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCollisionWorld_contactTest_2(self, arg0, arg1);
};;

btCollisionWorld.prototype['updateSingleAabb'] = btCollisionWorld.prototype.updateSingleAabb = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionWorld_updateSingleAabb_1(self, arg0);
};;

btCollisionWorld.prototype['setDebugDrawer'] = btCollisionWorld.prototype.setDebugDrawer = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionWorld_setDebugDrawer_1(self, arg0);
};;

btCollisionWorld.prototype['getDebugDrawer'] = btCollisionWorld.prototype.getDebugDrawer = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getDebugDrawer_0(self), btIDebugDraw);
};;

btCollisionWorld.prototype['debugDrawWorld'] = btCollisionWorld.prototype.debugDrawWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionWorld_debugDrawWorld_0(self);
};;

btCollisionWorld.prototype['debugDrawObject'] = btCollisionWorld.prototype.debugDrawObject = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btCollisionWorld_debugDrawObject_3(self, arg0, arg1, arg2);
};;

  btCollisionWorld.prototype['__destroy__'] = btCollisionWorld.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btCollisionShape.prototype['setLocalScaling'] = btCollisionShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionShape_setLocalScaling_1(self, arg0);
};;

btCollisionShape.prototype['getLocalScaling'] = btCollisionShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionShape_getLocalScaling_0(self), btVector3);
};;

btCollisionShape.prototype['calculateLocalInertia'] = btCollisionShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCollisionShape_calculateLocalInertia_2(self, arg0, arg1);
};;

btCollisionShape.prototype['setMargin'] = btCollisionShape.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionShape_setMargin_1(self, arg0);
};;

btCollisionShape.prototype['getMargin'] = btCollisionShape.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionShape_getMargin_0(self);
};;

  btCollisionShape.prototype['__destroy__'] = btCollisionShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btCollisionObject.prototype['setAnisotropicFriction'] = btCollisionObject.prototype.setAnisotropicFriction = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCollisionObject_setAnisotropicFriction_2(self, arg0, arg1);
};;

btCollisionObject.prototype['getCollisionShape'] = btCollisionObject.prototype.getCollisionShape = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObject_getCollisionShape_0(self), btCollisionShape);
};;

btCollisionObject.prototype['setContactProcessingThreshold'] = btCollisionObject.prototype.setContactProcessingThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setContactProcessingThreshold_1(self, arg0);
};;

btCollisionObject.prototype['setActivationState'] = btCollisionObject.prototype.setActivationState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setActivationState_1(self, arg0);
};;

btCollisionObject.prototype['forceActivationState'] = btCollisionObject.prototype.forceActivationState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_forceActivationState_1(self, arg0);
};;

btCollisionObject.prototype['activate'] = btCollisionObject.prototype.activate = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { _emscripten_bind_btCollisionObject_activate_0(self);  return }
  _emscripten_bind_btCollisionObject_activate_1(self, arg0);
};;

btCollisionObject.prototype['isActive'] = btCollisionObject.prototype.isActive = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btCollisionObject_isActive_0(self));
};;

btCollisionObject.prototype['isKinematicObject'] = btCollisionObject.prototype.isKinematicObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btCollisionObject_isKinematicObject_0(self));
};;

btCollisionObject.prototype['isStaticObject'] = btCollisionObject.prototype.isStaticObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btCollisionObject_isStaticObject_0(self));
};;

btCollisionObject.prototype['isStaticOrKinematicObject'] = btCollisionObject.prototype.isStaticOrKinematicObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0(self));
};;

btCollisionObject.prototype['setRestitution'] = btCollisionObject.prototype.setRestitution = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setRestitution_1(self, arg0);
};;

btCollisionObject.prototype['setFriction'] = btCollisionObject.prototype.setFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setFriction_1(self, arg0);
};;

btCollisionObject.prototype['setRollingFriction'] = btCollisionObject.prototype.setRollingFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setRollingFriction_1(self, arg0);
};;

btCollisionObject.prototype['getWorldTransform'] = btCollisionObject.prototype.getWorldTransform = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObject_getWorldTransform_0(self), btTransform);
};;

btCollisionObject.prototype['getCollisionFlags'] = btCollisionObject.prototype.getCollisionFlags = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionObject_getCollisionFlags_0(self);
};;

btCollisionObject.prototype['setCollisionFlags'] = btCollisionObject.prototype.setCollisionFlags = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setCollisionFlags_1(self, arg0);
};;

btCollisionObject.prototype['setWorldTransform'] = btCollisionObject.prototype.setWorldTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setWorldTransform_1(self, arg0);
};;

btCollisionObject.prototype['setCollisionShape'] = btCollisionObject.prototype.setCollisionShape = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setCollisionShape_1(self, arg0);
};;

btCollisionObject.prototype['setCcdMotionThreshold'] = btCollisionObject.prototype.setCcdMotionThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setCcdMotionThreshold_1(self, arg0);
};;

btCollisionObject.prototype['setCcdSweptSphereRadius'] = btCollisionObject.prototype.setCcdSweptSphereRadius = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1(self, arg0);
};;

btCollisionObject.prototype['getUserIndex'] = btCollisionObject.prototype.getUserIndex = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionObject_getUserIndex_0(self);
};;

btCollisionObject.prototype['setUserIndex'] = btCollisionObject.prototype.setUserIndex = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setUserIndex_1(self, arg0);
};;

btCollisionObject.prototype['getUserPointer'] = btCollisionObject.prototype.getUserPointer = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObject_getUserPointer_0(self), VoidPtr);
};;

btCollisionObject.prototype['setUserPointer'] = btCollisionObject.prototype.setUserPointer = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionObject_setUserPointer_1(self, arg0);
};;

  btCollisionObject.prototype['__destroy__'] = btCollisionObject.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btDynamicsWorld.prototype['addAction'] = btDynamicsWorld.prototype.addAction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDynamicsWorld_addAction_1(self, arg0);
};;

btDynamicsWorld.prototype['removeAction'] = btDynamicsWorld.prototype.removeAction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDynamicsWorld_removeAction_1(self, arg0);
};;

btDynamicsWorld.prototype['getSolverInfo'] = btDynamicsWorld.prototype.getSolverInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getSolverInfo_0(self), btContactSolverInfo);
};;

btDynamicsWorld.prototype['getDispatcher'] = btDynamicsWorld.prototype.getDispatcher = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getDispatcher_0(self), btDispatcher);
};;

btDynamicsWorld.prototype['rayTest'] = btDynamicsWorld.prototype.rayTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDynamicsWorld_rayTest_3(self, arg0, arg1, arg2);
};;

btDynamicsWorld.prototype['getPairCache'] = btDynamicsWorld.prototype.getPairCache = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getPairCache_0(self), btOverlappingPairCache);
};;

btDynamicsWorld.prototype['getDispatchInfo'] = btDynamicsWorld.prototype.getDispatchInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getDispatchInfo_0(self), btDispatcherInfo);
};;

btDynamicsWorld.prototype['addCollisionObject'] = btDynamicsWorld.prototype.addCollisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btDynamicsWorld_addCollisionObject_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btDynamicsWorld_addCollisionObject_2(self, arg0, arg1);  return }
  _emscripten_bind_btDynamicsWorld_addCollisionObject_3(self, arg0, arg1, arg2);
};;

btDynamicsWorld.prototype['removeCollisionObject'] = btDynamicsWorld.prototype.removeCollisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDynamicsWorld_removeCollisionObject_1(self, arg0);
};;

btDynamicsWorld.prototype['getBroadphase'] = btDynamicsWorld.prototype.getBroadphase = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getBroadphase_0(self), btBroadphaseInterface);
};;

btDynamicsWorld.prototype['convexSweepTest'] = btDynamicsWorld.prototype.convexSweepTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btDynamicsWorld_convexSweepTest_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btDynamicsWorld.prototype['contactPairTest'] = btDynamicsWorld.prototype.contactPairTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDynamicsWorld_contactPairTest_3(self, arg0, arg1, arg2);
};;

btDynamicsWorld.prototype['contactTest'] = btDynamicsWorld.prototype.contactTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btDynamicsWorld_contactTest_2(self, arg0, arg1);
};;

btDynamicsWorld.prototype['updateSingleAabb'] = btDynamicsWorld.prototype.updateSingleAabb = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDynamicsWorld_updateSingleAabb_1(self, arg0);
};;

btDynamicsWorld.prototype['setDebugDrawer'] = btDynamicsWorld.prototype.setDebugDrawer = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDynamicsWorld_setDebugDrawer_1(self, arg0);
};;

btDynamicsWorld.prototype['getDebugDrawer'] = btDynamicsWorld.prototype.getDebugDrawer = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getDebugDrawer_0(self), btIDebugDraw);
};;

btDynamicsWorld.prototype['debugDrawWorld'] = btDynamicsWorld.prototype.debugDrawWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btDynamicsWorld_debugDrawWorld_0(self);
};;

btDynamicsWorld.prototype['debugDrawObject'] = btDynamicsWorld.prototype.debugDrawObject = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDynamicsWorld_debugDrawObject_3(self, arg0, arg1, arg2);
};;

  btDynamicsWorld.prototype['__destroy__'] = btDynamicsWorld.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btTypedConstraint.prototype['enableFeedback'] = btTypedConstraint.prototype.enableFeedback = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btTypedConstraint_enableFeedback_1(self, arg0);
};;

btTypedConstraint.prototype['getBreakingImpulseThreshold'] = btTypedConstraint.prototype.getBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0(self);
};;

btTypedConstraint.prototype['setBreakingImpulseThreshold'] = btTypedConstraint.prototype.setBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

btTypedConstraint.prototype['getParam'] = btTypedConstraint.prototype.getParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return _emscripten_bind_btTypedConstraint_getParam_2(self, arg0, arg1);
};;

btTypedConstraint.prototype['setParam'] = btTypedConstraint.prototype.setParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btTypedConstraint_setParam_3(self, arg0, arg1, arg2);
};;

  btTypedConstraint.prototype['__destroy__'] = btTypedConstraint.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btConcaveShape.prototype['setLocalScaling'] = btConcaveShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConcaveShape_setLocalScaling_1(self, arg0);
};;

btConcaveShape.prototype['getLocalScaling'] = btConcaveShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConcaveShape_getLocalScaling_0(self), btVector3);
};;

btConcaveShape.prototype['calculateLocalInertia'] = btConcaveShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConcaveShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btConcaveShape.prototype['__destroy__'] = btConcaveShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btConcaveShape___destroy___0(self);
};
// btCapsuleShape
/** @suppress {undefinedVars, duplicate} */function btCapsuleShape(arg0, arg1) {
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

btCapsuleShape.prototype['setMargin'] = btCapsuleShape.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShape_setMargin_1(self, arg0);
};;

btCapsuleShape.prototype['getMargin'] = btCapsuleShape.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShape_getMargin_0(self);
};;

btCapsuleShape.prototype['getUpAxis'] = btCapsuleShape.prototype.getUpAxis = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShape_getUpAxis_0(self);
};;

btCapsuleShape.prototype['getRadius'] = btCapsuleShape.prototype.getRadius = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShape_getRadius_0(self);
};;

btCapsuleShape.prototype['getHalfHeight'] = btCapsuleShape.prototype.getHalfHeight = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShape_getHalfHeight_0(self);
};;

btCapsuleShape.prototype['setLocalScaling'] = btCapsuleShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShape_setLocalScaling_1(self, arg0);
};;

btCapsuleShape.prototype['getLocalScaling'] = btCapsuleShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCapsuleShape_getLocalScaling_0(self), btVector3);
};;

btCapsuleShape.prototype['calculateLocalInertia'] = btCapsuleShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCapsuleShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCapsuleShape.prototype['__destroy__'] = btCapsuleShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btCapsuleShape___destroy___0(self);
};
// btIDebugDraw
function btIDebugDraw() { throw "cannot construct a btIDebugDraw, no constructor in IDL" }
btIDebugDraw.prototype = Object.create(WrapperObject.prototype);
btIDebugDraw.prototype.constructor = btIDebugDraw;
btIDebugDraw.prototype.__class__ = btIDebugDraw;
btIDebugDraw.__cache__ = {};
Module['btIDebugDraw'] = btIDebugDraw;

btIDebugDraw.prototype['drawLine'] = btIDebugDraw.prototype.drawLine = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btIDebugDraw_drawLine_3(self, arg0, arg1, arg2);
};;

btIDebugDraw.prototype['drawContactPoint'] = btIDebugDraw.prototype.drawContactPoint = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btIDebugDraw_drawContactPoint_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btIDebugDraw.prototype['reportErrorWarning'] = btIDebugDraw.prototype.reportErrorWarning = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  else arg0 = ensureString(arg0);
  _emscripten_bind_btIDebugDraw_reportErrorWarning_1(self, arg0);
};;

btIDebugDraw.prototype['draw3dText'] = btIDebugDraw.prototype.draw3dText = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  else arg1 = ensureString(arg1);
  _emscripten_bind_btIDebugDraw_draw3dText_2(self, arg0, arg1);
};;

btIDebugDraw.prototype['setDebugMode'] = btIDebugDraw.prototype.setDebugMode = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btIDebugDraw_setDebugMode_1(self, arg0);
};;

btIDebugDraw.prototype['getDebugMode'] = btIDebugDraw.prototype.getDebugMode = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btIDebugDraw_getDebugMode_0(self);
};;

  btIDebugDraw.prototype['__destroy__'] = btIDebugDraw.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btIDebugDraw___destroy___0(self);
};
// btDefaultCollisionConfiguration
/** @suppress {undefinedVars, duplicate} */function btDefaultCollisionConfiguration(arg0) {
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

  btDefaultCollisionConfiguration.prototype['__destroy__'] = btDefaultCollisionConfiguration.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

ConvexResultCallback.prototype['hasHit'] = ConvexResultCallback.prototype.hasHit = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ConvexResultCallback_hasHit_0(self));
};;

  ConvexResultCallback.prototype['get_m_collisionFilterGroup'] = ConvexResultCallback.prototype.get_m_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0(self);
};
    ConvexResultCallback.prototype['set_m_collisionFilterGroup'] = ConvexResultCallback.prototype.set_m_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};
  ConvexResultCallback.prototype['get_m_collisionFilterMask'] = ConvexResultCallback.prototype.get_m_collisionFilterMask = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0(self);
};
    ConvexResultCallback.prototype['set_m_collisionFilterMask'] = ConvexResultCallback.prototype.set_m_collisionFilterMask = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1(self, arg0);
};
  ConvexResultCallback.prototype['get_m_closestHitFraction'] = ConvexResultCallback.prototype.get_m_closestHitFraction = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0(self);
};
    ConvexResultCallback.prototype['set_m_closestHitFraction'] = ConvexResultCallback.prototype.set_m_closestHitFraction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1(self, arg0);
};
  ConvexResultCallback.prototype['__destroy__'] = ConvexResultCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btTriangleMeshShape.prototype['setLocalScaling'] = btTriangleMeshShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btTriangleMeshShape_setLocalScaling_1(self, arg0);
};;

btTriangleMeshShape.prototype['getLocalScaling'] = btTriangleMeshShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTriangleMeshShape_getLocalScaling_0(self), btVector3);
};;

btTriangleMeshShape.prototype['calculateLocalInertia'] = btTriangleMeshShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btTriangleMeshShape.prototype['__destroy__'] = btTriangleMeshShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btTriangleMeshShape___destroy___0(self);
};
// btGhostObject
/** @suppress {undefinedVars, duplicate} */function btGhostObject() {
  this.ptr = _emscripten_bind_btGhostObject_btGhostObject_0();
  getCache(btGhostObject)[this.ptr] = this;
};;
btGhostObject.prototype = Object.create(btCollisionObject.prototype);
btGhostObject.prototype.constructor = btGhostObject;
btGhostObject.prototype.__class__ = btGhostObject;
btGhostObject.__cache__ = {};
Module['btGhostObject'] = btGhostObject;

btGhostObject.prototype['getNumOverlappingObjects'] = btGhostObject.prototype.getNumOverlappingObjects = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getNumOverlappingObjects_0(self);
};;

btGhostObject.prototype['getOverlappingObject'] = btGhostObject.prototype.getOverlappingObject = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getOverlappingObject_1(self, arg0), btCollisionObject);
};;

btGhostObject.prototype['setAnisotropicFriction'] = btGhostObject.prototype.setAnisotropicFriction = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btGhostObject_setAnisotropicFriction_2(self, arg0, arg1);
};;

btGhostObject.prototype['getCollisionShape'] = btGhostObject.prototype.getCollisionShape = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getCollisionShape_0(self), btCollisionShape);
};;

btGhostObject.prototype['setContactProcessingThreshold'] = btGhostObject.prototype.setContactProcessingThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setContactProcessingThreshold_1(self, arg0);
};;

btGhostObject.prototype['setActivationState'] = btGhostObject.prototype.setActivationState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setActivationState_1(self, arg0);
};;

btGhostObject.prototype['forceActivationState'] = btGhostObject.prototype.forceActivationState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_forceActivationState_1(self, arg0);
};;

btGhostObject.prototype['activate'] = btGhostObject.prototype.activate = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { _emscripten_bind_btGhostObject_activate_0(self);  return }
  _emscripten_bind_btGhostObject_activate_1(self, arg0);
};;

btGhostObject.prototype['isActive'] = btGhostObject.prototype.isActive = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGhostObject_isActive_0(self));
};;

btGhostObject.prototype['isKinematicObject'] = btGhostObject.prototype.isKinematicObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGhostObject_isKinematicObject_0(self));
};;

btGhostObject.prototype['isStaticObject'] = btGhostObject.prototype.isStaticObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGhostObject_isStaticObject_0(self));
};;

btGhostObject.prototype['isStaticOrKinematicObject'] = btGhostObject.prototype.isStaticOrKinematicObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGhostObject_isStaticOrKinematicObject_0(self));
};;

btGhostObject.prototype['setRestitution'] = btGhostObject.prototype.setRestitution = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setRestitution_1(self, arg0);
};;

btGhostObject.prototype['setFriction'] = btGhostObject.prototype.setFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setFriction_1(self, arg0);
};;

btGhostObject.prototype['setRollingFriction'] = btGhostObject.prototype.setRollingFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setRollingFriction_1(self, arg0);
};;

btGhostObject.prototype['getWorldTransform'] = btGhostObject.prototype.getWorldTransform = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getWorldTransform_0(self), btTransform);
};;

btGhostObject.prototype['getCollisionFlags'] = btGhostObject.prototype.getCollisionFlags = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getCollisionFlags_0(self);
};;

btGhostObject.prototype['setCollisionFlags'] = btGhostObject.prototype.setCollisionFlags = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setCollisionFlags_1(self, arg0);
};;

btGhostObject.prototype['setWorldTransform'] = btGhostObject.prototype.setWorldTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setWorldTransform_1(self, arg0);
};;

btGhostObject.prototype['setCollisionShape'] = btGhostObject.prototype.setCollisionShape = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setCollisionShape_1(self, arg0);
};;

btGhostObject.prototype['setCcdMotionThreshold'] = btGhostObject.prototype.setCcdMotionThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setCcdMotionThreshold_1(self, arg0);
};;

btGhostObject.prototype['setCcdSweptSphereRadius'] = btGhostObject.prototype.setCcdSweptSphereRadius = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1(self, arg0);
};;

btGhostObject.prototype['getUserIndex'] = btGhostObject.prototype.getUserIndex = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getUserIndex_0(self);
};;

btGhostObject.prototype['setUserIndex'] = btGhostObject.prototype.setUserIndex = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setUserIndex_1(self, arg0);
};;

btGhostObject.prototype['getUserPointer'] = btGhostObject.prototype.getUserPointer = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getUserPointer_0(self), VoidPtr);
};;

btGhostObject.prototype['setUserPointer'] = btGhostObject.prototype.setUserPointer = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGhostObject_setUserPointer_1(self, arg0);
};;

  btGhostObject.prototype['__destroy__'] = btGhostObject.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btGhostObject___destroy___0(self);
};
// btConeShape
/** @suppress {undefinedVars, duplicate} */function btConeShape(arg0, arg1) {
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

btConeShape.prototype['setLocalScaling'] = btConeShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeShape_setLocalScaling_1(self, arg0);
};;

btConeShape.prototype['getLocalScaling'] = btConeShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConeShape_getLocalScaling_0(self), btVector3);
};;

btConeShape.prototype['calculateLocalInertia'] = btConeShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConeShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btConeShape.prototype['__destroy__'] = btConeShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btActionInterface.prototype['updateAction'] = btActionInterface.prototype.updateAction = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btActionInterface_updateAction_2(self, arg0, arg1);
};;

  btActionInterface.prototype['__destroy__'] = btActionInterface.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btActionInterface___destroy___0(self);
};
// btVector3
/** @suppress {undefinedVars, duplicate} */function btVector3(arg0, arg1, arg2) {
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

btVector3.prototype['length'] = btVector3.prototype.length = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_length_0(self);
};;

btVector3.prototype['x'] = btVector3.prototype.x = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_x_0(self);
};;

btVector3.prototype['y'] = btVector3.prototype.y = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_y_0(self);
};;

btVector3.prototype['z'] = btVector3.prototype.z = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_z_0(self);
};;

btVector3.prototype['setX'] = btVector3.prototype.setX = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector3_setX_1(self, arg0);
};;

btVector3.prototype['setY'] = btVector3.prototype.setY = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector3_setY_1(self, arg0);
};;

btVector3.prototype['setZ'] = btVector3.prototype.setZ = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector3_setZ_1(self, arg0);
};;

btVector3.prototype['setValue'] = btVector3.prototype.setValue = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btVector3_setValue_3(self, arg0, arg1, arg2);
};;

btVector3.prototype['normalize'] = btVector3.prototype.normalize = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btVector3_normalize_0(self);
};;

btVector3.prototype['rotate'] = btVector3.prototype.rotate = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return wrapPointer(_emscripten_bind_btVector3_rotate_2(self, arg0, arg1), btVector3);
};;

btVector3.prototype['dot'] = btVector3.prototype.dot = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btVector3_dot_1(self, arg0);
};;

btVector3.prototype['op_mul'] = btVector3.prototype.op_mul = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector3_op_mul_1(self, arg0), btVector3);
};;

btVector3.prototype['op_add'] = btVector3.prototype.op_add = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector3_op_add_1(self, arg0), btVector3);
};;

btVector3.prototype['op_sub'] = btVector3.prototype.op_sub = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector3_op_sub_1(self, arg0), btVector3);
};;

  btVector3.prototype['__destroy__'] = btVector3.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btVehicleRaycaster.prototype['castRay'] = btVehicleRaycaster.prototype.castRay = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btVehicleRaycaster_castRay_3(self, arg0, arg1, arg2);
};;

  btVehicleRaycaster.prototype['__destroy__'] = btVehicleRaycaster.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btQuadWord.prototype['x'] = btQuadWord.prototype.x = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_x_0(self);
};;

btQuadWord.prototype['y'] = btQuadWord.prototype.y = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_y_0(self);
};;

btQuadWord.prototype['z'] = btQuadWord.prototype.z = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_z_0(self);
};;

btQuadWord.prototype['w'] = btQuadWord.prototype.w = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_w_0(self);
};;

btQuadWord.prototype['setX'] = btQuadWord.prototype.setX = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuadWord_setX_1(self, arg0);
};;

btQuadWord.prototype['setY'] = btQuadWord.prototype.setY = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuadWord_setY_1(self, arg0);
};;

btQuadWord.prototype['setZ'] = btQuadWord.prototype.setZ = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuadWord_setZ_1(self, arg0);
};;

btQuadWord.prototype['setW'] = btQuadWord.prototype.setW = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuadWord_setW_1(self, arg0);
};;

  btQuadWord.prototype['__destroy__'] = btQuadWord.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btQuadWord___destroy___0(self);
};
// btCylinderShape
/** @suppress {undefinedVars, duplicate} */function btCylinderShape(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btCylinderShape_btCylinderShape_1(arg0);
  getCache(btCylinderShape)[this.ptr] = this;
};;
btCylinderShape.prototype = Object.create(btCollisionShape.prototype);
btCylinderShape.prototype.constructor = btCylinderShape;
btCylinderShape.prototype.__class__ = btCylinderShape;
btCylinderShape.__cache__ = {};
Module['btCylinderShape'] = btCylinderShape;

btCylinderShape.prototype['setMargin'] = btCylinderShape.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShape_setMargin_1(self, arg0);
};;

btCylinderShape.prototype['getMargin'] = btCylinderShape.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCylinderShape_getMargin_0(self);
};;

btCylinderShape.prototype['setLocalScaling'] = btCylinderShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShape_setLocalScaling_1(self, arg0);
};;

btCylinderShape.prototype['getLocalScaling'] = btCylinderShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCylinderShape_getLocalScaling_0(self), btVector3);
};;

btCylinderShape.prototype['calculateLocalInertia'] = btCylinderShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCylinderShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCylinderShape.prototype['__destroy__'] = btCylinderShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btCylinderShape___destroy___0(self);
};
// btDiscreteDynamicsWorld
/** @suppress {undefinedVars, duplicate} */function btDiscreteDynamicsWorld(arg0, arg1, arg2, arg3) {
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

btDiscreteDynamicsWorld.prototype['setGravity'] = btDiscreteDynamicsWorld.prototype.setGravity = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_setGravity_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['getGravity'] = btDiscreteDynamicsWorld.prototype.getGravity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getGravity_0(self), btVector3);
};;

btDiscreteDynamicsWorld.prototype['addRigidBody'] = btDiscreteDynamicsWorld.prototype.addRigidBody = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_2(self, arg0, arg1);  return }
  _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['removeRigidBody'] = btDiscreteDynamicsWorld.prototype.removeRigidBody = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['addVehicle'] = btDiscreteDynamicsWorld.prototype.addVehicle = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_addVehicle_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['removeVehicle'] = btDiscreteDynamicsWorld.prototype.removeVehicle = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeVehicle_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['addConstraint'] = btDiscreteDynamicsWorld.prototype.addConstraint = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1(self, arg0);  return }
  _emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2(self, arg0, arg1);
};;

btDiscreteDynamicsWorld.prototype['removeConstraint'] = btDiscreteDynamicsWorld.prototype.removeConstraint = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['stepSimulation'] = btDiscreteDynamicsWorld.prototype.stepSimulation = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { return _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1(self, arg0) }
  if (arg2 === undefined) { return _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2(self, arg0, arg1) }
  return _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['getDispatcher'] = btDiscreteDynamicsWorld.prototype.getDispatcher = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0(self), btDispatcher);
};;

btDiscreteDynamicsWorld.prototype['rayTest'] = btDiscreteDynamicsWorld.prototype.rayTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_rayTest_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['getPairCache'] = btDiscreteDynamicsWorld.prototype.getPairCache = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0(self), btOverlappingPairCache);
};;

btDiscreteDynamicsWorld.prototype['getDispatchInfo'] = btDiscreteDynamicsWorld.prototype.getDispatchInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0(self), btDispatcherInfo);
};;

btDiscreteDynamicsWorld.prototype['addCollisionObject'] = btDiscreteDynamicsWorld.prototype.addCollisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2(self, arg0, arg1);  return }
  _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['removeCollisionObject'] = btDiscreteDynamicsWorld.prototype.removeCollisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['getBroadphase'] = btDiscreteDynamicsWorld.prototype.getBroadphase = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0(self), btBroadphaseInterface);
};;

btDiscreteDynamicsWorld.prototype['convexSweepTest'] = btDiscreteDynamicsWorld.prototype.convexSweepTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btDiscreteDynamicsWorld.prototype['contactPairTest'] = btDiscreteDynamicsWorld.prototype.contactPairTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['contactTest'] = btDiscreteDynamicsWorld.prototype.contactTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_contactTest_2(self, arg0, arg1);
};;

btDiscreteDynamicsWorld.prototype['updateSingleAabb'] = btDiscreteDynamicsWorld.prototype.updateSingleAabb = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['setDebugDrawer'] = btDiscreteDynamicsWorld.prototype.setDebugDrawer = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['getDebugDrawer'] = btDiscreteDynamicsWorld.prototype.getDebugDrawer = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0(self), btIDebugDraw);
};;

btDiscreteDynamicsWorld.prototype['debugDrawWorld'] = btDiscreteDynamicsWorld.prototype.debugDrawWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0(self);
};;

btDiscreteDynamicsWorld.prototype['debugDrawObject'] = btDiscreteDynamicsWorld.prototype.debugDrawObject = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3(self, arg0, arg1, arg2);
};;

btDiscreteDynamicsWorld.prototype['addAction'] = btDiscreteDynamicsWorld.prototype.addAction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_addAction_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['removeAction'] = btDiscreteDynamicsWorld.prototype.removeAction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeAction_1(self, arg0);
};;

btDiscreteDynamicsWorld.prototype['getSolverInfo'] = btDiscreteDynamicsWorld.prototype.getSolverInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0(self), btContactSolverInfo);
};;

  btDiscreteDynamicsWorld.prototype['__destroy__'] = btDiscreteDynamicsWorld.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btConvexShape.prototype['setLocalScaling'] = btConvexShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexShape_setLocalScaling_1(self, arg0);
};;

btConvexShape.prototype['getLocalScaling'] = btConvexShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexShape_getLocalScaling_0(self), btVector3);
};;

btConvexShape.prototype['calculateLocalInertia'] = btConvexShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConvexShape_calculateLocalInertia_2(self, arg0, arg1);
};;

btConvexShape.prototype['setMargin'] = btConvexShape.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexShape_setMargin_1(self, arg0);
};;

btConvexShape.prototype['getMargin'] = btConvexShape.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexShape_getMargin_0(self);
};;

  btConvexShape.prototype['__destroy__'] = btConvexShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btDispatcher.prototype['getNumManifolds'] = btDispatcher.prototype.getNumManifolds = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcher_getNumManifolds_0(self);
};;

btDispatcher.prototype['getManifoldByIndexInternal'] = btDispatcher.prototype.getManifoldByIndexInternal = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btDispatcher_getManifoldByIndexInternal_1(self, arg0), btPersistentManifold);
};;

  btDispatcher.prototype['__destroy__'] = btDispatcher.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btDispatcher___destroy___0(self);
};
// btGeneric6DofConstraint
/** @suppress {undefinedVars, duplicate} */function btGeneric6DofConstraint(arg0, arg1, arg2, arg3, arg4) {
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

btGeneric6DofConstraint.prototype['setLinearLowerLimit'] = btGeneric6DofConstraint.prototype.setLinearLowerLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['setLinearUpperLimit'] = btGeneric6DofConstraint.prototype.setLinearUpperLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['setAngularLowerLimit'] = btGeneric6DofConstraint.prototype.setAngularLowerLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['setAngularUpperLimit'] = btGeneric6DofConstraint.prototype.setAngularUpperLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['getFrameOffsetA'] = btGeneric6DofConstraint.prototype.getFrameOffsetA = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0(self), btTransform);
};;

btGeneric6DofConstraint.prototype['getRotationalLimitMotor'] = btGeneric6DofConstraint.prototype.getRotationalLimitMotor = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btGeneric6DofConstraint_getRotationalLimitMotor_1(self, arg0), btRotationalLimitMotor);
};;

btGeneric6DofConstraint.prototype['enableFeedback'] = btGeneric6DofConstraint.prototype.enableFeedback = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_enableFeedback_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['getBreakingImpulseThreshold'] = btGeneric6DofConstraint.prototype.getBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0(self);
};;

btGeneric6DofConstraint.prototype['setBreakingImpulseThreshold'] = btGeneric6DofConstraint.prototype.setBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

btGeneric6DofConstraint.prototype['getParam'] = btGeneric6DofConstraint.prototype.getParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return _emscripten_bind_btGeneric6DofConstraint_getParam_2(self, arg0, arg1);
};;

btGeneric6DofConstraint.prototype['setParam'] = btGeneric6DofConstraint.prototype.setParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setParam_3(self, arg0, arg1, arg2);
};;

  btGeneric6DofConstraint.prototype['__destroy__'] = btGeneric6DofConstraint.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  btStridingMeshInterface.prototype['__destroy__'] = btStridingMeshInterface.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btMotionState.prototype['getWorldTransform'] = btMotionState.prototype.getWorldTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btMotionState_getWorldTransform_1(self, arg0);
};;

btMotionState.prototype['setWorldTransform'] = btMotionState.prototype.setWorldTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btMotionState_setWorldTransform_1(self, arg0);
};;

  btMotionState.prototype['__destroy__'] = btMotionState.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

ContactResultCallback.prototype['addSingleResult'] = ContactResultCallback.prototype.addSingleResult = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
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

  ContactResultCallback.prototype['__destroy__'] = ContactResultCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  btSoftBodySolver.prototype['__destroy__'] = btSoftBodySolver.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

RayResultCallback.prototype['hasHit'] = RayResultCallback.prototype.hasHit = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_RayResultCallback_hasHit_0(self));
};;

  RayResultCallback.prototype['get_m_collisionFilterGroup'] = RayResultCallback.prototype.get_m_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0(self);
};
    RayResultCallback.prototype['set_m_collisionFilterGroup'] = RayResultCallback.prototype.set_m_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};
  RayResultCallback.prototype['get_m_collisionFilterMask'] = RayResultCallback.prototype.get_m_collisionFilterMask = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0(self);
};
    RayResultCallback.prototype['set_m_collisionFilterMask'] = RayResultCallback.prototype.set_m_collisionFilterMask = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1(self, arg0);
};
  RayResultCallback.prototype['get_m_closestHitFraction'] = RayResultCallback.prototype.get_m_closestHitFraction = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RayResultCallback_get_m_closestHitFraction_0(self);
};
    RayResultCallback.prototype['set_m_closestHitFraction'] = RayResultCallback.prototype.set_m_closestHitFraction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_closestHitFraction_1(self, arg0);
};
  RayResultCallback.prototype['get_m_collisionObject'] = RayResultCallback.prototype.get_m_collisionObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RayResultCallback_get_m_collisionObject_0(self), btCollisionObject);
};
    RayResultCallback.prototype['set_m_collisionObject'] = RayResultCallback.prototype.set_m_collisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_collisionObject_1(self, arg0);
};
  RayResultCallback.prototype['__destroy__'] = RayResultCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btMatrix3x3.prototype['setEulerZYX'] = btMatrix3x3.prototype.setEulerZYX = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btMatrix3x3_setEulerZYX_3(self, arg0, arg1, arg2);
};;

btMatrix3x3.prototype['getRotation'] = btMatrix3x3.prototype.getRotation = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btMatrix3x3_getRotation_1(self, arg0);
};;

btMatrix3x3.prototype['getRow'] = btMatrix3x3.prototype.getRow = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btMatrix3x3_getRow_1(self, arg0), btVector3);
};;

  btMatrix3x3.prototype['__destroy__'] = btMatrix3x3.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  btDispatcherInfo.prototype['get_m_timeStep'] = btDispatcherInfo.prototype.get_m_timeStep = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_timeStep_0(self);
};
    btDispatcherInfo.prototype['set_m_timeStep'] = btDispatcherInfo.prototype.set_m_timeStep = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_timeStep_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_stepCount'] = btDispatcherInfo.prototype.get_m_stepCount = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_stepCount_0(self);
};
    btDispatcherInfo.prototype['set_m_stepCount'] = btDispatcherInfo.prototype.set_m_stepCount = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_stepCount_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_dispatchFunc'] = btDispatcherInfo.prototype.get_m_dispatchFunc = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0(self);
};
    btDispatcherInfo.prototype['set_m_dispatchFunc'] = btDispatcherInfo.prototype.set_m_dispatchFunc = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_timeOfImpact'] = btDispatcherInfo.prototype.get_m_timeOfImpact = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0(self);
};
    btDispatcherInfo.prototype['set_m_timeOfImpact'] = btDispatcherInfo.prototype.set_m_timeOfImpact = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_useContinuous'] = btDispatcherInfo.prototype.get_m_useContinuous = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_useContinuous_0(self));
};
    btDispatcherInfo.prototype['set_m_useContinuous'] = btDispatcherInfo.prototype.set_m_useContinuous = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_useContinuous_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_enableSatConvex'] = btDispatcherInfo.prototype.get_m_enableSatConvex = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0(self));
};
    btDispatcherInfo.prototype['set_m_enableSatConvex'] = btDispatcherInfo.prototype.set_m_enableSatConvex = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_enableSPU'] = btDispatcherInfo.prototype.get_m_enableSPU = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_enableSPU_0(self));
};
    btDispatcherInfo.prototype['set_m_enableSPU'] = btDispatcherInfo.prototype.set_m_enableSPU = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_enableSPU_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_useEpa'] = btDispatcherInfo.prototype.get_m_useEpa = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_useEpa_0(self));
};
    btDispatcherInfo.prototype['set_m_useEpa'] = btDispatcherInfo.prototype.set_m_useEpa = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_useEpa_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_allowedCcdPenetration'] = btDispatcherInfo.prototype.get_m_allowedCcdPenetration = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0(self);
};
    btDispatcherInfo.prototype['set_m_allowedCcdPenetration'] = btDispatcherInfo.prototype.set_m_allowedCcdPenetration = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_useConvexConservativeDistanceUtil'] = btDispatcherInfo.prototype.get_m_useConvexConservativeDistanceUtil = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0(self));
};
    btDispatcherInfo.prototype['set_m_useConvexConservativeDistanceUtil'] = btDispatcherInfo.prototype.set_m_useConvexConservativeDistanceUtil = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1(self, arg0);
};
  btDispatcherInfo.prototype['get_m_convexConservativeDistanceThreshold'] = btDispatcherInfo.prototype.get_m_convexConservativeDistanceThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0(self);
};
    btDispatcherInfo.prototype['set_m_convexConservativeDistanceThreshold'] = btDispatcherInfo.prototype.set_m_convexConservativeDistanceThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1(self, arg0);
};
  btDispatcherInfo.prototype['__destroy__'] = btDispatcherInfo.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  Material.prototype['get_m_kLST'] = Material.prototype.get_m_kLST = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_kLST_0(self);
};
    Material.prototype['set_m_kLST'] = Material.prototype.set_m_kLST = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_kLST_1(self, arg0);
};
  Material.prototype['get_m_kAST'] = Material.prototype.get_m_kAST = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_kAST_0(self);
};
    Material.prototype['set_m_kAST'] = Material.prototype.set_m_kAST = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_kAST_1(self, arg0);
};
  Material.prototype['get_m_kVST'] = Material.prototype.get_m_kVST = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_kVST_0(self);
};
    Material.prototype['set_m_kVST'] = Material.prototype.set_m_kVST = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_kVST_1(self, arg0);
};
  Material.prototype['get_m_flags'] = Material.prototype.get_m_flags = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_flags_0(self);
};
    Material.prototype['set_m_flags'] = Material.prototype.set_m_flags = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_flags_1(self, arg0);
};
  Material.prototype['__destroy__'] = Material.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_Material___destroy___0(self);
};
// btWheelInfoConstructionInfo
function btWheelInfoConstructionInfo() { throw "cannot construct a btWheelInfoConstructionInfo, no constructor in IDL" }
btWheelInfoConstructionInfo.prototype = Object.create(WrapperObject.prototype);
btWheelInfoConstructionInfo.prototype.constructor = btWheelInfoConstructionInfo;
btWheelInfoConstructionInfo.prototype.__class__ = btWheelInfoConstructionInfo;
btWheelInfoConstructionInfo.__cache__ = {};
Module['btWheelInfoConstructionInfo'] = btWheelInfoConstructionInfo;

  btWheelInfoConstructionInfo.prototype['get_m_chassisConnectionCS'] = btWheelInfoConstructionInfo.prototype.get_m_chassisConnectionCS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0(self), btVector3);
};
    btWheelInfoConstructionInfo.prototype['set_m_chassisConnectionCS'] = btWheelInfoConstructionInfo.prototype.set_m_chassisConnectionCS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_wheelDirectionCS'] = btWheelInfoConstructionInfo.prototype.get_m_wheelDirectionCS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0(self), btVector3);
};
    btWheelInfoConstructionInfo.prototype['set_m_wheelDirectionCS'] = btWheelInfoConstructionInfo.prototype.set_m_wheelDirectionCS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_wheelAxleCS'] = btWheelInfoConstructionInfo.prototype.get_m_wheelAxleCS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0(self), btVector3);
};
    btWheelInfoConstructionInfo.prototype['set_m_wheelAxleCS'] = btWheelInfoConstructionInfo.prototype.set_m_wheelAxleCS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_suspensionRestLength'] = btWheelInfoConstructionInfo.prototype.get_m_suspensionRestLength = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0(self);
};
    btWheelInfoConstructionInfo.prototype['set_m_suspensionRestLength'] = btWheelInfoConstructionInfo.prototype.set_m_suspensionRestLength = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_maxSuspensionTravelCm'] = btWheelInfoConstructionInfo.prototype.get_m_maxSuspensionTravelCm = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0(self);
};
    btWheelInfoConstructionInfo.prototype['set_m_maxSuspensionTravelCm'] = btWheelInfoConstructionInfo.prototype.set_m_maxSuspensionTravelCm = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_wheelRadius'] = btWheelInfoConstructionInfo.prototype.get_m_wheelRadius = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0(self);
};
    btWheelInfoConstructionInfo.prototype['set_m_wheelRadius'] = btWheelInfoConstructionInfo.prototype.set_m_wheelRadius = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_suspensionStiffness'] = btWheelInfoConstructionInfo.prototype.get_m_suspensionStiffness = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0(self);
};
    btWheelInfoConstructionInfo.prototype['set_m_suspensionStiffness'] = btWheelInfoConstructionInfo.prototype.set_m_suspensionStiffness = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_wheelsDampingCompression'] = btWheelInfoConstructionInfo.prototype.get_m_wheelsDampingCompression = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0(self);
};
    btWheelInfoConstructionInfo.prototype['set_m_wheelsDampingCompression'] = btWheelInfoConstructionInfo.prototype.set_m_wheelsDampingCompression = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_wheelsDampingRelaxation'] = btWheelInfoConstructionInfo.prototype.get_m_wheelsDampingRelaxation = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0(self);
};
    btWheelInfoConstructionInfo.prototype['set_m_wheelsDampingRelaxation'] = btWheelInfoConstructionInfo.prototype.set_m_wheelsDampingRelaxation = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_frictionSlip'] = btWheelInfoConstructionInfo.prototype.get_m_frictionSlip = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0(self);
};
    btWheelInfoConstructionInfo.prototype['set_m_frictionSlip'] = btWheelInfoConstructionInfo.prototype.set_m_frictionSlip = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_maxSuspensionForce'] = btWheelInfoConstructionInfo.prototype.get_m_maxSuspensionForce = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0(self);
};
    btWheelInfoConstructionInfo.prototype['set_m_maxSuspensionForce'] = btWheelInfoConstructionInfo.prototype.set_m_maxSuspensionForce = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['get_m_bIsFrontWheel'] = btWheelInfoConstructionInfo.prototype.get_m_bIsFrontWheel = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0(self));
};
    btWheelInfoConstructionInfo.prototype['set_m_bIsFrontWheel'] = btWheelInfoConstructionInfo.prototype.set_m_bIsFrontWheel = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1(self, arg0);
};
  btWheelInfoConstructionInfo.prototype['__destroy__'] = btWheelInfoConstructionInfo.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo___destroy___0(self);
};
// btConvexTriangleMeshShape
/** @suppress {undefinedVars, duplicate} */function btConvexTriangleMeshShape(arg0, arg1) {
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

btConvexTriangleMeshShape.prototype['setLocalScaling'] = btConvexTriangleMeshShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1(self, arg0);
};;

btConvexTriangleMeshShape.prototype['getLocalScaling'] = btConvexTriangleMeshShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0(self), btVector3);
};;

btConvexTriangleMeshShape.prototype['calculateLocalInertia'] = btConvexTriangleMeshShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2(self, arg0, arg1);
};;

btConvexTriangleMeshShape.prototype['setMargin'] = btConvexTriangleMeshShape.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexTriangleMeshShape_setMargin_1(self, arg0);
};;

btConvexTriangleMeshShape.prototype['getMargin'] = btConvexTriangleMeshShape.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexTriangleMeshShape_getMargin_0(self);
};;

  btConvexTriangleMeshShape.prototype['__destroy__'] = btConvexTriangleMeshShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  btBroadphaseInterface.prototype['__destroy__'] = btBroadphaseInterface.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btBroadphaseInterface___destroy___0(self);
};
// btRigidBodyConstructionInfo
/** @suppress {undefinedVars, duplicate} */function btRigidBodyConstructionInfo(arg0, arg1, arg2, arg3) {
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

  btRigidBodyConstructionInfo.prototype['get_m_linearDamping'] = btRigidBodyConstructionInfo.prototype.get_m_linearDamping = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_linearDamping'] = btRigidBodyConstructionInfo.prototype.set_m_linearDamping = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_angularDamping'] = btRigidBodyConstructionInfo.prototype.get_m_angularDamping = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_angularDamping'] = btRigidBodyConstructionInfo.prototype.set_m_angularDamping = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_friction'] = btRigidBodyConstructionInfo.prototype.get_m_friction = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_friction'] = btRigidBodyConstructionInfo.prototype.set_m_friction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_rollingFriction'] = btRigidBodyConstructionInfo.prototype.get_m_rollingFriction = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_rollingFriction'] = btRigidBodyConstructionInfo.prototype.set_m_rollingFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_restitution'] = btRigidBodyConstructionInfo.prototype.get_m_restitution = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_restitution'] = btRigidBodyConstructionInfo.prototype.set_m_restitution = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_linearSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.get_m_linearSleepingThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_linearSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.set_m_linearSleepingThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_angularSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.get_m_angularSleepingThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_angularSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.set_m_angularSleepingThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_additionalDamping'] = btRigidBodyConstructionInfo.prototype.get_m_additionalDamping = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0(self));
};
    btRigidBodyConstructionInfo.prototype['set_m_additionalDamping'] = btRigidBodyConstructionInfo.prototype.set_m_additionalDamping = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_additionalDampingFactor'] = btRigidBodyConstructionInfo.prototype.get_m_additionalDampingFactor = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_additionalDampingFactor'] = btRigidBodyConstructionInfo.prototype.set_m_additionalDampingFactor = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_additionalLinearDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.get_m_additionalLinearDampingThresholdSqr = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_additionalLinearDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.set_m_additionalLinearDampingThresholdSqr = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_additionalAngularDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.get_m_additionalAngularDampingThresholdSqr = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_additionalAngularDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.set_m_additionalAngularDampingThresholdSqr = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['get_m_additionalAngularDampingFactor'] = btRigidBodyConstructionInfo.prototype.get_m_additionalAngularDampingFactor = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0(self);
};
    btRigidBodyConstructionInfo.prototype['set_m_additionalAngularDampingFactor'] = btRigidBodyConstructionInfo.prototype.set_m_additionalAngularDampingFactor = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1(self, arg0);
};
  btRigidBodyConstructionInfo.prototype['__destroy__'] = btRigidBodyConstructionInfo.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  btCollisionConfiguration.prototype['__destroy__'] = btCollisionConfiguration.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionConfiguration___destroy___0(self);
};
// btPersistentManifold
/** @suppress {undefinedVars, duplicate} */function btPersistentManifold() {
  this.ptr = _emscripten_bind_btPersistentManifold_btPersistentManifold_0();
  getCache(btPersistentManifold)[this.ptr] = this;
};;
btPersistentManifold.prototype = Object.create(WrapperObject.prototype);
btPersistentManifold.prototype.constructor = btPersistentManifold;
btPersistentManifold.prototype.__class__ = btPersistentManifold;
btPersistentManifold.__cache__ = {};
Module['btPersistentManifold'] = btPersistentManifold;

btPersistentManifold.prototype['getBody0'] = btPersistentManifold.prototype.getBody0 = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPersistentManifold_getBody0_0(self), btCollisionObject);
};;

btPersistentManifold.prototype['getBody1'] = btPersistentManifold.prototype.getBody1 = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPersistentManifold_getBody1_0(self), btCollisionObject);
};;

btPersistentManifold.prototype['getNumContacts'] = btPersistentManifold.prototype.getNumContacts = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btPersistentManifold_getNumContacts_0(self);
};;

btPersistentManifold.prototype['getContactPoint'] = btPersistentManifold.prototype.getContactPoint = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btPersistentManifold_getContactPoint_1(self, arg0), btManifoldPoint);
};;

  btPersistentManifold.prototype['__destroy__'] = btPersistentManifold.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btPersistentManifold___destroy___0(self);
};
// btCompoundShape
/** @suppress {undefinedVars, duplicate} */function btCompoundShape(arg0) {
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

btCompoundShape.prototype['addChildShape'] = btCompoundShape.prototype.addChildShape = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCompoundShape_addChildShape_2(self, arg0, arg1);
};;

btCompoundShape.prototype['removeChildShapeByIndex'] = btCompoundShape.prototype.removeChildShapeByIndex = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCompoundShape_removeChildShapeByIndex_1(self, arg0);
};;

btCompoundShape.prototype['getNumChildShapes'] = btCompoundShape.prototype.getNumChildShapes = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCompoundShape_getNumChildShapes_0(self);
};;

btCompoundShape.prototype['getChildShape'] = btCompoundShape.prototype.getChildShape = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btCompoundShape_getChildShape_1(self, arg0), btCollisionShape);
};;

btCompoundShape.prototype['setMargin'] = btCompoundShape.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCompoundShape_setMargin_1(self, arg0);
};;

btCompoundShape.prototype['getMargin'] = btCompoundShape.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCompoundShape_getMargin_0(self);
};;

btCompoundShape.prototype['setLocalScaling'] = btCompoundShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCompoundShape_setLocalScaling_1(self, arg0);
};;

btCompoundShape.prototype['getLocalScaling'] = btCompoundShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCompoundShape_getLocalScaling_0(self), btVector3);
};;

btCompoundShape.prototype['calculateLocalInertia'] = btCompoundShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCompoundShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCompoundShape.prototype['__destroy__'] = btCompoundShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btCompoundShape___destroy___0(self);
};
// ClosestConvexResultCallback
/** @suppress {undefinedVars, duplicate} */function ClosestConvexResultCallback(arg0, arg1) {
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

ClosestConvexResultCallback.prototype['hasHit'] = ClosestConvexResultCallback.prototype.hasHit = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ClosestConvexResultCallback_hasHit_0(self));
};;

  ClosestConvexResultCallback.prototype['get_m_convexFromWorld'] = ClosestConvexResultCallback.prototype.get_m_convexFromWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0(self), btVector3);
};
    ClosestConvexResultCallback.prototype['set_m_convexFromWorld'] = ClosestConvexResultCallback.prototype.set_m_convexFromWorld = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_convexToWorld'] = ClosestConvexResultCallback.prototype.get_m_convexToWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0(self), btVector3);
};
    ClosestConvexResultCallback.prototype['set_m_convexToWorld'] = ClosestConvexResultCallback.prototype.set_m_convexToWorld = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_hitNormalWorld'] = ClosestConvexResultCallback.prototype.get_m_hitNormalWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0(self), btVector3);
};
    ClosestConvexResultCallback.prototype['set_m_hitNormalWorld'] = ClosestConvexResultCallback.prototype.set_m_hitNormalWorld = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_hitPointWorld'] = ClosestConvexResultCallback.prototype.get_m_hitPointWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0(self), btVector3);
};
    ClosestConvexResultCallback.prototype['set_m_hitPointWorld'] = ClosestConvexResultCallback.prototype.set_m_hitPointWorld = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_collisionFilterGroup'] = ClosestConvexResultCallback.prototype.get_m_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0(self);
};
    ClosestConvexResultCallback.prototype['set_m_collisionFilterGroup'] = ClosestConvexResultCallback.prototype.set_m_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_collisionFilterMask'] = ClosestConvexResultCallback.prototype.get_m_collisionFilterMask = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0(self);
};
    ClosestConvexResultCallback.prototype['set_m_collisionFilterMask'] = ClosestConvexResultCallback.prototype.set_m_collisionFilterMask = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['get_m_closestHitFraction'] = ClosestConvexResultCallback.prototype.get_m_closestHitFraction = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0(self);
};
    ClosestConvexResultCallback.prototype['set_m_closestHitFraction'] = ClosestConvexResultCallback.prototype.set_m_closestHitFraction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1(self, arg0);
};
  ClosestConvexResultCallback.prototype['__destroy__'] = ClosestConvexResultCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_ClosestConvexResultCallback___destroy___0(self);
};
// Link
function Link() { throw "cannot construct a Link, no constructor in IDL" }
Link.prototype = Object.create(WrapperObject.prototype);
Link.prototype.constructor = Link;
Link.prototype.__class__ = Link;
Link.__cache__ = {};
Module['Link'] = Link;

  Link.prototype['get_m_n'] = Link.prototype.get_m_n = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_Link_get_m_n_1(self, arg0), Node);
};
    Link.prototype['set_m_n'] = Link.prototype.set_m_n = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_Link_set_m_n_2(self, arg0, arg1);
};
  Link.prototype['__destroy__'] = Link.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_Link___destroy___0(self);
};
// tMaterialArray
function tMaterialArray() { throw "cannot construct a tMaterialArray, no constructor in IDL" }
tMaterialArray.prototype = Object.create(WrapperObject.prototype);
tMaterialArray.prototype.constructor = tMaterialArray;
tMaterialArray.prototype.__class__ = tMaterialArray;
tMaterialArray.__cache__ = {};
Module['tMaterialArray'] = tMaterialArray;

tMaterialArray.prototype['size'] = tMaterialArray.prototype.size = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_tMaterialArray_size_0(self);
};;

tMaterialArray.prototype['at'] = tMaterialArray.prototype.at = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_tMaterialArray_at_1(self, arg0), Material);
};;

  tMaterialArray.prototype['__destroy__'] = tMaterialArray.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_tMaterialArray___destroy___0(self);
};
// btDefaultVehicleRaycaster
/** @suppress {undefinedVars, duplicate} */function btDefaultVehicleRaycaster(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1(arg0);
  getCache(btDefaultVehicleRaycaster)[this.ptr] = this;
};;
btDefaultVehicleRaycaster.prototype = Object.create(btVehicleRaycaster.prototype);
btDefaultVehicleRaycaster.prototype.constructor = btDefaultVehicleRaycaster;
btDefaultVehicleRaycaster.prototype.__class__ = btDefaultVehicleRaycaster;
btDefaultVehicleRaycaster.__cache__ = {};
Module['btDefaultVehicleRaycaster'] = btDefaultVehicleRaycaster;

btDefaultVehicleRaycaster.prototype['castRay'] = btDefaultVehicleRaycaster.prototype.castRay = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btDefaultVehicleRaycaster_castRay_3(self, arg0, arg1, arg2);
};;

  btDefaultVehicleRaycaster.prototype['__destroy__'] = btDefaultVehicleRaycaster.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultVehicleRaycaster___destroy___0(self);
};
// btConstraintSetting
/** @suppress {undefinedVars, duplicate} */function btConstraintSetting() {
  this.ptr = _emscripten_bind_btConstraintSetting_btConstraintSetting_0();
  getCache(btConstraintSetting)[this.ptr] = this;
};;
btConstraintSetting.prototype = Object.create(WrapperObject.prototype);
btConstraintSetting.prototype.constructor = btConstraintSetting;
btConstraintSetting.prototype.__class__ = btConstraintSetting;
btConstraintSetting.__cache__ = {};
Module['btConstraintSetting'] = btConstraintSetting;

  btConstraintSetting.prototype['get_m_tau'] = btConstraintSetting.prototype.get_m_tau = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btConstraintSetting_get_m_tau_0(self);
};
    btConstraintSetting.prototype['set_m_tau'] = btConstraintSetting.prototype.set_m_tau = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConstraintSetting_set_m_tau_1(self, arg0);
};
  btConstraintSetting.prototype['get_m_damping'] = btConstraintSetting.prototype.get_m_damping = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btConstraintSetting_get_m_damping_0(self);
};
    btConstraintSetting.prototype['set_m_damping'] = btConstraintSetting.prototype.set_m_damping = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConstraintSetting_set_m_damping_1(self, arg0);
};
  btConstraintSetting.prototype['get_m_impulseClamp'] = btConstraintSetting.prototype.get_m_impulseClamp = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btConstraintSetting_get_m_impulseClamp_0(self);
};
    btConstraintSetting.prototype['set_m_impulseClamp'] = btConstraintSetting.prototype.set_m_impulseClamp = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConstraintSetting_set_m_impulseClamp_1(self, arg0);
};
  btConstraintSetting.prototype['__destroy__'] = btConstraintSetting.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  LocalShapeInfo.prototype['get_m_shapePart'] = LocalShapeInfo.prototype.get_m_shapePart = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_LocalShapeInfo_get_m_shapePart_0(self);
};
    LocalShapeInfo.prototype['set_m_shapePart'] = LocalShapeInfo.prototype.set_m_shapePart = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalShapeInfo_set_m_shapePart_1(self, arg0);
};
  LocalShapeInfo.prototype['get_m_triangleIndex'] = LocalShapeInfo.prototype.get_m_triangleIndex = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0(self);
};
    LocalShapeInfo.prototype['set_m_triangleIndex'] = LocalShapeInfo.prototype.set_m_triangleIndex = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1(self, arg0);
};
  LocalShapeInfo.prototype['__destroy__'] = LocalShapeInfo.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_LocalShapeInfo___destroy___0(self);
};
// btRigidBody
/** @suppress {undefinedVars, duplicate} */function btRigidBody(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btRigidBody_btRigidBody_1(arg0);
  getCache(btRigidBody)[this.ptr] = this;
};;
btRigidBody.prototype = Object.create(btCollisionObject.prototype);
btRigidBody.prototype.constructor = btRigidBody;
btRigidBody.prototype.__class__ = btRigidBody;
btRigidBody.__cache__ = {};
Module['btRigidBody'] = btRigidBody;

btRigidBody.prototype['getCenterOfMassTransform'] = btRigidBody.prototype.getCenterOfMassTransform = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getCenterOfMassTransform_0(self), btTransform);
};;

btRigidBody.prototype['setCenterOfMassTransform'] = btRigidBody.prototype.setCenterOfMassTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setCenterOfMassTransform_1(self, arg0);
};;

btRigidBody.prototype['setSleepingThresholds'] = btRigidBody.prototype.setSleepingThresholds = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_setSleepingThresholds_2(self, arg0, arg1);
};;

btRigidBody.prototype['setDamping'] = btRigidBody.prototype.setDamping = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_setDamping_2(self, arg0, arg1);
};;

btRigidBody.prototype['setMassProps'] = btRigidBody.prototype.setMassProps = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_setMassProps_2(self, arg0, arg1);
};;

btRigidBody.prototype['setLinearFactor'] = btRigidBody.prototype.setLinearFactor = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setLinearFactor_1(self, arg0);
};;

btRigidBody.prototype['applyTorque'] = btRigidBody.prototype.applyTorque = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_applyTorque_1(self, arg0);
};;

btRigidBody.prototype['applyForce'] = btRigidBody.prototype.applyForce = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_applyForce_2(self, arg0, arg1);
};;

btRigidBody.prototype['applyCentralForce'] = btRigidBody.prototype.applyCentralForce = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_applyCentralForce_1(self, arg0);
};;

btRigidBody.prototype['applyTorqueImpulse'] = btRigidBody.prototype.applyTorqueImpulse = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_applyTorqueImpulse_1(self, arg0);
};;

btRigidBody.prototype['applyImpulse'] = btRigidBody.prototype.applyImpulse = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_applyImpulse_2(self, arg0, arg1);
};;

btRigidBody.prototype['applyCentralImpulse'] = btRigidBody.prototype.applyCentralImpulse = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_applyCentralImpulse_1(self, arg0);
};;

btRigidBody.prototype['updateInertiaTensor'] = btRigidBody.prototype.updateInertiaTensor = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBody_updateInertiaTensor_0(self);
};;

btRigidBody.prototype['getLinearVelocity'] = btRigidBody.prototype.getLinearVelocity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getLinearVelocity_0(self), btVector3);
};;

btRigidBody.prototype['getAngularVelocity'] = btRigidBody.prototype.getAngularVelocity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getAngularVelocity_0(self), btVector3);
};;

btRigidBody.prototype['setLinearVelocity'] = btRigidBody.prototype.setLinearVelocity = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setLinearVelocity_1(self, arg0);
};;

btRigidBody.prototype['setAngularVelocity'] = btRigidBody.prototype.setAngularVelocity = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setAngularVelocity_1(self, arg0);
};;

btRigidBody.prototype['getMotionState'] = btRigidBody.prototype.getMotionState = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getMotionState_0(self), btMotionState);
};;

btRigidBody.prototype['setMotionState'] = btRigidBody.prototype.setMotionState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setMotionState_1(self, arg0);
};;

btRigidBody.prototype['setAngularFactor'] = btRigidBody.prototype.setAngularFactor = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setAngularFactor_1(self, arg0);
};;

btRigidBody.prototype['upcast'] = btRigidBody.prototype.upcast = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_upcast_1(self, arg0), btRigidBody);
};;

btRigidBody.prototype['getAabb'] = btRigidBody.prototype.getAabb = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_getAabb_2(self, arg0, arg1);
};;

btRigidBody.prototype['applyGravity'] = btRigidBody.prototype.applyGravity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBody_applyGravity_0(self);
};;

btRigidBody.prototype['getGravity'] = btRigidBody.prototype.getGravity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getGravity_0(self), btVector3);
};;

btRigidBody.prototype['setGravity'] = btRigidBody.prototype.setGravity = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setGravity_1(self, arg0);
};;

btRigidBody.prototype['getBroadphaseProxy'] = btRigidBody.prototype.getBroadphaseProxy = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getBroadphaseProxy_0(self), btBroadphaseProxy);
};;

btRigidBody.prototype['setAnisotropicFriction'] = btRigidBody.prototype.setAnisotropicFriction = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRigidBody_setAnisotropicFriction_2(self, arg0, arg1);
};;

btRigidBody.prototype['getCollisionShape'] = btRigidBody.prototype.getCollisionShape = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getCollisionShape_0(self), btCollisionShape);
};;

btRigidBody.prototype['setContactProcessingThreshold'] = btRigidBody.prototype.setContactProcessingThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setContactProcessingThreshold_1(self, arg0);
};;

btRigidBody.prototype['setActivationState'] = btRigidBody.prototype.setActivationState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setActivationState_1(self, arg0);
};;

btRigidBody.prototype['forceActivationState'] = btRigidBody.prototype.forceActivationState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_forceActivationState_1(self, arg0);
};;

btRigidBody.prototype['activate'] = btRigidBody.prototype.activate = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { _emscripten_bind_btRigidBody_activate_0(self);  return }
  _emscripten_bind_btRigidBody_activate_1(self, arg0);
};;

btRigidBody.prototype['isActive'] = btRigidBody.prototype.isActive = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBody_isActive_0(self));
};;

btRigidBody.prototype['isKinematicObject'] = btRigidBody.prototype.isKinematicObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBody_isKinematicObject_0(self));
};;

btRigidBody.prototype['isStaticObject'] = btRigidBody.prototype.isStaticObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBody_isStaticObject_0(self));
};;

btRigidBody.prototype['isStaticOrKinematicObject'] = btRigidBody.prototype.isStaticOrKinematicObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBody_isStaticOrKinematicObject_0(self));
};;

btRigidBody.prototype['setRestitution'] = btRigidBody.prototype.setRestitution = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setRestitution_1(self, arg0);
};;

btRigidBody.prototype['setFriction'] = btRigidBody.prototype.setFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setFriction_1(self, arg0);
};;

btRigidBody.prototype['setRollingFriction'] = btRigidBody.prototype.setRollingFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setRollingFriction_1(self, arg0);
};;

btRigidBody.prototype['getWorldTransform'] = btRigidBody.prototype.getWorldTransform = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getWorldTransform_0(self), btTransform);
};;

btRigidBody.prototype['getCollisionFlags'] = btRigidBody.prototype.getCollisionFlags = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getCollisionFlags_0(self);
};;

btRigidBody.prototype['setCollisionFlags'] = btRigidBody.prototype.setCollisionFlags = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setCollisionFlags_1(self, arg0);
};;

btRigidBody.prototype['setWorldTransform'] = btRigidBody.prototype.setWorldTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setWorldTransform_1(self, arg0);
};;

btRigidBody.prototype['setCollisionShape'] = btRigidBody.prototype.setCollisionShape = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setCollisionShape_1(self, arg0);
};;

btRigidBody.prototype['setCcdMotionThreshold'] = btRigidBody.prototype.setCcdMotionThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setCcdMotionThreshold_1(self, arg0);
};;

btRigidBody.prototype['setCcdSweptSphereRadius'] = btRigidBody.prototype.setCcdSweptSphereRadius = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1(self, arg0);
};;

btRigidBody.prototype['getUserIndex'] = btRigidBody.prototype.getUserIndex = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getUserIndex_0(self);
};;

btRigidBody.prototype['setUserIndex'] = btRigidBody.prototype.setUserIndex = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setUserIndex_1(self, arg0);
};;

btRigidBody.prototype['getUserPointer'] = btRigidBody.prototype.getUserPointer = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getUserPointer_0(self), VoidPtr);
};;

btRigidBody.prototype['setUserPointer'] = btRigidBody.prototype.setUserPointer = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBody_setUserPointer_1(self, arg0);
};;

  btRigidBody.prototype['__destroy__'] = btRigidBody.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBody___destroy___0(self);
};
// btConvexPolyhedron
function btConvexPolyhedron() { throw "cannot construct a btConvexPolyhedron, no constructor in IDL" }
btConvexPolyhedron.prototype = Object.create(WrapperObject.prototype);
btConvexPolyhedron.prototype.constructor = btConvexPolyhedron;
btConvexPolyhedron.prototype.__class__ = btConvexPolyhedron;
btConvexPolyhedron.__cache__ = {};
Module['btConvexPolyhedron'] = btConvexPolyhedron;

  btConvexPolyhedron.prototype['get_m_vertices'] = btConvexPolyhedron.prototype.get_m_vertices = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexPolyhedron_get_m_vertices_0(self), btVector3Array);
};
    btConvexPolyhedron.prototype['set_m_vertices'] = btConvexPolyhedron.prototype.set_m_vertices = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexPolyhedron_set_m_vertices_1(self, arg0);
};
  btConvexPolyhedron.prototype['get_m_faces'] = btConvexPolyhedron.prototype.get_m_faces = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexPolyhedron_get_m_faces_0(self), btFaceArray);
};
    btConvexPolyhedron.prototype['set_m_faces'] = btConvexPolyhedron.prototype.set_m_faces = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexPolyhedron_set_m_faces_1(self, arg0);
};
  btConvexPolyhedron.prototype['__destroy__'] = btConvexPolyhedron.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btConvexPolyhedron___destroy___0(self);
};
// btDbvtBroadphase
/** @suppress {undefinedVars, duplicate} */function btDbvtBroadphase() {
  this.ptr = _emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0();
  getCache(btDbvtBroadphase)[this.ptr] = this;
};;
btDbvtBroadphase.prototype = Object.create(WrapperObject.prototype);
btDbvtBroadphase.prototype.constructor = btDbvtBroadphase;
btDbvtBroadphase.prototype.__class__ = btDbvtBroadphase;
btDbvtBroadphase.__cache__ = {};
Module['btDbvtBroadphase'] = btDbvtBroadphase;

  btDbvtBroadphase.prototype['__destroy__'] = btDbvtBroadphase.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btDbvtBroadphase___destroy___0(self);
};
// btHeightfieldTerrainShape
/** @suppress {undefinedVars, duplicate} */function btHeightfieldTerrainShape(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
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

btHeightfieldTerrainShape.prototype['setMargin'] = btHeightfieldTerrainShape.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHeightfieldTerrainShape_setMargin_1(self, arg0);
};;

btHeightfieldTerrainShape.prototype['getMargin'] = btHeightfieldTerrainShape.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btHeightfieldTerrainShape_getMargin_0(self);
};;

btHeightfieldTerrainShape.prototype['setLocalScaling'] = btHeightfieldTerrainShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1(self, arg0);
};;

btHeightfieldTerrainShape.prototype['getLocalScaling'] = btHeightfieldTerrainShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0(self), btVector3);
};;

btHeightfieldTerrainShape.prototype['calculateLocalInertia'] = btHeightfieldTerrainShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btHeightfieldTerrainShape.prototype['__destroy__'] = btHeightfieldTerrainShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btHeightfieldTerrainShape___destroy___0(self);
};
// btDefaultSoftBodySolver
/** @suppress {undefinedVars, duplicate} */function btDefaultSoftBodySolver() {
  this.ptr = _emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0();
  getCache(btDefaultSoftBodySolver)[this.ptr] = this;
};;
btDefaultSoftBodySolver.prototype = Object.create(btSoftBodySolver.prototype);
btDefaultSoftBodySolver.prototype.constructor = btDefaultSoftBodySolver;
btDefaultSoftBodySolver.prototype.__class__ = btDefaultSoftBodySolver;
btDefaultSoftBodySolver.__cache__ = {};
Module['btDefaultSoftBodySolver'] = btDefaultSoftBodySolver;

  btDefaultSoftBodySolver.prototype['__destroy__'] = btDefaultSoftBodySolver.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultSoftBodySolver___destroy___0(self);
};
// btCollisionDispatcher
/** @suppress {undefinedVars, duplicate} */function btCollisionDispatcher(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1(arg0);
  getCache(btCollisionDispatcher)[this.ptr] = this;
};;
btCollisionDispatcher.prototype = Object.create(btDispatcher.prototype);
btCollisionDispatcher.prototype.constructor = btCollisionDispatcher;
btCollisionDispatcher.prototype.__class__ = btCollisionDispatcher;
btCollisionDispatcher.__cache__ = {};
Module['btCollisionDispatcher'] = btCollisionDispatcher;

btCollisionDispatcher.prototype['getNumManifolds'] = btCollisionDispatcher.prototype.getNumManifolds = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionDispatcher_getNumManifolds_0(self);
};;

btCollisionDispatcher.prototype['getManifoldByIndexInternal'] = btCollisionDispatcher.prototype.getManifoldByIndexInternal = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1(self, arg0), btPersistentManifold);
};;

  btCollisionDispatcher.prototype['__destroy__'] = btCollisionDispatcher.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionDispatcher___destroy___0(self);
};
// btAxisSweep3
/** @suppress {undefinedVars, duplicate} */function btAxisSweep3(arg0, arg1, arg2, arg3, arg4) {
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

  btAxisSweep3.prototype['__destroy__'] = btAxisSweep3.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btAxisSweep3___destroy___0(self);
};
// btSoftBodyWorldInfo
/** @suppress {undefinedVars, duplicate} */function btSoftBodyWorldInfo() {
  this.ptr = _emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0();
  getCache(btSoftBodyWorldInfo)[this.ptr] = this;
};;
btSoftBodyWorldInfo.prototype = Object.create(WrapperObject.prototype);
btSoftBodyWorldInfo.prototype.constructor = btSoftBodyWorldInfo;
btSoftBodyWorldInfo.prototype.__class__ = btSoftBodyWorldInfo;
btSoftBodyWorldInfo.__cache__ = {};
Module['btSoftBodyWorldInfo'] = btSoftBodyWorldInfo;

  btSoftBodyWorldInfo.prototype['get_air_density'] = btSoftBodyWorldInfo.prototype.get_air_density = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_air_density_0(self);
};
    btSoftBodyWorldInfo.prototype['set_air_density'] = btSoftBodyWorldInfo.prototype.set_air_density = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_air_density_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_water_density'] = btSoftBodyWorldInfo.prototype.get_water_density = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_water_density_0(self);
};
    btSoftBodyWorldInfo.prototype['set_water_density'] = btSoftBodyWorldInfo.prototype.set_water_density = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_water_density_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_water_offset'] = btSoftBodyWorldInfo.prototype.get_water_offset = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0(self);
};
    btSoftBodyWorldInfo.prototype['set_water_offset'] = btSoftBodyWorldInfo.prototype.set_water_offset = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_m_maxDisplacement'] = btSoftBodyWorldInfo.prototype.get_m_maxDisplacement = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0(self);
};
    btSoftBodyWorldInfo.prototype['set_m_maxDisplacement'] = btSoftBodyWorldInfo.prototype.set_m_maxDisplacement = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_water_normal'] = btSoftBodyWorldInfo.prototype.get_water_normal = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0(self), btVector3);
};
    btSoftBodyWorldInfo.prototype['set_water_normal'] = btSoftBodyWorldInfo.prototype.set_water_normal = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_m_broadphase'] = btSoftBodyWorldInfo.prototype.get_m_broadphase = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0(self), btBroadphaseInterface);
};
    btSoftBodyWorldInfo.prototype['set_m_broadphase'] = btSoftBodyWorldInfo.prototype.set_m_broadphase = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_m_dispatcher'] = btSoftBodyWorldInfo.prototype.get_m_dispatcher = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0(self), btDispatcher);
};
    btSoftBodyWorldInfo.prototype['set_m_dispatcher'] = btSoftBodyWorldInfo.prototype.set_m_dispatcher = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['get_m_gravity'] = btSoftBodyWorldInfo.prototype.get_m_gravity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0(self), btVector3);
};
    btSoftBodyWorldInfo.prototype['set_m_gravity'] = btSoftBodyWorldInfo.prototype.set_m_gravity = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1(self, arg0);
};
  btSoftBodyWorldInfo.prototype['__destroy__'] = btSoftBodyWorldInfo.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyWorldInfo___destroy___0(self);
};
// btConeTwistConstraint
/** @suppress {undefinedVars, duplicate} */function btConeTwistConstraint(arg0, arg1, arg2, arg3) {
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

btConeTwistConstraint.prototype['setLimit'] = btConeTwistConstraint.prototype.setLimit = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConeTwistConstraint_setLimit_2(self, arg0, arg1);
};;

btConeTwistConstraint.prototype['setAngularOnly'] = btConeTwistConstraint.prototype.setAngularOnly = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setAngularOnly_1(self, arg0);
};;

btConeTwistConstraint.prototype['setDamping'] = btConeTwistConstraint.prototype.setDamping = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setDamping_1(self, arg0);
};;

btConeTwistConstraint.prototype['enableMotor'] = btConeTwistConstraint.prototype.enableMotor = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_enableMotor_1(self, arg0);
};;

btConeTwistConstraint.prototype['setMaxMotorImpulse'] = btConeTwistConstraint.prototype.setMaxMotorImpulse = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1(self, arg0);
};;

btConeTwistConstraint.prototype['setMaxMotorImpulseNormalized'] = btConeTwistConstraint.prototype.setMaxMotorImpulseNormalized = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1(self, arg0);
};;

btConeTwistConstraint.prototype['setMotorTarget'] = btConeTwistConstraint.prototype.setMotorTarget = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setMotorTarget_1(self, arg0);
};;

btConeTwistConstraint.prototype['setMotorTargetInConstraintSpace'] = btConeTwistConstraint.prototype.setMotorTargetInConstraintSpace = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1(self, arg0);
};;

btConeTwistConstraint.prototype['enableFeedback'] = btConeTwistConstraint.prototype.enableFeedback = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_enableFeedback_1(self, arg0);
};;

btConeTwistConstraint.prototype['getBreakingImpulseThreshold'] = btConeTwistConstraint.prototype.getBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0(self);
};;

btConeTwistConstraint.prototype['setBreakingImpulseThreshold'] = btConeTwistConstraint.prototype.setBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

btConeTwistConstraint.prototype['getParam'] = btConeTwistConstraint.prototype.getParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return _emscripten_bind_btConeTwistConstraint_getParam_2(self, arg0, arg1);
};;

btConeTwistConstraint.prototype['setParam'] = btConeTwistConstraint.prototype.setParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btConeTwistConstraint_setParam_3(self, arg0, arg1, arg2);
};;

  btConeTwistConstraint.prototype['__destroy__'] = btConeTwistConstraint.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btConeTwistConstraint___destroy___0(self);
};
// btHingeConstraint
/** @suppress {undefinedVars, duplicate} */function btHingeConstraint(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
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

btHingeConstraint.prototype['setLimit'] = btHingeConstraint.prototype.setLimit = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  if (arg4 === undefined) { _emscripten_bind_btHingeConstraint_setLimit_4(self, arg0, arg1, arg2, arg3);  return }
  _emscripten_bind_btHingeConstraint_setLimit_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btHingeConstraint.prototype['enableAngularMotor'] = btHingeConstraint.prototype.enableAngularMotor = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btHingeConstraint_enableAngularMotor_3(self, arg0, arg1, arg2);
};;

btHingeConstraint.prototype['setAngularOnly'] = btHingeConstraint.prototype.setAngularOnly = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHingeConstraint_setAngularOnly_1(self, arg0);
};;

btHingeConstraint.prototype['enableMotor'] = btHingeConstraint.prototype.enableMotor = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHingeConstraint_enableMotor_1(self, arg0);
};;

btHingeConstraint.prototype['setMaxMotorImpulse'] = btHingeConstraint.prototype.setMaxMotorImpulse = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1(self, arg0);
};;

btHingeConstraint.prototype['setMotorTarget'] = btHingeConstraint.prototype.setMotorTarget = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btHingeConstraint_setMotorTarget_2(self, arg0, arg1);
};;

btHingeConstraint.prototype['enableFeedback'] = btHingeConstraint.prototype.enableFeedback = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHingeConstraint_enableFeedback_1(self, arg0);
};;

btHingeConstraint.prototype['getBreakingImpulseThreshold'] = btHingeConstraint.prototype.getBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0(self);
};;

btHingeConstraint.prototype['setBreakingImpulseThreshold'] = btHingeConstraint.prototype.setBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

btHingeConstraint.prototype['getParam'] = btHingeConstraint.prototype.getParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return _emscripten_bind_btHingeConstraint_getParam_2(self, arg0, arg1);
};;

btHingeConstraint.prototype['setParam'] = btHingeConstraint.prototype.setParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btHingeConstraint_setParam_3(self, arg0, arg1, arg2);
};;

  btHingeConstraint.prototype['__destroy__'] = btHingeConstraint.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btHingeConstraint___destroy___0(self);
};
// btRotationalLimitMotor
/** @suppress {undefinedVars, duplicate} */function btRotationalLimitMotor(arg0) {
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

btRotationalLimitMotor.prototype['isLimited'] = btRotationalLimitMotor.prototype.isLimited = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRotationalLimitMotor_isLimited_0(self));
};;

btRotationalLimitMotor.prototype['needApplyTorques'] = btRotationalLimitMotor.prototype.needApplyTorques = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRotationalLimitMotor_needApplyTorques_0(self));
};;

  btRotationalLimitMotor.prototype['get_m_loLimit'] = btRotationalLimitMotor.prototype.get_m_loLimit = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRotationalLimitMotor_get_m_loLimit_0(self);
};
    btRotationalLimitMotor.prototype['set_m_loLimit'] = btRotationalLimitMotor.prototype.set_m_loLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRotationalLimitMotor_set_m_loLimit_1(self, arg0);
};
  btRotationalLimitMotor.prototype['get_m_hiLimit'] = btRotationalLimitMotor.prototype.get_m_hiLimit = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRotationalLimitMotor_get_m_hiLimit_0(self);
};
    btRotationalLimitMotor.prototype['set_m_hiLimit'] = btRotationalLimitMotor.prototype.set_m_hiLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRotationalLimitMotor_set_m_hiLimit_1(self, arg0);
};
  btRotationalLimitMotor.prototype['get_m_targetVelocity'] = btRotationalLimitMotor.prototype.get_m_targetVelocity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRotationalLimitMotor_get_m_targetVelocity_0(self);
};
    btRotationalLimitMotor.prototype['set_m_targetVelocity'] = btRotationalLimitMotor.prototype.set_m_targetVelocity = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRotationalLimitMotor_set_m_targetVelocity_1(self, arg0);
};
  btRotationalLimitMotor.prototype['get_m_maxMotorForce'] = btRotationalLimitMotor.prototype.get_m_maxMotorForce = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRotationalLimitMotor_get_m_maxMotorForce_0(self);
};
    btRotationalLimitMotor.prototype['set_m_maxMotorForce'] = btRotationalLimitMotor.prototype.set_m_maxMotorForce = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRotationalLimitMotor_set_m_maxMotorForce_1(self, arg0);
};
  btRotationalLimitMotor.prototype['get_m_enableMotor'] = btRotationalLimitMotor.prototype.get_m_enableMotor = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRotationalLimitMotor_get_m_enableMotor_0(self));
};
    btRotationalLimitMotor.prototype['set_m_enableMotor'] = btRotationalLimitMotor.prototype.set_m_enableMotor = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRotationalLimitMotor_set_m_enableMotor_1(self, arg0);
};
  btRotationalLimitMotor.prototype['__destroy__'] = btRotationalLimitMotor.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btRotationalLimitMotor___destroy___0(self);
};
// btConeShapeZ
/** @suppress {undefinedVars, duplicate} */function btConeShapeZ(arg0, arg1) {
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

btConeShapeZ.prototype['setLocalScaling'] = btConeShapeZ.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeShapeZ_setLocalScaling_1(self, arg0);
};;

btConeShapeZ.prototype['getLocalScaling'] = btConeShapeZ.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConeShapeZ_getLocalScaling_0(self), btVector3);
};;

btConeShapeZ.prototype['calculateLocalInertia'] = btConeShapeZ.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConeShapeZ_calculateLocalInertia_2(self, arg0, arg1);
};;

  btConeShapeZ.prototype['__destroy__'] = btConeShapeZ.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btConeShapeZ___destroy___0(self);
};
// btConeShapeX
/** @suppress {undefinedVars, duplicate} */function btConeShapeX(arg0, arg1) {
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

btConeShapeX.prototype['setLocalScaling'] = btConeShapeX.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConeShapeX_setLocalScaling_1(self, arg0);
};;

btConeShapeX.prototype['getLocalScaling'] = btConeShapeX.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConeShapeX_getLocalScaling_0(self), btVector3);
};;

btConeShapeX.prototype['calculateLocalInertia'] = btConeShapeX.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConeShapeX_calculateLocalInertia_2(self, arg0, arg1);
};;

  btConeShapeX.prototype['__destroy__'] = btConeShapeX.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btConeShapeX___destroy___0(self);
};
// btTriangleMesh
/** @suppress {undefinedVars, duplicate} */function btTriangleMesh(arg0, arg1) {
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

btTriangleMesh.prototype['addTriangle'] = btTriangleMesh.prototype.addTriangle = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg3 === undefined) { _emscripten_bind_btTriangleMesh_addTriangle_3(self, arg0, arg1, arg2);  return }
  _emscripten_bind_btTriangleMesh_addTriangle_4(self, arg0, arg1, arg2, arg3);
};;

  btTriangleMesh.prototype['__destroy__'] = btTriangleMesh.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btTriangleMesh___destroy___0(self);
};
// btConvexHullShape
/** @suppress {undefinedVars, duplicate} */function btConvexHullShape(arg0, arg1) {
  ensureCache.prepare();
  if (typeof arg0 == 'object') { arg0 = ensureFloat32(arg0); }
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg0 === undefined) { this.ptr = _emscripten_bind_btConvexHullShape_btConvexHullShape_0(); getCache(btConvexHullShape)[this.ptr] = this;return }
  if (arg1 === undefined) { this.ptr = _emscripten_bind_btConvexHullShape_btConvexHullShape_1(arg0); getCache(btConvexHullShape)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btConvexHullShape_btConvexHullShape_2(arg0, arg1);
  getCache(btConvexHullShape)[this.ptr] = this;
};;
btConvexHullShape.prototype = Object.create(btCollisionShape.prototype);
btConvexHullShape.prototype.constructor = btConvexHullShape;
btConvexHullShape.prototype.__class__ = btConvexHullShape;
btConvexHullShape.__cache__ = {};
Module['btConvexHullShape'] = btConvexHullShape;

btConvexHullShape.prototype['addPoint'] = btConvexHullShape.prototype.addPoint = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { _emscripten_bind_btConvexHullShape_addPoint_1(self, arg0);  return }
  _emscripten_bind_btConvexHullShape_addPoint_2(self, arg0, arg1);
};;

btConvexHullShape.prototype['setMargin'] = btConvexHullShape.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexHullShape_setMargin_1(self, arg0);
};;

btConvexHullShape.prototype['getMargin'] = btConvexHullShape.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexHullShape_getMargin_0(self);
};;

btConvexHullShape.prototype['getNumVertices'] = btConvexHullShape.prototype.getNumVertices = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexHullShape_getNumVertices_0(self);
};;

btConvexHullShape.prototype['initializePolyhedralFeatures'] = btConvexHullShape.prototype.initializePolyhedralFeatures = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return !!(_emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1(self, arg0));
};;

btConvexHullShape.prototype['recalcLocalAabb'] = btConvexHullShape.prototype.recalcLocalAabb = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btConvexHullShape_recalcLocalAabb_0(self);
};;

btConvexHullShape.prototype['getConvexPolyhedron'] = btConvexHullShape.prototype.getConvexPolyhedron = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexHullShape_getConvexPolyhedron_0(self), btConvexPolyhedron);
};;

btConvexHullShape.prototype['setLocalScaling'] = btConvexHullShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexHullShape_setLocalScaling_1(self, arg0);
};;

btConvexHullShape.prototype['getLocalScaling'] = btConvexHullShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexHullShape_getLocalScaling_0(self), btVector3);
};;

btConvexHullShape.prototype['calculateLocalInertia'] = btConvexHullShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btConvexHullShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btConvexHullShape.prototype['__destroy__'] = btConvexHullShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btConvexHullShape___destroy___0(self);
};
// btVehicleTuning
/** @suppress {undefinedVars, duplicate} */function btVehicleTuning() {
  this.ptr = _emscripten_bind_btVehicleTuning_btVehicleTuning_0();
  getCache(btVehicleTuning)[this.ptr] = this;
};;
btVehicleTuning.prototype = Object.create(WrapperObject.prototype);
btVehicleTuning.prototype.constructor = btVehicleTuning;
btVehicleTuning.prototype.__class__ = btVehicleTuning;
btVehicleTuning.__cache__ = {};
Module['btVehicleTuning'] = btVehicleTuning;

  btVehicleTuning.prototype['get_m_suspensionStiffness'] = btVehicleTuning.prototype.get_m_suspensionStiffness = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0(self);
};
    btVehicleTuning.prototype['set_m_suspensionStiffness'] = btVehicleTuning.prototype.set_m_suspensionStiffness = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1(self, arg0);
};
  btVehicleTuning.prototype['get_m_suspensionCompression'] = btVehicleTuning.prototype.get_m_suspensionCompression = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0(self);
};
    btVehicleTuning.prototype['set_m_suspensionCompression'] = btVehicleTuning.prototype.set_m_suspensionCompression = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1(self, arg0);
};
  btVehicleTuning.prototype['get_m_suspensionDamping'] = btVehicleTuning.prototype.get_m_suspensionDamping = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0(self);
};
    btVehicleTuning.prototype['set_m_suspensionDamping'] = btVehicleTuning.prototype.set_m_suspensionDamping = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1(self, arg0);
};
  btVehicleTuning.prototype['get_m_maxSuspensionTravelCm'] = btVehicleTuning.prototype.get_m_maxSuspensionTravelCm = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0(self);
};
    btVehicleTuning.prototype['set_m_maxSuspensionTravelCm'] = btVehicleTuning.prototype.set_m_maxSuspensionTravelCm = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1(self, arg0);
};
  btVehicleTuning.prototype['get_m_frictionSlip'] = btVehicleTuning.prototype.get_m_frictionSlip = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_frictionSlip_0(self);
};
    btVehicleTuning.prototype['set_m_frictionSlip'] = btVehicleTuning.prototype.set_m_frictionSlip = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_frictionSlip_1(self, arg0);
};
  btVehicleTuning.prototype['get_m_maxSuspensionForce'] = btVehicleTuning.prototype.get_m_maxSuspensionForce = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0(self);
};
    btVehicleTuning.prototype['set_m_maxSuspensionForce'] = btVehicleTuning.prototype.set_m_maxSuspensionForce = /** @suppress {undefinedVars, duplicate} */function(arg0) {
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

// btShapeHull
/** @suppress {undefinedVars, duplicate} */function btShapeHull(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btShapeHull_btShapeHull_1(arg0);
  getCache(btShapeHull)[this.ptr] = this;
};;
btShapeHull.prototype = Object.create(WrapperObject.prototype);
btShapeHull.prototype.constructor = btShapeHull;
btShapeHull.prototype.__class__ = btShapeHull;
btShapeHull.__cache__ = {};
Module['btShapeHull'] = btShapeHull;

btShapeHull.prototype['buildHull'] = btShapeHull.prototype.buildHull = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return !!(_emscripten_bind_btShapeHull_buildHull_1(self, arg0));
};;

btShapeHull.prototype['numVertices'] = btShapeHull.prototype.numVertices = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btShapeHull_numVertices_0(self);
};;

btShapeHull.prototype['getVertexPointer'] = btShapeHull.prototype.getVertexPointer = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btShapeHull_getVertexPointer_0(self), btVector3);
};;

  btShapeHull.prototype['__destroy__'] = btShapeHull.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btShapeHull___destroy___0(self);
};
// btDefaultMotionState
/** @suppress {undefinedVars, duplicate} */function btDefaultMotionState(arg0, arg1) {
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

btDefaultMotionState.prototype['getWorldTransform'] = btDefaultMotionState.prototype.getWorldTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDefaultMotionState_getWorldTransform_1(self, arg0);
};;

btDefaultMotionState.prototype['setWorldTransform'] = btDefaultMotionState.prototype.setWorldTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDefaultMotionState_setWorldTransform_1(self, arg0);
};;

  btDefaultMotionState.prototype['get_m_graphicsWorldTrans'] = btDefaultMotionState.prototype.get_m_graphicsWorldTrans = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0(self), btTransform);
};
    btDefaultMotionState.prototype['set_m_graphicsWorldTrans'] = btDefaultMotionState.prototype.set_m_graphicsWorldTrans = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1(self, arg0);
};
  btDefaultMotionState.prototype['__destroy__'] = btDefaultMotionState.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultMotionState___destroy___0(self);
};
// btWheelInfo
/** @suppress {undefinedVars, duplicate} */function btWheelInfo(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btWheelInfo_btWheelInfo_1(arg0);
  getCache(btWheelInfo)[this.ptr] = this;
};;
btWheelInfo.prototype = Object.create(WrapperObject.prototype);
btWheelInfo.prototype.constructor = btWheelInfo;
btWheelInfo.prototype.__class__ = btWheelInfo;
btWheelInfo.__cache__ = {};
Module['btWheelInfo'] = btWheelInfo;

btWheelInfo.prototype['getSuspensionRestLength'] = btWheelInfo.prototype.getSuspensionRestLength = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_getSuspensionRestLength_0(self);
};;

btWheelInfo.prototype['updateWheel'] = btWheelInfo.prototype.updateWheel = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btWheelInfo_updateWheel_2(self, arg0, arg1);
};;

  btWheelInfo.prototype['get_m_suspensionStiffness'] = btWheelInfo.prototype.get_m_suspensionStiffness = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0(self);
};
    btWheelInfo.prototype['set_m_suspensionStiffness'] = btWheelInfo.prototype.set_m_suspensionStiffness = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1(self, arg0);
};
  btWheelInfo.prototype['get_m_frictionSlip'] = btWheelInfo.prototype.get_m_frictionSlip = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_frictionSlip_0(self);
};
    btWheelInfo.prototype['set_m_frictionSlip'] = btWheelInfo.prototype.set_m_frictionSlip = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_frictionSlip_1(self, arg0);
};
  btWheelInfo.prototype['get_m_engineForce'] = btWheelInfo.prototype.get_m_engineForce = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_engineForce_0(self);
};
    btWheelInfo.prototype['set_m_engineForce'] = btWheelInfo.prototype.set_m_engineForce = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_engineForce_1(self, arg0);
};
  btWheelInfo.prototype['get_m_rollInfluence'] = btWheelInfo.prototype.get_m_rollInfluence = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_rollInfluence_0(self);
};
    btWheelInfo.prototype['set_m_rollInfluence'] = btWheelInfo.prototype.set_m_rollInfluence = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_rollInfluence_1(self, arg0);
};
  btWheelInfo.prototype['get_m_suspensionRestLength1'] = btWheelInfo.prototype.get_m_suspensionRestLength1 = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0(self);
};
    btWheelInfo.prototype['set_m_suspensionRestLength1'] = btWheelInfo.prototype.set_m_suspensionRestLength1 = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1(self, arg0);
};
  btWheelInfo.prototype['get_m_wheelsRadius'] = btWheelInfo.prototype.get_m_wheelsRadius = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsRadius_0(self);
};
    btWheelInfo.prototype['set_m_wheelsRadius'] = btWheelInfo.prototype.set_m_wheelsRadius = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsRadius_1(self, arg0);
};
  btWheelInfo.prototype['get_m_wheelsDampingCompression'] = btWheelInfo.prototype.get_m_wheelsDampingCompression = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0(self);
};
    btWheelInfo.prototype['set_m_wheelsDampingCompression'] = btWheelInfo.prototype.set_m_wheelsDampingCompression = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1(self, arg0);
};
  btWheelInfo.prototype['get_m_wheelsDampingRelaxation'] = btWheelInfo.prototype.get_m_wheelsDampingRelaxation = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0(self);
};
    btWheelInfo.prototype['set_m_wheelsDampingRelaxation'] = btWheelInfo.prototype.set_m_wheelsDampingRelaxation = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1(self, arg0);
};
  btWheelInfo.prototype['get_m_steering'] = btWheelInfo.prototype.get_m_steering = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_steering_0(self);
};
    btWheelInfo.prototype['set_m_steering'] = btWheelInfo.prototype.set_m_steering = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_steering_1(self, arg0);
};
  btWheelInfo.prototype['get_m_maxSuspensionForce'] = btWheelInfo.prototype.get_m_maxSuspensionForce = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0(self);
};
    btWheelInfo.prototype['set_m_maxSuspensionForce'] = btWheelInfo.prototype.set_m_maxSuspensionForce = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1(self, arg0);
};
  btWheelInfo.prototype['get_m_maxSuspensionTravelCm'] = btWheelInfo.prototype.get_m_maxSuspensionTravelCm = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0(self);
};
    btWheelInfo.prototype['set_m_maxSuspensionTravelCm'] = btWheelInfo.prototype.set_m_maxSuspensionTravelCm = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1(self, arg0);
};
  btWheelInfo.prototype['get_m_wheelsSuspensionForce'] = btWheelInfo.prototype.get_m_wheelsSuspensionForce = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0(self);
};
    btWheelInfo.prototype['set_m_wheelsSuspensionForce'] = btWheelInfo.prototype.set_m_wheelsSuspensionForce = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1(self, arg0);
};
  btWheelInfo.prototype['get_m_bIsFrontWheel'] = btWheelInfo.prototype.get_m_bIsFrontWheel = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0(self));
};
    btWheelInfo.prototype['set_m_bIsFrontWheel'] = btWheelInfo.prototype.set_m_bIsFrontWheel = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1(self, arg0);
};
  btWheelInfo.prototype['get_m_raycastInfo'] = btWheelInfo.prototype.get_m_raycastInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_raycastInfo_0(self), RaycastInfo);
};
    btWheelInfo.prototype['set_m_raycastInfo'] = btWheelInfo.prototype.set_m_raycastInfo = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_raycastInfo_1(self, arg0);
};
  btWheelInfo.prototype['get_m_chassisConnectionPointCS'] = btWheelInfo.prototype.get_m_chassisConnectionPointCS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0(self), btVector3);
};
    btWheelInfo.prototype['set_m_chassisConnectionPointCS'] = btWheelInfo.prototype.set_m_chassisConnectionPointCS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1(self, arg0);
};
  btWheelInfo.prototype['get_m_worldTransform'] = btWheelInfo.prototype.get_m_worldTransform = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_worldTransform_0(self), btTransform);
};
    btWheelInfo.prototype['set_m_worldTransform'] = btWheelInfo.prototype.set_m_worldTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_worldTransform_1(self, arg0);
};
  btWheelInfo.prototype['get_m_wheelDirectionCS'] = btWheelInfo.prototype.get_m_wheelDirectionCS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0(self), btVector3);
};
    btWheelInfo.prototype['set_m_wheelDirectionCS'] = btWheelInfo.prototype.set_m_wheelDirectionCS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1(self, arg0);
};
  btWheelInfo.prototype['get_m_wheelAxleCS'] = btWheelInfo.prototype.get_m_wheelAxleCS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0(self), btVector3);
};
    btWheelInfo.prototype['set_m_wheelAxleCS'] = btWheelInfo.prototype.set_m_wheelAxleCS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1(self, arg0);
};
  btWheelInfo.prototype['get_m_rotation'] = btWheelInfo.prototype.get_m_rotation = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_rotation_0(self);
};
    btWheelInfo.prototype['set_m_rotation'] = btWheelInfo.prototype.set_m_rotation = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_rotation_1(self, arg0);
};
  btWheelInfo.prototype['get_m_deltaRotation'] = btWheelInfo.prototype.get_m_deltaRotation = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_deltaRotation_0(self);
};
    btWheelInfo.prototype['set_m_deltaRotation'] = btWheelInfo.prototype.set_m_deltaRotation = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_deltaRotation_1(self, arg0);
};
  btWheelInfo.prototype['get_m_brake'] = btWheelInfo.prototype.get_m_brake = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_brake_0(self);
};
    btWheelInfo.prototype['set_m_brake'] = btWheelInfo.prototype.set_m_brake = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_brake_1(self, arg0);
};
  btWheelInfo.prototype['get_m_clippedInvContactDotSuspension'] = btWheelInfo.prototype.get_m_clippedInvContactDotSuspension = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0(self);
};
    btWheelInfo.prototype['set_m_clippedInvContactDotSuspension'] = btWheelInfo.prototype.set_m_clippedInvContactDotSuspension = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1(self, arg0);
};
  btWheelInfo.prototype['get_m_suspensionRelativeVelocity'] = btWheelInfo.prototype.get_m_suspensionRelativeVelocity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0(self);
};
    btWheelInfo.prototype['set_m_suspensionRelativeVelocity'] = btWheelInfo.prototype.set_m_suspensionRelativeVelocity = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1(self, arg0);
};
  btWheelInfo.prototype['get_m_skidInfo'] = btWheelInfo.prototype.get_m_skidInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_skidInfo_0(self);
};
    btWheelInfo.prototype['set_m_skidInfo'] = btWheelInfo.prototype.set_m_skidInfo = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_skidInfo_1(self, arg0);
};
  btWheelInfo.prototype['__destroy__'] = btWheelInfo.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btWheelInfo___destroy___0(self);
};
// btVector4
/** @suppress {undefinedVars, duplicate} */function btVector4(arg0, arg1, arg2, arg3) {
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

btVector4.prototype['w'] = btVector4.prototype.w = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_w_0(self);
};;

btVector4.prototype['setValue'] = btVector4.prototype.setValue = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  _emscripten_bind_btVector4_setValue_4(self, arg0, arg1, arg2, arg3);
};;

btVector4.prototype['length'] = btVector4.prototype.length = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_length_0(self);
};;

btVector4.prototype['x'] = btVector4.prototype.x = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_x_0(self);
};;

btVector4.prototype['y'] = btVector4.prototype.y = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_y_0(self);
};;

btVector4.prototype['z'] = btVector4.prototype.z = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_z_0(self);
};;

btVector4.prototype['setX'] = btVector4.prototype.setX = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector4_setX_1(self, arg0);
};;

btVector4.prototype['setY'] = btVector4.prototype.setY = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector4_setY_1(self, arg0);
};;

btVector4.prototype['setZ'] = btVector4.prototype.setZ = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVector4_setZ_1(self, arg0);
};;

btVector4.prototype['normalize'] = btVector4.prototype.normalize = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btVector4_normalize_0(self);
};;

btVector4.prototype['rotate'] = btVector4.prototype.rotate = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return wrapPointer(_emscripten_bind_btVector4_rotate_2(self, arg0, arg1), btVector3);
};;

btVector4.prototype['dot'] = btVector4.prototype.dot = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btVector4_dot_1(self, arg0);
};;

btVector4.prototype['op_mul'] = btVector4.prototype.op_mul = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector4_op_mul_1(self, arg0), btVector3);
};;

btVector4.prototype['op_add'] = btVector4.prototype.op_add = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector4_op_add_1(self, arg0), btVector3);
};;

btVector4.prototype['op_sub'] = btVector4.prototype.op_sub = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector4_op_sub_1(self, arg0), btVector3);
};;

  btVector4.prototype['__destroy__'] = btVector4.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btVector4___destroy___0(self);
};
// btDefaultCollisionConstructionInfo
/** @suppress {undefinedVars, duplicate} */function btDefaultCollisionConstructionInfo() {
  this.ptr = _emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0();
  getCache(btDefaultCollisionConstructionInfo)[this.ptr] = this;
};;
btDefaultCollisionConstructionInfo.prototype = Object.create(WrapperObject.prototype);
btDefaultCollisionConstructionInfo.prototype.constructor = btDefaultCollisionConstructionInfo;
btDefaultCollisionConstructionInfo.prototype.__class__ = btDefaultCollisionConstructionInfo;
btDefaultCollisionConstructionInfo.__cache__ = {};
Module['btDefaultCollisionConstructionInfo'] = btDefaultCollisionConstructionInfo;

  btDefaultCollisionConstructionInfo.prototype['__destroy__'] = btDefaultCollisionConstructionInfo.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0(self);
};
// Anchor
function Anchor() { throw "cannot construct a Anchor, no constructor in IDL" }
Anchor.prototype = Object.create(WrapperObject.prototype);
Anchor.prototype.constructor = Anchor;
Anchor.prototype.__class__ = Anchor;
Anchor.__cache__ = {};
Module['Anchor'] = Anchor;

  Anchor.prototype['get_m_node'] = Anchor.prototype.get_m_node = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Anchor_get_m_node_0(self), Node);
};
    Anchor.prototype['set_m_node'] = Anchor.prototype.set_m_node = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_node_1(self, arg0);
};
  Anchor.prototype['get_m_local'] = Anchor.prototype.get_m_local = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Anchor_get_m_local_0(self), btVector3);
};
    Anchor.prototype['set_m_local'] = Anchor.prototype.set_m_local = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_local_1(self, arg0);
};
  Anchor.prototype['get_m_body'] = Anchor.prototype.get_m_body = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Anchor_get_m_body_0(self), btRigidBody);
};
    Anchor.prototype['set_m_body'] = Anchor.prototype.set_m_body = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_body_1(self, arg0);
};
  Anchor.prototype['get_m_influence'] = Anchor.prototype.get_m_influence = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Anchor_get_m_influence_0(self);
};
    Anchor.prototype['set_m_influence'] = Anchor.prototype.set_m_influence = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_influence_1(self, arg0);
};
  Anchor.prototype['get_m_c0'] = Anchor.prototype.get_m_c0 = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Anchor_get_m_c0_0(self), btMatrix3x3);
};
    Anchor.prototype['set_m_c0'] = Anchor.prototype.set_m_c0 = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_c0_1(self, arg0);
};
  Anchor.prototype['get_m_c1'] = Anchor.prototype.get_m_c1 = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Anchor_get_m_c1_0(self), btVector3);
};
    Anchor.prototype['set_m_c1'] = Anchor.prototype.set_m_c1 = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_c1_1(self, arg0);
};
  Anchor.prototype['get_m_c2'] = Anchor.prototype.get_m_c2 = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Anchor_get_m_c2_0(self);
};
    Anchor.prototype['set_m_c2'] = Anchor.prototype.set_m_c2 = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_c2_1(self, arg0);
};
  Anchor.prototype['__destroy__'] = Anchor.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_Anchor___destroy___0(self);
};
// btVehicleRaycasterResult
function btVehicleRaycasterResult() { throw "cannot construct a btVehicleRaycasterResult, no constructor in IDL" }
btVehicleRaycasterResult.prototype = Object.create(WrapperObject.prototype);
btVehicleRaycasterResult.prototype.constructor = btVehicleRaycasterResult;
btVehicleRaycasterResult.prototype.__class__ = btVehicleRaycasterResult;
btVehicleRaycasterResult.__cache__ = {};
Module['btVehicleRaycasterResult'] = btVehicleRaycasterResult;

  btVehicleRaycasterResult.prototype['get_m_hitPointInWorld'] = btVehicleRaycasterResult.prototype.get_m_hitPointInWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0(self), btVector3);
};
    btVehicleRaycasterResult.prototype['set_m_hitPointInWorld'] = btVehicleRaycasterResult.prototype.set_m_hitPointInWorld = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1(self, arg0);
};
  btVehicleRaycasterResult.prototype['get_m_hitNormalInWorld'] = btVehicleRaycasterResult.prototype.get_m_hitNormalInWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0(self), btVector3);
};
    btVehicleRaycasterResult.prototype['set_m_hitNormalInWorld'] = btVehicleRaycasterResult.prototype.set_m_hitNormalInWorld = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1(self, arg0);
};
  btVehicleRaycasterResult.prototype['get_m_distFraction'] = btVehicleRaycasterResult.prototype.get_m_distFraction = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0(self);
};
    btVehicleRaycasterResult.prototype['set_m_distFraction'] = btVehicleRaycasterResult.prototype.set_m_distFraction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1(self, arg0);
};
  btVehicleRaycasterResult.prototype['__destroy__'] = btVehicleRaycasterResult.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btVehicleRaycasterResult___destroy___0(self);
};
// btVector3Array
function btVector3Array() { throw "cannot construct a btVector3Array, no constructor in IDL" }
btVector3Array.prototype = Object.create(WrapperObject.prototype);
btVector3Array.prototype.constructor = btVector3Array;
btVector3Array.prototype.__class__ = btVector3Array;
btVector3Array.__cache__ = {};
Module['btVector3Array'] = btVector3Array;

btVector3Array.prototype['size'] = btVector3Array.prototype.size = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3Array_size_0(self);
};;

btVector3Array.prototype['at'] = btVector3Array.prototype.at = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btVector3Array_at_1(self, arg0), btVector3);
};;

  btVector3Array.prototype['__destroy__'] = btVector3Array.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btVector3Array___destroy___0(self);
};
// btConstraintSolver
function btConstraintSolver() { throw "cannot construct a btConstraintSolver, no constructor in IDL" }
btConstraintSolver.prototype = Object.create(WrapperObject.prototype);
btConstraintSolver.prototype.constructor = btConstraintSolver;
btConstraintSolver.prototype.__class__ = btConstraintSolver;
btConstraintSolver.__cache__ = {};
Module['btConstraintSolver'] = btConstraintSolver;

  btConstraintSolver.prototype['__destroy__'] = btConstraintSolver.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btConstraintSolver___destroy___0(self);
};
// btRaycastVehicle
/** @suppress {undefinedVars, duplicate} */function btRaycastVehicle(arg0, arg1, arg2) {
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

btRaycastVehicle.prototype['applyEngineForce'] = btRaycastVehicle.prototype.applyEngineForce = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRaycastVehicle_applyEngineForce_2(self, arg0, arg1);
};;

btRaycastVehicle.prototype['setSteeringValue'] = btRaycastVehicle.prototype.setSteeringValue = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRaycastVehicle_setSteeringValue_2(self, arg0, arg1);
};;

btRaycastVehicle.prototype['getWheelTransformWS'] = btRaycastVehicle.prototype.getWheelTransformWS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getWheelTransformWS_1(self, arg0), btTransform);
};;

btRaycastVehicle.prototype['updateWheelTransform'] = btRaycastVehicle.prototype.updateWheelTransform = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRaycastVehicle_updateWheelTransform_2(self, arg0, arg1);
};;

btRaycastVehicle.prototype['addWheel'] = btRaycastVehicle.prototype.addWheel = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
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

btRaycastVehicle.prototype['getNumWheels'] = btRaycastVehicle.prototype.getNumWheels = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getNumWheels_0(self);
};;

btRaycastVehicle.prototype['getRigidBody'] = btRaycastVehicle.prototype.getRigidBody = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getRigidBody_0(self), btRigidBody);
};;

btRaycastVehicle.prototype['getWheelInfo'] = btRaycastVehicle.prototype.getWheelInfo = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getWheelInfo_1(self, arg0), btWheelInfo);
};;

btRaycastVehicle.prototype['setBrake'] = btRaycastVehicle.prototype.setBrake = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRaycastVehicle_setBrake_2(self, arg0, arg1);
};;

btRaycastVehicle.prototype['setCoordinateSystem'] = btRaycastVehicle.prototype.setCoordinateSystem = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btRaycastVehicle_setCoordinateSystem_3(self, arg0, arg1, arg2);
};;

btRaycastVehicle.prototype['getCurrentSpeedKmHour'] = btRaycastVehicle.prototype.getCurrentSpeedKmHour = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0(self);
};;

btRaycastVehicle.prototype['getChassisWorldTransform'] = btRaycastVehicle.prototype.getChassisWorldTransform = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0(self), btTransform);
};;

btRaycastVehicle.prototype['rayCast'] = btRaycastVehicle.prototype.rayCast = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btRaycastVehicle_rayCast_1(self, arg0);
};;

btRaycastVehicle.prototype['updateVehicle'] = btRaycastVehicle.prototype.updateVehicle = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRaycastVehicle_updateVehicle_1(self, arg0);
};;

btRaycastVehicle.prototype['resetSuspension'] = btRaycastVehicle.prototype.resetSuspension = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btRaycastVehicle_resetSuspension_0(self);
};;

btRaycastVehicle.prototype['getSteeringValue'] = btRaycastVehicle.prototype.getSteeringValue = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btRaycastVehicle_getSteeringValue_1(self, arg0);
};;

btRaycastVehicle.prototype['updateWheelTransformsWS'] = btRaycastVehicle.prototype.updateWheelTransformsWS = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { _emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1(self, arg0);  return }
  _emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2(self, arg0, arg1);
};;

btRaycastVehicle.prototype['setPitchControl'] = btRaycastVehicle.prototype.setPitchControl = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRaycastVehicle_setPitchControl_1(self, arg0);
};;

btRaycastVehicle.prototype['updateSuspension'] = btRaycastVehicle.prototype.updateSuspension = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRaycastVehicle_updateSuspension_1(self, arg0);
};;

btRaycastVehicle.prototype['updateFriction'] = btRaycastVehicle.prototype.updateFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRaycastVehicle_updateFriction_1(self, arg0);
};;

btRaycastVehicle.prototype['getRightAxis'] = btRaycastVehicle.prototype.getRightAxis = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getRightAxis_0(self);
};;

btRaycastVehicle.prototype['getUpAxis'] = btRaycastVehicle.prototype.getUpAxis = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getUpAxis_0(self);
};;

btRaycastVehicle.prototype['getForwardAxis'] = btRaycastVehicle.prototype.getForwardAxis = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getForwardAxis_0(self);
};;

btRaycastVehicle.prototype['getForwardVector'] = btRaycastVehicle.prototype.getForwardVector = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getForwardVector_0(self), btVector3);
};;

btRaycastVehicle.prototype['getUserConstraintType'] = btRaycastVehicle.prototype.getUserConstraintType = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getUserConstraintType_0(self);
};;

btRaycastVehicle.prototype['setUserConstraintType'] = btRaycastVehicle.prototype.setUserConstraintType = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRaycastVehicle_setUserConstraintType_1(self, arg0);
};;

btRaycastVehicle.prototype['setUserConstraintId'] = btRaycastVehicle.prototype.setUserConstraintId = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRaycastVehicle_setUserConstraintId_1(self, arg0);
};;

btRaycastVehicle.prototype['getUserConstraintId'] = btRaycastVehicle.prototype.getUserConstraintId = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getUserConstraintId_0(self);
};;

btRaycastVehicle.prototype['updateAction'] = btRaycastVehicle.prototype.updateAction = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btRaycastVehicle_updateAction_2(self, arg0, arg1);
};;

  btRaycastVehicle.prototype['__destroy__'] = btRaycastVehicle.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btRaycastVehicle___destroy___0(self);
};
// btCylinderShapeX
/** @suppress {undefinedVars, duplicate} */function btCylinderShapeX(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btCylinderShapeX_btCylinderShapeX_1(arg0);
  getCache(btCylinderShapeX)[this.ptr] = this;
};;
btCylinderShapeX.prototype = Object.create(btCylinderShape.prototype);
btCylinderShapeX.prototype.constructor = btCylinderShapeX;
btCylinderShapeX.prototype.__class__ = btCylinderShapeX;
btCylinderShapeX.__cache__ = {};
Module['btCylinderShapeX'] = btCylinderShapeX;

btCylinderShapeX.prototype['setMargin'] = btCylinderShapeX.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShapeX_setMargin_1(self, arg0);
};;

btCylinderShapeX.prototype['getMargin'] = btCylinderShapeX.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCylinderShapeX_getMargin_0(self);
};;

btCylinderShapeX.prototype['setLocalScaling'] = btCylinderShapeX.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShapeX_setLocalScaling_1(self, arg0);
};;

btCylinderShapeX.prototype['getLocalScaling'] = btCylinderShapeX.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCylinderShapeX_getLocalScaling_0(self), btVector3);
};;

btCylinderShapeX.prototype['calculateLocalInertia'] = btCylinderShapeX.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCylinderShapeX_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCylinderShapeX.prototype['__destroy__'] = btCylinderShapeX.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btCylinderShapeX___destroy___0(self);
};
// btCylinderShapeZ
/** @suppress {undefinedVars, duplicate} */function btCylinderShapeZ(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1(arg0);
  getCache(btCylinderShapeZ)[this.ptr] = this;
};;
btCylinderShapeZ.prototype = Object.create(btCylinderShape.prototype);
btCylinderShapeZ.prototype.constructor = btCylinderShapeZ;
btCylinderShapeZ.prototype.__class__ = btCylinderShapeZ;
btCylinderShapeZ.__cache__ = {};
Module['btCylinderShapeZ'] = btCylinderShapeZ;

btCylinderShapeZ.prototype['setMargin'] = btCylinderShapeZ.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShapeZ_setMargin_1(self, arg0);
};;

btCylinderShapeZ.prototype['getMargin'] = btCylinderShapeZ.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCylinderShapeZ_getMargin_0(self);
};;

btCylinderShapeZ.prototype['setLocalScaling'] = btCylinderShapeZ.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCylinderShapeZ_setLocalScaling_1(self, arg0);
};;

btCylinderShapeZ.prototype['getLocalScaling'] = btCylinderShapeZ.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCylinderShapeZ_getLocalScaling_0(self), btVector3);
};;

btCylinderShapeZ.prototype['calculateLocalInertia'] = btCylinderShapeZ.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCylinderShapeZ.prototype['__destroy__'] = btCylinderShapeZ.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btCylinderShapeZ___destroy___0(self);
};
// btSequentialImpulseConstraintSolver
/** @suppress {undefinedVars, duplicate} */function btSequentialImpulseConstraintSolver() {
  this.ptr = _emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0();
  getCache(btSequentialImpulseConstraintSolver)[this.ptr] = this;
};;
btSequentialImpulseConstraintSolver.prototype = Object.create(WrapperObject.prototype);
btSequentialImpulseConstraintSolver.prototype.constructor = btSequentialImpulseConstraintSolver;
btSequentialImpulseConstraintSolver.prototype.__class__ = btSequentialImpulseConstraintSolver;
btSequentialImpulseConstraintSolver.__cache__ = {};
Module['btSequentialImpulseConstraintSolver'] = btSequentialImpulseConstraintSolver;

  btSequentialImpulseConstraintSolver.prototype['__destroy__'] = btSequentialImpulseConstraintSolver.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0(self);
};
// tAnchorArray
function tAnchorArray() { throw "cannot construct a tAnchorArray, no constructor in IDL" }
tAnchorArray.prototype = Object.create(WrapperObject.prototype);
tAnchorArray.prototype.constructor = tAnchorArray;
tAnchorArray.prototype.__class__ = tAnchorArray;
tAnchorArray.__cache__ = {};
Module['tAnchorArray'] = tAnchorArray;

tAnchorArray.prototype['size'] = tAnchorArray.prototype.size = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_tAnchorArray_size_0(self);
};;

tAnchorArray.prototype['at'] = tAnchorArray.prototype.at = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_tAnchorArray_at_1(self, arg0), Anchor);
};;

tAnchorArray.prototype['clear'] = tAnchorArray.prototype.clear = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_tAnchorArray_clear_0(self);
};;

tAnchorArray.prototype['push_back'] = tAnchorArray.prototype.push_back = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_tAnchorArray_push_back_1(self, arg0);
};;

tAnchorArray.prototype['pop_back'] = tAnchorArray.prototype.pop_back = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_tAnchorArray_pop_back_0(self);
};;

  tAnchorArray.prototype['__destroy__'] = tAnchorArray.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_tAnchorArray___destroy___0(self);
};
// RaycastInfo
function RaycastInfo() { throw "cannot construct a RaycastInfo, no constructor in IDL" }
RaycastInfo.prototype = Object.create(WrapperObject.prototype);
RaycastInfo.prototype.constructor = RaycastInfo;
RaycastInfo.prototype.__class__ = RaycastInfo;
RaycastInfo.__cache__ = {};
Module['RaycastInfo'] = RaycastInfo;

  RaycastInfo.prototype['get_m_contactNormalWS'] = RaycastInfo.prototype.get_m_contactNormalWS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_contactNormalWS_0(self), btVector3);
};
    RaycastInfo.prototype['set_m_contactNormalWS'] = RaycastInfo.prototype.set_m_contactNormalWS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_contactNormalWS_1(self, arg0);
};
  RaycastInfo.prototype['get_m_contactPointWS'] = RaycastInfo.prototype.get_m_contactPointWS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_contactPointWS_0(self), btVector3);
};
    RaycastInfo.prototype['set_m_contactPointWS'] = RaycastInfo.prototype.set_m_contactPointWS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_contactPointWS_1(self, arg0);
};
  RaycastInfo.prototype['get_m_suspensionLength'] = RaycastInfo.prototype.get_m_suspensionLength = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RaycastInfo_get_m_suspensionLength_0(self);
};
    RaycastInfo.prototype['set_m_suspensionLength'] = RaycastInfo.prototype.set_m_suspensionLength = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_suspensionLength_1(self, arg0);
};
  RaycastInfo.prototype['get_m_hardPointWS'] = RaycastInfo.prototype.get_m_hardPointWS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_hardPointWS_0(self), btVector3);
};
    RaycastInfo.prototype['set_m_hardPointWS'] = RaycastInfo.prototype.set_m_hardPointWS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_hardPointWS_1(self, arg0);
};
  RaycastInfo.prototype['get_m_wheelDirectionWS'] = RaycastInfo.prototype.get_m_wheelDirectionWS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0(self), btVector3);
};
    RaycastInfo.prototype['set_m_wheelDirectionWS'] = RaycastInfo.prototype.set_m_wheelDirectionWS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1(self, arg0);
};
  RaycastInfo.prototype['get_m_wheelAxleWS'] = RaycastInfo.prototype.get_m_wheelAxleWS = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0(self), btVector3);
};
    RaycastInfo.prototype['set_m_wheelAxleWS'] = RaycastInfo.prototype.set_m_wheelAxleWS = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1(self, arg0);
};
  RaycastInfo.prototype['get_m_isInContact'] = RaycastInfo.prototype.get_m_isInContact = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_RaycastInfo_get_m_isInContact_0(self));
};
    RaycastInfo.prototype['set_m_isInContact'] = RaycastInfo.prototype.set_m_isInContact = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_isInContact_1(self, arg0);
};
  RaycastInfo.prototype['get_m_groundObject'] = RaycastInfo.prototype.get_m_groundObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_RaycastInfo_get_m_groundObject_0(self);
};
    RaycastInfo.prototype['set_m_groundObject'] = RaycastInfo.prototype.set_m_groundObject = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_groundObject_1(self, arg0);
};
  RaycastInfo.prototype['__destroy__'] = RaycastInfo.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

tNodeArray.prototype['size'] = tNodeArray.prototype.size = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_tNodeArray_size_0(self);
};;

tNodeArray.prototype['at'] = tNodeArray.prototype.at = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_tNodeArray_at_1(self, arg0), Node);
};;

  tNodeArray.prototype['__destroy__'] = tNodeArray.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_tNodeArray___destroy___0(self);
};
// btSoftBody
/** @suppress {undefinedVars, duplicate} */function btSoftBody(arg0, arg1, arg2, arg3) {
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

btSoftBody.prototype['checkLink'] = btSoftBody.prototype.checkLink = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return !!(_emscripten_bind_btSoftBody_checkLink_2(self, arg0, arg1));
};;

btSoftBody.prototype['checkFace'] = btSoftBody.prototype.checkFace = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  return !!(_emscripten_bind_btSoftBody_checkFace_3(self, arg0, arg1, arg2));
};;

btSoftBody.prototype['appendMaterial'] = btSoftBody.prototype.appendMaterial = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_appendMaterial_0(self), Material);
};;

btSoftBody.prototype['appendNode'] = btSoftBody.prototype.appendNode = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftBody_appendNode_2(self, arg0, arg1);
};;

btSoftBody.prototype['appendLink'] = btSoftBody.prototype.appendLink = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  _emscripten_bind_btSoftBody_appendLink_4(self, arg0, arg1, arg2, arg3);
};;

btSoftBody.prototype['appendFace'] = btSoftBody.prototype.appendFace = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  _emscripten_bind_btSoftBody_appendFace_4(self, arg0, arg1, arg2, arg3);
};;

btSoftBody.prototype['appendTetra'] = btSoftBody.prototype.appendTetra = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btSoftBody_appendTetra_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btSoftBody.prototype['appendAnchor'] = btSoftBody.prototype.appendAnchor = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  _emscripten_bind_btSoftBody_appendAnchor_4(self, arg0, arg1, arg2, arg3);
};;

btSoftBody.prototype['addForce'] = btSoftBody.prototype.addForce = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { _emscripten_bind_btSoftBody_addForce_1(self, arg0);  return }
  _emscripten_bind_btSoftBody_addForce_2(self, arg0, arg1);
};;

btSoftBody.prototype['addAeroForceToNode'] = btSoftBody.prototype.addAeroForceToNode = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftBody_addAeroForceToNode_2(self, arg0, arg1);
};;

btSoftBody.prototype['getTotalMass'] = btSoftBody.prototype.getTotalMass = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getTotalMass_0(self);
};;

btSoftBody.prototype['setTotalMass'] = btSoftBody.prototype.setTotalMass = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftBody_setTotalMass_2(self, arg0, arg1);
};;

btSoftBody.prototype['setMass'] = btSoftBody.prototype.setMass = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftBody_setMass_2(self, arg0, arg1);
};;

btSoftBody.prototype['transform'] = btSoftBody.prototype.transform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_transform_1(self, arg0);
};;

btSoftBody.prototype['translate'] = btSoftBody.prototype.translate = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_translate_1(self, arg0);
};;

btSoftBody.prototype['rotate'] = btSoftBody.prototype.rotate = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_rotate_1(self, arg0);
};;

btSoftBody.prototype['scale'] = btSoftBody.prototype.scale = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_scale_1(self, arg0);
};;

btSoftBody.prototype['generateClusters'] = btSoftBody.prototype.generateClusters = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { return _emscripten_bind_btSoftBody_generateClusters_1(self, arg0) }
  return _emscripten_bind_btSoftBody_generateClusters_2(self, arg0, arg1);
};;

btSoftBody.prototype['generateBendingConstraints'] = btSoftBody.prototype.generateBendingConstraints = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return _emscripten_bind_btSoftBody_generateBendingConstraints_2(self, arg0, arg1);
};;

btSoftBody.prototype['upcast'] = btSoftBody.prototype.upcast = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_upcast_1(self, arg0), btSoftBody);
};;

btSoftBody.prototype['setAnisotropicFriction'] = btSoftBody.prototype.setAnisotropicFriction = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftBody_setAnisotropicFriction_2(self, arg0, arg1);
};;

btSoftBody.prototype['getCollisionShape'] = btSoftBody.prototype.getCollisionShape = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_getCollisionShape_0(self), btCollisionShape);
};;

btSoftBody.prototype['setContactProcessingThreshold'] = btSoftBody.prototype.setContactProcessingThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setContactProcessingThreshold_1(self, arg0);
};;

btSoftBody.prototype['setActivationState'] = btSoftBody.prototype.setActivationState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setActivationState_1(self, arg0);
};;

btSoftBody.prototype['forceActivationState'] = btSoftBody.prototype.forceActivationState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_forceActivationState_1(self, arg0);
};;

btSoftBody.prototype['activate'] = btSoftBody.prototype.activate = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { _emscripten_bind_btSoftBody_activate_0(self);  return }
  _emscripten_bind_btSoftBody_activate_1(self, arg0);
};;

btSoftBody.prototype['isActive'] = btSoftBody.prototype.isActive = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btSoftBody_isActive_0(self));
};;

btSoftBody.prototype['isKinematicObject'] = btSoftBody.prototype.isKinematicObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btSoftBody_isKinematicObject_0(self));
};;

btSoftBody.prototype['isStaticObject'] = btSoftBody.prototype.isStaticObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btSoftBody_isStaticObject_0(self));
};;

btSoftBody.prototype['isStaticOrKinematicObject'] = btSoftBody.prototype.isStaticOrKinematicObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btSoftBody_isStaticOrKinematicObject_0(self));
};;

btSoftBody.prototype['setRestitution'] = btSoftBody.prototype.setRestitution = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setRestitution_1(self, arg0);
};;

btSoftBody.prototype['setFriction'] = btSoftBody.prototype.setFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setFriction_1(self, arg0);
};;

btSoftBody.prototype['setRollingFriction'] = btSoftBody.prototype.setRollingFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setRollingFriction_1(self, arg0);
};;

btSoftBody.prototype['getWorldTransform'] = btSoftBody.prototype.getWorldTransform = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_getWorldTransform_0(self), btTransform);
};;

btSoftBody.prototype['getCollisionFlags'] = btSoftBody.prototype.getCollisionFlags = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getCollisionFlags_0(self);
};;

btSoftBody.prototype['setCollisionFlags'] = btSoftBody.prototype.setCollisionFlags = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setCollisionFlags_1(self, arg0);
};;

btSoftBody.prototype['setWorldTransform'] = btSoftBody.prototype.setWorldTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setWorldTransform_1(self, arg0);
};;

btSoftBody.prototype['setCollisionShape'] = btSoftBody.prototype.setCollisionShape = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setCollisionShape_1(self, arg0);
};;

btSoftBody.prototype['setCcdMotionThreshold'] = btSoftBody.prototype.setCcdMotionThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setCcdMotionThreshold_1(self, arg0);
};;

btSoftBody.prototype['setCcdSweptSphereRadius'] = btSoftBody.prototype.setCcdSweptSphereRadius = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1(self, arg0);
};;

btSoftBody.prototype['getUserIndex'] = btSoftBody.prototype.getUserIndex = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getUserIndex_0(self);
};;

btSoftBody.prototype['setUserIndex'] = btSoftBody.prototype.setUserIndex = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setUserIndex_1(self, arg0);
};;

btSoftBody.prototype['getUserPointer'] = btSoftBody.prototype.getUserPointer = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_getUserPointer_0(self), VoidPtr);
};;

btSoftBody.prototype['setUserPointer'] = btSoftBody.prototype.setUserPointer = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_setUserPointer_1(self, arg0);
};;

  btSoftBody.prototype['get_m_cfg'] = btSoftBody.prototype.get_m_cfg = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_cfg_0(self), Config);
};
    btSoftBody.prototype['set_m_cfg'] = btSoftBody.prototype.set_m_cfg = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_cfg_1(self, arg0);
};
  btSoftBody.prototype['get_m_nodes'] = btSoftBody.prototype.get_m_nodes = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_nodes_0(self), tNodeArray);
};
    btSoftBody.prototype['set_m_nodes'] = btSoftBody.prototype.set_m_nodes = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_nodes_1(self, arg0);
};
  btSoftBody.prototype['get_m_links'] = btSoftBody.prototype.get_m_links = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_links_0(self), tLinkArray);
};
    btSoftBody.prototype['set_m_links'] = btSoftBody.prototype.set_m_links = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_links_1(self, arg0);
};
  btSoftBody.prototype['get_m_faces'] = btSoftBody.prototype.get_m_faces = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_faces_0(self), tFaceArray);
};
    btSoftBody.prototype['set_m_faces'] = btSoftBody.prototype.set_m_faces = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_faces_1(self, arg0);
};
  btSoftBody.prototype['get_m_materials'] = btSoftBody.prototype.get_m_materials = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_materials_0(self), tMaterialArray);
};
    btSoftBody.prototype['set_m_materials'] = btSoftBody.prototype.set_m_materials = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_materials_1(self, arg0);
};
  btSoftBody.prototype['get_m_anchors'] = btSoftBody.prototype.get_m_anchors = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_anchors_0(self), tAnchorArray);
};
    btSoftBody.prototype['set_m_anchors'] = btSoftBody.prototype.set_m_anchors = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_anchors_1(self, arg0);
};
  btSoftBody.prototype['__destroy__'] = btSoftBody.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBody___destroy___0(self);
};
// btIntArray
function btIntArray() { throw "cannot construct a btIntArray, no constructor in IDL" }
btIntArray.prototype = Object.create(WrapperObject.prototype);
btIntArray.prototype.constructor = btIntArray;
btIntArray.prototype.__class__ = btIntArray;
btIntArray.__cache__ = {};
Module['btIntArray'] = btIntArray;

btIntArray.prototype['size'] = btIntArray.prototype.size = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btIntArray_size_0(self);
};;

btIntArray.prototype['at'] = btIntArray.prototype.at = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btIntArray_at_1(self, arg0);
};;

  btIntArray.prototype['__destroy__'] = btIntArray.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btIntArray___destroy___0(self);
};
// Config
function Config() { throw "cannot construct a Config, no constructor in IDL" }
Config.prototype = Object.create(WrapperObject.prototype);
Config.prototype.constructor = Config;
Config.prototype.__class__ = Config;
Config.__cache__ = {};
Module['Config'] = Config;

  Config.prototype['get_kVCF'] = Config.prototype.get_kVCF = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kVCF_0(self);
};
    Config.prototype['set_kVCF'] = Config.prototype.set_kVCF = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kVCF_1(self, arg0);
};
  Config.prototype['get_kDP'] = Config.prototype.get_kDP = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kDP_0(self);
};
    Config.prototype['set_kDP'] = Config.prototype.set_kDP = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kDP_1(self, arg0);
};
  Config.prototype['get_kDG'] = Config.prototype.get_kDG = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kDG_0(self);
};
    Config.prototype['set_kDG'] = Config.prototype.set_kDG = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kDG_1(self, arg0);
};
  Config.prototype['get_kLF'] = Config.prototype.get_kLF = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kLF_0(self);
};
    Config.prototype['set_kLF'] = Config.prototype.set_kLF = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kLF_1(self, arg0);
};
  Config.prototype['get_kPR'] = Config.prototype.get_kPR = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kPR_0(self);
};
    Config.prototype['set_kPR'] = Config.prototype.set_kPR = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kPR_1(self, arg0);
};
  Config.prototype['get_kVC'] = Config.prototype.get_kVC = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kVC_0(self);
};
    Config.prototype['set_kVC'] = Config.prototype.set_kVC = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kVC_1(self, arg0);
};
  Config.prototype['get_kDF'] = Config.prototype.get_kDF = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kDF_0(self);
};
    Config.prototype['set_kDF'] = Config.prototype.set_kDF = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kDF_1(self, arg0);
};
  Config.prototype['get_kMT'] = Config.prototype.get_kMT = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kMT_0(self);
};
    Config.prototype['set_kMT'] = Config.prototype.set_kMT = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kMT_1(self, arg0);
};
  Config.prototype['get_kCHR'] = Config.prototype.get_kCHR = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kCHR_0(self);
};
    Config.prototype['set_kCHR'] = Config.prototype.set_kCHR = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kCHR_1(self, arg0);
};
  Config.prototype['get_kKHR'] = Config.prototype.get_kKHR = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kKHR_0(self);
};
    Config.prototype['set_kKHR'] = Config.prototype.set_kKHR = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kKHR_1(self, arg0);
};
  Config.prototype['get_kSHR'] = Config.prototype.get_kSHR = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSHR_0(self);
};
    Config.prototype['set_kSHR'] = Config.prototype.set_kSHR = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSHR_1(self, arg0);
};
  Config.prototype['get_kAHR'] = Config.prototype.get_kAHR = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kAHR_0(self);
};
    Config.prototype['set_kAHR'] = Config.prototype.set_kAHR = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kAHR_1(self, arg0);
};
  Config.prototype['get_kSRHR_CL'] = Config.prototype.get_kSRHR_CL = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSRHR_CL_0(self);
};
    Config.prototype['set_kSRHR_CL'] = Config.prototype.set_kSRHR_CL = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSRHR_CL_1(self, arg0);
};
  Config.prototype['get_kSKHR_CL'] = Config.prototype.get_kSKHR_CL = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSKHR_CL_0(self);
};
    Config.prototype['set_kSKHR_CL'] = Config.prototype.set_kSKHR_CL = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSKHR_CL_1(self, arg0);
};
  Config.prototype['get_kSSHR_CL'] = Config.prototype.get_kSSHR_CL = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSSHR_CL_0(self);
};
    Config.prototype['set_kSSHR_CL'] = Config.prototype.set_kSSHR_CL = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSSHR_CL_1(self, arg0);
};
  Config.prototype['get_kSR_SPLT_CL'] = Config.prototype.get_kSR_SPLT_CL = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSR_SPLT_CL_0(self);
};
    Config.prototype['set_kSR_SPLT_CL'] = Config.prototype.set_kSR_SPLT_CL = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSR_SPLT_CL_1(self, arg0);
};
  Config.prototype['get_kSK_SPLT_CL'] = Config.prototype.get_kSK_SPLT_CL = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSK_SPLT_CL_0(self);
};
    Config.prototype['set_kSK_SPLT_CL'] = Config.prototype.set_kSK_SPLT_CL = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSK_SPLT_CL_1(self, arg0);
};
  Config.prototype['get_kSS_SPLT_CL'] = Config.prototype.get_kSS_SPLT_CL = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSS_SPLT_CL_0(self);
};
    Config.prototype['set_kSS_SPLT_CL'] = Config.prototype.set_kSS_SPLT_CL = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSS_SPLT_CL_1(self, arg0);
};
  Config.prototype['get_maxvolume'] = Config.prototype.get_maxvolume = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_maxvolume_0(self);
};
    Config.prototype['set_maxvolume'] = Config.prototype.set_maxvolume = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_maxvolume_1(self, arg0);
};
  Config.prototype['get_timescale'] = Config.prototype.get_timescale = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_timescale_0(self);
};
    Config.prototype['set_timescale'] = Config.prototype.set_timescale = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_timescale_1(self, arg0);
};
  Config.prototype['get_viterations'] = Config.prototype.get_viterations = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_viterations_0(self);
};
    Config.prototype['set_viterations'] = Config.prototype.set_viterations = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_viterations_1(self, arg0);
};
  Config.prototype['get_piterations'] = Config.prototype.get_piterations = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_piterations_0(self);
};
    Config.prototype['set_piterations'] = Config.prototype.set_piterations = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_piterations_1(self, arg0);
};
  Config.prototype['get_diterations'] = Config.prototype.get_diterations = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_diterations_0(self);
};
    Config.prototype['set_diterations'] = Config.prototype.set_diterations = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_diterations_1(self, arg0);
};
  Config.prototype['get_citerations'] = Config.prototype.get_citerations = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_citerations_0(self);
};
    Config.prototype['set_citerations'] = Config.prototype.set_citerations = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_citerations_1(self, arg0);
};
  Config.prototype['get_collisions'] = Config.prototype.get_collisions = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_collisions_0(self);
};
    Config.prototype['set_collisions'] = Config.prototype.set_collisions = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_collisions_1(self, arg0);
};
  Config.prototype['__destroy__'] = Config.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  Node.prototype['get_m_x'] = Node.prototype.get_m_x = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_x_0(self), btVector3);
};
    Node.prototype['set_m_x'] = Node.prototype.set_m_x = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_x_1(self, arg0);
};
  Node.prototype['get_m_q'] = Node.prototype.get_m_q = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_q_0(self), btVector3);
};
    Node.prototype['set_m_q'] = Node.prototype.set_m_q = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_q_1(self, arg0);
};
  Node.prototype['get_m_v'] = Node.prototype.get_m_v = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_v_0(self), btVector3);
};
    Node.prototype['set_m_v'] = Node.prototype.set_m_v = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_v_1(self, arg0);
};
  Node.prototype['get_m_f'] = Node.prototype.get_m_f = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_f_0(self), btVector3);
};
    Node.prototype['set_m_f'] = Node.prototype.set_m_f = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_f_1(self, arg0);
};
  Node.prototype['get_m_n'] = Node.prototype.get_m_n = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_n_0(self), btVector3);
};
    Node.prototype['set_m_n'] = Node.prototype.set_m_n = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_n_1(self, arg0);
};
  Node.prototype['get_m_im'] = Node.prototype.get_m_im = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Node_get_m_im_0(self);
};
    Node.prototype['set_m_im'] = Node.prototype.set_m_im = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_im_1(self, arg0);
};
  Node.prototype['get_m_area'] = Node.prototype.get_m_area = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_Node_get_m_area_0(self);
};
    Node.prototype['set_m_area'] = Node.prototype.set_m_area = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_area_1(self, arg0);
};
  Node.prototype['__destroy__'] = Node.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_Node___destroy___0(self);
};
// btGhostPairCallback
/** @suppress {undefinedVars, duplicate} */function btGhostPairCallback() {
  this.ptr = _emscripten_bind_btGhostPairCallback_btGhostPairCallback_0();
  getCache(btGhostPairCallback)[this.ptr] = this;
};;
btGhostPairCallback.prototype = Object.create(WrapperObject.prototype);
btGhostPairCallback.prototype.constructor = btGhostPairCallback;
btGhostPairCallback.prototype.__class__ = btGhostPairCallback;
btGhostPairCallback.__cache__ = {};
Module['btGhostPairCallback'] = btGhostPairCallback;

  btGhostPairCallback.prototype['__destroy__'] = btGhostPairCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  btOverlappingPairCallback.prototype['__destroy__'] = btOverlappingPairCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btOverlappingPairCallback___destroy___0(self);
};
// btKinematicCharacterController
/** @suppress {undefinedVars, duplicate} */function btKinematicCharacterController(arg0, arg1, arg2, arg3) {
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

btKinematicCharacterController.prototype['setUp'] = btKinematicCharacterController.prototype.setUp = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setUp_1(self, arg0);
};;

btKinematicCharacterController.prototype['setWalkDirection'] = btKinematicCharacterController.prototype.setWalkDirection = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setWalkDirection_1(self, arg0);
};;

btKinematicCharacterController.prototype['setVelocityForTimeInterval'] = btKinematicCharacterController.prototype.setVelocityForTimeInterval = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2(self, arg0, arg1);
};;

btKinematicCharacterController.prototype['warp'] = btKinematicCharacterController.prototype.warp = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_warp_1(self, arg0);
};;

btKinematicCharacterController.prototype['preStep'] = btKinematicCharacterController.prototype.preStep = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_preStep_1(self, arg0);
};;

btKinematicCharacterController.prototype['playerStep'] = btKinematicCharacterController.prototype.playerStep = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btKinematicCharacterController_playerStep_2(self, arg0, arg1);
};;

btKinematicCharacterController.prototype['setFallSpeed'] = btKinematicCharacterController.prototype.setFallSpeed = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setFallSpeed_1(self, arg0);
};;

btKinematicCharacterController.prototype['setJumpSpeed'] = btKinematicCharacterController.prototype.setJumpSpeed = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setJumpSpeed_1(self, arg0);
};;

btKinematicCharacterController.prototype['setMaxJumpHeight'] = btKinematicCharacterController.prototype.setMaxJumpHeight = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1(self, arg0);
};;

btKinematicCharacterController.prototype['canJump'] = btKinematicCharacterController.prototype.canJump = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btKinematicCharacterController_canJump_0(self));
};;

btKinematicCharacterController.prototype['jump'] = btKinematicCharacterController.prototype.jump = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btKinematicCharacterController_jump_0(self);
};;

btKinematicCharacterController.prototype['setGravity'] = btKinematicCharacterController.prototype.setGravity = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setGravity_1(self, arg0);
};;

btKinematicCharacterController.prototype['getGravity'] = btKinematicCharacterController.prototype.getGravity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btKinematicCharacterController_getGravity_0(self), btVector3);
};;

btKinematicCharacterController.prototype['setMaxSlope'] = btKinematicCharacterController.prototype.setMaxSlope = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setMaxSlope_1(self, arg0);
};;

btKinematicCharacterController.prototype['getMaxSlope'] = btKinematicCharacterController.prototype.getMaxSlope = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btKinematicCharacterController_getMaxSlope_0(self);
};;

btKinematicCharacterController.prototype['getGhostObject'] = btKinematicCharacterController.prototype.getGhostObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btKinematicCharacterController_getGhostObject_0(self), btPairCachingGhostObject);
};;

btKinematicCharacterController.prototype['setUseGhostSweepTest'] = btKinematicCharacterController.prototype.setUseGhostSweepTest = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1(self, arg0);
};;

btKinematicCharacterController.prototype['onGround'] = btKinematicCharacterController.prototype.onGround = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btKinematicCharacterController_onGround_0(self));
};;

btKinematicCharacterController.prototype['setUpInterpolate'] = btKinematicCharacterController.prototype.setUpInterpolate = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btKinematicCharacterController_setUpInterpolate_1(self, arg0);
};;

btKinematicCharacterController.prototype['updateAction'] = btKinematicCharacterController.prototype.updateAction = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btKinematicCharacterController_updateAction_2(self, arg0, arg1);
};;

  btKinematicCharacterController.prototype['__destroy__'] = btKinematicCharacterController.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btKinematicCharacterController___destroy___0(self);
};
// btSoftBodyArray
function btSoftBodyArray() { throw "cannot construct a btSoftBodyArray, no constructor in IDL" }
btSoftBodyArray.prototype = Object.create(WrapperObject.prototype);
btSoftBodyArray.prototype.constructor = btSoftBodyArray;
btSoftBodyArray.prototype.__class__ = btSoftBodyArray;
btSoftBodyArray.__cache__ = {};
Module['btSoftBodyArray'] = btSoftBodyArray;

btSoftBodyArray.prototype['size'] = btSoftBodyArray.prototype.size = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyArray_size_0(self);
};;

btSoftBodyArray.prototype['at'] = btSoftBodyArray.prototype.at = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyArray_at_1(self, arg0), btSoftBody);
};;

  btSoftBodyArray.prototype['__destroy__'] = btSoftBodyArray.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyArray___destroy___0(self);
};
// btFaceArray
function btFaceArray() { throw "cannot construct a btFaceArray, no constructor in IDL" }
btFaceArray.prototype = Object.create(WrapperObject.prototype);
btFaceArray.prototype.constructor = btFaceArray;
btFaceArray.prototype.__class__ = btFaceArray;
btFaceArray.__cache__ = {};
Module['btFaceArray'] = btFaceArray;

btFaceArray.prototype['size'] = btFaceArray.prototype.size = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btFaceArray_size_0(self);
};;

btFaceArray.prototype['at'] = btFaceArray.prototype.at = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btFaceArray_at_1(self, arg0), btFace);
};;

  btFaceArray.prototype['__destroy__'] = btFaceArray.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btFaceArray___destroy___0(self);
};
// btStaticPlaneShape
/** @suppress {undefinedVars, duplicate} */function btStaticPlaneShape(arg0, arg1) {
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

btStaticPlaneShape.prototype['setLocalScaling'] = btStaticPlaneShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btStaticPlaneShape_setLocalScaling_1(self, arg0);
};;

btStaticPlaneShape.prototype['getLocalScaling'] = btStaticPlaneShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btStaticPlaneShape_getLocalScaling_0(self), btVector3);
};;

btStaticPlaneShape.prototype['calculateLocalInertia'] = btStaticPlaneShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btStaticPlaneShape.prototype['__destroy__'] = btStaticPlaneShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btOverlappingPairCache.prototype['setInternalGhostPairCallback'] = btOverlappingPairCache.prototype.setInternalGhostPairCallback = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1(self, arg0);
};;

  btOverlappingPairCache.prototype['__destroy__'] = btOverlappingPairCache.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btOverlappingPairCache___destroy___0(self);
};
// btSoftRigidDynamicsWorld
/** @suppress {undefinedVars, duplicate} */function btSoftRigidDynamicsWorld(arg0, arg1, arg2, arg3, arg4) {
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

btSoftRigidDynamicsWorld.prototype['addSoftBody'] = btSoftRigidDynamicsWorld.prototype.addSoftBody = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['removeSoftBody'] = btSoftRigidDynamicsWorld.prototype.removeSoftBody = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['removeCollisionObject'] = btSoftRigidDynamicsWorld.prototype.removeCollisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['getWorldInfo'] = btSoftRigidDynamicsWorld.prototype.getWorldInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0(self), btSoftBodyWorldInfo);
};;

btSoftRigidDynamicsWorld.prototype['getSoftBodyArray'] = btSoftRigidDynamicsWorld.prototype.getSoftBodyArray = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0(self), btSoftBodyArray);
};;

btSoftRigidDynamicsWorld.prototype['getDispatcher'] = btSoftRigidDynamicsWorld.prototype.getDispatcher = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0(self), btDispatcher);
};;

btSoftRigidDynamicsWorld.prototype['rayTest'] = btSoftRigidDynamicsWorld.prototype.rayTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['getPairCache'] = btSoftRigidDynamicsWorld.prototype.getPairCache = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0(self), btOverlappingPairCache);
};;

btSoftRigidDynamicsWorld.prototype['getDispatchInfo'] = btSoftRigidDynamicsWorld.prototype.getDispatchInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0(self), btDispatcherInfo);
};;

btSoftRigidDynamicsWorld.prototype['addCollisionObject'] = btSoftRigidDynamicsWorld.prototype.addCollisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2(self, arg0, arg1);  return }
  _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['getBroadphase'] = btSoftRigidDynamicsWorld.prototype.getBroadphase = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0(self), btBroadphaseInterface);
};;

btSoftRigidDynamicsWorld.prototype['convexSweepTest'] = btSoftRigidDynamicsWorld.prototype.convexSweepTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5(self, arg0, arg1, arg2, arg3, arg4);
};;

btSoftRigidDynamicsWorld.prototype['contactPairTest'] = btSoftRigidDynamicsWorld.prototype.contactPairTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['contactTest'] = btSoftRigidDynamicsWorld.prototype.contactTest = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2(self, arg0, arg1);
};;

btSoftRigidDynamicsWorld.prototype['updateSingleAabb'] = btSoftRigidDynamicsWorld.prototype.updateSingleAabb = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['setDebugDrawer'] = btSoftRigidDynamicsWorld.prototype.setDebugDrawer = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['getDebugDrawer'] = btSoftRigidDynamicsWorld.prototype.getDebugDrawer = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0(self), btIDebugDraw);
};;

btSoftRigidDynamicsWorld.prototype['debugDrawWorld'] = btSoftRigidDynamicsWorld.prototype.debugDrawWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0(self);
};;

btSoftRigidDynamicsWorld.prototype['debugDrawObject'] = btSoftRigidDynamicsWorld.prototype.debugDrawObject = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['setGravity'] = btSoftRigidDynamicsWorld.prototype.setGravity = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['getGravity'] = btSoftRigidDynamicsWorld.prototype.getGravity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0(self), btVector3);
};;

btSoftRigidDynamicsWorld.prototype['addRigidBody'] = btSoftRigidDynamicsWorld.prototype.addRigidBody = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1(self, arg0);  return }
  if (arg2 === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_2(self, arg0, arg1);  return }
  _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['removeRigidBody'] = btSoftRigidDynamicsWorld.prototype.removeRigidBody = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['addVehicle'] = btSoftRigidDynamicsWorld.prototype.addVehicle = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_addVehicle_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['removeVehicle'] = btSoftRigidDynamicsWorld.prototype.removeVehicle = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeVehicle_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['addConstraint'] = btSoftRigidDynamicsWorld.prototype.addConstraint = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg1 === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1(self, arg0);  return }
  _emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2(self, arg0, arg1);
};;

btSoftRigidDynamicsWorld.prototype['removeConstraint'] = btSoftRigidDynamicsWorld.prototype.removeConstraint = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['stepSimulation'] = btSoftRigidDynamicsWorld.prototype.stepSimulation = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg1 === undefined) { return _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1(self, arg0) }
  if (arg2 === undefined) { return _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2(self, arg0, arg1) }
  return _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3(self, arg0, arg1, arg2);
};;

btSoftRigidDynamicsWorld.prototype['addAction'] = btSoftRigidDynamicsWorld.prototype.addAction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_addAction_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['removeAction'] = btSoftRigidDynamicsWorld.prototype.removeAction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1(self, arg0);
};;

btSoftRigidDynamicsWorld.prototype['getSolverInfo'] = btSoftRigidDynamicsWorld.prototype.getSolverInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0(self), btContactSolverInfo);
};;

  btSoftRigidDynamicsWorld.prototype['__destroy__'] = btSoftRigidDynamicsWorld.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld___destroy___0(self);
};
// btFixedConstraint
/** @suppress {undefinedVars, duplicate} */function btFixedConstraint(arg0, arg1, arg2, arg3) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  this.ptr = _emscripten_bind_btFixedConstraint_btFixedConstraint_4(arg0, arg1, arg2, arg3);
  getCache(btFixedConstraint)[this.ptr] = this;
};;
btFixedConstraint.prototype = Object.create(btTypedConstraint.prototype);
btFixedConstraint.prototype.constructor = btFixedConstraint;
btFixedConstraint.prototype.__class__ = btFixedConstraint;
btFixedConstraint.__cache__ = {};
Module['btFixedConstraint'] = btFixedConstraint;

btFixedConstraint.prototype['enableFeedback'] = btFixedConstraint.prototype.enableFeedback = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btFixedConstraint_enableFeedback_1(self, arg0);
};;

btFixedConstraint.prototype['getBreakingImpulseThreshold'] = btFixedConstraint.prototype.getBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0(self);
};;

btFixedConstraint.prototype['setBreakingImpulseThreshold'] = btFixedConstraint.prototype.setBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

btFixedConstraint.prototype['getParam'] = btFixedConstraint.prototype.getParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return _emscripten_bind_btFixedConstraint_getParam_2(self, arg0, arg1);
};;

btFixedConstraint.prototype['setParam'] = btFixedConstraint.prototype.setParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btFixedConstraint_setParam_3(self, arg0, arg1, arg2);
};;

  btFixedConstraint.prototype['__destroy__'] = btFixedConstraint.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btFixedConstraint___destroy___0(self);
};
// btTransform
/** @suppress {undefinedVars, duplicate} */function btTransform(arg0, arg1) {
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

btTransform.prototype['setIdentity'] = btTransform.prototype.setIdentity = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btTransform_setIdentity_0(self);
};;

btTransform.prototype['setOrigin'] = btTransform.prototype.setOrigin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btTransform_setOrigin_1(self, arg0);
};;

btTransform.prototype['setRotation'] = btTransform.prototype.setRotation = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btTransform_setRotation_1(self, arg0);
};;

btTransform.prototype['getOrigin'] = btTransform.prototype.getOrigin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_getOrigin_0(self), btVector3);
};;

btTransform.prototype['getRotation'] = btTransform.prototype.getRotation = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_getRotation_0(self), btQuaternion);
};;

btTransform.prototype['getBasis'] = btTransform.prototype.getBasis = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_getBasis_0(self), btMatrix3x3);
};;

btTransform.prototype['setFromOpenGLMatrix'] = btTransform.prototype.setFromOpenGLMatrix = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof arg0 == 'object') { arg0 = ensureFloat32(arg0); }
  _emscripten_bind_btTransform_setFromOpenGLMatrix_1(self, arg0);
};;

btTransform.prototype['inverse'] = btTransform.prototype.inverse = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_inverse_0(self), btTransform);
};;

btTransform.prototype['op_mul'] = btTransform.prototype.op_mul = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btTransform_op_mul_1(self, arg0), btTransform);
};;

  btTransform.prototype['__destroy__'] = btTransform.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btTransform___destroy___0(self);
};
// ClosestRayResultCallback
/** @suppress {undefinedVars, duplicate} */function ClosestRayResultCallback(arg0, arg1) {
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

ClosestRayResultCallback.prototype['hasHit'] = ClosestRayResultCallback.prototype.hasHit = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ClosestRayResultCallback_hasHit_0(self));
};;

  ClosestRayResultCallback.prototype['get_m_rayFromWorld'] = ClosestRayResultCallback.prototype.get_m_rayFromWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0(self), btVector3);
};
    ClosestRayResultCallback.prototype['set_m_rayFromWorld'] = ClosestRayResultCallback.prototype.set_m_rayFromWorld = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_rayToWorld'] = ClosestRayResultCallback.prototype.get_m_rayToWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0(self), btVector3);
};
    ClosestRayResultCallback.prototype['set_m_rayToWorld'] = ClosestRayResultCallback.prototype.set_m_rayToWorld = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_hitNormalWorld'] = ClosestRayResultCallback.prototype.get_m_hitNormalWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0(self), btVector3);
};
    ClosestRayResultCallback.prototype['set_m_hitNormalWorld'] = ClosestRayResultCallback.prototype.set_m_hitNormalWorld = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_hitPointWorld'] = ClosestRayResultCallback.prototype.get_m_hitPointWorld = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0(self), btVector3);
};
    ClosestRayResultCallback.prototype['set_m_hitPointWorld'] = ClosestRayResultCallback.prototype.set_m_hitPointWorld = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_collisionFilterGroup'] = ClosestRayResultCallback.prototype.get_m_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0(self);
};
    ClosestRayResultCallback.prototype['set_m_collisionFilterGroup'] = ClosestRayResultCallback.prototype.set_m_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_collisionFilterMask'] = ClosestRayResultCallback.prototype.get_m_collisionFilterMask = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0(self);
};
    ClosestRayResultCallback.prototype['set_m_collisionFilterMask'] = ClosestRayResultCallback.prototype.set_m_collisionFilterMask = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_closestHitFraction'] = ClosestRayResultCallback.prototype.get_m_closestHitFraction = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0(self);
};
    ClosestRayResultCallback.prototype['set_m_closestHitFraction'] = ClosestRayResultCallback.prototype.set_m_closestHitFraction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1(self, arg0);
};
  ClosestRayResultCallback.prototype['get_m_collisionObject'] = ClosestRayResultCallback.prototype.get_m_collisionObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0(self), btCollisionObject);
};
    ClosestRayResultCallback.prototype['set_m_collisionObject'] = ClosestRayResultCallback.prototype.set_m_collisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1(self, arg0);
};
  ClosestRayResultCallback.prototype['__destroy__'] = ClosestRayResultCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_ClosestRayResultCallback___destroy___0(self);
};
// btSoftBodyRigidBodyCollisionConfiguration
/** @suppress {undefinedVars, duplicate} */function btSoftBodyRigidBodyCollisionConfiguration(arg0) {
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

  btSoftBodyRigidBodyCollisionConfiguration.prototype['__destroy__'] = btSoftBodyRigidBodyCollisionConfiguration.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0(self);
};
// ConcreteContactResultCallback
/** @suppress {undefinedVars, duplicate} */function ConcreteContactResultCallback() {
  this.ptr = _emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0();
  getCache(ConcreteContactResultCallback)[this.ptr] = this;
};;
ConcreteContactResultCallback.prototype = Object.create(ContactResultCallback.prototype);
ConcreteContactResultCallback.prototype.constructor = ConcreteContactResultCallback;
ConcreteContactResultCallback.prototype.__class__ = ConcreteContactResultCallback;
ConcreteContactResultCallback.__cache__ = {};
Module['ConcreteContactResultCallback'] = ConcreteContactResultCallback;

ConcreteContactResultCallback.prototype['addSingleResult'] = ConcreteContactResultCallback.prototype.addSingleResult = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
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

  ConcreteContactResultCallback.prototype['__destroy__'] = ConcreteContactResultCallback.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_ConcreteContactResultCallback___destroy___0(self);
};
// btBvhTriangleMeshShape
/** @suppress {undefinedVars, duplicate} */function btBvhTriangleMeshShape(arg0, arg1, arg2) {
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

btBvhTriangleMeshShape.prototype['setLocalScaling'] = btBvhTriangleMeshShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1(self, arg0);
};;

btBvhTriangleMeshShape.prototype['getLocalScaling'] = btBvhTriangleMeshShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0(self), btVector3);
};;

btBvhTriangleMeshShape.prototype['calculateLocalInertia'] = btBvhTriangleMeshShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btBvhTriangleMeshShape.prototype['__destroy__'] = btBvhTriangleMeshShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btBvhTriangleMeshShape___destroy___0(self);
};
// btSliderConstraint
/** @suppress {undefinedVars, duplicate} */function btSliderConstraint(arg0, arg1, arg2, arg3, arg4) {
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

btSliderConstraint.prototype['setLowerLinLimit'] = btSliderConstraint.prototype.setLowerLinLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_setLowerLinLimit_1(self, arg0);
};;

btSliderConstraint.prototype['setUpperLinLimit'] = btSliderConstraint.prototype.setUpperLinLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_setUpperLinLimit_1(self, arg0);
};;

btSliderConstraint.prototype['setLowerAngLimit'] = btSliderConstraint.prototype.setLowerAngLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_setLowerAngLimit_1(self, arg0);
};;

btSliderConstraint.prototype['setUpperAngLimit'] = btSliderConstraint.prototype.setUpperAngLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_setUpperAngLimit_1(self, arg0);
};;

btSliderConstraint.prototype['enableFeedback'] = btSliderConstraint.prototype.enableFeedback = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_enableFeedback_1(self, arg0);
};;

btSliderConstraint.prototype['getBreakingImpulseThreshold'] = btSliderConstraint.prototype.getBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0(self);
};;

btSliderConstraint.prototype['setBreakingImpulseThreshold'] = btSliderConstraint.prototype.setBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

btSliderConstraint.prototype['getParam'] = btSliderConstraint.prototype.getParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return _emscripten_bind_btSliderConstraint_getParam_2(self, arg0, arg1);
};;

btSliderConstraint.prototype['setParam'] = btSliderConstraint.prototype.setParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btSliderConstraint_setParam_3(self, arg0, arg1, arg2);
};;

  btSliderConstraint.prototype['__destroy__'] = btSliderConstraint.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btSliderConstraint___destroy___0(self);
};
// btPairCachingGhostObject
/** @suppress {undefinedVars, duplicate} */function btPairCachingGhostObject() {
  this.ptr = _emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0();
  getCache(btPairCachingGhostObject)[this.ptr] = this;
};;
btPairCachingGhostObject.prototype = Object.create(btGhostObject.prototype);
btPairCachingGhostObject.prototype.constructor = btPairCachingGhostObject;
btPairCachingGhostObject.prototype.__class__ = btPairCachingGhostObject;
btPairCachingGhostObject.__cache__ = {};
Module['btPairCachingGhostObject'] = btPairCachingGhostObject;

btPairCachingGhostObject.prototype['setAnisotropicFriction'] = btPairCachingGhostObject.prototype.setAnisotropicFriction = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2(self, arg0, arg1);
};;

btPairCachingGhostObject.prototype['getCollisionShape'] = btPairCachingGhostObject.prototype.getCollisionShape = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getCollisionShape_0(self), btCollisionShape);
};;

btPairCachingGhostObject.prototype['setContactProcessingThreshold'] = btPairCachingGhostObject.prototype.setContactProcessingThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setActivationState'] = btPairCachingGhostObject.prototype.setActivationState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setActivationState_1(self, arg0);
};;

btPairCachingGhostObject.prototype['forceActivationState'] = btPairCachingGhostObject.prototype.forceActivationState = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_forceActivationState_1(self, arg0);
};;

btPairCachingGhostObject.prototype['activate'] = btPairCachingGhostObject.prototype.activate = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg0 === undefined) { _emscripten_bind_btPairCachingGhostObject_activate_0(self);  return }
  _emscripten_bind_btPairCachingGhostObject_activate_1(self, arg0);
};;

btPairCachingGhostObject.prototype['isActive'] = btPairCachingGhostObject.prototype.isActive = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPairCachingGhostObject_isActive_0(self));
};;

btPairCachingGhostObject.prototype['isKinematicObject'] = btPairCachingGhostObject.prototype.isKinematicObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPairCachingGhostObject_isKinematicObject_0(self));
};;

btPairCachingGhostObject.prototype['isStaticObject'] = btPairCachingGhostObject.prototype.isStaticObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPairCachingGhostObject_isStaticObject_0(self));
};;

btPairCachingGhostObject.prototype['isStaticOrKinematicObject'] = btPairCachingGhostObject.prototype.isStaticOrKinematicObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0(self));
};;

btPairCachingGhostObject.prototype['setRestitution'] = btPairCachingGhostObject.prototype.setRestitution = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setRestitution_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setFriction'] = btPairCachingGhostObject.prototype.setFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setFriction_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setRollingFriction'] = btPairCachingGhostObject.prototype.setRollingFriction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setRollingFriction_1(self, arg0);
};;

btPairCachingGhostObject.prototype['getWorldTransform'] = btPairCachingGhostObject.prototype.getWorldTransform = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getWorldTransform_0(self), btTransform);
};;

btPairCachingGhostObject.prototype['getCollisionFlags'] = btPairCachingGhostObject.prototype.getCollisionFlags = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0(self);
};;

btPairCachingGhostObject.prototype['setCollisionFlags'] = btPairCachingGhostObject.prototype.setCollisionFlags = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setWorldTransform'] = btPairCachingGhostObject.prototype.setWorldTransform = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setWorldTransform_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setCollisionShape'] = btPairCachingGhostObject.prototype.setCollisionShape = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCollisionShape_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setCcdMotionThreshold'] = btPairCachingGhostObject.prototype.setCcdMotionThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1(self, arg0);
};;

btPairCachingGhostObject.prototype['setCcdSweptSphereRadius'] = btPairCachingGhostObject.prototype.setCcdSweptSphereRadius = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1(self, arg0);
};;

btPairCachingGhostObject.prototype['getUserIndex'] = btPairCachingGhostObject.prototype.getUserIndex = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getUserIndex_0(self);
};;

btPairCachingGhostObject.prototype['setUserIndex'] = btPairCachingGhostObject.prototype.setUserIndex = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setUserIndex_1(self, arg0);
};;

btPairCachingGhostObject.prototype['getUserPointer'] = btPairCachingGhostObject.prototype.getUserPointer = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getUserPointer_0(self), VoidPtr);
};;

btPairCachingGhostObject.prototype['setUserPointer'] = btPairCachingGhostObject.prototype.setUserPointer = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPairCachingGhostObject_setUserPointer_1(self, arg0);
};;

btPairCachingGhostObject.prototype['getNumOverlappingObjects'] = btPairCachingGhostObject.prototype.getNumOverlappingObjects = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0(self);
};;

btPairCachingGhostObject.prototype['getOverlappingObject'] = btPairCachingGhostObject.prototype.getOverlappingObject = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1(self, arg0), btCollisionObject);
};;

  btPairCachingGhostObject.prototype['__destroy__'] = btPairCachingGhostObject.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

btManifoldPoint.prototype['getPositionWorldOnA'] = btManifoldPoint.prototype.getPositionWorldOnA = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_getPositionWorldOnA_0(self), btVector3);
};;

btManifoldPoint.prototype['getPositionWorldOnB'] = btManifoldPoint.prototype.getPositionWorldOnB = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_getPositionWorldOnB_0(self), btVector3);
};;

btManifoldPoint.prototype['getAppliedImpulse'] = btManifoldPoint.prototype.getAppliedImpulse = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btManifoldPoint_getAppliedImpulse_0(self);
};;

btManifoldPoint.prototype['getDistance'] = btManifoldPoint.prototype.getDistance = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btManifoldPoint_getDistance_0(self);
};;

  btManifoldPoint.prototype['get_m_localPointA'] = btManifoldPoint.prototype.get_m_localPointA = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_localPointA_0(self), btVector3);
};
    btManifoldPoint.prototype['set_m_localPointA'] = btManifoldPoint.prototype.set_m_localPointA = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_localPointA_1(self, arg0);
};
  btManifoldPoint.prototype['get_m_localPointB'] = btManifoldPoint.prototype.get_m_localPointB = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_localPointB_0(self), btVector3);
};
    btManifoldPoint.prototype['set_m_localPointB'] = btManifoldPoint.prototype.set_m_localPointB = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_localPointB_1(self, arg0);
};
  btManifoldPoint.prototype['get_m_positionWorldOnB'] = btManifoldPoint.prototype.get_m_positionWorldOnB = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0(self), btVector3);
};
    btManifoldPoint.prototype['set_m_positionWorldOnB'] = btManifoldPoint.prototype.set_m_positionWorldOnB = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1(self, arg0);
};
  btManifoldPoint.prototype['get_m_positionWorldOnA'] = btManifoldPoint.prototype.get_m_positionWorldOnA = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0(self), btVector3);
};
    btManifoldPoint.prototype['set_m_positionWorldOnA'] = btManifoldPoint.prototype.set_m_positionWorldOnA = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1(self, arg0);
};
  btManifoldPoint.prototype['get_m_normalWorldOnB'] = btManifoldPoint.prototype.get_m_normalWorldOnB = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0(self), btVector3);
};
    btManifoldPoint.prototype['set_m_normalWorldOnB'] = btManifoldPoint.prototype.set_m_normalWorldOnB = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1(self, arg0);
};
  btManifoldPoint.prototype['__destroy__'] = btManifoldPoint.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btManifoldPoint___destroy___0(self);
};
// btPoint2PointConstraint
/** @suppress {undefinedVars, duplicate} */function btPoint2PointConstraint(arg0, arg1, arg2, arg3) {
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

btPoint2PointConstraint.prototype['setPivotA'] = btPoint2PointConstraint.prototype.setPivotA = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_setPivotA_1(self, arg0);
};;

btPoint2PointConstraint.prototype['setPivotB'] = btPoint2PointConstraint.prototype.setPivotB = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_setPivotB_1(self, arg0);
};;

btPoint2PointConstraint.prototype['getPivotInA'] = btPoint2PointConstraint.prototype.getPivotInA = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPoint2PointConstraint_getPivotInA_0(self), btVector3);
};;

btPoint2PointConstraint.prototype['getPivotInB'] = btPoint2PointConstraint.prototype.getPivotInB = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPoint2PointConstraint_getPivotInB_0(self), btVector3);
};;

btPoint2PointConstraint.prototype['enableFeedback'] = btPoint2PointConstraint.prototype.enableFeedback = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_enableFeedback_1(self, arg0);
};;

btPoint2PointConstraint.prototype['getBreakingImpulseThreshold'] = btPoint2PointConstraint.prototype.getBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0(self);
};;

btPoint2PointConstraint.prototype['setBreakingImpulseThreshold'] = btPoint2PointConstraint.prototype.setBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

btPoint2PointConstraint.prototype['getParam'] = btPoint2PointConstraint.prototype.getParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return _emscripten_bind_btPoint2PointConstraint_getParam_2(self, arg0, arg1);
};;

btPoint2PointConstraint.prototype['setParam'] = btPoint2PointConstraint.prototype.setParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btPoint2PointConstraint_setParam_3(self, arg0, arg1, arg2);
};;

  btPoint2PointConstraint.prototype['get_m_setting'] = btPoint2PointConstraint.prototype.get_m_setting = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPoint2PointConstraint_get_m_setting_0(self), btConstraintSetting);
};
    btPoint2PointConstraint.prototype['set_m_setting'] = btPoint2PointConstraint.prototype.set_m_setting = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_set_m_setting_1(self, arg0);
};
  btPoint2PointConstraint.prototype['__destroy__'] = btPoint2PointConstraint.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btPoint2PointConstraint___destroy___0(self);
};
// btSoftBodyHelpers
/** @suppress {undefinedVars, duplicate} */function btSoftBodyHelpers() {
  this.ptr = _emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0();
  getCache(btSoftBodyHelpers)[this.ptr] = this;
};;
btSoftBodyHelpers.prototype = Object.create(WrapperObject.prototype);
btSoftBodyHelpers.prototype.constructor = btSoftBodyHelpers;
btSoftBodyHelpers.prototype.__class__ = btSoftBodyHelpers;
btSoftBodyHelpers.__cache__ = {};
Module['btSoftBodyHelpers'] = btSoftBodyHelpers;

btSoftBodyHelpers.prototype['CreateRope'] = btSoftBodyHelpers.prototype.CreateRope = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateRope_5(self, arg0, arg1, arg2, arg3, arg4), btSoftBody);
};;

btSoftBodyHelpers.prototype['CreatePatch'] = btSoftBodyHelpers.prototype.CreatePatch = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
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

btSoftBodyHelpers.prototype['CreatePatchUV'] = btSoftBodyHelpers.prototype.CreatePatchUV = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
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

btSoftBodyHelpers.prototype['CreateEllipsoid'] = btSoftBodyHelpers.prototype.CreateEllipsoid = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4(self, arg0, arg1, arg2, arg3), btSoftBody);
};;

btSoftBodyHelpers.prototype['CreateFromTriMesh'] = btSoftBodyHelpers.prototype.CreateFromTriMesh = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (typeof arg1 == 'object') { arg1 = ensureFloat32(arg1); }
  if (typeof arg2 == 'object') { arg2 = ensureInt32(arg2); }
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5(self, arg0, arg1, arg2, arg3, arg4), btSoftBody);
};;

btSoftBodyHelpers.prototype['CreateFromConvexHull'] = btSoftBodyHelpers.prototype.CreateFromConvexHull = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4(self, arg0, arg1, arg2, arg3), btSoftBody);
};;

  btSoftBodyHelpers.prototype['__destroy__'] = btSoftBodyHelpers.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};
// btBroadphaseProxy
function btBroadphaseProxy() { throw "cannot construct a btBroadphaseProxy, no constructor in IDL" }
btBroadphaseProxy.prototype = Object.create(WrapperObject.prototype);
btBroadphaseProxy.prototype.constructor = btBroadphaseProxy;
btBroadphaseProxy.prototype.__class__ = btBroadphaseProxy;
btBroadphaseProxy.__cache__ = {};
Module['btBroadphaseProxy'] = btBroadphaseProxy;

  btBroadphaseProxy.prototype['get_m_collisionFilterGroup'] = btBroadphaseProxy.prototype.get_m_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0(self);
};
    btBroadphaseProxy.prototype['set_m_collisionFilterGroup'] = btBroadphaseProxy.prototype.set_m_collisionFilterGroup = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1(self, arg0);
};
  btBroadphaseProxy.prototype['get_m_collisionFilterMask'] = btBroadphaseProxy.prototype.get_m_collisionFilterMask = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0(self);
};
    btBroadphaseProxy.prototype['set_m_collisionFilterMask'] = btBroadphaseProxy.prototype.set_m_collisionFilterMask = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1(self, arg0);
};
  btBroadphaseProxy.prototype['__destroy__'] = btBroadphaseProxy.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btBroadphaseProxy___destroy___0(self);
};
// btBoxShape
/** @suppress {undefinedVars, duplicate} */function btBoxShape(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btBoxShape_btBoxShape_1(arg0);
  getCache(btBoxShape)[this.ptr] = this;
};;
btBoxShape.prototype = Object.create(btCollisionShape.prototype);
btBoxShape.prototype.constructor = btBoxShape;
btBoxShape.prototype.__class__ = btBoxShape;
btBoxShape.__cache__ = {};
Module['btBoxShape'] = btBoxShape;

btBoxShape.prototype['setMargin'] = btBoxShape.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btBoxShape_setMargin_1(self, arg0);
};;

btBoxShape.prototype['getMargin'] = btBoxShape.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btBoxShape_getMargin_0(self);
};;

btBoxShape.prototype['setLocalScaling'] = btBoxShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btBoxShape_setLocalScaling_1(self, arg0);
};;

btBoxShape.prototype['getLocalScaling'] = btBoxShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btBoxShape_getLocalScaling_0(self), btVector3);
};;

btBoxShape.prototype['calculateLocalInertia'] = btBoxShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btBoxShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btBoxShape.prototype['__destroy__'] = btBoxShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btBoxShape___destroy___0(self);
};
// btFace
function btFace() { throw "cannot construct a btFace, no constructor in IDL" }
btFace.prototype = Object.create(WrapperObject.prototype);
btFace.prototype.constructor = btFace;
btFace.prototype.__class__ = btFace;
btFace.__cache__ = {};
Module['btFace'] = btFace;

  btFace.prototype['get_m_indices'] = btFace.prototype.get_m_indices = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btFace_get_m_indices_0(self), btIntArray);
};
    btFace.prototype['set_m_indices'] = btFace.prototype.set_m_indices = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btFace_set_m_indices_1(self, arg0);
};
  btFace.prototype['get_m_plane'] = btFace.prototype.get_m_plane = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btFace_get_m_plane_1(self, arg0);
};
    btFace.prototype['set_m_plane'] = btFace.prototype.set_m_plane = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btFace_set_m_plane_2(self, arg0, arg1);
};
  btFace.prototype['__destroy__'] = btFace.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btFace___destroy___0(self);
};
// DebugDrawer
function DebugDrawer() { throw "cannot construct a DebugDrawer, no constructor in IDL" }
DebugDrawer.prototype = Object.create(btIDebugDraw.prototype);
DebugDrawer.prototype.constructor = DebugDrawer;
DebugDrawer.prototype.__class__ = DebugDrawer;
DebugDrawer.__cache__ = {};
Module['DebugDrawer'] = DebugDrawer;

DebugDrawer.prototype['drawLine'] = DebugDrawer.prototype.drawLine = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_DebugDrawer_drawLine_3(self, arg0, arg1, arg2);
};;

DebugDrawer.prototype['drawContactPoint'] = DebugDrawer.prototype.drawContactPoint = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3, arg4) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  if (arg4 && typeof arg4 === 'object') arg4 = arg4.ptr;
  _emscripten_bind_DebugDrawer_drawContactPoint_5(self, arg0, arg1, arg2, arg3, arg4);
};;

DebugDrawer.prototype['reportErrorWarning'] = DebugDrawer.prototype.reportErrorWarning = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  else arg0 = ensureString(arg0);
  _emscripten_bind_DebugDrawer_reportErrorWarning_1(self, arg0);
};;

DebugDrawer.prototype['draw3dText'] = DebugDrawer.prototype.draw3dText = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  else arg1 = ensureString(arg1);
  _emscripten_bind_DebugDrawer_draw3dText_2(self, arg0, arg1);
};;

DebugDrawer.prototype['setDebugMode'] = DebugDrawer.prototype.setDebugMode = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_DebugDrawer_setDebugMode_1(self, arg0);
};;

DebugDrawer.prototype['getDebugMode'] = DebugDrawer.prototype.getDebugMode = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_DebugDrawer_getDebugMode_0(self);
};;

  DebugDrawer.prototype['__destroy__'] = DebugDrawer.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_DebugDrawer___destroy___0(self);
};
// btCapsuleShapeX
/** @suppress {undefinedVars, duplicate} */function btCapsuleShapeX(arg0, arg1) {
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

btCapsuleShapeX.prototype['setMargin'] = btCapsuleShapeX.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShapeX_setMargin_1(self, arg0);
};;

btCapsuleShapeX.prototype['getMargin'] = btCapsuleShapeX.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeX_getMargin_0(self);
};;

btCapsuleShapeX.prototype['getUpAxis'] = btCapsuleShapeX.prototype.getUpAxis = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeX_getUpAxis_0(self);
};;

btCapsuleShapeX.prototype['getRadius'] = btCapsuleShapeX.prototype.getRadius = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeX_getRadius_0(self);
};;

btCapsuleShapeX.prototype['getHalfHeight'] = btCapsuleShapeX.prototype.getHalfHeight = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeX_getHalfHeight_0(self);
};;

btCapsuleShapeX.prototype['setLocalScaling'] = btCapsuleShapeX.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShapeX_setLocalScaling_1(self, arg0);
};;

btCapsuleShapeX.prototype['getLocalScaling'] = btCapsuleShapeX.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCapsuleShapeX_getLocalScaling_0(self), btVector3);
};;

btCapsuleShapeX.prototype['calculateLocalInertia'] = btCapsuleShapeX.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCapsuleShapeX.prototype['__destroy__'] = btCapsuleShapeX.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btCapsuleShapeX___destroy___0(self);
};
// btQuaternion
/** @suppress {undefinedVars, duplicate} */function btQuaternion(arg0, arg1, arg2, arg3) {
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

btQuaternion.prototype['setValue'] = btQuaternion.prototype.setValue = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2, arg3) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  if (arg3 && typeof arg3 === 'object') arg3 = arg3.ptr;
  _emscripten_bind_btQuaternion_setValue_4(self, arg0, arg1, arg2, arg3);
};;

btQuaternion.prototype['setEulerZYX'] = btQuaternion.prototype.setEulerZYX = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btQuaternion_setEulerZYX_3(self, arg0, arg1, arg2);
};;

btQuaternion.prototype['setRotation'] = btQuaternion.prototype.setRotation = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btQuaternion_setRotation_2(self, arg0, arg1);
};;

btQuaternion.prototype['setEuler'] = btQuaternion.prototype.setEuler = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btQuaternion_setEuler_3(self, arg0, arg1, arg2);
};;

btQuaternion.prototype['normalize'] = btQuaternion.prototype.normalize = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btQuaternion_normalize_0(self);
};;

btQuaternion.prototype['length2'] = btQuaternion.prototype.length2 = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_length2_0(self);
};;

btQuaternion.prototype['length'] = btQuaternion.prototype.length = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_length_0(self);
};;

btQuaternion.prototype['dot'] = btQuaternion.prototype.dot = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btQuaternion_dot_1(self, arg0);
};;

btQuaternion.prototype['normalized'] = btQuaternion.prototype.normalized = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_normalized_0(self), btQuaternion);
};;

btQuaternion.prototype['getAxis'] = btQuaternion.prototype.getAxis = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_getAxis_0(self), btVector3);
};;

btQuaternion.prototype['inverse'] = btQuaternion.prototype.inverse = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_inverse_0(self), btQuaternion);
};;

btQuaternion.prototype['getAngle'] = btQuaternion.prototype.getAngle = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_getAngle_0(self);
};;

btQuaternion.prototype['getAngleShortestPath'] = btQuaternion.prototype.getAngleShortestPath = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_getAngleShortestPath_0(self);
};;

btQuaternion.prototype['angle'] = btQuaternion.prototype.angle = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btQuaternion_angle_1(self, arg0);
};;

btQuaternion.prototype['angleShortestPath'] = btQuaternion.prototype.angleShortestPath = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btQuaternion_angleShortestPath_1(self, arg0);
};;

btQuaternion.prototype['op_add'] = btQuaternion.prototype.op_add = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_op_add_1(self, arg0), btQuaternion);
};;

btQuaternion.prototype['op_sub'] = btQuaternion.prototype.op_sub = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_op_sub_1(self, arg0), btQuaternion);
};;

btQuaternion.prototype['op_mul'] = btQuaternion.prototype.op_mul = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_op_mul_1(self, arg0), btQuaternion);
};;

btQuaternion.prototype['op_mulq'] = btQuaternion.prototype.op_mulq = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_op_mulq_1(self, arg0), btQuaternion);
};;

btQuaternion.prototype['op_div'] = btQuaternion.prototype.op_div = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_op_div_1(self, arg0), btQuaternion);
};;

btQuaternion.prototype['x'] = btQuaternion.prototype.x = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_x_0(self);
};;

btQuaternion.prototype['y'] = btQuaternion.prototype.y = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_y_0(self);
};;

btQuaternion.prototype['z'] = btQuaternion.prototype.z = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_z_0(self);
};;

btQuaternion.prototype['w'] = btQuaternion.prototype.w = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_w_0(self);
};;

btQuaternion.prototype['setX'] = btQuaternion.prototype.setX = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuaternion_setX_1(self, arg0);
};;

btQuaternion.prototype['setY'] = btQuaternion.prototype.setY = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuaternion_setY_1(self, arg0);
};;

btQuaternion.prototype['setZ'] = btQuaternion.prototype.setZ = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuaternion_setZ_1(self, arg0);
};;

btQuaternion.prototype['setW'] = btQuaternion.prototype.setW = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btQuaternion_setW_1(self, arg0);
};;

  btQuaternion.prototype['__destroy__'] = btQuaternion.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btQuaternion___destroy___0(self);
};
// btCapsuleShapeZ
/** @suppress {undefinedVars, duplicate} */function btCapsuleShapeZ(arg0, arg1) {
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

btCapsuleShapeZ.prototype['setMargin'] = btCapsuleShapeZ.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShapeZ_setMargin_1(self, arg0);
};;

btCapsuleShapeZ.prototype['getMargin'] = btCapsuleShapeZ.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeZ_getMargin_0(self);
};;

btCapsuleShapeZ.prototype['getUpAxis'] = btCapsuleShapeZ.prototype.getUpAxis = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeZ_getUpAxis_0(self);
};;

btCapsuleShapeZ.prototype['getRadius'] = btCapsuleShapeZ.prototype.getRadius = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeZ_getRadius_0(self);
};;

btCapsuleShapeZ.prototype['getHalfHeight'] = btCapsuleShapeZ.prototype.getHalfHeight = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeZ_getHalfHeight_0(self);
};;

btCapsuleShapeZ.prototype['setLocalScaling'] = btCapsuleShapeZ.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCapsuleShapeZ_setLocalScaling_1(self, arg0);
};;

btCapsuleShapeZ.prototype['getLocalScaling'] = btCapsuleShapeZ.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCapsuleShapeZ_getLocalScaling_0(self), btVector3);
};;

btCapsuleShapeZ.prototype['calculateLocalInertia'] = btCapsuleShapeZ.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2(self, arg0, arg1);
};;

  btCapsuleShapeZ.prototype['__destroy__'] = btCapsuleShapeZ.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
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

  btContactSolverInfo.prototype['get_m_splitImpulse'] = btContactSolverInfo.prototype.get_m_splitImpulse = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0(self));
};
    btContactSolverInfo.prototype['set_m_splitImpulse'] = btContactSolverInfo.prototype.set_m_splitImpulse = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1(self, arg0);
};
  btContactSolverInfo.prototype['get_m_splitImpulsePenetrationThreshold'] = btContactSolverInfo.prototype.get_m_splitImpulsePenetrationThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0(self);
};
    btContactSolverInfo.prototype['set_m_splitImpulsePenetrationThreshold'] = btContactSolverInfo.prototype.set_m_splitImpulsePenetrationThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1(self, arg0);
};
  btContactSolverInfo.prototype['get_m_numIterations'] = btContactSolverInfo.prototype.get_m_numIterations = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btContactSolverInfo_get_m_numIterations_0(self);
};
    btContactSolverInfo.prototype['set_m_numIterations'] = btContactSolverInfo.prototype.set_m_numIterations = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btContactSolverInfo_set_m_numIterations_1(self, arg0);
};
  btContactSolverInfo.prototype['__destroy__'] = btContactSolverInfo.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btContactSolverInfo___destroy___0(self);
};
// btGeneric6DofSpringConstraint
/** @suppress {undefinedVars, duplicate} */function btGeneric6DofSpringConstraint(arg0, arg1, arg2, arg3, arg4) {
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

btGeneric6DofSpringConstraint.prototype['enableSpring'] = btGeneric6DofSpringConstraint.prototype.enableSpring = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2(self, arg0, arg1);
};;

btGeneric6DofSpringConstraint.prototype['setStiffness'] = btGeneric6DofSpringConstraint.prototype.setStiffness = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2(self, arg0, arg1);
};;

btGeneric6DofSpringConstraint.prototype['setDamping'] = btGeneric6DofSpringConstraint.prototype.setDamping = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2(self, arg0, arg1);
};;

btGeneric6DofSpringConstraint.prototype['setLinearLowerLimit'] = btGeneric6DofSpringConstraint.prototype.setLinearLowerLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['setLinearUpperLimit'] = btGeneric6DofSpringConstraint.prototype.setLinearUpperLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['setAngularLowerLimit'] = btGeneric6DofSpringConstraint.prototype.setAngularLowerLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['setAngularUpperLimit'] = btGeneric6DofSpringConstraint.prototype.setAngularUpperLimit = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['getFrameOffsetA'] = btGeneric6DofSpringConstraint.prototype.getFrameOffsetA = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0(self), btTransform);
};;

btGeneric6DofSpringConstraint.prototype['getRotationalLimitMotor'] = btGeneric6DofSpringConstraint.prototype.getRotationalLimitMotor = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_btGeneric6DofSpringConstraint_getRotationalLimitMotor_1(self, arg0), btRotationalLimitMotor);
};;

btGeneric6DofSpringConstraint.prototype['enableFeedback'] = btGeneric6DofSpringConstraint.prototype.enableFeedback = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['getBreakingImpulseThreshold'] = btGeneric6DofSpringConstraint.prototype.getBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0(self);
};;

btGeneric6DofSpringConstraint.prototype['setBreakingImpulseThreshold'] = btGeneric6DofSpringConstraint.prototype.setBreakingImpulseThreshold = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1(self, arg0);
};;

btGeneric6DofSpringConstraint.prototype['getParam'] = btGeneric6DofSpringConstraint.prototype.getParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  return _emscripten_bind_btGeneric6DofSpringConstraint_getParam_2(self, arg0, arg1);
};;

btGeneric6DofSpringConstraint.prototype['setParam'] = btGeneric6DofSpringConstraint.prototype.setParam = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1, arg2) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  if (arg2 && typeof arg2 === 'object') arg2 = arg2.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setParam_3(self, arg0, arg1, arg2);
};;

  btGeneric6DofSpringConstraint.prototype['__destroy__'] = btGeneric6DofSpringConstraint.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint___destroy___0(self);
};
// btSphereShape
/** @suppress {undefinedVars, duplicate} */function btSphereShape(arg0) {
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  this.ptr = _emscripten_bind_btSphereShape_btSphereShape_1(arg0);
  getCache(btSphereShape)[this.ptr] = this;
};;
btSphereShape.prototype = Object.create(btCollisionShape.prototype);
btSphereShape.prototype.constructor = btSphereShape;
btSphereShape.prototype.__class__ = btSphereShape;
btSphereShape.__cache__ = {};
Module['btSphereShape'] = btSphereShape;

btSphereShape.prototype['setMargin'] = btSphereShape.prototype.setMargin = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSphereShape_setMargin_1(self, arg0);
};;

btSphereShape.prototype['getMargin'] = btSphereShape.prototype.getMargin = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_btSphereShape_getMargin_0(self);
};;

btSphereShape.prototype['setLocalScaling'] = btSphereShape.prototype.setLocalScaling = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSphereShape_setLocalScaling_1(self, arg0);
};;

btSphereShape.prototype['getLocalScaling'] = btSphereShape.prototype.getLocalScaling = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSphereShape_getLocalScaling_0(self), btVector3);
};;

btSphereShape.prototype['calculateLocalInertia'] = btSphereShape.prototype.calculateLocalInertia = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btSphereShape_calculateLocalInertia_2(self, arg0, arg1);
};;

  btSphereShape.prototype['__destroy__'] = btSphereShape.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_btSphereShape___destroy___0(self);
};
// Face
function Face() { throw "cannot construct a Face, no constructor in IDL" }
Face.prototype = Object.create(WrapperObject.prototype);
Face.prototype.constructor = Face;
Face.prototype.__class__ = Face;
Face.__cache__ = {};
Module['Face'] = Face;

  Face.prototype['get_m_n'] = Face.prototype.get_m_n = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_Face_get_m_n_1(self, arg0), Node);
};
    Face.prototype['set_m_n'] = Face.prototype.set_m_n = /** @suppress {undefinedVars, duplicate} */function(arg0, arg1) {
  var self = this.ptr;
  ensureCache.prepare();
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_Face_set_m_n_2(self, arg0, arg1);
};
  Face.prototype['get_m_normal'] = Face.prototype.get_m_normal = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Face_get_m_normal_0(self), btVector3);
};
    Face.prototype['set_m_normal'] = Face.prototype.set_m_normal = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Face_set_m_normal_1(self, arg0);
};
  Face.prototype['__destroy__'] = Face.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_Face___destroy___0(self);
};
// tFaceArray
function tFaceArray() { throw "cannot construct a tFaceArray, no constructor in IDL" }
tFaceArray.prototype = Object.create(WrapperObject.prototype);
tFaceArray.prototype.constructor = tFaceArray;
tFaceArray.prototype.__class__ = tFaceArray;
tFaceArray.__cache__ = {};
Module['tFaceArray'] = tFaceArray;

tFaceArray.prototype['size'] = tFaceArray.prototype.size = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_tFaceArray_size_0(self);
};;

tFaceArray.prototype['at'] = tFaceArray.prototype.at = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_tFaceArray_at_1(self, arg0), Face);
};;

  tFaceArray.prototype['__destroy__'] = tFaceArray.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_tFaceArray___destroy___0(self);
};
// tLinkArray
function tLinkArray() { throw "cannot construct a tLinkArray, no constructor in IDL" }
tLinkArray.prototype = Object.create(WrapperObject.prototype);
tLinkArray.prototype.constructor = tLinkArray;
tLinkArray.prototype.__class__ = tLinkArray;
tLinkArray.__cache__ = {};
Module['tLinkArray'] = tLinkArray;

tLinkArray.prototype['size'] = tLinkArray.prototype.size = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_tLinkArray_size_0(self);
};;

tLinkArray.prototype['at'] = tLinkArray.prototype.at = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_tLinkArray_at_1(self, arg0), Link);
};;

  tLinkArray.prototype['__destroy__'] = tLinkArray.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_tLinkArray___destroy___0(self);
};
// LocalConvexResult
/** @suppress {undefinedVars, duplicate} */function LocalConvexResult(arg0, arg1, arg2, arg3, arg4) {
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

  LocalConvexResult.prototype['get_m_hitCollisionObject'] = LocalConvexResult.prototype.get_m_hitCollisionObject = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0(self), btCollisionObject);
};
    LocalConvexResult.prototype['set_m_hitCollisionObject'] = LocalConvexResult.prototype.set_m_hitCollisionObject = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1(self, arg0);
};
  LocalConvexResult.prototype['get_m_localShapeInfo'] = LocalConvexResult.prototype.get_m_localShapeInfo = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0(self), LocalShapeInfo);
};
    LocalConvexResult.prototype['set_m_localShapeInfo'] = LocalConvexResult.prototype.set_m_localShapeInfo = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1(self, arg0);
};
  LocalConvexResult.prototype['get_m_hitNormalLocal'] = LocalConvexResult.prototype.get_m_hitNormalLocal = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0(self), btVector3);
};
    LocalConvexResult.prototype['set_m_hitNormalLocal'] = LocalConvexResult.prototype.set_m_hitNormalLocal = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1(self, arg0);
};
  LocalConvexResult.prototype['get_m_hitPointLocal'] = LocalConvexResult.prototype.get_m_hitPointLocal = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0(self), btVector3);
};
    LocalConvexResult.prototype['set_m_hitPointLocal'] = LocalConvexResult.prototype.set_m_hitPointLocal = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1(self, arg0);
};
  LocalConvexResult.prototype['get_m_hitFraction'] = LocalConvexResult.prototype.get_m_hitFraction = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  return _emscripten_bind_LocalConvexResult_get_m_hitFraction_0(self);
};
    LocalConvexResult.prototype['set_m_hitFraction'] = LocalConvexResult.prototype.set_m_hitFraction = /** @suppress {undefinedVars, duplicate} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitFraction_1(self, arg0);
};
  LocalConvexResult.prototype['__destroy__'] = LocalConvexResult.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} */function() {
  var self = this.ptr;
  _emscripten_bind_LocalConvexResult___destroy___0(self);
};
(function() {
  function setupEnums() {
    

    // btConstraintParams

    Module['BT_CONSTRAINT_ERP'] = _emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP();

    Module['BT_CONSTRAINT_STOP_ERP'] = _emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP();

    Module['BT_CONSTRAINT_CFM'] = _emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM();

    Module['BT_CONSTRAINT_STOP_CFM'] = _emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM();

    

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
