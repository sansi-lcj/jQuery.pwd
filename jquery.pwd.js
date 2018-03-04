/**
* 密码框，类似支付宝支付密码框。
*/
(function($){
    //键盘按键代码
	var keyCode = {
        8: "BACKSPACE",
        46: "DELETE",
        //数字键键值
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        //小键盘数字键键值
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100:"4",
        101:"5",
        102:"6",
        103:"7",
        104:"8",
        105:"9",
    };

	function getIput(){
		return $("<input></input>")
				.attr("maxlength","1")
                .attr("type","password")
				.addClass("pwdInput");
	}

    function getGap(){
        return $("<i></i>")
                .addClass("gap");
    }

    function randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var maxPos = $chars.length;
        var str = '';
        for (i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    }

    var pwdInput = [];
    var active;
    var parent;

	$.fn.extend({      
		pwd:function(action){
            var target = this;
            var first;
            var last;
            var lastTime = 0;
            function initPwdInput(target){
                var length = $(target).attr("maxlength")>8? 8:$(target).attr("maxlength");
                first = 0;
                last = length - 1;
                active = first;
                var width = $(target).outerWidth(true);
                var height = $(target).outerHeight(true);
                var size = width / length;
                //var height_one = height / length;
                parent = $(target).parent();
                var container = $("<div></div>").attr("id","pwdcontainer");
                $(parent).append($(container));
                $(target).hide();
                for(var idx = 0;idx < length;idx++){
                    var input = getIput();
                    $(input)
                        .css("width",size)
                        .css("height",size)
                        .attr("data-index",idx)
                        .addClass("pwdInput");
                    $(container).append($(input));
                    if(idx != length -1) {
                        $(container).append($(getGap()));
                    }
                    pwdInput[idx] = $(input);
                }
                $(container).append($(target));
                $(pwdInput[first]).addClass("first");
                $(pwdInput[last]).addClass("last");
            }

            function bindKeyup(obj,callback) {
                $(obj).bind("keyup",function(event){
                    if(lastTime == event.timeStamp){
                        return;
                    } else {
                        lastTime = event.timeStamp;
                    }
                    if((48 <= event.keyCode && event.keyCode <= 57) || 
                       (96 <= event.keyCode && event.keyCode <= 105)
                    ){
                        if(active == last && $(obj).val() != "" ) {
                            $(obj).blur();
                            active++;
                            callback();
                            return;
                        }
                        $(obj).val(keyCode[event.keyCode]);
                        $(obj).blur();
                        active++;
                        callback();
                    } else if(
                              keyCode[event.keyCode] == "BACKSPACE" || 
                              keyCode[event.keyCode] == "DELETE"
                            ){
                                if($(obj).val() != "") {
                                    $(obj).val("");
                                    $(obj).blur();
                                    active--;
                                    callback();
                                } else {
                                    $(obj).blur();
                                    active--;
                                    callback();
                                }
                                
                    } else {
                        $(obj).val("");
                    }
                });
            }

            function unBindKeyup(obj) {
                $(obj).unbind("keyup");
            }

            function setActive(){
                $(pwdInput[active]).focus();
            }

            function callback() {
                if(active < 0 ){
                    active = 0;
                }
                if(active > last) {
                    active = last
                }
                /* map,reduce方法在IE8+里不支持
                var value = pwdInput
                            .map(function(item){
                                return $(item).val();
                            })
                            .reduce(function(a,b){
                                return a+""+b;
                            });
                */
                var salt = "";
                for(var idx = 0;idx < pwdInput.length;idx++) {
                    salt += $(pwdInput[idx]).val();
                }
                var value = randomString();
                $(target).val(value);
                //console.log({"value":value,"salt":salt});
                $(pwdInput[active]).click();
            }

            function getValue() {
                $(pwdInput).each(function(){
                    $(this).click(setActive);
                    $(this).focus(function(){
                        bindKeyup(this,callback);
                    });
                    $(this).blur(function(){
                        unBindKeyup(this);
                    });
                });
            }


            switch (action){
                case 'reset':{
                    $('#pwdcontainer').find('input').val('');
                    active = 0;
                    break;
                }
                case 'destroy':{
                    $('#pwdcontainer').after($(target).show()).remove();
                    break;
                }
                case 'init':{
                    initPwdInput(this);
                    getValue();
                    break;
                }
            }

            return this;
		}      
	})      
})(jQuery);