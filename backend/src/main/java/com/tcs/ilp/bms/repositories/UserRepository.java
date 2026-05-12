package com.tcs.ilp.bms.repositories;

import com.tcs.ilp.bms.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<User> findAll() {
        return jdbcTemplate.query("SELECT * FROM users", new BeanPropertyRowMapper<>(User.class));
    }

    public User findById(Long id) {
        return jdbcTemplate.query("SELECT * FROM users WHERE id=?", new BeanPropertyRowMapper<>(User.class), id)
                .stream().findFirst().orElse(null);
    }

    public User findByUsername(String username) {
        return jdbcTemplate.query("SELECT * FROM users WHERE username=?", new BeanPropertyRowMapper<>(User.class), username)
                .stream().findFirst().orElse(null);
    }

    public User findByAccountNumber(String accNo) {
        try {
            Long id = Long.parseLong(accNo) - 1000000000L;
            return findById(id);
        } catch (Exception e) {
            return null;
        }
    }

    public int save(User user) {
        return jdbcTemplate.update(
            "INSERT INTO users (role, username, password, name, email, phone, address, balance, cibil, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            user.getRole(), user.getUsername(), user.getPassword(), user.getName(), user.getEmail(), 
            user.getPhone(), user.getAddress(), user.getBalance(), user.getCibil(), user.getStatus()
        );
    }

    public int updateBalance(Long id, Double newBalance) {
        return jdbcTemplate.update("UPDATE users SET balance=? WHERE id=?", newBalance, id);
    }
}
