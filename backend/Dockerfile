# build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

ARG DB_URL
ARG DB_USERNAME
ARG DB_PASSWORD

WORKDIR /opt/app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -Dspring.datasource.url=${DB_URL} -Dspring.datasource.username=${DB_USERNAME} -Dspring.datasource.password=${DB_PASSWORD}


# run stage
FROM eclipse-temurin:17-jdk-alpine AS run

WORKDIR /opt/app

COPY --from=build /opt/app/target/pass-plz-1.0.jar /opt/app/pass-plz-1.0.jar

EXPOSE 8080

ENV DB_URL=${DB_URL}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}

ENTRYPOINT ["java", "-jar", "/opt/app/pass-plz-1.0.jar"]
