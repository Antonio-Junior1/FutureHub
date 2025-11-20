import apiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@futurehub:areas_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

/**
 * Serviço para gerenciar Áreas
 */
class AreasService {
  
  /**
   * Listar todas as áreas
   */
  async listarAreas(useCache = true) {
    try {
      // Tentar buscar do cache primeiro
      if (useCache) {
        const cached = await this.getFromCache();
        if (cached) {
          return { success: true, data: cached, fromCache: true };
        }
      }

      const response = await apiService.get(API_ENDPOINTS.AREAS);
      
      if (response.success) {
        // Salvar no cache
        await this.saveToCache(response.data);
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao listar áreas:', error);
      
      // Tentar buscar do cache em caso de erro
      const cached = await this.getFromCache();
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar área por ID
   */
  async buscarArea(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.AREAS_BY_ID(id));
      return response;
    } catch (error) {
      console.error(`Erro ao buscar área ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Criar nova área (requer autenticação ADMIN)
   */
  async criarArea(areaData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AREAS, areaData);
      
      if (response.success) {
        // Limpar cache para forçar atualização
        await this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao criar área:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Atualizar área (requer autenticação ADMIN)
   */
  async atualizarArea(id, areaData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.AREAS_BY_ID(id), areaData);
      
      if (response.success) {
        // Limpar cache para forçar atualização
        await this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error(`Erro ao atualizar área ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deletar área (requer autenticação ADMIN)
   */
  async deletarArea(id) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.AREAS_BY_ID(id));
      
      if (response.success) {
        // Limpar cache para forçar atualização
        await this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error(`Erro ao deletar área ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Salvar no cache
   */
  async saveToCache(data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erro ao salvar cache de áreas:', error);
    }
  }

  /**
   * Obter do cache
   */
  async getFromCache() {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      
      // Verificar se o cache ainda é válido
      if (Date.now() - timestamp > CACHE_DURATION) {
        await this.clearCache();
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao obter cache de áreas:', error);
      return null;
    }
  }

  /**
   * Limpar cache
   */
  async clearCache() {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Erro ao limpar cache de áreas:', error);
    }
  }
}

export default new AreasService();
