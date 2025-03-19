# build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

WORKDIR /opt/app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests=true


# run stage
FROM eclipse-temurin:17-jdk-alpine AS run

WORKDIR /opt/app

COPY --from=build /opt/app/target/pass-plz-1.0.jar /opt/app/pass-plz-1.0.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/opt/app/pass-plz-1.0.jar"]
