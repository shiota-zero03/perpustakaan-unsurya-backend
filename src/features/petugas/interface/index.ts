export interface queryGetListDataPetugas {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
    status?: string;
}

export interface modalListDataPetugas {
    id: string;
    name: string | null;
    email: string | null;
    status: string | null;
    waktu_terdaftar: string | null;
    gender?: string | null;
    position?: string | null;
}

export interface modalDetailDataPetugas {
    id: string;
    name: string | null;
    email: string | null;
    status: string | null;
    gender: string | null;
    position: string | null;
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
    gender?: 'L' | 'P' | 'N' | null;
    email?: string | null;
    password?: string | null;
    status?: string | null;
    position?: string | null;
}