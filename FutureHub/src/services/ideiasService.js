import apiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@futurehub:ideias_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

/**
 * Serviço para gerenciar Ideias
 */
class IdeiasService {
  
  /**
   * Listar todas as ideias com filtros opcionais
   */
  async listarIdeias(filtros = {}, useCache = false) {
    try {
      // Tentar buscar do cache primeiro (apenas se não houver filtros)
      if (useCache && Object.keys(filtros).length === 0) {
        const cached = await this.getFromCache();
        if (cached) {
          return { success: true, data: cached, fromCache: true };
        }
      }

      const response = await apiService.get(API_ENDPOINTS.IDEIAS, filtros);
      
      if (response.success && Object.keys(filtros).length === 0) {
        // Salvar no cache apenas se for listagem completa
        await this.saveToCache(response.data);
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao listar ideias:', error);
      
      // Tentar buscar do cache em caso de erro
      const cached = await this.getFromCache();
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Listar ideias por área
   */
  async listarIdeiasPorArea(areaId) {
    return this.listarIdeias({ areaId }, false);
  }

  /**
   * Buscar ideia por ID
   */
  async buscarIdeia(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.IDEIAS_BY_ID(id));
      return response;
    } catch (error) {
      console.error(`Erro ao buscar ideia ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Criar nova ideia (requer autenticação)
   */
  async criarIdeia(ideiaData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.IDEIAS, ideiaData);
      
      if (response.success) {
        // Limpar cache para forçar atualização
        await this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao criar ideia:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Atualizar ideia (requer autenticação ADMIN)
   */
  async atualizarIdeia(id, ideiaData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.IDEIAS_BY_ID(id), ideiaData);
      
      if (response.success) {
        // Limpar cache para forçar atualização
        await this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error(`Erro ao atualizar ideia ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deletar ideia (requer autenticação ADMIN)
   */
  async deletarIdeia(id) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.IDEIAS_BY_ID(id));
      
      if (response.success) {
        // Limpar cache para forçar atualização
        await this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error(`Erro ao deletar ideia ${id}:`, error);
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
      console.error('Erro ao salvar cache de ideias:', error);
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
      console.error('Erro ao obter cache de ideias:', error);
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
      console.error('Erro ao limpar cache de ideias:', error);
    }
  }
}

export default new IdeiasService();
