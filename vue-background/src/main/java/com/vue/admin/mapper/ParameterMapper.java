package com.vue.admin.mapper;

import com.vue.admin.entity.Parameter;

import java.util.List;

public interface ParameterMapper {
    List<Parameter> queryParamsByType(String name);

    List<Parameter> queryParameters();

    int updateParamInfo(Parameter parameter);
}
