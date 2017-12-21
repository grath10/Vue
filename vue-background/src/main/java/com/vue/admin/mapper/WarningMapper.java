package com.vue.admin.mapper;

import com.vue.admin.entity.Warning;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface WarningMapper {
    @Select("select device,type,level,collecttime,remark from warning where collecttime>=#{startTime} and collecttime<=#{endTime} order by collecttime desc")
    List<Warning> getIndexRecords(@Param("startTime") String startTime, @Param("endTime") String endTime);

}
