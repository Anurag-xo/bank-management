package com.tcs.ilp.bms.repositories;

import com.tcs.ilp.bms.models.ProfileUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProfileUpdateRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ProfileUpdate> findAll() {
        return jdbcTemplate.query("SELECT * FROM profile_updates", new BeanPropertyRowMapper<>(ProfileUpdate.class));
    }

    public List<ProfileUpdate> findByCustomerId(Long customerId) {
        return jdbcTemplate.query("SELECT * FROM profile_updates WHERE customer_id=?", 
            new BeanPropertyRowMapper<>(ProfileUpdate.class), customerId);
    }

    public int save(ProfileUpdate update) {
        return jdbcTemplate.update(
            "INSERT INTO profile_updates (customer_id, new_name, new_email, new_phone, new_address, status) VALUES (?, ?, ?, ?, ?, ?)",
            update.getCustomerId(), update.getNewName(), update.getNewEmail(), update.getNewPhone(), update.getNewAddress(), update.getStatus()
        );
    }

    public int updateStatus(Long id, String status) {
        return jdbcTemplate.update("UPDATE profile_updates SET status=? WHERE id=?", status, id);
    }
}
