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
public class PermitDTO {
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
    private String adminComment;
    private PermitStatus status;
    private Integer applicantId;
    private List<String> fileUrls;


    public static PermitDTO toPermitDTO(Permit permit) {
        return PermitDTO.builder()
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
                .applicantId(permit.getApplicant() != null ? permit.getApplicant().getId() : null)
                .fileUrls(permit.getFileUrls())
                .build();
    }
}


