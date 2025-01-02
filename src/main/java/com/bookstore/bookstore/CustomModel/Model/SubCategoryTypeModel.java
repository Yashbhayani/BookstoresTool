package com.bookstore.bookstore.CustomModel.Model;

public class SubCategoryTypeModel {
    private String subCategoryId;
    private String productName;
    private String categoryName;
    private String subCategoryCode;
    private String subCategoryValue;
    private String subCategoryPath;
    private boolean isActive;
    private boolean isDelete;

    public SubCategoryTypeModel(){}

    public SubCategoryTypeModel(String subCategoryId, String productName, String categoryName, String subCategoryCode, String subCategoryValue, String subCategoryPath, boolean isActive, boolean isDelete) {
        this.subCategoryId = subCategoryId;
        this.productName = productName;
        this.categoryName = categoryName;
        this.subCategoryCode = subCategoryCode;
        this.subCategoryValue = subCategoryValue;
        this.subCategoryPath = subCategoryPath;
        this.isActive = isActive;
        this.isDelete = isDelete;
    }

    public String getSubCategoryId() {
        return subCategoryId;
    }

    public void setSubCategoryId(String subCategoryId) {
        this.subCategoryId = subCategoryId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getSubCategoryCode() {
        return subCategoryCode;
    }

    public void setSubCategoryCode(String subCategoryCode) {
        this.subCategoryCode = subCategoryCode;
    }

    public String getSubCategoryValue() {
        return subCategoryValue;
    }

    public void setSubCategoryValue(String subCategoryValue) {
        this.subCategoryValue = subCategoryValue;
    }

    public String getSubCategoryPath() {
        return subCategoryPath;
    }

    public void setSubCategoryPath(String subCategoryPath) {
        this.subCategoryPath = subCategoryPath;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isDelete() {
        return isDelete;
    }

    public void setDelete(boolean delete) {
        isDelete = delete;
    }
}
