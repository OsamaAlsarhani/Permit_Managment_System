package com.springdata.permitmanagementsystem.model.dto;

import com.springdata.permitmanagementsystem.model.enums.PermitStatus;
import com.springdata.permitmanagementsystem.model.enums.PermitType;

import java.time.LocalDate;
import java.util.List;

public class UserPermitDTO {
    private Integer id;

    private PermitType permitType;
    private String description;
    private double area;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private PermitStatus status;
    private List<String> fileUrls;
}