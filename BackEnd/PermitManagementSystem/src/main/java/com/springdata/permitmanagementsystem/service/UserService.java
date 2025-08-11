package com.springdata.permitmanagementsystem.service;


import com.springdata.permitmanagementsystem.model.dto.UserDto;
import com.springdata.permitmanagementsystem.model.entity.User;
import com.springdata.permitmanagementsystem.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepo userRepo;

    private final PasswordEncoder encoder;
    public UserService (UserRepo userRepo , PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }
    public String register(UserDto request) {
        if (userRepo.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(
                request.getRole() != null && request.getRole().startsWith("ROLE_")
                        ? request.getRole()
                        : "ROLE_USER"
        );

        userRepo.save(user);
        return "User registered";
    }
    public UserDto getUserByUsername(String username) {
        Optional<User> user = userRepo.findByUsername(username);
        return user.map(UserDto::toDto).orElse(null);
    }
    public List<UserDto> getALlUser() {
        List<User> users = userRepo.findAll();
        return users.stream().map(UserDto::toDto).collect(Collectors.toList());
    }
    public String deleteUserById(Integer id) {
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
            return "User deleted";
        }
        else  return "User not found";
    }

}

