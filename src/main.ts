import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './configs/config.mongo';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
import { setupSwagger } from './common/decorators/swagger/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // use morgan to log HTTP requests
  app.use(morgan('combined'));

  // use helmet to secure the app by setting various HTTP headers
  app.use(helmet());

  // use cors to allow all origins
  app.use(cors());

  // use compression middleware
  app.use(compression());

  //set global prefix
  app.setGlobalPrefix('v1/api');


  //set up swagger
  if(process.env.NODE_ENV !== 'production'){
    setupSwagger(app, '1.0');
  }
  
  const logger = new Logger();

  //use pipe for validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(config.app.port).then(() => {
    logger.log(`Server running on http://localhost:${config.app.port}`);
  });

}
bootstrap();
