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

    public List<Loan> findByCustomerId(Long customerId) {
        return jdbcTemplate.query("SELECT * FROM loans WHERE customer_id=?", new BeanPropertyRowMapper<>(Loan.class), customerId);
    }

    public int save(Loan loan) {
        return jdbcTemplate.update(
            "INSERT INTO loans (customer_id, type, amount, interest, timeline, document, status, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            loan.getCustomerId(), loan.getType(), loan.getAmount(), loan.getInterest(), loan.getTimeline(), 
            loan.getDocument(), loan.getStatus(), loan.getAppliedBy()
        );
    }

    public int updateStatus(Long id, String status, String reviewedBy) {
        return jdbcTemplate.update("UPDATE loans SET status=?, reviewed_by=? WHERE id=?", status, reviewedBy, id);
    }
}
