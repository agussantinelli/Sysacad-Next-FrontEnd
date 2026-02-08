export interface ComisionDisponibleDTO {
    idComision: string;      
    nombreComision: string;  
    turno: string;           
    ubicacion: string;       
    horarios: string[];      
    profesores: string[];    
    habilitada: boolean;     
    mensaje: string;         
}
