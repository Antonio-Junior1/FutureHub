import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT, DEFAULT_HEADERS } from '../config/apiConfig';

/**
 * Serviço base para comunicação com a API
 */
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
    this.token = null;
  }

  /**
   * Configurar token de autenticação
   */
  async setToken(token) {
    this.token = token;
    if (token) {
      await AsyncStorage.setItem('@futurehub:auth_token', token);
    } else {
      await AsyncStorage.removeItem('@futurehub:auth_token');
    }
  }

  /**
   * Obter token armazenado
   */
  async getToken() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('@futurehub:auth_token');
    }
    return this.token;
  }

  /**
   * Construir headers da requisição
   */
  async buildHeaders(customHeaders = {}) {
    const token = await this.getToken();
    const headers = { ...DEFAULT_HEADERS, ...customHeaders };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Fazer requisição HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.buildHeaders(options.headers);
    
    const config = {
      ...options,
      headers,
      timeout: options.timeout || this.timeout,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || data || 'Erro na requisição',
          data,
        };
      }

      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error) {
      console.error(`Erro na requisição ${endpoint}:`, error);

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Tempo de requisição esgotado',
          timeout: true,
        };
      }

      return {
        success: false,
        error: error.message || 'Erro ao conectar com o servidor',
        status: error.status,
        data: error.data,
      };
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Upload de arquivo
   */
  async upload(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

// Exportar instância única (Singleton)
export default new ApiService();
