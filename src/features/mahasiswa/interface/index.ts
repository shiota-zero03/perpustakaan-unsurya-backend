export interface queryGetListDataDosen {
    page?: number;
    limit?: number;
    name?: string;
    nidn?: string;
    status?: string;
}

export interface modalListDataDosen {
    id: string;
    name: string | null;
    email: string | null;
    nidn: string | null;
    status: string | null;
    waktu_terdaftar: string | null;
}

export interface modalDetailDataDosen {
    id: string;
    name: string | null;
    email: string | null;
    nidn: string | null;
    status: string | null;
    gender: string | null;
    phone_number: string | null;
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
    nidn?: string | null;
    gender?: 'L' | 'P' | 'N' | null;
    phoneNumber?: string | null;
    email?: string | null;
    password?: string | null;
    status?: string | null;
    validUntil?: string | null;
}