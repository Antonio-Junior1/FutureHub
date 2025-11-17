# 🌍 FutureHub Challenge

### *Plataforma colaborativa de missões sustentáveis geradas por IA para promover inovação e impacto social*

---

## 📋 Visão Geral

**FutureHub Challenge** é um aplicativo mobile desenvolvido em React Native que conecta pessoas através de missões colaborativas focadas em **sustentabilidade**, **inovação** e **impacto social**. As missões são geradas por **Inteligência Artificial (Google Gemini 2.5 Flash)** e personalizadas de acordo com as áreas de interesse de cada usuário.

### Principais Funcionalidades

- 🎯 **Missões Personalizadas**: Receba missões geradas por IA baseadas em suas áreas de interesse
- 💡 **Mural de Ideias**: Compartilhe suas soluções e veja ideias de outros usuários
- 🏆 **Sistema de Ranking**: Ganhe pontos ao completar missões e suba no ranking global
- 🎨 **Gamificação**: Badges, níveis e recompensas por contribuições
- 🌐 **Áreas Diversas**: Cibersegurança, IA, Sustentabilidade, Design, Programação e mais
- 🔄 **Geração Dinâmica**: Gere novas missões a qualquer momento usando IA

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────┐
│   App React Native          │
│   (FutureHub Mobile)        │
└──────────────┬──────────────┘
               │
               ├──────────────────────────┐
               │                          │
               ▼                          ▼
┌──────────────────────┐    ┌──────────────────────┐
│   Firebase           │    │   API Flask (Python) │
│   - Authentication   │    │   - Geração de       │
│   - Firestore DB     │    │     Missões com IA   │
│   - Storage          │    │   - Gemini API       │
└──────────────────────┘    └──────────────────────┘
```

---

## 🚀 Tecnologias Utilizadas

### Frontend (Mobile)
- **React Native** 0.74.5
- **Expo** ~51.0.28
- **React Navigation** 6.x
- **Firebase** 10.12.2
- **AsyncStorage** para cache local

### Backend (API)
- **Python** 3.10+
- **Flask** - Framework web
- **Google Gemini 2.5 Flash** - IA Generativa
- **Oracle Database** - Armazenamento de áreas
- **python-dotenv** - Gerenciamento de variáveis de ambiente

### Banco de Dados
- **Firebase Firestore** - Dados em tempo real
- **Firebase Authentication** - Autenticação de usuários
- **Oracle Database** - Áreas de interesse (via API)

---

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ e npm
- Python 3.10+
- Expo CLI
- Conta Google (para Firebase e Gemini API)
- Git

### 1. Clonar o Repositório

```bash
# Clone o repositório do app
git clone https://github.com/seu-usuario/futurehub-challenge.git
cd futurehub-challenge

# Clone o repositório da API
git clone https://github.com/caiohc28/GS2-IOT.git
```

### 2. Configurar a API Python

```bash
# Navegar para a pasta da API
cd GS2-IOT

# Instalar dependências Python
python -m pip install flask google-generativeai python-dotenv oracledb

# Criar arquivo .env
echo "GEMINI_API_KEY=sua_chave_aqui" > .env
```

**Obter chave do Gemini:**
1. Acesse: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em **"Create API Key"**
4. Copie a chave e cole no arquivo `.env`

**Iniciar a API:**
```bash
python api.py
```

A API estará rodando em:
- `http://localhost:5000` (local)
- `http://SEU_IP:5000` (rede local)

### 3. Configurar o App React Native

```bash
# Voltar para a pasta do app
cd ../futurehub-challenge

# Instalar dependências
npm install

# Configurar URL da API
# Edite o arquivo: src/services/missoesApiService.js
# Linha 4: const API_URL = 'http://SEU_IP:5000';
```

**Descobrir seu IP:**
- Windows: `ipconfig` (procure "Endereço IPv4")
- Mac/Linux: `ifconfig` ou `ip addr`

**URLs recomendadas:**
- Android Emulator: `http://10.0.2.2:5000`
- iOS Simulator: `http://localhost:5000`
- Dispositivo físico: `http://SEU_IP_LOCAL:5000`

### 4. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative **Authentication** (Email/Password)
3. Ative **Firestore Database**
4. Copie as credenciais do Firebase
5. Cole em `src/config/firebaseConfig.js`

### 5. Executar o App

```bash
npm start
```

Escaneie o QR Code com o app **Expo Go** ou pressione:
- `a` para Android
- `i` para iOS

---

## 🎯 Estrutura do Projeto

```
futurehub-challenge/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── IdeaCard.js
│   │   ├── MissionCard.js
│   │   ├── RankingItem.js
│   │   └── InterestChip.js
│   ├── screens/             # Telas do app
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── MissionsScreen.js
│   │   ├── IdeasWallScreen.js
│   │   ├── RankingScreen.js
│   │   └── ProfileScreen.js
│   ├── services/            # Serviços e APIs
│   │   ├── authService.js
│   │   ├── firestoreService.js
│   │   └── missoesApiService.js  # 🆕 Integração com API Python
│   ├── contexts/            # Context API
│   │   └── UserContext.js
│   ├── data/                # Dados estáticos
│   │   ├── areas.js
│   │   └── missions.js
│   ├── theme/               # Tema e estilos
│   │   ├── colors.js
│   │   ├── fonts.js
│   │   └── index.js
│   ├── config/              # Configurações
│   │   └── firebaseConfig.js
│   └── utils/               # Utilitários
│       └── validators.js
├── assets/                  # Imagens e ícones
├── App.js                   # Componente raiz
├── package.json
└── README.md
```

---

## 🔌 API de Missões (Python + IA)

### Repositório da API
🔗 [https://github.com/caiohc28/GS2-IOT](https://github.com/caiohc28/GS2-IOT)

### Endpoints Disponíveis

#### 1. GET `/missoes`
Retorna as missões semanais (gera novas automaticamente se passaram 7 dias)

**Response:**
```json
{
  "data": "17/11/2025",
  "missoes": {
    "Cibersegurança": {
      "titulo": "Ciber-Guardiões Verdes",
      "objetivo": "Desenvolva um conceito...",
      "moral": "A cibersegurança transcende..."
    },
    ...
  }
}
```

#### 2. POST `/missoes/gerar`
Força a geração de novas missões usando IA (Google Gemini)

**Response:** Mesmo formato do GET `/missoes`

### Como Funciona

1. **App solicita missões** → API verifica se há missões recentes
2. **Se não há ou estão desatualizadas** → API chama Google Gemini
3. **Gemini gera missões personalizadas** → API salva em JSON
4. **API retorna missões** → App exibe para o usuário
5. **Cache local** → App funciona offline com missões salvas

---

## 🎨 Áreas de Interesse

O app oferece 9 áreas de interesse:

| Área | Descrição | Cor |
|------|-----------|-----|
| 🛡️ Cibersegurança | Proteja infraestruturas digitais | #6610f2 |
| 🎨 Design Criatividade | Crie experiências visuais inovadoras | #ff6b81 |
| 🚀 Empreendedorismo | Desenvolva negócios sustentáveis | #ffd93d |
| 💰 Finanças Investimentos | Explore modelos financeiros inovadores | #20c997 |
| 🤖 IA Machine Learning | Aplique IA para resolver problemas | #e94560 |
| 📢 Marketing Digital | Crie estratégias digitais com propósito | #fd7e14 |
| 💻 Programação | Desenvolva soluções tecnológicas | #17a2b8 |
| 🏥 Saúde Bem-estar | Promova saúde e bem-estar | #fd7e14 |
| 🌱 Sustentabilidade | Crie soluções para um futuro verde | #28a745 |

---

## 🎮 Sistema de Pontuação

### Como Ganhar Pontos

- ✅ **Publicar ideia**: +10 pontos
- ❤️ **Receber curtida**: +5 pontos
- ⭐ **Receber avaliação**: +3 pontos por estrela

### Níveis e Badges

| Pontos | Badge | Ícone |
|--------|-------|-------|
| 0-50 | Iniciante | 🥉 |
| 51-150 | Colaborador | 🥈 |
| 151-300 | Inovador | 🥇 |
| 301+ | Visionário | 💎 |

---

## 🔧 Troubleshooting

### App não conecta na API

**Problema:** Missões não carregam ou aparecem do cache

**Soluções:**
1. Verifique se a API está rodando: `http://SEU_IP:5000/missoes`
2. Verifique o IP no arquivo `missoesApiService.js`
3. Certifique-se que celular e PC estão na mesma rede Wi-Fi
4. Desative temporariamente o firewall do Windows
5. Para Android Emulator, use `http://10.0.2.2:5000`

### Erro ao gerar missões

**Problema:** Botão ✨ não funciona

**Soluções:**
1. Verifique a chave do Gemini no arquivo `.env`
2. Verifique conexão com internet
3. Verifique logs da API Python
4. Verifique quota da API do Gemini

### Firebase não conecta

**Problema:** Erro de autenticação

**Soluções:**
1. Verifique credenciais em `firebaseConfig.js`
2. Ative Authentication no Firebase Console
3. Ative Firestore Database
4. Verifique regras de segurança do Firestore

---

## 📱 Funcionalidades Detalhadas

### 1. Tela de Missões
- Exibe missões personalizadas baseadas em interesses
- Botão **✨** para gerar novas missões com IA
- Pull-to-refresh para atualizar
- Indicador de cache quando offline
- Navegação para submissão de ideias

### 2. Mural de Ideias
- Feed de ideias de todos os usuários
- Filtro por área de interesse
- Sistema de curtidas e avaliações
- Visualização de detalhes da ideia

### 3. Ranking Global
- Pódio com top 3 usuários
- Lista completa de ranking
- Destaque para posição do usuário
- Badges de nível

### 4. Perfil
- Edição de dados pessoais
- Seleção de áreas de interesse
- Visualização de estatísticas
- Logout

---

## 🚀 Deploy

### App Mobile

**Expo EAS Build:**
```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
```

**Publicar na loja:**
```bash
eas submit --platform android
eas submit --platform ios
```

### API Python

**Opções de hospedagem:**
- Heroku
- AWS EC2
- Google Cloud Run
- DigitalOcean
- Railway

**Exemplo com Heroku:**
```bash
heroku create futurehub-api
git push heroku main
heroku config:set GEMINI_API_KEY=sua_chave
```

---

## 👥 Desenvolvedores

### Equipe FutureHub
- **Caio Carnetti** - RM 554600
- **Carlos Eduardo** - RM 555223
- **Antônio Lino** - RM 554518

### Repositórios
- 📱 App Mobile: [GitHub - FutureHub App](https://github.com/seu-usuario/futurehub-challenge)
- 🔌 API Python: [GitHub - GS2-IOT](https://github.com/caiohc28/GS2-IOT)

---

## 📄 Licença

Este projeto foi desenvolvido como parte do **Global Solution 2025** da FIAP.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

## 📞 Suporte

Para dúvidas ou suporte:
- 📧 Email: contato@futurehub.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/futurehub-challenge/issues)

---

## 🌟 Agradecimentos

- **FIAP** - Pela oportunidade e desafio
- **Google** - Pela API do Gemini
- **Firebase** - Pela infraestrutura
- **Comunidade Open Source** - Pelas ferramentas incríveis

---

**Versão:** 4.0  
**Última atualização:** Novembro 2025  
**Status:** ✅ Em produção

---

*Desenvolvido com ❤️ pela equipe FutureHub*
