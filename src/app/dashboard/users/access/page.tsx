"use client";
import { useState, useMemo, useEffect } from "react";
import {
    Search,
    Shield,
    Building,
    Menu,
    Users,
    Save,
    X,
    ChevronRight,
    ChevronDown,
    Building2,
    Eye,
    Loader2,
} from "lucide-react";
import { accessMenuUser, unassignMenuUser } from "@/hooks/api-services/menu";
import { useGetUserMenus } from "@/hooks/apis/useMenus";
import API from "@/config/Axios";

// TypeScript interfaces
interface User {
    id: string;
    username: string;
    enterpriseId: string;
    post: string;
    roles: any[];
    email: string;
    password?: string | null;
    confirmPassword?: string | null;
    createdAt: any;
    updatedAt: any;
    enterprise?: {
        id: string;
        name: string;
        description?: string;
        totalBudget?: number;
        budgetsCount?: number;
    };
    menuAccess?: {
        allowedMenus: string[];
        allowedSubMenus: string[];
    };
    menus: any[];
}

interface Role {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt?: string;
}

interface MenuItem {
    id: number;
    key: string;
    label: string;
    route: string;
    icon: string | null;
    order: number;
    parentId: string | null;
    is_active: boolean;
    children: MenuItem[];
}

// Custom hook to fetch roles
const useFetchRoles = () => {
    const [data, setData] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            try {
                const response = await API.get(`/roles`);
                if (response.status !== 200) throw new Error("Failed to fetch roles");
                const rolesData = await response.data;
                setData(rolesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch roles");
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return { data, loading, error };
};

// Custom hook to fetch menus
const useFetchMenus = () => {
    const [data, setData] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenus = async () => {
            setLoading(true);
            try {
                const response = await API.get(`/menus`);
                const menusData = await response.data;
                setData(menusData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch menus");
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    return { data, loading, error };
};

export default function AccessManagement() {
    // Fetch roles, and menus
    const {
        data: roles = [],
        loading: rolesLoading,
        error: rolesError,
    } = useFetchRoles();
    const {
        data: menus = [],
        loading: menusLoading,
        error: menusError,
    } = useFetchMenus();

    // State management
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [viewMenuModal, setViewMenuModal] = useState(false);

    // Fetch users on component mount and when selected enterprise changes
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setUsers([]);
        try {
            let url = `/users`;

            const response = await API.get(url);

            const data = await response.data;
            setUsers(data);
            setError(null);
        } catch (err) {
            setError("Error fetching users. Please try again");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(
            (user) =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleAssignAccess = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleViewMenus = (user: User) => {
        setViewMenuModal(true);
        setSelectedUser(user);
    }

    return (
        <div className="p-4">
            <div className="bg-white rounded-xl border border-gray-100 mb-6 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-50 mr-3">
                            <Building2 size={24} className="text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Gestion des Accès
                        </h2>
                    </div>
                </div>
            </div>

            {/* Search and Controls */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
                <div className="relative max-w-md mb-4">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Error Messages */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}
                {rolesError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{rolesError}</p>
                    </div>
                )}
                {menusError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{menusError}</p>
                    </div>
                )}

                {/* Loading States */}
                {(loading || rolesLoading || menusLoading) && (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Users Grid */}
                {!loading &&
                    !rolesLoading &&
                    !menusLoading &&
                    filteredUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className=" h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                            {user.email.charAt(0).toUpperCase()}

                                        </div>
                                        <div className="ml-3">
                                            {/* <h3 className="font-semibold text-gray-900">
                                                {user.username}
                                            </h3> */}
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex  items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                        Actif
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Rôle:</span>
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                            {user.roles?.length > 0
                                                ? user.roles.map((r) => r.name).join(", ")
                                                : "Non assigné"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Accès menus:</span>

                                        {user?.menus?.length > 0 ? (
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">
                                                    {user.menus.length} menus
                                                </span>
                                                <button
                                                    onClick={() => handleViewMenus(user)}
                                                    className="cursor-pointer inline-flex items-center ml-2 px-2 py-2 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                Non configuré
                                            </span>

                                        )
                                        }

                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAssignAccess(user)}
                                    className="w-full flex items-center justify-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Shield size={16} className="mr-2" />
                                    Gérer les Accès
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading &&
                    !rolesLoading &&
                    !menusLoading && (
                        <div className="text-center py-10">
                            <Users size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-xl font-medium text-gray-500">
                                Aucun utilisateur trouvé
                            </p>
                            <p className="mt-2 text-gray-400">
                                {searchTerm
                                    && "Essayez un autre terme de recherche"
                                }
                            </p>
                        </div>
                    )
                )}
            </div>

            {/* Access Assignment Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 z-999 bg-black/30 backdrop-blur-sm overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Gestion des Accès - {selectedUser.username}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                                <AccessAssignmentForm
                                    user={selectedUser}
                                    roles={roles}
                                    menus={menus}
                                    onCancel={() => setIsModalOpen(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* view user menu Modal */}
            {viewMenuModal && selectedUser && (
                <div className="fixed inset-0 z-999 bg-black/30 backdrop-blur-sm overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setViewMenuModal(false)}
                        />
                        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Gestion des Accès - {selectedUser.username}
                                </h3>
                                <button
                                    onClick={() => setViewMenuModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                                <UserMenusForm
                                    user={selectedUser}
                                    onCancel={() => setViewMenuModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Access Assignment Form Component
interface AccessAssignmentFormProps {
    user: User;
    roles: Role[];
    menus: MenuItem[];
    onCancel: () => void;
}

function AccessAssignmentForm({
    user,
    roles,
    menus,
    onCancel,
}: AccessAssignmentFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState(user.roles[0] || "");
    const [selectedMenus, setSelectedMenus] = useState<string[]>(
        user.menuAccess?.allowedMenus || []
    );
    const [admin] = useState(() => {
        const userStr = localStorage.getItem("user")
        return userStr ? JSON.parse(userStr) : null
    })
    const [selectedSubMenus, setSelectedSubMenus] = useState<string[]>(
        user.menuAccess?.allowedSubMenus || []
    );
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
        {}
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { id: 1, title: "Rôle", icon: Shield },
        { id: 2, title: "Menus Principaux", icon: Menu },
        { id: 3, title: "Sous-menus", icon: Users },
    ];

    const handleMenuToggle = (menuId: string) => {
        setSelectedMenus((prev) => {
            const newSelection = prev.includes(menuId)
                ? prev.filter((id) => id !== menuId)
                : [...prev, menuId];

            // If menu is deselected, also deselect its submenus
            if (!newSelection.includes(menuId)) {
                const menu = menus.find((m) => String(m.id) === menuId);
                if (menu?.children) {
                    const childIds = menu.children.map((child) => child.id);
                    setSelectedSubMenus((prevSub) =>
                        prevSub.filter((id) => !childIds.includes(Number(id)))
                    );
                }
            }

            return newSelection;
        });
    };

    const handleSubMenuToggle = (subMenuId: string) => {
        setSelectedSubMenus((prev) =>
            prev.includes(subMenuId)
                ? prev.filter((id) => id !== subMenuId)
                : [...prev, subMenuId]
        );
    };

    const toggleMenuExpansion = (menuId: string) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menuId]: !prev[menuId],
        }));
    };

    const handleSubmit = async () => {
        const assignment: any = {
            user_id: user.id,
            role: selectedRole,
            role_id: roles.find((role) => role.name === selectedRole)?.id,
            allowedMenus: selectedMenus,
            allowedSubMenus: selectedSubMenus,
            assigned_by: admin?.id || null, // This should come from your auth context
            is_active: true,
        };

        setIsSubmitting(true);
        await accessMenuUser(assignment).then(() => {
            setIsSubmitting(false);
            onCancel();
        }).catch((error) => {
            console.log("error:", error);
        })
            .finally(() => {
                setIsSubmitting(false);
            })
            ;
    };

    const getAvailableSubMenus = () => {
        return menus
            .filter((menu) => selectedMenus.includes(String(menu.id)) && menu.children)
            .flatMap((menu) => menu.children || []);
    };

    return (
        <div className="p-6">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "border-gray-300 text-gray-400"
                                    }`}
                            >
                                <step.icon size={20} />
                            </div>
                            <div className="ml-3">
                                <p
                                    className={`text-sm font-medium ${currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    {step.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-96">
                {/* Step 1: Role Selection */}
                {currentStep === 1 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Utilisateur Sélectionné
                        </h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center mb-4">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                    {user.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                    {/* <h4 className="text-xl font-semibold text-gray-900">
                                        {user.username}
                                    </h4> */}
                                    <p className="text-gray-600">{user.email}</p>

                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <h5 className="font-medium text-gray-900 mb-2">Rôle Actuel:</h5>
                                {user?.roles?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.roles.map((role, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
                                            >
                                                <Shield size={14} className="mr-1" />
                                                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-600">
                                        Aucun rôle assigné
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    // Set the selected role from user's current roles
                                    if (user.roles?.length > 0) {
                                        setSelectedRole(user.roles[0].id);
                                    }
                                    setCurrentStep(2);
                                }}
                                className="mt-4 w-full flex items-center justify-center px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <ChevronRight size={16} className="mr-2" />
                                Continuer vers l'attribution du poste
                            </button>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h5 className="font-medium text-gray-900 mb-4">
                                Ou sélectionner un nouveau rôle:
                            </h5>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {roles
                                    .map((role) => (
                                        <div
                                            key={role.id}
                                            onClick={() => {
                                                setSelectedRole(role.name.toLowerCase());
                                                setCurrentStep(2);
                                            }}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedRole === role.name.toLowerCase()
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <div className="flex items-center mb-2">
                                                <Shield size={20} className="text-blue-600 mr-2" />
                                                <h4 className="font-medium text-gray-900">
                                                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                                </h4>
                                            </div>
                                            <p className="text-sm text-gray-600">{role.description}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Main Menus Selection */}
                {currentStep === 2 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Sélectionner les Menus Principaux
                        </h3>
                        {menus.length === 0 ? (
                            <div className="text-center py-8">
                                <Menu size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500">Aucun menu disponible</p>
                            </div>
                        ) : (
                            <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {menus
                                    .filter((menu) => !menu.parentId)
                                    .map((menu) => {

                                        return (
                                            <div
                                                key={menu.id}
                                                className={`p-4 border rounded-lg transition-all ${selectedMenus.includes(String(menu.id))
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedMenus.includes(String(menu.id))}
                                                            onChange={() => handleMenuToggle(String(menu.id))}
                                                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <Menu size={20} className="text-blue-600 mr-2" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                {menu.label}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {menu.route || "Menu parent"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {menu.children && menu.children.length > 0 && (
                                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                                            {menu.children.length} sous-menus
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Sub-menus Selection */}
                {currentStep === 3 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Sélectionner les Sous-menus
                        </h3>
                        {getAvailableSubMenus().length === 0 ? (
                            <div className="text-center py-8">
                                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500">
                                    Aucun sous-menu disponible pour les menus sélectionnés
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {menus
                                    .filter(
                                        (menu) => selectedMenus.includes(String(menu.id)) && Array.isArray(menu.children) && menu.children.length > 0
                                    )
                                    .map((menu) => (
                                        <div
                                            key={menu.id}
                                            className="border border-gray-200 rounded-lg"
                                        >
                                            <div
                                                onClick={() => toggleMenuExpansion(String(menu.id))}
                                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                            >
                                                <div className="flex items-center">
                                                    <Menu size={20} className="text-blue-600 mr-2" />
                                                    <span className="font-medium text-gray-900">
                                                        {menu.label}
                                                    </span>
                                                </div>
                                                {expandedMenus[menu.id] ? (
                                                    <ChevronDown size={20} className="text-gray-400" />
                                                ) : (
                                                    <ChevronRight size={20} className="text-gray-400" />
                                                )}
                                            </div>
                                            {expandedMenus[menu.id] && (
                                                <div className="border-t border-gray-200 p-4 bg-gray-50">
                                                    <div className="space-y-2">
                                                        {menu.children?.map((subMenu) => (
                                                            <div
                                                                key={subMenu.id}
                                                                className="flex items-center"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedSubMenus.includes(
                                                                        String(subMenu.id)
                                                                    )}
                                                                    onChange={() =>
                                                                        handleSubMenuToggle(String(subMenu.id))
                                                                    }
                                                                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                />
                                                                <div>
                                                                    <h5 className="font-medium text-gray-900">
                                                                        {subMenu.label}
                                                                    </h5>
                                                                    <p className="text-sm text-gray-600">
                                                                        {subMenu.route}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                    {currentStep > 1 && (
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Précédent
                        </button>
                    )}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    {currentStep < steps.length ? (
                        <button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            disabled={
                                (currentStep === 3 && selectedMenus.length === 0)
                            }
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Suivant
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedSubMenus.length === 0 || isSubmitting}
                            className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                            {
                                isSubmitting ? (
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                ) : (
                                    <Save size={16} className="mr-2" />
                                )
                            }
                            Enregistrer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}


interface UserMenusFormProps {
    user: User;
    onCancel: () => void;
}


const UserMenusForm: React.FC<UserMenusFormProps> = ({ user, onCancel }) => {
    // Récupération des données
    const { data: userMenus = [], isLoading, isError } = useGetUserMenus(JSON.parse(JSON.stringify(user)));
    const mainMenus1: { id: number, is_active: boolean }[] = userMenus.map((menu) => ({ id: Number(menu.id), is_active: false }))

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMenus, setSelectedMenus] = useState<{ id: number, is_active: boolean }[]>(mainMenus1);
    const [selectedSubMenus, setSelectedSubMenus] = useState<{ id: number, is_active: boolean }[]>([]);
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [admin] = useState(() => {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : null
    })


    // Étapes du formulaire
    const steps = [
        { id: 1, title: "Menus Principaux", icon: Menu },
        { id: 2, title: "Sous-menus", icon: Users },
    ];

    // Fonctions utilitaires
    const toggleMenuExpansion = (menuId: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const handleMenuToggle = (menu: MenuItem) => {
        setSelectedMenus(prev => {
            const menuId = typeof menu.id === "number" ? menu.id : Number(menu.id);
            const existingIndex = prev.findIndex(item => item.id === menuId);

            if (existingIndex >= 0) {
                // Remove menu and its submenus
                const newSelection = [...prev];
                newSelection.splice(existingIndex, 1);

                if (menu.children) {
                    setSelectedSubMenus(prevSub =>
                        prevSub.filter(sub => !menu.children?.some(child => {
                            const childId = typeof child.id === "number" ? child.id : Number(child.id);
                            return childId === sub.id;
                        }))
                    );
                }

                return newSelection;
            } else {
                // Add menu with default active state
                return [...prev, { id: menuId, is_active: true }];
            }
        });
    };

    const handleSubMenuToggle = (subMenu: MenuItem) => {
        setSelectedSubMenus(prev => {
            const subMenuId = typeof subMenu.id === "number" ? subMenu.id : Number(subMenu.id);
            const existingIndex = prev.findIndex(item => item.id === subMenuId);

            if (existingIndex >= 0) {
                const newSelection = [...prev];
                newSelection.splice(existingIndex, 1);
                return newSelection;
            } else {
                return [...prev, { id: Number(subMenu.id), is_active: true }];
            }
        });
    };

    // Check if a menu is selected
    const isMenuSelected = (menuId: number) => {
        return selectedMenus.some(item => item.id === menuId);
    };

    // Check if a submenu is selected
    const isSubMenuSelected = (subMenuId: number) => {
        return selectedSubMenus.some(item => item.id === subMenuId);
    };

    // Get available submenus based on selected menus
    const getAvailableSubMenus = (): MenuItem[] => {
        return userMenus
            .filter(menu => selectedMenus.some(m => String(m.id) === menu.id))
            .flatMap(menu => menu.children || []) as any;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            user_id: user.id,
            allowedMenus: selectedMenus,
            allowedSubMenus: selectedSubMenus,
            assigned_by: admin?.id || null
        };

        try {
            setIsSubmitting(true);
            await unassignMenuUser(data);
            onCancel();
        } catch (error) {
            console.error("Error submitting:", error);
            // Add user feedback here (toast, alert, etc.)
        } finally {
            setIsSubmitting(false);
        }
    };
    const canProceedToNextStep = () => {
        if (currentStep === 1) {
            return selectedMenus.length > 0;
        }
        return true;
    };

    // Rendu conditionnel
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Chargement des menus...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center">
                <div className="text-red-600 mb-2">
                    <Menu size={48} className="mx-auto mb-2" />
                </div>
                <p className="text-red-600 font-medium">Erreur lors du chargement des menus</p>
                <button
                    onClick={onCancel}
                    className="mt-4 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Fermer
                </button>
            </div>
        );
    }

    const mainMenus: any = userMenus.filter(menu => !menu.parent_id);

    return (
        <div className="p-4">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${currentStep >= step.id
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "border-gray-300 text-gray-400"
                                    }`}
                            >
                                <step.icon size={20} />
                            </div>
                            <div className="ml-3">
                                <p
                                    className={`text-sm font-medium transition-colors ${currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    {step.title}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-16 h-0.5 mx-4 transition-colors ${currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="min-h-96">
                {/* Step 1: Main Menus Selection */}
                {currentStep === 1 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Sélectionner les Menus Principaux
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Choisissez les menus principaux auxquels l'utilisateur aura accès.
                        </p>

                        {mainMenus.length === 0 ? (
                            <div className="text-center py-12">
                                <Menu size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 text-lg">Aucun menu disponible</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Contactez l'administrateur pour configurer les menus.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userMenus
                                    .filter((menu) => !menu.parentId)
                                    .map(menu => (
                                        <div
                                            key={menu.id}
                                            className={`p-4 border border-gray-200 rounded-lg transition-all cursor-pointer hover:shadow-sm ${isMenuSelected(Number(menu.id))}
                        ? "border-blue-500 "
                        : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                                            onClick={() => handleMenuToggle(menu as any)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input
                                                        onClick={(e) => e.stopPropagation()}
                                                        type="checkbox"
                                                        checked={isMenuSelected(Number(menu.id))}
                                                        onChange={() => handleMenuToggle(menu as any)}
                                                        className="mr-3 h-4 w-4 cursor-pointer text-blue-600 focus:ring-blue-500 border-gray-200 rounded"
                                                    />
                                                    <Menu size={20} className="text-blue-600 mr-3" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            {menu.label}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            {menu.route || "Menu parent"}
                                                        </p>
                                                    </div>
                                                </div>
                                                {menu.children && menu.children.length > 0 && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                        {menu.children.length} sous-menu{menu.children.length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Sub-menus Selection */}
                {currentStep === 2 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Sélectionner les Sous-menus
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Choisissez les sous-menus spécifiques pour chaque menu principal sélectionné.
                        </p>

                        {getAvailableSubMenus().length === 0 ? (
                            <div className="text-center py-12">
                                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 text-lg">
                                    Aucun sous-menu disponible
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Les menus sélectionnés n'ont pas de sous-menus ou aucun menu principal n'a été sélectionné.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userMenus
                                    .filter(
                                        (menu) => selectedMenus.some(m => String(m.id) === menu.id) && Array.isArray(menu.children) && menu.children.length > 0
                                    ).map(menu => (
                                        <div
                                            key={menu.id}
                                            className="border border-gray-200 rounded-lg overflow-hidden"
                                        >
                                            <div
                                                onClick={() => toggleMenuExpansion(String(menu.id))}
                                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center">
                                                    <Menu size={20} className="text-blue-600 mr-3" />
                                                    <div>
                                                        <span className="font-medium text-gray-900">
                                                            {menu.label}
                                                        </span>
                                                        <p className="text-sm text-gray-500">
                                                            {menu.children?.length ?? 0} sous-menu{(menu.children?.length ?? 0) > 1 ? 's' : ''} disponible{(menu.children?.length ?? 0) > 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                {expandedMenus[String(menu.id)] ? (
                                                    <ChevronDown size={20} className="text-gray-400" />
                                                ) : (
                                                    <ChevronRight size={20} className="text-gray-400" />
                                                )}
                                            </div>

                                            {expandedMenus[String(menu.id)] && (
                                                <div className="border-t border-gray-200 bg-gray-50">
                                                    <div className="p-4 space-y-3">
                                                        {menu.children?.map(subMenu => (
                                                            <label
                                                                key={subMenu.id}
                                                                className="flex items-center cursor-pointer hover:bg-white p-2 rounded transition-colors"
                                                            >
                                                                <input
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    type="checkbox"
                                                                    checked={isSubMenuSelected(Number(subMenu.id))}
                                                                    onChange={() => handleSubMenuToggle(subMenu as any)}
                                                                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                />
                                                                <div className="flex-1">
                                                                    <h5 className="font-medium text-gray-900">
                                                                        {subMenu.label}
                                                                    </h5>
                                                                    <p className="text-sm text-gray-600">
                                                                        {subMenu.route}
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                    {currentStep > 1 && (
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Précédent
                        </button>
                    )}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>

                    {currentStep < steps.length ? (
                        <button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            disabled={!canProceedToNextStep()}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Suivant
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!canProceedToNextStep() || isSubmitting}
                            className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            {
                                isSubmitting ? (
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                ) : (
                                    <Save size={16} className="mr-2" />
                                )
                            }
                            Enregistrer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};




