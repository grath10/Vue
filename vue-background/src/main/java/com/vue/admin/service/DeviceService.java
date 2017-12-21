package com.vue.admin.service;

import com.vue.admin.entity.Device;
import com.vue.admin.mapper.DeviceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService {
    @Autowired
    private DeviceMapper deviceMapper;

    public List<Device> getWholeDevices() {
        return deviceMapper.getAllDevices();
    }

    public List<Device> getDeviceDetails(String order, String dir) {
        return deviceMapper.getDeviceDetails(order, dir);
    }

    public List<Device> getListById(String id) {
        return deviceMapper.getDevices(id);
    }

    public Device queryDeviceInfo(String id) {
        return deviceMapper.getSomeDevice(id);
    }

    public int updateDevice(Device device) {
        return deviceMapper.updateDeviceInfo(device);
    }

    public int createNewDevice(String number, Device device) {
        int rows = deviceMapper.getSomeDeviceById(number);
        if (rows > 0) {
            rows = -1;
        } else {
            rows = deviceMapper.insertDevice(device);
        }
        return rows;
    }

    public int deleteOneDevice(String id) {
        return deviceMapper.deleteDevice(id);
    }

}
