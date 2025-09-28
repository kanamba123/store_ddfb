import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMenus, createMenu,getSidebar, updateMenu, getUserMenus } from "../api-services/menu"

export const useSidebarMenus = (user:any, token:any) => {
    return useQuery({
        queryKey: ['sidebar-menus'],
        queryFn: () => getSidebar(user?.id, token),
        enabled: !!user || !!token,
    })
}

export const useGetUserMenus = (user:any) => {
    return useQuery({
        queryKey: ['user-menus'],
        queryFn: () => getUserMenus(user?.id),
        enabled: !!user,
    })
}

export const useFetchAllMenus = () => {
    return useQuery({
        queryKey: ['all-menus'],
        queryFn: getMenus,
    })
}

export const useAddMenu = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createMenu,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-menus','sidebar-menus'] })
        }
    })
}

export const useUpdateMenu = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (menuData: any) => updateMenu(menuData.id, menuData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-menus','sidebar-menus'] })
        }
    })
}