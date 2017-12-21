package com.vue.admin.service;

import com.vue.admin.entity.MenuItem;
import com.vue.admin.mapper.MenuMapper;
import com.vue.admin.tools.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MenuService {
    @Autowired
    private MenuMapper menuMapper;

    public List<MenuItem> getMenusByRoleId(int roleId) {
        List<MenuItem> itemList = menuMapper.getMenuItems(roleId);
        Map<Integer, List<MenuItem>> menuMap = new HashMap<>();
        if(!CommonUtils.isEmpty(itemList)) {
            for (MenuItem menuItem : itemList) {
                int parent = menuItem.getParent();
                List<MenuItem> menus = menuMap.get(parent);
                if (menus == null) {
                    menus = new ArrayList<>();
                }
                menus.add(menuItem);
                menuMap.put(parent, menus);
            }
        }
        List<MenuItem> firstMenus = getChildren(-1, menuMap);
        return firstMenus;
    }

    // 递归生成子菜单
    private List<MenuItem> getChildren(int menuId, Map<Integer, List<MenuItem>> dataMap){
        List<MenuItem> childrenMenus = dataMap.get(menuId);
        if(childrenMenus == null || childrenMenus.size() == 0){
            return null;
        }
        for(MenuItem menuItem: childrenMenus){
            int id = menuItem.getId();
            List<MenuItem> menuItems = getChildren(id, dataMap);
            menuItem.setChildren(menuItems);
            if(CommonUtils.isEmpty(menuItems)){
                menuItem.setLeaf(true);
            }
        }
        return childrenMenus;
    }

    // 递归生成子菜单
    private List<MenuItem> getChildren(int menuId, Map<Integer, List<MenuItem>> dataMap, List<MenuItem> itemList){
        List<MenuItem> childrenMenus = dataMap.get(menuId);
        if(childrenMenus == null || childrenMenus.size() == 0){
            return null;
        }
        for(MenuItem menuItem: childrenMenus){
            int id = menuItem.getId();
            List<MenuItem> menuItems = getChildren(id, dataMap, itemList);
            menuItem.setChildren(menuItems);
            if(CommonUtils.isEmpty(menuItems)){
                menuItem.setLeaf(true);
            }
        }
        return childrenMenus;
    }
}
