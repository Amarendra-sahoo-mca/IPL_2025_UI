import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  app.useGlobalPipes(new ValidationPipe());
  /* Environment Config || dotenv */
  const configService: ConfigService = app.get(ConfigService);

const config = new DocumentBuilder()
.setTitle('IPL 2025 API')
.setDescription('IPL 2025 API description')
.setVersion('1.0')
.addTag('IPL_2025')
.setContact("AM", "amar_portfolio.com", "sahooamarendra241@gmail.com")
.addBearerAuth(
  {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    name: "JWT",
    description: "Enter JWT token",
    in: "header"
  },
  "JWT-auth" // This name here is important for matching up with @ApiBearerAuth() in your controller!
)
// .addServer("/v1")
.build();
const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  const port = configService.get<string>("PORT");

  await app.listen(port);
  app.enableCors();


  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Documentation is running on: http://localhost:${port}/documentation`);
}
bootstrap();
