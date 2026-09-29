import { ErroDeDominio } from '../errors/ErroDeDominio.js';
import type { RegisterUserInput } from '../schemas/userSchema.js';
import { 
    findUserByEmail,
    createUserWithCart,
    type PublicUser,
} from '../repositories/userRepository.js';
import { hashPassword } from './passwordService.js';
import { Prisma } from '@prisma/client';

type RegisterUserDependencies = {
    findUserByEmail: typeof findUserByEmail;
    createUserWithCart: typeof createUserWithCart;
    hashPassword: typeof hashPassword;
};

const defaultDependencies: RegisterUserDependencies = {
    findUserByEmail,
    createUserWithCart,
    hashPassword,
};

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function uniqueEmailConflict(error: unknown): boolean {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
    );
}

export async function registerUser(
    input: RegisterUserInput,
    deps: RegisterUserDependencies = defaultDependencies
): Promise<PublicUser> {
    const email = normalizeEmail(input.email);

    const existing = await deps.findUserByEmail(email);
    if (existing) {
        throw new ErroDeDominio('Email já cadastrado.', 409);
    }

    const passwordHash = await deps.hashPassword(input.senha);

    try {
        return await deps.createUserWithCart({
            nome: input.nome.trim(),
            email,
            senhaHash: passwordHash,
        });
    } catch (error) {
        if (uniqueEmailConflict(error)) {
            throw new ErroDeDominio('Email já cadastrado.', 409);
        }
        throw error;
    }
}

