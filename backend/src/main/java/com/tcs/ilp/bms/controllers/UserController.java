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
        if (user.getName() == null || user.getName().trim().isEmpty() ||
            user.getEmail() == null || user.getEmail().trim().isEmpty() ||
            user.getPhone() == null || user.getPhone().trim().isEmpty() ||
            user.getAddress() == null || user.getAddress().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("All fields are required.");
        }

        // Validate name format: 2-50 characters, letters and spaces only
        if (!user.getName().trim().matches("^[a-zA-Z\\s]{2,50}$")) {
            return ResponseEntity.badRequest().body("Name must be 2-50 characters long and contain only letters.");
        }

        // Validate email format
        if (!user.getEmail().trim().matches("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$")) {
            return ResponseEntity.badRequest().body("Invalid email address format.");
        }

        // Validate phone number: exactly 10 digits
        if (!user.getPhone().trim().matches("^\\d{10}$")) {
            return ResponseEntity.badRequest().body("Phone number must be exactly 10 digits.");
        }

        // Validate password strength: min 8 characters, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character
        String password = user.getPassword();
        if (password.length() < 8) {
            return ResponseEntity.badRequest().body("Password must be at least 8 characters long.");
        }
        if (!password.matches(".*[A-Z].*")) {
            return ResponseEntity.badRequest().body("Password must contain at least one uppercase letter.");
        }
        if (!password.matches(".*[a-z].*")) {
            return ResponseEntity.badRequest().body("Password must contain at least one lowercase letter.");
        }
        if (!password.matches(".*[0-9].*")) {
            return ResponseEntity.badRequest().body("Password must contain at least one digit.");
        }
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]\\{\\};':\",./<>?~`].*")) {
            return ResponseEntity.badRequest().body("Password must contain at least one special character.");
        }

        String prefix = "CUST";
        if ("employee".equalsIgnoreCase(user.getRole())) prefix = "EMP";
        if ("manager".equalsIgnoreCase(user.getRole())) prefix = "MGR";
        
        String generatedUsername = prefix + (int)(Math.random() * 900000 + 100000);
        while (userRepository.findByUsername(generatedUsername) != null) {
            generatedUsername = prefix + (int)(Math.random() * 900000 + 100000);
        }
        user.setUsername(generatedUsername);
        
        if ("customer".equalsIgnoreCase(user.getRole())) {
            if (user.getCibil() == null || user.getCibil() == 0) {
                user.setCibil((int)(Math.random() * 551 + 300));
            }
            if (user.getBalance() == null) {
                user.setBalance(0.0);
            }
            if (user.getStatus() == null || user.getStatus().trim().isEmpty()) {
                user.setStatus("active");
            }
        } else {
            if (user.getStatus() == null || user.getStatus().trim().isEmpty()) {
                user.setStatus("active");
            }
        }
        
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
