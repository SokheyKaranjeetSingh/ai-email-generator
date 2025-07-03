#Use an official Maven image to build the the Spring Boot app
FROM maven:3.8.4-openjdk-17-slim AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and the source code
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the app
COPY src ./src
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/target/email-writer-sb-0.0.1-SNAPSHOT.jar .

# Expose the port the app runs on
EXPOSE 8080

#specify the command to run the app
CMD ["java", "-jar", "email-writer-sb-0.0.1-SNAPSHOT.jar"]
