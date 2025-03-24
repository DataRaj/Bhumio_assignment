import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GoogleService } from './google/google.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly googleService: GoogleService,
  ) {}

  @Get('drive/:fileId')
  async fetchDriveFile(@Param('fileId') fileId: string): Promise<any> {
    return this.googleService.fetchFile(fileId);
  }

  @Get('sheets/:sheetId')
  async fetchSheetData(@Param('sheetId') sheetId: string): Promise<any> {
    return this.googleService.retrieveSheetData(sheetId);
  }

  @Post('sheets/:sheetId')
  async addSheetData(@Body() data: any, @Param('sheetId') sheetId: string): Promise<any> {
    return this.googleService.addSheetData(sheetId, data);
  }

  @Patch('sheets/:sheetId')
  async updateSheetData(@Body() data: any, @Param('sheetId') sheetId: string): Promise<any> {
    return this.googleService.modifySheetData(sheetId, data);
  }

  @Get('sheets/:sheetId/debug')
  async debugSheetData(@Param('sheetId') sheetId: string): Promise<any> {
    const data = await this.googleService.retrieveSheetData(sheetId);
    return { data, patientIds: data.map(item => item.patientId) };
}
}