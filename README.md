# FutureHub Challenge 🚀

## Sobre o Projeto

O **FutureHub Challenge** é um aplicativo mobile colaborativo desenvolvido para ser um **catalisador de ideias e desenvolvimento profissional**. Ele conecta usuários por meio de **8 áreas de interesse** e os engaja com **missões gamificadas** que estimulam a criatividade, a colaboração e a busca por soluções inovadoras para o futuro do trabalho e da sociedade.

A plataforma transforma o aprendizado e a colaboração em uma experiência divertida e recompensadora, utilizando a **gamificação** (ranking com badges) para motivar os usuários a alcançar seus objetivos e interagir ativamente com a comunidade através do **Mural de Ideias**.

## 💡 Áreas de Foco

O FutureHub Challenge abrange 8 áreas temáticas essenciais para o futuro:

| Área | Descrição |
| :--- | :--- |
| **Inteligência Artificial** | Explore o futuro da IA e suas aplicações no mundo do trabalho. |
| **Sustentabilidade** | Crie soluções para um futuro mais verde e sustentável. |
| **Programação** | Desenvolva ferramentas e soluções tecnológicas inovadoras. |
| **Design** | Crie experiências visuais e interfaces que transformam. |
| **Empreendedorismo** | Desenvolva modelos de negócio inovadores e sustentáveis. |
| **Educação** | Reimagine o aprendizado para o futuro do trabalho. |
| **Saúde e Bem-estar** | Promova saúde mental e física no ambiente de trabalho. |
| **Inclusão e Diversidade** | Construa ambientes de trabalho mais inclusivos e diversos. |

## Features Implementadas

O aplicativo conta com as seguintes funcionalidades principais:

1.  **Autenticação Segura (Firebase Auth):**
    *   ✅ Cadastro e Login de usuários com persistência de sessão.
2.  **Personalização da Experiência:**
    *   ✅ **Seleção de Interesses:** O usuário escolhe de 1 a 3 áreas de foco, personalizando o conteúdo de missões.
3.  **Gamificação e Desenvolvimento:**
    *   ✅ **Missões Personalizadas:** Mais de 40 desafios (5 por área) que estimulam a reflexão e a proposição de soluções.
    *   ✅ **Ranking com Badges:** Sistema de pontuação e reconhecimento para engajar a comunidade.
4.  **Colaboração e Comunidade:**
    *   ✅ **Mural de Ideias:** Espaço para compartilhamento de propostas e projetos.
    *   ✅ **Sistema de Curtidas e Avaliações:** Feedback e engajamento da comunidade nas ideias postadas.
5.  **Experiência do Usuário (UX):**
    *   ✅ **Tema Claro/Escuro:** Adaptação visual dinâmica às preferências do sistema do usuário.
    *   ✅ **Navegação Intuitiva:** Uso de `React Navigation` com Bottom Tabs para fácil acesso às telas.

## 🛠️ Tecnologias

O projeto foi construído com um stack moderno e robusto para desenvolvimento mobile:

| Categoria | Tecnologia | Versão | Propósito |
| :--- | :--- | :--- | :--- |
| **Framework** | React Native | 0.74.5 | Desenvolvimento mobile multiplataforma. |
| **Plataforma** | Expo | 51 | Ferramentas e serviços para desenvolvimento e build. |
| **Backend** | Firebase | 10.12.2 | Autenticação (`Auth`) e Banco de Dados NoSQL (`Firestore`). |
| **Navegação** | React Navigation | 6.x | Gerenciamento de rotas e telas. |
| **Persistência** | AsyncStorage | 1.23.1 | Armazenamento local assíncrono. |

## Instalação e Configuração

Para rodar o projeto em seu ambiente local, siga os passos abaixo:

### Pré-requisitos

*   Node.js e npm instalados.
*   Expo Go instalado no seu dispositivo móvel (iOS ou Android).

### Passos

```bash
# 1. Clone o repositório
git clone [LINK_DO_REPOSITORIO]
cd FutureHub-main/FutureHub

# 2. Instalar dependências
npm install

# 3. Configurar Firebase
# O projeto utiliza Firebase para autenticação e Firestore.
# Você DEVE criar seu próprio projeto no Firebase e atualizar o arquivo:
# src/config/firebaseConfig.js
# com suas credenciais (apiKey, authDomain, projectId, etc.).

# 4. Iniciar o aplicativo
npm start

# 5. Escaneie o QR code exibido no terminal ou no navegador com o aplicativo Expo Go.
```

## 👥 Integrantes

O projeto foi desenvolvido pelos seguintes membros:

*   RM - 555223 Carlos Eduardo [https://github.com/CarlosCampos84](https://github.com/CarlosCampos84)
*   RM - 554518 Antônio Júnior [https://github.com/Antonio-Junior1](https://github.com/Antonio-Junior1)
*   RM - 554600 Caio Henrique [https://github.com/caiohc28](https://github.com/caiohc28)

