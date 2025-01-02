package com.bookstore.bookstore.CustomModel.Model;

public class ProductModel {

    public  String pid;
    public  String name;
    public  boolean active;
    public  boolean delete;

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isDelete() {
        return delete;
    }

    public void setDelete(boolean delete) {
        this.delete = delete;
    }

    public ProductModel(){}

    public ProductModel(String pid, String name, boolean active, boolean delete) {
        this.pid = pid;
        this.name = name;
        this.active = active;
        this.delete = delete;
    }
}
