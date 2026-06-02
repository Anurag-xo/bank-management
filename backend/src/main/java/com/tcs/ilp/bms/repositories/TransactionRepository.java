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

    public List<Transaction> findByCustomerUsername(String customerUsername) {
        return jdbcTemplate.query("SELECT * FROM transactions WHERE customer_username=? OR recipient_username=?", new BeanPropertyRowMapper<>(Transaction.class), customerUsername, customerUsername);
    }

    public int save(Transaction t) {
        return jdbcTemplate.update(
            "INSERT INTO transactions (customer_username, recipient_username, amount, type, date, to_acc, ifsc) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)",
            t.getCustomerUsername(), t.getRecipientUsername(), t.getAmount(), t.getType(), t.getToAcc(), t.getIfsc()
        );
    }
}
