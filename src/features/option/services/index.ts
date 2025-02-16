import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOptionFacultyService = async (): Promise<any> => {

    const [getOptionFaculty] = await prisma.$transaction([
        prisma.faculty.findMany({
            orderBy: [
                { name: 'asc' }
            ],
        }),
    ]);

    const optionFaculty: { id: number;  name: string; }[] = getOptionFaculty.map(fac => ({
        id: fac.id,
        name: fac.name,
    }));

    return optionFaculty;
};

export const getOptionDepartmentService = async ({ facultyId }: { facultyId?: string | null }): Promise<any> => {

    const whereClause: any = {};
    if (facultyId) whereClause.facultyId = Number(facultyId);

    const [getOptionDepartment] = await prisma.$transaction([
        prisma.studyProgram.findMany({
            where: whereClause,
            orderBy: [
                { name: 'asc' }
            ],
        }),
    ]);

    const optionProdi: { id: number;  name: string; }[] = getOptionDepartment.map(prod => ({
        id: prod.id,
        name: prod.name,
    }));

    return optionProdi;
};