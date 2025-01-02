package com.bookstore.bookstore.EntityModels;

public class ISubCategoryModel {
    public String scID;
    public int pID;
    public int cID;
    public String code;
    public String path;
    public boolean isActive;
    public String name;

    public ISubCategoryModel(){}

    public ISubCategoryModel(String scID, int pID, int cID, String code, String path, boolean isActive, String name) {
        this.scID = scID;
        this.pID = pID;
        this.cID = cID;
        this.code = code;
        this.path = path;
        this.isActive = isActive;
        this.name = name;
    }

    public String getScID() {
        return scID;
    }

    public void setScID(String scID) {
        this.scID = scID;
    }

    public int getpID() {
        return pID;
    }

    public void setpID(int pID) {
        this.pID = pID;
    }

    public int getcID() {
        return cID;
    }

    public void setcID(int cID) {
        this.cID = cID;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
