package com.tcs.ilp.bms.controllers;

import com.tcs.ilp.bms.models.Loan;
import com.tcs.ilp.bms.models.User;
import com.tcs.ilp.bms.repositories.LoanRepository;
import com.tcs.ilp.bms.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @GetMapping("/customer/{id}")
    public List<Loan> getLoansByCustomerId(@PathVariable Long id) {
        return loanRepository.findByCustomerId(id);
    }

    @PostMapping
    public ResponseEntity<?> applyLoan(@RequestBody Loan loan) {
        loanRepository.save(loan);
        return ResponseEntity.ok("Loan application submitted");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateLoanStatus(@PathVariable Long id, @RequestParam String status, @RequestParam String reviewedBy) {
        List<Loan> allLoans = loanRepository.findAll();
        Loan loan = allLoans.stream().filter(l -> l.getId().equals(id)).findFirst().orElse(null);
        
        if (loan == null) {
            return ResponseEntity.notFound().build();
        }

        if ("approved".equalsIgnoreCase(status) && !"approved".equalsIgnoreCase(loan.getStatus())) {
            User customer = userRepository.findById(loan.getCustomerId());
            if (customer != null) {
                userRepository.updateBalance(customer.getId(), customer.getBalance() + loan.getAmount());
            }
        }
        
        if ("rejected".equalsIgnoreCase(status) && "approved".equalsIgnoreCase(loan.getStatus())) {
            User customer = userRepository.findById(loan.getCustomerId());
            if (customer != null) {
                userRepository.updateBalance(customer.getId(), customer.getBalance() - loan.getAmount());
            }
        }

        loanRepository.updateStatus(id, status, reviewedBy);
        return ResponseEntity.ok("Loan status updated to " + status);
    }
}
