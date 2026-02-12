/**
 * Container bootstrap file - must be imported before any service usage
 * Initialize reflect-metadata and configure DI container
 */

import "reflect-metadata";
import { container } from "tsyringe";
import { AuthService } from "./AuthService";
import { UserService } from "./UserService";
import { JwtService } from "./JwtService";
import { LoginService } from "./LoginService";
import { PkceService } from "./PkceService";
import { RedisService } from "./RedisService";
import { SsoService } from "./SsoService";

// Register services as singletons
container.registerSingleton(AuthService);
container.registerSingleton(UserService);
container.registerSingleton(JwtService);
container.registerSingleton(LoginService);
container.registerSingleton(PkceService);
container.registerSingleton(RedisService);
container.registerSingleton(SsoService);

export { container };
