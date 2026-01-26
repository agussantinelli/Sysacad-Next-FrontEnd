export interface TableColumn {
    key: string;
    label: string;
    type?: 'text' | 'date' | 'currency' | 'action' | 'custom' | 'list';
    sortable?: boolean;
    cellClass?: (row: any) => string;
}

export interface TableAction {
    name: string;
    label: string;
    icon?: string;
    class?: string;
    isVisible?: (row: any) => boolean;
}

export interface ActionEvent<T = any> {
    action: string;
    row: T;
}
