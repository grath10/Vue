package com.vue.admin.entity;

public class Device {
    private String number;
    private String location;
    private String comment;
    private int id;

    public Device() {

    }

    public Device(String number, String location, String comment) {
        this.number = number;
        this.location = location;
        this.comment = comment;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
