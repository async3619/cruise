import { Resolver } from "type-graphql";
import { Service } from "typedi";

import ArtistService from "@main/artist/artist.service";

import { Artist } from "@main/artist/models/artist.model";

@Service()
@Resolver(() => Artist)
export default class ArtistResolver {
    public constructor(private readonly artistService: ArtistService) {}
}
