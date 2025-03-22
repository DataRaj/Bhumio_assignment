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

  @Get('sheets/:url')
  async fetchSheetData(@Param('url') url: string): Promise<any> {
    const sheetId = this.googleService.extractSheetId(url);
    return this.googleService.retrieveSheetData(sheetId);
  }

  @Post('sheets/:url')
  async addSheetData(@Body() data: any, @Param('url') url: string): Promise<any> {
    const sheetId = this.googleService.extractSheetId(url);
    return this.googleService.addSheetData(sheetId, data);
  }

  @Patch('sheets/:url')
  async updateSheetData(@Body() data: any, @Param('url') url: string): Promise<any> {
    const sheetId = this.googleService.extractSheetId(url);
    return this.googleService.modifySheetData(sheetId, data);
  }
}
