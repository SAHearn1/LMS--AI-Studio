import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './modules/auth/decorators/public.decorator';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  healthCheck(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }
}
