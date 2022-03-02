/* eslint-disable*/
var prevRefreshReg = window.$RefreshReg$;
var prevRefreshSig = window.$RefreshSig$;
var RefreshRuntime = require('react-refresh/runtime');

if (RefreshRuntime != null) {
  window.$RefreshReg$ = (type, id) => {
    // Note module.id is webpack-specific, this may vary in other bundlers
    const fullId = module.id + ' ' + id;
    RefreshRuntime.register(type, fullId);
  }
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}

try {
  var jsxDevRuntime = require('react/jsx-dev-runtime')
  var WDYR = require('@welldone-software/why-did-you-render')

  var origJsxDev = jsxDevRuntime.jsxDEV
  var wdyrStore = WDYR.wdyrStore

  module.exports = jsxDevRuntime
  module.exports.jsxDEV = function jsxDEV(){
    var args = Array.prototype.slice.call(arguments)

    if(wdyrStore.React && wdyrStore.React.isWDYR){
      var origType = args[0]
      var rest = args.slice(1)

      var WDYRType = WDYR.getWDYRType(origType)
      if(WDYRType){
        try{
          var element = origJsxDev.apply(null, [WDYRType].concat(rest))
          if(wdyrStore.options.logOwnerReasons){
            WDYR.storeOwnerData(element)
          }
          return element
        }catch(e){
          wdyrStore.options.consoleLog('whyDidYouRender JSX transform error. Please file a bug at https://github.com/welldone-software/why-did-you-render/issues.', {
            errorInfo: {
              error: e,
              componentNameOrComponent: origType,
              rest: rest,
              options: wdyrStore.options
            }
          })
        }
      }
    }

    return origJsxDev.apply(null, args)
  }
} finally {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
