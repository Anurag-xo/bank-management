package com.tcs.ilp.bms.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {
    private Long id;
    private Long customerId;
    private String type;
    private Double amount;
    private String interest;
    private String timeline;
    private String document;
    private String status;
    private String appliedBy;
    private String reviewedBy;
}
