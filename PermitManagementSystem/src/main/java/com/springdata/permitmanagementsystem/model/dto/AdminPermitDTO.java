package com.springdata.permitmanagementsystem.model.dto;

import com.springdata.permitmanagementsystem.model.entity.Permit;
import com.springdata.permitmanagementsystem.model.enums.PermitStatus;
import com.springdata.permitmanagementsystem.model.enums.PermitType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminPermitDTO {
    private Integer id;
    private String applicantName;
    private String nationalIdOrCr;
    private PermitType permitType;
    private String description;
    private double area;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private String contactNumber;
    private String email;
    private PermitStatus status;
    private String adminComment;
    private UserDto applicant; // Includes id, username, role, password
    private List<String> fileUrls;

    public static AdminPermitDTO toDto(Permit permit) {
        return AdminPermitDTO.builder()
                .id(permit.getId())
                .applicantName(permit.getApplicantName())
                .nationalIdOrCr(permit.getNationalIdOrCr())
                .permitType(permit.getPermitType())
                .description(permit.getDescription())
                .area(permit.getArea())
                .location(permit.getLocation())
                .startDate(permit.getStartDate())
                .endDate(permit.getEndDate())
                .contactNumber(permit.getContactNumber())
                .email(permit.getEmail())
                .status(permit.getStatus())
                .adminComment(permit.getAdminComment())
                .applicant(UserDto.toDto(permit.getApplicant()))
                .fileUrls(permit.getFileUrls())
                .build();
    }

}
