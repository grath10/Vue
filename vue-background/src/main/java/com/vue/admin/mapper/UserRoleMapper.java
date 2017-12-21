package com.vue.admin.mapper;

import com.vue.admin.entity.SystemUser;
import com.vue.admin.entity.UserRole;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface UserRoleMapper {
    @Select("select role,`desc` from user_role where id=#{user.roleId}")
    List<UserRole> getRolesByUser(@Param("user") SystemUser user);
}
