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

    @GetMapping("/customer/{username}")
    public List<Loan> getLoansByCustomerUsername(@PathVariable String username) {
        return loanRepository.findByCustomerUsername(username);
    }

    @PostMapping
    public ResponseEntity<?> applyLoan(@RequestBody Loan loan) {
        User customer = userRepository.findByUsername(loan.getCustomerUsername());
        if (customer != null && "HOLD".equalsIgnoreCase(customer.getStatus())) {
            return ResponseEntity.status(403).body("Account is on HOLD. Loan applications are not permitted.");
        }
        
        if (loan.getAppliedBy() != null) {
            User applicant = userRepository.findByUsername(loan.getAppliedBy());
            if (applicant != null && "HOLD".equalsIgnoreCase(applicant.getStatus())) {
                return ResponseEntity.status(403).body("Your account is on HOLD. You cannot apply for loans.");
            }
        }

        loanRepository.save(loan);
        return ResponseEntity.ok("Loan application submitted");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateLoanStatus(@PathVariable Long id, @RequestParam String status, @RequestParam String reviewedBy) {
        User reviewer = userRepository.findByUsername(reviewedBy);
        if (reviewer != null && "HOLD".equalsIgnoreCase(reviewer.getStatus())) {
            return ResponseEntity.status(403).body("Your account is on HOLD. You cannot perform this action.");
        }

        List<Loan> allLoans = loanRepository.findAll();
        Loan loan = allLoans.stream().filter(l -> l.getId().equals(id)).findFirst().orElse(null);
        
        if (loan == null) {
            return ResponseEntity.notFound().build();
        }

        if ("approved".equalsIgnoreCase(status) && !"approved".equalsIgnoreCase(loan.getStatus())) {
            User customer = userRepository.findByUsername(loan.getCustomerUsername());
            if (customer != null) {
                userRepository.updateBalance(customer.getId(), customer.getBalance() + loan.getAmount());
            }
        }
        
        if ("rejected".equalsIgnoreCase(status) && "approved".equalsIgnoreCase(loan.getStatus())) {
            User customer = userRepository.findByUsername(loan.getCustomerUsername());
            if (customer != null) {
                userRepository.updateBalance(customer.getId(), customer.getBalance() - loan.getAmount());
            }
        }

        loanRepository.updateStatus(id, status, reviewedBy);
        return ResponseEntity.ok("Loan status updated to " + status);
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<?> updateLoanVerificationStatus(@PathVariable Long id, @RequestParam String verificationStatus, @RequestParam String reviewedBy) {
        User reviewer = userRepository.findByUsername(reviewedBy);
        if (reviewer != null && "HOLD".equalsIgnoreCase(reviewer.getStatus())) {
            return ResponseEntity.status(403).body("Your account is on HOLD. You cannot perform this action.");
        }
        loanRepository.updateVerificationStatus(id, verificationStatus, reviewedBy);
        return ResponseEntity.ok("Loan verification status updated to " + verificationStatus);
    }
}
