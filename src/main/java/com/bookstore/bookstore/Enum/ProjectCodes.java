package com.bookstore.bookstore.Enum;

public class ProjectCodes {

    // Define the nested enum ProjectSpCodes inside the ProjectCodes class
    public enum ProjectSpCodes {
        checkuserrole,
        getbookswithreviewstars,
        bookalldetails,
        getbooksforuseradmin,
        verifyproductcode,
        findeidandcheckstatus,
        verifycategorycode,
        verifycategorypath,
        verifysubcategorycode,
        verifysubcategorypath,
        productstatus,
        categorystatus,
        getproduct,
        getcategory,
        getsubcategory
    }

    public enum LoginCode {
        logincode,
        logout
    }

    public enum ReportCods {
        allproducttypes,
        allcategorytypes,
        allsubcategorytypes,
        adminlist,
        useradminlist,
        userlist,
        applyuseradminlist,
        getapplyuseradminlist,
        applyuseradmininfolist,
        getuserinfo
    }

    public enum SelectCodes {
        selectproduct,
        selectcategory,
        selectsubcategory
    }

    public enum UserCodes {
        // currently empty
    }
}
