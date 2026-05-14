package com.tcs.ilp.bms.models;

public class ProfileUpdate {
    private Long id;
    private String customerUsername;
    private String newName;
    private String newEmail;
    private String newPhone;
    private String newAddress;
    private String status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomerUsername() { return customerUsername; }
    public void setCustomerUsername(String customerUsername) { this.customerUsername = customerUsername; }
    public String getNewName() { return newName; }
    public void setNewName(String newName) { this.newName = newName; }
    public String getNewEmail() { return newEmail; }
    public void setNewEmail(String newEmail) { this.newEmail = newEmail; }
    public String getNewPhone() { return newPhone; }
    public void setNewPhone(String newPhone) { this.newPhone = newPhone; }
    public String getNewAddress() { return newAddress; }
    public void setNewAddress(String newAddress) { this.newAddress = newAddress; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
