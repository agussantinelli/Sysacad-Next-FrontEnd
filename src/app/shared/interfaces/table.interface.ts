export interface TableColumn {
    key: string;
    label: string;
    type?: 'text' | 'date' | 'currency' | 'action' | 'custom';
    sortable?: boolean;
}

export interface TableAction {
    name: string;
    label: string;
    icon?: string;
    class?: string;
}

export interface ActionEvent<T = any> {
    action: string;
    row: T;
}
