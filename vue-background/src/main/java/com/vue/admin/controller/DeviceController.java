package com.vue.admin.controller;

import com.github.pagehelper.PageHelper;
import com.vue.admin.entity.ChartData;
import com.vue.admin.entity.Device;
import com.vue.admin.entity.PerfData;
import com.vue.admin.entity.TableBean;
import com.vue.admin.mapper.CollectorMapper;
import com.vue.admin.service.DeviceService;
import com.vue.admin.tools.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@RestController
@RequestMapping("/device")
public class DeviceController {
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private CollectorMapper collectorMapper;

    @RequestMapping("/wholeData")
    public List<PerfData> getDevicePerfTableData(HttpServletRequest request) {
        String type = request.getParameter("type");
        String device = request.getParameter("device");
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");
        Map<String, String> map = new HashMap<>();
        map.put("device", device);
        String queryColumn = "avg" + type + ",max" + type + ",min" + type;
        map.put("queryColumn", queryColumn);
        map.put("startTime", startTime);
        map.put("endTime", endTime);
        List<PerfData> dataList = collectorMapper.getCollectValuesByTypeAndTime(map);
        return dataList;
    }

    @RequestMapping("/typeData")
    public List<ChartData> getTypeDataForChart(HttpServletRequest request) {
        String device = request.getParameter("device");
        String type = request.getParameter("type");
        String startTime = request.getParameter("startTime");
        String endTime = request.getParameter("endTime");
        Map<String, Object> map = new HashMap<>();
        String[] deviceArr = null;
        if (device != null) {
            deviceArr = device.split(",");
        }
        map.put("device", deviceArr);
        map.put("queryColumn", type);
        map.put("startTime", startTime);
        map.put("endTime", endTime);
        map.put("type", type);
        List<PerfData> dataList = collectorMapper.getValuesByType(map);
        String queryColumn = "avg(" + type + ")";
        map.put("queryColumn", queryColumn);
        List<PerfData> globalList = collectorMapper.getGlobalValueByType(map);
        ChartData chartData = convertChartData(dataList, device, type);
        List<ChartData> chartDataList = new ArrayList<>();
        Set<String> timeLine = chartData.getxAxis();
        ChartData globalData = convertGlobalChartData(globalList, timeLine, type);
        chartDataList.add(chartData);
        chartDataList.add(globalData);
        return chartDataList;
    }

    private ChartData convertChartData(List<PerfData> dataList, String device, String type) {
        List<List<String>> returnList = new ArrayList<>();
        String[] devices = device.split(",");
        Map<String, Map<String, String>> dataMap = new HashMap<>();
        Set<String> timeLine = new TreeSet<>();
        for (String oneDevice : devices) {
            Map<String, String> map = new HashMap<>();
            for (PerfData perfData : dataList) {
                String foundDevice = perfData.getDevice();
                if (oneDevice.equals(foundDevice)) {
                    String collectTime = perfData.getCollecttime();
                    timeLine.add(collectTime);
                    String value = CommonUtils.getValueByType(perfData, type);
                    map.put(collectTime, value);
                }
            }
            dataMap.put(oneDevice, map);
        }
        for (String oneDevice : devices) {
            Map<String, String> map = dataMap.get(oneDevice);
            List<String> list = new ArrayList<>();
            list = CommonUtils.addValueToList(timeLine, map, list);
            returnList.add(list);
        }
        ChartData chartData = new ChartData();
        chartData.setDataList(returnList);
        chartData.setxAxis(timeLine);
        return chartData;
    }

    private ChartData convertGlobalChartData(List<PerfData> dataList, Set<String> timeLine, String type) {
        List<List<String>> returnList = new ArrayList<>();
        List<String> list = new ArrayList<>();
        for (String timePoint : timeLine) {
            for (PerfData perfData : dataList) {
                String collectTime = perfData.getCollecttime();
                if (timePoint.equals(collectTime)) {
                    String value = CommonUtils.getValueByType(perfData, type);
                    list.add(value);
                }
            }
        }
        returnList.add(list);
        ChartData chartData = new ChartData();
        chartData.setDataList(returnList);
        chartData.setxAxis(timeLine);
        return chartData;
    }

    @RequestMapping("/query")
    public TableBean getDeviceInfo(HttpServletRequest request) {
        String order = request.getParameter("order");
        String orderColumn = request.getParameter("prop");
        int start = Integer.valueOf(request.getParameter("page"));
        int page = Integer.valueOf(request.getParameter("limit"));
        PageHelper.startPage(start, page);
        String dir = "desc";
        if("ascending".equals(order)){
            dir = "asc";
        }
        List<Device> deviceList = deviceService.getDeviceDetails(orderColumn, dir);
        TableBean bean = new TableBean();
        bean.setList(deviceList);
        bean.setTotal(deviceList.size());
        return bean;
    }

    @RequestMapping("/findByFuzzy")
    public List<Device> getFuzzyDevices(@RequestParam("id") String id) {
        return deviceService.getListById(id);
    }

    @RequestMapping("/findOne")
    public Device getDeviceDetail(@RequestParam("id") String id) {
        return deviceService.queryDeviceInfo(id);
    }

    @RequestMapping("/list")
    public List<Device> getAllDevices() {
        return deviceService.getWholeDevices();
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public String processDevice(@RequestBody Map<String, String> map) {
        String type = map.get("type");
        String number = map.get("number");
        String location = map.get("location");
        String comment = map.get("comment");
        Device device = new Device(number, location, comment);
        int rows = 0;
        if ("update".equals(type)) {
            rows = deviceService.updateDevice(device);
        } else if ("create".equals(type)) {
            rows = deviceService.createNewDevice(number, device);
        }
        return rows + "";
    }

    @RequestMapping("/delete")
    public String deleteDevice(@RequestParam("id") String id) {
        return deviceService.deleteOneDevice(id) + "";
    }
}
