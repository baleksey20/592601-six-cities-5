import { PinoLogger } from './shared/logger/index.js';
import { RestApplication } from './rest/index.js';

async function bootstrap() {
  const logger = new PinoLogger();

  const application = new RestApplication(logger);
  await application.init();
}

bootstrap();