package com.vue.admin.mapper;

import com.vue.admin.entity.SystemUser;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SysUserMapper {
    @Select("select username,password,roleId from user where username=#{name}")
    List<SystemUser> select(@Param("name") String username);

    @Select("SELECT count(1) from user where username=#{name}")
    int countUserByName(String name);

    @Insert("INSERT INTO user (username,password,roleId) values(#{username}, #{password}, #{roleId})")
    int insertUser(SystemUser user);

    @Delete("DELETE FROM user where id=#{id}")
    int deleteUser(int id);

    @Update("UPDATE user SET password=#{password}, roleId=#{roleId} where username=#{username}")
    int updateUser(SystemUser user);

    @Select("SELECT a.id,username,password,role,roleId,`desc` from user a left join user_role b on a.roleId=b.id")
    List<SystemUser> getUserDetails();

    @Select("SELECT username,password,role,roleId,`desc` from user a left join user_role b on a.roleId=b.id where username=#{name}")
    List<SystemUser> getUserDetailsByName(String name);

    @Select("SELECT username,password,roleId,`desc` from user a left join user_role b on a.roleId=b.id where a.id=#{id}")
    SystemUser getOneUserDetail(String id);
}