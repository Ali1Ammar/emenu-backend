import { FileInterceptor } from '@nestjs/platform-express';
import { promises } from 'fs';

export class ImgHelper {
  static imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  };

  static async saveMealImg(
    file: Express.Multer.File,
    restId: number,
    mealId: number,
  ) : Promise<string> {
    const fileExt = file.filename.split('.')[-1];
    const path = `./uploaded/${restId}/${mealId}.${fileExt}`;
    await promises.writeFile(path, file.buffer);
    return path;
  }

  static fileInterceptor() {
    return FileInterceptor('img', {
      fileFilter: ImgHelper.imageFileFilter,
    });
  }
}
