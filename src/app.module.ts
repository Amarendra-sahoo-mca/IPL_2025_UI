import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TeamModule } from './modules/teams/teams.module';
import { playersModule } from './modules/players/players.module';
<<<<<<< HEAD

=======
>>>>>>> 54cd900 (players import api creation)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads", // Default or fallback file
    }), 
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    EventEmitterModule.forRoot(),
    TeamModule,
    playersModule
<<<<<<< HEAD

=======
>>>>>>> 54cd900 (players import api creation)

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
