export interface RegisterReq {
    name: string;
    email: string;
    password: string;
    identityNumber: string;
    role: Role;
}

export interface LoginReq {
    email: string;
    password: string;
}

export interface ResetReq {
    email: string;
    token: string;
    new_password: string;
    confirmation_password: string;
}

enum Role {
    SuperAdmin = "SuperAdmin",
    Admin = "Admin",
    Teacher = "Teacher",
    Student = "Student",
    Visitor = "Visitor"
}