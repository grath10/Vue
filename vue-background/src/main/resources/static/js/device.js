$(function () {
    getDtDetails('#device-table');
    $("#create-device-commit").click(function () {
        return saveDevices("create");
    });
    $("#update-device-commit").click(function () {
        return saveDevices("update");
    });
    $("#device-remove").click(removeDevice);
});

function saveDevices(type) {
    var modalId = "#" + type + "DevicePanel";
    var number = $("#" + type + "-device-number").val();
    var location = $("#" + type + "-device-location").val();
    var comment = $("#" + type + "-device-comment").val();
    var obj = {
        'number': number,
        'location': location,
        'comment': comment,
        'type': type
    };
    $.ajax({
        url: '/device/save',
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(obj),
        success: function (data) {
            if (data != "-1") {
                alert('更新成功');
                $(modalId).modal('hide');
                // 刷新表格数据
                getDtDetails('#device-table');
            } else {
                alert("新增设备失败，信息重复");
            }
        }
    });
}

function getDtDetails(id) {
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
            return loadDeviceInfo(data, callback, settings);
        },
        columns: [{
            title: "选项",
            data: 'id'
        }, {
            title: "编号",
            data: 'number',
            className: "text-center"
        }, {
            title: "位置",
            data: 'location',
            className: "text-center"
        }, {
            title: "备注",
            data: 'comment',
            className: "text-center"
        }],
        order: [[1, "asc"]],
        columnDefs: [{
            "targets": 0,
            "searchable": false,
            'orderable': false,
            'className': 'text-center',
            'render': function (data, type, full, meta) {
                return '<input type="checkbox" id="' + data + '"/>';
            }
        }, {
            "targets": 1,
            'render': function (data, type, full, meta) {
                // console.log(".....", full);
                return "<a class='pointer' data-target='#updateDevicePanel' onclick='showModifyPanel(\"" + full['id'] + "\")'>" + data + "</a>";
            }
        }],
        language: {
            url: '/i18n/Chinese.lang'
        }
    });
}

function loadDeviceInfo(data, callback, settings) {
    var orderCfg = data['order'][0];
    $.ajax({
        url: '/device/query',
        data: {
            draw: data['draw'],
            dir: orderCfg['dir'],
            startIndex: data['start'],
            pageSize: data['length'],
            orderColumn: data['columns'][orderCfg['column']]['data']
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

function showModifyPanel(id) {
    $.ajax({
        url: '/device/findOne',
        method: 'get',
        async: false,
        contentType: "application/json",
        data: {
            id: id
        },
        success: function (response) {
            for (var key in response) {
                $("#update-device-" + key).val(response[key]);
                if (key == 'number') {
                    $("#update-device-" + key).attr("disabled", "disabled");
                }
            }
            $('#updateDevicePanel').modal('show');
        }
    });
}

function removeDevice() {
    var $checkboxes = $("input[type='checkbox']:checked");
    var boxes = $checkboxes.length;
    if (boxes != 1) {
        alert("请选择一条记录！");
        return;
    }
    var id = $checkboxes[0].id;
    $.ajax({
        url: '/device/delete',
        data: {
            "id": id
        },
        async: false,
        success: function (response) {
            if (response > 0) {
                alert("删除成功");
                getDtDetails('#device-table');
            } else {
                alert("删除操作出错");
            }
        }
    });
}