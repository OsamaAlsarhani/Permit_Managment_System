package com.springdata.permitmanagementsystem.model.entity;


import com.springdata.permitmanagementsystem.model.dto.UserDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Table(name = "users")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank
    @Size(max = 20)
    private String username;
    @NotBlank

    private String password;
    @NotNull
    private String role; // USER - ADMIN

   @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Permit> permits = new ArrayList<>();

    public static User toEntity(UserDto userDto) {
        return User.builder().id(userDto.getId())
                .username(userDto.getUsername())
                .password(userDto.getPassword())
                .role(userDto.getRole())
                .build();
    }
}
