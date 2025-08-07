package com.springdata.permitmanagementsystem.repository;

import com.springdata.permitmanagementsystem.model.entity.Permit;
import com.springdata.permitmanagementsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PermitRepo extends JpaRepository<Permit, Integer> {
    List<Permit> findByApplicant(User user);
    List<Permit> findByApplicant_Username(String username);
    @Query("SELECT p.status, COUNT(p) FROM Permit p GROUP BY p.status")
    List<Object[]> countPermitsByStatus();
}
