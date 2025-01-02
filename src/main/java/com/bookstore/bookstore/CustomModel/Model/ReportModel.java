package com.bookstore.bookstore.CustomModel.Model;

public class ReportModel {
    public String Code;
    public String JsonString;

    public String getCode() {
        return Code;
    }

    public void setCode(String code) {
        Code = code;
    }

    public String getJsonString() {
        return JsonString;
    }

    public void setJsonString(String jsonString) {
        JsonString = jsonString;
    }

    public ReportModel() {
    }

    public ReportModel(String code, String jsonString) {
        Code = code;
        JsonString = jsonString;
    }
}
