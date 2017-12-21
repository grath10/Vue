$(function () {
    $("#submitParameter").click(saveChanges);
    getDetails("#parameter-table");
});

function saveChanges() {
    var modalId = "#modifyPanel";
    var name = $("#update-type").val();
    var low = $("#update-low").val();
    var high = $("#update-high").val();
    var obj = {
        "type": name,
        "low": low,
        "high": high
    };
    $.ajax({
        url: '/parameter/save',
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
        success: function (data) {
            alert("更新成功");
            $(modalId).modal('hide');
            // 刷新表格数据
            getDetails("#parameter-table");
        }
    });
}

function getDetails(id) {
    var $table = $(id);
    var table = $table.DataTable({
        lengthChange: false,
        destroy: true,
        iDisplayLength: 10,  //每页显示10条数据
        autoWidth: false,   //禁用自动调整列宽
        processing: false,  //隐藏加载提示,自行处理
        serverSide: true,   //启用服务器端分页
        searching: false,
        ajax: function (data, callback, settings) {
            return loadParamInfo(data, callback, settings);
        },
        columns: [{
            title: "序号",
            data: 'id'
        }, {
            title: "类型",
            data: 'type',
            className: "text-center"
        }, {
            title: "上限阈值",
            data: 'high',
            className: "text-center"
        }, {
            title: "下限阈值",
            data: 'low',
            className: "text-center"
        }],
        order: false,
        columnDefs: [{
            targets: 0,
            searchable: false,
            orderable: false,
            className: 'text-center',
            data: null
        }, {
            "targets": 1,
            'render': function (data, type, full, meta) {
                return "<a class='pointer' data-target='#modifyPanel' onclick='showModifyPanel(\"" + data + "\")'>" + data + "</a>";
            }
        }],
        language: {
            url: '/i18n/Chinese.lang'
        },
        "fnDrawCallback": function () {
            this.api().column(0).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        },
        "createdRow": function (row, data, index) {
            console.log("行信息:", row);
            console.log("数据：", data);
            console.log("序号：", index);
            var kind = data['type'];
            var unit = "%";
            if (kind == '温度') {
                unit = '℃';
            }
            $('td:eq(2)').html($(this).html() + unit);
            $('td:eq(3)').html($(this).html() + unit);
        }
    });
}

function loadParamInfo(data, callback, settings) {
    var orderCfg = data['order'][0];
    $.ajax({
        url: '/parameter/query',
        data: {
            draw: data['draw'],
            start: data['start'],
            page: data['length']
        },
        type: 'get',
        async: false,
        success: function (response) {
            var returnData = {};
            returnData.draw = response.draw;
            returnData.recordsTotal = response.total;
            returnData.recordsFiltered = response.total;
            returnData.data = response.list;
            callback(returnData);
        },
        error: function () {
            console.log('查询失败');
        }
    });
}

function showModifyPanel(name) {
    $.ajax({
        url: '/parameter/querySingle',
        method: 'get',
        async: false,
        contentType: "application/json",
        data: {
            name: name
        },
        success: function (response) {
            var result = response.length;
            for (var i = 0; i < result; i++) {
                var params = response[0];
                for (var key in params) {
                    var value = params[key];
                    $("#update-" + key).val(value);
                    if (key == 'type') {
                        $("#update-" + key).attr("disabled", "disabled");
                    } else {
                        $("#update-" + key).removeAttr("disabled");
                    }
                }
            }
            $("#modifyPanel").modal('show');
        }
    });
}