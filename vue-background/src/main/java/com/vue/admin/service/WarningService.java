package com.vue.admin.service;

import com.github.pagehelper.PageHelper;
import com.vue.admin.entity.LogBean;
import com.vue.admin.entity.Warning;
import com.vue.admin.mapper.WarningMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WarningService {
    private static String[] typeArr = new String[]{"上线", "下线", "温度", "湿度", "氨气浓度"};
    @Autowired
    private WarningMapper warningMapper;

    public List<LogBean> getLogs(String startTime, String endTime) {
        PageHelper.startPage(0, 10);
        List<Warning> warnings = warningMapper.getIndexRecords(startTime, endTime);
        List<LogBean> logBeans = new ArrayList<>();
        for (Warning warning : warnings) {
            LogBean logBean = new LogBean();
            int type = warning.getType();
            logBean.setType(getNameByEnum(type));
            String collecttime = warning.getCollecttime();
            String remark = warning.getRemark();
            logBean.setRemark(remark);
            logBean.setCollecttime(collecttime);
            logBean.setDevice(warning.getDevice());
            int level = warning.getLevel();
            logBean.setLevel(level + "");
            logBeans.add(logBean);
        }
        return logBeans;
    }

    private String getNameByEnum(int type) {
        return typeArr[type];
    }

    private String populateLevel(int level) {
        String html = "<div class='";
        String classStyle = "red";
        if (level == 1) {
            classStyle = "green";
        } else if (level == 2) {
            classStyle = "yellow";
        }
        html += classStyle + "'></div>";
        return html;
    }
}
