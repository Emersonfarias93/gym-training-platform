FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

ENV MAVEN_OPTS="-Xmx512m -XX:+UseSerialGC"

COPY pom.xml .
COPY backend ./backend

RUN mvn -pl backend/llm-service -am clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/backend/llm-service/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Xmx192m", "-jar", "app.jar"]