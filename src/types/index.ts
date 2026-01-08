// Entspricht QualificationGetDTO & QualificationPostDTO
export interface Qualification {
    id?: number; // Optional (?) weil: Beim Laden ist sie da, beim neu Anlegen noch nicht.
    skill: string;
}

// Entspricht EmployeeResponseDTO bei GET-Anfragen
// & EmployeeRequestDTO bei POST/PUT-Anfragen
export interface Employee {
    id?: number; // Optional (?): Beim GET ist es da, beim POST/PUT darf es fehlen.
    firstName: string;
    lastName: string;
    street: string;
    postcode: string;
    city: string;
    phone: string;
    skillSet: Qualification[]; // Eine Liste von Qualification-Objekten
}