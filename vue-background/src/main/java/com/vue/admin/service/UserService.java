package com.vue.admin.service;

import com.vue.admin.entity.SystemUser;
import com.vue.admin.mapper.SysUserMapper;
import com.vue.admin.tools.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private SysUserMapper userMapper;
    @Autowired
    private Md5PasswordEncoder encoder;

    public List<SystemUser> findUserByName(String name){
        return userMapper.select(name);
    }

    public List<SystemUser> getUserDetailsByName(String name){
        return userMapper.getUserDetailsByName(name);
    }

    public boolean isValidUser(String name, String password){
        boolean isValid = false;
        List<SystemUser> userList = findUserByName(name);
        if(!CommonUtils.isEmpty(userList)){
            SystemUser user = userList.get(0);
            String passwordInDB = user.getPassword();
            if(encoder.isPasswordValid(passwordInDB, password, name)){
                isValid = true;
            }
        }
        return isValid;
    }
}
