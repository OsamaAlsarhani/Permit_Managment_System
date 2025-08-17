# Use official OpenJDK 21 image as base
FROM eclipse-temurin:21-jdk-jammy

# Set working directory
WORKDIR /app

# Copy Gradle files first to leverage Docker cache
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY src src

# Run Gradle build
RUN ./gradlew build -x test

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "build/libs/PermitManagementSystem-0.0.1-SNAPSHOT.jar"]