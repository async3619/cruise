import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArtistService } from "@main/artist/artist.service";
import { ArtistResolver } from "@main/artist/artist.resolver";

import { Artist } from "@main/artist/models/artist.model";

@Module({
    imports: [TypeOrmModule.forFeature([Artist])],
    providers: [ArtistService, ArtistResolver],
    exports: [ArtistService],
})
export class ArtistModule {}
