package com.tcs.ilp.bms.repositories;

import com.tcs.ilp.bms.models.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TransactionRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Transaction> findAll() {
        return jdbcTemplate.query("SELECT * FROM transactions", new BeanPropertyRowMapper<>(Transaction.class));
    }

    public List<Transaction> findByCustomerId(Long customerId) {
        return jdbcTemplate.query("SELECT * FROM transactions WHERE customer_id=?", new BeanPropertyRowMapper<>(Transaction.class), customerId);
    }

    public int save(Transaction t) {
        return jdbcTemplate.update(
            "INSERT INTO transactions (customer_id, amount, type, date, to_acc, ifsc) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)",
            t.getCustomerId(), t.getAmount(), t.getType(), t.getToAcc(), t.getIfsc()
        );
    }
}
