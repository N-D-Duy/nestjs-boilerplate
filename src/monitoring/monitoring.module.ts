import { Module } from '@nestjs/common';
import checkOverload from './overload-checker';

@Module({})
export class MonitoringModule {
  static register() {
    checkOverload();
  }
}
