import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';
import { CreateIEPDto } from './dto/create-iep.dto';
import { UpdateIEPDto } from './dto/update-iep.dto';
import { IEP } from './entities/iep.entity';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('compliance')
@Controller('compliance/ieps')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new IEP' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'IEP has been successfully created.',
    type: IEP,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async create(@Body() createIEPDto: CreateIEPDto): Promise<any> {
    return this.complianceService.create(createIEPDto);
  }

  @Get()
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all IEPs with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all IEPs.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findAll(@Query() paginationDto: PaginationDto): Promise<any> {
    return this.complianceService.findAll(paginationDto.page, paginationDto.limit);
  }

  @Get(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an IEP by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the IEP.',
    type: IEP,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'IEP not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.complianceService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an IEP' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'IEP has been successfully updated.',
    type: IEP,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'IEP not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateIEPDto: UpdateIEPDto,
  ): Promise<any> {
    return this.complianceService.update(id, updateIEPDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an IEP (Admin only)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'IEP has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'IEP not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.complianceService.remove(id);
  }
}
