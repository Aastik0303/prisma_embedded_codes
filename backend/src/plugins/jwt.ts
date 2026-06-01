import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as jose from 'jose';

export interface JwtPayload extends jose.JWTPayload {
  sub: string;
  jti: string;
  role: string;
  email: string;
}

export class JwtService {
  private privateKey!: jose.KeyLike;
  private publicKey!: jose.KeyLike;
  private privateKeyLoaded = false;

  constructor(
    private privateKeyBase64: string,
    private publicKeyBase64: string,
    private accessExpiry: number
  ) {}

  async initialize() {
    if (this.privateKeyLoaded) return;

    try {
      const privateKeyPem = Buffer.from(this.privateKeyBase64, 'base64').toString('utf8');
      const publicKeyPem = Buffer.from(this.publicKeyBase64, 'base64').toString('utf8');

      this.privateKey = await jose.importPKCS8(privateKeyPem, 'ES256');
      this.publicKey = await jose.importSPKI(publicKeyPem, 'ES256');
      this.privateKeyLoaded = true;
    } catch (error: any) {
      throw new Error(`Failed to initialize ES256 keys for JWT service: ${error.message}`);
    }
  }

  async signAccessToken(userId: string, email: string, role: string, jti: string): Promise<string> {
    await this.initialize();
    
    return await new jose.SignJWT({ role, email })
      .setProtectedHeader({ alg: 'ES256', typ: 'JWT' })
      .setSubject(userId)
      .setJti(jti)
      .setIssuedAt()
      .setIssuer('prisma-embedded-codes')
      .setAudience('prisma-client')
      .setExpirationTime(`${this.accessExpiry}s`)
      .sign(this.privateKey);
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    await this.initialize();

    const { payload } = await jose.jwtVerify(token, this.publicKey, {
      issuer: 'prisma-embedded-codes',
      audience: 'prisma-client',
      algorithms: ['ES256']
    });

    return payload as JwtPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    jwtService: JwtService;
  }
}

const jwtPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const jwtService = new JwtService(
    fastify.config.JWT_PRIVATE_KEY_BASE64,
    fastify.config.JWT_PUBLIC_KEY_BASE64,
    fastify.config.JWT_ACCESS_EXPIRY
  );

  // Initialize early to verify keys are valid on boot
  await jwtService.initialize();

  fastify.decorate('jwtService', jwtService);
};

export default jwtPlugin;
export { jwtPlugin };
