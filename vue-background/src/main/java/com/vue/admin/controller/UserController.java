package com.vue.admin.controller;

import com.github.pagehelper.PageHelper;
import com.vue.admin.entity.SystemUser;
import com.vue.admin.entity.TableBean;
import com.vue.admin.entity.User;
import com.vue.admin.mapper.SysUserMapper;
import com.vue.admin.service.UserService;
import com.vue.admin.tools.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private SysUserMapper userMapper;
    @Autowired
    private Md5PasswordEncoder encoder;
    @Autowired
    private UserService userService;

    @RequestMapping("/info")
    public SystemUser getUserDetail(@RequestParam("token") String token){
        List<SystemUser> userList = userService.getUserDetailsByName(token);
        User customer = null;
        if(!CommonUtils.isEmpty(userList)){
            customer = new User();
            SystemUser user = userList.get(0);
            customer.setUsername(token);
            customer.setRoleId(user.getRoleId());
            customer.setRole(user.getRole());
            customer.setAvatar("https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif");
        }
        return customer;
    }

    @RequestMapping("/query")
    public TableBean getUserInfo(HttpServletRequest request) {
//        String dir = request.getParameter("dir");
//        String column = request.getParameter("orderColumn");
        String start = request.getParameter("page");
        String page = request.getParameter("limit");
        int startPage = Integer.parseInt(start);
        int pageSize = Integer.parseInt(page);
        PageHelper.startPage(startPage, pageSize);
        List<SystemUser> userList = userMapper.getUserDetails();
        TableBean dt = new TableBean();
        dt.setTotal(userList.size());
        dt.setList(userList);
        return dt;
    }

    @RequestMapping("/querySingle")
    public SystemUser getSomeUserInfo(@RequestParam("id") String id) {
        return userMapper.getOneUserDetail(id);
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public String saveUser(@RequestBody Map<String, String> paramMap) {
        String name = paramMap.get("username");
        String password = paramMap.get("password");
        String type = paramMap.get("type");
        String roleId = paramMap.get("roleId");
        int role = Integer.parseInt(roleId);
        String encodedPassword = encoder.encodePassword(password, name);
        SystemUser user = new SystemUser(name, encodedPassword, role);
        String msg = "failure";
        int number = 0;
        if ("create".equals(type)) {
            number = userMapper.countUserByName(name);
            if (number > 0) {
                msg = "duplicated";
            } else {
                int size = userMapper.insertUser(user);
                if (size > 0) {
                    msg = "success";
                }
            }
        } else if ("update".equals(type)) {
            number = userMapper.updateUser(user);
            if (number > 0) {
                msg = "success";
            }
        }
        return msg;
    }

    @RequestMapping("/delete")
    public String deleteUser(@RequestParam("id") String id) {
        String msg = "failure";
        int index = Integer.valueOf(id);
        int size = userMapper.deleteUser(index);
        if (size > 0) {
            msg = "success";
        }
        return msg;
    }
}
