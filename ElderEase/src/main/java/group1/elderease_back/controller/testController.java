package group1.elderease_back.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class testController
{
    @GetMapping("/")
    public String test()
    {
        return "Backend testing!";
    }
}
