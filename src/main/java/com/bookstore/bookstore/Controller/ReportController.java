package com.bookstore.bookstore.Controller;

import com.bookstore.bookstore.Services.ReportServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@ComponentScan(basePackages = "com.bookstore.bookstore.Services")
@Configuration
@RestController
@RequestMapping("api")
public class ReportController {

    @Autowired
    private final ReportServices reportServices;

    public ReportController(ReportServices reportServices) {
        this.reportServices = reportServices;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> Dashboard(
            @RequestHeader("token") String Token){
        return reportServices.dashboard(Token);
    }

    @GetMapping("/chart")
    public Map<String, Object> Chart(
            @RequestHeader("token") String Token){
        return reportServices.chart(Token);
    }
}
