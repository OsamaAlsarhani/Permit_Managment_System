package com.springdata.permitmanagementsystem.service;

import com.fasterxml.jackson.databind.util.JSONWrappedObject;
import com.springdata.permitmanagementsystem.model.dto.AdminPermitDTO;
import com.springdata.permitmanagementsystem.model.entity.Permit;
import com.springdata.permitmanagementsystem.repository.PermitRepo;
import com.springdata.permitmanagementsystem.repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final PermitRepo permitRepo;

    private final UserRepo userRepo;
    public AdminService(PermitRepo permitRepo, UserRepo userRepo) {
        this.permitRepo = permitRepo;
        this.userRepo = userRepo;
    }
    public List<AdminPermitDTO> getAllpermit(){
        List<Permit> list = permitRepo.findAll();
        return list.stream().map(AdminPermitDTO::toDto).collect(Collectors.toList());
    }
    public AdminPermitDTO updatePermit(AdminPermitDTO dto){
        Permit existing = permitRepo.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Permit not found: " + dto.getId()));

        existing.setStatus(dto.getStatus());
        existing.setAdminComment(dto.getAdminComment());

        return AdminPermitDTO.toDto(permitRepo.save(existing));
    }
    public List<Object[]> reportSummary(AdminPermitDTO dto){
           List<Object[]> summary= permitRepo.countPermitsByStatus();
           return summary;
    }
    public String deletePermit(Integer id ){
        permitRepo.deleteById(id);
        return "Permit has been deleted";
    }

}
