FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

ENTRYPOINT ["java", "-Xmx192m", "-jar", "app.jar"]

COPY pom.xml .
COPY backend ./backend

RUN mvn -pl backend/realtime-service -am clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/backend/realtime-service/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Xmx192m", "-jar", "app.jar"]