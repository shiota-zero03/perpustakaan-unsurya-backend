export interface GetProfileInterface {
    id: number;
    user_id: string;
    name: string;
    email: string;
    identity_number: string | null;
    status: string;
    profile?: {
        id: number;
        userId: number;
        profilePicture: string | null;
        gender: string | null;
        position?: string | null;
        phoneNumber?: string | null;
        validUntil?: Date | null;
        faculty?: {
            id: number;
            name: string;
            code: string;
        } | null;
        studyProgram?: {
            id: number;
            name: string;
            code: string;
        } | null;
    } | null;
};