package com.vue.admin.entity;

public class PerfData {
    private String device;
    private String collecttime;
    private double avgTemp;
    private double maxTemp;
    private double minTemp;
    private double avgHumid;
    private double maxHumid;
    private double minHumid;
    private double avgGas;
    private double maxGas;
    private double minGas;

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public String getCollecttime() {
        return collecttime;
    }

    public void setCollecttime(String collecttime) {
        this.collecttime = collecttime;
    }

    public double getAvgTemp() {
        return avgTemp;
    }

    public void setAvgTemp(double avgTemp) {
        this.avgTemp = avgTemp;
    }

    public double getMaxTemp() {
        return maxTemp;
    }

    public void setMaxTemp(double maxTemp) {
        this.maxTemp = maxTemp;
    }

    public double getMinTemp() {
        return minTemp;
    }

    public void setMinTemp(double minTemp) {
        this.minTemp = minTemp;
    }

    public double getAvgHumid() {
        return avgHumid;
    }

    public void setAvgHumid(double avgHumid) {
        this.avgHumid = avgHumid;
    }

    public double getMaxHumid() {
        return maxHumid;
    }

    public void setMaxHumid(double maxHumid) {
        this.maxHumid = maxHumid;
    }

    public double getMinHumid() {
        return minHumid;
    }

    public void setMinHumid(double minHumid) {
        this.minHumid = minHumid;
    }

    public double getAvgGas() {
        return avgGas;
    }

    public void setAvgGas(double avgGas) {
        this.avgGas = avgGas;
    }

    public double getMaxGas() {
        return maxGas;
    }

    public void setMaxGas(double maxGas) {
        this.maxGas = maxGas;
    }

    public double getMinGas() {
        return minGas;
    }

    public void setMinGas(double minGas) {
        this.minGas = minGas;
    }
}
