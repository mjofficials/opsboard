import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        email: string;
        name: string;
        id: string;
        status: string;
        role: string;
        organization_id: string | null;
        created_at: Date;
        updated_at: Date;
    }>;
    login(loginDto: LoginDto, response: Response): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
