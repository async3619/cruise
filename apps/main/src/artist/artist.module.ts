import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArtistService } from "@artist/artist.service";

import { Artist } from "@artist/models/artist.model";

@Module({
    imports: [TypeOrmModule.forFeature([Artist])],
    providers: [ArtistService],
    exports: [ArtistService],
})
export class ArtistModule {}
