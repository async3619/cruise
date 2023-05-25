import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MusicModule } from "@main/music/music.module";

import { PlaylistService } from "@main/playlist/playlist.service";
import { PlaylistResolver } from "@main/playlist/playlist.resolver";

import { PlaylistRelation } from "@main/playlist/models/playlist-relation.model";
import { Playlist } from "@main/playlist/models/playlist.model";

@Module({
    imports: [TypeOrmModule.forFeature([Playlist, PlaylistRelation]), MusicModule],
    providers: [PlaylistService, PlaylistResolver],
})
export class PlaylistModule {}
