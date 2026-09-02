import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    HttpModule,
    CacheModule.register({ isGlobal: true, ttl: 300000 }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useFactory: (http, config, cache) => new AppService(http, config, cache),
      inject: [HttpService, ConfigService, CACHE_MANAGER],
    },
  ],
})
export class AppModule {}
