import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token) {
            throw new UnauthorizedException('Siz tizimga kirmagansiz');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            request['user'] = payload;
            return true;
        } catch {
            throw new UnauthorizedException('Siz tizimga kirmagansiz');
        }
    }

    private extractTokenFromHeader(request: any): string | null {
        const authHeader = request.headers['authorization'];
        if (!authHeader) return null;

        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) return null;

        return token;
    }
}