package com.tcs.ilp.bms.controllers;

import com.tcs.ilp.bms.models.User;
import com.tcs.ilp.bms.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/search")
    public ResponseEntity<?> searchByUsername(@RequestParam String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            user.setPassword(null);
            user.setPin(null);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/set-pin")
    public ResponseEntity<?> setPin(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String pin = body.get("pin");
        if (pin == null || !pin.matches("\\d{4}")) {
            return ResponseEntity.badRequest().body("PIN must be exactly 4 digits");
        }
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        userRepository.updatePin(username, pin);
        return ResponseEntity.ok("PIN set successfully");
    }

    @PostMapping("/verify-pin")
    public ResponseEntity<?> verifyPin(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String pin = body.get("pin");
        User user = userRepository.findByUsername(username);
        if (user != null && pin != null && pin.equals(user.getPin())) {
            return ResponseEntity.ok("PIN verified");
        }
        return ResponseEntity.status(401).body("Invalid PIN");
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        userRepository.deleteByUsername(username);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/{username}/hold")
    public ResponseEntity<?> holdUser(@PathVariable String username, @RequestParam boolean hold) {
        String status = hold ? "HOLD" : "active";
        userRepository.updateStatus(username, status);
        return ResponseEntity.ok("User status updated to " + status);
    }
}
