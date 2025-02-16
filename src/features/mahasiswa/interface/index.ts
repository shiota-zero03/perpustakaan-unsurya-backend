export interface queryGetListDataMahasiswa {
    page?: number;
    limit?: number;
    name?: string;
    nim?: string;
    status?: string;
}

export interface modalListDataMahasiswa {
    id: string;
    name: string | null;
    email: string | null;
    nim: string | null;
    status: string | null;
    waktu_terdaftar: string | null;
    gender?: string | null;
    phone?: string | null;
    faculty?: string | null;
    department?: string | null;
}

export interface modalDetailDataMahasiswa {
    id: string;
    name: string | null;
    email: string | null;
    nidn: string | null;
    status: string | null;
    gender: string | null;
    phone_number: string | null;
    faculty: {
        id: number;
        name: string;
    } | null;
    department: {
        id: number;
        name: string;
    } | null;
    valid_until: string | null;
    waktu_terdaftar: string | null;
    profile_picture: string | null;
}

export interface dataSelectionInterface {
    action: string;
    selectedId: string[];
}

export interface formInterface {
    profilePicture?: string | null;
    name?: string | null;
    nim?: string | null;
    gender?: 'L' | 'P' | 'N' | null;
    phoneNumber?: string | null;
    email?: string | null;
    password?: string | null;
    status?: string | null;
    faculty?: number | null;
    department?: number | null;
    validUntil?: string | null;
}