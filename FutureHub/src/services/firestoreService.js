import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// ========== USUÁRIOS ==========

export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'usuarios', userId), {
      ...userData,
      pontos: 0,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    return { success: false, error };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'usuarios', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Usuário não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return { success: false, error };
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const docRef = doc(db, 'usuarios', userId);
    // Usar setDoc com merge para criar o documento se não existir
    await setDoc(docRef, updates, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { success: false, error };
  }
};

export const updateUserPoints = async (userId, points) => {
  try {
    const docRef = doc(db, 'usuarios', userId);
    await updateDoc(docRef, {
      pontos: increment(points)
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar pontos:', error);
    return { success: false, error };
  }
};

// ========== MISSÕES ==========

export const getMissionsByUserInterests = async (interests) => {
  try {
    const missions = [];
    
    for (const interest of interests) {
      const q = query(
        collection(db, 'missoes'),
        where('area', '==', interest),
        where('status', '==', 'ativa'),
        limit(5)
      );
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        missions.push({ id: doc.id, ...doc.data() });
      });
    }
    
    return { success: true, data: missions };
  } catch (error) {
    console.error('Erro ao buscar missões:', error);
    return { success: false, error };
  }
};

export const markMissionAsCompleted = async (userId, missionId) => {
  try {
    const docRef = doc(db, 'usuarios_missoes', `${userId}_${missionId}`);
    await setDoc(docRef, {
      id_usuario: userId,
      id_missao: missionId,
      data_conclusao: serverTimestamp(),
      status: 'concluida'
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao marcar missão como concluída:', error);
    return { success: false, error };
  }
};

export const getUserCompletedMissions = async (userId) => {
  try {
    const q = query(
      collection(db, 'usuarios_missoes'),
      where('id_usuario', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const missions = [];
    querySnapshot.forEach((doc) => {
      missions.push(doc.data().id_missao);
    });
    
    return { success: true, data: missions };
  } catch (error) {
    console.error('Erro ao buscar missões concluídas:', error);
    return { success: false, error };
  }
};

// ========== IDEIAS ==========

export const createIdea = async (ideaData) => {
  try {
    const ideasRef = collection(db, 'ideias');
    const newIdeaRef = doc(ideasRef);
    
    await setDoc(newIdeaRef, {
      ...ideaData,
      media_notas: 0,
      total_avaliacoes: 0,
      likes: 0,
      createdAt: serverTimestamp(),
    });
    
    return { success: true, id: newIdeaRef.id };
  } catch (error) {
    console.error('Erro ao criar ideia:', error);
    return { success: false, error };
  }
};

export const getIdeasByArea = async (area, limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'ideias'),
      orderBy('createdAt', 'desc'),
      limit(limitCount * 2)
    );
    
    const querySnapshot = await getDocs(q);
    const ideas = [];
    
    querySnapshot.forEach((doc) => {
      const ideaData = { id: doc.id, ...doc.data() };
      if (ideaData.area === area) {
        ideas.push(ideaData);
      }
    });
    
    return { success: true, data: ideas.slice(0, limitCount) };
  } catch (error) {
    console.error('Erro ao buscar ideias:', error);
    return { success: false, error };
  }
};

export const getAllIdeas = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'ideias'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const ideas = [];
    
    querySnapshot.forEach((doc) => {
      ideas.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: ideas };
  } catch (error) {
    console.error('Erro ao buscar ideias:', error);
    return { success: false, error };
  }
};

// ========== AVALIAÇÕES ==========

export const likeIdea = async (ideaId, userId) => {
  try {
    const ideaRef = doc(db, 'ideias', ideaId);
    await updateDoc(ideaRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId)
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao curtir ideia:', error);
    return { success: false, error };
  }
};

export const unlikeIdea = async (ideaId, userId) => {
  try {
    const ideaRef = doc(db, 'ideias', ideaId);
    await updateDoc(ideaRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId)
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao descurtir ideia:', error);
    return { success: false, error };
  }
};

export const rateIdea = async (ideaId, userId, rating) => {
  try {
    // Criar avaliação
    const avaliacaoRef = doc(collection(db, 'avaliacoes'));
    await setDoc(avaliacaoRef, {
      id_ideia: ideaId,
      id_usuario: userId,
      nota: rating,
      data_avaliacao: serverTimestamp()
    });
    
    // Atualizar média da ideia
    const ideaRef = doc(db, 'ideias', ideaId);
    await updateDoc(ideaRef, {
      total_avaliacoes: increment(1)
    });
    
    // Recalcular média (isso pode ser feito com Cloud Functions em produção)
    const q = query(
      collection(db, 'avaliacoes'),
      where('id_ideia', '==', ideaId)
    );
    
    const querySnapshot = await getDocs(q);
    let totalRating = 0;
    let count = 0;
    
    querySnapshot.forEach((doc) => {
      totalRating += doc.data().nota;
      count++;
    });
    
    const averageRating = totalRating / count;
    
    await updateDoc(ideaRef, {
      media_notas: averageRating
    });
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao avaliar ideia:', error);
    return { success: false, error };
  }
};

// ========== RANKING ==========

export const getTopUsers = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'usuarios'),
      orderBy('pontos', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: users };
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    return { success: false, error };
  }
};
