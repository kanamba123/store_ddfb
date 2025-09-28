"use client"

import type React from "react"

import { useState, useMemo } from "react"
import {
    Search,
    //  Plus,
    Edit, MenuIcon, ChevronRight, ChevronDown, X
} from "lucide-react"
import type { MenuRoute } from "@/types/admin"
import { usefetchAllMenus, useAddMenu, useUpdateMenu } from "@/hooks/apis/useMenus"
import Routes from "@/stores/Routes"
import iconOptions from "@/stores/iconOptions"
import { MenuItem } from '@/types/menu'
import { useTranslation } from "react-i18next"


export default function MenuManager() {

    const { data: menus = [], isLoading, error } = usefetchAllMenus();
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null)
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})

    const filteredMenus = useMemo(() => {
        return menus.filter(
            (menu) =>
                menu.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (menu.route && menu.route.toLowerCase().includes(searchTerm.toLowerCase())),
        )
    }, [menus, searchTerm])

    // const handleAddMenu = () => {
    //     setSelectedMenu(null)
    //     setIsModalOpen(true)
    // }

    const handleEditMenu = (menu: MenuItem) => {
        setSelectedMenu(menu)
        setIsModalOpen(true)
    }

    // const handleDeleteMenu = (menuId: number) => {
    //     if (window.confirm("Êtes-vous sûr de vouloir supprimer ce menu ?")) {
    //         // Remove menu and its children
    //         // TODO: Implement delete logic (backend API call)
    //     }
    // }

    const toggleExpanded = (menuId: number) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menuId]: !prev[menuId],
        }))
    }

    const renderMenuItem = (menu: MenuItem, level = 0) => {
        const hasChildren = menu.children && menu.children.length > 0
        const isExpanded = expandedMenus[menu.id]

        return (
            <div key={menu.id} className="border border-gray-200 rounded-lg mb-2">
                <div className={`p-4 ${level > 0 ? "bg-gray-50" : "bg-white"}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {hasChildren && (
                                <button onClick={() => toggleExpanded(Number(menu.id))} className="p-1 hover:bg-gray-200 rounded">
                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                            )}

                            <div className="flex items-center space-x-3">
                                {menu.icon && (
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <MenuIcon size={16} className="text-blue-600" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-900">{t(menu.label) || menu.key}</span>
                                        {!menu.is_active && (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                Inactif
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {menu.route || "Pas de route"} • Ordre: {menu.order}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* <button
                                onClick={() => handleAddMenu()}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Ajouter un sous-menu"
                            >
                                <Plus size={16} />
                            </button> */}
                            <button
                                onClick={() => handleEditMenu(menu)}
                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                title="Modifier"
                            >
                                <Edit size={16} />
                            </button>
                            {/* <button
                                onClick={() => handleDeleteMenu(menu.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                title="Supprimer"
                            >
                                <Trash2 size={16} />
                            </button> */}
                        </div>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="border-t border-gray-200 p-2 bg-gray-50">
                        {menu.children!.map((child) => renderMenuItem(child, level + 1))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="p-4 rounded-lg bg-white">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestionnaire de Menus</h1>
                        <p className="text-gray-600">Gérez la structure des menus de l'application</p>
                    </div>
                    {/* <button
                        onClick={() => handleAddMenu()}
                        className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        <MenuIcon size={16} className="mr-2" />
                        Nouveau Menu
                    </button> */}
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un menu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Menu Tree */}
            <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {
                    isLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-600 text-center">
                            Erreur de chargement des menus : {error instanceof Error ? error.message : String(error)}
                        </div>
                    ) : filteredMenus.length === 0 ? (
                        <div className="text-gray-500 text-center">Aucun menu trouvé</div>
                    ) : null
                }  {filteredMenus
                    .filter((menu) => !menu.parentId)
                    .sort((a, b) => a.order - b.order)
                    .map((menu) => renderMenuItem(menu))
                }
            </div>

            {/* Menu Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-999 bg-black/30 backdrop-blur-sm overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
                        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {selectedMenu ? "Modifier le menu" : "Nouveau menu"}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                                <MenuForm
                                    menu={selectedMenu}
                                    menus={menus}
                                    routes={Routes}
                                    icons={iconOptions}
                                    onCancel={() => setIsModalOpen(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Menu Form Component

function MenuForm({ menu, menus, routes, icons, onCancel }: {
    menu: MenuItem | null
    menus: MenuItem[]
    routes: MenuRoute[]
    icons: string[]
    onCancel: () => void
}) {
    const [formData, setFormData] = useState({
        key: menu?.key || "",
        label: menu?.label || "",
        route: menu?.route || "",
        icon: menu?.icon || "",
        order: menu?.order || 1,
        parent_id: menu?.parent_id || "",
        is_active: menu?.is_active !== false,
    })
    const { t } = useTranslation()

    const addMenuMutation = useAddMenu()
    const updateMenuMutation = useUpdateMenu()

    const mergedRoutes = [
        ...routes,
        ...menus.map((m) => ({
            path: m.route,
            name: m.label,
            description: m.label,
            module: "Dashboard",
        }))
    ].filter(Boolean) as MenuRoute[]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!menu) {
            await addMenuMutation.mutateAsync({
                ...formData,
                parent_id: formData.parent_id || null,
                route: formData.route || null,
                icon: formData.icon || null,
                key: formData.key || null,
            }, {
                onSuccess: () => {
                    setFormData({
                        key: "",
                        label: "",
                        route: "",
                        icon: "",
                        order: 1,
                        parent_id: "",
                        is_active: true,
                    })
                    console.log({
                        title: "Succès",
                        description: `Menu ${menu ? "modifié" : "créé"} avec succès.`,
                        type: "success",
                    })
                    onCancel()
                },
                onError: (error) => {
                    console.error("Erreur lors de la création du menu :", error)

                    console.log({
                        title: "Erreur",
                        description: "Une erreur s'est produite lors de la création du menu.",
                        type: "error",
                    });
                },
            })
        } else {
            await updateMenuMutation.mutateAsync({
                ...formData,
                id: menu.id,
                parent_id: formData.parent_id || null,
                route: formData.route || null,
                icon: formData.icon || null,
                key: formData.key || null,
            }, {
                onSuccess: () => {
                    console.log({
                        title: "Succès",
                        description: `Menu modifié avec succès.`,
                        type: "success",
                    })
                    onCancel()
                },
                onError: (error) => {
                    console.error("Erreur lors de la modification du menu :", error)

                    console.log({
                        title: "Erreur",
                        description: "Une erreur s'est produite lors de la modification du menu.",
                        type: "error",
                    });
                },
            })
        }
    }

    const parentMenuOptions = menus.filter((m) => !m.parent_id && m.id !== menu?.id)
        .sort((a, b) => a.order - b.order)

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Libellé du menu</label>
                        <input
                            type="text"
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Clé du menu</label>
                        <input
                            type="text"
                            value={formData.key}
                            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Identifiant unique (optionnel)"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
                        <select
                            value={formData.route}
                            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Sélectionner une route</option>
                            <option value="#">Menu parent (pas de route)</option>
                            {mergedRoutes.map((route) => (
                                <option key={route.path} value={route.path}>
                                    {route.path} - {t(route.name) || "No description"}
                                </option>
                            ))}
                        </select>
                        {formData.route && formData.route !== "#" && (
                            <p className="text-sm text-gray-500 mt-1">{mergedRoutes.find((r) => r.path === formData.route)?.description}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icône</label>
                        <select
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Pas d'icône</option>
                            {icons.map((icon) => (
                                <option key={icon} value={icon}>
                                    {icon}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Menu parent</label>
                        <select
                            value={formData.parent_id}
                            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Menu racine</option>
                            {parentMenuOptions.map((parentMenu) => (
                                <option key={parentMenu.id} value={parentMenu.id}>
                                    {t(parentMenu.label) || parentMenu.key}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ordre</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 1 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                        <div className="flex items-center mt-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                                Menu actif
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Annuler
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    {menu ? "Modifier" : "Créer"}
                </button>
            </div>
        </form>
    )
}
