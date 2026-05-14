package com.tcs.ilp.bms.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    private Long id;
    private Double amount;
    private String type;
    private LocalDateTime date;
    private String toAcc;
    private String ifsc;
    private String customerUsername;
    private String recipientUsername;
    private String pin;
}
