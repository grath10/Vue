package com.vue.admin.service;

import com.github.pagehelper.PageHelper;
import com.vue.admin.entity.PerfData;
import com.vue.admin.mapper.CollectorMapper;
import com.vue.admin.tools.CommonUtils;
import com.vue.admin.tools.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.Document;
import java.lang.reflect.Method;
import java.util.*;

@Service
public class PerfService {
    @Autowired
    private CollectorMapper collectorMapper;

    public List<PerfData> getCollectedData(String device, String day) {
        Map<String, String> map = new HashMap<>();
        map.put("device", device);
        String startTime = day + DateUtils.START_OF_DAY;
        String endTime = day + DateUtils.END_OF_DAY;
        map.put("startTime", startTime);
        map.put("endTime", endTime);
        map.put("dir", "desc");
        map.put("column", "collecttime");
        return collectorMapper.getValuesByTime(map);
    }

    public List<PerfData> getCollectedDataByType(String[] devices, String day, String perf) {
        Map<String, Object> map = new HashMap<>();
        map.put("device", devices);
        String startTime = day + DateUtils.START_OF_DAY;
        String endTime = day + DateUtils.END_OF_DAY;
        map.put("startTime", startTime);
        map.put("endTime", endTime);
        map.put("type", perf);
        map.put("queryColumn", perf);
        map.put("dir", "desc");
        map.put("order", "collecttime");
        map.put("table", "true");
        return collectorMapper.getValuesByType(map);
    }

    public List<PerfData> getCollectedDataByType(String[] devices, String day, String perf,String column, String order, int pageNum, int pageSize) {
        Map<String, Object> map = new HashMap<>();
        map.put("device", devices);
        String startTime = day + DateUtils.START_OF_DAY;
        String endTime = day + DateUtils.END_OF_DAY;
        map.put("startTime", startTime);
        map.put("endTime", endTime);
        map.put("type", perf);
        map.put("queryColumn", perf);
        map.put("dir", order);
        map.put("column", column);
        map.put("table", "true");
        PageHelper.startPage(pageNum, pageSize);
        return collectorMapper.getValuesByType(map);
    }

    public List<List<String>> formatCollectedDataByType(String device, String day, String perf) {
        String[] devices = device.split(",");
        List<PerfData> perfDataList = getCollectedDataByType(devices, day, perf);
        Map<String, Map<String, String>> dataMap = convertData(perfDataList, perf);
        List<List<String>> dataList = convertToList(dataMap, device);
        return dataList;
    }

    public List<List<String>> formatCollectedData(String device, String day, String[] titles) {
        List<List<String>> dataList = new ArrayList<>();
        List<PerfData> perfDataList = getCollectedData(device, day);
        for (int i = 0; i < perfDataList.size(); i++) {
            PerfData perfData = perfDataList.get(i);
            List<String> list = new ArrayList<>();
            list.add("" + (i + 1));
            for (String name : titles) {
                String value = getValue(perfData, name);
                if (value == null) {
                    value = "--";
                }
                list.add(value);
            }
            dataList.add(list);
        }
        return dataList;
    }

    private String getValue(PerfData perfData, String name) {
        String firstLetter = name.substring(0, 1).toUpperCase();
        String methodName = "get" + firstLetter + name.substring(1);
        String value = null;
        try {
            Method method = perfData.getClass().getMethod(methodName, new Class[]{});
            Object val = method.invoke(perfData, new Class[]{});
            if (val instanceof Document) {
                Double digits = (Double) val;
                value = Double.toString(digits);
            } else {
                value = val.toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return value;
    }

    private Map<String, Map<String, String>> convertData(List<PerfData> dataList, String type) {
        Map<String, Map<String, String>> dataMap = new LinkedHashMap<>();
        for (PerfData perf : dataList) {
            String collectTime = perf.getCollecttime();
            String oneDevice = perf.getDevice();
            String value = CommonUtils.getValueByType(perf, type);
            Map<String, String> map = dataMap.get(collectTime);
            if (map == null) {
                map = new HashMap<>();
            }
            map.put(oneDevice, value);
            dataMap.put(collectTime, map);
        }
        return dataMap;
    }

    private List<List<String>> convertToList(Map<String, Map<String, String>> map, String device) {
        String[] deviceArray = device.split(",");
        List<String> deviceList = Arrays.asList(deviceArray);
        List<List<String>> returnList = new ArrayList<>();
        for (Map.Entry<String, Map<String, String>> entry : map.entrySet()) {
            String collectTime = entry.getKey();
            Map<String, String> dataMap = entry.getValue();
            List<String> valueList = CommonUtils.addMultipleValueToList(deviceList, dataMap, collectTime);
            returnList.add(valueList);
        }
        return returnList;
    }
}
