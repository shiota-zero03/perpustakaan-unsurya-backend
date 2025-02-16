import { Prisma, PrismaClient } from "@prisma/client";
import { LoginReq, RegisterReq, ResetReq } from "../../../types/request/Register.inteface";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../../utils/jwt-utils";
import { hashedContent, hashedVerification } from "../../../utils/bcrypt";
import { sendEmail } from "../../../utils/send-email";
import { CustomError } from "../../../errors";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const userSelect: Prisma.UserSelect = {
	id: true,
	userId: true,
    email: true,
    name: true,
    password: true,
    role: true
};


export const registerService = async (data: RegisterReq): Promise<any> => {
    const existingUserByEmail = await prisma.user.findUnique({
        where: { email: data.email },
    });
  
    if (existingUserByEmail) {
        throw new CustomError("Kesalahan valdasi, silahkan cek kembali form anda", 422, { email: "Email sudah digunakan" });
    }

    const existingUserByIdentityNumber = await prisma.user.findUnique({
        where: { identityNumber: data.identityNumber },
    });
  
    if (existingUserByIdentityNumber) {
        throw new CustomError("Kesalahan valdasi, silahkan cek kembali form anda", 422, { identityNumber: "Nomor identitas sudah digunakan" });
    }

	const transaction = await prisma.$transaction(async () => {
		const user = await prisma.user.create({
			data: {
				userId: uuidv4(),
                email: data.email,
                name: data.name,
                password: await hashedContent(data.password),
                role: data.role,
                identityNumber: data.identityNumber,
			},
			select: userSelect,
		});

        if(data.role === 'Teacher') {
            await prisma.teacher.create({
                data: {
                    userId: user.id
                }
            });
        } else if(data.role === 'Student') {
            await prisma.student.create({
                data: {
                    userId: user.id
                }
            });
        }

        await prisma.notification.create({
            data: {
                type: 'registration',
                content: `Akun baru atas nama ${user.name} telah mendaftar ke sistem`,
                transactionId: user.id
            }
        })

		return user;
	});

    return {
        userId: transaction.userId,
        email: transaction.email,
        name: transaction.name,
        accountType: transaction.role === 'Teacher' ? 'Dosen' : (transaction.role === 'Student' ? 'Mahasiswa' : 'Guest')
    };
};

export const loginService = async (data: LoginReq): Promise<any> => {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new CustomError("Email atau password salah", 404);
    }

    const isPasswordValid = await hashedVerification(data.password, user.password);
    if (!isPasswordValid) {
        throw new CustomError("Email atau password salah", 404);
    }

    if(user.status === 'InActive'){
        throw new CustomError("Akun anda tidak aktif, silahkan hubungi admin", 403);
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.authToken.create({
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    })

    return {
        accessToken,
        refreshToken,
        role: user.role
    };
}

export const refreshTokenService = async (token: string): Promise<any> => {
    const payload = verifyToken(token, "refresh");

    const getToken = await prisma.authToken.findFirst({
        where: {
            refreshToken: token
        }
    })

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
    });

    if (!user || !getToken) {
        throw new CustomError("Invalid refresh token", 403);
    }

    const payloadToken = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const accessToken = generateAccessToken(payloadToken);
    const refreshToken = generateRefreshToken(payloadToken);
    
    await prisma.authToken.update({
        where: {
            id: getToken.id
        },
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    })

    return {
        accessToken,
        refreshToken
    };
};

export const forgotPasswordService = async (email: string): Promise<any> => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
    });

    if (!user) {
        throw new CustomError(`Pengguna dengan email ${email} tidak ditemukan`, 404);
    }

    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 3600 * 1000);

    await prisma.user.update({
        where: { email },
        data: {
            resetPasswordToken: resetToken,
            resetTokenExpires: resetTokenExpires,
        },
    });

    const resetUrl = `${process.env.PERPUSTAKAAN_UNSURYA_FRONTEND_URL}/auth/reset-password?e=${email}&t=${resetToken}`;
    await sendEmail(
        email,
        "Password Reset Request",
        `
            <div>
                You requested a password reset. Click here to reset your password: <br /><br />
                ${resetUrl}
            </div>
        `
    );
    
    return true;
};

export const resetPasswordService = async (data: ResetReq): Promise<any> => {
    const user = await prisma.user.findFirst({
        where: {
            email: data.email,
            resetPasswordToken: data.token,
            resetTokenExpires: { gte: new Date() }
        },
    });

    if (!user) {
        throw new CustomError(`Email dan token yang anda masukkan tidak sesuai atau token sudah kadaluarsa`, 400);
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: await hashedContent(data.new_password),
            resetPasswordToken: null,
            resetTokenExpires: null,
        }
    });
    
    return true;
};

export const logoutService = async (token: string): Promise<any> => {
    const decoded = verifyToken(token, "access");

    const getToken = await prisma.authToken.findFirst({
        where: {
            accessToken: token
        }
    })

    if(!getToken) {
        throw new CustomError("Unauthorized", 403);
    }
    
    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
    });

    if (!user) {
        throw new CustomError("User tidak ditemukan atau token tidak valid", 404);
    }

    await prisma.authToken.delete({
        where: {
            id: getToken.id
        }
    })

    return true;
};