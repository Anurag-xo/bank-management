package com.tcs.ilp.bms.controllers;

import com.tcs.ilp.bms.models.User;
import com.tcs.ilp.bms.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        User user = userRepository.findByUsername(loginUser.getUsername());
        if (user != null && user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        String prefix = "CUST";
        if ("employee".equalsIgnoreCase(user.getRole())) prefix = "EMP";
        if ("manager".equalsIgnoreCase(user.getRole())) prefix = "MGR";
        
        String generatedUsername = prefix + (int)(Math.random() * 900000 + 100000);
        while (userRepository.findByUsername(generatedUsername) != null) {
            generatedUsername = prefix + (int)(Math.random() * 900000 + 100000);
        }
        user.setUsername(generatedUsername);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }
}
