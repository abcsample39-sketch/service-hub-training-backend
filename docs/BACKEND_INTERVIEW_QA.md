# Backend Interview Questions & Answers

A comprehensive guide for interview preparation covering NestJS, Authentication, Database, WebSockets, and general backend concepts.

---

## Table of Contents
1. [NestJS Framework (Q1-10)](#nestjs-framework)
2. [Authentication & Security (Q11-20)](#authentication--security)
3. [Database & Drizzle ORM (Q21-30)](#database--drizzle-orm)
4. [WebSockets & Real-time Chat (Q31-38)](#websockets--real-time-chat)
5. [API Design & REST (Q39-44)](#api-design--rest)
6. [General Backend Concepts (Q45-50)](#general-backend-concepts)
7. [Bonus Questions (Q51-60)](#bonus-questions)
8. [Answers](#answers)
9. [Bonus Tips](#bonus-tips)

---

## NestJS Framework

### Q1. What is NestJS and why did you choose it over Express.js?

### Q2. Explain the modular architecture in NestJS. What is a `@Module()` and how does it organize your code?

### Q3. What is dependency injection in NestJS? Show an example from your `ChatService`.

### Q4. What is the difference between `@Controller()` and `@Injectable()` decorators?

### Q5. Explain the purpose of `providers` array in a module. Why is `ChatGateway` listed there?

### Q6. What does `ConfigModule.forRoot({ isGlobal: true })` do in your `AppModule`?

### Q7. How do Guards work in NestJS? Explain how `RolesGuard` protects endpoints.

### Q8. What is a Pipe in NestJS? How does your `ZodValidationPipe` work?

### Q9. What is an Exception Filter? How does your `ZodExceptionFilter` handle validation errors?

### Q10. Explain the NestJS request lifecycle: Middleware → Guards → Interceptors → Pipes → Handler → Exception Filters.

---

## Authentication & Security

### Q11. What is JWT and why did you use it for authentication?

### Q12. Explain the JWT payload structure in your app: `{ sub, email, role }`. What does `sub` mean?

### Q13. How does `passport-jwt` strategy work? Walk through your `JwtStrategy.validate()` method.

### Q14. Why do you verify the user exists in the database inside `JwtStrategy.validate()`?

### Q15. How do you hash passwords? What is bcrypt and why use salt rounds of 10?

### Q16. What is the difference between `AuthGuard('jwt')` and your custom `RolesGuard`?

### Q17. How does role-based access control (RBAC) work using `@Roles()` decorator?

### Q18. Explain how `WsJwtGuard` authenticates WebSocket connections differently from HTTP.

### Q19. Where should the JWT `secret` be stored in production? Why not hardcode it?

### Q20. What security risks exist if you return the password hash in API responses?

---

## Database & Drizzle ORM

### Q21. What is Drizzle ORM? How is it different from Prisma or TypeORM?

### Q22. Explain your database schema. What are the main entities and their relationships?

### Q23. What is a `pgEnum` and why did you use it for `user_role`, `booking_status`, etc.?

### Q24. How do foreign key relationships work? Explain `.references(() => users.id)`.

### Q25. What is the difference between `db.select()` and `db.query.tableName.findMany()`?

### Q26. What does `.returning()` do after an `insert()` statement?

### Q27. Explain the Drizzle `relations()` function. Why define `usersRelations` separately?

### Q28. What is the purpose of `uuid().defaultRandom().primaryKey()` vs auto-increment?

### Q29. How do you run database migrations with Drizzle? What do `db:generate` and `db:push` do?

### Q30. What is the N+1 query problem? How would you solve it with Drizzle's relational queries?

---

## WebSockets & Real-time Chat

### Q31. What is Socket.IO? How is it different from raw WebSockets?

### Q32. Explain the `@WebSocketGateway()` decorator and its CORS configuration.

### Q33. What is a "room" in Socket.IO? How does `client.join(bookingId)` work?

### Q34. Walk through the message flow: client sends → server saves → server broadcasts.

### Q35. What is `@SubscribeMessage()` and how does it map events to handler methods?

### Q36. How does `@WebSocketServer()` give access to the `Server` instance?

### Q37. Why do you persist chat messages to the database instead of keeping them in-memory?

### Q38. How would you handle disconnect events and reconnection in your chat system?

---

## API Design & REST

### Q39. What HTTP methods are used for CRUD operations? Which does your app use?

### Q40. What is CORS? Why did you enable it in `main.ts` for `localhost:3000`?

### Q41. How do you validate request bodies? Explain how Zod works with your DTOs.

### Q42. What HTTP status codes does your API return? (200, 201, 400, 401, 403, 404, 409, etc.)

### Q43. How would you version your API endpoints (e.g., `/api/v1/...`)?

### Q44. What is the difference between `@Param()`, `@Query()`, and `@Body()` decorators?

---

## General Backend Concepts

### Q45. Explain the difference between synchronous and asynchronous code. Why is `async/await` important?

### Q46. What is middleware in web applications? Give an example of where you'd use it.

### Q47. What would happen if your database connection fails? How would you handle it?

### Q48. How do you manage environment variables in your project? What is `.env`?

### Q49. What testing tools are configured in your project? What is Jest?

### Q50. If your API had 1000 concurrent users, what bottlenecks might occur and how would you scale?

---

## Bonus Questions

### Q51. What is the difference between stateless and stateful authentication?

### Q52. How does connection pooling work with PostgreSQL?

### Q53. What is the purpose of `reflect-metadata` package in your project?

### Q54. How would you implement rate limiting to prevent API abuse?

### Q55. What is Firebase Admin SDK used for in your backend?

### Q56. Explain the difference between `forRoot()` and `forRootAsync()` in NestJS.

### Q57. How would you implement soft deletes vs hard deletes in your schema?

### Q58. What are database transactions and when would you use them?

### Q59. How does your app handle concurrent booking requests for the same time slot?

### Q60. What logging strategy would you implement for debugging production issues?

---

# Answers

## NestJS Framework Answers

### A1. What is NestJS and why did you choose it over Express.js?
NestJS is a progressive Node.js framework built with TypeScript. It provides:
- **Modular architecture**: Organizes code into modules for better maintainability
- **Dependency Injection**: Built-in DI container for loose coupling
- **TypeScript-first**: Full TypeScript support with decorators
- **Express under the hood**: Compatible with Express middleware
- **Rich ecosystem**: Built-in support for WebSockets, GraphQL, microservices

I chose it over Express because Express is minimalist and requires manual setup for structure, DI, and validation, while NestJS provides these out-of-the-box with enterprise-grade patterns.

### A2. Explain the modular architecture in NestJS
A `@Module()` decorator defines a module that groups related functionality:
```typescript
@Module({
  imports: [DrizzleModule, AuthModule],  // Other modules this module depends on
  controllers: [ChatController],          // Request handlers
  providers: [ChatGateway, ChatService],  // Services/business logic
  exports: [ChatService],                 // What other modules can use
})
export class ChatModule {}
```
This promotes separation of concerns—each module handles one domain (auth, chat, bookings).

### A3. What is dependency injection in NestJS?
Dependency Injection (DI) is a design pattern where dependencies are "injected" rather than instantiated directly:
```typescript
@Injectable()
export class ChatService {
  constructor(@Inject('DRIZZLE') private db: DrizzleDB) {}
  // db is injected automatically by NestJS
}
```
Benefits:
- Loose coupling between components
- Easier testing (mock dependencies)
- Single source of truth for instances

### A4. Difference between `@Controller()` and `@Injectable()`
- `@Controller()`: Marks a class as a request handler. Handles HTTP routes.
  ```typescript
  @Controller('chat')  // Routes at /chat
  export class ChatController {}
  ```
- `@Injectable()`: Marks a class as a provider that can be injected. Used for services, repositories, guards, etc.
  ```typescript
  @Injectable()
  export class ChatService {}
  ```

### A5. Purpose of `providers` array
The `providers` array registers classes that can be injected within that module:
```typescript
providers: [ChatGateway, ChatService]
```
`ChatGateway` is listed because it's a WebSocket gateway that needs to be instantiated by NestJS and may have dependencies (like `ChatService`) injected into it.

### A6. What does `ConfigModule.forRoot({ isGlobal: true })` do?
- `ConfigModule.forRoot()`: Loads environment variables from `.env` file
- `isGlobal: true`: Makes the ConfigService available throughout the app without importing ConfigModule in each module

### A7. How do Guards work in NestJS?
Guards determine if a request should be handled:
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [...]);
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user?.role === role);
  }
}
```
Returns `true` to allow, `false` to deny (403 Forbidden).

### A8. What is a Pipe in NestJS?
Pipes transform and validate input data:
```typescript
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Validate with Zod schema
    return schema.parse(value);  // Throws if invalid
  }
}
```
Applied globally in `main.ts`: `app.useGlobalPipes(new ZodValidationPipe())`

### A9. What is an Exception Filter?
Exception Filters catch and format errors:
```typescript
@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    response.status(400).json({
      statusCode: 400,
      message: 'Validation failed',
      errors: exception.issues,
    });
  }
}
```
This catches Zod validation errors and returns a user-friendly 400 response.

### A10. NestJS request lifecycle
1. **Middleware**: Raw request processing (logging, body parsing)
2. **Guards**: Authentication/authorization checks
3. **Interceptors (before)**: Transform request, logging
4. **Pipes**: Validation and transformation
5. **Handler**: Your controller method executes
6. **Interceptors (after)**: Transform response
7. **Exception Filters**: Catch any errors

---

## Authentication & Security Answers

### A11. What is JWT and why use it?
JWT (JSON Web Token) is a compact, self-contained token for securely transmitting information:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
Structure: `header.payload.signature`

Why use it:
- **Stateless**: Server doesn't store sessions
- **Scalable**: Works across multiple servers
- **Self-contained**: Contains user info in payload

### A12. JWT payload structure `{ sub, email, role }`
```typescript
const payload = { sub: user.id, email: user.email, role: user.role };
```
- `sub` (subject): Standard JWT claim for the user ID
- `email`: User's email for identification
- `role`: Used for authorization (Customer/Provider/Admin)

### A13. How passport-jwt strategy works
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Get from "Authorization: Bearer <token>"
      ignoreExpiration: false,  // Reject expired tokens
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Called after JWT is verified
    // payload = decoded token data
    const user = await this.db.select().from(users).where(eq(users.id, payload.sub));
    if (!user) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
```

### A14. Why verify user exists in database?
Even if the JWT is valid, the user might have been:
- Deleted from the database
- Banned or deactivated
- Had their role changed

Checking the database ensures we're acting on current user state.

### A15. How bcrypt hashing works
```typescript
const hashedPassword = await bcrypt.hash(registerDto.password, 10);
```
- **Salt rounds (10)**: Number of iterations for hashing (2^10 = 1024 iterations)
- Higher = more secure but slower
- 10 is a good balance (~100ms)

Verification:
```typescript
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### A16. Difference between `AuthGuard('jwt')` and `RolesGuard`
- `AuthGuard('jwt')`: **Authentication** - Verifies the JWT is valid and user exists
- `RolesGuard`: **Authorization** - Checks if authenticated user has required role

Usage:
```typescript
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('Admin')
@Get('admin-only')
```

### A17. Role-based access control (RBAC) with `@Roles()`
1. Custom decorator sets metadata:
```typescript
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```
2. Guard reads metadata and checks user role:
```typescript
const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [...]);
return requiredRoles.some((role) => user?.role === role);
```

### A18. WsJwtGuard for WebSocket authentication
HTTP sends token in `Authorization` header, but WebSockets use handshake:
```typescript
const token = client.handshake.auth?.token || client.handshake.headers?.authorization;
const payload = await this.jwtService.verifyAsync(cleanToken, { secret });
client.user = payload;  // Attach to socket for later use
```

### A19. JWT secret storage in production
- Store in environment variables (`.env`)
- Use secrets manager (AWS Secrets Manager, HashiCorp Vault)
- Never commit to git
- Use strong, random secrets (256-bit minimum)

### A20. Risks of returning password hash
- Enables offline brute-force attacks
- Attackers can use rainbow tables
- Violates principle of least privilege
- Always exclude: `.returning({ id, name, email })` (no password)

---

## Database & Drizzle ORM Answers

### A21. What is Drizzle ORM?
Drizzle is a TypeScript-first ORM:
- **Type-safe**: SQL queries are fully typed
- **SQL-like syntax**: Feels like writing SQL
- **Lightweight**: No heavy runtime, compiles to simple queries
- **Schema-first**: Define schema in TypeScript

vs Prisma: Prisma has its own schema language, heavier runtime
vs TypeORM: TypeORM uses decorators, less type-safe

### A22. Database schema entities
Main entities:
- **users**: Customers, Providers, Admins
- **providerProfiles**: Extended info for service providers
- **services**: Services offered by providers
- **bookings**: Customer bookings with providers
- **chatMessages**: Real-time chat per booking
- **serviceCategories**: Categories for services

Relationships: User → ProviderProfile (1:1), User → Bookings (1:many), Booking → ChatMessages (1:many)

### A23. What is `pgEnum`?
PostgreSQL enum type for constrained values:
```typescript
export const userRoleEnum = pgEnum('user_role', ['Customer', 'Provider', 'Admin']);
```
Benefits:
- Type safety at database level
- Prevents invalid values
- Self-documenting

### A24. Foreign key relationships
```typescript
customerId: uuid('customer_id').references(() => users.id).notNull()
```
- Creates FK constraint in PostgreSQL
- Arrow function prevents circular reference issues
- `.notNull()` makes it required

### A25. `db.select()` vs `db.query.tableName.findMany()`
```typescript
// SQL builder style - more control
await this.db.select().from(users).where(eq(users.email, email));

// Relational query style - includes relations
await this.db.query.users.findMany({
  with: { profile: true, bookings: true }
});
```

### A26. What does `.returning()` do?
Returns inserted/updated rows from the database:
```typescript
const [newUser] = await this.db.insert(users).values({...}).returning();
// newUser contains the complete row with generated id, timestamps, etc.
```
Without `.returning()`, you'd need a separate SELECT query.

### A27. Drizzle `relations()` function
Defines relationships for relational queries:
```typescript
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(providerProfiles, { fields: [users.id], references: [providerProfiles.userId] }),
  bookingsAsCustomer: many(bookings, { relationName: 'customerBookings' }),
}));
```
Defined separately because tables can't reference each other circularly during definition.

### A28. UUID vs auto-increment
```typescript
id: uuid('id').defaultRandom().primaryKey()
```
UUID benefits:
- Globally unique across systems
- Can generate client-side
- Harder to guess (security)
- Good for distributed systems

Auto-increment cons:
- Reveals record count
- Conflicts in distributed DBs

### A29. Drizzle migrations
```bash
npm run db:generate  # Creates migration files from schema changes
npm run db:migrate   # Applies migrations to database
npm run db:push      # Pushes schema directly (dev only, no migration files)
```

### A30. N+1 query problem
Problem: Fetching list then querying each item's relations
```typescript
// N+1: 1 query for users + N queries for profiles
const users = await db.select().from(users);
for (user of users) {
  const profile = await db.select().from(profiles).where(eq(profiles.userId, user.id));
}
```
Solution with Drizzle:
```typescript
await db.query.users.findMany({ with: { profile: true } });  // Single query with JOIN
```

---

## WebSockets & Real-time Chat Answers

### A31. Socket.IO vs raw WebSockets
Socket.IO provides:
- **Fallback transports**: HTTP long-polling if WS fails
- **Automatic reconnection**: Built-in retry logic
- **Rooms/namespaces**: Logical grouping of connections
- **Event-based API**: `emit()` and `on()` for named events
- **Acknowledgements**: Confirm message delivery

Raw WebSockets are lower-level, require manual implementation of these features.

### A32. `@WebSocketGateway()` decorator
```typescript
@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
```
- Creates a WebSocket server
- CORS allows frontend to connect
- `credentials: true` allows cookies/auth headers

### A33. Socket.IO rooms
Rooms are logical channels for broadcasting:
```typescript
client.join(bookingId);  // Client joins room
this.server.to(bookingId).emit('newMessage', message);  // Broadcast to room only
```
Perfect for chat per booking—only participants see messages.

### A34. Message flow
1. Client emits `sendMessage` with `{ bookingId, senderId, message }`
2. Gateway receives via `@SubscribeMessage('sendMessage')`
3. Service saves to database: `this.chatService.saveMessage(...)`
4. Gateway broadcasts to room: `this.server.to(bookingId).emit('newMessage', savedMessage)`
5. All clients in room receive and display message

### A35. `@SubscribeMessage()` decorator
Maps Socket.IO events to methods:
```typescript
@SubscribeMessage('joinRoom')  // Listens for 'joinRoom' event
handleJoinRoom(@MessageBody() bookingId: string, @ConnectedSocket() client: Socket) {
  client.join(bookingId);
}
```

### A36. `@WebSocketServer()` decorator
Injects the Socket.IO server instance:
```typescript
@WebSocketServer()
server: Server;  // Used for broadcasting
```
Allows emitting to specific rooms or all clients.

### A37. Why persist chat to database?
- **Message history**: Users can view past messages
- **Recovery**: Messages survive server restarts
- **Audit trail**: For disputes or support
- **Offline support**: Deliver messages when user reconnects

### A38. Handling disconnect and reconnection
```typescript
@SubscribeMessage('disconnect')
handleDisconnect(client: Socket) {
  console.log(`Client ${client.id} disconnected`);
  // Notify other users, cleanup
}

// On reconnect, client should:
// 1. Re-authenticate
// 2. Re-join rooms
// 3. Fetch missed messages since last seen timestamp
```

---

## API Design & REST Answers

### A39. HTTP methods for CRUD
- **C**reate: `POST /resource`
- **R**ead: `GET /resource` or `GET /resource/:id`
- **U**pdate: `PUT /resource/:id` (full) or `PATCH /resource/:id` (partial)
- **D**elete: `DELETE /resource/:id`

Your app uses all of these for bookings, services, etc.

### A40. What is CORS?
Cross-Origin Resource Sharing - browser security feature:
```typescript
app.enableCors({
  origin: 'http://localhost:3000',  // Only allow frontend origin
  credentials: true,  // Allow cookies
});
```
Without CORS, browsers block requests from different origins.

### A41. Zod validation
```typescript
// DTO with Zod schema
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

// Pipe validates incoming data
export class ZodValidationPipe implements PipeTransform {
  transform(value: any) {
    return RegisterSchema.parse(value);  // Throws ZodError if invalid
  }
}
```

### A42. HTTP status codes
- `200 OK`: Successful GET/PUT/PATCH
- `201 Created`: Successful POST
- `400 Bad Request`: Validation errors (Zod)
- `401 Unauthorized`: Missing/invalid token
- `403 Forbidden`: Valid token but insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `409 Conflict`: Duplicate entry (email exists)

### A43. API versioning
```typescript
app.setGlobalPrefix('api/v1');  // All routes become /api/v1/...
```
Or per-controller: `@Controller('v1/chat')`

### A44. `@Param()`, `@Query()`, `@Body()` decorators
```typescript
@Get(':id')  // /bookings/123?status=pending
async getBooking(
  @Param('id') id: string,     // Path parameter: "123"
  @Query('status') status: string,  // Query string: "pending"
) {}

@Post()
async create(@Body() dto: CreateBookingDto) {}  // Request body
```

---

## General Backend Concepts Answers

### A45. Sync vs Async code
```typescript
// Sync - blocks execution
const data = fs.readFileSync('file.txt');

// Async - non-blocking
const data = await fs.promises.readFile('file.txt');
```
`async/await` is important because:
- Node.js is single-threaded
- Blocking operations freeze the entire server
- Async allows handling thousands of concurrent requests

### A46. What is middleware?
Functions that run before request handlers:
```typescript
// Example: Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();  // Continue to next middleware/handler
});
```
Use cases: Logging, authentication, body parsing, compression

### A47. Handling database connection failures
```typescript
// In DrizzleModule
try {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.connect();  // Test connection
} catch (error) {
  console.error('Database connection failed:', error);
  process.exit(1);  // Fail fast
}
```
Also: Implement retry logic, health checks, connection pooling.

### A48. Environment variables and `.env`
```env
DATABASE_URL=postgres://user:pass@localhost:5432/mydb
JWT_SECRET=supersecretkey
PORT=3001
```
Loaded by `dotenv` package, accessed via `process.env.DATABASE_URL` or `ConfigService.get('DATABASE_URL')`.

### A49. Testing with Jest
Jest is a testing framework:
```typescript
describe('AuthService', () => {
  it('should hash password on register', async () => {
    const result = await authService.register({ email: 'test@test.com', password: 'password' });
    expect(result.user.email).toBe('test@test.com');
  });
});
```
Run with `npm test`

### A50. Scaling for 1000 concurrent users
Bottlenecks:
- **Database connections**: Use connection pooling
- **CPU**: Horizontal scaling with multiple instances + load balancer
- **Memory**: Cache frequently accessed data (Redis)
- **WebSockets**: Use Redis adapter for Socket.IO across instances

---

## Bonus Questions Answers

### A51. Stateless vs stateful authentication
- **Stateful** (sessions): Server stores session data, uses session ID cookie
- **Stateless** (JWT): Server doesn't store anything, token contains all info

JWT is stateless - any server can validate the token without shared state.

### A52. Connection pooling with PostgreSQL
```typescript
const pool = new Pool({
  max: 20,           // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```
Pool reuses connections instead of opening/closing for each query. Reduces latency and database load.

### A53. Purpose of `reflect-metadata`
Enables decorator metadata in TypeScript:
```typescript
@Injectable()  // Stores metadata about constructor params
export class MyService {
  constructor(private otherService: OtherService) {}
}
```
NestJS uses this for dependency injection - it reads constructor param types to inject the right dependencies.

### A54. Rate limiting implementation
```typescript
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot({ ttl: 60, limit: 100 });  // 100 requests per minute
```
Apply with `@UseGuards(ThrottlerGuard)` to prevent abuse.

### A55. Firebase Admin SDK usage
```typescript
@Injectable()
export class FirebaseAdminService {
  private app: admin.app.App;
  
  constructor() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  
  async verifyToken(idToken: string) {
    return await admin.auth().verifyIdToken(idToken);
  }
}
```
Used for: Firebase Auth token verification, push notifications, Firestore access.

### A56. `forRoot()` vs `forRootAsync()`
```typescript
// forRoot - static configuration
JwtModule.forRoot({ secret: 'hardcoded' })

// forRootAsync - dynamic configuration
JwtModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get('JWT_SECRET'),  // Read from env
  }),
})
```
Use `forRootAsync` when config depends on other services.

### A57. Soft deletes vs hard deletes
```typescript
// Soft delete - add column
deletedAt: timestamp('deleted_at'),

// Query excludes deleted
.where(isNull(users.deletedAt))

// Delete action
.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id))
```
Soft deletes preserve data for audit/recovery. Hard deletes permanently remove.

### A58. Database transactions
```typescript
await db.transaction(async (tx) => {
  await tx.insert(bookings).values({...});
  await tx.update(services).set({ bookedCount: sql`booked_count + 1` });
  // If any fails, both are rolled back
});
```
Use when multiple operations must succeed or fail together.

### A59. Handling concurrent booking conflicts
```typescript
// Option 1: Database constraint
bookings.addConstraint(unique(['provider_id', 'date', 'time']))

// Option 2: Transaction with check
await db.transaction(async (tx) => {
  const existing = await tx.select().from(bookings).where(...).for('update');
  if (existing.length) throw new ConflictException('Slot already booked');
  await tx.insert(bookings).values({...});
});
```

### A60. Logging strategy for production
```typescript
// Structured logging with winston/pino
logger.info('Booking created', { 
  bookingId: '123', 
  userId: '456', 
  duration: 45 
});
```
- Use structured JSON logs
- Include request IDs for tracing
- Log levels: error, warn, info, debug
- Send to centralized system (ELK, CloudWatch)

---

# Bonus Tips

## 1. Know Your Code Inside Out
Be ready to explain any file—especially:
- `auth.service.ts` - Registration, login, JWT generation
- `chat.gateway.ts` - WebSocket event handling
- `schema.ts` - All database tables and relations
- `main.ts` - App bootstrap and global config

## 2. Trace a Complete Request Flow
Practice walking through flows like:
> "User logs in" → `AuthController.login()` → `AuthService.login()` → DB query → bcrypt compare → JWT sign → Response

## 3. Know Your Tech Stack
Be able to explain why you chose each:
- **NestJS**: Modular, TypeScript, DI
- **Drizzle**: Type-safe, lightweight ORM
- **PostgreSQL**: Relational, ACID, mature
- **Socket.IO**: Real-time, rooms, fallback
- **JWT + bcrypt**: Stateless auth, secure hashing
- **Zod**: Runtime validation, TypeScript integration

## 4. Understand Tradeoffs
- Why Drizzle over Prisma? (Lighter, SQL-like)
- Why Socket.IO over raw WS? (Reconnection, rooms)
- Why JWT over sessions? (Stateless, scalable)

## 5. Be Ready for "What Would You Improve?"
- Add refresh tokens
- Implement rate limiting
- Add logging and monitoring
- Add database indexes
- Implement caching with Redis

## 6. Security Best Practices
- Never log passwords or tokens
- Always hash passwords
- Use HTTPS in production
- Validate all inputs
- Implement proper error messages (don't leak info)

## 7. Database Understanding
- Explain your indexes and why
- Know how to read query plans
- Understand transactions

## 8. Think About Scale
- Horizontal scaling with load balancers
- Database read replicas
- Caching strategies
- Message queues for async processing

---

**Good luck with your interview! 🚀**
