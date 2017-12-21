package com.vue.admin.controller;

import com.github.pagehelper.PageHelper;
import com.vue.admin.entity.Parameter;
import com.vue.admin.entity.TableBean;
import com.vue.admin.mapper.ParameterMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/parameter")
public class ParameterController {
    @Autowired
    private ParameterMapper parameterMapper;

    @RequestMapping("/query")
    @ResponseBody
    public TableBean getInfo(HttpServletRequest request) {
        String start = request.getParameter("page");
        String page = request.getParameter("limit");
        int currentPage = Integer.parseInt(start);
        int pageSize = Integer.parseInt(page);
        PageHelper.startPage(currentPage, pageSize);
        List<Parameter> paramList = parameterMapper.queryParameters();
        TableBean dt = new TableBean();
        dt.setList(paramList);
        dt.setTotal(paramList.size());
        return dt;
    }

    @RequestMapping("/findOne")
    @ResponseBody
    public List<Parameter> getModuleParams(@RequestParam("name") String type) {
        return parameterMapper.queryParamsByType(type);
    }

    @RequestMapping("/save")
    @ResponseBody
    public String updateModuleInfo(@RequestBody Parameter parameter) {
        return parameterMapper.updateParamInfo(parameter) + "";
    }
}
