package com.woowahan.moduchan.controller;

import com.woowahan.moduchan.support.SessionUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/users")
public class UserController {
    @GetMapping("/join")
    public String join() {
        return "/join";
    }

    @GetMapping("/login")
    public String login() {
        return "/login";
    }
}
