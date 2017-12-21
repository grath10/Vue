var isFirst = true;
$(function () {
    $("[data-widget='collapse']").click(function () {
        //Find the box parent........
        var box = $(this).parents(".box").first();
        //Find the body and the footer
        var bf = box.find(".box-body, .box-footer");
        if (!$(this).children().hasClass("fa-plus")) {
            $(this).children(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
            bf.slideUp();
        } else {
            //Convert plus into minus
            $(this).children(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
            bf.slideDown();
        }
    });

    var today = new Date();
    var yesterday = today.dateAfter(-1, 'day');
    $('.form-datetime').datetimepicker({
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        endDate: today,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        showMeridian: false,
        format: 'yyyy-mm-dd',
        pickerPosition: "bottom-left",
        initialDate: yesterday
    });
    debugger;
    $("#date-time-picker").val(yesterday.Format('yyyy-mm-dd'));

    $("#device-history-table").hide();
    var pageType = $("#pageType").val();
    if (pageType == 'device') {
        $('#device-export').chart("/report/export", "#chartForm", function () {
            return getData(pageType, isFirst, true);
        });
        searchClient('#device-id', '/device/fuzzyQuery');
    } else {
        $('#type-export').chart('/report/export', '#chartForm', function () {
            return getData(pageType, isFirst, true);
        });
        prepareCandidateDevices('#type-perf-device', true);
    }
    $("#" + pageType + "-query").on('click', function () {
        return getData(pageType, isFirst);
    });
    $("#device-data-type").on('change', function () {
        return getData(pageType, isFirst);
    });
});

function getData(pageType, isFirst, isBackend) {
    if (pageType == 'device') {
        return getDataByDevice(pageType, isBackend);
    } else if (pageType == 'type') {
        return getDataByType(pageType, isFirst, isBackend);
    }
}

// 根据类型(温度、湿度、氨气浓度××××)获取数据
function getDataByType(pageType, isFirst, isBackend) {
    var deviceArray = $("#type-perf-device").val();
    if (deviceArray == null) {
        alert('请选择设备!');
        return;
    }
    var device = deviceArray.join(',');
    var perf = $("#type-perf-key").val() + $("#type-perf-name").val();
    // var timeRange = $("#dateTimeRange span").html();
    // var timeArr = timeRange.split("~");
    var day = $("#date-time-picker").val();
    $.ajax({
        url: '/device/typeData',
        method: 'get',
        async: false,
        contentType: 'application/json',
        data: {
            'device': device,
            'type': perf,
            'startTime': day + ' 00:00:00',
            'endTime': day + ' 23:59:59'
        },
        success: function (response) {
            return processTypeData(pageType, isFirst, device, perf, response, isBackend);
        }
    });
}

// 根据设备名称获取数据
function getDataByDevice(pageType, isBackend) {
    var device = $("#device-id").val();
    if (device == "" || device == null) {
        alert("请输入设备信息");
        return;
    }
    var type = $("#device-data-type").val();
    var typeName = $("#device-data-type").find("option:selected").html();
    var typeCfg = {
        'type': type,
        'typeName': typeName
    };
    // var timeRange = $("#dateTimeRange span").html();
    // var timeArr = timeRange.split("~");
    var day = $("#date-time-picker").val();
    $.ajax({
        url: '/device/wholeData',
        method: 'get',
        async: false,
        contentType: "application/json",
        data: {
            'device': device,
            'type': type,
            'startTime': day + ' 00:00:00',
            'endTime': day + ' 23:59:59'
        },
        success: function (response) {
            return processData(pageType, device, typeCfg, response, isBackend);
        }
    });
}

function processData(pageType, device, typeCfg, response, isBackend) {
    var xAxisArr = [];
    var values = [];
    var lineValues = [];
    var minValues = [];
    var type = typeCfg['type'];
    for (var i = 0; i < response.length; i++) {
        var responseData = response[i];
        xAxisArr.push(responseData['collecttime']);
        values.push(accSub(responseData['max' + type], responseData['min' + type]));
        lineValues.push(responseData['avg' + type]);
        minValues.push(responseData['min' + type]);
    }
    var obj = {
        xAxisArr: xAxisArr,
        deltaData: values,
        values: minValues,
        avgArr: lineValues
    };
    if(!isBackend){
        drawChart(pageType, typeCfg['typeName'], 'chartDevice', obj, isBackend);
        getDataTableDetails(device, "#device-history-table");
    }else{
        drawChart(pageType, typeCfg['typeName'], 'hiddenChartDevice', obj, isBackend);
    }
}

function processTypeData(pageType, isFirst, device, perf, response, isBackend) {
    var xAxisArr = response[0]['xAxis'];
    var lineValues = response[1]['dataList'];
    var typeValus = response[0]['dataList'];
    var devices = device.split(',');
    var series = [];
    var concatArr = devices.concat('全局');
    var number = concatArr.length;
    for (var i = 0; i < number; i++) {
        var one = {
            name: concatArr[i],
            type: 'line',
            data: i != number - 1 ? typeValus[i] : lineValues[0]
        };
        series.push(one);
    }
    var obj = {
        xAxisArr: xAxisArr,
        legend: concatArr,
        series: series
    };
    // console.log("==========debug=======", JSON.stringify(obj));
    if(!isBackend) {
        drawComparingChart(pageType, perf, 'typeDevice', obj, isBackend);
        getTypeDataTableDetails(isFirst, device, perf, "#type-history-table");
    }else{
        drawComparingChart(pageType, perf, 'hiddenTypeDevice', obj, isBackend);
    }
}

function drawComparingChart(pageType, type, id, obj, isBackend) {
    var option = createComparingOption(type, obj);
    if(isBackend) {
        $("#" + id).show();
        var chart = echarts.init(document.getElementById(id));
        chart.resize();
        chart.setOption(option, true);
        var picBase64Info = chart.getDataURL();
        $("#" + id).hide();
        $("#chartForm").find("input[name='base64Info']").val(picBase64Info);
        var deviceAlias = $("#device-id").find('option:selected').html();
        $("#chartForm").find("input[name='fileName']").val(deviceAlias + "_" + type);
        // $("#chartForm").attr('action', '/report/export');
        // $("#chartForm").submit();
        var params = $('#queryForm').serializeArray();
        $("#chartForm").find("input[name='params']").val($.parseParams(params));
        $("#chartForm").find("input[name='type']").val(pageType);
    }else{
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
    }
}

function drawChart(pageType, type, id, obj, isBackend) {
    var option = createOption(type, obj);
    if(isBackend){
        $("#" + id).show();
        var chart = echarts.init(document.getElementById(id));
        chart.resize();
        chart.setOption(option);
        var picBase64Info = chart.getDataURL();
        $("#" + id).hide();
        $("#chartForm").find("input[name='base64Info']").val(picBase64Info);
        var deviceAlias = $("#device-id").find('option:selected').html();
        $("#chartForm").find("input[name='fileName']").val(deviceAlias + "_" + type);
        // $("#chartForm").attr('action', '/report/export');
        // $("#chartForm").submit();
        var params = $('#queryForm').serialize();
        $("#chartForm").find("input[name='params']").val(params);
        $("#chartForm").find("input[name='type']").val(pageType);
    }else{
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
    }
}

function createOption(type, obj) {
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                textStyle: {
                    color: '#fff'
                }
            },
            formatter: function (params, ticket, callback) {
                var str = "";
                if (params[0]) {
                    str = params[0].name;
                    for (var i = 1; i < params.length; i++) {
                        if (i == 1) {
                            var low = params[i - 1].value;
                            var delta = params[i].value;
                            var high = accAdd(low, delta);
                            str += '<br/>' + params[i].seriesName + ': ' + delta + "(" + low + "~" + high + ")";
                        } else {
                            str += '<br/>' + params[i].seriesName + ': ' + params[i].value;
                        }
                    }
                }
                return str;
            }
        },
        grid: {
            borderWidth: 0,
            top: '25%',
            bottom: '15%',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            x: '30%',
            textStyle: {
                color: '#90979c'
            },
            data: [type + '波动范围', type + '平均值']
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#90979c'
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitArea: {
                show: false
            },
            axisLabel: {
                interval: 0
            },
            data: obj.xAxisArr
        }],
        yAxis: [{
            type: 'value',
            splitLine: {
                show: false
            },
            name: getYAxisName(type),
            axisLine: {
                lineStyle: {
                    color: '#90979c'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0
            },
            splitArea: {
                show: false
            }
        }],
        series: [{
            name: type + '最低值',
            type: 'bar',
            stack: '总数',
            itemStyle: {
                normal: {
                    color: '#FFF',
                    barBorderRadius: 0,
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            data: obj.values
        }, {
            name: type + '波动范围',
            type: 'bar',
            stack: '总数',
            barMaxWidth: 25,
            barGap: '20%',
            itemStyle: {
                normal: {
                    color: '#1F77B4',
                    label: {
                        show: false,
                        textStyle: {
                            color: '#fff'
                        },
                        position: 'insideTop',
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            data: obj.deltaData
        }, {
            name: type + '平均值',
            type: 'line',
            // symbolSize: 8,
            // symbol: 'circle',
            itemStyle: {
                normal: {
                    color: '#6ca7e2',
                    label: {
                        show: false,
                        position: 'top',
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            lineStyle: {
                normal: {
                    width: 3
                }
            },
            data: obj.avgArr
        }]
    };
    return option;
}

function createComparingOption(type, obj) {
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var str = "";
                if (params[0]) {
                    str = params[0].name;
                    for (var i = 0; i < params.length; i++) {
                        str += '<br/>' + params[i].seriesName + ': ' + params[i].value;
                    }
                }
                return str;
            }
        },
        grid: {
            borderWidth: 0,
            top: '25%',
            bottom: '15%',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            x: '30%',
            textStyle: {
                color: '#90979c'
            },
            data: obj.legend
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            axisLine: {
                lineStyle: {
                    color: '#90979c'
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitArea: {
                show: false
            },
            axisLabel: {
                interval: 0
            },
            data: obj.xAxisArr
        }],
        yAxis: [{
            type: 'value',
            splitLine: {
                show: false
            },
            scale: true,
            name: getYAxisName(type),
            axisLine: {
                lineStyle: {
                    color: '#90979c'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0
            },
            splitArea: {
                show: false
            }
        }],
        series: obj.series
    };
    return option;
}

function getDataTableDetails(device, tableID) {
    $("#device-history-table").show();
    var $table = $(tableID);
    var table = $table.DataTable({
        lengthChange: false,
        destroy: true,
        iDisplayLength: 10,  //每页显示10条数据
        autoWidth: true,   //禁用自动调整列宽
        processing: false,  //隐藏加载提示,自行处理
        serverSide: true,   //启用服务器端分页
        searching: false,
        ajax: function (data, callback, settings) {
            return loadInfo(data, device, callback, settings);
        },
        order: [[1, 'asc']],
        columns: [{
            className: 'text-center'
        }, {
            className: 'text-center',
            data: 'collecttime'
        }, {
            className: 'text-center',
            data: 'avgTemp'
        }, {
            className: 'text-center',
            data: 'maxTemp'
        }, {
            className: 'text-center',
            data: 'minTemp'
        }, {
            className: 'text-center',
            data: 'avgHumid'
        }, {
            className: 'text-center',
            data: 'maxHumid'
        }, {
            className: 'text-center',
            data: 'minHumid'
        }, {
            className: 'text-center',
            data: 'avgGas'
        }, {
            className: 'text-center',
            data: 'maxGas'
        }, {
            className: 'text-center',
            data: 'minGas'
        }],
        columnDefs: [{
            targets: 0,
            searchable: false,
            orderable: false,
            data: null,
            defaultContent: ''
        }],
        language: {
            url: '/i18n/Chinese.lang'
        },
        "fnDrawCallback": function () {
            this.api().column(0).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }
    });
}

function getTypeColumns(deviceList) {
    var header = ["index", "collecttime"];
    var columns = [{
        className: 'text-center'
    }, {
        className: 'text-center',
        title: '采集时间'
    }];
    for (var i = 0; i < deviceList.length; i++) {
        var column = {
            className: 'text-center',
            title: deviceList[i],
            orderable: false
        };
        columns.push(column);
        header.push(deviceList[i]);
    }
    return {
        columns: columns,
        header: header
    };
}

function getTypeDataTableDetails(isFirst, device, type, tableID) {
    var $table = $(tableID);
    var deviceList = device.split(',');
    var columnCfg = getTypeColumns(deviceList);
    if ($.fn.DataTable.isDataTable(tableID)) {
        // if(!isFirst){
        $(tableID).DataTable().destroy();
        $(tableID).empty();
    }
    var table = $table.DataTable({
        lengthChange: false,
        destroy: true,
        iDisplayLength: 10,  //每页显示10条数据
        autoWidth: true,   //禁用自动调整列宽
        processing: false,  //隐藏加载提示,自行处理
        serverSide: true,   //启用服务器端分页
        searching: false,
        ajax: function (data, callback, settings) {
            return loadTypeBasedInfo(data, device, type, callback, settings, columnCfg['header']);
        },
        order: [[1, 'asc']],
        columns: columnCfg['columns'],
        columnDefs: [{
            targets: 0,
            searchable: false,
            orderable: false,
            data: null,
            defaultContent: ''
        }],
        language: {
            url: '/i18n/Chinese.lang'
        },
        "fnDrawCallback": function () {
            this.api().column(0).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }
    });
}

function loadInfo(data, device, callback, settings) {
    var orderCfg = data['order'][0];
    var column = data['columns'][orderCfg['column']]['data'];
    var day = $("#date-time-picker").val();
    $.ajax({
        url: '/history/mainTable',
        data: {
            draw: data['draw'],
            dir: orderCfg['dir'],
            pageNum: data['start'],
            pageSize: data['length'],
            orderColumn: column,
            device: device,
            startTime: day + ' 00:00:00',
            endTime: day + ' 23:59:59'
        },
        type: 'get',
        async: false,
        success: function (response) {
            var returnData = {
                draw: response.draw,
                recordsTotal: response['total'],
                recordsFiltered: response['total'],
                data: response.list
            };
            callback(returnData);
        },
        error: function () {
            console.error('查询失败');
        }
    });
}

function loadTypeBasedInfo(data, device, type, callback, settings, header) {
    var orderCfg = data['order'][0];
    var day = $("#date-time-picker").val();
    var column = type;
    if (orderCfg['column'] == 1) {
        column = header[orderCfg['column']];
    }
    $.ajax({
        url: '/history/deviceTypeTable',
        data: {
            draw: data['draw'],
            dir: orderCfg['dir'],
            pageNum: data['start'],
            pageSize: data['length'],
            type: type,
            orderColumn: column,
            device: device,
            startTime: day + ' 00:00:00',
            endTime: day + ' 23:59:59'
        },
        type: 'GET',
        async: false,
        success: function (response) {
            var returnData = {};
            returnData.draw = response.draw;
            returnData.recordsTotal = response['total'];
            returnData.recordsFiltered = response['total'];
            returnData.data = response.list;
            callback(returnData);
            isFirst = false;
        },
        error: function () {
            console.log('查询失败');
        }
    });
}

/*
function deprecated() {
    var start = moment().subtract(1, 'hours');
    var end = moment();
    function cb(start, end) {
        $('#dateTimeRange span').html(start.format('YYYY-MM-DD HH') + '~' + end.format('YYYY-MM-DD HH'));
    }

    $("#dateTimeRange").daterangepicker({
        startDate: start,
        endDate: end,
        maxDate: moment(), //最大时间
        // dateLimit : {
        //     days : 30
        // }, //起止时间的最大间隔
        showDropdowns: true,
        showWeekNumbers: false, //是否显示第几周
        timePicker: false, //是否显示小时和分钟
        timePickerIncrement: 60, //时间的增量，单位为分钟
        timePicker24Hour: true, //是否使用24小时制显示时间
        /!*ranges : {
            '最近1小时': [moment().subtract(1, 'hours'), moment()],
            '今日': [moment().startOf('day'), moment()],
            '昨日': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')]
            // '最近7日': [moment().subtract(6, 'days'), moment()],
            // '最近30日': [moment().subtract(29, 'days'), moment()]
        },*!/
        opens: 'right', //日期选择框的弹出位置
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary blue',
        cancelClass: 'btn-small',
        locale: {
            applyLabel: '确定',
            cancelLabel: '取消',
            fromLabel: '起始时间',
            toLabel: '结束时间',
            customRangeLabel: '自定义',
            daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            firstDay: 1
        }
    }, cb);
    cb(start, end);
}*/
