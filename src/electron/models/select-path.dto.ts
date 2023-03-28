import { Field, InputType } from "@nestjs/graphql";

import { SelectPathFilterInput } from "@main/electron/models/select-path-filter.dto";

import type { Nullable } from "@common/types";

@InputType()
export class SelectPathInput {
    @Field(() => Boolean, { nullable: true })
    public directory: Nullable<boolean>;

    @Field(() => Boolean, { nullable: true })
    public multiple: Nullable<boolean>;

    @Field(() => [SelectPathFilterInput], { nullable: true })
    public filters: Nullable<SelectPathFilterInput[]>;
}
