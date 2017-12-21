package com.vue.admin.entity;

import java.util.List;
import java.util.Set;

public class ChartData {
    private Set<String> xAxis;
    private List<List<String>> dataList;

    public Set<String> getxAxis() {
        return xAxis;
    }

    public void setxAxis(Set<String> xAxis) {
        this.xAxis = xAxis;
    }

    public List<List<String>> getDataList() {
        return dataList;
    }

    public void setDataList(List<List<String>> dataList) {
        this.dataList = dataList;
    }
}
