package com.bookstore.bookstore.CustomModel.JsonModel;

public class Category {
    public int categoryId;
    public String categoryName;
    public ProductType productType;

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public ProductType getProductType() {
        return productType;
    }

    public void setProductType(ProductType productType) {
        this.productType = productType;
    }

    public Category(int categoryId, String categoryName, ProductType productType) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.productType = productType;
    }

    public Category() {
    }
}
