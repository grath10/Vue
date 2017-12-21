package com.vue.admin.controller;

import com.github.pagehelper.PageHelper;
import com.vue.admin.entity.CollectData;
import com.vue.admin.entity.LogBean;
import com.vue.admin.entity.PerfData;
import com.vue.admin.entity.TableBean;
import com.vue.admin.mapper.CollectorMapper;
import com.vue.admin.service.PerfService;
import com.vue.admin.service.WarningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RequestMapping("/history")
@RestController
public class HistoricDataController {
    @Autowired
    private CollectorMapper collectorMapper;
    @Autowired
    private PerfService perfService;
    @Autowired
    private WarningService warningService;

    // 首页显示系统日志
    @RequestMapping("/record")
    public List<LogBean> getLogsForMain(){
        Date date = new Date();
        String today = "2017-11-28";
        String startTime = today + " 00:00:00";
        String endTime = today + " 23:59:59";
        return warningService.getLogs(startTime, endTime);
    }

    @RequestMapping("/queryDetails")
    public Map<String, Object> getDataForTableChart(HttpServletRequest request){
        Map<String, Object> returnMap = new HashMap<>();
        String type = request.getParameter("type");
        String device = request.getParameter("device");
//        String startTime = request.getParameter("startTime");
//        String endTime = request.getParameter("endTime");
        String startTime = "2017-11-28 00:00:00";
        String endTime = "2017-11-28 23:59:59";
        String dir = "desc";
        String column = "collecttime";
        int start = Integer.valueOf(request.getParameter("page"));
        int page = Integer.valueOf(request.getParameter("limit"));
        Map<String, String> map = new HashMap<>();
        map.put("device", device);
        map.put("type", type);
        map.put("startTime", startTime);
        map.put("endTime", endTime);
        map.put("queryColumn", "avg" + type + ",max" + type + ",min" + type);
        List<PerfData> dataList = collectorMapper.getCollectValuesByTypeAndTime(map);
        returnMap.put("chart", dataList);
        map.put("dir", dir);
        map.put("column", column);
        PageHelper.startPage(start, page);
        List<PerfData> tableDataList = collectorMapper.getValuesByTime(map);
        TableBean bean = new TableBean();
        bean.setList(tableDataList);
        int total = tableDataList.size();
        bean.setTotal(total);
        returnMap.put("table", bean);
        return returnMap;
    }

    // 首页展示曲线图
    @RequestMapping("/query")
    public List<PerfData> getDisplayData(HttpServletRequest request) {
        String type = request.getParameter("type");
        String device = request.getParameter("device");
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");
        Map<String, String> map = new HashMap<>();
        map.put("device", device);
        map.put("type", type);
        map.put("startTime", startTime);
        map.put("endTime", endTime);
        map.put("queryColumn", "avg" + type + ",max" + type + ",min" + type);
        List<PerfData> dataList = collectorMapper.getCollectValuesByTypeAndTime(map);
        return dataList;
    }

    // 首页表格展示、按设备查看表格展示
    @RequestMapping("/mainTable")
    @ResponseBody
    public TableBean getHomeTableData(HttpServletRequest request) {
        String device = request.getParameter("device");
        String dir = request.getParameter("dir");
        String column = request.getParameter("orderColumn");
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");
        int start = Integer.valueOf(request.getParameter("pageNum"));
        int page = Integer.valueOf(request.getParameter("pageSize"));
        Map<String, String> map = new HashMap<>();
        map.put("device", device);
        map.put("startTime", startTime);
        map.put("endTime", endTime);
        map.put("dir", dir);
        map.put("column", column);
        PageHelper.startPage(start, page);
        List<PerfData> dataList = collectorMapper.getValuesByTime(map);
        TableBean bean = new TableBean();
        bean.setList(dataList);
        int total = dataList.size();
        bean.setTotal(total);
        return bean;
    }

    // 温度(均值、上限值、下限值)
    // 湿度(均值、上限值、下限值)
    // 氨气浓度(均值、上限值、下限值)
    private List<List<String>> processData(List<CollectData> dataList) {
        Map<String, String[]> dataMap = new HashMap<>();
        for (CollectData collectData : dataList) {
            String collectTime = collectData.getCollecttime();
            String type = collectData.getType();
            String[] arr = dataMap.get(collectTime);
            if (arr == null) {
                arr = new String[9];
            } else {
                arr = convertMultipleData(arr, type, collectData);
            }
            dataMap.put(collectTime, arr);
        }
        return new ArrayList<>();
    }

    private String[] convertMultipleData(String[] arr, String type, CollectData collectData) {
        double avg = collectData.getValueAvg();
        double max = collectData.getValueMax();
        double min = collectData.getValueMin();
        int i = 0;
        if ("humid".equals(type)) {
            i = 3;
        } else if ("gas".equals(type)) {
            i = 6;
        }
        arr[i++] = avg + "";
        arr[i++] = max + "";
        arr[i++] = min + "";
        return arr;
    }

    //  按类型查看数据中间曲线图展示
    @RequestMapping("/historyData")
    @ResponseBody
    public List<PerfData> getHistory(HttpServletRequest request) {
        String device = request.getParameter("device");
        String startTime = request.getParameter("startTime");
        String type = request.getParameter("type");
        String endTime = request.getParameter("endTime");
        Map<String, String> map = new HashMap<>();
        map.put("device", device);
        map.put("startTime", startTime);
        map.put("endTime", endTime);
        map.put("type", type);
        map.put("queryColumn", "avg" + type + ",max" + type + ",min" + type);
        return collectorMapper.getCollectValuesByTypeAndTime(map);
    }

    // 按类型查看数据表格
    // TO-DO：按照类型查看，翻页及排序功能待增强
    @RequestMapping("/deviceTypeTable")
    @ResponseBody
    public TableBean getHistoryDataByType(HttpServletRequest request) {
        String order = request.getParameter("orderColumn");
        String dir = request.getParameter("dir");
        String pageNum = request.getParameter("pageNum");
        String pageSize = request.getParameter("pageSize");
        String device = request.getParameter("device");
        String startTime = request.getParameter("startTime");
        String type = request.getParameter("type");
        String endTime = request.getParameter("endTime");
//        int currentPage = Integer.parseInt(pageNum);
//        int page = Integer.parseInt(pageSize);
        // PageHelper.startPage(currentPage, page);
        TableBean dt = new TableBean();
        String[] dateArr = startTime.split(" ");
        List<List<String>> dataList = perfService.formatCollectedDataByType(device, dateArr[0], type);
        dt.setList(dataList);
        dt.setTotal(dataList.size());
        return dt;
    }

    // 按类型查看数据表格
    // TO-DO：按照类型查看，翻页及排序功能待增强
//    @RequestMapping("/deviceTypeTable")
//    @ResponseBody
//    public TableBean getHistoryDataByType(HttpServletRequest request) {
//        String draw = request.getParameter("draw");
//        String order = request.getParameter("orderColumn");
//        String dir = request.getParameter("dir");
//        String pageNum = request.getParameter("pageNum");
//        String pageSize = request.getParameter("pageSize");
//        String device = request.getParameter("device");
//        String startTime = request.getParameter("startTime");
//        String type = request.getParameter("type");
//        String endTime = request.getParameter("endTime");
////        int currentPage = Integer.parseInt(pageNum);
////        int page = Integer.parseInt(pageSize);
//        Map<String, Object> map = new HashMap<>();
//        String[] deviceArr = device.split(",");
//        map.put("device", deviceArr);
//        map.put("startTime", startTime);
//        map.put("endTime", endTime);
//        map.put("type", type);
//        map.put("dir", dir);
//        map.put("order", order);
//        map.put("queryColumn", type);
//        map.put("table", "true");
//        // PageHelper.startPage(currentPage, page);
//        TableBean dt = new TableBean();
//        List<PerfData> perfList = collectorMapper.getValuesByType(map);
//        Map<String, Map<String, String>> dataMap = convertData(perfList, type);
//        List<List<String>> dataList = convertToList(dataMap, device);
//        perfService.formatCollectedDataByType(device, day, type);
//        dt.setDraw(draw);
//        dt.setList(dataList);
//        dt.setTotal(dataList.size());
//        return dt;
//    }
}
