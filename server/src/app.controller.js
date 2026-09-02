import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

export class AppController {
  constructor(appService) {
    this.appService = appService;
  }

  getHello() {
    return this.appService.getHello();
  }

  getCities() {
    return this.appService.getCities();
  }
}

Controller()(AppController);
Get()(AppController.prototype, 'getHello', Object.getOwnPropertyDescriptor(AppController.prototype, 'getHello'));
Get('api/cities')(AppController.prototype, 'getCities', Object.getOwnPropertyDescriptor(AppController.prototype, 'getCities'));
Reflect.defineMetadata('design:paramtypes', [AppService], AppController);
