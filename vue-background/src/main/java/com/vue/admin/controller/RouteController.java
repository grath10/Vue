package com.vue.admin.controller;

import com.vue.admin.entity.Device;
import com.vue.admin.entity.LogBean;
import com.vue.admin.entity.MenuItem;
import com.vue.admin.entity.SystemUser;
import com.vue.admin.service.DeviceService;
import com.vue.admin.service.MenuService;
import com.vue.admin.service.UserService;
import com.vue.admin.service.WarningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class RouteController {
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private WarningService warningService;
    @Autowired
    private UserService userService;
    @Autowired
    private MenuService menuService;
    private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @RequestMapping(value = "home")
    public String home(Model model) {
        String today = "2017-11-28";
        String startTime = today + " 00:00:00";
        String endTime = today + " 23:59:59";
        List<LogBean> shownList = warningService.getLogs(startTime, endTime);
        // 获取温度、湿度、氨气平均值、最大值、最小值(**设备)
        model.addAttribute("temp", "24.8℃");
        model.addAttribute("humidity", "71.6%");
        model.addAttribute("gas", "0.8%");
        model.addAttribute("logList", shownList);
        List<Device> deviceList = deviceService.getWholeDevices();
        model.addAttribute("deviceList", deviceList);
        return "home";
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public Map<String, Object> login(@RequestBody Map<String, String> paramsMap) {
        String username = paramsMap.get("username");
        String password = paramsMap.get("password");
        boolean isExist = userService.isValidUser(username, password);
        Map<String, Object> resultMap = new HashMap<>();
        if(isExist){
            SystemUser user = new SystemUser();
            user.setToken(username);
            resultMap.put("user", user);
            List<SystemUser> userList = userService.findUserByName(username);
            SystemUser sysUser = userList.get(0);
            int roleId = sysUser.getRoleId();
            List<MenuItem> menuItems = menuService.getMenusByRoleId(roleId);
            resultMap.put("menus", menuItems);
        }
        resultMap.put("flag", isExist);
        return resultMap;
    }

    @GetMapping("logout")
    public String logout() {
        return "success";
    }

    @RequestMapping("/menu")
    public List<MenuItem> getMenus(@RequestParam("roleId")String roleId){
        int roleNo = Integer.parseInt(roleId);
        return menuService.getMenusByRoleId(roleNo);
    }
}