# 🚀 FutureHub - Plataforma de Inovação Gamificada

Plataforma que conecta usuários através de missões, ideias e ranking gamificado em diferentes áreas de conhecimento.

---

## 📋 Sobre

O FutureHub integra:
- **Backend Java:** API REST com Spring Boot
- **Backend Python:** API de geração de missões com IA
- **Frontend:** App móvel React Native (Expo)

---

## 🔗 Repositórios

### Backend Java (API Principal)
```bash
git clone https://github.com/caiohc28/futurehub-gs_java.git
```

### Backend Python (Geração de Missões IA)
```bash
git clone https://github.com/caiohc28/GS2-IOT.git
```

---

## 📁 Estrutura

```
futurehub_integrado/
├── backend/          # API Spring Boot (Java 17)
│   ├── src/main/java/
│   └── pom.xml
│
└── frontend/         # App React Native
    ├── src/
    └── package.json
```

---

## 🚀 Início Rápido

### Backend Java

```bash
cd backend
mvn spring-boot:run
```

**Acesse:** http://localhost:8080/swagger-ui.html

### Frontend

```bash
cd frontend
npm install
npm start
```

Pressione `a` (Android) ou `i` (iOS)

---

## ⚙️ Configuração

### Backend: Banco de Dados

Edite `backend/src/main/resources/application.properties`:

**Azure SQL Server:**
```properties
spring.datasource.url=jdbc:sqlserver://SEU-SERVIDOR:1433;database=futurehub
spring.datasource.username=SEU-USUARIO
spring.datasource.password=SUA-SENHA
```

**H2 (Testes):**
```properties
spring.datasource.url=jdbc:h2:mem:futurehub
spring.h2.console.enabled=true
```

### Frontend: URL da API

Edite `frontend/src/services/missoesApiService.js`:

**Para API Java:**
```javascript
const API_URL = 'http://10.0.2.2:8080/api';  // Android Emulator
```

**Para API Python:**
```javascript
const API_URL = 'http://SEU-IP:5000';  // API Python
```

---

## 📊 Funcionalidades

### Backend Java (Spring Boot)
- ✅ CRUD de Áreas, Usuários, Missões, Ideias
- ✅ Sistema de Avaliações e Ranking
- ✅ Autenticação JWT
- ✅ Documentação Swagger

### Backend Python (Flask)
- ✅ Geração de missões com IA
- ✅ Integração com modelos de linguagem

### Frontend (React Native)
- ✅ Login e Registro
- ✅ Visualização de Missões
- ✅ Mural de Ideias
- ✅ Ranking de Usuários
- ✅ Cache local

---

## 🔌 Endpoints Principais

### API Java (http://localhost:8080/api)

```
GET    /areas              - Listar áreas
GET    /missoes            - Listar missões
GET    /ideias             - Listar ideias
GET    /ranking            - Ver ranking
POST   /avaliacoes         - Avaliar ideia
```

### API Python (http://localhost:5000)

```
GET    /missoes            - Buscar missões
POST   /missoes/gerar      - Gerar novas missões com IA
```

---

## 🧪 Testar

### Backend
```bash
# Testar endpoints
curl http://localhost:8080/api/areas
curl http://localhost:8080/api/missoes

# Ver Swagger
http://localhost:8080/swagger-ui.html
```

### Frontend
```bash
# Limpar cache e reiniciar
npm start -- --reset-cache
```

---

## 🛠️ Stack Tecnológico

**Backend Java:**
- Java 17
- Spring Boot 3.5.7
- Azure SQL Server
- JWT + Spring Security

**Backend Python:**
- Flask
- OpenAI/Gemini API

**Frontend:**
- React Native 0.74.5
- Expo 51.0.28
- AsyncStorage

---

## 🐛 Problemas Comuns

### Backend não inicia
```bash
java -version  # Verificar Java 17
mvn clean install
```

### Frontend não conecta
- **Android Emulator:** Use `10.0.2.2:8080`
- **iOS Simulator:** Use `localhost:8080`
- **Dispositivo Físico:** Use IP da máquina

### Limpar cache do app
```bash
npm start -- --reset-cache
```

---

## 📚 Documentação

- **Swagger:** http://localhost:8080/swagger-ui.html
- **Repositório:** https://github.com/caiohc28/futurehub-gs_java.git

---

