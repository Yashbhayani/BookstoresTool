package com.bookstore.bookstore.EntityModels;

public class IProductModel {
    public String Pid;
    public String Code;
    public String Name;
    public boolean isActive;

    public IProductModel() {
    }

    public IProductModel(String pid, String code, String name, boolean isActive) {
        this.Pid = pid;
        this.Code = code;
        this.Name = name;
        this.isActive = isActive;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getPid() {
        return Pid;
    }

    public void setPid(String pid) {
        Pid = pid;
    }

    public String getCode() {
        return Code;
    }

    public void setCode(String code) {
        Code = code;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }
}
