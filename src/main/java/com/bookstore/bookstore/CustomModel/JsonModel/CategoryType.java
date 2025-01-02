package com.bookstore.bookstore.CustomModel.JsonModel;

public class CategoryType {
    public int categoryTypeId;
    public String categoryTypeName;
    public Category category;


    public int getCategoryTypeId() {
        return categoryTypeId;
    }

    public void setCategoryTypeId(int categoryTypeId) {
        this.categoryTypeId = categoryTypeId;
    }

    public String getCategoryTypeName() {
        return categoryTypeName;
    }

    public void setCategoryTypeName(String categoryTypeName) {
        this.categoryTypeName = categoryTypeName;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public CategoryType(int categoryTypeId, String categoryTypeName, Category category) {
        this.categoryTypeId = categoryTypeId;
        this.categoryTypeName = categoryTypeName;
        this.category = category;
    }

    public CategoryType() {

    }
}
