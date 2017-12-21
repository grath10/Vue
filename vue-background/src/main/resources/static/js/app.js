var ApplicationContext = (function () {
    /* The params include all the global settings used in the system*/
    var config = {
        //application context
        "context_path": /*[[@{/}]]*/"/"
    };
    return {
        config: config
    }
})();

/**
 * 历史步骤操作类
 * 先入后出，堆栈
 */
function history() {
    var MAX_STEPS = 10;
    var savedsteps = [];
    this.push = function (url) {
        //如果堆栈已满， 踢掉第一个
        if (savedsteps.length == MAX_STEPS) {
            savedsteps.splice(0, 1);
        }
        savedsteps.push(url);
    };

    this.pop = function () {
        //先去掉当前页面
        savedsteps.pop();
        if (savedsteps.length > 0) {
            //再取得当前页的前一页
            return savedsteps[savedsteps.length - 1];
        }
        return null;
    };
}

var historyObj = new history();

/*Ajax global setup */
$.ajaxSetup({
    beforeSend: function (xhr) {
        $("#li-busy").css('display', 'block');
        var token = $('#_csrf').attr('content');
        var header = $('#_csrf_header').attr('content');
        if (token && header) {
            xhr.setRequestHeader(header, token);
        }
    },
    complete: function (XMLHttpRequest) {
        $("#li-busy").css('display', 'none');
        ajaxTimeoutProcessor(XMLHttpRequest);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        ajaxException(XMLHttpRequest, textStatus, errorThrown);
    }
});

function ajaxTimeoutProcessor(XMLHttpRequest) {
    var session_status = XMLHttpRequest.getResponseHeader("session_status");
    if (session_status == "timeout") {
        ComponentInitializer.alertInfoMessage("登录超时, 请重新登录！");
        location.href = ApplicationContext.config.context_path + "login";
    }
}

function ajaxException(XMLHttpRequest) {
    if (XMLHttpRequest.responseJSON) {
        ComponentInitializer.alertErrorMessage(XMLHttpRequest.responseJSON.message);
    } else {
        ComponentInitializer.alertErrorMessage("未知的异常发生，请联系管理员！");
    }
}

// init select2 default options
// $.fn.select2.defaults.set("cache", "true");
// $.fn.select2.defaults.set("allowClear", "true");
// $.fn.select2.defaults.set("placeholder", "不限");
// $.fn.select2.defaults.set("language", "zh-CN");
// $.fn.select2.defaults.set("minimumResultsForSearch", "15");
// $.fn.select2.defaults.set("maximumInputLength", "15");


/**
 * DataTable default options
 */
/*
$.extend($.fn.dataTable.defaults, {
    stateSave: true,
    processing: true,
    serverSide: true,
    searching: true,   //禁用datatables搜索
    lengthMenu: [[10, 20, 50], [10, 20, 50]],
    language: {
        "sProcessing": "处理中...",
        "sLengthMenu": "显示 _MENU_ 项结果",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "表中数据为空",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        },
        "oAria": {
            "sSortAscending": ": 以升序排列此列",
            "sSortDescending": ": 以降序排列此列"
        }
    },
    ajax: {
        url: '',
        dataSrc: "data",
        data: function (d, settings) {
            var queryform = "#" + (settings.ajax.queryform ? settings.ajax.queryform : "queryForm");
            //页面查询参数
            if ($(queryform).length > 0) {
                var formData = $(queryform).serializeArray();
                formData.forEach(function (e) {
                    d[e.name] = e.value;
                });
            }
            //alert(JSON.stringify(d));
        },
        complete: function (XMLHttpRequest) {
            $("#li-busy").css('display', 'none');
            ajaxTimeoutProcessor(XMLHttpRequest);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            ajaxException(XMLHttpRequest, textStatus, errorThrown);
        }
    },
    fnDrawCallback: function () {
        var api = this.api();
        //是否需要Index列？
        var indexCol = api.init().indexCol;
        indexCol = typeof(indexCol) == "undefined" ? 1 : indexCol;

        //获取到本页开始的条数
        var startIndex = api.context[0]._iDisplayStart;
        api.column(indexCol).nodes().each(function (cell, i) {
            cell.innerHTML = startIndex + i + 1;
        });

        //转换超链接为ajax加载，tools.js
        $("a[target]", this).convertlink();
    },
    columnDefs: [{
        targets: 0,
        render: function (data, type, row, meta) {
            var rid = row.id ? row.id : row.ID;
            return "<input type='checkbox' name='checkList' rowid='" + rid + "'/>";
        }
    }]
});
*/

/*<![CDATA[*/
var ComponentInitializer = (function () {
    function alertSuccessMessage(message) {
        toastr.options.timeOut = 5000;
        toastr.success(message);
    }

    function alertErrorMessage(message) {
        toastr.options.timeOut = -1;
        toastr.error(message);
    }

    function alertInfoMessage(message) {
        toastr.options.timeOut = 5000;
        toastr.info(message);
    }

    function alertWarningMessage(message) {
        toastr.options.timeOut = 5000;
        toastr.warning(message);
    }

    function initPageComponent() {
        initToastrComponent();
    }

    /*Init toastr component*/
    function initToastrComponent() {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toastr-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    }

    return {
        initPageComponents: initPageComponent,
        alertSuccessMessage: alertSuccessMessage,
        alertErrorMessage: alertErrorMessage,
        alertInfoMessage: alertInfoMessage,
        alertWarningMessage: alertWarningMessage
    }
})();

function searchClient(id, url) {
    $(id).select2({
        ajax: {
            url: url,
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    id: params.term
                };
            },
            processResults: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    var res = data[i];
                    var obj = {
                        "id": res['number'],
                        "text": res['comment']
                    };
                    arr.push(obj);
                }
                return {
                    results: arr
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 1,
        language: "zh-CN",
        placeholder: '请选择设备',
        allowClear: true
    }).on("select2:select", function (event) {
        var realSelected = event.params.data.id;
        var selected = $(id).select2("data");
        // console.log(selected[0] && selected[0].text);
        // console.log(realSelected);
    }).on("select2:unselect", function (event) {
        $(this).val(null).trigger('change');
    });
}

Date.prototype.Format = function (fmt) {
    var o = {
        "m+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "i+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// 返回距离某一日期指定时间粒度(天或秒)的日期
/*
    num: 可以为正负数
    type: 时间粒度
 */
Date.prototype.dateAfter = function (num, type) {
    num = (num == null ? 1 : num);
    if (typeof(num) != 'number') {
        throw new Error(-1, "dateAfterDays(num,type)的num参数为数值类型.");
    }
    var index = 0;
    switch(type){
        case 'day':
            index = 3;
            break;
        case 'hour':
            index = 2;
            break;
        case 'minute':
            index = 1;
        default:
            index = 0;
            break;
    }
    var arr = [1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000];
    return new Date(this.valueOf() + num * arr[index]);
};

Date.prototype.isLeapYear = function () {
    var year = this.getFullYear();
    return (0 == year % 4 && year % 100 != 0 || year % 400 == 0);
};

Date.prototype.getCurrentWeek = function () {
    var time, week;
    var checkDate = this;
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    time = checkDate.getTime();
    checkDate.setMonth(0);
    checkDate.setDate(1);
    var year = new Date(time).getFullYear();
    week = Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    return year + "年第" + week + "周";
};

function prepareCandidateDevices(id, isMutiple) {
    $(id).select2({
        ajax: {
            url: '/device/findAll',
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    id: params.term
                };
            },
            processResults: function (data, page) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    var res = data[i];
                    var obj = {
                        "id": res['number'],
                        "text": res['comment']
                    };
                    arr.push(obj);
                }
                return {
                    results: arr
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        multiple: isMutiple,
        language: "zh-CN",
        placeholder: '请选择设备',
        maximumSelectionLength: 5,
        allowClear: true
    });
}

function getYAxisName(type) {
    if(type == '温度' || type.indexOf('Temp') > -1){
        return '温度(℃)';
    }else {
        if(type.indexOf('Humid') > -1){
            return '湿度(%)';
        }else if(type.indexOf('Gas') > -1){
            return '氨气浓度(%)';
        }else{
            return type + '(%)';
        }
    }
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    if(isNaN(arg1) || isNaN(arg2)){
        return '--';
    }
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显, 这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1减去arg2的精确结果
 **/
function accSub(arg1, arg2) {
    if(isNaN(arg1) || isNaN(arg2)){
        return '--';
    }
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function accMul(arg1, arg2) {
    if(isNaN(arg1) || isNaN(arg2)){
        return '--';
    }
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function accDiv(arg1, arg2) {
    if(isNaN(arg1) || isNaN(arg2)){
        return '--';
    }
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

