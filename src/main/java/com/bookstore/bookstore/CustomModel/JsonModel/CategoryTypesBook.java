package com.bookstore.bookstore.CustomModel.JsonModel;

public class CategoryTypesBook {
    public int categoryTypesBookId;
    public CategoryType categoryType;

    public int getCategoryTypesBookId() {
        return categoryTypesBookId;
    }

    public void setCategoryTypesBookId(int categoryTypesBookId) {
        this.categoryTypesBookId = categoryTypesBookId;
    }

    public CategoryType getCategoryType() {
        return categoryType;
    }

    public void setCategoryType(CategoryType categoryType) {
        this.categoryType = categoryType;
    }


    public CategoryTypesBook(int categoryTypesBookId, CategoryType categoryType) {
        this.categoryTypesBookId = categoryTypesBookId;
        this.categoryType = categoryType;
    }


    public CategoryTypesBook() {
    }
}
