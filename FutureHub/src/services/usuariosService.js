import apiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';

/**
 * Serviço para gerenciar Usuários
 */
class UsuariosService {
  
  /**
   * Listar todos os usuários (requer autenticação ADMIN)
   */
  async listarUsuarios(page = 0, size = 20) {
    try {
      const response = await apiService.get(API_ENDPOINTS.USUARIOS, { page, size });
      return response;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar usuário por ID
   */
  async buscarUsuario(id) {
    try {
      const response = await apiService.get(API_ENDPOINTS.USUARIOS_BY_ID(id));
      return response;
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Criar novo usuário (requer autenticação ADMIN)
   */
  async criarUsuario(usuarioData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.USUARIOS, usuarioData);
      return response;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Atualizar usuário (requer autenticação ADMIN)
   */
  async atualizarUsuario(id, usuarioData) {
    try {
      const response = await apiService.put(API_ENDPOINTS.USUARIOS_BY_ID(id), usuarioData);
      return response;
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deletar usuário (requer autenticação ADMIN)
   */
  async deletarUsuario(id) {
    try {
      const response = await apiService.delete(API_ENDPOINTS.USUARIOS_BY_ID(id));
      return response;
    } catch (error) {
      console.error(`Erro ao deletar usuário ${id}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obter perfil do usuário atual
   */
  async obterPerfil() {
    try {
      // Assumindo que o backend retorna o usuário atual baseado no token
      const response = await apiService.get('/usuarios/me');
      return response;
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Atualizar perfil do usuário atual
   */
  async atualizarPerfil(dadosPerfil) {
    try {
      const response = await apiService.put('/usuarios/me', dadosPerfil);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new UsuariosService();
