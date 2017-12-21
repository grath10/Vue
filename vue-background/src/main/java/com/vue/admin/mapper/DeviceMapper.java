package com.vue.admin.mapper;

import com.vue.admin.entity.Device;
import com.vue.admin.provider.DeviceMapperProvider;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DeviceMapper {
    @Select("select location,number,comment from device where number like concat(concat('%',#{id}),'%')")
    List<Device> getDevices(@Param("id") String id);

    @Select("select location,number,comment from device where id like concat(concat('%',#{id}),'%')")
    Device getSomeDevice(@Param("id") String id);

    @Select("select count(1) from device where number=#{id}")
    int getSomeDeviceById(@Param("id") String id);

    @Select("select id,location,number,comment from device order by ${orderColumn} ${dir}")
    List<Device> getDeviceDetails(@Param("orderColumn") String orderColumn, @Param("dir") String dir);

    @Insert("INSERT INTO device (number, location, comment) VALUES(#{number},#{location},#{comment})")
    int insertDevice(Device device);

    @InsertProvider(type = DeviceMapperProvider.class, method = "insertAll")
    void insertAll(@Param("list") List<Device> deviceList);

    @Select("select id,location,number,comment from device")
    List<Device> getAllDevices();

    @Update("update device set location=#{location}, comment=#{comment} where number=#{number}")
    int updateDeviceInfo(Device device);

    @Delete("delete from device where id=#{id}")
    int deleteDevice(String id);
}
