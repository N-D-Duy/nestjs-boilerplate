import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './configs/config.mongo';
import { MonitoringModule } from './monitoring/monitoring.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot(config.db.uri),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: 'APP_GUARD',
    //   useClass: JwtAuthGuard
    // }
  ]
})
export class AppModule {
  constructor(){
    MonitoringModule.register();
  }
}
