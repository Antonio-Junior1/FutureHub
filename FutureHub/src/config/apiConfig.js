/**
 * Configuração da API do Backend
 * 
 * Para desenvolvimento local:
 * - Android Emulator: use 10.0.2.2:8080
 * - iOS Simulator: use localhost:8080
 * - Dispositivo físico: use o IP da sua máquina (ex: 192.168.x.x:8080)
 */

// URL base da API Spring Boot
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:8080/api'  // Para Android Emulator
  : 'https://sua-api-producao.com/api';

// Timeout padrão para requisições (em milissegundos)
export const API_TIMEOUT = 10000;

// Endpoints da API
export const API_ENDPOINTS = {
  // Autenticação
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Áreas
  AREAS: '/areas',
  AREAS_BY_ID: (id) => `/areas/${id}`,
  
  // Usuários
  USUARIOS: '/usuarios',
  USUARIOS_BY_ID: (id) => `/usuarios/${id}`,
  
  // Missões
  MISSOES: '/missoes',
  MISSOES_BY_ID: (id) => `/missoes/${id}`,
  MISSOES_BY_AREA: (areaId) => `/missoes?areaId=${areaId}`,
  
  // Ideias
  IDEIAS: '/ideias',
  IDEIAS_BY_ID: (id) => `/ideias/${id}`,
  IDEIAS_BY_AREA: (areaId) => `/ideias?areaId=${areaId}`,
  
  // Avaliações
  AVALIACOES: '/avaliacoes',
  AVALIACOES_BY_ID: (id) => `/avaliacoes/${id}`,
  AVALIACOES_BY_IDEIA: (ideiaId) => `/avaliacoes?ideiaId=${ideiaId}`,
  
  // Ranking
  RANKING: '/ranking',
  
  // Usuário-Missão (vínculos)
  USUARIO_MISSOES: '/usuario-missoes',
  USUARIO_MISSOES_BY_ID: (id) => `/usuario-missoes/${id}`,
  USUARIO_MISSOES_BY_USUARIO: (usuarioId) => `/usuario-missoes?usuarioId=${usuarioId}`,
};

// Headers padrão
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Configuração de cache
export const CACHE_CONFIG = {
  AREAS_KEY: '@futurehub:areas_cache',
  MISSOES_KEY: '@futurehub:missoes_cache',
  IDEIAS_KEY: '@futurehub:ideias_cache',
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
};
