package com.vue.admin.mapper;

import com.vue.admin.entity.PerfData;

import java.util.List;
import java.util.Map;

public interface CollectorMapper {
    List<PerfData> getCollectValuesByTypeAndTime(Map<String, String> map);

    List<PerfData> getValuesByTime(Map<String, String> map);

    List<PerfData> getValuesByType(Map<String, Object> map);

    List<PerfData> getGlobalValueByType(Map<String, Object> map);
}
