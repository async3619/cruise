import React from "react";
import { Diff } from "utility-types";

import { PlayerContextValue } from "@player/context";
import usePlayer from "@player/usePlayer";

export interface WithPlayerProps {
    player: PlayerContextValue;
}

const withPlayer = <BaseProps extends WithPlayerProps>(BaseComponent: React.ComponentType<BaseProps>) => {
    type HocProps = Diff<BaseProps, WithPlayerProps>;

    function Hoc({ ...restProps }: HocProps) {
        const player = usePlayer();

        return <BaseComponent {...(restProps as BaseProps)} player={player} />;
    }

    Hoc.displayName = `WithPlayer(${BaseComponent.name})`;
    Hoc.WrappedComponent = BaseComponent;

    return Hoc;
};

export default withPlayer;
