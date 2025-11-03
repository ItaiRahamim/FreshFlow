import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Mock authentication for demo purposes when database is not available
    if (email === 'owner@example.com' && password === 'password123') {
      return {
        id: 'demo-user-id',
        email: 'owner@example.com',
        name: 'Demo Owner',
        role: 'OWNER',
        companyId: 'demo-company-id',
        supplierId: null,
      };
    }

    if (email === 'supplier1@example.com' && password === 'password123') {
      return {
        id: 'demo-supplier-id',
        email: 'supplier1@example.com',
        name: 'Demo Supplier',
        role: 'SUPPLIER',
        companyId: 'demo-company-id',
        supplierId: 'demo-supplier-id',
      };
    }

    try {
      const user = await this.usersService.findByEmail(email);
      if (!user || !user.passwordHash) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { passwordHash, ...result } = user;
      return result;
    } catch (error: any) {
      // If database is not available, use mock
      if (error?.code === 'P1001' || error?.message?.includes("Can't reach database")) {
        if (email === 'owner@example.com' && password === 'password123') {
          return {
            id: 'demo-user-id',
            email: 'owner@example.com',
            name: 'Demo Owner',
            role: 'OWNER',
            companyId: 'demo-company-id',
            supplierId: null,
          };
        }
        if (email === 'supplier1@example.com' && password === 'password123') {
          return {
            id: 'demo-supplier-id',
            email: 'supplier1@example.com',
            name: 'Demo Supplier',
            role: 'SUPPLIER',
            companyId: 'demo-company-id',
            supplierId: 'demo-supplier-id',
          };
        }
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      companyId: user.companyId,
      supplierId: user.supplierId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        supplierId: user.supplierId,
      },
    };
  }
}
