package com.springdata.permitmanagementsystem.model.entity;

import com.springdata.permitmanagementsystem.model.enums.PermitStatus;
import com.springdata.permitmanagementsystem.model.enums.PermitType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "permit")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Permit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @NotBlank
    @Size(max = 100)
    private String applicantName;

    @NotBlank
    @Size(max = 50)
    private String nationalIdOrCr;

    @Enumerated(EnumType.STRING)
    @NotNull
    private PermitType permitType;

    @Size(max = 1000)
    private String description;

    @NotNull
    private Double area;

    @NotBlank
    private String location;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotBlank
    @Size(max = 20)
    private String contactNumber;

    @NotBlank
    @Email
    private String email;

    @Enumerated(EnumType.STRING)
    @NotNull
    private PermitStatus status;

    @Size(max = 1000)
    private String adminComment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User applicant;

    // For attachments
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "permit_file_urls", joinColumns = @JoinColumn(name = "permit_id"))
    @Column(name = "file_url", length = 500)
    private List<String> fileUrls = new ArrayList<>();
}
