/** 
 * DScripted Toolkit for JavaScript
 * Copyright (c) 2011 Keith Daulton (dscripted.com)
 * Licensed under the GNU General Public License.
 * @author  Keith Daulton
 * @version 1.1
*/

/**
 * 1.1 Changes:
 * - Added window.console object when not present
 * - Revamped newElement() function to take an object options instead of just id and className args
 * - 
*/

/** Core library - DScripted Toolkit for JavaScript 
 * @author kdaulton
 */


/* 
 * JS Object Methods
 */
if(!String.prototype.ltrim) {
    String.prototype.ltrim = function () { return this.replace(/^\s+/, ""); };
}
if(!String.prototype.rtrim) {
    String.prototype.rtrim = function () { return this.replace(/\s+$/, ""); };
}
if(!String.prototype.trim) {
    String.prototype.trim = function () { return this.ltrim().rtrim(); };
}
if(!String.prototype.onlyDigits) {
    String.prototype.onlyDigits = function () { return this.replace(/([\D\W])/gi, ""); };
}
if(!String.prototype.equalsIgnoreCase) {
    String.prototype.equalsIgnoreCase = function (arg) { return (this.toLowerCase() == String(arg).toLowerCase()); };
}
if(!String.prototype.equals) {
    String.prototype.equals = function (arg) { return (this.toString() == arg.toString()); };
}
if(!String.prototype.startsWith) {
    String.prototype.startsWith = function (arg) { return (this.match("^"+arg)==arg); };
}
if(!String.prototype.endsWith) {
    String.prototype.endsWith = function (arg) { return (this.match(arg+"$")==arg); };
}
if (!Date.prototype.isLeapYear) {
    Date.prototype.isLeapYear = function () {
        var year = this.getFullYear();
        return !(year % 4) && (year % 100) || !(year % 400) ? true : false;
    };
}

/*
 * Logging and Testing Features
 */
if (!window.console) {
    window.console = {
        log: function (item) {},
        info: function (item) {} 
    };
}
var log = function(item){
    console.info(item);
};

function Tester(){
    this.endTime = 0;
    this.startTime = 0;
}
Tester.prototype = {
    start: function(){ this.startTime = new Date(); },
    end: function () { this.endTime = new Date(); },
    getResult: function () { 
        var result = Number(this.endTime - this.startTime);
        this.endTime=0;
        this.startTime=0;
        return result;
    }
}

/*
 * Base functions
 */
function undef (obj) { return (typeof(obj) == "undefined"); }
function $id (strId) { return document.getElementById(strId); }

function getClass(object) {  return Object.prototype.toString.call(object).slice(8, -1); } // Solution by Kangax.
function addClass (obj, cssClass) { if (obj.className.indexOf(cssClass) < 0) { if (obj.className != "") { obj.className += " " + cssClass; } else { obj.className = cssClass; } } }
function addClassById (strId, cssClass) { var obj = $id(strId); addClass(obj,cssClass); }
function removeClass (obj, cssClass) { if (obj.className.indexOf(cssClass) > -1) { obj.className = (obj.className.replace(cssClass,"")).trim(); } }
function removeClassById (strId, cssClass) { var obj = $id(strId); removeClass(obj,cssClass); }
function hasClass (obj, cssClass) { 
    var pattern = new RegExp("\\b"+cssClass+"\\b");
    return (obj.className.search(pattern,"g") > -1); 
}
function setEvent (obj, evnt, funct) { 
    if(obj) {
        if (obj.addEventListener){ obj.addEventListener(evnt, funct, false); return true; }
        else if (obj.attachEvent){ var r = obj.attachEvent("on"+evnt, funct); return r; }
        else { return false; } 
    } else { return false; } 
}

function getElementsByClassName (obj, strClassName) { 
    var resultSet = [];
    var elements = obj.getElementsByTagName('*');
    var pattern = new RegExp("\\b"+strClassName+"\\b");
    for (var i=0, j=elements.length; i<j; i++) {
        var childElement = elements[i];
        if (childElement.nodeType == 1) {
            if (childElement.className.search(pattern,"g") > -1) { resultSet.push(childElement); }
        }
    }
    return resultSet;
};

function DomObject (objRef) { 
    this.obj = (typeof(objRef) == 'string') ? document.getElementById(objRef) : objRef; 
};
DomObject.prototype = {
    getElementsByClassName: function (strClassName) { return getElementsByClassName(this.obj, strClassName); },
    addClass: function (cssClass) { addClass(this.obj, cssClass); },
    removeClass: function (cssClass) { removeClass(this.obj, cssClass); },
    setEvent: function (evnt, funct) { setEvent(this.obj, evnt, funct); },
    setEventByClass: function (cssClass,evnt, funct) { 
        var objs = getElementsByClassName(this.obj,cssClass);
        for (var i=objs.length; i--;) { setEvent(objs[i], evnt, funct); }
    }
};
function $extend (objRef) { return new DomObject(objRef); };

function newElement (ele, propObj) {
    var element = document.createElement(ele);
    var props = propObj || {};
    for (prop in props) {
        var val = props[prop];
        switch (prop) {
            case "class":
                element.className = val;
                break;
            default:
                element.setAttribute(prop,val);
        }
    }
    return element;
};

function newXHRequest () {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) { return null; }
        }
    } else { return null; }
};

function randomNumber (length) {
    var number;
    var len = length || 10;
    for (var i=0; i<len;i++){ number += Math.floor(Math.random()*9); }
    return Number(number);
};

function setInputText (obj) { 
    if (obj.msg == null) { obj.msg = obj.value; }
    if (obj.value == "" && obj.msg != null) { obj.value = obj.msg; }
    else if (obj.value == obj.msg) { obj.value = ""; }
};

var windowUtil = {
    getLiveHeight: function () {
        var result = 0;
        if (self.innerWidth) { result = self.innerHeight; }
        else if (document.documentElement && document.documentElement.clientWidth) { result = document.documentElement.clientHeight; }
        else if (document.body) { result = document.body.clientHeight; }
        return result;
    },
    getLiveWidth:  function () {
        var result = 0;
        if (self.innerWidth) { result = self.innerWidth; }
        else if (document.documentElement && document.documentElement.clientWidth) { result = document.documentElement.clientWidth; }
        else if (document.body) { result = document.body.clientWidth; }
        return result;
    },
    getFullHeight: function () {
        var result = 0;
        if (window.innerHeight && window.scrollMaxY) { result = window.innerHeight + window.scrollMaxY; } 
        else if (document.body.scrollHeight > document.body.offsetHeight){ result = document.body.scrollHeight; } 
        else { result = document.body.offsetHeight; }
        return result;
    },
    getFullWidth: function () {
        var result = 0;
        if (window.innerHeight && window.scrollMaxY) { result = window.innerWidth + window.scrollMaxX; } 
        else if (document.body.scrollHeight > document.body.offsetHeight){ result = document.body.scrollWidth; } 
        else { result = document.body.offsetWidth; }
        return result;
    }
};
var MouseUtil = { xPos:"", yPos:"", targetObj:null, xDiff:0, yDiff:0,
    getPositionEvent : function (e) {
        if (!e) var e = window.event;
        MouseUtil.getPosition(e);
    },
    getPosition : function (eObj) {
        if(eObj.pageX || eObj.pageY){ 
            this.xPos=eObj.pageX;
            this.yPos=eObj.pageY; 
        } else { 
            try {
                this.xPos=eObj.clientX + document.body.scrollLeft - document.body.clientLeft;
                this.yPos=eObj.clientY + document.body.scrollTop  - document.body.clientTop; 
             } catch (err) {//DO nothing
             }
        }
    },
    setDragObj : function (obj) {
        document.onmousedown = this.falsefunc;
        if (this.targetObj != obj) {
            this.targetObj = obj;
            this.xDiff =  obj.offsetLeft - this.xPos;
            this.yDiff =  obj.offsetTop - this.yPos;
        }
        document.onmousemove = MouseUtil.dragObjEvent;
        document.onmouseup = MouseUtil.releaseDrag;
    },
    dragObjEvent : function (e) {
        var targetObj;
        if (!e) var e = window.event;
        MouseUtil.getPositionEvent(e);
        if (e.target) targetObj = e.target;
        else if (e.srcElement) targetObj = e.srcElement;
        MouseUtil.dragObj(targetObj);
    },
    dragObj : function (eObj) {
        if(this.targetObj) {
            var target = this.targetObj;
            var xNew = this.xPos + this.xDiff;
            var yNew = this.yPos + this.yDiff;
            target.style.left = String(xNew) + 'px';
            target.style.top  = String(yNew) + 'px';
        }
    },
    releaseDrag : function () {
        if(MouseUtil.targetObj) { MouseUtil.targetObj=null; MouseUtil.xDiff=0; MouseUtil.yDiff=0; }
        document.onmousemove = MouseUtil.getPositionEvent;
        document.onmouseup = null;
        document.onmousedown = null;
    },
    falsefunc : function() { return false; }
};
var DateUtil = {
    isNewerDate : function (year,month,day) {
        var result = true;
        if (this.isRealDate(year,month,day)) {
            var compDate = new Date();
            compDate.setFullYear(year,month,day);
            var today = new Date();
            result = (compDate>today);
        } else { result=false; }
        return result;
    },
    isRealDate : function (year,month,day) {
        var result = true;
        var compDay = new Date();
        compDay.setFullYear(year,month);
        var lastDay = this.lastDayOfMonth(compDay);
        if (day<1 || day>lastDay) { result=false; }
        return result;
    },
    lastDayOfMonth : function (dateObj) {
        var days = 31;
        var mon = (dateObj.getMonth() +1);
        if (mon==4 || mon==6 || mon==9 || mon==11) {days = 30;}
        if (mon==2) {days = dateObj.isLeapYear() ? 29 : 28;}
        return days;
    }
};
var AJAX = {
    xhrQueue:{},
    getReqObj: function (key) {
        if(this.xhrQueue[key] == null) {
            this.xhrQueue[key] = this.newReq();
        }
        if (this.xhrQueue[key] != null) {
            return this.xhrQueue[key];
        } else {
            return null;
        }
    },
    newReq: function () {
        return newXHRequest();
    }
};
/* Core library - END */

/** DFormed library  - DScripted Toolkit for JavaScript 
 * @author kdaulton
 */
var DFormed = (function () {
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
    };
    
/*
 *  COLLECTIONS
 */
    var definitionList = {}, 
    postProcessQueue = [],
    preProcessQueue =  [];

/*
 *  PRIVATE METHODS
 */
    // definitions
    var getDefinition = function (key) {
        var result = definitionList[key] || null;

        return result;
    },
    checkDependency = function (obj, frmName) {
        var result = true;
        if (obj.dependency != null) { 
            result = (frmName[obj.dependency]) ? true : false;
        }
        return result; 
    },
    checkCondition = function (conditionObj) { 
        if (typeof conditionObj === "string") {
            return eval(conditionObj); 
        } else {
            return conditionObj();
        }
    },
    // validations
    getValidations = function (obj) { return (obj.validations != null ? obj.validations : []); },
    getValidationMsgLimit = function (obj) { return (obj.msgLimit != null ? Number(obj.msgLimit) : -1); },
    // queues
    processQueue = function (arrQueue) {
        var queue = arrQueue;
        for (var i=queue.length; i--;) {
            eval(queue[i]);
        }
    },
    postProcess = function () { processQueue(postProcessQueue);},
    preProcess = function () { processQueue(preProcessQueue) },
    // forms
    isFormField =  function (obj) { return ((obj.nodeName == "INPUT" || obj.nodeName == "SELECT" || obj.nodeName == "TEXTAREA") && obj.type != "hidden"); },
    getFormFields = function (obj) {
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
    runDefinitions =  function(formObj,inputObj,definition) {
        var result = true;
        var inputName = String(inputObj.getAttribute("name"));
        var defObj = (definition != null) ? definition : getDefinition(inputName);
        if (defObj != null) {
            result = checkDependency(defObj, formObj);
            if (result) {
                var list =  defObj.validations != null ? defObj.validations : [];
                var msgCount = 0;
                var limit = (getValidationMsgLimit(defObj) != -1) ? getValidationMsgLimit(defObj) : config.errorMessageLimit;
                for (var i=0, j=list.length; i<j; i++) {
                    var validation = list[i];
                    console.log(validation);
                    var checkCondition = true;
                    if (list[i].condition != null && list[i].condition != "") { checkCondition = checkCondition(list[i].condition);}
                    if (result && checkCondition) {
                        var fnStr;
                        if (list[i].param != null && list[i].param != "") { fnStr = list[i].fn+"(inputObj,\""+list[i].param+"\")"; }
                        else { fnStr = list[i].fn+"(inputObj)"; }
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
    searchFormByDef =  function (obj) {
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
    searchFormByInput =  function (obj) { 
        var result = true;
        var formObj = obj;
        var fieldList = getFormFields(formObj);
        for(var i=0, j=fieldList.length; i<j; i++){
            var childResult = runDefinitions(formObj,fieldList[i]);
            if (result) result = childResult;
        }
        return result;
        
    },
    searchForm =  function (obj) {
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
    var setErrorLimit =  function (numLimit) { config.errorMessageLimit=Number(numLimit); },
    isValidationEnabled =  function () { return config.enabled; },
    enable = function () { config.enabled = true; },
    disable = function () { config.enabled = false; },
    enableErrorHighlights = function (strClassName) { config.errorMarking=true; config.errorClass=strClassName; },
    // validations
    addValidation =  function (key,obj) { getDefinition(key).validations.push(obj); },
    deleteValidation = function (obj,strFunction) {
        var list = obj.validations;
        for (var j=0, m=list.length; j<m;j++) { 
            if (list[j].fn == strFunction) { list.splice(j,1); } 
        }
    },
    deleteValidationByKey =  function (key,strFunction) { deleteValidation(getDefinition(key), strFunction); },
    // definitions
    setDefinition = function (strFieldName, arrValidations, strDependency, msgLimit) {
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
    copyDefinition = function (strFieldName, strFieldNameToCopy) {
        var def = definitionList[strFieldNameToCopy] || null;
        if (def) {
            definitionList[strFieldName] = def;
        }
    },
    hasDefintions = function () {
        for (def in definitionList) {
            return true;
        }
        return false;
    },
    deleteDefinition = function (key) {
        delete definitionList[key];
    },
    // queues
    setPostProcess = function (callBackFn) {
        postProcessQueue.push(callBackFn);
    },
    setPreProcess = function (callBackFn) {
        preProcessQueue.push(callBackFn);
    },
    // forms
    resetFormFields = function (obj) {
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
    getParentFormObj =  function (obj) {
        var objParent = obj;
        while (objParent.nodeName != "FORM") objParent = objParent.parentNode;
        return objParent;
    },
    getParentFormId =  function (obj) {
        return String(this.getParentFormObj(obj).getAttribute("id"));
    },
    // execution
    execute =  function (obj) {
        
        DMasked.clearInputMasks();
        preProcess();
        
        var result = true;
        if (isValidationEnabled() && hasDefintions()) {
            if (!searchForm(obj)) { result = false; DMasked.attach(); }
        }
        if (config.errorMessaging &&  result == false) { DMessaged.pushMsg(); }
        
        if (result) { postProcess(); }
        
        return result;
    },
    executeEvent =  function () { console.log('DFormed.executeEvent called'); return execute(this); },
    attach =  function () { 
        console.log('DFormed.attach called');
        var formElements = document.getElementsByTagName("form");
        for(var i=formElements.length; i--;) formElements[i].onsubmit = executeEvent;
    },
    init = function (options) { 
        if (options) {
            for (itm in options) {
                config[itm] = options[itm];
            }
        }
        config.enabled = true; 
        setEvent(window,"load",DFormed.attach); 
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

/* DFormed library - END */

/** DMessaged library  - DScripted Toolkit for JavaScript 
 * @author kdaulton
 */
var DMessaged = { 
    msgQueue: [], targetId: "", msgElement: "p", msgHistory: [],
    isPreLoaded: false,
    clearMsgQueue: function () { this.msgQueue = []; },
    init: function (/* options || objId, elementType */) { 
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
    queueMsg: function (msgTxt,objId) { this.msgQueue.push({"msg":msgTxt, "id":objId }); },
    loadEvent: function () { 
        if(!this.isPreLoaded) {
            setEvent(window,"load", DMessaged.preload);
            this.isPreLoaded = true;
        } 
    },
    preload: function () { DMessaged.pushMsg(); },
    pushMsg: function () {
        this.clearMsgTargets();
        var messages = this.msgQueue;
        for (var i=0, j=messages.length; i<j;i++) {
            if (messages[i].msg != "") {
                var actualTarget;
                if(messages[i].id) { 
                    actualTarget= document.getElementById(messages[i].id);
                } else { 
                    actualTarget= document.getElementById(this.targetId);
                }
                var text = document.createElement(this.msgElement);
                text.innerHTML = messages[i].msg;
                actualTarget.appendChild(text);
                actualTarget.style.display = "block";
                this.msgHistory.push(actualTarget);
            }
        }
        if(messages.length > 0) { window.scrollTo(0,0); }
        this.clearMsgQueue();
    },
    clearMsgTargets: function () {
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
var DMasked = { 
    enabled: false,
    maskList: [],
    addMask: function (strClassName,mask,callbackFn) { 
        if (strClassName.trim() != "" && mask.trim() != "" ) this.maskList.push({"name":strClassName,"mask":mask,"callbackFn":callbackFn});
    },
    getMask: function (key) {
        if(key.indexOf(" ") > -1) { return this.getMaskByKeyList(key); }
        else { return this.getMaskByKey(key); }
    },
    getMaskByKey: function (key) {
        var result = null;
        for (var i=0, j=this.maskList.length; i<j; i++) {
            if (this.maskList[i].name == key) result = this.maskList[i].mask;
        }
        return result;
    },
    getMaskByKeyList: function (key) {
        var keyList = key.split(" ");
        var result = null;
        for (var i=0, j=keyList.length; i<j; i++) {
            var maskResult = this.getMaskByKey(keyList[i]);
            if (maskResult != null && maskResult != "") result = maskResult;
        }
        return result;
    },
    init: function () { this.enabled = true; setEvent(window,"load",DMasked.attach); },
    attach: function () { 
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
                        var oldEvent = targetObj.onkeyup ? targetObj.onkeyup : null;
                        targetObj.onkeyup = function(){};
                        setEvent(targetObj,"keyup",DMasked.maskField);
                        if (oldEvent) {
                            setEvent(targetObj,"keyup",oldEvent);
                        }
                        DMasked.executeMask(targetObj);
                    } 
                    else { DMasked.maskText(targetObj, maskDef.mask); }
                }
            }
        }
    },
    maskField: function (e) {
        var targetObj;
        if (!e) var e = window.event;
        if (e.target) targetObj = e.target;
        else if (e.srcElement) targetObj = e.srcElement;
        var mask = DMasked.getMask(targetObj.className);
        if (mask != null) {
            DMasked.executeMask(targetObj);
        }
    },
    executeMask: function (inputObj) {
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
    maskText: function (targetObj, formatType) {
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
    },
    clearInputMasks: function () {
        if(DMasked.maskList.length > 0) {
            var root = document.getElementsByTagName('body')[0];
            for (var i=DMasked.maskList.length; i--;) {
                var elementList = $extend(root).getElementsByClassName(DMasked.maskList[i].name);
                for (var j=elementList.length; j--;) { 
                    if (elementList[j].nodeName == "INPUT" && elementList[j].value != "") { 
                        elementList[j].value = elementList[j].value.replace(/\D/g,'');
                    }
                }
            }
        }
    }
};
/* DMasked library - END */

/** Fx functions  - DScripted Toolkit for JavaScript 
 * @author kdaulton
 */

function MenuControl (classNameToHide) { this.last=null; this.t=null; this.className=classNameToHide; };
MenuControl.prototype.set = function(objId) { 
    if (this.last != null && this.last != objId) {
        var lastObj = $id(this.last);
        removeClass(lastObj,this.className);
    } else { 
        this.last = objId;
    }
    clearTimeout(this.t);
    var obj = $id(objId);
    addClass(obj,this.className);
};
MenuControl.prototype.close = function (objId) {
    this.last = objId; 
    this.t = setTimeout("removeClassById('"+objId+"','"+this.className+"')",1000); 
};

var TextControl = { lastObjId:"",
    showHide:function (id) { 
        if (this.lastObjId != "") { $id(this.lastObjId).style.display = "none"; }
        if (this.lastObjId == id) { $id(id).style.display = "none"; this.lastObjId = ""; }
        else { $id(id).style.display = "block"; this.lastObjId = id; }
    }
};