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
import { RequestTokenService } from "./RequestTokenService";
import {
	HTTP_CLIENT_CONFIGS,
	HttpClientConfigMap,
	HttpServiceFactory,
} from "./HttpServiceFactory";
import { SL_API_URL } from "@/constants/SL_API_DOMAIN";

const httpClientConfigs: HttpClientConfigMap = {
	slApi: {
		baseURL: SL_API_URL,
		timeout: 10_000,
		headers: {
			"Content-Type": "application/json",
		},
	},
	ynmApi: {
		baseURL: process.env.YNM_API_URL || "http://api-testing.ynm.local",
		timeout: 10_000,
		headers: {
			"Content-Type": "application/json",
		},
	},
};

container.registerInstance(HTTP_CLIENT_CONFIGS, httpClientConfigs);

// Register services as singletons
container.registerSingleton(AuthService);
container.registerSingleton(UserService);
container.registerSingleton(JwtService);
container.registerSingleton(LoginService);
container.registerSingleton(PkceService);
container.registerSingleton(RedisService);
container.registerSingleton(SsoService);
container.registerSingleton(HttpServiceFactory);
container.registerSingleton(RequestTokenService);

export { container };
