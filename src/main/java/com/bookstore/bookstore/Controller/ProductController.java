package com.bookstore.bookstore.Controller;

import com.bookstore.bookstore.EntityModels.IProductModel;
import com.bookstore.bookstore.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@ComponentScan(basePackages = "com.bookstore.bookstore.Services")
@Configuration
@RestController
@RequestMapping("api")
public class ProductController {

    @Autowired
    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }


    @GetMapping("/product/list")
    public Map<String, Object> List(
            @CookieValue(value = "access_token", required = false)   String Token,
            @RequestParam("report") String report
    ) throws IOException {
        return  productRepository.getproduct(Token, report);
    }

    @GetMapping("/product/select-product/list")
    public Map<String, Object> SelectList(@CookieValue(value = "access_token", required = false)   String Token) throws IOException {
        return  productRepository.getselectproductlist(Token);
    }

    @GetMapping("/product/code-verify")
    public  Map<String, Object> ProductCode(
            @CookieValue(value = "access_token", required = false)   String Token,
            @RequestParam("code") String Code
    ) throws IOException{
        return productRepository.getproductcode(Token, Code);
    }

    @PostMapping("/product/save")
    public Map<String, Object> Save(
            @CookieValue(value = "access_token", required = false)   String Token,
            @RequestBody IProductModel iProductModel
    ) throws IOException {
        return  productRepository.save(Token, iProductModel);
    }

    @PutMapping("/product/update")
    public Map<String, Object> Update(
            @CookieValue(value = "access_token", required = false)   String Token,
            @RequestBody IProductModel iProductModel
    ) throws IOException {
        return  productRepository.update(Token, iProductModel);
    }

    @GetMapping ("/product/getproduct")
    public Map<String, Object> getProductDetails(
            @CookieValue(value = "access_token", required = false)   String Token,
            @RequestParam("pid") String pId
    ) throws IOException {
        return  productRepository.getProductDetails(Token, pId);
    }

    @DeleteMapping ("/product/delete")
    public Map<String, Object> Delete(
            @CookieValue(value = "access_token", required = false)   String Token,
            @RequestParam("pid") String pId
    ) throws IOException {
        return  productRepository.delete(Token, pId);
    }

    @PutMapping ("/product/restore")
    public Map<String, Object> ReStore(
            @CookieValue(value = "access_token", required = false)   String Token,
            @RequestParam("pid") String pId
    ) throws IOException {
        return  productRepository.reStore(Token, pId);
    }

    @PutMapping ("/product/active")
    public Map<String, Object> Activate(
            @CookieValue(value = "access_token", required = false)   String Token,
            @RequestParam("pid") String pId
    ) throws IOException {
        return  productRepository.reActivate(Token, pId);
    }

    @PutMapping ("/product/deactive")
    public Map<String, Object> DeActivate(
            @CookieValue(value = "access_token", required = false)   String Token,
            @RequestParam("pid") String pId
    ) throws IOException {
        return  productRepository.deActivate(Token, pId);
    }
}
