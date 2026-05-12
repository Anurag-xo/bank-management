package com.tcs.ilp.bms.controllers;

import com.tcs.ilp.bms.models.ProfileUpdate;
import com.tcs.ilp.bms.repositories.ProfileUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile-updates")
public class ProfileUpdateController {

    @Autowired
    private ProfileUpdateRepository repository;

    @GetMapping
    public List<ProfileUpdate> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ProfileUpdate update) {
        repository.save(update);
        return ResponseEntity.ok("Profile update request submitted");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        repository.updateStatus(id, status);
        return ResponseEntity.ok("Status updated");
    }
}
