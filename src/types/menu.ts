export interface MenuItem {
    key?: string | null
    id: string
    label: string
    route: string | null
    icon?: string | null
    order: number
    parentId?: number
    parent_id?: number
    isActive: boolean
    is_active: boolean
    children?: MenuItem[]
}

export interface Role {
    id: number
    name: string
    description?: string
}

export interface Permission {
    id: number
    name: string
    description?: string
}