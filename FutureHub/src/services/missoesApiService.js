import AsyncStorage from '@react-native-async-storage/async-storage';

// URL da API (altere para o endereço do seu servidor)
const API_URL = 'http://192.168.200.225:5000';

// Chave para armazenar missões no cache local
const CACHE_KEY = '@futurehub:missoes_cache';
const CACHE_DATE_KEY = '@futurehub:missoes_cache_date';

/**
 * Buscar missões da APIr
 * Se a API estiver offline, retorna do cache local
 */
export const buscarMissoes = async () => {
  try {
    const response = await fetch(`${API_URL}/missoes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // 5 segundos de timeout
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar missões da API');
    }

    const data = await response.json();
    
    // Salvar no cache local
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(CACHE_DATE_KEY, new Date().toISOString());

    return {
      success: true,
      data: data,
      fromCache: false,
    };
  } catch (error) {
    console.log('API offline, buscando do cache local...', error);
    
    // Tentar buscar do cache local
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      const cachedDate = await AsyncStorage.getItem(CACHE_DATE_KEY);
      
      if (cachedData) {
        return {
          success: true,
          data: JSON.parse(cachedData),
          fromCache: true,
          cacheDate: cachedDate,
        };
      }
    } catch (cacheError) {
      console.error('Erro ao buscar do cache:', cacheError);
    }

    return {
      success: false,
      error: 'API offline e sem cache disponível',
    };
  }
};

/**
 * Gerar novas missões (força a geração via API)
 */
export const gerarNovasMissoes = async () => {
  try {
    const response = await fetch(`${API_URL}/missoes/gerar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 segundos de timeout (geração pode demorar)
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar novas missões');
    }

    const data = await response.json();
    
    // Salvar no cache local
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(CACHE_DATE_KEY, new Date().toISOString());

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Erro ao gerar novas missões:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Limpar cache local de missões
 */
export const limparCache = async () => {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(CACHE_DATE_KEY);
    return { success: true };
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verificar se há cache disponível
 */
export const verificarCache = async () => {
  try {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    const cachedDate = await AsyncStorage.getItem(CACHE_DATE_KEY);
    
    return {
      hasCache: !!cachedData,
      cacheDate: cachedDate,
    };
  } catch (error) {
    console.error('Erro ao verificar cache:', error);
    return {
      hasCache: false,
      cacheDate: null,
    };
  }
};

/**
 * Converter missões da API para o formato do app
 */
export const converterMissoesParaApp = (missoesApi) => {
  if (!missoesApi || !missoesApi.missoes) {
    return {};
  }

  const missoesConvertidas = {};
  
  // Mapeamento de nomes de áreas da API para IDs do app
  const mapeamentoAreas = {
    'Cibersegurança': 'ciberseguranca',
    'Design Criatividade': 'design',
    'Empreendedorismo': 'empreendedorismo',
    'Finanças Investimentos': 'financas',
    'IA Machine Learning': 'ia',
    'Marketing Digital': 'marketing',
    'Programação': 'programacao',
    'Saúde Bem-estar': 'saude',
    'Sustentabilidade': 'sustentabilidade',
  };

  Object.entries(missoesApi.missoes).forEach(([nomeArea, missao]) => {
    const areaId = mapeamentoAreas[nomeArea];
    
    if (areaId) {
      missoesConvertidas[areaId] = [
        {
          id: `${areaId}_001`,
          titulo: missao.titulo,
          descricao: missao.objetivo.substring(0, 150) + '...', // Resumo
          objetivo: missao.objetivo,
          moral: missao.moral,
          area: areaId,
          status: 'ativa',
          dataGeracao: missoesApi.data,
        }
      ];
    }
  });

  return missoesConvertidas;
};
