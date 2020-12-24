const CS = require('csharp');
// var puerts = require('../../puerts/')
var unity = {}

unity.createElement = function (type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    console.log(type)
}

unity.initComonent = function (type, parentInstance, props, rootContainerInstance, hostContext) {
    return true;
}

unity.setText = function (textInstance, oldText, newText) {

}

unity.applyUpdate = function (type, instance, updatePayload, oldProps, newProps, internalInstanceHandle) {

}


module.export = unity;