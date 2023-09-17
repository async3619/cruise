import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ArtistService } from "@artist/artist.service";
import { ArtistResolver } from "@artist/artist.resolver";

import { Artist } from "@artist/models/artist.model";

@Module({
    imports: [TypeOrmModule.forFeature([Artist])],
    providers: [ArtistService, ArtistResolver],
    exports: [ArtistService],
})
export class ArtistModule {}
