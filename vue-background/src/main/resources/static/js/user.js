$(function () {
    getUserTable('#user-table');
    $("#create-user-commit").click(function () {
        return saveUser("create");
    });
    $("#update-user-commit").click(function () {
        return saveUser("update");
    });
});

function getUserTable(id) {
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
            return loadUserInfo(data, callback, settings);
        },
        columns: [{
            title: "选项",
            data: 'id'
        }, {
            title: "用户名",
            data: 'username',
            className: "text-center"
        }, {
            title: "角色",
            data: 'desc',
            className: "text-center"
        }],
        // order: [[1, "asc"]],
        order: false,
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
                return "<a class='pointer' data-target='#updateUserPanel' data-toggle='modal' onclick='showModifyPanel(\"" + full['id'] + "\")'>" + data + "</a>";
            }
        }],
        language: {
            url: '/i18n/Chinese.lang'
        }
    });
}

function loadUserInfo(data, callback, settings) {
    var orderCfg = data['order'][0];
    $.ajax({
        url: '/user/query',
        data: {
            draw: data['draw'],
            // dir: orderCfg['dir'],
            startIndex: data['start'],
            pageSize: data['length'],
            // orderColumn: data['columns'][orderCfg['column']]['data']
        },
        type: 'get',
        async: false,
        success: function (response) {
            var returnData = {};
            returnData.draw = response.draw;
            returnData.recordsTotal = response['total'];
            returnData.recordsFiltered = response['total'];
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
        url: '/user/querySingle',
        data: {
            id: id
        },
        async: false,
        success: function (response) {
            $('#update-user-name').val(response['username']).attr('disabled', 'disabled');
            $('#update-user-password').val(response['password']);
            $('#update-user-password').data('defaultpassword', response['password']);
            $('#update-user-role').val(response['roleId']);
        }
    });
}

function saveUser(type) {
    var name = $("#" + type + "-user-name").val();
    var password = $("#" + type + "-user-password").val();
    var password_default = $("#" + type + "-user-password").data('defaultpassword');
    var password_confirm = $("#" + type + "-user-password-confirm").val();
    var role = $("#" + type + "-user-role").val();
    if (name == "" || password == "") {
        alert("用户名、密码不可为空");
        return;
    }
    if (type == 'create' && password != password_confirm) {
        alert("两次输入密码不一致");
        return;
    }
    var obj = {
        username: name,
        password: password,
        roleId: role,
        type: type
    };
    $.ajax({
        url: '/user/save',
        data: JSON.stringify(obj),
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (response) {
            if (response == "success") {
                alert("操作成功");
                // TODO 1.0 - 如果修改密码，则重新登录
                if (type == 'update' && password_default != password) {
                    window.location.href = '/logout';
                }
                $("#" + type + "UserPanel").modal('hide');
                getUserTable("#user-table");
            } else if (response == 'duplicate') {
                alert("用户名已存在");
            } else {
                alert("操作出错");
            }
        }
    });
}

function deleteUser() {
    var checkboxes = $("input[type='checkbox']:checked");
    var boxes = checkboxes.length;
    if (boxes != 1) {
        alert("请选择一条记录！");
        return;
    }
    var id = checkboxes[0].id;
    $.ajax({
        url: '/user/delete',
        data: {
            "id": id
        },
        async: false,
        success: function (response) {
            if (response == "success") {
                alert("删除成功");
                getUserTable('#user-table');
            } else {
                alert("删除操作出错");
            }
        }
    });
}