package com.springdata.permitmanagementsystem.service;

import ch.qos.logback.core.CoreConstants;
import io.minio.*;
import io.minio.http.Method;
import io.minio.messages.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucket;

    public MinioService(
            @Value("${minio.url}") String minioUrl,
            @Value("${minio.access-key}") String accessKey,
            @Value("${minio.secret-key}") String secretKey
    ) {
        this.minioClient = MinioClient.builder()
                .endpoint(minioUrl) // MUST match the host browser uses
                .credentials(accessKey, secretKey)
                .build();
    }

    public void ensureBucket() throws Exception {
        if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build())) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
        }
    }

    public String upload(MultipartFile file) throws Exception {
        ensureBucket();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String objectName = username + "_" + file.getOriginalFilename();
        try (InputStream in = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .stream(in, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
        }
        return objectName;
    }
    public List<String> uploadFiles(List<MultipartFile> files) throws Exception {
        List<String> objectNames = new ArrayList<>();
        for (MultipartFile file : files) {
            String objectName = upload(file);
            objectNames.add(objectName);
        }
        return objectNames;
    }

    public InputStream download(String objectName) throws Exception {
        return minioClient.getObject(GetObjectArgs.builder().bucket(bucket).object(objectName).build());
    }
    public String getFileDownloadUrl(String objectName) throws Exception {
        // Generate presigned URL valid for 7 days
        String url = minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket(bucket)
                        .object(objectName)
                        .expiry(7 * 24 * 60 * 60) // seconds
                        .build()
        );
        System.out.println(url);
        return url.replace("http://minio:9000", "http://localhost:9000");
    }
}
