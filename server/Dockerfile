FROM openjdk:17-jdk-slim

WORKDIR /app

# 시스템 인코딩 설정
ENV LANG=ko_KR.UTF-8
ENV LC_ALL=ko_KR.UTF-8
ENV JAVA_OPTS="-Dfile.encoding=UTF-8 -Duser.language=ko -Duser.country=KR -Duser.timezone=Asia/Seoul"

# 로케일 설정
RUN apt-get update && apt-get install -y locales && \
    localedef -i ko_KR -c -f UTF-8 -A /usr/share/locale/locale.alias ko_KR.UTF-8 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 애플리케이션 JAR 파일 복사
COPY target/markdownblog-0.0.1-SNAPSHOT.jar app.jar

# 포트 노출
EXPOSE 8080

# 애플리케이션 실행
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 