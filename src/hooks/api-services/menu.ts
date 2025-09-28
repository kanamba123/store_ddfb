
import  API  from '@/config/Axios'
import { MenuItem } from '@/types/menu'

export const getMenus = async (): Promise<MenuItem[]> => {
  const response = await API.get('/menus')
  return response.data
}

export const createMenu = async (menuData: any): Promise<MenuItem> => {
  const response = await API.post('/menus', menuData)
  return response.data
}

export const updateMenu = async (id: number, menuData: Partial<MenuItem>): Promise<MenuItem> => {
  const response = await API.put(`/menus/${id}`, menuData)
  return response.data
}

export const deleteMenu = async (id: number): Promise<void> => {
  await API.delete(`/menus/${id}`)
}

export const getSidebar = async (id: number, token: string): Promise<MenuItem[]> => {
  const response = await API.get(`/sidebar/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export const  getUserMenus = async (id: number): Promise<MenuItem[]> => {
  const response = await API.get(`/sidebar/${id}`)
  return response.data
}

export const accessMenuUser = async (data:any): Promise<MenuItem[]> => {
  const response = await API.post("/user-menus/assign",data)
  return response.data
}

export const unassignMenuUser = async (data:any): Promise<MenuItem[]> => {
  const response = await API.post("/accesses/menus/unassign",data)
  return response.data
}

