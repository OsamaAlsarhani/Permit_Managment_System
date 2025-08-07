package com.springdata.permitmanagementsystem.controller;

import com.springdata.permitmanagementsystem.model.dto.PermitDTO;
import com.springdata.permitmanagementsystem.model.dto.UserPermitDTO;
import com.springdata.permitmanagementsystem.repository.PermitRepo;
import com.springdata.permitmanagementsystem.service.PermitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/user/permit")
@PreAuthorize("hasRole('USER')")
public class UserPermitController {

    private final PermitService permitService;
    public UserPermitController(PermitService permitService) {
        this.permitService = permitService;
    }
 @PostMapping("/create-permit")
    public ResponseEntity<?> createPermit(@RequestBody PermitDTO permitDTO) {
       try{
          return ResponseEntity.ok().body(permitService.createPermit(permitDTO));
       }catch(Exception e){
           return ResponseEntity.badRequest().body(e.getMessage());
       }
    }

    @PutMapping("/update-permit/{id}")
    public ResponseEntity<?> updatePermit(@PathVariable Integer id, @RequestBody PermitDTO dto) {
        // Only allow update if status == NEEDS_EDIT and owner == auth.user
        try{
            dto.setId(id);
            return ResponseEntity.ok().body(permitService.updatePermit(dto));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-all-permit")
    public List<PermitDTO> getMyPermits() {
        return permitService.getPermitsForUser();
    }
    @DeleteMapping("/delete-permit")
    public ResponseEntity<?> deletePermit( Integer id) {
        return ResponseEntity.ok((permitService.deletePermit(id)));
    }
    @PostMapping("upload-files{id}")
    public ResponseEntity<?> uploadFile(@PathVariable Integer id, @RequestParam("file") MultipartFile file) {
        try {
            String fileName = permitService.uploadFileToPermit(id, file);
            return ResponseEntity.ok("File uploaded: " + fileName);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
