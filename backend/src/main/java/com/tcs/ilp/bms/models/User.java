package com.tcs.ilp.bms.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String role;
    private String username;
    private String password;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Double balance;
    private Integer cibil;
    private String status;
}
