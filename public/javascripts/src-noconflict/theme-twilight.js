ace.define("ace/theme/twilight",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

exports.isDark = true;
exports.cssClass = "ace-twilight";
exports.cssText = ".ace-twilight .ace_gutter,\
.ace-twilight .ace_gutter {\
    background: #311d40;\
    color: #5E4D6E;\
}\
.ace-twilight .ace_print-margin {\
    width: 1px;\
    background: #311d40;\
}\
.ace-twilight {\
    background-color: #311d40;\
    -webkit-box-shadow: 0 1px 0 #311d40, 1px 0 0 #311d40;\
    box-shadow: 0 1px 0 #311d40, 1px 0 0 #311d40;\
    color: #FFFFFF;\
    line-height:20px\
}\
.ace-twilight .ace_cursor {\
    border-left: 2px solid #FFFFFF;\
}\
.ace-twilight .ace_overwrite-cursors .ace_cursor {\
    border-left: 0px;\
    border-bottom: 1px solid #FFFFFF;\
}\
.ace-twilight .ace_marker-layer .ace_selection {\
    background: #130b1a;\
}\
.ace-twilight.ace_multiselect .ace_selection.ace_start {\
    box-shadow: 0 0 3px 0px #311d40;\
    border-radius: 2px;\
}\
.ace-twilight .ace_marker-layer .ace_step {\
    background: rgb(198, 219, 174);\
}\
.ace-twilight .ace_marker-layer .ace_bracket {\
    margin: -1px 0 0 -1px;\
    border: 1px solid #77607d;\
}\
.ace-twilight .ace_marker-layer .ace_active-line {\
    background: #5f3a7a;\
}\
.ace_active-line{\
height:20px\
}\
.ace_layer{\
width:100%\
}\
.ace-twilight .ace_gutter-active-line {\
    background-color: #5f3a7a;\
}\
.ace-twilight .ace_marker-layer .ace_selected-word {\
    border: 1px solid #77607d;\
    -webkit-border-radius: 2px;\
    border-radius: 2px;\
}\
.ace-twilight .ace_fold {\
    background-color: #efefef;\
    border-color: #FFFFFF;\
}\
.ace-twilight .ace_keyword,\
.ace-twilight .ace_storage,\
.ace-twilight .ace_storage.ace_type {\
    color: #64acde\
}\
.ace-twilight .ace_keyword.ace_operator {\
    color: #aaffff;\
}\
.ace-twilight .ace_constant.ace_character,\
.ace-twilight .ace_constant.ace_language,\
.ace-twilight .ace_constant.ace_numeric,\
.ace-twilight .ace_keyword.ace_other.ace_unit,\
.ace-twilight .ace_support.ace_constant,\
.ace-twilight .ace_variable.ace_parameter{\
    color: #fcd04a\
}\
.ace-twilight .ace_constant.ace_other,\
.ace-twilight .ace_entity.ace_name.ace_function,\
.ace-twilight .ace_support.ace_function {\
    color: #efefef\
}\
.ace-twilight .ace_support.ace_class,\
.ace-twilight .ace_support.ace_type {\
    color: #ec6822\
}\
.ace-twilight .ace_invalid {\
    color: #ffffff;\
    background-color: #ffafb8\
}\
.ace-twilight .ace_invalid.ace_deprecated {\
    color: #ffffff;\
    background-color: #ffd0ff\
}\
.ace-twilight .ace_markup.ace_heading,\
.ace-twilight .ace_string {\
    color: #e9ffbc\
}\
.ace-twilight .ace_entity.ace_name.ace_tag,\
.ace-twilight .ace_entity.ace_other.ace_attribute-name,\
.ace-twilight .ace_meta.ace_tag,\
.ace-twilight .ace_string.ace_regexp,\
.ace-twilight .ace_variable {\
    color: #ffafb7\
}\
.ace-twilight .ace_comment {\
    color: #6ba42e\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
