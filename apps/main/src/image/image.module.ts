import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ImageService } from "@image/image.service";
import { Image } from "@image/models/image.model";

@Module({
    imports: [TypeOrmModule.forFeature([Image])],
    providers: [ImageService],
    exports: [ImageService],
})
export class ImageModule {}
