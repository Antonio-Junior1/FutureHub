import apiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@futurehub:missoes_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

/**
 * Serviço para gerenciar Missões
 */
class MissoesService {
  
  /**
   * Listar todas as missões com filtros opcionais
   */
  async listarMissoes(filtros = {}, useCache = true) {
    try {
      // Tentar buscar do cache primeiro (apenas se não houver filtros)
      if (useCache && Object.keys(filtros).length === 0) {
        const cached = await this.getFromCache();
        if (cached) {
          return { success: true, data: cached, fromCache: true };
        }
      }

      const response = await apiService.get(API_ENDPOINTS.MISSOES, filtros);
      
      if (response.success && Object.keys(filtros).length === 0) {
        // Salvar no cache apenas se for listagem completa
        await this.saveToCache(response.data);
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao listar missões:', error);
      
      // Tentar buscar do cache em caso de erro
      const cached = await this.getFromCache();
      if (cached) {
        return { success: true, data: cached, fromCache: true };
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Listar missões por área
   */
  async listarMissoesPorArea(areaId, useCache = true) {
    return this.listarMissoes({ areaId }, useCache);
  }

  /**
   * Listar missões por status
   */
  async listarMissoesPorStatus(status, useCache = true) {
    return this.listarMissoes({ status }, useCache);
  }

  /**
   * Buscar missão por ID
   */
  async buscarMissao(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.MISSOES_BY_ID(id));
      return response;
    } catch (error) {
      console.error(`Erro ao buscar missão ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Criar nova missão (requer autenticação ADMIN)
   */
  async criarMissao(missaoData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.MISSOES, missaoData);
      
      if (response.success) {
        // Limpar cache para forçar atualização
        await this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao criar missão:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Atualizar missão (requer autenticação ADMIN)
   */
  async atualizarMissao(id, missaoData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.MISSOES_BY_ID(id), missaoData);
      
      if (response.success) {
        // Limpar cache para forçar atualização
        await this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error(`Erro ao atualizar missão ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deletar missão (requer autenticação ADMIN)
   */
  async deletarMissao(id) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.MISSOES_BY_ID(id));
      
      if (response.success) {
        // Limpar cache para forçar atualização
        await this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error(`Erro ao deletar missão ${id}:`, error);
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
      console.error('Erro ao salvar cache de missões:', error);
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
      console.error('Erro ao obter cache de missões:', error);
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
      console.error('Erro ao limpar cache de missões:', error);
    }
  }
}

export default new MissoesService();
