package com.springdata.permitmanagementsystem.controller;

import com.springdata.permitmanagementsystem.model.dto.AdminPermitDTO;
import com.springdata.permitmanagementsystem.model.entity.Permit;
import com.springdata.permitmanagementsystem.service.AdminService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin/permit")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }
    @GetMapping("/get-all-permit")
    public List<AdminPermitDTO> getAllpermit(){
        return adminService.getAllpermit();
    }
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updatestatus(@PathVariable Integer id, @RequestBody AdminPermitDTO dto){
        try{
            dto.setId(id);
       return ResponseEntity.ok(adminService.updatePermit(dto)) ;
       }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/summary-report")
    public List<Object[]> summary(AdminPermitDTO dto){
        return adminService.reportSummary(dto)  ;
    }
    @DeleteMapping("/delete-permit")
    public ResponseEntity<?> deletepermit(@RequestParam("id") Integer id){
        return  ResponseEntity.ok(adminService.deletePermit(id)) ;

    }
}
