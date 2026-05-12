package com.tcs.ilp.bms.controllers;

import com.tcs.ilp.bms.models.Transaction;
import com.tcs.ilp.bms.models.User;
import com.tcs.ilp.bms.repositories.TransactionRepository;
import com.tcs.ilp.bms.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @GetMapping("/customer/{id}")
    public List<Transaction> getTransactionsByCustomerId(@PathVariable Long id) {
        return transactionRepository.findByCustomerId(id);
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody Transaction t) {
        User customer = userRepository.findById(t.getCustomerId());
        if (customer == null) {
            return ResponseEntity.badRequest().body("Customer not found");
        }

        if ("Transfer".equalsIgnoreCase(t.getType())) {
            if (t.getToAcc() == null || t.getToAcc().isEmpty()) {
                return ResponseEntity.badRequest().body("Receiver account number is required");
            }
            User receiver = userRepository.findByAccountNumber(t.getToAcc());
            if (receiver == null) {
                return ResponseEntity.badRequest().body("Receiver account not found");
            }
            if (receiver.getId().equals(customer.getId())) {
                return ResponseEntity.badRequest().body("Cannot transfer to yourself");
            }
            if (customer.getBalance() < t.getAmount()) {
                return ResponseEntity.badRequest().body("Insufficient balance");
            }

            // Perform transfer
            userRepository.updateBalance(customer.getId(), customer.getBalance() - t.getAmount());
            userRepository.updateBalance(receiver.getId(), receiver.getBalance() + t.getAmount());
            
            // Log receiver side transaction as well? For now, we just log the sender's.
        } else if ("Withdrawal".equalsIgnoreCase(t.getType())) {
            if (customer.getBalance() < t.getAmount()) {
                return ResponseEntity.badRequest().body("Insufficient balance");
            }
            userRepository.updateBalance(customer.getId(), customer.getBalance() - t.getAmount());
        } else {
            // Deposit or Online
            userRepository.updateBalance(customer.getId(), customer.getBalance() + t.getAmount());
        }

        transactionRepository.save(t);
        return ResponseEntity.ok("Transaction processed successfully");
    }
}
