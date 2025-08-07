package com.springdata.permitmanagementsystem.repository;

import com.springdata.permitmanagementsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepo extends JpaRepository<User,Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndPassword(String username, String password);
    Optional<User>  deleteUserByUsername(String username);
    Boolean existsByUsername(String username);
}
