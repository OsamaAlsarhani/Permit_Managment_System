package com.springdata.permitmanagementsystem.service;

import com.springdata.permitmanagementsystem.model.dto.PermitDTO;
import com.springdata.permitmanagementsystem.model.dto.UserPermitDTO;
import com.springdata.permitmanagementsystem.model.entity.Permit;
import com.springdata.permitmanagementsystem.model.entity.User;
import com.springdata.permitmanagementsystem.model.enums.PermitStatus;
import com.springdata.permitmanagementsystem.repository.PermitRepo;
import com.springdata.permitmanagementsystem.repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.util.List;
import java.util.stream.Collectors;

import static com.springdata.permitmanagementsystem.model.dto.PermitDTO.toPermitDTO;

@Service

public class PermitService {

    private final PermitRepo permitRepo;

    private final UserRepo userRepo;
    private final FileStorageService fileStorageService;
    public PermitService (PermitRepo permitRepo, UserRepo userRepo, FileStorageService fileStorageService) {
        this.permitRepo = permitRepo;
        this.userRepo = userRepo;
        this.fileStorageService = fileStorageService;
    }
        public PermitDTO createPermit(PermitDTO permitDTO) {
        // Get current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User applicant = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // If DTO has an ID, ensure it's not already existing (for create, usually id is null)
        if (permitDTO.getId() != null && permitRepo.existsById(permitDTO.getId())) {
            throw new RuntimeException("Permit already exists with id: " + permitDTO.getId());
        }

        // Map DTO -> entity
        Permit permit = new Permit();
        permit.setApplicantName(username);
        permit.setNationalIdOrCr(permitDTO.getNationalIdOrCr());
        permit.setPermitType(permitDTO.getPermitType());
        permit.setDescription(permitDTO.getDescription());
        permit.setArea(permitDTO.getArea());
        permit.setLocation(permitDTO.getLocation());
        permit.setStartDate(permitDTO.getStartDate());
        permit.setEndDate(permitDTO.getEndDate());
        permit.setContactNumber(permitDTO.getContactNumber());
        permit.setEmail(permitDTO.getEmail());
        permit.setFileUrls(permitDTO.getFileUrls());
        permit.setApplicant(applicant);
        permit.setStatus(PermitStatus.PENDING); // initial status
        permit.setAdminComment(null); // none yet

        // Persist
        Permit saved = permitRepo.save(permit);

        // Map back to DTO
        return toPermitDTO(saved);
    }

    public PermitDTO updatePermit(PermitDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Permit existing = permitRepo.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Permit not found: " + dto.getId()));

        // ownership
        if (!existing.getApplicant().getUsername().equals(username)) {
            throw new AccessDeniedException("Cannot modify someone else's permit");
        }

        // only allow if EDIT_REQUESTED
    /*    if (existing.getStatus() != PermitStatus.EDIT_REQUESTED) {
            throw new IllegalStateException("Permit is not in a state that allows edits");
        }*/

        // apply updates
        existing.setApplicantName(dto.getApplicantName());
        existing.setNationalIdOrCr(dto.getNationalIdOrCr());
        existing.setPermitType(dto.getPermitType());
        existing.setDescription(dto.getDescription());
        existing.setArea(dto.getArea());
        existing.setLocation(dto.getLocation());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setContactNumber(dto.getContactNumber());
        existing.setEmail(dto.getEmail());
        existing.setFileUrls(dto.getFileUrls());

        // transition back to pending (or whatever your logic is)
        existing.setStatus(PermitStatus.PENDING);

        Permit saved = permitRepo.save(existing);
        return PermitDTO.toPermitDTO(saved);
    }


    public List<PermitDTO>  getPermitsForUser() {
        String username =  SecurityContextHolder.getContext().getAuthentication().getName();
        User user =userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<Permit> permits = permitRepo.findByApplicant(user);
        return permits.stream()
                .map(PermitDTO::toPermitDTO)
                .collect(Collectors.toList());
    }
   public String deletePermit(Integer id) {
        String username =SecurityContextHolder.getContext().getAuthentication().getName();
       User user =userRepo.findByUsername(username)
               .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
       permitRepo.deleteById(id);
       return "Permit has been deleted";
   }
    public String uploadFileToPermit(Integer permitId, MultipartFile file) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Permit permit = permitRepo.findById(permitId)
                .orElseThrow(() -> new EntityNotFoundException("Permit not found: " + permitId));

        // Make sure the user owns the permit
        if (!permit.getApplicant().getUsername().equals(username)) {
            throw new AccessDeniedException("You do not have permission to upload to this permit.");
        }

        // Save file using FileStorageService
        String fileName = fileStorageService.storeFile(file);

        // Add filename to the permit
        permit.getFileUrls().add(fileName);
        permitRepo.save(permit);

        return fileName;
    }


}
