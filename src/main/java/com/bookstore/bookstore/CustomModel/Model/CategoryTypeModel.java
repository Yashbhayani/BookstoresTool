package com.bookstore.bookstore.CustomModel.Model;

import java.util.List;

public class CategoryTypeModel {

    private String id;
    private String productName;
    private String categoryCode;
    private String categoryValue;
    private String categoryPath;
    private boolean isActive;
    private boolean isDeleted;

    public CategoryTypeModel(){}


    public CategoryTypeModel(String id, String productName, String categoryCode, String categoryValue, String categoryPath, boolean isActive, boolean isDeleted) {
        this.id = id;
        this.productName = productName;
        this.categoryCode = categoryCode;
        this.categoryValue = categoryValue;
        this.categoryPath = categoryPath;
        this.isActive = isActive;
        this.isDeleted = isDeleted;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getCategoryValue() {
        return categoryValue;
    }

    public void setCategoryValue(String categoryValue) {
        this.categoryValue = categoryValue;
    }

    public String getCategoryPath() {
        return categoryPath;
    }

    public void setCategoryPath(String categoryPath) {
        this.categoryPath = categoryPath;
    }

    public boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(boolean deleted) {
        isDeleted = deleted;
    }
}

