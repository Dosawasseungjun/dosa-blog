# 마크다운 블로그 서버

## Railway 배포 가이드

### 1. 환경 변수 설정

Railway 대시보드에서 다음 환경 변수를 설정해야 합니다:

```
LANG=ko_KR.UTF-8
LC_ALL=ko_KR.UTF-8
JAVA_OPTS=-Dfile.encoding=UTF-8
```

### 2. 배포 방법

1. Railway CLI를 사용하여 배포:
   ```bash
   railway up
   ```

2. Railway 대시보드에서 배포:
   - GitHub 저장소를 연결하고 자동 배포를 설정합니다.
   - 배포 설정에서 `Dockerfile`을 사용하도록 설정합니다.

### 3. 문제 해결

#### 인코딩 문제

인코딩 관련 오류가 발생하면 다음 파일을 확인하세요:

1. `system.properties`: JVM 인코딩 설정
2. `Procfile`: 애플리케이션 실행 명령
3. `Dockerfile`: 컨테이너 환경 변수 설정
4. `railway.json`: Railway 배포 설정
5. `application.properties`: Spring Boot 인코딩 설정

#### 로그 확인

Railway 대시보드에서 로그를 확인하여 문제를 진단할 수 있습니다:

1. 배포 로그: 빌드 및 시작 과정에서 발생한 오류
2. 애플리케이션 로그: 런타임 오류 및 디버그 정보

### 4. 추가 설정

#### 데이터베이스 연결

Railway에서 MySQL 데이터베이스를 생성하고 연결 정보를 환경 변수로 설정합니다:

```
SPRING_DATASOURCE_URL=jdbc:mysql://mysql.railway.internal:3306/railway
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password
```

#### 파일 시스템

Railway의 임시 파일 시스템을 사용하므로, 중요한 데이터는 외부 저장소에 백업해야 합니다. 