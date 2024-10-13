import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { supabase } from '../supabase.client';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';
import { Multer } from 'multer';

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const { originalname, buffer } = file;
      const fileExt = originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('modi-bucket')
        .upload(`images/${fileName}`, buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: publicData } = supabase.storage
        .from('modi-bucket')
        .getPublicUrl(`images/${fileName}`);

      return { url: publicData.publicUrl };
    } catch (error) {
      return { error: error.message };
    }
  }
}
