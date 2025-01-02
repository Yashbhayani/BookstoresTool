package com.bookstore.bookstore.EntityModels;

public class ICategoryModel {
    public String sID;
    public int pID ;
    public String code;
    public String path;
    public boolean isActive;
    public String name;

    public ICategoryModel(){}

    public ICategoryModel( String sID, int pID, String code, String path, String name, boolean isActive) {
        this.sID = sID;
        this.pID = pID;
        this.code = code;
        this.path = path;
        this.name = name;
        this.isActive = isActive;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getsID() {
        return sID;
    }

    public void setsID(String sID) {
        this.sID = sID;
    }

    public int getpID() {
        return pID;
    }

    public void setpID(int pID) {
        this.pID = pID;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
