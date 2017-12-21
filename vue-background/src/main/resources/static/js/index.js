$(function () {
    var today = '2017-11-28' || new Date().Format('yyyy-mm-dd');
    fetchData(today);
    $("#home-perf-type").on('change', function () {
        return fetchData(today);
    });
    $("#home-device").on('change', function () {
        return fetchData(today);
    });
});

function createOption(type, obj) {
    /*var option = {
        backgroundColor: '#fff',
        animation: false,
        title: {
            show: false
        },
        legend: {
            data: [type + '最大值', type + '最小值', type + '平均值'],
            top: 'top',
            left: 'center'
        },
        grid: {
            borderWidth: 0,
            top: '15%',
            bottom: '15%',
            // textStyle: {
            //     color: #fff
            // }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            // backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            /!*formatter: function (params, ticket, callback) {
                if (params[0]) {
                    return params[0].seriesName + : + params[0].value;
                }
            }*!/
        },
        axisPointer: {
            link: {
                xAxisIndex: 'all'
            },
            label: {
                backgroundColor: '#777'
            }
        },
        xAxis: [{
            type: 'category',
            data: xAxisArr.splice(0,3),
            scale: true,
            boundaryGap : false,
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
            axisLabel: {
                interval: 0
            }
        }],
        yAxis: [{
            type: 'value',
            scale: true,
            splitLine: {
                show: false
            },
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
            name: type + '最大值',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 25,
            barGap: '20%',
            data: [1.2,3.4,7.3,9.4],
            itemStyle: {
                normal: {
                    color: #1F77B4,
                    label: {
                        show: true,
                        textStyle: {
                            color: #fff
                        },
                        position: 'insideTop',
                        formatter: function(p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            }
        },{
            name: type + '最小值',
            type: 'bar',
            stack: 'total',
            barMaxWidth: 25,
            barGap: '20%',
            data: [1.1,3.2,6.3,8.4],
            itemStyle: {
                normal: {
                    color: 'rgba(0,0,0,0)',
                    label: {
                        show: true,
                        textStyle: {
                            color: #fff
                        },
                        position: 'insideTop',
                        formatter: function(p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            }
        },{
            name: type + '平均值',
            type: 'line',
            stack: 'total',
            symbolSize: 8,
            symbol: 'circle',
            // data: avgArr,
            data: [5,6.3,7.4,3.5],
            smooth: true,
            itemStyle: {
                normal: {
                    color: '#6ca7e2',
                    barBorderRadius: 0,
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function(p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
        }]
    };*/

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
                        if(i == 1){
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
            axisLine: {
                lineStyle: {
                    color: '#90979c'
                }
            },
            name: getYAxisName(type),
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
            symbol: 'circle',
            itemStyle: {
                normal: {
                    color: '#6ca7e2',
                    barBorderRadius: 0,
                    label: {
                        show: false,
                        position: 'top',
                        formatter: function (p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            data: obj.avgArr
        }]
    };
    return option;
}

function drawChart(typeName, obj) {
    var option = createOption(typeName, obj);
    var chart = echarts.init(document.getElementById('chartOne'));
    chart.setOption(option);
}

function fetchData(today) {
    var type = $("#home-perf-type").val();
    var device = $("#home-device").val();
    if (device == null) {
        alert('请选择设备');
        return;
    }
    var typeName = $("#home-perf-type").find('option:selected').html();
    $.ajax({
        url: '/history/query',
        data: {
            type: type,
            device: device,
            startTime: today + " 00:00:00",
            endTime: today + " 23:59:59"
        },
        type: 'get',
        async: false,
        success: function (response) {
            var xAxisArr = [];
            var values = [];
            var lineValues = [];
            var minValues = [];
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
            drawChart(typeName, obj);
            getDataTableDetails(today);
        },
        error: function () {
            console.error('数据获取失败');
        }
    });
}

function getDataTableDetails(today) {
    var $table = $('#home-history-table');
    var device = $("#home-device").val();
    var table = $table.DataTable({
        lengthChange: false,
        destroy: true,
        iDisplayLength: 24,  //每页显示24条数据
        autoWidth: true,   //禁用自动调整列宽
        processing: false,  //隐藏加载提示,自行处理
        serverSide: true,   //启用服务器端分页
        searching: false,
        ajax: function (data, callback, settings) {
            return loadInfo(data, device, callback, settings, today);
        },
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
        order: [[1, 'asc']],
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
        },
        /*"fnRowCallback": function(nRow, aData, iDisplayIndex) {
            $('td:eq(0)', nRow).html(iDisplayIndex+1);
            return nRow;
        }
        "headerCallback": function( thead, data, start, end, display ) {
            $(thead).html("<tr><th rowspan='2'>序号</th><th rowspan='2'>采样时间</th><th colspan='3'>温度</th><th colspan='3'>湿度</th><th colspan='3'>氨气浓度</th></tr>"
                + "<tr><th>均值</th><th>下限值</th><th>上限值</th><th>均值</th><th>下限值</th><th>上限值</th><th>均值</th><th>下限值</th><th>上限值</th></tr>");
        }
        "createdRow": function ( row, data, index ) {
            if(index == 1){
                var innerTh = "<tr><th rowspan='2'>序号</th><th rowspan='2'>采样时间</th><th colspan='3'>温度</th><th colspan='3'>湿度</th><th colspan='3'>氨气浓度</th></tr>"
                    + "<tr><th>均值</th><th>下限值</th><th>上限值</th><th>均值</th><th>下限值</th><th>上限值</th><th>均值</th><th>下限值</th><th>上限值</th></tr>";
                document.getElementById("#home-history-table").insertRow(0);
                var $tr = $("#home-history-table tr").eq(0);
                $tr.after(innerTh);
            }
        }*/
    });
}

function loadInfo(data, device, callback, settings, today) {
    var orderCfg = data['order'][0];
    var column = data['columns'][orderCfg['column']]['data'];
    $.ajax({
        url: '/history/mainTable',
        data: {
            draw: data['draw'],
            dir: orderCfg['dir'],
            pageNum: data['start'],
            pageSize: data['length'],
            orderColumn: column,
            device: device,
            startTime: today + " 00:00:00",
            endTime: today + " 23:59:59"
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
            console.log('查询失败');
        }
    });
}