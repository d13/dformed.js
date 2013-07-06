/** 
 * dformed.js - rough draft
 * @author  Keith Daulton
 * @version 0.1
*/

(function(undefined) {

/** 
 * fixer-uppers 
 */
!String.prototype.ltrim && 
    (String.prototype.ltrim = function() { 
        return this.replace(/^\s+/, ""); 
    });
!String.prototype.rtrim && 
    (String.prototype.rtrim = function() { 
        return this.replace(/\s+$/, ""); 
    });
!String.prototype.trim && 
    (String.prototype.trim = function() { 
        return this.ltrim().rtrim(); 
    });


/** 
 * dformed library 
 */
var dformed = (function() {
/*
 *  CONFIG
 */
    var config = {
        enabled: false,
        errorMessaging: true,
        errorMessageLimit: -1,
        errorMarking: false,
        errorClass: "",
        searchByDef: false
    },
/*
 *  COLLECTIONS
 */
    definitionList = {}, 
    postProcessQueue = [],
    preProcessQueue =  [],
/*
 *  PRIVATE METHODS
 */
    // definitions
    _eval = window.eval,
    eval = function(strCode) {
        return (new Function("return" + strCode))();
    },
    getDefinition = function(key) {
        return definitionList[key] || null;
    },
    checkDependency = function(obj, frmName) {
        if (obj.dependency == null) return true; 
        
        return (frmName[obj.dependency]) ? true : false;
    },
    checkCondition = function(conditionObj) { 
        if (typeof conditionObj === "string") {
            return eval(conditionObj); 
        }
        return conditionObj();
    },
    // validations
    getValidationMsgLimit = function(obj) { 
        return (obj.msgLimit != null ? Number(obj.msgLimit) : -1); 
    },
    // queues
    processQueue = function(arrQueue) {
        var queue = arrQueue;
        for (var i=queue.length; i--;) {
            eval(queue[i]);
        }
    },
    postProcess = function() { 
        processQueue(postProcessQueue);
    },
    preProcess = function() { 
        processQueue(preProcessQueue) 
    },
    // forms
    isFormField = function(obj) { 
        var nodeName = obj.nodeName;
        return ((nodeName == "INPUT" || nodeName == "SELECT" || nodeName == "TEXTAREA") && obj.type != "hidden"); 
    },
    getFormFields = function(obj) {
        var fieldList = [];
        for(var i=0, j=obj.elements.length; i<j; i++){
            var childElement = obj.elements[i];
            if (childElement.name != undefined && childElement.name != "" && childElement.disabled != true && childElement.type != "hidden") {
                fieldList.push(childElement);
            }
        }
        return fieldList;
    },
    // execution
    runDefinition = function() {
        var result = true;
        
        
        
        return result;
    },
    runDefinitions = function(formObj,inputObj,definition) {
        var defKey = String(inputObj.getAttribute("name"));
        definition = definition || getDefinition(defKey);
        
        if (definition == null) { return true; }
        
        var result = true;
        var defObj = definition;
        if (defObj != null) {
            result = checkDependency(defObj, formObj);
            if (result) {
                var list = defObj.validations || [];
                var msgCount = 0;
                var limit = (getValidationMsgLimit(defObj) != -1) ? getValidationMsgLimit(defObj) : config.errorMessageLimit;
                for (var i=0, j=list.length; i<j; i++) {
                    var validation = list[i];
                    console.log(validation);
                    var checkCondition = true;
                    if (validation.condition != null && validation.condition != "") { 
                        checkCondition = checkCondition(validation.condition);
                    }
                    if (result && checkCondition) {
                        var fnStr;
                        if (list[i].param != null && list[i].param != "") { 
                            fnStr = list[i].fn+"(inputObj,\""+list[i].param+"\")"; 
                        } else { 
                            fnStr = list[i].fn+"(inputObj)"; 
                        }
                        result = eval(fnStr);
                        console.log(list[i].fn +"() - "+result);
                    }
                    if (config.errorMessaging && !result) {
                        if (limit == -1 || (limit > 0 && msgCount < limit)) {
                            msgCount++;
                            if (list[i].callback != null && list[i].callback != "") 
                                eval(String(list[i].callback)+"('"+String(list[i].msg)+"')");
                            else
                                DMessaged.queueMsg(String(list[i].msg), list[i].target);
                        }
                    }
                    if(config.errorMarking) {
                        if(result) { removeClass(inputObj, config.errorClass); }
                        else { addClass(inputObj, config.errorClass); }
                    }
                }
            }
        }
        return result;
    },
    searchFormByDef = function(obj) {
        var result = true;
        var formObj = obj;
        var defList = definitionList;
        for (def in defList) {
            var childElement = formObj[def];
            var childResult = runDefinitions(formObj,childElement,defList[def].arrValidations);
            if (result) result = childResult;
        }
        return result;
    },
    searchFormByInput = function(obj) { 
        var result = true;
        var formObj = obj;
        var fieldList = getFormFields(formObj);
        for(var i=0, j=fieldList.length; i<j; i++){
            var childResult = runDefinitions(formObj,fieldList[i]);
            if (result) result = childResult;
        }
        return result;
        
    },
    searchForm = function(obj) {
        if (config.searchByDef) {
            return searchByDef(obj);
        } else {
            return searchFormByInput(obj);  
        }
    };
    
/*
 *  PUBLIC METHODS
 */
    // config
    var setErrorLimit = function(numLimit) { config.errorMessageLimit=Number(numLimit); },
    isValidationEnabled = function() { return config.enabled; },
    enable = function() { config.enabled = true; },
    disable = function() { config.enabled = false; },
    enableErrorHighlights = function(strClassName) { config.errorMarking=true; config.errorClass=strClassName; },
    // validations
    addValidation = function(key,obj) { getDefinition(key).validations.push(obj); },
    deleteValidation = function(obj,strFunction) {
        var list = obj.validations;
        for (var j=0, m=list.length; j<m;j++) { 
            if (list[j].fn == strFunction) { list.splice(j,1); } 
        }
    },
    deleteValidationByKey = function(key,strFunction) { deleteValidation(getDefinition(key), strFunction); },
    // definitions
    setDefinition = function(strFieldName, arrValidations, strDependency, msgLimit) {
        var def = {
            field: String(strFieldName)
        };
        if (arrValidations != null && arrValidations != "" && arrValidations.length > 0)
            def.validations = arrValidations;
        if (strDependency != null && strDependency != "")
            def.dependency = strDependency;
        if (msgLimit != null && msgLimit != "")
            def.msgLimit = Number(msgLimit);
        definitionList[strFieldName] = def;
    },
    copyDefinition = function(strFieldName, strFieldNameToCopy) {
        var def = definitionList[strFieldNameToCopy] || null;
        if (def) {
            definitionList[strFieldName] = def;
        }
    },
    hasDefintions = function() {
        for (def in definitionList) {
            return true;
        }
        return false;
    },
    deleteDefinition = function(key) {
        delete definitionList[key];
    },
    // queues
    setPostProcess = function(callBackFn) {
        postProcessQueue.push(callBackFn);
    },
    setPreProcess = function(callBackFn) {
        preProcessQueue.push(callBackFn);
    },
    // forms
    resetFormFields = function(obj) {
        var undef;
        var formObj = obj;
        var fieldList = getFormFields(formObj);
        if (fieldList != undef && fieldList.length != undef) {
            DMessaged.clearMsgTargets();
            DMessaged.clearMsgQueue();
            for(var i=0, j=fieldList.length; i<j; i++){
                removeClass(fieldList[i], config.errorClass);
            }
        }
        
    },
    getParentFormObj = function(obj) {
        var objParent = obj;
        while (objParent.nodeName != "FORM") objParent = objParent.parentNode;
        return objParent;
    },
    getParentFormId = function(obj) {
        return String(this.getParentFormObj(obj).getAttribute("id"));
    },
    // execution
    execute = function(obj) {
        
        DMasked.clear();
        preProcess();
        
        var result = true;
        if (isValidationEnabled() && hasDefintions()) {
            if (!searchForm(obj)) { result = false; DMasked.attach(); }
        }
        if (config.errorMessaging &&  result == false) { DMessaged.pushMsg(); }
        
        if (result) { postProcess(); }
        
        return result;
    },
    executeEvent = function() { 
        console.log('dformed.executeEvent called'); 
        return execute(this); 
    },
    attach = function() { 
        console.log('dformed.attach called');
        var formElements = document.getElementsByTagName("form");
        for(var i=formElements.length; i--;) {
            //formElements[i].onsubmit = executeEvent;
            setEvent(formElements[i],"submit",executeEvent); 
        }
    },
    init = function(options) { 
        if (options) {
            for (itm in options) {
                config[itm] = options[itm];
            }
        }
        config.enabled = true;
        
        try {
            attach();
        } catch (err) {
            setEvent(window,"load",attach); 
        }
    };
    
    return {
        enable: enable,
        disable: disable,
        setErrorLimit: setErrorLimit,
        enableErrorHighlights: enableErrorHighlights,
        setDefinition: setDefinition,
        copyDefinition: copyDefinition,
        setPostProcess: setPostProcess,
        setPreProcess: setPreProcess,
        resetFormFields: resetFormFields,
        deleteDefinition: deleteDefinition,
        getParentFormObj: getParentFormObj,
        getParentFormId: getParentFormId,
        execute: execute,
        executeEvent: executeEvent,
        attach: attach,
        init: init
    };
})();

/* dformed library - END */

/** DMessaged library  - DScripted Toolkit for JavaScript 
 * @author kdaulton
 */
var DMessaged = { 
    msgQueue: [], 
    targetId: "", 
    msgElement: "p", 
    msgHistory: [],
    isPreLoaded: false,
    clearMsgQueue: function() { 
        this.msgQueue = []; 
    },
    init: function(/* options || objId, elementType */) { 
        if (arguments.length == 1 && typeof arguments[0] === "object") {
            var opts = arguments[0];
            for (itm in opts) {
                DMessaged[itm] = opts[itm];
            }
        } else {
            this.targetId = arguments[0];
            this.msgElement = arguments[1];
        }
    },
    queueMsg: function(msgTxt,objId) { 
        this.msgQueue.push({"msg":msgTxt, "id":objId }); 
    },
    loadEvent: function() { 
        if(!this.isPreLoaded) {
            setEvent(window,"load", DMessaged.preload);
            this.isPreLoaded = true;
        } 
    },
    preload: function() { DMessaged.pushMsg(); },
    pushMsg: function() {
        this.clearMsgTargets();
        var messages = this.msgQueue,
            msgsLen = messages ? messages.length : 0;
        for (var i=0, j=msgsLen; i<j; i++) {
            var msgObj = messages[i];
            if (msgObj.msg != "") {
                var actualTarget;
                if(msgObj.id) { 
                    actualTarget= document.getElementById(msgObj.id);
                } else { 
                    actualTarget= document.getElementById(this.targetId);
                }
                var text = document.createElement(this.msgElement);
                text.innerHTML = msgObj.msg;
                actualTarget.appendChild(text);
                actualTarget.style.display = "block";
                this.msgHistory.push(actualTarget);
            }
        }
        if(msgsLen > 0) { 
            window.scrollTo(0,0); 
        }
        this.clearMsgQueue();
    },
    clearMsgTargets: function() {
        for (var i=0, j=this.msgHistory.length; i<j;i++) {
            var target = this.msgHistory[i];
            target.innerHTML = "";
            target.style.display = "none";
        }
        this.msgHistory = [];
    }
};
/* DMessaged library - END */

/** DMasked library  - DScripted Toolkit for JavaScript 
 * @author kdaulton
 */
var DMasked = (function() {
    
    var root = document.getElementsByTagName('body')[0] || null,
        maskList = [],
        enabled = false;
    
    var clear = function() {
        if(maskList > 0) {
            root = root || document.getElementsByTagName('body')[0];
            for (var i=maskList.length; i--;) {
                var elementList = $extend(root).getElementsByClassName(DMasked.maskList[i].name);
                for (var j=elementList.length; j--;) { 
                    var ele = elementList[j];
                    if (ele.nodeName == "INPUT" && ele.value != "") { 
                        ele.value = ele.value.replace(/\D/g,'');
                    }
                }
            }
        }
    },
    attach;
    
    var obj = {
        addMask: function(strClassName,mask,callbackFn) { 
            if (strClassName.trim() != "" && mask.trim() != "" ) {
                this.maskList.push({"name":strClassName,"mask":mask,"callbackFn":callbackFn});
            }
        },
        getMask: function(key) {
            if(key.indexOf(" ") > -1) { 
                return this.getMaskByKeyList(key); 
            }
            return this.getMaskByKey(key);
        },
        getMaskByKey: function(key) {
            var result = null;
            for (var i=0, j=this.maskList.length; i<j; i++) {
                if (this.maskList[i].name == key) result = this.maskList[i].mask;
            }
            return result;
        },
        getMaskByKeyList: function(key) {
            var keyList = key.split(" ");
            var result = null;
            for (var i=0, j=keyList.length; i<j; i++) {
                var maskResult = this.getMaskByKey(keyList[i]);
                if (maskResult != null && maskResult != "") result = maskResult;
            }
            return result;
        },
        init: function() { 
            this.enabled = true; 
            setEvent(window,"load",DMasked.attach); 
        },
        attach: function() { 
            if(DMasked.maskList.length > 0) {
                var root = document.getElementsByTagName('body')[0];
                for (var i=DMasked.maskList.length; i--;) {
                    var maskDef = DMasked.maskList[i];
                    var elementList = $extend(root).getElementsByClassName(maskDef.name);
                    for (var j=elementList.length; j--;) {
                        var targetObj = elementList[j];
                        if (targetObj.nodeName == "INPUT") { 
                            targetObj.format = maskDef.mask;
                            targetObj.callback = (maskDef.callbackFn) ? maskDef.callbackFn : "";
                            //targetObj.onkeyup = DMasked.maskField;
                            var oldEvent = targetObj.onkeyup || null;
                            targetObj.onkeyup = function(){};
                            setEvent(targetObj,"keyup",DMasked.maskField);
                            if (oldEvent) {
                                setEvent(targetObj,"keyup",oldEvent);
                            }
                            DMasked.executeMask(targetObj);
                        } else { 
                            DMasked.maskText(targetObj, maskDef.mask); 
                        }
                    }
                }
            }
        },
        maskField: function(e) {
            var targetObj;
            e = e || window.event;
            if (e.target) targetObj = e.target;
            else if (e.srcElement) targetObj = e.srcElement;
            var mask = DMasked.getMask(targetObj.className);
            if (mask != null) {
                DMasked.executeMask(targetObj);
            }
        },
        executeMask: function(inputObj) {
            var inputFormat = inputObj.format;
            var inputValue = inputObj.value.replace(/\D/g,'');
            if (inputObj.callback) { inputValue = eval(inputObj.callback+"(inputValue)"); }
            var inputValueCount=0,finalNumber='';
            if (inputObj.value.length>0){
                for (var count=0, j=inputFormat.length; count<j;count++){
                    var nextChar ="";
                    if (inputFormat.charAt(count)=='~') {
                        nextChar = inputValue.charAt(inputValueCount++);
                    } else {
                        if (inputValueCount<inputValue.length) {
                            nextChar = inputFormat.charAt(count);
                        }
                    }
                    finalNumber+=nextChar;
                    if (inputValueCount>inputValue.length) { break; }
                }
            }
            
            inputObj.value=finalNumber;
        },
        maskText: function(targetObj, formatType) {
            var targetText = targetObj.innerHTML.replace(/\D/g,'');
            if (targetText != "") {
                var inputFormat=formatType;
                var targetTextCount=0,finalNumber='';
                if (targetText.length>0){
                    for (var count=0, j=inputFormat.length; count<j;count++){
                        finalNumber+=(inputFormat.charAt(count)=='~')?targetText.charAt(targetTextCount++):inputFormat.charAt(count);
                        if (targetTextCount>targetText.length) break;
                    }
                }
                targetObj.innerHTML = finalNumber;
            }
        }
    };
    
    return {
        clear: clear,
        attach: function() {}
    };
})();
/* DMasked library - END */

})();