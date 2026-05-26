package com.tcs.ilp.bms.controllers;

import com.tcs.ilp.bms.models.ProfileUpdate;
import com.tcs.ilp.bms.models.User;
import com.tcs.ilp.bms.repositories.ProfileUpdateRepository;
import com.tcs.ilp.bms.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile-updates")
public class ProfileUpdateController {

    @Autowired
    private ProfileUpdateRepository repository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<ProfileUpdate> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ProfileUpdate update) {
        User customer = userRepository.findByUsername(update.getCustomerUsername());
        if (customer != null && "HOLD".equalsIgnoreCase(customer.getStatus())) {
            return ResponseEntity.status(403).body("Account is on HOLD. Profile updates are not permitted.");
        }
        repository.save(update);
        return ResponseEntity.ok("Profile update request submitted");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String reviewedBy) {
        if (reviewedBy != null) {
            User reviewer = userRepository.findByUsername(reviewedBy);
            if (reviewer != null && "HOLD".equalsIgnoreCase(reviewer.getStatus())) {
                return ResponseEntity.status(403).body("Your account is on HOLD. You cannot perform this action.");
            }
        }
        repository.updateStatus(id, status);
        if ("approved".equalsIgnoreCase(status)) {
            List<ProfileUpdate> updates = repository.findAll();
            ProfileUpdate update = updates.stream().filter(u -> u.getId().equals(id)).findFirst().orElse(null);
            if (update != null) {
                userRepository.updateProfile(update.getCustomerUsername(), update.getNewName(), update.getNewEmail(), update.getNewPhone(), update.getNewAddress());
            }
        }
        return ResponseEntity.ok("Status updated");
    }
}
