// services/registrationApi.ts
import axios, { AxiosError } from 'axios';
import {
  OwnerData,
  StoreData,
  RegistrationResponse,
  OwnerResponse,
  StoreResponse
} from '@/types/registration';
import { API_URL } from '@/config/API';

// Configuration de base Axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction utilitaire pour gérer les erreurs
const handleApiError = (error: AxiosError) => {
  console.error('API Error:', error.response?.data || error.message);
  throw new Error(
    (error.response?.data as any)?.message || 
    'Une erreur est survenue'
  );
};

// Enregistrer propriétaire et magasin en une fois
export const registerStoreWithOwner = async (
  ownerData: OwnerData,
  storeData: StoreData
): Promise<RegistrationResponse> => {
  try {
    const response = await apiClient.post('/stores/register-with-owner', { 
      ownerData, 
      storeData 
    });
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

// Créer un propriétaire temporaire
export const createTemporaryOwner = async (
  ownerData: OwnerData
): Promise<OwnerResponse> => {
  try {
    console.log('Creating temporary owner with data:', ownerData);
    const response = await apiClient.post('/stores/register-temporary', ownerData);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

// Ajouter un magasin à un propriétaire existant
export const addStoreToOwner = async (
  ownerId: number,
  storeData: StoreData
): Promise<StoreResponse> => {
  try {
    const response = await apiClient.post(
      `/stores/add-to-owner/${ownerId}`, 
      storeData
    );
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

// Ajouter un magasin à un propriétaire existant
export const valideAddStore = async (
  owner: OwnerData,
  store: StoreData
): Promise<StoreResponse> => {
  try {
    const response = await apiClient.post(
      `/stores/complete-registration`, 
      { owner, store }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};

// Obtenir un propriétaire avec son magasin
export const getOwnerWithStore = async (
  ownerId: number
): Promise<OwnerResponse & { data?: OwnerData & { Store?: StoreData } }> => {
  try {
    const response = await apiClient.get(`/stores/${ownerId}/with-store`);
    return response.data;
  } catch (error) {
    return handleApiError(error as AxiosError);
  }
};