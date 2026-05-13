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
        User customer = null;

        if (t.getCustomerUsername() != null && !t.getCustomerUsername().isEmpty()) {
            customer = userRepository.findByUsername(t.getCustomerUsername());
            if (customer == null) {
                return ResponseEntity.badRequest().body("Customer not found with username: " + t.getCustomerUsername());
            }
            t.setCustomerId(customer.getId());
        } else if (t.getCustomerId() != null) {
            customer = userRepository.findById(t.getCustomerId());
        }

        if (customer == null) {
            return ResponseEntity.badRequest().body("Customer not found");
        }

        if (t.getPin() != null && !t.getPin().isEmpty()) {
            if (customer.getPin() == null || customer.getPin().isEmpty()) {
                return ResponseEntity.badRequest().body("Please set up a transaction PIN first from your profile settings");
            }
            if (!t.getPin().equals(customer.getPin())) {
                return ResponseEntity.status(401).body("Invalid PIN");
            }
        }

        if ("Transfer".equalsIgnoreCase(t.getType())) {
            User receiver = null;

            if (t.getRecipientUsername() != null && !t.getRecipientUsername().isEmpty()) {
                receiver = userRepository.findByUsername(t.getRecipientUsername());
            } else if (t.getToAcc() != null && !t.getToAcc().isEmpty()) {
                receiver = userRepository.findByAccountNumber(t.getToAcc());
            }

            if (receiver == null) {
                return ResponseEntity.badRequest().body("Recipient not found");
            }
            if (receiver.getId().equals(customer.getId())) {
                return ResponseEntity.badRequest().body("Cannot transfer to yourself");
            }
            if (customer.getBalance() < t.getAmount()) {
                return ResponseEntity.badRequest().body("Insufficient balance");
            }

            t.setToAcc(String.valueOf(1000000000L + receiver.getId()));

            userRepository.updateBalance(customer.getId(), customer.getBalance() - t.getAmount());
            userRepository.updateBalance(receiver.getId(), receiver.getBalance() + t.getAmount());
        } else if ("Withdrawal".equalsIgnoreCase(t.getType())) {
            if (customer.getBalance() < t.getAmount()) {
                return ResponseEntity.badRequest().body("Insufficient balance");
            }
            userRepository.updateBalance(customer.getId(), customer.getBalance() - t.getAmount());
        } else {
            userRepository.updateBalance(customer.getId(), customer.getBalance() + t.getAmount());
        }

        transactionRepository.save(t);
        return ResponseEntity.ok("Transaction processed successfully");
    }
}
