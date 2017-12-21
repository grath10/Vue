package com.vue.admin.entity;

public class CollectData {
    private String device;
    private String type;
    private String collecttime;
    private double valueAvg;
    private double valueMax;
    private double valueMin;

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCollecttime() {
        return collecttime;
    }

    public void setCollecttime(String collecttime) {
        this.collecttime = collecttime;
    }

    public double getValueAvg() {
        return valueAvg;
    }

    public void setValueAvg(double valueAvg) {
        this.valueAvg = valueAvg;
    }

    public double getValueMax() {
        return valueMax;
    }

    public void setValueMax(double valueMax) {
        this.valueMax = valueMax;
    }

    public double getValueMin() {
        return valueMin;
    }

    public void setValueMin(double valueMin) {
        this.valueMin = valueMin;
    }
}
