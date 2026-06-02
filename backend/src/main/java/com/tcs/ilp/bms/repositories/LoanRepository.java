package com.tcs.ilp.bms.repositories;

import com.tcs.ilp.bms.models.Loan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class LoanRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Loan> findAll() {
        return jdbcTemplate.query("SELECT * FROM loans", new BeanPropertyRowMapper<>(Loan.class));
    }

    public List<Loan> findByCustomerUsername(String customerUsername) {
        return jdbcTemplate.query("SELECT * FROM loans WHERE customer_username=?", new BeanPropertyRowMapper<>(Loan.class), customerUsername);
    }

    public int save(Loan loan) {
        return jdbcTemplate.update(
            "INSERT INTO loans (customer_username, loan_basis, type, amount, interest, timeline, document, collateral_details, emi_months, emi_amount, verification_status, status, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            loan.getCustomerUsername(), loan.getLoanBasis(), loan.getType(), loan.getAmount(), loan.getInterest(), loan.getTimeline(), 
            loan.getDocument(), loan.getCollateralDetails(), loan.getEmiMonths(), loan.getEmiAmount(), loan.getVerificationStatus(), loan.getStatus(), loan.getAppliedBy()
        );
    }

    public int updateStatus(Long id, String status, String reviewedBy) {
        return jdbcTemplate.update("UPDATE loans SET status=?, reviewed_by=? WHERE id=?", status, reviewedBy, id);
    }

    public int updateVerificationStatus(Long id, String verificationStatus, String reviewedBy) {
        return jdbcTemplate.update("UPDATE loans SET verification_status=?, reviewed_by=? WHERE id=?", verificationStatus, reviewedBy, id);
    }
}
