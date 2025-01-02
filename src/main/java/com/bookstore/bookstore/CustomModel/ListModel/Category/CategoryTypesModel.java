package com.bookstore.bookstore.CustomModel.ListModel.Category;

import com.bookstore.bookstore.CustomModel.Model.CategoryTypeModel;

import java.util.List;

public class CategoryTypesModel {
        public int categoryCount;
        public List<CategoryTypeModel> categoryTypeModels;

    public CategoryTypesModel(){}

    public CategoryTypesModel(int categoryCount, List<CategoryTypeModel> categoryTypeModels) {
        this.categoryCount = categoryCount;
        this.categoryTypeModels = categoryTypeModels;
    }

    public int getCategoryCount() {
        return categoryCount;
    }

    public void setCategoryCount(int categoryCount) {
        this.categoryCount = categoryCount;
    }

    public List<CategoryTypeModel> getCategoryTypeModels() {
        return categoryTypeModels;
    }

    public void setCategoryTypeModels(List<CategoryTypeModel> categoryTypeModels) {
        this.categoryTypeModels = categoryTypeModels;
    }
}
