package com.vue.admin.mapper;

import com.vue.admin.entity.MenuItem;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface MenuMapper {
    @Select("select a.id,a.name,a.directory,a.path,a.parent from menu a left join permission b on a.id=b.menuId where roleId=#{roleId}")
    List<MenuItem> getMenuItems(int roleId);
}
