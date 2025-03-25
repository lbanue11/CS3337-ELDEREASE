package group1.elderease_back.controller;

import group1.elderease_back.entities.User;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${frontend.url}") // Allow frontend to call API
public class loginController {

}
