import { WatcherEventResult } from "@main/library/library-scanning.service";
import _ from "lodash";

export function mergeWatcherResult(left: WatcherEventResult, right: WatcherEventResult): WatcherEventResult {
    return _.mergeWith(left, right, (leftValue, rightValue) => {
        if (_.isArray(leftValue) && _.isArray(rightValue)) {
            return _.uniq(leftValue.concat(rightValue));
        }
    });
}
