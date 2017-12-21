package com.vue.admin.entity;

import java.util.List;

public class TableBean {
    private List<?> list;
    private int total;

    public List<?> getList() {
        return list;
    }

    public void setList(List<?> list) {
        this.list = list;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }
}
