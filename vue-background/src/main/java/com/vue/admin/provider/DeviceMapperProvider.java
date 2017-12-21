package com.vue.admin.provider;

import com.vue.admin.entity.Device;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

public class DeviceMapperProvider {
    public String insertAll(Map<String, List<Device>> params) {
        List<?> deviceList = params.get("list");
        if (deviceList != null) {
            StringBuffer sb = new StringBuffer("insert into hardware (clientid,location,type,protocol,channel,parent) values ");
            MessageFormat messageFormat = new MessageFormat("(#'{'list[{0}].clientid}, #'{'list[{0}].location},#'{'list[{0}].type},#'{'list[{0}].protocol},#'{'list[{0}].channel},#'{'list[{0}].parent})");
            int num = deviceList.size();
            for (int i = 0; i < num; i++) {
                sb.append(messageFormat.format(new Object[]{i}));
                if (i < num - 1) {
                    sb.append(",");
                }
            }
            System.out.println(sb.toString());
            return sb.toString();
        }
        return null;
    }
}
