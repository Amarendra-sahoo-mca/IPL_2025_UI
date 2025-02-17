import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { glob } from "glob";
import { join } from "path";
import {  playersEntity } from "src/entities/player.entity";
import { TeamEntity } from "src/entities/team.entity";
import { TeamLogoEntity } from "src/entities/teamLogo.entity";
import { promisify } from "util";
const globPromise = promisify(glob);


export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => {
        /* // Define the path pattern for entities
        const entitiesPath = join(__dirname, '../entities/*.entity.{ts,js}');
        
        // Get all entity file paths
        const entityPaths: any = await globPromise(entitiesPath, { nodir: true });
        // Dynamically import entity modules
        const entities = entityPaths.map((path) => {
            const entityModule = require(path);
            return entityModule.default || entityModule; // Handle both ES and CommonJS modules
        }); */

        return {
            type: "mysql",
            host: process.env.DB_HOST || config.get<string>('DB_HOST'),
            port:
                parseInt(process.env.DB_PORT, 10) ||
                parseInt(config.get<string>('DB_PORT'), 10),
            username: process.env.DB_USERNAME || config.get<string>('DB_USERNAME'),
            database: process.env.DB_NAME || config.get<string>('DB_NAME'),
            password: process.env.DB_PASSWORD || config.get<string>('DB_PASSWORD'),
            entities: [
                playersEntity,TeamEntity,TeamLogoEntity
            ],
            extra: {
                charset: 'utf8mb4_unicode_ci',
            },
            synchronize: true,
        }
    }
};